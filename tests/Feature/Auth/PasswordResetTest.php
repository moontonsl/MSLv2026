<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_reset_password_link_screen_can_be_rendered(): void
    {
        $response = $this->get('/forgot-password');

        $response->assertStatus(200)
            ->assertInertia(fn ($page) => $page->component('Auth/ForgotPassword'));

        // Check alias redirect
        $this->get('/ForgotPassword')->assertRedirect('/forgot-password');
    }

    public function test_reset_password_link_can_be_requested(): void
    {
        Notification::fake();

        $user = User::factory()->create();

        $this->post('/forgot-password', ['email' => $user->email]);

        Notification::assertSentTo($user, ResetPassword::class);
    }

    public function test_reset_password_screen_can_be_rendered(): void
    {
        Notification::fake();

        $user = User::factory()->create();

        $this->post('/forgot-password', ['email' => $user->email]);

        Notification::assertSentTo($user, ResetPassword::class, function ($notification) {
            $response = $this->get('/reset-password/'.$notification->token);

            $response->assertStatus(200);

            return true;
        });
    }

    public function test_password_can_be_reset_with_valid_token(): void
    {
        Notification::fake();

        $user = User::factory()->create();

        $this->post('/forgot-password', ['email' => $user->email]);

        Notification::assertSentTo($user, ResetPassword::class, function ($notification) use ($user) {
            $response = $this->post('/reset-password', [
                'token' => $notification->token,
                'email' => $user->email,
                'password' => 'password',
                'password_confirmation' => 'password',
            ]);

            $response
                ->assertSessionHasNoErrors()
                ->assertRedirect(route('login'));

            return true;
        });
    }

    public function test_cannot_request_reset_with_invalid_or_unknown_email(): void
    {
        $response = $this->post('/forgot-password', ['email' => 'nonexistent@example.com']);

        $response->assertSessionHasErrors(['email']);
    }

    public function test_cannot_reset_password_with_mismatched_confirmation(): void
    {
        $user = User::factory()->create();

        $response = $this->post('/reset-password', [
            'token' => 'dummy-token',
            'email' => $user->email,
            'password' => 'newpassword123',
            'password_confirmation' => 'mismatched123',
        ]);

        $response->assertSessionHasErrors(['password']);
    }
}
