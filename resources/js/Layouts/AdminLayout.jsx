import AdminGlobalSearch from '@/Components/Admin/AdminGlobalSearch';
import AdminPageSkeleton from '@/Components/Admin/AdminPageSkeleton';
import AdminSidebar from '@/Components/Admin/AdminSidebar';
import AdminUserProfile from '@/Components/Admin/AdminUserProfile';
import { router } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminLayout({
    children,
    activeNavId = 'account-creation',
    showGlobalSearch = false,
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const removeStartListener = router.on('start', () => setIsLoading(true));
        const removeFinishListener = router.on('finish', () => {
            setIsLoading(false);
            setIsSidebarOpen(false);
        });

        return () => {
            removeStartListener();
            removeFinishListener();
        };
    }, []);

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#0A0A0A] text-white">
            <AdminSidebar activeId={activeNavId} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="ml-0 flex min-h-screen min-w-0 flex-1 flex-col overflow-hidden lg:ml-64">
                <header className={`flex shrink-0 items-center border-b border-neutral-800 px-4 py-4 sm:px-6 lg:px-8 lg:py-5 ${showGlobalSearch ? 'gap-6' : 'justify-end'}`}>
                    <button
                        type="button"
                        aria-label="Open admin navigation"
                        aria-expanded={isSidebarOpen}
                        onClick={() => setIsSidebarOpen(true)}
                        className="mr-auto inline-flex min-h-10 min-w-10 items-center justify-center rounded-md text-gray-300 hover:bg-white/10 hover:text-white lg:hidden"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    {showGlobalSearch ? <AdminGlobalSearch /> : null}
                    <AdminUserProfile />
                </header>
                <main className="min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                    {isLoading ? <AdminPageSkeleton /> : children}
                </main>
            </div>
        </div>
    );
}
