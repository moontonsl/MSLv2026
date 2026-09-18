export const REGISTRATION_PAGE_SIZE = 3;

export const REGISTRATION_REGION_OPTIONS = [
    { id: "ncr", name: "National Capital Region" },
    { id: "region-iii", name: "Central Luzon" },
    { id: "region-iv-a", name: "CALABARZON" },
    { id: "region-vii", name: "Central Visayas" },
    { id: "region-xi", name: "Davao Region" },
];

export const REGISTRATION_SCHOOL_OPTIONS = [
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

const ACTIVE_ATTENDANCE = [
    {
        attendanceCode: "ATT-001",
        activityName: "Student Leader General Assembly",
        attendanceLink: "/Attendance/ATT-001",
        instructions: "Record attendance for the assembly.",
        startDate: "2026-07-10T08:00:00+08:00",
        endDate: "2026-07-10T12:00:00+08:00",
        assignedSchools: [
            REGISTRATION_SCHOOL_OPTIONS[0],
            REGISTRATION_SCHOOL_OPTIONS[1],
        ],
    },
    {
        attendanceCode: "ATT-002",
        activityName: "Campus Organizer Orientation",
        attendanceLink: "/Attendance/ATT-002",
        instructions: "Attendance for campus organizers.",
        startDate: "2026-08-01T08:00:00+08:00",
        endDate: "2026-08-01T17:00:00+08:00",
        assignedSchools: [
            REGISTRATION_SCHOOL_OPTIONS[2],
            REGISTRATION_SCHOOL_OPTIONS[3],
        ],
    },
    {
        attendanceCode: "ATT-003",
        activityName: "Regional Admin Meeting",
        attendanceLink: "/Attendance/ATT-003",
        instructions: "Attendance for regional administrators.",
        startDate: "2026-09-01T08:00:00+08:00",
        endDate: "2026-09-01T12:00:00+08:00",
        assignedSchools: [],
    },
];

const COMPLETED_ATTENDANCE = [
    {
        attendanceCode: "ATT-2025-01",
        activityName: "Student Leader Orientation 2025",
        attendanceLink: "/Attendance/ATT-2025-01",
        instructions: "Completed attendance activity.",
        startDate: "2025-07-10T08:00:00+08:00",
        endDate: "2025-07-10T12:00:00+08:00",
        assignedSchools: [],
    },
    {
        attendanceCode: "ATT-2025-02",
        activityName: "Campus Community Meeting 2025",
        attendanceLink: "/Attendance/ATT-2025-02",
        instructions: "Completed attendance activity.",
        startDate: "2025-08-01T08:00:00+08:00",
        endDate: "2025-08-01T17:00:00+08:00",
        assignedSchools: [],
    },
];

function createRows(templates, prefix, count) {
    return Array.from({ length: count }, (_, index) => {
        const template = templates[index % templates.length];

        return {
            ...template,
            id: `${prefix}-${index + 1}`,
            responseUrl: template.attendanceLink,
            assignedSchools: template.assignedSchools.map((school) => ({
                ...school,
            })),
            attendanceLogo: null,
            titleTextColor: "#FFFFFFFF",
            subTextColor: "#A1A1AAFF",
            formColor: "#000000FF",
            backgroundColor: "#0A0A0AFF",
        };
    });
}

export const MOCK_REGISTRATIONS = createRows(
    ACTIVE_ATTENDANCE,
    "attendance",
    30,
);

export const MOCK_COMPLETED_REGISTRATIONS = createRows(
    COMPLETED_ATTENDANCE,
    "completed-attendance",
    30,
);

export function formatRegistrationDate(value) {
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

export function toRegistrationDateTimeLocal(value) {
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
