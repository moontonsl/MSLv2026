<?php

namespace Tests\Feature;

use App\Enums\CampusTournamentApprovalStatus;
use App\Models\Campus;
use App\Models\CampusAffiliation;
use App\Models\CampusTournament;
use App\Models\CampusTournamentSubmission;
use App\Models\CampusType;
use App\Models\City;
use App\Models\Institution;
use App\Models\Island;
use App\Models\Region;
use App\Models\User;
use Carbon\CarbonImmutable;
use Database\Seeders\TournamentReferenceSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use LogicException;
use Tests\TestCase;

class CampusTournamentWorkflowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(TournamentReferenceSeeder::class);
    }

    public function test_student_leader_can_create_each_tournament_type_with_an_immutable_snapshot(): void
    {
        foreach (['online', 'onsite'] as $index => $type) {
            $campus = $this->createCampus('R'.($index + 1));
            $leader = $this->createLeader($campus);

            $response = $this->actingAs($leader)->post(route('campus-tournaments.store'), [
                ...$this->payload($campus, $type),
                'name' => ucfirst($type).' Cup',
            ]);

            $response->assertRedirect();
            $tournament = CampusTournament::query()->where('name', ucfirst($type).' Cup')->firstOrFail();
            $this->assertSame(CampusTournamentApprovalStatus::Pending, $tournament->approval_status);
            $this->assertSame('2026-09-01 00:00:00', $tournament->registration_opens_at->format('Y-m-d H:i:s'));
            $this->assertNotNull($tournament->current_submission_id);
            $this->assertDatabaseHas('campus_tournament_submissions', [
                'id' => $tournament->current_submission_id,
                'tournament_id' => $tournament->id,
                'campus_id' => $campus->id,
                'version' => 1,
                'name' => ucfirst($type).' Cup',
            ]);
        }
    }

    public function test_creation_requires_authentication_and_an_active_student_leader_affiliation(): void
    {
        $campus = $this->createCampus('R1');
        $payload = $this->payload($campus);

        $this->post(route('campus-tournaments.store'), $payload)->assertRedirect(route('login'));

        $member = User::factory()->create(['status' => 'active']);
        CampusAffiliation::query()->create([
            'campus_id' => $campus->id,
            'user_id' => $member->id,
            'role' => 'member',
            'status' => 'active',
        ]);
        $this->actingAs($member)->post(route('campus-tournaments.store'), $payload)->assertForbidden();

        $inactiveLeader = $this->createLeader($campus, 'revoked');
        $this->actingAs($inactiveLeader)->post(route('campus-tournaments.store'), $payload)->assertForbidden();

        $this->assertDatabaseCount('campus_tournaments', 0);
    }

    public function test_creation_validates_campus_state_date_order_and_required_fields(): void
    {
        $campus = $this->createCampus('R1', 'inactive');
        $leader = $this->createLeader($campus);

        $this->actingAs($leader)->post(route('campus-tournaments.store'), $this->payload($campus))
            ->assertForbidden();

        $activeCampus = $this->createCampus('R2');
        CampusAffiliation::query()->create([
            'campus_id' => $activeCampus->id,
            'user_id' => $leader->id,
            'role' => 'student_leader',
            'status' => 'active',
        ]);

        $invalid = $this->payload($activeCampus);
        $invalid['name'] = '';
        $invalid['registration_closes_at'] = $invalid['registration_opens_at'];

        $this->actingAs($leader)->post(route('campus-tournaments.store'), $invalid)
            ->assertSessionHasErrors(['name', 'registration_closes_at']);
    }

    public function test_one_leader_may_select_only_campuses_where_they_are_an_active_leader(): void
    {
        $authorized = $this->createCampus('R1');
        $unauthorized = $this->createCampus('R2');
        $leader = $this->createLeader($authorized);

        $this->actingAs($leader)->post(route('campus-tournaments.store'), $this->payload($unauthorized))
            ->assertForbidden();

        CampusAffiliation::query()->create([
            'campus_id' => $unauthorized->id,
            'user_id' => $leader->id,
            'role' => 'student_leader',
            'status' => 'active',
        ]);

        $this->actingAs($leader)->post(route('campus-tournaments.store'), $this->payload($unauthorized))
            ->assertRedirect();
    }

    public function test_pending_and_approved_periods_cannot_overlap_but_touching_boundaries_can(): void
    {
        $campus = $this->createCampus('R1');
        $leader = $this->createLeader($campus);
        $this->actingAs($leader)->post(route('campus-tournaments.store'), $this->payload($campus));

        $overlap = $this->payload($campus);
        $overlap['name'] = 'Overlapping Cup';
        $overlap['registration_opens_at'] = '2026-09-04 12:00:00';
        $overlap['registration_closes_at'] = '2026-09-05 12:00:00';
        $overlap['starts_at'] = '2026-09-05 12:00:00';
        $this->actingAs($leader)->post(route('campus-tournaments.store'), $overlap)
            ->assertSessionHasErrors('registration_opens_at');

        $touching = $this->payload($campus);
        $touching['name'] = 'Next Cup';
        $touching['registration_opens_at'] = '2026-09-06 20:00:00';
        $touching['registration_closes_at'] = '2026-09-07 20:00:00';
        $touching['starts_at'] = '2026-09-07 20:00:00';
        $touching['ends_at'] = '2026-09-08 20:00:00';
        $this->actingAs($leader)->post(route('campus-tournaments.store'), $touching)
            ->assertRedirect();

        $this->assertDatabaseCount('campus_tournaments', 2);
    }

    public function test_official_region_admin_can_reject_and_creator_can_resubmit_all_fields(): void
    {
        $originalCampus = $this->createCampus('R1');
        $newCampus = $this->createCampus('R2');
        $leader = $this->createLeader($originalCampus);
        CampusAffiliation::query()->create([
            'campus_id' => $newCampus->id,
            'user_id' => $leader->id,
            'role' => 'student_leader',
            'status' => 'active',
        ]);
        $originalAdmin = $this->assignRegionAdmin('R1');

        $this->actingAs($leader)->post(route('campus-tournaments.store'), $this->payload($originalCampus));
        $tournament = CampusTournament::query()->firstOrFail();

        $this->actingAs($originalAdmin)->post(route('campus-tournaments.reject', $tournament), [
            'reason' => 'Dates need correction.',
        ])->assertRedirect();

        $resubmission = $this->payload($newCampus, 'onsite');
        $resubmission['name'] = 'Revised Onsite Cup';
        $resubmission['resubmission_reason'] = 'Moved to the correct host campus.';
        $this->actingAs($leader)->put(route('campus-tournaments.resubmit', $tournament), $resubmission)
            ->assertRedirect();

        $tournament->refresh();
        $this->assertSame($newCampus->id, $tournament->campus_id);
        $this->assertSame(CampusTournamentApprovalStatus::Pending, $tournament->approval_status);
        $this->assertSame(2, $tournament->submissions()->count());
        $this->assertSame(2, $tournament->currentSubmission->version);
        $this->assertSame('Moved to the correct host campus.', $tournament->currentSubmission->resubmission_reason);
        $this->assertDatabaseHas('campus_tournament_reviews', [
            'submission_id' => $tournament->submissions()->where('version', 1)->value('id'),
            'decision' => 'rejected',
        ]);

        $this->actingAs($originalAdmin)->post(route('campus-tournaments.approve', $tournament))
            ->assertForbidden();
        $newAdmin = $this->assignRegionAdmin('R2');
        $this->actingAs($newAdmin)->post(route('campus-tournaments.approve', $tournament))
            ->assertRedirect();
    }

    public function test_resubmission_requires_a_reason_and_rejected_state(): void
    {
        $campus = $this->createCampus('R1');
        $leader = $this->createLeader($campus);
        $this->actingAs($leader)->post(route('campus-tournaments.store'), $this->payload($campus));
        $tournament = CampusTournament::query()->firstOrFail();

        $this->actingAs($leader)->put(route('campus-tournaments.resubmit', $tournament), [
            ...$this->payload($campus),
            'resubmission_reason' => 'Not rejected yet.',
        ])->assertStatus(409);

        $tournament->update(['approval_status' => CampusTournamentApprovalStatus::Rejected]);
        $this->actingAs($leader)->put(route('campus-tournaments.resubmit', $tournament), $this->payload($campus))
            ->assertSessionHasErrors('resubmission_reason');
    }

    public function test_creator_can_audit_cancel_only_a_pending_tournament(): void
    {
        $campus = $this->createCampus('R1');
        $leader = $this->createLeader($campus);
        $this->actingAs($leader)->post(route('campus-tournaments.store'), $this->payload($campus));
        $tournament = CampusTournament::query()->firstOrFail();

        $this->actingAs($leader)->delete(route('campus-tournaments.destroy', $tournament), [
            'reason' => 'Campus calendar changed.',
        ])->assertRedirect();

        $tournament->refresh();
        $this->assertSame(CampusTournamentApprovalStatus::Cancelled, $tournament->approval_status);
        $this->assertSame($leader->id, $tournament->cancelled_by_user_id);
        $this->assertSame('Campus calendar changed.', $tournament->cancellation_reason);
        $this->assertNotNull($tournament->cancelled_at);
        $this->assertDatabaseHas('campus_tournaments', ['id' => $tournament->id]);

        $admin = $this->assignRegionAdmin('R1');
        $this->actingAs($admin)->post(route('campus-tournaments.approve', $tournament))->assertStatus(409);
    }

    public function test_only_official_region_admin_or_active_super_admin_can_review(): void
    {
        $campus = $this->createCampus('R1');
        $leader = $this->createLeader($campus);
        $this->actingAs($leader)->post(route('campus-tournaments.store'), $this->payload($campus));
        $tournament = CampusTournament::query()->firstOrFail();

        $wrongAdmin = $this->assignRegionAdmin('R2');
        $this->actingAs($wrongAdmin)->post(route('campus-tournaments.approve', $tournament))->assertForbidden();

        $superAdmin = User::factory()->create([
            'status' => 'active',
            'user_type' => 'Super Admin',
        ]);
        $this->actingAs($superAdmin)->post(route('campus-tournaments.approve', $tournament), [
            'reason' => 'Operational override.',
        ])->assertRedirect();

        $this->assertDatabaseHas('campus_tournament_reviews', [
            'tournament_id' => $tournament->id,
            'reviewer_user_id' => $superAdmin->id,
            'decision' => 'approved',
            'reason' => 'Operational override.',
        ]);
    }

    public function test_pending_review_queries_are_scoped_to_the_official_region(): void
    {
        $campus = $this->createCampus('R1');
        $leader = $this->createLeader($campus);
        $this->actingAs($leader)->post(route('campus-tournaments.store'), $this->payload($campus));

        $correctAdmin = $this->assignRegionAdmin('R1');
        $wrongAdmin = $this->assignRegionAdmin('R2');
        $superAdmin = User::factory()->create(['status' => 'active', 'user_type' => 'Super Admin']);

        $this->assertCount(1, CampusTournament::query()->pendingForReviewer($correctAdmin)->get());
        $this->assertCount(0, CampusTournament::query()->pendingForReviewer($wrongAdmin)->get());
        $this->assertCount(1, CampusTournament::query()->pendingForReviewer($superAdmin)->get());
    }

    public function test_rejection_reason_is_required_and_a_submission_cannot_be_reviewed_twice(): void
    {
        $campus = $this->createCampus('R1');
        $leader = $this->createLeader($campus);
        $admin = $this->assignRegionAdmin('R1');
        $this->actingAs($leader)->post(route('campus-tournaments.store'), $this->payload($campus));
        $tournament = CampusTournament::query()->firstOrFail();

        $this->actingAs($admin)->post(route('campus-tournaments.reject', $tournament))
            ->assertSessionHasErrors('reason');
        $this->actingAs($admin)->post(route('campus-tournaments.approve', $tournament))
            ->assertRedirect();
        $this->actingAs($admin)->post(route('campus-tournaments.reject', $tournament), [
            'reason' => 'Too late.',
        ])->assertStatus(409);

        $this->assertSame(1, $tournament->reviews()->count());
    }

    public function test_approval_rechecks_creator_authority(): void
    {
        $campus = $this->createCampus('R1');
        $leader = $this->createLeader($campus);
        $admin = $this->assignRegionAdmin('R1');
        $this->actingAs($leader)->post(route('campus-tournaments.store'), $this->payload($campus));
        $tournament = CampusTournament::query()->firstOrFail();

        CampusAffiliation::query()->where('user_id', $leader->id)->update(['status' => 'revoked']);

        $this->actingAs($admin)->post(route('campus-tournaments.approve', $tournament))->assertStatus(409);
        $this->assertSame(CampusTournamentApprovalStatus::Pending, $tournament->fresh()->approval_status);
    }

    public function test_approval_rechecks_date_order_and_schedule_conflicts(): void
    {
        $campus = $this->createCampus('R1');
        $leader = $this->createLeader($campus);
        $admin = $this->assignRegionAdmin('R1');
        $this->actingAs($leader)->post(route('campus-tournaments.store'), $this->payload($campus));
        $tournament = CampusTournament::query()->firstOrFail();

        DB::table('campus_tournaments')->where('id', $tournament->id)->update([
            'registration_closes_at' => '2026-09-07 00:00:00',
            'starts_at' => '2026-09-06 00:00:00',
        ]);

        $this->actingAs($admin)->post(route('campus-tournaments.approve', $tournament))
            ->assertSessionHasErrors('registration_opens_at');
        $this->assertSame(CampusTournamentApprovalStatus::Pending, $tournament->fresh()->approval_status);
    }

    public function test_approved_lifecycle_uses_half_open_boundaries(): void
    {
        $tournament = new CampusTournament([
            'approval_status' => CampusTournamentApprovalStatus::Approved,
            'registration_opens_at' => '2026-09-01 00:00:00',
            'registration_closes_at' => '2026-09-02 00:00:00',
            'starts_at' => '2026-09-03 00:00:00',
            'ends_at' => '2026-09-04 00:00:00',
        ]);

        $this->assertSame('scheduled', $tournament->lifecycle(CarbonImmutable::parse('2026-08-31 23:59:59')));
        $this->assertSame('registration_open', $tournament->lifecycle(CarbonImmutable::parse('2026-09-01 00:00:00')));
        $this->assertSame('registration_closed', $tournament->lifecycle(CarbonImmutable::parse('2026-09-02 00:00:00')));
        $this->assertSame('ongoing', $tournament->lifecycle(CarbonImmutable::parse('2026-09-03 00:00:00')));
        $this->assertSame('completed', $tournament->lifecycle(CarbonImmutable::parse('2026-09-04 00:00:00')));
    }

    public function test_submission_models_cannot_be_updated_or_deleted(): void
    {
        $campus = $this->createCampus('R1');
        $leader = $this->createLeader($campus);
        $this->actingAs($leader)->post(route('campus-tournaments.store'), $this->payload($campus));
        $submission = CampusTournamentSubmission::query()->firstOrFail();

        try {
            $submission->update(['name' => 'Changed']);
            $this->fail('Updating an immutable submission should fail.');
        } catch (LogicException) {
            $this->assertSame('Campus Cup', $submission->fresh()->name);
        }

        $this->expectException(LogicException::class);
        $submission->delete();
    }

    public function test_tournament_factories_create_consistent_records(): void
    {
        $tournament = CampusTournament::factory()->create();
        $submission = CampusTournamentSubmission::factory()->create([
            'tournament_id' => $tournament->id,
        ]);

        $this->assertSame($tournament->campus_id, $submission->campus_id);
        $this->assertSame($tournament->created_by_user_id, $submission->submitted_by_user_id);
        $this->assertSame($tournament->name, $submission->name);
    }

    private function payload(Campus $campus, string $type = 'online'): array
    {
        return [
            'campus_id' => $campus->id,
            'name' => 'Campus Cup',
            'tournament_type_code' => $type,
            'registration_opens_at' => '2026-09-01 08:00:00',
            'registration_closes_at' => '2026-09-05 08:00:00',
            'starts_at' => '2026-09-05 08:00:00',
            'ends_at' => '2026-09-06 20:00:00',
        ];
    }

    private function createCampus(string $regionCode, string $status = 'active'): Campus
    {
        $suffix = str_replace('.', '', uniqid('', true));
        $islandCode = 'I'.$suffix;
        $cityCode = 'C'.$suffix;

        Island::query()->firstOrCreate(['code' => $islandCode], ['name' => 'Island '.$suffix]);
        Region::query()->firstOrCreate(['code' => $regionCode], [
            'name' => 'Region '.$regionCode,
            'region_number' => $regionCode,
            'acronym' => $regionCode,
            'island_code' => $islandCode,
        ]);
        City::query()->create([
            'code' => $cityCode,
            'name' => 'City '.$suffix,
            'region_code' => $regionCode,
        ]);
        $institution = Institution::query()->create(['name' => 'Institution '.$suffix]);
        $campusType = CampusType::query()->create([
            'name' => 'Type '.$suffix,
            'code' => 'type-'.$suffix,
        ]);

        return Campus::query()->create([
            'institution_id' => $institution->id,
            'campus_type_id' => $campusType->id,
            'name' => 'Campus '.$suffix,
            'city_code' => $cityCode,
            'status' => $status,
        ]);
    }

    private function createLeader(Campus $campus, string $affiliationStatus = 'active'): User
    {
        $leader = User::factory()->create(['status' => 'active']);
        CampusAffiliation::query()->create([
            'campus_id' => $campus->id,
            'user_id' => $leader->id,
            'role' => 'student_leader',
            'status' => $affiliationStatus,
        ]);

        return $leader;
    }

    private function assignRegionAdmin(string $regionCode): User
    {
        if (! Region::query()->whereKey($regionCode)->exists()) {
            $this->createCampus($regionCode);
        }

        $admin = User::factory()->create([
            'status' => 'active',
            'user_type' => 'Regional Admin',
        ]);
        DB::table('region_admins')->insert([
            'region_code' => $regionCode,
            'user_id' => $admin->id,
            'assigned_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return $admin;
    }
}
