import FAQModal from '@/Components/Admin/FAQModal';
import DeleteConfirmationModal from '@/Components/Admin/DeleteConfirmationModal';
import SuccessModal from '@/Components/Admin/SuccessModal';
import { MODAL_ACTION_ICON_CLASS } from '@/Components/Admin/adminModalFormStyles';
import { FAQ_FILTER_CATEGORIES, FAQ_ITEMS } from '@/data/adminFaqData';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

const ADD_BUTTON_CLASS =
    'inline-flex w-full items-center justify-center gap-2 rounded-md bg-yellow-500 px-4 py-2.5 text-sm font-bold text-black transition-all hover:bg-yellow-400 active:scale-[0.98] sm:w-auto';

const FILTER_SELECT_CLASS =
    'w-full min-h-[44px] rounded-md bg-[#1a1a1a] px-4 py-2.5 text-base text-white outline-none transition-shadow focus:ring-2 focus:ring-yellow-500 md:min-w-[160px] md:text-sm';

export default function Faq() {
    const [modalOpen, setModalOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [wasEditSubmit, setWasEditSubmit] = useState(false);
    const [wasDeleteSubmit, setWasDeleteSubmit] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [faqs, setFaqs] = useState(FAQ_ITEMS);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    const openAddModal = useCallback(() => {
        setEditingItem(null);
        setModalOpen(true);
    }, []);

    const openEditModal = useCallback((item) => {
        setEditingItem(item);
        setModalOpen(true);
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
                setFaqs((prev) =>
                    prev.map((item) =>
                        item.id === editingItem.id ? { ...item, ...values } : item,
                    ),
                );
            } else {
                setFaqs((prev) => [
                    ...prev,
                    {
                        id: Date.now(),
                        ...values,
                    },
                ]);
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

    const successMessage = wasDeleteSubmit
        ? 'Data has been deleted!'
        : wasEditSubmit
          ? 'Updated Successfully!'
          : 'Successfully Added!';

    return (
        <AdminLayout activeNavId="faq">
            <Head title="FAQ Settings" />

            <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-sm text-gray-400">Simple description here</p>
                </div>
                <button type="button" onClick={openAddModal} className={`${ADD_BUTTON_CLASS} hidden sm:inline-flex`}>
                    <Plus className="h-4 w-4" />
                    Add New FAQ
                </button>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-[#111111] p-4 sm:p-6 md:p-8">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <h2 className="text-lg font-bold text-white sm:text-xl">
                        Frequently Asked Questions
                    </h2>
                    <div className="w-full sm:w-auto">
                        <label
                            htmlFor="faq-category-filter"
                            className="mb-2 block text-sm text-gray-400"
                        >
                            Category
                        </label>
                        <select
                            id="faq-category-filter"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className={FILTER_SELECT_CLASS}
                        >
                            {FAQ_FILTER_CATEGORIES.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={openAddModal}
                    className={`${ADD_BUTTON_CLASS} mb-6 sm:hidden`}
                >
                    <Plus className="h-4 w-4" />
                    Add New FAQ
                </button>

                <div className="admin-faq-scroll max-h-[600px] overflow-y-auto pr-1 sm:pr-4">
                    {filteredFaqs.length === 0 ? (
                        <p className="py-12 text-center text-sm text-gray-500">
                            No FAQs in this category.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {filteredFaqs.map((item) => (
                                <article
                                    key={item.id}
                                    className="rounded-lg border border-neutral-800 bg-[#1a1a1a] p-4"
                                >
                                    <div className="mb-3 border-b border-neutral-800/60 pb-3">
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Question
                                        </p>
                                        <h3 className="mt-1 text-base font-bold text-white">
                                            {item.question}
                                        </h3>
                                    </div>
                                    <div className="mb-3 border-b border-neutral-800/60 pb-3">
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Answer
                                        </p>
                                        <p className="mt-1 text-sm text-gray-400">{item.answer}</p>
                                    </div>
                                    <div className="mb-4">
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Category
                                        </p>
                                        <p className="mt-1 text-sm text-gray-300">{item.category}</p>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-neutral-800 pt-3">
                                        <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Actions
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => openEditModal(item)}
                                                className={`${MODAL_ACTION_ICON_CLASS} text-blue-500 hover:bg-blue-500/10 hover:text-blue-400`}
                                                aria-label="Edit FAQ"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => requestDelete(item.id)}
                                                className={`${MODAL_ACTION_ICON_CLASS} text-red-500 hover:bg-red-500/10 hover:text-red-400`}
                                                aria-label="Delete FAQ"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </div>

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
