import SoloRoleIcon from '@/Components/CampusTournament/SoloRoleIcon';
import { Hourglass, User } from 'lucide-react';

function OccupiedSlot({ slot }) {
    const player = slot.player;

    return (
        <div className="flex min-w-[140px] flex-1 items-center gap-2 px-2 py-1">
            <div className="relative shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a1a1a] text-gray-400">
                    <User className="h-5 w-5" />
                </div>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#111111] bg-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{player?.name ?? '—'}</p>
                <p className="truncate text-[11px] text-gray-300">
                    <span className="text-white">{player?.ign ?? '—'}</span>
                    <span className="text-gray-500"> | </span>
                    <span className="text-yellow-500">{slot.role}</span>
                </p>
                <p className="truncate text-[11px] text-gray-500">{player?.uid ?? ''}</p>
            </div>
        </div>
    );
}

function VacantSlot({ role }) {
    return (
        <div className="flex min-w-[120px] flex-1 items-center gap-2 px-2 py-1">
            <div className="relative shrink-0">
                <SoloRoleIcon role={role} className="!h-10 !w-10 !rounded-full !text-sm" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#111111] bg-emerald-400" />
            </div>
            <div className="min-w-0">
                <p className="text-sm font-bold text-yellow-500">{role}</p>
                <p className="text-xs text-gray-500">Vacant</p>
            </div>
        </div>
    );
}

/**
 * Solo matchmaking team row (joinable / joined).
 *
 * @param {{
 *   team: {
 *     id: string;
 *     name: string;
 *     status: string;
 *     slots: Array<{
 *       role: string;
 *       occupied: boolean;
 *       player?: { name: string; ign: string; uid: string } | null;
 *     }>;
 *     joined: boolean;
 *     lockedRole?: string;
 *   };
 *   onLeave?: (team: object) => void;
 *   onJoin?: (team: object) => void;
 * }} props
 */
export default function SoloTeamRow({ team, onLeave, onJoin }) {
    return (
        <article className="rounded-xl border border-neutral-800 bg-[#0a0a0a] p-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                <div className="flex w-full items-start justify-between gap-3 xl:w-40 xl:shrink-0 xl:flex-col xl:items-start">
                    <h3 className="text-base font-bold text-white sm:text-lg">{team.name}</h3>
                    <span className="inline-flex items-center gap-1 rounded-full border border-yellow-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-yellow-500">
                        <Hourglass className="h-3 w-3" />
                        Assembling
                    </span>
                </div>

                {/* Mobile slots */}
                <div className="divide-y divide-neutral-800 overflow-hidden rounded-lg border border-neutral-800 md:hidden">
                    {team.slots.map((slot) => (
                        <div key={`${team.id}-${slot.role}-m`} className="bg-[#111111] px-2 py-2.5">
                            {slot.occupied ? (
                                <OccupiedSlot slot={slot} />
                            ) : (
                                <VacantSlot role={slot.role} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Desktop slots */}
                <div className="hidden min-w-0 flex-1 overflow-x-auto md:block">
                    <div className="flex min-w-[720px] divide-x divide-neutral-800">
                        {team.slots.map((slot) => (
                            <div key={`${team.id}-${slot.role}`} className="flex-1 py-1">
                                {slot.occupied ? (
                                    <OccupiedSlot slot={slot} />
                                ) : (
                                    <VacantSlot role={slot.role} />
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
