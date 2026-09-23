<?php

namespace App\Actions\TournamentRegistration;

use App\Enums\TeamFormationMethod;
use App\Enums\TeamStatus;
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
            ->where('tournament_id', $tournament->id)
            ->where('formation_method', TeamFormationMethod::Solo)
            ->where(function ($query) use ($user): void {
                $query->where('status', TeamStatus::Assembling)
                    ->orWhereHas('activeParticipants', function ($participantQuery) use ($user): void {
                        $participantQuery->where('user_id', $user->id);
                    });
            })
            ->withCount('activeParticipants')
            ->with(['activeParticipants.user'])
            ->orderBy('created_at')
            ->orderBy('id')
            ->get()
            ->map(function (TournamentTeam $team) use ($user): array {
                $occupiedRoles = $team->activeParticipants
                    ->pluck('assigned_lane_role_code')
                    ->filter()
                    ->values()
                    ->all();

                $currentParticipant = $team->activeParticipants
                    ->firstWhere('user_id', $user->id);

                return [
                    'id' => $team->id,
                    'name' => $team->name,
                    'status' => $team->status->value,
                    'slots_filled' => $team->active_participants_count,
                    'joined' => $currentParticipant !== null,
                    'participant_id' => $currentParticipant?->id,
                    'locked_lane_role' => $currentParticipant?->assigned_lane_role_code,
                    'available_lane_roles' => array_values(array_diff(
                        TournamentRegistrationGuard::LANE_ROLE_CODES,
                        $occupiedRoles,
                    )),
                    'participants' => $team->activeParticipants->map(fn (TournamentParticipant $participant): array => [
                        'user_id' => $participant->user_id,
                        'name' => $participant->user->name,
                        'ign' => $participant->user->ml_ign,
                        'uid' => $participant->user->ml_id
                            ? $participant->user->ml_id.'('.$participant->user->ml_server.')'
                            : null,
                        'roster_role' => $participant->roster_role,
                        'lane_role_code' => $participant->assigned_lane_role_code,
                    ])->values(),
                ];
            });
    }
}
