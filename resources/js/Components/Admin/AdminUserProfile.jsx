import { Link, router, usePage } from '@inertiajs/react';
import { LogOut, PencilLine, UserRound } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function AdminUserProfile({ name, role }) {
    const { auth } = usePage().props;
    const admin = auth?.user;
    const displayName = name ?? admin?.name ?? 'Admin';
    const displayRole = role ?? admin?.role ?? 'Admin';
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        if (!menuOpen) return undefined;

        const closeOnOutsidePointer = (event) => {
            if (!menuRef.current?.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        const closeOnEscape = (event) => {
            if (event.key === 'Escape') {
                setMenuOpen(false);
                menuRef.current?.querySelector('button')?.focus();
            }
        };

        document.addEventListener('pointerdown', closeOnOutsidePointer);
        document.addEventListener('keydown', closeOnEscape);

        return () => {
            document.removeEventListener('pointerdown', closeOnOutsidePointer);
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, [menuOpen]);

    const signOut = () => {
        setMenuOpen(false);
        router.post(route('admin.logout'));
    };

    return (
        <div className="flex items-center gap-3">
            <div className="min-w-0 px-1 py-1 text-right">
                <span className="block max-w-48 truncate text-sm font-bold leading-5 text-[#FBBF24] sm:text-base">
                    {displayName}
                </span>
                <span className="block text-[10px] font-medium leading-4 text-[#FBBF24] sm:text-xs">
                    {displayRole}
                </span>
            </div>

            <div ref={menuRef} className="relative">
                <button
                    type="button"
                    aria-label={`Open account menu for ${displayName}`}
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                    aria-controls="admin-account-menu"
                    onClick={() => setMenuOpen((open) => !open)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#FBBF24] bg-[#101010] transition-colors hover:bg-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBBF24] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]"
                >
                    <UserRound
                        aria-hidden="true"
                        className="h-5 w-5 text-sky-400"
                        strokeWidth={2.5}
                    />
                </button>

                {menuOpen && (
                    <div
                        id="admin-account-menu"
                        role="menu"
                        aria-label="Admin account"
                        className="absolute right-0 top-[calc(100%+0.75rem)] z-[80] w-56 rounded-lg border border-neutral-700 bg-[#151515] p-1.5 shadow-xl"
                    >
                        <Link
                            href={route('admin.profile')}
                            role="menuitem"
                            onClick={() => setMenuOpen(false)}
                            className="flex min-h-10 w-full items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-left text-sm text-gray-200 outline-none hover:bg-white/5 focus:bg-white/5"
                        >
                            <PencilLine aria-hidden="true" className="h-4 w-4 shrink-0 text-yellow-400" />
                            <span>Change Admin Profile</span>
                        </Link>
                        {auth?.guard === 'admin' && (
                            <button
                                type="button"
                                role="menuitem"
                                onClick={signOut}
                                className="flex min-h-10 w-full items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-left text-sm text-gray-200 outline-none hover:bg-white/5 focus:bg-white/5"
                            >
                                <LogOut aria-hidden="true" className="h-4 w-4 shrink-0 text-gray-400" />
                                <span>Sign out</span>
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
