<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Exception;

class MLBBService
{
    /**
     * Official Moonton Web API Base URL
     */
    protected $baseUrl = 'https://api.mobilelegends.com/base/';

    /**
     * Send Verification Code to the player's in-game mailbox.
     */
    public function sendVerificationCode($roleId, $zoneId)
    {
        $response = Http::asForm()->post("{$this->baseUrl}sendVc", [
            'roleId' => (string) $roleId,
            'zoneId' => (string) $zoneId,
        ]);

        if ($response->failed()) {
            throw new Exception('Failed to connect to Mobile Legends server. Please try again.');
        }

        $data = $response->json();
        $code = $data['code'] ?? null;

        if ($code === 0) {
            return true;
        }

        if ($code === -20006) {
            throw new Exception('Too frequent requests for verification code. Please wait a few moments before trying again.');
        }

        if ($code === -19999) {
            throw new Exception('Invalid Server ID (Zone ID). Please check your in-game profile.');
        }

        if ($code === -20007) {
            throw new Exception('Verification code sending failed. Please check your User ID and Server ID.');
        }

        throw new Exception(!empty($data['msg']) ? $data['msg'] : 'Error sending verification code.');
    }

    /**
     * Login with the verification code to obtain a JWT / auth token.
     */
    public function verifyAndLogin($roleId, $zoneId, $vc)
    {
        $response = Http::asForm()->post("{$this->baseUrl}login", [
            'roleId' => (string) $roleId,
            'zoneId' => (string) $zoneId,
            'vc' => (string) $vc,
            'type' => 'web',
        ]);

        if ($response->failed()) {
            throw new Exception('Login failed. Unable to connect to Mobile Legends server.');
        }

        $data = $response->json();
        $code = $data['code'] ?? null;

        if ($code !== 0) {
            if ($code === -20008) {
                throw new Exception('Wrong verification code. Please check your in-game mailbox.');
            }
            if ($code === -20009) {
                throw new Exception('Verification code has expired. Please request a new one.');
            }
            throw new Exception(!empty($data['msg']) ? $data['msg'] : 'Invalid verification code.');
        }

        $jwt = $data['data']['jwt'] ?? $data['data']['token'] ?? null;

        if (empty($jwt)) {
            throw new Exception('Authentication token not returned from Mobile Legends.');
        }

        return $jwt;
    }

    /**
     * Fetch player profile information using the JWT/token.
     */
    public function getProfile($jwt)
    {
        $response = Http::withToken($jwt)->post("{$this->baseUrl}getBaseInfo");

        if ($response->failed()) {
            throw new Exception('Failed to fetch player profile from Mobile Legends.');
        }

        $data = $response->json();

        if (isset($data['code']) && $data['code'] !== 0) {
            throw new Exception(!empty($data['msg']) ? $data['msg'] : 'Error retrieving profile data.');
        }

        return $data['data'] ?? null;
    }
}
