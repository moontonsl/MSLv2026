<?php

namespace Database\Seeders;

use App\Enums\CampusTournamentApprovalStatus;
use App\Enums\CampusTournamentReviewDecision;
use App\Enums\ParticipantStatus;
use App\Enums\TeamFormationMethod;
use App\Enums\TeamStatus;
use App\Models\Campus;
use App\Models\CampusAffiliation;
use App\Models\CampusTournament;
use App\Models\CampusTournamentReview;
use App\Models\CampusTournamentSubmission;
use App\Models\CampusType;
use App\Models\Institution;
use App\Models\TournamentParticipant;
use App\Models\TournamentTeam;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class CampusTournamentDeploymentTestSeeder extends Seeder
{
    private const FIXTURE_PREFIX = '[TEST] ';

    private const LANE_ROLES = [
        'jungler',
        'roam',
        'gold_laner',
        'exp_laner',
        'mid_laner',
    ];

    public function run(): void
    {
        $this->assertExplicitlyEnabled();

        $this->call(CampusTournamentSeeder::class);

        $fixtures = DB::transaction(function (): array {
            $now = CarbonImmutable::now('UTC')->startOfMinute();
            $institution = Institution::query()
                ->where('name', 'Laguna State Polytechnic University')
                ->firstOrFail();
            $primaryCampus = Campus::query()
                ->where('institution_id', $institution->id)
                ->where('name', 'Los Baños Campus')
                ->firstOrFail();
            $campusType = CampusType::query()->where('code', 'suc_satellite')->firstOrFail();
            $regionalAdmin = User::query()->where('username', 'lspu_regional_admin')->firstOrFail();
            $studentLeader = User::query()->where('username', 'lspu_student_leader')->firstOrFail();

            $operationsCampus = Campus::query()->updateOrCreate(
                [
                    'institution_id' => $institution->id,
                    'name' => '[TEST] Operations Campus',
                ],
                [
                    'campus_type_id' => $campusType->id,
                    'city_code' => $primaryCampus->city_code,
                    'barangay_code' => $primaryCampus->barangay_code,
                    'address_line' => null,
                    'status' => 'active',
                ],
            );

            $this->affiliateStudentLeader($operationsCampus, $studentLeader, $regionalAdmin);

            $completed = $this->createTournament(
                campus: $primaryCampus,
                creator: $studentLeader,
                reviewer: $regionalAdmin,
                name: self::FIXTURE_PREFIX.'Completed - Report Ready',
                status: CampusTournamentApprovalStatus::Approved,
                dates: [
                    'registration_opens_at' => $now->subDays(30),
                    'registration_closes_at' => $now->subDays(25),
                    'starts_at' => $now->subDays(20),
                    'ends_at' => $now->subDays(19),
                ],
                rosterLockedAt: $now->subDays(25),
            );

            $registrationOpen = $this->createTournament(
                campus: $primaryCampus,
                creator: $studentLeader,
                reviewer: $regionalAdmin,
                name: self::FIXTURE_PREFIX.'Registration Open',
                status: CampusTournamentApprovalStatus::Approved,
                dates: [
                    'registration_opens_at' => $now->subDay(),
                    'registration_closes_at' => $now->addDays(2),
                    'starts_at' => $now->addDays(3),
                    'ends_at' => $now->addDays(4),
                ],
            );

            $pending = $this->createTournament(
                campus: $primaryCampus,
                creator: $studentLeader,
                reviewer: $regionalAdmin,
                name: self::FIXTURE_PREFIX.'Pending Approval',
                status: CampusTournamentApprovalStatus::Pending,
                dates: [
                    'registration_opens_at' => $now->addDays(6),
                    'registration_closes_at' => $now->addDays(7),
                    'starts_at' => $now->addDays(8),
                    'ends_at' => $now->addDays(9),
                ],
            );

            $ongoing = $this->createTournament(
                campus: $operationsCampus,
                creator: $studentLeader,
                reviewer: $regionalAdmin,
                name: self::FIXTURE_PREFIX.'Ongoing Operations',
                status: CampusTournamentApprovalStatus::Approved,
                dates: [
                    'registration_opens_at' => $now->subDays(3),
                    'registration_closes_at' => $now->subDays(2),
                    'starts_at' => $now->subHour(),
                    'ends_at' => $now->addHours(5),
                ],
                rosterLockedAt: $now->subDays(2),
            );

            $this->createReportReadyTeams($completed);

            return compact('completed', 'registrationOpen', 'pending', 'ongoing');
        }, 3);

        $this->command?->info('Campus tournament deployment-test fixtures are ready.');
        $this->command?->warn('Disable CAMPUS_TOURNAMENT_TEST_SEEDING_ENABLED after seeding.');
        $this->command?->table(
            ['Scenario', 'Tournament ID', 'Tournament'],
            [
                ['RA approval/rejection', $fixtures['pending']->id, $fixtures['pending']->name],
                ['Premade and solo registration', $fixtures['registrationOpen']->id, $fixtures['registrationOpen']->name],
                ['SL/RA/Core ongoing view', $fixtures['ongoing']->id, $fixtures['ongoing']->name],
                ['Results, correction, and Excel', $fixtures['completed']->id, $fixtures['completed']->name],
            ],
        );
    }

    private function assertExplicitlyEnabled(): void
    {
        if (! config('campus-tournament.deployment_test_seeding.enabled', false)) {
            throw new RuntimeException(
                'Set CAMPUS_TOURNAMENT_TEST_SEEDING_ENABLED=true before running this opt-in test seeder.'
            );
        }

        $password = (string) config('campus-tournament.deployment_test_seeding.password');

        if (mb_strlen($password) < 12) {
            throw new RuntimeException(
                'CAMPUS_TOURNAMENT_TEST_PASSWORD must contain at least 12 characters.'
            );
        }
    }

    /**
     * @param  array{registration_opens_at: CarbonImmutable, registration_closes_at: CarbonImmutable, starts_at: CarbonImmutable, ends_at: CarbonImmutable}  $dates
     */
    private function createTournament(
        Campus $campus,
        User $creator,
        User $reviewer,
        string $name,
        CampusTournamentApprovalStatus $status,
        array $dates,
        ?CarbonImmutable $rosterLockedAt = null,
    ): CampusTournament {
        $tournament = CampusTournament::query()->firstOrCreate(
            [
                'campus_id' => $campus->id,
                'name' => $name,
            ],
            [
                'created_by_user_id' => $creator->id,
                'tournament_type_code' => 'online',
                'approval_status' => $status,
                ...$dates,
                'roster_locked_at' => $rosterLockedAt,
            ],
        );

        $submission = CampusTournamentSubmission::query()->firstOrCreate(
            [
                'tournament_id' => $tournament->id,
                'version' => 1,
            ],
            [
                'submitted_by_user_id' => $creator->id,
                'campus_id' => $campus->id,
                'name' => $tournament->name,
                'tournament_type_code' => $tournament->tournament_type_code,
                'registration_opens_at' => $tournament->registration_opens_at,
                'registration_closes_at' => $tournament->registration_closes_at,
                'starts_at' => $tournament->starts_at,
                'ends_at' => $tournament->ends_at,
                'submitted_at' => $tournament->created_at ?? now(),
            ],
        );

        if ($tournament->current_submission_id === null) {
            $tournament->current_submission_id = $submission->id;
            $tournament->save();
        }

        if ($status === CampusTournamentApprovalStatus::Approved) {
            CampusTournamentReview::query()->firstOrCreate(
                ['submission_id' => $submission->id],
                [
                    'tournament_id' => $tournament->id,
                    'reviewer_user_id' => $reviewer->id,
                    'decision' => CampusTournamentReviewDecision::Approved,
                    'reason' => 'Deployment test fixture approval.',
                ],
            );
        }

        return $tournament->refresh();
    }

    private function createReportReadyTeams(CampusTournament $tournament): void
    {
        $teamDefinitions = [
            'Bayani Five' => [
                'lspu_premade_captain',
                'lspu_premade_player_2',
                'lspu_premade_player_3',
                'lspu_premade_player_4',
                'lspu_premade_player_5',
            ],
            'Hiraya Five' => [
                'lspu_solo_player_1',
                'lspu_solo_player_2',
                'lspu_solo_player_3',
                'lspu_solo_player_4',
                'lspu_solo_player_5',
            ],
        ];

        foreach ($teamDefinitions as $teamName => $usernames) {
            $users = User::query()
                ->whereIn('username', $usernames)
                ->get()
                ->keyBy('username');

            if ($users->count() !== 5) {
                throw new RuntimeException("Unable to build {$teamName}; one or more fixture users are missing.");
            }

            $captain = $users->get($usernames[0]);
            $registrationClosedAt = $tournament->registration_closes_at->toImmutable();
            $team = TournamentTeam::query()->firstOrCreate(
                [
                    'tournament_id' => $tournament->id,
                    'active_name' => $teamName,
                ],
                [
                    'name' => $teamName,
                    'formation_method' => TeamFormationMethod::Premade,
                    'status' => TeamStatus::Registered,
                    'captain_user_id' => $captain->id,
                    'registered_at' => $registrationClosedAt->subDay(),
                ],
            );

            foreach ($usernames as $index => $username) {
                $user = $users->get($username);

                TournamentParticipant::query()->firstOrCreate(
                    [
                        'tournament_id' => $tournament->id,
                        'user_id' => $user->id,
                    ],
                    [
                        'team_id' => $team->id,
                        'entry_method' => TeamFormationMethod::Premade,
                        'roster_role' => $index === 0 ? 'captain' : 'member',
                        'preferred_lane_role_code' => self::LANE_ROLES[$index],
                        'assigned_lane_role_code' => self::LANE_ROLES[$index],
                        'status' => ParticipantStatus::Active,
                        'registered_at' => $registrationClosedAt->subDays(2)->addMinutes($index),
                        'accepted_at' => $registrationClosedAt->subDay(),
                    ],
                );
            }
        }
    }

    private function affiliateStudentLeader(Campus $campus, User $studentLeader, User $regionalAdmin): void
    {
        $affiliation = CampusAffiliation::query()->firstOrNew([
            'campus_id' => $campus->id,
            'user_id' => $studentLeader->id,
        ]);
        $affiliation->fill([
            'role' => 'student_leader',
            'status' => 'active',
            'ended_at' => null,
            'approved_by_user_id' => $regionalAdmin->id,
        ]);
        $affiliation->started_at ??= now();
        $affiliation->approved_at ??= now();
        $affiliation->save();
    }
}
