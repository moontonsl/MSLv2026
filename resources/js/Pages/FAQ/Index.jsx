import { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import { Search, X } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import HoverOutline from '@/Components/HoverOutline';
import { homeData } from '@/data/homeData';
import { FAQ_PAGE_CATEGORIES, faqPageCategoryOf } from '@/data/faqCategories';
import { HomeContainer } from '../Home/Components/HomeUI';
import { FaqAccordion } from '../Home/Components/FAQSection';

// Full FAQ page ("FAQ web" / "FAQ mobile" designs): title, search, category cards,
// then every FAQ in the same accordion as the Home FAQ section.
export default function FaqIndex({ faqs = [] }) {
    const allFaqs = faqs.length > 0 ? faqs : homeData.faq.items;
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState(null);

    const visibleFaqs = useMemo(() => {
        const needle = query.trim().toLowerCase();
        return allFaqs.filter((faq) => {
            const matchesCategory = !category || faqPageCategoryOf(faq.category) === category;
            const matchesQuery = !needle || `${faq.question} ${faq.answer}`.toLowerCase().includes(needle);
            return matchesCategory && matchesQuery;
        });
    }, [allFaqs, query, category]);

    const activeLabel = FAQ_PAGE_CATEGORIES.find((item) => item.id === category)?.label;

    return (
        <MainLayout fullWidth>
            <Head title="Frequently Asked Questions" />

            <section aria-labelledby="faq-page-title" className="bg-[#050505] pb-20 pt-10 font-sans text-white md:pb-28 md:pt-16">
                <HomeContainer>
                    <h1 id="faq-page-title" className="text-center font-heading text-[40px] font-bold leading-[1.1] text-white md:text-[64px]">
                        Frequently Asked Questions
                    </h1>

                    {/* Search */}
                    <label className="relative mx-auto mt-8 block max-w-[640px] md:mt-10">
                        <span className="sr-only">Search frequently asked questions</span>
                        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                        <input
                            type="search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search articles..."
                            className="w-full rounded-xl border border-white/20 bg-[#18181b] py-3 pl-11 pr-4 text-sm text-white placeholder:text-gray-500 focus:border-[#F2C21A] focus:outline-none focus:ring-0"
                        />
                    </label>

                    {/* Category cards: 2 per row on mobile, 4 on desktop */}
                    <ul className="mt-8 grid grid-cols-2 gap-4 md:mt-10 md:gap-7 lg:grid-cols-4" aria-label="FAQ categories">
                        {FAQ_PAGE_CATEGORIES.map(({ id, label, icon: Icon }) => {
                            const selected = category === id;
                            return (
                                <li key={id}>
                                    <button
                                        type="button"
                                        aria-pressed={selected}
                                        onClick={() => setCategory(selected ? null : id)}
                                        className={`relative flex h-full min-h-[150px] w-full flex-col items-center justify-center gap-4 rounded-2xl border bg-[#121212] px-3 py-6 text-center transition-colors hover:bg-[#161616] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C21A] ${
                                            selected ? 'border-[#F2C21A]/60' : 'border-white/10'
                                        }`}
                                    >
                                        <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#F2C21A]/20 text-[#F2C21A]">
                                            <Icon className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                        <span className="font-heading text-[15px] font-bold leading-snug text-white md:text-xl xl:text-[22px]">{label}</span>
                                        <HoverOutline color="#F2C21A" />
                                    </button>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Questions */}
                    <div className="mx-auto mt-12 max-w-[1062px] md:mt-14">
                        {category || query ? (
                            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-400">
                                <p role="status" aria-live="polite">
                                    {visibleFaqs.length} {visibleFaqs.length === 1 ? 'question' : 'questions'}
                                    {activeLabel ? <> in <span className="font-semibold text-[#F2C21A]">{activeLabel}</span></> : null}
                                    {query.trim() ? <> matching “{query.trim()}”</> : null}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => { setCategory(null); setQuery(''); }}
                                    className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                                >
                                    <X className="h-4 w-4" aria-hidden="true" />
                                    Clear filters
                                </button>
                            </div>
                        ) : null}

                        {visibleFaqs.length > 0 ? (
                            <FaqAccordion
                                key={`${category ?? 'all'}-${query}`}
                                items={visibleFaqs}
                                idPrefix="faq-page"
                            />
                        ) : (
                            <p className="rounded-[10px] border border-white/10 bg-[#121212] px-6 py-12 text-center text-sm text-gray-400">
                                No questions found. Try another keyword or category.
                            </p>
                        )}
                    </div>
                </HomeContainer>
            </section>
        </MainLayout>
    );
}
