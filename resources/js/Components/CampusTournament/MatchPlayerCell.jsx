import { User } from 'lucide-react';

/**
 * Compact player cell for Match Management table / mobile cards.
 *
 * @param {{
 *   player?: { name?: string; ign?: string; uid?: string } | null;
 *   compact?: boolean;
 * }} props
 */
export default function MatchPlayerCell({ player, compact = false }) {
    if (!player) {
        return <span className="text-sm text-gray-500">—</span>;
    }

    return (
        <div className={`flex min-w-0 items-center gap-2 ${compact ? '' : 'max-w-[160px]'}`}>
            <div className="relative shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-yellow-500/40 bg-[#1a1a1a] text-yellow-500">
                    <User className="h-4 w-4" />
                </div>
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-[#111111] bg-emerald-400" />
            </div>
            <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                    {compact && player.name?.length > 6
                        ? `${player.name.slice(0, 5)}…`
                        : (player.name ?? '—')}
                </p>
                <p className="truncate text-[11px] text-gray-400">{player.ign ?? ''}</p>
                {!compact ? (
                    <p className="truncate text-[10px] text-gray-500">{player.uid ?? ''}</p>
                ) : null}
            </div>
        </div>
    );
}
