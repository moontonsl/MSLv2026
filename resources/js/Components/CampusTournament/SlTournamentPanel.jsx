import SlMatchManagement from '@/Components/CampusTournament/SlMatchManagement';
import SlRosterPanel from '@/Components/CampusTournament/SlRosterPanel';
import { formatDateRange } from '@/data/campusTournamentData';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const INNER_TABS = [
    { id: 'match', label: 'Match Management' },
    { id: 'roster', label: 'Roster & Solo Players' },
];

/**
 * Expandable SL tournament card with Match Management / Roster tabs.
 *
 * @param {{
 *   tournament: {
 *     id: string;
 *     title: string;
 *     startDate: string;
 *     endDate: string;
 *     mode?: string;
 *     rosterLockDate?: string;
 *     teams?: Array<object>;
 *     rosterTeams?: Array<object>;
 *   };
 *   defaultExpanded?: boolean;
 *   onPlacementChange: (tournamentId: string, teamId: string, placementId: string) => void;
 *   onSubmitResults: (tournament: object) => void;
 * }} props
 */
export default function SlTournamentPanel({
    tournament,
    defaultExpanded = false,
    onPlacementChange,
    onSubmitResults,
}) {
    const [expanded, setExpanded] = useState(defaultExpanded);
    const [innerTab, setInnerTab] = useState('match');
    const [page, setPage] = useState(1);

    return (
        <article className="overflow-hidden rounded-xl border border-neutral-800 bg-[#111111]">
            <div className="flex items-start gap-3 p-4 sm:items-center sm:p-5">
                <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold uppercase text-yellow-500 sm:text-lg md:text-xl">
                        {tournament.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-300">
                        {formatDateRange(
                            tournament.startDate,
                            tournament.endDate,
                            tournament.mode,
                        )}
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
                <div className="border-t border-neutral-800 px-4 pb-4 sm:px-5 sm:pb-5">
                    <div className="mb-4 flex gap-6 border-b border-neutral-800">
                        {INNER_TABS.map((tab) => {
                            const isActive = innerTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setInnerTab(tab.id)}
                                    className={`relative pb-3 pt-4 text-sm font-semibold transition-colors ${
                                        isActive
                                            ? 'text-yellow-500'
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    {tab.label}
                                    {isActive ? (
                                        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-yellow-500" />
                                    ) : null}
                                </button>
                            );
                        })}
                    </div>

                    {innerTab === 'match' ? (
                        <SlMatchManagement
                            teams={tournament.teams ?? []}
                            page={page}
                            totalPages={10}
                            onPageChange={setPage}
                            onPlacementChange={(teamId, placementId) =>
                                onPlacementChange(tournament.id, teamId, placementId)
                            }
                            onSubmitResults={() => onSubmitResults(tournament)}
                        />
                    ) : (
                        <SlRosterPanel
                            rosterLockDate={tournament.rosterLockDate}
                            teams={tournament.rosterTeams ?? []}
                        />
                    )}
                </div>
            ) : null}
        </article>
    );
}
