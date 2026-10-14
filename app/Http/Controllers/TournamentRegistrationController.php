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
use App\Support\TournamentRegistrationGuard;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class TournamentRegistrationController extends Controller
{
    public function showCaptainHub(Request $request): Response
    {
        $tournament = $this->availableTournamentsFor($request->user())->first();

        return Inertia::render('Programs/CampusTournaments/CaptainHub', [
            'tournament' => $tournament ? $this->tournamentSummary($tournament) : null,
        ]);
    }

    public function showCaptainRegistration(Request $request): Response|RedirectResponse
    {
        $user = $request->user();
        $tournaments = $this->availableTournamentsFor($user);
        $existingTeam = TournamentTeam::query()
            ->whereIn('tournament_id', $tournaments->pluck('id'))
            ->where('captain_user_id', $user->id)
            ->where('formation_method', TeamFormationMethod::Premade)
            ->whereIn('status', [TeamStatus::Assembling, TeamStatus::Registered])
            ->exists();

        if ($existingTeam) {
            return redirect()->route('campus.team');
        }

        return Inertia::render('Programs/CampusTournaments/CaptainRegister', [
            'captain' => $this->player($user),
            'tournament' => $tournaments->first() ? $this->tournamentSummary($tournaments->first()) : null,
            'availableTournaments' => $tournaments->map(fn (CampusTournament $item) => $this->tournamentSummary($item))->values(),
        ]);
    }

    public function showCaptainTeam(Request $request): Response|RedirectResponse
    {
        $team = TournamentTeam::query()
            ->where('captain_user_id', $request->user()->id)
            ->where('formation_method', TeamFormationMethod::Premade)
            ->whereIn('status', [TeamStatus::Assembling, TeamStatus::Registered])
            ->whereHas('tournament', fn ($query) => $query
                ->where('approval_status', CampusTournamentApprovalStatus::Approved)
                ->whereNull('cancelled_at'))
            ->with(['tournament.campus.institution', 'captain', 'activeParticipants.user', 'invitations.invitedUser'])
            ->latest('id')
            ->first();

        if (! $team) {
            return redirect()->route('campus.captainregistration');
        }

        $pendingInvitations = $team->invitations
            ->where('status', InvitationStatus::Pending)
            ->filter(fn (TournamentTeamInvitation $invitation) => $invitation->expires_at?->isFuture())
            ->map(fn (TournamentTeamInvitation $invitation) => [
                ...$this->player($invitation->invitedUser),
                'invitationId' => $invitation->id,
                'role' => $invitation->intended_lane_role_code,
                'status' => 'pending',
                'expiresAt' => $invitation->expires_at?->toIso8601String(),
            ])->values();

        $participants = $team->activeParticipants
            ->sortByDesc(fn (TournamentParticipant $participant) => $participant->user_id === $team->captain_user_id)
            ->map(fn (TournamentParticipant $participant) => [
                ...$this->player($participant->user),
                'role' => $participant->assigned_lane_role_code,
                'status' => 'confirmed',
            ])->values();

        $occupiedRoles = $participants->pluck('role')->merge($pendingInvitations->pluck('role'))->filter()->all();

        return Inertia::render('Programs/CampusTournaments/CaptainTeam', [
            'team' => [
                'id' => $team->id,
                'tournamentId' => $team->tournament_id,
                'name' => $team->name,
                'school' => $team->tournament->campus?->institution?->name ?? $team->tournament->campus?->name,
                'status' => $team->status === TeamStatus::Registered ? 'approved' : 'assembling',
                'captain' => $participants->firstWhere('id', $team->captain_user_id),
                'players' => $participants->where('id', '!=', $team->captain_user_id)->concat($pendingInvitations)->values(),
                'availableLaneRoles' => array_values(array_diff(TournamentRegistrationGuard::LANE_ROLE_CODES, $occupiedRoles)),
            ],
        ]);
    }

    public function searchSchoolPlayers(Request $request): JsonResponse
    {
        $data = $request->validate([
            'search' => ['required', 'string', 'min:2', 'max:100'],
            'tournament' => ['required', 'integer', 'exists:campus_tournaments,id'],
            'team' => ['required', 'integer', 'exists:tournament_teams,id'],
        ]);
        $user = $request->user();
        $tournament = $this->availableTournamentsFor($user)->firstWhere('id', (int) $data['tournament']);

        abort_unless($tournament, 404);

        $team = TournamentTeam::query()
            ->whereKey($data['team'])
            ->where('tournament_id', $tournament->id)
            ->where('captain_user_id', $user->id)
            ->where('formation_method', TeamFormationMethod::Premade)
            ->where('status', TeamStatus::Assembling)
            ->firstOrFail();

        $users = User::query()
            ->whereKeyNot($user->id)
            ->where('status', 'active')
            ->whereNotNull('email_verified_at')
            ->where('is_mlbb_verified', true)
            ->whereHas('campusAffiliations', fn ($query) => $query
                ->where('campus_id', $tournament->campus_id)
                ->where('status', 'active'))
            ->whereDoesntHave('receivedInvitations', fn ($query) => $query
                ->where('team_id', $team->id)
                ->where('status', InvitationStatus::Pending)
                ->where('expires_at', '>', now()))
            ->whereDoesntHave('tournamentParticipations', fn ($query) => $query
                ->where('team_id', $team->id)
                ->where('status', ParticipantStatus::Active))
            ->where(function ($query) use ($data): void {
                $search = '%'.$data['search'].'%';
                $query->where('username', 'like', $search)
                    ->orWhere('name', 'like', $search)
                    ->orWhere('ml_ign', 'like', $search);
            })
            ->orderBy('name')
            ->limit(10)
            ->get()
            ->map(fn (User $candidate) => [
                ...$this->player($candidate),
                'username' => $candidate->username,
            ]);

        return response()->json(['data' => $users]);
    }

    public function showMemberJoin(): Response
    {
        return Inertia::render('Programs/CampusTournaments/MemberJoinCode');
    }

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

        return redirect()->route('campus.team')->with('status', 'Team created. Invite members to fill the remaining slots.');
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

    private function activeCampusIds(User $user)
    {
        $now = now();

        return $user->campusAffiliations()
            ->where('status', 'active')
            ->where(fn ($query) => $query->whereNull('started_at')->orWhere('started_at', '<=', $now))
            ->where(fn ($query) => $query->whereNull('ended_at')->orWhere('ended_at', '>', $now))
            ->pluck('campus_id');
    }

    private function availableTournamentsFor(User $user)
    {
        $now = now();

        return CampusTournament::query()
            ->whereIn('campus_id', $this->activeCampusIds($user))
            ->where('approval_status', CampusTournamentApprovalStatus::Approved)
            ->whereNull('cancelled_at')
            ->whereNull('roster_locked_at')
            ->where('registration_opens_at', '<=', $now)
            ->where('registration_closes_at', '>', $now)
            ->with('campus.institution')
            ->orderBy('registration_closes_at')
            ->get();
    }

    private function tournamentSummary(CampusTournament $tournament): array
    {
        return [
            'id' => $tournament->id,
            'title' => $tournament->name,
            'school' => $tournament->campus?->institution?->name ?? $tournament->campus?->name,
            'registrationClosesAt' => $tournament->registration_closes_at->toIso8601String(),
        ];
    }

    private function player(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'ign' => $user->ml_ign ?? $user->name,
            'uid' => $user->ml_id ? $user->ml_id.'('.$user->ml_server.')' : 'N/A',
        ];
    }
}
