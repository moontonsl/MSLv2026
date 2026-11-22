import BaseModal from "@/Components/Admin/BaseModal";
import {
    MODAL_CANCEL_CLASS,
    MODAL_CONFIRM_YES_CLASS,
    MODAL_INPUT_CLASS,
    MODAL_LABEL_CLASS,
} from "@/Components/Admin/adminModalFormStyles";
import axios from "axios";
import { Loader2, RefreshCw, Search, ShieldCheck, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const DEFAULT_TIERS = ["Level I", "Level II", "Level III"];

const EMPTY_FORM = {
    school: "",
    community: "",
    region: "",
    tier: "Level I",
    members: 0,
    href: "",
    is_active: true,
};

export default function CommunityDirectoryModal({
    isOpen,
    onClose,
    initialData = null,
    regions = [],
    tiers = DEFAULT_TIERS,
    onSubmit,
    processing = false,
    errors = {},
}) {
    const isEditing = initialData != null;
    const [form, setForm] = useState(EMPTY_FORM);

    // Searchable Combobox state
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [schoolResults, setSchoolResults] = useState([]);
    const [loadingSchools, setLoadingSchools] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [linkedVerifiedCount, setLinkedVerifiedCount] = useState(null);

    const comboboxRef = useRef(null);
    const schoolInputRef = useRef(null);

    useEffect(() => {
        if (!isOpen) {
            setDropdownOpen(false);
            setHighlightedIndex(-1);
            return;
        }

        if (initialData) {
            setForm({
                school: initialData.school ?? "",
                community: initialData.community ?? "",
                region: initialData.region ?? regions[0] ?? "",
                tier: initialData.tier ?? tiers[0] ?? "Level I",
                members: initialData.members ?? 0,
                href: initialData.href ?? "",
                is_active: initialData.is_active ?? true,
            });
            setLinkedVerifiedCount(
                typeof initialData.verified_members_count === "number"
                    ? initialData.verified_members_count
                    : null
            );
            return;
        }

        setForm({
            ...EMPTY_FORM,
            region: regions[0] ?? "",
            tier: tiers[0] ?? "Level I",
        });
        setLinkedVerifiedCount(null);
    }, [isOpen, initialData, regions, tiers]);

    // Close combobox popover on outside click
    useEffect(() => {
        if (!dropdownOpen) return undefined;
        const handleOutsideClick = (event) => {
            if (comboboxRef.current && !comboboxRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [dropdownOpen]);

    // Realtime debounced query filtering for schools
    useEffect(() => {
        if (!isOpen || !dropdownOpen) return undefined;

        let cancelled = false;
        const timer = setTimeout(async () => {
            setLoadingSchools(true);
            try {
                const { data } = await axios.get(route("admin.community-directory.schools"), {
                    params: { q: form.school.trim() },
                });
                if (!cancelled) {
                    setSchoolResults(Array.isArray(data?.schools) ? data.schools : []);
                    setHighlightedIndex(-1);
                }
            } catch {
                if (!cancelled) {
                    setSchoolResults([]);
                }
            } finally {
                if (!cancelled) {
                    setLoadingSchools(false);
                }
            }
        }, 180);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [form.school, dropdownOpen, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSchoolInputChange = (e) => {
        const value = e.target.value;
        setForm((prev) => ({ ...prev, school: value }));
        setDropdownOpen(true);
    };

    const handleClearSchool = () => {
        setForm((prev) => ({ ...prev, school: "" }));
        setLinkedVerifiedCount(null);
        setDropdownOpen(true);
        schoolInputRef.current?.focus();
    };

    const handleSelectSchool = (school) => {
        setForm((prev) => ({
            ...prev,
            school: school.name,
            region: school.region || prev.region,
            members: Number(school.verified_members_count ?? 0),
        }));
        setLinkedVerifiedCount(Number(school.verified_members_count ?? 0));
        setDropdownOpen(false);
        setHighlightedIndex(-1);
    };

    const handleSchoolKeyDown = (e) => {
        if (!dropdownOpen) {
            if (e.key === "ArrowDown") {
                setDropdownOpen(true);
            }
            return;
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightedIndex((prev) =>
                schoolResults.length === 0 ? -1 : (prev + 1) % schoolResults.length
            );
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightedIndex((prev) =>
                schoolResults.length === 0
                    ? -1
                    : prev <= 0
                    ? schoolResults.length - 1
                    : prev - 1
            );
        } else if (e.key === "Enter" && highlightedIndex >= 0 && schoolResults[highlightedIndex]) {
            e.preventDefault();
            handleSelectSchool(schoolResults[highlightedIndex]);
        } else if (e.key === "Escape") {
            e.stopPropagation();
            setDropdownOpen(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit?.({
            ...form,
            members: Number(form.members) || 0,
        });
    };

    const regionOptions = Array.from(
        new Set([...(regions || []), ...(form.region ? [form.region] : [])])
    ).filter(Boolean);

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
                {/* Searchable School Combobox */}
                <div ref={comboboxRef} className="relative">
                    <label htmlFor="cd-school" className={MODAL_LABEL_CLASS}>
                        School / Institution <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            ref={schoolInputRef}
                            id="cd-school"
                            name="school"
                            type="text"
                            role="combobox"
                            aria-expanded={dropdownOpen}
                            aria-autocomplete="list"
                            aria-controls="cd-school-listbox"
                            autoComplete="off"
                            required
                            value={form.school}
                            onFocus={() => setDropdownOpen(true)}
                            onChange={handleSchoolInputChange}
                            onKeyDown={handleSchoolKeyDown}
                            placeholder="Search school from database (e.g. Ateneo, UP, UST)..."
                            className={`${MODAL_INPUT_CLASS} pl-10 pr-10 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/25`}
                        />

                        {loadingSchools ? (
                            <Loader2 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-amber-400" />
                        ) : form.school ? (
                            <button
                                type="button"
                                onClick={handleClearSchool}
                                aria-label="Clear school selection"
                                className="absolute right-2.5 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        ) : null}
                    </div>

                    {/* Floating Popover Dropdown */}
                    {dropdownOpen && (
                        <div
                            id="cd-school-listbox"
                            role="listbox"
                            className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-64 overflow-y-auto overscroll-contain rounded-xl border border-amber-400/30 bg-[#121216] p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.85)] backdrop-blur-xl"
                        >
                            {loadingSchools && schoolResults.length === 0 ? (
                                <div className="flex items-center justify-center gap-2 px-3 py-5 text-xs text-gray-400">
                                    <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                                    <span>Searching schools...</span>
                                </div>
                            ) : schoolResults.length === 0 ? (
                                <div className="px-3 py-4 text-center text-xs text-gray-400">
                                    No matching schools found in database. You can still enter a custom name.
                                </div>
                            ) : (
                                schoolResults.map((school, idx) => {
                                    const isHighlighted = idx === highlightedIndex;
                                    const isCurrent =
                                        form.school.trim().toLowerCase() ===
                                        school.name.trim().toLowerCase();

                                    return (
                                        <button
                                            key={`${school.type}-${school.name}-${idx}`}
                                            type="button"
                                            role="option"
                                            aria-selected={isCurrent}
                                            onMouseEnter={() => setHighlightedIndex(idx)}
                                            onClick={() => handleSelectSchool(school)}
                                            className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                                                isHighlighted || isCurrent
                                                    ? "bg-amber-400/15 text-white"
                                                    : "text-gray-200 hover:bg-white/[0.06] hover:text-white"
                                            }`}
                                        >
                                            <div className="min-w-0 flex-1">
                                                <div className="truncate text-xs font-semibold">
                                                    {school.name}
                                                </div>
                                                {school.acronym ? (
                                                    <div className="mt-0.5 truncate text-[11px] text-gray-400">
                                                        {school.acronym}
                                                    </div>
                                                ) : null}
                                            </div>
                                            <div className="shrink-0 text-right font-mono text-[11px]">
                                                <span className="text-amber-300">
                                                    {Number(school.verified_members_count ?? 0).toLocaleString()} verified
                                                </span>
                                                {school.region ? (
                                                    <span className="block text-[10px] text-gray-400">
                                                        {school.region}
                                                    </span>
                                                ) : null}
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    )}

                    {errors.school && (
                        <p className="mt-1 text-xs text-red-400">{errors.school}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="cd-community" className={MODAL_LABEL_CLASS}>
                        Community Name{" "}
                        <span className="font-normal lowercase text-gray-500">(optional)</span>
                    </label>
                    <input
                        id="cd-community"
                        name="community"
                        type="text"
                        value={form.community}
                        onChange={handleChange}
                        placeholder="e.g. AdDU - Blue Knights (optional)"
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
                            {regionOptions.length === 0 ? (
                                <option value="" className="bg-[#121215] text-gray-400">
                                    Select region...
                                </option>
                            ) : null}
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

                <div>
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                        <label htmlFor="cd-members" className="text-xs font-semibold uppercase tracking-wide text-gray-300">
                            Members Count <span className="text-red-400">*</span>
                        </label>
                        {linkedVerifiedCount !== null && (
                            <button
                                type="button"
                                onClick={() =>
                                    setForm((prev) => ({ ...prev, members: linkedVerifiedCount }))
                                }
                                className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/20"
                                title="Sync with verified accounts linked to this school"
                            >
                                <ShieldCheck className="h-3 w-3" />
                                <span>{linkedVerifiedCount.toLocaleString()} verified</span>
                                {Number(form.members) !== linkedVerifiedCount && (
                                    <RefreshCw className="ml-0.5 h-2.5 w-2.5" />
                                )}
                            </button>
                        )}
                    </div>
                    <input
                        id="cd-members"
                        name="members"
                        type="number"
                        min="0"
                        required
                        value={form.members}
                        onChange={handleChange}
                        placeholder="Auto-filled from verified school accounts"
                        className={MODAL_INPUT_CLASS}
                    />
                    {errors.members && (
                        <p className="mt-1 text-xs text-red-400">{errors.members}</p>
                    )}
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
