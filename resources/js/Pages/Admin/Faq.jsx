import FAQModal from '@/Components/Admin/FAQModal';
import DeleteConfirmationModal from '@/Components/Admin/DeleteConfirmationModal';
import SuccessModal from '@/Components/Admin/SuccessModal';
import { MODAL_ACTION_ICON_CLASS } from '@/Components/Admin/adminModalFormStyles';
import { FAQ_FILTER_CATEGORIES } from '@/data/adminFaqData';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminFilterSelect from '@/Components/Admin/AdminFilterSelect';
import { Head, router } from '@inertiajs/react';
import { Bookmark, ChevronDown, Pencil, Plus, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

const ADD_BUTTON_CLASS =
    'inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-yellow-500 px-4 py-2.5 text-sm font-bold text-black transition hover:bg-yellow-400 active:scale-[0.98] sm:w-auto';

export default function Faq({ faqs: initialFaqs = [] }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [wasEditSubmit, setWasEditSubmit] = useState(false);
    const [wasDeleteSubmit, setWasDeleteSubmit] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [expandedFaqId, setExpandedFaqId] = useState(initialFaqs[0]?.id ?? null);
    const [faqs, setFaqs] = useState(initialFaqs);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    useEffect(() => {
        setFaqs(initialFaqs);
    }, [initialFaqs]);

    const openAddModal = useCallback(() => {
        setEditingItem(null);
        setModalOpen(true);
    }, []);

    const openEditModal = useCallback((item) => {
        setEditingItem(item);
        setModalOpen(true);
    }, []);

    const toggleFaq = useCallback((id) => {
        setExpandedFaqId((currentId) => (currentId === id ? null : id));
    }, []);

    const togglePin = useCallback((item) => {
        router.patch(
            route('admin.faq.pin', item.id),
            { is_pinned: !item.is_pinned },
            { preserveScroll: true },
        );
    }, []);

    const closeModal = useCallback(() => {
        setModalOpen(false);
        setEditingItem(null);
    }, []);

    const closeSuccess = useCallback(() => {
        setSuccessOpen(false);
        setWasEditSubmit(false);
        setWasDeleteSubmit(false);
    }, []);

    const handleSubmit = useCallback(
        (values) => {
            const wasEditing = editingItem != null;

            if (wasEditing) {
                router.put(route('admin.faq.update', editingItem.id), values, { preserveScroll: true });
            } else {
                router.post(route('admin.faq.store'), values, { preserveScroll: true });
            }

            setWasEditSubmit(wasEditing);
            setWasDeleteSubmit(false);
            setModalOpen(false);
            setEditingItem(null);
            setSuccessOpen(true);
        },
        [editingItem],
    );

    const handleRemove = useCallback((id) => {
        setFaqs((prev) => prev.filter((item) => item.id !== id));
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
        router.delete(route('admin.faq.delete', pendingDeleteId), { preserveScroll: true });
        handleRemove(pendingDeleteId);
        setDeleteOpen(false);
        setPendingDeleteId(null);
        setWasEditSubmit(false);
        setWasDeleteSubmit(true);
        setSuccessOpen(true);
    }, [handleRemove, pendingDeleteId]);

    const filteredFaqs = useMemo(() => {
        if (categoryFilter === 'All') return faqs;
        return faqs.filter((item) => item.category === categoryFilter);
    }, [categoryFilter, faqs]);

    useEffect(() => {
        setExpandedFaqId((currentId) => {
            if (filteredFaqs.some((item) => item.id === currentId)) {
                return currentId;
            }

            return filteredFaqs[0]?.id ?? null;
        });
    }, [filteredFaqs]);

    const successMessage = wasDeleteSubmit
        ? 'Data has been deleted!'
        : wasEditSubmit
          ? 'Updated Successfully!'
          : 'Successfully Added!';

    return (
        <AdminLayout activeNavId="faq">
            <Head title="Frequently Asked Questions" />

            <div className="mb-6 flex flex-col gap-5 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="mb-1 text-2xl font-bold text-white sm:text-3xl">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-sm leading-6 text-gray-400">
                        Manage FAQs and choose which answers appear on the public homepage.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={openAddModal}
                    className={`${ADD_BUTTON_CLASS} hidden sm:inline-flex`}
                >
                    <Plus aria-hidden="true" className="h-4 w-4" />
                    Add New FAQ
                </button>
            </div>

            <section className="rounded-xl border-0 bg-transparent p-0 sm:border sm:border-neutral-800 sm:bg-[#111111] sm:p-6 lg:p-11">
                <div className="mb-5 flex flex-col gap-5 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
                    <h2 className="hidden text-xl font-bold text-white sm:block">
                        Frequently Asked Questions
                    </h2>

                    <div className="flex w-full flex-col gap-4 sm:w-auto sm:items-end">
                        <label className="w-full sm:w-[270px]">
                            <span className="mb-2 block text-sm font-medium text-gray-300">
                                Category
                            </span>
                            <AdminFilterSelect
                                id="faq-category-filter"
                                value={categoryFilter}
                                onChange={(event) => setCategoryFilter(event.target.value)}
                                aria-label="Filter FAQs by category"
                                className="min-h-[42px] bg-[#111111] text-sm"
                            >
                                {FAQ_FILTER_CATEGORIES.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </AdminFilterSelect>
                        </label>

                        <button
                            type="button"
                            onClick={openAddModal}
                            className={`${ADD_BUTTON_CLASS} sm:hidden`}
                        >
                            <Plus aria-hidden="true" className="h-4 w-4" />
                            Add New FAQ
                        </button>
                    </div>
                </div>

                <div className="min-w-0">
                    {filteredFaqs.length === 0 ? (
                        <p className="py-12 text-center text-sm text-gray-500">
                            No FAQs in this category.
                        </p>
                    ) : (
                        <div className="space-y-2.5 md:space-y-5">
                            {filteredFaqs.map((item) => {
                                const isExpanded = expandedFaqId === item.id;
                                const answerId = `faq-answer-${item.id}`;

                                return (
                                    <article
                                        key={item.id}
                                        className={`flex min-h-[56px] items-center gap-2.5 rounded-md border border-neutral-800 bg-[#111111] px-2.5 py-2 md:gap-6 md:rounded-xl md:px-8 ${
                                            isExpanded
                                                ? 'md:min-h-[120px] md:py-5'
                                                : 'md:min-h-[64px] md:py-3'
                                        }`}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => togglePin(item)}
                                            aria-label={
                                                item.is_pinned
                                                    ? `Remove ${item.question} from the public FAQ section`
                                                    : `Show ${item.question} on the public FAQ section`
                                            }
                                            aria-pressed={item.is_pinned}
                                            title={
                                                item.is_pinned
                                                    ? 'Visible on the public page'
                                                    : 'Show on the public page'
                                            }
                                            className="inline-flex min-h-11 min-w-9 shrink-0 items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 md:min-w-11"
                                        >
                                            <Bookmark
                                                aria-hidden="true"
                                                className={`h-5 w-5 transition-colors ${
                                                    item.is_pinned
                                                        ? 'fill-yellow-400/20 text-yellow-400'
                                                        : 'text-neutral-600 hover:text-yellow-400'
                                                }`}
                                            />
                                        </button>

                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-base font-bold leading-5 text-white md:text-[28px] md:leading-8">
                                                <span className="block min-w-0 overflow-hidden text-ellipsis whitespace-nowrap md:overflow-visible md:text-clip md:whitespace-normal">
                                                    {item.question}
                                                </span>
                                            </h3>
                                            <p
                                                id={answerId}
                                                hidden={!isExpanded}
                                                className="mt-1 text-xs leading-4 text-gray-400 md:text-lg md:leading-6"
                                            >
                                                {item.answer}
                                            </p>
                                        </div>

                                        <div className="flex shrink-0 items-center gap-0.5">
                                            <button
                                                type="button"
                                                onClick={() => toggleFaq(item.id)}
                                                className={`${MODAL_ACTION_ICON_CLASS} text-gray-500 hover:bg-white/5 hover:text-white`}
                                                aria-label={`${isExpanded ? 'Collapse' : 'Expand'} answer for ${item.question}`}
                                                aria-expanded={isExpanded}
                                                aria-controls={answerId}
                                            >
                                                <ChevronDown
                                                    aria-hidden="true"
                                                    className={`h-4 w-4 transition-transform duration-200 ${
                                                        isExpanded ? 'rotate-180' : ''
                                                    }`}
                                                />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => openEditModal(item)}
                                                className={`${MODAL_ACTION_ICON_CLASS} text-blue-500 hover:bg-blue-500/10 hover:text-blue-400`}
                                                aria-label={`Edit FAQ: ${item.question}`}
                                            >
                                                <Pencil aria-hidden="true" className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => requestDelete(item.id)}
                                                className={`${MODAL_ACTION_ICON_CLASS} text-red-500 hover:bg-red-500/10 hover:text-red-400`}
                                                aria-label={`Delete FAQ: ${item.question}`}
                                            >
                                                <Trash2 aria-hidden="true" className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            <FAQModal
                isOpen={modalOpen}
                onClose={closeModal}
                initialData={editingItem}
                onSubmit={handleSubmit}
            />

            <DeleteConfirmationModal
                isOpen={deleteOpen}
                onCancel={cancelDelete}
                onConfirm={confirmDelete}
            />

            <SuccessModal
                isOpen={successOpen}
                onClose={closeSuccess}
                message={successMessage}
            />
        </AdminLayout>
    );
}
