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
            // Group: Community & Student Operations
            ['id' => 'access_admin_dashboard', 'name' => 'Dashboard Access', 'description' => 'View command center overview and real-time live metrics', 'group' => 'Community & Student Operations'],
            ['id' => 'manage_accounts', 'name' => 'Pending Queue & Verification', 'description' => 'Access verification queue to review student ID and COR documents', 'group' => 'Community & Student Operations'],
            ['id' => 'approve_students', 'name' => 'Approve Students', 'description' => 'Verify and activate pending student profiles', 'group' => 'Community & Student Operations'],
            ['id' => 'reject_students', 'name' => 'Reject Students', 'description' => 'Reject invalid document submissions with custom deficiency checklists', 'group' => 'Community & Student Operations'],
            ['id' => 'renew_students', 'name' => 'Require Renewal', 'description' => 'Flag expired student records and request updated school credentials', 'group' => 'Community & Student Operations'],
            ['id' => 'block_students', 'name' => 'Block / Suspend Students', 'description' => 'Restrict misbehaving student profiles from platform participation', 'group' => 'Community & Student Operations'],
            ['id' => 'promote_students', 'name' => 'Promote Students', 'description' => 'Promote students to campus leadership or regional ranks', 'group' => 'Community & Student Operations'],
            ['id' => 'manage_sl', 'name' => 'Student Leader Management', 'description' => 'Appoint, assign campus chapters, and oversee student leaders', 'group' => 'Community & Student Operations'],
            ['id' => 'manage_regional_admins', 'name' => 'Regional Admin Governance', 'description' => 'Designate regional directors and oversee island cluster territories', 'group' => 'Community & Student Operations'],
            ['id' => 'manage_schools', 'name' => 'School Directory & Management', 'description' => 'Browse, filter, edit, and oversee affiliated colleges and basic education institutions', 'group' => 'Community & Student Operations'],

            // Group: Esports & Tournaments
            ['id' => 'manage_mcc_seasons', 'name' => 'MCC Seasons', 'description' => 'Manage Mobile Legends Campus Championship tournament seasons', 'group' => 'Esports & Tournaments'],
            ['id' => 'manage_msl_events', 'name' => 'MSL Tournaments', 'description' => 'Organize collegiate cups, brackets, stages, and match scheduling', 'group' => 'Esports & Tournaments'],
            ['id' => 'manage_events', 'name' => 'Event Calendar', 'description' => 'Schedule campus qualifiers, registration deadlines, and scrims', 'group' => 'Esports & Tournaments'],
            ['id' => 'manage_event_photos', 'name' => 'Event Gallery / Buffs & Support', 'description' => 'Upload tournament photography, live photos, and highlight albums', 'group' => 'Esports & Tournaments'],

            // Group: Content & Media Management
            ['id' => 'manage_news', 'name' => 'News & Announcements', 'description' => 'Publish articles, tournament recaps, and community updates', 'group' => 'Content & Media Management'],
            ['id' => 'manage_carousel', 'name' => 'Carousel Banners', 'description' => 'Manage homepage hero banners, promotions, and slide order', 'group' => 'Content & Media Management'],
            ['id' => 'manage_faq', 'name' => 'FAQ Manager', 'description' => 'Create and maintain student knowledge base and FAQs', 'group' => 'Content & Media Management'],
            ['id' => 'manage_footer', 'name' => 'Footer Links', 'description' => 'Update portal footer navigation and community links', 'group' => 'Content & Media Management'],
            ['id' => 'manage_homepage', 'name' => 'Landing Settings', 'description' => 'Configure homepage sections, statistics counters, and displays', 'group' => 'Content & Media Management'],
            ['id' => 'manage_share_links', 'name' => 'Share & Short Links', 'description' => 'Manage marketing short URLs, QR codes, and tracking redirects', 'group' => 'Content & Media Management'],

            // Group: System Security & Governance
            ['id' => 'access_admin_management', 'name' => 'Permissions & Roles Tab', 'description' => 'Access and configure staff role capability matrices', 'group' => 'System Security & Governance'],
            ['id' => 'manage_admin_accounts', 'name' => 'Admin Accounts', 'description' => 'Create, invite, and delete back-office admin login accounts', 'group' => 'System Security & Governance'],
            ['id' => 'manage_admin_permissions', 'name' => 'Grant / Revoke Permissions', 'description' => 'Authorize or restrict specific functional abilities for staff', 'group' => 'System Security & Governance'],
            ['id' => 'manage_audit_logs', 'name' => 'Security Audit Trail', 'description' => 'Inspect comprehensive back-office operational audit logs', 'group' => 'System Security & Governance'],
            ['id' => 'manage_violation_reports', 'name' => 'Violation Reports', 'description' => 'Review and process student code of conduct breach reports', 'group' => 'System Security & Governance'],
            ['id' => 'manage_oppo_settings', 'name' => 'Oppo Partnership Modules', 'description' => 'Manage brand partnership banners and promotional integration', 'group' => 'System Security & Governance'],
            ['id' => 'manage_settings', 'name' => 'Platform Settings', 'description' => 'Configure global system parameters, maintenance mode, and flags', 'group' => 'System Security & Governance'],
        ];
    }

    public static function rolePresets(): array
    {
        return [
            [
                'id' => 'registrar',
                'name' => 'Student Registrar & Verifier',
                'description' => 'Dedicated to student queue processing, document verification, and renewals.',
                'color' => 'emerald',
                'permissions' => [
                    'access_admin_dashboard',
                    'manage_accounts',
                    'approve_students',
                    'reject_students',
                    'renew_students',
                ],
            ],
            [
                'id' => 'esports',
                'name' => 'Esports & Tournament Marshall',
                'description' => 'Oversees MCC seasons, tournament brackets, matches, and event galleries.',
                'color' => 'amber',
                'permissions' => [
                    'access_admin_dashboard',
                    'manage_mcc_seasons',
                    'manage_msl_events',
                    'manage_events',
                    'manage_event_photos',
                ],
            ],
            [
                'id' => 'content',
                'name' => 'Content & Media Moderator',
                'description' => 'Publishes news articles, maintains hero banners, FAQ, and homepage content.',
                'color' => 'cyan',
                'permissions' => [
                    'access_admin_dashboard',
                    'manage_news',
                    'manage_carousel',
                    'manage_faq',
                    'manage_footer',
                    'manage_homepage',
                    'manage_share_links',
                ],
            ],
            [
                'id' => 'regional_lead',
                'name' => 'Community & Regional Lead',
                'description' => 'Manages campus student leader appointments and regional cluster operations.',
                'color' => 'purple',
                'permissions' => [
                    'access_admin_dashboard',
                    'manage_accounts',
                    'manage_sl',
                    'manage_regional_admins',
                    'manage_schools',
                    'promote_students',
                ],
            ],
            [
                'id' => 'auditor',
                'name' => 'Compliance & Auditor',
                'description' => 'Accesses security audit logs and investigates violation incident reports.',
                'color' => 'rose',
                'permissions' => [
                    'access_admin_dashboard',
                    'manage_audit_logs',
                    'manage_violation_reports',
                ],
            ],
            [
                'id' => 'full_ops',
                'name' => 'Full Operations Admin',
                'description' => 'Access to all operational modules, student services, and content tools.',
                'color' => 'yellow',
                'permissions' => [
                    'access_admin_dashboard',
                    'manage_accounts',
                    'approve_students',
                    'reject_students',
                    'renew_students',
                    'block_students',
                    'promote_students',
                    'manage_sl',
                    'manage_regional_admins',
                    'manage_schools',
                    'manage_mcc_seasons',
                    'manage_msl_events',
                    'manage_events',
                    'manage_event_photos',
                    'manage_news',
                    'manage_carousel',
                    'manage_faq',
                    'manage_footer',
                    'manage_homepage',
                    'manage_share_links',
                    'manage_oppo_settings',
                    'manage_violation_reports',
                    'manage_audit_logs',
                ],
            ],
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
