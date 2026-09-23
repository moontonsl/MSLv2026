import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { Menu, X, ChevronDown } from 'lucide-react';
import AccountModificationModal from './AccountModificationModal';

const ABOUT_ITEMS = [
    { label: 'Campus', href: '/Campus' },
    { label: 'Contents & Social Media', href: '/Contents&SocialMedia' },
    { label: 'Partnerships', href: '/Partnerships' },
    { label: 'General Affairs', href: '/GeneralAffairs' },
];

const PROGRAMS_ITEMS = [
    { label: 'The MSL Network', href: '/MSLNetAdmin' },
    { label: 'MSL Collegiate Cup', href: '/programs/collegiate-cup' },
    { label: 'Campus Tournaments', href: '/Tournament/Organizer' },
    { label: 'Buffs & Support', href: '/Buffs&Support' },
    { label: 'Referral Program', href: '/programs/referral' },
];

const AVATAR_PLACEHOLDER =
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop';

const menuPanelClass =
    'absolute left-0 top-full z-[60] mt-3 min-w-[220px] rounded-2xl bg-[#1A1A1A] p-2 shadow-2xl';

const menuItemClass =
    'block w-full rounded-lg px-4 py-2.5 text-left text-sm text-gray-300 transition-colors hover:bg-[#2A2A2A] hover:text-white';

const navLinkBase =
    'rounded-full px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-[#1E1E1E] hover:text-white';

const navLinkActive =
    'rounded-full bg-[#FFC107] px-4 py-2 text-sm font-medium text-black';

function isPathActive(url, href) {
    if (href === '/') return url === '/' || url === '';
    return url === href || url.startsWith(`${href}/`) || url.startsWith(`${href}?`);
}

function NavDropdown({ id, label, items, isOpen, onToggle, onNavigate, url }) {
    const childActive = items.some(({ href }) => isPathActive(url, href));

    return (
        <div className="relative">
            <button
                type="button"
                className={`flex items-center gap-1 ${
                    isOpen
                        ? 'text-[#FFC107]'
                        : childActive
                          ? navLinkActive
                          : navLinkBase
                } ${isOpen ? 'px-4 py-2' : ''}`}
                aria-expanded={isOpen}
                aria-haspopup="true"
                onClick={() => onToggle(id)}
            >
                {label}
                <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-[#FFC107]' : ''
                    }`}
                />
            </button>
            {isOpen && (
                <div className={menuPanelClass} role="menu">
                    {items.map(({ label: itemLabel, href }) => {
                        const active = isPathActive(url, href);
                        return (
                            <Link
                                key={itemLabel}
                                href={href}
                                className={`${menuItemClass} ${
                                    active
                                        ? 'border border-[#FFC107] bg-transparent text-white'
                                        : ''
                                }`}
                                role="menuitem"
                                onClick={onNavigate}
                            >
                                {itemLabel}
                            </Link>
                        );
                    })}
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
            className="hidden items-center gap-1 md:flex lg:gap-2"
            aria-label="Main"
        >
            <Link
                href="/"
                className={isPathActive(url, '/') ? navLinkActive : navLinkBase}
            >
                Home
            </Link>
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
            <Link
                href="/Event"
                className={isPathActive(url, '/Event') ? navLinkActive : navLinkBase}
            >
                Events
            </Link>
            <Link
                href="/News"
                className={isPathActive(url, '/News') ? navLinkActive : navLinkBase}
            >
                News
            </Link>
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
                <Link href="/Tournament/SL" className={linkClass} onClick={onClose}>
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
            if (e.key === 'Escape') {
                setOpenDropdown(null);
                setMobileMenuOpen(false);
                setIsAccountDropdownOpen(false);
            }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, []);

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
    };

    const mobileLinkClass = (href) =>
        `flex w-full items-center justify-between rounded-lg px-1 py-3 text-left text-base ${
            isPathActive(currentUrl, href) ? 'font-semibold text-white' : 'font-medium text-white'
        }`;

    return (
        <header className="w-full border-b border-white/5 bg-black text-white">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6">
                <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-8">
                    <button
                        type="button"
                        className="shrink-0 rounded-md p-1 text-white md:hidden"
                        aria-expanded={mobileMenuOpen}
                        aria-controls="mobile-main-navigation"
                        onClick={() => setMobileMenuOpen((o) => !o)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
                            href="/Login"
                            className="inline-flex items-center justify-center"
                            aria-label="Log in"
                        >
                            <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#FFC107] transition duration-300 hover:bg-[#F5B800] hover:shadow-[0_0_20px_rgba(255,193,7,.35)]">
                                <img
                                    src="/user-01.svg"
                                    alt=""
                                    className="relative h-6 w-6"
                                    aria-hidden="true"
                                />
                            </span>
                        </Link>
                    ) : (
                        <div className="relative" ref={accountRef}>
                            <button
                                type="button"
                                className="block overflow-hidden rounded-full ring-2 ring-transparent transition hover:ring-[#FFC107]/40"
                                onClick={() => setIsAccountDropdownOpen((o) => !o)}
                                aria-expanded={isAccountDropdownOpen}
                                aria-haspopup="true"
                            >
                                <img
                                    src={AVATAR_PLACEHOLDER}
                                    alt=""
                                    className="h-10 w-10 object-cover"
                                    width={40}
                                    height={40}
                                />
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

            {mobileMenuOpen && (
                <div
                    id="mobile-main-navigation"
                    className="border-t border-white/10 bg-black px-4 py-2 sm:px-6 md:hidden"
                >
                    <div className="flex flex-col">
                        <Link
                            href="/"
                            className={mobileLinkClass('/')}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Home
                        </Link>

                        <div>
                            <button
                                type="button"
                                className={`flex w-full items-center justify-between py-3 text-left text-base ${
                                    mobileSubmenu === 'about'
                                        ? 'font-semibold text-white'
                                        : 'font-medium text-white'
                                }`}
                                onClick={() =>
                                    setMobileSubmenu((s) => (s === 'about' ? null : 'about'))
                                }
                            >
                                About
                                <ChevronDown
                                    className={`h-4 w-4 transition-transform ${
                                        mobileSubmenu === 'about' ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>
                            {mobileSubmenu === 'about' && (
                                <div className="mb-2 space-y-1 border-l border-white/10 pl-3">
                                    {ABOUT_ITEMS.map(({ label, href }) => (
                                        <Link
                                            key={label}
                                            href={href}
                                            className={`block rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-[#1E1E1E] hover:text-white ${
                                                isPathActive(currentUrl, href)
                                                    ? 'border border-[#FFC107] text-white'
                                                    : ''
                                            }`}
                                            onClick={() => {
                                                setMobileMenuOpen(false);
                                                setMobileSubmenu(null);
                                            }}
                                        >
                                            {label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <button
                                type="button"
                                className={`flex w-full items-center justify-between py-3 text-left text-base ${
                                    mobileSubmenu === 'programs'
                                        ? 'font-semibold text-white'
                                        : 'font-medium text-white'
                                }`}
                                onClick={() =>
                                    setMobileSubmenu((s) =>
                                        s === 'programs' ? null : 'programs'
                                    )
                                }
                            >
                                Programs
                                <ChevronDown
                                    className={`h-4 w-4 transition-transform ${
                                        mobileSubmenu === 'programs' ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>
                            {mobileSubmenu === 'programs' && (
                                <div className="mb-2 space-y-1 border-l border-white/10 pl-3">
                                    {PROGRAMS_ITEMS.map(({ label, href }) => (
                                        <Link
                                            key={label}
                                            href={href}
                                            className={`block rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-[#1E1E1E] hover:text-white ${
                                                isPathActive(currentUrl, href)
                                                    ? 'border border-[#FFC107] text-white'
                                                    : ''
                                            }`}
                                            onClick={() => {
                                                setMobileMenuOpen(false);
                                                setMobileSubmenu(null);
                                            }}
                                        >
                                            {label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link
                            href="/Event"
                            className={mobileLinkClass('/Event')}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Events
                        </Link>
                        <Link
                            href="/News"
                            className={mobileLinkClass('/News')}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            News
                        </Link>
                    </div>
                </div>
            )}

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
