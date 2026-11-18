import NetworkLogoWall from "./NetworkLogoWall";
import { HomeContainer, SectionHeading } from "./HomeUI";

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

                <NetworkLogoWall logos={logos} />
            </HomeContainer>
        </section>
    );
}
