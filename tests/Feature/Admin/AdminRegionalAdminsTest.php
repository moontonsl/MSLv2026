<?php

namespace Tests\Feature\Admin;

use App\Models\AdminUser;
use App\Models\Campus;
use App\Models\City;
use App\Models\Region;
use App\Models\RegionAdmin;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
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
        $region = Region::factory()->create(['name' => 'Region IV-A', 'acronym' => 'CALABARZON']);
        $regionalAdmin = User::factory()->create([
            'name' => 'Current Regional Admin',
            'user_type' => 'Regional Admin',
            'status' => 'active',
            'region' => 'Region IV-A',
        ]);
        RegionAdmin::query()->create([
            'user_id' => $regionalAdmin->id,
            'region_code' => $region->code,
            'assigned_at' => now(),
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
                ->has('eligibleUsers.data', 2)
                ->where('regionalAdmins.data.0.name', 'Current Regional Admin')
                ->where('eligibleUsers.data.0.name', 'Eligible Student Leader'));

        $this->get(route('admin.regional-admin-management', ['search' => 'CALABARZON']))
            ->assertInertia(fn ($page) => $page
                ->has('regionalAdmins.data', 1)
                ->where('filters.search', 'CALABARZON'));
    }

    public function test_super_admin_can_promote_and_demote_regional_admins(): void
    {
        $this->signInSuperAdmin();
        $leader = User::factory()->create([
            'user_type' => 'Student Leader',
            'status' => 'active',
            'region' => 'Region IV-A',
        ]);
        $regionOne = Region::factory()->create();
        $regionTwo = Region::factory()->create();
        $city = City::factory()->create(['region_code' => $regionOne->code]);
        $campus = Campus::factory()->create(['city_code' => $city->code]);

        $this->post(route('admin.users.promote-regional-admin', $leader), [
            'region_codes' => [$regionOne->code, $regionTwo->code],
            'campus_ids' => [$campus->id],
            'division' => 'Regional Director',
        ])
            ->assertRedirect();
        $this->assertDatabaseHas('users', [
            'id' => $leader->id,
            'user_type' => 'Regional Admin',
        ]);
        $this->assertDatabaseHas('region_admins', ['user_id' => $leader->id, 'region_code' => $regionOne->code]);
        $this->assertDatabaseHas('region_admins', ['user_id' => $leader->id, 'region_code' => $regionTwo->code]);
        $this->assertDatabaseHas('region_admin_campus_assignments', ['campus_id' => $campus->id]);

        $this->post(route('admin.users.demote-regional-admin', $leader), [
            'target_role' => 'Student Leader',
        ])
            ->assertRedirect();
        $this->assertDatabaseHas('users', [
            'id' => $leader->id,
            'user_type' => 'Student Leader',
        ]);
        $this->assertDatabaseMissing('region_admins', ['user_id' => $leader->id]);
        $this->assertDatabaseMissing('region_admin_campus_assignments', ['campus_id' => $campus->id]);
    }

    public function test_user_cannot_be_promoted_without_an_official_region_assignment(): void
    {
        $this->signInSuperAdmin();
        $student = User::factory()->create([
            'user_type' => 'Student Leader',
            'status' => 'active',
            'region' => null,
        ]);

        $this->post(route('admin.users.promote-regional-admin', $student), [
            'region_codes' => [],
            'campus_ids' => [],
        ])->assertSessionHasErrors('region_codes');
    }

    public function test_assignment_update_releases_removed_regions_and_campuses_with_history(): void
    {
        $this->signInSuperAdmin();
        $user = User::factory()->create(['user_type' => 'Student Leader', 'status' => 'active']);
        $regionOne = Region::factory()->create();
        $regionTwo = Region::factory()->create();
        $campusOne = Campus::factory()->create([
            'city_code' => City::factory()->create(['region_code' => $regionOne->code])->code,
        ]);
        $campusTwo = Campus::factory()->create([
            'city_code' => City::factory()->create(['region_code' => $regionTwo->code])->code,
        ]);

        $this->post(route('admin.users.promote-regional-admin', $user), [
            'region_codes' => [$regionOne->code, $regionTwo->code],
            'campus_ids' => [$campusOne->id, $campusTwo->id],
        ])->assertRedirect();

        $this->put(route('admin.users.update-regional-admin', $user), [
            'region_codes' => [$regionOne->code],
            'campus_ids' => [$campusOne->id],
        ])->assertRedirect();

        $this->assertDatabaseHas('region_admins', ['user_id' => $user->id, 'region_code' => $regionOne->code]);
        $this->assertDatabaseMissing('region_admins', ['user_id' => $user->id, 'region_code' => $regionTwo->code]);
        $this->assertDatabaseMissing('region_admin_campus_assignments', ['campus_id' => $campusTwo->id]);
        $this->assertDatabaseHas('region_admin_assignment_history', [
            'user_id' => $user->id,
            'region_code' => $regionTwo->code,
        ]);
        $this->assertNotNull(DB::table('region_admin_assignment_history')
            ->where('user_id', $user->id)
            ->where('region_code', $regionTwo->code)
            ->value('ended_at'));
        $this->assertNotNull(DB::table('region_admin_campus_assignment_history')
            ->where('user_id', $user->id)
            ->where('campus_id', $campusTwo->id)
            ->value('ended_at'));
    }

    public function test_campus_cannot_be_assigned_to_two_regional_admins(): void
    {
        $this->signInSuperAdmin();
        $region = Region::factory()->create();
        $campus = Campus::factory()->create([
            'city_code' => City::factory()->create(['region_code' => $region->code])->code,
        ]);
        $first = User::factory()->create(['user_type' => 'Student Leader', 'status' => 'active']);
        $second = User::factory()->create(['user_type' => 'Student Leader', 'status' => 'active']);

        $payload = ['region_codes' => [$region->code], 'campus_ids' => [$campus->id]];
        $this->post(route('admin.users.promote-regional-admin', $first), $payload)->assertRedirect();
        $this->post(route('admin.users.promote-regional-admin', $second), $payload)
            ->assertSessionHasErrors('campus_ids');

        $this->assertDatabaseHas('region_admin_campus_assignments', [
            'campus_id' => $campus->id,
            'region_admin_id' => RegionAdmin::query()
                ->where('user_id', $first->id)
                ->where('region_code', $region->code)
                ->value('id'),
        ]);
        $this->assertSame('Student Leader', $second->fresh()->user_type);
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
