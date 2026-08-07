<?php

namespace App\Policies;

use App\Models\Campus;
use App\Models\CampusTournament;
use App\Models\User;
use App\Support\CampusTournamentAuthorization;

class CampusTournamentPolicy
{
    public function __construct(private CampusTournamentAuthorization $authorization) {}

    public function createForCampus(User $user, Campus $campus): bool
    {
        return $this->authorization->isActiveStudentLeader($user, $campus);
    }

    public function resubmit(User $user, CampusTournament $tournament): bool
    {
        return $user->id === $tournament->created_by_user_id;
    }

    public function cancel(User $user, CampusTournament $tournament): bool
    {
        return $user->id === $tournament->created_by_user_id
            && $this->authorization->isActiveStudentLeader($user, $tournament->campus);
    }

    public function review(User $user, CampusTournament $tournament): bool
    {
        return $this->authorization->canReview($user, $tournament->campus);
    }
}
