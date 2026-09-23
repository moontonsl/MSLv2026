<?php

namespace App\Actions\TournamentRegistration;

use App\Enums\ParticipantStatus;
use App\Enums\TeamStatus;
use App\Models\CampusTournament;
use App\Models\TournamentParticipant;
use App\Models\TournamentTeam;
use App\Models\User;
use App\Support\TournamentRegistrationGuard;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

class WithdrawFromTournament
{
    public function __construct(private TournamentRegistrationGuard $guard) {}

    public function handle(TournamentParticipant $participant, User $user): TournamentParticipant
    {
        return DB::transaction(function () use ($participant, $user): TournamentParticipant {
            $participant = TournamentParticipant::query()->lockForUpdate()->findOrFail($participant->id);

            if ($participant->user_id !== $user->id) {
                throw new AuthorizationException('You can only withdraw your own registration.');
            }

            if ($participant->status === ParticipantStatus::Withdrawn) {
                throw new ConflictHttpException('You have already withdrawn from this tournament.');
            }

            $tournament = CampusTournament::query()->lockForUpdate()->findOrFail($participant->tournament_id);
            $this->guard->assertRegistrationOpen($tournament);

            $participant->update([
                'status' => ParticipantStatus::Withdrawn,
                'withdrawn_at' => now(),
                'assigned_lane_role_code' => null,
            ]);

            if ($participant->roster_role === 'captain' && $participant->team_id) {
                // Captain withdrawal disbands the entire team.
                $team = TournamentTeam::query()->lockForUpdate()->findOrFail($participant->team_id);
                $team->update([
                    'status' => TeamStatus::Withdrawn,
                    'active_name' => null,
                    'withdrawn_at' => now(),
                ]);

                TournamentParticipant::query()
                    ->where('team_id', $team->id)
                    ->where('user_id', '!=', $user->id)
                    ->whereIn('status', [ParticipantStatus::Active->value, ParticipantStatus::Pending->value])
                    ->update(['status' => ParticipantStatus::Withdrawn->value, 'withdrawn_at' => now()]);
            } elseif ($participant->team_id) {
                // Regular member withdrawal: drop team back to assembling if it was registered.
                $team = TournamentTeam::query()->lockForUpdate()->findOrFail($participant->team_id);
                if ($team->status === TeamStatus::Registered) {
                    $team->update(['status' => TeamStatus::Assembling, 'registered_at' => null]);
                }
            }

            return $participant->refresh();
        }, 3);
    }
}
