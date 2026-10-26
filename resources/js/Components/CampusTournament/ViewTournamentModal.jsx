import BaseModal from '@/Components/Admin/BaseModal';
import { MODAL_CLOSE_BUTTON_CLASS } from '@/Components/Admin/adminModalFormStyles';
import MatchPlayerCell from '@/Components/CampusTournament/MatchPlayerCell';
import PlacementStatusDropdown from '@/Components/CampusTournament/PlacementStatusDropdown';
import SlRosterPanel from '@/Components/CampusTournament/SlRosterPanel';
import {
    formatDateRange,
    getPlacementSummary,
} from '@/data/campusTournamentData';
import {
    ArrowDownUp,
    Check,
    ChevronLeft,
    ChevronRight,
    Clock,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

const INNER_TABS = [
    { id: 'match', label: 'Match Management' },
    { id: 'roster', label: 'Roster & Solo Players' },
];

/**
 * RA / CA “View” tournament detail modal (Match Management / Roster).
 *
 * @param {{
 *   isOpen: boolean;
 *   tournament?: object | null;
 *   onClose: () => void;
 *   onMarkReviewed?: (tournamentId: string) => void;
 * }} props
 */
export default function ViewTournamentModal({
    isOpen,
    tournament = null,
    onClose,
    onMarkReviewed,
}) {
    const [innerTab, setInnerTab] = useState('match');
    const [page, setPage] = useState(1);
    const [ackOpen, setAckOpen] = useState(false);
    const totalPages = 10;

    const teams = tournament?.teams ?? [];
    const isCompleted =
        tournament?.status === 'completed' || tournament?.resultsSubmitted;
    const isReviewed = Boolean(tournament?.reviewed);

    const statusLabel = useMemo(() => {
        if (!tournament) return 'In Progress';
        if (isReviewed) return 'Reviewed';
        if (isCompleted) return 'Completed';
        if (tournament.status === 'upcoming') return 'Upcoming';
        return 'In Progress';
    }, [tournament, isCompleted, isReviewed]);

    const placementSummary = useMemo(
        () => getPlacementSummary(teams).filter((item) => item.id !== '4th'),
        [teams],
    );

    const handleConfirmReviewed = () => {
        if (tournament?.id) {
            onMarkReviewed?.(tournament.id);
        }
        setAckOpen(false);
    };

    return (
        <>
            <BaseModal
                isOpen={isOpen}
                onClose={onClose}
                hideHeader
                showCloseButton={false}
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
                                isReviewed || isCompleted
                                    ? 'bg-emerald-500/15 text-emerald-400'
                                    : 'border border-yellow-500/50 bg-yellow-500/10 text-yellow-500'
                            }`}
                        >
                            {isReviewed || isCompleted ? (
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

                    {isCompleted ? (
                        <div className="mt-4 space-y-3">
                            <p className="text-sm font-semibold text-yellow-500">
                                {tournament?.totalRegistration ?? teams.length}{' '}
                                Teams Match Result
                            </p>
                            <div className="rounded-xl border border-neutral-800 bg-[#0a0a0a] px-4 py-3">
                                <ul className="space-y-1.5">
                                    {placementSummary.map((item) => (
                                        <li key={item.id} className="text-sm">
                                            <span
                                                className={`font-bold ${item.rankColor}`}
                                            >
                                                {item.label}:
                                            </span>{' '}
                                            <span className="text-white">
                                                {item.teamName}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="space-y-1 text-sm text-gray-400">
                                <p>
                                    Created by:{' '}
                                    <span className="text-white">
                                        {tournament?.createdBy ?? 'SL Jenard'}
                                    </span>
                                </p>
                                <p>
                                    Reported by:{' '}
                                    <span className="text-white">
                                        {tournament?.reportedBy ?? 'SL Jenard'}
                                    </span>
                                </p>
                                {isReviewed ? (
                                    <p>
                                        Reviewed by:{' '}
                                        <span className="text-white">
                                            {tournament?.reviewedBy ??
                                                'RA Jenard'}
                                        </span>
                                    </p>
                                ) : null}
                            </div>
                        </div>
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
                                    <table className="w-full min-w-[980px] table-auto border-collapse">
                                        <thead>
                                            <tr className="border-b border-neutral-800">
                                                <th className="px-3 py-3 text-left text-xs font-semibold text-yellow-500">
                                                    Team Name
                                                </th>
                                                {[
                                                    'Captain',
                                                    'Player 2',
                                                    'Player 3',
                                                    'Player 4',
                                                    'Player 5',
                                                ].map((label) => (
                                                    <th
                                                        key={label}
                                                        className="px-3 py-3 text-left text-xs font-semibold text-yellow-500"
                                                    >
                                                        <span className="inline-flex items-center gap-1">
                                                            {label}
                                                            <ArrowDownUp className="h-3 w-3 opacity-60" />
                                                        </span>
                                                    </th>
                                                ))}
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
                                                    {(team.players ?? [])
                                                        .slice(0, 5)
                                                        .map((player) => (
                                                            <td
                                                                key={player.id}
                                                                className="px-3 py-3"
                                                            >
                                                                <MatchPlayerCell
                                                                    player={
                                                                        player
                                                                    }
                                                                />
                                                            </td>
                                                        ))}
                                                    <td className="px-3 py-3">
                                                        <PlacementStatusDropdown
                                                            value={
                                                                team.placement
                                                            }
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

                                <div className="flex flex-col gap-4 border-t border-neutral-800 pt-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center justify-center gap-3 sm:justify-start">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setPage((prev) =>
                                                    Math.max(1, prev - 1),
                                                )
                                            }
                                            disabled={page <= 1}
                                            className="inline-flex h-9 items-center justify-center rounded-md bg-yellow-500 px-3 text-sm font-bold text-black disabled:opacity-40 sm:min-w-[100px]"
                                            aria-label="Previous page"
                                        >
                                            <span className="hidden sm:inline">
                                                Previous
                                            </span>
                                            <ChevronLeft className="h-5 w-5 sm:hidden" />
                                        </button>
                                        <div className="hidden items-center gap-1 sm:flex">
                                            {[1, 2, 3, '...', 8, 9, 10].map(
                                                (item, index) =>
                                                    item === '...' ? (
                                                        <span
                                                            key={`ellipsis-${index}`}
                                                            className="px-1 text-sm text-gray-400"
                                                        >
                                                            ...
                                                        </span>
                                                    ) : (
                                                        <button
                                                            key={item}
                                                            type="button"
                                                            onClick={() =>
                                                                setPage(item)
                                                            }
                                                            className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md text-sm font-semibold ${
                                                                page === item
                                                                    ? 'bg-yellow-500 text-black'
                                                                    : 'text-gray-300 hover:text-white'
                                                            }`}
                                                        >
                                                            {item}
                                                        </button>
                                                    ),
                                            )}
                                        </div>
                                        <p className="text-sm font-medium text-white sm:hidden">
                                            Page {page} of {totalPages}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setPage((prev) =>
                                                    Math.min(
                                                        totalPages,
                                                        prev + 1,
                                                    ),
                                                )
                                            }
                                            disabled={page >= totalPages}
                                            className="inline-flex h-9 items-center justify-center rounded-md bg-yellow-500 px-3 text-sm font-bold text-black disabled:opacity-40 sm:min-w-[100px]"
                                            aria-label="Next page"
                                        >
                                            <span className="hidden sm:inline">
                                                Next
                                            </span>
                                            <ChevronRight className="h-5 w-5 sm:hidden" />
                                        </button>
                                    </div>

                                    {isCompleted && !isReviewed ? (
                                        <button
                                            type="button"
                                            onClick={() => setAckOpen(true)}
                                            className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-yellow-500 px-5 text-sm font-bold text-black transition-colors hover:bg-yellow-400"
                                        >
                                            Mark as Reviewed
                                        </button>
                                    ) : null}
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

            <BaseModal
                isOpen={ackOpen}
                onClose={() => setAckOpen(false)}
                hideHeader
                scrollable={false}
                maxWidth="max-w-md"
                footer={
                    <button
                        type="button"
                        onClick={handleConfirmReviewed}
                        className="min-h-[44px] w-full rounded-lg bg-yellow-500 text-base font-bold text-black transition-colors hover:bg-yellow-400 md:text-sm"
                    >
                        Confirm
                    </button>
                }
            >
                <div className="relative px-1 pb-2 pt-2 text-center">
                    <button
                        type="button"
                        onClick={() => setAckOpen(false)}
                        className={`absolute -right-1 -top-1 ${MODAL_CLOSE_BUTTON_CLASS}`}
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-yellow-500/50 bg-yellow-500/10">
                        <Check className="h-7 w-7 text-yellow-500" />
                    </div>

                    <h2 className="mb-2 text-xl font-bold text-white">
                        Acknowledgement
                    </h2>
                    <p className="text-sm leading-relaxed text-gray-400">
                        Acknowledge that the result is already reviewed and
                        completed.
                    </p>
                </div>
            </BaseModal>
        </>
    );
}
