import BaseModal from "@/Components/Admin/BaseModal";
import {
    MODAL_CANCEL_CLASS,
    MODAL_CONFIRM_YES_CLASS,
    MODAL_INPUT_CLASS,
    MODAL_LABEL_CLASS,
} from "@/Components/Admin/adminModalFormStyles";
import { useEffect, useState } from "react";

const DEFAULT_REGIONS = [
    "NCR",
    "North/Central Luzon",
    "South Luzon",
    "Visayas",
    "Mindanao",
];

const DEFAULT_TIERS = ["Level I", "Level II", "Level III"];

const EMPTY_FORM = {
    school: "",
    community: "",
    region: "NCR",
    tier: "Level I",
    members: 0,
    href: "",
    order: 0,
    is_active: true,
};

export default function CommunityDirectoryModal({
    isOpen,
    onClose,
    initialData = null,
    regions = DEFAULT_REGIONS,
    tiers = DEFAULT_TIERS,
    onSubmit,
    processing = false,
    errors = {},
}) {
    const isEditing = initialData != null;
    const [form, setForm] = useState(EMPTY_FORM);

    useEffect(() => {
        if (!isOpen) return;

        if (initialData) {
            setForm({
                school: initialData.school ?? "",
                community: initialData.community ?? "",
                region: initialData.region ?? regions[0] ?? "NCR",
                tier: initialData.tier ?? tiers[0] ?? "Level I",
                members: initialData.members ?? 0,
                href: initialData.href ?? "",
                order: initialData.order ?? 0,
                is_active: initialData.is_active ?? true,
            });
            return;
        }

        setForm({
            ...EMPTY_FORM,
            region: regions[0] ?? "NCR",
            tier: tiers[0] ?? "Level I",
        });
    }, [isOpen, initialData, regions, tiers]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit?.({
            ...form,
            members: Number(form.members) || 0,
            order: Number(form.order) || 0,
        });
    };

    const regionOptions = Array.from(
        new Set([...(regions || DEFAULT_REGIONS), ...(form.region ? [form.region] : [])])
    );

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? "Edit Campus Community" : "Add Campus Community"}
            maxWidth="max-w-xl"
            footer={
                <div className="grid grid-cols-1 gap-2.5 min-[380px]:grid-cols-2 sm:gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={processing}
                        className={MODAL_CANCEL_CLASS}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="community-directory-form"
                        disabled={processing}
                        className={MODAL_CONFIRM_YES_CLASS}
                    >
                        {processing
                            ? "Saving..."
                            : isEditing
                            ? "Update Community"
                            : "Add Community"}
                    </button>
                </div>
            }
        >
            <form
                id="community-directory-form"
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                <div>
                    <label htmlFor="cd-school" className={MODAL_LABEL_CLASS}>
                        School / Institution <span className="text-red-400">*</span>
                    </label>
                    <input
                        id="cd-school"
                        name="school"
                        type="text"
                        required
                        value={form.school}
                        onChange={handleChange}
                        placeholder="e.g. Ateneo de Davao University"
                        className={MODAL_INPUT_CLASS}
                    />
                    {errors.school && (
                        <p className="mt-1 text-xs text-red-400">{errors.school}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="cd-community" className={MODAL_LABEL_CLASS}>
                        Community Name <span className="text-red-400">*</span>
                    </label>
                    <input
                        id="cd-community"
                        name="community"
                        type="text"
                        required
                        value={form.community}
                        onChange={handleChange}
                        placeholder="e.g. AdDU - Blue Knights"
                        className={MODAL_INPUT_CLASS}
                    />
                    {errors.community && (
                        <p className="mt-1 text-xs text-red-400">{errors.community}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="cd-region" className={MODAL_LABEL_CLASS}>
                            Region <span className="text-red-400">*</span>
                        </label>
                        <select
                            id="cd-region"
                            name="region"
                            required
                            value={form.region}
                            onChange={handleChange}
                            className={MODAL_INPUT_CLASS}
                        >
                            {regionOptions.map((reg) => (
                                <option key={reg} value={reg} className="bg-[#121215] text-white">
                                    {reg}
                                </option>
                            ))}
                        </select>
                        {errors.region && (
                            <p className="mt-1 text-xs text-red-400">{errors.region}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="cd-tier" className={MODAL_LABEL_CLASS}>
                            Status / Level <span className="text-red-400">*</span>
                        </label>
                        <select
                            id="cd-tier"
                            name="tier"
                            required
                            value={form.tier}
                            onChange={handleChange}
                            className={MODAL_INPUT_CLASS}
                        >
                            {(tiers || DEFAULT_TIERS).map((tier) => (
                                <option key={tier} value={tier} className="bg-[#121215] text-white">
                                    {tier}
                                </option>
                            ))}
                        </select>
                        {errors.tier && (
                            <p className="mt-1 text-xs text-red-400">{errors.tier}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="cd-members" className={MODAL_LABEL_CLASS}>
                            Members Count <span className="text-red-400">*</span>
                        </label>
                        <input
                            id="cd-members"
                            name="members"
                            type="number"
                            min="0"
                            required
                            value={form.members}
                            onChange={handleChange}
                            placeholder="e.g. 600"
                            className={MODAL_INPUT_CLASS}
                        />
                        {errors.members && (
                            <p className="mt-1 text-xs text-red-400">{errors.members}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="cd-order" className={MODAL_LABEL_CLASS}>
                            Display Order
                        </label>
                        <input
                            id="cd-order"
                            name="order"
                            type="number"
                            min="0"
                            value={form.order}
                            onChange={handleChange}
                            placeholder="0"
                            className={MODAL_INPUT_CLASS}
                        />
                        <p className="mt-1 text-[11px] text-gray-500">
                            Lower numbers appear first in the directory.
                        </p>
                    </div>
                </div>

                <div>
                    <label htmlFor="cd-href" className={MODAL_LABEL_CLASS}>
                        Join Group Link (Facebook / URL)
                    </label>
                    <input
                        id="cd-href"
                        name="href"
                        type="text"
                        value={form.href}
                        onChange={handleChange}
                        placeholder="https://www.facebook.com/groups/... (or leave blank for #accreditation)"
                        className={MODAL_INPUT_CLASS}
                    />
                    {errors.href && (
                        <p className="mt-1 text-xs text-red-400">{errors.href}</p>
                    )}
                    <p className="mt-1 text-[11px] text-gray-500">
                        Destination URL for the blue "Join Group" button on the Campus page.
                    </p>
                </div>

                <div className="pt-1">
                    <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5">
                        <input
                            name="is_active"
                            type="checkbox"
                            checked={form.is_active}
                            onChange={handleChange}
                            className="h-4 w-4 shrink-0 rounded border-neutral-700 bg-neutral-900 text-[#FBBF24] focus:ring-[#FBBF24]"
                        />
                        <div>
                            <span className="block text-sm font-medium text-white">
                                Visible on Public Community Directory
                            </span>
                            <span className="block text-[11px] text-gray-400">
                                Uncheck to hide this community from the /Campus page without deleting it.
                            </span>
                        </div>
                    </label>
                </div>
            </form>
        </BaseModal>
    );
}
