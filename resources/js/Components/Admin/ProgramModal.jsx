import BaseModal from "@/Components/Admin/BaseModal";
import FeaturedImageUpload from "@/Components/Admin/FeaturedImageUpload";
import {
    MODAL_INPUT_CLASS,
    MODAL_LABEL_CLASS,
    MODAL_SELECT_CLASS,
    MODAL_SUBMIT_FOOTER_CLASS,
    MODAL_TEXTAREA_CLASS,
} from "@/Components/Admin/adminModalFormStyles";
import {
    Bookmark,
    Gamepad2,
    Gift,
    Mic2,
    Network,
    Presentation,
    Swords,
    UserPlus,
} from "lucide-react";
import { useEffect, useId, useState } from "react";

export const PROGRAM_ICON_OPTIONS = [
    { value: "swords", label: "Swords (Tournaments)", Icon: Swords },
    { value: "network", label: "Network (Organizations)", Icon: Network },
    { value: "gift", label: "Gift (Buffs & Support)", Icon: Gift },
    { value: "gamepad", label: "Gamepad (Esports / Gaming)", Icon: Gamepad2 },
    { value: "presentation", label: "Presentation (Seminars)", Icon: Presentation },
    { value: "microphone", label: "Microphone (Shoutcasting / Media)", Icon: Mic2 },
    { value: "user", label: "User Plus (Referrals / Membership)", Icon: UserPlus },
];

const ACCENT_COLOR_PRESETS = [
    { value: "#f2c21a", label: "MSL Gold" },
    { value: "#60a5fa", label: "Sky Blue" },
    { value: "#4ade80", label: "Emerald" },
    { value: "#f472b6", label: "Rose" },
    { value: "#a78bfa", label: "Violet" },
    { value: "#fb923c", label: "Amber Orange" },
];

const EMPTY_FORM = {
    title: "",
    description: "",
    link: "",
    icon: "swords",
    color: "#f2c21a",
    is_bookmarked: false,
    is_active: true,
    featuredImage: null,
};

export default function ProgramModal({
    isOpen,
    onClose,
    initialData = null,
    onSubmit,
    bookmarkedCount = 0,
    maxBookmarked = 5,
    submitting = false,
}) {
    const isEditing = initialData != null;
    const formId = useId();
    const [form, setForm] = useState(EMPTY_FORM);

    useEffect(() => {
        if (!isOpen) return;

        if (initialData) {
            setForm({
                title: initialData.title ?? "",
                description:
                    initialData.description ?? initialData.shortDescription ?? "",
                link: initialData.link ?? initialData.links ?? "",
                icon: initialData.icon || "swords",
                color: initialData.color || "#f2c21a",
                is_bookmarked: Boolean(initialData.is_bookmarked),
                is_active:
                    initialData.is_active !== undefined
                        ? Boolean(initialData.is_active)
                        : true,
                featuredImage:
                    initialData.image_url ??
                    initialData.featuredImage ??
                    initialData.thumbnail ??
                    null,
            });
            return;
        }

        setForm(EMPTY_FORM);
    }, [isOpen, initialData]);

    const alreadyBookmarkedInDb = Boolean(isEditing && initialData?.is_bookmarked);
    const bookmarkLimitReached =
        !alreadyBookmarkedInDb && bookmarkedCount >= maxBookmarked;
    const isBookmarkCheckboxDisabled =
        bookmarkLimitReached && !form.is_bookmarked;

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!form.title.trim()) return;
        onSubmit({
            ...form,
            title: form.title.trim(),
            description: form.description.trim(),
            link: form.link.trim(),
        });
    };

    const ActiveIcon =
        PROGRAM_ICON_OPTIONS.find((opt) => opt.value === form.icon)?.Icon || Swords;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? "Edit Program" : "Add Program"}
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
                          ? "Update Program"
                          : "Add Program"}
                </button>
            }
            confirmSubmitMessage={
                isEditing ? "Are you sure you want to update this program?" : ""
            }
        >
            <form id={formId} onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="program-title"
                        className={MODAL_LABEL_CLASS}
                    >
                        Title <span className="text-red-400">*</span>
                    </label>
                    <input
                        id="program-title"
                        name="title"
                        type="text"
                        required
                        maxLength={255}
                        value={form.title}
                        onChange={handleChange}
                        placeholder="e.g. Campus Tournaments"
                        className={MODAL_INPUT_CLASS}
                    />
                </div>

                <div>
                    <label
                        htmlFor="program-short-description"
                        className={MODAL_LABEL_CLASS}
                    >
                        Short Description
                    </label>
                    <textarea
                        id="program-short-description"
                        name="description"
                        maxLength={1500}
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Briefly describe what students get from this program..."
                        className={MODAL_TEXTAREA_CLASS}
                    />
                </div>

                <div>
                    <label
                        htmlFor="program-link"
                        className={MODAL_LABEL_CLASS}
                    >
                        Destination Link
                    </label>
                    <input
                        id="program-link"
                        name="link"
                        type="text"
                        maxLength={500}
                        value={form.link}
                        onChange={handleChange}
                        placeholder="e.g. /CampusTournaments or https://..."
                        className={MODAL_INPUT_CLASS}
                    />
                    <p className="mt-1 text-xs text-[#85858F]">
                        Supports internal routes (e.g.{" "}
                        <code className="text-[#EDE3C0]">/CampusTournaments</code>,{" "}
                        <code className="text-[#EDE3C0]">/MSLNetwork</code>) or full external URLs.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor="program-icon"
                            className={MODAL_LABEL_CLASS}
                        >
                            Card Icon (/Programs Page)
                        </label>
                        <div className="flex items-center gap-2.5">
                            <span
                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-white/10 bg-[#151515]"
                                style={{ color: form.color || "#f2c21a" }}
                                aria-hidden="true"
                            >
                                <ActiveIcon className="h-5 w-5" />
                            </span>
                            <select
                                id="program-icon"
                                name="icon"
                                value={form.icon}
                                onChange={handleChange}
                                className={MODAL_SELECT_CLASS}
                            >
                                {PROGRAM_ICON_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <span className={MODAL_LABEL_CLASS}>Icon Accent Color</span>
                        <div className="flex min-h-[44px] flex-wrap items-center gap-2 rounded-sm border border-white/[0.06] bg-[#151515] px-3 py-2">
                            {ACCENT_COLOR_PRESETS.map((preset) => {
                                const selected =
                                    (form.color || "").toLowerCase() ===
                                    preset.value.toLowerCase();
                                return (
                                    <button
                                        key={preset.value}
                                        type="button"
                                        title={preset.label}
                                        aria-label={`Select ${preset.label} accent color`}
                                        aria-pressed={selected}
                                        onClick={() =>
                                            setForm((prev) => ({
                                                ...prev,
                                                color: preset.value,
                                            }))
                                        }
                                        className={`h-6 w-6 rounded-full border transition cursor-pointer ${
                                            selected
                                                ? "scale-110 border-white ring-2 ring-[#FBBF24]"
                                                : "border-white/20 opacity-80 hover:opacity-100"
                                        }`}
                                        style={{ backgroundColor: preset.value }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <label
                        className={`flex items-start gap-3 rounded-lg border p-3 transition ${
                            isBookmarkCheckboxDisabled
                                ? "cursor-not-allowed border-white/[0.05] bg-[#131315] opacity-60"
                                : form.is_bookmarked
                                  ? "cursor-pointer border-[#FBBF24]/40 bg-[#FBBF24]/10"
                                  : "cursor-pointer border-white/[0.08] bg-[#151515] hover:border-white/[0.16]"
                        }`}
                    >
                        <input
                            type="checkbox"
                            name="is_bookmarked"
                            checked={form.is_bookmarked}
                            disabled={isBookmarkCheckboxDisabled}
                            onChange={handleChange}
                            className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-600 bg-neutral-900 text-[#FBBF24] focus:ring-[#FBBF24]"
                        />
                        <span className="min-w-0 flex-1 text-xs leading-5">
                            <span className="flex items-center gap-1.5 font-semibold text-white">
                                <Bookmark
                                    className="h-3.5 w-3.5 text-[#FBBF24]"
                                    fill={form.is_bookmarked ? "currentColor" : "none"}
                                    aria-hidden="true"
                                />
                                Bookmark for Homepage (up to {maxBookmarked})
                            </span>
                            <span className="mt-0.5 block text-[#85858F]">
                                {isBookmarkCheckboxDisabled
                                    ? `${bookmarkedCount}/${maxBookmarked} slots full — unbookmark one first.`
                                    : "Showcases this program in the Homepage slider."}
                            </span>
                        </span>
                    </label>

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
                                Visible on Our Programs page
                            </span>
                            <span className="mt-0.5 block text-[#85858F]">
                                Publishes this card to the public /Programs page.
                            </span>
                        </span>
                    </label>
                </div>

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
