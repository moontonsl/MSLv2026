import { Lock } from 'lucide-react';

/**
 * Roster lock deadline callout for Solo Matchmaking.
 *
 * @param {{ lockDate?: string; className?: string }} props
 */
export default function RosterLockCard({ lockDate = 'May 14, 2026', className = '' }) {
    return (
        <div
            className={`flex items-start gap-3 rounded-xl border border-neutral-700 bg-[#0a0a0a] px-4 py-3 ${className}`}
        >
            <Lock className="mt-0.5 h-5 w-5 shrink-0 text-yellow-500" />
            <div>
                <p className="text-sm font-bold text-white">Roster Lock: {lockDate}</p>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-gray-400">
                    Editing your roster will be disabled after this date.
                </p>
            </div>
        </div>
    );
}
