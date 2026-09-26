<?php

namespace App\Support;

use App\Models\AdminNotification;
use App\Models\AdminUser;
use Illuminate\Http\Request;

class AdminNotificationService
{
    private const ACTIONS = [
        'admin.faq.store' => ['type' => 'content', 'title' => 'FAQ created', 'message' => '%s created a new FAQ entry.', 'url' => 'admin.faq'],
        'admin.users.approve' => ['type' => 'student', 'title' => 'Student approved', 'message' => '%s approved student account #%s.', 'url' => 'admin.dashboard'],
        'admin.users.reject' => ['type' => 'student', 'title' => 'Student rejected', 'message' => '%s rejected student account #%s.', 'url' => 'admin.dashboard'],
        'admin.users.renewal' => ['type' => 'student', 'title' => 'Renewal requested', 'message' => '%s marked student account #%s for renewal.', 'url' => 'admin.dashboard'],
        'admin.users.block' => ['type' => 'student', 'title' => 'Student blocked', 'message' => '%s blocked student account #%s.', 'url' => 'admin.dashboard'],
        'admin.users.promote' => ['type' => 'student', 'title' => 'Account promoted', 'message' => '%s promoted student account #%s.', 'url' => 'admin.dashboard'],
        'admin.users.verify' => ['type' => 'student', 'title' => 'Student verified', 'message' => '%s verified pending student account #%s.', 'url' => 'admin.users.pending'],
        'admin.users.promote-sl' => ['type' => 'student', 'title' => 'Student Leader updated', 'message' => '%s updated Student Leader status for account #%s.', 'url' => 'admin.sl-management'],
        'admin.users.demote-sl' => ['type' => 'student', 'title' => 'Student Leader updated', 'message' => '%s updated Student Leader status for account #%s.', 'url' => 'admin.sl-management'],
        'admin.users.promote-regional-admin' => ['type' => 'student', 'title' => 'Regional Admin updated', 'message' => '%s updated Regional Admin status for account #%s.', 'url' => 'admin.regional-admin-management'],
        'admin.users.demote-regional-admin' => ['type' => 'student', 'title' => 'Regional Admin updated', 'message' => '%s updated Regional Admin status for account #%s.', 'url' => 'admin.regional-admin-management'],
        'admin.violation-reports.update' => ['type' => 'moderation', 'title' => 'Violation report updated', 'message' => '%s updated violation report #%s.', 'url' => 'admin.violation-reports.index'],
        'admin.accounts.store' => ['type' => 'security', 'title' => 'Admin account created', 'message' => '%s created a new admin account.', 'url' => 'admin.accounts.index'],
        'admin.accounts.destroy' => ['type' => 'security', 'title' => 'Admin account deleted', 'message' => '%s deleted admin account #%s.', 'url' => 'admin.accounts.index'],
        'admin.users.permissions.update' => ['type' => 'security', 'title' => 'Admin permissions updated', 'message' => '%s updated permissions for admin account #%s.', 'url' => 'admin.management'],
    ];

    public static function notifyForAdminAction(Request $request, int $actorId, int $statusCode): void
    {
        if ($statusCode < 200 || $statusCode >= 400) {
            return;
        }

        $routeName = $request->route()?->getName();
        $action = self::ACTIONS[$routeName] ?? null;
        $actor = AdminUser::find($actorId);

        if (!$action || !$actor) {
            return;
        }

        $targetId = self::targetId($request);
        $message = sprintf($action['message'], $actor->name, $targetId ?? 'unknown');
        $url = route($action['url']);

        AdminUser::query()
            ->where('id', '!=', $actorId)
            ->get(['id'])
            ->each(fn (AdminUser $recipient) => AdminNotification::create([
                'admin_user_id' => $recipient->id,
                'actor_admin_id' => $actorId,
                'type' => $action['type'],
                'title' => $action['title'],
                'message' => $message,
                'action_url' => $url,
                'metadata' => ['route_name' => $routeName, 'target_id' => $targetId],
            ]));
    }

    private static function targetId(Request $request): ?string
    {
        foreach ($request->route()?->parameters() ?? [] as $value) {
            if (is_object($value) && method_exists($value, 'getKey')) {
                return (string) $value->getKey();
            }

            if (is_scalar($value)) {
                return (string) $value;
            }
        }

        return null;
    }
}
