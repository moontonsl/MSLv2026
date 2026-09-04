<?php

namespace App\Support;

use App\Enums\CampusTournamentApprovalStatus;
use App\Enums\InvitationStatus;
use App\Enums\ParticipantStatus;
use App\Enums\TeamFormationMethod;
use App\Enums\TeamStatus;
use App\Models\CampusAffiliation;
use App\Models\CampusTournament;
use App\Models\TournamentParticipant;
use App\Models\TournamentTeam;
use App\Models\TournamentTeamInvitation;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

class TournamentRegistrationGuard
{
    public const LANE_ROLE_CODES = [
        'jungler',
        'roam',
        'gold_laner',
        'exp_laner',
        'mid_laner',
    ];

    /**
     * Ensure the tournament is approved and its registration window is open.
     */
    public function assertTournamentApproved(CampusTournament $tournament): void
    {
        if ($tournament->approval_status !== CampusTournamentApprovalStatus::Approved) {
            throw new ConflictHttpException('This tournament is not open for registration.');
        }
    }

    public function assertRegistrationOpen(CampusTournament $tournament): void
    {
        $this->assertTournamentApproved($tournament);

        $now = now();

        if ($tournament->cancelled_at !== null
            || $tournament->roster_locked_at !== null
            || $now->lt($tournament->registration_opens_at)
            || ! $now->lt($tournament->registration_closes_at)) {
            throw new ConflictHttpException('Tournament registration is closed.');
        }
    }

    public function assertEligibleForCampus(CampusTournament $tournament, User $user): void
    {
        $now = now();
        $eligible = $user->status === 'active'
            && CampusAffiliation::query()
                ->where('campus_id', $tournament->campus_id)
                ->where('user_id', $user->id)
                ->where('status', 'active')
                ->where(function ($query) use ($now): void {
                    $query->whereNull('started_at')->orWhere('started_at', '<=', $now);
                })
                ->where(function ($query) use ($now): void {
                    $query->whereNull('ended_at')->orWhere('ended_at', '>', $now);
                })
                ->exists();

        if (! $eligible) {
            throw ValidationException::withMessages([
                'user_id' => 'An active affiliation with the tournament campus is required.',
            ]);
        }
    }

    public function invitationExpiresAt(CampusTournament $tournament): Carbon
    {
        return now()->addHours(48)->min($tournament->registration_closes_at);
    }

    public function joinCodeExpiresAt(CampusTournament $tournament): Carbon
    {
        return now()->addHours(24)->min($tournament->registration_closes_at);
    }

    /**
     * Ensure the user has no existing participant record (of any status) in the tournament.
     */
    public function assertNotAlreadyParticipating(CampusTournament $tournament, User $user): void
    {
        if (TournamentParticipant::query()
            ->where('tournament_id', $tournament->id)
            ->where('user_id', $user->id)
            ->exists()) {
            throw ValidationException::withMessages([
                'user_id' => 'This user is already registered in this tournament.',
            ]);
        }
    }

    /**
     * Ensure the team is still in the assembling state.
     */
    public function assertTeamIsAssembling(TournamentTeam $team): void
    {
        if ($team->status !== TeamStatus::Assembling) {
            throw new ConflictHttpException(
                "This team is no longer accepting members (status: {$team->status->value})."
            );
        }
    }

    public function assertSoloTeam(TournamentTeam $team): void
    {
        if ($team->formation_method !== TeamFormationMethod::Solo) {
            throw new ConflictHttpException('Only solo-matching teams can be joined directly.');
        }
    }

    public function assertPremadeTeam(TournamentTeam $team): void
    {
        if ($team->formation_method !== TeamFormationMethod::Premade) {
            throw new ConflictHttpException('Invitations and join codes are only available to premade teams.');
        }
    }

    public function assertActiveTeamNameAvailable(CampusTournament $tournament, string $name): void
    {
        if (TournamentTeam::query()
            ->where('tournament_id', $tournament->id)
            ->where('active_name', $name)
            ->exists()) {
            throw ValidationException::withMessages([
                'name' => 'An active team with this name already exists in the tournament.',
            ]);
        }
    }

    /**
     * Ensure the given lane role slot has not already been filled by an active participant on this team.
     */
    public function assertLaneRoleAvailable(TournamentTeam $team, string $laneRoleCode): void
    {
        $taken = TournamentParticipant::query()
            ->where('team_id', $team->id)
            ->where('assigned_lane_role_code', $laneRoleCode)
            ->where('status', ParticipantStatus::Active)
            ->exists();

        if ($taken) {
            throw ValidationException::withMessages([
                'assigned_lane_role_code' => 'This lane role is already filled on the team.',
            ]);
        }
    }

    public function assertInvitationSlotAvailable(
        TournamentTeam $team,
        User $invitedUser,
        string $laneRoleCode,
    ): void {
        $pendingInvitations = TournamentTeamInvitation::query()
            ->where('team_id', $team->id)
            ->where('status', InvitationStatus::Pending)
            ->where('expires_at', '>', now());

        if ((clone $pendingInvitations)->where('invited_user_id', $invitedUser->id)->exists()) {
            throw ValidationException::withMessages([
                'user_id' => 'This user already has a pending invitation to the team.',
            ]);
        }

        if ((clone $pendingInvitations)->where('intended_lane_role_code', $laneRoleCode)->exists()) {
            throw ValidationException::withMessages([
                'intended_lane_role_code' => 'This lane role already has a pending invitation.',
            ]);
        }
    }

    /**
     * Ensure the user is an active participant on this team.
     */
    public function assertUserBelongsToTeam(TournamentTeam $team, User $user): void
    {
        $belongs = TournamentParticipant::query()
            ->where('team_id', $team->id)
            ->where('user_id', $user->id)
            ->where('status', ParticipantStatus::Active)
            ->exists();

        if (! $belongs) {
            throw new ConflictHttpException('You are not an active member of this team.');
        }
    }

    /**
     * Transition the team to "registered" if all 5 lane role slots are filled by active participants.
     * Must be called inside the same DB transaction that created the last participant.
     */
    public function transitionTeamIfFull(TournamentTeam $team): void
    {
        $activeCount = TournamentParticipant::query()
            ->where('team_id', $team->id)
            ->where('status', ParticipantStatus::Active)
            ->count();

        $assignedRoles = TournamentParticipant::query()
            ->where('team_id', $team->id)
            ->where('status', ParticipantStatus::Active)
            ->pluck('assigned_lane_role_code')
            ->filter()
            ->sort()
            ->values()
            ->all();
        $requiredRoles = self::LANE_ROLE_CODES;
        sort($requiredRoles);

        if ($activeCount === 5 && $assignedRoles === $requiredRoles) {
            $team->update([
                'status' => TeamStatus::Registered,
                'registered_at' => now(),
            ]);
        }
    }
}
