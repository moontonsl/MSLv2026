import { Link, router, usePage } from '@inertiajs/react';
import { Bell, User } from 'lucide-react';
import { useState } from 'react';

const ACCENT = '#FBBF24';

export default function AdminUserProfile({
    name,
    role,
}) {
    const { auth } = usePage().props;
    const admin = auth?.user;
    const notifications = usePage().props.admin_notifications ?? [];
    const unreadCount = usePage().props.admin_notifications_unread_count ?? 0;
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const displayName = name ?? admin?.name ?? 'Admin';
    const displayRole = role ?? admin?.role ?? 'Admin';

    return (
        <div className="flex items-center gap-3">
            <Link href={route('admin.profile')} className="rounded-md px-2 py-1 hover:bg-white/5">
                <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: ACCENT }}>
                        {displayName}
                    </p>
                    <p className="text-xs text-gray-400">{displayRole}</p>
                </div>
            </Link>
            <div className="relative">
                <button type="button" aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`} aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen((open) => !open)} className="relative rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 ? <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-red-500 px-1 text-center text-[10px] font-bold leading-4 text-white">{unreadCount > 99 ? '99+' : unreadCount}</span> : null}
                </button>
                {notificationsOpen ? <div className="absolute right-0 top-12 z-[70] w-[min(22rem,calc(100vw-2rem))] rounded-xl border border-neutral-700 bg-[#151515] p-3 shadow-2xl"><div className="mb-2 flex items-center justify-between gap-3 px-2"><p className="text-sm font-bold text-white">Notifications</p><Link href={route('admin.notifications.index')} onClick={() => setNotificationsOpen(false)} className="text-xs text-yellow-400 hover:underline">View all</Link></div>{notifications.length === 0 ? <p className="px-2 py-6 text-center text-sm text-gray-500">You’re all caught up.</p> : <div className="space-y-1">{notifications.map((notification) => <button key={notification.id} type="button" onClick={() => { router.post(route('admin.notifications.read', notification.id), {}, { preserveScroll: true, onSuccess: () => { setNotificationsOpen(false); if (notification.action_url) router.visit(notification.action_url); } }); }} className="w-full rounded-lg px-2 py-2 text-left hover:bg-white/5"><p className="text-sm font-medium text-white">{notification.title}</p><p className="mt-1 line-clamp-2 text-xs text-gray-400">{notification.message}</p></button>)}</div>}</div> : null}
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-blue-500 bg-neutral-800">
                <User className="h-5 w-5 text-gray-300" />
            </div>
            {auth?.guard === 'admin' && (
                <button
                    type="button"
                    className="text-xs text-gray-400 hover:text-white"
                    onClick={() => router.post(route('admin.logout'))}
                >
                    Logout
                </button>
            )}
        </div>
    );
}
