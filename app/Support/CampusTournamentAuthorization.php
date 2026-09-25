<?php

namespace App\Support;

use App\Models\Campus;
use App\Models\RegionAdmin;
use App\Models\User;

class CampusTournamentAuthorization
{
    public function isActiveStudentLeader(User $user, Campus $campus): bool
    {
        return $user->status === 'active'
            && $campus->status === 'active'
            && $user->campusAffiliations()
                ->where('campus_id', $campus->id)
                ->where('role', 'student_leader')
                ->where('status', 'active')
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
