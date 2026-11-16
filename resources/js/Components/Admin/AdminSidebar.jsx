import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid, Megaphone, MessageSquare, Gauge, Shield, Users,
    CalendarDays, Image, Settings, Trophy, UserCog, Link2,
    AlertTriangle, ClipboardCheck, ClipboardList, School, MapPin, X,
    ChevronDown, Home, Images, BarChart3, Building2, Layers, Quote,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const NAV_SECTIONS = [
    {
        title: "Overview",
        items: [
            { id: 'dashboard', label: 'Dashboard', href: '/admin/dashboard', icon: Gauge, permission: 'access_admin_dashboard' },
        ],
    },
    {
        title: "Community & Students",
        items: [
            { id: 'pending-users', label: 'Pending Verification', href: '/admin/users/pending', icon: ClipboardCheck, permission: 'manage_accounts' },
            { id: 'sl-management', label: 'Student Leaders', href: '/admin/sl-management', icon: UserCog, permission: 'manage_sl' },
            { id: 'regional-admins', label: 'Regional Admins', href: '/admin/regional-admin-management', icon: MapPin, permission: 'manage_regional_admins' },
            { id: 'school-management', label: 'School Management', href: '/admin/school-management', icon: School, permission: 'manage_schools' },
        ],
    },
    {
        title: "Esports & Operations",
        items: [
            { id: 'mcc-seasons', label: 'MCC Seasons', href: '/admin/mcc-seasons', icon: Trophy, permission: 'manage_mcc_seasons' },
            { id: 'msl-events', label: 'MSL Tournaments', href: '/admin/msl-events', icon: Trophy, permission: 'manage_msl_events' },
            { id: 'events', label: 'Event Calendar', href: '/admin/events', icon: CalendarDays, permission: 'manage_events' },
            { id: 'event-photos', label: 'Event Gallery', href: '/admin/event-photos', icon: Image, permission: 'manage_event_photos' },
        ],
    },
    {
        title: "Content & CMS",
        items: [
            {
                id: 'home-page',
                label: 'Home Page',
                icon: Home,
                permission: 'manage_homepage',
                children: [
                    { id: 'home-hero-carousel', label: 'Hero Carousel', href: '/admin/home-page/hero-carousel', icon: Images },
                    { id: 'home-statistics', label: 'About Section Statistics Counters', href: '/admin/home-page/statistics', icon: BarChart3 },
                    { id: 'home-network-organizations', label: 'MSL Network Organizations', href: '/admin/home-page/network-organizations', icon: Building2 },
                    { id: 'home-programs', label: 'Our Programs', href: '/admin/home-page/programs', icon: Layers },
                    { id: 'home-community-voice', label: 'Community Voice', href: '/admin/home-page/community-voice', icon: Quote },
                ],
            },
            { id: 'news', label: 'News & Updates', href: '/admin/news-updates', icon: Megaphone, permission: 'manage_news' },
            { id: 'faq', label: 'FAQ Manager', href: '/admin/faq', icon: MessageSquare, permission: 'manage_faq' },
            { id: 'footer', label: 'Footer Links', href: '/admin/footer', icon: LayoutGrid, permission: 'manage_footer' },
        ],
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
        ],
    },
];

export default function AdminSidebar({ activeId = 'dashboard', isOpen = false, onClose = () => {} }) {
    const { auth, admin_notifications_unread_count: unreadCount = 0 } = usePage().props;
    const role = auth?.user?.role;
    const isSuperAdmin = auth?.is_super_admin ?? ['Super Admin', 'super_admin'].includes(role);
    const permissions = auth?.permissions ?? [];

    const isPermitted = (permission) => permission === null || isSuperAdmin || permissions.includes(permission);

    const hasActiveChildInGroup = (group) =>
        group.id === activeId || (group.children ?? []).some((child) => child.id === activeId);

    const [expandedGroups, setExpandedGroups] = useState(() => {
        const initial = {};
        NAV_SECTIONS.forEach((section) => {
            section.items.forEach((item) => {
                if (item.children) {
                    initial[item.id] = hasActiveChildInGroup(item);
                }
            });
        });
        return initial;
    });

    useEffect(() => {
        NAV_SECTIONS.forEach((section) => {
            section.items.forEach((item) => {
                if (item.children && hasActiveChildInGroup(item)) {
                    setExpandedGroups((prev) => (prev[item.id] ? prev : { ...prev, [item.id]: true }));
                }
            });
        });
    }, [activeId]);

    const toggleGroup = (groupId) => {
        setExpandedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
    };

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
                <nav
                    aria-label="Admin navigation"
                    className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-4 text-xs font-medium scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent"
                >
                    {NAV_SECTIONS.map((section) => {
                        const visibleItems = section.items.filter((item) => isPermitted(item.permission));
                        if (visibleItems.length === 0) return null;

                        return (
                            <div key={section.title} className="space-y-1">
                                <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                                    {section.title}
                                </div>

                                <ul className="space-y-0.5">
                                    {visibleItems.map((item) => {
                                        const { id, label, href, icon: Icon, children } = item;

                                        if (children && children.length > 0) {
                                            const isParentActive = hasActiveChildInGroup(item);
                                            const isExpanded = Boolean(expandedGroups[id]);
                                            const submenuId = `admin-submenu-${id}`;

                                            return (
                                                <li key={id} className="space-y-1">
                                                    <button
                                                        type="button"
                                                        aria-expanded={isExpanded}
                                                        aria-controls={submenuId}
                                                        onClick={() => toggleGroup(id)}
                                                        className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition-all duration-150 cursor-pointer ${
                                                            isParentActive
                                                                ? 'bg-brand-500/10 text-brand-400 border border-brand-500/25'
                                                                : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200 border border-transparent'
                                                        }`}
                                                    >
                                                        <Icon
                                                            aria-hidden="true"
                                                            className={`h-4 w-4 shrink-0 transition-transform duration-150 group-hover:scale-105 ${
                                                                isParentActive ? 'text-brand-400' : 'text-zinc-500 group-hover:text-zinc-300'
                                                            }`}
                                                        />
                                                        <span className="flex-1 truncate">{label}</span>
                                                        <ChevronDown
                                                            aria-hidden="true"
                                                            className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${
                                                                isExpanded ? 'rotate-180 text-brand-400' : 'text-zinc-500'
                                                            }`}
                                                        />
                                                    </button>

                                                    <ul
                                                        id={submenuId}
                                                        hidden={!isExpanded}
                                                        className="ml-4 space-y-0.5 border-l border-white/10 pl-2.5 pt-0.5"
                                                    >
                                                        {children.map(({ id: childId, label: childLabel, href: childHref, icon: ChildIcon }) => {
                                                            const isChildActive = childId === activeId;
                                                            return (
                                                                <li key={childId}>
                                                                    <Link
                                                                        href={childHref}
                                                                        onClick={onClose}
                                                                        aria-current={isChildActive ? 'page' : undefined}
                                                                        className={`group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[11px] font-semibold leading-snug transition-all duration-150 ${
                                                                            isChildActive
                                                                                ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30 shadow-[0_0_10px_rgba(242,194,26,0.1)]'
                                                                                : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200 border border-transparent'
                                                                        }`}
                                                                    >
                                                                        {ChildIcon ? (
                                                                            <ChildIcon
                                                                                aria-hidden="true"
                                                                                className={`h-3.5 w-3.5 shrink-0 ${
                                                                                    isChildActive ? 'text-brand-400' : 'text-zinc-500 group-hover:text-zinc-300'
                                                                                }`}
                                                                            />
                                                                        ) : null}
                                                                        <span className="flex-1 leading-tight">{childLabel}</span>
                                                                        {isChildActive && (
                                                                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400 shadow-[0_0_6px_#F2C21A]" />
                                                                        )}
                                                                    </Link>
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                </li>
                                            );
                                        }

                                        const isActive = id === activeId;

                                        return (
                                            <li key={id}>
                                                <Link
                                                    href={href}
                                                    onClick={onClose}
                                                    aria-current={isActive ? 'page' : undefined}
                                                    className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-150 ${
                                                        isActive
                                                            ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30 shadow-[0_0_12px_rgba(242,194,26,0.1)]'
                                                            : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200 border border-transparent'
                                                    }`}
                                                >
                                                    <Icon
                                                        aria-hidden="true"
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
                                            </li>
                                        );
                                    })}
                                </ul>
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
