import CampusTournamentPageHeader from '@/Components/CampusTournament/CampusTournamentPageHeader';
import ConfirmResultsModal from '@/Components/CampusTournament/ConfirmResultsModal';
import CreateTournamentModal from '@/Components/CampusTournament/CreateTournamentModal';
import GenerateReportModal from '@/Components/CampusTournament/GenerateReportModal';
import RequestSection from '@/Components/CampusTournament/RequestSection';
import SlTournamentPanel from '@/Components/CampusTournament/SlTournamentPanel';
import DeleteConfirmationModal from '@/Components/Admin/DeleteConfirmationModal';
import SuccessModal from '@/Components/Admin/SuccessModal';
import {
    getPlacementSummary,
    INITIAL_PENDING_REQUESTS,
    INITIAL_REJECTED_REQUESTS,
    INITIAL_SL_MANAGED_TOURNAMENTS,
    MONTH_OPTIONS,
    TOURNAMENT_STATUS_TABS,
    YEAR_OPTIONS,
} from '@/data/campusTournamentData';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import { FilePlus2, Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

const SEARCH_CLASS =
    'w-full min-h-[44px] rounded-lg border border-neutral-800 bg-[#1a1a1a] py-2.5 pl-10 pr-4 text-base text-white placeholder:text-gray-500 focus:ring-2 focus:ring-yellow-500 focus:outline-none md:text-sm';

const SELECT_CLASS =
    'min-h-[44px] w-full rounded-lg border border-neutral-800 bg-[#1a1a1a] px-3 py-2.5 text-base text-white outline-none focus:ring-2 focus:ring-yellow-500 md:w-auto md:min-w-[120px] md:text-sm';

export default function SlView({
    approvalRequests: initialApprovals = INITIAL_PENDING_REQUESTS,
    rejectedRequests: initialRejected = INITIAL_REJECTED_REQUESTS,
    pendingCreates: initialPendingCreates = [],
    tournaments: initialTournaments = INITIAL_SL_MANAGED_TOURNAMENTS,
}) {
    const [approvalRequests, setApprovalRequests] = useState(initialApprovals);
    const [rejectedRequests, setRejectedRequests] = useState(initialRejected);
    const [pendingCreates, setPendingCreates] = useState(initialPendingCreates);
    const [tournaments, setTournaments] = useState(initialTournaments);

    useEffect(() => {
        setApprovalRequests(initialApprovals);
    }, [initialApprovals]);

    useEffect(() => {
        setRejectedRequests(initialRejected);
    }, [initialRejected]);

    useEffect(() => {
        setPendingCreates(initialPendingCreates);
    }, [initialPendingCreates]);

    useEffect(() => {
        setTournaments(initialTournaments);
    }, [initialTournaments]);

    const [statusTab, setStatusTab] = useState('upcoming');
    const [search, setSearch] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [showOnline, setShowOnline] = useState(true);
    const [showOnsite, setShowOnsite] = useState(true);

    const [createOpen, setCreateOpen] = useState(false);
    const [createError, setCreateError] = useState(null);
    const [editRequest, setEditRequest] = useState(null);
    const [editError, setEditError] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [pendingDelete, setPendingDelete] = useState(null);

    const [resultsConfirmOpen, setResultsConfirmOpen] = useState(false);
    const [resultsMode, setResultsMode] = useState('submit');
    const [resultsTournamentId, setResultsTournamentId] = useState(null);
    const [resultsPlacements, setResultsPlacements] = useState([]);

    const [successOpen, setSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [successDescription, setSuccessDescription] = useState('');

    const [reportOpen, setReportOpen] = useState(false);

    const reportSchools = useMemo(() => {
        const names = [
            ...new Set(
                tournaments
                    .map((item) => item.schoolName)
                    .filter(Boolean),
            ),
        ];
        return [
            { value: 'all', label: 'All School' },
            ...names.map((name) => ({ value: name, label: name })),
        ];
    }, [tournaments]);

    /** Own submissions awaiting Regional Admin review, plus anything queued locally. */
    const pendingItems = useMemo(
        () => [
            ...pendingCreates,
            ...approvalRequests.map((item) => ({
                id: item.id,
                title:
                    item.title ??
                    `${(item.schoolName ?? 'Campus').toUpperCase()} TOURNAMENT`,
                startDate: item.startDate,
                endDate: item.endDate,
                mode: item.mode ?? item.type,
            })),
        ],
        [approvalRequests, pendingCreates],
    );

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
                const haystack = `${item.title} ${item.schoolName ?? ''}`.toLowerCase();
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

        if (typeof id === 'number' || (!String(id).startsWith('pending-') && !String(id).startsWith('rejected-'))) {
            router.delete(`/campus-tournaments/${id}`, {
                data: { reason: 'Cancelled by user' },
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteOpen(false);
                    setPendingDelete(null);
                    setSuccessMessage('Data has been deleted!');
                    setSuccessDescription('');
                    setSuccessOpen(true);
                },
                onError: () => {
                    if (source === 'pending') {
                        setPendingCreates((prev) => prev.filter((item) => item.id !== id));
                        setApprovalRequests((prev) => prev.filter((item) => item.id !== id));
                    } else if (source === 'rejected') {
                        setRejectedRequests((prev) => prev.filter((item) => item.id !== id));
                    }
                    setDeleteOpen(false);
                    setPendingDelete(null);
                    setSuccessMessage('Data has been deleted!');
                    setSuccessDescription('');
                    setSuccessOpen(true);
                },
            });
            return;
        }

        if (source === 'pending') {
            setPendingCreates((prev) => prev.filter((item) => item.id !== id));
            setApprovalRequests((prev) => prev.filter((item) => item.id !== id));
        } else if (source === 'rejected') {
            setRejectedRequests((prev) => prev.filter((item) => item.id !== id));
        }

        setDeleteOpen(false);
        setPendingDelete(null);
        setSuccessMessage('Data has been deleted!');
        setSuccessDescription('');
        setSuccessOpen(true);
    }, [pendingDelete]);

    const handleCreateSubmit = useCallback((values) => {
        setCreateError(null);
        router.post('/campus-tournaments', values, {
            preserveScroll: true,
            onSuccess: () => {
                setCreateOpen(false);
                setCreateError(null);
                setSuccessMessage('Tournament Request Submitted!');
                setSuccessDescription('Your tournament request has been submitted for approval.');
                setSuccessOpen(true);
            },
            onError: (errors) => {
                console.error(errors);
                const message =
                    errors?.registration_opens_at ||
                    errors?.ends_at ||
                    errors?.starts_at ||
                    Object.values(errors || {})[0] ||
                    'Failed to create tournament. Please check your inputs.';
                setCreateError(message);
            },
        });
    }, []);

    /** Editing a rejected request resubmits it for approval with the new schedule. */
    const handleEditSubmit = useCallback(
        (values) => {
            if (!editRequest) return;
            setEditError(null);

            const payload = {
                ...values,
                resubmission_reason: 'Resubmitted with an updated schedule.',
            };

            router.put(`/campus-tournaments/${editRequest.id}/resubmit`, payload, {
                preserveScroll: true,
                onSuccess: () => {
                    setEditRequest(null);
                    setEditError(null);
                    setSuccessMessage('Tournament Request Resubmitted!');
                    setSuccessDescription(
                        'Your request is waiting for Regional Admin approval again.',
                    );
                    setSuccessOpen(true);
                },
                onError: (errors) => {
                    console.error(errors);
                    setEditError(
                        Object.values(errors || {})[0] ||
                            'Failed to resubmit tournament. Please check your inputs.',
                    );
                },
            });
        },
        [editRequest],
    );

    const handlePlacementChange = useCallback((tournamentId, teamId, placementId) => {
        setTournaments((prev) =>
            prev.map((tournament) => {
                if (tournament.id !== tournamentId) return tournament;
                return {
                    ...tournament,
                    teams: (tournament.teams ?? []).map((team) =>
                        team.id === teamId ? { ...team, placement: placementId } : team,
                    ),
                };
            }),
        );
    }, []);

    const openSubmitResults = useCallback((tournament) => {
        setResultsTournamentId(tournament.id);
        setResultsMode(tournament.resultsSubmitted ? 'update' : 'submit');
        setResultsPlacements(getPlacementSummary(tournament.teams ?? []));
        setResultsConfirmOpen(true);
    }, []);

    const openExportReport = useCallback(() => {
        setReportOpen(true);
    }, []);

    const cancelResultsConfirm = useCallback(() => {
        setResultsConfirmOpen(false);
        setResultsTournamentId(null);
        setResultsPlacements([]);
    }, []);

    const confirmResults = useCallback(() => {
        const isUpdate = resultsMode === 'update';
        const submittedOn = new Date().toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
        });
        setTournaments((prev) =>
            prev.map((tournament) =>
                tournament.id === resultsTournamentId
                    ? {
                          ...tournament,
                          resultsSubmitted: true,
                          resultsSubmittedOn: submittedOn,
                      }
                    : tournament,
            ),
        );
        setResultsConfirmOpen(false);
        setResultsTournamentId(null);
        setResultsPlacements([]);
        setSuccessMessage(
            isUpdate ? 'Results Updated Successfully!' : 'Results Submitted Successfully!',
        );
        setSuccessDescription(
            isUpdate
                ? 'Tournament results have been updated.'
                : 'Tournament results have been submitted.',
        );
        setSuccessOpen(true);
    }, [resultsMode, resultsTournamentId]);

    return (
        <MainLayout fullWidth>
            <Head title="Campus Tournament — SL View" />

            <div className="min-h-screen bg-[#0a0a0a] px-4 py-8 text-white sm:px-6 sm:py-10 lg:px-8">
                <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
                    <div>
                        <div className="mb-4">
                            <CampusTournamentPageHeader />
                        </div>

                        <button
                            type="button"
                            onClick={() => setCreateOpen(true)}
                            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-yellow-500 px-5 py-2.5 text-base font-bold text-black transition-colors hover:bg-yellow-400 sm:w-auto md:text-sm"
                        >
                            <FilePlus2 className="h-4 w-4" />
                            Create Tournament
                        </button>
                    </div>

                    <RequestSection
                        title="Pending Requests"
                        count={pendingItems.length}
                        countLabel="Pending"
                        emptyMessage="No pending tournament requests."
                        variant="pending"
                        items={pendingItems}
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
                        onEdit={(item) => {
                            setEditError(null);
                            setEditRequest(item);
                        }}
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
                                            id: 'sl-filter-online',
                                            label: 'Online',
                                            checked: showOnline,
                                            onChange: setShowOnline,
                                        },
                                        {
                                            id: 'sl-filter-onsite',
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
                                filteredTournaments.map((tournament, index) => (
                                    <SlTournamentPanel
                                        key={tournament.id}
                                        tournament={tournament}
                                        defaultExpanded={index === 0}
                                        onPlacementChange={handlePlacementChange}
                                        onSubmitResults={openSubmitResults}
                                        onExport={openExportReport}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <CreateTournamentModal
                isOpen={createOpen}
                onClose={() => {
                    setCreateOpen(false);
                    setCreateError(null);
                }}
                onSubmit={handleCreateSubmit}
                error={createError}
            />

            <CreateTournamentModal
                isOpen={editRequest != null}
                mode="edit"
                initialValues={editRequest}
                onClose={() => {
                    setEditRequest(null);
                    setEditError(null);
                }}
                onSubmit={handleEditSubmit}
                error={editError}
            />

            <ConfirmResultsModal
                isOpen={resultsConfirmOpen}
                mode={resultsMode}
                placements={resultsPlacements}
                onCancel={cancelResultsConfirm}
                onConfirm={confirmResults}
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
                description={successDescription}
            />

            <GenerateReportModal
                isOpen={reportOpen}
                schools={reportSchools}
                onClose={() => setReportOpen(false)}
                onDownload={() => {
                    setSuccessMessage('Report downloaded');
                    setSuccessDescription(
                        'Tournament results export has been prepared.',
                    );
                    setSuccessOpen(true);
                }}
            />
        </MainLayout>
    );
}
