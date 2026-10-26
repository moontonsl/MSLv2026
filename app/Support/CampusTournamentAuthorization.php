<?php

namespace App\Support;

use App\Models\Campus;
use App\Models\RegionAdmin;
use App\Models\User;

class CampusTournamentAuthorization
{
    public function hasActiveStudentLeaderAffiliation(User $user): bool
    {
        return $user->status === 'active'
            && $user->campusAffiliations()
                ->where('role', 'student_leader')
                ->where('status', 'active')
                ->where(fn ($query) => $query->whereNull('started_at')->orWhere('started_at', '<=', now()))
                ->where(fn ($query) => $query->whereNull('ended_at')->orWhere('ended_at', '>', now()))
                ->exists();
    }

    public function canAccessReviewerPage(User $user): bool
    {
        return $user->status === 'active'
            && ($user->user_type === 'Super Admin'
                || RegionAdmin::query()->where('user_id', $user->id)->exists());
    }

    public function canAccessPlayerPages(User $user): bool
    {
        return $user->status === 'active'
            && ! in_array($user->user_type, ['Student Leader', 'Regional Admin', 'Super Admin'], true)
            && ! $this->canAccessReviewerPage($user)
            && ! $this->hasActiveStudentLeaderAffiliation($user);
    }

    public function isActiveStudentLeader(User $user, Campus $campus): bool
    {
        return $user->status === 'active'
            && $campus->status === 'active'
            && $user->campusAffiliations()
                ->where('campus_id', $campus->id)
                ->where('role', 'student_leader')
                ->where('status', 'active')
                ->where(function ($query): void {
                    $query->whereNull('started_at')->orWhere('started_at', '<=', now());
                })
                ->where(function ($query): void {
                    $query->whereNull('ended_at')->orWhere('ended_at', '>', now());
                })
                ->exists();
    }

    public function canReview(User $user, Campus $campus): bool
    {
        if ($user->status !== 'active') {
            return false;
        }

        if ($user->user_type === 'Super Admin') {
            return true;
        }

        $regionCode = $campus->city()->value('region_code');

        return $regionCode !== null
            && RegionAdmin::query()
                ->where('region_code', $regionCode)
                ->where('user_id', $user->id)
                ->exists();
    }
}
