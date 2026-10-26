import CampusTournamentPageHeader from '@/Components/CampusTournament/CampusTournamentPageHeader';
import ConfirmActionModal from '@/Components/CampusTournament/ConfirmActionModal';
import CreateTournamentModal from '@/Components/CampusTournament/CreateTournamentModal';
import GenerateReportModal from '@/Components/CampusTournament/GenerateReportModal';
import ManagedTournamentCard from '@/Components/CampusTournament/ManagedTournamentCard';
import TournamentRequestTable from '@/Components/CampusTournament/TournamentRequestTable';
import ViewTournamentModal from '@/Components/CampusTournament/ViewTournamentModal';
import DeleteConfirmationModal from '@/Components/Admin/DeleteConfirmationModal';
import SuccessModal from '@/Components/Admin/SuccessModal';
import {
    INITIAL_RA_MANAGED_TOURNAMENTS,
    INITIAL_SL_TOURNAMENT_REQUESTS,
    MONTH_OPTIONS,
    SL_MANAGEMENT_TABS,
    YEAR_OPTIONS,
} from '@/data/campusTournamentData';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, FileSpreadsheet, Hourglass, Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

/** The controller sends roster teams, so registration stats are derived here. */
function withRegistrationStats(tournament) {
    const rosterTeams = tournament.rosterTeams ?? [];

    return {
        ...tournament,
        verifiedTeams:
            tournament.verifiedTeams ??
            rosterTeams.filter((team) => team.status === 'confirmed').length,
        pendingTeams:
            tournament.pendingTeams ??
            rosterTeams.filter((team) => team.status !== 'confirmed').length,
        totalRegistration: tournament.totalRegistration ?? rosterTeams.length,
    };
}

const SEARCH_CLASS =
    'w-full min-h-[44px] rounded-lg border border-neutral-800 bg-[#1a1a1a] py-2.5 pl-10 pr-4 text-base text-white placeholder:text-gray-500 focus:ring-2 focus:ring-yellow-500 focus:outline-none md:text-sm';

const SELECT_CLASS =
    'min-h-[44px] w-full rounded-lg border border-neutral-800 bg-[#1a1a1a] px-3 py-2.5 text-base text-white outline-none focus:ring-2 focus:ring-yellow-500 md:w-auto md:min-w-[120px] md:text-sm';

const MODE_OPTIONS = [
    { value: '', label: 'Online' },
    { value: 'Online', label: 'Online' },
    { value: 'Onsite', label: 'Onsite' },
];

const SECTION_TITLES = {
    requests: 'Tournament Requests',
    upcoming: 'Upcoming Tournaments',
    ongoing: 'Ongoing Tournaments',
    completed: 'Completed Tournaments',
};

/**
 * Regional Admin / CA view — approves incoming SL tournament requests and manages
 * the approved tournaments (view, reschedule, delete).
 */
export default function RaView({
    approvalRequests: initialRequests = INITIAL_SL_TOURNAMENT_REQUESTS,
    tournaments: initialTournaments = INITIAL_RA_MANAGED_TOURNAMENTS,
}) {
    const [requests, setRequests] = useState(initialRequests);
    const [tournaments, setTournaments] = useState(() =>
        initialTournaments.map(withRegistrationStats),
    );

    useEffect(() => {
        setRequests(initialRequests);
    }, [initialRequests]);

    useEffect(() => {
        setTournaments(initialTournaments.map(withRegistrationStats));
    }, [initialTournaments]);

    const [statusTab, setStatusTab] = useState('requests');
    const [search, setSearch] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [modeFilter, setModeFilter] = useState('');
    const [requestPage, setRequestPage] = useState(1);
    const [tournamentPage, setTournamentPage] = useState(1);
    const tournamentTotalPages = 10;

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [activeRequest, setActiveRequest] = useState(null);

    const [rescheduleTarget, setRescheduleTarget] = useState(null);
    const [rescheduleError, setRescheduleError] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const [successOpen, setSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [successDescription, setSuccessDescription] = useState('');

    const [reportOpen, setReportOpen] = useState(false);
    const [viewTournament, setViewTournament] = useState(null);

    const reportSchools = useMemo(() => {
        const names = [
            ...new Set(tournaments.map((item) => item.schoolName).filter(Boolean)),
        ];
        return [
            { value: 'all', label: 'All School' },
            ...names.map((name) => ({ value: name, label: name })),
        ];
    }, [tournaments]);

    const tabCounts = useMemo(
        () => ({
            requests: requests.length,
            upcoming: tournaments.filter((item) => item.status === 'upcoming').length,
            ongoing: tournaments.filter((item) => item.status === 'ongoing').length,
            completed: tournaments.filter((item) => item.status === 'completed').length,
        }),
        [requests, tournaments],
    );

    const filteredRequests = useMemo(() => {
        const query = search.trim().toLowerCase();

        return requests.filter((item) => {
            if (modeFilter && item.type !== modeFilter) return false;

            if (query) {
                const haystack =
                    `${item.schoolName} ${item.slName ?? ''}`.toLowerCase();
                if (!haystack.includes(query)) return false;
            }

            if (month && !item.startDate.includes(`-${month}-`)) return false;
            if (year && !item.startDate.startsWith(year)) return false;

            return true;
        });
    }, [requests, search, modeFilter, month, year]);

    const filteredTournaments = useMemo(() => {
        const query = search.trim().toLowerCase();

        return tournaments.filter((item) => {
            if (item.status !== statusTab) return false;
            if (modeFilter && item.mode !== modeFilter) return false;

            if (query) {
                const haystack =
                    `${item.title} ${item.schoolName ?? ''}`.toLowerCase();
                if (!haystack.includes(query)) return false;
            }

            if (month && !item.startDate.includes(`-${month}-`)) return false;
            if (year && !item.startDate.startsWith(year)) return false;

            return true;
        });
    }, [tournaments, statusTab, search, modeFilter, month, year]);

    const showSuccess = useCallback((message, description = '') => {
        setSuccessMessage(message);
        setSuccessDescription(description);
        setSuccessOpen(true);
    }, []);

    const openApprove = useCallback((request) => {
        setActiveRequest(request);
        setConfirmAction('approve');
        setConfirmOpen(true);
    }, []);

    const openReject = useCallback((request) => {
        setActiveRequest(request);
        setConfirmAction('reject');
        setConfirmOpen(true);
    }, []);

    const cancelConfirm = useCallback(() => {
        setConfirmOpen(false);
        setActiveRequest(null);
        setConfirmAction(null);
    }, []);

    const handleConfirmAction = useCallback(() => {
        if (!activeRequest || !confirmAction) return;

        const isApprove = confirmAction === 'approve';
        const requestId = activeRequest.id;
        const isPersisted =
            typeof requestId === 'number' ||
            !String(requestId).startsWith('sl-req-');

        if (isPersisted) {
            router.post(
                `/campus-tournaments/${requestId}/${isApprove ? 'approve' : 'reject'}`,
                {
                    reason: isApprove
                        ? 'Approved by Regional Admin'
                        : 'Rejected by Regional Admin',
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setConfirmOpen(false);
                        setActiveRequest(null);
                        setConfirmAction(null);
                        showSuccess(
                            isApprove
                                ? 'Tournament Approved Successfully!'
                                : 'Tournament Rejected',
                            isApprove
                                ? 'The tournament request has been approved and is now available for student registration'
                                : 'The tournament request has been rejected.',
                        );
                    },
                    onError: (errors) => console.error(errors),
                },
            );
            return;
        }

        setRequests((prev) =>
            prev.filter((item) => item.id !== activeRequest.id),
        );

        if (confirmAction === 'approve') {
            setTournaments((prev) => [
                {
                    id: `ra-up-${Date.now()}`,
                    title: `${activeRequest.schoolName.toUpperCase()} TOURNAMENT`,
                    schoolName: activeRequest.schoolName,
                    startDate: activeRequest.startDate,
                    endDate: activeRequest.endDate,
                    mode: activeRequest.type,
                    status: 'upcoming',
                    verifiedTeams: 0,
                    pendingTeams: 0,
                    totalRegistration: 0,
                },
                ...prev,
            ]);
            showSuccess(
                'Tournament Approved Successfully!',
                'The tournament request has been approved and is now available for student registration',
            );
        } else {
            showSuccess(
                'Tournament Rejected',
                'The tournament request has been rejected.',
            );
        }

        setConfirmOpen(false);
        setActiveRequest(null);
        setConfirmAction(null);
    }, [activeRequest, confirmAction, showSuccess]);

    const handleReschedule = useCallback(
        (values) => {
            if (!rescheduleTarget) return;
            setRescheduleError(null);

            const applyLocally = () => {
                setTournaments((prev) =>
                    prev.map((item) =>
                        item.id === rescheduleTarget.id
                            ? {
                                  ...item,
                                  startDate: values.startDate,
                                  endDate: values.endDate,
                                  mode: values.mode,
                              }
                            : item,
                    ),
                );
                setRescheduleTarget(null);
                showSuccess(
                    'Tournament Updated Successfully!',
                    'The new schedule has been saved.',
                );
            };

            if (
                typeof rescheduleTarget.id === 'string' &&
                rescheduleTarget.id.startsWith('ra-')
            ) {
                applyLocally();
                return;
            }

            router.put(
                `/campus-tournaments/${rescheduleTarget.id}/resubmit`,
                {
                    ...values,
                    resubmission_reason: 'Rescheduled by Regional Admin.',
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setRescheduleTarget(null);
                        setRescheduleError(null);
                        showSuccess(
                            'Tournament Updated Successfully!',
                            'The new schedule has been saved.',
                        );
                    },
                    onError: (errors) => {
                        console.error(errors);
                        setRescheduleError(
                            Object.values(errors || {})[0] ||
                                'Failed to reschedule this tournament.',
                        );
                    },
                },
            );
        },
        [rescheduleTarget, showSuccess],
    );

    const confirmDelete = useCallback(() => {
        if (!deleteTarget) return;

        const removeLocally = () => {
            setTournaments((prev) =>
                prev.filter((item) => item.id !== deleteTarget.id),
            );
            setDeleteTarget(null);
            showSuccess('Data has been deleted!');
        };

        if (
            typeof deleteTarget.id === 'string' &&
            deleteTarget.id.startsWith('ra-')
        ) {
            removeLocally();
            return;
        }

        router.delete(`/campus-tournaments/${deleteTarget.id}`, {
            data: { reason: 'Cancelled by Regional Admin' },
            preserveScroll: true,
            onSuccess: () => {
                setDeleteTarget(null);
                showSuccess('Data has been deleted!');
            },
            onError: removeLocally,
        });
    }, [deleteTarget, showSuccess]);

    const handleMarkReviewed = useCallback((tournamentId) => {
        setTournaments((prev) =>
            prev.map((item) =>
                item.id === tournamentId
                    ? {
                          ...item,
                          reviewed: true,
                          reviewedBy: item.reviewedBy ?? 'RA Jenard',
                      }
                    : item,
            ),
        );
        setViewTournament((prev) =>
            prev && prev.id === tournamentId
                ? {
                      ...prev,
                      reviewed: true,
                      reviewedBy: prev.reviewedBy ?? 'RA Jenard',
                  }
                : prev,
        );
    }, []);

    return (
        <MainLayout fullWidth>
            <Head title="Campus Tournament — Regional Admin" />

            <div className="min-h-screen bg-[#0a0a0a] px-4 py-8 text-white sm:px-6 sm:py-10 lg:px-8">
                <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
                    <CampusTournamentPageHeader />

                    <div className="space-y-4 rounded-xl border border-neutral-800 bg-[#111111] p-4 sm:p-5">
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                            <div className="inline-flex w-full flex-wrap gap-1 rounded-xl bg-[#0a0a0a] p-1 sm:w-auto">
                                {SL_MANAGEMENT_TABS.map((tab) => {
                                    const isActive = statusTab === tab.id;
                                    const count = tabCounts[tab.id] ?? 0;

                                    return (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            onClick={() => {
                                                setStatusTab(tab.id);
                                                setTournamentPage(1);
                                                setRequestPage(1);
                                            }}
                                            className={`inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors sm:flex-none sm:px-4 ${
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
                                        onChange={(event) =>
                                            setSearch(event.target.value)
                                        }
                                        placeholder="Search School"
                                        className={SEARCH_CLASS}
                                    />
                                </div>

                                <select
                                    value={month}
                                    onChange={(event) =>
                                        setMonth(event.target.value)
                                    }
                                    className={SELECT_CLASS}
                                    aria-label="Filter by month"
                                >
                                    {MONTH_OPTIONS.map((option) => (
                                        <option
                                            key={option.label}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={year}
                                    onChange={(event) =>
                                        setYear(event.target.value)
                                    }
                                    className={SELECT_CLASS}
                                    aria-label="Filter by year"
                                >
                                    {YEAR_OPTIONS.map((option) => (
                                        <option
                                            key={option.label}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={modeFilter}
                                    onChange={(event) =>
                                        setModeFilter(event.target.value)
                                    }
                                    className={SELECT_CLASS}
                                    aria-label="Filter by type"
                                >
                                    {MODE_OPTIONS.map((option) => (
                                        <option
                                            key={option.value || 'all'}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {statusTab === 'requests' ? (
                            <section className="space-y-4">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h2 className="text-lg font-bold text-yellow-500 sm:text-xl">
                                                Tournament Requests
                                            </h2>
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-500/40 bg-yellow-500/10 px-2.5 py-0.5 text-xs font-semibold text-yellow-500">
                                                <Hourglass className="h-3.5 w-3.5" />
                                                {filteredRequests.length}{' '}
                                                {filteredRequests.length === 1
                                                    ? 'Request'
                                                    : 'Requests'}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-400">
                                            Approve or reject each request.
                                            Approved tournaments will appear on
                                            the Campus Tournament Page.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setReportOpen(true)}
                                        className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-lg bg-yellow-500 px-4 text-sm font-bold text-black transition-colors hover:bg-yellow-400"
                                    >
                                        <FileSpreadsheet className="h-4 w-4" />
                                        Export to Excel
                                    </button>
                                </div>

                                {filteredRequests.length > 0 ? (
                                    <TournamentRequestTable
                                        requests={filteredRequests}
                                        onApprove={openApprove}
                                        onReject={openReject}
                                        page={requestPage}
                                        onPageChange={setRequestPage}
                                    />
                                ) : (
                                    <p className="rounded-lg border border-dashed border-neutral-800 py-8 text-center text-sm text-gray-500">
                                        No pending tournament requests.
                                    </p>
                                )}
                            </section>
                        ) : (
                            <section className="space-y-4">
                                <h2 className="text-lg font-bold text-yellow-500 sm:text-xl">
                                    {SECTION_TITLES[statusTab]}
                                </h2>

                                <div className="space-y-3">
                                    {filteredTournaments.length === 0 ? (
                                        <p className="rounded-xl border border-dashed border-neutral-800 py-12 text-center text-sm text-gray-500">
                                            No tournaments found for this
                                            filter.
                                        </p>
                                    ) : (
                                        filteredTournaments.map(
                                            (tournament) => (
                                                <ManagedTournamentCard
                                                    key={tournament.id}
                                                    tournament={tournament}
                                                    onView={setViewTournament}
                                                    onReschedule={
                                                        setRescheduleTarget
                                                    }
                                                    onDelete={setDeleteTarget}
                                                />
                                            ),
                                        )
                                    )}
                                </div>

                                {filteredTournaments.length > 0 ? (
                                    <div className="flex items-center justify-between gap-3 pt-2">
                                        <button
                                            type="button"
                                            disabled={tournamentPage <= 1}
                                            onClick={() =>
                                                setTournamentPage((prev) =>
                                                    Math.max(1, prev - 1),
                                                )
                                            }
                                            className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-yellow-500 text-black disabled:cursor-not-allowed disabled:opacity-50"
                                            aria-label="Previous page"
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </button>
                                        <p className="text-sm font-medium text-white">
                                            Page {tournamentPage} of{' '}
                                            {tournamentTotalPages}
                                        </p>
                                        <button
                                            type="button"
                                            disabled={
                                                tournamentPage >=
                                                tournamentTotalPages
                                            }
                                            onClick={() =>
                                                setTournamentPage((prev) =>
                                                    Math.min(
                                                        tournamentTotalPages,
                                                        prev + 1,
                                                    ),
                                                )
                                            }
                                            className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-yellow-500 text-black disabled:cursor-not-allowed disabled:opacity-50"
                                            aria-label="Next page"
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    </div>
                                ) : null}
                            </section>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmActionModal
                isOpen={confirmOpen}
                onCancel={cancelConfirm}
                onConfirm={handleConfirmAction}
                actionLabel={confirmAction ?? 'approve'}
                subjectName={activeRequest?.schoolName ?? 'this school'}
                stackedButtons={false}
            />

            <CreateTournamentModal
                isOpen={rescheduleTarget != null}
                mode="edit"
                initialValues={rescheduleTarget}
                error={rescheduleError}
                onClose={() => {
                    setRescheduleTarget(null);
                    setRescheduleError(null);
                }}
                onSubmit={handleReschedule}
            />

            <DeleteConfirmationModal
                isOpen={deleteTarget != null}
                onCancel={() => setDeleteTarget(null)}
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
                    showSuccess(
                        'Report downloaded',
                        'Tournament results export has been prepared.',
                    );
                }}
            />

            <ViewTournamentModal
                isOpen={viewTournament != null}
                tournament={viewTournament}
                onClose={() => setViewTournament(null)}
                onMarkReviewed={handleMarkReviewed}
            />
        </MainLayout>
    );
}
