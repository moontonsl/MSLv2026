import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "./HomeUI";

export default function NetworkSection({ data }) {
    const scrollerRef = useRef(null);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        const element = scrollerRef.current;

        if (!element) return;

        const media = window.matchMedia("(prefers-reduced-motion: reduce)");

        let frameId = null;
        let previousTime = null;
        let position = element.scrollLeft;
        let visible = false;

        const shouldAnimate = () =>
            visible && !paused && !document.hidden && !media.matches;

        function stop() {
            if (frameId !== null) {
                window.cancelAnimationFrame(frameId);
            }

            frameId = null;
            previousTime = null;
        }

        function animate(time) {
            if (!shouldAnimate()) {
                stop();
                return;
            }

            const elapsed =
                previousTime === null ? 0 : Math.min(time - previousTime, 50);

            previousTime = time;

            const groupWidth =
                element.firstElementChild?.getBoundingClientRect().width || 0;

            if (groupWidth > 0) {
                position += elapsed * 0.025;

                if (position >= groupWidth) {
                    position %= groupWidth;
                }

                element.scrollLeft = position;
            }

            frameId = window.requestAnimationFrame(animate);
        }

        function updatePlayback() {
            stop();

            if (shouldAnimate()) {
                position = element.scrollLeft;
                frameId = window.requestAnimationFrame(animate);
            }
        }

        const observer = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            updatePlayback();
        });

        observer.observe(element);
        media.addEventListener("change", updatePlayback);
        document.addEventListener("visibilitychange", updatePlayback);

        return () => {
            stop();
            observer.disconnect();
            media.removeEventListener("change", updatePlayback);
            document.removeEventListener("visibilitychange", updatePlayback);
        };
    }, [paused]);

    return (
        <section
            aria-labelledby="home-network-title"
            className="overflow-hidden border-b border-white/[0.06] bg-[#050505] py-12 text-center"
        >
            <SectionHeading id="home-network-title" className="px-6">
                {data.title}
            </SectionHeading>

            <div
                ref={scrollerRef}
                tabIndex={0}
                aria-label="MSL network organization logos"
                className="hide-scrollbar mt-10 flex overflow-x-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C21A]"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                onFocusCapture={() => setPaused(true)}
                onBlurCapture={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) {
                        setPaused(false);
                    }
                }}
            >
                {[0, 1].map((copy) => (
                    <div
                        key={copy}
                        aria-hidden={copy === 1 ? true : undefined}
                        className="flex shrink-0 items-center gap-10 pr-10 md:gap-20 md:pr-20"
                    >
                        {data.logos.map((logo) => (
                            <div
                                key={logo.src}
                                className="grid h-[110px] w-[150px] shrink-0 place-items-center md:h-[150px] md:w-[220px]"
                            >
                                <img
                                    src={logo.src}
                                    alt={copy === 0 ? logo.alt : ""}
                                    loading="lazy"
                                    className="max-h-[110px] max-w-full object-contain md:max-h-[150px]"
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </section>
    );
}
