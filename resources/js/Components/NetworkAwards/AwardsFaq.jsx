import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

/**
 * Network Awards FAQ accordion (Figma / home FAQ pattern).
 *
 * @param {{
 *   items: Array<{ question: string; answer: string }>;
 * }} props
 */
export default function AwardsFaq({ items }) {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <div className="mx-auto flex w-full max-w-[768px] flex-col gap-4">
            {items.map((item, index) => {
                const open = openIndex === index;
                const triggerId = `awards-faq-trigger-${index}`;
                const answerId = `awards-faq-answer-${index}`;

                return (
                    <article
                        key={item.question}
                        className={`overflow-hidden rounded-[10px] border bg-[#121212] ${
                            open ? 'border-[#F2C21A]/30' : 'border-white/10'
                        }`}
                    >
                        <h3 className="font-sans">
                            <button
                                id={triggerId}
                                type="button"
                                aria-expanded={open}
                                aria-controls={answerId}
                                onClick={() => setOpenIndex(open ? null : index)}
                                className={`flex min-h-[56px] w-full items-center justify-between gap-6 px-4 py-4 text-left font-sans text-[14px] font-semibold leading-[22px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#F2C21A] md:px-6 ${
                                    open ? 'text-[#F2C21A]' : 'text-[#D1D5DB]'
                                }`}
                            >
                                <span>{item.question}</span>
                                        <ChevronDown
                                            size={18}
                                            aria-hidden="true"
                                            className={`shrink-0 text-[#FBBF24] transition-transform motion-reduce:transition-none ${
                                                open ? 'rotate-180' : ''
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
    );
}
