<?php

namespace Tests\Feature\Admin;

use App\Models\AdminUser;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminRegionalAdminsTest extends TestCase
{
    use RefreshDatabase;

    private function signInSuperAdmin(): AdminUser
    {
        $admin = AdminUser::create([
            'name' => 'Regional Admin Manager',
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => 'Super Admin',
        ]);

        $this->actingAs($admin, 'admin');

        return $admin;
    }

    public function test_admin_can_view_regional_admins_and_eligible_users(): void
    {
        $this->signInSuperAdmin();
        User::factory()->create([
            'name' => 'Current Regional Admin',
            'user_type' => 'Regional Admin',
            'status' => 'active',
            'region' => 'Region IV-A',
        ]);
        User::factory()->create([
            'name' => 'Eligible Student Leader',
            'user_type' => 'Student Leader',
            'status' => 'active',
            'region' => 'Region IV-A',
        ]);
        User::factory()->create([
            'name' => 'No Region Student',
            'user_type' => 'Student',
            'status' => 'active',
            'region' => null,
        ]);

        $this->get(route('admin.regional-admin-management'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/RegionalAdmins')
                ->has('regionalAdmins.data', 1)
                ->has('eligibleUsers.data', 1)
                ->where('regionalAdmins.data.0.name', 'Current Regional Admin')
                ->where('eligibleUsers.data.0.name', 'Eligible Student Leader'));

        $this->get(route('admin.regional-admin-management', ['search' => 'Region IV-A']))
            ->assertInertia(fn ($page) => $page
                ->has('regionalAdmins.data', 1)
                ->has('eligibleUsers.data', 1)
                ->where('filters.search', 'Region IV-A'));
    }

    public function test_super_admin_can_promote_and_demote_regional_admins(): void
    {
        $this->signInSuperAdmin();
        $leader = User::factory()->create([
            'user_type' => 'Student Leader',
            'status' => 'active',
            'region' => 'Region IV-A',
        ]);

        $this->post(route('admin.users.promote-regional-admin', $leader))
            ->assertRedirect();
        $this->assertDatabaseHas('users', [
            'id' => $leader->id,
            'user_type' => 'Regional Admin',
        ]);

        $this->post(route('admin.users.demote-regional-admin', $leader))
            ->assertRedirect();
        $this->assertDatabaseHas('users', [
            'id' => $leader->id,
            'user_type' => 'Student Leader',
        ]);
    }

    public function test_user_without_region_cannot_be_promoted_to_regional_admin(): void
    {
        $this->signInSuperAdmin();
        $student = User::factory()->create([
            'user_type' => 'Student Leader',
            'status' => 'active',
            'region' => null,
        ]);

        $this->post(route('admin.users.promote-regional-admin', $student))
            ->assertStatus(422);
    }

    public function test_admin_without_regional_admin_permission_cannot_manage_regional_admins(): void
    {
        $admin = AdminUser::create([
            'name' => 'Limited Admin',
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => 'Admin',
        ]);
        $this->actingAs($admin, 'admin');

        $this->get(route('admin.regional-admin-management'))->assertForbidden();
    }
}
