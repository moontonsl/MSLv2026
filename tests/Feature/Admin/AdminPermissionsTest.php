<?php

namespace Tests\Feature\Admin;

use App\Models\AdminUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminPermissionsTest extends TestCase
{
    use RefreshDatabase;

    private function signInSuperAdmin(): AdminUser
    {
        $admin = AdminUser::create([
            'name' => 'Permissions Super Admin',
            'email' => 'admin@msl.com',
            'password' => Hash::make('password'),
            'role' => 'Super Admin',
        ]);

        $this->actingAs($admin, 'admin');

        return $admin;
    }

    public function test_super_admin_can_view_grouped_permission_matrix(): void
    {
        $this->signInSuperAdmin();
        $admin = AdminUser::create([
            'name' => 'Content Admin',
            'email' => 'content@example.com',
            'password' => Hash::make('password'),
            'role' => 'Admin',
            'permissions' => ['manage_news'],
        ]);

        $this->get(route('admin.management'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Management')
                ->has('adminUsers', 2)
                ->where('adminUsers.0.id', $admin->id)
                ->where('adminUsers.0.is_super_admin', false)
                ->where('adminUsers.1.is_super_admin', true)
                ->where('allPermissions.0.group', 'Student operations')
                ->where('allPermissions.12.group', 'Website content'));
    }

    public function test_super_admin_can_update_only_allowed_unique_permissions(): void
    {
        $this->signInSuperAdmin();
        $admin = AdminUser::create([
            'name' => 'Content Admin',
            'email' => 'content@example.com',
            'password' => Hash::make('password'),
            'role' => 'Admin',
            'permissions' => [],
        ]);

        $this->post(route('admin.users.permissions.update', $admin), [
            'permissions' => ['manage_news', 'manage_news', 'not-a-real-permission', 'manage_footer'],
        ])->assertRedirect();

        $this->assertSame(['manage_news', 'manage_footer'], $admin->refresh()->permissions);
    }

    public function test_super_admin_permissions_cannot_be_modified(): void
    {
        $superAdmin = $this->signInSuperAdmin();

        $this->post(route('admin.users.permissions.update', $superAdmin), [
            'permissions' => ['manage_news'],
        ])->assertRedirect()->assertSessionHasErrors('message');

        $this->assertNull($superAdmin->refresh()->permissions);
    }

    public function test_permissions_update_requires_an_array(): void
    {
        $this->signInSuperAdmin();
        $admin = AdminUser::create([
            'name' => 'Content Admin',
            'email' => 'content@example.com',
            'password' => Hash::make('password'),
            'role' => 'Admin',
        ]);

        $this->post(route('admin.users.permissions.update', $admin), [
            'permissions' => 'manage_news',
        ])->assertSessionHasErrors('permissions');
    }

    public function test_admin_without_permissions_management_access_is_denied(): void
    {
        $admin = AdminUser::create([
            'name' => 'Limited Admin',
            'email' => 'limited@example.com',
            'password' => Hash::make('password'),
            'role' => 'Admin',
        ]);
        $this->actingAs($admin, 'admin');

        $this->get(route('admin.management'))->assertForbidden();
        $this->post(route('admin.users.permissions.update', $admin), ['permissions' => []])->assertForbidden();
    }
}
