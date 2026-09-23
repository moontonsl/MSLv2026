<?php

namespace App\Actions\TournamentRegistration;

use App\Enums\InvitationStatus;
use App\Models\TournamentTeamInvitation;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

class CancelInvitation
{
    public function handle(TournamentTeamInvitation $invitation, User $user): TournamentTeamInvitation
    {
        return DB::transaction(function () use ($invitation, $user): TournamentTeamInvitation {
            $invitation = TournamentTeamInvitation::query()->lockForUpdate()->findOrFail($invitation->id);
            $team = $invitation->team;

            if ($user->id !== $team->captain_user_id && $user->id !== $invitation->invited_by_user_id) {
                throw new AuthorizationException('You are not authorized to cancel this invitation.');
            }

            if ($invitation->status !== InvitationStatus::Pending) {
                throw new ConflictHttpException('Only pending invitations may be cancelled.');
            }

            $invitation->update([
                'status' => InvitationStatus::Cancelled,
                'responded_at' => now(),
            ]);

            return $invitation->refresh();
        }, 3);
    }
}
