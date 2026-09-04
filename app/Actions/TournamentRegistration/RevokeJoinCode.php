<?php

namespace App\Actions\TournamentRegistration;

use App\Models\TournamentTeamJoinCode;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

class RevokeJoinCode
{
    public function handle(TournamentTeamJoinCode $joinCode, User $user): TournamentTeamJoinCode
    {
        return DB::transaction(function () use ($joinCode, $user): TournamentTeamJoinCode {
            $joinCode = TournamentTeamJoinCode::query()->lockForUpdate()->findOrFail($joinCode->id);

            $team = $joinCode->team;
            if ($user->id !== $team->captain_user_id && $user->id !== $joinCode->created_by_user_id) {
                throw new AuthorizationException('You are not authorized to revoke this join code.');
            }

            if ($joinCode->revoked_at !== null) {
                throw new ConflictHttpException('This join code has already been revoked.');
            }

            $joinCode->update(['revoked_at' => now()]);

            return $joinCode->refresh();
        }, 3);
    }
}
