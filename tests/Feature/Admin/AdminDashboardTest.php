<?php

namespace Tests\Feature\Admin;

use App\Models\AdminUser;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminDashboardTest extends TestCase
{
    use RefreshDatabase;

    private function signInAdmin(string $role = 'Super Admin', array $permissions = []): AdminUser
    {
        $admin = AdminUser::create([
            'name' => 'Dashboard Admin',
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => $role,
            'permissions' => $permissions,
        ]);

        $this->actingAs($admin, 'admin');

        return $admin;
    }

    public function test_admin_can_view_the_dashboard_and_student_list(): void
    {
        $this->signInAdmin();
        User::factory()->create([
            'user_type' => 'Student',
            'status' => 'pending',
            'username' => 'pending-student',
        ]);

        $this->get(route('admin.dashboard'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Dashboard')
                ->has('students', 1)
                ->where('students.0.username', 'pending-student'));
    }

    public function test_super_admin_can_approve_and_reject_students(): void
    {
        $this->signInAdmin();
        $student = User::factory()->create([
            'user_type' => 'Student',
            'status' => 'pending',
        ]);

        $this->post(route('admin.users.approve', $student))
            ->assertRedirect();

        $this->assertDatabaseHas('users', [
            'id' => $student->id,
            'status' => 'active',
        ]);

        $this->post(route('admin.users.reject', $student), [
            'reason' => 'The submitted document needs correction.',
            'checklist' => ['invalid_document' => true],
        ])->assertRedirect();

        $this->assertDatabaseHas('users', [
            'id' => $student->id,
            'status' => 'rejected',
            'rejection_reason' => 'The submitted document needs correction.',
        ]);
    }

    public function test_regular_admin_can_view_dashboard_but_needs_permission_for_student_actions(): void
    {
        $this->signInAdmin('Admin');
        $student = User::factory()->create([
            'user_type' => 'Student',
            'status' => 'pending',
        ]);

        $this->get(route('admin.dashboard'))->assertOk();

        $this->post(route('admin.users.approve', $student))
            ->assertForbidden();

        $this->assertDatabaseHas('users', [
            'id' => $student->id,
            'status' => 'pending',
        ]);
    }
}
