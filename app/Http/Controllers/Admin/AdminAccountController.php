<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminRole;
use App\Models\AdminUser;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class AdminAccountController extends Controller
{
    public function index(): Response
    {
        $roles = AdminRole::query()
            ->where('slug', '!=', 'super_admin')
            ->select('id', 'name', 'slug', 'description', 'permissions')
            ->orderBy('id')
            ->get()
            ->map(fn (AdminRole $r): array => [
                'id' => $r->id,
                'name' => $r->name,
                'slug' => $r->slug,
                'description' => $r->description,
                'permissions_count' => count($r->permissions ?? []),
            ])
            ->values();

        return Inertia::render('Admin/AdminAccounts/Index', [
            'adminUsers' => AdminUser::query()
                ->select('id', 'name', 'email', 'role', 'permissions', 'created_at')
                ->orderBy('name')
                ->get()
                ->map(fn (AdminUser $admin): array => [
                    'id' => $admin->id,
                    'name' => $admin->name,
                    'email' => $admin->email,
                    'role' => $admin->role,
                    'permissions_count' => count($admin->permissions ?? []),
                    'effective_permissions_count' => count($admin->effective_permissions ?? []),
                    'is_super_admin' => $admin->isSuperAdmin(),
                    'created_at' => $admin->created_at?->toIso8601String(),
                ])
                ->values(),
            'roles' => $roles,
            'roleOptions' => $roles->pluck('name')->all(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->merge(['email' => strtolower(trim((string) $request->input('email')))]);

        $availableRoles = AdminRole::where('slug', '!=', 'super_admin')->pluck('name')->all();
        if (empty($availableRoles)) {
            $availableRoles = ['Admin', 'Content Manager', 'Tournament Manager', 'Regional Admin', 'Event Manager'];
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:admin_users,email'],
            'password' => ['required', 'confirmed', Password::min(8)],
            'role' => ['required', 'string', Rule::in($availableRoles)],
        ]);

        AdminUser::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'permissions' => [],
        ]);

        return back()->with('success', 'Admin account created successfully.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $adminUser = AdminUser::findOrFail($id);

        if ($adminUser->isSuperAdmin()) {
            return back()->with('error', 'Cannot delete the Super Admin account.');
        }

        if ((int) Auth::guard('admin')->id() === $adminUser->id) {
            return back()->with('error', 'You cannot delete the currently signed-in admin account.');
        }

        $adminUser->delete();

        return back()->with('success', 'Admin account deleted successfully.');
    }
}
