import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Megaphone, MessageSquare, UserPlus, Gauge, Shield, Users, CalendarDays, Image, Settings, Trophy, UserCog, Link2, AlertTriangle, ClipboardCheck, ClipboardList, School, X, Bell, CalendarPlus, UserRoundCog } from 'lucide-react';

const ACCENT = "#FBBF24";

const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', href: '/admin/dashboard', icon: Gauge, permission: 'access_admin_dashboard' },
    { id: 'notifications', label: 'Notifications', href: '/admin/notifications', icon: Bell, permission: null },
    { id: 'account-creation', label: 'Account Creation', href: '/admin/account-creation', icon: UserPlus, permission: 'manage_accounts' },
    { id: 'home-page', label: 'Home Page', href: '/admin/home-page', icon: LayoutGrid, permission: 'manage_homepage' },
    { id: 'faq', label: 'FAQ', href: '/admin/faq', icon: MessageSquare, permission: 'manage_faq' },
    { id: 'news', label: 'News & Updates', href: '/admin/news-updates', icon: Megaphone, permission: 'manage_news' },
    { id: 'pending-users', label: 'Pending Users', href: '/admin/users/pending', icon: ClipboardCheck, permission: 'manage_accounts' },
    { id: 'sl-management', label: 'Student Leaders', href: '/admin/sl-management', icon: UserCog, permission: 'manage_sl' },
    { id: 'regional-admins', label: 'Regional Admins', href: '/admin/regional-admin-management', icon: School, permission: 'manage_regional_admins' },
    { id: 'legacy-news', label: 'News Management', href: '/admin/news', icon: Megaphone, permission: 'manage_news' },
    { id: 'carousel', label: 'Carousel', href: '/admin/carousel', icon: Image, permission: 'manage_carousel' },
    { id: 'event-photos', label: 'Event Photos', href: '/admin/event-photos', icon: Image, permission: 'manage_event_photos' },
    { id: 'events', label: 'Event Calendar', href: '/admin/events', icon: CalendarDays, permission: 'manage_events' },
    { id: 'msl-events', label: 'MSL Events', href: '/admin/msl-events', icon: Trophy, permission: 'manage_msl_events' },
    { id: 'mcc-seasons', label: 'MCC Seasons', href: '/admin/mcc-seasons', icon: Trophy, permission: 'manage_mcc_seasons' },
    { id: 'violations', label: 'Violation Reports', href: '/admin/violation-reports', icon: AlertTriangle, permission: 'manage_violation_reports' },
    { id: 'settings', label: 'Settings', href: '/admin/settings', icon: Settings, permission: 'manage_settings' },
    { id: 'footer', label: 'Footer', href: '/admin/footer', icon: LayoutGrid, permission: 'manage_footer' },
    { id: 'share-links', label: 'Share Links', href: '/admin/share-links', icon: Link2, permission: 'manage_share_links' },
    { id: 'accounts', label: 'Admin Accounts', href: '/admin/accounts', icon: Users, permission: 'manage_admin_accounts' },
    { id: 'management', label: 'Permissions', href: '/admin/management', icon: Shield, permission: 'access_admin_management' },
    { id: 'audit-logs', label: 'Audit Logs', href: '/admin/audit-logs', icon: ClipboardList, permission: 'manage_audit_logs' },
    { id: 'regional-admin', label: 'Regional Admin', href: '/admin/regional-admin', icon: UserRoundCog, permission: null },
    { id: 'event-management', label: 'Event Management', href: '/admin/event-management', icon: CalendarPlus, permission: null },
    { id: 'registration-management', label: 'Registration Management', href: '/admin/registration-management', icon: ClipboardCheck, permission: null },
    { id: 'account-management', label: 'Account Management', href: '/admin/account-management', icon: UserCog, permission: null },
];

export default function AdminSidebar({ activeId = 'account-creation', isOpen = false, onClose = () => {} }) {
    const { auth, admin_notifications_unread_count: unreadCount = 0 } = usePage().props;
    const role = auth?.user?.role;
    const isSuperAdmin = auth?.is_super_admin ?? ['Super Admin', 'super_admin'].includes(role);
    const permissions = auth?.permissions ?? [];

    return (
        <>
            <button
                type="button"
                aria-label="Close admin navigation"
                aria-hidden={!isOpen}
                tabIndex={isOpen ? 0 : -1}
                className={`fixed inset-0 z-40 bg-black/60 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
                onClick={onClose}
            />
            <aside className={`fixed left-0 top-0 z-50 flex h-screen w-64 shrink-0 flex-col border-r border-neutral-800 bg-[#141414] transition-transform duration-200 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex items-center gap-3 border-b border-neutral-800 px-6 py-6">
                <img src="/msl-logo.png" alt="" className="h-10 w-10 object-contain" />
                <span className="text-sm font-bold leading-tight text-white">MSL Philippines</span>
                <button
                    type="button"
                    aria-label="Close admin navigation"
                    className="ml-auto rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white lg:hidden"
                    onClick={onClose}
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-6">
                {NAV_ITEMS.filter(({ permission }) => permission === null || isSuperAdmin || permissions.includes(permission)).map(({ id, label, href, icon: Icon }) => {
                    const isActive = id === activeId;

                    return (
                        <Link
                            key={id}
                            href={href}
                            onClick={onClose}
                            className={`flex min-h-12 min-w-0 items-center gap-3 rounded-r-md border-r-4 px-4 py-3 text-sm font-medium transition-colors ${
                                isActive
                                    ? "border-[#FBBF24] bg-white/5 pr-3 text-[#FBBF24]"
                                    : "border-transparent text-gray-400 hover:bg-white/5 hover:text-white"
                            }`}
                        >
                            <Icon className={`h-5 w-5 shrink-0 ${isActive ? '' : 'text-gray-400'}`} style={isActive ? { color: ACCENT } : undefined} />
                            <span className="flex-1">{label}</span>
                            {id === 'notifications' && unreadCount > 0 ? <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">{unreadCount > 99 ? '99+' : unreadCount}</span> : null}
                        </Link>
                    );
                })}
            </nav>
            </aside>
        </>
    );
}
