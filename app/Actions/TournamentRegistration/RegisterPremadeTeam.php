<?php

namespace App\Actions\TournamentRegistration;

use App\Enums\InvitationStatus;
use App\Enums\ParticipantStatus;
use App\Enums\TeamFormationMethod;
use App\Enums\TeamStatus;
use App\Models\CampusTournament;
use App\Models\TournamentParticipant;
use App\Models\TournamentTeam;
use App\Models\TournamentTeamInvitation;
use App\Models\User;
use App\Support\TournamentRegistrationGuard;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class RegisterPremadeTeam
{
    public function __construct(private TournamentRegistrationGuard $guard) {}

    public function handle(User $user, CampusTournament $tournament, array $data): TournamentTeam
    {
        return DB::transaction(function () use ($user, $tournament, $data): TournamentTeam {
            $tournament = CampusTournament::query()->lockForUpdate()->findOrFail($tournament->id);

            $this->guard->assertRegistrationOpen($tournament);
            $this->guard->assertEligibleForCampus($tournament, $user);
            $this->guard->assertNotAlreadyParticipating($tournament, $user);

            $this->guard->assertActiveTeamNameAvailable($tournament, $data['name']);

            $members = [];
            $occupiedLanes = [$data['assigned_lane_role_code']];
            foreach ($data['members'] ?? [] as $index => $memberData) {
                $lane = $memberData['intended_lane_role_code'];
                if (in_array($lane, $occupiedLanes, true)) {
                    throw ValidationException::withMessages([
                        "members.{$index}.intended_lane_role_code" => 'Each player must have a different lane from the captain and other invitees.',
                    ]);
                }
                $occupiedLanes[] = $lane;

                $invitedUser = User::query()->where('username', $memberData['username'])->firstOrFail();
                if ($invitedUser->id === $user->id || in_array($invitedUser->id, array_column($members, 'id'), true)) {
                    throw ValidationException::withMessages([
                        "members.{$index}.username" => 'Choose four different players other than the captain.',
                    ]);
                }
                $this->guard->assertEligibleForCampus($tournament, $invitedUser);
                $members[] = ['id' => $invitedUser->id, 'lane' => $lane];
            }

            $team = TournamentTeam::query()->create([
                'tournament_id' => $tournament->id,
                'name' => $data['name'],
                'active_name' => $data['name'],
                'formation_method' => TeamFormationMethod::Premade,
                'status' => TeamStatus::Assembling,
                'captain_user_id' => $user->id,
                'discord_id' => $data['discord_id'] ?? null,
            ]);

            TournamentParticipant::query()->create([
                'tournament_id' => $tournament->id,
                'user_id' => $user->id,
                'team_id' => $team->id,
                'entry_method' => TeamFormationMethod::Premade->value,
                'roster_role' => 'captain',
                'assigned_lane_role_code' => $data['assigned_lane_role_code'],
                'status' => ParticipantStatus::Active,
                'registered_at' => now(),
                'accepted_at' => now(),
            ]);

            foreach ($members as $member) {
                TournamentTeamInvitation::query()->create([
                    'team_id' => $team->id,
                    'invited_user_id' => $member['id'],
                    'invited_by_user_id' => $user->id,
                    'intended_lane_role_code' => $member['lane'],
                    'status' => InvitationStatus::Pending,
                    'expires_at' => $this->guard->invitationExpiresAt($tournament),
                ]);
            }

            return $team->refresh();
        }, 3);
    }
}
