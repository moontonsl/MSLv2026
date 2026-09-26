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
        // Student status restrictions must never intercept the separate website
        // controller session or its admin routes.
        if (Auth::guard('admin')->check() || $request->is('admin/*') || $request->is('Oppo-settings')) {
            return $next($request);
        }

        $user = Auth::user();

        // Students who need to renew may only use the portal to complete renewal.
        // This also catches direct URL navigation to public, profile, admin, and
        // other authenticated routes because this middleware runs globally.
        if (
            $user?->user_type === 'Student'
            && $user->status === 'renewal-required'
            && !$request->is('studentportal')
            && !$request->is('studentportal/*')
            && !$request->is('logout')
        ) {
            return redirect()->route('student.portal');
        }

        // A submitted renewal locks the student account to the review page.
        // Keep only the review page and logout available until an admin approves it.
        if (
            $user?->user_type === 'Student'
            && $user->status === 'pending-review'
            && !$request->is('renewal-review')
            && !$request->is('logout')
        ) {
            return redirect()->route('renewal.review');
        }

        if ($user && $user->user_type === 'Student') {
            if ($user->status === 'blocked') {
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                return redirect()->route('login')->withErrors([
                    'username' => 'This account has been blocked. Please contact an administrator.',
                ]);
            }

            if ($user->status === 'pending') {
                return redirect()->route('pending.verification');
            }

            if (
                $user->status === 'pending-review'
                && !$request->is('renewal-review')
                && !$request->is('logout')
            ) {
                return redirect()->route('renewal.review');
            }

            if ($user->status === 'rejected') {
                return redirect()->route('rejected.verification');
            }
        }

        return $next($request);
    }
}
