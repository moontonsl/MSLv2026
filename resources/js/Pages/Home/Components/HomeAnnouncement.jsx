import { Link } from "@inertiajs/react";
import { Bell, ChevronRight } from "lucide-react";

export default function HomeAnnouncement({ data }) {
    return (
        <aside
            aria-label="Announcement"
            className="flex min-h-[48px] flex-wrap items-center justify-center gap-x-2 gap-y-1 border-b border-white/10 bg-[#27272A] px-5 py-2.5 text-center font-sans text-[12px] font-semibold leading-[18px] text-white sm:text-[16px] sm:leading-[26px]"
        >
            <Bell
                size={18}
                aria-hidden="true"
                className="shrink-0 text-[#F2C21A]"
            />

            <strong className="font-bold text-[#F2C21A]">{data.title}</strong>

            <span>{data.description}</span>

            <Link
                href={data.href}
                className="inline-flex items-center gap-0.5 text-[#F2C21A] hover:text-[#F8D54B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C21A] sm:ml-2"
            >
                {data.linkLabel}
                <ChevronRight size={16} aria-hidden="true" />
            </Link>
        </aside>
    );
}
