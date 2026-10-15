import { Link } from "@inertiajs/react";
import { HomeContainer, HomeIcon, SectionHeading } from "./HomeUI";

export default function AboutSection({ data }) {
    return (
        <section
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
                    {data.statistics.map((statistic) => (
                        <article
                            key={statistic.label}
                            className="flex min-h-[182px] flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/[0.025] px-3 py-6 text-center md:px-4"
                        >
                            <span className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-[#F2C21A]/20 text-[#D4A810]">
                                <HomeIcon name={statistic.icon} />
                            </span>

                            <div className="font-heading text-[36px] font-bold leading-[44px] text-white">
                                {statistic.value}
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
