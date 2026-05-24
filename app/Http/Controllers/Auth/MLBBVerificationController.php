<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\MLBBService;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Exception;

class MLBBVerificationController extends Controller
{
    /**
     * Trigger a verification code to the given MLBB role_id and zone_id.
     */
    public function sendCode(Request $request, MLBBService $mlbbService)
    {
        $request->validate([
            'role_id' => 'required|string',
            'zone_id' => 'required|string',
        ]);

        // Enforce strict unique constraint: one MLBB account per user
        if (User::where('ml_id', $request->role_id)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'This Mobile Legends account is already registered.',
            ], 422);
        }

        // Throttling: 60-second limit per IP/MLBB ID
        $key = 'send-vc:' . $request->ip() . ':' . $request->role_id;
        if (RateLimiter::tooManyAttempts($key, 1)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'success' => false,
                'message' => "Please wait {$seconds} seconds before requesting another code.",
            ], 429);
        }

        try {
            $mlbbService->sendVerificationCode($request->role_id, $request->zone_id);

            // Record hit with 60-second decay rate
            RateLimiter::hit($key, 60);

            return response()->json([
                'success' => true,
                'message' => 'Verification code sent to your in-game mailbox.',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Verify the code, log in to Open MLBB API, retrieve user profile, and return.
     */
    public function verifyCode(Request $request, MLBBService $mlbbService)
    {
        $request->validate([
            'role_id' => 'required|string',
            'zone_id' => 'required|string',
            'ml_vc' => 'required|string',
        ]);

        // Re-verify strict unique constraint
        if (User::where('ml_id', $request->role_id)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'This Mobile Legends account is already registered.',
            ], 422);
        }

        try {
            // Verify code and get JWT
            $jwt = $mlbbService->verifyAndLogin($request->role_id, $request->zone_id, $request->ml_vc);
            
            // Get profile details
            $profile = $mlbbService->getProfile($jwt);

            if (!$profile) {
                throw new Exception('Could not fetch profile details from MLBB.');
            }

            return response()->json([
                'success' => true,
                'message' => 'Verification successful.',
                'profile' => [
                    'ign' => $profile['name'] ?? '',
                    'avatar' => $profile['avatar'] ?? '',
                    'level' => $profile['level'] ?? '',
                    'rank' => $profile['rank'] ?? '',
                    'rank_level' => $profile['rank_level'] ?? '',
                ],
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}
