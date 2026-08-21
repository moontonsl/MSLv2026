import { formatDateRange } from '@/data/campusTournamentData';

/**
 * @param {{
 *   tournament: {
 *     id: string;
 *     title: string;
 *     schoolName?: string;
 *     startDate: string;
 *     endDate: string;
 *     verifiedTeams: number;
 *     pendingTeams: number;
 *     totalRegistration: number;
 *   };
 *   onView?: (tournament: object) => void;
 *   onReschedule?: (tournament: object) => void;
 *   onDelete?: (tournament: object) => void;
 * }} props
 */
export default function ManagedTournamentCard({
    tournament,
    onView,
    onReschedule,
    onDelete,
}) {
    return (
        <article className="rounded-2xl border border-neutral-800 bg-[#111111] p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-5 lg:justify-between">
                <div className="min-w-0 flex-1 border-b border-neutral-800 pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
                    <p className="text-xs font-medium text-gray-500">School Name</p>
                    <h3 className="mt-1 text-base font-bold uppercase leading-snug text-white sm:text-lg">
                        {tournament.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-400">
                        {formatDateRange(tournament.startDate, tournament.endDate)}
                    </p>
                </div>

                <div className="grid flex-1 grid-cols-3 gap-2 border-b border-neutral-800 pb-4 text-center sm:gap-3 lg:border-b-0 lg:border-r lg:pb-0 lg:px-6">
                    {[
                        { label: 'Verified Teams', value: tournament.verifiedTeams },
                        { label: 'Pending Teams', value: tournament.pendingTeams },
                        { label: 'Total Registration', value: tournament.totalRegistration },
                    ].map((stat) => (
                        <div key={stat.label}>
                            <p className="text-[10px] text-gray-500 sm:text-xs">{stat.label}</p>
                            <p className="mt-1 text-xl font-bold text-white sm:text-2xl">
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Mobile: 3 equal buttons in a row; desktop: compact actions */}
                <div className="grid grid-cols-3 gap-2 lg:flex lg:w-auto lg:flex-col lg:gap-2 lg:pl-6 xl:flex-row">
                    <button
                        type="button"
                        onClick={() => onView?.(tournament)}
                        className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-neutral-600 bg-[#1a1a1a] px-2 text-sm font-semibold text-white transition-colors hover:border-neutral-400 sm:px-4"
                    >
                        View
                    </button>
                    <button
                        type="button"
                        onClick={() => onReschedule?.(tournament)}
                        className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-yellow-500 px-2 text-sm font-bold text-black transition-colors hover:bg-yellow-400 sm:px-4"
                    >
                        Resched
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete?.(tournament)}
                        className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-red-600 px-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 sm:px-4"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </article>
    );
}
