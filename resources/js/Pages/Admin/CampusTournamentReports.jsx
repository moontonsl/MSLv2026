import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

const MANILA_DATE = new Intl.DateTimeFormat('en-PH', {
    dateStyle: 'medium',
    timeZone: 'Asia/Manila',
});

export default function CampusTournamentReports({ tournaments }) {
    return (
        <AdminLayout activeNavId="campus-reports">
            <Head title="Campus Tournament Reports" />

            <div className="w-full space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        Campus Tournament Reports
                    </h1>
                    <p className="mt-2 text-sm text-gray-400">
                        Review completed tournaments and correct submitted results.
                    </p>
                </div>

                <div className="overflow-hidden rounded-xl border border-neutral-800 bg-[#111111]">
                    {tournaments.data.length === 0 ? (
                        <p className="p-6 text-sm text-gray-400">
                            No completed campus tournaments yet.
                        </p>
                    ) : (
                        <div className="divide-y divide-neutral-800">
                            {tournaments.data.map((tournament) => (
                                <div
                                    key={tournament.id}
                                    className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div>
                                        <h2 className="font-semibold text-white">
                                            {tournament.name}
                                        </h2>
                                        <p className="mt-1 text-sm text-gray-400">
                                            {tournament.institution}
                                            {tournament.campus
                                                ? ` — ${tournament.campus}`
                                                : ''}
                                            {' · Ended '}
                                            {MANILA_DATE.format(
                                                new Date(tournament.endedAt),
                                            )}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-500">
                                            {tournament.revision
                                                ? `Current report: v${tournament.revision}`
                                                : 'Awaiting initial Student Leader report'}
                                        </p>
                                    </div>
                                    <Link
                                        href={tournament.url}
                                        className="inline-flex min-h-10 items-center justify-center rounded-lg border border-yellow-500 px-4 text-sm font-semibold text-yellow-500 hover:bg-yellow-500/10"
                                    >
                                        View report
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {tournaments.links.length > 3 ? (
                    <nav aria-label="Report pages" className="flex flex-wrap gap-2">
                        {tournaments.links.map((link, index) =>
                            link.url ? (
                                <Link
                                    key={index}
                                    href={link.url}
                                    className={`rounded-md px-3 py-2 text-sm ${
                                        link.active
                                            ? 'bg-yellow-500 font-bold text-black'
                                            : 'border border-neutral-700 text-gray-300'
                                    }`}
                                >
                                    {index === 0
                                        ? 'Previous'
                                        : index === tournaments.links.length - 1
                                          ? 'Next'
                                          : link.label}
                                </Link>
                            ) : null,
                        )}
                    </nav>
                ) : null}
            </div>
        </AdminLayout>
    );
}
