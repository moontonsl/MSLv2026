<?php

namespace Tests\Feature;

use App\Models\Campus;
use App\Models\CampusTournament;
use App\Models\City;
use App\Models\Region;
use App\Models\RegionAdmin;
use App\Models\RegionAdminCampusAssignment;
use App\Models\User;
use App\Support\CampusTournamentAuthorization;
use App\Support\RegionalAdminScope;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegionalAdminCampusScopingTest extends TestCase
{
    use RefreshDatabase;

    public function test_multiple_admins_can_cover_a_region_and_one_admin_can_cover_multiple_regions(): void
    {
        [$regionOne, $campusA, $campusB, $unassignedCampus] = $this->regionWithCampuses(3);
        [$regionTwo, $secondRegionCampus] = $this->regionWithCampuses(1);
        $adminOne = $this->regionalAdmin();
        $adminTwo = $this->regionalAdmin();

        $adminOneRegionOne = $this->assignRegion($adminOne, $regionOne);
        $this->assignRegion($adminOne, $regionTwo);
        $adminTwoRegionOne = $this->assignRegion($adminTwo, $regionOne);

        RegionAdminCampusAssignment::query()->create([
            'region_admin_id' => $adminOneRegionOne->id,
            'campus_id' => $campusA->id,
            'assigned_at' => now(),
        ]);
        RegionAdminCampusAssignment::query()->create([
            'region_admin_id' => $adminTwoRegionOne->id,
            'campus_id' => $campusB->id,
            'assigned_at' => now(),
        ]);

        $scope = app(RegionalAdminScope::class);
        $adminOneCampuses = $scope->applyToCampuses(Campus::query(), $adminOne)->pluck('campuses.id');
        $adminTwoCampuses = $scope->applyToCampuses(Campus::query(), $adminTwo)->pluck('campuses.id');

        $this->assertEqualsCanonicalizing(
            [$campusA->id, $unassignedCampus->id, $secondRegionCampus->id],
            $adminOneCampuses->all(),
        );
        $this->assertEqualsCanonicalizing(
            [$campusB->id, $unassignedCampus->id],
            $adminTwoCampuses->all(),
        );
    }

    public function test_assigned_campus_is_shared_when_its_admin_becomes_inactive(): void
    {
        [$region, $campus] = $this->regionWithCampuses(1);
        $assignedAdmin = $this->regionalAdmin();
        $otherAdmin = $this->regionalAdmin();
        $assignedRegion = $this->assignRegion($assignedAdmin, $region);
        $this->assignRegion($otherAdmin, $region);
        RegionAdminCampusAssignment::query()->create([
            'region_admin_id' => $assignedRegion->id,
            'campus_id' => $campus->id,
            'assigned_at' => now(),
        ]);

        $scope = app(RegionalAdminScope::class);
        $this->assertFalse($scope->canAccessCampus($otherAdmin, $campus));

        $assignedAdmin->update(['status' => 'inactive']);

        $this->assertTrue($scope->canAccessCampus($otherAdmin, $campus));
        $this->assertFalse($scope->canAccessCampus($assignedAdmin->fresh(), $campus));
    }

    public function test_tournament_review_uses_the_same_campus_scope(): void
    {
        [$region, $assignedCampus, $unassignedCampus] = $this->regionWithCampuses(2);
        $assignedAdmin = $this->regionalAdmin();
        $otherAdmin = $this->regionalAdmin();
        $assignedRegion = $this->assignRegion($assignedAdmin, $region);
        $this->assignRegion($otherAdmin, $region);
        RegionAdminCampusAssignment::query()->create([
            'region_admin_id' => $assignedRegion->id,
            'campus_id' => $assignedCampus->id,
            'assigned_at' => now(),
        ]);

        $authorization = app(CampusTournamentAuthorization::class);
        $this->assertTrue($authorization->canReview($assignedAdmin, $assignedCampus));
        $this->assertFalse($authorization->canReview($otherAdmin, $assignedCampus));
        $this->assertTrue($authorization->canReview($assignedAdmin, $unassignedCampus));
        $this->assertTrue($authorization->canReview($otherAdmin, $unassignedCampus));

        $assignedTournament = CampusTournament::factory()->create(['campus_id' => $assignedCampus->id]);
        $unassignedTournament = CampusTournament::factory()->create(['campus_id' => $unassignedCampus->id]);

        $this->assertEqualsCanonicalizing(
            [$assignedTournament->id, $unassignedTournament->id],
            CampusTournament::pendingForReviewer($assignedAdmin)->pluck('id')->all(),
        );
        $this->assertSame(
            [$unassignedTournament->id],
            CampusTournament::pendingForReviewer($otherAdmin)->pluck('id')->all(),
        );
    }

    private function regionalAdmin(): User
    {
        return User::factory()->create([
            'status' => 'active',
            'user_type' => 'Regional Admin',
        ]);
    }

    private function assignRegion(User $user, Region $region): RegionAdmin
    {
        return RegionAdmin::query()->create([
            'user_id' => $user->id,
            'region_code' => $region->code,
            'assigned_at' => now(),
        ]);
    }

    private function regionWithCampuses(int $count): array
    {
        $region = Region::factory()->create();
        $city = City::factory()->create(['region_code' => $region->code]);
        $campuses = Campus::factory()->count($count)->create(['city_code' => $city->code]);

        return [$region, ...$campuses->all()];
    }
}
