<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminUser;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminPermissionController extends Controller
{
    public static function availablePermissions(): array
    {
        return [
            ['id' => 'access_admin_dashboard', 'name' => 'Dashboard', 'group' => 'Student operations'],
            ['id' => 'approve_students', 'name' => 'Approve Students', 'group' => 'Student operations'],
            ['id' => 'reject_students', 'name' => 'Reject Students', 'group' => 'Student operations'],
            ['id' => 'renew_students', 'name' => 'Require Student Renewal', 'group' => 'Student operations'],
            ['id' => 'block_students', 'name' => 'Block Students', 'group' => 'Student operations'],
            ['id' => 'promote_students', 'name' => 'Promote Students', 'group' => 'Student operations'],
            ['id' => 'manage_accounts', 'name' => 'School Management & Account Approvals', 'group' => 'Student operations'],
            ['id' => 'manage_sl', 'name' => 'Student Leaders', 'group' => 'Student operations'],
            ['id' => 'manage_regional_admins', 'name' => 'Regional Admin Accounts', 'group' => 'Student operations'],
            ['id' => 'access_admin_management', 'name' => 'Account Roles & Permissions', 'group' => 'Admin security'],
            ['id' => 'manage_admin_accounts', 'name' => 'Administrator Accounts', 'group' => 'Admin security'],
            ['id' => 'manage_admin_permissions', 'name' => 'Legacy Permissions Endpoint', 'group' => 'Admin security'],
            ['id' => 'manage_homepage', 'name' => 'Home Page', 'group' => 'Website content'],
            ['id' => 'manage_faq', 'name' => 'FAQ', 'group' => 'Website content'],
            ['id' => 'manage_news', 'name' => 'News Articles & Legacy News', 'group' => 'Website content'],
            ['id' => 'manage_carousel', 'name' => 'Carousel', 'group' => 'Website content'],
            ['id' => 'manage_event_photos', 'name' => 'Event Photos', 'group' => 'Website content'],
            ['id' => 'manage_events', 'name' => 'Scheduled Events', 'group' => 'Website content'],
            ['id' => 'manage_msl_events', 'name' => 'Public MSL Events', 'group' => 'Website content'],
            ['id' => 'manage_mcc_seasons', 'name' => 'MCC Seasons', 'group' => 'Website content'],
            ['id' => 'manage_footer', 'name' => 'Footer Content', 'group' => 'Website content'],
            ['id' => 'manage_share_links', 'name' => 'Share Links', 'group' => 'Website content'],
            ['id' => 'manage_settings', 'name' => 'Website Settings', 'group' => 'Website content'],
            ['id' => 'manage_oppo_settings', 'name' => 'Oppo Settings', 'group' => 'Special modules'],
            ['id' => 'manage_violation_reports', 'name' => 'Violation Reports', 'group' => 'Special modules'],
            ['id' => 'manage_audit_logs', 'name' => 'Audit Logs', 'group' => 'Special modules'],
        ];
    }

    public function index(): Response
    {
        return Inertia::render('Admin/Permissions/Index', [
            'adminUsers' => AdminUser::query()
                ->select('id', 'name', 'email', 'role', 'permissions')
                ->orderBy('name')
                ->get(),
            'availableTabs' => self::availablePermissions(),
        ]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $validated = $request->validate([
            'permissions' => ['present', 'array'],
            'permissions.*' => ['string'],
        ]);

        $adminUser = AdminUser::findOrFail($id);

        if ($adminUser->isSuperAdmin()) {
            return back()->with('error', 'Cannot alter Super Admin permissions.');
        }

        $allowed = collect(self::availablePermissions())->pluck('id');
        $permissions = collect($validated['permissions'])
            ->filter(fn (string $permission) => $allowed->contains($permission))
            ->values()
            ->all();

        $adminUser->update(['permissions' => $permissions]);

        return back()->with('success', 'Permissions updated successfully.');
    }
}
