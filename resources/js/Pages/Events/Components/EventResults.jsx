import EventCard from "./EventCard";
import { focusStyles } from "../eventStyles";

export default function EventResults({ events, activeFilterLabel, onReset }) {
    if (events.length > 0) {
        return (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-y-10 xl:grid-cols-3 xl:gap-x-[45px]">
                {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
        );
    }

    const emptyTitle =
        activeFilterLabel === "All"
            ? "No events found"
            : `No ${activeFilterLabel.toLowerCase()} events found`;

    return (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-6 rounded-xl border border-white/10 bg-[#121212] px-6 py-12 text-center">
            <div role="status">
                <h2 className="font-manrope text-2xl font-extrabold leading-8 text-white">
                    {emptyTitle}
                </h2>

                <p className="mt-3 max-w-md text-body-lg text-gray-300">
                    Try another status tab or clear your search to see more
                    events.
                </p>
            </div>

            <button
                type="button"
                onClick={onReset}
                className={`rounded-[10px] border border-black/5 bg-brand-400 px-6 py-2.5 text-body-xl font-semibold text-black transition-colors hover:bg-brand-300 ${focusStyles}`}
            >
                Show All Events
            </button>
        </div>
    );
}
