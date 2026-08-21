import { formatTournamentDate } from '@/data/campusTournamentData';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const COLUMNS = [
    { key: 'schoolName', label: 'School Name' },
    { key: 'type', label: 'Type' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    { key: 'slName', label: 'SL Name' },
];

/**
 * @param {{
 *   requests: Array<{
 *     id: string;
 *     schoolName: string;
 *     type: string;
 *     startDate: string;
 *     endDate: string;
 *     slName: string;
 *   }>;
 *   onApprove: (request: object) => void;
 *   onReject: (request: object) => void;
 *   page?: number;
 *   totalPages?: number;
 *   onPageChange?: (page: number) => void;
 * }} props
 */
export default function TournamentRequestTable({
    requests,
    onApprove,
    onReject,
    page = 1,
    totalPages = 10,
    onPageChange,
}) {
    const pageNumbers = [1, 2, 3, '...', 8, 9, 10];

    return (
        <div className="overflow-hidden rounded-xl border border-neutral-800 bg-[#111111]">
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[900px] table-auto border-collapse">
                    <thead>
                        <tr className="bg-[#1a1a1a]">
                            {COLUMNS.map((column) => (
                                <th
                                    key={column.key}
                                    className="px-4 py-4 text-left text-sm font-semibold text-yellow-500"
                                >
                                    {column.label}
                                </th>
                            ))}
                            <th className="px-4 py-4 text-left text-sm font-semibold text-yellow-500">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request) => (
                            <tr key={request.id} className="border-t border-neutral-800">
                                <td className="px-4 py-4 text-sm font-semibold text-white">
                                    {request.schoolName}
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-300">{request.type}</td>
                                <td className="px-4 py-4 text-sm text-gray-300">
                                    {formatTournamentDate(request.startDate)}
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-300">
                                    {formatTournamentDate(request.endDate)}
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-300">{request.slName}</td>
                                <td className="px-4 py-4">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => onApprove(request)}
                                            className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-yellow-500 px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-yellow-400"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onReject(request)}
                                            className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile cards — matches Mobile SL View request cards */}
            <div className="space-y-3 p-3 md:hidden">
                {requests.map((request) => (
                    <article
                        key={request.id}
                        className="rounded-2xl border border-neutral-800 bg-[#0a0a0a] p-4"
                    >
                        <div className="mb-4 flex items-start justify-between gap-3">
                            <h3 className="text-base font-bold text-white">{request.schoolName}</h3>
                            <span className="shrink-0 rounded-md border border-neutral-600 bg-[#1a1a1a] px-2.5 py-1 text-xs font-medium text-white">
                                {request.type}
                            </span>
                        </div>

                        <div className="mb-3 grid grid-cols-2 gap-3">
                            <div>
                                <p className="text-xs font-semibold text-yellow-500">Start Date</p>
                                <p className="mt-1 text-sm text-white">
                                    {formatTournamentDate(request.startDate)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-yellow-500">End Date</p>
                                <p className="mt-1 text-sm text-white">
                                    {formatTournamentDate(request.endDate)}
                                </p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <p className="text-xs font-semibold text-yellow-500">SL Name</p>
                            <p className="mt-1 text-sm text-white">{request.slName}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => onApprove(request)}
                                className="min-h-[44px] rounded-lg bg-yellow-500 text-sm font-bold text-black"
                            >
                                Approve
                            </button>
                            <button
                                type="button"
                                onClick={() => onReject(request)}
                                className="min-h-[44px] rounded-lg bg-red-600 text-sm font-semibold text-white"
                            >
                                Reject
                            </button>
                        </div>
                    </article>
                ))}
            </div>

            {/* Desktop pagination */}
            <div className="hidden items-center justify-between gap-3 border-t border-neutral-800 px-4 py-4 md:flex">
                <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => onPageChange?.(page - 1)}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-bold text-black disabled:cursor-not-allowed disabled:opacity-50"
                >
                    ← Previous
                </button>

                <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-400">
                    {pageNumbers.map((item, index) =>
                        item === '...' ? (
                            <span key={`ellipsis-${index}`}>...</span>
                        ) : (
                            <button
                                key={item}
                                type="button"
                                onClick={() => onPageChange?.(item)}
                                className={`inline-flex min-h-9 min-w-9 items-center justify-center rounded-md ${
                                    page === item
                                        ? 'bg-yellow-500 font-bold text-black'
                                        : 'text-gray-300 hover:text-white'
                                }`}
                            >
                                {item}
                            </button>
                        ),
                    )}
                </div>

                <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => onPageChange?.(page + 1)}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-bold text-black disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Next →
                </button>
            </div>

            {/* Mobile pagination — Page X of Y */}
            <div className="flex items-center justify-between gap-3 border-t border-neutral-800 px-4 py-4 md:hidden">
                <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => onPageChange?.(page - 1)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-yellow-500 text-black disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Previous page"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <p className="text-sm font-medium text-white">
                    Page {page} of {totalPages}
                </p>
                <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => onPageChange?.(page + 1)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-yellow-500 text-black disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Next page"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}
