<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticatedByStatus
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if ($user) {
            if ($user->user_type === 'Student' && $user->status === 'pending-review') {
                return redirect()->route('renewal.review');
            }

            if ($user->user_type === 'Student' && $user->status === 'active') {
                return redirect()->route('student.portal');
            }

            if (in_array($user->user_type, ['Regional Admin', 'Core Admin', 'Super Admin', 'Student Leader', 'SL'], true)) {
                return redirect()->route('student.portal');
            }
        }

        return $next($request);
    }
}
