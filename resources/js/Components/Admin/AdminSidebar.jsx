import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutGrid, Megaphone, MessageSquare, Gauge, Shield, Users, 
    CalendarDays, Image, Settings, Trophy, UserCog, Link2, 
    AlertTriangle, ClipboardCheck, ClipboardList, School, MapPin, X, Bell 
} from 'lucide-react';

const ACCENT = "#FBBF24";

const NAV_SECTIONS = [
    {
        title: "Overview",
        items: [
            { id: 'dashboard', label: 'Dashboard', href: '/admin/dashboard', icon: Gauge, permission: 'access_admin_dashboard' },
        ]
    },
    {
        title: "Community & Students",
        items: [
            { id: 'pending-users', label: 'Pending Verification', href: '/admin/users/pending', icon: ClipboardCheck, permission: 'manage_accounts' },
            { id: 'sl-management', label: 'Student Leaders', href: '/admin/sl-management', icon: UserCog, permission: 'manage_sl' },
            { id: 'regional-admins', label: 'Regional Admins', href: '/admin/regional-admin-management', icon: MapPin, permission: 'manage_regional_admins' },
            { id: 'school-management', label: 'School Management', href: '/admin/school-management', icon: School, permission: 'manage_schools' },
        ]
    },
    {
        title: "Esports & Operations",
        items: [
            { id: 'mcc-seasons', label: 'MCC Seasons', href: '/admin/mcc-seasons', icon: Trophy, permission: 'manage_mcc_seasons' },
            { id: 'msl-events', label: 'MSL Tournaments', href: '/admin/msl-events', icon: Trophy, permission: 'manage_msl_events' },
            { id: 'events', label: 'Event Calendar', href: '/admin/events', icon: CalendarDays, permission: 'manage_events' },
            { id: 'event-photos', label: 'Event Gallery', href: '/admin/event-photos', icon: Image, permission: 'manage_event_photos' },
        ]
    },
    {
        title: "Content & CMS",
        items: [
            { id: 'news', label: 'News & Updates', href: '/admin/news-updates', icon: Megaphone, permission: 'manage_news' },
            { id: 'carousel', label: 'Carousel Banners', href: '/admin/carousel', icon: Image, permission: 'manage_carousel' },
            { id: 'faq', label: 'FAQ Manager', href: '/admin/faq', icon: MessageSquare, permission: 'manage_faq' },
            { id: 'footer', label: 'Footer Links', href: '/admin/footer', icon: LayoutGrid, permission: 'manage_footer' },
            { id: 'home-page', label: 'Landing Settings', href: '/admin/home-page', icon: LayoutGrid, permission: 'manage_homepage' },
        ]
    },
    {
        title: "System & Governance",
        items: [
            { id: 'accounts', label: 'Admin Accounts', href: '/admin/accounts', icon: Users, permission: 'manage_admin_accounts' },
            { id: 'management', label: 'Permissions & Roles', href: '/admin/management', icon: Shield, permission: 'access_admin_management' },
            { id: 'audit-logs', label: 'Audit Trail', href: '/admin/audit-logs', icon: ClipboardList, permission: 'manage_audit_logs' },
            { id: 'violations', label: 'Violation Reports', href: '/admin/violation-reports', icon: AlertTriangle, permission: 'manage_violation_reports' },
            { id: 'share-links', label: 'Short Links', href: '/admin/share-links', icon: Link2, permission: 'manage_share_links' },
            { id: 'settings', label: 'System Settings', href: '/admin/settings', icon: Settings, permission: 'manage_settings' },
        ]
    }
];

export default function AdminSidebar({ activeId = 'dashboard', isOpen = false, onClose = () => {} }) {
    const { auth, admin_notifications_unread_count: unreadCount = 0 } = usePage().props;
    const role = auth?.user?.role;
    const isSuperAdmin = auth?.is_super_admin ?? ['Super Admin', 'super_admin'].includes(role);
    const permissions = auth?.permissions ?? [];

    const isPermitted = (permission) => permission === null || isSuperAdmin || permissions.includes(permission);

    return (
        <>
            {/* Mobile Backdrop */}
            <button
                type="button"
                aria-label="Close admin navigation"
                aria-hidden={!isOpen}
                tabIndex={isOpen ? 0 : -1}
                className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity lg:hidden ${
                    isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
                onClick={onClose}
            />

            {/* Sidebar Aside */}
            <aside 
                className={`fixed left-0 top-0 z-50 flex h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-[#0e0e12] transition-transform duration-200 ease-in-out lg:translate-x-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Brand Header */}
                <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5 bg-[#0a0a0d]">
                    <div className="relative flex items-center justify-center">
                        <img 
                            src="/MSL_LOGO.png" 
                            alt="MSL" 
                            className="h-9 w-auto object-contain drop-shadow-[0_2px_8px_rgba(242,194,26,0.3)]" 
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = '/msl-logo.png';
                            }}
                        />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-extrabold tracking-wide text-white uppercase truncate">
                            MSL <span className="text-brand-400">Admin</span>
                        </span>
                        <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
                            Control Panel
                        </span>
                    </div>
                    <button
                        type="button"
                        aria-label="Close admin navigation"
                        className="ml-auto rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors lg:hidden"
                        onClick={onClose}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Grouped Navigation Links */}
                <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-4 text-xs font-medium scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                    {NAV_SECTIONS.map((section) => {
                        const visibleItems = section.items.filter(item => isPermitted(item.permission));
                        if (visibleItems.length === 0) return null;

                        return (
                            <div key={section.title} className="space-y-1">
                                <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                                    {section.title}
                                </div>

                                <div className="space-y-0.5">
                                    {visibleItems.map(({ id, label, href, icon: Icon }) => {
                                        const isActive = id === activeId;

                                        return (
                                            <Link
                                                key={id}
                                                href={href}
                                                onClick={onClose}
                                                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-150 ${
                                                    isActive
                                                        ? "bg-brand-500/15 text-brand-400 border border-brand-500/30 shadow-[0_0_12px_rgba(242,194,26,0.1)]"
                                                        : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200 border border-transparent"
                                                }`}
                                            >
                                                <Icon 
                                                    className={`h-4 w-4 shrink-0 transition-transform duration-150 group-hover:scale-105 ${
                                                        isActive ? 'text-brand-400' : 'text-zinc-500 group-hover:text-zinc-300'
                                                    }`} 
                                                />
                                                <span className="flex-1 truncate">{label}</span>
                                                {id === 'notifications' && unreadCount > 0 ? (
                                                    <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[9px] font-bold text-white leading-none">
                                                        {unreadCount > 99 ? '99+' : unreadCount}
                                                    </span>
                                                ) : null}
                                                {isActive && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400 shadow-[0_0_6px_#F2C21A]" />
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </nav>

                {/* Footer Brand Tag */}
                <div className="border-t border-white/5 p-3 text-center bg-[#0a0a0d]/60">
                    <p className="text-[10px] text-zinc-400 font-medium">
                        MSL Philippines &copy; {new Date().getFullYear()}
                    </p>
                </div>
            </aside>
        </>
    );
}

