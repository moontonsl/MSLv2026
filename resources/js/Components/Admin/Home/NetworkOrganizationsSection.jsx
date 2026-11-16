import DeleteConfirmationModal from "@/Components/Admin/DeleteConfirmationModal";
import SuccessModal from "@/Components/Admin/SuccessModal";
import SectionCard from "@/Components/Admin/SectionCard";
import NetworkOrganizationModal from "./NetworkOrganizationModal";
import { ADMIN_GOLD_BUTTON_CLASS } from "@/Components/Admin/adminFormStyles";
import { router } from "@inertiajs/react";
import {
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    Globe,
    ImagePlus,
    Pencil,
    Plus,
    Search,
    Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 12;

export default function NetworkOrganizationsSection({ initialItems = [] }) {
    const [items, setItems] = useState(initialItems);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);
    const [successOpen, setSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        setItems(initialItems);
    }, [initialItems]);

    const filteredItems = useMemo(() => {
        const query = search.trim().toLowerCase();
        return items.filter((item) => {
            if (statusFilter === "active" && !item.is_active) return false;
            if (statusFilter === "inactive" && item.is_active) return false;
            if (!query) return true;
            return (
                (item.name ?? "").toLowerCase().includes(query) ||
                (item.link ?? "").toLowerCase().includes(query)
            );
        });
    }, [items, search, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filteredItems.slice(start, start + PAGE_SIZE);
    }, [filteredItems, currentPage]);

    const activeCount = useMemo(
        () => items.filter((item) => Boolean(item.is_active)).length,
        [items]
    );
    const inactiveCount = items.length - activeCount;

    const openAddModal = () => {
        setEditingItem(null);
        setModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setModalOpen(true);
    };

    const requestDelete = (id) => {
        setPendingDeleteId(id);
        setDeleteOpen(true);
    };

    const confirmDelete = () => {
        if (!pendingDeleteId) return;
        router.delete(route("admin.home-page.network-organizations.delete", pendingDeleteId), {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteOpen(false);
                setPendingDeleteId(null);
                setSuccessMessage("Network organization logo removed successfully.");
                setSuccessOpen(true);
            },
        });
    };

    const handleToggleActive = (item) => {
        router.post(
            route("admin.home-page.network-organizations.update", item.id),
            {
                name: item.name,
                link: item.link || null,
                order: item.order ?? 0,
                is_active: item.is_active ? 0 : 1,
            },
            { preserveScroll: true }
        );
    };

    const handleSubmit = (values) => {
        const payload = {
            name: values.name,
            link: values.link || null,
            order: values.order ?? 0,
            is_active: values.is_active ? 1 : 0,
        };

        if (values.logo instanceof File) {
            payload.logo = values.logo;
        }

        const options = {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setModalOpen(false);
                setEditingItem(null);
                setSuccessMessage(
                    editingItem
                        ? "Network organization updated successfully."
                        : "Network organization logo added successfully."
                );
                setSuccessOpen(true);
            },
        };

        if (editingItem) {
            router.post(
                route("admin.home-page.network-organizations.update", editingItem.id),
                { ...payload, _method: "POST" },
                options
            );
        } else {
            router.post(
                route("admin.home-page.network-organizations.store"),
                payload,
                options
            );
        }
    };

    return (
        <>
            <SectionCard
                title="MSL Network Organizations"
                description="Manage partner and campus organization logos displayed in the homepage marquee. Use search, filters, and pagination as your network roster grows."
                headerRight={
                    <button
                        type="button"
                        onClick={openAddModal}
                        className={ADMIN_GOLD_BUTTON_CLASS}
                    >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                        Add Organization
                    </button>
                }
            >
                        <div className="space-y-5">
                            {/* Search & Filter Toolbar */}
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="relative w-full sm:max-w-xs">
                                    <Search
                                        aria-hidden="true"
                                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
                                    />
                                    <input
                                        type="search"
                                        value={search}
                                        onChange={(e) => {
                                            setSearch(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        placeholder="Search organization or link..."
                                        aria-label="Search network organizations"
                                        className="w-full min-h-[40px] rounded-xl border border-neutral-800 bg-[#141417] py-2 pl-9 pr-3 text-sm text-white placeholder:text-neutral-500 focus:border-[#FBBF24] focus:outline-none focus:ring-1 focus:ring-[#FBBF24]"
                                    />
                                </div>

                                <div className="flex flex-wrap items-center gap-1.5">
                                    {[
                                        { id: "all", label: `All (${items.length})` },
                                        { id: "active", label: `Active (${activeCount})` },
                                        { id: "inactive", label: `Inactive (${inactiveCount})` },
                                    ].map((tab) => {
                                        const selected = statusFilter === tab.id;
                                        return (
                                            <button
                                                key={tab.id}
                                                type="button"
                                                onClick={() => {
                                                    setStatusFilter(tab.id);
                                                    setCurrentPage(1);
                                                }}
                                                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${selected
                                                        ? "bg-[#FBBF24]/15 text-[#FBBF24] border border-[#FBBF24]/40"
                                                        : "bg-[#141417] text-neutral-400 border border-neutral-800 hover:border-neutral-700 hover:text-white"
                                                    }`}
                                            >
                                                {tab.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                                        {/* Table or Empty State */}
                                        {items.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-800 py-12 text-center">
                                                <ImagePlus className="mb-3 h-10 w-10 text-neutral-600" aria-hidden="true" />
                                                <p className="text-sm text-neutral-400">
                                                    No network organization logos yet.
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={openAddModal}
                                                    className="mt-4 text-xs font-semibold text-[#FBBF24] hover:underline cursor-pointer"
                                                >
                                + Add First Organization Logo
                                                            </button>
                                                        </div>
                                                        ) : filteredItems.length === 0 ? (
                                                        <div className="rounded-xl border border-dashed border-neutral-800 py-10 text-center">
                                                            <p className="text-sm text-neutral-400">
                                                                No matching organizations found for your current search or filter.
                                                            </p>
                                                        </div>
                                                        ) : (
                                                        <div
                                                            tabIndex={0}
                                                            role="region"
                                                            aria-labelledby="network-orgs-table-caption"
                                                            className="network-orgs-table-wrapper rounded-xl border border-neutral-800 bg-[#141417] focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/50"
                                                        >
                                                            <table className="network-orgs-table w-full text-left text-sm">
                                                                <caption id="network-orgs-table-caption" className="sr-only">
                                                                    MSL Network Organizations directory
                                                                </caption>
                                                                <thead className="bg-[#1b1b20] text-xs font-bold uppercase tracking-wider text-neutral-400">
                                                                    <tr>
                                                                        <th scope="col" className="border-b border-neutral-800 px-4 py-3.5">
                                                                            Organization
                                                                        </th>
                                                                        <th scope="col" className="border-b border-neutral-800 px-4 py-3.5">
                                                                            Destination Link
                                                                        </th>
                                                                        <th scope="col" className="border-b border-neutral-800 px-4 py-3.5 whitespace-nowrap">
                                                                            Display Order
                                                                        </th>
                                                                        <th scope="col" className="border-b border-neutral-800 px-4 py-3.5 whitespace-nowrap">
                                                                            Status
                                                                        </th>
                                                                        <th scope="col" className="border-b border-neutral-800 px-4 py-3.5 text-right whitespace-nowrap">
                                                                            Actions
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="divide-y divide-neutral-800/70 text-neutral-200">
                                                                    {paginatedItems.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="transition-colors hover:bg-white/[0.02]"
                                        >
                                            {/* Sticky Row Header: Logo + Organization Name */}
                                            <th
                                                scope="row"
                                                className="px-4 py-3 font-semibold text-white whitespace-nowrap"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-11 w-14 shrink-0 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-950 p-1.5">
                                                        <img
                                                            src={item.logo_url || item.logo_path}
                                                            alt=""
                                                            className="max-h-full max-w-full object-contain"
                                                        />
                                                    </div>
                                                    <span className="max-w-[220px] truncate font-semibold text-white" title={item.name}>
                                                        {item.name}
                                                    </span>
                                                </div>
                                            </th>

                                            {/* Destination Link */}
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                {item.link ? (
                                                    <a
                                                        href={item.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        title={item.link}
                                                        className="inline-flex max-w-xs items-center gap-1.5 text-xs font-medium text-[#FBBF24] hover:underline"
                                                    >
                                                        <Globe className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                                        <span className="truncate">{item.link}</span>
                                                        <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                                                    </a>
                                                ) : (
                                                    <span className="text-xs italic text-neutral-500">
                                                        No link set
                                                    </span>
                                                )}
                                            </td>

                                            {/* Display Order */}
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="inline-flex items-center rounded-md border border-neutral-800 bg-neutral-900 px-2.5 py-0.5 text-xs font-semibold text-neutral-300">
                                                    #{item.order ?? 0}
                                                </span>
                                            </td>

                                                        {/* Status */}
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleToggleActive(item)}
                                                                title="Click to toggle Active / Inactive"
                                                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors cursor-pointer ${item.is_active
                                                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/20"
                                                                        : "bg-neutral-800 text-neutral-400 border border-neutral-700 hover:bg-neutral-700 hover:text-neutral-200"
                                                                    }`}
                                                            >
                                                                <span
                                                                    aria-hidden="true"
                                                                    className={`h-1.5 w-1.5 rounded-full ${item.is_active ? "bg-emerald-400" : "bg-neutral-500"
                                                                        }`}
                                                                />
                                                                {item.is_active ? "Active" : "Inactive"}
                                                            </button>
                                                        </td>

                                                            {/* Actions */}
                                                            <td className="px-4 py-3 text-right whitespace-nowrap">
                                                                <div className="inline-flex items-center justify-end gap-2">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => openEditModal(item)}
                                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 px-2.5 py-1.5 text-xs font-medium text-neutral-200 transition-colors hover:bg-neutral-800 hover:text-white cursor-pointer"
                                                                    >
                                                                        <Pencil className="h-3.5 w-3.5 text-[#FBBF24]" aria-hidden="true" />
                                                                        <span>Edit</span>
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => requestDelete(item.id)}
                                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/25 bg-red-500/10 px-2.5 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20 hover:text-red-300 cursor-pointer"
                                                                    >
                                                                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                                                                        <span>Delete</span>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                    ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}

                                        {/* Pagination Footer */}
                                        {filteredItems.length > 0 && (
                                            <div className="flex flex-col gap-3 border-t border-neutral-800/80 pt-4 text-xs text-neutral-400 sm:flex-row sm:items-center sm:justify-between">
                                                <span>
                                                    Showing{" "}
                                                    <strong className="text-white">
                                                        {(currentPage - 1) * PAGE_SIZE + 1}
                                                    </strong>
                                                    –
                                                    <strong className="text-white">
                                                        {Math.min(currentPage * PAGE_SIZE, filteredItems.length)}
                                                    </strong>{" "}
                                                    of <strong className="text-white">{filteredItems.length}</strong>{" "}
                                                    organization{filteredItems.length === 1 ? "" : "s"}
                                                </span>

                                                {totalPages > 1 && (
                                                    <nav
                                                        aria-label="Network organizations pagination"
                                                        className="flex items-center gap-1.5"
                                                    >
                                                        <button
                                                            type="button"
                                                            disabled={currentPage <= 1}
                                                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                                            className="inline-flex items-center gap-1 rounded-lg border border-neutral-800 bg-[#141417] px-2.5 py-1.5 font-semibold text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                                                        >
                                                            <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
                                                            Prev
                                                        </button>
                                                        <span className="px-2 font-semibold text-neutral-300">
                                                            Page {currentPage} of {totalPages}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            disabled={currentPage >= totalPages}
                                                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                                            className="inline-flex items-center gap-1 rounded-lg border border-neutral-800 bg-[#141417] px-2.5 py-1.5 font-semibold text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                                                        >
                                                            Next
                                                            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                                                        </button>
                        </nav>
                            )}
                    </div>
                )}
            </div>
        </SectionCard >

            <NetworkOrganizationModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditingItem(null);
                }}
                initialData={editingItem}
                onSubmit={handleSubmit}
            />

            <DeleteConfirmationModal
                isOpen={deleteOpen}
                onCancel={() => {
                    setDeleteOpen(false);
                    setPendingDeleteId(null);
                }}
                onConfirm={confirmDelete}
                message="Are you sure you want to remove this network organization logo from the homepage?"
            />

            <SuccessModal
                isOpen={successOpen}
                onClose={() => setSuccessOpen(false)}
                title="Success"
                message={successMessage}
            />
        </>
    );
}
