<?php

namespace App\Http\Controllers;

use App\Actions\TournamentRegistration\CancelInvitation;
use App\Actions\TournamentRegistration\InviteMember;
use App\Actions\TournamentRegistration\JoinSoloTeam;
use App\Actions\TournamentRegistration\ListOpenSoloTeams;
use App\Actions\TournamentRegistration\RegisterPremadeTeam;
use App\Actions\TournamentRegistration\RegisterSoloParticipant;
use App\Actions\TournamentRegistration\RespondToInvitation;
use App\Actions\TournamentRegistration\WithdrawFromTournament;
use App\Enums\CampusTournamentApprovalStatus;
use App\Enums\InvitationStatus;
use App\Enums\ParticipantStatus;
use App\Enums\TeamFormationMethod;
use App\Enums\TeamStatus;
use App\Http\Requests\InviteMemberRequest;
use App\Http\Requests\JoinSoloTeamRequest;
use App\Http\Requests\RegisterPremadeTeamRequest;
use App\Http\Requests\RegisterSoloRequest;
use App\Http\Requests\RespondToInvitationRequest;
use App\Models\CampusTournament;
use App\Models\TournamentParticipant;
use App\Models\TournamentTeam;
use App\Models\TournamentTeamInvitation;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class TournamentRegistrationController extends Controller
{
    public function showMemberInvitations(Request $request): Response
    {
        $invitations = TournamentTeamInvitation::query()
            ->where('invited_user_id', $request->user()->id)
            ->where('status', InvitationStatus::Pending)
            ->where('expires_at', '>', now())
            ->whereHas('team.tournament', function ($query): void {
                $query->where('approval_status', CampusTournamentApprovalStatus::Approved)
                    ->whereNull('cancelled_at')
                    ->whereNull('roster_locked_at')
                    ->where('registration_opens_at', '<=', now())
                    ->where('registration_closes_at', '>', now());
            })
            ->with([
                'team.tournament.campus.institution',
                'team.captain',
                'team.activeParticipants.user',
            ])
            ->orderBy('expires_at')
            ->get()
            ->map(function (TournamentTeamInvitation $invitation): array {
                $team = $invitation->team;
                $player = fn (User $user, string $status = 'confirmed'): array => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'ign' => $user->ml_ign ?? $user->name,
                    'uid' => $user->ml_id ? $user->ml_id.'('.$user->ml_server.')' : 'N/A',
                    'status' => $status,
                ];

                return [
                    'id' => $invitation->id,
                    'laneRoleCode' => $invitation->intended_lane_role_code,
                    'expiresAt' => $invitation->expires_at->toIso8601String(),
                    'team' => [
                        'id' => $team->id,
                        'name' => $team->name,
                        'school' => $team->tournament->campus?->institution?->name
                            ?? $team->tournament->campus?->name,
                        'status' => $team->status === TeamStatus::Registered ? 'approved' : 'assembling',
                        'captain' => $player($team->captain),
                        'players' => $team->activeParticipants
                            ->where('user_id', '!=', $team->captain_user_id)
                            ->map(fn (TournamentParticipant $participant) => $player($participant->user))
                            ->values(),
                    ],
                ];
            });

        return Inertia::render('Programs/CampusTournaments/MemberInvite', [
            'invitations' => $invitations,
        ]);
    }

    public function showSoloMatchmaking(
        Request $request,
        ListOpenSoloTeams $action,
    ): Response {
        $user = $request->user();
        $now = now();

        $campusIds = $user->campusAffiliations()
            ->where('status', 'active')
            ->where(function ($query) use ($now): void {
                $query->whereNull('started_at')->orWhere('started_at', '<=', $now);
            })
            ->where(function ($query) use ($now): void {
                $query->whereNull('ended_at')->orWhere('ended_at', '>', $now);
            })
            ->pluck('campus_id');

        $availableTournaments = CampusTournament::query()
            ->whereIn('campus_id', $campusIds)
            ->where('approval_status', CampusTournamentApprovalStatus::Approved)
            ->whereNull('cancelled_at')
            ->whereNull('roster_locked_at')
            ->where('registration_opens_at', '<=', $now)
            ->where('registration_closes_at', '>', $now)
            ->with('campus.institution')
            ->orderBy('registration_closes_at')
            ->get();

        $requestedTournamentId = $request->integer('tournament');
        $tournament = $requestedTournamentId
            ? $availableTournaments->firstWhere('id', $requestedTournamentId)
            : null;

        if ($requestedTournamentId && ! $tournament) {
            abort(404);
        }

        if (! $tournament) {
            $participatingTournamentId = TournamentParticipant::query()
                ->where('user_id', $user->id)
                ->where('status', ParticipantStatus::Active)
                ->whereIn('tournament_id', $availableTournaments->pluck('id'))
                ->whereHas('team', fn ($query) => $query->where('formation_method', TeamFormationMethod::Solo))
                ->value('tournament_id');

            $tournament = $availableTournaments->firstWhere('id', $participatingTournamentId)
                ?? $availableTournaments->first();
        }

        $teams = $tournament ? $action->handle($tournament, $user) : collect();
        $hasParticipation = $tournament
            ? TournamentParticipant::query()
                ->where('tournament_id', $tournament->id)
                ->where('user_id', $user->id)
                ->exists()
            : false;

        return Inertia::render('Programs/CampusTournaments/SoloMatchmaking', [
            'tournament' => $tournament ? [
                'id' => $tournament->id,
                'title' => $tournament->name,
                'school' => $tournament->campus?->institution?->name
                    ?? $tournament->campus?->name,
                'registrationClosesAt' => $tournament->registration_closes_at->toIso8601String(),
                'rosterLockDate' => $tournament->registration_closes_at->format('M d, Y'),
            ] : null,
            'availableTournaments' => $availableTournaments->map(fn (CampusTournament $item) => [
                'id' => $item->id,
                'title' => $item->name,
                'school' => $item->campus?->institution?->name ?? $item->campus?->name,
            ])->values(),
            'teams' => $teams,
            'canCreateTeam' => $tournament !== null && ! $hasParticipation,
        ]);
    }

    public function indexSoloTeams(
        Request $request,
        CampusTournament $tournament,
        ListOpenSoloTeams $action,
    ): JsonResponse {
        return response()->json([
            'data' => $action->handle($tournament, $request->user()),
        ]);
    }

    /**
     * Create a premade team and register the authenticated user as its captain.
     */
    public function store(
        RegisterPremadeTeamRequest $request,
        CampusTournament $tournament,
        RegisterPremadeTeam $action,
    ): RedirectResponse {
        Gate::authorize('create', [TournamentTeam::class, $tournament]);

        $action->handle($request->user(), $tournament, $request->validated());

        return back()->with('status', 'Team created. Invite members to fill the remaining slots.');
    }

    /**
     * Create a public solo-matching team and lock the creator's selected lane.
     */
    public function storeSolo(
        RegisterSoloRequest $request,
        CampusTournament $tournament,
        RegisterSoloParticipant $action,
    ): RedirectResponse {
        Gate::authorize('register', [TournamentParticipant::class, $tournament]);

        $action->handle($request->user(), $tournament, $request->validated());

        return back()->with('status', 'Solo team created. Other solo players can now join its open lanes.');
    }

    public function joinSoloTeam(
        JoinSoloTeamRequest $request,
        TournamentTeam $team,
        JoinSoloTeam $action,
    ): RedirectResponse {
        Gate::authorize('joinSolo', $team);

        $action->handle($team, $request->user(), $request->validated('lane_role_code'));

        return back()->with('status', 'You have joined the solo team.');
    }

    /**
     * Invite a user to join a team for a specific lane role.
     */
    public function storeInvitation(
        InviteMemberRequest $request,
        TournamentTeam $team,
        InviteMember $action,
    ): RedirectResponse {
        Gate::authorize('invite', $team);

        $invitedUser = User::query()->findOrFail($request->integer('user_id'));
        $action->handle($team, $request->user(), $invitedUser, $request->validated('intended_lane_role_code'));

        return back()->with('status', 'Invitation sent.');
    }

    /**
     * Accept or decline a team invitation.
     */
    public function respond(
        RespondToInvitationRequest $request,
        TournamentTeamInvitation $invitation,
        RespondToInvitation $action,
    ): RedirectResponse {
        Gate::authorize('respond', [TournamentParticipant::class, $invitation]);

        $action->handle($invitation, $request->user(), $request->validated('decision'));

        $message = $request->validated('decision') === 'accepted'
            ? 'You have joined the team.'
            : 'Invitation declined.';

        return back()->with('status', $message);
    }

    public function destroyInvitation(
        Request $request,
        TournamentTeamInvitation $invitation,
        CancelInvitation $action,
    ): RedirectResponse {
        Gate::authorize('cancelInvitation', [TournamentTeam::class, $invitation]);

        $action->handle($invitation, $request->user());

        return back()->with('status', 'Invitation cancelled.');
    }

    /**
     * Withdraw the authenticated user from a tournament.
     * If the user is a captain, the entire team is disbanded.
     */
    public function destroy(
        Request $request,
        TournamentParticipant $participant,
        WithdrawFromTournament $action,
    ): RedirectResponse {
        Gate::authorize('withdraw', $participant);

        $action->handle($participant, $request->user());

        return back()->with('status', 'You have withdrawn from the tournament.');
    }
}
