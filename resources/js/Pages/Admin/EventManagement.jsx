import { Head } from "@inertiajs/react";
import { Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import DeleteConfirmationModal from "@/Components/Admin/DeleteConfirmationModal";
import EventModal from "@/Components/Admin/EventModal";
import EventTable from "@/Components/Admin/EventTable";
import SectionCard from "@/Components/Admin/SectionCard";
import SuccessModal from "@/Components/Admin/SuccessModal";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    EVENT_PAGE_SIZE,
    MOCK_COMPLETED_EVENTS,
    MOCK_EVENTS,
} from "@/data/adminEventData";

function normalizeEvent(event = {}, index = 0, prefix = "event") {
    return {
        ...event,
        id: event.id ?? `${prefix}-${index + 1}`,
        eventCode: event.eventCode ?? event.event_code ?? "",
        eventName: event.eventName ?? event.event_name ?? "",
        description:
            event.description ??
            event.eventDescription ??
            event.event_description ??
            "",
        startDate: event.startDate ?? event.start_date ?? "",
        endDate: event.endDate ?? event.end_date ?? "",
        responseUrl:
            event.responseUrl ??
            event.response_url ??
            event.eventLink ??
            event.event_link ??
            "",
    };
}

function normalizeEvents(events, prefix) {
    if (!Array.isArray(events)) {
        return [];
    }

    return events.map((event, index) => normalizeEvent(event, index, prefix));
}

function filterEvents(events, search) {
    const query = search.trim().toLowerCase();

    if (!query) {
        return events;
    }

    return events.filter((event) =>
        [event.eventCode, event.eventName, event.description, event.responseUrl]
            .join(" ")
            .toLowerCase()
            .includes(query),
    );
}

function createLocalId() {
    if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
    ) {
        return crypto.randomUUID();
    }

    return `event-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function SearchInput({ value, onChange, label }) {
    return (
        <label className="relative block w-full min-w-0 sm:w-[196px]">
            <span className="sr-only">{label}</span>

            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

            <input
                type="search"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder="Search..."
                aria-label={label}
                className="h-9 w-full rounded-lg border border-white/[0.04] bg-[#1A1A1A] pl-9 pr-3 text-xs text-white outline-none placeholder:text-gray-600 transition focus:border-[#FBBF24] focus:ring-1 focus:ring-[#FBBF24]"
            />
        </label>
    );
}

export default function EventManagement({
    events: eventProp,
    completedEvents: completedEventProp,
    regions = [],
    schools = [],
}) {
    const [events, setEvents] = useState(() =>
        normalizeEvents(
            Array.isArray(eventProp) ? eventProp : MOCK_EVENTS,
            "event",
        ),
    );

    const [completedEvents, setCompletedEvents] = useState(() =>
        normalizeEvents(
            Array.isArray(completedEventProp)
                ? completedEventProp
                : MOCK_COMPLETED_EVENTS,
            "completed-event",
        ),
    );

    const [eventSearch, setEventSearch] = useState("");
    const [completedSearch, setCompletedSearch] = useState("");
    const [eventPage, setEventPage] = useState(1);
    const [completedPage, setCompletedPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [pendingDelete, setPendingDelete] = useState(null);
    const [successOpen, setSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [copiedCode, setCopiedCode] = useState(null);

    useEffect(() => {
        if (!Array.isArray(eventProp)) {
            return;
        }

        setEvents(normalizeEvents(eventProp, "event"));
        setEventPage(1);
    }, [eventProp]);

    useEffect(() => {
        if (!Array.isArray(completedEventProp)) {
            return;
        }

        setCompletedEvents(
            normalizeEvents(completedEventProp, "completed-event"),
        );
        setCompletedPage(1);
    }, [completedEventProp]);

    const filteredEvents = useMemo(
        () => filterEvents(events, eventSearch),
        [events, eventSearch],
    );

    const filteredCompletedEvents = useMemo(
        () => filterEvents(completedEvents, completedSearch),
        [completedEvents, completedSearch],
    );

    const eventPageCount = Math.max(
        1,
        Math.ceil(filteredEvents.length / EVENT_PAGE_SIZE),
    );

    const completedPageCount = Math.max(
        1,
        Math.ceil(filteredCompletedEvents.length / EVENT_PAGE_SIZE),
    );

    const pagedEvents = useMemo(() => {
        const start = (eventPage - 1) * EVENT_PAGE_SIZE;

        return filteredEvents.slice(start, start + EVENT_PAGE_SIZE);
    }, [eventPage, filteredEvents]);

    const pagedCompletedEvents = useMemo(() => {
        const start = (completedPage - 1) * EVENT_PAGE_SIZE;

        return filteredCompletedEvents.slice(start, start + EVENT_PAGE_SIZE);
    }, [completedPage, filteredCompletedEvents]);

    useEffect(() => {
        setEventPage(1);
    }, [eventSearch]);

    useEffect(() => {
        setCompletedPage(1);
    }, [completedSearch]);

    useEffect(() => {
        setEventPage((page) => Math.min(page, eventPageCount));
    }, [eventPageCount]);

    useEffect(() => {
        setCompletedPage((page) => Math.min(page, completedPageCount));
    }, [completedPageCount]);

    const openCreateModal = () => {
        setEditingEvent(null);
        setModalOpen(true);
    };

    const openEditModal = (event) => {
        setEditingEvent(event);
        setModalOpen(true);
    };

    const closeEventModal = () => {
        setEditingEvent(null);
        setModalOpen(false);
    };

    const handleEventSubmit = (values) => {
        const isEditing = editingEvent !== null;

        const nextEvent = normalizeEvent({
            ...editingEvent,
            ...values,
            id: editingEvent?.id ?? createLocalId(),
        });

        setEvents((current) =>
            isEditing
                ? current.map((event) =>
                      event.id === nextEvent.id ? nextEvent : event,
                  )
                : [nextEvent, ...current],
        );

        setEventSearch("");
        setEventPage(1);
        closeEventModal();

        setSuccessMessage(
            isEditing
                ? "Event updated successfully."
                : "Event created successfully.",
        );
        setSuccessOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!pendingDelete) {
            return;
        }

        setEvents((current) =>
            current.filter((event) => event.id !== pendingDelete.id),
        );

        setPendingDelete(null);
        setSuccessMessage("Event deleted successfully.");
        setSuccessOpen(true);
    };

    const handleCopy = async (eventCode) => {
        if (!navigator.clipboard?.writeText) {
            return;
        }

        try {
            await navigator.clipboard.writeText(eventCode);
            setCopiedCode(eventCode);

            window.setTimeout(() => {
                setCopiedCode((current) =>
                    current === eventCode ? null : current,
                );
            }, 1500);
        } catch {
            setCopiedCode(null);
        }
    };

    return (
        <AdminLayout activeNavId="event-management">
            <Head title="Event Management" />

            <div className="min-w-0 max-w-full overflow-x-hidden">
                <h1 className="mb-6 font-heading text-2xl font-bold tracking-tight text-[#FFFBEB] sm:mb-10 sm:text-4xl">
                    Event Management
                </h1>

                <SectionCard
                    title="Events"
                    headerRight={
                        <div className="flex w-full min-w-0 items-center gap-2 sm:w-auto">
                            <SearchInput
                                value={eventSearch}
                                onChange={setEventSearch}
                                label="Search events"
                            />

                            <button
                                type="button"
                                onClick={openCreateModal}
                                className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#FBBF24] px-3 text-xs font-bold text-black transition hover:bg-[#FCD34D] sm:gap-2 sm:px-4"
                            >
                                <Plus className="h-4 w-4" />

                                <span className="hidden min-[420px]:inline">
                                    Create Event
                                </span>

                                <span className="min-[420px]:hidden">
                                    Create
                                </span>
                            </button>
                        </div>
                    }
                >
                    <EventTable
                        events={pagedEvents}
                        currentPage={eventPage}
                        pageCount={eventPageCount}
                        onPageChange={setEventPage}
                        onEdit={openEditModal}
                        onDelete={setPendingDelete}
                        copiedCode={copiedCode}
                        onCopy={handleCopy}
                        emptyMessage="No events match your search."
                    />
                </SectionCard>

                <SectionCard
                    title="Completed Events"
                    headerRight={
                        <SearchInput
                            value={completedSearch}
                            onChange={setCompletedSearch}
                            label="Search completed events"
                        />
                    }
                >
                    <EventTable
                        events={pagedCompletedEvents}
                        showActions={false}
                        showDates={false}
                        currentPage={completedPage}
                        pageCount={completedPageCount}
                        onPageChange={setCompletedPage}
                        copiedCode={copiedCode}
                        onCopy={handleCopy}
                        emptyMessage="No completed events match your search."
                    />
                </SectionCard>
            </div>

            <EventModal
                isOpen={modalOpen}
                onClose={closeEventModal}
                initialData={editingEvent}
                onSubmit={handleEventSubmit}
            />

            <DeleteConfirmationModal
                isOpen={pendingDelete !== null}
                onCancel={() => setPendingDelete(null)}
                onConfirm={handleDeleteConfirm}
            />

            <SuccessModal
                isOpen={successOpen}
                onClose={() => setSuccessOpen(false)}
                message={successMessage}
            />
        </AdminLayout>
    );
}
