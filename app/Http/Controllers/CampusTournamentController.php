<?php

namespace App\Http\Controllers;

use App\Actions\CampusTournaments\CancelCampusTournament;
use App\Actions\CampusTournaments\CreateCampusTournament;
use App\Actions\CampusTournaments\ResubmitCampusTournament;
use App\Actions\CampusTournaments\ReviewCampusTournament;
use App\Enums\CampusTournamentApprovalStatus;
use App\Enums\CampusTournamentReviewDecision;
use App\Enums\InvitationStatus;
use App\Enums\ParticipantStatus;
use App\Enums\TeamFormationMethod;
use App\Enums\TeamStatus;
use App\Http\Requests\ApproveCampusTournamentRequest;
use App\Http\Requests\CancelCampusTournamentRequest;
use App\Http\Requests\RejectCampusTournamentRequest;
use App\Http\Requests\ResubmitCampusTournamentRequest;
use App\Http\Requests\StoreCampusTournamentRequest;
use App\Models\Campus;
use App\Models\CampusTournament;
use App\Models\RegionAdmin;
use App\Models\TournamentParticipant;
use App\Models\TournamentTeam;
use App\Models\TournamentTeamInvitation;
use App\Support\CampusTournamentAuthorization;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class CampusTournamentController extends Controller
{
    /**
     * Smart role redirect at /campus-tournament.
     */
    public function redirectByRole(Request $request, CampusTournamentAuthorization $authorization): RedirectResponse
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        // 1. Super Admin or Regional Admin -> /Tournament/RegionalAdmin
        if ($user->user_type === 'Super Admin' || RegionAdmin::query()->where('user_id', $user->id)->exists()) {
            return redirect('/Tournament/RegionalAdmin');
        }

        // 2. Active Student Leader -> /Tournament/SL
        $isLeader = $user->campusAffiliations()
            ->where('role', 'student_leader')
            ->where('status', 'active')
            ->exists();

        if ($isLeader) {
            return redirect('/Tournament/SL');
        }

        // 3. Check active student involvement in open/ongoing tournaments
        $activeTournamentIds = CampusTournament::query()
            ->where('approval_status', CampusTournamentApprovalStatus::Approved)
            ->where('ends_at', '>', now())
            ->pluck('id');

        if ($activeTournamentIds->isNotEmpty()) {
            // 3a. Active Premade Team Captain -> /Tournament/CampusTournamentTeam
            $captainedTeam = TournamentTeam::query()
                ->where('captain_user_id', $user->id)
                ->where('formation_method', TeamFormationMethod::Premade)
                ->whereIn('status', [TeamStatus::Assembling, TeamStatus::Registered])
                ->whereIn('tournament_id', $activeTournamentIds)
                ->exists();

            if ($captainedTeam) {
                return redirect('/Tournament/CampusTournamentTeam');
            }

            // 3b. Active Solo Participant in assembling team -> /Tournament/SoloPlayer
            $soloParticipant = TournamentParticipant::query()
                ->where('user_id', $user->id)
                ->where('status', ParticipantStatus::Active)
                ->whereHas('team', function ($teamQuery) {
                    $teamQuery->where('formation_method', TeamFormationMethod::Solo)
                        ->where('status', TeamStatus::Assembling);
                })
                ->whereIn('tournament_id', $activeTournamentIds)
                ->exists();

            if ($soloParticipant) {
                return redirect('/Tournament/SoloPlayer');
            }

            // 3c. Pending Invitation -> /Tournament/MemberInvite
            $pendingInvite = TournamentTeamInvitation::query()
                ->where('invited_user_id', $user->id)
                ->where('status', InvitationStatus::Pending)
                ->whereHas('team', function ($teamQuery) use ($activeTournamentIds) {
                    $teamQuery->whereIn('tournament_id', $activeTournamentIds);
                })
                ->exists();

            if ($pendingInvite) {
                return redirect('/Tournament/MemberInvite');
            }
        }

        // 4. Default student -> Captain Hub
        return redirect('/Tournament/CampusTournament');
    }

    /**
     * School Organizer view: /Tournament/Organizer.
     */
    public function indexOrganizer(Request $request): Response
    {
        $user = $request->user();

        $campusIds = $user->campusAffiliations()
            ->where('status', 'active')
            ->pluck('campus_id');

        $pendingRequests = CampusTournament::query()
            ->where('approval_status', CampusTournamentApprovalStatus::Pending)
            ->where(function ($q) use ($user, $campusIds) {
                $q->where('created_by_user_id', $user->id)
                    ->orWhereIn('campus_id', $campusIds);
            })
            ->with(['campus.institution', 'tournamentType'])
            ->latest('id')
            ->get()
            ->map(fn (CampusTournament $t) => [
                'id' => $t->id,
                'title' => $t->name,
                'startDate' => $t->starts_at->format('Y-m-d'),
                'endDate' => $t->ends_at->format('Y-m-d'),
                'mode' => ucfirst($t->tournament_type_code ?? 'Online'),
                'status' => 'pending',
                'school' => $t->campus?->institution?->name ?? $t->campus?->name ?? 'MSL Campus',
            ]);

        $rejectedRequests = CampusTournament::query()
            ->where('approval_status', CampusTournamentApprovalStatus::Rejected)
            ->where(function ($q) use ($user, $campusIds) {
                $q->where('created_by_user_id', $user->id)
                    ->orWhereIn('campus_id', $campusIds);
            })
            ->with(['campus.institution', 'tournamentType'])
            ->latest('id')
            ->get()
            ->map(fn (CampusTournament $t) => [
                'id' => $t->id,
                'title' => $t->name,
                'startDate' => $t->starts_at->format('Y-m-d'),
                'endDate' => $t->ends_at->format('Y-m-d'),
                'mode' => ucfirst($t->tournament_type_code ?? 'Online'),
                'status' => 'rejected',
                'school' => $t->campus?->institution?->name ?? $t->campus?->name ?? 'MSL Campus',
            ]);

        $tournaments = CampusTournament::query()
            ->where('approval_status', CampusTournamentApprovalStatus::Approved)
            ->with(['campus.institution', 'tournamentType'])
            ->orderBy('starts_at', 'asc')
            ->get()
            ->map(function (CampusTournament $t) {
                $now = now();
                $tabStatus = 'upcoming';
                if ($now->gte($t->starts_at) && $now->lt($t->ends_at)) {
                    $tabStatus = 'ongoing';
                } elseif ($now->gte($t->ends_at)) {
                    $tabStatus = 'completed';
                }

                return [
                    'id' => $t->id,
                    'title' => $t->name,
                    'startDate' => $t->starts_at->format('Y-m-d'),
                    'endDate' => $t->ends_at->format('Y-m-d'),
                    'mode' => ucfirst($t->tournament_type_code ?? 'Online'),
                    'status' => $tabStatus,
                    'school' => $t->campus?->institution?->name ?? $t->campus?->name ?? 'MSL Campus',
                ];
            });

        return Inertia::render('Programs/CampusTournaments/OrganizerView', [
            'pendingRequests' => $pendingRequests,
            'rejectedRequests' => $rejectedRequests,
            'tournaments' => $tournaments,
        ]);
    }

    /**
     * Student Leader / Regional Admin manage view: /Tournament/SL & /Tournament/RegionalAdmin.
     */
    public function indexSl(Request $request, CampusTournamentAuthorization $authorization): Response
    {
        $user = $request->user();
        $isReviewer = $user->user_type === 'Super Admin'
            || RegionAdmin::query()->where('user_id', $user->id)->exists();

        $pendingQuery = CampusTournament::query()
            ->where('approval_status', CampusTournamentApprovalStatus::Pending);

        if ($isReviewer) {
            $pendingQuery = CampusTournament::pendingForReviewer($user);
        } else {
            $campusIds = $user->campusAffiliations()
                ->where('role', 'student_leader')
                ->where('status', 'active')
                ->pluck('campus_id');
            $pendingQuery->whereIn('campus_id', $campusIds);
        }

        $approvalRequests = $pendingQuery
            ->with(['campus.institution', 'creator', 'tournamentType'])
            ->latest('id')
            ->get()
            ->map(fn (CampusTournament $t) => [
                'id' => $t->id,
                'schoolName' => $t->campus?->institution?->name ?? $t->campus?->name ?? 'MSL School',
                'type' => ucfirst($t->tournament_type_code ?? 'Online'),
                'startDate' => $t->starts_at->format('Y-m-d'),
                'endDate' => $t->ends_at->format('Y-m-d'),
                'slName' => $t->creator?->name ?? 'Student Leader',
            ]);

        $rejectedRequests = CampusTournament::query()
            ->where('approval_status', CampusTournamentApprovalStatus::Rejected)
            ->when(! $isReviewer, function ($q) use ($user) {
                $campusIds = $user->campusAffiliations()->where('status', 'active')->pluck('campus_id');
                $q->whereIn('campus_id', $campusIds);
            })
            ->with(['campus.institution', 'tournamentType'])
            ->latest('id')
            ->get()
            ->map(fn (CampusTournament $t) => [
                'id' => $t->id,
                'title' => $t->name,
                'schoolName' => $t->campus?->institution?->name ?? $t->campus?->name ?? 'MSL School',
                'startDate' => $t->starts_at->format('Y-m-d'),
                'endDate' => $t->ends_at->format('Y-m-d'),
                'mode' => ucfirst($t->tournament_type_code ?? 'Online'),
                'status' => 'rejected',
            ]);

        $managedTournamentsQuery = CampusTournament::query()
            ->where('approval_status', CampusTournamentApprovalStatus::Approved);

        if (! $isReviewer) {
            $campusIds = $user->campusAffiliations()->where('status', 'active')->pluck('campus_id');
            $managedTournamentsQuery->whereIn('campus_id', $campusIds);
        }

        $tournaments = $managedTournamentsQuery
            ->with([
                'campus.institution',
                'tournamentType',
                'teams.activeParticipants.user',
                'teams.captain',
            ])
            ->orderBy('starts_at', 'asc')
            ->get()
            ->map(function (CampusTournament $t) {
                $now = now();
                $tabStatus = 'upcoming';
                if ($now->gte($t->starts_at) && $now->lt($t->ends_at)) {
                    $tabStatus = 'ongoing';
                } elseif ($now->gte($t->ends_at)) {
                    $tabStatus = 'completed';
                }

                $teams = $t->teams->map(function (TournamentTeam $team) {
                    $players = $team->activeParticipants->map(fn (TournamentParticipant $p) => [
                        'id' => $p->id,
                        'name' => $p->user?->name ?? 'Player',
                        'ign' => $p->user?->ml_ign ?? $p->user?->name ?? 'Player',
                        'uid' => $p->user?->ml_id ? "{$p->user->ml_id}({$p->user->ml_server})" : 'N/A',
                        'role' => strtoupper($p->assigned_lane_role_code ?? 'FLEX'),
                        'status' => 'confirmed',
                    ]);

                    return [
                        'id' => $team->id,
                        'name' => $team->name,
                        'placement' => 'participant',
                        'players' => $players,
                    ];
                });

                $rosterTeams = $t->teams->map(function (TournamentTeam $team) {
                    $captainUser = $team->captain;

                    return [
                        'id' => $team->id,
                        'name' => $team->name,
                        'type' => $team->formation_method->value === 'solo' ? 'solo' : 'team',
                        'status' => $team->status->value === 'registered' ? 'confirmed' : 'assembling',
                        'captain' => [
                            'name' => $captainUser?->name ?? 'Captain',
                            'ign' => $captainUser?->ml_ign ?? $captainUser?->name ?? 'Captain',
                            'uid' => $captainUser?->ml_id ? "{$captainUser->ml_id}({$captainUser->ml_server})" : 'N/A',
                            'role' => 'CAPTAIN',
                        ],
                        'matchReady' => $team->status->value === 'registered',
                    ];
                });

                return [
                    'id' => $t->id,
                    'title' => $t->name,
                    'schoolName' => $t->campus?->institution?->name ?? $t->campus?->name ?? 'MSL School',
                    'startDate' => $t->starts_at->format('Y-m-d'),
                    'endDate' => $t->ends_at->format('Y-m-d'),
                    'mode' => ucfirst($t->tournament_type_code ?? 'Online'),
                    'status' => $tabStatus,
                    'rosterLockDate' => $t->roster_locked_at ? $t->roster_locked_at->format('M d, Y') : $t->registration_closes_at->format('M d, Y'),
                    'resultsSubmitted' => false,
                    'teams' => $teams,
                    'rosterTeams' => $rosterTeams,
                ];
            });

        return Inertia::render('Programs/CampusTournaments/SlView', [
            'approvalRequests' => $approvalRequests,
            'rejectedRequests' => $rejectedRequests,
            'pendingCreates' => [],
            'tournaments' => $tournaments,
            'isReviewer' => $isReviewer,
        ]);
    }
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
