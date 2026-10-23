import MatchPlayerCell from '@/Components/CampusTournament/MatchPlayerCell';
import PlacementStatusDropdown from '@/Components/CampusTournament/PlacementStatusDropdown';
import { ArrowDownUp, ChevronLeft, ChevronRight, FileSpreadsheet, Pencil } from 'lucide-react';

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
 *   editable?: boolean;
 *   resultsSubmitted?: boolean;
 *   canSubmit?: boolean;
 *   canCorrect?: boolean;
 *   onPlacementChange?: (teamId: number, placement: string) => void;
 *   onSubmitResults?: () => void;
 *   onEditResults?: () => void;
 *   onCancelEdit?: () => void;
 *   onExport?: () => void;
 * }} props
 */
export default function SlMatchManagement({
    teams,
    page = 1,
    totalPages = 10,
    onPageChange,
    editable = false,
    resultsSubmitted = false,
    canSubmit = false,
    canCorrect = false,
    onPlacementChange,
    onSubmitResults,
    onEditResults,
    onCancelEdit,
    onExport,
}) {
    return (
        <div className="space-y-4">
            {/* Desktop table */}
            <div className="hidden 2xl:block">
                <table className="w-full table-fixed border-collapse">
                    <colgroup>
                        <col className="w-[11%]" />
                        {Array.from({ length: 5 }, (_, index) => (
                            <col key={index} className="w-[15%]" />
                        ))}
                        <col className="w-[14%]" />
                    </colgroup>
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
                                {Array.from({ length: 5 }, (_, index) => (
                                    <td key={index} className="px-3 py-3">
                                        <MatchPlayerCell player={team.players?.[index]} />
                                    </td>
                                ))}
                                <td className="px-3 py-3">
                                    <PlacementStatusDropdown
                                        value={team.placement}
                                        disabled={!editable || team.teamStatus !== 'registered'}
                                        onChange={(placement) => onPlacementChange?.(team.id, placement)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Cards retain the full roster without horizontal scrolling. */}
            <div className="space-y-3 2xl:hidden">
                {teams.map((team) => (
                    <div
                        key={team.id}
                        className="rounded-lg border border-neutral-800 bg-[#0a0a0a] p-3 sm:p-4"
                    >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <p className="min-w-0 break-words text-sm font-semibold text-white">
                                {team.name}
                            </p>
                            <PlacementStatusDropdown
                                value={team.placement}
                                disabled={!editable || team.teamStatus !== 'registered'}
                                onChange={(placement) => onPlacementChange?.(team.id, placement)}
                            />
                        </div>
                        <div className="mt-3 grid gap-3 border-t border-neutral-800 pt-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                            {['Captain', 'Player 2', 'Player 3', 'Player 4', 'Player 5'].map((label, index) => (
                                <div key={label} className="min-w-0">
                                    <p className="mb-2 text-xs font-semibold text-yellow-500">{label}</p>
                                    <MatchPlayerCell player={team.players?.[index]} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
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
                        {Array.from(
                            { length: Math.min(totalPages, 10) },
                            (_, index) => {
                                const pageNumber = index + 1;
                                const isActive = pageNumber === page;
                                return (
                                    <button
                                        key={pageNumber}
                                        type="button"
                                        onClick={() =>
                                            onPageChange?.(pageNumber)
                                        }
                                        className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md text-sm font-semibold transition-colors ${
                                            isActive
                                                ? 'bg-yellow-500 text-black'
                                                : 'text-gray-300 hover:text-white'
                                        }`}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            },
                        )}
                    </div>

                    <p className="px-2 text-sm font-medium text-white sm:hidden">
                        Page {page} of {totalPages}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            onPageChange?.(Math.min(totalPages, page + 1))
                        }
                        disabled={page >= totalPages}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-yellow-500 text-black transition-colors hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-40 sm:h-auto sm:w-auto sm:rounded-lg sm:bg-yellow-500 sm:px-4 sm:py-2 sm:text-sm sm:font-bold sm:text-black sm:hover:bg-yellow-400"
                        aria-label="Next page"
                    >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="h-5 w-5 sm:hidden" />
                    </button>
                </div>
                {(canSubmit || (editable && resultsSubmitted)) ? (
                    <div className="flex flex-wrap gap-2">
                        {resultsSubmitted ? (
                            <button type="button" onClick={onCancelEdit} className="min-h-[44px] rounded-lg border border-neutral-600 px-4 text-sm font-semibold text-white">
                                Cancel
                            </button>
                        ) : null}
                        <button type="button" onClick={onSubmitResults} className="min-h-[44px] rounded-lg bg-yellow-500 px-6 py-2.5 text-sm font-bold text-black hover:bg-yellow-400">
                            {resultsSubmitted ? 'Save correction' : 'Submit Results'}
                        </button>
                    </div>
                ) : null}
                {resultsSubmitted && !editable ? (
                    <div className="flex flex-wrap gap-2">
                        {canCorrect ? (
                            <button type="button" onClick={onEditResults} className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-neutral-600 px-4 text-sm font-semibold text-white hover:border-neutral-400">
                                <Pencil className="h-4 w-4" /> Edit
                            </button>
                        ) : null}
                        {onExport ? (
                            <button type="button" onClick={onExport} className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-yellow-500 px-4 text-sm font-bold text-black hover:bg-yellow-400">
                                <FileSpreadsheet className="h-4 w-4" /> Export to Excel
                            </button>
                        ) : null}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
