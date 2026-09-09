import BaseModal from "@/Components/Admin/BaseModal";
import FeaturedImageUpload from "@/Components/Admin/FeaturedImageUpload";
import {
    EVENT_REGION_OPTIONS,
    EVENT_SCHOOL_OPTIONS,
    toEventDateTimeLocal,
} from "@/data/adminEventData";
import { ChevronDown, Trash2 } from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";

const LABEL_CLASS = "mb-2 block text-xs font-medium leading-5 text-[#EDE3C0]";

const CONTROL_CLASS =
    "min-h-[42px] w-full rounded-sm border border-white/[0.03] bg-[#151515] px-4 py-2.5 text-sm text-[#F5F1E6] outline-none transition placeholder:text-[#65656F] hover:border-white/[0.10] focus:border-[#FBBF24] focus:ring-1 focus:ring-[#FBBF24]";

const SELECT_CLASS = `${CONTROL_CLASS} cursor-pointer appearance-none bg-none pr-10 [background-image:none] [&::-ms-expand]:hidden`;

const CANCEL_CLASS =
    "min-h-[42px] w-full rounded-[10px] border border-white/[0.12] bg-[#1B1B1B] px-4 py-2.5 text-sm font-semibold text-[#A8A8B3] transition hover:bg-[#242424] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBBF24] sm:min-h-[52px] sm:text-base";

const SUBMIT_CLASS =
    "min-h-[42px] w-full rounded-[10px] bg-[#FBBF24] px-4 py-2.5 text-sm font-bold text-black transition hover:bg-[#FCD34D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FDE68A] sm:min-h-[52px] sm:text-base";

const EMPTY_FORM = {
    eventCode: "",
    eventLink: "",
    eventName: "",
    description: "",
    startDate: "",
    endDate: "",
    assignedSchools: [],
    eventLogo: null,
    titleTextColor: "#FFFFFFFF",
    subTextColor: "#A1A1AAFF",
    eventCardColor: "#151515FF",
    backgroundColor: "#0A0A0AFF",
};

function normalizeColor(value, fallback) {
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

function normalizeAssignedSchools(schools = []) {
    if (!Array.isArray(schools)) {
        return [];
    }

    return schools
        .map((school, index) => {
            if (typeof school === "string") {
                return {
                    id: school,
                    name: school,
                    regionId: "",
                    regionName: "",
                };
            }

            return {
                id:
                    school.id ??
                    school.schoolId ??
                    school.school_id ??
                    `assigned-school-${index}`,
                name:
                    school.name ??
                    school.school ??
                    school.schoolName ??
                    school.school_name ??
                    "",
                regionId:
                    school.regionId ??
                    school.region_id ??
                    school.region?.id ??
                    "",
                regionName:
                    school.regionName ??
                    school.region_name ??
                    school.region?.name ??
                    (typeof school.region === "string" ? school.region : ""),
            };
        })
        .filter((school) => school.name);
}

function getInitialForm(eventData) {
    if (!eventData) {
        return {
            ...EMPTY_FORM,
            assignedSchools: [],
        };
    }

    return {
        eventCode: eventData.eventCode ?? eventData.event_code ?? "",
        eventLink:
            eventData.eventLink ??
            eventData.event_link ??
            eventData.responseUrl ??
            eventData.response_url ??
            "",
        eventName: eventData.eventName ?? eventData.event_name ?? "",
        description:
            eventData.description ??
            eventData.eventDescription ??
            eventData.event_description ??
            "",
        startDate: toEventDateTimeLocal(
            eventData.startDate ?? eventData.start_date,
        ),
        endDate: toEventDateTimeLocal(eventData.endDate ?? eventData.end_date),
        assignedSchools: normalizeAssignedSchools(
            eventData.assignedSchools ?? eventData.assigned_schools,
        ),
        eventLogo: eventData.eventLogo ?? eventData.event_logo ?? null,
        titleTextColor: normalizeColor(
            eventData.titleTextColor ?? eventData.title_text_color,
            "#FFFFFFFF",
        ),
        subTextColor: normalizeColor(
            eventData.subTextColor ?? eventData.sub_text_color,
            "#A1A1AAFF",
        ),
        eventCardColor: normalizeColor(
            eventData.eventCardColor ?? eventData.event_card_color,
            "#151515FF",
        ),
        backgroundColor: normalizeColor(
            eventData.backgroundColor ?? eventData.background_color,
            "#0A0A0AFF",
        ),
    };
}

function FieldLabel({ htmlFor, children, required = false }) {
    return (
        <label htmlFor={htmlFor} className={LABEL_CLASS}>
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
    disabled = false,
}) {
    return (
        <div className="relative">
            <select
                id={id}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                disabled={disabled}
                className={`${SELECT_CLASS} disabled:cursor-not-allowed disabled:opacity-50`}
                style={{
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    appearance: "none",
                    backgroundImage: "none",
                }}
            >
                <option value="">{placeholder}</option>

                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
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

function ColorField({ id, label, value, fallback, onChange }) {
    const normalized = normalizeColor(value, fallback);

    const pickerValue = normalized.slice(0, 7);

    return (
        <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-[132px_minmax(0,1fr)] sm:items-center sm:gap-3">
            <label
                htmlFor={`${id}-picker`}
                className="order-1 text-xs font-medium text-[#EDE3C0] sm:order-2 sm:text-sm"
            >
                {label}
            </label>

            <div className="order-2 flex min-h-[42px] min-w-0 items-center rounded-md border border-white/[0.08] bg-[#151515] focus-within:border-[#FBBF24] focus-within:ring-1 focus-within:ring-[#FBBF24] sm:order-1">
                <input
                    id={`${id}-picker`}
                    type="color"
                    value={pickerValue}
                    onChange={(event) =>
                        onChange(`${event.target.value.toUpperCase()}FF`)
                    }
                    className="ml-3 h-5 w-5 shrink-0 cursor-pointer border-0 bg-transparent p-0"
                    aria-label={`Choose ${label}`}
                />

                <input
                    id={`${id}-hex`}
                    type="text"
                    value={value}
                    placeholder="#000000FF"
                    maxLength={9}
                    spellCheck={false}
                    onChange={(event) =>
                        onChange(
                            event.target.value
                                .toUpperCase()
                                .replace(/[^#0-9A-F]/g, "")
                                .slice(0, 9),
                        )
                    }
                    className="w-full min-w-0 border-0 bg-transparent px-2 text-xs uppercase text-[#777781] outline-none sm:text-sm"
                    aria-label={`${label} hex value`}
                />
            </div>
        </div>
    );
}

function EventSchoolPicker({ assignedSchools, onChange }) {
    const [regionId, setRegionId] = useState("");

    const [schoolId, setSchoolId] = useState("");

    const [error, setError] = useState("");

    const filteredSchools = useMemo(() => {
        if (!regionId) {
            return EVENT_SCHOOL_OPTIONS;
        }

        return EVENT_SCHOOL_OPTIONS.filter(
            (school) => String(school.regionId) === String(regionId),
        );
    }, [regionId]);

    useEffect(() => {
        if (
            schoolId &&
            !filteredSchools.some(
                (school) => String(school.id) === String(schoolId),
            )
        ) {
            setSchoolId("");
        }
    }, [filteredSchools, schoolId]);

    const addSchool = () => {
        if (!regionId || !schoolId) {
            setError("Select a region and school.");
            return;
        }

        const region = EVENT_REGION_OPTIONS.find(
            (item) => String(item.id) === String(regionId),
        );

        const school = EVENT_SCHOOL_OPTIONS.find(
            (item) => String(item.id) === String(schoolId),
        );

        if (!school) {
            setError("The selected school is unavailable.");
            return;
        }

        const alreadyAssigned = assignedSchools.some(
            (item) => String(item.id) === String(school.id),
        );

        if (alreadyAssigned) {
            setError("This school is already assigned.");
            return;
        }

        onChange([
            ...assignedSchools,
            {
                id: school.id,
                name: school.name,
                regionId: school.regionId,
                regionName: school.regionName ?? region?.name ?? "",
            },
        ]);

        setRegionId("");
        setSchoolId("");
        setError("");
    };

    const removeSchool = (id) => {
        onChange(
            assignedSchools.filter(
                (school) => String(school.id) !== String(id),
            ),
        );
    };

    return (
        <section className="rounded-md border border-white/[0.03] bg-[#151515] p-4">
            <h3 className="text-base font-medium text-[#EDE3C0] sm:text-lg">
                Event Availability
            </h3>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_146px]">
                <SelectField
                    id="event-region"
                    value={regionId}
                    options={EVENT_REGION_OPTIONS.map((region) => ({
                        value: String(region.id),
                        label: region.name,
                    }))}
                    onChange={(value) => {
                        setRegionId(value);
                        setSchoolId("");
                        setError("");
                    }}
                    placeholder="Select region"
                />

                <SelectField
                    id="event-school"
                    value={schoolId}
                    options={filteredSchools.map((school) => ({
                        value: String(school.id),
                        label: school.name,
                    }))}
                    onChange={(value) => {
                        setSchoolId(value);
                        setError("");
                    }}
                    placeholder={
                        regionId ? "Select school" : "Select a region first"
                    }
                    disabled={!regionId}
                />

                <button
                    type="button"
                    onClick={addSchool}
                    disabled={!regionId || !schoolId}
                    className="min-h-[42px] rounded-[9px] bg-[#44D979] px-5 text-sm font-bold text-black transition hover:bg-[#63E891] disabled:cursor-not-allowed disabled:opacity-50"
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
                <div className="grid grid-cols-[minmax(0,1fr)_110px_64px] gap-4 text-xs font-bold text-white">
                    <span>Assigned School</span>
                    <span>Region</span>
                    <span className="text-right">Actions</span>
                </div>

                {assignedSchools.length === 0 ? (
                    <p className="py-3 text-xs text-[#777781]">
                        No schools assigned. The event is available to all
                        schools.
                    </p>
                ) : (
                    assignedSchools.map((school) => (
                        <div
                            key={school.id}
                            className="grid min-h-9 grid-cols-[minmax(0,1fr)_110px_64px] items-center gap-4 text-xs text-[#898992]"
                        >
                            <span className="truncate">{school.name}</span>

                            <span className="truncate">
                                {school.regionName || "—"}
                            </span>

                            <button
                                type="button"
                                onClick={() => removeSchool(school.id)}
                                className="ml-auto inline-flex min-h-9 min-w-9 items-center justify-center rounded-md text-red-500 hover:bg-red-500/10"
                                aria-label={`Remove ${school.name}`}
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}

export default function EventModal({
    isOpen,
    onClose,
    initialData = null,
    onSubmit,
}) {
    const formId = useId();

    const isEditing = initialData !== null;

    const [form, setForm] = useState(EMPTY_FORM);

    const [error, setError] = useState("");

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setForm(getInitialForm(initialData));

        setError("");
    }, [initialData, isOpen]);

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
            !form.eventName.trim() ||
            !form.startDate ||
            !form.endDate
        ) {
            setError("Complete all required event fields.");
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
            eventCode: form.eventCode.trim().toUpperCase(),
            eventName: form.eventName.trim(),
            eventLink: form.eventLink.trim(),
            responseUrl: form.eventLink.trim(),
            description: form.description.trim(),
            startDate: form.startDate,
            endDate: form.endDate,
            assignedSchools: normalizeAssignedSchools(form.assignedSchools),
            eventLogo: form.eventLogo,
            titleTextColor: normalizeColor(form.titleTextColor, "#FFFFFFFF"),
            subTextColor: normalizeColor(form.subTextColor, "#A1A1AAFF"),
            eventCardColor: normalizeColor(form.eventCardColor, "#151515FF"),
            backgroundColor: normalizeColor(form.backgroundColor, "#0A0A0AFF"),
        });
    };

    const modalTitle = isEditing ? "Edit Event" : "New Event";

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={modalTitle}
            hideHeader
            maxWidth="max-w-[330px] sm:max-w-[1128px]"
            panelClassName="border-[#8A6800] bg-[#0D0D0D] shadow-[0_24px_80px_rgba(0,0,0,0.72)]"
            bodyClassName="!px-8 !py-7 sm:!py-8"
            confirmSubmitMessage={
                isEditing ? "Are you sure you want to edit this event?" : ""
            }
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="pr-8">
                    <h2
                        id="base-modal-title"
                        className="font-heading text-sm font-bold text-[#FBBF24] sm:text-xl"
                    >
                        {modalTitle}
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <FieldLabel htmlFor={`${formId}-code`} required>
                            Event Code
                        </FieldLabel>

                        <input
                            id={`${formId}-code`}
                            type="text"
                            required
                            maxLength={20}
                            placeholder="Example: ASDC26"
                            value={form.eventCode}
                            onChange={(event) =>
                                updateField("eventCode", event.target.value)
                            }
                            className={CONTROL_CLASS}
                        />
                    </div>

                    <div>
                        <FieldLabel htmlFor={`${formId}-link`} required>
                            Event Page Link
                        </FieldLabel>

                        <input
                            id={`${formId}-link`}
                            type="text"
                            inputMode="url"
                            required
                            placeholder="/Event/ASDC26"
                            value={form.eventLink}
                            onChange={(event) =>
                                updateField("eventLink", event.target.value)
                            }
                            className={CONTROL_CLASS}
                        />
                    </div>
                </div>

                <div>
                    <FieldLabel htmlFor={`${formId}-name`} required>
                        Event Name
                    </FieldLabel>

                    <input
                        id={`${formId}-name`}
                        type="text"
                        required
                        placeholder="Enter event name"
                        value={form.eventName}
                        onChange={(event) =>
                            updateField("eventName", event.target.value)
                        }
                        className={CONTROL_CLASS}
                    />
                </div>

                <div>
                    <FieldLabel htmlFor={`${formId}-description`}>
                        Event Short Description
                    </FieldLabel>

                    <textarea
                        id={`${formId}-description`}
                        rows={3}
                        maxLength={300}
                        placeholder="Write a short description of the event"
                        value={form.description}
                        onChange={(event) =>
                            updateField("description", event.target.value)
                        }
                        className={`${CONTROL_CLASS} resize-y`}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <FieldLabel htmlFor={`${formId}-start`} required>
                            Event Start Date
                        </FieldLabel>

                        <input
                            id={`${formId}-start`}
                            type="datetime-local"
                            required
                            value={form.startDate}
                            onChange={(event) =>
                                updateField("startDate", event.target.value)
                            }
                            className={`${CONTROL_CLASS} [color-scheme:dark]`}
                        />
                    </div>

                    <div>
                        <FieldLabel htmlFor={`${formId}-end`} required>
                            Event End Date
                        </FieldLabel>

                        <input
                            id={`${formId}-end`}
                            type="datetime-local"
                            required
                            min={form.startDate || undefined}
                            value={form.endDate}
                            onChange={(event) =>
                                updateField("endDate", event.target.value)
                            }
                            className={`${CONTROL_CLASS} [color-scheme:dark]`}
                        />
                    </div>
                </div>

                <EventSchoolPicker
                    assignedSchools={form.assignedSchools}
                    onChange={(schools) =>
                        updateField("assignedSchools", schools)
                    }
                />

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,1fr)]">
                    <div>
                        <FieldLabel htmlFor={`${formId}-logo`}>
                            Event Logo or Banner
                        </FieldLabel>

                        <FeaturedImageUpload
                            value={form.eventLogo}
                            onChange={(value) =>
                                updateField("eventLogo", value)
                            }
                            className="[&>button]:min-h-[116px] [&>button]:bg-[#151515] sm:[&>button]:min-h-[194px]"
                            hint="PNG, JPG or JPEG (MAX. 5MB), recommended 1920x1080 pixels"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
                        <ColorField
                            id={`${formId}-title`}
                            label="Title Text Color"
                            value={form.titleTextColor}
                            fallback="#FFFFFFFF"
                            onChange={(value) =>
                                updateField("titleTextColor", value)
                            }
                        />

                        <ColorField
                            id={`${formId}-sub`}
                            label="Sub-Text Color"
                            value={form.subTextColor}
                            fallback="#A1A1AAFF"
                            onChange={(value) =>
                                updateField("subTextColor", value)
                            }
                        />

                        <ColorField
                            id={`${formId}-card`}
                            label="Event Card Color"
                            value={form.eventCardColor}
                            fallback="#151515FF"
                            onChange={(value) =>
                                updateField("eventCardColor", value)
                            }
                        />

                        <ColorField
                            id={`${formId}-background`}
                            label="Background Color"
                            value={form.backgroundColor}
                            fallback="#0A0A0AFF"
                            onChange={(value) =>
                                updateField("backgroundColor", value)
                            }
                        />
                    </div>
                </div>

                {error ? (
                    <p
                        role="alert"
                        className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-sm text-red-300"
                    >
                        {error}
                    </p>
                ) : null}

                <div className="grid grid-cols-2 gap-4 pt-4 sm:ml-auto sm:w-[60%]">
                    <button
                        type="button"
                        onClick={onClose}
                        className={CANCEL_CLASS}
                    >
                        Cancel
                    </button>

                    <button type="submit" className={SUBMIT_CLASS}>
                        {isEditing ? "Update Event" : "Create Event"}
                    </button>
                </div>
            </form>
        </BaseModal>
    );
}
