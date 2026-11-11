import { Link } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import { HomeContainer, HomeIcon, SectionHeading } from "./HomeUI";

function parseStatValue(raw) {
    if (typeof raw === "number") {
        return { target: raw, prefix: "", suffix: "", decimals: 0, hasComma: false, valid: true };
    }
    const str = String(raw ?? "").trim();
    const match = str.match(/^([^0-9]*)([\d,.]+)(.*)$/);
    if (!match) {
        return { target: 0, prefix: "", suffix: str, decimals: 0, hasComma: false, valid: false };
    }
    const prefix = match[1] || "";
    const numStr = match[2];
    const suffix = match[3] || "";
    const cleanNum = numStr.replace(/,/g, "");
    const num = parseFloat(cleanNum);
    if (isNaN(num)) {
        return { target: 0, prefix: "", suffix: str, decimals: 0, hasComma: false, valid: false };
    }
    const hasComma = numStr.includes(",");
    const parts = cleanNum.split(".");
    const decimals = parts.length > 1 ? parts[1].length : 0;
    return { target: num, prefix, suffix, decimals, hasComma, valid: true };
}

function StatCounter({ value, startAnimation = false, delay = 0 }) {
    const [display, setDisplay] = useState(() => {
        const parsed = parseStatValue(value);
        if (!parsed.valid) return value;
        return `${parsed.prefix}0${parsed.suffix}`;
    });

    useEffect(() => {
        const parsed = parseStatValue(value);
        if (!parsed.valid) {
            setDisplay(String(value));
            return;
        }

        if (!startAnimation) {
            setDisplay(`${parsed.prefix}0${parsed.suffix}`);
            return;
        }

        if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setDisplay(String(value));
            return;
        }

        let animationFrameId;
        let timeoutId;
        const duration = 1800;

        timeoutId = setTimeout(() => {
            const startTime = performance.now();

            const tick = (now) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic curve
                const ease = 1 - Math.pow(1 - progress, 3);
                const current = parsed.target * ease;

                let formattedNumber;
                if (parsed.decimals > 0) {
                    formattedNumber = current.toFixed(parsed.decimals);
                } else {
                    const rounded = Math.round(current);
                    formattedNumber = parsed.hasComma ? rounded.toLocaleString() : String(rounded);
                }

                if (progress < 1) {
                    setDisplay(`${parsed.prefix}${formattedNumber}${parsed.suffix}`);
                    animationFrameId = requestAnimationFrame(tick);
                } else {
                    setDisplay(String(value));
                }
            };

            animationFrameId = requestAnimationFrame(tick);
        }, delay);

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [value, startAnimation, delay]);

    return <span aria-label={String(value)}>{display}</span>;
}

export default function AboutSection({ data }) {
    const sectionRef = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const element = sectionRef.current;
        if (!element) return;

        if (typeof IntersectionObserver === "undefined") {
            setInView(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            aria-labelledby="home-about-title"
            className="relative isolate overflow-hidden border-t border-white/[0.08] bg-[#0B0B0B] py-16 md:py-20"
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_90%,rgba(242,194,26,0.065),transparent_65%)]"
            />

            <HomeContainer>
                <div className="mx-auto max-w-[768px] text-center">
                    <SectionHeading id="home-about-title">
                        {data.title}
                    </SectionHeading>

                    <p className="mt-6 font-sans text-[16px] font-normal leading-[26px] text-[#E4E4E7] md:text-[18px] md:leading-[28px]">
                        {data.description}
                    </p>

                    <Link
                        href={data.href}
                        className="mt-6 inline-flex py-1.5 font-sans text-[16px] font-bold leading-[26px] text-[#F2C21A] hover:text-[#F8D54B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C21A]"
                    >
                        {data.linkLabel}
                    </Link>
                </div>

                <div className="mt-10 grid grid-cols-2 gap-3 md:mt-16 md:gap-5 lg:grid-cols-4">
                    {data.statistics.map((statistic, index) => (
                        <article
                            key={statistic.label || index}
                            className="flex min-h-[182px] flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/[0.025] px-3 py-6 text-center md:px-4"
                        >
                            <span className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-[#F2C21A]/20 text-[#D4A810]">
                                <HomeIcon name={statistic.icon} />
                            </span>

                            <div className="font-heading text-[36px] font-bold leading-[44px] text-white">
                                <StatCounter
                                    value={statistic.value}
                                    startAnimation={inView}
                                    delay={index * 120}
                                />
                            </div>

                            <p className="mt-1 font-sans text-[12px] font-normal leading-[18px] text-[#9CA3AF] md:text-[14px] md:leading-[22px]">
                                {statistic.label}
                            </p>
                        </article>
                    ))}
                </div>
            </HomeContainer>
        </section>
    );
}
