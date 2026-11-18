import { ExternalLink } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { HomeContainer, SectionHeading } from "./HomeUI";

function getDisplayLabel(logo) {
    const raw = (logo.name || logo.alt || "").trim();
    if (!raw || /^msl network organization\s*\d*$/i.test(raw)) {
        return "";
    }
    return raw;
}

/**
 * Adaptive tier configurations:
 * Tier 1 (1 Row / Base): 100% full scale
 * Tier 2 (2 Rows): 75% scale of base
 * Tier 3 (3+ Rows): 56.25% scale of base (75% of Tier 2)
 */
const TIER_CONFIG = {
    1: {
        scale: 1.0,
        gapClass: "gap-3 sm:gap-4 md:mt-12 md:gap-5",
        itemWidthClass:
            "w-[calc((100%-0.75rem)/2)] sm:w-[calc((100%-2rem)/3)] md:w-[calc((100%-3.75rem)/4)] lg:w-[calc((100%-5rem)/5)]",
        tileClass:
            "min-h-[132px] sm:min-h-[152px] px-4 py-5 sm:px-5 sm:py-6 rounded-2xl",
        logoContainerClass:
            "h-[84px] sm:h-[96px] md:h-[108px]",
        logoImageClass:
            "max-h-full max-w-[85%]",
        labelClass:
            "mt-3 text-xs font-semibold",
        badgeClass:
            "right-3 top-3 h-6 w-6",
        badgeIconClass:
            "h-3 w-3",
    },
    2: {
        scale: 0.75,
        gapClass: "gap-2.5 sm:gap-3.5 md:mt-10 md:gap-4",
        itemWidthClass:
            "w-[calc((100%-0.625rem)/2)] min-[480px]:w-[calc((100%-1.25rem)/3)] sm:w-[calc((100%-2.625rem)/4)] md:w-[calc((100%-4rem)/5)] lg:w-[calc((100%-5rem)/6)]",
        tileClass:
            "min-h-[100px] sm:min-h-[114px] px-3 py-3.5 sm:px-4 sm:py-4.5 rounded-xl sm:rounded-2xl",
        logoContainerClass:
            "h-[64px] sm:h-[72px] md:h-[81px]",
        logoImageClass:
            "max-h-full max-w-[84%]",
        labelClass:
            "mt-2 text-[11px] font-medium leading-tight",
        badgeClass:
            "right-2.5 top-2.5 h-5 w-5",
        badgeIconClass:
            "h-2.5 w-2.5",
    },
    3: {
        scale: 0.5625,
        gapClass: "gap-2 sm:gap-2.5 md:mt-8 md:gap-3",
        itemWidthClass:
            "w-[calc((100%-1rem)/3)] sm:w-[calc((100%-2.5rem)/5)] md:w-[calc((100%-3.75rem)/6)] lg:w-[calc((100%-4.5rem)/7)] xl:w-[calc((100%-5.25rem)/8)]",
        tileClass:
            "min-h-[76px] sm:min-h-[86px] px-2 py-2.5 sm:px-3 sm:py-3 rounded-lg sm:rounded-xl",
        logoContainerClass:
            "h-[48px] sm:h-[54px] md:h-[60px]",
        logoImageClass:
            "max-h-full max-w-[82%]",
        labelClass:
            "mt-1.5 text-[10px] font-medium leading-tight",
        badgeClass:
            "right-2 top-2 h-4 w-4",
        badgeIconClass:
            "h-2 w-2",
    },
};

export default function NetworkSection({ data }) {
    const logos = data?.logos ?? [];
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(0);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const updateWidth = () => {
            setContainerWidth(el.clientWidth || window.innerWidth);
        };

        updateWidth();

        let observer;
        if (typeof ResizeObserver !== "undefined") {
            observer = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    if (entry.contentRect.width > 0) {
                        setContainerWidth(entry.contentRect.width);
                    }
                }
            });
            observer.observe(el);
        } else {
            window.addEventListener("resize", updateWidth);
        }

        return () => {
            if (observer) {
                observer.disconnect();
            } else {
                window.removeEventListener("resize", updateWidth);
            }
        };
    }, []);

    const total = logos.length;

    // Calculate base capacity for container width
    const baseCols = useMemo(() => {
        if (containerWidth >= 1024) return 5;
        if (containerWidth >= 768) return 4;
        if (containerWidth >= 640) return 3;
        return 2;
    }, [containerWidth]);

    // Calculate row requirement at base sizing
    const baseRows = useMemo(() => {
        return Math.max(1, Math.ceil(total / baseCols));
    }, [total, baseCols]);

    // Adaptive tier scaling:
    // Tier 1: 1 row (100% full scale)
    // Tier 2: 2 rows (75% scale)
    // Tier 3: 3+ rows (56.25% scale, 75% of previous 2 rows tier)
    const tier = useMemo(() => {
        if (baseRows <= 1) return 1;
        if (baseRows === 2) return 2;
        return 3;
    }, [baseRows]);

    const config = TIER_CONFIG[tier] || TIER_CONFIG[1];

    if (total === 0) {
        return null;
    }

    return (
        <section
            aria-labelledby="home-network-title"
            className="relative isolate overflow-hidden border-b border-white/[0.06] bg-[#050505] py-14 md:py-20"
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(242,194,26,0.07),transparent_68%)]"
            />

            <HomeContainer>
                <div className="mx-auto max-w-2xl text-center">
                    <SectionHeading id="home-network-title">
                        {data.title}
                    </SectionHeading>
                    {data.description ? (
                        <p className="mt-3 font-sans text-sm leading-relaxed text-[#9CA3AF] md:text-base">
                            {data.description}
                        </p>
                    ) : null}
                </div>

                <ul
                    ref={containerRef}
                    aria-label="MSL network organization logos"
                    data-adaptive-tier={tier}
                    className={`mt-10 flex flex-wrap justify-center transition-all duration-300 ${config.gapClass}`}
                >
                    {logos.map((logo, index) => {
                        const displayLabel = getDisplayLabel(logo);
                        const accessibleName =
                            displayLabel ||
                            logo.alt ||
                            logo.name ||
                            `MSL Network Organization ${index + 1}`;
                        const href = typeof logo.link === "string" ? logo.link.trim() : "";
                        const isExternal = /^https?:\/\//i.test(href);

                        const tileInner = (
                            <>
                                {/* Top subtle gold highlight on hover */}
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#F2C21A]/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                                />

                                {href ? (
                                    <span
                                        aria-hidden="true"
                                        className={`pointer-events-none absolute flex items-center justify-center rounded-full border border-white/10 bg-black/50 text-[#F2C21A] opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-70 ${config.badgeClass}`}
                                    >
                                        <ExternalLink className={config.badgeIconClass} />
                                    </span>
                                ) : null}

                                <div className={`flex w-full items-center justify-center transition-all duration-300 ${config.logoContainerClass}`}>
                                    <img
                                        src={logo.src}
                                        alt={accessibleName}
                                        loading="lazy"
                                        className={`network-tile-logo object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)] group-hover:drop-shadow-[0_8px_20px_rgba(242,194,26,0.18)] transition-all duration-300 ${config.logoImageClass}`}
                                    />
                                </div>

                                {displayLabel ? (
                                    <span className={`line-clamp-1 w-full text-center font-sans tracking-wide text-[#D1D5DB] transition-colors duration-200 group-hover:text-[#F2C21A] ${config.labelClass}`}>
                                        {displayLabel}
                                    </span>
                                ) : null}
                            </>
                        );

                        const baseTileClasses = `network-tile group relative flex h-full w-full flex-col items-center justify-center overflow-hidden border border-white/[0.08] bg-gradient-to-b from-white/[0.045] to-white/[0.015] text-center shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-all duration-300 ${config.tileClass}`;

                        return (
                            <li
                                key={logo.id ?? `${logo.src}-${index}`}
                                className={`transition-all duration-300 ${config.itemWidthClass}`}
                            >
                                {href ? (
                                    <a
                                        href={href}
                                        target={isExternal ? "_blank" : undefined}
                                        rel={isExternal ? "noopener noreferrer" : undefined}
                                        title={accessibleName}
                                        className={`${baseTileClasses} cursor-pointer hover:border-[#F2C21A]/45 hover:bg-white/[0.06] hover:shadow-[0_14px_34px_-8px_rgba(242,194,26,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C21A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]`}
                                    >
                                        {tileInner}
                                    </a>
                                ) : (
                                    <div
                                        title={accessibleName}
                                        className={`${baseTileClasses} hover:border-white/20 hover:bg-white/[0.04]`}
                                    >
                                        {tileInner}
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </HomeContainer>
        </section>
    );
}
