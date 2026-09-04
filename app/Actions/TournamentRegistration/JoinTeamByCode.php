<?php

namespace App\Actions\TournamentRegistration;

use App\Enums\ParticipantStatus;
use App\Models\CampusTournament;
use App\Models\TournamentParticipant;
use App\Models\TournamentTeam;
use App\Models\TournamentTeamJoinCode;
use App\Models\User;
use App\Support\TournamentRegistrationGuard;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class JoinTeamByCode
{
    public function __construct(private TournamentRegistrationGuard $guard) {}

    public function handle(CampusTournament $tournament, User $user, array $data): TournamentParticipant
    {
        return DB::transaction(function () use ($tournament, $user, $data): TournamentParticipant {
            $hash = hash('sha256', $data['code']);

            $joinCode = TournamentTeamJoinCode::query()
                ->where('code_hash', $hash)
                ->lockForUpdate()
                ->first();

            if (! $joinCode || ! $joinCode->isUsable()) {
                throw ValidationException::withMessages([
                    'code' => 'Invalid or expired join code.',
                ]);
            }

            if ($joinCode->team->tournament_id !== $tournament->id) {
                throw ValidationException::withMessages([
                    'code' => 'This join code does not belong to the specified tournament.',
                ]);
            }

            $team = TournamentTeam::query()->lockForUpdate()->findOrFail($joinCode->team_id);
            $tournament = CampusTournament::query()->lockForUpdate()->findOrFail($team->tournament_id);

            $this->guard->assertRegistrationOpen($tournament);
            $this->guard->assertPremadeTeam($team);
            $this->guard->assertTeamIsAssembling($team);
            $this->guard->assertEligibleForCampus($tournament, $user);
            $this->guard->assertLaneRoleAvailable($team, $data['assigned_lane_role_code']);
            $this->guard->assertNotAlreadyParticipating($tournament, $user);

            $participant = TournamentParticipant::query()->create([
                'tournament_id' => $tournament->id,
                'user_id' => $user->id,
                'team_id' => $team->id,
                'entry_method' => 'premade',
                'roster_role' => 'member',
                'assigned_lane_role_code' => $data['assigned_lane_role_code'],
                'status' => ParticipantStatus::Active,
                'registered_at' => now(),
                'accepted_at' => now(),
            ]);

            $this->guard->transitionTeamIfFull($team);

            return $participant;
        }, 3);
    }
}
