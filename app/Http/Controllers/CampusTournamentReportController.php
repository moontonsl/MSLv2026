<?php

namespace App\Http\Controllers;

use App\Actions\CampusTournaments\PersistTournamentResultRevision;
use App\Enums\ParticipantStatus;
use App\Enums\TeamStatus;
use App\Http\Requests\CorrectTournamentResultsRequest;
use App\Http\Requests\SubmitTournamentResultsRequest;
use App\Models\CampusTournament;
use App\Models\RegionAdmin;
use App\Models\TournamentParticipant;
use App\Models\TournamentPlacement;
use App\Models\TournamentResultEntry;
use App\Models\TournamentTeam;
use App\Support\TournamentResultsWorkbook;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CampusTournamentReportController extends Controller
{
    private const LANE_ORDER = [
        'jungler' => 1,
        'roam' => 2,
        'gold_laner' => 3,
        'exp_laner' => 4,
        'mid_laner' => 5,
    ];

    public function show(Request $request, CampusTournament $tournament): Response
    {
        Gate::authorize('viewReport', $tournament);
        abort_unless($tournament->lifecycle() === 'completed', 404);

        $tournament->load([
            'campus.institution',
            'campus.city.region',
            'creator',
            'tournamentType',
            'currentResultRevision.submitter',
            'currentResultRevision.entries.team',
            'resultRevisions' => fn ($query) => $query->with('submitter')->orderByDesc('version'),
        ]);

        $teams = $tournament->currentResultRevision
            ? $this->snapshotTeams($tournament->currentResultRevision->entries)
            : $this->registeredTeams($tournament);
        $user = $request->user();
        $viewerRole = $user->user_type === 'Super Admin'
            ? 'core'
            : (RegionAdmin::query()->where('user_id', $user->id)->exists()
                ? 'regional_admin'
                : 'student_leader');

        return Inertia::render('Programs/CampusTournaments/PostEventReport', [
            'viewerRole' => $viewerRole,
            'backUrl' => $viewerRole === 'student_leader'
                ? route('campus.tournament.sl')
                : route('campus.tournament.regionaladmin'),
            'placements' => TournamentPlacement::query()
                ->orderBy('sort_order')
                ->get(['code', 'name'])
                ->map(fn (TournamentPlacement $placement): array => [
                    'code' => $placement->code,
                    'name' => $placement->name,
                ]),
            'permissions' => [
                'canSubmit' => $tournament->current_result_revision_id === null
                    && Gate::allows('submitResults', $tournament),
                'canCorrect' => $tournament->current_result_revision_id !== null
                    && Gate::allows('correctResults', $tournament),
                'canExport' => $tournament->current_result_revision_id !== null,
            ],
            'tournament' => [
                'id' => $tournament->id,
                'name' => $tournament->name,
                'school' => $tournament->campus?->institution?->name ?? 'MSL Campus',
                'campus' => $tournament->campus?->name,
                'region' => $tournament->campus?->city?->region?->name,
                'type' => $tournament->tournamentType?->name ?? ucfirst($tournament->tournament_type_code),
                'registrationOpensAt' => $tournament->registration_opens_at->toIso8601String(),
                'registrationClosesAt' => $tournament->registration_closes_at->toIso8601String(),
                'startsAt' => $tournament->starts_at->toIso8601String(),
                'endsAt' => $tournament->ends_at->toIso8601String(),
                'teams' => $teams,
                'currentResult' => $tournament->currentResultRevision ? [
                    'version' => $tournament->currentResultRevision->version,
                    'submittedAt' => $tournament->currentResultRevision->submitted_at->toIso8601String(),
                    'submittedBy' => $tournament->currentResultRevision->submitter?->name,
                    'reason' => $tournament->currentResultRevision->reason,
                ] : null,
                'revisionHistory' => $tournament->resultRevisions->map(fn ($revision): array => [
                    'version' => $revision->version,
                    'submittedAt' => $revision->submitted_at->toIso8601String(),
                    'submittedBy' => $revision->submitter?->name,
                    'reason' => $revision->reason,
                    'isCurrent' => $revision->id === $tournament->current_result_revision_id,
                ]),
            ],
        ]);
    }

    public function store(
        SubmitTournamentResultsRequest $request,
        CampusTournament $tournament,
        PersistTournamentResultRevision $action,
    ): RedirectResponse {
        Gate::authorize('submitResults', $tournament);
        $action->handle($tournament, $request->user(), $request->validated('entries'));

        return back()->with('status', 'Tournament results submitted successfully.');
    }

    public function correct(
        CorrectTournamentResultsRequest $request,
        CampusTournament $tournament,
        PersistTournamentResultRevision $action,
    ): RedirectResponse {
        Gate::authorize('correctResults', $tournament);
        $action->handle(
            $tournament,
            $request->user(),
            $request->validated('entries'),
            $request->validated('reason'),
            true,
        );

        return back()->with('status', 'Tournament results corrected successfully.');
    }

    public function export(
        CampusTournament $tournament,
        TournamentResultsWorkbook $workbook,
    ): StreamedResponse {
        Gate::authorize('viewReport', $tournament);
        abort_unless($tournament->lifecycle() === 'completed', 404);
        abort_if($tournament->current_result_revision_id === null, 409, 'No tournament report has been submitted.');

        $tournament->load(['campus.institution', 'tournamentType']);
        $revision = $tournament->currentResultRevision()
            ->with(['submitter', 'entries'])
            ->firstOrFail();

        return $workbook->download($tournament, $revision);
    }

    private function registeredTeams(CampusTournament $tournament): array
    {
        return $tournament->teams()
            ->where('status', TeamStatus::Registered->value)
            ->with(['activeParticipants.user'])
            ->orderBy('registered_at')
            ->orderBy('id')
            ->get()
            ->map(fn (TournamentTeam $team): array => [
                'id' => $team->id,
                'name' => $team->name,
                'formationMethod' => $team->formation_method->value,
                'placement' => 'participant',
                'players' => $team->activeParticipants
                    ->where('status', ParticipantStatus::Active)
                    ->sortBy(fn (TournamentParticipant $participant): array => [
                        $participant->roster_role === 'captain' ? 0 : 1,
                        self::LANE_ORDER[$participant->assigned_lane_role_code] ?? 99,
                    ])
                    ->values()
                    ->map(fn (TournamentParticipant $participant): array => [
                        'id' => $participant->id,
                        'name' => $participant->user?->name ?? 'Player',
                        'ign' => $participant->user?->ml_ign,
                        'server' => $participant->user?->ml_server,
                        'uid' => $participant->user?->ml_id,
                        'rosterRole' => $participant->roster_role,
                        'laneRole' => $participant->assigned_lane_role_code,
                    ])->all(),
            ])->all();
    }

    private function snapshotTeams($entries): array
    {
        return $entries
            ->sortBy(fn (TournamentResultEntry $entry): int => $entry->team_id)
            ->values()
            ->map(fn (TournamentResultEntry $entry): array => [
                'id' => $entry->team_id,
                'name' => $entry->team_name_snapshot,
                'formationMethod' => $entry->team?->formation_method?->value,
                'placement' => $entry->placement_code,
                'players' => collect($entry->roster_snapshot)->map(fn (array $player): array => [
                    'id' => $player['participant_id'] ?? $player['user_id'],
                    'name' => $player['name'] ?? 'Player',
                    'ign' => $player['ign'] ?? null,
                    'server' => $player['server'] ?? null,
                    'uid' => $player['uid'] ?? null,
                    'rosterRole' => $player['roster_role'] ?? 'member',
                    'laneRole' => $player['assigned_lane_role_code'] ?? null,
                ])->all(),
            ])->all();
    }
}
