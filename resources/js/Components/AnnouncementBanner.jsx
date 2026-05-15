import { Link } from '@inertiajs/react';
import { Bell, ChevronRight } from 'lucide-react';

export default function AnnouncementBanner() {
    return (
        <div
            className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 border-b border-white/5 bg-[#151515] px-4 py-2.5"
            role="region"
            aria-label="Announcement"
        >
            <style>{`
                @keyframes ring {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(15deg); }
                    50% { transform: rotate(-10deg); }
                    75% { transform: rotate(5deg); }
                }
                .animate-ring {
                    animation: ring 2s ease-in-out infinite;
                    transform-origin: top center;
                }
            `}</style>
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-center text-xs sm:gap-2 sm:text-sm">
                <Bell
                    className="animate-ring h-4 w-4 shrink-0 text-[#FFC107]"
                    strokeWidth={2}
                    aria-hidden
                />
                <span className="font-bold text-[#FFC107]">The NU Era:</span>
                <span className="text-gray-200">
                    National University Bulldogs Reign Supreme
                </span>
                <Link
                    href="/news"
                    className="inline-flex cursor-pointer items-center gap-0.5 font-semibold text-[#FFC107] hover:underline"
                >
                    See More
                    <ChevronRight className="h-3 w-3 shrink-0" strokeWidth={2.5} />
                </Link>
            </div>
        </div>
    );
}
