import { Head } from "@inertiajs/react";
import { Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import AdminPagination from "@/Components/Admin/AdminPagination";
import DeleteConfirmationModal from "@/Components/Admin/DeleteConfirmationModal";
import RegionalAdminModal from "@/Components/Admin/RegionalAdminModal";
import RegionalAdminPage from "@/Components/Admin/RegionalAdminPage";
import SuccessModal from "@/Components/Admin/SuccessModal";
import AdminLayout from "@/Layouts/AdminLayout";

import {
    MOCK_REGIONAL_ADMINS,
    REGIONAL_ADMIN_PAGE_SIZE,
} from "@/data/adminRegionalAdminData";

function normalizeAssignedSchools(schools) {
    if (!Array.isArray(schools)) {
        return [];
    }

    return schools
        .map((school) => {
            if (typeof school === "string") {
                return school.trim();
            }

            return String(
                school?.name ?? school?.schoolName ?? school?.school_name ?? "",
            ).trim();
        })
        .filter(Boolean);
}

function normalizeRegionalAdmin(regionalAdmin = {}, index = 0) {
    return {
        ...regionalAdmin,
        id:
            regionalAdmin.id ??
            regionalAdmin.region_admin_id ??
            `regional-admin-${index + 1}`,
        fullName:
            regionalAdmin.fullName ??
            regionalAdmin.full_name ??
            regionalAdmin.name ??
            "",
        username: regionalAdmin.username ?? "",
        mslId: String(
            regionalAdmin.mslId ??
                regionalAdmin.msl_id ??
                regionalAdmin.id_number ??
                "",
        ),
        originalSchool:
            regionalAdmin.originalSchool ??
            regionalAdmin.original_school ??
            regionalAdmin.school ??
            "",
        assignedSchools: normalizeAssignedSchools(
            regionalAdmin.assignedSchools ?? regionalAdmin.assigned_schools,
        ),
    };
}

function normalizeRegionalAdmins(regionalAdmins) {
    if (!Array.isArray(regionalAdmins)) {
        return [];
    }

    return regionalAdmins.map(normalizeRegionalAdmin);
}

function createRegionalAdminId() {
    if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
    ) {
        return crypto.randomUUID();
    }

    return `regional-admin-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 9)}`;
}

export default function RegionalAdmin({ regionalAdmins }) {
    const [records, setRecords] = useState(() =>
        normalizeRegionalAdmins(
            Array.isArray(regionalAdmins)
                ? regionalAdmins
                : MOCK_REGIONAL_ADMINS,
        ),
    );

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedRegionalAdminId, setExpandedRegionalAdminId] =
        useState(null);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const [editingRegionalAdmin, setEditingRegionalAdmin] = useState(null);

    const [regionalAdminToDelete, setRegionalAdminToDelete] = useState(null);

    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (!Array.isArray(regionalAdmins)) {
            return;
        }

        setRecords(normalizeRegionalAdmins(regionalAdmins));
        setCurrentPage(1);
        setExpandedRegionalAdminId(null);
    }, [regionalAdmins]);

    const filteredRecords = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return records;
        }

        return records.filter((regionalAdmin) =>
            [
                regionalAdmin.fullName,
                regionalAdmin.username,
                regionalAdmin.mslId,
                regionalAdmin.originalSchool,
                ...regionalAdmin.assignedSchools,
            ]
                .join(" ")
                .toLowerCase()
                .includes(query),
        );
    }, [records, search]);

    const pageCount = Math.max(
        1,
        Math.ceil(filteredRecords.length / REGIONAL_ADMIN_PAGE_SIZE),
    );

    const activePage = Math.min(currentPage, pageCount);

    const recordPages = useMemo(
        () =>
            Array.from({ length: pageCount }, (_, pageIndex) =>
                filteredRecords.slice(
                    pageIndex * REGIONAL_ADMIN_PAGE_SIZE,
                    (pageIndex + 1) * REGIONAL_ADMIN_PAGE_SIZE,
                ),
            ),
        [filteredRecords, pageCount],
    );

    const pageWidth = `${100 / pageCount}%`;

    const trackOffset = `${((activePage - 1) * 100) / pageCount}%`;

    const unavailableMslIds = useMemo(
        () =>
            records
                .filter(
                    (regionalAdmin) =>
                        regionalAdmin.id !== editingRegionalAdmin?.id,
                )
                .map((regionalAdmin) => String(regionalAdmin.mslId)),
        [records, editingRegionalAdmin],
    );

    useEffect(() => {
        setCurrentPage(1);
        setExpandedRegionalAdminId(null);
    }, [search]);

    useEffect(() => {
        setCurrentPage((page) => Math.min(page, pageCount));
    }, [pageCount]);

    const goToPage = (page) => {
        const nextPage = Math.min(Math.max(Number(page) || 1, 1), pageCount);

        setCurrentPage(nextPage);
        setExpandedRegionalAdminId(null);
    };

    const handleToggle = (regionalAdminId) => {
        setExpandedRegionalAdminId((currentId) =>
            currentId === regionalAdminId ? null : regionalAdminId,
        );
    };

    const handleCreate = (values) => {
        const newRegionalAdmin = normalizeRegionalAdmin({
            id: createRegionalAdminId(),
            ...values,
        });

        /*
         * Replace this local state update with router.post()
         * when the Regional Admin backend endpoint is ready.
         */
        setRecords((currentRecords) => [newRegionalAdmin, ...currentRecords]);

        setSearch("");
        setCurrentPage(1);
        setIsCreateModalOpen(false);
        setSuccessMessage("Regional Admin Added Successfully!");
    };

    const handleUpdate = (values) => {
        if (!editingRegionalAdmin) {
            return;
        }

        const updatedRegionalAdmin = normalizeRegionalAdmin({
            ...editingRegionalAdmin,
            ...values,
            id: editingRegionalAdmin.id,
        });

        /*
         * Replace this local state update with router.put()
         * when the Regional Admin backend endpoint is ready.
         */
        setRecords((currentRecords) =>
            currentRecords.map((regionalAdmin) =>
                regionalAdmin.id === updatedRegionalAdmin.id
                    ? updatedRegionalAdmin
                    : regionalAdmin,
            ),
        );

        setEditingRegionalAdmin(null);
        setSuccessMessage("Regional Admin Updated Successfully!");
    };

    const handleDeleteConfirm = () => {
        if (!regionalAdminToDelete) {
            return;
        }

        /*
         * Replace this local state update with router.delete()
         * when the Regional Admin backend endpoint is ready.
         */
        setRecords((currentRecords) =>
            currentRecords.filter(
                (regionalAdmin) =>
                    regionalAdmin.id !== regionalAdminToDelete.id,
            ),
        );

        setRegionalAdminToDelete(null);
        setExpandedRegionalAdminId(null);
        setSuccessMessage("Regional Admin Deleted Successfully!");
    };

    return (
        <AdminLayout activeNavId="regional-admin">
            <Head title="Regional Admin" />

            <div className="min-w-0 max-w-full overflow-x-hidden">
                <h1 className="mb-6 font-heading text-xl font-bold tracking-tight text-[#FFFBEB] sm:mb-10 sm:text-4xl">
                    Regional Admin
                </h1>

                <section className="max-w-full overflow-hidden bg-[#0B0B0B] px-0 py-0 md:rounded-xl md:border md:border-white/[0.08] md:px-11 md:py-11">
                    <div className="mb-5 flex flex-col gap-4 sm:mb-8 md:flex-row md:items-center md:justify-between">
                        <h2 className="font-heading text-base font-bold text-[#FBBF24] sm:text-2xl">
                            Regional Admin
                        </h2>

                        <div className="flex w-full min-w-0 items-center gap-2 sm:gap-3 md:w-auto">
                            <div className="relative min-w-0 flex-1 md:w-[196px] md:flex-none">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

                                <input
                                    type="search"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search..."
                                    aria-label="Search regional administrators"
                                    className="h-9 w-full rounded-lg bg-[#1A1A1A] pl-9 pr-3 text-xs text-white outline-none placeholder:text-gray-600 focus:ring-1 focus:ring-[#FBBF24]"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(true)}
                                className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#FBBF24] px-3 text-xs font-bold text-black transition hover:bg-[#FCD34D] sm:gap-2 sm:px-4"
                            >
                                <Plus className="h-4 w-4" />

                                <span className="hidden min-[360px]:inline">
                                    Add Admin
                                </span>

                                <span className="min-[360px]:hidden">Add</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex min-h-[360px] flex-col md:min-h-[400px]">
                        <div className="flex-1 overflow-hidden">
                            <div
                                className="flex items-start transition-transform duration-300 ease-out motion-reduce:transition-none"
                                style={{
                                    width: `${pageCount * 100}%`,
                                    transform: `translate3d(-${trackOffset}, 0, 0)`,
                                }}
                            >
                                {recordPages.map((pageRecords, pageIndex) => {
                                    const pageNumber = pageIndex + 1;

                                    return (
                                        <div
                                            key={`regional-admin-page-${pageNumber}`}
                                            className="min-w-0 shrink-0"
                                            style={{
                                                flex: `0 0 ${pageWidth}`,
                                            }}
                                        >
                                            <RegionalAdminPage
                                                regionalAdmins={pageRecords}
                                                isActive={
                                                    pageNumber === activePage
                                                }
                                                expandedRegionalAdminId={
                                                    expandedRegionalAdminId
                                                }
                                                onToggle={handleToggle}
                                                onEdit={setEditingRegionalAdmin}
                                                onDelete={
                                                    setRegionalAdminToDelete
                                                }
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mt-auto max-w-full overflow-hidden border-t border-white/10 pt-4 md:pt-6">
                            <AdminPagination
                                currentPage={activePage}
                                pageCount={pageCount}
                                onChange={goToPage}
                                ariaLabel="Regional administrator pagination"
                            />
                        </div>
                    </div>
                </section>
            </div>

            <RegionalAdminModal
                isOpen={isCreateModalOpen}
                regionalAdmin={null}
                unavailableMslIds={unavailableMslIds}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreate}
            />

            <RegionalAdminModal
                isOpen={Boolean(editingRegionalAdmin)}
                regionalAdmin={editingRegionalAdmin}
                unavailableMslIds={unavailableMslIds}
                onClose={() => setEditingRegionalAdmin(null)}
                onSubmit={handleUpdate}
            />

            <DeleteConfirmationModal
                isOpen={Boolean(regionalAdminToDelete)}
                onCancel={() => setRegionalAdminToDelete(null)}
                onConfirm={handleDeleteConfirm}
            />

            <SuccessModal
                isOpen={Boolean(successMessage)}
                message={successMessage}
                onClose={() => setSuccessMessage("")}
            />
        </AdminLayout>
    );
}
