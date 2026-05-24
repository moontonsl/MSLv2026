<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Exception;

class MLBBService
{
    protected $baseUrl = 'https://openmlbb.fastapicloud.dev/api';

    /**
     * Send Verification Code to the player's in-game mailbox.
     */
    public function sendVerificationCode($roleId, $zoneId)
    {
        $response = Http::post("{$this->baseUrl}/user/auth/send-vc", [
            'role_id' => $roleId,
            'zone_id' => $zoneId,
        ]);

        if ($response->failed()) {
            throw new Exception('Failed to send verification code: ' . $response->body());
        }

        $data = $response->json();
        
        if (isset($data['code']) && $data['code'] !== 0) {
            throw new Exception($data['msg'] ?? 'Unknown error sending code');
        }

        return true;
    }

    /**
     * Login with the verification code to obtain a JWT.
     */
    public function verifyAndLogin($roleId, $zoneId, $vc)
    {
        $response = Http::post("{$this->baseUrl}/user/auth/login", [
            'role_id' => $roleId,
            'zone_id' => $zoneId,
            'vc' => $vc,
        ]);

        if ($response->failed()) {
            throw new Exception('Login failed. Invalid code or server error.');
        }

        $data = $response->json();

        if (isset($data['code']) && $data['code'] !== 0) {
            throw new Exception($data['msg'] ?? 'Invalid verification code');
        }

        if (empty($data['data']['jwt'])) {
            throw new Exception('JWT not returned from API');
        }

        return $data['data']['jwt'];
    }

    /**
     * Fetch player profile information using the JWT.
     */
    public function getProfile($jwt)
    {
        $response = Http::withToken($jwt)->get("{$this->baseUrl}/user/info");

        if ($response->failed()) {
            throw new Exception('Failed to fetch player profile.');
        }

        $data = $response->json();

        if (isset($data['code']) && $data['code'] !== 0) {
            throw new Exception($data['msg'] ?? 'Error retrieving profile data');
        }

        return $data['data'] ?? null;
    }
}
