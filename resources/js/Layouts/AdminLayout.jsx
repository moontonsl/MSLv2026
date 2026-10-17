import AdminPageSkeleton from '@/Components/Admin/AdminPageSkeleton';
import AdminSidebar from '@/Components/Admin/AdminSidebar';
import AdminUserProfile from '@/Components/Admin/AdminUserProfile';
import { router } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminLayout({
    children,
    activeNavId = 'account-creation',
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
                    <AdminUserProfile />
                </header>
                <main className="min-w-0 flex-1 overflow-y-auto px-4 py-6 font-sans sm:px-6 lg:px-8 lg:py-8 [&_.font-heading]:font-sans [&_.font-inter]:font-sans [&_.font-league-spartan]:font-sans [&_.font-manrope]:font-sans [&_button]:font-sans [&_h1]:font-sans [&_h1]:text-[#FFFBEB] [&_h2]:font-sans [&_h3]:font-sans [&_h4]:font-sans [&_h5]:font-sans [&_h6]:font-sans [&_input]:font-sans [&_select]:font-sans [&_textarea]:font-sans">
                    {isLoading ? <AdminPageSkeleton /> : children}
                </main>
            </div>
        </div>
    );
}
