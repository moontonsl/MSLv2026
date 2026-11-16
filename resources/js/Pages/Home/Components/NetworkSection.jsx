import { ExternalLink } from "lucide-react";
import { HomeContainer, SectionHeading } from "./HomeUI";

function getDisplayLabel(logo) {
    const raw = (logo.name || logo.alt || "").trim();
    if (!raw || /^msl network organization\s*\d*$/i.test(raw)) {
        return "";
    }
    return raw;
}

export default function NetworkSection({ data }) {
    const logos = data?.logos ?? [];

    if (logos.length === 0) {
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
                    aria-label="MSL network organization logos"
                    className="mt-10 flex flex-wrap justify-center gap-3 sm:gap-4 md:mt-12 md:gap-5"
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
                                        className="pointer-events-none absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-black/50 text-[#F2C21A] opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-70"
                                    >
                                        <ExternalLink className="h-3 w-3" />
                                    </span>
                                ) : null}

                                <div className="flex h-[84px] w-full items-center justify-center sm:h-[96px] md:h-[108px]">
                                    <img
                                        src={logo.src}
                                        alt={accessibleName}
                                        loading="lazy"
                                        className="network-tile-logo max-h-full max-w-[85%] object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)] group-hover:drop-shadow-[0_8px_20px_rgba(242,194,26,0.18)]"
                                    />
                                </div>

                                {displayLabel ? (
                                    <span className="mt-3 line-clamp-1 w-full text-center font-sans text-xs font-semibold tracking-wide text-[#D1D5DB] transition-colors duration-200 group-hover:text-[#F2C21A]">
                                        {displayLabel}
                                    </span>
                                ) : null}
                            </>
                        );

                        const baseTileClasses =
                            "network-tile group relative flex h-full min-h-[132px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.045] to-white/[0.015] px-4 py-5 text-center shadow-[0_8px_24px_rgba(0,0,0,0.35)] sm:min-h-[152px] sm:px-5 sm:py-6";

                        return (
                            <li
                                key={logo.id ?? `${logo.src}-${index}`}
                                className="w-[calc((100%-0.75rem)/2)] sm:w-[calc((100%-2rem)/3)] md:w-[calc((100%-3.75rem)/4)] lg:w-[calc((100%-5rem)/5)]"
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
