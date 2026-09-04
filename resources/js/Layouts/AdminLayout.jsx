import { useState } from "react";
import { Menu } from "lucide-react";

import AdminGlobalSearch from "@/Components/Admin/AdminGlobalSearch";
import AdminSidebar from "@/Components/Admin/AdminSidebar";
import AdminUserProfile from "@/Components/Admin/AdminUserProfile";

export default function AdminLayout({
    children,
    activeNavId = "account-creation",
    showGlobalSearch = false,
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#0A0A0A] text-white">
            {isSidebarOpen && (
                <button
                    type="button"
                    aria-label="Close admin navigation"
                    onClick={closeSidebar}
                    className="fixed inset-0 z-40 bg-black/70 md:hidden"
                />
            )}

            <AdminSidebar
                activeId={activeNavId}
                isOpen={isSidebarOpen}
                onClose={closeSidebar}
            />

            <div className="ml-0 flex min-h-screen min-w-0 flex-1 flex-col overflow-hidden md:ml-64">
                <header
                    className={`flex shrink-0 items-center border-b border-neutral-800 px-4 py-4 md:px-8 md:py-5 ${
                        showGlobalSearch ? "gap-6" : "justify-end"
                    }`}
                >
                    <button
                        type="button"
                        aria-label="Open admin navigation"
                        aria-expanded={isSidebarOpen}
                        onClick={() => setIsSidebarOpen(true)}
                        className="mr-auto inline-flex min-h-10 min-w-10 items-center justify-center rounded-md text-gray-300 hover:bg-white/10 hover:text-white md:hidden"
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    {showGlobalSearch && (
                        <div className="hidden min-w-0 flex-1 md:block">
                            <AdminGlobalSearch />
                        </div>
                    )}

                    <div className="hidden md:block">
                        <AdminUserProfile />
                    </div>
                </header>

                <main className="min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
