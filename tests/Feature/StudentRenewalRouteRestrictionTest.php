<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StudentRenewalRouteRestrictionTest extends TestCase
{
    use RefreshDatabase;

    public function test_renewal_required_student_is_redirected_from_other_routes_to_the_portal(): void
    {
        $student = User::factory()->create([
            'user_type' => 'Student',
            'status' => 'renewal-required',
        ]);

        $this->actingAs($student)
            ->get('/News')
            ->assertRedirect(route('student.portal'));
    }

    public function test_renewal_required_student_can_access_the_student_portal(): void
    {
        $student = User::factory()->create([
            'user_type' => 'Student',
            'status' => 'renewal-required',
            'username' => 'renewal-student',
        ]);

        $this->actingAs($student)
            ->get('/studentportal')
            ->assertOk();
    }

    public function test_renewal_required_student_can_log_out(): void
    {
        $student = User::factory()->create([
            'user_type' => 'Student',
            'status' => 'renewal-required',
        ]);

        $this->actingAs($student)
            ->post('/logout')
            ->assertRedirect('/');

        $this->assertGuest();
    }
}
