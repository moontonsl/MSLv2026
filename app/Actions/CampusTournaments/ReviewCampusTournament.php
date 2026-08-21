<?php

namespace App\Actions\CampusTournaments;

use App\Enums\CampusTournamentApprovalStatus;
use App\Enums\CampusTournamentReviewDecision;
use App\Models\Campus;
use App\Models\CampusTournament;
use App\Models\CampusTournamentReview;
use App\Models\CampusTournamentSubmission;
use App\Models\User;
use App\Support\CampusTournamentAuthorization;
use App\Support\CampusTournamentScheduleGuard;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

class ReviewCampusTournament
{
    public function __construct(
        private CampusTournamentAuthorization $authorization,
        private CampusTournamentScheduleGuard $scheduleGuard,
    ) {}

    public function handle(
        CampusTournament $tournament,
        User $reviewer,
        CampusTournamentReviewDecision $decision,
        ?string $reason = null,
    ): CampusTournament {
        return DB::transaction(function () use ($tournament, $reviewer, $decision, $reason): CampusTournament {
            $tournament = CampusTournament::query()->lockForUpdate()->findOrFail($tournament->id);
            $campus = Campus::query()->lockForUpdate()->findOrFail($tournament->campus_id);

            if (! $this->authorization->canReview($reviewer, $campus)) {
                throw new AuthorizationException('You are not authorized to review this campus tournament.');
            }

            if ($tournament->approval_status !== CampusTournamentApprovalStatus::Pending) {
                throw new ConflictHttpException('This tournament request has already been processed.');
            }

            $submission = CampusTournamentSubmission::query()
                ->whereKey($tournament->current_submission_id)
                ->where('tournament_id', $tournament->id)
                ->lockForUpdate()
                ->first();

            if (! $submission || CampusTournamentReview::query()->where('submission_id', $submission->id)->exists()) {
                throw new ConflictHttpException('The current tournament submission cannot be reviewed again.');
            }

            if ($decision === CampusTournamentReviewDecision::Approved) {
                if ($campus->status !== 'active'
                    || ! $this->authorization->isActiveStudentLeader($tournament->creator, $campus)) {
                    throw new ConflictHttpException('The campus or submitting Student Leader is no longer active.');
                }

                $this->scheduleGuard->assertValidOrder(
                    $tournament->registration_opens_at,
                    $tournament->registration_closes_at,
                    $tournament->starts_at,
                    $tournament->ends_at,
                );
                $this->scheduleGuard->assertNoOverlap(
                    $campus->id,
                    $tournament->registration_opens_at,
                    $tournament->ends_at,
                    $tournament->id,
                );
            }

            CampusTournamentReview::query()->create([
                'tournament_id' => $tournament->id,
                'submission_id' => $submission->id,
                'reviewer_user_id' => $reviewer->id,
                'decision' => $decision,
                'reason' => $reason,
            ]);

            $tournament->approval_status = match ($decision) {
                CampusTournamentReviewDecision::Approved => CampusTournamentApprovalStatus::Approved,
                CampusTournamentReviewDecision::Rejected => CampusTournamentApprovalStatus::Rejected,
            };
            $tournament->save();

            return $tournament->refresh();
        }, 3);
    }
}
