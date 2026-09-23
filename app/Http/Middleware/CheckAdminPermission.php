<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckAdminPermission
{
    public function handle(Request $request, Closure $next, ?string $permission = null): Response
    {
        $admin = Auth::guard('admin')->user();

        if (!$admin) {
            return redirect()->route('admin.login')->with('error', 'Please login to access this page.');
        }

        if ($permission && !$admin->hasPermission($permission)) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'You do not have permission to access this resource.'], 403);
            }

            abort(403, 'You do not have permission to access that section.');
        }

        return $next($request);
    }
}
