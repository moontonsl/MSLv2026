import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid, Megaphone, MessageSquare, Gauge, Shield, Users,
    CalendarDays, Image, Settings, Trophy, UserCog, Link2,
    AlertTriangle, ClipboardCheck, ClipboardList, School, MapPin, X,
    ChevronDown, Images, BarChart3, Building2, Layers, Quote, Globe2,
} from 'lucide-react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

const SIDEBAR_SCROLL_KEY = 'msl_admin_sidebar_scroll_top';
let cachedSidebarScrollTop = null;

const getSavedSidebarScroll = () => {
    if (cachedSidebarScrollTop !== null) return cachedSidebarScrollTop;
    if (typeof window === 'undefined') return 0;
    try {
        const stored = window.sessionStorage.getItem(SIDEBAR_SCROLL_KEY);
        const parsed = stored ? Number(stored) : 0;
        return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
    } catch {
        return 0;
    }
};

const saveSidebarScroll = (scrollTop) => {
    cachedSidebarScrollTop = scrollTop;
    if (typeof window === 'undefined') return;
    try {
        window.sessionStorage.setItem(SIDEBAR_SCROLL_KEY, String(scrollTop));
    } catch {
        // Ignore storage quota/privacy mode errors
    }
};

const normalizePath = (url = '') => {
    const path = String(url).split('?')[0].split('#')[0].replace(/\/+$/, '').toLowerCase();
    return path || '/';
};

const NAV_SECTIONS = [
    {
        title: "Overview",
        items: [
            { id: 'dashboard', label: 'Dashboard', href: '/Admin/Dashboard', icon: Gauge, permission: 'access_admin_dashboard' },
        ],
    },
    {
        title: "Website Management",
        items: [
            { id: 'sl-management', label: 'Account Management', href: '/admin/sl-management', icon: UserCog, permission: 'manage_sl' },
            { id: 'home-statistics', label: 'About Section Statistics Counters', href: '/admin/home-page/statistics', icon: BarChart3, permission: 'manage_statistics|manage_homepage' },
            { id: 'home-programs', label: 'Our Programs', href: '/admin/home-page/programs', icon: Layers, permission: 'manage_programs|manage_homepage' },
            { id: 'footer', label: 'Footer Links', href: '/admin/footer', icon: LayoutGrid, permission: 'manage_footer' },
        ],
    },
    {
        title: "Campus",
        items: [
            { id: 'pending-users', label: 'Pending Verification', href: '/Admin/Users/Pending', icon: ClipboardCheck, permission: 'manage_accounts' },
            { id: 'regional-admins', label: 'Regional Admins', href: '/admin/regional-admin-management', icon: MapPin, permission: 'manage_regional_admins' },
            { id: 'school-management', label: 'School Management', href: '/Admin/SchoolManagement', icon: School, permission: 'manage_schools' },
            { id: 'community-directory', label: 'Community Directory', href: '/admin/community-directory', icon: Globe2, permission: 'manage_community_directory|manage_schools|manage_homepage' },
            { id: 'home-community-voice', label: 'MSL Campus Community', href: '/admin/home-page/community-voice', icon: Quote, permission: 'manage_campus_community|manage_homepage' },
        ],
    },
    {
        title: "Content & CMS",
        items: [
            { id: 'home-hero-carousel', label: 'Hero Carousel', href: '/admin/home-page/hero-carousel', icon: Images, permission: 'manage_homepage|manage_carousel' },
            { id: 'news', label: 'News & Updates', href: '/admin/news-updates', icon: Megaphone, permission: 'manage_news' },
            { id: 'share-links', label: 'Short Links', href: '/Admin/ShareLinks', icon: Link2, permission: 'manage_share_links' },
        ],
    },
    {
        title: "The MSL Network",
        items: [
            { id: 'home-network-organizations', label: 'MSL Network Organizations', href: '/admin/home-page/network-organizations', icon: Building2, permission: 'manage_network_organizations|manage_homepage' },
        ],
    },
    {
        title: "All Department",
        items: [
            { id: 'faq', label: 'FAQ Manager', href: '/Admin/FAQs', icon: MessageSquare, permission: 'manage_faq' },
        ],
    },
    {
        title: "Esports & Operations",
        items: [
            { id: 'mcc-seasons', label: 'MCC Seasons', href: '/admin/mcc-seasons', icon: Trophy, permission: 'manage_mcc_seasons' },
            { id: 'msl-events', label: 'MSL Tournaments', href: '/admin/msl-events', icon: Trophy, permission: 'manage_msl_events' },
        ],
    },
    {
        title: "Events",
        items: [
            { id: 'events', label: 'Event Calendar', href: '/admin/events', icon: CalendarDays, permission: 'manage_events' },
            { id: 'event-photos', label: 'Event Gallery', href: '/admin/event-photos', icon: Image, permission: 'manage_event_photos' },
        ],
    },
    {
        title: "System & Governance",
        items: [
            { id: 'accounts', label: 'Admin Accounts', href: '/admin/accounts', icon: Users, permission: 'manage_admin_accounts' },
            { id: 'management', label: 'Permissions & Roles', href: '/admin/management', icon: Shield, permission: 'access_admin_management' },
            { id: 'audit-logs', label: 'Audit Trail', href: '/admin/audit-logs', icon: ClipboardList, permission: 'manage_audit_logs' },
            { id: 'violations', label: 'Violation Reports', href: '/admin/violation-reports', icon: AlertTriangle, permission: 'manage_violation_reports' },
            { id: 'settings', label: 'System Settings', href: '/admin/settings', icon: Settings, permission: 'manage_settings' },
        ],
    },
];

export default function AdminSidebar({ activeId = 'dashboard', isOpen = false, onClose = () => {} }) {
    const page = usePage();
    const { auth, admin_notifications_unread_count: unreadCount = 0 } = page.props;
    const currentPath = normalizePath(page.url || (typeof window !== 'undefined' ? window.location.pathname : ''));
    const navRef = useRef(null);
    const activeItemRef = useRef(null);

    const role = auth?.user?.role;
    const isSuperAdmin = auth?.is_super_admin ?? ['Super Admin', 'super_admin', 'Core Admin', 'core_admin'].includes(role);
    const permissions = auth?.permissions ?? [];

    const isPermitted = (permission) => {
        if (!permission) return true;
        if (isSuperAdmin) return true;
        const required = String(permission).split('|').map((p) => p.trim());
        return required.some((perm) => permissions.includes(perm));
    };

    // Resolve persistent active nav item: prioritize URL match if activeId is default/omitted,
    // otherwise honor explicit activeId and fall back to URL path matching.
    const resolvedActiveId = useMemo(() => {
        const allItems = NAV_SECTIONS.flatMap((section) =>
            section.items.flatMap((item) => (item.children ? [item, ...item.children] : [item]))
        );

        const urlMatch = allItems.find((item) => {
            if (!item.href) return false;
            const itemPath = normalizePath(item.href);
            return currentPath === itemPath || (itemPath !== '/' && currentPath.startsWith(`${itemPath}/`));
        });

        if (activeId && allItems.some((item) => item.id === activeId)) {
            if (activeId === 'dashboard' && urlMatch && urlMatch.id !== 'dashboard') {
                return urlMatch.id;
            }
            return activeId;
        }

        return urlMatch?.id ?? activeId;
    }, [activeId, currentPath]);

    const hasActiveChildInGroup = (group) =>
        group.id === resolvedActiveId || (group.children ?? []).some((child) => child.id === resolvedActiveId);

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
    }, [resolvedActiveId]);

    // Restore sidebar scroll position immediately before paint so navigation never jumps to top,
    // and ensure the active link remains visible inside the fixed sidebar viewport.
    useLayoutEffect(() => {
        const navEl = navRef.current;
        if (!navEl) return;

        const savedTop = getSavedSidebarScroll();
        if (savedTop > 0) {
            navEl.scrollTop = savedTop;
        }

        const activeEl = activeItemRef.current;
        if (activeEl) {
            const navRect = navEl.getBoundingClientRect();
            const itemRect = activeEl.getBoundingClientRect();
            const isAbove = itemRect.top < navRect.top + 8;
            const isBelow = itemRect.bottom > navRect.bottom - 8;
            if (isAbove || isBelow) {
                activeEl.scrollIntoView({ block: 'nearest', behavior: 'auto' });
                saveSidebarScroll(navEl.scrollTop);
            }
        }
    }, [resolvedActiveId]);

    const handleNavScroll = (e) => {
        saveSidebarScroll(e.currentTarget.scrollTop);
    };

    useEffect(() => {
        if (!isOpen) return undefined;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

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

            {/* Fixed Sidebar Aside */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-[min(16rem,85vw)] lg:w-64 shrink-0 flex-col border-r border-white/10 bg-[#0e0e12] transition-transform duration-200 ease-in-out lg:translate-x-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Brand Header */}
                <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4 sm:px-5 sm:py-5 bg-[#0a0a0d]">
                    <div className="relative flex shrink-0 items-center justify-center">
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
                        <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest truncate">
                            Control Panel
                        </span>
                    </div>
                    <button
                        type="button"
                        aria-label="Close admin navigation"
                        className="ml-auto inline-flex min-h-9 min-w-9 shrink-0 items-center justify-center rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors lg:hidden"
                        onClick={onClose}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Grouped Navigation Links */}
                <nav
                    ref={navRef}
                    onScroll={handleNavScroll}
                    aria-label="Admin navigation"
                    className="flex flex-1 flex-col gap-5 overflow-y-auto overscroll-contain px-3 py-4 text-xs font-medium scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent"
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
                                                            const isChildActive = childId === resolvedActiveId;
                                                            return (
                                                                <li key={childId} ref={isChildActive ? activeItemRef : null}>
                                                                    <Link
                                                                        href={childHref}
                                                                        onClick={() => {
                                                                            if (navRef.current) saveSidebarScroll(navRef.current.scrollTop);
                                                                            onClose();
                                                                        }}
                                                                        aria-current={isChildActive ? 'page' : undefined}
                                                                        className={`group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[11px] font-semibold leading-snug transition-all duration-150 ${
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

                                        const isActive = id === resolvedActiveId;

                                        return (
                                            <li key={id} ref={isActive ? activeItemRef : null}>
                                                <Link
                                                    href={href}
                                                    onClick={() => {
                                                        if (navRef.current) saveSidebarScroll(navRef.current.scrollTop);
                                                        onClose();
                                                    }}
                                                    aria-current={isActive ? 'page' : undefined}
                                                    className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-150 ${
                                                        isActive
                                                            ? 'bg-brand-500/15 text-brand-400 border border-brand-500/35 shadow-[0_0_14px_rgba(242,194,26,0.14)]'
                                                            : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200 border border-transparent'
                                                    }`}
                                                >
                                                    {isActive && (
                                                        <span
                                                            aria-hidden="true"
                                                            className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand-400 shadow-[0_0_8px_#F2C21A]"
                                                        />
                                                    )}
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
                <div
                    className="border-t border-white/5 px-3 pt-3 text-center bg-[#0a0a0d]/60"
                    style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))' }}
                >
                    <p className="text-[10px] text-zinc-400 font-medium">
                        MSL Philippines &copy; {new Date().getFullYear()}
                    </p>
                </div>
            </aside>
        </>
    );
}
