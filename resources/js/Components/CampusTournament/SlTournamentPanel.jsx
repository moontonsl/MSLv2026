import SlMatchManagement from '@/Components/CampusTournament/SlMatchManagement';
import SlRosterPanel from '@/Components/CampusTournament/SlRosterPanel';
import { formatDateRange } from '@/data/campusTournamentData';
import { Link } from '@inertiajs/react';
import { Check, ChevronDown, ChevronRight, ExternalLink, FileSpreadsheet, Pencil } from 'lucide-react';
import { useState } from 'react';

const INNER_TABS = [
    { id: "match", label: "Match Management" },
    { id: "roster", label: "Roster & Solo Players" },
];

/**
 * Expandable SL tournament card with Match Management / Roster tabs.
 * Figma: Edit + Export sit on the right of the inner tabs.
 *
 * @param {{
 *   tournament: {
 *     id: string;
 *     title: string;
 *     startDate: string;
 *     endDate: string;
 *     mode?: string;
 *     rosterLockDate?: string;
 *     resultsSubmitted?: boolean;
 *     resultsSubmittedOn?: string;
 *     canSubmitResults?: boolean;
 *     canCorrectResults?: boolean;
 *     canViewReport?: boolean;
 *     teams?: Array<object>;
 *     rosterTeams?: Array<object>;
 *   };
 *   defaultExpanded?: boolean;
 *   editingResults?: boolean;
 *   onPlacementChange?: (tournamentId: number|string, teamId: number|string, placement: string) => void;
 *   onSubmitResults?: (tournament: object) => void;
 *   onEditResults?: (tournament: object) => void;
 *   onCancelEdit?: (tournament: object) => void;
 *   onExport?: (tournament: object) => void;
 * }} props
 */
export default function SlTournamentPanel({
    tournament,
    defaultExpanded = false,
    editingResults = false,
    onPlacementChange,
    onSubmitResults,
    onEditResults,
    onCancelEdit,
    onExport,
}) {
    const [expanded, setExpanded] = useState(defaultExpanded);
    const [innerTab, setInnerTab] = useState("match");
    const [page, setPage] = useState(1);

    const resultsSubmitted = Boolean(tournament.resultsSubmitted);
    const canExport = resultsSubmitted && Boolean(tournament.canViewReport);
    const canCorrect = Boolean(tournament.canCorrectResults);
    // Figma: Edit + Export on the Match Management tab row
    const showTabActions =
        resultsSubmitted &&
        innerTab === "match" &&
        !editingResults &&
        (canCorrect || canExport);

    return (
        <article className="overflow-hidden rounded-xl border border-neutral-800 bg-[#111111]">
            <div className="flex items-start gap-3 p-4 sm:items-center sm:p-5">
                <div className="min-w-0 flex-1">
                    {resultsSubmitted ? (
                        <div className="mb-3 inline-flex flex-col gap-0.5 sm:mb-2">
                            <span className="inline-flex w-fit items-center gap-1.5 rounded-md bg-emerald-500/15 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-emerald-400">
                                <Check className="h-3.5 w-3.5" />
                                Results Submitted
                            </span>
                            {tournament.resultsSubmittedOn ? (
                                <span className="text-[11px] text-gray-400">
                                    Submitted on {tournament.resultsSubmittedOn}
                                </span>
                            ) : null}
                        </div>
                    ) : null}
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
                <div className="flex shrink-0 items-center gap-2">
                    {tournament.status === "ongoing" ? (
                        <Link
                            href={`/campus-tournaments/${tournament.id}/ongoing`}
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-yellow-500 px-3 text-sm font-semibold text-yellow-500 transition-colors hover:bg-yellow-500/10"
                        >
                            View
                            <ExternalLink className="h-4 w-4" />
                        </Link>
                    ) : null}
                    <button
                        type="button"
                        onClick={() => setExpanded((prev) => !prev)}
                        className="flex h-10 w-10 items-center justify-center rounded-md bg-yellow-500 text-black transition-colors hover:bg-yellow-400"
                        aria-expanded={expanded}
                        aria-label={
                            expanded
                                ? "Collapse tournament details"
                                : "Expand tournament details"
                        }
                    >
                        {expanded ? (
                            <ChevronDown className="h-5 w-5" />
                        ) : (
                            <ChevronRight className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>

            {expanded ? (
                <div className="border-t border-neutral-800 px-4 pb-4 sm:px-5 sm:pb-5">
                    <div className="mb-4 flex flex-col gap-3 border-b border-neutral-800 sm:flex-row sm:items-end sm:justify-between">
                        <div className="flex gap-6">
                            {INNER_TABS.map((tab) => {
                                const isActive = innerTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setInnerTab(tab.id)}
                                        className={`relative pb-3 pt-4 text-sm font-semibold transition-colors ${
                                            isActive
                                                ? "text-yellow-500"
                                                : "text-gray-400 hover:text-white"
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

                        {showTabActions ? (
                            <div className="flex items-center justify-end gap-2 pb-3">
                                {canCorrect ? (
                                    <button
                                        type="button"
                                        onClick={() => onEditResults?.(tournament)}
                                        className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-lg border border-neutral-600 bg-[#1a1a1a] px-4 text-sm font-semibold text-white transition-colors hover:border-neutral-400"
                                    >
                                        <Pencil className="h-4 w-4" />
                                        Edit
                                    </button>
                                ) : null}
                                {canExport ? (
                                    <button
                                        type="button"
                                        onClick={() => onExport?.(tournament)}
                                        className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-lg bg-yellow-500 px-4 text-sm font-bold text-black transition-colors hover:bg-yellow-400"
                                    >
                                        <FileSpreadsheet className="h-4 w-4" />
                                        Export to Excel
                                    </button>
                                ) : null}
                            </div>
                        ) : null}

                        {editingResults && innerTab === "match" ? (
                            <div className="flex items-center justify-end gap-2 pb-3">
                                <button
                                    type="button"
                                    disabled
                                    className="inline-flex min-h-[40px] cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-neutral-600 bg-[#1a1a1a] px-4 text-sm font-semibold text-white opacity-40"
                                >
                                    <Pencil className="h-4 w-4" />
                                    Edit
                                </button>
                                {canExport ? (
                                    <button
                                        type="button"
                                        onClick={() => onExport?.(tournament)}
                                        className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-lg bg-yellow-500 px-4 text-sm font-bold text-black transition-colors hover:bg-yellow-400"
                                    >
                                        <FileSpreadsheet className="h-4 w-4" />
                                        Export to Excel
                                    </button>
                                ) : null}
                            </div>
                        ) : null}
                    </div>

                    {innerTab === "match" ? (
                        <SlMatchManagement
                            teams={(tournament.teams ?? []).filter(
                                (team) =>
                                    tournament.status !== "completed" ||
                                    team.teamStatus === "registered",
                            )}
                            page={page}
                            totalPages={1}
                            onPageChange={setPage}
                            editable={
                                Boolean(tournament.canSubmitResults) ||
                                editingResults
                            }
                            resultsSubmitted={resultsSubmitted}
                            canSubmit={Boolean(tournament.canSubmitResults)}
                            onPlacementChange={(teamId, placement) =>
                                onPlacementChange?.(
                                    tournament.id,
                                    teamId,
                                    placement,
                                )
                            }
                            onSubmitResults={() => onSubmitResults?.(tournament)}
                            onCancelEdit={() => onCancelEdit?.(tournament)}
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
