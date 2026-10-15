import { useMemo, useState } from "react";
import { Head } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";

import EventsHero from "./Components/EventsHero";
import EventFilters from "./Components/EventFilters";
import EventResults from "./Components/EventResults";
import CommunityCTA from "./Components/CommunityCTA";

import { eventFilters, events } from "./eventsData";

export default function Events() {
    const [activeFilter, setActiveFilter] = useState("all");
    const [query, setQuery] = useState("");

    const activeFilterLabel =
        eventFilters.find((filter) => filter.key === activeFilter)?.label ||
        "All";

    const filteredEvents = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        return events.filter((event) => {
            const matchesStatus =
                activeFilter === "all" || event.status === activeFilter;

            const matchesQuery =
                !normalizedQuery ||
                [
                    event.title,
                    event.description,
                    event.location,
                    event.statusLabel,
                ]
                    .join(" ")
                    .toLowerCase()
                    .includes(normalizedQuery);

            return matchesStatus && matchesQuery;
        });
    }, [activeFilter, query]);

    function resetFilters() {
        setActiveFilter("all");
        setQuery("");
    }

    return (
        <MainLayout fullWidth>
            <Head title="Events" />

            <div className="isolate overflow-hidden bg-[#050505] bg-[radial-gradient(ellipse_700px_650px_at_42%_180px,rgba(251,191,36,0.055),transparent_75%)] font-inter text-white">
                <EventsHero />

                <div className="mx-auto w-full max-w-[1446px] px-5 pb-20 pt-12 sm:px-8 sm:pt-16 lg:px-[78px] lg:pb-[126px] lg:pt-[98px]">
                    <section
                        aria-label="Browse events"
                        className="flex flex-col gap-10 lg:gap-20"
                    >
                        <EventFilters
                            filters={eventFilters}
                            activeFilter={activeFilter}
                            query={query}
                            onFilterChange={setActiveFilter}
                            onQueryChange={setQuery}
                        />

                        <EventResults
                            events={filteredEvents}
                            activeFilterLabel={activeFilterLabel}
                            onReset={resetFilters}
                        />
                    </section>

                    <CommunityCTA />
                </div>
            </div>
        </MainLayout>
    );
}
