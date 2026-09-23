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
        <div className="flex min-h-screen bg-[#0A0A0A] text-white">
            <AdminSidebar activeId={activeNavId} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="ml-0 flex min-h-screen flex-1 flex-col overflow-hidden lg:ml-64">
                <header
                    className={`flex shrink-0 items-center border-b border-neutral-800 px-4 py-4 sm:px-6 lg:px-8 lg:py-5 ${
                        showGlobalSearch ? 'gap-6' : 'justify-end'
                    }`}
                >
                    <button
                        type="button"
                        aria-label="Open admin navigation"
                        className="mr-3 rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white lg:hidden"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    {showGlobalSearch ? <AdminGlobalSearch /> : null}
                    <AdminUserProfile />
                </header>
                <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                    {isLoading ? <AdminPageSkeleton /> : children}
                </main>
            </div>
        </div>
    );
}
