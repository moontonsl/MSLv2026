import BaseModal from '@/Components/Admin/BaseModal';
import {
    MODAL_INPUT_CLASS,
    MODAL_LABEL_CLASS,
    MODAL_SELECT_CLASS,
    MODAL_SUBMIT_FOOTER_CLASS,
    MODAL_TEXTAREA_CLASS,
} from '@/Components/Admin/adminModalFormStyles';
import { FAQ_CATEGORY_OPTIONS } from '@/data/adminFaqData';
import { useEffect, useId, useState } from 'react';

const EMPTY_FORM = {
    category: 'General',
    question: '',
    answer: '',
};

/**
 * @param {{
 *   isOpen: boolean;
 *   onClose: () => void;
 *   initialData?: Record<string, unknown> | null;
 *   onSubmit: (values: typeof EMPTY_FORM) => void;
 * }} props
 */
export default function FAQModal({ isOpen, onClose, initialData = null, onSubmit }) {
    const isEditing = initialData != null;
    const formId = useId();
    const [form, setForm] = useState(EMPTY_FORM);

    useEffect(() => {
        if (!isOpen) return;

        if (initialData) {
            setForm({
                category: initialData.category ?? 'General',
                question: initialData.question ?? '',
                answer: initialData.answer ?? '',
            });
            return;
        }

        setForm(EMPTY_FORM);
    }, [isOpen, initialData]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(form);
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={
                isEditing
                    ? 'Edit Frequently Asked Question'
                    : 'Add Frequently Asked Question'
            }
            footer={
                <button type="submit" form={formId} className={MODAL_SUBMIT_FOOTER_CLASS}>
                    Submit
                </button>
            }
        >
            <form id={formId} onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="faq-category" className={MODAL_LABEL_CLASS}>
                        Category
                    </label>
                    <select
                        id="faq-category"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className={MODAL_SELECT_CLASS}
                    >
                        {FAQ_CATEGORY_OPTIONS.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="faq-question" className={MODAL_LABEL_CLASS}>
                        Question
                    </label>
                    <input
                        id="faq-question"
                        name="question"
                        type="text"
                        value={form.question}
                        onChange={handleChange}
                        placeholder="Enter question"
                        className={MODAL_INPUT_CLASS}
                    />
                </div>

                <div>
                    <label htmlFor="faq-answer" className={MODAL_LABEL_CLASS}>
                        Answer
                    </label>
                    <textarea
                        id="faq-answer"
                        name="answer"
                        value={form.answer}
                        onChange={handleChange}
                        placeholder="Enter text here..."
                        className={MODAL_TEXTAREA_CLASS}
                    />
                </div>
            </form>
        </BaseModal>
    );
}
