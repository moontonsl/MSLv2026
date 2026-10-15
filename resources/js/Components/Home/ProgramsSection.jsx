import { Link } from "@inertiajs/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
    ButtonLink,
    CarouselButton,
    HomeContainer,
    SectionDescription,
    SectionHeading,
} from "./HomeUI";
import useCardScroller from "./hooks/useCardScroller";

const GRID_SPANS = [
    "lg:col-span-1",
    "lg:col-span-2",
    "lg:col-span-1",
    "lg:col-span-2",
    "md:col-span-2 lg:col-span-2",
];

export default function ProgramsSection({ data }) {
    const { scrollerRef, scrollPrevious, scrollNext } = useCardScroller();

    return (
        <section
            id="home-programs"
            aria-labelledby="home-programs-title"
            className="bg-[#050505] py-16 md:py-24"
        >
            <HomeContainer>
                <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:gap-8">
                    <div>
                        <SectionHeading id="home-programs-title">
                            {data.title}
                        </SectionHeading>

                        <SectionDescription>
                            {data.description}
                        </SectionDescription>
                    </div>

                    <ButtonLink
                        href={data.href}
                        variant="outline"
                        className="shrink-0"
                    >
                        {data.linkLabel}
                        <ArrowRight size={18} aria-hidden="true" />
                    </ButtonLink>
                </div>

                <div
                    ref={scrollerRef}
                    className="hide-scrollbar mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto py-2 md:mt-12 md:grid md:grid-cols-2 md:overflow-visible md:py-0 lg:grid-cols-4"
                >
                    {data.items.map((program, index) => (
                        <Link
                            key={program.id}
                            href={program.href}
                            className={`group relative block h-[320px] w-[85%] min-w-0 shrink-0 snap-start overflow-hidden rounded-2xl bg-[#181818] text-white hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C21A] md:h-[328px] md:w-auto ${
                                GRID_SPANS[index] || ""
                            }`}
                        >
                            <img
                                src={program.image}
                                alt=""
                                loading="lazy"
                                className="absolute inset-0 h-full w-full object-cover grayscale transition-[transform,filter] duration-500 group-hover:grayscale-0 motion-safe:group-hover:scale-[1.035] motion-reduce:transition-none"
                            />

                            <span className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />

                            <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4 xl:inset-x-8 xl:bottom-8">
                                <h3 className="max-w-[220px] font-heading text-[24px] font-extrabold leading-[24px] text-white">
                                    {program.title}
                                </h3>

                                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#F2C21A] text-[#514416]">
                                    <ArrowUpRight
                                        size={21}
                                        aria-hidden="true"
                                    />
                                </span>
                            </div>

                            <span className="sr-only">
                                {program.description}
                            </span>
                        </Link>
                    ))}
                </div>

                <div className="mt-4 flex justify-end gap-3 md:hidden">
                    <CarouselButton
                        direction="previous"
                        label="Previous program"
                        onClick={scrollPrevious}
                        className="h-11 w-11 text-[#F2C21A]"
                    />

                    <CarouselButton
                        direction="next"
                        label="Next program"
                        onClick={scrollNext}
                        className="h-11 w-11 text-[#F2C21A]"
                    />
                </div>
            </HomeContainer>
        </section>
    );
}
