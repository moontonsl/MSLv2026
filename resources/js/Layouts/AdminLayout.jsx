import AdminPageSkeleton from '@/Components/Admin/AdminPageSkeleton';
import AdminSidebar from '@/Components/Admin/AdminSidebar';
import AdminUserProfile from '@/Components/Admin/AdminUserProfile';
import { router } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminLayout({
    children,
    activeNavId = 'dashboard',
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialMount, setIsInitialMount] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        // Subtle initial mount skeleton reveal
        const mountTimer = setTimeout(() => {
            setIsInitialMount(false);
        }, 300);

        let loadingTimer = null;
        let startTime = 0;

        const removeStartListener = router.on('start', (event) => {
            // Only trigger full skeleton for GET navigations (page visits, tab switches)
            const method = event?.detail?.visit?.method?.toLowerCase?.() ?? 'get';
            if (method === 'get') {
                startTime = Date.now();
                setIsLoading(true);
            }
        });

        const removeFinishListener = router.on('finish', () => {
            const elapsedTime = Date.now() - startTime;
            const minDisplayTime = 300;
            const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

            loadingTimer = setTimeout(() => {
                setIsLoading(false);
                setIsSidebarOpen(false);
            }, remainingTime);
        });

        return () => {
            clearTimeout(mountTimer);
            if (loadingTimer) clearTimeout(loadingTimer);
            removeStartListener();
            removeFinishListener();
        };
    }, []);

    const showSkeleton = isLoading || isInitialMount;

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden bg-[#070709] text-white selection:bg-brand-500 selection:text-black">
            {/* Ambient Lighting & Esports Glow Effects */}
            <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-amber-500/15 via-brand-500/5 to-transparent blur-[120px] pointer-events-none rounded-full z-0" />
            <div className="fixed bottom-[-15%] right-[-10%] w-[500px] h-[500px] bg-amber-600/10 blur-[140px] pointer-events-none rounded-full z-0" />
            <div className="fixed top-[-10%] left-[-10%] w-[450px] h-[450px] bg-blue-600/5 blur-[140px] pointer-events-none rounded-full z-0" />

            {/* Subtle Grid Backdrop */}
            <div 
                className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
                style={{
                    backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                }}
            />

            <AdminSidebar activeId={activeNavId} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="relative z-10 ml-0 flex min-h-screen min-w-0 flex-1 flex-col overflow-hidden lg:ml-64">
                <header className="relative z-30 flex shrink-0 items-center justify-between border-b border-white/10 bg-[#070709]/80 backdrop-blur-xl px-4 py-4 sm:px-6 lg:px-8 lg:py-5">
                    <button
                        type="button"
                        aria-label="Open admin navigation"
                        aria-expanded={isSidebarOpen}
                        onClick={() => setIsSidebarOpen(true)}
                        className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white lg:hidden transition-colors"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    <div className="ml-auto flex items-center">
                        <AdminUserProfile />
                    </div>
                </header>
                <main className="min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                    {showSkeleton ? (
                        <AdminPageSkeleton type={activeNavId} />
                    ) : (
                        <div className="animate-fadeIn">
                            {children}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
