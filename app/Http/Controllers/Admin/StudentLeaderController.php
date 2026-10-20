<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentLeaderController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();
        $region = $request->string('region')->toString();
        $tab = $request->string('tab', 'leaders')->toString();

        $slQuery = $this->studentLeadersQuery();
        $studentQuery = $this->eligibleStudentsQuery();

        if ($region !== '') {
            $slQuery->where('region', $region);
            $studentQuery->where('region', $region);
        }

        $slUsers = $this->search($slQuery, $search)
            ->latest('updated_at')
            ->paginate(15, ['*'], 'sl_page')
            ->withQueryString();

        $students = $this->search($studentQuery, $search)
            ->latest('created_at')
            ->paginate(15, ['*'], 'student_page')
            ->withQueryString();

        $stats = [
            'total_leaders' => User::query()->where('user_type', 'Student Leader')->count(),
            'total_students' => User::query()->where('user_type', 'Student')->where('status', 'active')->count(),
            'total_campuses' => User::query()->where('user_type', 'Student Leader')->whereNotNull('university')->distinct('university')->count('university'),
            'total_regions' => User::query()->where('user_type', 'Student Leader')->whereNotNull('region')->distinct('region')->count('region'),
        ];

        $regionsList = User::query()
            ->whereNotNull('region')
            ->where('region', '!=', '')
            ->distinct()
            ->pluck('region')
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

        $institutions = \App\Models\Institution::query()
            ->select(['name', 'region'])
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/StudentLeaders', [
            'slUsers' => $slUsers,
            'students' => $students,
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
        if (!empty($validated['university'])) {
            $updates['university'] = $validated['university'];
        }
        if (!empty($validated['division'])) {
            $updates['division'] = $validated['division'];
        }
        if (!empty($validated['region'])) {
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

    private function studentLeadersQuery()
    {
        return User::query()
            ->where('user_type', 'Student Leader')
            ->select($this->columns());
    }

    private function eligibleStudentsQuery()
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
                ->orWhere('region', 'like', "%{$search}%");
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

