import { ArrowRight, CalendarDays, ExternalLink, MapPin } from "lucide-react";
import { focusStyles } from "../eventStyles";

const STATUS_STYLES = {
    upcoming: "bg-blue-600/60 text-blue-300",
    ongoing: "bg-amber-200/60 text-yellow-100",
    "registration-open": "bg-green-400/60 text-green-100",
    ended: "bg-red-500/60 text-red-200",
};

function EventAction({ event }) {
    const hasEnded = event.status === "ended";
    const isRegistration = event.action === "Register Now";
    const ActionIcon = isRegistration ? ArrowRight : ExternalLink;

    let buttonStyles =
        "border-white/40 bg-white/10 text-white hover:bg-white/15";

    if (hasEnded) {
        buttonStyles =
            "cursor-not-allowed border-white/10 bg-[#262626] text-gray-500";
    } else if (isRegistration) {
        buttonStyles =
            "border-black/5 bg-brand-400 text-black hover:bg-brand-300";
    }

    return (
        <button
            type="button"
            disabled={hasEnded}
            className={`mt-auto inline-flex min-h-[53px] w-full items-center justify-center gap-5 rounded-[10px] border px-4 py-2 text-lg font-semibold leading-8 transition-colors sm:text-body-xl ${buttonStyles} ${focusStyles}`}
        >
            {event.action}

            {!hasEnded && (
                <ActionIcon aria-hidden="true" className="h-5 w-5 shrink-0" />
            )}
        </button>
    );
}

export default function EventCard({ event }) {
    const statusStyle = STATUS_STYLES[event.status] || STATUS_STYLES.upcoming;

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
                    className={`absolute left-0 top-[15px] inline-flex h-[38px] items-center rounded-r-md border border-white/10 px-3 text-body-sm font-semibold shadow-sm ${statusStyle}`}
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

                <EventAction event={event} />
            </div>
        </article>
    );
}
