<?php

namespace Tests\Feature\Admin;

use App\Models\AdminUser;
use App\Models\Institution;
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

    public function test_admin_can_view_regional_admins_directory(): void
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

        $this->get(route('admin.regional-admin-management'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/RegionalAdmins')
                ->has('regionalAdmins.data', 1)
                ->where('regionalAdmins.data.0.name', 'Current Regional Admin'));

        $this->get(route('admin.regional-admin-management', ['search' => 'Region IV-A']))
            ->assertInertia(fn ($page) => $page
                ->has('regionalAdmins.data', 1)
                ->where('filters.search', 'Region IV-A'));
    }

    public function test_admin_can_search_students_to_appoint(): void
    {
        $this->signInSuperAdmin();
        $student = User::factory()->create([
            'name' => 'Juan Dela Cruz',
            'email' => 'juan@example.com',
            'user_type' => 'Student Leader',
            'status' => 'active',
            'studentId' => '2026-9999',
        ]);

        $response = $this->getJson(route('admin.regional-admins.search-students', ['q' => 'Juan']))
            ->assertOk();

        $data = $response->json();
        $this->assertCount(1, $data);
        $this->assertEquals('Juan Dela Cruz', $data[0]['name']);
    }

    public function test_super_admin_can_promote_and_demote_regional_admins(): void
    {
        $this->signInSuperAdmin();
        $leader = User::factory()->create([
            'user_type' => 'Student Leader',
            'status' => 'active',
            'region' => 'Region IV-A',
        ]);

        $this->post(route('admin.users.promote-regional-admin', $leader), [
            'region' => 'Region IV-A',
            'division' => 'Regional Director',
        ])->assertRedirect();

        $this->assertDatabaseHas('users', [
            'id' => $leader->id,
            'user_type' => 'Regional Admin',
            'region' => 'Region IV-A',
        ]);

        $this->post(route('admin.users.demote-regional-admin', $leader), [
            'target_role' => 'Student Leader',
        ])->assertRedirect();

        $this->assertDatabaseHas('users', [
            'id' => $leader->id,
            'user_type' => 'Student Leader',
        ]);
    }

    public function test_super_admin_can_assign_and_update_schools_for_regional_admin(): void
    {
        $this->signInSuperAdmin();
        $admin = User::factory()->create([
            'user_type' => 'Regional Admin',
            'status' => 'active',
            'region' => 'NCR',
        ]);

        $pup = Institution::create([
            'name' => 'Polytechnic University of the Philippines',
            'acronym' => 'PUP',
            'region' => 'NCR',
            'island' => 'Luzon',
            'status' => 'active',
        ]);

        $ust = Institution::create([
            'name' => 'University of Santo Tomas',
            'acronym' => 'UST',
            'region' => 'NCR',
            'island' => 'Luzon',
            'status' => 'active',
        ]);

        // Assign PUP and UST
        $response = $this->post(route('admin.users.regional-admin-schools', $admin), [
            'school_ids' => [$pup->id, $ust->id],
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('regional_admin_schools', [
            'user_id' => $admin->id,
            'institution_id' => $pup->id,
        ]);
        $this->assertDatabaseHas('regional_admin_schools', [
            'user_id' => $admin->id,
            'institution_id' => $ust->id,
        ]);
        $this->assertCount(2, $admin->fresh()->assignedSchools);

        // Update to only UST
        $this->post(route('admin.users.regional-admin-schools', $admin), [
            'school_ids' => [$ust->id],
        ])->assertRedirect();

        $this->assertDatabaseMissing('regional_admin_schools', [
            'user_id' => $admin->id,
            'institution_id' => $pup->id,
        ]);
        $this->assertDatabaseHas('regional_admin_schools', [
            'user_id' => $admin->id,
            'institution_id' => $ust->id,
        ]);
        $this->assertCount(1, $admin->fresh()->assignedSchools);
    }

    public function test_promote_regional_admin_requires_region(): void
    {
        $this->signInSuperAdmin();
        $student = User::factory()->create([
            'user_type' => 'Student Leader',
            'status' => 'active',
            'region' => null,
        ]);

        $this->post(route('admin.users.promote-regional-admin', $student), [])
            ->assertSessionHasErrors(['region']);
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
