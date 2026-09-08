export const REGISTRATION_PAGE_SIZE = 3;

export const REGISTRATION_EVENT_OPTIONS = [
    "Community",
    "All Star Dance Challenge 2026",
    "MSL Campus Clash 2026",
];

export const REGISTRATION_REGION_OPTIONS = ["Luzon", "Visayas", "Mindanao"];

export const REGISTRATION_SCHOOL_OPTIONS = [
    "National University",
    "Bulacan State University",
    "Laguna University",
];

export const DEFAULT_ASSIGNED_SCHOOLS = [
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

const ACTIVE_REGISTRATION_TEMPLATES = [
    {
        eventCode: "ASDC26",
        eventName: "All Star Dance Challenge 2026",
        eventShortDescription:
            "Registration for the 2026 All Star Dance Challenge.",
        startDate: "2026-07-10T00:00:00+08:00",
        endDate: "2026-07-25T16:00:00+08:00",
        eventLink: "/Tournament/SL",
        responseUrl: "/Tournament/SL",
    },
    {
        eventCode: "MCC26",
        eventName: "MSL Campus Clash 2026",
        eventShortDescription: "Campus tournament registration.",
        startDate: "2026-08-01T08:00:00+08:00",
        endDate: "2026-08-20T18:00:00+08:00",
        eventLink: "/Tournament/CampusTournament",
        responseUrl: "/Tournament/CampusTournament",
    },
    {
        eventCode: "COM26",
        eventName: "Community",
        eventShortDescription: "Community event registration.",
        startDate: "2026-09-01T08:00:00+08:00",
        endDate: "2026-09-30T18:00:00+08:00",
        eventLink: "/Event",
        responseUrl: "/Event",
    },
];

const COMPLETED_REGISTRATION_TEMPLATES = [
    {
        eventCode: "ASDC25",
        eventName: "All Star Dance Challenge 2025",
        eventShortDescription: "Completed registration for the 2025 challenge.",
        startDate: "2025-07-10T00:00:00+08:00",
        endDate: "2025-07-25T16:00:00+08:00",
        eventLink: "/Tournament/SL",
        responseUrl: "/Tournament/SL",
    },
    {
        eventCode: "MCC25",
        eventName: "MSL Campus Clash 2025",
        eventShortDescription: "Completed campus tournament registration.",
        startDate: "2025-08-01T08:00:00+08:00",
        endDate: "2025-08-20T18:00:00+08:00",
        eventLink: "/Tournament/CampusTournament",
        responseUrl: "/Tournament/CampusTournament",
    },
    {
        eventCode: "COM25",
        eventName: "Community",
        eventShortDescription: "Completed community registration.",
        startDate: "2025-09-01T08:00:00+08:00",
        endDate: "2025-09-30T18:00:00+08:00",
        eventLink: "/Event",
        responseUrl: "/Event",
    },
];

function createMockRows(templates, prefix, count) {
    return Array.from({ length: count }, (_, index) => {
        const template = templates[index % templates.length];

        return {
            ...template,
            id: `${prefix}-${index + 1}`,
            assignedSchools: DEFAULT_ASSIGNED_SCHOOLS.map((school) => ({
                ...school,
                id: `${school.id}-${index + 1}`,
            })),
            eventLogo: null,
            titleTextColor: "#000000FF",
            subTextColor: "#000000FF",
            formColor: "#000000FF",
            backgroundColor: "#000000FF",
        };
    });
}

export const MOCK_REGISTRATIONS = createMockRows(
    ACTIVE_REGISTRATION_TEMPLATES,
    "registration",
    30,
);

export const MOCK_COMPLETED_REGISTRATIONS = createMockRows(
    COMPLETED_REGISTRATION_TEMPLATES,
    "completed-registration",
    30,
);

export const REGISTRATION_ITEMS = MOCK_REGISTRATIONS;

export const COMPLETED_REGISTRATION_ITEMS = MOCK_COMPLETED_REGISTRATIONS;

function partsToObject(parts) {
    return Object.fromEntries(parts.map(({ type, value }) => [type, value]));
}

export function formatRegistrationDate(value) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    const parts = partsToObject(
        new Intl.DateTimeFormat("en-US", {
            timeZone: "Asia/Manila",
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }).formatToParts(date),
    );

    const hour = String(parts.hour).padStart(2, "0");

    return `${parts.month} ${parts.day}, ${parts.year} | ${hour}:${parts.minute} ${String(
        parts.dayPeriod,
    ).toLowerCase()}`;
}

export function toDateTimeLocal(value) {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const parts = partsToObject(
        new Intl.DateTimeFormat("en-CA", {
            timeZone: "Asia/Manila",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23",
        }).formatToParts(date),
    );

    const hour = String(parts.hour === "24" ? "00" : parts.hour).padStart(
        2,
        "0",
    );

    return `${parts.year}-${parts.month}-${parts.day}T${hour}:${parts.minute}`;
}
