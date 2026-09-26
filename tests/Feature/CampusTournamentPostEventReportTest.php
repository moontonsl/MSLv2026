<?php

namespace Tests\Feature;

use App\Enums\CampusTournamentApprovalStatus;
use App\Enums\ParticipantStatus;
use App\Enums\TeamFormationMethod;
use App\Enums\TeamStatus;
use App\Models\Campus;
use App\Models\CampusAffiliation;
use App\Models\CampusTournament;
use App\Models\CampusType;
use App\Models\City;
use App\Models\Institution;
use App\Models\Island;
use App\Models\Region;
use App\Models\RegionAdmin;
use App\Models\TournamentParticipant;
use App\Models\TournamentResultEntry;
use App\Models\TournamentResultRevision;
use App\Models\TournamentTeam;
use App\Models\User;
use Database\Seeders\TournamentReferenceSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use LogicException;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Tests\TestCase;

class CampusTournamentPostEventReportTest extends TestCase
{
    use RefreshDatabase;

    private Campus $campus;

    private User $leader;

    private User $regionalAdmin;

    private User $core;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(TournamentReferenceSeeder::class);

        $island = Island::query()->create(['code' => 'luzon', 'name' => 'Luzon']);
        $region = Region::query()->create([
            'code' => '04A',
            'name' => 'CALABARZON',
            'region_number' => 'IV-A',
            'acronym' => '04A',
            'island_code' => $island->code,
        ]);
        $city = City::query()->create([
            'code' => '043426000',
            'name' => 'Los Baños',
            'region_code' => $region->code,
        ]);
        $institution = Institution::query()->create([
            'name' => 'Laguna State Polytechnic University',
            'slug' => 'lspu',
            'status' => 'active',
        ]);
        $campusType = CampusType::query()->create([
            'code' => 'satellite',
            'name' => 'Satellite Campus',
        ]);
        $this->campus = Campus::query()->create([
            'institution_id' => $institution->id,
            'campus_type_id' => $campusType->id,
            'name' => 'Los Baños',
            'city_code' => $city->code,
            'status' => 'active',
        ]);

        $this->leader = User::factory()->create(['status' => 'active', 'name' => 'Report Leader']);
        CampusAffiliation::query()->create([
            'campus_id' => $this->campus->id,
            'user_id' => $this->leader->id,
            'role' => 'student_leader',
            'status' => 'active',
            'started_at' => now()->subMonth(),
        ]);

        $this->regionalAdmin = User::factory()->create(['status' => 'active']);
        RegionAdmin::query()->create([
            'region_code' => $region->code,
            'user_id' => $this->regionalAdmin->id,
            'assigned_at' => now(),
        ]);

        $this->core = User::factory()->create([
            'status' => 'active',
            'user_type' => 'Super Admin',
        ]);
    }

    public function test_creator_submits_complete_results_with_ties_and_immutable_roster_snapshots(): void
    {
        [$tournament, $teams] = $this->completedTournamentWithTeams(2);

        $response = $this->actingAs($this->leader)->post(
            route('campus-tournaments.results.store', $tournament),
            ['entries' => $this->entries($teams, ['1st', '1st'])],
        );

        $response->assertRedirect();
        $tournament->refresh();
        $this->assertNotNull($tournament->current_result_revision_id);
        $this->assertDatabaseHas('tournament_result_revisions', [
            'id' => $tournament->current_result_revision_id,
            'tournament_id' => $tournament->id,
            'version' => 1,
            'submitted_by_user_id' => $this->leader->id,
            'reason' => null,
        ]);
        $this->assertDatabaseCount('tournament_result_entries', 2);
        $this->assertSame(
            ['1st', '1st'],
            TournamentResultEntry::query()->orderBy('team_id')->pluck('placement_code')->all(),
        );

        $snapshot = TournamentResultEntry::query()->where('team_id', $teams[0]->id)->firstOrFail();
        $this->assertCount(5, $snapshot->roster_snapshot);
        $this->assertSame('captain', $snapshot->roster_snapshot[0]['roster_role']);
        $this->assertSame('Original IGN 1-1', $snapshot->roster_snapshot[0]['ign']);
    }

    public function test_submission_requires_completed_tournament_exact_team_coverage_a_winner_and_valid_rosters(): void
    {
        [$tournament, $teams] = $this->completedTournamentWithTeams(2);

        $tournament->update(['ends_at' => now()->addHour()]);
        $this->actingAs($this->leader)
            ->post(route('campus-tournaments.results.store', $tournament), [
                'entries' => $this->entries($teams, ['1st', 'participant']),
            ])
            ->assertStatus(409);

        $tournament->update(['ends_at' => now()->subHour()]);
        $this->actingAs($this->leader)
            ->post(route('campus-tournaments.results.store', $tournament), [
                'entries' => [['team_id' => $teams[0]->id, 'placement_code' => '1st']],
            ])
            ->assertSessionHasErrors('entries');

        $this->actingAs($this->leader)
            ->post(route('campus-tournaments.results.store', $tournament), [
                'entries' => $this->entries($teams, ['participant', 'participant']),
            ])
            ->assertSessionHasErrors('entries');

        TournamentParticipant::query()->where('team_id', $teams[1]->id)->latest('id')->delete();
        $this->actingAs($this->leader)
            ->post(route('campus-tournaments.results.store', $tournament), [
                'entries' => $this->entries($teams, ['1st', 'participant']),
            ])
            ->assertSessionHasErrors('entries');

        $this->assertDatabaseCount('tournament_result_revisions', 0);
    }

    public function test_only_active_creator_can_submit_initial_results_and_core_cannot_submit_revision_one(): void
    {
        [$tournament, $teams] = $this->completedTournamentWithTeams(1);
        $payload = ['entries' => $this->entries($teams, ['1st'])];
        $otherLeader = User::factory()->create(['status' => 'active']);
        CampusAffiliation::query()->create([
            'campus_id' => $this->campus->id,
            'user_id' => $otherLeader->id,
            'role' => 'student_leader',
            'status' => 'active',
        ]);

        $this->actingAs($otherLeader)
            ->post(route('campus-tournaments.results.store', $tournament), $payload)
            ->assertForbidden();
        $this->actingAs($this->regionalAdmin)
            ->post(route('campus-tournaments.results.store', $tournament), $payload)
            ->assertForbidden();
        $this->actingAs($this->core)
            ->post(route('campus-tournaments.results.store', $tournament), $payload)
            ->assertForbidden();

        CampusAffiliation::query()->where('user_id', $this->leader->id)->update(['status' => 'revoked']);
        $this->actingAs($this->leader)
            ->post(route('campus-tournaments.results.store', $tournament), $payload)
            ->assertForbidden();
        $this->assertDatabaseCount('tournament_result_revisions', 0);
    }

    public function test_creator_and_core_corrections_require_reasons_and_preserve_previous_revisions(): void
    {
        [$tournament, $teams] = $this->completedTournamentWithTeams(2);
        $this->actingAs($this->leader)->post(route('campus-tournaments.results.store', $tournament), [
            'entries' => $this->entries($teams, ['1st', '2nd']),
        ]);

        $this->actingAs($this->leader)->post(route('campus-tournaments.results.correct', $tournament), [
            'entries' => $this->entries($teams, ['2nd', '1st']),
        ])->assertSessionHasErrors('reason');

        $this->actingAs($this->core)->post(route('campus-tournaments.results.correct', $tournament), [
            'reason' => 'Corrected the declared final match winner.',
            'entries' => $this->entries($teams, ['2nd', '1st']),
        ])->assertRedirect();

        $this->actingAs($this->leader)->post(route('campus-tournaments.results.correct', $tournament), [
            'reason' => 'Recorded the confirmed tied placement.',
            'entries' => $this->entries($teams, ['1st', '1st']),
        ])->assertRedirect();

        $tournament->refresh();
        $this->assertSame(3, $tournament->resultRevisions()->count());
        $this->assertSame(3, $tournament->currentResultRevision->version);
        $this->assertSame('Recorded the confirmed tied placement.', $tournament->currentResultRevision->reason);
        $this->assertSame(
            ['1st', '2nd'],
            TournamentResultRevision::query()->where('version', 1)->firstOrFail()
                ->entries()->orderBy('team_id')->pluck('placement_code')->all(),
        );
        $this->assertSame(
            ['2nd', '1st'],
            TournamentResultRevision::query()->where('version', 2)->firstOrFail()
                ->entries()->orderBy('team_id')->pluck('placement_code')->all(),
        );
        $this->assertSame(
            ['1st', '1st'],
            $tournament->currentResultRevision->entries()->orderBy('team_id')->pluck('placement_code')->all(),
        );

        $this->actingAs($this->regionalAdmin)->post(route('campus-tournaments.results.correct', $tournament), [
            'reason' => 'RA should be read only.',
            'entries' => $this->entries($teams, ['1st', '2nd']),
        ])->assertForbidden();
    }

    public function test_repeated_initial_submission_is_rejected_without_creating_another_revision(): void
    {
        [$tournament, $teams] = $this->completedTournamentWithTeams(1);
        $payload = ['entries' => $this->entries($teams, ['1st'])];

        $this->actingAs($this->leader)
            ->post(route('campus-tournaments.results.store', $tournament), $payload)
            ->assertRedirect();
        $this->actingAs($this->leader)
            ->post(route('campus-tournaments.results.store', $tournament), $payload)
            ->assertStatus(409);

        $this->assertDatabaseCount('tournament_result_revisions', 1);
    }

    public function test_report_access_and_permissions_are_scoped_to_creator_official_ra_and_core(): void
    {
        [$tournament, $teams] = $this->completedTournamentWithTeams(1);
        $this->actingAs($this->leader)->post(route('campus-tournaments.results.store', $tournament), [
            'entries' => $this->entries($teams, ['1st']),
        ]);

        $this->actingAs($this->leader)
            ->get(route('campus-tournaments.report', $tournament))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Programs/CampusTournaments/PostEventReport')
                ->where('viewerRole', 'student_leader')
                ->where('permissions.canSubmit', false)
                ->where('permissions.canCorrect', true)
                ->where('permissions.canExport', true)
                ->where('tournament.currentResult.version', 1)
                ->has('tournament.teams', 1)
                ->has('tournament.teams.0.players', 5));

        $this->actingAs($this->regionalAdmin)
            ->get(route('campus-tournaments.report', $tournament))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('viewerRole', 'regional_admin')
                ->where('permissions.canCorrect', false)
                ->where('permissions.canExport', true));

        $this->actingAs($this->core)
            ->get(route('campus-tournaments.report', $tournament))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('viewerRole', 'core')
                ->where('permissions.canCorrect', true));

        $ordinary = User::factory()->create(['status' => 'active']);
        $this->actingAs($ordinary)->get(route('campus-tournaments.report', $tournament))->assertForbidden();

        $otherRegion = Region::query()->create([
            'code' => '01',
            'name' => 'Ilocos Region',
            'region_number' => 'I',
            'acronym' => 'R1',
            'island_code' => 'luzon',
        ]);
        $wrongAdmin = User::factory()->create(['status' => 'active']);
        RegionAdmin::query()->create([
            'region_code' => $otherRegion->code,
            'user_id' => $wrongAdmin->id,
            'assigned_at' => now(),
        ]);
        $this->actingAs($wrongAdmin)->get(route('campus-tournaments.report', $tournament))->assertForbidden();
    }

    public function test_excel_export_uses_current_revision_and_historical_player_snapshots(): void
    {
        [$tournament, $teams] = $this->completedTournamentWithTeams(2);
        $this->actingAs($this->leader)->post(route('campus-tournaments.results.store', $tournament), [
            'entries' => $this->entries($teams, ['1st', 'participant']),
        ]);

        $captain = TournamentParticipant::query()->where('team_id', $teams[0]->id)->where('roster_role', 'captain')->firstOrFail()->user;
        $captain->update(['ml_ign' => 'Changed After Submission']);

        $response = $this->actingAs($this->regionalAdmin)
            ->get(route('campus-tournaments.results.export', $tournament));
        $response->assertOk()
            ->assertHeader('content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        $this->assertStringContainsString(
            'Tournament_Results_los_banos_',
            (string) $response->headers->get('content-disposition'),
        );

        $path = tempnam(sys_get_temp_dir(), 'msl-results-').'.xlsx';
        file_put_contents($path, $response->streamedContent());
        $spreadsheet = IOFactory::load($path);
        $sheet = $spreadsheet->getActiveSheet();

        $this->assertSame('LSPU Post-Event Cup', $sheet->getCell('B1')->getValue());
        $this->assertSame('2 registered teams', $sheet->getCell('B10')->getValue());
        $this->assertSame('Rank', $sheet->getCell('A13')->getValue());
        $this->assertSame('1st', $sheet->getCell('A14')->getValue());
        $this->assertSame('Original IGN 1-1', $sheet->getCell('D14')->getValue());
        $this->assertNotSame('Changed After Submission', $sheet->getCell('D14')->getValue());

        $spreadsheet->disconnectWorksheets();
        unlink($path);
    }

    public function test_result_revisions_and_entries_cannot_be_updated_or_deleted(): void
    {
        [$tournament, $teams] = $this->completedTournamentWithTeams(1);
        $this->actingAs($this->leader)->post(route('campus-tournaments.results.store', $tournament), [
            'entries' => $this->entries($teams, ['1st']),
        ]);

        $revision = TournamentResultRevision::query()->firstOrFail();
        $entry = TournamentResultEntry::query()->firstOrFail();

        try {
            $revision->update(['reason' => 'Mutated']);
            $this->fail('Updating a result revision should fail.');
        } catch (LogicException) {
            $this->assertNull($revision->fresh()->reason);
        }

        $this->expectException(LogicException::class);
        $entry->delete();
    }

    private function completedTournamentWithTeams(int $teamCount): array
    {
        $tournament = CampusTournament::query()->create([
            'campus_id' => $this->campus->id,
            'created_by_user_id' => $this->leader->id,
            'name' => 'LSPU Post-Event Cup',
            'tournament_type_code' => 'online',
            'approval_status' => CampusTournamentApprovalStatus::Approved,
            'registration_opens_at' => now()->subDays(10),
            'registration_closes_at' => now()->subDays(7),
            'starts_at' => now()->subDays(2),
            'ends_at' => now()->subHour(),
            'roster_locked_at' => now()->subDays(7),
        ]);

        $teams = collect(range(1, $teamCount))->map(
            fn (int $number): TournamentTeam => $this->registeredTeam($tournament, $number),
        );

        return [$tournament, $teams];
    }

    private function registeredTeam(CampusTournament $tournament, int $number): TournamentTeam
    {
        $players = collect(range(1, 5))->map(fn (int $playerNumber): User => User::factory()->create([
            'status' => 'active',
            'name' => "Player {$number}-{$playerNumber}",
            'ml_ign' => "Original IGN {$number}-{$playerNumber}",
            'ml_server' => (string) (1000 + $number),
            'ml_id' => (string) (900000 + ($number * 10) + $playerNumber),
        ]));
        $captain = $players->first();
        $team = TournamentTeam::query()->create([
            'tournament_id' => $tournament->id,
            'name' => "Registered Team {$number}",
            'active_name' => "Registered Team {$number}",
            'formation_method' => TeamFormationMethod::Premade,
            'status' => TeamStatus::Registered,
            'captain_user_id' => $captain->id,
            'registered_at' => now()->subDays(7),
        ]);
        $lanes = ['jungler', 'roam', 'gold_laner', 'exp_laner', 'mid_laner'];

        $players->each(function (User $player, int $index) use ($lanes, $team, $tournament): void {
            TournamentParticipant::query()->create([
                'tournament_id' => $tournament->id,
                'user_id' => $player->id,
                'team_id' => $team->id,
                'entry_method' => TeamFormationMethod::Premade,
                'roster_role' => $index === 0 ? 'captain' : 'member',
                'assigned_lane_role_code' => $lanes[$index],
                'status' => ParticipantStatus::Active,
                'registered_at' => now()->subDays(8),
                'accepted_at' => now()->subDays(8),
            ]);
        });

        return $team;
    }

    private function entries($teams, array $placements): array
    {
        return $teams->values()->map(fn (TournamentTeam $team, int $index): array => [
            'team_id' => $team->id,
            'placement_code' => $placements[$index],
        ])->all();
    }
}
