<?php

namespace Tests\Feature\Admin;

use App\Models\AdminUser;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminStudentLeadersTest extends TestCase
{
    use RefreshDatabase;

    private function signInSuperAdmin(): AdminUser
    {
        $admin = AdminUser::create([
            'name' => 'Student Leader Admin',
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => 'Super Admin',
        ]);

        $this->actingAs($admin, 'admin');

        return $admin;
    }

    public function test_admin_can_view_student_leaders_and_eligible_students(): void
    {
        $this->signInSuperAdmin();
        User::factory()->create([
            'name' => 'Current Student Leader',
            'user_type' => 'Student Leader',
            'status' => 'active',
            'university' => 'MSL University',
        ]);
        User::factory()->create([
            'name' => 'Eligible Student',
            'user_type' => 'Student',
            'status' => 'active',
            'university' => 'MSL University',
        ]);
        User::factory()->create([
            'name' => 'Pending Student',
            'user_type' => 'Student',
            'status' => 'pending',
        ]);

        $this->get(route('admin.sl-management'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/StudentLeaders')
                ->has('slUsers.data', 1)
                ->has('students.data', 1)
                ->where('slUsers.data.0.name', 'Current Student Leader')
                ->where('students.data.0.name', 'Eligible Student'));

        $this->get(route('admin.sl-management', ['search' => 'Eligible Student']))
            ->assertInertia(fn ($page) => $page
                ->has('slUsers.data', 0)
                ->has('students.data', 1)
                ->where('filters.search', 'Eligible Student'));
    }

    public function test_super_admin_can_promote_and_demote_student_leaders(): void
    {
        $this->signInSuperAdmin();
        $student = User::factory()->create([
            'user_type' => 'Student',
            'status' => 'active',
        ]);

        $this->post(route('admin.users.promote-sl', $student))
            ->assertRedirect();
        $this->assertDatabaseHas('users', [
            'id' => $student->id,
            'user_type' => 'Student Leader',
        ]);

        $this->post(route('admin.users.demote-sl', $student))
            ->assertRedirect();
        $this->assertDatabaseHas('users', [
            'id' => $student->id,
            'user_type' => 'Student',
        ]);
    }

    public function test_inactive_students_cannot_be_promoted(): void
    {
        $this->signInSuperAdmin();
        $student = User::factory()->create([
            'user_type' => 'Student',
            'status' => 'pending',
        ]);

        $this->post(route('admin.users.promote-sl', $student))
            ->assertStatus(422);
    }

    public function test_admin_without_student_leader_permission_cannot_manage_student_leaders(): void
    {
        $admin = AdminUser::create([
            'name' => 'Limited Admin',
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => 'Admin',
        ]);
        $this->actingAs($admin, 'admin');

        $this->get(route('admin.sl-management'))->assertForbidden();
    }
}
