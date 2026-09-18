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

class RegisterPremadeTeam
{
    public function __construct(private TournamentRegistrationGuard $guard) {}

    public function handle(User $user, CampusTournament $tournament, array $data): TournamentTeam
    {
        return DB::transaction(function () use ($user, $tournament, $data): TournamentTeam {
            $tournament = CampusTournament::query()->lockForUpdate()->findOrFail($tournament->id);

            $this->guard->assertRegistrationOpen($tournament);
            $this->guard->assertEligibleForCampus($tournament, $user);
            $this->guard->assertNotAlreadyParticipating($tournament, $user);

            $this->guard->assertActiveTeamNameAvailable($tournament, $data['name']);

            $team = TournamentTeam::query()->create([
                'tournament_id' => $tournament->id,
                'name' => $data['name'],
                'active_name' => $data['name'],
                'formation_method' => TeamFormationMethod::Premade,
                'status' => TeamStatus::Assembling,
                'captain_user_id' => $user->id,
                'discord_id' => $data['discord_id'] ?? null,
            ]);

            TournamentParticipant::query()->create([
                'tournament_id' => $tournament->id,
                'user_id' => $user->id,
                'team_id' => $team->id,
                'entry_method' => TeamFormationMethod::Premade->value,
                'roster_role' => 'captain',
                'assigned_lane_role_code' => $data['assigned_lane_role_code'],
                'status' => ParticipantStatus::Active,
                'registered_at' => now(),
                'accepted_at' => now(),
            ]);

            return $team->refresh();
        }, 3);
    }
}
