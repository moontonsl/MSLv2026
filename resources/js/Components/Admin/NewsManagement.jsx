import NewsFormModal from '@/Components/Admin/NewsFormModal';
import DeleteConfirmationModal from '@/Components/Admin/DeleteConfirmationModal';
import SuccessModal from '@/Components/Admin/SuccessModal';
import NewsViewModal from '@/Components/Admin/NewsViewModal';
import { MODAL_ACTION_ICON_CLASS } from '@/Components/Admin/adminModalFormStyles';
import {
    formatNewsDisplayDate,
    NEWS_ITEMS,
} from '@/data/adminNewsData';
import { Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

const ADD_BUTTON_CLASS =
    'inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-md bg-yellow-500 px-4 py-2.5 text-base font-bold text-black transition-all hover:bg-yellow-400 active:scale-[0.98] md:w-auto md:text-sm';

const SEARCH_CLASS =
    'w-full min-h-[44px] rounded-md border border-neutral-800 bg-[#1a1a1a] py-2.5 pl-10 pr-4 text-base text-white placeholder:text-gray-500 focus:ring-2 focus:ring-yellow-500 focus:outline-none md:text-sm';

function mapFormToNewsItem(values, existingItem = null) {
    return {
        id: existingItem?.id ?? Date.now(),
        category: values.category,
        title: values.title,
        description: values.shortDescription,
        shortDescription: values.shortDescription,
        writer: values.authorName,
        authorName: values.authorName,
        publishedDate: values.publishedDate,
        articleContent: values.articleContent,
        featuredImages: values.featuredImages,
    };
}

export default function NewsManagement() {
    const [newsItems, setNewsItems] = useState(NEWS_ITEMS);
    const [localSearch, setLocalSearch] = useState('');
    const [formOpen, setFormOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [viewingItem, setViewingItem] = useState(null);
    const [wasEditSubmit, setWasEditSubmit] = useState(false);
    const [wasDeleteSubmit, setWasDeleteSubmit] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    const filteredNews = useMemo(() => {
        const q = localSearch.trim().toLowerCase();
        if (!q) return newsItems;
        return newsItems.filter(
            (item) =>
                item.title.toLowerCase().includes(q) ||
                item.writer.toLowerCase().includes(q) ||
                item.description.toLowerCase().includes(q),
        );
    }, [localSearch, newsItems]);

    const openAddModal = useCallback(() => {
        setEditingItem(null);
        setFormOpen(true);
    }, []);

    const openEditModal = useCallback((item) => {
        setEditingItem(item);
        setFormOpen(true);
    }, []);

    const openViewModal = useCallback((item) => {
        setViewingItem(item);
        setViewOpen(true);
    }, []);

    const closeFormModal = useCallback(() => {
        setFormOpen(false);
        setEditingItem(null);
    }, []);

    const closeViewModal = useCallback(() => {
        setViewOpen(false);
        setViewingItem(null);
    }, []);

    const closeSuccess = useCallback(() => {
        setSuccessOpen(false);
        setWasEditSubmit(false);
        setWasDeleteSubmit(false);
    }, []);

    const handleFormSubmit = useCallback(
        (values) => {
            const row = mapFormToNewsItem(values, editingItem);
            if (editingItem) {
                setNewsItems((prev) =>
                    prev.map((item) => (item.id === editingItem.id ? row : item)),
                );
            } else {
                setNewsItems((prev) => [...prev, row]);
            }

            setWasEditSubmit(editingItem != null);
            setWasDeleteSubmit(false);
            setFormOpen(false);
            setEditingItem(null);
            setSuccessOpen(true);
        },
        [editingItem],
    );

    const handleDelete = useCallback((id) => {
        setNewsItems((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const requestDelete = useCallback((id) => {
        setPendingDeleteId(id);
        setDeleteOpen(true);
    }, []);

    const cancelDelete = useCallback(() => {
        setDeleteOpen(false);
        setPendingDeleteId(null);
    }, []);

    const confirmDelete = useCallback(() => {
        if (pendingDeleteId == null) return;
        handleDelete(pendingDeleteId);
        setDeleteOpen(false);
        setPendingDeleteId(null);
        setWasEditSubmit(false);
        setWasDeleteSubmit(true);
        setSuccessOpen(true);
    }, [handleDelete, pendingDeleteId]);

    const renderActions = (item) => (
        <div className="flex items-center gap-1">
            <button
                type="button"
                onClick={() => openViewModal(item)}
                className={`${MODAL_ACTION_ICON_CLASS} text-gray-400 hover:bg-white/5 hover:text-white`}
                aria-label="View news article"
            >
                <Eye className="h-4 w-4" />
            </button>
            <button
                type="button"
                onClick={() => openEditModal(item)}
                className={`${MODAL_ACTION_ICON_CLASS} text-blue-500 hover:bg-blue-500/10 hover:text-blue-400`}
                aria-label="Edit news article"
            >
                <Pencil className="h-4 w-4" />
            </button>
            <button
                type="button"
                onClick={() => requestDelete(item.id)}
                className={`${MODAL_ACTION_ICON_CLASS} text-red-500 hover:bg-red-500/10 hover:text-red-400`}
                aria-label="Delete news article"
            >
                <Trash2 className="h-4 w-4" />
            </button>
        </div>
    );

    return (
        <>
            <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl">
                        News & Updates
                    </h1>
                    <p className="text-sm text-gray-400">Simple description here</p>
                </div>
                <button
                    type="button"
                    onClick={openAddModal}
                    className={`${ADD_BUTTON_CLASS} hidden sm:inline-flex`}
                >
                    <Plus className="h-4 w-4" />
                    Create News
                </button>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-[#111111] p-4 sm:p-6 md:p-8">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-lg font-bold text-yellow-500 sm:text-xl">
                        News Management
                    </h2>
                    <div className="relative w-full sm:w-56">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <input
                            type="search"
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            placeholder="Search..."
                            className={SEARCH_CLASS}
                        />
                    </div>
                </div>

                <button
                    type="button"
                    onClick={openAddModal}
                    className={`${ADD_BUTTON_CLASS} mb-6 sm:hidden`}
                >
                    <Plus className="h-4 w-4" />
                    Create News
                </button>

                {filteredNews.length === 0 ? (
                    <p className="py-12 text-center text-sm text-gray-500">
                        No news articles found.
                    </p>
                ) : (
                    <>
                        <div className="hidden overflow-x-auto md:block">
                            <table className="w-full min-w-[800px] table-auto border-collapse">
                                <thead>
                                    <tr>
                                        <th className="pb-4 text-left text-sm font-semibold text-white">
                                            Title
                                        </th>
                                        <th className="pb-4 text-left text-sm font-semibold text-white">
                                            Writer
                                        </th>
                                        <th className="pb-4 text-left text-sm font-semibold text-white">
                                            Published Date
                                        </th>
                                        <th className="pb-4 pr-4 text-right text-sm font-semibold text-white">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredNews.map((item) => (
                                        <tr key={item.id}>
                                            <td className="border-b border-neutral-800/50 py-4 pr-4 align-top">
                                                <p className="max-w-xl text-base font-bold text-white">
                                                    {item.title}
                                                </p>
                                            </td>
                                            <td className="border-b border-neutral-800/50 py-4 align-top text-sm text-gray-300">
                                                {item.writer}
                                            </td>
                                            <td className="border-b border-neutral-800/50 py-4 align-top text-sm text-gray-300">
                                                {formatNewsDisplayDate(item.publishedDate)}
                                            </td>
                                            <td className="border-b border-neutral-800/50 py-4 pr-4 text-right align-top">
                                                <div className="inline-flex justify-end">
                                                    {renderActions(item)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="space-y-3 md:hidden">
                            {filteredNews.map((item) => (
                                <article
                                    key={item.id}
                                    className="rounded-lg border border-neutral-800 bg-[#111111] p-4"
                                >
                                    <div className="mb-3 border-b border-neutral-800/60 pb-3">
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Title
                                        </p>
                                        <p className="mt-1 text-base font-bold text-white">
                                            {item.title}
                                        </p>
                                    </div>
                                    <div className="mb-3 border-b border-neutral-800/60 pb-3">
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Writer
                                        </p>
                                        <p className="mt-1 text-sm text-gray-300">{item.writer}</p>
                                    </div>
                                    <div className="mb-4">
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Published Date
                                        </p>
                                        <p className="mt-1 text-sm text-gray-300">
                                            {formatNewsDisplayDate(item.publishedDate)}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-neutral-800 pt-3">
                                        <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Actions
                                        </span>
                                        {renderActions(item)}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </>
                )}

                <div className="mt-6 flex justify-end">
                    <nav
                        className="flex flex-wrap items-center gap-2 text-sm text-gray-400"
                        aria-label="News pagination"
                    >
                        <button type="button" className="min-h-[44px] px-2 transition-colors hover:text-white">
                            &lt; Previous
                        </button>
                        <button type="button" className="min-h-[44px] px-2 font-medium text-white">
                            1
                        </button>
                        <button type="button" className="min-h-[44px] px-2 transition-colors hover:text-white">
                            2
                        </button>
                        <button type="button" className="min-h-[44px] px-2 transition-colors hover:text-white">
                            3
                        </button>
                        <span>...</span>
                        <button type="button" className="min-h-[44px] px-2 transition-colors hover:text-white">
                            10
                        </button>
                        <button type="button" className="min-h-[44px] px-2 transition-colors hover:text-white">
                            Next &gt;
                        </button>
                    </nav>
                </div>
            </div>

            <NewsFormModal
                isOpen={formOpen}
                onClose={closeFormModal}
                initialData={editingItem}
                onSubmit={handleFormSubmit}
            />

            <NewsViewModal isOpen={viewOpen} onClose={closeViewModal} data={viewingItem} />

            <DeleteConfirmationModal
                isOpen={deleteOpen}
                onCancel={cancelDelete}
                onConfirm={confirmDelete}
            />

            <SuccessModal
                isOpen={successOpen}
                onClose={closeSuccess}
                message={
                    wasDeleteSubmit
                        ? 'Data has been deleted!'
                        : wasEditSubmit
                          ? 'Updated Successfully!'
                          : 'Successfully Added!'
                }
            />
        </>
    );
}
