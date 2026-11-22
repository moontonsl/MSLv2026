<?php

namespace Tests\Feature;

use App\Models\Institution;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StudentVerificationCenterTest extends TestCase
{
    use RefreshDatabase;

    public function test_regular_student_cannot_access_verification_page(): void
    {
        $student = User::factory()->create([
            'user_type' => 'Student',
            'status' => 'active',
        ]);

        $this->actingAs($student)
            ->get(route('verification.index'))
            ->assertForbidden();
    }

    public function test_student_leader_only_views_and_verifies_students_from_their_own_school(): void
    {
        $leader = User::factory()->create([
            'user_type' => 'Student Leader',
            'status' => 'active',
            'university' => 'Ateneo de Davao University',
        ]);

        $sameSchoolStudent = User::factory()->create([
            'user_type' => 'Student',
            'status' => 'pending',
            'university' => 'Ateneo de Davao University',
        ]);

        $otherSchoolStudent = User::factory()->create([
            'user_type' => 'Student',
            'status' => 'pending',
            'university' => 'University of Santo Tomas',
        ]);

        // Viewing: only sees same-school pending student
        $this->actingAs($leader)
            ->get(route('verification.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Verification/Index')
                ->has('users.data', 1)
                ->where('users.data.0.id', $sameSchoolStudent->id)
                ->where('scope.role', 'Student Leader')
            );

        // Cannot approve student from another school
        $this->actingAs($leader)
            ->post(route('verification.approve', $otherSchoolStudent))
            ->assertForbidden();
        $this->assertSame('pending', $otherSchoolStudent->refresh()->status);

        // Can approve student from their own school
        $this->actingAs($leader)
            ->post(route('verification.approve', $sameSchoolStudent))
            ->assertRedirect();
        $this->assertSame('active', $sameSchoolStudent->refresh()->status);
    }

    public function test_regional_admin_only_views_and_verifies_students_from_assigned_schools(): void
    {
        $assignedSchool = Institution::create([
            'name' => 'University of San Carlos',
            'acronym' => 'USC',
            'region' => 'Region VII',
            'island' => 'Visayas',
            'status' => 'active',
        ]);

        $regionalAdmin = User::factory()->create([
            'user_type' => 'Regional Admin',
            'status' => 'active',
            'university' => 'Other School',
        ]);
        $regionalAdmin->assignedSchools()->attach($assignedSchool->id);

        $assignedStudent = User::factory()->create([
            'user_type' => 'Student',
            'status' => 'pending',
            'university' => 'University of San Carlos',
        ]);

        $unassignedStudent = User::factory()->create([
            'user_type' => 'Student',
            'status' => 'pending',
            'university' => 'De La Salle University',
        ]);

        // Viewing: only sees student from assigned school
        $this->actingAs($regionalAdmin)
            ->get(route('verification.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Verification/Index')
                ->has('users.data', 1)
                ->where('users.data.0.id', $assignedStudent->id)
            );

        // Cannot reject student from unassigned school
        $this->actingAs($regionalAdmin)
            ->post(route('verification.reject', $unassignedStudent), [
                'reason' => 'Blurry document',
            ])
            ->assertForbidden();
        $this->assertSame('pending', $unassignedStudent->refresh()->status);

        // Can reject student from assigned school
        $this->actingAs($regionalAdmin)
            ->post(route('verification.reject', $assignedStudent), [
                'reason' => 'Blurry proof of enrollment',
                'checklist' => ['Blurry or unreadable proof of enrollment'],
            ])
            ->assertRedirect();

        $assignedStudent->refresh();
        $this->assertSame('rejected', $assignedStudent->status);
        $this->assertSame('Blurry proof of enrollment', $assignedStudent->rejection_reason);
    }

    public function test_core_admin_can_view_and_verify_students_from_any_school(): void
    {
        $coreAdmin = User::factory()->create([
            'user_type' => 'Core Admin',
            'status' => 'active',
        ]);

        $studentA = User::factory()->create([
            'user_type' => 'Student',
            'status' => 'pending',
            'university' => 'School A',
        ]);

        $studentB = User::factory()->create([
            'user_type' => 'Student',
            'status' => 'pending-review',
            'university' => 'School B',
        ]);

        $this->actingAs($coreAdmin)
            ->get(route('verification.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Verification/Index')
                ->has('users.data', 2)
                ->where('scope.isAllSchools', true)
            );

        $this->actingAs($coreAdmin)
            ->post(route('verification.approve', $studentB))
            ->assertRedirect();

        $studentB->refresh();
        $this->assertSame('active', $studentB->status);
        $this->assertNotNull($studentB->renewal_approved_at);
    }

    public function test_both_regional_admins_in_same_region_can_view_and_verify_school_without_student_leader(): void
    {
        $uncoveredNcrSchool = Institution::create([
            'name' => 'NCR School Without SL',
            'acronym' => 'NSWS',
            'region' => 'NCR',
            'island' => 'Luzon',
            'status' => 'active',
        ]);

        $coveredNcrSchool = Institution::create([
            'name' => 'NCR School With SL',
            'acronym' => 'NSWSL',
            'region' => 'NCR',
            'island' => 'Luzon',
            'status' => 'active',
        ]);

        // Active Student Leader exists for coveredNcrSchool
        User::factory()->create([
            'user_type' => 'Student Leader',
            'status' => 'active',
            'university' => $coveredNcrSchool->name,
            'region' => 'NCR',
        ]);

        // Two Regional Admins in NCR (neither explicitly assigned to uncoveredNcrSchool)
        $ra1 = User::factory()->create([
            'user_type' => 'Regional Admin',
            'status' => 'active',
            'region' => 'NCR',
        ]);
        $ra1->assignedSchools()->attach($coveredNcrSchool->id);

        $ra2 = User::factory()->create([
            'user_type' => 'Regional Admin',
            'status' => 'active',
            'region' => 'NCR',
        ]);

        $uncoveredStudent = User::factory()->create([
            'user_type' => 'Student',
            'status' => 'pending',
            'university' => $uncoveredNcrSchool->name,
            'region' => 'NCR',
        ]);

        $coveredStudent = User::factory()->create([
            'user_type' => 'Student',
            'status' => 'pending',
            'university' => $coveredNcrSchool->name,
            'region' => 'NCR',
        ]);

        // RA 1 sees both their assigned school (coveredNcrSchool) AND the uncovered NCR school
        $this->actingAs($ra1)
            ->get(route('verification.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Verification/Index')
                ->has('users.data', 2)
            );

        // RA 2 sees ONLY the uncovered NCR school (NOT coveredNcrSchool since it has an SL & is assigned to RA 1)
        $this->actingAs($ra2)
            ->get(route('verification.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Verification/Index')
                ->has('users.data', 1)
                ->where('users.data.0.id', $uncoveredStudent->id)
            );

        // RA 2 cannot verify coveredStudent (has SL & not assigned to RA 2)
        $this->actingAs($ra2)
            ->post(route('verification.approve', $coveredStudent))
            ->assertForbidden();

        // RA 2 CAN verify uncoveredStudent (in NCR & has no SL)
        $this->actingAs($ra2)
            ->post(route('verification.approve', $uncoveredStudent))
            ->assertRedirect();
        $this->assertSame('active', $uncoveredStudent->refresh()->status);
    }
}
