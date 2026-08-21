<?php

namespace App\Actions\CampusTournaments;

use App\Enums\CampusTournamentApprovalStatus;
use App\Models\Campus;
use App\Models\CampusTournament;
use App\Models\CampusTournamentSubmission;
use App\Models\User;
use App\Support\CampusTournamentAuthorization;
use App\Support\CampusTournamentScheduleGuard;
use Carbon\CarbonImmutable;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

class ResubmitCampusTournament
{
    public function __construct(
        private CampusTournamentAuthorization $authorization,
        private CampusTournamentScheduleGuard $scheduleGuard,
    ) {}

    public function handle(CampusTournament $tournament, User $user, array $data): CampusTournament
    {
        return DB::transaction(function () use ($tournament, $user, $data): CampusTournament {
            $tournament = CampusTournament::query()->lockForUpdate()->findOrFail($tournament->id);

            if ($tournament->created_by_user_id !== $user->id) {
                throw new AuthorizationException('Only the original creator may resubmit this tournament.');
            }

            if ($tournament->approval_status !== CampusTournamentApprovalStatus::Rejected) {
                throw new ConflictHttpException('Only a rejected tournament may be resubmitted.');
            }

            $campus = Campus::query()->lockForUpdate()->findOrFail($data['campus_id']);
            if (! $this->authorization->isActiveStudentLeader($user, $campus)) {
                throw new AuthorizationException('You are not an active Student Leader for this campus.');
            }

            $dates = $this->dates($data);
            $this->scheduleGuard->assertValidOrder(...array_values($dates));
            $this->scheduleGuard->assertNoOverlap(
                $campus->id,
                $dates['registration_opens_at'],
                $dates['ends_at'],
                $tournament->id,
            );

            $version = ((int) $tournament->submissions()->max('version')) + 1;
            $submission = CampusTournamentSubmission::query()->create([
                'tournament_id' => $tournament->id,
                'submitted_by_user_id' => $user->id,
                'version' => $version,
                'campus_id' => $campus->id,
                'name' => $data['name'],
                'tournament_type_code' => $data['tournament_type_code'],
                ...$dates,
                'resubmission_reason' => $data['resubmission_reason'],
                'submitted_at' => now(),
            ]);

            $tournament->update([
                'campus_id' => $campus->id,
                'name' => $data['name'],
                'tournament_type_code' => $data['tournament_type_code'],
                'approval_status' => CampusTournamentApprovalStatus::Pending,
                'current_submission_id' => $submission->id,
                ...$dates,
            ]);

            return $tournament->refresh();
        }, 3);
    }

    private function dates(array $data): array
    {
        return [
            'registration_opens_at' => CarbonImmutable::parse($data['registration_opens_at'])->utc(),
            'registration_closes_at' => CarbonImmutable::parse($data['registration_closes_at'])->utc(),
            'starts_at' => CarbonImmutable::parse($data['starts_at'])->utc(),
            'ends_at' => CarbonImmutable::parse($data['ends_at'])->utc(),
        ];
    }
}
