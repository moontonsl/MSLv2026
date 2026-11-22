<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Institution;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegionalAdminManagementController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();
        $region = $request->string('region')->toString();

        $adminQuery = $this->regionalAdminsQuery()->with(['assignedSchools:id,name,acronym,region,island']);

        if ($region !== '') {
            $adminQuery->where(function ($q) use ($region) {
                $q->where('region', $region)
                    ->orWhereJsonContains('assigned_regions', $region);
            });
        }

        $regionalAdmins = $this->search($adminQuery, $search)
            ->latest('updated_at')
            ->paginate(15, ['*'], 'admin_page')
            ->withQueryString();

        $stats = [
            'total_admins' => User::query()->where('user_type', 'Regional Admin')->count(),
            'covered_regions' => User::query()->where('user_type', 'Regional Admin')->whereNotNull('region')->where('region', '!=', '')->distinct('region')->count('region'),
            'total_eligible' => User::query()->whereIn('user_type', ['Student', 'Student Leader'])->where('status', 'active')->count(),
            'total_campuses' => DB::table('regional_admin_schools')->distinct('institution_id')->count('institution_id') ?: User::query()->where('user_type', 'Regional Admin')->whereNotNull('university')->where('university', '!=', '')->distinct('university')->count('university'),
            'assigned_schools_count' => DB::table('regional_admin_schools')->count(),
        ];

        $regionsList = User::query()
            ->whereNotNull('region')
            ->where('region', '!=', '')
            ->distinct()
            ->pluck('region')
            ->sort()
            ->values();

        return Inertia::render('Admin/RegionalAdmins', [
            'regionalAdmins' => $regionalAdmins,
            'filters' => [
                'search' => $search,
                'region' => $region,
            ],
            'stats' => $stats,
            'regionsList' => $regionsList,
        ]);
    }

    public function searchStudents(Request $request): JsonResponse
    {
        $q = trim($request->string('q')->toString());
        if ($q === '') {
            return response()->json([]);
        }

        $students = User::query()
            ->whereIn('user_type', ['Student', 'Student Leader'])
            ->where('status', 'active')
            ->where(function ($builder) use ($q) {
                $builder->where('name', 'like', "%{$q}%")
                    ->orWhere('email', 'like', "%{$q}%")
                    ->orWhere('username', 'like', "%{$q}%")
                    ->orWhere('studentId', 'like', "%{$q}%")
                    ->orWhere('ml_id', 'like', "%{$q}%")
                    ->orWhere('ml_ign', 'like', "%{$q}%")
                    ->orWhere('university', 'like', "%{$q}%");
            })
            ->latest('created_at')
            ->limit(20)
            ->get($this->columns());

        return response()->json($students);
    }

    public function promote(Request $request, User $user): RedirectResponse
    {
        abort_unless(
            in_array($user->user_type, ['Student', 'Student Leader'], true)
                && $user->status === 'active',
            422,
            'Only active users can become Regional Admins.'
        );

        $validated = $request->validate([
            'region' => 'required|string|max:255',
            'regions' => 'nullable|array',
            'regions.*' => 'string|max:255',
            'division' => 'nullable|string|max:100',
            'university' => 'nullable|string|max:255',
            'school_ids' => 'nullable|array',
            'school_ids.*' => 'integer|exists:institutions,id',
        ]);

        $targetRegions = collect($validated['regions'] ?? [$validated['region']])
            ->prepend($validated['region'])
            ->map(fn ($r) => trim((string) $r))
            ->filter()
            ->unique()
            ->values()
            ->all();

        $primaryRegion = $targetRegions[0] ?? trim($validated['region']);
        $schoolIds = array_values(array_unique($validated['school_ids'] ?? []));

        if (! empty($schoolIds)) {
            $this->assertSchoolsMatchRegions($schoolIds, $targetRegions);
            $this->assertSchoolsNotAssignedToOtherAdmin($schoolIds, $user->id);
        }

        $updates = [
            'user_type' => 'Regional Admin',
            'region' => $primaryRegion,
            'assigned_regions' => $targetRegions,
        ];

        if (! empty($validated['division'])) {
            $updates['division'] = $validated['division'];
        }
        if (! empty($validated['university'])) {
            $updates['university'] = $validated['university'];
        }

        $user->update($updates);

        if (! empty($schoolIds)) {
            $user->assignedSchools()->sync($schoolIds);
        }

        return back()->with('success', "User {$user->name} has been appointed as Regional Admin for {$user->region}.");
    }

    public function updateSchools(Request $request, User $user): RedirectResponse|JsonResponse
    {
        abort_unless(
            $user->user_type === 'Regional Admin',
            422,
            'User is not a Regional Admin.'
        );

        $validated = $request->validate([
            'regions' => 'nullable|array|min:1',
            'regions.*' => 'string|max:255',
            'school_ids' => 'nullable|array',
            'school_ids.*' => 'integer|exists:institutions,id',
        ]);

        if (isset($validated['regions'])) {
            $coveredRegions = collect($validated['regions'])
                ->map(fn ($r) => trim((string) $r))
                ->filter()
                ->unique()
                ->values()
                ->all();

            if (! empty($coveredRegions)) {
                $user->update([
                    'region' => $coveredRegions[0],
                    'assigned_regions' => $coveredRegions,
                ]);
            }
        } else {
            $coveredRegions = $user->coveredRegions();
        }

        $schoolIds = array_values(array_unique($validated['school_ids'] ?? []));

        if (! empty($schoolIds) && ! empty($coveredRegions)) {
            $this->assertSchoolsMatchRegions($schoolIds, $coveredRegions);
        }

        if (! empty($schoolIds)) {
            $this->assertSchoolsNotAssignedToOtherAdmin($schoolIds, $user->id);
        }

        $user->assignedSchools()->sync($schoolIds);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => "Assigned regions & schools updated for {$user->name}.",
                'assigned_regions' => $user->coveredRegions(),
                'assigned_schools' => $user->assignedSchools()->get(['id', 'name', 'acronym', 'region', 'island']),
            ]);
        }

        return back()->with('success', "Assigned regions & schools updated successfully for {$user->name}.");
    }

    public function demote(Request $request, User $user): RedirectResponse
    {
        abort_unless(
            $user->user_type === 'Regional Admin',
            422,
            'User is not a Regional Admin.'
        );

        $targetRole = $request->input('target_role', 'Student');
        if (! in_array($targetRole, ['Student', 'Student Leader'], true)) {
            $targetRole = 'Student';
        }

        $user->update([
            'user_type' => $targetRole,
            'assigned_regions' => null,
        ]);

        $user->assignedSchools()->detach();

        return back()->with('success', "Regional Admin {$user->name} has been reverted to {$targetRole}.");
    }

    /**
     * Strictly verify that all given school IDs belong to one of the Regional Admin's covered regions.
     *
     * @param  array<int, int>  $schoolIds
     * @param  array<int, string>  $regions
     */
    private function assertSchoolsMatchRegions(array $schoolIds, array $regions): void
    {
        $invalidSchools = Institution::query()
            ->whereIn('id', $schoolIds)
            ->where(function ($query) use ($regions) {
                $query->whereNull('region')
                    ->orWhereNotIn('region', $regions);
            })
            ->pluck('name')
            ->all();

        if (! empty($invalidSchools)) {
            $regionLabel = implode(', ', $regions);
            throw ValidationException::withMessages([
                'school_ids' => "Only schools in ({$regionLabel}) can be assigned to this Regional Admin. Invalid selection: ".implode(', ', array_slice($invalidSchools, 0, 3)),
            ]);
        }
    }

    /**
     * Prevent assigning a school that is already assigned to another Regional Admin.
     *
     * @param  array<int, int>  $schoolIds
     */
    private function assertSchoolsNotAssignedToOtherAdmin(array $schoolIds, ?int $ignoreUserId = null): void
    {
        $conflictIdsQuery = DB::table('regional_admin_schools')
            ->whereIn('institution_id', $schoolIds);

        if ($ignoreUserId !== null) {
            $conflictIdsQuery->where('user_id', '!=', $ignoreUserId);
        }

        $conflictIds = $conflictIdsQuery->pluck('institution_id')->unique()->all();

        if (! empty($conflictIds)) {
            $conflictNames = Institution::query()
                ->whereIn('id', $conflictIds)
                ->pluck('name')
                ->all();

            throw ValidationException::withMessages([
                'school_ids' => 'The following school(s) are already assigned to another Regional Admin: '.implode(', ', array_slice($conflictNames, 0, 3)),
            ]);
        }
    }

    private function regionalAdminsQuery()
    {
        return User::query()
            ->where('user_type', 'Regional Admin')
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
                ->orWhere('region', 'like', "%{$search}%");
        });
    }

    private function columns(): array
    {
        return [
            'id',
            'name',
            'email',
            'username',
            'user_type',
            'status',
            'university',
            'course',
            'year_level',
            'studentId',
            'region',
            'assigned_regions',
            'division',
            'ml_id',
            'ml_server',
            'ml_ign',
            'ml_rank',
            'contact_number',
            'facebook_link',
            'proofOfEnrollment',
            'created_at',
            'updated_at',
        ];
    }
}
