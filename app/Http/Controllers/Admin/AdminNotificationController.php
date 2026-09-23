<?php

namespace App\Http\Controllers\Admin;

use App\Models\AdminNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AdminNotificationController
{
    public function index(Request $request): Response
    {
        $adminId = Auth::guard('admin')->id();
        $filter = $request->input('filter') === 'unread' ? 'unread' : 'all';
        $query = AdminNotification::query()->where('admin_user_id', $adminId)->latest();

        if ($filter === 'unread') {
            $query->whereNull('read_at');
        }

        $notifications = $query->paginate(20)->withQueryString();
        $notifications->setCollection($notifications->getCollection()->map(fn (AdminNotification $notification): array => $this->serialize($notification)));

        return Inertia::render('Admin/Notifications', [
            'notifications' => $notifications,
            'unreadCount' => AdminNotification::query()->where('admin_user_id', $adminId)->whereNull('read_at')->count(),
            'filter' => $filter,
        ]);
    }

    public function markRead(int $id): RedirectResponse
    {
        AdminNotification::query()
            ->where('admin_user_id', Auth::guard('admin')->id())
            ->whereKey($id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return back();
    }

    public function markAllRead(): RedirectResponse
    {
        AdminNotification::query()
            ->where('admin_user_id', Auth::guard('admin')->id())
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return back()->with('success', 'All notifications marked as read.');
    }

    private function serialize(AdminNotification $notification): array
    {
        return [
            'id' => $notification->id,
            'type' => $notification->type,
            'title' => $notification->title,
            'message' => $notification->message,
            'action_url' => $notification->action_url,
            'read_at' => $notification->read_at?->toIso8601String(),
            'created_at' => $notification->created_at?->toIso8601String(),
        ];
    }
}
