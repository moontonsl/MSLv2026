import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { HomeContainer, SectionHeading } from "./HomeUI";

export default function FAQSection({ data }) {
    const [openIndex, setOpenIndex] = useState(0);

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

                <div className="mx-auto mt-10 flex max-w-[768px] flex-col gap-4 md:mt-16">
                    {data.items.map((item, index) => {
                        const open = openIndex === index;
                        const triggerId = `home-faq-trigger-${index}`;
                        const answerId = `home-faq-answer-${index}`;

                        return (
                            <article
                                key={item.question}
                                className={`overflow-hidden rounded-[10px] border bg-[#121212] ${
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
                                    <p className="font-sans text-[14px] font-normal leading-[22px] text-[#D1D5DB]">
                                        {item.answer}
                                    </p>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </HomeContainer>
        </section>
    );
}
