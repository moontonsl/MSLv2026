import AdminPageSkeleton from '@/Components/Admin/AdminPageSkeleton';
import AdminSidebar from '@/Components/Admin/AdminSidebar';
import AdminUserProfile from '@/Components/Admin/AdminUserProfile';
import { router } from '@inertiajs/react';
import { Menu, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

const ADMIN_THEME_STORAGE_KEY = 'msl-admin-theme';

function getInitialAdminTheme() {
    if (typeof window === 'undefined') return 'dark';

    try {
        return window.localStorage.getItem(ADMIN_THEME_STORAGE_KEY) === 'light'
            ? 'light'
            : 'dark';
    } catch {
        return 'dark';
    }
}

export default function AdminLayout({
    children,
    activeNavId = 'account-creation',
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [theme, setTheme] = useState(getInitialAdminTheme);

    useEffect(() => {
        try {
            window.localStorage.setItem(ADMIN_THEME_STORAGE_KEY, theme);
        } catch {
            // Keep the selected theme for this session if storage is unavailable.
        }
    }, [theme]);

    useEffect(() => {
        document.body.classList.toggle('admin-theme-light', theme === 'light');

        return () => {
            document.body.classList.remove('admin-theme-light');
        };
    }, [theme]);

    useEffect(() => {
        const removeStartListener = router.on('start', () => setIsLoading(true));
        const removeFinishListener = router.on('finish', () => {
            setIsLoading(false);
            setIsSidebarOpen(false);
            setIsSidebarCollapsed(false);
        });

        return () => {
            removeStartListener();
            removeFinishListener();
        };
    }, []);

    const sidebarOffset = isSidebarCollapsed
        ? 'lg:ml-20'
        : 'lg:ml-72';

    return (
        <div
            className={`min-h-screen overflow-x-hidden ${
                theme === 'light'
                    ? 'admin-theme-light bg-gray-100 text-gray-900'
                    : 'admin-theme-dark bg-[#0A0A0A] text-white'
            }`}
        >
            <AdminSidebar
                activeId={activeNavId}
                isOpen={isSidebarOpen}
                isCollapsed={isSidebarCollapsed}
                onClose={() => setIsSidebarOpen(false)}
                onToggleCollapse={() =>
                    setIsSidebarCollapsed((collapsed) => !collapsed)
                }
            />
            <div
                className={`ml-0 flex min-h-screen min-w-0 flex-1 flex-col overflow-hidden transition-all duration-200 ${sidebarOffset}`}
            >
                <header className="relative z-30 flex h-20 shrink-0 items-center justify-end border-b border-neutral-800 bg-[#0A0A0A] px-4 sm:px-6 lg:px-8">
                    <button
                        type="button"
                        aria-label="Open admin navigation"
                        aria-expanded={isSidebarOpen}
                        onClick={() => setIsSidebarOpen(true)}
                        className="mr-auto inline-flex min-h-10 min-w-10 items-center justify-center rounded-md text-gray-300 hover:bg-white/10 hover:text-white lg:hidden"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                            aria-pressed={theme === 'light'}
                            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                            onClick={() =>
                                setTheme((currentTheme) =>
                                    currentTheme === 'dark' ? 'light' : 'dark'
                                )
                            }
                            className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBBF24] focus-visible:ring-offset-2 ${
                                theme === 'light'
                                    ? 'border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-offset-gray-100'
                                    : 'border-neutral-800 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white focus-visible:ring-offset-[#0A0A0A]'
                            }`}
                        >
                            {theme === 'dark' ? (
                                <Sun aria-hidden="true" className="h-5 w-5" />
                            ) : (
                                <Moon aria-hidden="true" className="h-5 w-5" />
                            )}
                        </button>
                        <AdminUserProfile />
                    </div>
                </header>
                <main className="min-w-0 flex-1 overflow-y-auto px-4 py-6 font-sans sm:px-6 lg:px-8 lg:py-8 [&_.font-heading]:font-sans [&_.font-inter]:font-sans [&_.font-league-spartan]:font-sans [&_.font-manrope]:font-sans [&_button]:font-sans [&_h1]:font-sans [&_h1]:text-[#FFFBEB] [&_h2]:font-sans [&_h3]:font-sans [&_h4]:font-sans [&_h5]:font-sans [&_h6]:font-sans [&_input]:font-sans [&_select]:font-sans [&_textarea]:font-sans">
                    {isLoading ? <AdminPageSkeleton /> : children}
                </main>
            </div>
        </div>
    );
}
