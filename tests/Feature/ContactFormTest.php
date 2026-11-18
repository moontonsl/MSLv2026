<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ContactFormTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'first_name' => 'Juan',
            'last_name' => 'Dela Cruz',
            'email' => 'juan@example.com',
            'phone' => '09171234567',
            'organization' => 'Sample University',
            'topic' => 'General Inquiry',
            'subject' => 'Hello MSL',
            'message' => 'Hello MSL team! I would like to know more about starting an official MSL campus community at our school this semester.',
        ], $overrides);
    }

    public function test_contact_page_renders_with_topics(): void
    {
        $this->get('/ContactUs')->assertOk()->assertInertia(fn ($page) => $page
            ->component('Contact/Index')
            ->has('topics')
            ->where('contactEmail', 'contact@moontonslph.org'));
    }

    public function test_valid_inquiry_is_emailed(): void
    {
        Mail::fake();

        $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class)
            ->postJson('/ContactUs', $this->validPayload())
            ->assertOk()
            ->assertJson(['message' => 'Your message has been sent.']);
    }

    public function test_invalid_inquiry_returns_field_errors(): void
    {
        Mail::fake();

        $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class)
            ->postJson('/ContactUs', $this->validPayload([
                'email' => 'not-an-email',
                'phone' => '12345',
                'topic' => 'Not a topic',
                'message' => 'too short',
            ]))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'phone', 'topic', 'message']);
    }

    public function test_message_under_100_characters_is_rejected(): void
    {
        Mail::fake();

        $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class)
            ->postJson('/ContactUs', $this->validPayload(['message' => str_repeat('a', 99)]))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['message']);
    }

    public function test_message_of_exactly_100_characters_is_accepted(): void
    {
        Mail::fake();

        $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class)
            ->postJson('/ContactUs', $this->validPayload(['message' => str_repeat('a', 100)]))
            ->assertOk();
    }

    public function test_mail_failure_returns_service_unavailable(): void
    {
        Mail::shouldReceive('raw')->once()->andThrow(new \RuntimeException('SMTP down'));

        $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class)
            ->postJson('/ContactUs', $this->validPayload())
            ->assertStatus(503)
            ->assertJsonStructure(['message']);
    }
}
