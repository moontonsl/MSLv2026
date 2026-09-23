<?php

namespace App\Actions\TournamentRegistration;

use App\Enums\InvitationStatus;
use App\Enums\ParticipantStatus;
use App\Models\CampusTournament;
use App\Models\TournamentParticipant;
use App\Models\TournamentTeam;
use App\Models\TournamentTeamInvitation;
use App\Models\User;
use App\Support\TournamentRegistrationGuard;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

class RespondToInvitation
{
    public function __construct(private TournamentRegistrationGuard $guard) {}

    public function handle(
        TournamentTeamInvitation $invitation,
        User $user,
        string $decision,
    ): TournamentTeamInvitation {
        return DB::transaction(function () use ($invitation, $user, $decision): TournamentTeamInvitation {
            $invitation = TournamentTeamInvitation::query()->lockForUpdate()->findOrFail($invitation->id);

            if ($invitation->status !== InvitationStatus::Pending) {
                throw new ConflictHttpException('This invitation is no longer pending.');
            }

            if ($invitation->expires_at === null || ! now()->lt($invitation->expires_at)) {
                throw new ConflictHttpException('This invitation has expired.');
            }

            if ($decision === 'accepted') {
                $team = TournamentTeam::query()->lockForUpdate()->findOrFail($invitation->team_id);
                $tournament = CampusTournament::query()->lockForUpdate()->findOrFail($team->tournament_id);
                $participant = TournamentParticipant::query()
                    ->where('tournament_id', $tournament->id)
                    ->where('user_id', $user->id)
                    ->lockForUpdate()
                    ->first();

                $this->guard->assertRegistrationOpen($tournament);
                $this->guard->assertPremadeTeam($team);
                $this->guard->assertTeamIsAssembling($team);
                $this->guard->assertEligibleForCampus($tournament, $user);
                $this->guard->assertLaneRoleAvailable($team, $invitation->intended_lane_role_code);

                if ($participant && $participant->status !== ParticipantStatus::Withdrawn) {
                    throw new ConflictHttpException('Leave your current team before accepting another invitation.');
                }

                $participantData = [
                    'tournament_id' => $team->tournament_id,
                    'user_id' => $user->id,
                    'team_id' => $team->id,
                    'entry_method' => 'premade',
                    'roster_role' => 'member',
                    'assigned_lane_role_code' => $invitation->intended_lane_role_code,
                    'status' => ParticipantStatus::Active,
                    'registered_at' => now(),
                    'accepted_at' => now(),
                    'withdrawn_at' => null,
                ];

                if ($participant) {
                    $participant->update($participantData);
                } else {
                    TournamentParticipant::query()->create($participantData);
                }

                $invitation->update([
                    'status' => InvitationStatus::Accepted,
                    'responded_at' => now(),
                ]);

                // Auto-transition team to registered if all 5 slots are now filled.
                $this->guard->transitionTeamIfFull($team);
            } else {
                $invitation->update([
                    'status' => InvitationStatus::Declined,
                    'responded_at' => now(),
                ]);
            }

            return $invitation->refresh();
        }, 3);
    }
}
