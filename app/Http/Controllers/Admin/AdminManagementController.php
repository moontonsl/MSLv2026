<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use App\Models\Permission;
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
        $users = User::whereIn('user_type', ['Super Admin', 'Regional Admin', 'Student Leader'])
            ->with('permissions')
            ->orderBy('name')
            ->get();

        // Fetch all permissions
        $permissions = Permission::all();

        return Inertia::render('Admin/Management', [
            'adminUsers' => $users,
            'allPermissions' => $permissions,
        ]);
    }

    /**
     * Update the custom permissions assigned to an admin account.
     */
    public function updatePermissions(Request $request, $id): RedirectResponse
    {
        $request->validate([
            'permissions' => 'nullable|array',
            'permissions.*' => 'integer|exists:permissions,id',
        ]);

        $user = User::whereIn('user_type', ['Super Admin', 'Regional Admin', 'Student Leader'])->findOrFail($id);

        // Do not allow modifying Super Admin permissions since they always bypass check
        if ($user->user_type === 'Super Admin') {
            return redirect()->back()->withErrors(['message' => 'Super Admin permissions cannot be modified.']);
        }

        $user->permissions()->sync($request->permissions ?? []);

        return redirect()->back()->with('status', 'Permissions updated successfully.');
    }
}
