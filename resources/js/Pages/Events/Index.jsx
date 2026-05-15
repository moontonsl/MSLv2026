import { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import { ArrowUpRight, CalendarDays, MapPin, Search } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import { eventFilters, events } from './eventsData';

const statusStyles = {
    upcoming: {
        badge: 'bg-blue-600/60 text-blue-300',
        border: 'border-brand-400',
        button: 'border-white/40 bg-white/10 text-white hover:bg-white/15',
    },
    ongoing: {
        badge: 'bg-amber-200/60 text-yellow-100',
        border: 'border-gray-500',
        button: 'border-black/5 bg-brand-400 text-black hover:bg-brand-300',
    },
    'registration-open': {
        badge: 'bg-green-400/60 text-green-100',
        border: 'border-gray-500',
        button: 'border-black/5 bg-brand-400 text-black hover:bg-brand-300',
    },
    ended: {
        badge: 'bg-red-500/60 text-red-200',
        border: 'border-gray-500',
        button: 'cursor-not-allowed border-white/10 bg-white/10 text-gray-500',
    },
};

function getFilterCount(filterKey) {
    if (filterKey === 'all') return events.length;

    return events.filter((event) => event.status === filterKey).length;
}

function EventCard({ event }) {
    const styles = statusStyles[event.status] ?? statusStyles.upcoming;
    const canAct = event.status !== 'ended';

    return (
        <article className={`flex w-full max-w-sm flex-col overflow-hidden rounded-xl border bg-[#0b0b0b] pb-3.5 ${event.featured ? styles.border : 'border-gray-500/70'}`}>
            <div className="relative h-52 overflow-hidden rounded-t-xl bg-[#111111]">
                <img src={event.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-black" />
                <div className={`absolute left-0 top-3.5 rounded-r-md border border-white/10 px-3 py-2 text-sm font-semibold leading-5 shadow-sm ${styles.badge}`}>
                    {event.statusLabel}
                </div>
            </div>

            <div className="flex h-64 flex-col gap-5 px-3.5 pt-3.5">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold leading-5 text-gray-500">
                    <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        {event.date}
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                    </span>
                </div>

                <div className="flex h-32 flex-col gap-1.5">
                    <h2 className="font-['League_Spartan'] text-2xl font-black leading-6 text-white">
                        {event.title}
                    </h2>
                    <p className="line-clamp-5 text-xs font-normal leading-4 text-gray-300">
                        {event.description}
                    </p>
                </div>

                <button
                    type="button"
                    disabled={!canAct}
                    className={`mt-auto flex min-h-14 w-full items-center justify-center gap-5 rounded-[10px] border px-6 py-3 text-xl font-semibold leading-8 transition ${styles.button}`}
                >
                    {event.action}
                    {canAct ? <ArrowUpRight className="h-5 w-5" /> : null}
                </button>
            </div>
        </article>
    );
}

export default function Events() {
    const [activeFilter, setActiveFilter] = useState('all');
    const [query, setQuery] = useState('');
    const activeFilterLabel = eventFilters.find((filter) => filter.key === activeFilter)?.label ?? 'Events';

    const filteredEvents = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        return events.filter((event) => {
            const matchesFilter = activeFilter === 'all' || event.status === activeFilter;
            const matchesQuery =
                !normalizedQuery ||
                [event.title, event.description, event.location, event.statusLabel]
                    .join(' ')
                    .toLowerCase()
                    .includes(normalizedQuery);

            return matchesFilter && matchesQuery;
        });
    }, [activeFilter, query]);

    return (
        <MainLayout fullWidth>
            <Head title="Events" />

            <div className="overflow-hidden bg-[#0a0a0a] px-4 pb-12 text-white sm:px-6 lg:px-12">
                <section className="mx-auto flex max-w-[1446px] flex-col items-center gap-20 pt-24">
                    <div className="flex w-full max-w-xl flex-col items-center gap-2.5">
                        <h1 className="text-center font-['League_Spartan'] text-5xl font-black leading-[52px] sm:text-6xl sm:leading-[60px]">
                            Our <span className="text-brand-400">Events</span>
                        </h1>
                        <p className="text-center text-lg font-normal leading-7 text-white">
                            Catch the latest events, tournaments, and upcoming activities. Stay informed and never miss out on rewards and challenges.
                        </p>
                    </div>

                    <div className="relative h-px w-full">
                        <div className="pointer-events-none absolute left-1/2 top-[-150px] h-[420px] w-[420px] -translate-x-1/2 rotate-[-25deg] bg-brand-400/10 blur-sm lg:left-[38%] lg:h-[595px] lg:w-[595px]" />
                        <div className="h-px w-full bg-white/10" />
                    </div>
                </section>

                <section className="relative z-10 mx-auto flex max-w-[1288px] flex-col gap-10 py-16 lg:gap-20 lg:py-20">
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                        <div className="flex flex-wrap items-center gap-3 lg:gap-5">
                            {eventFilters.map((filter) => {
                                const isActive = filter.key === activeFilter;
                                const count = getFilterCount(filter.key);

                                return (
                                    <button
                                        key={filter.key}
                                        type="button"
                                        onClick={() => setActiveFilter(filter.key)}
                                        className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-base font-semibold leading-6 transition lg:text-xl lg:leading-8 ${
                                            isActive
                                                ? 'border-brand-500/20 bg-brand-600 text-black'
                                                : 'border-gray-500 bg-zinc-400/10 text-gray-500 hover:border-brand-500/40 hover:text-gray-300'
                                        }`}
                                    >
                                        <span>{filter.label}</span>
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-bold leading-4 ${isActive ? 'bg-black/10 text-black' : 'bg-white/10 text-gray-400'}`}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        <label className="flex h-12 w-full max-w-sm items-center gap-2.5 rounded-xl border border-gray-300 bg-zinc-400/10 px-3 text-gray-500">
                            <Search className="h-5 w-5 shrink-0" />
                            <input
                                type="search"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Search events, schools, location..."
                                className="min-w-0 flex-1 bg-transparent text-sm leading-7 text-white outline-none placeholder:text-gray-500 sm:text-base"
                            />
                        </label>
                    </div>

                    {filteredEvents.length ? (
                        <div
                            className={`grid gap-4 sm:gap-6 lg:gap-10 xl:gap-x-11 ${
                                filteredEvents.length === 1
                                    ? 'grid-cols-1'
                                    : 'grid-cols-2'
                            } xl:grid-cols-3`}
                        >
                            {filteredEvents.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4 rounded-xl border border-white/10 bg-white/5 px-6 py-12 text-center">
                            <div>
                                <div className="font-['League_Spartan'] text-2xl font-black leading-6 text-white">
                                    No {activeFilterLabel.toLowerCase()} events found
                                </div>
                                <p className="mt-2 max-w-md text-sm leading-5 text-gray-300">
                                    Try another status tab or clear your search to see more events.
                                </p>
                            </div>
                            {(activeFilter !== 'all' || query) ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setActiveFilter('all');
                                        setQuery('');
                                    }}
                                    className="rounded-xl border border-brand-500 bg-brand-500 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-brand-400"
                                >
                                    Show All Events
                                </button>
                            ) : null}
                        </div>
                    )}
                </section>

                <section className="mx-auto max-w-[1288px] py-8 lg:py-20">
                    <div className="relative flex min-h-80 overflow-hidden rounded-xl bg-indigo-400/10 px-6 py-12 sm:px-12 lg:px-60 lg:py-16">
                        <div className="pointer-events-none absolute -left-24 -top-32 h-[420px] w-[420px] rotate-[-25deg] bg-primary-600/10" />
                        <div className="pointer-events-none absolute left-1/3 -top-24 h-[420px] w-[420px] rotate-[-25deg] bg-red-600/10" />
                        <div className="relative z-10 mx-auto flex max-w-[912px] flex-col items-center justify-center gap-12 text-center">
                            <div className="flex flex-col gap-2.5">
                                <h2 className="font-['League_Spartan'] text-4xl font-black leading-[42px] text-white sm:text-5xl sm:leading-[48px]">
                                    Don&apos;t see a tournament for your school?
                                </h2>
                                <p className="text-lg font-normal leading-8 text-gray-300 sm:text-xl">
                                    Take the lead. Organize an official MSL-accredited tournament in your campus and we&apos;ll support you with prizes and logistics.
                                </p>
                            </div>
                            <button
                                type="button"
                                className="flex min-h-14 w-full max-w-sm items-center justify-center gap-5 rounded-[10px] border border-white bg-white/10 px-8 py-3 text-lg font-semibold leading-8 text-white transition hover:bg-white/15 sm:text-xl"
                            >
                                Find Your Community Head
                                <ArrowUpRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
