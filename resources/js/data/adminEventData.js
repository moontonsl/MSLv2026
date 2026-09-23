export const EVENT_PAGE_SIZE = 3;

export const EVENT_REGION_OPTIONS = [
    { id: "ncr", name: "National Capital Region" },
    { id: "region-iii", name: "Central Luzon" },
    { id: "region-iv-a", name: "CALABARZON" },
    { id: "region-vii", name: "Central Visayas" },
    { id: "region-xi", name: "Davao Region" },
];

export const EVENT_SCHOOL_OPTIONS = [
    {
        id: "nu",
        name: "National University",
        regionId: "ncr",
        regionName: "National Capital Region",
    },
    {
        id: "ust",
        name: "University of Santo Tomas",
        regionId: "ncr",
        regionName: "National Capital Region",
    },
    {
        id: "bsu",
        name: "Bulacan State University",
        regionId: "region-iii",
        regionName: "Central Luzon",
    },
    {
        id: "hau",
        name: "Holy Angel University",
        regionId: "region-iii",
        regionName: "Central Luzon",
    },
    {
        id: "batstateu",
        name: "Batangas State University",
        regionId: "region-iv-a",
        regionName: "CALABARZON",
    },
    {
        id: "usc",
        name: "University of San Carlos",
        regionId: "region-vii",
        regionName: "Central Visayas",
    },
    {
        id: "addu",
        name: "Ateneo de Davao University",
        regionId: "region-xi",
        regionName: "Davao Region",
    },
];

const ACTIVE_EVENTS = [
    {
        eventCode: "ASDC26",
        eventName: "All Star Dance Challenge 2026",
        eventLink: "/Event/ASDC26",
        description: "The 2026 All Star Dance Challenge.",
        startDate: "2026-07-10T08:00:00+08:00",
        endDate: "2026-07-25T16:00:00+08:00",
        assignedSchools: [EVENT_SCHOOL_OPTIONS[0], EVENT_SCHOOL_OPTIONS[2]],
    },
    {
        eventCode: "MCC26",
        eventName: "MSL Campus Clash 2026",
        eventLink: "/Event/MCC26",
        description: "The 2026 MSL Campus Clash.",
        startDate: "2026-08-01T08:00:00+08:00",
        endDate: "2026-08-20T18:00:00+08:00",
        assignedSchools: [EVENT_SCHOOL_OPTIONS[4], EVENT_SCHOOL_OPTIONS[5]],
    },
    {
        eventCode: "COM26",
        eventName: "MSL Community Activity 2026",
        eventLink: "/Event/COM26",
        description: "A community activity for all schools.",
        startDate: "2026-09-01T08:00:00+08:00",
        endDate: "2026-09-30T18:00:00+08:00",
        assignedSchools: [],
    },
];

const COMPLETED_EVENTS = [
    {
        eventCode: "ASDC25",
        eventName: "All Star Dance Challenge 2025",
        eventLink: "/Event/ASDC25",
        description: "Completed activity event.",
        startDate: "2025-07-10T08:00:00+08:00",
        endDate: "2025-07-25T16:00:00+08:00",
        assignedSchools: [],
    },
    {
        eventCode: "MCC25",
        eventName: "MSL Campus Clash 2025",
        eventLink: "/Event/MCC25",
        description: "Completed campus activity event.",
        startDate: "2025-08-01T08:00:00+08:00",
        endDate: "2025-08-20T18:00:00+08:00",
        assignedSchools: [],
    },
];

function createRows(templates, prefix, count) {
    return Array.from({ length: count }, (_, index) => {
        const template = templates[index % templates.length];

        return {
            ...template,
            id: `${prefix}-${index + 1}`,
            responseUrl: template.eventLink,
            assignedSchools: template.assignedSchools.map((school) => ({
                ...school,
            })),
            eventLogo: null,
            titleTextColor: "#FFFFFFFF",
            subTextColor: "#A1A1AAFF",
            eventCardColor: "#151515FF",
            backgroundColor: "#0A0A0AFF",
        };
    });
}

export const MOCK_EVENTS = createRows(ACTIVE_EVENTS, "event", 30);

export const MOCK_COMPLETED_EVENTS = createRows(
    COMPLETED_EVENTS,
    "completed-event",
    30,
);

export function formatEventDate(value) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Manila",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    }).format(date);
}

export function toEventDateTimeLocal(value) {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const parts = Object.fromEntries(
        new Intl.DateTimeFormat("en-CA", {
            timeZone: "Asia/Manila",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23",
        })
            .formatToParts(date)
            .map(({ type, value: part }) => [type, part]),
    );

    const hour = parts.hour === "24" ? "00" : parts.hour;

    return `${parts.year}-${parts.month}-${parts.day}T${hour}:${parts.minute}`;
}
