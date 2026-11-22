import CommunityDirectoryModal from "@/Components/Admin/Campus/CommunityDirectoryModal";
import DeleteConfirmationModal from "@/Components/Admin/DeleteConfirmationModal";
import SectionCard from "@/Components/Admin/SectionCard";
import SuccessModal from "@/Components/Admin/SuccessModal";
import { ADMIN_GOLD_BUTTON_CLASS } from "@/Components/Admin/adminFormStyles";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import {
    Award,
    Building2,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    Globe2,
    MapPin,
    Pencil,
    Plus,
    Search,
    Trash2,
    Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 12;

const TIER_BADGE_STYLES = {
    "Level III": "border-purple-400/40 bg-purple-500/15 text-purple-300",
    "Level II": "border-teal-400/40 bg-teal-500/15 text-teal-300",
    "Level I": "border-white/15 bg-white/5 text-gray-300",
};

export default function CommunityDirectory({
    entries = [],
    regions = [],
    tiers = [],
}) {
    const [items, setItems] = useState(entries);
    const [search, setSearch] = useState("");
    const [regionFilter, setRegionFilter] = useState("all");
    const [tierFilter, setTierFilter] = useState("all");
    const [visibilityFilter, setVisibilityFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [pendingDelete, setPendingDelete] = useState(null);

    const [successOpen, setSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        setItems(entries);
    }, [entries]);

    const availableRegions = useMemo(() => {
        const set = new Set([...regions, ...items.map((item) => item.region).filter(Boolean)]);
        return Array.from(set);
    }, [regions, items]);

    const filteredItems = useMemo(() => {
        const query = search.trim().toLowerCase();
        return items.filter((item) => {
            if (regionFilter !== "all" && item.region !== regionFilter) return false;
            if (tierFilter !== "all" && item.tier !== tierFilter) return false;
            if (visibilityFilter === "active" && !item.is_active) return false;
            if (visibilityFilter === "hidden" && item.is_active) return false;
            if (!query) return true;

            return [item.school, item.community, item.region, item.tier, item.href]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()
                .includes(query);
        });
    }, [items, search, regionFilter, tierFilter, visibilityFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));

    useEffect(() => {
        setCurrentPage(1);
    }, [search, regionFilter, tierFilter, visibilityFilter]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filteredItems.slice(start, start + PAGE_SIZE);
    }, [filteredItems, currentPage]);

    const stats = useMemo(() => {
        const activeCount = items.filter((i) => i.is_active).length;
        const totalMembers = items.reduce((sum, i) => sum + (Number(i.members) || 0), 0);
        const levelThreeCount = items.filter((i) => i.tier === "Level III").length;
        return {
            total: items.length,
            active: activeCount,
            hidden: items.length - activeCount,
            totalMembers,
            levelThreeCount,
        };
    }, [items]);

    const openAddModal = () => {
        setEditingItem(null);
        setFormErrors({});
        setModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setFormErrors({});
        setModalOpen(true);
    };

    const handleSubmit = (values) => {
        setProcessing(true);
        setFormErrors({});

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                setModalOpen(false);
                setEditingItem(null);
                setSuccessMessage(
                    editingItem
                        ? "Campus community updated successfully."
                        : "New campus community added to the directory."
                );
                setSuccessOpen(true);
            },
            onError: (errors) => {
                setFormErrors(errors || {});
            },
            onFinish: () => {
                setProcessing(false);
            },
        };

        if (editingItem) {
            router.put(
                route("admin.community-directory.update", editingItem.id),
                values,
                options
            );
        } else {
            router.post(route("admin.community-directory.store"), values, options);
        }
    };

    const handleToggleActive = (item) => {
        router.patch(
            route("admin.community-directory.toggle", item.id),
            {},
            { preserveScroll: true }
        );
    };

    const requestDelete = (item) => {
        setPendingDelete(item);
        setDeleteOpen(true);
    };

    const confirmDelete = () => {
        if (!pendingDelete) return;
        router.delete(route("admin.community-directory.delete", pendingDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteOpen(false);
                setPendingDelete(null);
                setSuccessMessage("Community directory entry removed successfully.");
                setSuccessOpen(true);
            },
        });
    };

    const isExternalLink = (href) => /^https?:\/\//i.test(href || "");

    return (
        <AdminLayout activeNavId="community-directory">
            <Head title="Community Directory — Campus Admin" />

            {/* Header */}
            <header className="mb-6 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-end lg:justify-between">
                <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-400">
                        Campus
                    </p>
                    <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                        Community Directory
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-gray-400">
                        Manage the official campus communities, accreditation levels, member counts, and Facebook group links shown on the public{" "}
                        <a
                            href="/Campus#community-directory"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-medium text-brand-400 hover:underline"
                        >
                            /Campus
                            <ExternalLink className="h-3.5 w-3.5" />
                        </a>{" "}
                        page.
                    </p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2.5">
                    <button
                        type="button"
                        onClick={openAddModal}
                        className={ADMIN_GOLD_BUTTON_CLASS}
                    >
                        <Plus className="h-4 w-4 shrink-0" />
                        Add Community
                    </button>
                </div>
            </header>

            {/* Metric Cards */}
            <div className="mb-6 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 xl:grid-cols-4 lg:gap-4">
                <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.08] to-transparent p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                            Total Communities
                        </span>
                        <Building2 className="h-5 w-5 shrink-0 text-amber-400" />
                    </div>
                    <p className="mt-3 text-2xl font-black text-white sm:text-3xl">
                        {stats.total}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                        {stats.active} visible · {stats.hidden} hidden
                    </p>
                </div>

                <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/[0.08] to-transparent p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                            Total Members
                        </span>
                        <Users className="h-5 w-5 shrink-0 text-blue-400" />
                    </div>
                    <p className="mt-3 text-2xl font-black text-white sm:text-3xl">
                        {stats.totalMembers.toLocaleString()}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                        Across all listed chapters
                    </p>
                </div>

                <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/[0.08] to-transparent p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                            Level III Chapters
                        </span>
                        <Award className="h-5 w-5 shrink-0 text-purple-400" />
                    </div>
                    <p className="mt-3 text-2xl font-black text-white sm:text-3xl">
                        {stats.levelThreeCount}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                        Top-tier accredited communities
                    </p>
                </div>

                <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.08] to-transparent p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                            Regions Covered
                        </span>
                        <Globe2 className="h-5 w-5 shrink-0 text-emerald-400" />
                    </div>
                    <p className="mt-3 text-2xl font-black text-white sm:text-3xl">
                        {availableRegions.length}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                        Nationwide campus clusters
                    </p>
                </div>
            </div>

            {/* Directory Table Section */}
            <SectionCard
                title="Directory Entries"
                description="Search, filter, reorder, and modify campus communities displayed in the public directory."
            >
                {/* Filter Bar */}
                <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-12">
                    <div className="relative md:col-span-5">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search school, community name, region, or link..."
                            className="min-h-[42px] w-full rounded-xl border border-white/10 bg-[#121215] py-2 pl-10 pr-4 text-xs text-white placeholder:text-gray-500 focus:border-brand-400/60 focus:outline-none"
                        />
                    </div>

                    <div className="md:col-span-3">
                        <select
                            value={regionFilter}
                            onChange={(e) => setRegionFilter(e.target.value)}
                            className="min-h-[42px] w-full rounded-xl border border-white/10 bg-[#121215] px-3.5 py-2 text-xs font-medium text-gray-200 focus:border-brand-400/60 focus:outline-none"
                        >
                            <option value="all">All Regions</option>
                            {availableRegions.map((reg) => (
                                <option key={reg} value={reg}>
                                    {reg}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <select
                            value={tierFilter}
                            onChange={(e) => setTierFilter(e.target.value)}
                            className="min-h-[42px] w-full rounded-xl border border-white/10 bg-[#121215] px-3.5 py-2 text-xs font-medium text-gray-200 focus:border-brand-400/60 focus:outline-none"
                        >
                            <option value="all">All Levels</option>
                            {tiers.map((tier) => (
                                <option key={tier} value={tier}>
                                    {tier}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <select
                            value={visibilityFilter}
                            onChange={(e) => setVisibilityFilter(e.target.value)}
                            className="min-h-[42px] w-full rounded-xl border border-white/10 bg-[#121215] px-3.5 py-2 text-xs font-medium text-gray-200 focus:border-brand-400/60 focus:outline-none"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Visible</option>
                            <option value="hidden">Hidden</option>
                        </select>
                    </div>
                </div>

                {/* Desktop Table */}
                <div className="hidden overflow-x-auto rounded-xl border border-white/10 md:block">
                    <table className="w-full border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/[0.03] text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                <th className="px-4 py-3.5">School / Community</th>
                                <th className="px-4 py-3.5">Region</th>
                                <th className="px-4 py-3.5">Status</th>
                                <th className="px-4 py-3.5">Members</th>
                                <th className="px-4 py-3.5">Join Link</th>
                                <th className="px-4 py-3.5 text-center">Visible</th>
                                <th className="px-4 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {paginatedItems.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-12 text-center text-sm text-gray-400"
                                    >
                                        No campus communities match your current filters.
                                    </td>
                                </tr>
                            ) : (
                                paginatedItems.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="transition-colors hover:bg-white/[0.03]"
                                    >
                                        <td className="px-4 py-3.5">
                                            <div className="font-semibold text-white">
                                                {item.school}
                                            </div>
                                            {item.community ? (
                                                <div className="mt-0.5 text-xs text-gray-400">
                                                    {item.community}
                                                </div>
                                            ) : null}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3.5 text-xs font-medium text-gray-300">
                                            {item.region}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3.5">
                                            <span
                                                className={`inline-flex rounded-md border px-2.5 py-1 text-[11px] font-bold uppercase ${
                                                    TIER_BADGE_STYLES[item.tier] ??
                                                    TIER_BADGE_STYLES["Level I"]
                                                }`}
                                            >
                                                {item.tier}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3.5 text-xs font-semibold text-gray-200">
                                            {Number(item.members || 0).toLocaleString()}
                                        </td>
                                        <td className="max-w-[200px] px-4 py-3.5 text-xs">
                                            {isExternalLink(item.href) ? (
                                                <a
                                                    href={item.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex max-w-full items-center gap-1.5 truncate text-blue-400 hover:text-blue-300 hover:underline"
                                                    title={item.href}
                                                >
                                                    <span className="truncate">{item.href}</span>
                                                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                                                </a>
                                            ) : (
                                                <span className="font-mono text-[11px] text-gray-500">
                                                    {item.href || "#accreditation"}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3.5 text-center">
                                            <button
                                                type="button"
                                                role="switch"
                                                aria-checked={item.is_active}
                                                aria-label={`Toggle visibility for ${item.school}`}
                                                onClick={() => handleToggleActive(item)}
                                                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                                                    item.is_active ? "bg-amber-400" : "bg-white/15"
                                                }`}
                                            >
                                                <span
                                                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                                                        item.is_active
                                                            ? "translate-x-4 bg-black"
                                                            : "translate-x-0"
                                                    }`}
                                                />
                                            </button>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3.5 text-right">
                                            <div className="inline-flex items-center gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => openEditModal(item)}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-gray-300 transition-colors hover:border-amber-400/50 hover:text-amber-300"
                                                    title="Edit community"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => requestDelete(item)}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-gray-300 transition-colors hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
                                                    title="Delete community"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card List */}
                <div className="space-y-3 md:hidden">
                    {paginatedItems.length === 0 ? (
                        <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-10 text-center text-sm text-gray-400">
                            No campus communities match your current filters.
                        </div>
                    ) : (
                        paginatedItems.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-sm font-bold text-white">
                                            {item.school}
                                        </h3>
                                        <p className="mt-0.5 text-xs text-gray-400">
                                            {item.community}
                                        </p>
                                    </div>
                                    <span
                                        className={`shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase ${
                                            TIER_BADGE_STYLES[item.tier] ??
                                            TIER_BADGE_STYLES["Level I"]
                                        }`}
                                    >
                                        {item.tier}
                                    </span>
                                </div>

                                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-300">
                                    <span className="inline-flex items-center gap-1.5">
                                        <MapPin className="h-3.5 w-3.5 text-blue-400" />
                                        {item.region}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <Users className="h-3.5 w-3.5 text-gray-500" />
                                        {Number(item.members || 0).toLocaleString()} members
                                    </span>
                                </div>

                                <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                                    <button
                                        type="button"
                                        onClick={() => handleToggleActive(item)}
                                        className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold ${
                                            item.is_active
                                                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                                                : "border-white/10 bg-white/5 text-gray-400"
                                        }`}
                                    >
                                        {item.is_active ? "Visible" : "Hidden"}
                                    </button>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => openEditModal(item)}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-gray-200 hover:border-amber-400/50 hover:text-amber-300"
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => requestDelete(item)}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {filteredItems.length > 0 && (
                    <div className="mt-5 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-4 sm:flex-row">
                        <p className="text-xs text-gray-400">
                            Showing{" "}
                            <span className="font-semibold text-white">
                                {(currentPage - 1) * PAGE_SIZE + 1}
                            </span>
                            –
                            <span className="font-semibold text-white">
                                {Math.min(currentPage * PAGE_SIZE, filteredItems.length)}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-white">
                                {filteredItems.length}
                            </span>{" "}
                            communities
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                disabled={currentPage <= 1}
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-xs font-semibold text-gray-200 transition-colors hover:border-amber-400/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Prev
                            </button>
                            <span className="px-2 text-xs font-semibold text-gray-300">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                type="button"
                                disabled={currentPage >= totalPages}
                                onClick={() =>
                                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                                }
                                className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-xs font-semibold text-gray-200 transition-colors hover:border-amber-400/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </SectionCard>

            {/* Add / Edit Modal */}
            <CommunityDirectoryModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                initialData={editingItem}
                regions={availableRegions}
                tiers={tiers}
                onSubmit={handleSubmit}
                processing={processing}
                errors={formErrors}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={deleteOpen}
                onClose={() => {
                    setDeleteOpen(false);
                    setPendingDelete(null);
                }}
                onConfirm={confirmDelete}
                title="Delete Campus Community"
                message={
                    pendingDelete
                        ? `Are you sure you want to remove "${pendingDelete.school}" (${pendingDelete.community}) from the Community Directory?`
                        : "Are you sure you want to remove this community?"
                }
            />

            {/* Success Modal */}
            <SuccessModal
                isOpen={successOpen}
                onClose={() => setSuccessOpen(false)}
                message={successMessage}
            />
        </AdminLayout>
    );
}
