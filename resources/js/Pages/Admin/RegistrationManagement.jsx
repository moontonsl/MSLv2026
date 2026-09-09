import { Head } from "@inertiajs/react";
import { Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import DeleteConfirmationModal from "@/Components/Admin/DeleteConfirmationModal";
import RegistrationModal from "@/Components/Admin/RegistrationModal";
import RegistrationTable from "@/Components/Admin/RegistrationTable";
import SectionCard from "@/Components/Admin/SectionCard";
import SuccessModal from "@/Components/Admin/SuccessModal";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    MOCK_COMPLETED_REGISTRATIONS,
    MOCK_REGISTRATIONS,
    REGISTRATION_PAGE_SIZE,
} from "@/data/adminRegistrationData";

function cloneAssignedSchools(schools = []) {
    if (!Array.isArray(schools)) {
        return [];
    }

    return schools
        .map((school, index) => {
            if (typeof school === "string") {
                return {
                    id: school,
                    name: school,
                    regionId: "",
                    regionName: "",
                };
            }

            return {
                ...school,
                id: school.id ?? `assigned-school-${index}`,
                name: school.name ?? school.school ?? "",
                regionId: school.regionId ?? school.region_id ?? "",
                regionName:
                    school.regionName ??
                    school.region_name ??
                    school.region?.name ??
                    (typeof school.region === "string" ? school.region : ""),
            };
        })
        .filter((school) => school.name);
}

function normalizeRegistration(
    registration = {},
    index = 0,
    prefix = "attendance",
) {
    const attendanceLink =
        registration.attendanceLink ??
        registration.attendance_link ??
        registration.responseUrl ??
        registration.response_url ??
        "";

    return {
        ...registration,
        id: registration.id ?? `${prefix}-${index + 1}`,
        attendanceCode:
            registration.attendanceCode ?? registration.attendance_code ?? "",
        attendanceLink,
        activityName:
            registration.activityName ?? registration.activity_name ?? "",
        instructions:
            registration.instructions ?? registration.description ?? "",
        startDate: registration.startDate ?? registration.start_date ?? "",
        endDate: registration.endDate ?? registration.end_date ?? "",
        responseUrl:
            registration.responseUrl ??
            registration.response_url ??
            attendanceLink,
        assignedSchools: cloneAssignedSchools(
            registration.assignedSchools ?? registration.assigned_schools,
        ),
        attendanceLogo:
            registration.attendanceLogo ?? registration.attendance_logo ?? null,
        titleTextColor:
            registration.titleTextColor ??
            registration.title_text_color ??
            "#FFFFFFFF",
        subTextColor:
            registration.subTextColor ??
            registration.sub_text_color ??
            "#A1A1AAFF",
        formColor:
            registration.formColor ?? registration.form_color ?? "#000000FF",
        backgroundColor:
            registration.backgroundColor ??
            registration.background_color ??
            "#0A0A0AFF",
    };
}

function normalizeRegistrations(registrations, prefix) {
    if (!Array.isArray(registrations)) {
        return [];
    }

    return registrations.map((registration, index) =>
        normalizeRegistration(registration, index, prefix),
    );
}

function filterRegistrations(registrations, search) {
    const query = search.trim().toLowerCase();

    if (!query) {
        return registrations;
    }

    return registrations.filter((registration) =>
        [
            registration.attendanceCode,
            registration.activityName,
            registration.attendanceLink,
            registration.instructions,
        ]
            .join(" ")
            .toLowerCase()
            .includes(query),
    );
}

function createLocalId() {
    if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
    ) {
        return crypto.randomUUID();
    }

    return `attendance-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
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
    registrations: registrationProp,
    completedRegistrations: completedRegistrationProp,
}) {
    const [registrations, setRegistrations] = useState(() =>
        normalizeRegistrations(
            Array.isArray(registrationProp)
                ? registrationProp
                : MOCK_REGISTRATIONS,
            "attendance",
        ),
    );

    const [completedRegistrations, setCompletedRegistrations] = useState(() =>
        normalizeRegistrations(
            Array.isArray(completedRegistrationProp)
                ? completedRegistrationProp
                : MOCK_COMPLETED_REGISTRATIONS,
            "completed-attendance",
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

    useEffect(() => {
        if (!Array.isArray(registrationProp)) {
            return;
        }

        setRegistrations(
            normalizeRegistrations(registrationProp, "attendance"),
        );

        setRegistrationPage(1);
    }, [registrationProp]);

    useEffect(() => {
        if (!Array.isArray(completedRegistrationProp)) {
            return;
        }

        setCompletedRegistrations(
            normalizeRegistrations(
                completedRegistrationProp,
                "completed-attendance",
            ),
        );

        setCompletedPage(1);
    }, [completedRegistrationProp]);

    const filteredRegistrations = useMemo(
        () => filterRegistrations(registrations, registrationSearch),
        [registrations, registrationSearch],
    );

    const filteredCompleted = useMemo(
        () => filterRegistrations(completedRegistrations, completedSearch),
        [completedRegistrations, completedSearch],
    );

    const registrationPageCount = Math.max(
        1,
        Math.ceil(filteredRegistrations.length / REGISTRATION_PAGE_SIZE),
    );

    const completedPageCount = Math.max(
        1,
        Math.ceil(filteredCompleted.length / REGISTRATION_PAGE_SIZE),
    );

    const pagedRegistrations = useMemo(() => {
        const start = (registrationPage - 1) * REGISTRATION_PAGE_SIZE;

        return filteredRegistrations.slice(
            start,
            start + REGISTRATION_PAGE_SIZE,
        );
    }, [filteredRegistrations, registrationPage]);

    const pagedCompleted = useMemo(() => {
        const start = (completedPage - 1) * REGISTRATION_PAGE_SIZE;

        return filteredCompleted.slice(start, start + REGISTRATION_PAGE_SIZE);
    }, [completedPage, filteredCompleted]);

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

    const closeModal = () => {
        setEditingRegistration(null);
        setModalOpen(false);
    };

    const handleSubmit = (values) => {
        const isEditing = editingRegistration !== null;

        const nextRegistration = normalizeRegistration({
            ...editingRegistration,
            ...values,
            id: editingRegistration?.id ?? createLocalId(),
            responseUrl: values.responseUrl ?? values.attendanceLink,
        });

        setRegistrations((current) =>
            isEditing
                ? current.map((registration) =>
                      registration.id === nextRegistration.id
                          ? nextRegistration
                          : registration,
                  )
                : [nextRegistration, ...current],
        );

        setRegistrationSearch("");
        setRegistrationPage(1);
        closeModal();

        setSuccessMessage(
            isEditing
                ? "Registration updated successfully."
                : "Registration created successfully.",
        );

        setSuccessOpen(true);
    };

    const handleDelete = () => {
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

    const handleCopy = async (attendanceCode) => {
        if (
            typeof navigator === "undefined" ||
            !navigator.clipboard?.writeText
        ) {
            return;
        }

        try {
            await navigator.clipboard.writeText(attendanceCode);

            setCopiedCode(attendanceCode);

            window.setTimeout(() => {
                setCopiedCode((current) =>
                    current === attendanceCode ? null : current,
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
                    title="Attendance Registrations"
                    headerRight={
                        <div className="flex w-full min-w-0 items-center gap-2 sm:w-auto">
                            <SearchInput
                                value={registrationSearch}
                                onChange={setRegistrationSearch}
                                label="Search attendance registrations"
                            />

                            <button
                                type="button"
                                onClick={openCreateModal}
                                className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#FBBF24] px-3 text-xs font-bold text-black transition hover:bg-[#FCD34D] sm:px-4"
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
                        emptyMessage="No attendance registrations match your search."
                    />
                </SectionCard>

                <SectionCard
                    title="Completed Attendance"
                    headerRight={
                        <SearchInput
                            value={completedSearch}
                            onChange={setCompletedSearch}
                            label="Search completed attendance"
                        />
                    }
                >
                    <RegistrationTable
                        registrations={pagedCompleted}
                        showActions={false}
                        showDates={false}
                        currentPage={completedPage}
                        pageCount={completedPageCount}
                        onPageChange={setCompletedPage}
                        copiedCode={copiedCode}
                        onCopy={handleCopy}
                        emptyMessage="No completed attendance records match your search."
                    />
                </SectionCard>
            </div>

            <RegistrationModal
                isOpen={modalOpen}
                onClose={closeModal}
                initialData={editingRegistration}
                onSubmit={handleSubmit}
            />

            <DeleteConfirmationModal
                isOpen={pendingDelete !== null}
                onCancel={() => setPendingDelete(null)}
                onConfirm={handleDelete}
            />

            <SuccessModal
                isOpen={successOpen}
                onClose={() => setSuccessOpen(false)}
                message={successMessage}
            />
        </AdminLayout>
    );
}
