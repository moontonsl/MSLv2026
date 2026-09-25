<?php

namespace App\Actions\CampusTournaments;

use App\Enums\CampusTournamentApprovalStatus;
use App\Enums\ParticipantStatus;
use App\Enums\TeamStatus;
use App\Models\CampusTournament;
use App\Models\TournamentParticipant;
use App\Models\TournamentResultRevision;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

class PersistTournamentResultRevision
{
    private const LANE_ORDER = [
        'jungler' => 1,
        'roam' => 2,
        'gold_laner' => 3,
        'exp_laner' => 4,
        'mid_laner' => 5,
    ];

    public function handle(
        CampusTournament $tournament,
        User $submitter,
        array $entries,
        ?string $reason = null,
        bool $isCorrection = false,
    ): TournamentResultRevision {
        return DB::transaction(function () use ($tournament, $submitter, $entries, $reason, $isCorrection) {
            $lockedTournament = CampusTournament::query()
                ->whereKey($tournament->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($lockedTournament->approval_status !== CampusTournamentApprovalStatus::Approved
                || $lockedTournament->lifecycle() !== 'completed') {
                throw new ConflictHttpException('Results may only be submitted after the tournament is completed.');
            }

            if ($isCorrection && $lockedTournament->current_result_revision_id === null) {
                throw new ConflictHttpException('Submit the initial tournament results before creating a correction.');
            }

            if (! $isCorrection && $lockedTournament->current_result_revision_id !== null) {
                throw new ConflictHttpException('Tournament results have already been submitted.');
            }

            $registeredTeams = $lockedTournament->teams()
                ->where('status', TeamStatus::Registered->value)
                ->orderBy('id')
                ->lockForUpdate()
                ->get();

            if ($registeredTeams->isEmpty()) {
                throw ValidationException::withMessages([
                    'entries' => 'This tournament has no registered teams to report.',
                ]);
            }

            $submittedEntries = collect($entries)->keyBy(fn (array $entry): int => (int) $entry['team_id']);
            $registeredIds = $registeredTeams->pluck('id')->map(fn ($id): int => (int) $id)->sort()->values();
            $submittedIds = $submittedEntries->keys()->map(fn ($id): int => (int) $id)->sort()->values();

            if ($submittedEntries->count() !== count($entries) || $registeredIds->all() !== $submittedIds->all()) {
                throw ValidationException::withMessages([
                    'entries' => 'Submit exactly one placement for every registered team in this tournament.',
                ]);
            }

            if (! $submittedEntries->contains(fn (array $entry): bool => $entry['placement_code'] === '1st')) {
                throw ValidationException::withMessages([
                    'entries' => 'At least one registered team must be assigned first place.',
                ]);
            }

            $participants = TournamentParticipant::query()
                ->whereIn('team_id', $registeredIds)
                ->where('status', ParticipantStatus::Active->value)
                ->with('user')
                ->lockForUpdate()
                ->get()
                ->groupBy('team_id');

            foreach ($registeredTeams as $team) {
                $teamParticipants = $participants->get($team->id, collect());
                $captains = $teamParticipants->where('roster_role', 'captain');

                if ($teamParticipants->count() !== 5
                    || $captains->count() !== 1
                    || (int) $captains->first()->user_id !== (int) $team->captain_user_id) {
                    throw ValidationException::withMessages([
                        'entries' => "{$team->name} must have exactly five active players and one valid captain.",
                    ]);
                }
            }

            $version = ((int) TournamentResultRevision::query()
                ->where('tournament_id', $lockedTournament->id)
                ->lockForUpdate()
                ->max('version')) + 1;

            $revision = TournamentResultRevision::query()->create([
                'tournament_id' => $lockedTournament->id,
                'version' => $version,
                'submitted_by_user_id' => $submitter->id,
                'reason' => $isCorrection ? trim((string) $reason) : null,
                'submitted_at' => now(),
            ]);

            foreach ($registeredTeams as $team) {
                $entry = $submittedEntries->get($team->id);
                $revision->entries()->create([
                    'team_id' => $team->id,
                    'placement_code' => $entry['placement_code'],
                    'team_name_snapshot' => $team->name,
                    'roster_snapshot' => $this->snapshotRoster($participants->get($team->id, collect())),
                ]);
            }

            $lockedTournament->update(['current_result_revision_id' => $revision->id]);

            return $revision->load(['entries', 'submitter']);
        }, 3);
    }

    private function snapshotRoster(Collection $participants): array
    {
        return $participants
            ->sortBy(fn (TournamentParticipant $participant): array => [
                $participant->roster_role === 'captain' ? 0 : 1,
                self::LANE_ORDER[$participant->assigned_lane_role_code] ?? 99,
                $participant->id,
            ])
            ->values()
            ->map(fn (TournamentParticipant $participant): array => [
                'participant_id' => $participant->id,
                'user_id' => $participant->user_id,
                'name' => $participant->user?->name ?? 'Player',
                'ign' => $participant->user?->ml_ign,
                'server' => $participant->user?->ml_server,
                'uid' => $participant->user?->ml_id,
                'roster_role' => $participant->roster_role,
                'assigned_lane_role_code' => $participant->assigned_lane_role_code,
            ])
            ->all();
    }
}
