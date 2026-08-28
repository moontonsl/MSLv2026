import { CheckCircle2, Copy, Hourglass, User } from 'lucide-react';

function StatusBadge({ status, solid = false }) {
    const isApproved = status === 'approved' || status === 'confirmed';
    const isAssembling = status === 'assembling';

    const label = isApproved
        ? 'Approved'
        : isAssembling
          ? 'ASSEMBLING'
          : 'Pending';

    if (solid) {
        return (
            <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    isApproved
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-yellow-500/15 text-yellow-500'
                }`}
            >
                {isApproved ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                    <Hourglass className="h-3.5 w-3.5" />
                )}
                {label}
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1 rounded-full border border-yellow-500/60 bg-yellow-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-yellow-500">
            <Hourglass className="h-3 w-3" />
            {label}
        </span>
    );
}

function PlayerCell({ player, showPendingBadge = false }) {
    return (
        <div className="min-w-[120px] flex-1 px-2 py-3 text-center sm:min-w-[140px]">
            <div className="relative mx-auto mb-2 h-10 w-10">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a1a1a] text-gray-400">
                    <User className="h-5 w-5" />
                </div>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#111111] bg-emerald-400" />
            </div>
            <p className="truncate text-sm font-semibold text-white">{player.name}</p>
            <p className="truncate text-xs text-gray-400">{player.ign}</p>
            <p className="truncate text-xs text-gray-500">{player.uid}</p>
            {showPendingBadge && player.status === 'pending' ? (
                <div className="mt-2 flex justify-center">
                    <StatusBadge status="pending" />
                </div>
            ) : null}
        </div>
    );
}

function PlayerMobileRow({ player, roleLabel, showPendingBadge = false }) {
    return (
        <div className="flex items-center gap-3 border-b border-neutral-800 px-4 py-3 last:border-b-0">
            <div className="relative h-10 w-10 shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a1a1a] text-gray-400">
                    <User className="h-5 w-5" />
                </div>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#111111] bg-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-yellow-500">{roleLabel}</p>
                <p className="truncate text-sm font-semibold text-white">{player.name}</p>
                <p className="truncate text-xs text-gray-400">
                    {player.ign} · {player.uid}
                </p>
            </div>
            {showPendingBadge && player.status === 'pending' ? (
                <StatusBadge status="pending" />
            ) : null}
        </div>
    );
}

/**
 * Captain / member roster card (Pending / Approved).
 *
 * @param {{
 *   team: object;
 *   onEdit?: () => void;
 *   onGenerateCode?: () => void;
 *   onCopyCode?: () => void;
 *   memberView?: boolean;
 * }} props
 */
export default function CaptainTeamCard({
    team,
    onEdit,
    onGenerateCode,
    onCopyCode,
    memberView = false,
}) {
    const roster = [team.captain, ...team.players];
    const isApproved = team.status === 'approved';
    const showCodeActions = !memberView;

    return (
        <article className="overflow-hidden rounded-xl border border-neutral-800 bg-[#111111]">
            <div className="flex flex-col gap-3 border-b border-neutral-800 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5">
                <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-bold text-white sm:text-xl">
                        TEAM NAME:{' '}
                        <span className="text-yellow-500">{team.name}</span>
                    </h2>
                    <p className="mt-1 text-sm uppercase text-gray-300">{team.school}</p>
                    {memberView ? (
                        <div className="mt-3 flex min-h-[36px] items-center justify-center gap-1.5 rounded-lg border border-yellow-500/50 bg-yellow-500/10 px-3 py-2 text-sm font-semibold text-yellow-500 sm:hidden">
                            <Hourglass className="h-3.5 w-3.5" />
                            {isApproved ? 'Approved' : 'Pending'}
                        </div>
                    ) : null}
                </div>
                <div className={memberView ? 'hidden sm:block' : undefined}>
                    <StatusBadge status={team.status} solid />
                </div>
            </div>

            {/* Mobile: stacked player rows */}
            <div className="md:hidden">
                {roster.map((player, index) => (
                    <PlayerMobileRow
                        key={player.id}
                        player={player}
                        roleLabel={index === 0 ? 'Captain' : `Player ${index + 1}`}
                        showPendingBadge={index > 0 && !isApproved}
                    />
                ))}
            </div>

            {/* Desktop: horizontal roster */}
            <div className="hidden flex-col gap-4 p-4 lg:flex-row lg:items-stretch lg:p-0 md:flex">
                <div className="min-w-0 flex-1 overflow-x-auto">
                    <div className="flex min-w-[720px] border-b border-neutral-800 bg-[#0a0a0a]">
                        {roster.map((player, index) => (
                            <div
                                key={player.id}
                                className="flex-1 px-2 py-2 text-center text-xs font-semibold text-yellow-500"
                            >
                                {index === 0 ? 'Captain' : `Player ${index + 1}`}
                            </div>
                        ))}
                    </div>
                    <div className="flex min-w-[720px] divide-x divide-neutral-800">
                        {roster.map((player, index) => (
                            <PlayerCell
                                key={player.id}
                                player={player}
                                showPendingBadge={index > 0 && !isApproved}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex shrink-0 flex-col gap-2 border-t border-neutral-800 pt-4 lg:w-40 lg:border-l lg:border-t-0 lg:p-4">
                    <button
                        type="button"
                        onClick={onEdit}
                        className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-yellow-500 px-4 text-sm font-bold text-black transition-colors hover:bg-yellow-400"
                    >
                        Edit
                    </button>
                    {showCodeActions ? (
                        isApproved && team.inviteCode ? (
                            <button
                                type="button"
                                onClick={onCopyCode}
                                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-yellow-500 px-3 text-sm font-semibold text-yellow-500 transition-colors hover:bg-yellow-500/10"
                            >
                                {team.inviteCode}
                                <Copy className="h-4 w-4" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={onGenerateCode}
                                className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-yellow-500 px-4 text-sm font-semibold text-yellow-500 transition-colors hover:bg-yellow-500/10"
                            >
                                Generate Code
                            </button>
                        )
                    ) : null}
                </div>
            </div>

            {/* Mobile actions */}
            <div
                className={`grid gap-2 border-t border-neutral-800 p-4 md:hidden ${
                    showCodeActions ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
                }`}
            >
                <button
                    type="button"
                    onClick={onEdit}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-yellow-500 px-4 text-sm font-bold text-black"
                >
                    Edit
                </button>
                {showCodeActions ? (
                    isApproved && team.inviteCode ? (
                        <button
                            type="button"
                            onClick={onCopyCode}
                            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-yellow-500 px-3 text-sm font-semibold text-yellow-500"
                        >
                            {team.inviteCode}
                            <Copy className="h-4 w-4" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={onGenerateCode}
                            className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-yellow-500 px-4 text-sm font-semibold text-yellow-500"
                        >
                            Generate Code
                        </button>
                    )
                ) : null}
            </div>
        </article>
    );
}
