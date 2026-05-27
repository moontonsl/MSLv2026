<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $user = \Illuminate\Support\Facades\Auth::user();

        if (!$user || !$user->hasPermission($permission)) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthorized action or page access.'], 403);
            }
            abort(403, 'Unauthorized action or page access.');
        }

        return $next($request);
    }
}
