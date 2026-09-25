import CampusTournamentPageHeader from "@/Components/CampusTournament/CampusTournamentPageHeader";
import ConfirmActionModal from "@/Components/CampusTournament/ConfirmActionModal";
import CreateTournamentModal from "@/Components/CampusTournament/CreateTournamentModal";
import ManagedTournamentCard from "@/Components/CampusTournament/ManagedTournamentCard";
import TournamentRequestTable from "@/Components/CampusTournament/TournamentRequestTable";
import DeleteConfirmationModal from "@/Components/Admin/DeleteConfirmationModal";
import SuccessModal from "@/Components/Admin/SuccessModal";
import {
    INITIAL_RA_MANAGED_TOURNAMENTS,
    INITIAL_SL_TOURNAMENT_REQUESTS,
    MONTH_OPTIONS,
    TOURNAMENT_STATUS_TABS,
    YEAR_OPTIONS,
} from "@/data/campusTournamentData";
import MainLayout from "@/Layouts/MainLayout";
import { Head, router } from "@inertiajs/react";
import { Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

/** The controller sends roster teams, so registration stats are derived here. */
function withRegistrationStats(tournament) {
    const rosterTeams = tournament.rosterTeams ?? [];

    return {
        ...tournament,
        verifiedTeams:
            tournament.verifiedTeams ??
            rosterTeams.filter((team) => team.status === "confirmed").length,
        pendingTeams:
            tournament.pendingTeams ??
            rosterTeams.filter((team) => team.status !== "confirmed").length,
        totalRegistration: tournament.totalRegistration ?? rosterTeams.length,
    };
}

const SEARCH_CLASS =
    "w-full min-h-[44px] rounded-lg border border-neutral-800 bg-[#1a1a1a] py-2.5 pl-10 pr-4 text-base text-white placeholder:text-gray-500 focus:ring-2 focus:ring-yellow-500 focus:outline-none md:text-sm";

const SELECT_CLASS =
    "min-h-[44px] w-full rounded-lg border border-neutral-800 bg-[#1a1a1a] px-3 py-2.5 text-base text-white outline-none focus:ring-2 focus:ring-yellow-500 md:w-auto md:min-w-[120px] md:text-sm";

/**
 * Regional Admin view — approves incoming SL tournament requests and manages
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

    const [statusTab, setStatusTab] = useState("ongoing");
    const [search, setSearch] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [showOnline, setShowOnline] = useState(true);
    const [showOnsite, setShowOnsite] = useState(true);
    const [requestPage, setRequestPage] = useState(1);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [activeRequest, setActiveRequest] = useState(null);

    const [rescheduleTarget, setRescheduleTarget] = useState(null);
    const [rescheduleError, setRescheduleError] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const [successOpen, setSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [successDescription, setSuccessDescription] = useState("");

    const tabCounts = useMemo(
        () => ({
            upcoming: tournaments.filter((item) => item.status === "upcoming")
                .length,
            ongoing: tournaments.filter((item) => item.status === "ongoing")
                .length,
            completed: tournaments.filter((item) => item.status === "completed")
                .length,
        }),
        [tournaments],
    );

    const filteredTournaments = useMemo(() => {
        const query = search.trim().toLowerCase();

        return tournaments.filter((item) => {
            if (item.status !== statusTab) return false;
            if (item.mode === "Online" && !showOnline) return false;
            if (item.mode === "Onsite" && !showOnsite) return false;

            if (query) {
                const haystack =
                    `${item.title} ${item.schoolName ?? ""}`.toLowerCase();
                if (!haystack.includes(query)) return false;
            }

            if (month && !item.startDate.includes(`-${month}-`)) return false;
            if (year && !item.startDate.startsWith(year)) return false;

            return true;
        });
    }, [tournaments, statusTab, search, showOnline, showOnsite, month, year]);

    const showSuccess = useCallback((message, description = "") => {
        setSuccessMessage(message);
        setSuccessDescription(description);
        setSuccessOpen(true);
    }, []);

    const openApprove = useCallback((request) => {
        setActiveRequest(request);
        setConfirmAction("approve");
        setConfirmOpen(true);
    }, []);

    const openReject = useCallback((request) => {
        setActiveRequest(request);
        setConfirmAction("reject");
        setConfirmOpen(true);
    }, []);

    const cancelConfirm = useCallback(() => {
        setConfirmOpen(false);
        setActiveRequest(null);
        setConfirmAction(null);
    }, []);

    const handleConfirmAction = useCallback(() => {
        if (!activeRequest || !confirmAction) return;

        const isApprove = confirmAction === "approve";
        const requestId = activeRequest.id;
        const isPersisted =
            typeof requestId === "number" ||
            !String(requestId).startsWith("sl-req-");

        if (isPersisted) {
            router.post(
                `/campus-tournaments/${requestId}/${isApprove ? "approve" : "reject"}`,
                {
                    reason: isApprove
                        ? "Approved by Regional Admin"
                        : "Rejected by Regional Admin",
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setConfirmOpen(false);
                        setActiveRequest(null);
                        setConfirmAction(null);
                        showSuccess(
                            isApprove
                                ? "Tournament Approved Successfully!"
                                : "Tournament Rejected",
                            isApprove
                                ? "The tournament request has been approved and is now available for student registration"
                                : "The tournament request has been rejected.",
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

        if (confirmAction === "approve") {
            setTournaments((prev) => [
                {
                    id: `ra-up-${Date.now()}`,
                    title: `${activeRequest.schoolName.toUpperCase()} TOURNAMENT`,
                    schoolName: activeRequest.schoolName,
                    startDate: activeRequest.startDate,
                    endDate: activeRequest.endDate,
                    mode: activeRequest.type,
                    status: "upcoming",
                    verifiedTeams: 0,
                    pendingTeams: 0,
                    totalRegistration: 0,
                },
                ...prev,
            ]);
            showSuccess(
                "Tournament Approved Successfully!",
                "The tournament request has been approved and is now available for student registration",
            );
        } else {
            showSuccess(
                "Tournament Rejected",
                "The tournament request has been rejected.",
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
                    "Tournament Updated Successfully!",
                    "The new schedule has been saved.",
                );
            };

            if (
                typeof rescheduleTarget.id === "string" &&
                rescheduleTarget.id.startsWith("ra-")
            ) {
                applyLocally();
                return;
            }

            router.put(
                `/campus-tournaments/${rescheduleTarget.id}/resubmit`,
                {
                    ...values,
                    resubmission_reason: "Rescheduled by Regional Admin.",
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setRescheduleTarget(null);
                        setRescheduleError(null);
                        showSuccess(
                            "Tournament Updated Successfully!",
                            "The new schedule has been saved.",
                        );
                    },
                    onError: (errors) => {
                        console.error(errors);
                        setRescheduleError(
                            Object.values(errors || {})[0] ||
                                "Failed to reschedule this tournament.",
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
            showSuccess("Data has been deleted!");
        };

        if (
            typeof deleteTarget.id === "string" &&
            deleteTarget.id.startsWith("ra-")
        ) {
            removeLocally();
            return;
        }

        router.delete(`/campus-tournaments/${deleteTarget.id}`, {
            data: { reason: "Cancelled by Regional Admin" },
            preserveScroll: true,
            onSuccess: () => {
                setDeleteTarget(null);
                showSuccess("Data has been deleted!");
            },
            onError: removeLocally,
        });
    }, [deleteTarget, showSuccess]);

    return (
        <MainLayout fullWidth>
            <Head title="Campus Tournament — Regional Admin" />

            <div className="min-h-screen bg-[#0a0a0a] px-4 py-8 text-white sm:px-6 sm:py-10 lg:px-8">
                <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
                    <CampusTournamentPageHeader />

                    <section className="rounded-xl border border-neutral-800 bg-[#111111] p-4 sm:p-6">
                        <div className="mb-4 flex items-start justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-bold text-yellow-500 sm:text-xl">
                                    Tournament Requests
                                </h2>
                                {requests.length === 0 ? (
                                    <p className="mt-1 text-sm text-gray-400">
                                        No pending tournament requests.
                                    </p>
                                ) : null}
                            </div>
                            <p className="shrink-0 text-sm text-white">
                                {requests.length} Pending
                            </p>
                        </div>

                        {requests.length > 0 ? (
                            <TournamentRequestTable
                                requests={requests}
                                onApprove={openApprove}
                                onReject={openReject}
                                page={requestPage}
                                onPageChange={setRequestPage}
                            />
                        ) : null}
                    </section>

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
                                                    ? "bg-yellow-500 text-black"
                                                    : "text-gray-300 hover:text-white"
                                            }`}
                                        >
                                            {tab.label}
                                            <span
                                                className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold ${
                                                    isActive
                                                        ? "bg-black text-yellow-500"
                                                        : "bg-yellow-500 text-black"
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

                                <div className="flex items-center gap-4 px-1">
                                    {[
                                        {
                                            id: "ra-filter-online",
                                            label: "Online",
                                            checked: showOnline,
                                            onChange: setShowOnline,
                                        },
                                        {
                                            id: "ra-filter-onsite",
                                            label: "Onsite",
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
                                                    filter.onChange(
                                                        event.target.checked,
                                                    )
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
                                    <ManagedTournamentCard
                                        key={tournament.id}
                                        tournament={tournament}
                                        onView={(item) =>
                                            router.visit(
                                                item.status === "completed"
                                                    ? `/campus-tournaments/${item.id}/report`
                                                    : `/campus-tournaments/${item.id}/ongoing`,
                                            )
                                        }
                                        onReschedule={setRescheduleTarget}
                                        onDelete={setDeleteTarget}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmActionModal
                isOpen={confirmOpen}
                onCancel={cancelConfirm}
                onConfirm={handleConfirmAction}
                actionLabel={confirmAction ?? "approve"}
                subjectName={activeRequest?.schoolName ?? "this school"}
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
        </MainLayout>
    );
}
