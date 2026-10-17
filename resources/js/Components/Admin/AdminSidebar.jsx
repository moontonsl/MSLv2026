import { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    Bell,
    CalendarDays,
    CalendarPlus,
    ChevronDown,
    ClipboardCheck,
    ClipboardList,
    Gauge,
    Image,
    LayoutGrid,
    Link2,
    Megaphone,
    MessageSquare,
    PanelLeftClose,
    PanelLeftOpen,
    School,
    Settings,
    Shield,
    Trophy,
    UserCog,
    UserPlus,
    UserRoundCog,
    Users,
    X,
} from 'lucide-react';

const NAV_GROUPS = [
    {
        label: 'Overview',
        icon: Gauge,
        items: [
            { id: 'dashboard', label: 'Dashboard', href: '/admin/dashboard', icon: Gauge, permission: 'access_admin_dashboard' },
            { id: 'notifications', label: 'Notifications', href: '/admin/notifications', icon: Bell, permission: null },
        ],
    },
    {
        label: 'People & Accounts',
        icon: Users,
        items: [
            { id: 'account-creation', label: 'School Management', href: '/admin/schools', icon: UserPlus, permission: 'manage_accounts' },
            { id: 'pending-users', label: 'Pending Account Approvals', href: '/admin/pending-account-approvals', icon: ClipboardCheck, permission: 'manage_accounts' },
            { id: 'sl-management', label: 'Student Leaders', href: '/admin/student-leaders', icon: UserCog, permission: 'manage_sl' },
            { id: 'regional-admins', label: 'Regional Admin Accounts', href: '/admin/regional-admin-accounts', icon: School, permission: 'manage_regional_admins' },
            { id: 'regional-admin', label: 'Regional Admin Assignments', href: '/admin/regional-admin-assignments', icon: UserRoundCog, permission: null },
            { id: 'accounts', label: 'Administrator Accounts', href: '/admin/administrator-accounts', icon: Users, permission: 'manage_admin_accounts' },
            { id: 'management', label: 'Account Roles & Permissions', href: '/admin/account-roles-permissions', icon: Shield, permission: 'access_admin_management' },
        ],
    },
    {
        label: 'Website Content',
        icon: LayoutGrid,
        items: [
            { id: 'home-page', label: 'Home Page', href: '/admin/home-page', icon: LayoutGrid, permission: 'manage_homepage' },
            { id: 'faq', label: 'FAQ', href: '/admin/faq', icon: MessageSquare, permission: 'manage_faq' },
            { id: 'news', label: 'News Articles', href: '/admin/news-articles', icon: Megaphone, permission: 'manage_news' },
            { id: 'legacy-news', label: 'Legacy News Manager', href: '/admin/legacy-news', icon: Megaphone, permission: 'manage_news' },
            { id: 'carousel', label: 'Carousel', href: '/admin/carousel', icon: Image, permission: 'manage_carousel' },
            { id: 'event-photos', label: 'Event Photos', href: '/admin/event-photos', icon: Image, permission: 'manage_event_photos' },
            { id: 'settings', label: 'Website Settings', href: '/admin/website-settings', icon: Settings, permission: 'manage_settings' },
            { id: 'footer', label: 'Footer Content', href: '/admin/footer-content', icon: LayoutGrid, permission: 'manage_footer' },
            { id: 'share-links', label: 'Share Links', href: '/admin/share-links', icon: Link2, permission: 'manage_share_links' },
        ],
    },
    {
        label: 'Events & Tournaments',
        icon: CalendarDays,
        items: [
            { id: 'events', label: 'Scheduled Events', href: '/admin/scheduled-events', icon: CalendarDays, permission: 'manage_events' },
            { id: 'msl-events', label: 'Public MSL Events', href: '/admin/public-msl-events', icon: Trophy, permission: 'manage_msl_events' },
            { id: 'event-management', label: 'Event Management', href: '/admin/event-management', icon: CalendarPlus, permission: null },
            { id: 'registration-management', label: 'Registration Management', href: '/admin/registration-management', icon: ClipboardCheck, permission: null },
            { id: 'mcc-seasons', label: 'MCC Seasons', href: '/admin/mcc-seasons', icon: Trophy, permission: 'manage_mcc_seasons' },
            { id: 'campus-reports', label: 'Campus Tournament Reports', href: '/admin/campus-tournaments/reports', icon: Trophy, permission: null, superAdminOnly: true },
        ],
    },
    {
        label: 'Safety & Audit',
        icon: Shield,
        items: [
            { id: 'violations', label: 'Violation Reports', href: '/admin/violation-reports', icon: AlertTriangle, permission: 'manage_violation_reports' },
            { id: 'audit-logs', label: 'Audit Logs', href: '/admin/audit-logs', icon: ClipboardList, permission: 'manage_audit_logs' },
        ],
    },
];

export default function AdminSidebar({
    activeId = 'dashboard',
    isOpen = false,
    isCollapsed = false,
    onClose = () => {},
    onToggleCollapse = () => {},
}) {
    const {
        auth,
        admin_notifications_unread_count: unreadCount = 0,
    } = usePage().props;

    const role = auth?.user?.role;
    const isSuperAdmin =
        auth?.is_super_admin ??
        ['Super Admin', 'super_admin'].includes(role);
    const permissions = auth?.permissions ?? [];

    const [openGroups, setOpenGroups] = useState(() => {
        const activeGroup = NAV_GROUPS.find(({ items }) =>
            items.some(({ id }) => id === activeId)
        );

        return new Set([activeGroup?.label ?? NAV_GROUPS[0].label]);
    });

    useEffect(() => {
        const activeGroup = NAV_GROUPS.find(({ items }) =>
            items.some(({ id }) => id === activeId)
        );

        if (!activeGroup) return;

        setOpenGroups((currentGroups) => {
            if (currentGroups.has(activeGroup.label)) return currentGroups;

            const nextGroups = new Set(currentGroups);
            nextGroups.add(activeGroup.label);
            return nextGroups;
        });
    }, [activeId]);

    const toggleGroup = (groupLabel) => {
        setOpenGroups((currentGroups) => {
            const nextGroups = new Set(currentGroups);

            if (nextGroups.has(groupLabel)) {
                nextGroups.delete(groupLabel);
            } else {
                nextGroups.add(groupLabel);
            }

            return nextGroups;
        });
    };

    return (
        <>
            <button
                type="button"
                aria-label="Close admin navigation"
                aria-hidden={!isOpen}
                tabIndex={isOpen ? 0 : -1}
                className={`fixed inset-0 z-40 bg-black/60 transition-opacity lg:hidden ${
                    isOpen
                        ? 'opacity-100'
                        : 'pointer-events-none opacity-0'
                }`}
                onClick={onClose}
            />

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col overflow-hidden border-r border-neutral-800 bg-[#141414] transition-all duration-200 ${
                    isCollapsed ? 'lg:w-20' : 'lg:w-72'
                } ${
                    isOpen
                        ? 'translate-x-0'
                        : '-translate-x-full lg:translate-x-0'
                }`}
            >
                <div
                    className={`flex min-h-20 shrink-0 items-center border-b border-neutral-800 ${
                        isCollapsed
                            ? 'gap-3 px-4 lg:flex-col lg:justify-center lg:gap-2 lg:px-2 lg:py-3'
                            : 'gap-3 px-4'
                    }`}
                >
                    <img
                        src="/Images/Admin/logo/msl-logo.png"
                        alt=""
                        className="h-10 w-10 shrink-0 object-contain"
                    />

                    <span
                        className={`whitespace-nowrap text-base font-bold leading-tight text-white ${
                            isCollapsed ? 'lg:hidden' : ''
                        }`}
                    >
                        MSL Philippines
                    </span>

                    <button
                        type="button"
                        aria-label={
                            isCollapsed
                                ? 'Expand admin navigation'
                                : 'Collapse admin navigation'
                        }
                        aria-expanded={!isCollapsed}
                        onClick={onToggleCollapse}
                        className={`hidden h-10 w-10 shrink-0 items-center justify-center rounded-md text-gray-400 hover:bg-white/5 hover:text-white lg:inline-flex ${
                            isCollapsed ? '' : 'ml-auto'
                        }`}
                    >
                        {isCollapsed ? (
                            <PanelLeftOpen className="h-5 w-5" />
                        ) : (
                            <PanelLeftClose className="h-5 w-5" />
                        )}
                    </button>

                    <button
                        type="button"
                        aria-label="Close admin navigation"
                        onClick={onClose}
                        className="ml-auto rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white lg:hidden"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <nav
                    aria-label="Admin navigation"
                    className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-2 py-4"
                >
                    {NAV_GROUPS.map(({ label: groupLabel, icon: GroupIcon, items }) => {
                        const visibleItems = items.filter(
                            ({ permission, superAdminOnly }) =>
                                (!superAdminOnly || isSuperAdmin) &&
                                (permission === null ||
                                    isSuperAdmin ||
                                    permissions.includes(permission))
                        );

                        if (visibleItems.length === 0) return null;

                        const isGroupOpen = openGroups.has(groupLabel);
                        const groupId = `admin-nav-${groupLabel
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')}`;

                        return (
                            <section key={groupLabel} className="space-y-1">
                                <button
                                    type="button"
                                    aria-expanded={isGroupOpen}
                                    aria-controls={groupId}
                                    aria-label={
                                        isCollapsed
                                            ? `Toggle ${groupLabel}`
                                            : undefined
                                    }
                                    title={isCollapsed ? groupLabel : undefined}
                                    onClick={() => toggleGroup(groupLabel)}
                                    className={`flex min-h-10 w-full items-center rounded-md text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500 transition-colors hover:bg-white/5 hover:text-gray-300 ${
                                        isCollapsed
                                            ? 'justify-start gap-2 px-3 lg:justify-center lg:px-2'
                                            : 'gap-2 px-4'
                                    }`}
                                >
                                    <GroupIcon
                                        className={`h-4 w-4 shrink-0 text-gray-400 ${
                                            isCollapsed
                                                ? 'hidden lg:block'
                                                : 'hidden'
                                        }`}
                                    />

                                    <span
                                        className={`min-w-0 flex-1 truncate ${
                                            isCollapsed ? 'lg:hidden' : ''
                                        }`}
                                    >
                                        {groupLabel}
                                    </span>

                                    <ChevronDown
                                        className={`h-4 w-4 shrink-0 transition-transform ${
                                            isGroupOpen ? 'rotate-180' : ''
                                        } ${isCollapsed ? 'lg:hidden' : ''}`}
                                    />
                                </button>

                                <div
                                    id={groupId}
                                    className={isGroupOpen ? 'space-y-1' : 'hidden'}
                                >
                                    {visibleItems.map(
                                        ({ id, label: itemLabel, href, icon: Icon }) => {
                                            const isActive = id === activeId;
                                            const hasUnreadNotifications =
                                                id === 'notifications' && unreadCount > 0;
                                            const accessibleLabel =
                                                hasUnreadNotifications
                                                    ? `${itemLabel} (${unreadCount} unread)`
                                                    : itemLabel;

                                            return (
                                                <Link
                                                    key={id}
                                                    href={href}
                                                    onClick={onClose}
                                                    title={
                                                        isCollapsed
                                                            ? accessibleLabel
                                                            : undefined
                                                    }
                                                    aria-label={
                                                        isCollapsed
                                                            ? accessibleLabel
                                                            : undefined
                                                    }
                                                    aria-current={
                                                        isActive ? 'page' : undefined
                                                    }
                                                    className={`group flex min-h-11 min-w-0 items-center rounded-md py-2.5 text-sm font-medium transition-colors ${
                                                        isCollapsed
                                                            ? 'justify-start gap-3 px-4 lg:justify-center lg:gap-0 lg:px-2'
                                                            : 'gap-3 px-4'
                                                    } ${
                                                        isActive
                                                            ? 'bg-[#FBBF24]/10 text-[#FBBF24]'
                                                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                                    }`}
                                                >
                                                    <Icon
                                                        className={`h-5 w-5 shrink-0 ${
                                                            isActive
                                                                ? 'text-[#FBBF24]'
                                                                : 'text-gray-400 group-hover:text-white'
                                                        }`}
                                                    />

                                                    <span
                                                        className={`min-w-0 flex-1 truncate ${
                                                            isCollapsed ? 'lg:hidden' : ''
                                                        }`}
                                                    >
                                                        {itemLabel}
                                                    </span>

                                                    {hasUnreadNotifications && (
                                                        <>
                                                            <span
                                                                className={`shrink-0 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white ${
                                                                    isCollapsed
                                                                        ? 'lg:hidden'
                                                                        : ''
                                                                }`}
                                                            >
                                                                {unreadCount > 99
                                                                    ? '99+'
                                                                    : unreadCount}
                                                            </span>

                                                            {isCollapsed && (
                                                                <span
                                                                    aria-hidden="true"
                                                                    className="hidden h-2 w-2 shrink-0 rounded-full bg-red-500 lg:block"
                                                                />
                                                            )}
                                                        </>
                                                    )}
                                                </Link>
                                            );
                                        }
                                    )}
                                </div>
                            </section>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}
