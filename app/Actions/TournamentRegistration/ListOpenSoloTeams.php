<?php

namespace App\Actions\TournamentRegistration;

use App\Models\CampusTournament;
use App\Models\TournamentParticipant;
use App\Models\TournamentTeam;
use App\Models\User;
use App\Support\TournamentRegistrationGuard;
use Illuminate\Support\Collection;

class ListOpenSoloTeams
{
    public function __construct(private TournamentRegistrationGuard $guard) {}

    /**
     * @return Collection<int, array<string, mixed>>
     */
    public function handle(CampusTournament $tournament, User $user): Collection
    {
        $this->guard->assertRegistrationOpen($tournament);
        $this->guard->assertEligibleForCampus($tournament, $user);

        return TournamentTeam::query()
            ->openSoloForTournament($tournament->id)
            ->with(['activeParticipants.user'])
            ->orderBy('created_at')
            ->orderBy('id')
            ->get()
            ->map(function (TournamentTeam $team): array {
                $occupiedRoles = $team->activeParticipants
                    ->pluck('assigned_lane_role_code')
                    ->filter()
                    ->values()
                    ->all();

                return [
                    'id' => $team->id,
                    'name' => $team->name,
                    'status' => $team->status->value,
                    'slots_filled' => $team->active_participants_count,
                    'available_lane_roles' => array_values(array_diff(
                        TournamentRegistrationGuard::LANE_ROLE_CODES,
                        $occupiedRoles,
                    )),
                    'participants' => $team->activeParticipants->map(fn (TournamentParticipant $participant): array => [
                        'user_id' => $participant->user_id,
                        'name' => $participant->user->name,
                        'roster_role' => $participant->roster_role,
                        'lane_role_code' => $participant->assigned_lane_role_code,
                    ])->values(),
                ];
            });
    }
}
