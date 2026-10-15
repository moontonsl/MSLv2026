import { MapPin, Quote } from "lucide-react";
import {
    CarouselButton,
    HomeContainer,
    SectionDescription,
    SectionHeading,
} from "./HomeUI";
import useCardScroller from "./hooks/useCardScroller";

function VoiceCard({ voice }) {
    return (
        <article className="relative min-w-0 snap-start overflow-hidden rounded-2xl border border-transparent bg-[#121212] transition-colors hover:border-[#F2C21A]/55">
            <div className="relative h-[236px] overflow-hidden">
                <img
                    src={voice.image}
                    alt={voice.name}
                    loading="lazy"
                    className="h-full w-full object-cover object-[center_30%]"
                />

                <span className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
            </div>

            <span className="absolute right-5 top-[216px] grid h-10 w-10 place-items-center rounded-[9px] bg-[#F2C21A] text-[#18181B]">
                <Quote size={21} aria-hidden="true" />
            </span>

            <div className="px-5 pb-5">
                <h3 className="max-w-[175px] font-sans text-[24px] font-extrabold leading-[32px] text-white">
                    {voice.name}
                </h3>

                <p className="mt-1 font-sans text-[14px] font-bold leading-[22px] text-[#F2C21A]">
                    {voice.role}
                </p>

                <p className="mt-1 flex items-start gap-1 font-sans text-[12px] font-normal leading-[18px] text-[#9CA3AF]">
                    <MapPin
                        size={13}
                        aria-hidden="true"
                        className="mt-0.5 shrink-0 text-[#A78109]"
                    />
                    {voice.university}
                </p>

                <blockquote className="mt-3 border-t border-white/[0.08] pt-3 font-sans text-[14px] font-normal italic leading-[22px] text-[#A1A1AA]">
                    “{voice.quote}”
                </blockquote>
            </div>
        </article>
    );
}

export default function CommunityVoicesSection({ data }) {
    const { scrollerRef, scrollPrevious, scrollNext } = useCardScroller();

    return (
        <section
            aria-labelledby="home-voices-title"
            className="border-y border-white/[0.04] bg-[#0B0B0B] py-16 md:py-20"
        >
            <HomeContainer>
                <SectionHeading id="home-voices-title">
                    {data.title}
                </SectionHeading>

                <SectionDescription>{data.description}</SectionDescription>

                <div className="relative mt-12">
                    <CarouselButton
                        direction="previous"
                        label="Previous community voices"
                        onClick={scrollPrevious}
                        className="absolute -left-3 top-[45%] z-20 md:-left-5"
                    />

                    <div
                        ref={scrollerRef}
                        className="hide-scrollbar grid auto-cols-[85%] grid-flow-col snap-x snap-mandatory gap-6 overflow-x-auto py-2 md:auto-cols-[calc((100%-24px)/2)] lg:auto-cols-[calc((100%-48px)/3)] xl:auto-cols-[calc((100%-72px)/4)]"
                    >
                        {data.voices.map((voice) => (
                            <VoiceCard key={voice.id} voice={voice} />
                        ))}
                    </div>

                    <CarouselButton
                        direction="next"
                        label="Next community voices"
                        onClick={scrollNext}
                        className="absolute -right-3 top-[45%] z-20 md:-right-5"
                    />
                </div>
            </HomeContainer>
        </section>
    );
}
