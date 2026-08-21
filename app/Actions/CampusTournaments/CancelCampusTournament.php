<?php

namespace App\Actions\CampusTournaments;

use App\Enums\CampusTournamentApprovalStatus;
use App\Models\Campus;
use App\Models\CampusTournament;
use App\Models\User;
use App\Support\CampusTournamentAuthorization;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

class CancelCampusTournament
{
    public function __construct(private CampusTournamentAuthorization $authorization) {}

    public function handle(CampusTournament $tournament, User $user, string $reason): CampusTournament
    {
        return DB::transaction(function () use ($tournament, $user, $reason): CampusTournament {
            $tournament = CampusTournament::query()->lockForUpdate()->findOrFail($tournament->id);
            $campus = Campus::query()->lockForUpdate()->findOrFail($tournament->campus_id);

            if ($tournament->created_by_user_id !== $user->id
                || ! $this->authorization->isActiveStudentLeader($user, $campus)) {
                throw new AuthorizationException('You are not authorized to cancel this tournament.');
            }

            if ($tournament->approval_status !== CampusTournamentApprovalStatus::Pending) {
                throw new ConflictHttpException('Only a pending tournament may be cancelled.');
            }

            $tournament->update([
                'approval_status' => CampusTournamentApprovalStatus::Cancelled,
                'cancelled_by_user_id' => $user->id,
                'cancellation_reason' => $reason,
                'cancelled_at' => now(),
            ]);

            return $tournament->refresh();
        }, 3);
    }
}
