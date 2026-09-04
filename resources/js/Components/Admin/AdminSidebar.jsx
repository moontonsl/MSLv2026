import { Link } from "@inertiajs/react";
import {
    LayoutGrid,
    Megaphone,
    MessageSquare,
    UserCog,
    UserPlus,
    X,
} from "lucide-react";

const ACCENT = "#FBBF24";

const NAV_ITEMS = [
    {
        id: "account-creation",
        label: "Account Creation",
        href: "/admin/account-creation",
        icon: UserPlus,
    },
    {
        id: "home-page",
        label: "Home Page",
        href: "/admin/home-page",
        icon: LayoutGrid,
    },
    {
        id: "faq",
        label: "FAQ",
        href: "/admin/faq",
        icon: MessageSquare,
    },
    {
        id: "news",
        label: "News & Updates",
        href: "/admin/news-updates",
        icon: Megaphone,
    },
    {
        id: "account-management",
        label: "Account Management",
        href: "/admin/account-management",
        icon: UserCog,
    },
];

export default function AdminSidebar({
    activeId = "account-creation",
    isOpen = false,
    onClose = () => {},
}) {
    return (
        <aside
            className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 shrink-0 flex-col border-r border-neutral-800 bg-[#141414] transition-transform duration-200 ease-out ${
                isOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0`}
        >
            <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-6">
                <div className="flex items-center gap-3">
                    <img
                        src="/msl-logo.png"
                        alt="MSL Philippines"
                        className="h-10 w-10 object-contain"
                    />

                    <span className="text-sm font-bold leading-tight text-white">
                        MSL Philippines
                    </span>
                </div>

                <button
                    type="button"
                    aria-label="Close admin navigation"
                    onClick={onClose}
                    className="rounded-md p-2 text-gray-400 hover:bg-white/10 hover:text-white md:hidden"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            <nav className="flex flex-1 flex-col gap-1 px-3 py-6">
                {NAV_ITEMS.map(({ id, label, href, icon: Icon }) => {
                    const isActive = id === activeId;

                    return (
                        <Link
                            key={id}
                            href={href}
                            onClick={onClose}
                            className={`flex min-h-12 items-center gap-3 rounded-r-md border-l-4 px-4 py-3 text-sm font-medium transition-colors ${
                                isActive
                                    ? "border-[#FBBF24] bg-white/5 pl-3"
                                    : "border-transparent text-gray-400 hover:bg-white/5 hover:text-white"
                            }`}
                            style={isActive ? { color: ACCENT } : undefined}
                        >
                            <Icon
                                className="h-5 w-5 shrink-0"
                                style={isActive ? { color: ACCENT } : undefined}
                            />

                            {label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
