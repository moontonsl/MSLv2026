<?php

namespace Tests\Feature\Auth;

use App\Models\AdminUser;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class StudentVerificationLifecycleTest extends TestCase
{
    use RefreshDatabase;

    private function signInAdmin(string $role = 'Super Admin', array $permissions = []): AdminUser
    {
        $admin = AdminUser::create([
            'name' => 'Super Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => $role,
            'permissions' => $permissions,
        ]);

        $this->actingAs($admin, 'admin');

        return $admin;
    }

    private function createPendingStudent(): User
    {
        return User::factory()->create([
            'user_type' => 'Student',
            'status' => 'pending',
            'first_name' => 'Juan',
            'surname' => 'Luna',
            'username' => 'juanluna2026',
            'email' => 'juanluna@example.com',
            'password' => Hash::make('password'),
            'university' => 'University of the Philippines',
            'course' => 'Fine Arts',
            'year_level' => 'Senior',
            'island' => 'Luzon',
            'region' => 'NCR',
            'studentId' => 'UP-2026-999',
            'ml_id' => '987654321',
            'ml_server' => '3001',
            'ml_ign' => 'JuanArt',
            'ml_rank' => 'Mythic',
            'inGameRole' => 'Marksman',
            'proofOfEnrollment' => '/uploads/proofs/test_proof.jpg',
        ]);
    }

    public function test_pending_student_is_redirected_to_pending_verification_on_login(): void
    {
        $student = $this->createPendingStudent();

        $response = $this->post('/Login', [
            'username' => 'juanluna2026',
            'password' => 'password',
        ]);

        $response->assertRedirect(route('pending.verification'));
        $this->assertAuthenticatedAs($student);
    }

    public function test_pending_student_cannot_access_student_portal_or_other_pages(): void
    {
        $student = $this->createPendingStudent();

        // Trying to access student portal
        $this->actingAs($student)->get('/StudentPortal')
            ->assertRedirect(route('pending.verification'));

        // Trying to access home page while logged in as pending student
        $this->actingAs($student)->get('/')
            ->assertRedirect(route('pending.verification'));
    }

    public function test_pending_student_can_view_pending_verification_page(): void
    {
        $student = $this->createPendingStudent();

        $response = $this->actingAs($student)->get('/PendingVerification');

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Auth/PendingVerification')
                ->has('userData')
            );
    }

    public function test_super_admin_can_approve_pending_student(): void
    {
        $this->signInAdmin();
        $student = $this->createPendingStudent();

        $response = $this->post("/admin/users/{$student->id}/approve");

        $response->assertRedirect();
        $this->assertDatabaseHas('users', [
            'id' => $student->id,
            'status' => 'active',
        ]);
    }

    public function test_approved_active_student_is_redirected_to_portal_from_pending_verification(): void
    {
        $student = $this->createPendingStudent();
        $student->update(['status' => 'active']);

        // Visiting /pending-verification redirects to student portal
        $this->actingAs($student)->get('/PendingVerification')
            ->assertRedirect(route('student.portal'));

        // Can access student portal directly
        $response = $this->actingAs($student)->get('/StudentPortal');
        $response->assertOk();
    }

    public function test_admin_can_reject_student(): void
    {
        $this->signInAdmin();
        $student = $this->createPendingStudent();

        // Admin rejects student
        $response = $this->post("/admin/users/{$student->id}/reject", [
            'reason' => 'Invalid school ID provided. Expired sticker.',
            'checklist' => ['invalid_document' => true],
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', [
            'id' => $student->id,
            'status' => 'rejected',
            'rejection_reason' => 'Invalid school ID provided. Expired sticker.',
        ]);
    }

    public function test_rejected_student_is_redirected_to_rejected_verification(): void
    {
        $student = $this->createPendingStudent();
        $student->update([
            'status' => 'rejected',
            'rejection_reason' => 'Invalid school ID provided. Expired sticker.',
        ]);

        // Student tries to browse or visit pending verification
        $this->actingAs($student)->get('/PendingVerification')
            ->assertRedirect(route('rejected.verification'));

        // Student can view rejected-verification page
        $response = $this->actingAs($student)->get('/RejectedVerification');
        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Auth/RejectedVerification')
                ->where('rejectionReason', 'Invalid school ID provided. Expired sticker.')
            );
    }

    public function test_rejected_student_can_reapply(): void
    {
        $student = $this->createPendingStudent();
        $student->update([
            'status' => 'rejected',
            'rejection_reason' => 'Invalid school ID.',
            'rejection_checklist' => ['invalid_document' => true],
        ]);

        $newProof = UploadedFile::fake()->create('new_id.jpg', 300, 'image/jpeg');

        $reapplyData = [
            'firstName' => 'Juan',
            'lastName' => 'Luna',
            'suffix' => 'N/A',
            'gender' => 'Male',
            'birthday' => '10/23/2002',
            'age' => 22,
            'contactNo' => '09181234567',
            'facebookLink' => 'https://facebook.com/juanluna',
            'yearLevel' => '4th Year',
            'university' => 'University of the Philippines',
            'island' => 'Luzon',
            'region' => 'NCR',
            'studentId' => 'UP-2026-999',
            'course' => 'Fine Arts',
            'proofOfEnrollment' => $newProof,
        ];

        $response = $this->actingAs($student)->post('/reapply', $reapplyData);

        // Reapply redirects to student.portal which middleware redirects to renewal-review
        $response->assertRedirect(route('student.portal'));

        $this->assertDatabaseHas('users', [
            'id' => $student->id,
            'status' => 'pending-review',
            'rejection_reason' => null,
        ]);

        // Now student has pending-review, accessing portal redirects to renewal.review
        $this->actingAs($student->fresh())->get('/StudentPortal')
            ->assertRedirect(route('renewal.review'));
    }
}
