<?php

namespace Tests\Feature\Admin;

use App\Models\AdminUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminQaHardeningTest extends TestCase
{
    use RefreshDatabase;

    private function makeAdmin(array $attributes = []): AdminUser
    {
        return AdminUser::create(array_merge([
            'name' => 'QA Admin',
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => 'Admin',
            'permissions' => [],
        ], $attributes));
    }

    public function test_limited_admin_cannot_open_legacy_account_management_form(): void
    {
        $admin = $this->makeAdmin();
        $this->actingAs($admin, 'admin');

        $this->get(route('admin.duplicate-usernames.form'))
            ->assertForbidden();

        $admin->update(['permissions' => ['manage_accounts']]);

        $this->get(route('admin.duplicate-usernames.form'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Legacy/Form')
                ->where('module', 'Change Username'));
    }

    public function test_shared_admin_props_expose_consistent_super_admin_state(): void
    {
        $superAdmin = $this->makeAdmin([
            'name' => 'Super Admin',
            'email' => 'admin@msl.com',
            'role' => 'Admin',
        ]);
        $this->actingAs($superAdmin, 'admin');

        $this->get(route('admin.dashboard'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('auth.guard', 'admin')
                ->where('auth.is_super_admin', true));
    }

    public function test_admin_login_routes_are_rate_limited(): void
    {
        $loginRoute = app('router')->getRoutes()->getByName('admin.login.submit');
        $utilityLoginRoute = app('router')->getRoutes()->getByName('admin.custom-user-list.login.submit');

        $this->assertContains('throttle:10,1', $loginRoute->gatherMiddleware());
        $this->assertContains('throttle:10,1', $utilityLoginRoute->gatherMiddleware());
    }
}
