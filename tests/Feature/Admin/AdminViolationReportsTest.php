<?php

namespace Tests\Feature\Admin;

use App\Models\AdminUser;
use App\Models\ViolationReport;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminViolationReportsTest extends TestCase
{
    use RefreshDatabase;

    private function signInSuperAdmin(): AdminUser
    {
        $admin = AdminUser::create([
            'name' => 'Reports Admin',
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => 'Super Admin',
        ]);

        $this->actingAs($admin, 'admin');

        return $admin;
    }

    public function test_admin_can_view_searchable_filtered_reports(): void
    {
        $this->signInSuperAdmin();
        $report = ViolationReport::create([
            'name' => null,
            'school' => null,
            'incident_type' => 'Bullying / Cyberbullying',
            'description' => 'A report submitted anonymously.',
            'evidence' => 'https://example.com/evidence',
            'is_anonymous' => true,
            'status' => 'Pending',
        ]);
        ViolationReport::create([
            'name' => 'Other reporter',
            'school' => 'Other school',
            'incident_type' => 'Other',
            'description' => 'Other report',
            'status' => 'Resolved',
        ]);

        $this->get(route('admin.violation-reports.index', ['search' => 'Bullying', 'status' => 'Pending']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/ViolationReports')
                ->where('filters.search', 'Bullying')
                ->where('filters.status', 'Pending')
                ->where('reports.total', 1)
                ->where('reports.data.0.id', $report->id)
                ->where('reports.data.0.is_anonymous', true)
                ->where('reports.data.0.evidence_url', 'https://example.com/evidence'));
    }

    public function test_admin_can_update_report_to_all_moderation_statuses(): void
    {
        $this->signInSuperAdmin();
        $report = ViolationReport::create([
            'incident_type' => 'Other',
            'description' => 'Needs review',
            'status' => 'Pending',
        ]);

        foreach (['Reviewed', 'Resolved', 'Dismissed'] as $status) {
            $this->put(route('admin.violation-reports.update', $report), ['status' => $status])->assertRedirect();
            $this->assertDatabaseHas('violation_reports', ['id' => $report->id, 'status' => $status]);
        }
    }

    public function test_report_status_must_be_valid(): void
    {
        $this->signInSuperAdmin();
        $report = ViolationReport::create(['incident_type' => 'Other', 'description' => 'Needs review', 'status' => 'Pending']);

        $this->from(route('admin.violation-reports.index'))->put(route('admin.violation-reports.update', $report), ['status' => 'Invalid'])->assertSessionHasErrors('status');
        $this->assertDatabaseHas('violation_reports', ['id' => $report->id, 'status' => 'Pending']);
    }

    public function test_admin_without_violation_permission_cannot_manage_reports(): void
    {
        $admin = AdminUser::create([
            'name' => 'Limited Admin',
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => 'Admin',
        ]);
        $this->actingAs($admin, 'admin');

        $this->get(route('admin.violation-reports.index'))->assertForbidden();
    }
}
