import { Link, router, usePage } from '@inertiajs/react';
import { 
    Bell, User, CheckCheck, CheckCircle2, Shield, Users, 
    AlertTriangle, Megaphone, Clock, ExternalLink, X 
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const ACCENT = '#FBBF24';

function timeAgo(dateString) {
    if (!dateString) return '';
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.max(0, Math.floor((now - date) / 1000));

    if (diffInSeconds < 60) return 'Just now';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getNotificationIcon(type) {
    switch (type) {
        case 'student':
            return <Users className="h-4 w-4 text-emerald-400" />;
        case 'moderation':
            return <AlertTriangle className="h-4 w-4 text-rose-400" />;
        case 'security':
            return <Shield className="h-4 w-4 text-blue-400" />;
        case 'content':
            return <Megaphone className="h-4 w-4 text-purple-400" />;
        default:
            return <Bell className="h-4 w-4 text-amber-400" />;
    }
}

function getIconBg(type) {
    switch (type) {
        case 'student':
            return 'bg-emerald-500/10 border-emerald-500/20';
        case 'moderation':
            return 'bg-rose-500/10 border-rose-500/20';
        case 'security':
            return 'bg-blue-500/10 border-blue-500/20';
        case 'content':
            return 'bg-purple-500/10 border-purple-500/20';
        default:
            return 'bg-amber-500/10 border-amber-500/20';
    }
}

export default function AdminUserProfile({
    name,
    role,
}) {
    const { auth } = usePage().props;
    const admin = auth?.user;
    const notifications = usePage().props.admin_notifications ?? [];
    const unreadCount = usePage().props.admin_notifications_unread_count ?? 0;
    
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread'
    const [markingAll, setMarkingAll] = useState(false);
    
    const dropdownRef = useRef(null);

    const displayName = name ?? admin?.name ?? 'Admin';
    const displayRole = role ?? admin?.role ?? 'Admin';

    // Outside click & Escape key detection
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setNotificationsOpen(false);
            }
        }

        function handleKeyDown(event) {
            if (event.key === 'Escape') {
                setNotificationsOpen(false);
            }
        }

        if (notificationsOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [notificationsOpen]);

    const handleMarkRead = (notification) => {
        router.post(
            route('admin.notifications.read', notification.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setNotificationsOpen(false);
                    if (notification.action_url) {
                        router.visit(notification.action_url);
                    }
                },
            }
        );
    };

    const handleMarkAllRead = () => {
        if (markingAll || unreadCount === 0) return;
        setMarkingAll(true);
        router.post(
            route('admin.notifications.read-all'),
            {},
            {
                preserveScroll: true,
                onFinish: () => setMarkingAll(false),
            }
        );
    };

    const filteredNotifications = notifications.filter((notif) => {
        if (activeTab === 'unread') {
            return !notif.read_at;
        }
        return true;
    });

    return (
        <div className="flex items-center gap-3">
            {/* User Profile Pill */}
            <Link
                href={route('admin.profile')}
                className="group flex items-center gap-2 rounded-xl px-2.5 py-1.5 transition-colors hover:bg-white/5"
            >
                <div className="text-right">
                    <p className="text-sm font-bold tracking-tight transition-colors group-hover:text-amber-300" style={{ color: ACCENT }}>
                        {displayName}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">{displayRole}</p>
                </div>
            </Link>

            {/* Notification Bell & Floating Dropdown */}
            <div className="relative" ref={dropdownRef}>
                <button
                    type="button"
                    id="admin-notification-bell-btn"
                    aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
                    aria-expanded={notificationsOpen}
                    onClick={() => setNotificationsOpen((prev) => !prev)}
                    className={`relative flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
                        notificationsOpen
                            ? 'border-amber-400/40 bg-amber-400/10 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]'
                            : 'border-white/10 bg-white/[0.03] text-gray-300 hover:border-white/20 hover:bg-white/10 hover:text-white'
                    }`}
                >
                    <Bell className={`h-4 w-4 transition-transform ${notificationsOpen ? 'scale-110' : ''}`} />
                    {unreadCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white shadow-[0_0_10px_rgba(239,68,68,0.7)] animate-pulse">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </button>

                {/* Floating Notification Card Popover */}
                {notificationsOpen && (
                    <div 
                        id="admin-notification-popover"
                        className="absolute right-0 top-full mt-3 z-[100] w-[min(24rem,calc(100vw-1.5rem))] sm:w-[410px] origin-top-right rounded-2xl border border-white/15 bg-[#121214]/95 backdrop-blur-2xl shadow-2xl ring-1 ring-black/60 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
                    >
                        {/* Header */}
                        <div className="border-b border-white/10 bg-white/[0.02] p-4">
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-bold text-white tracking-tight">Notifications</h3>
                                    {unreadCount > 0 ? (
                                        <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[11px] font-semibold text-amber-400">
                                            {unreadCount} unread
                                        </span>
                                    ) : (
                                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-medium text-gray-400">
                                            Up to date
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {unreadCount > 0 && (
                                        <button
                                            type="button"
                                            id="mark-all-notifications-read-btn"
                                            disabled={markingAll}
                                            onClick={handleMarkAllRead}
                                            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-amber-400 transition-colors hover:bg-amber-400/10 hover:text-amber-300 disabled:opacity-50"
                                        >
                                            <CheckCheck className="h-3.5 w-3.5" />
                                            <span>Mark read</span>
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        aria-label="Close notifications"
                                        onClick={() => setNotificationsOpen(false)}
                                        className="rounded-md p-1 text-gray-400 hover:bg-white/5 hover:text-white"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Filter Tabs */}
                            <div className="mt-3 flex items-center gap-1 rounded-xl bg-black/40 p-1 border border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('all')}
                                    className={`flex-1 rounded-lg py-1 text-xs font-semibold transition-all ${
                                        activeTab === 'all'
                                            ? 'bg-amber-400 text-black shadow-sm'
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    All ({notifications.length})
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('unread')}
                                    className={`flex-1 rounded-lg py-1 text-xs font-semibold transition-all ${
                                        activeTab === 'unread'
                                            ? 'bg-amber-400 text-black shadow-sm'
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    Unread ({unreadCount})
                                </button>
                            </div>
                        </div>

                        {/* List Body */}
                        <div className="max-h-[360px] overflow-y-auto divide-y divide-white/5">
                            {filteredNotifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
                                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                                        <CheckCircle2 className="h-6 w-6 text-amber-400/80" />
                                    </div>
                                    <p className="text-sm font-semibold text-white">All caught up!</p>
                                    <p className="mt-1 text-xs text-gray-400 max-w-[220px]">
                                        {activeTab === 'unread'
                                            ? 'You have zero unread notifications.'
                                            : 'No notifications recorded yet.'}
                                    </p>
                                </div>
                            ) : (
                                filteredNotifications.map((notification) => {
                                    const isUnread = !notification.read_at;
                                    return (
                                        <button
                                            key={notification.id}
                                            type="button"
                                            onClick={() => handleMarkRead(notification)}
                                            className={`group relative flex w-full items-start gap-3 p-3.5 text-left transition-colors ${
                                                isUnread
                                                    ? 'bg-amber-400/[0.04] hover:bg-amber-400/[0.08]'
                                                    : 'hover:bg-white/[0.03]'
                                            }`}
                                        >
                                            {/* Unread Glow Dot */}
                                            {isUnread && (
                                                <span className="absolute left-1.5 top-5 h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)]" />
                                            )}

                                            {/* Type Icon Badge */}
                                            <div
                                                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${getIconBg(
                                                    notification.type
                                                )}`}
                                            >
                                                {getNotificationIcon(notification.type)}
                                            </div>

                                            {/* Details */}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-baseline justify-between gap-2">
                                                    <p
                                                        className={`text-xs font-semibold tracking-tight transition-colors group-hover:text-amber-300 ${
                                                            isUnread ? 'text-white' : 'text-gray-300'
                                                        }`}
                                                    >
                                                        {notification.title}
                                                    </p>
                                                    <span className="flex items-center gap-1 shrink-0 text-[10px] text-gray-500">
                                                        <Clock className="h-3 w-3" />
                                                        {timeAgo(notification.created_at)}
                                                    </span>
                                                </div>
                                                <p className="mt-1 line-clamp-2 text-xs text-gray-400 leading-relaxed">
                                                    {notification.message}
                                                </p>
                                                {notification.action_url && (
                                                    <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-amber-400/80 group-hover:text-amber-300">
                                                        <span>View details</span>
                                                        <ExternalLink className="h-3 w-3" />
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between border-t border-white/10 bg-black/40 px-4 py-2.5 text-xs">
                            <Link
                                href={route('admin.notifications.index')}
                                onClick={() => setNotificationsOpen(false)}
                                className="font-medium text-gray-400 transition-colors hover:text-amber-400"
                            >
                                Full notification history &rarr;
                            </Link>
                            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span>Realtime</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* User Avatar Circle */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-amber-400/40 bg-neutral-900 shadow-[0_0_15px_rgba(251,191,36,0.15)]">
                <User className="h-5 w-5 text-amber-400" />
            </div>

            {/* Logout Option */}
            {auth?.guard === 'admin' && (
                <button
                    type="button"
                    className="rounded-lg px-2 py-1 text-xs text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                    onClick={() => router.post(route('admin.logout'))}
                >
                    Logout
                </button>
            )}
        </div>
    );
}

