import { Head } from "@inertiajs/react";
import { Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import AdminLayout from "@/Layouts/AdminLayout";
import DeleteConfirmationModal from "@/Components/Admin/DeleteConfirmationModal";
import RegistrationModal from "@/Components/Admin/RegistrationModal";
import RegistrationTable from "@/Components/Admin/RegistrationTable";
import SectionCard from "@/Components/Admin/SectionCard";
import SuccessModal from "@/Components/Admin/SuccessModal";
import {
    COMPLETED_REGISTRATION_ITEMS,
    REGISTRATION_ITEMS,
    REGISTRATION_PAGE_SIZE,
} from "@/data/adminRegistrationData";

function normalizeRegistration(registration, index, prefix) {
    const record = registration ?? {};

    return {
        id: record.id ?? `${prefix}-${index + 1}`,
        eventCode: record.eventCode ?? record.event_code ?? "",
        eventName: record.eventName ?? record.event_name ?? "",
        startDate: record.startDate ?? record.start_date ?? "",
        endDate: record.endDate ?? record.end_date ?? "",
        responseUrl:
            record.responseUrl ?? record.response_url ?? record.response ?? "",
    };
}

function getInitialRows(source, fallback, prefix) {
    const rows = Array.isArray(source) && source.length > 0 ? source : fallback;

    return rows.map((row, index) => normalizeRegistration(row, index, prefix));
}

function filterRegistrations(rows, search) {
    const query = search.trim().toLowerCase();

    if (!query) {
        return rows;
    }

    return rows.filter((registration) =>
        [
            registration.eventCode,
            registration.eventName,
            registration.responseUrl,
        ]
            .join(" ")
            .toLowerCase()
            .includes(query),
    );
}

function SearchInput({ value, onChange, label }) {
    return (
        <label className="relative block w-full min-w-0 sm:w-[196px]">
            <span className="sr-only">{label}</span>

            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

            <input
                type="search"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder="Search..."
                aria-label={label}
                className="h-9 w-full rounded-lg border border-white/[0.04] bg-[#1A1A1A] pl-9 pr-3 text-xs text-white outline-none placeholder:text-gray-600 transition focus:border-[#FBBF24] focus:ring-1 focus:ring-[#FBBF24]"
            />
        </label>
    );
}

export default function RegistrationManagement({
    registrations: registrationProp = [],
    completedRegistrations: completedProp = [],
}) {
    const [registrations, setRegistrations] = useState(() =>
        getInitialRows(registrationProp, REGISTRATION_ITEMS, "registration"),
    );

    const [completedRegistrations] = useState(() =>
        getInitialRows(
            completedProp,
            COMPLETED_REGISTRATION_ITEMS,
            "completed-registration",
        ),
    );

    const [registrationSearch, setRegistrationSearch] = useState("");
    const [completedSearch, setCompletedSearch] = useState("");

    const [registrationPage, setRegistrationPage] = useState(1);
    const [completedPage, setCompletedPage] = useState(1);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingRegistration, setEditingRegistration] = useState(null);
    const [pendingDelete, setPendingDelete] = useState(null);

    const [successOpen, setSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [copiedCode, setCopiedCode] = useState(null);

    const filteredRegistrations = useMemo(
        () => filterRegistrations(registrations, registrationSearch),
        [registrationSearch, registrations],
    );

    const filteredCompletedRegistrations = useMemo(
        () => filterRegistrations(completedRegistrations, completedSearch),
        [completedRegistrations, completedSearch],
    );

    const registrationPageCount = Math.max(
        1,
        Math.ceil(filteredRegistrations.length / REGISTRATION_PAGE_SIZE),
    );

    const completedPageCount = Math.max(
        1,
        Math.ceil(
            filteredCompletedRegistrations.length / REGISTRATION_PAGE_SIZE,
        ),
    );

    const pagedRegistrations = useMemo(() => {
        const start = (registrationPage - 1) * REGISTRATION_PAGE_SIZE;

        return filteredRegistrations.slice(
            start,
            start + REGISTRATION_PAGE_SIZE,
        );
    }, [filteredRegistrations, registrationPage]);

    const pagedCompletedRegistrations = useMemo(() => {
        const start = (completedPage - 1) * REGISTRATION_PAGE_SIZE;

        return filteredCompletedRegistrations.slice(
            start,
            start + REGISTRATION_PAGE_SIZE,
        );
    }, [completedPage, filteredCompletedRegistrations]);

    useEffect(() => {
        setRegistrationPage(1);
    }, [registrationSearch]);

    useEffect(() => {
        setCompletedPage(1);
    }, [completedSearch]);

    useEffect(() => {
        setRegistrationPage((page) => Math.min(page, registrationPageCount));
    }, [registrationPageCount]);

    useEffect(() => {
        setCompletedPage((page) => Math.min(page, completedPageCount));
    }, [completedPageCount]);

    const openCreateModal = () => {
        setEditingRegistration(null);
        setModalOpen(true);
    };

    const openEditModal = (registration) => {
        setEditingRegistration(registration);
        setModalOpen(true);
    };

    const closeRegistrationModal = () => {
        setEditingRegistration(null);
        setModalOpen(false);
    };

    const handleRegistrationSubmit = (values) => {
        const isEditing = Boolean(editingRegistration);

        const nextRegistration = normalizeRegistration(
            {
                ...values,
                id: editingRegistration?.id ?? `registration-${Date.now()}`,
            },
            0,
            "registration",
        );

        setRegistrations((current) =>
            isEditing
                ? current.map((registration) =>
                      registration.id === nextRegistration.id
                          ? nextRegistration
                          : registration,
                  )
                : [nextRegistration, ...current],
        );

        setRegistrationPage(1);
        closeRegistrationModal();
        setSuccessMessage(
            isEditing
                ? "Registration updated successfully."
                : "Registration created successfully.",
        );
        setSuccessOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!pendingDelete) {
            return;
        }

        setRegistrations((current) =>
            current.filter(
                (registration) => registration.id !== pendingDelete.id,
            ),
        );

        setPendingDelete(null);
        setSuccessMessage("Registration deleted successfully.");
        setSuccessOpen(true);
    };

    const handleCopy = async (eventCode) => {
        if (
            typeof navigator === "undefined" ||
            !navigator.clipboard?.writeText
        ) {
            return;
        }

        try {
            await navigator.clipboard.writeText(eventCode);
            setCopiedCode(eventCode);

            window.setTimeout(() => {
                setCopiedCode((current) =>
                    current === eventCode ? null : current,
                );
            }, 1500);
        } catch {
            setCopiedCode(null);
        }
    };

    return (
        <AdminLayout activeNavId="registration-management">
            <Head title="Registration Management" />

            <div className="min-w-0 max-w-full overflow-x-hidden">
                <h1 className="mb-6 font-heading text-2xl font-bold tracking-tight text-[#FFFBEB] sm:mb-10 sm:text-4xl">
                    Registration Management
                </h1>

                <SectionCard
                    title="Registration"
                    headerRight={
                        <div className="flex w-full min-w-0 items-center gap-2 sm:w-auto">
                            <SearchInput
                                value={registrationSearch}
                                onChange={setRegistrationSearch}
                                label="Search registrations"
                            />

                            <button
                                type="button"
                                onClick={openCreateModal}
                                className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#FBBF24] px-3 text-xs font-bold text-black transition hover:bg-[#FCD34D] sm:gap-2 sm:px-4"
                            >
                                <Plus className="h-4 w-4" />

                                <span className="hidden min-[420px]:inline">
                                    Create Registration
                                </span>

                                <span className="min-[420px]:hidden">
                                    Create
                                </span>
                            </button>
                        </div>
                    }
                >
                    <RegistrationTable
                        registrations={pagedRegistrations}
                        currentPage={registrationPage}
                        pageCount={registrationPageCount}
                        onPageChange={setRegistrationPage}
                        onEdit={openEditModal}
                        onDelete={setPendingDelete}
                        copiedCode={copiedCode}
                        onCopy={handleCopy}
                        emptyMessage="No registrations match your search."
                        paginationLabel="Registration pagination"
                    />
                </SectionCard>

                <SectionCard
                    title="Completed Registration"
                    headerRight={
                        <SearchInput
                            value={completedSearch}
                            onChange={setCompletedSearch}
                            label="Search completed registrations"
                        />
                    }
                >
                    <RegistrationTable
                        registrations={pagedCompletedRegistrations}
                        showActions={false}
                        currentPage={completedPage}
                        pageCount={completedPageCount}
                        onPageChange={setCompletedPage}
                        showMobileActions
                        showDates={false}
                    />
                </SectionCard>
            </div>

            <RegistrationModal
                isOpen={modalOpen}
                onClose={closeRegistrationModal}
                initialData={editingRegistration}
                onSubmit={handleRegistrationSubmit}
            />

            <DeleteConfirmationModal
                isOpen={Boolean(pendingDelete)}
                onCancel={() => setPendingDelete(null)}
                onConfirm={handleDeleteConfirm}
            />

            <SuccessModal
                isOpen={successOpen}
                onClose={() => setSuccessOpen(false)}
                message={successMessage}
            />
        </AdminLayout>
    );
}
