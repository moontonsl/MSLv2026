<?php

namespace App\Actions\TournamentRegistration;

use App\Models\CampusTournament;
use App\Models\TournamentTeam;
use App\Models\TournamentTeamJoinCode;
use App\Models\User;
use App\Support\TournamentRegistrationGuard;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class GenerateJoinCode
{
    public function __construct(private TournamentRegistrationGuard $guard) {}

    /**
     * @return array{code: string, hint: string}
     */
    public function handle(TournamentTeam $team, User $user): array
    {
        return DB::transaction(function () use ($team, $user): array {
            $team = TournamentTeam::query()->lockForUpdate()->findOrFail($team->id);
            $tournament = CampusTournament::query()->lockForUpdate()->findOrFail($team->tournament_id);

            $this->guard->assertRegistrationOpen($tournament);
            $this->guard->assertPremadeTeam($team);
            $this->guard->assertTeamIsAssembling($team);
            $this->guard->assertEligibleForCampus($tournament, $user);

            $plaintext = Str::random(16);
            $hash = hash('sha256', $plaintext);
            $hint = substr($plaintext, -4);

            TournamentTeamJoinCode::query()->create([
                'team_id' => $team->id,
                'code_hash' => $hash,
                'code_hint' => $hint,
                'created_by_user_id' => $user->id,
                'expires_at' => $this->guard->joinCodeExpiresAt($tournament),
            ]);

            return ['code' => $plaintext, 'hint' => $hint];
        }, 3);
    }
}
