<?php

namespace Tests\Feature;

use App\Enums\CampusTournamentApprovalStatus;
use App\Enums\ParticipantStatus;
use App\Enums\TeamFormationMethod;
use App\Enums\TeamStatus;
use App\Models\Campus;
use App\Models\CampusTournament;
use App\Models\CampusType;
use App\Models\City;
use App\Models\Institution;
use App\Models\Island;
use App\Models\Region;
use App\Models\RegionAdmin;
use App\Models\TournamentParticipant;
use App\Models\TournamentTeam;
use App\Models\User;
use Carbon\CarbonImmutable;
use Database\Seeders\TournamentReferenceSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Tests\TestCase;

class CampusTournamentRegistrationExportTest extends TestCase
{
    use RefreshDatabase;

    private User $regionalAdmin;

    private Campus $campus;

    private Campus $otherCampus;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(TournamentReferenceSeeder::class);

        $luzon = Island::query()->create(['code' => 'luzon', 'name' => 'Luzon']);
        $visayas = Island::query()->create(['code' => 'visayas', 'name' => 'Visayas']);
        $calabarzon = Region::query()->create([
            'code' => '04A',
            'name' => 'CALABARZON',
            'region_number' => 'IV-A',
            'acronym' => '04A',
            'island_code' => $luzon->code,
        ]);
        $westernVisayas = Region::query()->create([
            'code' => '06',
            'name' => 'Western Visayas',
            'region_number' => 'VI',
            'acronym' => '06',
            'island_code' => $visayas->code,
        ]);
        $losBanos = City::query()->create([
            'code' => '043426000',
            'name' => 'Los Baños',
            'region_code' => $calabarzon->code,
        ]);
        $iloilo = City::query()->create([
            'code' => '063022000',
            'name' => 'Iloilo City',
            'region_code' => $westernVisayas->code,
        ]);
        $campusType = CampusType::query()->create([
            'code' => 'satellite',
            'name' => 'Satellite Campus',
        ]);
        $lspu = Institution::query()->create([
            'name' => 'Laguna State Polytechnic University',
            'slug' => 'lspu',
            'status' => 'active',
        ]);
        $idc = Institution::query()->create([
            'name' => 'Iloilo Doctors College',
            'slug' => 'idc',
            'status' => 'active',
        ]);
        $this->campus = Campus::query()->create([
            'institution_id' => $lspu->id,
            'campus_type_id' => $campusType->id,
            'name' => 'Los Baños',
            'city_code' => $losBanos->code,
            'status' => 'active',
        ]);
        $this->otherCampus = Campus::query()->create([
            'institution_id' => $idc->id,
            'campus_type_id' => $campusType->id,
            'name' => 'Main',
            'city_code' => $iloilo->code,
            'status' => 'active',
        ]);

        $this->regionalAdmin = User::factory()->create(['status' => 'active']);
        RegionAdmin::query()->create([
            'region_code' => $calabarzon->code,
            'user_id' => $this->regionalAdmin->id,
            'assigned_at' => now(),
        ]);
    }

    public function test_regional_admin_exports_in_region_registration_activity_as_a_typed_workbook(): void
    {
        $tournament = $this->approvedTournament($this->campus);
        $registeredTeam = $this->team($tournament, 'Registered Team', TeamStatus::Registered);
        $assemblingTeam = $this->team($tournament, 'Assembling Team', TeamStatus::Assembling);

        $captain = $this->participant(
            $tournament,
            $registeredTeam,
            'Captain Player',
            'captain',
            '2026-08-01 00:00:00',
            '=FORMULA()',
            '00381',
            '00400738776',
        );
        $this->participant(
            $tournament,
            $registeredTeam,
            'Member Player',
            'member',
            '2026-08-31 23:59:59',
        );
        $this->participant(
            $tournament,
            $assemblingTeam,
            'Assembling Player',
            'captain',
            '2026-08-15 12:00:00',
        );

        $response = $this->actingAs($this->regionalAdmin)->get(route(
            'campus-tournaments.registrations.export',
            ['campus_id' => 'all', 'start_date' => '2026-08-01', 'end_date' => '2026-08-31'],
        ));

        $response->assertOk()
            ->assertHeader('content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            ->assertHeader('pragma', 'no-cache');
        $cacheControl = (string) $response->headers->get('cache-control');
        foreach (['private', 'no-store', 'no-cache', 'must-revalidate'] as $directive) {
            $this->assertStringContainsString($directive, $cacheControl);
        }
        $this->assertStringContainsString(
            'PreReg_All_2026-08-01_to_2026-08-31.xlsx',
            (string) $response->headers->get('content-disposition'),
        );

        $path = tempnam(sys_get_temp_dir(), 'msl-registration-export-').'.xlsx';
        file_put_contents($path, $response->streamedContent());
        $spreadsheet = IOFactory::load($path);
        $sheet = $spreadsheet->getSheetByName('PreReg');

        $this->assertNotNull($sheet);
        $this->assertIsFloat($sheet->getCell('B1')->getValue());
        $this->assertSame('mmmm d, yyyy', $sheet->getStyle('B1')->getNumberFormat()->getFormatCode());
        $this->assertSame(
            ['Island', 'School', 'Team Name', 'Player Name', 'IGN', 'Server', 'UID'],
            $sheet->rangeToArray('A4:G4', null, true, false)[0],
        );
        $this->assertSame('Luzon', $sheet->getCell('A5')->getValue());
        $this->assertSame('Laguna State Polytechnic University-Los Baños', $sheet->getCell('B5')->getValue());
        $this->assertSame('Assembling Team', $sheet->getCell('C5')->getValue());
        $this->assertSame('Registered Team', $sheet->getCell('C6')->getValue());
        $this->assertSame($captain->user->name, $sheet->getCell('D6')->getValue());
        $this->assertSame('=FORMULA()', $sheet->getCell('E6')->getValue());
        $this->assertSame(DataType::TYPE_STRING, $sheet->getCell('E6')->getDataType());
        $this->assertSame('00381', $sheet->getCell('F6')->getValue());
        $this->assertSame('00400738776', $sheet->getCell('G6')->getValue());
        $this->assertSame(7, $sheet->getHighestRow());

        $spreadsheet->disconnectWorksheets();
        unlink($path);
    }

    public function test_export_excludes_other_regions_dates_and_inactive_participant_or_team_states(): void
    {
        $tournament = $this->approvedTournament($this->campus);
        $team = $this->team($tournament, 'Included Team', TeamStatus::Registered);
        $this->participant($tournament, $team, 'Included Player', 'captain', '2026-08-10 10:00:00');
        $this->participant($tournament, $team, 'Too Early', 'member', '2026-07-31 23:59:59');
        $this->participant($tournament, $team, 'Too Late', 'member', '2026-09-01 00:00:00');
        $this->participant(
            $tournament,
            $team,
            'Withdrawn Player',
            'member',
            '2026-08-11 10:00:00',
            status: ParticipantStatus::Withdrawn,
        );

        $withdrawnTeam = $this->team($tournament, 'Withdrawn Team', TeamStatus::Withdrawn);
        $this->participant($tournament, $withdrawnTeam, 'Withdrawn Team Player', 'captain', '2026-08-12 10:00:00');

        $otherTournament = $this->approvedTournament($this->otherCampus);
        $otherTeam = $this->team($otherTournament, 'Other Region Team', TeamStatus::Registered);
        $this->participant($otherTournament, $otherTeam, 'Other Region Player', 'captain', '2026-08-13 10:00:00');

        $response = $this->actingAs($this->regionalAdmin)->get(route(
            'campus-tournaments.registrations.export',
            ['campus_id' => 'all', 'start_date' => '2026-08-01', 'end_date' => '2026-08-31'],
        ));

        $path = tempnam(sys_get_temp_dir(), 'msl-registration-filter-').'.xlsx';
        file_put_contents($path, $response->streamedContent());
        $spreadsheet = IOFactory::load($path);
        $sheet = $spreadsheet->getActiveSheet();

        $this->assertSame(5, $sheet->getHighestRow());
        $this->assertSame('Included Player', $sheet->getCell('D5')->getValue());

        $spreadsheet->disconnectWorksheets();
        unlink($path);
    }

    public function test_campus_filter_filename_validation_empty_results_and_authorization(): void
    {
        $tournament = $this->approvedTournament($this->campus);
        $team = $this->team($tournament, 'Filtered Team', TeamStatus::Assembling);
        $this->participant($tournament, $team, 'Filtered Player', 'captain', '2026-08-10 10:00:00');

        $query = [
            'campus_id' => (string) $this->campus->id,
            'start_date' => '2026-08-01',
            'end_date' => '2026-08-31',
        ];
        $response = $this->actingAs($this->regionalAdmin)
            ->get(route('campus-tournaments.registrations.export', $query));
        $response->assertOk();
        $this->assertStringContainsString(
            'PreReg_laguna_state_polytechnic_university_los_banos_2026-08-01_to_2026-08-31.xlsx',
            (string) $response->headers->get('content-disposition'),
        );

        $this->actingAs($this->regionalAdmin)
            ->get(route('campus-tournaments.registrations.export', [
                'campus_id' => (string) $this->otherCampus->id,
                'start_date' => '2026-08-01',
                'end_date' => '2026-08-31',
            ]))
            ->assertSessionHasErrors('campus_id');

        $this->actingAs($this->regionalAdmin)
            ->get(route('campus-tournaments.registrations.export', [
                'campus_id' => 'all',
                'start_date' => '2026-09-01',
                'end_date' => '2026-08-01',
            ]))
            ->assertSessionHasErrors('end_date');

        $this->actingAs($this->regionalAdmin)
            ->getJson(route('campus-tournaments.registrations.export', [
                'campus_id' => 'all',
                'start_date' => '2026-09-01',
                'end_date' => '2026-09-30',
            ]))
            ->assertStatus(409)
            ->assertJsonPath(
                'message',
                'No registrations were found for the selected school and date range.',
            );

        $this->app['auth']->logout();
        $this->get(route('campus-tournaments.registrations.export', $query))
            ->assertRedirect(route('login'));
        $this->actingAs(User::factory()->create(['status' => 'active']))
            ->get(route('campus-tournaments.registrations.export', $query))
            ->assertForbidden();

        $this->regionalAdmin->update(['status' => 'inactive']);
        $this->actingAs($this->regionalAdmin)
            ->get(route('campus-tournaments.registrations.export', $query))
            ->assertForbidden();
    }

    private function approvedTournament(Campus $campus): CampusTournament
    {
        return CampusTournament::query()->create([
            'campus_id' => $campus->id,
            'created_by_user_id' => User::factory()->create(['status' => 'active'])->id,
            'name' => $campus->name.' Registration Cup',
            'tournament_type_code' => 'online',
            'approval_status' => CampusTournamentApprovalStatus::Approved,
            'registration_opens_at' => CarbonImmutable::parse('2026-08-01 00:00:00', 'Asia/Manila')->utc(),
            'registration_closes_at' => CarbonImmutable::parse('2026-09-01 00:00:00', 'Asia/Manila')->utc(),
            'starts_at' => CarbonImmutable::parse('2026-09-02 00:00:00', 'Asia/Manila')->utc(),
            'ends_at' => CarbonImmutable::parse('2026-09-03 00:00:00', 'Asia/Manila')->utc(),
        ]);
    }

    private function team(CampusTournament $tournament, string $name, TeamStatus $status): TournamentTeam
    {
        $captain = User::factory()->create(['status' => 'active']);

        return TournamentTeam::query()->create([
            'tournament_id' => $tournament->id,
            'name' => $name,
            'active_name' => $name,
            'formation_method' => TeamFormationMethod::Premade,
            'status' => $status,
            'captain_user_id' => $captain->id,
            'registered_at' => $status === TeamStatus::Registered ? now() : null,
        ]);
    }

    private function participant(
        CampusTournament $tournament,
        TournamentTeam $team,
        string $name,
        string $rosterRole,
        string $registeredAt,
        string $ign = 'Player IGN',
        string $server = '1234',
        ?string $uid = null,
        ParticipantStatus $status = ParticipantStatus::Active,
    ): TournamentParticipant {
        $attributes = [
            'status' => 'active',
            'name' => $name,
            'ml_ign' => $ign,
            'ml_server' => $server,
        ];
        if ($uid !== null) {
            $attributes['ml_id'] = $uid;
        }
        $user = User::factory()->create($attributes);

        $participant = TournamentParticipant::query()->create([
            'tournament_id' => $tournament->id,
            'user_id' => $user->id,
            'team_id' => $team->id,
            'entry_method' => TeamFormationMethod::Premade,
            'roster_role' => $rosterRole,
            'status' => $status,
            'registered_at' => CarbonImmutable::parse($registeredAt, 'Asia/Manila')->utc(),
            'accepted_at' => $status === ParticipantStatus::Active ? now() : null,
        ]);
        $participant->setRelation('user', $user);

        return $participant;
    }
}
