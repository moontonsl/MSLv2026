import StatisticsSection from '@/Components/Admin/Home/StatisticsSection';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function StatisticsCounters({ statistics = {}, liveCounts = {} }) {
    return (
        <AdminLayout activeNavId="home-statistics">
            <Head title="About Section Statistics Counters — Home Page" />
            <header className="mb-6 sm:mb-8">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-400">
                    Website Management
                </p>
                <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                    About Section Statistics Counters
                </h1>
                <p className="mt-2 text-sm leading-6 text-gray-400">
                    Configure live database counts or custom milestone counters displayed in the About MSL Philippines section.
                </p>
            </header>

            <StatisticsSection initialStatistics={statistics} liveCounts={liveCounts} />
        </AdminLayout>
    );
}
