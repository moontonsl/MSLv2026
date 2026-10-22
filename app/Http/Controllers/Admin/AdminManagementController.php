<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminAuditLog;
use App\Models\AdminUser;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
     * Display the admin management interface with users, permissions, presets, and stats.
     */
    public function index(Request $request): Response
    {
        $allPermissions = AdminPermissionController::availablePermissions();
        $rolePresets = AdminPermissionController::rolePresets();

        $users = AdminUser::query()
            ->select('id', 'name', 'email', 'role', 'permissions', 'created_at')
            ->orderBy('name')
            ->get();

        $totalAdmins = $users->count();
        $superAdminsCount = $users->filter(fn (AdminUser $admin) => $admin->isSuperAdmin())->count();
        $customAdminsCount = $totalAdmins - $superAdminsCount;

        $roles = \App\Models\AdminRole::query()
            ->orderBy('id')
            ->get()
            ->map(fn (\App\Models\AdminRole $role): array => [
                'id' => $role->id,
                'name' => $role->name,
                'slug' => $role->slug,
                'description' => $role->description,
                'permissions' => $role->permissions ?? [],
                'permissions_count' => count($role->permissions ?? []),
                'is_system' => (bool) $role->is_system,
                'users_count' => AdminUser::where('role', $role->name)->count(),
            ])
            ->values();

        $stats = [
            'total_admins' => $totalAdmins,
            'super_admins' => $superAdminsCount,
            'custom_admins' => $customAdminsCount,
            'total_roles' => $roles->count(),
            'total_permissions' => count($allPermissions),
        ];

        return Inertia::render('Admin/Management', [
            'adminUsers' => $users->map(fn (AdminUser $admin): array => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'role' => $admin->role,
                'permissions' => $admin->permissions ?? [],
                'permissions_count' => count($admin->permissions ?? []),
                'effective_permissions' => $admin->effective_permissions,
                'effective_permissions_count' => count($admin->effective_permissions),
                'is_super_admin' => $admin->isSuperAdmin(),
                'created_at' => $admin->created_at?->toIso8601String(),
            ])->values(),
            'roles' => $roles,
            'allPermissions' => $allPermissions,
            'rolePresets' => $rolePresets,
            'stats' => $stats,
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
        $sanitized = collect($validated['permissions'])
            ->filter(fn (string $permission) => $allowed->contains($permission))
            ->unique()
            ->values()
            ->all();

        $oldPermissions = $user->permissions ?? [];
        $user->update(['permissions' => $sanitized]);

        // Security Audit Log entry
        AdminAuditLog::create([
            'admin_user_id' => Auth::guard('admin')->id(),
            'route_name' => 'admin.users.permissions.update',
            'module' => 'Admin Security',
            'action' => 'Update Staff Permissions',
            'method' => 'POST',
            'status_code' => 200,
            'target_type' => 'AdminUser',
            'target_id' => (string) $user->id,
            'metadata' => [
                'target_admin_name' => $user->name,
                'target_admin_email' => $user->email,
                'previous_count' => count($oldPermissions),
                'new_count' => count($sanitized),
                'permissions_granted' => $sanitized,
            ],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
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
