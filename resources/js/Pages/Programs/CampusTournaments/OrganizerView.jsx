import CreateTournamentModal from '@/Components/CampusTournament/CreateTournamentModal';
import RequestSection from '@/Components/CampusTournament/RequestSection';
import TournamentListItem from '@/Components/CampusTournament/TournamentListItem';
import DeleteConfirmationModal from '@/Components/Admin/DeleteConfirmationModal';
import SuccessModal from '@/Components/Admin/SuccessModal';
import {
    INITIAL_PENDING_REQUESTS,
    INITIAL_REJECTED_REQUESTS,
    INITIAL_TOURNAMENTS,
    MONTH_OPTIONS,
    TOURNAMENT_STATUS_TABS,
    YEAR_OPTIONS,
} from '@/data/campusTournamentData';
import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import { FilePlus2, Search, Shield } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

const SEARCH_CLASS =
    'w-full min-h-[44px] rounded-lg border border-neutral-800 bg-[#1a1a1a] py-2.5 pl-10 pr-4 text-base text-white placeholder:text-gray-500 focus:ring-2 focus:ring-yellow-500 focus:outline-none md:text-sm';

const SELECT_CLASS =
    'min-h-[44px] w-full rounded-lg border border-neutral-800 bg-[#1a1a1a] px-3 py-2.5 text-base text-white outline-none focus:ring-2 focus:ring-yellow-500 md:w-auto md:min-w-[120px] md:text-sm';

export default function OrganizerView() {
    const [pendingRequests, setPendingRequests] = useState(INITIAL_PENDING_REQUESTS);
    const [rejectedRequests, setRejectedRequests] = useState(INITIAL_REJECTED_REQUESTS);
    const [tournaments] = useState(INITIAL_TOURNAMENTS);

    const [statusTab, setStatusTab] = useState('upcoming');
    const [search, setSearch] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [showOnline, setShowOnline] = useState(true);
    const [showOnsite, setShowOnsite] = useState(true);

    const [createOpen, setCreateOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [pendingDelete, setPendingDelete] = useState(null);
    const [successOpen, setSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('Successfully Added!');

    const tabCounts = useMemo(
        () => ({
            upcoming: tournaments.filter((item) => item.status === 'upcoming').length,
            ongoing: tournaments.filter((item) => item.status === 'ongoing').length,
            completed: tournaments.filter((item) => item.status === 'completed').length,
        }),
        [tournaments],
    );

    const filteredTournaments = useMemo(() => {
        const query = search.trim().toLowerCase();

        return tournaments.filter((item) => {
            if (item.status !== statusTab) return false;

            if (item.mode === 'Online' && !showOnline) return false;
            if (item.mode === 'Onsite' && !showOnsite) return false;

            if (query) {
                const haystack = `${item.title} ${item.school ?? ''}`.toLowerCase();
                if (!haystack.includes(query)) return false;
            }

            if (month && !item.startDate.includes(`-${month}-`)) return false;
            if (year && !item.startDate.startsWith(year)) return false;

            return true;
        });
    }, [tournaments, statusTab, search, showOnline, showOnsite, month, year]);

    const requestDelete = useCallback((source, id) => {
        setPendingDelete({ source, id });
        setDeleteOpen(true);
    }, []);

    const cancelDelete = useCallback(() => {
        setDeleteOpen(false);
        setPendingDelete(null);
    }, []);

    const confirmDelete = useCallback(() => {
        if (!pendingDelete) return;

        const { source, id } = pendingDelete;
        if (source === 'pending') {
            setPendingRequests((prev) => prev.filter((item) => item.id !== id));
        } else if (source === 'rejected') {
            setRejectedRequests((prev) => prev.filter((item) => item.id !== id));
        }

        setDeleteOpen(false);
        setPendingDelete(null);
        setSuccessMessage('Data has been deleted!');
        setSuccessOpen(true);
    }, [pendingDelete]);

    const handleCreateSubmit = useCallback((values) => {
        const title = 'NEW CAMPUS TOURNAMENT';
        setPendingRequests((prev) => [
            {
                id: `pending-${Date.now()}`,
                title,
                startDate: values.startDate,
                endDate: values.endDate,
                mode: values.mode,
                status: 'pending',
            },
            ...prev,
        ]);
        setCreateOpen(false);
        setSuccessMessage('Successfully Added!');
        setSuccessOpen(true);
    }, []);

    return (
        <MainLayout fullWidth>
            <Head title="Campus Tournament" />

            <div className="min-h-screen bg-[#0a0a0a] px-4 py-8 text-white sm:px-6 sm:py-10 lg:px-8">
                <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
                    <div>
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-yellow-500/40 bg-yellow-500/10 text-yellow-500">
                                <Shield className="h-6 w-6" strokeWidth={2.2} />
                            </div>
                            <h1 className="text-2xl font-black uppercase tracking-wide text-white sm:text-3xl md:text-4xl">
                                Campus Tournament
                            </h1>
                        </div>

                        <button
                            type="button"
                            onClick={() => setCreateOpen(true)}
                            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-yellow-500 px-5 py-2.5 text-base font-bold text-black transition-colors hover:bg-yellow-400 md:text-sm"
                        >
                            <FilePlus2 className="h-4 w-4" />
                            Create Tournament
                        </button>
                    </div>

                    <RequestSection
                        title="Pending Requests"
                        count={pendingRequests.length}
                        countLabel="Pending"
                        emptyMessage="No pending tournament requests."
                        variant="pending"
                        items={pendingRequests}
                        onDelete={(id) => requestDelete('pending', id)}
                    />

                    <RequestSection
                        title="Rejected Requests"
                        count={rejectedRequests.length}
                        countLabel="Rejected"
                        emptyMessage="No rejected tournament requests."
                        variant="rejected"
                        items={rejectedRequests}
                        onDelete={(id) => requestDelete('rejected', id)}
                    />

                    <div className="space-y-4 rounded-xl border border-neutral-800 bg-[#111111] p-4 sm:p-5">
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                            <div className="inline-flex w-full flex-wrap gap-2 rounded-xl bg-[#0a0a0a] p-1 sm:w-auto">
                                {TOURNAMENT_STATUS_TABS.map((tab) => {
                                    const isActive = statusTab === tab.id;
                                    const count = tabCounts[tab.id] ?? 0;

                                    return (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            onClick={() => setStatusTab(tab.id)}
                                            className={`inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors sm:flex-none ${
                                                isActive
                                                    ? 'bg-yellow-500 text-black'
                                                    : 'text-gray-300 hover:text-white'
                                            }`}
                                        >
                                            {tab.label}
                                            <span
                                                className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold ${
                                                    isActive
                                                        ? 'bg-black text-yellow-500'
                                                        : 'bg-yellow-500 text-black'
                                                }`}
                                            >
                                                {count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center xl:w-auto xl:justify-end">
                                <div className="relative w-full sm:min-w-[200px] sm:flex-1 xl:w-56 xl:flex-none">
                                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="search"
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                        placeholder="Search School"
                                        className={SEARCH_CLASS}
                                    />
                                </div>

                                <select
                                    value={month}
                                    onChange={(event) => setMonth(event.target.value)}
                                    className={SELECT_CLASS}
                                    aria-label="Filter by month"
                                >
                                    {MONTH_OPTIONS.map((option) => (
                                        <option key={option.label} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={year}
                                    onChange={(event) => setYear(event.target.value)}
                                    className={SELECT_CLASS}
                                    aria-label="Filter by year"
                                >
                                    {YEAR_OPTIONS.map((option) => (
                                        <option key={option.label} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>

                                <div className="flex items-center gap-4 px-1">
                                    {[
                                        {
                                            id: 'filter-online',
                                            label: 'Online',
                                            checked: showOnline,
                                            onChange: setShowOnline,
                                        },
                                        {
                                            id: 'filter-onsite',
                                            label: 'Onsite',
                                            checked: showOnsite,
                                            onChange: setShowOnsite,
                                        },
                                    ].map((filter) => (
                                        <label
                                            key={filter.id}
                                            htmlFor={filter.id}
                                            className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 text-sm text-white"
                                        >
                                            <input
                                                id={filter.id}
                                                type="checkbox"
                                                checked={filter.checked}
                                                onChange={(event) =>
                                                    filter.onChange(event.target.checked)
                                                }
                                                className="h-4 w-4 rounded border-neutral-600 bg-[#1a1a1a] text-yellow-500 focus:ring-yellow-500"
                                            />
                                            {filter.label}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {filteredTournaments.length === 0 ? (
                                <p className="rounded-xl border border-dashed border-neutral-800 py-12 text-center text-sm text-gray-500">
                                    No tournaments found for this filter.
                                </p>
                            ) : (
                                filteredTournaments.map((tournament) => (
                                    <TournamentListItem
                                        key={tournament.id}
                                        tournament={tournament}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <CreateTournamentModal
                isOpen={createOpen}
                onClose={() => setCreateOpen(false)}
                onSubmit={handleCreateSubmit}
            />

            <DeleteConfirmationModal
                isOpen={deleteOpen}
                onCancel={cancelDelete}
                onConfirm={confirmDelete}
            />

            <SuccessModal
                isOpen={successOpen}
                onClose={() => setSuccessOpen(false)}
                message={successMessage}
            />
        </MainLayout>
    );
}
