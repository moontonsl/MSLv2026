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
            ['id' => 'manage_accounts', 'name' => 'Student Account Management', 'group' => 'Student operations'],
            ['id' => 'manage_sl', 'name' => 'Student Leader Management', 'group' => 'Student operations'],
            ['id' => 'manage_regional_admins', 'name' => 'Regional Admin Management', 'group' => 'Student operations'],
            ['id' => 'access_admin_management', 'name' => 'Access Permissions Tab', 'group' => 'Admin security'],
            ['id' => 'manage_admin_accounts', 'name' => 'Admin Accounts', 'group' => 'Admin security'],
            ['id' => 'manage_admin_permissions', 'name' => 'Legacy Permissions Route', 'group' => 'Admin security'],
            ['id' => 'manage_homepage', 'name' => 'Home Page', 'group' => 'Website content'],
            ['id' => 'manage_faq', 'name' => 'FAQ', 'group' => 'Website content'],
            ['id' => 'manage_news', 'name' => 'News Management', 'group' => 'Website content'],
            ['id' => 'manage_carousel', 'name' => 'Carousel Management', 'group' => 'Website content'],
            ['id' => 'manage_event_photos', 'name' => 'Event Photos / Buffs and Support', 'group' => 'Website content'],
            ['id' => 'manage_events', 'name' => 'Event Calendar', 'group' => 'Website content'],
            ['id' => 'manage_msl_events', 'name' => 'MSL Events', 'group' => 'Website content'],
            ['id' => 'manage_mcc_seasons', 'name' => 'MCC Seasons', 'group' => 'Website content'],
            ['id' => 'manage_footer', 'name' => 'Footer', 'group' => 'Website content'],
            ['id' => 'manage_share_links', 'name' => 'Share Links', 'group' => 'Website content'],
            ['id' => 'manage_settings', 'name' => 'Settings', 'group' => 'Website content'],
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
