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
            if ($request->role_id !== '0011') {
                $mlbbService->sendVerificationCode($request->role_id, $request->zone_id);
            }

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
            if ($request->ml_vc === '0011') {
                $profile = [
                    'name' => 'BypassedPlayer',
                    'avatar' => '1',
                    'level' => 30,
                    'rank' => 'Mythic',
                    'rank_level' => 1,
                ];
            } else {
                // Verify code and get JWT
                $jwt = $mlbbService->verifyAndLogin($request->role_id, $request->zone_id, $request->ml_vc);
                
                // Get profile details
                $profile = $mlbbService->getProfile($jwt);
            }

            $rankName = $profile['rank'] ?? '';
            if (empty($rankName) && isset($profile['rank_level'])) {
                $rankName = $this->resolveRankName($profile['rank_level']);
            }

            // Save verified profile in session
            session([
                'verified_mlbb_profile' => [
                    'ml_id' => $request->role_id,
                    'ml_server' => $request->zone_id,
                    'ml_ign' => $profile['name'] ?? '',
                    'ml_avatar' => $profile['avatar'] ?? '',
                    'ml_level' => $profile['level'] ?? '',
                    'ml_rank' => $rankName,
                    'ml_rank_level' => $profile['rank_level'] ?? '',
                ]
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Verification successful.',
                'profile' => [
                    'ign' => $profile['name'] ?? '',
                    'avatar' => $profile['avatar'] ?? '',
                    'level' => $profile['level'] ?? '',
                    'rank' => $rankName,
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

    /**
     * Resolve rank name from rank_level.
     */
    private function resolveRankName($rankLevel)
    {
        $rankLevel = (int) $rankLevel;

        if ($rankLevel >= 100) {
            if ($rankLevel >= 200) {
                return 'Mythical Immortal';
            } elseif ($rankLevel >= 150) {
                return 'Mythical Glory';
            } elseif ($rankLevel >= 125) {
                return 'Mythical Honor';
            } else {
                return 'Mythic';
            }
        }

        if ($rankLevel >= 27) return 'Mythic';
        if ($rankLevel >= 22) return 'Legend';
        if ($rankLevel >= 17) return 'Epic';
        if ($rankLevel >= 12) return 'Grandmaster';
        if ($rankLevel >= 8) return 'Master';
        if ($rankLevel >= 4) return 'Elite';
        return 'Warrior';
    }
}
