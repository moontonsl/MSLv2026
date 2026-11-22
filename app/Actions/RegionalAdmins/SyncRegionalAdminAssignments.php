<?php

namespace App\Actions\RegionalAdmins;

use App\Models\AdminUser;
use App\Models\Campus;
use App\Models\Region;
use App\Models\RegionAdmin;
use App\Models\RegionAdminCampusAssignment;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SyncRegionalAdminAssignments
{
    public function handle(
        User $user,
        array $regionCodes,
        array $campusIds,
        AdminUser $actor,
        ?string $designation = null,
    ): void {
        DB::transaction(function () use ($user, $regionCodes, $campusIds, $actor, $designation): void {
            $user = User::query()->lockForUpdate()->findOrFail($user->id);
            abort_unless($user->status === 'active', 422, 'Only active users can become Regional Admins.');

            $regionCodes = collect($regionCodes)->map(fn ($code) => (string) $code)->unique()->values();
            $campusIds = collect($campusIds)->map(fn ($id) => (int) $id)->unique()->values();

            if ($regionCodes->isEmpty()) {
                throw ValidationException::withMessages([
                    'region_codes' => 'Select at least one official region.',
                ]);
            }

            $validRegionCodes = Region::query()->whereIn('code', $regionCodes)->pluck('code');
            if ($validRegionCodes->count() !== $regionCodes->count()) {
                throw ValidationException::withMessages([
                    'region_codes' => 'One or more selected regions are invalid.',
                ]);
            }

            $campuses = Campus::query()
                ->with('city')
                ->whereIn('id', $campusIds)
                ->lockForUpdate()
                ->get();

            if ($campuses->count() !== $campusIds->count()) {
                throw ValidationException::withMessages([
                    'campus_ids' => 'One or more selected campuses are invalid.',
                ]);
            }

            if ($campuses->contains(fn (Campus $campus) => ! $regionCodes->contains($campus->city?->region_code))) {
                throw ValidationException::withMessages([
                    'campus_ids' => 'Every selected campus must belong to one of the Regional Admin’s regions.',
                ]);
            }

            $assignments = RegionAdmin::query()
                ->where('user_id', $user->id)
                ->with('campusAssignments')
                ->lockForUpdate()
                ->get()
                ->keyBy('region_code');

            $ownedAssignmentIds = $assignments->pluck('id');
            $conflictingCampus = RegionAdminCampusAssignment::query()
                ->whereIn('campus_id', $campusIds)
                ->whereNotIn('region_admin_id', $ownedAssignmentIds)
                ->with(['campus.institution', 'campus.city'])
                ->lockForUpdate()
                ->first();

            if ($conflictingCampus) {
                $label = $conflictingCampus->campus?->institution?->name
                    ?? $conflictingCampus->campus?->name
                    ?? 'The selected campus';
                throw ValidationException::withMessages([
                    'campus_ids' => "{$label} is already assigned to another Regional Admin. Release it first.",
                ]);
            }

            $now = now();

            foreach ($assignments as $regionCode => $assignment) {
                foreach ($assignment->campusAssignments as $campusAssignment) {
                    if (! $campusIds->contains($campusAssignment->campus_id) || ! $regionCodes->contains($regionCode)) {
                        $this->closeCampusHistory($user->id, $campusAssignment->campus_id, $actor->id, $now);
                        $campusAssignment->delete();
                    }
                }

                if (! $regionCodes->contains($regionCode)) {
                    DB::table('region_admin_assignment_history')
                        ->where('region_code', $regionCode)
                        ->where('user_id', $user->id)
                        ->whereNull('ended_at')
                        ->update([
                            'ended_at' => $now,
                            'ended_by_admin_user_id' => $actor->id,
                            'updated_at' => $now,
                        ]);
                    $assignment->delete();
                    $assignments->forget($regionCode);
                }
            }

            foreach ($regionCodes as $regionCode) {
                if ($assignments->has($regionCode)) {
                    continue;
                }

                $assignment = RegionAdmin::query()->create([
                    'user_id' => $user->id,
                    'region_code' => $regionCode,
                    'assigned_by_admin_user_id' => $actor->id,
                    'assigned_at' => $now,
                ]);
                $assignments->put($regionCode, $assignment);

                DB::table('region_admin_assignment_history')->insert([
                    'region_code' => $regionCode,
                    'user_id' => $user->id,
                    'assigned_by_user_id' => null,
                    'assigned_by_admin_user_id' => $actor->id,
                    'started_at' => $now,
                    'ended_at' => null,
                    'ended_by_admin_user_id' => null,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }

            $existingCampusIds = RegionAdminCampusAssignment::query()
                ->whereIn('region_admin_id', $assignments->pluck('id'))
                ->pluck('campus_id');

            foreach ($campuses->whereNotIn('id', $existingCampusIds) as $campus) {
                $assignment = $assignments->get($campus->city->region_code);
                RegionAdminCampusAssignment::query()->create([
                    'region_admin_id' => $assignment->id,
                    'campus_id' => $campus->id,
                    'assigned_by_admin_user_id' => $actor->id,
                    'assigned_at' => $now,
                ]);

                DB::table('region_admin_campus_assignment_history')->insert([
                    'user_id' => $user->id,
                    'region_code' => $assignment->region_code,
                    'campus_id' => $campus->id,
                    'assigned_by_user_id' => null,
                    'assigned_by_admin_user_id' => $actor->id,
                    'started_at' => $now,
                    'ended_at' => null,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }

            $updates = ['user_type' => 'Regional Admin'];
            if ($designation !== null) {
                $updates['division'] = $designation;
            }
            $user->update($updates);
        }, 3);
    }

    public function demote(User $user, string $targetRole, AdminUser $actor): void
    {
        DB::transaction(function () use ($user, $targetRole, $actor): void {
            $user = User::query()->lockForUpdate()->findOrFail($user->id);
            abort_unless($user->user_type === 'Regional Admin', 422, 'User is not a Regional Admin.');
            $now = now();

            $assignments = RegionAdmin::query()
                ->where('user_id', $user->id)
                ->with('campusAssignments')
                ->lockForUpdate()
                ->get();

            foreach ($assignments as $assignment) {
                foreach ($assignment->campusAssignments as $campusAssignment) {
                    $this->closeCampusHistory($user->id, $campusAssignment->campus_id, $actor->id, $now);
                    $campusAssignment->delete();
                }

                DB::table('region_admin_assignment_history')
                    ->where('region_code', $assignment->region_code)
                    ->where('user_id', $user->id)
                    ->whereNull('ended_at')
                    ->update([
                        'ended_at' => $now,
                        'ended_by_admin_user_id' => $actor->id,
                        'updated_at' => $now,
                    ]);
                $assignment->delete();
            }

            $user->update(['user_type' => $targetRole]);
        }, 3);
    }

    private function closeCampusHistory(int $userId, int $campusId, int $actorId, mixed $endedAt): void
    {
        DB::table('region_admin_campus_assignment_history')
            ->where('user_id', $userId)
            ->where('campus_id', $campusId)
            ->whereNull('ended_at')
            ->update([
                'ended_at' => $endedAt,
                'ended_by_admin_user_id' => $actorId,
                'updated_at' => $endedAt,
            ]);
    }
}
