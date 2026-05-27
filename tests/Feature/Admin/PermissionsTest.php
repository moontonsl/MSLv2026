<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PermissionsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed default permissions
        $this->artisan('db:seed', ['--class' => 'PermissionSeeder']);
    }

    public function test_super_admin_can_access_dashboard_and_management_pages(): void
    {
        $superAdmin = User::factory()->create([
            'user_type' => 'Super Admin',
            'status' => 'active',
        ]);

        $response = $this->actingAs($superAdmin)->get(route('admin.dashboard'));
        $response->assertStatus(200);

        $response = $this->actingAs($superAdmin)->get(route('admin.management'));
        $response->assertStatus(200);
    }

    public function test_regional_admin_without_permissions_is_denied_access(): void
    {
        $admin = User::factory()->create([
            'user_type' => 'Regional Admin',
            'status' => 'active',
        ]);

        $response = $this->actingAs($admin)->get(route('admin.dashboard'));
        $response->assertStatus(403);

        $response = $this->actingAs($admin)->get(route('admin.management'));
        $response->assertStatus(403);
    }

    public function test_regional_admin_with_dashboard_permission_can_access_dashboard_but_not_management(): void
    {
        $admin = User::factory()->create([
            'user_type' => 'Regional Admin',
            'status' => 'active',
        ]);

        $dashboardPermission = Permission::where('slug', 'access_admin_dashboard')->first();
        $admin->permissions()->attach($dashboardPermission);

        $response = $this->actingAs($admin)->get(route('admin.dashboard'));
        $response->assertStatus(200);

        $response = $this->actingAs($admin)->get(route('admin.management'));
        $response->assertStatus(403);
    }

    public function test_regional_admin_can_approve_students_only_if_they_have_permission(): void
    {
        $admin = User::factory()->create([
            'user_type' => 'Regional Admin',
            'status' => 'active',
        ]);

        // Dashboard access is needed to hit controller endpoints generally, but we can hit POST directly
        $student = User::factory()->create([
            'user_type' => 'Student',
            'status' => 'pending',
        ]);

        // Attempt without permission
        $response = $this->actingAs($admin)->post(route('admin.users.approve', $student->id));
        $response->assertStatus(403);
        $this->assertEquals('pending', $student->fresh()->status);

        // Grant permission
        $approvePermission = Permission::where('slug', 'approve_students')->first();
        $admin->permissions()->attach($approvePermission);

        // Attempt with permission
        $response = $this->actingAs($admin)->post(route('admin.users.approve', $student->id));
        $response->assertStatus(302); // Redirect back on success
        $this->assertEquals('active', $student->fresh()->status);
    }
}
