import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { Menu, X, ChevronDown } from 'lucide-react';
import AccountModificationModal from './AccountModificationModal';

const ABOUT_ITEMS = [
    { label: 'Campus', href: '/about/campus' },
    { label: 'Contents & Social Media', href: '/about/contents-social-media' },
    { label: 'Partnerships', href: '/about/partnerships' },
    { label: 'General Affairs', href: '/about/general-affairs' },
];

const PROGRAMS_ITEMS = [
    { label: 'The MSL Network', href: '/programs/msl-network' },
    { label: 'MSL Collegiate Cup', href: '/programs/collegiate-cup' },
    { label: 'Campus Tournaments', href: '/programs/campus-tournaments' },
    { label: 'Buffs & Support', href: '/programs/buffs-support' },
    { label: 'Referral Program', href: '/programs/referral' },
];

const AVATAR_PLACEHOLDER =
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop';

const menuPanelClass =
    'absolute left-0 top-full z-[60] mt-6 w-56 rounded-xl border border-white/5 bg-[#111111] p-2 shadow-2xl';

const menuItemClass =
    'block w-full rounded-lg px-4 py-2.5 text-left text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white';

const navLinkClass =
    'text-sm font-medium text-white transition-colors hover:text-[#FFC107]';

function NavDropdown({ id, label, items, isOpen, onToggle, onNavigate }) {
    return (
        <div className="relative">
            <button
                type="button"
                className={`flex items-center gap-1 ${navLinkClass} ${isOpen ? 'text-[#FFC107]' : ''}`}
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
                    {items.map(({ label: itemLabel, href }) => (
                        <Link
                            key={itemLabel}
                            href={href}
                            className={menuItemClass}
                            role="menuitem"
                            onClick={onNavigate}
                        >
                            {itemLabel}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

/**
 * Desktop-only centered nav (absolute centering within the relative inner bar).
 */
function DesktopNavigation({
    navRef,
    openDropdown,
    toggleNavDropdown,
    closeNavDropdowns,
}) {
    return (
        <nav
            ref={navRef}
            id="main-navigation"
            className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
            aria-label="Main"
        >
            <Link href="/" className={navLinkClass}>
                Home
            </Link>
            <NavDropdown
                id="about"
                label="About"
                items={ABOUT_ITEMS}
                isOpen={openDropdown === 'about'}
                onToggle={toggleNavDropdown}
                onNavigate={closeNavDropdowns}
            />
            <NavDropdown
                id="programs"
                label="Programs"
                items={PROGRAMS_ITEMS}
                isOpen={openDropdown === 'programs'}
                onToggle={toggleNavDropdown}
                onNavigate={closeNavDropdowns}
            />
            <Link href="/careers" className={navLinkClass}>
                Careers
            </Link>
            <Link href="/news" className={navLinkClass}>
                News
            </Link>
        </nav>
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

    const { auth } = usePage().props;
    const user = auth?.user;
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
        router.post(
            '/logout',
            {},
            {
                replace: true,
            }
        );
    };

    const toggleNavDropdown = (id) => {
        setOpenDropdown((prev) => (prev === id ? null : id));
    };

    const closeNavDropdowns = () => {
        setOpenDropdown(null);
        setMobileMenuOpen(false);
    };

    return (
        <header className="w-full border-b border-white/5 bg-[#0a0a0a] text-white">
            <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
                {/* Left: logo + wordmark */}
                <div className="flex shrink-0 items-center gap-3">
                    <button
                        type="button"
                        className="rounded-md p-1 text-white md:hidden"
                        aria-expanded={mobileMenuOpen}
                        aria-controls="mobile-main-navigation"
                        onClick={() => setMobileMenuOpen((o) => !o)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <Link href="/" className="flex h-10 max-w-[200px] items-center gap-2 sm:max-w-none">
                        <img
                            src="/msl-logo.png"
                            alt="MSL Philippines"
                            className="h-full w-auto shrink-0 object-contain"
                        />
                    </Link>
                </div>

                <DesktopNavigation
                    navRef={navRef}
                    openDropdown={openDropdown}
                    toggleNavDropdown={toggleNavDropdown}
                    closeNavDropdowns={closeNavDropdowns}
                />

                {/* Right: auth */}
                <div className="relative z-[61] flex shrink-0 items-center justify-end">
                    {!loggedIn ? (
                        <Link
                            href="/login"
                            className="rounded-full bg-[#FFC107] px-6 py-2 text-sm font-bold text-black transition-colors hover:bg-yellow-400"
                        >
                            Log In
                        </Link>
                    ) : (
                        <div className="relative" ref={accountRef}>
                            <button
                                type="button"
                                className="block overflow-hidden rounded-full ring-2 ring-transparent transition hover:ring-white/20"
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
                                <div className="absolute right-0 top-full z-[60] mt-2 min-w-[180px] overflow-hidden rounded-xl border border-white/5 bg-[#111111] py-1 shadow-2xl">
                                    <Link
                                        href="/studentportal"
                                        className="block w-full px-4 py-2.5 text-left text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                                        onClick={() => setIsAccountDropdownOpen(false)}
                                    >
                                        Profile
                                    </Link>
                                    {(user.role === 'SL' ||
                                        user.role === 'Super Admin' ||
                                        user.role === 'Regional Admin') && (
                                        <Link
                                            href="/sl-admin"
                                            className="block w-full px-4 py-2.5 text-left text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                                            onClick={() => setIsAccountDropdownOpen(false)}
                                        >
                                            SL Admin
                                        </Link>
                                    )}
                                    {(user.role === 'SL' ||
                                        user.role === 'Regional Admin' ||
                                        user.role === 'Super Admin') && (
                                        <a
                                            href="/campus-tournament"
                                            className="block w-full px-4 py-2.5 text-left text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                                            onClick={() => setIsAccountDropdownOpen(false)}
                                        >
                                            Campus Tournament
                                        </a>
                                    )}
                                    {user.role === 'SL' && (
                                        <Link
                                            href="/SLAdminApproval"
                                            className="block w-full px-4 py-2.5 text-left text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                                            onClick={() => setIsAccountDropdownOpen(false)}
                                        >
                                            Modification
                                        </Link>
                                    )}
                                    {(user.role === 'Regional Admin' || user.role === 'Super Admin') && (
                                        <Link
                                            href="/RegionalAdminApproval"
                                            className="block w-full px-4 py-2.5 text-left text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                                            onClick={() => setIsAccountDropdownOpen(false)}
                                        >
                                            Modification
                                        </Link>
                                    )}
                                    {user.role === 'Super Admin' && (
                                        <Link
                                            href="/admin/user-regions"
                                            className="block w-full px-4 py-2.5 text-left text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                                            onClick={() => setIsAccountDropdownOpen(false)}
                                        >
                                            User Regions
                                        </Link>
                                    )}
                                    {(user.role === 'Regional Admin' || user.role === 'Super Admin') && (
                                        <Link
                                            href="/community/create"
                                            className="block w-full px-4 py-2.5 text-left text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                                            onClick={() => setIsAccountDropdownOpen(false)}
                                        >
                                            Communities
                                        </Link>
                                    )}
                                    <button
                                        type="button"
                                        className="block w-full px-4 py-2.5 text-left text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                                        onClick={() => {
                                            setShowModificationModal(true);
                                            setIsAccountDropdownOpen(false);
                                        }}
                                    >
                                        Modify Account
                                    </button>
                                    <button
                                        type="button"
                                        className="block w-full px-4 py-2.5 text-left text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
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

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div
                    id="mobile-main-navigation"
                    className="border-t border-white/5 bg-[#0a0a0a] px-4 py-4 sm:px-6 md:hidden"
                >
                    <div className="flex flex-col gap-1">
                        <Link
                            href="/"
                            className={`${navLinkClass} py-2`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <div>
                            <button
                                type="button"
                                className={`flex w-full items-center justify-between py-2 text-left ${navLinkClass} ${
                                    mobileSubmenu === 'about' ? 'text-[#FFC107]' : ''
                                }`}
                                onClick={() =>
                                    setMobileSubmenu((s) => (s === 'about' ? null : 'about'))
                                }
                            >
                                About
                                <ChevronDown
                                    className={`h-4 w-4 transition-transform ${
                                        mobileSubmenu === 'about' ? 'rotate-180 text-[#FFC107]' : ''
                                    }`}
                                />
                            </button>
                            {mobileSubmenu === 'about' && (
                                <div className="ml-2 border-l border-white/10 pl-3">
                                    {ABOUT_ITEMS.map(({ label, href }) => (
                                        <Link
                                            key={label}
                                            href={href}
                                            className="block py-2 text-sm text-gray-300 hover:text-white"
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
                                className={`flex w-full items-center justify-between py-2 text-left ${navLinkClass} ${
                                    mobileSubmenu === 'programs' ? 'text-[#FFC107]' : ''
                                }`}
                                onClick={() =>
                                    setMobileSubmenu((s) => (s === 'programs' ? null : 'programs'))
                                }
                            >
                                Programs
                                <ChevronDown
                                    className={`h-4 w-4 transition-transform ${
                                        mobileSubmenu === 'programs'
                                            ? 'rotate-180 text-[#FFC107]'
                                            : ''
                                    }`}
                                />
                            </button>
                            {mobileSubmenu === 'programs' && (
                                <div className="ml-2 border-l border-white/10 pl-3">
                                    {PROGRAMS_ITEMS.map(({ label, href }) => (
                                        <Link
                                            key={label}
                                            href={href}
                                            className="block py-2 text-sm text-gray-300 hover:text-white"
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
                            href="/careers"
                            className={`${navLinkClass} py-2`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Careers
                        </Link>
                        <Link
                            href="/news"
                            className={`${navLinkClass} py-2`}
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
