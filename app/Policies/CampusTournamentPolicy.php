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

    public function viewOperations(User $user, CampusTournament $tournament): bool
    {
        return $user->status === 'active'
            && ($this->authorization->canReview($user, $tournament->campus)
                || $this->authorization->isActiveStudentLeader($user, $tournament->campus));
    }

    public function viewReport(User $user, CampusTournament $tournament): bool
    {
        if ($user->status !== 'active') {
            return false;
        }

        return $this->authorization->canReview($user, $tournament->campus)
            || ($user->id === $tournament->created_by_user_id
                && $this->authorization->isActiveStudentLeader($user, $tournament->campus));
    }

    public function submitResults(User $user, CampusTournament $tournament): bool
    {
        return $user->id === $tournament->created_by_user_id
            && $this->authorization->isActiveStudentLeader($user, $tournament->campus);
    }

    public function correctResults(User $user, CampusTournament $tournament): bool
    {
        return $user->status === 'active'
            && ($user->user_type === 'Super Admin' || $this->submitResults($user, $tournament));
    }
}
