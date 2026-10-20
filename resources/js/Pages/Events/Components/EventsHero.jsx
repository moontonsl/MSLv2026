export default function EventsHero() {
    return (
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
                    activities. Stay informed and never miss out on rewards and
                    challenges.
                </p>
            </div>
        </section>
    );
}
