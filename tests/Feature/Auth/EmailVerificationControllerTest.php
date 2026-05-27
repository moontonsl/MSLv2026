<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Mail\RegistrationVerificationMail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Session;
use Tests\TestCase;

class EmailVerificationControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_request_verification_code(): void
    {
        Mail::fake();

        $response = $this->post('/email/send-code', [
            'email' => 'newuser@example.com',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'message' => 'Verification code sent to your email.',
        ]);

        $code = session('email_verification_code');
        $this->assertNotEmpty($code);
        $this->assertEquals('newuser@example.com', session('email_verification_email'));

        Mail::assertSent(RegistrationVerificationMail::class, function ($mail) use ($code) {
            return $mail->verificationCode === $code;
        });
    }

    public function test_cannot_request_verification_code_for_registered_email(): void
    {
        User::factory()->create([
            'email' => 'existing@example.com',
        ]);

        $response = $this->post('/email/send-code', [
            'email' => 'existing@example.com',
        ]);

        $response->assertStatus(422);
        $response->assertJson([
            'success' => false,
            'message' => 'This email address is already registered.',
        ]);
    }

    public function test_can_verify_correct_verification_code(): void
    {
        session([
            'email_verification_code' => '123456',
            'email_verification_email' => 'test@example.com',
            'email_verification_expires_at' => now()->addMinutes(10),
        ]);

        $response = $this->post('/email/verify-code', [
            'email' => 'test@example.com',
            'code' => '123456',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'message' => 'Email address verified successfully.',
        ]);

        $this->assertTrue(session('email_verification_verified'));
        $this->assertEquals('test@example.com', session('email_verification_verified_email'));
    }

    public function test_cannot_verify_incorrect_verification_code(): void
    {
        session([
            'email_verification_code' => '123456',
            'email_verification_email' => 'test@example.com',
            'email_verification_expires_at' => now()->addMinutes(10),
        ]);

        $response = $this->post('/email/verify-code', [
            'email' => 'test@example.com',
            'code' => '654321', // wrong code
        ]);

        $response->assertStatus(422);
        $response->assertJson([
            'success' => false,
            'message' => 'The verification code is incorrect or has expired.',
        ]);

        $this->assertNull(session('email_verification_verified'));
    }

    public function test_cannot_verify_expired_verification_code(): void
    {
        session([
            'email_verification_code' => '123456',
            'email_verification_email' => 'test@example.com',
            'email_verification_expires_at' => now()->subMinutes(1), // expired
        ]);

        $response = $this->post('/email/verify-code', [
            'email' => 'test@example.com',
            'code' => '123456',
        ]);

        $response->assertStatus(422);
        $response->assertJson([
            'success' => false,
            'message' => 'The verification code is incorrect or has expired.',
        ]);
    }
}
