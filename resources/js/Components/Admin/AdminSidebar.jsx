import { Link } from "@inertiajs/react";

import {
    CalendarPlus,
    ClipboardCheck,
    LayoutGrid,
    Megaphone,
    MessageSquare,
    UserCog,
    UserPlus,
    UserRoundCog,
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
        id: "regional-admin",
        label: "Regional Admin",
        href: "/admin/regional-admin",
        icon: UserRoundCog,
    },
    {
        id: "event-management",
        label: "Event Management",
        href: "/admin/event-management",
        icon: CalendarPlus,
    },
    {
        id: "registration-management",
        label: "Registration Management",
        href: "/admin/registration-management",
        icon: ClipboardCheck,
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
            <div className="flex min-h-[112px] items-center justify-between px-5 py-7">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden">
                        <img
                            src="/MSL_LOGO.png"
                            alt=""
                            aria-hidden="true"
                            className="h-full w-full scale-[1.55] object-contain"
                        />
                    </div>

                    <span className="min-w-0 whitespace-nowrap font-heading text-[21px] font-bold leading-none tracking-[-0.035em] text-[#F5F5F5]">
                        MSL Philippines
                    </span>
                </div>

                <button
                    type="button"
                    aria-label="Close admin navigation"
                    onClick={onClose}
                    className="ml-2 inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-md text-gray-400 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-[#FBBF24] md:hidden"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto py-6 pl-3">
                {NAV_ITEMS.map(({ id, label, href, icon: Icon }) => {
                    const isActive = id === activeId;

                    return (
                        <Link
                            key={id}
                            href={href}
                            onClick={onClose}
                            className={`flex min-h-12 min-w-0 items-center gap-3 rounded-l-md border-r-4 px-4 py-3 text-[13px] font-medium tracking-[-0.01em] transition-colors ${
                                isActive
                                    ? "border-[#FBBF24] bg-white/5 pr-3 text-[#FBBF24]"
                                    : "border-transparent text-gray-400 hover:bg-white/5 hover:text-white"
                            }`}
                        >
                            <Icon
                                aria-hidden="true"
                                className="h-5 w-5 shrink-0"
                                style={
                                    isActive
                                        ? {
                                              color: ACCENT,
                                          }
                                        : undefined
                                }
                            />

                            <span className="min-w-0 flex-1 whitespace-nowrap">
                                {label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
