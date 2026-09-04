<?php

namespace App\Policies;

use App\Enums\TeamFormationMethod;
use App\Enums\TeamStatus;
use App\Models\CampusTournament;
use App\Models\TournamentParticipant;
use App\Models\TournamentTeam;
use App\Models\TournamentTeamInvitation;
use App\Models\TournamentTeamJoinCode;
use App\Models\User;

class TournamentTeamPolicy
{
    /**
     * A user may create a premade team if they are not already registered in this tournament.
     */
    public function create(User $user, CampusTournament $tournament): bool
    {
        return ! TournamentParticipant::query()
            ->where('tournament_id', $tournament->id)
            ->where('user_id', $user->id)
            ->exists();
    }

    /**
     * Only the team captain may invite members, and only while the team is assembling.
     */
    public function invite(User $user, TournamentTeam $team): bool
    {
        return $user->id === $team->captain_user_id
            && $team->formation_method === TeamFormationMethod::Premade
            && $team->status === TeamStatus::Assembling;
    }

    public function joinSolo(User $user, TournamentTeam $team): bool
    {
        return $team->formation_method === TeamFormationMethod::Solo
            && $team->status === TeamStatus::Assembling;
    }

    /**
     * Only the team captain may generate a join code, and only while the team is assembling.
     */
    public function generateJoinCode(User $user, TournamentTeam $team): bool
    {
        return $user->id === $team->captain_user_id
            && $team->formation_method === TeamFormationMethod::Premade
            && $team->status === TeamStatus::Assembling;
    }

    /**
     * The captain or the user who created the code may revoke it.
     */
    public function revokeJoinCode(User $user, TournamentTeamJoinCode $joinCode): bool
    {
        $team = $joinCode->team;

        return $user->id === $team->captain_user_id
            || $user->id === $joinCode->created_by_user_id;
    }

    public function cancelInvitation(User $user, TournamentTeamInvitation $invitation): bool
    {
        return $user->id === $invitation->team->captain_user_id
            || $user->id === $invitation->invited_by_user_id;
    }

    /**
     * Only the captain may withdraw the entire team, and only when not yet merged/not_qualified.
     */
    public function withdraw(User $user, TournamentTeam $team): bool
    {
        return $user->id === $team->captain_user_id
            && in_array($team->status, [TeamStatus::Assembling, TeamStatus::Registered], true);
    }
}
