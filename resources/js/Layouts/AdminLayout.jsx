import AdminSidebar from '@/Components/Admin/AdminSidebar';
import AdminUserProfile from '@/Components/Admin/AdminUserProfile';

export default function AdminLayout({ children, activeNavId = 'account-creation' }) {
    return (
        <div className="flex min-h-screen bg-[#0A0A0A] text-white">
            <AdminSidebar activeId={activeNavId} />
            <div className="ml-64 flex min-h-screen flex-1 flex-col overflow-hidden">
                <header className="flex shrink-0 items-center justify-end border-b border-neutral-800 px-8 py-5">
                    <AdminUserProfile />
                </header>
                <main className="flex-1 overflow-y-auto px-8 py-8">{children}</main>
            </div>
        </div>
    );
}
