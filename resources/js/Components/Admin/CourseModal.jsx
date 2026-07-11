import BaseModal from '@/Components/Admin/BaseModal';
import {
    MODAL_INPUT_CLASS,
    MODAL_LABEL_CLASS,
    MODAL_SELECT_CLASS,
    MODAL_SUBMIT_FOOTER_CLASS,
    MODAL_TEXTAREA_CLASS,
} from '@/Components/Admin/adminModalFormStyles';
import { DEPARTMENT_OPTIONS } from '@/data/adminAccountData';
import { useEffect, useId, useState } from 'react';

const EMPTY_FORM = {
    courseName: '',
    courseCode: '',
    department: DEPARTMENT_OPTIONS[0],
    description: '',
};

/**
 * @param {{
 *   isOpen: boolean;
 *   onClose: () => void;
 *   initialData?: Record<string, unknown> | null;
 *   onSubmit: (values: typeof EMPTY_FORM) => void;
 * }} props
 */
export default function CourseModal({ isOpen, onClose, initialData = null, onSubmit }) {
    const isEditing = initialData != null;
    const formId = useId();
    const [form, setForm] = useState(EMPTY_FORM);

    useEffect(() => {
        if (!isOpen) return;

        if (initialData) {
            setForm({
                courseName: initialData.courseName ?? initialData.course ?? '',
                courseCode: initialData.courseCode ?? '',
                department: initialData.department ?? DEPARTMENT_OPTIONS[0],
                description: initialData.description ?? '',
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
            title={isEditing ? 'Edit Course' : 'Add Course'}
            footer={
                <button type="submit" form={formId} className={MODAL_SUBMIT_FOOTER_CLASS}>
                    {isEditing ? 'Update' : 'Submit'}
                </button>
            }
        >
            <form id={formId} onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="course-name" className={MODAL_LABEL_CLASS}>
                        Course Name
                    </label>
                    <input
                        id="course-name"
                        name="courseName"
                        type="text"
                        value={form.courseName}
                        onChange={handleChange}
                        placeholder="e.g. Bachelor of Science in Information Technology"
                        className={MODAL_INPUT_CLASS}
                    />
                </div>

                <div>
                    <label htmlFor="course-code" className={MODAL_LABEL_CLASS}>
                        Course Code
                    </label>
                    <input
                        id="course-code"
                        name="courseCode"
                        type="text"
                        value={form.courseCode}
                        onChange={handleChange}
                        placeholder="e.g. BSIT"
                        className={MODAL_INPUT_CLASS}
                    />
                </div>

                <div>
                    <label htmlFor="course-department" className={MODAL_LABEL_CLASS}>
                        Department
                    </label>
                    <select
                        id="course-department"
                        name="department"
                        value={form.department}
                        onChange={handleChange}
                        className={MODAL_SELECT_CLASS}
                    >
                        {DEPARTMENT_OPTIONS.map((department) => (
                            <option key={department} value={department}>
                                {department}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="course-description" className={MODAL_LABEL_CLASS}>
                        Description
                    </label>
                    <textarea
                        id="course-description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Enter text here..."
                        className={MODAL_TEXTAREA_CLASS}
                    />
                </div>
            </form>
        </BaseModal>
    );
}
