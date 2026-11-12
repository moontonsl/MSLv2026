import { NETWORK_AWARDS_BANNER } from '@/data/networkAwardsData';
import { router } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';

/**
 * Shared banner + optional Back for Network Awards pages (Figma).
 *
 * @param {{
 *   children: import('react').ReactNode;
 *   showBack?: boolean;
 *   backHref?: string;
 *   className?: string;
 * }} props
 */
export default function AwardsShell({
    children,
    showBack = false,
    backHref = '/Awards',
    className = '',
}) {
    const handleBack = () => {
        if (typeof window !== 'undefined' && window.history.length > 1) {
            window.history.back();
            return;
        }
        router.visit(backHref);
    };

    return (
        <div className={`min-h-screen bg-black text-white ${className}`}>
            <div className="mx-auto w-full max-w-6xl px-4 pb-14 pt-4 sm:px-6 sm:pb-16 sm:pt-6 lg:px-8">
                <div className="overflow-hidden rounded-lg">
                    <img
                        src={NETWORK_AWARDS_BANNER}
                        alt="MSL Network Awards"
                        className="h-auto w-full object-cover"
                    />
                </div>

                {showBack ? (
                    <button
                        type="button"
                        onClick={handleBack}
                        className="mt-6 inline-flex items-center gap-1 text-base font-semibold text-[#FBBF24] transition-colors hover:text-[#FCD34D]"
                    >
                        <ChevronLeft className="h-5 w-5" />
                        Back
                    </button>
                ) : null}

                {children}
            </div>
        </div>
    );
}
