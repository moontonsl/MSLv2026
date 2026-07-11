import BaseModal from '@/Components/Admin/BaseModal';
import FeaturedImageUpload from '@/Components/Admin/FeaturedImageUpload';
import {
    MODAL_INPUT_CLASS,
    MODAL_LABEL_CLASS,
    MODAL_SUBMIT_FOOTER_CLASS,
} from '@/Components/Admin/adminModalFormStyles';
import { useEffect, useId, useState } from 'react';

const EMPTY_FORM = {
    schoolName: '',
    locationRegion: '',
    schoolCode: '',
    logo: null,
};

/**
 * @param {{
 *   isOpen: boolean;
 *   onClose: () => void;
 *   initialData?: Record<string, unknown> | null;
 *   onSubmit: (values: typeof EMPTY_FORM) => void;
 * }} props
 */
export default function SchoolModal({ isOpen, onClose, initialData = null, onSubmit }) {
    const isEditing = initialData != null;
    const formId = useId();
    const [form, setForm] = useState(EMPTY_FORM);

    useEffect(() => {
        if (!isOpen) return;

        if (initialData) {
            setForm({
                schoolName: initialData.schoolName ?? initialData.school ?? '',
                locationRegion:
                    initialData.locationRegion ??
                    initialData.region ??
                    initialData.municipality ??
                    '',
                schoolCode: initialData.schoolCode ?? '',
                logo: initialData.logo ?? null,
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
            title={isEditing ? 'Edit School' : 'Add School'}
            footer={
                <button type="submit" form={formId} className={MODAL_SUBMIT_FOOTER_CLASS}>
                    {isEditing ? 'Update' : 'Submit'}
                </button>
            }
        >
            <form id={formId} onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="school-name" className={MODAL_LABEL_CLASS}>
                        School Name
                    </label>
                    <input
                        id="school-name"
                        name="schoolName"
                        type="text"
                        value={form.schoolName}
                        onChange={handleChange}
                        placeholder="e.g. Laguna University"
                        className={MODAL_INPUT_CLASS}
                    />
                </div>

                <div>
                    <label htmlFor="school-location-region" className={MODAL_LABEL_CLASS}>
                        Location / Region
                    </label>
                    <input
                        id="school-location-region"
                        name="locationRegion"
                        type="text"
                        value={form.locationRegion}
                        onChange={handleChange}
                        placeholder="e.g. Santa Cruz, Region IV-A"
                        className={MODAL_INPUT_CLASS}
                    />
                </div>

                <div>
                    <label htmlFor="school-code" className={MODAL_LABEL_CLASS}>
                        School Code / ID
                    </label>
                    <input
                        id="school-code"
                        name="schoolCode"
                        type="text"
                        value={form.schoolCode}
                        onChange={handleChange}
                        placeholder="e.g. LU-001"
                        className={MODAL_INPUT_CLASS}
                    />
                </div>

                <div>
                    <p className={MODAL_LABEL_CLASS}>Logo / Icon Upload</p>
                    <FeaturedImageUpload
                        value={form.logo}
                        onChange={(file) => setForm((prev) => ({ ...prev, logo: file }))}
                        hint="PNG, JPG, JPEG (MAX. 5MB)"
                    />
                </div>
            </form>
        </BaseModal>
    );
}
