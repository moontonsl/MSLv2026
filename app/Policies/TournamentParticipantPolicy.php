<?php

namespace App\Policies;

use App\Models\CampusTournament;
use App\Models\TournamentParticipant;
use App\Models\TournamentTeamInvitation;
use App\Models\User;

class TournamentParticipantPolicy
{
    /**
     * A user may register (solo or premade captain) if not already in this tournament.
     */
    public function register(User $user, CampusTournament $tournament): bool
    {
        return ! TournamentParticipant::query()
            ->where('tournament_id', $tournament->id)
            ->where('user_id', $user->id)
            ->exists();
    }

    /**
     * Only the invited user may respond to an invitation.
     */
    public function respond(User $user, TournamentTeamInvitation $invitation): bool
    {
        return $user->id === $invitation->invited_user_id;
    }

    /**
     * A participant may only withdraw their own record.
     */
    public function withdraw(User $user, TournamentParticipant $participant): bool
    {
        return $user->id === $participant->user_id;
    }
}
