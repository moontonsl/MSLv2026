import BaseModal from "@/Components/Admin/BaseModal";
import FeaturedImageUpload from "@/Components/Admin/FeaturedImageUpload";
import {
    MODAL_INPUT_CLASS,
    MODAL_LABEL_CLASS,
    MODAL_SUBMIT_FOOTER_CLASS,
    MODAL_TEXTAREA_CLASS,
} from "@/Components/Admin/adminModalFormStyles";
import { SCHOOL_OPTIONS } from "@/data/adminHomeData";
import { useEffect, useId, useMemo, useState } from "react";

const EMPTY_FORM = {
    fullName: "",
    position: "",
    school: "",
    message: "",
    is_active: true,
    featuredImage: null,
};

export default function CommunityVoiceModal({
    isOpen,
    onClose,
    initialData = null,
    onSubmit,
    schools = [],
    submitting = false,
}) {
    const isEditing = initialData != null;
    const formId = useId();
    const datalistId = useId();
    const [form, setForm] = useState(EMPTY_FORM);

    const schoolSuggestions = useMemo(() => {
        const merged = [
            ...(Array.isArray(schools) ? schools : []),
            ...SCHOOL_OPTIONS,
        ];
        return Array.from(
            new Set(
                merged
                    .map((item) => (typeof item === "string" ? item.trim() : ""))
                    .filter(Boolean),
            ),
        );
    }, [schools]);

    useEffect(() => {
        if (!isOpen) return;

        if (initialData) {
            setForm({
                fullName: initialData.fullName ?? initialData.name ?? "",
                position: initialData.position ?? initialData.role ?? "",
                school: initialData.school ?? "",
                message: initialData.message ?? initialData.quote ?? "",
                is_active:
                    initialData.is_active !== undefined
                        ? Boolean(initialData.is_active)
                        : true,
                featuredImage:
                    initialData.image_url ??
                    initialData.featuredImage ??
                    initialData.image ??
                    null,
            });
            return;
        }

        setForm(EMPTY_FORM);
    }, [isOpen, initialData]);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (
            !form.fullName.trim() ||
            !form.position.trim() ||
            !form.school.trim() ||
            !form.message.trim()
        ) {
            return;
        }
        onSubmit({
            ...form,
            fullName: form.fullName.trim(),
            position: form.position.trim(),
            school: form.school.trim(),
            message: form.message.trim(),
        });
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={
                isEditing
                    ? "Edit MSL Campus Community"
                    : "Add MSL Campus Community"
            }
            maxWidth="max-w-xl"
            footer={
                <button
                    type="submit"
                    form={formId}
                    disabled={submitting}
                    className={`${MODAL_SUBMIT_FOOTER_CLASS} disabled:cursor-not-allowed disabled:opacity-60`}
                >
                    {submitting
                        ? isEditing
                            ? "Updating..."
                            : "Submitting..."
                        : isEditing
                          ? "Update"
                          : "Submit"}
                </button>
            }
            confirmSubmitMessage={
                isEditing
                    ? "Are you sure you want to update this community story?"
                    : ""
            }
        >
            <form id={formId} onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="modal-community-full-name"
                        className={MODAL_LABEL_CLASS}
                    >
                        Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                        id="modal-community-full-name"
                        name="fullName"
                        type="text"
                        required
                        maxLength={255}
                        value={form.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Leslie Alexander"
                        className={MODAL_INPUT_CLASS}
                    />
                </div>

                <div>
                    <label
                        htmlFor="modal-community-position"
                        className={MODAL_LABEL_CLASS}
                    >
                        Position <span className="text-red-400">*</span>
                    </label>
                    <input
                        id="modal-community-position"
                        name="position"
                        type="text"
                        required
                        maxLength={255}
                        value={form.position}
                        onChange={handleChange}
                        placeholder="e.g. Student Leader"
                        className={MODAL_INPUT_CLASS}
                    />
                </div>

                <div>
                    <label
                        htmlFor="modal-community-school"
                        className={MODAL_LABEL_CLASS}
                    >
                        School <span className="text-red-400">*</span>
                    </label>
                    <input
                        id="modal-community-school"
                        name="school"
                        type="text"
                        required
                        maxLength={255}
                        list={datalistId}
                        value={form.school}
                        onChange={handleChange}
                        placeholder="Type or select school..."
                        className={MODAL_INPUT_CLASS}
                    />
                    <datalist id={datalistId}>
                        {schoolSuggestions.map((schoolName) => (
                            <option key={schoolName} value={schoolName} />
                        ))}
                    </datalist>
                </div>

                <div>
                    <label
                        htmlFor="modal-community-message"
                        className={MODAL_LABEL_CLASS}
                    >
                        Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                        id="modal-community-message"
                        name="message"
                        required
                        maxLength={1500}
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Share their MSL campus story..."
                        className={MODAL_TEXTAREA_CLASS}
                    />
                </div>

                <label
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition ${
                        form.is_active
                            ? "border-emerald-500/35 bg-emerald-500/10"
                            : "border-white/[0.08] bg-[#151515] hover:border-white/[0.16]"
                    }`}
                >
                    <input
                        type="checkbox"
                        name="is_active"
                        checked={form.is_active}
                        onChange={handleChange}
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-600 bg-neutral-900 text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className="min-w-0 flex-1 text-xs leading-5">
                        <span className="block font-semibold text-white">
                            Active Testimonial Card
                        </span>
                        <span className="mt-0.5 block text-[#85858F]">
                            Included in the Homepage community showcase when the section is visible.
                        </span>
                    </span>
                </label>

                <div>
                    <p className={MODAL_LABEL_CLASS}>Featured Image</p>
                    <FeaturedImageUpload
                        value={form.featuredImage}
                        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/svg+xml"
                        hint="PNG, JPG, JPEG, WEBP (Max. 5MB)"
                        onChange={(file) =>
                            setForm((prev) => ({
                                ...prev,
                                featuredImage: file,
                            }))
                        }
                    />
                </div>
            </form>
        </BaseModal>
    );
}
