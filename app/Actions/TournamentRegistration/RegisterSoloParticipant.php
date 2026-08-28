<?php

namespace App\Actions\TournamentRegistration;

use App\Enums\ParticipantStatus;
use App\Enums\TeamFormationMethod;
use App\Enums\TeamStatus;
use App\Models\CampusTournament;
use App\Models\TournamentParticipant;
use App\Models\TournamentTeam;
use App\Models\User;
use App\Support\TournamentRegistrationGuard;
use Illuminate\Support\Facades\DB;

class RegisterSoloParticipant
{
    public function __construct(private TournamentRegistrationGuard $guard) {}

    public function handle(User $user, CampusTournament $tournament, array $data): TournamentParticipant
    {
        return DB::transaction(function () use ($user, $tournament, $data): TournamentParticipant {
            $tournament = CampusTournament::query()->lockForUpdate()->findOrFail($tournament->id);

            $this->guard->assertRegistrationOpen($tournament);
            $this->guard->assertEligibleForCampus($tournament, $user);
            $this->guard->assertNotAlreadyParticipating($tournament, $user);
            $this->guard->assertActiveTeamNameAvailable($tournament, $data['name']);

            $team = TournamentTeam::query()->create([
                'tournament_id' => $tournament->id,
                'name' => $data['name'],
                'active_name' => $data['name'],
                'formation_method' => TeamFormationMethod::Solo,
                'status' => TeamStatus::Assembling,
                'captain_user_id' => $user->id,
            ]);

            return TournamentParticipant::query()->create([
                'tournament_id' => $tournament->id,
                'user_id' => $user->id,
                'team_id' => $team->id,
                'entry_method' => TeamFormationMethod::Solo->value,
                'roster_role' => 'captain',
                'preferred_lane_role_code' => $data['preferred_lane_role_code'],
                'assigned_lane_role_code' => $data['preferred_lane_role_code'],
                'status' => ParticipantStatus::Active,
                'registered_at' => now(),
                'accepted_at' => now(),
            ]);
        }, 3);
    }
}
