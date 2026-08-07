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
    fullName: '',
    position: '',
    school: '',
    message: '',
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
export default function CommunityVoiceModal({
    isOpen,
    onClose,
    initialData = null,
    onSubmit,
}) {
    const isEditing = initialData != null;
    const formId = useId();
    const [form, setForm] = useState(EMPTY_FORM);

    useEffect(() => {
        if (!isOpen) return;

        if (initialData) {
            setForm({
                fullName: initialData.fullName ?? initialData.name ?? '',
                position: initialData.position ?? initialData.role ?? '',
                school: initialData.school ?? '',
                message: initialData.message ?? '',
                featuredImage: initialData.featuredImage ?? initialData.image ?? null,
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
            title={isEditing ? 'Edit Community Voice' : 'Add Community Voice'}
            footer={
                <button type="submit" form={formId} className={MODAL_SUBMIT_FOOTER_CLASS}>
                    {isEditing ? 'Update' : 'Submit'}
                </button>
            }
        >
            <form id={formId} onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="community-full-name" className={MODAL_LABEL_CLASS}>
                        Full Name
                    </label>
                    <input
                        id="community-full-name"
                        name="fullName"
                        type="text"
                        value={form.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Leslie Alexander"
                        className={MODAL_INPUT_CLASS}
                    />
                </div>

                <div>
                    <label htmlFor="community-position" className={MODAL_LABEL_CLASS}>
                        Position
                    </label>
                    <input
                        id="community-position"
                        name="position"
                        type="text"
                        value={form.position}
                        onChange={handleChange}
                        placeholder="e.g. Student Leader"
                        className={MODAL_INPUT_CLASS}
                    />
                </div>

                <div>
                    <label htmlFor="community-school" className={MODAL_LABEL_CLASS}>
                        School
                    </label>
                    <input
                        id="community-school"
                        name="school"
                        type="text"
                        value={form.school}
                        onChange={handleChange}
                        placeholder="e.g. University of Sto. Tomas"
                        className={MODAL_INPUT_CLASS}
                    />
                </div>

                <div>
                    <label htmlFor="community-message" className={MODAL_LABEL_CLASS}>
                        Message
                    </label>
                    <textarea
                        id="community-message"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Enter text here..."
                        className={MODAL_TEXTAREA_CLASS}
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
