import AdminFormModal from '@/Components/Admin/AdminFormModal';
import AdminSuccessModal from '@/Components/Admin/AdminSuccessModal';
import { FAQ_FILTER_CATEGORIES, FAQ_ITEMS } from '@/data/adminFaqData';
import {
    FORM_MODAL_CONFIG,
    SUCCESS_MESSAGES,
    isFormModal,
    isSuccessModal,
} from '@/data/adminModalConfig';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

export default function Faq() {
    const [modalType, setModalType] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [faqs, setFaqs] = useState(FAQ_ITEMS);

    const closeModal = useCallback(() => {
        setModalType(null);
    }, []);

    const handleFormSubmit = useCallback(() => {
        if (!modalType || !isFormModal(modalType)) return;
        setModalType(FORM_MODAL_CONFIG[modalType].successType);
    }, [modalType]);

    const handleRemove = useCallback((id) => {
        setFaqs((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const filteredFaqs = useMemo(() => {
        if (categoryFilter === 'All') return faqs;
        return faqs.filter((item) => item.category === categoryFilter);
    }, [categoryFilter, faqs]);

    const formConfig = isFormModal(modalType) ? FORM_MODAL_CONFIG[modalType] : null;
    const successMessage = isSuccessModal(modalType) ? SUCCESS_MESSAGES[modalType] : '';

    return (
        <AdminLayout activeNavId="faq">
            <Head title="FAQ Settings" />

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="mb-2 text-3xl font-bold text-white">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-sm text-gray-400">Simple Description</p>
                </div>
                <button
                    type="button"
                    onClick={() => setModalType('add-faq')}
                    className="flex shrink-0 items-center gap-2 rounded-md bg-[#FBBF24] px-4 py-2 text-sm font-bold text-black"
                >
                    <Plus className="h-4 w-4" />
                    Add New FAQ
                </button>
            </div>

            <div className="relative w-full rounded-xl border border-neutral-800 bg-[#111111] p-6 md:p-8">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <h2 className="text-xl font-bold text-white">Frequently Asked Questions</h2>
                    <div>
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
                            className="min-w-[160px] rounded-lg border border-neutral-800 bg-[#1A1A1A] px-4 py-2.5 text-sm text-white outline-none focus:border-[#FBBF24]"
                        >
                            {FAQ_FILTER_CATEGORIES.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="admin-faq-scroll max-h-[600px] overflow-y-auto pr-4">
                    {filteredFaqs.length === 0 ? (
                        <p className="py-12 text-center text-sm text-gray-500">
                            No FAQs in this category.
                        </p>
                    ) : (
                        filteredFaqs.map((item) => (
                            <div
                                key={item.id}
                                className="mb-4 flex w-full items-center justify-between rounded-xl border border-neutral-800 bg-[#151515] p-6 transition-colors last:mb-0 hover:border-neutral-700"
                            >
                                <h3 className="text-xl font-bold text-white">{item.question}</h3>
                                <button
                                    type="button"
                                    onClick={() => handleRemove(item.id)}
                                    className="flex shrink-0 items-center gap-2 rounded-md border border-red-900/50 bg-red-950/40 px-4 py-2 text-red-400 transition-colors hover:bg-red-900/60"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Remove
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {formConfig && (
                <AdminFormModal
                    key={modalType}
                    isOpen
                    onClose={closeModal}
                    title={formConfig.title}
                    fields={formConfig.fields}
                    submitLabel={formConfig.submitLabel}
                    onSubmit={handleFormSubmit}
                />
            )}

            {isSuccessModal(modalType) && (
                <AdminSuccessModal
                    isOpen
                    onClose={closeModal}
                    message={successMessage}
                />
            )}
        </AdminLayout>
    );
}
