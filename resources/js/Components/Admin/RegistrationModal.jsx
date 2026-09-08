import BaseModal from "@/Components/Admin/BaseModal";
import FeaturedImageUpload from "@/Components/Admin/FeaturedImageUpload";
import { toDateTimeLocal } from "@/data/adminRegistrationData";
import { ChevronDown, Trash2 } from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";

const FIELD_LABEL_CLASS =
    "mb-2 block text-xs font-medium leading-5 text-[#EDE3C0]";

const CONTROL_CLASS =
    "min-h-[42px] w-full rounded-sm border border-white/[0.03] bg-[#151515] px-4 py-2.5 text-sm text-[#F5F1E6] outline-none transition placeholder:text-[#65656F] hover:border-white/[0.10] focus:border-[#FBBF24] focus:ring-1 focus:ring-[#FBBF24]";

const SELECT_CLASS = `${CONTROL_CLASS} cursor-pointer appearance-none pr-10`;

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
    titleTextColor: "#000000FF",
    subTextColor: "#000000FF",
    formColor: "#000000FF",
    backgroundColor: "#000000FF",
};

const CANCEL_BUTTON_CLASS =
    "min-h-[42px] w-full rounded-[10px] border border-white/[0.12] bg-[#1B1B1B] px-4 py-2.5 text-sm font-semibold text-[#A8A8B3] transition hover:border-white/[0.20] hover:bg-[#242424] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBBF24] active:scale-[0.99] sm:min-h-[52px] sm:text-base";

const SUBMIT_BUTTON_CLASS =
    "min-h-[42px] w-full rounded-[10px] bg-[#FBBF24] px-4 py-2.5 text-sm font-bold text-black transition hover:bg-[#FCD34D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FDE68A] active:scale-[0.99] sm:min-h-[52px] sm:text-base";

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

function normalizeColor(value, fallback = "#000000FF") {
    const normalized = String(value ?? "")
        .trim()
        .toUpperCase();

    if (/^#[0-9A-F]{8}$/.test(normalized)) {
        return normalized;
    }

    if (/^#[0-9A-F]{6}$/.test(normalized)) {
        return `${normalized}FF`;
    }

    return fallback;
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
        titleTextColor: normalizeColor(
            initialData.titleTextColor ?? initialData.title_text_color,
        ),
        subTextColor: normalizeColor(
            initialData.subTextColor ?? initialData.sub_text_color,
        ),
        formColor: normalizeColor(
            initialData.formColor ?? initialData.form_color,
        ),
        backgroundColor: normalizeColor(
            initialData.backgroundColor ?? initialData.background_color,
        ),
    };
}

function FieldLabel({ htmlFor, children, required = false }) {
    return (
        <label htmlFor={htmlFor} className={FIELD_LABEL_CLASS}>
            {children}

            {required ? (
                <>
                    <span aria-hidden="true" className="text-red-400">
                        {" "}
                        *
                    </span>

                    <span className="sr-only"> required</span>
                </>
            ) : null}
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
                className={SELECT_CLASS}
                style={{
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    appearance: "none",
                    backgroundImage: "none",
                }}
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

            <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#555560]"
            />
        </div>
    );
}
function ColorField({ id, label, value, onChange }) {
    const normalizedValue = normalizeColor(value);

    const handleHexChange = (event) => {
        const nextValue = event.target.value
            .toUpperCase()
            .replace(/[^#0-9A-F]/g, "")
            .slice(0, 9);

        onChange(nextValue);
    };

    return (
        <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-[132px_minmax(0,1fr)] sm:items-center sm:gap-3">
            <label
                htmlFor={`${id}-picker`}
                className="order-1 text-xs font-medium leading-5 text-[#EDE3C0] sm:order-2 sm:text-sm"
            >
                {label}
            </label>

            <div className="order-2 flex min-h-[42px] min-w-0 items-center rounded-md border border-white/[0.08] bg-[#151515] transition focus-within:border-[#FBBF24] focus-within:ring-1 focus-within:ring-[#FBBF24] sm:order-1">
                <input
                    id={`${id}-picker`}
                    type="color"
                    value={normalizedValue}
                    onChange={(event) =>
                        onChange(event.target.value.toUpperCase())
                    }
                    alpha=""
                    colorspace="srgb"
                    className="ml-3 h-5 w-5 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0"
                    aria-label={`Choose ${label}`}
                />

                <input
                    id={`${id}-hex`}
                    type="text"
                    value={value}
                    onChange={handleHexChange}
                    placeholder="#000000FF"
                    maxLength={9}
                    spellCheck={false}
                    className="w-full min-w-0 border-0 bg-transparent px-2 text-xs uppercase text-[#777781] outline-none placeholder:text-[#555560] focus:ring-0 sm:text-sm"
                    aria-label={`${label} hex value`}
                />
            </div>
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

    const removeSchool = (schoolId) => {
        onChange(schools.filter((school) => school.id !== schoolId));
    };

    return (
        <section
            className="rounded-md border border-white/[0.03] bg-[#151515] p-4"
            aria-labelledby="assigned-school-heading"
        >
            <h3
                id="assigned-school-heading"
                className="mb-3 text-base font-medium text-[#EDE3C0] sm:text-lg"
            >
                Add New Assigned School
            </h3>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_146px]">
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
                    className="min-h-[36px] rounded-[9px] bg-[#44D979] px-5 text-sm font-bold text-black transition hover:bg-[#63E891] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8AF0AD] active:scale-[0.99] sm:min-h-[42px]"
                >
                    Add School
                </button>
            </div>

            {error ? (
                <p role="alert" className="mt-2 text-xs text-red-400">
                    {error}
                </p>
            ) : null}

            <div className="mt-5">
                <div className="grid grid-cols-[minmax(0,1fr)_64px] items-center gap-4 text-xs font-bold text-white">
                    <span>Assigned School</span>
                    <span className="text-right">Actions</span>
                </div>

                <div className="mt-2">
                    {schools.length === 0 ? (
                        <p className="py-3 text-xs text-[#777781]">
                            No assigned schools yet.
                        </p>
                    ) : (
                        schools.map((school) => (
                            <div
                                key={school.id}
                                className="grid min-h-9 grid-cols-[minmax(0,1fr)_64px] items-center gap-4 text-xs text-[#898992]"
                            >
                                <span className="truncate">{school.name}</span>

                                <button
                                    type="button"
                                    onClick={() => removeSchool(school.id)}
                                    className="ml-auto inline-flex min-h-9 min-w-9 items-center justify-center rounded-md text-[#F04444] transition hover:bg-red-500/10 hover:text-[#FF6868] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
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
            titleTextColor: normalizeColor(form.titleTextColor),
            subTextColor: normalizeColor(form.subTextColor),
            formColor: normalizeColor(form.formColor),
            backgroundColor: normalizeColor(form.backgroundColor),
        });
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? "Edit Registration" : "New Registration"}
            hideHeader
            maxWidth="max-w-[330px] sm:max-w-[1128px]"
            panelClassName="border-[#8A6800] border-t-[#8A6800] bg-[#0D0D0D] shadow-[0_24px_80px_rgba(0,0,0,0.72)]"
            bodyClassName="!px-8 !py-7 sm:!px-8 sm:!py-8"
        >
            <form id={formId} onSubmit={handleSubmit} className="space-y-6">
                <div className="mb-7 pr-8">
                    <h2
                        id="base-modal-title"
                        className="font-heading text-sm font-bold text-[#FBBF24] sm:text-xl"
                    >
                        {isEditing ? "Edit Registration" : "New Registration"}
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-6">
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
                            className={CONTROL_CLASS}
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
                            className={CONTROL_CLASS}
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
                        className={CONTROL_CLASS}
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
                            className={`${CONTROL_CLASS} min-w-0 px-2 [color-scheme:dark] sm:px-4`}
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
                            className={`${CONTROL_CLASS} min-w-0 px-2 [color-scheme:dark] sm:px-4`}
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

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,1fr)]">
                    <div className="space-y-3">
                        <FieldLabel htmlFor={fieldId("event-logo")}>
                            Event Logo
                        </FieldLabel>

                        <FeaturedImageUpload
                            value={form.eventLogo}
                            onChange={(eventLogo) =>
                                updateField("eventLogo", eventLogo)
                            }
                            className="[&>button]:min-h-[116px] [&>button]:border-white/[0.12] [&>button]:bg-[#151515] sm:[&>button]:min-h-[194px] [&>button]:hover:border-[#FBBF24]/60"
                            hint="PNG, JPG, JPEG (MAX. 5MB), Must be 1920x1080 pixels"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-5 lg:grid-cols-1 lg:self-end lg:gap-3">
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
                            onChange={(value) =>
                                updateField("subTextColor", value)
                            }
                        />

                        <ColorField
                            id={fieldId("form-color")}
                            label="Form Color"
                            value={form.formColor}
                            onChange={(value) =>
                                updateField("formColor", value)
                            }
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
                </div>

                {error ? (
                    <p
                        role="alert"
                        className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-xs text-red-300 sm:text-sm"
                    >
                        {error}
                    </p>
                ) : null}

                <div className="grid grid-cols-2 gap-4 pt-4 sm:ml-auto sm:w-[60%]">
                    <button
                        type="button"
                        onClick={onClose}
                        className={CANCEL_BUTTON_CLASS}
                    >
                        Cancel
                    </button>

                    <button type="submit" className={SUBMIT_BUTTON_CLASS}>
                        {isEditing ? "Update" : "Create"}
                    </button>
                </div>
            </form>
        </BaseModal>
    );
}
