<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AdminUser;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminManagementController extends Controller
{
    private const EDITABLE_ROLES = [
        'Admin',
        'Content Manager',
        'Regional Admin',
        'Event Manager',
    ];

    public static function editableRoles(): array
    {
        return self::EDITABLE_ROLES;
    }

    /**
     * Display the admin management interface with users and permissions.
     */
    public function index(Request $request): Response
    {
        // Fetch all admin/leader level accounts (exclude normal Students)
        $users = AdminUser::query()
            ->select('id', 'name', 'email', 'role', 'permissions')
            ->orderBy('name')
            ->get();

        $permissions = AdminPermissionController::availablePermissions();

        return Inertia::render('Admin/Management', [
            'adminUsers' => $users->map(fn (AdminUser $admin): array => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'role' => $admin->role,
                'permissions' => $admin->permissions ?? [],
                'is_super_admin' => $admin->isSuperAdmin(),
            ])->values(),
            'allPermissions' => $permissions,
            'roleOptions' => self::editableRoles(),
        ]);
    }

    /**
     * Update the custom permissions assigned to an admin account.
     */
    public function updatePermissions(Request $request, $id): RedirectResponse
    {
        $validated = $request->validate([
            'permissions' => ['present', 'array'],
            'permissions.*' => ['string'],
        ]);

        $user = AdminUser::findOrFail($id);

        if ($user->isSuperAdmin()) {
            return redirect()->back()->withErrors(['message' => 'Super Admin permissions cannot be modified.']);
        }

        $allowed = collect(AdminPermissionController::availablePermissions())->pluck('id');
        $user->update([
            'permissions' => collect($validated['permissions'])
                ->filter(fn (string $permission) => $allowed->contains($permission))
                ->unique()
                ->values()
                ->all(),
        ]);

        return redirect()->back()->with('status', 'Permissions updated successfully.');
    }

    /**
     * Update the role assigned to an administrator account.
     */
    public function updateRole(Request $request, int $id): RedirectResponse
    {
        $validated = $request->validate([
            'role' => ['required', 'string', Rule::in(self::EDITABLE_ROLES)],
        ]);

        $user = AdminUser::findOrFail($id);

        if ($user->isSuperAdmin()) {
            return redirect()->back()->withErrors([
                'role' => 'The Super Admin role cannot be changed.',
            ]);
        }

        $user->update(['role' => $validated['role']]);

        return redirect()->back()->with('status', 'Admin role updated successfully.');
    }
}
