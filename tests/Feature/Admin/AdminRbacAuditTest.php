<?php

namespace Tests\Feature\Admin;

use App\Models\AdminRole;
use App\Models\AdminUser;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminRbacAuditTest extends TestCase
{
    use RefreshDatabase;

    public function test_non_super_admin_receives_only_assigned_role_permissions_in_inertia_props(): void
    {
        // 1. Create a Tournament Manager admin user (assigned role: Tournament Manager)
        $tournamentManager = AdminUser::create([
            'name' => 'Tournament Marshall',
            'email' => 'marshall@msl.com',
            'password' => Hash::make('password'),
            'role' => 'Tournament Manager',
            'permissions' => null, // No manual override, should inherit from role
        ]);

        $this->actingAs($tournamentManager, 'admin');

        $response = $this->get(route('admin.dashboard'));
        $response->assertOk();

        // Verify Inertia shares ONLY effective permissions for Tournament Manager
        $response->assertInertia(function ($page) {
            $perms = $page->toArray()['props']['auth']['permissions'] ?? [];
            $this->assertContains('access_admin_dashboard', $perms);
            $this->assertContains('manage_mcc_seasons', $perms);
            $this->assertContains('manage_msl_events', $perms);
            $this->assertContains('manage_events', $perms);
            $this->assertContains('manage_event_photos', $perms);

            // Must NOT have permissions for website management, campus accounts, or system governance
            $this->assertNotContains('manage_admin_accounts', $perms);
            $this->assertNotContains('access_admin_management', $perms);
            $this->assertNotContains('manage_audit_logs', $perms);
            $this->assertNotContains('manage_settings', $perms);
            $this->assertNotContains('manage_news', $perms);
            $this->assertNotContains('manage_sl', $perms);
            $this->assertNotContains('manage_regional_admins', $perms);
        });

        // 2. Tournament Manager CAN access esports & events routes
        $this->get(route('admin.mcc-seasons.index'))->assertOk();
        $this->get(route('admin.msl-events.index'))->assertOk();
        $this->get(route('admin.events'))->assertOk();
        $this->get(route('admin.event-photos'))->assertOk();

        // 3. Tournament Manager is BLOCKED (403 Forbidden) from unauthorized routes
        $this->get(route('admin.accounts.index'))->assertForbidden();
        $this->get(route('admin.management'))->assertForbidden();
        $this->get(route('admin.audit-logs.index'))->assertForbidden();
        $this->get(route('admin.settings'))->assertForbidden();
        $this->get(route('admin.sl-management'))->assertForbidden();
        $this->get(route('admin.regional-admin-management'))->assertForbidden();
        $this->get(route('admin.home-page.hero-carousel'))->assertForbidden();
        $this->get(route('admin.news-updates'))->assertForbidden();
    }

    public function test_content_manager_sees_only_content_and_is_blocked_from_esports_and_system(): void
    {
        $contentAdmin = AdminUser::create([
            'name' => 'CMS Lead',
            'email' => 'cms@msl.com',
            'password' => Hash::make('password'),
            'role' => 'Content Manager',
            'permissions' => null,
        ]);

        $this->actingAs($contentAdmin, 'admin');

        $response = $this->get(route('admin.dashboard'));
        $response->assertOk();

        // Verify Inertia props
        $response->assertInertia(function ($page) {
            $perms = $page->toArray()['props']['auth']['permissions'] ?? [];
            $this->assertContains('access_admin_dashboard', $perms);
            $this->assertContains('manage_news', $perms);
            $this->assertContains('manage_carousel', $perms);
            $this->assertContains('manage_faq', $perms);
            $this->assertContains('manage_footer', $perms);
            $this->assertContains('manage_homepage', $perms);
            $this->assertContains('manage_share_links', $perms);

            $this->assertNotContains('manage_mcc_seasons', $perms);
            $this->assertNotContains('manage_msl_events', $perms);
            $this->assertNotContains('manage_admin_accounts', $perms);
            $this->assertNotContains('manage_audit_logs', $perms);
        });

        // Authorized
        $this->get(route('admin.news-updates'))->assertOk();
        $this->get(route('admin.home-page.hero-carousel'))->assertOk();
        $this->get(route('admin.faq'))->assertOk();
        $this->get(route('admin.footer'))->assertOk();

        // Unauthorized (403)
        $this->get(route('admin.mcc-seasons.index'))->assertForbidden();
        $this->get(route('admin.msl-events.index'))->assertForbidden();
        $this->get(route('admin.accounts.index'))->assertForbidden();
        $this->get(route('admin.audit-logs.index'))->assertForbidden();
    }

    public function test_core_admin_has_full_super_admin_capabilities(): void
    {
        $coreAdmin = AdminUser::create([
            'name' => 'Core Admin Officer',
            'email' => 'core@msl.com',
            'password' => Hash::make('password'),
            'role' => 'Core Admin',
            'permissions' => null,
        ]);

        $this->actingAs($coreAdmin, 'admin');

        $this->assertTrue($coreAdmin->isSuperAdmin());

        // Can access all sections
        $this->get(route('admin.dashboard'))->assertOk();
        $this->get(route('admin.accounts.index'))->assertOk();
        $this->get(route('admin.management'))->assertOk();
        $this->get(route('admin.audit-logs.index'))->assertOk();
        $this->get(route('admin.mcc-seasons.index'))->assertOk();
        $this->get(route('admin.home-page.hero-carousel'))->assertOk();
    }

    public function test_guest_and_regular_student_cannot_access_core_admin_or_admin_portal(): void
    {
        // 1. Guest cannot access /CoreAdmin or /Admin/Dashboard
        $this->get('/CoreAdmin')->assertRedirect(route('login'));
        $this->get('/Admin/Dashboard')->assertRedirect(route('admin.login'));

        // 2. Regular student cannot access /CoreAdmin
        $student = User::factory()->create([
            'user_type' => 'Student',
            'status' => 'active',
        ]);

        $this->actingAs($student, 'web');
        $this->get('/CoreAdmin')->assertForbidden();
        $this->get('/Admin/Dashboard')->assertRedirect(route('admin.login'));
    }

    public function test_creating_a_new_custom_role_and_assigning_to_admin_works_seamlessly(): void
    {
        // 1. Super Admin creates a new custom role called "Campus Coordinator" with specific permissions
        $superAdmin = AdminUser::create([
            'name' => 'Super Root',
            'email' => 'super@msl.com',
            'password' => Hash::make('password'),
            'role' => 'Super Admin',
        ]);
        $this->actingAs($superAdmin, 'admin');

        $this->post(route('admin.roles.store'), [
            'name' => 'Campus Coordinator',
            'description' => 'Handles school directory and regional affairs only.',
            'permissions' => ['manage_schools', 'manage_regional_admins'],
        ])->assertRedirect();

        $this->assertDatabaseHas('admin_roles', [
            'name' => 'Campus Coordinator',
            'slug' => 'campus_coordinator',
        ]);

        // 2. Create a new staff account assigned to this brand-new custom role
        $this->post(route('admin.accounts.store'), [
            'name' => 'Campus Staff',
            'email' => 'coordinator@msl.com',
            'password' => 'P@ssword123',
            'password_confirmation' => 'P@ssword123',
            'role' => 'Campus Coordinator',
        ])->assertRedirect();

        $staffUser = AdminUser::where('email', 'coordinator@msl.com')->firstOrFail();
        $this->assertEquals('Campus Coordinator', $staffUser->role);

        // 3. Log in as this new staff user
        $this->actingAs($staffUser, 'admin');

        // Can access dashboard and their assigned modules
        $response = $this->get(route('admin.dashboard'));
        $response->assertOk();

        // Check Inertia permissions share
        $response->assertInertia(function ($page) {
            $perms = $page->toArray()['props']['auth']['permissions'] ?? [];
            $this->assertContains('access_admin_dashboard', $perms);
            $this->assertContains('manage_schools', $perms);
            $this->assertContains('manage_regional_admins', $perms);

            // Must NOT have unassigned permissions
            $this->assertNotContains('manage_news', $perms);
            $this->assertNotContains('manage_mcc_seasons', $perms);
            $this->assertNotContains('manage_admin_accounts', $perms);
            $this->assertNotContains('manage_settings', $perms);
        });

        // Authorized routes return 200 OK
        $this->get(route('admin.school-management'))->assertOk();
        $this->get(route('admin.regional-admin-management'))->assertOk();

        // Unauthorized routes return 403 Forbidden
        $this->get(route('admin.news-updates'))->assertForbidden();
        $this->get(route('admin.mcc-seasons.index'))->assertForbidden();
        $this->get(route('admin.accounts.index'))->assertForbidden();
        $this->get(route('admin.settings'))->assertForbidden();
    }
}
