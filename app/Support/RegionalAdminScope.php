<?php

namespace App\Support;

use App\Models\Campus;
use App\Models\RegionAdmin;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class RegionalAdminScope
{
    public function regionCodes(User $user): Collection
    {
        if ($user->status !== 'active') {
            return collect();
        }

        return RegionAdmin::query()
            ->where('user_id', $user->id)
            ->pluck('region_code');
    }

    public function applyToCampuses(Builder $query, User $user): Builder
    {
        if ($user->status !== 'active') {
            return $query->whereRaw('1 = 0');
        }

        $regionAdminIds = RegionAdmin::query()
            ->select('id')
            ->where('user_id', $user->id);
        $regionCodes = RegionAdmin::query()
            ->select('region_code')
            ->where('user_id', $user->id);

        return $query
            ->whereHas('city', fn (Builder $cityQuery) => $cityQuery->whereIn('region_code', $regionCodes))
            ->where(function (Builder $campusQuery) use ($regionAdminIds): void {
                $campusQuery
                    ->whereHas('regionalAdminAssignment', fn (Builder $assignmentQuery) => $assignmentQuery
                        ->whereIn('region_admin_id', $regionAdminIds))
                    ->orWhereDoesntHave('regionalAdminAssignment.regionAdmin.user', fn (Builder $userQuery) => $userQuery
                        ->where('status', 'active'));
            });
    }

    public function applyToTournaments(Builder $query, User $user): Builder
    {
        return $query->whereHas('campus', fn (Builder $campusQuery) => $this->applyToCampuses($campusQuery, $user));
    }

    public function canAccessCampus(User $user, Campus $campus): bool
    {
        return $this->applyToCampuses(Campus::query()->whereKey($campus->getKey()), $user)->exists();
    }
}
