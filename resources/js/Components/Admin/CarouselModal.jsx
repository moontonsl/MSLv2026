import BaseModal from '@/Components/Admin/BaseModal';
import FeaturedImageUpload from '@/Components/Admin/FeaturedImageUpload';
import {
    MODAL_DATE_HINT_CLASS,
    MODAL_INPUT_CLASS,
    MODAL_LABEL_CLASS,
    MODAL_SUBMIT_FOOTER_CLASS,
    MODAL_TEXTAREA_CLASS,
} from '@/Components/Admin/adminModalFormStyles';
import { useEffect, useId, useState } from 'react';

const EMPTY_FORM = {
    label: '',
    title: '',
    subtitle: '',
    link: '',
    startDate: '',
    endDate: '',
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
export default function CarouselModal({ isOpen, onClose, initialData = null, onSubmit }) {
    const isEditing = initialData != null;
    const formId = useId();
    const [form, setForm] = useState(EMPTY_FORM);

    useEffect(() => {
        if (!isOpen) return;

        if (initialData) {
            setForm({
                label: initialData.label ?? '',
                title: initialData.title ?? '',
                subtitle: initialData.subtitle ?? '',
                link: initialData.link ?? '',
                startDate: initialData.startDate ?? '',
                endDate: initialData.endDate ?? '',
                featuredImage: initialData.featuredImage ?? null,
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
            title={isEditing ? 'Edit Carousel' : 'Add Carousel'}
            footer={
                <button type="submit" form={formId} className={MODAL_SUBMIT_FOOTER_CLASS}>
                    {isEditing ? 'Update' : 'Submit'}
                </button>
            }
        >
            <form id={formId} onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="carousel-label" className={MODAL_LABEL_CLASS}>
                        Label
                    </label>
                    <input
                        id="carousel-label"
                        name="label"
                        type="text"
                        value={form.label}
                        onChange={handleChange}
                        placeholder="e.g. Featured"
                        className={MODAL_INPUT_CLASS}
                    />
                </div>

                <div>
                    <label htmlFor="carousel-title" className={MODAL_LABEL_CLASS}>
                        Title
                    </label>
                    <input
                        id="carousel-title"
                        name="title"
                        type="text"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="e.g. MSL Network Awards"
                        className={MODAL_INPUT_CLASS}
                    />
                </div>

                <div>
                    <label htmlFor="carousel-subtitle" className={MODAL_LABEL_CLASS}>
                        Subtitle
                    </label>
                    <textarea
                        id="carousel-subtitle"
                        name="subtitle"
                        value={form.subtitle}
                        onChange={handleChange}
                        placeholder="Enter text here..."
                        className={MODAL_TEXTAREA_CLASS}
                    />
                </div>

                <div>
                    <label htmlFor="carousel-link" className={MODAL_LABEL_CLASS}>
                        Link
                    </label>
                    <input
                        id="carousel-link"
                        name="link"
                        type="url"
                        value={form.link}
                        onChange={handleChange}
                        placeholder="https://"
                        className={MODAL_INPUT_CLASS}
                    />
                </div>

                <div>
                    <label htmlFor="carousel-start-date" className={MODAL_LABEL_CLASS}>
                        Start Date
                    </label>
                    <input
                        id="carousel-start-date"
                        name="startDate"
                        type="date"
                        value={form.startDate}
                        onChange={handleChange}
                        className={MODAL_INPUT_CLASS}
                    />
                    <p className={MODAL_DATE_HINT_CLASS}>mm/dd/yyyy</p>
                </div>

                <div>
                    <label htmlFor="carousel-end-date" className={MODAL_LABEL_CLASS}>
                        End Date
                    </label>
                    <input
                        id="carousel-end-date"
                        name="endDate"
                        type="date"
                        value={form.endDate}
                        onChange={handleChange}
                        className={MODAL_INPUT_CLASS}
                    />
                    <p className={MODAL_DATE_HINT_CLASS}>mm/dd/yyyy</p>
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
