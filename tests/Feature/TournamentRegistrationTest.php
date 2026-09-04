<?php

namespace Tests\Feature;

use App\Enums\CampusTournamentApprovalStatus;
use App\Enums\InvitationStatus;
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
use App\Models\LaneRole;
use App\Models\Region;
use App\Models\TournamentParticipant;
use App\Models\TournamentTeam;
use App\Models\TournamentTeamInvitation;
use App\Models\User;
use Database\Seeders\TournamentReferenceSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TournamentRegistrationTest extends TestCase
{
    use RefreshDatabase;

    private CampusTournament $tournament;

    private User $student;

    private Campus $campus;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(TournamentReferenceSeeder::class);

        $this->campus = $this->createCampus();
        $this->student = $this->createEligibleUser();

        $this->tournament = CampusTournament::query()->create([
            'campus_id' => $this->campus->id,
            'created_by_user_id' => $this->student->id,
            'name' => 'Campus Cup 2026',
            'tournament_type_code' => 'online',
            'approval_status' => CampusTournamentApprovalStatus::Approved,
            'registration_opens_at' => now()->subDay(),
            'registration_closes_at' => now()->addDays(7),
            'starts_at' => now()->addDays(8),
            'ends_at' => now()->addDays(10),
        ]);
    }

    public function test_authenticated_user_can_create_premade_team_as_captain(): void
    {
        $response = $this->actingAs($this->student)->post(
            route('tournament.teams.store', $this->tournament),
            [
                'name' => 'Team Alpha',
                'discord_id' => 'alpha#1234',
                'assigned_lane_role_code' => 'jungler',
            ]
        );

        $response->assertRedirect();

        $team = TournamentTeam::query()->where('name', 'Team Alpha')->firstOrFail();
        $this->assertSame($this->tournament->id, $team->tournament_id);
        $this->assertSame($this->student->id, $team->captain_user_id);
        $this->assertSame(TeamStatus::Assembling, $team->status);

        $this->assertDatabaseHas('tournament_participants', [
            'tournament_id' => $this->tournament->id,
            'team_id' => $team->id,
            'user_id' => $this->student->id,
            'roster_role' => 'captain',
            'assigned_lane_role_code' => 'jungler',
            'status' => 'active',
        ]);
    }

    public function test_unauthenticated_user_cannot_register_team(): void
    {
        $this->post(route('tournament.teams.store', $this->tournament), [
            'name' => 'Team Alpha',
            'assigned_lane_role_code' => 'jungler',
        ])->assertRedirect(route('login'));
    }

    public function test_user_cannot_create_premade_team_if_already_participating(): void
    {
        $this->actingAs($this->student)->post(
            route('tournament.teams.store', $this->tournament),
            [
                'name' => 'Team Alpha',
                'assigned_lane_role_code' => 'jungler',
            ]
        );

        $this->actingAs($this->student)->post(
            route('tournament.teams.store', $this->tournament),
            [
                'name' => 'Team Beta',
                'assigned_lane_role_code' => 'mid_laner',
            ]
        )->assertForbidden();
    }

    public function test_cannot_register_for_unapproved_tournament(): void
    {
        $unapprovedTournament = CampusTournament::query()->create([
            'campus_id' => $this->tournament->campus_id,
            'created_by_user_id' => $this->student->id,
            'name' => 'Pending Cup',
            'tournament_type_code' => 'online',
            'approval_status' => CampusTournamentApprovalStatus::Pending,
            'registration_opens_at' => now()->subDay(),
            'registration_closes_at' => now()->addDays(7),
            'starts_at' => now()->addDays(8),
            'ends_at' => now()->addDays(10),
        ]);

        $otherStudent = $this->createEligibleUser();

        $this->actingAs($otherStudent)->post(
            route('tournament.teams.store', $unapprovedTournament),
            [
                'name' => 'Team Beta',
                'assigned_lane_role_code' => 'jungler',
            ]
        )->assertStatus(409);
    }

    public function test_authenticated_user_can_register_as_solo_participant(): void
    {
        $response = $this->actingAs($this->student)->post(
            route('tournament.participants.store', $this->tournament),
            [
                'name' => 'Solo Alpha',
                'preferred_lane_role_code' => 'roam',
            ]
        );

        $response->assertRedirect();

        $team = TournamentTeam::query()->where('name', 'Solo Alpha')->firstOrFail();
        $this->assertSame(TeamFormationMethod::Solo, $team->formation_method);
        $this->assertSame(TeamStatus::Assembling, $team->status);
        $this->assertSame($this->student->id, $team->captain_user_id);

        $this->assertDatabaseHas('tournament_participants', [
            'tournament_id' => $this->tournament->id,
            'user_id' => $this->student->id,
            'team_id' => $team->id,
            'entry_method' => 'solo',
            'roster_role' => 'captain',
            'preferred_lane_role_code' => 'roam',
            'assigned_lane_role_code' => 'roam',
            'status' => 'active',
        ]);
    }

    public function test_eligible_player_can_join_an_open_solo_team_and_lock_a_lane(): void
    {
        $team = $this->createSoloTeam($this->student, 'Solo Alpha', 'jungler');
        $joiner = $this->createEligibleUser();

        $this->actingAs($joiner)->post(
            route('tournament.solo-teams.join', $team),
            ['lane_role_code' => 'roam']
        )->assertRedirect();

        $this->assertDatabaseHas('tournament_participants', [
            'tournament_id' => $this->tournament->id,
            'team_id' => $team->id,
            'user_id' => $joiner->id,
            'entry_method' => 'solo',
            'roster_role' => 'member',
            'preferred_lane_role_code' => 'roam',
            'assigned_lane_role_code' => 'roam',
            'status' => 'active',
        ]);
    }

    public function test_open_solo_team_listing_exposes_available_lanes(): void
    {
        $team = $this->createSoloTeam($this->student, 'Solo Alpha', 'jungler');
        $viewer = $this->createEligibleUser();

        $this->actingAs($viewer)->getJson(
            route('tournament.solo-teams.index', $this->tournament)
        )->assertOk()
            ->assertJsonPath('data.0.id', $team->id)
            ->assertJsonPath('data.0.name', 'Solo Alpha')
            ->assertJsonPath('data.0.slots_filled', 1)
            ->assertJsonPath('data.0.available_lane_roles', [
                'roam',
                'gold_laner',
                'exp_laner',
                'mid_laner',
            ])
            ->assertJsonFragment(['lane_role_code' => 'jungler']);
    }

    public function test_solo_player_cannot_claim_an_occupied_lane(): void
    {
        $team = $this->createSoloTeam($this->student, 'Solo Alpha', 'jungler');
        $joiner = $this->createEligibleUser();

        $this->actingAs($joiner)->post(
            route('tournament.solo-teams.join', $team),
            ['lane_role_code' => 'jungler']
        )->assertSessionHasErrors('assigned_lane_role_code');
    }

    public function test_solo_players_cannot_directly_join_a_premade_team(): void
    {
        $this->actingAs($this->student)->post(
            route('tournament.teams.store', $this->tournament),
            ['name' => 'Premade Alpha', 'assigned_lane_role_code' => 'jungler']
        );

        $team = TournamentTeam::query()->where('name', 'Premade Alpha')->firstOrFail();
        $joiner = $this->createEligibleUser();

        $this->actingAs($joiner)->post(
            route('tournament.solo-teams.join', $team),
            ['lane_role_code' => 'roam']
        )->assertForbidden();
    }

    public function test_solo_teams_do_not_use_premade_invitations(): void
    {
        $team = $this->createSoloTeam($this->student, 'Solo Alpha', 'jungler');
        $invitee = $this->createEligibleUser();

        $this->actingAs($this->student)->post(
            route('tournament.invitations.store', $team),
            ['user_id' => $invitee->id, 'intended_lane_role_code' => 'roam']
        )->assertForbidden();
    }

    public function test_complete_solo_team_registers_with_exactly_five_fixed_lanes(): void
    {
        $team = $this->createSoloTeam($this->student, 'Solo Alpha', 'jungler');

        foreach (['roam', 'gold_laner', 'exp_laner', 'mid_laner'] as $role) {
            $joiner = $this->createEligibleUser();
            $this->actingAs($joiner)->post(
                route('tournament.solo-teams.join', $team),
                ['lane_role_code' => $role]
            )->assertRedirect();
        }

        $team->refresh();
        $this->assertSame(TeamStatus::Registered, $team->status);
        $this->assertNotNull($team->registered_at);
        $this->assertSame(5, $team->activeParticipants()->count());

        $viewer = $this->createEligibleUser();
        $this->actingAs($viewer)->getJson(
            route('tournament.solo-teams.index', $this->tournament)
        )->assertOk()->assertJsonCount(0, 'data');
    }

    public function test_solo_team_name_must_be_unique_across_active_team_types(): void
    {
        $this->actingAs($this->student)->post(
            route('tournament.teams.store', $this->tournament),
            ['name' => 'Shared Name', 'assigned_lane_role_code' => 'jungler']
        );

        $soloCreator = $this->createEligibleUser();
        $this->actingAs($soloCreator)->post(
            route('tournament.participants.store', $this->tournament),
            ['name' => 'Shared Name', 'preferred_lane_role_code' => 'roam']
        )->assertSessionHasErrors('name');
    }

    public function test_captain_can_invite_member_and_member_can_accept(): void
    {
        $this->actingAs($this->student)->post(
            route('tournament.teams.store', $this->tournament),
            [
                'name' => 'Team Alpha',
                'assigned_lane_role_code' => 'jungler',
            ]
        );

        $team = TournamentTeam::query()->firstOrFail();
        $invitee = $this->createEligibleUser();

        $inviteResponse = $this->actingAs($this->student)->post(
            route('tournament.invitations.store', $team),
            [
                'user_id' => $invitee->id,
                'intended_lane_role_code' => 'mid_laner',
            ]
        );

        $inviteResponse->assertRedirect();

        $invitation = TournamentTeamInvitation::query()->firstOrFail();
        $this->assertSame(InvitationStatus::Pending, $invitation->status);
        $this->assertSame($invitee->id, $invitation->invited_user_id);
        $this->assertSame('mid_laner', $invitation->intended_lane_role_code);

        $acceptResponse = $this->actingAs($invitee)->post(
            route('tournament.invitations.respond', $invitation),
            [
                'decision' => 'accepted',
            ]
        );

        $acceptResponse->assertRedirect();
        $this->assertSame(InvitationStatus::Accepted, $invitation->fresh()->status);

        $this->assertDatabaseHas('tournament_participants', [
            'tournament_id' => $this->tournament->id,
            'team_id' => $team->id,
            'user_id' => $invitee->id,
            'assigned_lane_role_code' => 'mid_laner',
            'status' => 'active',
        ]);
    }

    public function test_non_captain_cannot_invite_members(): void
    {
        $this->actingAs($this->student)->post(
            route('tournament.teams.store', $this->tournament),
            [
                'name' => 'Team Alpha',
                'assigned_lane_role_code' => 'jungler',
            ]
        );

        $team = TournamentTeam::query()->firstOrFail();
        $stranger = $this->createEligibleUser();
        $invitee = $this->createEligibleUser();

        $this->actingAs($stranger)->post(
            route('tournament.invitations.store', $team),
            [
                'user_id' => $invitee->id,
                'intended_lane_role_code' => 'mid_laner',
            ]
        )->assertForbidden();
    }

    public function test_member_can_decline_invitation(): void
    {
        $this->actingAs($this->student)->post(
            route('tournament.teams.store', $this->tournament),
            [
                'name' => 'Team Alpha',
                'assigned_lane_role_code' => 'jungler',
            ]
        );

        $team = TournamentTeam::query()->firstOrFail();
        $invitee = $this->createEligibleUser();

        $this->actingAs($this->student)->post(
            route('tournament.invitations.store', $team),
            [
                'user_id' => $invitee->id,
                'intended_lane_role_code' => 'mid_laner',
            ]
        );

        $invitation = TournamentTeamInvitation::query()->firstOrFail();

        $this->actingAs($invitee)->post(
            route('tournament.invitations.respond', $invitation),
            [
                'decision' => 'declined',
            ]
        )->assertRedirect();

        $this->assertSame(InvitationStatus::Declined, $invitation->fresh()->status);
        $this->assertDatabaseMissing('tournament_participants', [
            'user_id' => $invitee->id,
        ]);
    }



    public function test_team_auto_transitions_to_registered_when_5_lane_roles_are_filled(): void
    {
        $this->actingAs($this->student)->post(
            route('tournament.teams.store', $this->tournament),
            [
                'name' => 'Team Alpha',
                'assigned_lane_role_code' => 'jungler',
            ]
        );

        $team = TournamentTeam::query()->firstOrFail();
        $this->assertSame(TeamStatus::Assembling, $team->status);

        $roles = ['roam', 'gold_laner', 'exp_laner', 'mid_laner'];

        foreach ($roles as $role) {
            $member = $this->createEligibleUser();

            $this->actingAs($this->student)->post(
                route('tournament.invitations.store', $team),
                [
                    'user_id' => $member->id,
                    'intended_lane_role_code' => $role,
                ]
            );

            $invitation = TournamentTeamInvitation::query()
                ->where('invited_user_id', $member->id)
                ->firstOrFail();

            $this->actingAs($member)->post(
                route('tournament.invitations.respond', $invitation),
                ['decision' => 'accepted']
            );
        }

        $team->refresh();
        $this->assertSame(TeamStatus::Registered, $team->status);
        $this->assertNotNull($team->registered_at);
        $this->assertSame(5, $team->activeParticipants()->count());
    }

    public function test_cannot_assign_duplicate_lane_role_on_same_team(): void
    {
        $this->actingAs($this->student)->post(
            route('tournament.teams.store', $this->tournament),
            [
                'name' => 'Team Alpha',
                'assigned_lane_role_code' => 'jungler',
            ]
        );

        $team = TournamentTeam::query()->firstOrFail();
        $member = $this->createEligibleUser();

        $this->actingAs($this->student)->post(
            route('tournament.invitations.store', $team),
            [
                'user_id' => $member->id,
                'intended_lane_role_code' => 'jungler',
            ]
        )->assertSessionHasErrors('assigned_lane_role_code');
    }

    public function test_captain_withdrawal_disbands_entire_team(): void
    {
        $this->actingAs($this->student)->post(
            route('tournament.teams.store', $this->tournament),
            [
                'name' => 'Team Alpha',
                'assigned_lane_role_code' => 'jungler',
            ]
        );

        $team = TournamentTeam::query()->firstOrFail();
        $member = $this->createEligibleUser();

        $this->actingAs($this->student)->post(
            route('tournament.invitations.store', $team),
            ['user_id' => $member->id, 'intended_lane_role_code' => 'roam']
        );

        $invitation = TournamentTeamInvitation::query()->firstOrFail();
        $this->actingAs($member)->post(
            route('tournament.invitations.respond', $invitation),
            ['decision' => 'accepted']
        );

        $captainParticipant = TournamentParticipant::query()
            ->where('user_id', $this->student->id)
            ->firstOrFail();

        $this->actingAs($this->student)->delete(
            route('tournament.participants.destroy', $captainParticipant)
        )->assertRedirect();

        $team->refresh();
        $this->assertSame(TeamStatus::Withdrawn, $team->status);

        $this->assertDatabaseHas('tournament_participants', [
            'user_id' => $this->student->id,
            'status' => 'withdrawn',
        ]);
        $this->assertDatabaseHas('tournament_participants', [
            'user_id' => $member->id,
            'status' => 'withdrawn',
        ]);
    }

    public function test_regular_member_withdrawal_drops_registered_team_back_to_assembling(): void
    {
        // 1. Create team as captain
        $this->actingAs($this->student)->post(
            route('tournament.teams.store', $this->tournament),
            [
                'name' => 'Team Alpha',
                'assigned_lane_role_code' => 'jungler',
            ]
        );

        $team = TournamentTeam::query()->firstOrFail();
        $roles = ['roam', 'gold_laner', 'exp_laner', 'mid_laner'];
        $lastMember = null;
        $lastParticipant = null;

        foreach ($roles as $role) {
            $member = $this->createEligibleUser();
            $this->actingAs($this->student)->post(
                route('tournament.invitations.store', $team),
                ['user_id' => $member->id, 'intended_lane_role_code' => $role]
            );

            $invitation = TournamentTeamInvitation::query()
                ->where('invited_user_id', $member->id)
                ->firstOrFail();

            $this->actingAs($member)->post(
                route('tournament.invitations.respond', $invitation),
                ['decision' => 'accepted']
            );

            $lastMember = $member;
        }

        $this->assertSame(TeamStatus::Registered, $team->fresh()->status);

        $lastParticipant = TournamentParticipant::query()
            ->where('user_id', $lastMember->id)
            ->firstOrFail();

        // 2. Member withdraws
        $this->actingAs($lastMember)->delete(
            route('tournament.participants.destroy', $lastParticipant)
        )->assertRedirect();

        $team->refresh();
        $this->assertSame(TeamStatus::Assembling, $team->status);
        $this->assertNull($team->registered_at);
        $this->assertSame(4, $team->activeParticipants()->count());

        $replacement = $this->createEligibleUser();
        $this->actingAs($this->student)->post(
            route('tournament.invitations.store', $team),
            ['user_id' => $replacement->id, 'intended_lane_role_code' => 'mid_laner']
        )->assertRedirect();

        $replacementInvitation = TournamentTeamInvitation::query()
            ->where('invited_user_id', $replacement->id)
            ->firstOrFail();

        $this->actingAs($replacement)->post(
            route('tournament.invitations.respond', $replacementInvitation),
            ['decision' => 'accepted']
        )->assertRedirect();

        $this->assertSame(TeamStatus::Registered, $team->fresh()->status);
        $this->assertSame(5, $team->activeParticipants()->count());
    }

    public function test_user_without_active_host_campus_affiliation_cannot_register(): void
    {
        $outsider = User::factory()->create(['status' => 'active']);

        $this->actingAs($outsider)->post(
            route('tournament.participants.store', $this->tournament),
            ['name' => 'Outsider Solo', 'preferred_lane_role_code' => 'roam']
        )->assertSessionHasErrors('user_id');

        $this->assertDatabaseMissing('tournament_participants', [
            'tournament_id' => $this->tournament->id,
            'user_id' => $outsider->id,
        ]);
    }

    public function test_registration_and_roster_mutations_are_rejected_outside_the_window_or_after_lock(): void
    {
        $this->tournament->update(['registration_opens_at' => now()->addHour()]);

        $this->actingAs($this->student)->post(
            route('tournament.teams.store', $this->tournament),
            ['name' => 'Too Early', 'assigned_lane_role_code' => 'jungler']
        )->assertStatus(409);

        $this->tournament->update([
            'registration_opens_at' => now()->subHour(),
            'roster_locked_at' => now(),
        ]);

        $this->actingAs($this->student)->post(
            route('tournament.participants.store', $this->tournament),
            ['name' => 'Locked Solo', 'preferred_lane_role_code' => 'roam']
        )->assertStatus(409);
    }

    public function test_existing_roster_cannot_change_after_it_is_locked(): void
    {
        $this->actingAs($this->student)->post(
            route('tournament.teams.store', $this->tournament),
            ['name' => 'Team Alpha', 'assigned_lane_role_code' => 'jungler']
        );

        $team = TournamentTeam::query()->firstOrFail();
        $invitee = $this->createEligibleUser();
        $this->actingAs($this->student)->post(
            route('tournament.invitations.store', $team),
            ['user_id' => $invitee->id, 'intended_lane_role_code' => 'roam']
        );
        $invitation = TournamentTeamInvitation::query()->firstOrFail();
        $captainParticipant = TournamentParticipant::query()
            ->where('user_id', $this->student->id)
            ->firstOrFail();

        $this->tournament->update(['roster_locked_at' => now()]);

        $this->actingAs($invitee)->post(
            route('tournament.invitations.respond', $invitation),
            ['decision' => 'accepted']
        )->assertStatus(409);

        $this->actingAs($this->student)->delete(
            route('tournament.participants.destroy', $captainParticipant)
        )->assertStatus(409);

        $this->assertSame(ParticipantStatus::Active, $captainParticipant->fresh()->status);
        $this->assertSame(InvitationStatus::Pending, $invitation->fresh()->status);
    }

    public function test_active_team_names_are_unique_within_a_tournament(): void
    {
        $this->actingAs($this->student)->post(
            route('tournament.teams.store', $this->tournament),
            ['name' => 'Team Alpha', 'assigned_lane_role_code' => 'jungler']
        )->assertRedirect();

        $otherCaptain = $this->createEligibleUser();
        $this->actingAs($otherCaptain)->post(
            route('tournament.teams.store', $this->tournament),
            ['name' => 'Team Alpha', 'assigned_lane_role_code' => 'roam']
        )->assertSessionHasErrors('name');

        $this->assertSame(1, TournamentTeam::query()->where('name', 'Team Alpha')->count());
        $this->assertSame('Team Alpha', TournamentTeam::query()->firstOrFail()->active_name);
    }

    public function test_pending_invitations_cannot_duplicate_a_user_or_lane(): void
    {
        $this->actingAs($this->student)->post(
            route('tournament.teams.store', $this->tournament),
            ['name' => 'Team Alpha', 'assigned_lane_role_code' => 'jungler']
        );

        $team = TournamentTeam::query()->firstOrFail();
        $firstInvitee = $this->createEligibleUser();
        $secondInvitee = $this->createEligibleUser();

        $this->actingAs($this->student)->post(
            route('tournament.invitations.store', $team),
            ['user_id' => $firstInvitee->id, 'intended_lane_role_code' => 'roam']
        )->assertRedirect();

        $this->actingAs($this->student)->post(
            route('tournament.invitations.store', $team),
            ['user_id' => $secondInvitee->id, 'intended_lane_role_code' => 'roam']
        )->assertSessionHasErrors('intended_lane_role_code');

        $this->actingAs($this->student)->post(
            route('tournament.invitations.store', $team),
            ['user_id' => $firstInvitee->id, 'intended_lane_role_code' => 'mid_laner']
        )->assertSessionHasErrors('user_id');
    }

    public function test_invitation_can_be_cancelled_and_expired_invitation_cannot_be_accepted(): void
    {
        $this->actingAs($this->student)->post(
            route('tournament.teams.store', $this->tournament),
            ['name' => 'Team Alpha', 'assigned_lane_role_code' => 'jungler']
        );

        $team = TournamentTeam::query()->firstOrFail();
        $invitee = $this->createEligibleUser();
        $this->actingAs($this->student)->post(
            route('tournament.invitations.store', $team),
            ['user_id' => $invitee->id, 'intended_lane_role_code' => 'roam']
        );

        $invitation = TournamentTeamInvitation::query()->firstOrFail();
        $this->assertNotNull($invitation->expires_at);

        $this->actingAs($this->student)->delete(
            route('tournament.invitations.destroy', $invitation)
        )->assertRedirect();
        $this->assertSame(InvitationStatus::Cancelled, $invitation->fresh()->status);

        $secondInvitee = $this->createEligibleUser();
        $this->actingAs($this->student)->post(
            route('tournament.invitations.store', $team),
            ['user_id' => $secondInvitee->id, 'intended_lane_role_code' => 'mid_laner']
        );
        $expired = TournamentTeamInvitation::query()->where('invited_user_id', $secondInvitee->id)->firstOrFail();
        $expired->update(['expires_at' => now()->subSecond()]);

        $this->actingAs($secondInvitee)->post(
            route('tournament.invitations.respond', $expired),
            ['decision' => 'accepted']
        )->assertStatus(409);
    }



    public function test_only_the_five_fixed_lane_codes_are_accepted(): void
    {
        LaneRole::query()->create([
            'code' => 'substitute',
            'name' => 'Substitute',
            'sort_order' => 6,
        ]);

        $this->actingAs($this->student)->post(
            route('tournament.teams.store', $this->tournament),
            ['name' => 'Team Alpha', 'assigned_lane_role_code' => 'substitute']
        )->assertSessionHasErrors('assigned_lane_role_code');
    }

    private function createCampus(): Campus
    {
        $suffix = str_replace('.', '', uniqid('', true));
        $islandCode = 'I'.$suffix;
        $cityCode = 'C'.$suffix;
        $regionCode = 'R'.$suffix;

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
            'status' => 'active',
        ]);
    }

    private function createSoloTeam(User $creator, string $name, string $laneRole): TournamentTeam
    {
        $this->actingAs($creator)->post(
            route('tournament.participants.store', $this->tournament),
            ['name' => $name, 'preferred_lane_role_code' => $laneRole]
        )->assertRedirect();

        return TournamentTeam::query()->where('name', $name)->firstOrFail();
    }

    private function createEligibleUser(): User
    {
        $user = User::factory()->create(['status' => 'active']);

        CampusAffiliation::query()->create([
            'campus_id' => $this->campus->id,
            'user_id' => $user->id,
            'role' => 'member',
            'status' => 'active',
            'started_at' => now()->subDay(),
        ]);

        return $user;
    }
}
