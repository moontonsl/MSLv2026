import BaseModal from "@/Components/Admin/BaseModal";
import FeaturedImageUpload from "@/Components/Admin/FeaturedImageUpload";
import {
    MODAL_INPUT_CLASS,
    MODAL_LABEL_CLASS,
    MODAL_SELECT_CLASS,
} from "@/Components/Admin/adminModalFormStyles";
import { toDateTimeLocal } from "@/data/adminRegistrationData";
import { ChevronDown, Trash2 } from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";

const DEFAULT_EVENT_NAMES = [
    "Community",
    "All Star Dance Challenge 2026",
    "MSL Campus Clash 2026",
];

const DEFAULT_REGION_OPTIONS = ["Luzon", "Visayas", "Mindanao"];

const DEFAULT_SCHOOL_OPTIONS = [
    "National University",
    "Bulacan State University",
    "Laguna University",
];

const DEFAULT_ASSIGNED_SCHOOLS = [
    {
        id: "assigned-national-university",
        name: "National University",
        region: "Luzon",
    },
    {
        id: "assigned-bulacan-state-university",
        name: "Bulacan State University",
        region: "Luzon",
    },
];

const DEFAULT_FORM = {
    eventCode: "",
    eventLink: "",
    eventName: "Community",
    eventShortDescription: "",
    startDate: "",
    endDate: "",
    assignedSchools: DEFAULT_ASSIGNED_SCHOOLS,
    eventLogo: null,
    titleTextColor: "#000000",
    subTextColor: "#000000",
    formColor: "#000000",
    backgroundColor: "#000000",
};

const CANCEL_BUTTON_CLASS =
    "min-h-[54px] w-full rounded-[10px] bg-[#1A1A1A] py-3 text-base font-semibold text-gray-300 transition-colors hover:bg-[#252525] active:scale-[0.98]";

const SUBMIT_BUTTON_CLASS =
    "min-h-[54px] w-full rounded-[10px] bg-[#FBBF24] py-3 text-base font-bold text-black transition-colors hover:bg-[#FCD34D] active:scale-[0.98]";

function uniqueOptions(options = []) {
    return [...new Set(options.filter(Boolean).map(String))];
}

function cloneAssignedSchools(schools = []) {
    return schools
        .map((school, index) => {
            if (typeof school === "string") {
                return {
                    id: `assigned-school-${index}`,
                    name: school,
                    region: "",
                };
            }

            return {
                id: school.id ?? `assigned-school-${index}`,
                name: school.name ?? school.school ?? "",
                region: school.region ?? "",
            };
        })
        .filter((school) => school.name);
}

function getInitialForm(initialData) {
    if (!initialData) {
        return {
            ...DEFAULT_FORM,
            assignedSchools: cloneAssignedSchools(DEFAULT_ASSIGNED_SCHOOLS),
        };
    }

    const assignedSchoolSource =
        initialData.assignedSchools ?? initialData.assigned_schools;

    return {
        eventCode: initialData.eventCode ?? initialData.event_code ?? "",
        eventLink:
            initialData.eventLink ??
            initialData.event_link ??
            initialData.responseUrl ??
            initialData.response_url ??
            "",
        eventName:
            initialData.eventName ?? initialData.event_name ?? "Community",
        eventShortDescription:
            initialData.eventShortDescription ??
            initialData.event_short_description ??
            initialData.description ??
            "",
        startDate: toDateTimeLocal(
            initialData.startDate ?? initialData.start_date,
        ),
        endDate: toDateTimeLocal(initialData.endDate ?? initialData.end_date),
        assignedSchools: Array.isArray(assignedSchoolSource)
            ? cloneAssignedSchools(assignedSchoolSource)
            : cloneAssignedSchools(DEFAULT_ASSIGNED_SCHOOLS),
        eventLogo: initialData.eventLogo ?? initialData.event_logo ?? null,
        titleTextColor:
            initialData.titleTextColor ??
            initialData.title_text_color ??
            "#000000",
        subTextColor:
            initialData.subTextColor ?? initialData.sub_text_color ?? "#000000",
        formColor: initialData.formColor ?? initialData.form_color ?? "#000000",
        backgroundColor:
            initialData.backgroundColor ??
            initialData.background_color ??
            "#000000",
    };
}

function FieldLabel({ htmlFor, children, required = false }) {
    return (
        <label
            htmlFor={htmlFor}
            className={`${MODAL_LABEL_CLASS} text-[#FFFBEB]`}
        >
            {children}
            {required ? <span className="text-red-400"> *</span> : null}
        </label>
    );
}

function SelectField({
    id,
    value,
    options,
    onChange,
    placeholder,
    required = false,
}) {
    return (
        <div className="relative">
            <select
                id={id}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                required={required}
                className={`${MODAL_SELECT_CLASS} appearance-none pr-10`}
            >
                {placeholder ? (
                    <option value="" disabled={required}>
                        {placeholder}
                    </option>
                ) : null}

                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        </div>
    );
}

function ColorField({ id, label, value, onChange }) {
    const colorValue = /^#[0-9a-f]{6}$/i.test(value) ? value : "#000000";

    return (
        <div className="min-w-0 lg:grid lg:grid-cols-[126px_minmax(0,1fr)] lg:items-center lg:gap-2">
            <div className="flex h-10 min-w-0 items-center rounded-md border border-[#333] bg-[#1A1A1A]">
                <input
                    type="color"
                    value={colorValue}
                    onChange={(event) => onChange(event.target.value)}
                    className="ml-2 h-5 w-5 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0"
                    aria-label={`Choose ${label}`}
                />

                <input
                    id={`${id}-hex`}
                    type="text"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    className="min-w-0 w-full border-0 bg-transparent px-2 text-sm text-gray-300 outline-none focus:ring-0"
                    maxLength={7}
                    aria-label={`${label} hex value`}
                />
            </div>

            <label
                htmlFor={`${id}-hex`}
                className="mt-2 block text-sm text-[#FFFBEB] lg:mt-0"
            >
                {label}
            </label>
        </div>
    );
}

function AssignedSchoolPicker({
    schools,
    onChange,
    regionOptions,
    schoolOptions,
}) {
    const [selection, setSelection] = useState({
        region: "",
        school: "",
    });
    const [error, setError] = useState("");

    const addSchool = () => {
        if (!selection.school) {
            setError("Select a school before adding it.");
            return;
        }

        const alreadyAdded = schools.some(
            (school) =>
                school.name.toLowerCase() === selection.school.toLowerCase(),
        );

        if (alreadyAdded) {
            setError("This school has already been assigned.");
            return;
        }

        onChange([
            ...schools,
            {
                id: `assigned-school-${Date.now()}`,
                name: selection.school,
                region: selection.region,
            },
        ]);

        setSelection({
            region: "",
            school: "",
        });
        setError("");
    };

    return (
        <section className="rounded-md bg-[#151515] p-4">
            <h3 className="mb-4 text-lg font-medium text-[#FFFBEB]">
                Add New Assigned School
            </h3>

            <div className="grid grid-cols-1 gap-3">
                <SelectField
                    id="assigned-school-region"
                    value={selection.region}
                    options={regionOptions}
                    onChange={(region) =>
                        setSelection((current) => ({
                            ...current,
                            region,
                        }))
                    }
                    placeholder="All Region, Luz, Vis, Min"
                />

                <SelectField
                    id="assigned-school-name"
                    value={selection.school}
                    options={schoolOptions}
                    onChange={(school) =>
                        setSelection((current) => ({
                            ...current,
                            school,
                        }))
                    }
                    placeholder="National University"
                />

                <button
                    type="button"
                    onClick={addSchool}
                    className="min-h-[44px] rounded-lg bg-[#44D979] px-4 text-sm font-bold text-black transition hover:bg-[#63E891] active:scale-[0.98]"
                >
                    Add School
                </button>
            </div>

            {error ? (
                <p role="alert" className="mt-2 text-xs text-red-400">
                    {error}
                </p>
            ) : null}

            <div className="mt-5 border-t border-white/[0.06] pt-4">
                <div className="grid grid-cols-[minmax(0,1fr)_72px] gap-4 px-1 text-sm font-bold text-white">
                    <span>
                        <span className="sm:hidden">Assigned School</span>
                        <span className="hidden sm:inline">School</span>
                    </span>
                    <span className="text-right">Actions</span>
                </div>

                <div className="mt-2 divide-y divide-white/[0.05]">
                    {schools.length === 0 ? (
                        <p className="py-4 text-sm text-gray-500">
                            No assigned schools yet.
                        </p>
                    ) : (
                        schools.map((school) => (
                            <div
                                key={school.id}
                                className="grid min-h-10 grid-cols-[minmax(0,1fr)_72px] items-center gap-4 px-1 text-sm text-gray-400"
                            >
                                <span className="truncate">{school.name}</span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        onChange(
                                            schools.filter(
                                                (item) => item.id !== school.id,
                                            ),
                                        )
                                    }
                                    className="inline-flex min-h-10 min-w-10 items-center justify-end rounded-md text-red-500 transition hover:bg-red-500/10 hover:text-red-400"
                                    aria-label={`Remove ${school.name}`}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}

export default function RegistrationModal({
    isOpen,
    onClose,
    initialData = null,
    onSubmit,
    eventNameOptions = DEFAULT_EVENT_NAMES,
    regionOptions = DEFAULT_REGION_OPTIONS,
    schoolOptions = DEFAULT_SCHOOL_OPTIONS,
}) {
    const formId = useId();
    const isEditing = initialData != null;
    const [form, setForm] = useState(DEFAULT_FORM);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setForm(getInitialForm(initialData));
        setError("");
    }, [initialData, isOpen]);

    const resolvedEventNames = useMemo(
        () => uniqueOptions([...eventNameOptions, form.eventName]),
        [eventNameOptions, form.eventName],
    );

    const resolvedSchools = useMemo(
        () =>
            uniqueOptions([
                ...schoolOptions,
                ...form.assignedSchools.map((school) => school.name),
            ]),
        [form.assignedSchools, schoolOptions],
    );

    const resolvedRegions = useMemo(
        () => uniqueOptions(regionOptions),
        [regionOptions],
    );

    const fieldId = (field) => `${formId}-${field}`;

    const updateField = (field, value) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setError("");
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (
            !form.eventCode.trim() ||
            !form.eventLink.trim() ||
            !form.eventName ||
            !form.startDate ||
            !form.endDate
        ) {
            setError("Complete all required registration fields.");
            return;
        }

        const startTime = new Date(form.startDate).getTime();
        const endTime = new Date(form.endDate).getTime();

        if (
            Number.isNaN(startTime) ||
            Number.isNaN(endTime) ||
            endTime <= startTime
        ) {
            setError("End date must be after the start date.");
            return;
        }

        onSubmit({
            ...form,
            eventCode: form.eventCode.trim().toUpperCase(),
            eventLink: form.eventLink.trim(),
            eventName: form.eventName.trim(),
            eventShortDescription: form.eventShortDescription.trim(),
            assignedSchools: cloneAssignedSchools(form.assignedSchools),
        });
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? "Edit Registration" : "New Registration"}
            hideHeader
            maxWidth="max-w-[calc(100%_-_64px)] sm:max-w-6xl"
            footer={
                <div className="grid w-full grid-cols-2 gap-4 px-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className={CANCEL_BUTTON_CLASS}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        form={formId}
                        className={SUBMIT_BUTTON_CLASS}
                    >
                        {isEditing ? "Update" : "Create"}
                    </button>
                </div>
            }
        >
            <form
                id={formId}
                onSubmit={handleSubmit}
                className="space-y-6 px-4 pb-1 pt-2"
            >
                <div className="mb-7 pr-8">
                    <h2
                        id="base-modal-title"
                        className="font-heading text-lg font-bold text-[#FBBF24]"
                    >
                        {isEditing ? "Edit Registration" : "New Registration"}
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                        <FieldLabel htmlFor={fieldId("event-code")} required>
                            Event Code
                        </FieldLabel>

                        <input
                            id={fieldId("event-code")}
                            type="text"
                            required
                            maxLength={20}
                            value={form.eventCode}
                            onChange={(event) =>
                                updateField("eventCode", event.target.value)
                            }
                            className={MODAL_INPUT_CLASS}
                        />
                    </div>

                    <div>
                        <FieldLabel htmlFor={fieldId("event-link")} required>
                            Event Link
                        </FieldLabel>

                        <input
                            id={fieldId("event-link")}
                            type="text"
                            inputMode="url"
                            required
                            value={form.eventLink}
                            onChange={(event) =>
                                updateField("eventLink", event.target.value)
                            }
                            className={MODAL_INPUT_CLASS}
                        />
                    </div>
                </div>

                <div>
                    <FieldLabel htmlFor={fieldId("event-name")} required>
                        Event Name
                    </FieldLabel>

                    <SelectField
                        id={fieldId("event-name")}
                        value={form.eventName}
                        options={resolvedEventNames}
                        onChange={(eventName) =>
                            updateField("eventName", eventName)
                        }
                        required
                    />
                </div>

                <div>
                    <FieldLabel htmlFor={fieldId("short-description")}>
                        Event Short Description
                    </FieldLabel>

                    <input
                        id={fieldId("short-description")}
                        type="text"
                        value={form.eventShortDescription}
                        onChange={(event) =>
                            updateField(
                                "eventShortDescription",
                                event.target.value,
                            )
                        }
                        className={MODAL_INPUT_CLASS}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <FieldLabel htmlFor={fieldId("start-date")} required>
                            Start Date
                        </FieldLabel>

                        <input
                            id={fieldId("start-date")}
                            type="datetime-local"
                            required
                            value={form.startDate}
                            onChange={(event) =>
                                updateField("startDate", event.target.value)
                            }
                            className={MODAL_INPUT_CLASS}
                        />
                    </div>

                    <div>
                        <FieldLabel htmlFor={fieldId("end-date")} required>
                            End Date
                        </FieldLabel>

                        <input
                            id={fieldId("end-date")}
                            type="datetime-local"
                            required
                            min={form.startDate || undefined}
                            value={form.endDate}
                            onChange={(event) =>
                                updateField("endDate", event.target.value)
                            }
                            className={MODAL_INPUT_CLASS}
                        />
                    </div>
                </div>

                <AssignedSchoolPicker
                    schools={form.assignedSchools}
                    onChange={(assignedSchools) =>
                        updateField("assignedSchools", assignedSchools)
                    }
                    regionOptions={resolvedRegions}
                    schoolOptions={resolvedSchools}
                />

                <div className="space-y-3">
                    <FieldLabel htmlFor={fieldId("event-logo")}>
                        Event Logo
                    </FieldLabel>

                    <FeaturedImageUpload
                        value={form.eventLogo}
                        onChange={(eventLogo) =>
                            updateField("eventLogo", eventLogo)
                        }
                        hint="PNG, JPG, JPEG (MAX. 5MB), Must be 1920x1080 pixels"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
                    <ColorField
                        id={fieldId("title-text-color")}
                        label="Title Text Font Color"
                        value={form.titleTextColor}
                        onChange={(value) =>
                            updateField("titleTextColor", value)
                        }
                    />

                    <ColorField
                        id={fieldId("sub-text-color")}
                        label="Sub-Text Font Color"
                        value={form.subTextColor}
                        onChange={(value) => updateField("subTextColor", value)}
                    />

                    <ColorField
                        id={fieldId("form-color")}
                        label="Form Color"
                        value={form.formColor}
                        onChange={(value) => updateField("formColor", value)}
                    />

                    <ColorField
                        id={fieldId("background-color")}
                        label="Background Color"
                        value={form.backgroundColor}
                        onChange={(value) =>
                            updateField("backgroundColor", value)
                        }
                    />
                </div>

                {error ? (
                    <p role="alert" className="text-sm text-red-400">
                        {error}
                    </p>
                ) : null}
            </form>
        </BaseModal>
    );
}
