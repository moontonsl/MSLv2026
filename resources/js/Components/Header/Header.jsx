import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { Menu, ChevronDown, UserRound } from 'lucide-react';
import AccountModificationModal from './AccountModificationModal';
import MobileNavigationDrawer from './MobileNavigationDrawer';
import { ABOUT_ITEMS, PROGRAMS_ITEMS, MAIN_LINKS, isNavigationItemActive, isNavigationGroupActive } from '@/data/siteNavigation';

const navFocusClass = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500';
const navRowClass = `flex min-h-12 items-center gap-2 rounded-sm text-left text-sm font-medium transition-colors duration-150 hover:text-white motion-reduce:transition-none ${navFocusClass}`;
const navUnderlineClass = (active) => `inline-block border-b-2 py-1 ${active ? 'border-brand-500 text-brand-500' : 'border-transparent'}`;

function AccountIcon() {
    return (
        <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-brand-500/50 bg-bg-card text-brand-500 transition-colors duration-150 group-hover:border-brand-500 group-hover:bg-brand-500/10 motion-reduce:transition-none">
            <UserRound className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
        </span>
    );
}

function NavItemLink({ item, url, onNavigate, mobile = false, submenu = false }) {
    const active = isNavigationItemActive(url, item);

    return (
        <Link
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`${navRowClass} ${mobile || submenu ? 'w-full justify-between px-3' : 'px-2'} ${active ? 'text-brand-500' : 'text-gray-300'} ${submenu ? 'hover:bg-white/5' : ''}`}
            onClick={onNavigate}
        >
            <span className={submenu ? 'inline-block py-1' : navUnderlineClass(active)}>{item.label}</span>
        </Link>
    );
}

function NavDropdown({ id, label, items, isOpen, onToggle, onNavigate, url, mobile = false }) {
    const childActive = isNavigationGroupActive(url, id, items);
    const panelId = `${mobile ? 'mobile' : 'desktop'}-${id}-links`;

    return (
        <div className="relative" onKeyDown={(event) => {
            if (event.key === 'Escape' && isOpen) {
                event.stopPropagation();
                onToggle(id);
                event.currentTarget.querySelector('button')?.focus();
            }
        }}>
            <button
                type="button"
                className={`${navRowClass} ${mobile ? 'w-full justify-between px-3' : 'px-2'} ${childActive || isOpen ? 'text-brand-500' : 'text-gray-300'}`}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => onToggle(id)}
            >
                <span className={navUnderlineClass(childActive)}>{label}</span>
                <ChevronDown
                    aria-hidden="true"
                    className={`h-4 w-4 shrink-0 transition-transform duration-150 motion-reduce:transition-none ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                />
            </button>
            {isOpen && (
                <div id={panelId} className={mobile ? 'mb-3 ml-3 pl-2' : 'absolute left-0 top-full z-50 mt-2 min-w-64 rounded-xl border border-white/10 bg-bg-card p-2 shadow-soft'}>
                    {items.map((item) => <NavItemLink key={item.label} item={item} url={url} onNavigate={onNavigate} submenu mobile={mobile} />)}
                </div>
            )}
        </div>
    );
}

function DesktopNavigation({
    navRef,
    openDropdown,
    toggleNavDropdown,
    closeNavDropdowns,
    url,
}) {
    return (
        <nav
            ref={navRef}
            id="main-navigation"
            className="hidden items-center gap-2 lg:flex"
            aria-label="Main"
        >
            <NavItemLink item={{ label: 'Home', href: '/' }} url={url} onNavigate={closeNavDropdowns} />
            <NavDropdown
                id="about"
                label="About"
                items={ABOUT_ITEMS}
                isOpen={openDropdown === 'about'}
                onToggle={toggleNavDropdown}
                onNavigate={closeNavDropdowns}
                url={url}
            />
            <NavDropdown
                id="programs"
                label="Programs"
                items={PROGRAMS_ITEMS}
                isOpen={openDropdown === 'programs'}
                onToggle={toggleNavDropdown}
                onNavigate={closeNavDropdowns}
                url={url}
            />
            {MAIN_LINKS.map((item) => <NavItemLink key={item.label} item={item} url={url} onNavigate={closeNavDropdowns} />)}
        </nav>
    );
}

function AccountMenuLinks({ user, userRole, onClose, onOpenModification }) {
    const profileHref =
        userRole === 'Student'
            ? '/studentportal'
            : userRole === 'Regional Admin'
              ? '/RegionalAdmin'
              : '/admin/dashboard';

    const showSlAdmin =
        userRole === 'SL' ||
        userRole === 'Student Leader' ||
        userRole === 'Super Admin' ||
        userRole === 'Regional Admin';

    const showCampusTournaments =
        userRole === 'SL' ||
        userRole === 'Student Leader' ||
        userRole === 'Regional Admin' ||
        userRole === 'Super Admin';

    const showModification =
        userRole === 'SL' ||
        userRole === 'Student Leader' ||
        userRole === 'Regional Admin' ||
        userRole === 'Super Admin';

    const modificationHref =
        userRole === 'Regional Admin' || userRole === 'Super Admin'
            ? '/RegionalAdminApproval'
            : '/SLAdminApproval';

    const linkClass =
        'block w-full rounded-lg px-3 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/10';

    return (
        <>
            <Link href={profileHref} className={linkClass} onClick={onClose}>
                Profile
            </Link>
            {showSlAdmin && (
                <Link
                    href={
                        userRole === 'Super Admin'
                            ? '/CoreAdmin'
                            : userRole === 'Regional Admin'
                              ? '/RegionalAdmin'
                              : '/StudentLeader'
                    }
                    className={linkClass}
                    onClick={onClose}
                >
                    SL Admin
                </Link>
            )}
            {showCampusTournaments && (
                <Link href="/campus-tournament" className={linkClass} onClick={onClose}>
                    Campus Tournaments
                </Link>
            )}
            {showModification && (
                <Link href={modificationHref} className={linkClass} onClick={onClose}>
                    Modification
                </Link>
            )}
            {userRole === 'Super Admin' && (
                <Link href="/admin/user-regions" className={linkClass} onClick={onClose}>
                    User Regions
                </Link>
            )}
            {(userRole === 'Regional Admin' || userRole === 'Super Admin') && (
                <Link href="/community/create" className={linkClass} onClick={onClose}>
                    Communities
                </Link>
            )}
            <button
                type="button"
                className={linkClass}
                onClick={() => {
                    onOpenModification();
                    onClose();
                }}
            >
                Modify Account
            </button>
        </>
    );
}

/**
 * @param {{ isLoggedIn?: boolean }} props
 * When `isLoggedIn` is omitted, auth is derived from Inertia `auth.user`.
 */
const Header = ({ isLoggedIn: isLoggedInProp }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [mobileSubmenu, setMobileSubmenu] = useState(null);
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
    const [showModificationModal, setShowModificationModal] = useState(false);

    const navRef = useRef(null);
    const accountRef = useRef(null);

    const page = usePage();
    const { auth } = page.props;
    const currentUrl =
        typeof page.url === 'string'
            ? page.url
            : typeof window !== 'undefined'
              ? window.location.pathname
              : '/';
    const user = auth?.user;
    const userRole = user?.user_type ?? user?.role;
    const loggedIn = isLoggedInProp !== undefined ? isLoggedInProp && !!user : !!user;

    useEffect(() => {
        const close = (e) => {
            if (navRef.current && !navRef.current.contains(e.target)) {
                setOpenDropdown(null);
            }
            if (accountRef.current && !accountRef.current.contains(e.target)) {
                setIsAccountDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, []);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape' && !mobileMenuOpen) {
                setOpenDropdown(null);
                setIsAccountDropdownOpen(false);
            }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [mobileMenuOpen]);

    useEffect(() => {
        const desktop = window.matchMedia('(min-width: 1024px)');
        const closeOnDesktop = () => {
            if (desktop.matches) {
                setMobileMenuOpen(false);
                setMobileSubmenu(null);
            }
        };

        desktop.addEventListener('change', closeOnDesktop);
        return () => desktop.removeEventListener('change', closeOnDesktop);
    }, []);

    useEffect(() => {
        setOpenDropdown(null);
        setMobileMenuOpen(false);
        setMobileSubmenu(null);
        setIsAccountDropdownOpen(false);
    }, [currentUrl]);

    const handleLogout = () => {
        setIsAccountDropdownOpen(false);
        router.post('/logout', {}, { replace: true });
    };

    const toggleNavDropdown = (id) => {
        setOpenDropdown((prev) => (prev === id ? null : id));
    };

    const closeNavDropdowns = () => {
        setOpenDropdown(null);
        setMobileMenuOpen(false);
        setMobileSubmenu(null);
    };

    return (
        <header className="w-full border-b border-white/5 bg-black text-white">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6">
                <div className="flex min-w-0 flex-1 items-center gap-3 lg:gap-6">
                    <button
                        type="button"
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-white lg:hidden ${navFocusClass}`}
                        aria-label="Open navigation"
                        aria-haspopup="dialog"
                        aria-expanded={mobileMenuOpen}
                        aria-controls="mobile-main-navigation"
                        onClick={() => {
                            setIsAccountDropdownOpen(false);
                            setOpenDropdown(null);
                            setMobileMenuOpen(true);
                        }}
                    >
                        <Menu size={24} aria-hidden="true" />
                    </button>

                    <Link href="/" className="flex h-9 shrink-0 items-center sm:h-10">
                        <img
                            src="/msl-logo.png"
                            alt="MSL Philippines"
                            className="h-full w-auto object-contain"
                        />
                    </Link>

                    <DesktopNavigation
                        navRef={navRef}
                        openDropdown={openDropdown}
                        toggleNavDropdown={toggleNavDropdown}
                        closeNavDropdowns={closeNavDropdowns}
                        url={currentUrl}
                    />
                </div>

                <div className="relative z-[61] flex shrink-0 items-center justify-end">
                    {!loggedIn ? (
                        <Link
                            href="/login"
                            className={`group inline-flex items-center justify-center rounded-full ${navFocusClass}`}
                            aria-label="Log in"
                        >
                            <AccountIcon />
                        </Link>
                    ) : (
                        <div className="relative" ref={accountRef}>
                            <button
                                type="button"
                                className={`group block rounded-full ${navFocusClass}`}
                                aria-label="Open account menu"
                                onClick={() => setIsAccountDropdownOpen((o) => !o)}
                                aria-expanded={isAccountDropdownOpen}
                                aria-haspopup="true"
                            >
                                <AccountIcon />
                            </button>

                            {isAccountDropdownOpen && user && (
                                <div className="absolute right-0 top-full z-[60] mt-3 w-[200px] overflow-hidden rounded-2xl bg-[#1A1A1A] p-3 shadow-2xl">
                                    <div className="flex flex-col gap-0.5">
                                        <AccountMenuLinks
                                            user={user}
                                            userRole={userRole}
                                            onClose={() => setIsAccountDropdownOpen(false)}
                                            onOpenModification={() =>
                                                setShowModificationModal(true)
                                            }
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="mt-3 w-full rounded-lg bg-[#FFC107] px-4 py-2.5 text-center text-sm font-semibold text-black transition hover:bg-[#F5B800]"
                                        onClick={handleLogout}
                                    >
                                        Log out
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <MobileNavigationDrawer
                open={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                onAfterLeave={() => setMobileSubmenu(null)}
            >
                <nav id="mobile-main-navigation" className="flex flex-col" aria-label="Mobile main">
                    <NavItemLink item={{ label: 'Home', href: '/' }} url={currentUrl} onNavigate={closeNavDropdowns} mobile />
                    {[{ id: 'about', label: 'About', items: ABOUT_ITEMS }, { id: 'programs', label: 'Programs', items: PROGRAMS_ITEMS }].map((group) => (
                        <NavDropdown key={group.id} {...group} isOpen={mobileSubmenu === group.id} onToggle={(id) => setMobileSubmenu((previous) => previous === id ? null : id)} onNavigate={closeNavDropdowns} url={currentUrl} mobile />
                    ))}
                    {MAIN_LINKS.map((item) => <NavItemLink key={item.label} item={item} url={currentUrl} onNavigate={closeNavDropdowns} mobile />)}
                </nav>
            </MobileNavigationDrawer>

            {showModificationModal && (
                <AccountModificationModal
                    isOpen={showModificationModal}
                    onClose={() => setShowModificationModal(false)}
                />
            )}
        </header>
    );
};

export default Header;
