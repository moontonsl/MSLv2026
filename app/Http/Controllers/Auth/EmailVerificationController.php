<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Mail\RegistrationVerificationMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Exception;

class EmailVerificationController extends Controller
{
    /**
     * Send a verification code to the given email address.
     */
    public function sendCode(Request $request)
    {
        $request->validate([
            'email' => 'required|string|lowercase|email|max:255',
        ]);

        $email = $request->email;

        // Strict unique constraint: check if the email is already registered
        if (User::where('email', $email)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'This email address is already registered.',
            ], 422);
        }

        // Throttling: 60-second limit per IP/email
        $key = 'send-email-vc:' . $request->ip() . ':' . $email;
        if (RateLimiter::tooManyAttempts($key, 1)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'success' => false,
                'message' => "Please wait {$seconds} seconds before requesting another code.",
            ], 429);
        }

        try {
            // Generate random 6-digit verification code
            $code = strval(rand(100000, 999999));

            // Store in session
            session([
                'email_verification_code' => $code,
                'email_verification_email' => $email,
                'email_verification_expires_at' => now()->addMinutes(10),
            ]);

            // Send verification email
            Mail::to($email)->send(new RegistrationVerificationMail($code));

            // Record hit with 60-second decay rate
            RateLimiter::hit($key, 60);

            return response()->json([
                'success' => true,
                'message' => 'Verification code sent to your email.',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send email. Please try again later.',
            ], 422);
        }
    }
}
