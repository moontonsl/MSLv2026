import { Hourglass, User } from 'lucide-react';

function RoleIcon({ role }) {
    const letter =
        role === 'GOLD' ? '$' : role === 'EXP' ? 'E' : role === 'MID' ? '◆' : role === 'ROAM' ? '▲' : '⚔';

    return (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#1a1a1a] text-xs font-bold text-yellow-500">
            {letter}
        </div>
    );
}

/**
 * Compact team lobby row for Join Team flow.
 *
 * @param {{
 *   team: {
 *     id: string;
 *     name: string;
 *     status: string;
 *     slots: Array<{ role: string; occupied: boolean; player?: { name: string; detail: string } | null }>;
 *     joined: boolean;
 *   };
 *   onJoin?: (team: object) => void;
 *   onLeave?: (team: object) => void;
 * }} props
 */
export default function JoinTeamRow({ team, onJoin, onLeave }) {
    return (
        <article className="rounded-xl border border-neutral-800 bg-[#111111] p-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                <div className="w-full shrink-0 xl:w-40">
                    <h3 className="text-base font-bold text-white sm:text-lg">{team.name}</h3>
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-yellow-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-yellow-500">
                        <Hourglass className="h-3 w-3" />
                        Assembling
                    </span>
                </div>

                {/* Mobile: stacked slots */}
                <div className="space-y-2 md:hidden">
                    {team.slots.map((slot) => (
                        <div
                            key={`${team.id}-${slot.role}-m`}
                            className="flex items-center gap-3 rounded-lg border border-neutral-800 bg-[#0a0a0a] px-3 py-2.5"
                        >
                            {slot.occupied ? (
                                <>
                                    <div className="relative shrink-0">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1a1a1a] text-gray-400">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-[#111111] bg-emerald-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-yellow-500">
                                            {slot.player?.name}
                                        </p>
                                        <p className="truncate text-[11px] text-gray-300">
                                            {slot.role} | {slot.player?.detail}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <RoleIcon role={slot.role} />
                                    <div>
                                        <p className="text-sm font-semibold text-white">{slot.role}</p>
                                        <p className="text-xs text-gray-500">Vacant</p>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {/* Desktop: horizontal slots */}
                <div className="hidden min-w-0 flex-1 overflow-x-auto md:block">
                    <div className="flex min-w-[640px] divide-x divide-neutral-800">
                        {team.slots.map((slot) => (
                            <div
                                key={`${team.id}-${slot.role}`}
                                className="flex min-w-[120px] flex-1 items-center gap-2 px-3 py-1"
                            >
                                {slot.occupied ? (
                                    <>
                                        <div className="relative">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1a1a1a] text-gray-400">
                                                <User className="h-4 w-4" />
                                            </div>
                                            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-[#111111] bg-emerald-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-yellow-500">
                                                {slot.player?.name}
                                            </p>
                                            <p className="truncate text-[11px] text-gray-300">
                                                {slot.role} | {slot.player?.detail}
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <RoleIcon role={slot.role} />
                                        <div>
                                            <p className="text-sm font-semibold text-white">
                                                {slot.role}
                                            </p>
                                            <p className="text-xs text-gray-500">Vacant</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="shrink-0 xl:pl-2">
                    {team.joined ? (
                        <button
                            type="button"
                            onClick={() => onLeave?.(team)}
                            className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-red-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-red-700 xl:w-auto"
                        >
                            Leave
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => onJoin?.(team)}
                            className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-yellow-500 px-6 text-sm font-bold text-black transition-colors hover:bg-yellow-400 xl:w-auto"
                        >
                            Join Team
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
}
