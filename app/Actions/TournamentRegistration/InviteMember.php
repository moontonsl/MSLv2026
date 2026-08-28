<?php

namespace App\Actions\TournamentRegistration;

use App\Enums\InvitationStatus;
use App\Models\CampusTournament;
use App\Models\TournamentTeam;
use App\Models\TournamentTeamInvitation;
use App\Models\User;
use App\Support\TournamentRegistrationGuard;
use Illuminate\Support\Facades\DB;

class InviteMember
{
    public function __construct(private TournamentRegistrationGuard $guard) {}

    public function handle(
        TournamentTeam $team,
        User $invitedBy,
        User $invitedUser,
        string $intendedLaneRoleCode,
    ): TournamentTeamInvitation {
        return DB::transaction(function () use ($team, $invitedBy, $invitedUser, $intendedLaneRoleCode): TournamentTeamInvitation {
            $team = TournamentTeam::query()->lockForUpdate()->findOrFail($team->id);
            $tournament = CampusTournament::query()->lockForUpdate()->findOrFail($team->tournament_id);

            $this->guard->assertRegistrationOpen($tournament);
            $this->guard->assertPremadeTeam($team);
            $this->guard->assertTeamIsAssembling($team);
            $this->guard->assertEligibleForCampus($tournament, $invitedBy);
            $this->guard->assertEligibleForCampus($tournament, $invitedUser);
            $this->guard->assertLaneRoleAvailable($team, $intendedLaneRoleCode);
            $this->guard->assertInvitationSlotAvailable($team, $invitedUser, $intendedLaneRoleCode);
            $this->guard->assertNotAlreadyParticipating($tournament, $invitedUser);

            return TournamentTeamInvitation::query()->create([
                'team_id' => $team->id,
                'invited_user_id' => $invitedUser->id,
                'invited_by_user_id' => $invitedBy->id,
                'intended_lane_role_code' => $intendedLaneRoleCode,
                'status' => InvitationStatus::Pending,
                'expires_at' => $this->guard->invitationExpiresAt($tournament),
            ]);
        }, 3);
    }
}
