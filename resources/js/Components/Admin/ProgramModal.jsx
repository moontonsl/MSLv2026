import BaseModal from '@/Components/Admin/BaseModal';
import FeaturedImageUpload from '@/Components/Admin/FeaturedImageUpload';
import {
    MODAL_INPUT_CLASS,
    MODAL_LABEL_CLASS,
    MODAL_SUBMIT_FOOTER_CLASS,
    MODAL_TEXTAREA_CLASS,
} from '@/Components/Admin/adminModalFormStyles';
import { useEffect, useId, useState } from 'react';

const EMPTY_FORM = {
    title: '',
    shortDescription: '',
    links: '',
    featuredImage: null,
};

/**
 * @param {{
 *   isOpen: boolean;
 *   onClose: () => void;
 *   initialData?: Record<string, unknown> | null;
 *   onSubmit: (values: typeof EMPTY_FORM) => void;
 * }} props
 */
export default function ProgramModal({ isOpen, onClose, initialData = null, onSubmit }) {
    const isEditing = initialData != null;
    const formId = useId();
    const [form, setForm] = useState(EMPTY_FORM);

    useEffect(() => {
        if (!isOpen) return;

        if (initialData) {
            setForm({
                title: initialData.title ?? '',
                shortDescription: initialData.shortDescription ?? '',
                links: initialData.links ?? initialData.link ?? '',
                featuredImage: initialData.featuredImage ?? initialData.thumbnail ?? null,
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
            title={isEditing ? 'Edit Programs' : 'Add Programs'}
            footer={
                <button type="submit" form={formId} className={MODAL_SUBMIT_FOOTER_CLASS}>
                    {isEditing ? 'Update' : 'Submit'}
                </button>
            }
        >
            <form id={formId} onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="program-title" className={MODAL_LABEL_CLASS}>
                        Title
                    </label>
                    <input
                        id="program-title"
                        name="title"
                        type="text"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="e.g. Campus Tournament"
                        className={MODAL_INPUT_CLASS}
                    />
                </div>

                <div>
                    <label htmlFor="program-short-description" className={MODAL_LABEL_CLASS}>
                        Short Description
                    </label>
                    <textarea
                        id="program-short-description"
                        name="shortDescription"
                        value={form.shortDescription}
                        onChange={handleChange}
                        placeholder="Enter text here..."
                        className={MODAL_TEXTAREA_CLASS}
                    />
                </div>

                <div>
                    <label htmlFor="program-links" className={MODAL_LABEL_CLASS}>
                        Links
                    </label>
                    <input
                        id="program-links"
                        name="links"
                        type="url"
                        value={form.links}
                        onChange={handleChange}
                        placeholder="https://"
                        className={MODAL_INPUT_CLASS}
                    />
                </div>

                <div>
                    <p className={MODAL_LABEL_CLASS}>Featured Image</p>
                    <FeaturedImageUpload
                        value={form.featuredImage}
                        onChange={(file) =>
                            setForm((prev) => ({ ...prev, featuredImage: file }))
                        }
                    />
                </div>
            </form>
        </BaseModal>
    );
}
