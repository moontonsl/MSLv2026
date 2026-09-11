<?php

namespace Tests\Feature;

use App\Enums\CampusTournamentApprovalStatus;
use App\Enums\InvitationStatus;
use App\Enums\ParticipantStatus;
use App\Enums\TeamFormationMethod;
use App\Enums\TeamStatus;
use App\Models\Barangay;
use App\Models\Campus;
use App\Models\CampusAffiliation;
use App\Models\CampusTournament;
use App\Models\CampusType;
use App\Models\City;
use App\Models\Institution;
use App\Models\Island;
use App\Models\Province;
use App\Models\Region;
use App\Models\RegionAdmin;
use App\Models\TournamentParticipant;
use App\Models\TournamentTeam;
use App\Models\TournamentTeamInvitation;
use App\Models\User;
use Database\Seeders\TournamentReferenceSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CampusTournamentFrontendWiringTest extends TestCase
{
    use RefreshDatabase;

    private Campus $campus;

    private User $studentLeader;

    private User $regionalAdmin;

    private User $superAdmin;

    private User $student;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(TournamentReferenceSeeder::class);

        $island = Island::query()->firstOrCreate(['code' => 'luzon'], ['name' => 'Luzon']);
        $region = Region::query()->firstOrCreate(
            ['code' => '04A'],
            [
                'name' => 'CALABARZON',
                'region_number' => 'IV-A',
                'acronym' => '04A',
                'island_code' => $island->code,
            ]
        );
        $province = Province::query()->firstOrCreate(
            ['code' => '434'],
            ['name' => 'Laguna', 'region_code' => $region->code]
        );
        $city = City::query()->firstOrCreate(
            ['code' => '043426000'],
            [
                'name' => 'Santa Cruz',
                'province_code' => $province->code,
                'region_code' => $region->code,
            ]
        );
        $barangay = Barangay::query()->firstOrCreate(
            ['code' => '043426001'],
            ['name' => 'Barangay 1', 'city_code' => $city->code]
        );

        $institution = Institution::query()->create([
            'name' => 'Laguna State Polytechnic University',
            'slug' => 'lspu-'.uniqid(),
            'status' => 'active',
        ]);

        $campusType = CampusType::query()->firstOrCreate(
            ['code' => 'main'],
            ['name' => 'Main Campus']
        );

        $this->campus = Campus::query()->create([
            'institution_id' => $institution->id,
            'campus_type_id' => $campusType->id,
            'name' => 'LSPU Santa Cruz',
            'city_code' => $city->code,
            'barangay_code' => $barangay->code,
            'status' => 'active',
        ]);

        $this->studentLeader = User::factory()->create(['status' => 'active']);
        CampusAffiliation::query()->create([
            'campus_id' => $this->campus->id,
            'user_id' => $this->studentLeader->id,
            'role' => 'student_leader',
            'status' => 'active',
            'started_at' => now()->subMonth(),
        ]);

        $this->regionalAdmin = User::factory()->create(['status' => 'active']);
        RegionAdmin::query()->create([
            'user_id' => $this->regionalAdmin->id,
            'region_code' => $region->code,
            'assigned_at' => now(),
        ]);

        $this->superAdmin = User::factory()->create([
            'status' => 'active',
            'user_type' => 'Super Admin',
        ]);

        $this->student = User::factory()->create(['status' => 'active']);
        CampusAffiliation::query()->create([
            'campus_id' => $this->campus->id,
            'user_id' => $this->student->id,
            'role' => 'student',
            'status' => 'active',
            'started_at' => now()->subMonth(),
        ]);
    }

    public function test_guest_is_redirected_to_login(): void
    {
        $this->get(route('campus.tournament'))->assertRedirect(route('login'));
        $this->get('/Tournament/SL')->assertRedirect(route('login'));
        $this->get('/Tournament/Organizer')->assertRedirect(route('login'));
        $this->get('/Tournament/CampusTournament')->assertRedirect(route('login'));
    }

    public function test_public_tournament_route_is_accessible_to_guests(): void
    {
        $this->get('/campus-tournament/public')->assertOk();
    }

    public function test_super_admin_and_regional_admin_redirect_to_regional_admin(): void
    {
        $this->actingAs($this->superAdmin)
            ->get(route('campus.tournament'))
            ->assertRedirect('/Tournament/RegionalAdmin');

        $this->actingAs($this->regionalAdmin)
            ->get(route('campus.tournament'))
            ->assertRedirect('/Tournament/RegionalAdmin');
    }

    public function test_student_leader_redirects_to_sl_view(): void
    {
        $this->actingAs($this->studentLeader)
            ->get(route('campus.tournament'))
            ->assertRedirect('/Tournament/SL');
    }

    public function test_default_student_redirects_to_captain_hub(): void
    {
        $this->actingAs($this->student)
            ->get(route('campus.tournament'))
            ->assertRedirect('/Tournament/CampusTournament');
    }

    public function test_solo_matchmaking_page_uses_real_open_tournament_and_team_data(): void
    {
        $tournament = $this->createApprovedTournament();
        $soloTeam = TournamentTeam::query()->create([
            'tournament_id' => $tournament->id,
            'name' => 'Solo Alpha',
            'active_name' => 'Solo Alpha',
            'formation_method' => TeamFormationMethod::Solo,
            'status' => TeamStatus::Assembling,
            'captain_user_id' => $this->student->id,
        ]);
        TournamentParticipant::query()->create([
            'tournament_id' => $tournament->id,
            'team_id' => $soloTeam->id,
            'user_id' => $this->student->id,
            'entry_method' => TeamFormationMethod::Solo,
            'roster_role' => 'captain',
            'preferred_lane_role_code' => 'jungler',
            'assigned_lane_role_code' => 'jungler',
            'status' => ParticipantStatus::Active,
            'registered_at' => now(),
            'accepted_at' => now(),
        ]);

        $this->actingAs($this->student)
            ->get(route('campus.tournament.solo.player', ['tournament' => $tournament->id]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Programs/CampusTournaments/SoloMatchmaking')
                ->where('tournament.id', $tournament->id)
                ->where('tournament.title', 'LSPU Championship')
                ->where('canCreateTeam', false)
                ->has('availableTournaments', 1)
                ->has('teams', 1)
                ->where('teams.0.id', $soloTeam->id)
                ->where('teams.0.joined', true)
                ->where('teams.0.locked_lane_role', 'jungler')
                ->where('teams.0.participant_id', fn ($value) => is_int($value))
            );
    }

    public function test_solo_matchmaking_page_has_an_empty_state_without_an_open_tournament(): void
    {
        $this->actingAs($this->student)
            ->get(route('campus.tournament.solo.player'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Programs/CampusTournaments/SoloMatchmaking')
                ->where('tournament', null)
                ->where('canCreateTeam', false)
                ->has('availableTournaments', 0)
                ->has('teams', 0)
            );
    }

    public function test_solo_matchmaking_rejects_a_tournament_outside_the_users_campus(): void
    {
        $tournament = $this->createApprovedTournament();
        $outsider = User::factory()->create(['status' => 'active']);

        $this->actingAs($outsider)
            ->get(route('campus.tournament.solo.player', ['tournament' => $tournament->id]))
            ->assertNotFound();
    }

    public function test_active_captain_redirects_to_captain_team(): void
    {
        $tournament = $this->createApprovedTournament();

        TournamentTeam::query()->create([
            'tournament_id' => $tournament->id,
            'name' => 'Team Alpha',
            'active_name' => 'Team Alpha',
            'formation_method' => TeamFormationMethod::Premade,
            'status' => TeamStatus::Assembling,
            'captain_user_id' => $this->student->id,
        ]);

        $this->actingAs($this->student)
            ->get(route('campus.tournament'))
            ->assertRedirect('/Tournament/CampusTournamentTeam');
    }

    public function test_solo_assembling_player_redirects_to_solo_player(): void
    {
        $tournament = $this->createApprovedTournament();

        $soloTeam = TournamentTeam::query()->create([
            'tournament_id' => $tournament->id,
            'name' => 'Solo Team Alpha',
            'active_name' => 'Solo Team Alpha',
            'formation_method' => TeamFormationMethod::Solo,
            'status' => TeamStatus::Assembling,
            'captain_user_id' => $this->student->id,
        ]);

        TournamentParticipant::query()->create([
            'tournament_id' => $tournament->id,
            'team_id' => $soloTeam->id,
            'user_id' => $this->student->id,
            'entry_method' => TeamFormationMethod::Solo,
            'assigned_lane_role_code' => 'jungler',
            'status' => ParticipantStatus::Active,
            'registered_at' => now(),
        ]);

        $this->actingAs($this->student)
            ->get(route('campus.tournament'))
            ->assertRedirect('/Tournament/SoloPlayer');
    }

    public function test_student_with_pending_invitation_redirects_to_member_invite(): void
    {
        $tournament = $this->createApprovedTournament();

        $captain = User::factory()->create(['status' => 'active']);
        $team = TournamentTeam::query()->create([
            'tournament_id' => $tournament->id,
            'name' => 'Team Beta',
            'active_name' => 'Team Beta',
            'formation_method' => TeamFormationMethod::Premade,
            'status' => TeamStatus::Assembling,
            'captain_user_id' => $captain->id,
        ]);

        TournamentTeamInvitation::query()->create([
            'team_id' => $team->id,
            'invited_user_id' => $this->student->id,
            'invited_by_user_id' => $captain->id,
            'intended_lane_role_code' => 'roam',
            'status' => InvitationStatus::Pending,
            'expires_at' => now()->addDay(),
        ]);

        $this->actingAs($this->student)
            ->get(route('campus.tournament'))
            ->assertRedirect('/Tournament/MemberInvite');
    }

    public function test_member_invitation_page_uses_real_pending_invitation_data(): void
    {
        $tournament = $this->createApprovedTournament();
        $captain = User::factory()->create([
            'status' => 'active',
            'name' => 'Captain One',
            'ml_ign' => 'CAPTAINIGN',
        ]);
        $team = TournamentTeam::query()->create([
            'tournament_id' => $tournament->id,
            'name' => 'Team Beta',
            'active_name' => 'Team Beta',
            'formation_method' => TeamFormationMethod::Premade,
            'status' => TeamStatus::Assembling,
            'captain_user_id' => $captain->id,
        ]);
        TournamentParticipant::query()->create([
            'tournament_id' => $tournament->id,
            'team_id' => $team->id,
            'user_id' => $captain->id,
            'entry_method' => TeamFormationMethod::Premade,
            'roster_role' => 'captain',
            'assigned_lane_role_code' => 'jungler',
            'status' => ParticipantStatus::Active,
            'registered_at' => now(),
            'accepted_at' => now(),
        ]);
        $invitation = TournamentTeamInvitation::query()->create([
            'team_id' => $team->id,
            'invited_user_id' => $this->student->id,
            'invited_by_user_id' => $captain->id,
            'intended_lane_role_code' => 'roam',
            'status' => InvitationStatus::Pending,
            'expires_at' => now()->addDay(),
        ]);

        $this->actingAs($this->student)
            ->get(route('campus.member.invite'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Programs/CampusTournaments/MemberInvite')
                ->has('invitations', 1)
                ->where('invitations.0.id', $invitation->id)
                ->where('invitations.0.laneRoleCode', 'roam')
                ->where('invitations.0.team.name', 'Team Beta')
                ->where('invitations.0.team.captain.name', 'Captain One')
            );
    }

    public function test_expired_invitation_is_not_shown_or_used_for_role_redirect(): void
    {
        $tournament = $this->createApprovedTournament();
        $captain = User::factory()->create(['status' => 'active']);
        $team = TournamentTeam::query()->create([
            'tournament_id' => $tournament->id,
            'name' => 'Expired Team',
            'active_name' => 'Expired Team',
            'formation_method' => TeamFormationMethod::Premade,
            'status' => TeamStatus::Assembling,
            'captain_user_id' => $captain->id,
        ]);
        TournamentTeamInvitation::query()->create([
            'team_id' => $team->id,
            'invited_user_id' => $this->student->id,
            'invited_by_user_id' => $captain->id,
            'intended_lane_role_code' => 'roam',
            'status' => InvitationStatus::Pending,
            'expires_at' => now()->subMinute(),
        ]);

        $this->actingAs($this->student)
            ->get(route('campus.member.invite'))
            ->assertInertia(fn (Assert $page) => $page->has('invitations', 0));

        $this->actingAs($this->student)
            ->get(route('campus.tournament'))
            ->assertRedirect('/Tournament/CampusTournament');
    }

    public function test_invitation_for_closed_registration_is_not_shown(): void
    {
        $tournament = $this->createApprovedTournament();
        $tournament->update([
            'registration_opens_at' => now()->subDays(2),
            'registration_closes_at' => now()->subDay(),
            'starts_at' => now()->addDay(),
            'ends_at' => now()->addDays(2),
        ]);
        $captain = User::factory()->create(['status' => 'active']);
        $team = TournamentTeam::query()->create([
            'tournament_id' => $tournament->id,
            'name' => 'Closed Registration Team',
            'active_name' => 'Closed Registration Team',
            'formation_method' => TeamFormationMethod::Premade,
            'status' => TeamStatus::Assembling,
            'captain_user_id' => $captain->id,
        ]);
        TournamentTeamInvitation::query()->create([
            'team_id' => $team->id,
            'invited_user_id' => $this->student->id,
            'invited_by_user_id' => $captain->id,
            'intended_lane_role_code' => 'roam',
            'status' => InvitationStatus::Pending,
            'expires_at' => now()->addDay(),
        ]);

        $this->actingAs($this->student)
            ->get(route('campus.member.invite'))
            ->assertInertia(fn (Assert $page) => $page->has('invitations', 0));
    }

    public function test_organizer_view_renders_inertia_with_proper_props(): void
    {
        $this->actingAs($this->studentLeader)
            ->get(route('campus.tournament.organizer'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Programs/CampusTournaments/OrganizerView')
                ->has('pendingRequests')
                ->has('rejectedRequests')
                ->has('tournaments')
            );
    }

    public function test_sl_view_renders_for_reviewer_and_student_leader(): void
    {
        $this->actingAs($this->regionalAdmin)
            ->get('/Tournament/RegionalAdmin')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Programs/CampusTournaments/SlView')
                ->where('isReviewer', true)
                ->has('approvalRequests')
                ->has('tournaments')
            );

        $this->actingAs($this->studentLeader)
            ->get('/Tournament/SL')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Programs/CampusTournaments/SlView')
                ->where('isReviewer', false)
                ->has('approvalRequests')
                ->has('tournaments')
            );
    }

    public function test_student_leader_can_create_tournament_with_defaulted_registration_window(): void
    {
        $response = $this->actingAs($this->studentLeader)->post('/campus-tournaments', [
            'mode' => 'Online',
            'startDate' => now()->addDays(5)->format('Y-m-d'),
            'endDate' => now()->addDays(7)->format('Y-m-d'),
        ]);

        $response->assertRedirect();

        $created = CampusTournament::query()->latest('id')->firstOrFail();

        $this->assertSame($this->campus->id, $created->campus_id);
        $this->assertSame('online', $created->tournament_type_code);
        $this->assertSame(CampusTournamentApprovalStatus::Pending, $created->approval_status);
        $this->assertNotNull($created->registration_opens_at);
        $this->assertNotNull($created->registration_closes_at);
        $this->assertTrue($created->registration_opens_at->lt($created->registration_closes_at));
        $this->assertTrue($created->registration_closes_at->lessThanOrEqualTo($created->starts_at));
    }

    private function createApprovedTournament(): CampusTournament
    {
        return CampusTournament::query()->create([
            'campus_id' => $this->campus->id,
            'created_by_user_id' => $this->studentLeader->id,
            'name' => 'LSPU Championship',
            'tournament_type_code' => 'online',
            'approval_status' => CampusTournamentApprovalStatus::Approved,
            'registration_opens_at' => now()->subDays(2),
            'registration_closes_at' => now()->addDays(3),
            'starts_at' => now()->addDays(4),
            'ends_at' => now()->addDays(6),
        ]);
    }
}
