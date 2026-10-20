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
            ['id' => 'access_admin_dashboard', 'name' => 'Dashboard', 'description' => 'View command center overview and real-time live metrics', 'group' => 'Student operations'],
            ['id' => 'manage_accounts', 'name' => 'School Management & Account Approvals', 'description' => 'Access verification queue to review student ID and COR documents', 'group' => 'Student operations'],
            ['id' => 'approve_students', 'name' => 'Approve Students', 'description' => 'Verify and activate pending student profiles', 'group' => 'Student operations'],
            ['id' => 'reject_students', 'name' => 'Reject Students', 'description' => 'Reject invalid document submissions with custom deficiency checklists', 'group' => 'Student operations'],
            ['id' => 'renew_students', 'name' => 'Require Student Renewal', 'description' => 'Flag expired student records and request updated school credentials', 'group' => 'Student operations'],
            ['id' => 'block_students', 'name' => 'Block Students', 'description' => 'Restrict misbehaving student profiles from platform participation', 'group' => 'Student operations'],
            ['id' => 'promote_students', 'name' => 'Promote Students', 'description' => 'Promote students to campus leadership or regional ranks', 'group' => 'Student operations'],
            ['id' => 'manage_sl', 'name' => 'Student Leaders', 'description' => 'Appoint, assign campus chapters, and oversee student leaders', 'group' => 'Student operations'],
            ['id' => 'manage_regional_admins', 'name' => 'Regional Admin Accounts', 'description' => 'Designate regional directors and oversee island cluster territories', 'group' => 'Student operations'],
            ['id' => 'manage_schools', 'name' => 'School Directory & Management', 'description' => 'Browse, filter, edit, and oversee affiliated colleges and basic education institutions', 'group' => 'Student operations'],

            ['id' => 'manage_mcc_seasons', 'name' => 'MCC Seasons', 'description' => 'Manage Mobile Legends Campus Championship tournament seasons', 'group' => 'Website content'],
            ['id' => 'manage_msl_events', 'name' => 'Public MSL Events', 'description' => 'Organize collegiate cups, brackets, stages, and match scheduling', 'group' => 'Website content'],
            ['id' => 'manage_events', 'name' => 'Scheduled Events', 'description' => 'Schedule campus qualifiers, registration deadlines, and scrims', 'group' => 'Website content'],
            ['id' => 'manage_event_photos', 'name' => 'Event Photos', 'description' => 'Upload tournament photography, live photos, and highlight albums', 'group' => 'Website content'],
            ['id' => 'manage_news', 'name' => 'News Articles & Legacy News', 'description' => 'Publish articles, tournament recaps, and community updates', 'group' => 'Website content'],
            ['id' => 'manage_carousel', 'name' => 'Carousel', 'description' => 'Manage homepage hero banners, promotions, and slide order', 'group' => 'Website content'],
            ['id' => 'manage_faq', 'name' => 'FAQ', 'description' => 'Create and maintain student knowledge base and FAQs', 'group' => 'Website content'],
            ['id' => 'manage_footer', 'name' => 'Footer Content', 'description' => 'Update portal footer navigation and community links', 'group' => 'Website content'],
            ['id' => 'manage_homepage', 'name' => 'Home Page', 'description' => 'Configure homepage sections, statistics counters, and displays', 'group' => 'Website content'],
            ['id' => 'manage_share_links', 'name' => 'Share Links', 'description' => 'Manage marketing short URLs, QR codes, and tracking redirects', 'group' => 'Website content'],
            ['id' => 'manage_settings', 'name' => 'Website Settings', 'description' => 'Configure global system parameters, maintenance mode, and flags', 'group' => 'Website content'],

            ['id' => 'access_admin_management', 'name' => 'Account Roles & Permissions', 'description' => 'Access and configure staff role capability matrices', 'group' => 'Admin security'],
            ['id' => 'manage_admin_accounts', 'name' => 'Administrator Accounts', 'description' => 'Create, invite, and delete back-office admin login accounts', 'group' => 'Admin security'],
            ['id' => 'manage_admin_permissions', 'name' => 'Legacy Permissions Endpoint', 'description' => 'Authorize or restrict specific functional abilities for staff', 'group' => 'Admin security'],

            ['id' => 'manage_oppo_settings', 'name' => 'Oppo Settings', 'description' => 'Manage brand partnership banners and promotional integration', 'group' => 'Special modules'],
            ['id' => 'manage_violation_reports', 'name' => 'Violation Reports', 'description' => 'Review and process student code of conduct breach reports', 'group' => 'Special modules'],
            ['id' => 'manage_audit_logs', 'name' => 'Audit Logs', 'description' => 'Inspect comprehensive back-office operational audit logs', 'group' => 'Special modules'],
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
