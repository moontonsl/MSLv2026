import BaseModal from '@/Components/Admin/BaseModal';
import MatchPlayerCell from '@/Components/CampusTournament/MatchPlayerCell';
import PlacementStatusDropdown from '@/Components/CampusTournament/PlacementStatusDropdown';
import SlRosterPanel from '@/Components/CampusTournament/SlRosterPanel';
import { formatDateRange } from '@/data/campusTournamentData';
import { ArrowDownUp, Check, ChevronLeft, ChevronRight, Clock, X } from 'lucide-react';
import { useMemo, useState } from 'react';

const INNER_TABS = [
    { id: 'match', label: 'Match Management' },
    { id: 'roster', label: 'Roster & Solo Players' },
];

/**
 * RA “View” tournament detail modal (Match Management / Roster).
 *
 * @param {{
 *   isOpen: boolean;
 *   tournament?: object | null;
 *   onClose: () => void;
 * }} props
 */
export default function ViewTournamentModal({ isOpen, tournament = null, onClose }) {
    const [innerTab, setInnerTab] = useState('match');
    const [page, setPage] = useState(1);
    const totalPages = 10;

    const teams = tournament?.teams ?? [];
    const statusLabel = useMemo(() => {
        if (!tournament) return 'In Progress';
        if (tournament.status === 'completed' || tournament.resultsSubmitted) return 'Completed';
        if (tournament.status === 'upcoming') return 'Upcoming';
        return 'In Progress';
    }, [tournament]);

    const isCompleted = statusLabel === 'Completed';

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            hideHeader
            scrollable
            maxWidth="max-w-5xl"
            panelClassName="max-h-[90vh]"
        >
            <div className="relative px-1 pb-2 pt-1">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-0 top-0 inline-flex h-9 w-9 items-center justify-center rounded-md bg-red-600 text-white transition-colors hover:bg-red-700"
                    aria-label="Close"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="mb-3 flex flex-wrap items-center gap-2 pr-12">
                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            isCompleted
                                ? 'bg-emerald-500/15 text-emerald-400'
                                : 'border border-yellow-500/50 bg-yellow-500/10 text-yellow-500'
                        }`}
                    >
                        {isCompleted ? (
                            <Check className="h-3.5 w-3.5" />
                        ) : (
                            <Clock className="h-3.5 w-3.5" />
                        )}
                        {statusLabel}
                    </span>
                </div>

                <h2 className="pr-10 text-lg font-bold uppercase text-yellow-500 sm:text-xl">
                    {tournament?.title ?? 'Tournament'}
                </h2>
                {tournament ? (
                    <p className="mt-1 text-sm text-gray-400">
                        {formatDateRange(
                            tournament.startDate,
                            tournament.endDate,
                            tournament.mode,
                        )}
                    </p>
                ) : null}

                <div className="mt-4 flex gap-6 border-b border-neutral-800">
                    {INNER_TABS.map((tab) => {
                        const isActive = innerTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setInnerTab(tab.id)}
                                className={`relative pb-3 pt-1 text-sm font-semibold transition-colors ${
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

                <div className="mt-4">
                    {innerTab === 'match' ? (
                        <div className="space-y-4">
                            <div className="hidden overflow-x-auto lg:block">
                                <table className="w-full min-w-[720px] table-auto border-collapse">
                                    <thead>
                                        <tr className="border-b border-neutral-800">
                                            <th className="px-3 py-3 text-left text-xs font-semibold text-yellow-500">
                                                Team Name
                                            </th>
                                            <th className="px-3 py-3 text-left text-xs font-semibold text-yellow-500">
                                                <span className="inline-flex items-center gap-1">
                                                    Captain
                                                    <ArrowDownUp className="h-3 w-3 opacity-60" />
                                                </span>
                                            </th>
                                            <th className="px-3 py-3 text-left text-xs font-semibold text-yellow-500">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {teams.map((team) => (
                                            <tr
                                                key={team.id}
                                                className="border-b border-neutral-800/80"
                                            >
                                                <td className="px-3 py-3 text-sm font-semibold text-white">
                                                    {team.name}
                                                </td>
                                                <td className="px-3 py-3">
                                                    <MatchPlayerCell
                                                        player={team.players?.[0]}
                                                        compact
                                                    />
                                                </td>
                                                <td className="px-3 py-3">
                                                    <PlacementStatusDropdown
                                                        value={team.placement}
                                                        onChange={() => {}}
                                                        disabled
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="space-y-2 lg:hidden">
                                <div className="grid grid-cols-[1fr_auto_auto] gap-2 px-1 text-xs font-semibold text-yellow-500">
                                    <span>Team Name</span>
                                    <span>Captain</span>
                                    <span>Status</span>
                                </div>
                                {teams.map((team) => (
                                    <div
                                        key={team.id}
                                        className="grid grid-cols-[1fr_auto_auto] items-center gap-2 rounded-lg border border-neutral-800 bg-[#0a0a0a] px-3 py-3"
                                    >
                                        <p className="min-w-0 truncate text-sm font-semibold text-white">
                                            {team.name}
                                        </p>
                                        <MatchPlayerCell
                                            player={team.players?.[0]}
                                            compact
                                        />
                                        <PlacementStatusDropdown
                                            value={team.placement}
                                            onChange={() => {}}
                                            disabled
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-center gap-3 border-t border-neutral-800 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                                    disabled={page <= 1}
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-yellow-500 text-black disabled:opacity-40"
                                    aria-label="Previous page"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <p className="text-sm font-medium text-white">
                                    Page {page} of {totalPages}
                                </p>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setPage((prev) => Math.min(totalPages, prev + 1))
                                    }
                                    disabled={page >= totalPages}
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-yellow-500 text-black disabled:opacity-40"
                                    aria-label="Next page"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <SlRosterPanel
                            rosterLockDate={tournament?.rosterLockDate}
                            teams={tournament?.rosterTeams ?? []}
                        />
                    )}
                </div>
            </div>
        </BaseModal>
    );
}
