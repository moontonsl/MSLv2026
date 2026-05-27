<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureActiveStudent
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if ($user && $user->user_type === 'Student') {
            if ($user->status === 'pending') {
                return redirect()->route('pending.verification');
            }

            if ($user->status === 'rejected') {
                return redirect()->route('rejected.verification');
            }
        }

        return $next($request);
    }
}
