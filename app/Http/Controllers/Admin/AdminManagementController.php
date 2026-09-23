<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AdminUser;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AdminManagementController extends Controller
{
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
}
