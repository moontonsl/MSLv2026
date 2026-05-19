import { Link } from '@inertiajs/react';
import { LayoutGrid, Megaphone, MessageSquare, UserPlus } from 'lucide-react';

const ACCENT = '#FBBF24';

const NAV_ITEMS = [
    { id: 'account-creation', label: 'Account Creation', href: '/admin/account-creation', icon: UserPlus },
    { id: 'home', label: 'Home Page', href: '/', icon: LayoutGrid },
    { id: 'faq', label: 'FAQ', href: '#', icon: MessageSquare },
    { id: 'news', label: 'News & Updates', href: '/news', icon: Megaphone },
];

export default function AdminSidebar({ activeId = 'account-creation' }) {
    return (
        <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 shrink-0 flex-col border-r border-neutral-800 bg-[#141414]">
            <div className="flex items-center gap-3 border-b border-neutral-800 px-6 py-6">
                <img src="/msl-logo.png" alt="" className="h-10 w-10 object-contain" />
                <span className="text-sm font-bold leading-tight text-white">MSL Philippines</span>
            </div>

            <nav className="flex flex-1 flex-col gap-1 px-3 py-6">
                {NAV_ITEMS.map(({ id, label, href, icon: Icon }) => {
                    const isActive = id === activeId;
                    return (
                        <Link
                            key={id}
                            href={href}
                            className={`flex items-center gap-3 rounded-r-md px-4 py-3 text-sm font-medium transition-colors ${
                                isActive
                                    ? 'border-l-4 border-[#FBBF24] bg-white/5 pl-3'
                                    : 'border-l-4 border-transparent text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                            style={isActive ? { color: ACCENT } : undefined}
                        >
                            <Icon className={`h-5 w-5 shrink-0 ${isActive ? '' : 'text-gray-400'}`} style={isActive ? { color: ACCENT } : undefined} />
                            {label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
