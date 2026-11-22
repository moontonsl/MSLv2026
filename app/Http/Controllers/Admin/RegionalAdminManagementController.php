<?php

namespace App\Http\Controllers\Admin;

use App\Actions\RegionalAdmins\SyncRegionalAdminAssignments;
use App\Http\Controllers\Controller;
use App\Models\AdminUser;
use App\Models\Campus;
use App\Models\Region;
use App\Models\RegionAdmin;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
            $adminQuery->whereHas('regionAdminAssignments', fn ($query) => $query->where('region_code', $region));
            $eligibleQuery->where('region', Region::query()->whereKey($region)->value('name') ?? $region);
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
            'covered_regions' => RegionAdmin::query()->distinct('region_code')->count('region_code'),
            'total_eligible' => User::query()->whereIn('user_type', ['Student', 'Student Leader'])->where('status', 'active')->count(),
            'total_campuses' => DB::table('region_admin_campus_assignments')->count(),
        ];

        $regions = Region::query()
            ->orderBy('name')
            ->get(['code', 'name', 'acronym'])
            ->map(fn (Region $region): array => [
                'code' => $region->code,
                'name' => $region->name,
                'label' => $region->acronym ? "{$region->acronym} — {$region->name}" : $region->name,
            ]);

        $campuses = Campus::query()
            ->where('status', 'active')
            ->with(['institution', 'city', 'regionalAdminAssignment.regionAdmin.user'])
            ->orderBy('id')
            ->get()
            ->map(fn (Campus $campus): array => [
                'id' => $campus->id,
                'regionCode' => $campus->city?->region_code,
                'label' => trim(($campus->institution?->name ?? 'MSL School').($campus->name ? ' - '.$campus->name : '')),
                'assignedUserId' => $campus->regionalAdminAssignment?->regionAdmin?->user_id,
                'assignedAdminName' => $campus->regionalAdminAssignment?->regionAdmin?->user?->name,
            ]);

        return Inertia::render('Admin/RegionalAdmins', [
            'regionalAdmins' => $regionalAdmins,
            'eligibleUsers' => $eligibleUsers,
            'filters' => [
                'search' => $search,
                'region' => $region,
                'tab' => $tab,
            ],
            'stats' => $stats,
            'regions' => $regions,
            'campuses' => $campuses,
        ]);
    }

    public function promote(
        Request $request,
        User $user,
        SyncRegionalAdminAssignments $assignments,
    ): RedirectResponse {
        abort_unless(
            in_array($user->user_type, ['Student', 'Student Leader'], true)
                && $user->status === 'active',
            422,
            'Only active users can become Regional Admins.'
        );

        $validated = $this->validateAssignments($request);
        $actor = $request->user();
        abort_unless($actor instanceof AdminUser, 403);

        $assignments->handle(
            $user,
            $validated['region_codes'],
            $validated['campus_ids'] ?? [],
            $actor,
            $validated['division'] ?? null,
        );

        return back()->with('success', "User {$user->name} has been appointed as Regional Admin.");
    }

    public function update(
        Request $request,
        User $user,
        SyncRegionalAdminAssignments $assignments,
    ): RedirectResponse {
        abort_unless($user->user_type === 'Regional Admin' && $user->status === 'active', 422);
        $validated = $this->validateAssignments($request);
        $actor = $request->user();
        abort_unless($actor instanceof AdminUser, 403);

        $assignments->handle(
            $user,
            $validated['region_codes'],
            $validated['campus_ids'] ?? [],
            $actor,
            $validated['division'] ?? null,
        );

        return back()->with('success', "Regional Admin assignments for {$user->name} were updated.");
    }

    public function demote(
        Request $request,
        User $user,
        SyncRegionalAdminAssignments $assignments,
    ): RedirectResponse {
        abort_unless($user->user_type === 'Regional Admin', 422, 'User is not a Regional Admin.');

        $validated = $request->validate([
            'target_role' => ['nullable', 'in:Student,Student Leader'],
        ]);
        $actor = $request->user();
        abort_unless($actor instanceof AdminUser, 403);
        $targetRole = $validated['target_role'] ?? 'Student';

        $assignments->demote($user, $targetRole, $actor);

        return back()->with('success', "Regional Admin {$user->name} has been reverted to {$targetRole}.");
    }

    private function validateAssignments(Request $request): array
    {
        return $request->validate([
            'region_codes' => ['required', 'array', 'min:1'],
            'region_codes.*' => ['required', 'string', 'distinct', 'exists:regions,code'],
            'campus_ids' => ['sometimes', 'array'],
            'campus_ids.*' => ['integer', 'distinct', 'exists:campuses,id'],
            'division' => 'nullable|string|max:100',
        ]);
    }

    private function regionalAdminsQuery()
    {
        return User::query()
            ->where('user_type', 'Regional Admin')
            ->with([
                'regionAdminAssignments.region',
                'regionAdminAssignments.campusAssignments.campus.institution',
            ])
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
                ->orWhere('region', 'like', "%{$search}%")
                ->orWhereHas('regionAdminAssignments.region', fn ($regionQuery) => $regionQuery
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('acronym', 'like', "%{$search}%"));
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
