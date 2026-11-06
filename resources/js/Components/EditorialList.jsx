import { FileText, Newspaper, PenLine } from 'lucide-react';
import { useState } from 'react';
import Pagination from './Admin/AdminPagination';
import styles from '@/Pages/ContentMedia.module.css';

const PAGE_SIZE = 2;
const FILTERS = [
    { value: 'ALL', label: 'All' },
    { value: 'NEWS / ARTICLE', label: 'News / Articles' },
    { value: 'BLOG', label: 'Blogs' },
];

export default function EditorialList({ items }) {
    const [category, setCategory] = useState('ALL');
    const [page, setPage] = useState(1);
    const filteredItems = category === 'ALL' ? items : items.filter((item) => item.category === category);
    const pageCount = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
    const currentPage = Math.min(page, pageCount);
    const start = (currentPage - 1) * PAGE_SIZE;
    const visibleItems = filteredItems.slice(start, start + PAGE_SIZE);

    return (
        <section aria-labelledby="editorial-heading" className="min-w-0">
            <div className="mb-8 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/15 lg:h-14 lg:w-14">
                    <Newspaper className="h-5 w-5 text-orange-400 lg:h-7 lg:w-7" aria-hidden="true" />
                </div>
                <h3 id="editorial-heading" className={`text-white ${styles.subsectionTitle}`}>Editorial &amp; Blogs</h3>
            </div>

            <div role="group" aria-label="Filter editorial posts" className="mb-4 flex flex-wrap gap-2">
                {FILTERS.map((filter) => {
                    const count = filter.value === 'ALL' ? items.length : items.filter((item) => item.category === filter.value).length;
                    return (
                        <button
                            key={filter.value}
                            type="button"
                            aria-pressed={category === filter.value}
                            onClick={() => { setCategory(filter.value); setPage(1); }}
                            className={`min-h-11 rounded-lg border px-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 motion-reduce:transition-none ${category === filter.value ? 'border-orange-400/60 bg-orange-500/10 text-orange-300' : 'border-neutral-800 text-gray-400 hover:border-neutral-600 hover:text-white'}`}
                        >
                            {filter.label} <span className="ml-1 text-xs">{count}</span>
                        </button>
                    );
                })}
            </div>

            <div id="editorial-results" className="grid h-[27rem] grid-rows-2 gap-4">
                {visibleItems.map((item) => {
                    const Icon = item.category === 'BLOG' ? PenLine : FileText;
                    return (
                        <article key={item.id} className="min-h-0">
                            <a
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${styles.interactiveCard} flex h-full gap-3 rounded-2xl border border-neutral-800 bg-[#111111] p-4 text-orange-400 hover:text-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 sm:gap-4 sm:p-5`}
                            >
                                <div className={`${styles.interactiveCardIcon} flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-gray-400`}>
                                    <Icon className="h-5 w-5" aria-hidden="true" />
                                </div>
                                <div className="flex min-w-0 flex-1 flex-col">
                                    <p className="font-inter text-[10px] font-bold uppercase leading-4 tracking-wide text-orange-400 lg:text-xs lg:leading-[18px]">{item.category}</p>
                                    <h4 title={item.title} className="mt-2 line-clamp-3 font-inter text-sm font-semibold leading-[22px] text-white lg:text-base lg:leading-[26px]">{item.title}</h4>
                                    <p className="mt-2 line-clamp-2 text-xs leading-[1.6] text-gray-400 lg:text-sm">{item.excerpt}</p>
                                    <p className="mt-auto pt-3 font-inter text-xs leading-[18px] text-gray-400 lg:text-sm lg:leading-[22px]">By {item.writer} <span aria-hidden="true">·</span> {item.topic}</p>
                                    <span className="sr-only">Read on Facebook (opens in a new tab).</span>
                                </div>
                            </a>
                        </article>
                    );
                })}
                {visibleItems.length === 0 && <p className="py-6 text-sm text-gray-400">No posts in this category yet.</p>}
            </div>

            <p role="status" aria-live="polite" aria-atomic="true" className="mt-5 min-h-8 text-xs text-gray-400">
                {filteredItems.length > 0 ? `Showing ${start + 1}–${start + visibleItems.length} of ${filteredItems.length} posts · Page ${currentPage} of ${pageCount}` : '0 posts'}
            </p>
            {pageCount > 1 && (
                <div className="mt-3 overflow-x-auto">
                    <div className="min-w-max">
                        <Pagination currentPage={currentPage} pageCount={pageCount} onChange={setPage} ariaLabel="Editorial pagination" />
                    </div>
                </div>
            )}
        </section>
    );
}
