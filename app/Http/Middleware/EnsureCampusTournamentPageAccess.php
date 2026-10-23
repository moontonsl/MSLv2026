<?php

namespace App\Http\Middleware;

use App\Support\CampusTournamentAuthorization;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureCampusTournamentPageAccess
{
    public function __construct(private CampusTournamentAuthorization $authorization) {}

    public function handle(Request $request, Closure $next, string $audience): Response
    {
        $user = $request->user();

        $allowed = $user && match ($audience) {
            'student-leader' => $this->authorization->hasActiveStudentLeaderAffiliation($user)
                && ! $this->authorization->canAccessReviewerPage($user),
            'regional-admin' => $this->authorization->canAccessReviewerPage($user),
            'player' => $this->authorization->canAccessPlayerPages($user),
            default => false,
        };

        abort_unless($allowed, 403);

        return $next($request);
    }
}
