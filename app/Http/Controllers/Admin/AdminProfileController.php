<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminUser;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AdminProfileController extends Controller
{
    public function index(): Response
    {
        $admin = $this->admin();

        return Inertia::render('Admin/Profile', [
            'admin' => [
                'name' => $admin->name,
                'email' => $admin->email,
                'role' => $admin->role,
                'is_super_admin' => $admin->isSuperAdmin(),
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $admin = $this->admin();
        $request->merge([
            'name' => trim((string) $request->input('name')),
            'email' => strtolower(trim((string) $request->input('email'))),
        ]);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('admin_users', 'email')->ignore($admin->id)],
        ]);

        $admin->update($validated);

        return back()->with('success', 'Admin profile updated successfully.');
    }

    public function updatePassword(Request $request): RedirectResponse
    {
        $admin = $this->admin();
        $validated = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'confirmed', 'different:current_password', Password::min(8)],
        ]);

        if (!Hash::check($validated['current_password'], $admin->password)) {
            throw ValidationException::withMessages([
                'current_password' => 'The current password is incorrect.',
            ]);
        }

        $admin->forceFill(['password' => Hash::make($validated['password'])])->save();
        $request->session()->regenerate();

        return back()->with('success', 'Admin password changed successfully.');
    }

    private function admin(): AdminUser
    {
        return Auth::guard('admin')->user();
    }
}
