import ProgramModal, { PROGRAM_ICON_OPTIONS } from '@/Components/Admin/ProgramModal';
import DeleteConfirmationModal from '@/Components/Admin/DeleteConfirmationModal';
import SuccessModal from '@/Components/Admin/SuccessModal';
import { MODAL_ACTION_ICON_CLASS } from '@/Components/Admin/adminModalFormStyles';
import { ADMIN_GOLD_BUTTON_CLASS } from '@/Components/Admin/adminFormStyles';
import SectionCard from '@/Components/Admin/SectionCard';
import { router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    Bookmark,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    FolderKanban,
    Link2,
    Pencil,
    Plus,
    Search,
    Swords,
    Trash2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const PAGE_SIZE = 8;

const ICON_MAP = Object.fromEntries(
    PROGRAM_ICON_OPTIONS.map((opt) => [opt.value, opt.Icon]),
);

export default function ProgramsSection({
    programs: initialPrograms = [],
    bookmarkedCount: initialBookmarkedCount = 0,
    maxBookmarked = 5,
}) {
    const { props: pageProps } = usePage();
    const flashError = pageProps?.flash?.error ?? '';
    const pageErrors = pageProps?.errors ?? {};

    const [programs, setPrograms] = useState(initialPrograms);
    const [search, setSearch] = useState('');
    const [filterTab, setFilterTab] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    const [modalOpen, setModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [pendingDeleteItem, setPendingDeleteItem] = useState(null);

    const [successOpen, setSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        setPrograms(initialPrograms);
    }, [initialPrograms]);

    useEffect(() => {
        if (flashError) {
            setAlertMessage(flashError);
        }
    }, [flashError]);

    const validationErrorMessages = useMemo(
        () => Object.values(pageErrors || {}).filter(Boolean),
        [pageErrors],
    );

    const currentBookmarkedCount = useMemo(() => {
        if (!Array.isArray(programs)) return initialBookmarkedCount;
        return programs.filter((item) => Boolean(item.is_bookmarked)).length;
    }, [programs, initialBookmarkedCount]);

    const activeCount = useMemo(
        () => programs.filter((item) => Boolean(item.is_active)).length,
        [programs],
    );

    const filteredPrograms = useMemo(() => {
        const q = search.trim().toLowerCase();
        return programs.filter((row) => {
            if (filterTab === 'bookmarked' && !row.is_bookmarked) return false;
            if (filterTab === 'active' && !row.is_active) return false;
            if (filterTab === 'inactive' && row.is_active) return false;
            if (!q) return true;

            return (
                (row.title ?? '').toLowerCase().includes(q) ||
                (row.description ?? '').toLowerCase().includes(q) ||
                (row.link ?? '').toLowerCase().includes(q)
            );
        });
    }, [programs, search, filterTab]);

    const totalPages = Math.max(1, Math.ceil(filteredPrograms.length / PAGE_SIZE));

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const paginatedPrograms = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filteredPrograms.slice(start, start + PAGE_SIZE);
    }, [filteredPrograms, currentPage]);

    const openAddModal = () => {
        setAlertMessage('');
        setEditingItem(null);
        setModalOpen(true);
    };

    const openEditModal = (row) => {
        setAlertMessage('');
        setEditingItem(row);
        setModalOpen(true);
    };

    const closeModal = () => {
        if (submitting) return;
        setModalOpen(false);
        setEditingItem(null);
    };

    const handleToggleBookmark = (row) => {
        const nextBookmarked = !row.is_bookmarked;
        if (nextBookmarked && currentBookmarkedCount >= maxBookmarked) {
            setAlertMessage(
                `Maximum of ${maxBookmarked} programs can be bookmarked for the Homepage. Unbookmark one first.`,
            );
            return;
        }

        setAlertMessage('');
        router.patch(
            route('admin.home-page.programs.bookmark', row.id),
            { is_bookmarked: nextBookmarked },
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    const serverFlashError = page?.props?.flash?.error;
                    if (serverFlashError) {
                        setAlertMessage(serverFlashError);
                    }
                },
                onError: (errs) => {
                    const firstErr = Object.values(errs || {})[0];
                    if (firstErr) setAlertMessage(String(firstErr));
                },
            },
        );
    };

    const handleToggleActive = (row) => {
        setAlertMessage('');
        const formData = new FormData();
        formData.append('title', row.title ?? '');
        formData.append('description', row.description ?? '');
        formData.append('link', row.link ?? '');
        formData.append('icon', row.icon || 'swords');
        formData.append('color', row.color || '#f2c21a');
        formData.append('is_bookmarked', row.is_bookmarked ? '1' : '0');
        formData.append('is_active', row.is_active ? '0' : '1');

        router.post(
            route('admin.home-page.programs.update', row.id),
            formData,
            {
                forceFormData: true,
                preserveScroll: true,
                onError: (errs) => {
                    const firstErr = Object.values(errs || {})[0];
                    if (firstErr) setAlertMessage(String(firstErr));
                },
            },
        );
    };

    const handleSubmit = (values) => {
        setAlertMessage('');
        setSubmitting(true);

        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('description', values.description ?? '');
        formData.append('link', values.link ?? '');
        formData.append('icon', values.icon || 'swords');
        formData.append('color', values.color || '#f2c21a');
        formData.append('is_bookmarked', values.is_bookmarked ? '1' : '0');
        formData.append('is_active', values.is_active ? '1' : '0');

        if (values.featuredImage instanceof File) {
            formData.append('image', values.featuredImage);
        }

        const wasEditing = editingItem != null;
        const targetRoute = wasEditing
            ? route('admin.home-page.programs.update', editingItem.id)
            : route('admin.home-page.programs.store');

        router.post(targetRoute, formData, {
            forceFormData: true,
            preserveScroll: true,
            onFinish: () => setSubmitting(false),
            onSuccess: (page) => {
                const serverFlashError = page?.props?.flash?.error;
                if (serverFlashError) {
                    setAlertMessage(serverFlashError);
                    return;
                }
                setModalOpen(false);
                setEditingItem(null);
                setSuccessMessage(
                    wasEditing
                        ? 'Program updated successfully!'
                        : 'Program added and published successfully!',
                );
                setSuccessOpen(true);
            },
            onError: (errs) => {
                const firstErr = Object.values(errs || {})[0];
                if (firstErr) setAlertMessage(String(firstErr));
            },
        });
    };

    const requestDelete = (row) => {
        setAlertMessage('');
        setPendingDeleteItem(row);
        setDeleteOpen(true);
    };

    const cancelDelete = () => {
        setDeleteOpen(false);
        setPendingDeleteItem(null);
    };

    const confirmDelete = () => {
        if (!pendingDeleteItem?.id) return;
        router.delete(route('admin.home-page.programs.delete', pendingDeleteItem.id), {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteOpen(false);
                setPendingDeleteItem(null);
                setSuccessMessage('Program deleted successfully!');
                setSuccessOpen(true);
            },
            onError: (errs) => {
                setDeleteOpen(false);
                setPendingDeleteItem(null);
                const firstErr = Object.values(errs || {})[0];
                if (firstErr) setAlertMessage(String(firstErr));
            },
        });
    };

    const renderThumbnail = (row, sizeClass = 'h-12 w-16') => {
        const FallbackIcon = ICON_MAP[row.icon] || Swords;
        if (row.image_url) {
            return (
                <img
                    src={row.image_url}
                    alt={row.title || 'Program thumbnail'}
                    loading="lazy"
                    className={`${sizeClass} shrink-0 rounded-lg border border-neutral-800 bg-neutral-950 object-cover`}
                />
            );
        }

        return (
            <div
                className={`${sizeClass} flex shrink-0 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-950`}
                style={{ color: row.color || '#f2c21a' }}
                aria-hidden="true"
            >
                <FallbackIcon className="h-5 w-5" />
            </div>
        );
    };

    const renderBookmarkButton = (row) => {
        const isBookmarked = Boolean(row.is_bookmarked);
        const atMaxAndUnbookmarked =
            !isBookmarked && currentBookmarkedCount >= maxBookmarked;

        return (
            <button
                type="button"
                onClick={() => handleToggleBookmark(row)}
                aria-pressed={isBookmarked}
                aria-label={
                    isBookmarked
                        ? `Remove ${row.title} from Homepage bookmarks`
                        : `Bookmark ${row.title} for the Homepage`
                }
                title={
                    isBookmarked
                        ? 'Bookmarked for Homepage — click to unbookmark'
                        : atMaxAndUnbookmarked
                          ? `Maximum of ${maxBookmarked} programs bookmarked — unbookmark one first`
                          : 'Bookmark for Homepage'
                }
                className={`inline-flex min-h-10 min-w-10 shrink-0 items-center justify-center rounded-lg border transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBBF24] ${
                    isBookmarked
                        ? 'border-[#FBBF24]/40 bg-[#FBBF24]/15 text-[#FBBF24] hover:bg-[#FBBF24]/25'
                        : atMaxAndUnbookmarked
                          ? 'border-neutral-800/80 bg-[#141417] text-neutral-600 hover:border-amber-500/30 hover:text-amber-400/80'
                          : 'border-neutral-800 bg-[#141417] text-gray-400 hover:border-[#FBBF24]/40 hover:bg-[#FBBF24]/10 hover:text-[#FBBF24]'
                }`}
            >
                <Bookmark
                    className="h-4 w-4"
                    fill={isBookmarked ? 'currentColor' : 'none'}
                    aria-hidden="true"
                />
            </button>
        );
    };

    const renderStatusBadge = (row) => (
        <button
            type="button"
            onClick={() => handleToggleActive(row)}
            title="Click to toggle visibility on /Programs page"
            className={`inline-flex min-h-8 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors cursor-pointer ${
                row.is_active
                    ? 'border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                    : 'border border-neutral-700 bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200'
            }`}
        >
            <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full ${
                    row.is_active ? 'bg-emerald-400' : 'bg-neutral-500'
                }`}
            />
            {row.is_active ? 'Active' : 'Inactive'}
        </button>
    );

    const headerRight = (
        <div className="flex w-full min-w-0 flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <div className="inline-flex min-h-[42px] items-center gap-2 rounded-lg border border-[#FBBF24]/35 bg-[#FBBF24]/10 px-3.5 py-2 text-xs font-bold text-[#FBBF24]">
                <Bookmark
                    className="h-4 w-4 shrink-0 text-[#FBBF24]"
                    fill={currentBookmarkedCount > 0 ? 'currentColor' : 'none'}
                    aria-hidden="true"
                />
                <span className="whitespace-nowrap">
                    Homepage Bookmarks: {currentBookmarkedCount} / {maxBookmarked}
                </span>
            </div>

            <button
                type="button"
                className={`${ADMIN_GOLD_BUTTON_CLASS} w-full shrink-0 whitespace-nowrap sm:w-auto`}
                onClick={openAddModal}
            >
                <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
                Add Program
            </button>
        </div>
    );

    return (
        <>
            <SectionCard
                title="Our Programs"
                description="Manage all MSL programs for the /Programs directory and bookmark up to 5 highlights for the Homepage."
                headerRight={headerRight}
            >
                <div className="space-y-5">
                    {/* Error / Bookmark Limit Banner */}
                    {(alertMessage || validationErrorMessages.length > 0) && (
                        <div
                            role="alert"
                            className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-sm text-amber-200"
                        >
                            <div className="flex min-w-0 flex-1 items-start gap-2.5">
                                <AlertCircle
                                    className="mt-0.5 h-4 w-4 shrink-0 text-amber-400"
                                    aria-hidden="true"
                                />
                                <div className="min-w-0 flex-1 space-y-1">
                                    {alertMessage ? <p>{alertMessage}</p> : null}
                                    {validationErrorMessages.map((msg, idx) => (
                                        <p key={idx}>{msg}</p>
                                    ))}
                                </div>
                            </div>
                            {alertMessage ? (
                                <button
                                    type="button"
                                    onClick={() => setAlertMessage('')}
                                    className="shrink-0 whitespace-nowrap text-xs font-semibold text-amber-200 underline hover:text-white cursor-pointer"
                                >
                                    Dismiss
                                </button>
                            ) : null}
                        </div>
                    )}

                    {/* Search & Filter Toolbar */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                        <div className="relative min-w-0 w-full sm:max-w-xs">
                            <Search
                                aria-hidden="true"
                                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
                            />
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
                                placeholder="Search title, description, or link..."
                                aria-label="Search programs"
                                className="w-full min-h-[42px] rounded-xl border border-neutral-800 bg-[#141417] py-2 pl-9 pr-3 text-sm text-white placeholder:text-gray-500 focus:border-[#FBBF24] focus:outline-none focus:ring-1 focus:ring-[#FBBF24]"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                            {[
                                { id: 'all', label: `All (${programs.length})` },
                                {
                                    id: 'bookmarked',
                                    label: `Bookmarked (${currentBookmarkedCount}/${maxBookmarked})`,
                                },
                                { id: 'active', label: `Active (${activeCount})` },
                                {
                                    id: 'inactive',
                                    label: `Inactive (${programs.length - activeCount})`,
                                },
                            ].map((tab) => {
                                const selected = filterTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => {
                                            setFilterTab(tab.id);
                                            setCurrentPage(1);
                                        }}
                                        className={`inline-flex min-h-9 items-center rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                                            selected
                                                ? 'border-[#FBBF24]/40 bg-[#FBBF24]/15 text-[#FBBF24]'
                                                : 'border-neutral-800 bg-[#141417] text-neutral-400 hover:border-neutral-700 hover:text-white'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Empty States */}
                    {programs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-800 py-12 text-center">
                            <FolderKanban
                                className="mb-3 h-10 w-10 text-neutral-600"
                                aria-hidden="true"
                            />
                            <p className="text-sm text-neutral-400">
                                No programs have been added yet.
                            </p>
                            <button
                                type="button"
                                onClick={openAddModal}
                                className="mt-4 text-xs font-semibold text-[#FBBF24] hover:underline cursor-pointer"
                            >
                                + Add First Program
                            </button>
                        </div>
                    ) : filteredPrograms.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-neutral-800 py-10 text-center">
                            <p className="text-sm text-neutral-400">
                                No programs match your current search or filter.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden overflow-x-auto rounded-xl border border-neutral-800 bg-[#141417] xl:block">
                                <table className="w-full table-auto border-collapse text-left text-sm">
                                    <thead className="bg-[#1b1b20] text-xs font-bold uppercase tracking-wider text-neutral-400">
                                        <tr>
                                            <th className="border-b border-neutral-800 px-4 py-3.5 whitespace-nowrap">
                                                Bookmark
                                            </th>
                                            <th className="border-b border-neutral-800 px-4 py-3.5">
                                                Program
                                            </th>
                                            <th className="border-b border-neutral-800 px-4 py-3.5">
                                                Destination Link
                                            </th>
                                            <th className="border-b border-neutral-800 px-4 py-3.5 whitespace-nowrap">
                                                Status
                                            </th>
                                            <th className="border-b border-neutral-800 px-4 py-3.5 text-right whitespace-nowrap">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-800/70">
                                        {paginatedPrograms.map((row) => {
                                            const href = (row.link ?? '').trim();
                                            const isExternal = /^https?:\/\//i.test(href);
                                            return (
                                                <tr
                                                    key={row.id}
                                                    className="transition-colors hover:bg-white/[0.02]"
                                                >
                                                    <td className="px-4 py-3.5 align-middle">
                                                        {renderBookmarkButton(row)}
                                                    </td>
                                                    <td className="max-w-md px-4 py-3.5 align-middle">
                                                        <div className="flex min-w-0 items-center gap-3.5">
                                                            {renderThumbnail(row, 'h-12 w-16')}
                                                            <div className="min-w-0 flex-1">
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <span className="font-bold text-white">
                                                                        {row.title}
                                                                    </span>
                                                                    {row.is_bookmarked ? (
                                                                        <span className="inline-flex shrink-0 items-center rounded-full border border-[#FBBF24]/30 bg-[#FBBF24]/15 px-2 py-0.5 text-[10px] font-bold text-[#FBBF24]">
                                                                            Homepage
                                                                        </span>
                                                                    ) : null}
                                                                </div>
                                                                {row.description ? (
                                                                    <p
                                                                        className="mt-1 line-clamp-2 text-xs leading-5 text-gray-400"
                                                                        title={row.description}
                                                                    >
                                                                        {row.description}
                                                                    </p>
                                                                ) : (
                                                                    <p className="mt-1 text-xs italic text-neutral-500">
                                                                        No description provided
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="max-w-xs px-4 py-3.5 align-middle">
                                                        {href ? (
                                                            <a
                                                                href={href}
                                                                target={isExternal ? '_blank' : undefined}
                                                                rel={
                                                                    isExternal
                                                                        ? 'noopener noreferrer'
                                                                        : undefined
                                                                }
                                                                title={href}
                                                                className="inline-flex max-w-full items-center gap-1.5 text-xs font-medium text-[#FBBF24] hover:underline"
                                                            >
                                                                <Link2
                                                                    className="h-3.5 w-3.5 shrink-0"
                                                                    aria-hidden="true"
                                                                />
                                                                <span className="truncate">{href}</span>
                                                                {isExternal ? (
                                                                    <ExternalLink
                                                                        className="h-3 w-3 shrink-0"
                                                                        aria-hidden="true"
                                                                    />
                                                                ) : null}
                                                            </a>
                                                        ) : (
                                                            <span className="text-xs italic text-neutral-500">
                                                                /Programs (default)
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3.5 align-middle whitespace-nowrap">
                                                        {renderStatusBadge(row)}
                                                    </td>
                                                    <td className="px-4 py-3.5 text-right align-middle whitespace-nowrap">
                                                        <div className="inline-flex items-center justify-end gap-1">
                                                            <button
                                                                type="button"
                                                                className={`${MODAL_ACTION_ICON_CLASS} text-blue-500 hover:bg-blue-500/10 hover:text-blue-400 cursor-pointer`}
                                                                aria-label={`Edit ${row.title}`}
                                                                onClick={() => openEditModal(row)}
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className={`${MODAL_ACTION_ICON_CLASS} text-red-500 hover:bg-red-500/10 hover:text-red-400 cursor-pointer`}
                                                                aria-label={`Delete ${row.title}`}
                                                                onClick={() => requestDelete(row)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile & Tablet Cards */}
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:hidden">
                                {paginatedPrograms.map((row) => {
                                    const href = (row.link ?? '').trim();
                                    const isExternal = /^https?:\/\//i.test(href);
                                    return (
                                        <article
                                            key={row.id}
                                            className={`flex flex-col justify-between rounded-xl border bg-[#141417] p-4 transition-colors ${
                                                row.is_bookmarked
                                                    ? 'border-[#FBBF24]/35'
                                                    : 'border-neutral-800'
                                            }`}
                                        >
                                            <div>
                                                <div className="flex items-start gap-3">
                                                    {renderThumbnail(row, 'h-14 w-20')}
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex flex-wrap items-center gap-1.5">
                                                            <h3 className="break-words text-sm font-bold text-white">
                                                                {row.title}
                                                            </h3>
                                                            {row.is_bookmarked ? (
                                                                <span className="inline-flex shrink-0 items-center rounded-full border border-[#FBBF24]/30 bg-[#FBBF24]/15 px-2 py-0.5 text-[10px] font-bold text-[#FBBF24]">
                                                                    Homepage
                                                                </span>
                                                            ) : null}
                                                        </div>
                                                        {row.description ? (
                                                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-400">
                                                                {row.description}
                                                            </p>
                                                        ) : (
                                                            <p className="mt-1 text-xs italic text-neutral-500">
                                                                No description provided
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="mt-3 border-t border-neutral-800/70 pt-2.5 text-xs">
                                                    <span className="font-medium text-neutral-500">
                                                        Destination:{' '}
                                                    </span>
                                                    {href ? (
                                                        <a
                                                            href={href}
                                                            target={isExternal ? '_blank' : undefined}
                                                            rel={
                                                                isExternal
                                                                    ? 'noopener noreferrer'
                                                                    : undefined
                                                            }
                                                            className="inline-flex max-w-full items-center gap-1 break-all font-medium text-[#FBBF24] hover:underline"
                                                        >
                                                            <span>{href}</span>
                                                            {isExternal ? (
                                                                <ExternalLink
                                                                    className="h-3 w-3 shrink-0"
                                                                    aria-hidden="true"
                                                                />
                                                            ) : null}
                                                        </a>
                                                    ) : (
                                                        <span className="italic text-neutral-500">
                                                            /Programs (default)
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-800/70 pt-3">
                                                <div className="flex items-center gap-2">
                                                    {renderBookmarkButton(row)}
                                                    {renderStatusBadge(row)}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        type="button"
                                                        className={`${MODAL_ACTION_ICON_CLASS} text-blue-500 hover:bg-blue-500/10 hover:text-blue-400 cursor-pointer`}
                                                        aria-label={`Edit ${row.title}`}
                                                        onClick={() => openEditModal(row)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={`${MODAL_ACTION_ICON_CLASS} text-red-500 hover:bg-red-500/10 hover:text-red-400 cursor-pointer`}
                                                        aria-label={`Delete ${row.title}`}
                                                        onClick={() => requestDelete(row)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>

                            {/* Real Client Pagination (only rendered when > 1 page) */}
                            {totalPages > 1 ? (
                                <div className="flex flex-col gap-3 border-t border-neutral-800/80 pt-4 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">
                                    <span>
                                        Showing{' '}
                                        <strong className="text-white">
                                            {(currentPage - 1) * PAGE_SIZE + 1}
                                        </strong>
                                        –
                                        <strong className="text-white">
                                            {Math.min(
                                                currentPage * PAGE_SIZE,
                                                filteredPrograms.length,
                                            )}
                                        </strong>{' '}
                                        of{' '}
                                        <strong className="text-white">
                                            {filteredPrograms.length}
                                        </strong>{' '}
                                        programs
                                    </span>

                                    <nav
                                        className="flex flex-wrap items-center justify-center gap-1.5 sm:justify-end"
                                        aria-label="Programs pagination"
                                    >
                                        <button
                                            type="button"
                                            disabled={currentPage <= 1}
                                            onClick={() =>
                                                setCurrentPage((p) => Math.max(1, p - 1))
                                            }
                                            className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-neutral-800 bg-[#141417] px-2.5 py-1.5 text-xs font-semibold text-gray-300 transition-colors hover:bg-neutral-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                                        >
                                            <ChevronLeft className="h-3.5 w-3.5" />
                                            Previous
                                        </button>

                                        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
                                            (pageNum) => (
                                                <button
                                                    key={pageNum}
                                                    type="button"
                                                    onClick={() => setCurrentPage(pageNum)}
                                                    aria-current={
                                                        currentPage === pageNum ? 'page' : undefined
                                                    }
                                                    className={`inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg border px-2.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                                                        currentPage === pageNum
                                                            ? 'border-[#FBBF24]/50 bg-[#FBBF24] text-black'
                                                            : 'border-neutral-800 bg-[#141417] text-gray-300 hover:bg-neutral-800 hover:text-white'
                                                    }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            ),
                                        )}

                                        <button
                                            type="button"
                                            disabled={currentPage >= totalPages}
                                            onClick={() =>
                                                setCurrentPage((p) => Math.min(totalPages, p + 1))
                                            }
                                            className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-neutral-800 bg-[#141417] px-2.5 py-1.5 text-xs font-semibold text-gray-300 transition-colors hover:bg-neutral-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                                        >
                                            Next
                                            <ChevronRight className="h-3.5 w-3.5" />
                                        </button>
                                    </nav>
                                </div>
                            ) : null}
                        </>
                    )}
                </div>
            </SectionCard>

            <ProgramModal
                isOpen={modalOpen}
                onClose={closeModal}
                initialData={editingItem}
                onSubmit={handleSubmit}
                bookmarkedCount={currentBookmarkedCount}
                maxBookmarked={maxBookmarked}
                submitting={submitting}
            />

            <DeleteConfirmationModal
                isOpen={deleteOpen}
                onCancel={cancelDelete}
                onConfirm={confirmDelete}
                message={
                    pendingDeleteItem?.title
                        ? `Are you sure you want to delete "${pendingDeleteItem.title}"?`
                        : undefined
                }
            />

            <SuccessModal
                isOpen={successOpen}
                onClose={() => setSuccessOpen(false)}
                message={successMessage || 'Saved successfully!'}
            />
        </>
    );
}
