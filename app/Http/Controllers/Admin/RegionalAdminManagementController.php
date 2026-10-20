<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RegionalAdminManagementController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();
        $region = $request->string('region')->toString();
        $tab = $request->string('tab', 'admins')->toString();

        $adminQuery = $this->regionalAdminsQuery();
        $eligibleQuery = $this->eligibleUsersQuery();

        if ($region !== '') {
            $adminQuery->where('region', $region);
            $eligibleQuery->where('region', $region);
        }

        $regionalAdmins = $this->search($adminQuery, $search)
            ->latest('updated_at')
            ->paginate(15, ['*'], 'admin_page')
            ->withQueryString();

        $eligibleUsers = $this->search($eligibleQuery, $search)
            ->latest('created_at')
            ->paginate(15, ['*'], 'eligible_page')
            ->withQueryString();

        $stats = [
            'total_admins' => User::query()->where('user_type', 'Regional Admin')->count(),
            'covered_regions' => User::query()->where('user_type', 'Regional Admin')->whereNotNull('region')->where('region', '!=', '')->distinct('region')->count('region'),
            'total_eligible' => User::query()->whereIn('user_type', ['Student', 'Student Leader'])->where('status', 'active')->count(),
            'total_campuses' => User::query()->where('user_type', 'Regional Admin')->whereNotNull('university')->where('university', '!=', '')->distinct('university')->count('university'),
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
            'eligibleUsers' => $eligibleUsers,
            'filters' => [
                'search' => $search,
                'region' => $region,
                'tab' => $tab,
            ],
            'stats' => $stats,
            'regionsList' => $regionsList,
        ]);
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
            'division' => 'nullable|string|max:100',
            'university' => 'nullable|string|max:255',
        ]);

        $updates = [
            'user_type' => 'Regional Admin',
            'region' => $validated['region'],
        ];

        if (!empty($validated['division'])) {
            $updates['division'] = $validated['division'];
        }
        if (!empty($validated['university'])) {
            $updates['university'] = $validated['university'];
        }

        $user->update($updates);

        return back()->with('success', "User {$user->name} has been appointed as Regional Admin for {$user->region}.");
    }

    public function demote(Request $request, User $user): RedirectResponse
    {
        abort_unless(
            $user->user_type === 'Regional Admin',
            422,
            'User is not a Regional Admin.'
        );

        $targetRole = $request->input('target_role', 'Student');
        if (!in_array($targetRole, ['Student', 'Student Leader'], true)) {
            $targetRole = 'Student';
        }

        $user->update([
            'user_type' => $targetRole,
        ]);

        return back()->with('success', "Regional Admin {$user->name} has been reverted to {$targetRole}.");
    }

    private function regionalAdminsQuery()
    {
        return User::query()
            ->where('user_type', 'Regional Admin')
            ->select($this->columns());
    }

    private function eligibleUsersQuery()
    {
        return User::query()
            ->whereIn('user_type', ['Student', 'Student Leader'])
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
            'email',
            'username',
            'user_type',
            'status',
            'university',
            'course',
            'year_level',
            'studentId',
            'region',
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
