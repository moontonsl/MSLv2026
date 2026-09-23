<?php

namespace Tests\Feature\Admin;

use App\Models\AdminAuditLog;
use App\Models\AdminUser;
use App\Models\Faq;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminAuditLogsTest extends TestCase
{
    use RefreshDatabase;

    private function makeAdmin(string $role = 'Admin', array $permissions = []): AdminUser
    {
        $admin = AdminUser::create([
            'name' => $role . ' Audit User',
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => $role,
            'permissions' => $permissions,
        ]);

        $this->actingAs($admin, 'admin');

        return $admin;
    }

    public function test_admin_mutations_are_recorded_without_form_payloads(): void
    {
        $admin = $this->makeAdmin('Super Admin');

        $this->post(route('admin.faq.store'), [
            'category' => 'General',
            'question' => 'What is MSL?',
            'answer' => 'A student leader community.',
            'password' => 'must-not-be-recorded',
        ])->assertRedirect();

        $log = AdminAuditLog::query()->latest('id')->firstOrFail();

        $this->assertSame($admin->id, $log->admin_user_id);
        $this->assertSame('admin.faq.store', $log->route_name);
        $this->assertSame('Store', $log->action);
        $this->assertSame('Faq', $log->module);
        $this->assertSame('POST', $log->method);
        $this->assertSame(302, $log->status_code);
        $this->assertStringNotContainsString('must-not-be-recorded', json_encode($log->metadata));
        $this->assertStringNotContainsString('password', json_encode($log->metadata));
    }

    public function test_rejected_admin_mutations_are_recorded_with_failure_status(): void
    {
        $admin = $this->makeAdmin('Admin', []);

        $this->post(route('admin.faq.store'), [
            'category' => 'General',
            'question' => 'Blocked action',
            'answer' => 'This should not be created.',
        ])->assertForbidden();

        $this->assertDatabaseHas('admin_audit_logs', [
            'admin_user_id' => $admin->id,
            'route_name' => 'admin.faq.store',
            'status_code' => 403,
        ]);
        $this->assertDatabaseCount('faqs', 0);
    }

    public function test_super_admin_can_search_and_filter_audit_logs(): void
    {
        $admin = $this->makeAdmin('Super Admin');
        $otherAdmin = AdminUser::create([
            'name' => 'Content Operator',
            'email' => 'operator@example.com',
            'password' => Hash::make('password'),
            'role' => 'Admin',
            'permissions' => ['manage_news'],
        ]);

        AdminAuditLog::create([
            'admin_user_id' => $admin->id,
            'route_name' => 'admin.faq.store',
            'module' => 'Faq',
            'action' => 'Store',
            'method' => 'POST',
            'status_code' => 302,
            'metadata' => ['route_parameters' => []],
        ]);
        AdminAuditLog::create([
            'admin_user_id' => $otherAdmin->id,
            'route_name' => 'admin.news-modern.update',
            'module' => 'News Modern',
            'action' => 'Update',
            'method' => 'PUT',
            'status_code' => 302,
            'metadata' => ['route_parameters' => []],
        ]);

        $this->get(route('admin.audit-logs.index', ['search' => 'Content Operator']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/AuditLogs')
                ->where('logs.total', 1)
                ->where('logs.data.0.admin.name', 'Content Operator')
                ->where('filters.search', 'Content Operator'));
    }

    public function test_admin_without_audit_permission_cannot_view_audit_logs(): void
    {
        $this->makeAdmin('Admin', []);

        $this->get(route('admin.audit-logs.index'))->assertForbidden();
    }
}
