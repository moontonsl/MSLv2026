<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminAuditLog;
use App\Models\AdminRole;
use App\Models\AdminUser;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AdminRoleController extends Controller
{
    /**
     * Store a newly created role with its assigned permissions.
     */
    public function store(Request $request): RedirectResponse
    {
        $allowedPermissions = collect(AdminPermissionController::availablePermissions())->pluck('id')->all();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:admin_roles,name'],
            'description' => ['nullable', 'string', 'max:255'],
            'permissions' => ['present', 'array'],
            'permissions.*' => ['string', Rule::in($allowedPermissions)],
        ]);

        $sanitizedPermissions = array_values(array_unique($validated['permissions']));

        $role = AdminRole::create([
            'name' => trim($validated['name']),
            'slug' => Str::slug($validated['name'], '_'),
            'description' => $validated['description'] ?? null,
            'permissions' => $sanitizedPermissions,
            'is_system' => false,
        ]);

        AdminAuditLog::create([
            'admin_user_id' => Auth::guard('admin')->id(),
            'route_name' => 'admin.roles.store',
            'module' => 'Role Management',
            'action' => 'Create Admin Role',
            'method' => 'POST',
            'status_code' => 201,
            'target_type' => 'AdminRole',
            'target_id' => (string) $role->id,
            'metadata' => [
                'role_name' => $role->name,
                'permissions_count' => count($sanitizedPermissions),
                'permissions' => $sanitizedPermissions,
            ],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return redirect()->back()->with('status', "Role '{$role->name}' created successfully with " . count($sanitizedPermissions) . " permissions.");
    }

    /**
     * Update an existing role and its permissions.
     */
    public function update(Request $request, int $id): RedirectResponse
    {
        $role = AdminRole::findOrFail($id);

        if ($role->isSuperAdmin()) {
            return redirect()->back()->withErrors(['message' => 'Super Admin role permissions are fixed and cannot be modified.']);
        }

        $allowedPermissions = collect(AdminPermissionController::availablePermissions())->pluck('id')->all();

        $validated = $request->validate([
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:100',
                Rule::unique('admin_roles', 'name')->ignore($role->id),
            ],
            'description' => ['nullable', 'string', 'max:255'],
            'permissions' => ['required', 'array'],
            'permissions.*' => ['string', Rule::in($allowedPermissions)],
        ]);

        $sanitizedPermissions = array_values(array_unique($validated['permissions']));

        $oldName = $role->name;
        $updates = [
            'permissions' => $sanitizedPermissions,
        ];

        if (isset($validated['name']) && !$role->is_system) {
            $updates['name'] = trim($validated['name']);
            $updates['slug'] = Str::slug($validated['name'], '_');
        }

        if (array_key_exists('description', $validated)) {
            $updates['description'] = $validated['description'];
        }

        $role->update($updates);

        // If the role name changed, update assigned users
        if (!empty($updates['name']) && $updates['name'] !== $oldName) {
            AdminUser::where('role', $oldName)->update(['role' => $updates['name']]);
        }

        // Sync permissions directly to users with this role so their records stay updated
        AdminUser::where('role', $role->name)->update(['permissions' => $sanitizedPermissions]);

        AdminAuditLog::create([
            'admin_user_id' => Auth::guard('admin')->id(),
            'route_name' => 'admin.roles.update',
            'module' => 'Role Management',
            'action' => 'Update Admin Role Permissions',
            'method' => 'PUT',
            'status_code' => 200,
            'target_type' => 'AdminRole',
            'target_id' => (string) $role->id,
            'metadata' => [
                'role_name' => $role->name,
                'permissions_count' => count($sanitizedPermissions),
                'permissions' => $sanitizedPermissions,
            ],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return redirect()->back()->with('status', "Permissions for role '{$role->name}' updated successfully.");
    }

    /**
     * Delete a custom role.
     */
    public function destroy(Request $request, int $id): RedirectResponse
    {
        $role = AdminRole::findOrFail($id);

        if ($role->is_system || $role->isSuperAdmin()) {
            return redirect()->back()->withErrors(['message' => 'System roles cannot be deleted.']);
        }

        // Reassign any users with this role to 'Admin'
        $affectedCount = AdminUser::where('role', $role->name)->count();
        if ($affectedCount > 0) {
            $fallbackRole = AdminRole::where('slug', 'admin')->first();
            AdminUser::where('role', $role->name)->update([
                'role' => 'Admin',
                'permissions' => $fallbackRole?->permissions ?? [],
            ]);
        }

        $roleName = $role->name;
        $role->delete();

        AdminAuditLog::create([
            'admin_user_id' => Auth::guard('admin')->id(),
            'route_name' => 'admin.roles.destroy',
            'module' => 'Role Management',
            'action' => 'Delete Admin Role',
            'method' => 'DELETE',
            'status_code' => 200,
            'target_type' => 'AdminRole',
            'target_id' => (string) $id,
            'metadata' => [
                'deleted_role' => $roleName,
                'reassigned_users_count' => $affectedCount,
            ],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return redirect()->back()->with('status', "Role '{$roleName}' deleted successfully." . ($affectedCount > 0 ? " ({$affectedCount} staff reassigned to Admin)" : ''));
    }
}
