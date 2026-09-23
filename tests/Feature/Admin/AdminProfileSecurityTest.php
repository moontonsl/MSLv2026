<?php

namespace Tests\Feature\Admin;

use App\Models\AdminAuditLog;
use App\Models\AdminUser;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminProfileSecurityTest extends TestCase
{
    use RefreshDatabase;

    private function signInAdmin(string $password = 'old-password'): AdminUser
    {
        $admin = AdminUser::create([
            'name' => 'Profile Admin',
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make($password),
            'role' => 'Admin',
            'permissions' => [],
        ]);

        $this->actingAs($admin, 'admin');

        return $admin;
    }

    public function test_authenticated_admin_can_view_own_profile(): void
    {
        $admin = $this->signInAdmin();

        $this->get(route('admin.profile'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Profile')
                ->where('admin.name', $admin->name)
                ->where('admin.email', $admin->email)
                ->where('admin.is_super_admin', false));
    }

    public function test_student_guard_cannot_access_admin_profile(): void
    {
        $student = User::factory()->create();
        $this->actingAs($student, 'web');

        $this->get(route('admin.profile'))
            ->assertRedirect(route('admin.login', absolute: false));
    }

    public function test_admin_can_update_only_own_profile_and_email_is_normalized(): void
    {
        $admin = $this->signInAdmin();

        $this->put(route('admin.profile.update'), [
            'name' => '  Updated Admin  ',
            'email' => '  UPDATED.ADMIN@EXAMPLE.COM ',
        ])->assertRedirect();

        $this->assertDatabaseHas('admin_users', [
            'id' => $admin->id,
            'name' => 'Updated Admin',
            'email' => 'updated.admin@example.com',
        ]);
        $this->assertAuthenticatedAs($admin->refresh(), 'admin');
        $this->assertDatabaseHas('admin_audit_logs', [
            'admin_user_id' => $admin->id,
            'route_name' => 'admin.profile.update',
        ]);
    }

    public function test_password_change_requires_the_current_password(): void
    {
        $admin = $this->signInAdmin();

        $this->put(route('admin.profile.password.update'), [
            'current_password' => 'wrong-password',
            'password' => 'new-secure-password',
            'password_confirmation' => 'new-secure-password',
        ])->assertSessionHasErrors('current_password');

        $this->assertTrue(Hash::check('old-password', $admin->refresh()->password));
        $this->assertDatabaseHas('admin_audit_logs', [
            'admin_user_id' => $admin->id,
            'route_name' => 'admin.profile.password.update',
            'status_code' => 302,
        ]);
    }

    public function test_password_change_updates_hash_and_keeps_admin_authenticated(): void
    {
        $admin = $this->signInAdmin();

        $this->put(route('admin.profile.password.update'), [
            'current_password' => 'old-password',
            'password' => 'new-secure-password',
            'password_confirmation' => 'new-secure-password',
        ])->assertRedirect();

        $this->assertTrue(Hash::check('new-secure-password', $admin->refresh()->password));
        $this->assertFalse(Hash::check('old-password', $admin->password));
        $this->assertAuthenticatedAs($admin, 'admin');
    }
}
