<?php

namespace Tests\Feature\Admin;

use App\Models\AdminUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminAccountsTest extends TestCase
{
    use RefreshDatabase;

    private function signInSuperAdmin(): AdminUser
    {
        $admin = AdminUser::create([
            'name' => 'Super Admin',
            'email' => 'admin@msl.com',
            'password' => Hash::make('password'),
            'role' => 'Super Admin',
        ]);

        $this->actingAs($admin, 'admin');

        return $admin;
    }

    public function test_super_admin_can_view_admin_accounts_with_protection_metadata(): void
    {
        $this->signInSuperAdmin();
        $admin = AdminUser::create([
            'name' => 'Content Admin',
            'email' => 'content@example.com',
            'password' => Hash::make('password'),
            'role' => 'Admin',
            'permissions' => ['manage_news'],
        ]);

        $this->get(route('admin.accounts.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/AdminAccounts/Index')
                ->has('adminUsers', 2)
                ->where('adminUsers.0.id', $admin->id)
                ->where('adminUsers.0.permissions_count', 1)
                ->where('adminUsers.0.is_super_admin', false)
                ->where('adminUsers.1.email', 'admin@msl.com')
                ->where('adminUsers.1.is_super_admin', true));
    }

    public function test_super_admin_can_create_normalized_admin_account_with_hashed_password(): void
    {
        $this->signInSuperAdmin();

        $this->post(route('admin.accounts.store'), [
            'name' => 'New Content Admin',
            'email' => '  NEW.ADMIN@EXAMPLE.COM ',
            'password' => 'secret-password',
            'password_confirmation' => 'secret-password',
            'role' => 'Admin',
        ])->assertRedirect();

        $admin = AdminUser::query()->where('email', 'new.admin@example.com')->firstOrFail();
        $this->assertSame('Admin', $admin->role);
        $this->assertSame([], $admin->permissions);
        $this->assertTrue(Hash::check('secret-password', $admin->password));
    }

    public function test_admin_account_creation_requires_confirmation_and_admin_role(): void
    {
        $this->signInSuperAdmin();

        $this->post(route('admin.accounts.store'), [
            'name' => 'Invalid Admin',
            'email' => 'invalid@example.com',
            'password' => 'short',
            'password_confirmation' => 'different',
            'role' => 'Super Admin',
        ])->assertSessionHasErrors(['password', 'role']);
    }

    public function test_super_admin_is_protected_and_admin_cannot_delete_current_account(): void
    {
        $superAdmin = $this->signInSuperAdmin();
        $this->delete(route('admin.accounts.destroy', $superAdmin))
            ->assertRedirect()
            ->assertSessionHas('error', 'Cannot delete the Super Admin account.');
        $this->assertDatabaseHas('admin_users', ['id' => $superAdmin->id]);

        $admin = AdminUser::create([
            'name' => 'Account Manager',
            'email' => 'manager@example.com',
            'password' => Hash::make('password'),
            'role' => 'Admin',
            'permissions' => ['manage_admin_accounts'],
        ]);
        $this->actingAs($admin, 'admin');

        $this->delete(route('admin.accounts.destroy', $admin))
            ->assertRedirect()
            ->assertSessionHas('error', 'You cannot delete the currently signed-in admin account.');
        $this->assertDatabaseHas('admin_users', ['id' => $admin->id]);
    }

    public function test_admin_without_admin_account_permission_cannot_manage_accounts(): void
    {
        $admin = AdminUser::create([
            'name' => 'Limited Admin',
            'email' => 'limited@example.com',
            'password' => Hash::make('password'),
            'role' => 'Admin',
        ]);
        $this->actingAs($admin, 'admin');

        $this->get(route('admin.accounts.index'))->assertForbidden();
        $this->post(route('admin.accounts.store'), [])->assertForbidden();
    }
}
