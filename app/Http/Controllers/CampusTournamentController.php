<?php

namespace App\Http\Controllers;

use App\Actions\CampusTournaments\CancelCampusTournament;
use App\Actions\CampusTournaments\CreateCampusTournament;
use App\Actions\CampusTournaments\ResubmitCampusTournament;
use App\Actions\CampusTournaments\ReviewCampusTournament;
use App\Enums\CampusTournamentReviewDecision;
use App\Http\Requests\ApproveCampusTournamentRequest;
use App\Http\Requests\CancelCampusTournamentRequest;
use App\Http\Requests\RejectCampusTournamentRequest;
use App\Http\Requests\ResubmitCampusTournamentRequest;
use App\Http\Requests\StoreCampusTournamentRequest;
use App\Models\Campus;
use App\Models\CampusTournament;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;

class CampusTournamentController extends Controller
{
    public function store(StoreCampusTournamentRequest $request, CreateCampusTournament $action): RedirectResponse
    {
        $campus = Campus::query()->findOrFail($request->integer('campus_id'));
        Gate::authorize('createForCampus', [CampusTournament::class, $campus]);

        $action->handle($request->user(), $request->validated());

        return back()->with('status', 'Tournament request submitted for approval.');
    }

    public function resubmit(
        ResubmitCampusTournamentRequest $request,
        CampusTournament $tournament,
        ResubmitCampusTournament $action,
    ): RedirectResponse {
        Gate::authorize('resubmit', $tournament);
        $action->handle($tournament, $request->user(), $request->validated());

        return back()->with('status', 'Tournament request resubmitted for approval.');
    }

    public function approve(
        ApproveCampusTournamentRequest $request,
        CampusTournament $tournament,
        ReviewCampusTournament $action,
    ): RedirectResponse {
        Gate::authorize('review', $tournament);
        $action->handle(
            $tournament,
            $request->user(),
            CampusTournamentReviewDecision::Approved,
            $request->validated('reason'),
        );

        return back()->with('status', 'Tournament request approved.');
    }

    public function reject(
        RejectCampusTournamentRequest $request,
        CampusTournament $tournament,
        ReviewCampusTournament $action,
    ): RedirectResponse {
        Gate::authorize('review', $tournament);
        $action->handle(
            $tournament,
            $request->user(),
            CampusTournamentReviewDecision::Rejected,
            $request->validated('reason'),
        );

        return back()->with('status', 'Tournament request rejected.');
    }

    public function destroy(
        CancelCampusTournamentRequest $request,
        CampusTournament $tournament,
        CancelCampusTournament $action,
    ): RedirectResponse {
        Gate::authorize('cancel', $tournament);
        $action->handle($tournament, $request->user(), $request->validated('reason'));

        return back()->with('status', 'Tournament request cancelled.');
    }
}
