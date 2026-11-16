import { Link } from "@inertiajs/react";
import { Bell, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function HomeAnnouncement({ announcements = [], data = null }) {
    const items = announcements.length > 0
        ? announcements
        : (data ? [data] : []);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (items.length <= 1 || isPaused) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % items.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [items.length, isPaused]);

    if (items.length === 0) return null;

    const current = items[currentIndex] || items[0];

    return (
        <aside
            aria-label="Announcement"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
            className="group relative flex min-h-[48px] flex-wrap items-center justify-center gap-x-2 gap-y-1 border-b border-white/10 bg-[#27272A] px-5 py-2.5 text-center font-sans text-[12px] font-semibold leading-[18px] text-white transition-colors hover:bg-[#2d2d31] sm:text-[15px] sm:leading-[24px]"
        >
            <Bell
                size={18}
                aria-hidden="true"
                className="shrink-0 text-[#F2C21A]"
            />

            <strong className="font-bold text-[#F2C21A]">
                {current.title}
            </strong>

            <span className="line-clamp-1 max-w-[90vw] sm:max-w-xl md:max-w-2xl">
                {current.description}
            </span>

            {current.href && (
                <Link
                    href={current.href}
                    className="inline-flex items-center gap-0.5 text-[#F2C21A] hover:text-[#F8D54B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C21A] sm:ml-2 font-bold cursor-pointer"
                >
                    {current.linkLabel || "See More"}
                    <ChevronRight size={16} aria-hidden="true" />
                </Link>
            )}

            {items.length > 1 && (
                <div className="ml-3 hidden items-center gap-1 sm:inline-flex">
                    <button
                        type="button"
                        onClick={() => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)}
                        aria-label="Previous announcement"
                        className="rounded p-0.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                        <ChevronLeft size={14} />
                    </button>
                    <span className="text-[11px] font-normal text-gray-400">
                        {currentIndex + 1}/{items.length}
                    </span>
                    <button
                        type="button"
                        onClick={() => setCurrentIndex((prev) => (prev + 1) % items.length)}
                        aria-label="Next announcement"
                        className="rounded p-0.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                        <ChevronRight size={14} />
                    </button>
                </div>
            )}
        </aside>
    );
}
