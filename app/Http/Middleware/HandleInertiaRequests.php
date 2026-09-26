<?php

namespace App\Http\Middleware;

use App\Models\AdminNotification;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $admin = Auth::guard('admin')->user();
        $user = $admin ?? $request->user();
        $permissions = $admin?->permissions ?? [];
        if ($admin?->hasPermission('access_admin_dashboard') && !in_array('access_admin_dashboard', $permissions, true)) {
            $permissions[] = 'access_admin_dashboard';
        }

        $footerSections = json_decode((string) Setting::getValue('footer_nav_sections', '[]'), true);
        if (!is_array($footerSections)) {
            $footerSections = [];
        }

        $adminNotifications = [];
        $adminNotificationsUnreadCount = 0;
        if ($admin) {
            $adminNotificationsUnreadCount = AdminNotification::query()
                ->where('admin_user_id', $admin->id)
                ->whereNull('read_at')
                ->count();
            $adminNotifications = AdminNotification::query()
                ->where('admin_user_id', $admin->id)
                ->whereNull('read_at')
                ->latest()
                ->limit(5)
                ->get(['id', 'type', 'title', 'message', 'action_url', 'created_at'])
                ->map(fn (AdminNotification $notification): array => [
                    'id' => $notification->id,
                    'type' => $notification->type,
                    'title' => $notification->title,
                    'message' => $notification->message,
                    'action_url' => $notification->action_url,
                    'created_at' => $notification->created_at?->toIso8601String(),
                ])
                ->values()
                ->all();
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
                'guard' => $admin ? 'admin' : 'web',
                'is_super_admin' => (bool) $admin?->isSuperAdmin(),
                'permissions' => $permissions,
            ],
            'admin_notifications' => $adminNotifications,
            'admin_notifications_unread_count' => $adminNotificationsUnreadCount,
            'mlbb_bypass' => (bool) session('mlbb_bypass', false),
            'footer' => [
                'description' => Setting::getValue('footer_description', 'The official student leader body of Mobile Legends: Bang Bang in the Philippines.'),
                'copyright' => Setting::getValue('footer_copyright', '© 2025 Moonton Student Leaders Philippines. All rights reserved.'),
                'logo' => Setting::getValue('footer_logo', '/msl-logo.png'),
                'facebook_url' => Setting::getValue('footer_facebook_url', 'https://www.facebook.com/MSLPhilippines'),
                'youtube_url' => Setting::getValue('footer_youtube_url', 'https://www.youtube.com/@MSLPhilippines'),
                'tiktok_url' => Setting::getValue('footer_tiktok_url', 'https://www.tiktok.com/@mslphilippines'),
                'mlbb_logo' => Setting::getValue('footer_mlbb_logo', '/mlbb-logo.png'),
                'moonton_logo' => Setting::getValue('footer_moonton_logo', '/moonton-logo.png'),
                'nav_sections' => $footerSections,
            ],
        ];
    }
}
