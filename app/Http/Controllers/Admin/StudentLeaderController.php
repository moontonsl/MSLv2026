<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminAuditLog;
use App\Models\Institution;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class StudentLeaderController extends Controller
{
    public const ALLOWED_ROLES = [
        'Student',
        'Student Leader',
        'Regional Admin',
        'Core Admin',
    ];

    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();
        $region = $request->string('region')->toString();
        $tab = $request->string('tab', 'all')->toString();

        $slQuery = $this->studentLeadersQuery();
        $studentQuery = $this->activeStudentsQuery();
        $accountsQuery = $this->allAccountsQuery($tab);

        if ($region !== '') {
            $slQuery->where('region', $region);
            $studentQuery->where('region', $region);
            $accountsQuery->where('region', $region);
        }

        $slUsers = $this->search($slQuery, $search)
            ->latest('updated_at')
            ->paginate(15, ['*'], 'sl_page')
            ->withQueryString();

        $students = $this->search($studentQuery, $search)
            ->latest('created_at')
            ->paginate(15, ['*'], 'student_page')
            ->withQueryString();

        $accounts = $this->search($accountsQuery, $search)
            ->with(['assignedSchools:id,name,acronym,region'])
            ->latest('updated_at')
            ->paginate(15, ['*'], 'page')
            ->through(function (User $user) {
                $data = $user->toArray();
                $data['display_role'] = in_array($user->user_type, ['Core Admin', 'Super Admin'], true)
                    ? 'Core Admin'
                    : ($user->user_type ?: 'Student');

                return $data;
            })
            ->withQueryString();

        $totalStudents = User::query()->where('user_type', 'Student')->where('status', 'active')->count();
        $totalLeaders = User::query()->where('user_type', 'Student Leader')->count();
        $totalRegionalAdmins = User::query()->where('user_type', 'Regional Admin')->count();
        $totalCoreAdmins = User::query()->whereIn('user_type', ['Core Admin', 'Super Admin'])->count();

        $stats = [
            'total_accounts' => $totalStudents + $totalLeaders + $totalRegionalAdmins + $totalCoreAdmins,
            'total_leaders' => $totalLeaders,
            'total_students' => $totalStudents,
            'total_regional_admins' => $totalRegionalAdmins,
            'total_core_admins' => $totalCoreAdmins,
            'total_campuses' => User::query()->where('user_type', 'Student Leader')->whereNotNull('university')->where('university', '!=', '')->distinct('university')->count('university'),
            'total_regions' => User::query()->whereIn('user_type', ['Student Leader', 'Regional Admin'])->whereNotNull('region')->where('region', '!=', '')->distinct('region')->count('region'),
        ];

        $regionsList = User::query()
            ->whereNotNull('region')
            ->where('region', '!=', '')
            ->distinct()
            ->pluck('region')
            ->merge(
                Institution::query()
                    ->whereNotNull('region')
                    ->where('region', '!=', '')
                    ->distinct()
                    ->pluck('region')
            )
            ->unique()
            ->sort()
            ->values();

        $campusBreakdown = User::query()
            ->where('user_type', 'Student Leader')
            ->whereNotNull('university')
            ->where('university', '!=', '')
            ->selectRaw('university, count(*) as leaders_count, max(region) as region')
            ->groupBy('university')
            ->orderByDesc('leaders_count')
            ->get();

        $regionBreakdown = User::query()
            ->where('user_type', 'Student Leader')
            ->whereNotNull('region')
            ->where('region', '!=', '')
            ->selectRaw('region, count(*) as leaders_count')
            ->groupBy('region')
            ->orderByDesc('leaders_count')
            ->get();

        $allLeaders = User::query()
            ->where('user_type', 'Student Leader')
            ->select($this->columns())
            ->latest('updated_at')
            ->get();

        $institutions = Institution::query()
            ->select(['name', 'region'])
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/StudentLeaders', [
            'accounts' => $accounts,
            'slUsers' => $slUsers,
            'students' => $students,
            'roleOptions' => self::ALLOWED_ROLES,
            'filters' => [
                'search' => $search,
                'region' => $region,
                'tab' => $tab,
            ],
            'stats' => $stats,
            'regionsList' => $regionsList,
            'campusBreakdown' => $campusBreakdown,
            'regionBreakdown' => $regionBreakdown,
            'allLeaders' => $allLeaders,
            'institutions' => $institutions,
        ]);
    }

    public function updateRole(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'role' => ['required', 'string', Rule::in(self::ALLOWED_ROLES)],
            'region' => ['nullable', 'string', 'max:100'],
            'university' => ['nullable', 'string', 'max:255'],
            'division' => ['nullable', 'string', 'max:100'],
        ]);

        $targetRole = $validated['role'];
        $previousRole = in_array($user->user_type, ['Core Admin', 'Super Admin'], true)
            ? 'Core Admin'
            : ($user->user_type ?: 'Student');

        if ($user->user_type === 'Student' && $user->status !== 'active' && $targetRole !== 'Student') {
            abort(422, 'Only active verified accounts can be promoted to an elevated role.');
        }

        $updates = [
            'user_type' => $targetRole,
        ];

        if (array_key_exists('university', $validated) && ! empty($validated['university'])) {
            $updates['university'] = $validated['university'];
        }

        if (array_key_exists('division', $validated) && ! empty($validated['division'])) {
            $updates['division'] = $validated['division'];
        }

        $resolvedRegion = ! empty($validated['region']) ? trim($validated['region']) : trim((string) $user->region);

        if ($targetRole === 'Regional Admin') {
            if ($resolvedRegion === '') {
                throw ValidationException::withMessages([
                    'region' => 'Please select an assigned region for this Regional Admin.',
                ]);
            }
            $updates['region'] = $resolvedRegion;
        } elseif (! empty($validated['region'])) {
            $updates['region'] = trim($validated['region']);
        }

        $user->update($updates);

        // Enforce school jurisdiction consistency on role/region changes
        if ($targetRole === 'Regional Admin') {
            $mismatchedIds = $user->assignedSchools()
                ->where('institutions.region', '!=', $resolvedRegion)
                ->pluck('institutions.id')
                ->all();
            if (! empty($mismatchedIds)) {
                $user->assignedSchools()->detach($mismatchedIds);
            }
        } elseif ($previousRole === 'Regional Admin') {
            $user->assignedSchools()->detach();
        }

        return back()->with('success', "{$user->name}'s role has been updated from {$previousRole} to {$targetRole}.");
    }

    public function promote(Request $request, User $user): RedirectResponse
    {
        abort_unless(
            $user->user_type === 'Student' && $user->status === 'active',
            422,
            'Only active students can be promoted to Student Leader.'
        );

        $validated = $request->validate([
            'university' => 'nullable|string|max:255',
            'division' => 'nullable|string|max:100',
            'region' => 'nullable|string|max:100',
        ]);

        $updates = ['user_type' => 'Student Leader'];
        if (! empty($validated['university'])) {
            $updates['university'] = $validated['university'];
        }
        if (! empty($validated['division'])) {
            $updates['division'] = $validated['division'];
        }
        if (! empty($validated['region'])) {
            $updates['region'] = $validated['region'];
        }

        $user->update($updates);

        return back()->with('success', "Student {$user->name} has been appointed as Student Leader.");
    }

    public function demote(User $user): RedirectResponse
    {
        abort_unless(
            $user->user_type === 'Student Leader',
            422,
            'User is not a Student Leader.'
        );

        $user->update([
            'user_type' => 'Student',
        ]);

        return back()->with('success', "Student Leader {$user->name} has been demoted to regular Student.");
    }

    private function allAccountsQuery(string $tab)
    {
        $query = User::query()
            ->select($this->columns())
            ->where(function ($q) {
                $q->whereIn('user_type', ['Student Leader', 'Regional Admin', 'Core Admin', 'Super Admin'])
                    ->orWhere(function ($sq) {
                        $sq->where('user_type', 'Student')->where('status', 'active');
                    });
            });

        return match ($tab) {
            'students', 'Student' => $query->where('user_type', 'Student')->where('status', 'active'),
            'leaders', 'Student Leader' => $query->where('user_type', 'Student Leader'),
            'regional_admins', 'Regional Admin' => $query->where('user_type', 'Regional Admin'),
            'core_admins', 'Core Admin' => $query->whereIn('user_type', ['Core Admin', 'Super Admin']),
            default => $query,
        };
    }

    private function studentLeadersQuery()
    {
        return User::query()
            ->where('user_type', 'Student Leader')
            ->select($this->columns());
    }

    private function activeStudentsQuery()
    {
        return User::query()
            ->where('user_type', 'Student')
            ->where('status', 'active')
            ->select($this->columns());
    }

    private function search($query, string $search)
    {
        if ($search === '') {
            return $query;
        }

        return $query->where(function ($builder) use ($search) {
            $builder->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('username', 'like', "%{$search}%")
                ->orWhere('ml_id', 'like', "%{$search}%")
                ->orWhere('ml_ign', 'like', "%{$search}%")
                ->orWhere('studentId', 'like', "%{$search}%")
                ->orWhere('university', 'like', "%{$search}%")
                ->orWhere('region', 'like', "%{$search}%")
                ->orWhere('user_type', 'like', "%{$search}%");
        });
    }

    private function columns(): array
    {
        return [
            'id',
            'name',
            'first_name',
            'surname',
            'email',
            'username',
            'ml_id',
            'ml_server',
            'ml_ign',
            'ml_rank',
            'university',
            'course',
            'year_level',
            'studentId',
            'region',
            'island',
            'division',
            'contact_number',
            'facebook_link',
            'proofOfEnrollment',
            'status',
            'user_type',
            'created_at',
            'updated_at',
        ];
    }
}
