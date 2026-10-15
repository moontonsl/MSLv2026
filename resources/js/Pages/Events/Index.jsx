import { useMemo, useState } from "react";
import { Head } from "@inertiajs/react";
import {
    ArrowRight,
    CalendarDays,
    ExternalLink,
    MapPin,
    Search,
} from "lucide-react";
import MainLayout from "@/Layouts/MainLayout";
import { eventFilters, events } from "./eventsData";

const statusStyles = {
    upcoming: "bg-blue-600/60 text-blue-300",
    ongoing: "bg-amber-200/60 text-yellow-100",
    "registration-open": "bg-green-400/60 text-green-100",
    ended: "bg-red-500/60 text-red-200",
};

const focusStyles =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]";

function EventCard({ event }) {
    const canAct = event.status !== "ended";
    const isRegistration = event.action === "Register Now";
    const ActionIcon = isRegistration ? ArrowRight : ExternalLink;

    const buttonStyles = !canAct
        ? "cursor-not-allowed border-white/10 bg-[#262626] text-gray-500"
        : isRegistration
          ? "border-black/5 bg-brand-400 text-black hover:bg-brand-300"
          : "border-white/40 bg-white/10 text-white hover:bg-white/15";

    return (
        <article
            className={`flex min-h-[514px] min-w-0 flex-col overflow-hidden rounded-xl border bg-[#121212] ${
                event.featured ? "border-brand-600" : "border-gray-500/70"
            }`}
        >
            <div className="relative aspect-[400/231] shrink-0 overflow-hidden bg-[#101010] xl:aspect-auto xl:h-[231px]">
                <img
                    src={event.image}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-contain"
                />

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black"
                />

                <span
                    className={`absolute left-0 top-[15px] inline-flex h-[38px] items-center rounded-r-md border border-white/10 px-3 text-body-sm font-semibold shadow-sm ${
                        statusStyles[event.status] ?? statusStyles.upcoming
                    }`}
                >
                    {event.statusLabel}
                </span>
            </div>

            <div className="flex flex-1 flex-col gap-5 px-5 pb-[15px] pt-[14px]">
                <div className="flex min-h-[38px] flex-wrap items-center gap-x-3 gap-y-1 text-body-sm font-semibold text-gray-500">
                    <span className="inline-flex min-w-0 items-center gap-1">
                        <CalendarDays
                            aria-hidden="true"
                            className="h-4 w-4 shrink-0"
                        />
                        <span>{event.date}</span>
                    </span>

                    <span className="inline-flex min-w-0 items-center gap-1">
                        <MapPin
                            aria-hidden="true"
                            className="h-4 w-4 shrink-0"
                        />
                        <span>{event.location}</span>
                    </span>
                </div>

                <div className="flex flex-col gap-[5px]">
                    <h2 className="font-manrope text-2xl font-extrabold leading-6 text-white">
                        {event.title}
                    </h2>

                    <p className="text-body-xs font-normal text-gray-300">
                        {event.description}
                    </p>
                </div>

                <button
                    type="button"
                    disabled={!canAct}
                    className={`mt-auto inline-flex min-h-[53px] w-full items-center justify-center gap-5 rounded-[10px] border px-4 py-2 text-lg font-semibold leading-8 transition-colors sm:text-body-xl ${buttonStyles} ${focusStyles}`}
                >
                    {event.action}

                    {canAct ? (
                        <ActionIcon
                            aria-hidden="true"
                            className="h-5 w-5 shrink-0"
                        />
                    ) : null}
                </button>
            </div>
        </article>
    );
}

export default function Events() {
    const [activeFilter, setActiveFilter] = useState("all");
    const [query, setQuery] = useState("");

    const activeFilterLabel =
        eventFilters.find((filter) => filter.key === activeFilter)?.label ??
        "Events";

    const filteredEvents = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        return events.filter((event) => {
            const matchesFilter =
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

            return matchesFilter && matchesQuery;
        });
    }, [activeFilter, query]);

    function resetFilters() {
        setActiveFilter("all");
        setQuery("");
    }

    return (
        <MainLayout fullWidth>
            <Head title="Events" />

            <div
                className="isolate overflow-hidden bg-[#050505] font-inter text-white"
                style={{
                    backgroundImage:
                        "radial-gradient(ellipse 700px 650px at 42% 180px, rgba(251,191,36,0.055), transparent 75%)",
                }}
            >
                <section
                    aria-labelledby="events-title"
                    className="border-b border-white/10 px-5 pb-16 pt-20 sm:px-8 lg:h-[314px] lg:pb-0 lg:pt-24"
                >
                    <div className="mx-auto flex w-full max-w-[576px] flex-col items-center gap-2.5 text-center">
                        <h1
                            id="events-title"
                            className="font-manrope text-[40px] font-extrabold leading-[48px] text-white sm:text-hero-lg"
                        >
                            Our <span className="text-brand-400">Events</span>
                        </h1>

                        <p className="text-body-md font-normal text-gray-300 sm:text-body-lg">
                            Catch the latest events, tournaments, and upcoming
                            activities. Stay informed and never miss out on
                            rewards and challenges.
                        </p>
                    </div>
                </section>

                <div className="mx-auto w-full max-w-[1446px] px-5 pb-20 pt-12 sm:px-8 sm:pt-16 lg:px-[78px] lg:pb-[126px] lg:pt-[98px]">
                    <section
                        aria-label="Browse events"
                        className="flex flex-col gap-10 lg:gap-20"
                    >
                        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                            <div
                                role="group"
                                aria-label="Filter events by status"
                                className="flex flex-wrap items-center gap-3 lg:gap-5"
                            >
                                {eventFilters.map((filter) => {
                                    const isActive =
                                        filter.key === activeFilter;

                                    return (
                                        <button
                                            key={filter.key}
                                            type="button"
                                            aria-pressed={isActive}
                                            onClick={() =>
                                                setActiveFilter(filter.key)
                                            }
                                            className={`inline-flex h-11 items-center justify-center whitespace-nowrap rounded-xl border px-[15px] text-body-sm font-semibold transition-colors lg:h-[52px] lg:text-body-xl ${
                                                isActive
                                                    ? "border-brand-500/20 bg-brand-600 text-black"
                                                    : "border-gray-500 bg-white/[0.08] text-gray-500 hover:border-gray-300 hover:text-gray-300"
                                            } ${focusStyles}`}
                                        >
                                            {filter.label}
                                        </button>
                                    );
                                })}
                            </div>

                            <label className="flex h-[52px] w-full items-center gap-2.5 rounded-xl border border-gray-300/70 bg-white/[0.06] px-3 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-400/30 xl:w-[350px] xl:shrink-0">
                                <span className="sr-only">Search events</span>

                                <Search
                                    aria-hidden="true"
                                    className="h-5 w-5 shrink-0 text-gray-500"
                                />

                                <input
                                    type="search"
                                    value={query}
                                    onChange={(event) =>
                                        setQuery(event.target.value)
                                    }
                                    placeholder="Search events, schools, location..."
                                    className="min-w-0 flex-1 truncate border-0 bg-transparent p-0 text-body-lg font-normal text-white outline-none placeholder:text-gray-500 focus:ring-0"
                                />
                            </label>
                        </div>

                        {filteredEvents.length ? (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-y-10 xl:grid-cols-3 xl:gap-x-[45px]">
                                {filteredEvents.map((event) => (
                                    <EventCard key={event.id} event={event} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex min-h-[300px] flex-col items-center justify-center gap-6 rounded-xl border border-white/10 bg-[#121212] px-6 py-12 text-center">
                                <div>
                                    <h2 className="font-manrope text-2xl font-extrabold leading-8 text-white">
                                        No {activeFilterLabel.toLowerCase()}{" "}
                                        events found
                                    </h2>

                                    <p className="mt-3 max-w-md text-body-lg text-gray-300">
                                        Try another status tab or clear your
                                        search to see more events.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className={`rounded-[10px] border border-black/5 bg-brand-400 px-6 py-2.5 text-body-xl font-semibold text-black transition-colors hover:bg-brand-300 ${focusStyles}`}
                                >
                                    Show All Events
                                </button>
                            </div>
                        )}
                    </section>

                    <section
                        aria-labelledby="community-heading"
                        className="mx-auto mt-20 flex max-w-[1288px] items-center justify-center rounded-xl border border-white/15 px-6 py-16 sm:mt-28 sm:px-12 lg:mt-[180px] lg:min-h-[439px]"
                        style={{
                            background:
                                "linear-gradient(120deg, #13101f 0%, #171426 48%, #251923 100%)",
                            boxShadow: "inset 0 0 18px rgba(137,121,240,0.08)",
                        }}
                    >
                        <div className="flex w-full max-w-[1100px] flex-col items-center gap-[50px] text-center">
                            <div className="flex w-full flex-col items-center gap-2.5">
                                <h2
                                    id="community-heading"
                                    className="font-manrope text-[32px] font-extrabold leading-10 text-white sm:text-hero-md"
                                >
                                    Don&apos;t see a tournament for your school?
                                </h2>

                                <p
                                    className="max-w-[808px] text-body-lg font-normal text-gray-300 sm:text-body-xl"
                                    style={{
                                        fontFamily:
                                            "'Figtree', ui-sans-serif, system-ui, sans-serif",
                                    }}
                                >
                                    Take the lead. Organize an official
                                    MSL-accredited tournament in your campus and
                                    we&apos;ll support you with prizes and
                                    logistics.
                                </p>
                            </div>

                            <button
                                type="button"
                                className={`inline-flex min-h-[53px] w-full max-w-[360px] items-center justify-center gap-5 rounded-[10px] border border-white/70 bg-white/10 px-4 py-2 text-lg font-semibold leading-8 text-white transition-colors hover:bg-white/15 sm:text-body-xl ${focusStyles}`}
                            >
                                Find Your Community Head
                                <ArrowRight
                                    aria-hidden="true"
                                    className="h-5 w-5 shrink-0"
                                />
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </MainLayout>
    );
}
