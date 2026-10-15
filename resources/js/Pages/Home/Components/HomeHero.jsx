import { Link } from "@inertiajs/react";
import { ArrowRight, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { ButtonLink, CarouselButton } from "./HomeUI";

export default function HomeHero({ data }) {
    const { heading, description, actions, slides } = data;
    const [activeIndex, setActiveIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    const activeSlide = slides[activeIndex] || slides[0];

    useEffect(() => {
        if (slides.length < 2) return;

        const media = window.matchMedia("(prefers-reduced-motion: reduce)");

        let timer;

        function stop() {
            window.clearInterval(timer);
        }

        function updatePlayback() {
            stop();

            if (paused || media.matches || document.hidden) return;

            timer = window.setInterval(() => {
                setActiveIndex((index) => (index + 1) % slides.length);
            }, 6000);
        }

        updatePlayback();

        media.addEventListener("change", updatePlayback);
        document.addEventListener("visibilitychange", updatePlayback);

        return () => {
            stop();
            media.removeEventListener("change", updatePlayback);
            document.removeEventListener("visibilitychange", updatePlayback);
        };
    }, [paused, slides.length]);

    function moveSlide(direction) {
        setActiveIndex(
            (index) => (index + direction + slides.length) % slides.length,
        );
    }

    return (
        <section
            aria-labelledby="home-hero-title"
            className="flex items-center bg-[#050505] py-16 lg:min-h-[700px] lg:py-12"
        >
            <div className="mx-auto grid w-[calc(100%-3rem)] max-w-[1312px] items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-8 xl:grid-cols-[550px_minmax(0,1fr)] xl:gap-10">
                <div className="max-w-[620px]">
                    <h1
                        id="home-hero-title"
                        className="font-heading text-[36px] font-extrabold leading-[44px] tracking-normal text-white sm:text-[48px] sm:leading-[58px] lg:text-[40px] lg:leading-[50px] xl:text-[48px] xl:leading-[58px]"
                    >
                        {heading.map((line) => (
                            <span
                                key={line.text}
                                className={`block ${
                                    line.accent ? "text-[#F2C21A]" : ""
                                }`}
                            >
                                {line.text}
                            </span>
                        ))}
                    </h1>

                    <p className="mt-6 max-w-[550px] font-sans text-[16px] font-normal leading-[26px] text-[#9CA3AF]">
                        {description}
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4">
                        {actions.map((action) => (
                            <ButtonLink
                                key={action.label}
                                href={action.href}
                                variant={action.variant}
                            >
                                {action.label}
                            </ButtonLink>
                        ))}
                    </div>
                </div>

                {activeSlide && (
                    <div className="min-w-0">
                        <p className="mb-4 font-sans text-[12px] font-semibold leading-[18px] text-[#9CA3AF]">
                            HAPPENING NOW
                        </p>

                        <div
                            role="region"
                            aria-roledescription="carousel"
                            aria-label="Happening now"
                            className="group relative min-h-[360px] overflow-hidden rounded-3xl border border-white/10 bg-[#121212] shadow-[0_20px_25px_rgba(0,0,0,0.1)]"
                            onMouseEnter={() => setPaused(true)}
                            onMouseLeave={() => setPaused(false)}
                            onFocusCapture={() => setPaused(true)}
                            onBlurCapture={(event) => {
                                if (
                                    !event.currentTarget.contains(
                                        event.relatedTarget,
                                    )
                                ) {
                                    setPaused(false);
                                }
                            }}
                        >
                            <img
                                src={activeSlide.image}
                                alt=""
                                fetchPriority="high"
                                className="absolute inset-0 h-full w-full object-cover"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/95 via-[#121212]/40 to-black/5" />

                            <div
                                role="group"
                                aria-roledescription="slide"
                                aria-label={`${activeIndex + 1} of ${slides.length}`}
                                className="relative z-10 px-4 pb-[51px] pt-[146px]"
                            >
                                <span className="inline-flex rounded-md bg-[#B91C1C] px-3 py-1 font-sans text-[12px] font-bold leading-[18px] text-white">
                                    {activeSlide.badge}
                                </span>

                                <h2 className="mt-2 font-heading text-[24px] font-extrabold leading-[24px] text-white">
                                    {activeSlide.title}
                                </h2>

                                <p className="mt-1 max-w-[524px] font-sans text-[16px] font-semibold leading-[26px] text-[#D1D5DB]">
                                    {activeSlide.description}
                                </p>

                                <div className="mt-3 flex flex-wrap items-center gap-2.5">
                                    <span className="inline-flex min-h-[38px] items-center gap-1 rounded-md border border-white/10 bg-black/60 px-3 py-[7px] font-sans text-[14px] font-bold leading-[22px] text-white">
                                        <Calendar
                                            size={16}
                                            aria-hidden="true"
                                            className="text-[#F2C21A]"
                                        />
                                        {activeSlide.date}
                                    </span>

                                    <Link
                                        href={activeSlide.href}
                                        className="inline-flex min-h-[38px] items-center gap-1 rounded-md border border-[#D4A810] bg-[#F2C21A] px-3 py-[7px] font-['Figtree'] text-[14px] font-semibold leading-[22px] text-[#18181B] hover:bg-[#F8D54B] hover:text-[#18181B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                    >
                                        View Details
                                        <ArrowRight
                                            size={18}
                                            aria-hidden="true"
                                        />
                                    </Link>
                                </div>
                            </div>

                            {slides.length > 1 && (
                                <>
                                    <CarouselButton
                                        direction="previous"
                                        label="Previous featured event"
                                        onClick={() => moveSlide(-1)}
                                        className="absolute left-3 top-[40%] z-20 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100"
                                    />

                                    <CarouselButton
                                        direction="next"
                                        label="Next featured event"
                                        onClick={() => moveSlide(1)}
                                        className="absolute right-3 top-[40%] z-20 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100"
                                    />

                                    <div className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                                        {slides.map((slide, index) => (
                                            <button
                                                key={slide.id}
                                                type="button"
                                                aria-label={`Show ${slide.title}`}
                                                aria-current={
                                                    activeIndex === index
                                                        ? "true"
                                                        : undefined
                                                }
                                                onClick={() =>
                                                    setActiveIndex(index)
                                                }
                                                className="grid min-h-6 min-w-6 place-items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C21A]"
                                            >
                                                <span
                                                    className={`block h-1.5 rounded-full transition-[width] motion-reduce:transition-none ${
                                                        activeIndex === index
                                                            ? "w-12 bg-[#F2C21A]"
                                                            : "w-[18px] bg-[#52525B]"
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
