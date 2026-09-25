import SlMatchManagement from "@/Components/CampusTournament/SlMatchManagement";
import SlRosterPanel from "@/Components/CampusTournament/SlRosterPanel";
import { formatDateRange } from "@/data/campusTournamentData";
import { Link } from "@inertiajs/react";
import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import { useState } from "react";

const INNER_TABS = [
    { id: "match", label: "Match Management" },
    { id: "roster", label: "Roster & Solo Players" },
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
 * }} props
 */
export default function SlTournamentPanel({
    tournament,
    defaultExpanded = false,
}) {
    const [expanded, setExpanded] = useState(defaultExpanded);
    const [innerTab, setInnerTab] = useState("match");
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
                    {tournament.status === "completed" ? (
                        <Link
                            href={`/campus-tournaments/${tournament.id}/report`}
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-yellow-500 px-3 text-sm font-semibold text-yellow-500 transition-colors hover:bg-yellow-500/10"
                        >
                            Report
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

                    {innerTab === "match" ? (
                        <SlMatchManagement
                            teams={tournament.teams ?? []}
                            page={page}
                            totalPages={10}
                            onPageChange={setPage}
                            readOnly
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
