<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class BypassGateController extends Controller
{
    /**
     * Display the bypass gate page.
     */
    public function show(Request $request): Response
    {
        return Inertia::render('Auth/BypassGate', [
            'isAuthenticated' => (bool) session('bypass_gate_auth', false),
            'mlbbBypass' => (bool) session('mlbb_bypass', false),
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    /**
     * Authenticate session to access bypass controls.
     */
    public function login(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        if ($request->password === 'wallersam') {
            session(['bypass_gate_auth' => true]);
            return back()->with('success', 'Access granted.');
        }

        return back()->with('error', 'Invalid password.');
    }

    /**
     * Toggle the MLBB and email verification bypass.
     */
    public function toggle(Request $request): RedirectResponse
    {
        if (!session('bypass_gate_auth', false)) {
            abort(403, 'Unauthorized access to bypass settings.');
        }

        $request->validate([
            'enabled' => 'required|boolean',
        ]);

        session(['mlbb_bypass' => (bool) $request->enabled]);

        $status = $request->enabled ? 'enabled' : 'disabled';
        return back()->with('success', "MLBB verification bypass is now {$status}.");
    }

    /**
     * Lock the bypass gate and clear authentication.
     */
    public function logout(Request $request): RedirectResponse
    {
        session()->forget('bypass_gate_auth');
        return back()->with('success', 'Bypass gate locked.');
    }
}
