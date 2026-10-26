<?php

namespace Tests\Feature\Admin;

use App\Models\AdminRole;
use App\Models\AdminUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminRolesTest extends TestCase
{
    use RefreshDatabase;

    private function signInSuperAdmin(): AdminUser
    {
        $admin = AdminUser::create([
            'name' => 'Roles Super Admin',
            'email' => 'admin@msl.com',
            'password' => Hash::make('password'),
            'role' => 'Super Admin',
        ]);

        $this->actingAs($admin, 'admin');

        return $admin;
    }

    public function test_super_admin_can_create_new_role_with_permissions(): void
    {
        $this->signInSuperAdmin();

        $response = $this->post(route('admin.roles.store'), [
            'name' => 'Tournament Director',
            'description' => 'Responsible for running brackets and scheduling matches.',
            'permissions' => ['manage_mcc_seasons', 'manage_msl_events', 'access_admin_dashboard'],
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('admin_roles', [
            'name' => 'Tournament Director',
            'slug' => 'tournament_director',
        ]);

        $role = AdminRole::where('slug', 'tournament_director')->firstOrFail();
        $this->assertCount(3, $role->permissions);
        $this->assertContains('manage_mcc_seasons', $role->permissions);
    }

    public function test_role_creation_requires_unique_name_and_valid_permissions(): void
    {
        $this->signInSuperAdmin();

        // Duplicate name
        $response = $this->post(route('admin.roles.store'), [
            'name' => 'Admin',
            'permissions' => ['access_admin_dashboard'],
        ]);
        $response->assertSessionHasErrors('name');

        // Invalid permission
        $response2 = $this->post(route('admin.roles.store'), [
            'name' => 'Custom Hacker',
            'permissions' => ['not_a_real_permission'],
        ]);
        $response2->assertSessionHasErrors('permissions.0');
    }

    public function test_super_admin_can_update_role_permissions_and_users_inherit_them(): void
    {
        $this->signInSuperAdmin();

        $role = AdminRole::where('slug', 'content_manager')->firstOrFail();
        $role->update(['permissions' => ['manage_news']]);

        // Create a user with Content Manager role
        $user = AdminUser::create([
            'name' => 'Content Guy',
            'email' => 'content.guy@example.com',
            'password' => Hash::make('password'),
            'role' => 'Content Manager',
            'permissions' => [],
        ]);

        $this->assertTrue($user->hasPermission('manage_news'));
        $this->assertFalse($user->hasPermission('manage_mcc_seasons'));

        // Update Content Manager to include manage_mcc_seasons
        $newPermissions = array_merge($role->permissions, ['manage_mcc_seasons']);

        $response = $this->put(route('admin.roles.update', $role->id), [
            'name' => 'Content Manager',
            'description' => 'Updated content role description.',
            'permissions' => $newPermissions,
        ]);

        $response->assertRedirect();

        // Refresh user and assert they now inherit manage_mcc_seasons
        $user->refresh();
        $this->assertTrue($user->hasPermission('manage_mcc_seasons'));
    }

    public function test_super_admin_role_cannot_be_deleted_or_modified(): void
    {
        $this->signInSuperAdmin();

        $superRole = AdminRole::where('slug', 'super_admin')->firstOrFail();

        $response = $this->put(route('admin.roles.update', $superRole->id), [
            'permissions' => ['manage_news'],
        ]);
        $response->assertSessionHasErrors('message');

        $deleteResponse = $this->delete(route('admin.roles.destroy', $superRole->id));
        $deleteResponse->assertSessionHasErrors('message');
        $this->assertDatabaseHas('admin_roles', ['id' => $superRole->id]);
    }

    public function test_custom_role_can_be_deleted_and_assigned_users_reassigned(): void
    {
        $this->signInSuperAdmin();

        $role = AdminRole::create([
            'name' => 'Temporary Moderator',
            'slug' => 'temporary_moderator',
            'permissions' => ['manage_faq'],
        ]);

        $user = AdminUser::create([
            'name' => 'Temp Mod User',
            'email' => 'tempmod@example.com',
            'password' => Hash::make('password'),
            'role' => 'Temporary Moderator',
        ]);

        $response = $this->delete(route('admin.roles.destroy', $role->id));
        $response->assertRedirect();

        $this->assertDatabaseMissing('admin_roles', ['id' => $role->id]);

        // User should be safely reassigned to Admin
        $user->refresh();
        $this->assertSame('Admin', $user->role);
    }
}
