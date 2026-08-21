import { formatDateRange } from '@/data/campusTournamentData';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

/**
 * @param {{
 *   tournament: {
 *     id: string;
 *     title: string;
 *     startDate: string;
 *     endDate: string;
 *     mode: string;
 *     school?: string;
 *   };
 * }} props
 */
export default function TournamentListItem({ tournament }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <article className="overflow-hidden rounded-xl border border-neutral-800 bg-[#111111]">
            <div className="flex items-center gap-3 p-4 sm:p-5">
                <div className="min-w-0 flex-1 text-center">
                    <h3 className="text-base font-bold uppercase text-yellow-500 sm:text-lg md:text-xl">
                        {tournament.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-300">
                        {formatDateRange(tournament.startDate, tournament.endDate, tournament.mode)}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setExpanded((prev) => !prev)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-yellow-500 text-black transition-colors hover:bg-yellow-400"
                    aria-expanded={expanded}
                    aria-label={expanded ? 'Collapse tournament details' : 'Expand tournament details'}
                >
                    {expanded ? (
                        <ChevronDown className="h-5 w-5" />
                    ) : (
                        <ChevronRight className="h-5 w-5" />
                    )}
                </button>
            </div>

            {expanded ? (
                <div className="border-t border-neutral-800 px-4 py-4 text-sm text-gray-300 sm:px-5">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-gray-500">School</p>
                            <p className="mt-1 text-white">{tournament.school ?? '—'}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wide text-gray-500">Mode</p>
                            <p className="mt-1 text-white">{tournament.mode}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wide text-gray-500">Schedule</p>
                            <p className="mt-1 text-white">
                                {formatDateRange(
                                    tournament.startDate,
                                    tournament.endDate,
                                    tournament.mode,
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            ) : null}
        </article>
    );
}
