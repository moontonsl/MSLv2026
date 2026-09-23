<?php

namespace Tests\Feature\Admin;

use App\Models\AdminUser;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminPendingUsersTest extends TestCase
{
    use RefreshDatabase;

    private function signInSuperAdmin(): AdminUser
    {
        $admin = AdminUser::create([
            'name' => 'Pending Users Admin',
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => 'Super Admin',
        ]);

        $this->actingAs($admin, 'admin');

        return $admin;
    }

    public function test_admin_can_view_pending_users_and_search_results(): void
    {
        $this->signInSuperAdmin();
        User::factory()->create([
            'name' => 'Pending Student',
            'email' => 'pending@example.com',
            'status' => 'pending',
            'user_type' => 'Student',
            'email_verified_at' => null,
        ]);
        User::factory()->create([
            'name' => 'Verified Student',
            'email' => 'verified@example.com',
            'status' => 'active',
            'user_type' => 'Student',
            'email_verified_at' => now(),
        ]);

        $this->get(route('admin.users.pending'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/PendingUsers')
                ->has('users.data', 1)
                ->where('users.data.0.email', 'pending@example.com'));

        $this->get(route('admin.users.pending', ['search' => 'pending@example.com']))
            ->assertInertia(fn ($page) => $page
                ->has('users.data', 1)
                ->where('filters.search', 'pending@example.com'));
    }

    public function test_verify_activates_initial_pending_account_and_only_verifies_renewal_email(): void
    {
        $this->signInSuperAdmin();
        $pending = User::factory()->create([
            'status' => 'pending',
            'user_type' => 'Student',
            'email_verified_at' => null,
        ]);
        $renewal = User::factory()->create([
            'status' => 'pending-review',
            'user_type' => 'Student',
            'email_verified_at' => null,
        ]);

        $this->post(route('admin.users.verify', $pending))
            ->assertRedirect();
        $this->post(route('admin.users.verify', $renewal))
            ->assertRedirect();

        $this->assertDatabaseHas('users', [
            'id' => $pending->id,
            'status' => 'active',
        ]);
        $this->assertNotNull(User::find($pending->id)->email_verified_at);

        $this->assertDatabaseHas('users', [
            'id' => $renewal->id,
            'status' => 'pending-review',
        ]);
        $this->assertNotNull(User::find($renewal->id)->email_verified_at);
    }

    public function test_admin_without_account_management_permission_cannot_access_pending_users(): void
    {
        $admin = AdminUser::create([
            'name' => 'Limited Admin',
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => 'Admin',
        ]);
        $this->actingAs($admin, 'admin');

        $this->get(route('admin.users.pending'))->assertForbidden();
    }
}
