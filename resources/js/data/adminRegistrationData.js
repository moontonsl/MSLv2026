const DEMO_REGISTRATION = {
    eventCode: "ASDC26",
    eventName: "All Star Dance Challenge 2026",
    startDate: "2026-07-10T00:00:00+08:00",
    endDate: "2026-07-25T16:00:00+08:00",
    responseUrl: "/Tournament/SL",
};

function createDemoRows(prefix) {
    return Array.from({ length: 30 }, (_, index) => ({
        ...DEMO_REGISTRATION,
        id: `${prefix}-${index + 1}`,
    }));
}

export const REGISTRATION_PAGE_SIZE = 3;

export const REGISTRATION_ITEMS = createDemoRows("registration");

export const COMPLETED_REGISTRATION_ITEMS = createDemoRows(
    "completed-registration",
);

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
