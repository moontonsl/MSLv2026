<?php

namespace App\Http\Controllers;

use App\Actions\TournamentRegistration\CancelInvitation;
use App\Actions\TournamentRegistration\GenerateJoinCode;
use App\Actions\TournamentRegistration\InviteMember;
use App\Actions\TournamentRegistration\JoinSoloTeam;
use App\Actions\TournamentRegistration\JoinTeamByCode;
use App\Actions\TournamentRegistration\ListOpenSoloTeams;
use App\Actions\TournamentRegistration\RegisterPremadeTeam;
use App\Actions\TournamentRegistration\RegisterSoloParticipant;
use App\Actions\TournamentRegistration\RespondToInvitation;
use App\Actions\TournamentRegistration\RevokeJoinCode;
use App\Actions\TournamentRegistration\WithdrawFromTournament;
use App\Http\Requests\InviteMemberRequest;
use App\Http\Requests\JoinSoloTeamRequest;
use App\Http\Requests\JoinTeamByCodeRequest;
use App\Http\Requests\RegisterPremadeTeamRequest;
use App\Http\Requests\RegisterSoloRequest;
use App\Http\Requests\RespondToInvitationRequest;
use App\Models\CampusTournament;
use App\Models\TournamentParticipant;
use App\Models\TournamentTeam;
use App\Models\TournamentTeamInvitation;
use App\Models\TournamentTeamJoinCode;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class TournamentRegistrationController extends Controller
{
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
     * Generate a new join code for a team (plaintext returned once via flash).
     */
    public function storeJoinCode(
        Request $request,
        TournamentTeam $team,
        GenerateJoinCode $action,
    ): RedirectResponse {
        Gate::authorize('generateJoinCode', $team);

        $result = $action->handle($team, $request->user());

        return back()->with([
            'status' => 'Join code generated.',
            'join_code' => $result['code'],
            'join_code_hint' => $result['hint'],
        ]);
    }

    /**
     * Revoke a join code so it can no longer be used.
     */
    public function destroyJoinCode(
        Request $request,
        TournamentTeamJoinCode $joinCode,
        RevokeJoinCode $action,
    ): RedirectResponse {
        Gate::authorize('revokeJoinCode', [TournamentTeam::class, $joinCode]);

        $action->handle($joinCode, $request->user());

        return back()->with('status', 'Join code revoked.');
    }

    /**
     * Join a team using a plaintext join code.
     */
    public function join(
        JoinTeamByCodeRequest $request,
        CampusTournament $tournament,
        JoinTeamByCode $action,
    ): RedirectResponse {
        $action->handle($tournament, $request->user(), $request->validated());

        return back()->with('status', 'You have joined the team.');
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
