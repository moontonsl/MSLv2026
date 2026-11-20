import { ArrowRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import { ButtonLink, HomeContainer, SectionHeading } from "./HomeUI";
import HoverOutline from "@/Components/HoverOutline";
import { PUBLIC_ROUTES } from "@/data/siteNavigation";

/**
 * FAQ accordion list. Shared by the Home FAQ section and the full FAQ page,
 * so both use exactly the same question / answer UI.
 */
export function FaqAccordion({ items, idPrefix = "faq", defaultOpenIndex = 0, className = "" }) {
    const [openIndex, setOpenIndex] = useState(defaultOpenIndex);

    return (
        <div className={`flex flex-col gap-4 ${className}`}>
            {items.map((item, index) => {
                const open = openIndex === index;
                const triggerId = `${idPrefix}-trigger-${index}`;
                const answerId = `${idPrefix}-answer-${index}`;

                return (
                    <article
                        key={item.id ?? item.question}
                        className={`relative overflow-hidden rounded-[10px] border bg-[#121212] ${
                            open
                                ? "border-[#F2C21A]/30"
                                : "border-white/10"
                        }`}
                    >
                        <h3 className="font-sans">
                            <button
                                id={triggerId}
                                type="button"
                                aria-expanded={open}
                                aria-controls={answerId}
                                onClick={() =>
                                    setOpenIndex(open ? null : index)
                                }
                                className={`flex min-h-[56px] w-full items-center justify-between gap-6 px-4 py-4 text-left font-sans text-[14px] font-semibold leading-[22px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#F2C21A] md:px-6 ${
                                    open
                                        ? "text-[#F2C21A]"
                                        : "text-[#D1D5DB]"
                                }`}
                            >
                                <span>{item.question}</span>

                                <ChevronDown
                                    size={18}
                                    aria-hidden="true"
                                    className={`shrink-0 transition-transform motion-reduce:transition-none ${
                                        open ? "rotate-180" : ""
                                    }`}
                                />
                            </button>
                        </h3>

                        <div
                            id={answerId}
                            role="region"
                            aria-labelledby={triggerId}
                            hidden={!open}
                            className="border-t border-white/[0.08] px-4 py-4 md:px-6"
                        >
                            <p className="whitespace-pre-line font-sans text-[14px] font-normal leading-[22px] text-[#D1D5DB]">
                                {item.answer}
                            </p>
                        </div>
                        <HoverOutline color="#F2C21A" />
                    </article>
                );
            })}
        </div>
    );
}

export default function FAQSection({ data }) {
    return (
        <section
            aria-labelledby="home-faq-title"
            className="bg-[#050505] py-16 md:py-24"
        >
            <HomeContainer>
                <div className="mx-auto max-w-[768px] text-center">
                    <SectionHeading id="home-faq-title">
                        {data.title}
                    </SectionHeading>

                    <p className="mt-4 font-sans text-[16px] font-normal leading-[26px] text-[#D1D5DB]">
                        {data.description}
                    </p>
                </div>

                <FaqAccordion
                    items={data.items}
                    idPrefix="home-faq"
                    className="mx-auto mt-10 max-w-[768px] md:mt-16"
                />

                <div className="mt-10 flex justify-center md:mt-12">
                    <ButtonLink href={PUBLIC_ROUTES.faq} variant="outline" className="w-full sm:w-auto sm:min-w-[220px]">
                        View All FAQs
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </ButtonLink>
                </div>
            </HomeContainer>
        </section>
    );
}
