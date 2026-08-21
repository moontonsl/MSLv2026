import { formatDateRange } from '@/data/campusTournamentData';
import { Ban, Hourglass } from 'lucide-react';

/**
 * @param {{
 *   title: string;
 *   count: number;
 *   countLabel: string;
 *   emptyMessage: string;
 *   variant: 'pending' | 'rejected';
 *   items: Array<{
 *     id: string;
 *     title: string;
 *     startDate: string;
 *     endDate: string;
 *     mode: string;
 *   }>;
 *   onDelete: (id: string) => void;
 * }} props
 */
export default function RequestSection({
    title,
    count,
    countLabel,
    emptyMessage,
    variant,
    items,
    onDelete,
}) {
    const isPending = variant === 'pending';

    return (
        <section className="rounded-xl border border-neutral-800 bg-[#111111] p-4 sm:p-6">
            <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                    <h2 className="text-lg font-bold text-yellow-500 sm:text-xl">{title}</h2>
                    {items.length === 0 ? (
                        <p className="mt-1 text-sm text-gray-400">{emptyMessage}</p>
                    ) : null}
                </div>
                <p className="shrink-0 text-sm text-white">
                    {count} {countLabel}
                </p>
            </div>

            {items.length > 0 ? (
                <div className="space-y-3">
                    {items.map((item) => (
                        <article
                            key={item.id}
                            className="flex flex-col gap-4 rounded-lg border border-neutral-800 bg-[#0a0a0a] p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div className="min-w-0 flex-1">
                                <span
                                    className={`mb-2 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold ${
                                        isPending
                                            ? 'bg-yellow-500/10 text-yellow-500'
                                            : 'bg-red-500/10 text-red-400'
                                    }`}
                                >
                                    {isPending ? (
                                        <Hourglass className="h-3.5 w-3.5" />
                                    ) : (
                                        <Ban className="h-3.5 w-3.5" />
                                    )}
                                    {isPending ? 'Pending' : 'Rejected'}
                                </span>
                                <h3 className="text-base font-bold uppercase text-yellow-500 sm:text-lg">
                                    {item.title}
                                </h3>
                                <p className="mt-1 text-sm text-gray-400">
                                    {formatDateRange(item.startDate, item.endDate, item.mode)}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => onDelete(item.id)}
                                className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-red-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 sm:w-auto"
                            >
                                Delete
                            </button>
                        </article>
                    ))}
                </div>
            ) : null}
        </section>
    );
}
