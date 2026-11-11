import BaseModal from "@/Components/Admin/BaseModal";
import FeaturedImageUpload from "@/Components/Admin/FeaturedImageUpload";
import {
    MODAL_INPUT_CLASS,
    MODAL_LABEL_CLASS,
    MODAL_SUBMIT_FOOTER_CLASS,
} from "@/Components/Admin/adminModalFormStyles";
import { useEffect, useState } from "react";

const EMPTY_FORM = {
    name: "",
    link: "",
    order: 0,
    is_active: true,
    logo: null,
};

export default function NetworkOrganizationModal({
    isOpen,
    onClose,
    initialData = null,
    onSubmit,
}) {
    const isEditing = initialData != null;
    const [form, setForm] = useState(EMPTY_FORM);
    const [logoError, setLogoError] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        if (initialData) {
            setForm({
                name: initialData.name ?? "",
                link: initialData.link ?? "",
                order: initialData.order ?? 0,
                is_active: initialData.is_active ?? true,
                logo: initialData.logo_url ?? initialData.logo_path ?? null,
            });
            setLogoError(false);
            return;
        }

        setForm(EMPTY_FORM);
        setLogoError(false);
    }, [isOpen, initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleLogoChange = (file) => {
        setLogoError(false);
        setForm((prev) => ({ ...prev, logo: file }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isEditing && !form.logo) {
            setLogoError(true);
            return;
        }
        onSubmit?.(form);
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? "Edit Network Organization" : "Add Network Organization Logo"}
            size="lg"
            footer={
                <div className={MODAL_SUBMIT_FOOTER_CLASS}>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-neutral-700 bg-transparent px-5 py-2.5 text-sm font-semibold text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="network-org-form"
                        className="rounded-lg bg-[#FBBF24] px-5 py-2.5 text-sm font-bold text-black transition-all hover:brightness-110 active:scale-[0.98]"
                    >
                        {isEditing ? "Update Organization" : "Add Organization"}
                    </button>
                </div>
            }
        >
            <form id="network-org-form" onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="org-name" className={MODAL_LABEL_CLASS}>
                        Organization Name <span className="text-red-400">*</span>
                    </label>
                    <input
                        id="org-name"
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Fatima Esports or School Org"
                        className={MODAL_INPUT_CLASS}
                    />
                </div>

                <div>
                    <label htmlFor="org-link" className={MODAL_LABEL_CLASS}>
                        Destination Link (URL)
                    </label>
                    <input
                        id="org-link"
                        name="link"
                        type="url"
                        value={form.link}
                        onChange={handleChange}
                        placeholder="https://facebook.com/your-page or https://school.edu"
                        className={MODAL_INPUT_CLASS}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        When visitors click this logo on the homepage, they will be redirected to this link.
                    </p>
                </div>

                <div>
                    <label className={MODAL_LABEL_CLASS}>
                        Organization Logo <span className="text-red-400">*</span>
                    </label>
                    <FeaturedImageUpload
                        value={form.logo}
                        onChange={handleLogoChange}
                        hint="PNG, JPG, WEBP, SVG (Transparent PNG recommended, Max 5MB)"
                        accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                    />
                    {logoError && (
                        <p className="mt-1.5 text-xs text-red-400">
                            Please upload a logo image.
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="org-order" className={MODAL_LABEL_CLASS}>
                            Display Order
                        </label>
                        <input
                            id="org-order"
                            name="order"
                            type="number"
                            min="0"
                            value={form.order}
                            onChange={handleChange}
                            className={MODAL_INPUT_CLASS}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Lower numbers appear earlier in the scrolling carousel.
                        </p>
                    </div>

                    <div className="flex items-center pt-6">
                        <label className="flex cursor-pointer items-center gap-3">
                            <input
                                name="is_active"
                                type="checkbox"
                                checked={form.is_active}
                                onChange={handleChange}
                                className="h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-[#FBBF24] focus:ring-[#FBBF24]"
                            />
                            <span className="text-sm font-medium text-white">
                                Active on Homepage
                            </span>
                        </label>
                    </div>
                </div>
            </form>
        </BaseModal>
    );
}
