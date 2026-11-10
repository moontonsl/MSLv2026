<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class StudentRegistrationAuditTest extends TestCase
{
    use RefreshDatabase;

    private function validRegistrationData(array $overrides = []): array
    {
        return array_merge([
            // Step 1: Personal Details
            'firstName' => 'Jose',
            'lastName' => 'Rizal',
            'suffix' => 'N/A',
            'gender' => 'male',
            'birthday' => '2004-06-19',
            'age' => 21,
            'contactNo' => '09171234567',
            'facebookLink' => 'https://facebook.com/jrizal',
            'referralCode' => '',

            // Step 2: Education Details
            'yearLevel' => 'Junior (3rd Year)',
            'university' => 'University of Santo Tomas',
            'island' => 'Luzon',
            'region' => 'NCR',
            'studentId' => 'UST-2026-0001',
            'course' => 'BS Information Technology',
            'proofOfEnrollment' => UploadedFile::fake()->create('proof.pdf', 500, 'application/pdf'),

            // Step 3: MLBB Details
            'userId' => '123456789',
            'serverId' => '3001',
            'ign' => 'Pepe_Hero',
            'rank' => 'Mythic',
            'inGameRole' => 'Mage',
            'squadName' => 'La Liga',
            'squadAbbreviation' => 'LIGA',
            'avatar' => '1',
            'level' => 30,
            'rankLevel' => 25,

            // Step 4: Account Credentials
            'username' => 'jrizal2026',
            'email' => 'jrizal@example.com',
            'password' => 'SecurePass123',
            'captcha' => '123456',
            'division' => 'college',
            'termsAccepted' => true,
        ], $overrides);
    }

    public function test_can_register_student_successfully_with_bypass(): void
    {
        // Mock session for bypass
        $data = $this->validRegistrationData();

        $response = $this->withSession([
            'mlbb_bypass' => true,
        ])->postJson(route('account.creation.register'), $data);

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Account created successfully.',
            ]);

        $this->assertDatabaseHas('users', [
            'username' => 'jrizal2026',
            'email' => 'jrizal@example.com',
            'user_type' => 'Student',
            'status' => 'pending',
            'division' => 'college',
            'ml_id' => '123456789',
            'university' => 'University of Santo Tomas',
        ]);
    }

    public function test_cannot_register_with_duplicate_username(): void
    {
        User::factory()->create([
            'username' => 'existinguser',
            'email' => 'unique1@example.com',
        ]);

        $data = $this->validRegistrationData(['username' => 'existinguser']);

        $response = $this->withSession(['mlbb_bypass' => true])
            ->postJson(route('account.creation.register'), $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['username']);
    }

    public function test_cannot_register_with_duplicate_email(): void
    {
        User::factory()->create([
            'email' => 'duplicate@example.com',
        ]);

        $data = $this->validRegistrationData(['email' => 'duplicate@example.com']);

        $response = $this->withSession(['mlbb_bypass' => true])
            ->postJson(route('account.creation.register'), $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_cannot_register_with_duplicate_mlbb_id(): void
    {
        User::factory()->create([
            'ml_id' => '999888777',
        ]);

        $data = $this->validRegistrationData(['userId' => '999888777']);

        $response = $this->withSession(['mlbb_bypass' => true])
            ->postJson(route('account.creation.register'), $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['userId']);
    }

    public function test_shs_student_can_register_successfully(): void
    {
        $data = $this->validRegistrationData([
            'division' => 'shs',
            'username' => 'shsstudent1',
            'email' => 'shsstudent1@example.com',
            'userId' => '555444333',
            'yearLevel' => 'Grade 12',
            'course' => 'STEM',
        ]);

        $response = $this->withSession(['mlbb_bypass' => true])
            ->postJson(route('account.creation.register'), $data);

        $response->assertOk()
            ->assertJson(['success' => true]);

        $this->assertDatabaseHas('users', [
            'username' => 'shsstudent1',
            'division' => 'shs',
            'year_level' => 'Grade 12',
            'course' => 'STEM',
        ]);
    }

    public function test_cannot_register_without_accepting_terms(): void
    {
        $data = $this->validRegistrationData([
            'termsAccepted' => false,
        ]);

        $response = $this->withSession(['mlbb_bypass' => true])
            ->postJson(route('account.creation.register'), $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['termsAccepted']);
    }

    public function test_cannot_register_with_proof_exceeding_5mb(): void
    {
        $data = $this->validRegistrationData([
            'proofOfEnrollment' => UploadedFile::fake()->create('huge_proof.pdf', 5200, 'application/pdf'), // 5.2 MB
        ]);

        $response = $this->withSession(['mlbb_bypass' => true])
            ->postJson(route('account.creation.register'), $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['proofOfEnrollment']);
    }

    public function test_cannot_register_with_expired_or_mismatched_session_email_code(): void
    {
        $data = $this->validRegistrationData([
            'email' => 'victim@example.com',
            'captcha' => '654321',
        ]);

        // Case 1: Code expired
        $response = $this->withSession([
            'email_verification_code' => '654321',
            'email_verification_email' => 'victim@example.com',
            'email_verification_expires_at' => now()->subMinute(),
        ])->postJson(route('account.creation.register'), $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['captcha']);

        // Case 2: Email does not match the session email
        $response2 = $this->withSession([
            'email_verification_code' => '654321',
            'email_verification_email' => 'other@example.com',
            'email_verification_expires_at' => now()->addMinutes(5),
        ])->postJson(route('account.creation.register'), $data);

        $response2->assertStatus(422)
            ->assertJsonValidationErrors(['captcha']);
    }

    public function test_authenticated_user_cannot_access_registration_pages(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->get('/AccountCreation/College')
            ->assertRedirect();

        $this->actingAs($user)->get('/AccountCreation/SHS')
            ->assertRedirect();
    }
}
