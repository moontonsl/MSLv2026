import MatchPlayerCell from '@/Components/CampusTournament/MatchPlayerCell';
import PlacementStatusDropdown from '@/Components/CampusTournament/PlacementStatusDropdown';
import { ArrowDownUp, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Match Management table (desktop) + compact list (mobile).
 *
 * @param {{
 *   teams: Array<{
 *     id: string;
 *     name: string;
 *     placement: string;
 *     players: Array<{ id: string; name: string; ign: string; uid: string }>;
 *   }>;
 *   page?: number;
 *   totalPages?: number;
 *   onPageChange?: (page: number) => void;
 *   onPlacementChange: (teamId: string, placementId: string) => void;
 *   onSubmitResults: () => void;
 * }} props
 */
export default function SlMatchManagement({
    teams,
    page = 1,
    totalPages = 10,
    onPageChange,
    onPlacementChange,
    onSubmitResults,
}) {
    return (
        <div className="space-y-4">
            {/* Desktop table */}
            <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[980px] table-auto border-collapse">
                    <thead>
                        <tr className="border-b border-neutral-800">
                            <th className="px-3 py-3 text-left text-xs font-semibold text-yellow-500">
                                Team Name
                            </th>
                            {['Captain', 'Player 2', 'Player 3', 'Player 4', 'Player 5'].map(
                                (label) => (
                                    <th
                                        key={label}
                                        className="px-3 py-3 text-left text-xs font-semibold text-yellow-500"
                                    >
                                        <span className="inline-flex items-center gap-1">
                                            {label}
                                            <ArrowDownUp className="h-3 w-3 opacity-60" />
                                        </span>
                                    </th>
                                ),
                            )}
                            <th className="px-3 py-3 text-left text-xs font-semibold text-yellow-500">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {teams.map((team) => (
                            <tr key={team.id} className="border-b border-neutral-800/80">
                                <td className="px-3 py-3 text-sm font-semibold text-white">
                                    {team.name}
                                </td>
                                {(team.players ?? []).slice(0, 5).map((player) => (
                                    <td key={player.id} className="px-3 py-3">
                                        <MatchPlayerCell player={player} />
                                    </td>
                                ))}
                                <td className="px-3 py-3">
                                    <PlacementStatusDropdown
                                        value={team.placement}
                                        onChange={(placementId) =>
                                            onPlacementChange(team.id, placementId)
                                        }
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile / tablet list */}
            <div className="space-y-2 lg:hidden">
                <div className="grid grid-cols-[1fr_auto_auto] gap-2 px-1 text-xs font-semibold text-yellow-500">
                    <span>Team Name</span>
                    <span>Captain</span>
                    <span>Status</span>
                </div>
                {teams.map((team) => {
                    const captain = team.players?.[0];
                    return (
                        <div
                            key={team.id}
                            className="grid grid-cols-[1fr_auto_auto] items-center gap-2 rounded-lg border border-neutral-800 bg-[#0a0a0a] px-3 py-3"
                        >
                            <p className="min-w-0 truncate text-sm font-semibold text-white">
                                {team.name}
                            </p>
                            <MatchPlayerCell player={captain} compact />
                            <PlacementStatusDropdown
                                value={team.placement}
                                onChange={(placementId) =>
                                    onPlacementChange(team.id, placementId)
                                }
                            />
                        </div>
                    );
                })}
            </div>

            <div className="flex flex-col gap-4 border-t border-neutral-800 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center justify-center gap-2 sm:justify-start">
                    <button
                        type="button"
                        onClick={() => onPageChange?.(Math.max(1, page - 1))}
                        disabled={page <= 1}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-yellow-500 text-black transition-colors hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-40 sm:h-auto sm:w-auto sm:rounded-lg sm:border sm:border-yellow-500 sm:bg-transparent sm:px-4 sm:py-2 sm:text-sm sm:font-semibold sm:text-yellow-500 sm:hover:bg-yellow-500/10"
                        aria-label="Previous page"
                    >
                        <span className="hidden sm:inline">Previous</span>
                        <ChevronLeft className="h-5 w-5 sm:hidden" />
                    </button>

                    <div className="hidden items-center gap-1 sm:flex">
                        {Array.from({ length: Math.min(totalPages, 10) }, (_, index) => {
                            const pageNumber = index + 1;
                            const isActive = pageNumber === page;
                            return (
                                <button
                                    key={pageNumber}
                                    type="button"
                                    onClick={() => onPageChange?.(pageNumber)}
                                    className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md text-sm font-semibold transition-colors ${
                                        isActive
                                            ? 'bg-yellow-500 text-black'
                                            : 'text-gray-300 hover:text-white'
                                    }`}
                                >
                                    {pageNumber}
                                </button>
                            );
                        })}
                    </div>

                    <p className="px-2 text-sm font-medium text-white sm:hidden">
                        Page {page} of {totalPages}
                    </p>

                    <button
                        type="button"
                        onClick={() => onPageChange?.(Math.min(totalPages, page + 1))}
                        disabled={page >= totalPages}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-yellow-500 text-black transition-colors hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-40 sm:h-auto sm:w-auto sm:rounded-lg sm:bg-yellow-500 sm:px-4 sm:py-2 sm:text-sm sm:font-bold sm:text-black sm:hover:bg-yellow-400"
                        aria-label="Next page"
                    >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="h-5 w-5 sm:hidden" />
                    </button>
                </div>

                <button
                    type="button"
                    onClick={onSubmitResults}
                    className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-yellow-500 px-6 py-2.5 text-sm font-bold text-black transition-colors hover:bg-yellow-400 sm:w-auto"
                >
                    Submit Results
                </button>
            </div>
        </div>
    );
}
