import BaseModal from '@/Components/Admin/BaseModal';
import {
    MODAL_INPUT_CLASS,
    MODAL_LABEL_CLASS,
    MODAL_SELECT_CLASS,
    MODAL_SUBMIT_FOOTER_CLASS,
    MODAL_TEXTAREA_CLASS,
} from '@/Components/Admin/adminModalFormStyles';
import { getCourseTrackOptions } from '@/data/adminAccountData';
import { useEffect, useId, useState } from 'react';

/**
 * @param {{
 *   isOpen: boolean;
 *   onClose: () => void;
 *   initialData?: Record<string, unknown> | null;
 *   courseOptions?: string[];
 *   onSubmit: (values: {
 *     strandName: string;
 *     strandCode: string;
 *     relatedCourse: string;
 *     briefSummary: string;
 *   }) => void;
 * }} props
 */
export default function StrandModal({
    isOpen,
    onClose,
    initialData = null,
    courseOptions = getCourseTrackOptions(),
    onSubmit,
}) {
    const isEditing = initialData != null;
    const formId = useId();
    const defaultCourse = courseOptions[0] ?? '';

    const emptyForm = {
        strandName: '',
        strandCode: '',
        relatedCourse: defaultCourse,
        briefSummary: '',
    };

    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        if (!isOpen) return;

        if (initialData) {
            setForm({
                strandName: initialData.strandName ?? initialData.strand ?? '',
                strandCode: initialData.strandCode ?? '',
                relatedCourse: initialData.relatedCourse ?? defaultCourse,
                briefSummary: initialData.briefSummary ?? '',
            });
            return;
        }

        setForm({ ...emptyForm, relatedCourse: defaultCourse });
    }, [isOpen, initialData, defaultCourse]);

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
            title={isEditing ? 'Edit Strand' : 'Add Strand'}
            footer={
                <button type="submit" form={formId} className={MODAL_SUBMIT_FOOTER_CLASS}>
                    {isEditing ? 'Update' : 'Submit'}
                </button>
            }
        >
            <form id={formId} onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="strand-name" className={MODAL_LABEL_CLASS}>
                        Strand Name
                    </label>
                    <input
                        id="strand-name"
                        name="strandName"
                        type="text"
                        value={form.strandName}
                        onChange={handleChange}
                        placeholder="e.g. Science, Technology, Engineering, and Mathematics (STEM)"
                        className={MODAL_INPUT_CLASS}
                    />
                </div>

                <div>
                    <label htmlFor="strand-code" className={MODAL_LABEL_CLASS}>
                        Strand Code
                    </label>
                    <input
                        id="strand-code"
                        name="strandCode"
                        type="text"
                        value={form.strandCode}
                        onChange={handleChange}
                        placeholder="e.g. STEM"
                        className={MODAL_INPUT_CLASS}
                    />
                </div>

                <div>
                    <label htmlFor="strand-related-course" className={MODAL_LABEL_CLASS}>
                        Related Course / Track
                    </label>
                    <select
                        id="strand-related-course"
                        name="relatedCourse"
                        value={form.relatedCourse}
                        onChange={handleChange}
                        className={MODAL_SELECT_CLASS}
                    >
                        {courseOptions.map((course) => (
                            <option key={course} value={course}>
                                {course}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="strand-summary" className={MODAL_LABEL_CLASS}>
                        Brief Summary
                    </label>
                    <textarea
                        id="strand-summary"
                        name="briefSummary"
                        value={form.briefSummary}
                        onChange={handleChange}
                        placeholder="Enter text here..."
                        className={MODAL_TEXTAREA_CLASS}
                    />
                </div>
            </form>
        </BaseModal>
    );
}
