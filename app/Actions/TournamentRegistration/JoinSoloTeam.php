<?php

namespace App\Actions\TournamentRegistration;

use App\Enums\ParticipantStatus;
use App\Enums\TeamFormationMethod;
use App\Models\CampusTournament;
use App\Models\TournamentParticipant;
use App\Models\TournamentTeam;
use App\Models\User;
use App\Support\TournamentRegistrationGuard;
use Illuminate\Support\Facades\DB;

class JoinSoloTeam
{
    public function __construct(private TournamentRegistrationGuard $guard) {}

    public function handle(TournamentTeam $team, User $user, string $laneRoleCode): TournamentParticipant
    {
        return DB::transaction(function () use ($team, $user, $laneRoleCode): TournamentParticipant {
            $team = TournamentTeam::query()->lockForUpdate()->findOrFail($team->id);
            $tournament = CampusTournament::query()->lockForUpdate()->findOrFail($team->tournament_id);

            $this->guard->assertRegistrationOpen($tournament);
            $this->guard->assertSoloTeam($team);
            $this->guard->assertTeamIsAssembling($team);
            $this->guard->assertEligibleForCampus($tournament, $user);
            $this->guard->assertNotAlreadyParticipating($tournament, $user);
            $this->guard->assertLaneRoleAvailable($team, $laneRoleCode);

            $participant = TournamentParticipant::query()->create([
                'tournament_id' => $tournament->id,
                'user_id' => $user->id,
                'team_id' => $team->id,
                'entry_method' => TeamFormationMethod::Solo->value,
                'roster_role' => 'member',
                'preferred_lane_role_code' => $laneRoleCode,
                'assigned_lane_role_code' => $laneRoleCode,
                'status' => ParticipantStatus::Active,
                'registered_at' => now(),
                'accepted_at' => now(),
            ]);

            $this->guard->transitionTeamIfFull($team);

            return $participant;
        }, 3);
    }
}
