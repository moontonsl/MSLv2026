<?php

namespace Tests\Feature\Admin;

use App\Models\AdminUser;
use App\Models\Institution;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminAccountManagementAndRegionalLockTest extends TestCase
{
    use RefreshDatabase;

    private function signInAdmin(): AdminUser
    {
        $admin = AdminUser::create([
            'name' => 'Core Platform Admin',
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => 'Super Admin',
        ]);

        $this->actingAs($admin, 'admin');

        return $admin;
    }

    public function test_account_management_displays_all_roles_including_core_admin(): void
    {
        $this->signInAdmin();

        User::factory()->create(['name' => 'Active Student', 'user_type' => 'Student', 'status' => 'active']);
        User::factory()->create(['name' => 'Active SL', 'user_type' => 'Student Leader', 'status' => 'active']);
        User::factory()->create(['name' => 'NCR Regional Admin', 'user_type' => 'Regional Admin', 'status' => 'active', 'region' => 'NCR']);
        User::factory()->create(['name' => 'Main Core Admin', 'user_type' => 'Core Admin', 'status' => 'active']);
        User::factory()->create(['name' => 'Pending Unverified', 'user_type' => 'Student', 'status' => 'pending']);

        $this->get(route('admin.sl-management'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/StudentLeaders')
                ->has('accounts.data', 4)
                ->where('stats.total_accounts', 4)
                ->where('stats.total_students', 1)
                ->where('stats.total_leaders', 1)
                ->where('stats.total_regional_admins', 1)
                ->where('stats.total_core_admins', 1));

        $this->get(route('admin.sl-management', ['tab' => 'Core Admin']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('accounts.data', 1)
                ->where('accounts.data.0.name', 'Main Core Admin')
                ->where('accounts.data.0.display_role', 'Core Admin'));
    }

    public function test_direct_role_dropdown_switches_roles_and_enforces_regional_admin_region(): void
    {
        $this->signInAdmin();

        $user = User::factory()->create([
            'name' => 'Role Switch User',
            'user_type' => 'Student',
            'status' => 'active',
            'region' => null,
        ]);

        // Switching to Regional Admin without a region fails validation
        $this->post(route('admin.users.update-role', $user), [
            'role' => 'Regional Admin',
            'region' => '',
        ])->assertSessionHasErrors(['region']);

        // Switching to Regional Admin with NCR succeeds
        $this->post(route('admin.users.update-role', $user), [
            'role' => 'Regional Admin',
            'region' => 'NCR',
        ])->assertRedirect();

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'user_type' => 'Regional Admin',
            'region' => 'NCR',
        ]);

        // Assign an NCR school, then switch role to Core Admin -> assigned schools detached
        $ncrSchool = Institution::firstOrCreate(
            ['name' => 'Test NCR Esports University'],
            [
                'acronym' => 'TNEU',
                'region' => 'NCR',
                'island' => 'Luzon',
                'status' => 'active',
            ]
        );
        $user->assignedSchools()->sync([$ncrSchool->id]);
        $this->assertCount(1, $user->fresh()->assignedSchools);

        $this->post(route('admin.users.update-role', $user), [
            'role' => 'Core Admin',
        ])->assertRedirect();

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'user_type' => 'Core Admin',
        ]);
        $this->assertCount(0, $user->fresh()->assignedSchools);
    }

    public function test_regional_admin_school_search_and_assignment_strictly_locked_to_tagged_region(): void
    {
        $this->signInAdmin();

        $ncrAdmin = User::factory()->create([
            'name' => 'NCR Admin',
            'user_type' => 'Regional Admin',
            'status' => 'active',
            'region' => 'NCR',
        ]);

        $ncrSchool = Institution::firstOrCreate(
            ['name' => 'Manila NCR Tech University'],
            [
                'acronym' => 'MNTU',
                'region' => 'NCR',
                'island' => 'Luzon',
                'status' => 'active',
            ]
        );

        $cebuSchool = Institution::firstOrCreate(
            ['name' => 'Cebu Visayas Tech University'],
            [
                'acronym' => 'CVTU',
                'region' => 'Region VII',
                'island' => 'Visayas',
                'status' => 'active',
            ]
        );

        // School search filtered by NCR only returns NCR school
        $searchResponse = $this->getJson(route('schools.search.college', [
            'q' => 'Tech University',
            'region' => 'NCR',
        ]))->assertOk()->json();

        $returnedIds = collect($searchResponse)->pluck('id')->all();
        $this->assertContains($ncrSchool->id, $returnedIds);
        $this->assertNotContains($cebuSchool->id, $returnedIds);

        // Attempting to assign Region VII school to NCR Admin fails validation
        $this->post(route('admin.users.regional-admin-schools', $ncrAdmin), [
            'school_ids' => [$ncrSchool->id, $cebuSchool->id],
        ])->assertSessionHasErrors(['school_ids']);

        $this->assertDatabaseMissing('regional_admin_schools', [
            'user_id' => $ncrAdmin->id,
            'institution_id' => $cebuSchool->id,
        ]);

        // Assigning only NCR school succeeds
        $this->post(route('admin.users.regional-admin-schools', $ncrAdmin), [
            'school_ids' => [$ncrSchool->id],
        ])->assertSessionHasNoErrors();

        $this->assertDatabaseHas('regional_admin_schools', [
            'user_id' => $ncrAdmin->id,
            'institution_id' => $ncrSchool->id,
        ]);
    }
}
