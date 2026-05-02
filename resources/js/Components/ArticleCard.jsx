import { Link } from '@inertiajs/react';
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react';

const ACCENT = '#FBBF24';

/**
 * @param {{
 *   article: {
 *     slug: string;
 *     category: string;
 *     date: string;
 *     readTime: string;
 *     title: string;
 *     excerpt: string;
 *     heroImage: string;
 *   };
 *   articleClassName?: string;
 * }} props
 */
export default function ArticleCard({ article, articleClassName = '' }) {
    return (
        <article
            className={`group flex h-full w-full flex-col overflow-hidden rounded-lg border border-neutral-800 bg-[#111111] transition-all hover:-translate-y-1 hover:shadow-2xl md:rounded-2xl ${articleClassName}`}
        >
            <Link
                href={`/news/${article.slug}`}
                className="flex min-h-0 flex-1 flex-col text-white no-underline visited:text-white hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FBBF24] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]"
            >
                <div className="relative h-24 w-full shrink-0 overflow-hidden sm:h-32 md:h-56">
                    <img
                        src={article.heroImage}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                    <div className="absolute left-1.5 top-1.5 inline-flex max-w-[calc(100%-0.75rem)] items-center gap-1 rounded-full border border-white/10 bg-black/70 px-2 py-0.5 font-sans text-[9px] font-medium backdrop-blur-sm sm:left-3 sm:top-3 sm:gap-1.5 sm:px-3 sm:py-1 sm:text-xs md:text-xs">
                        <Tag className="h-2.5 w-2.5 shrink-0 sm:h-3 sm:w-3" style={{ color: ACCENT }} />
                        <span className="truncate" style={{ color: ACCENT }}>
                            {article.category}
                        </span>
                    </div>
                </div>

                <div className="flex flex-1 flex-col p-4 pb-8 md:p-6 md:pb-6">
                    <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-sans font-normal text-gray-400 md:mb-3 md:gap-x-3">
                        <span className="inline-flex items-center gap-1 text-[9px] sm:text-xs md:text-sm">
                            <Calendar className="h-2.5 w-2.5 shrink-0 text-gray-400 sm:h-3.5 sm:w-3.5" />
                            {article.date}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[9px] sm:text-xs md:text-sm">
                            <Clock className="h-2.5 w-2.5 shrink-0 text-gray-400 sm:h-3.5 sm:w-3.5" />
                            {article.readTime}
                        </span>
                    </div>

                    <h3 className="mb-1 line-clamp-2 font-heading text-xs font-bold text-white sm:text-sm md:mb-3 md:text-xl">
                        {article.title}
                    </h3>

                    <p className="mb-2 line-clamp-2 text-[10px] leading-relaxed text-gray-400 sm:text-xs md:mb-6 md:line-clamp-3 md:text-sm">
                        {article.excerpt}
                    </p>

                    <div className="mt-auto flex items-center gap-1 pt-1 text-[10px] font-bold text-[#FBBF24] sm:text-xs md:pt-2 md:text-sm">
                        Read Article
                        <ArrowRight className="h-2.5 w-2.5 shrink-0 transition-transform group-hover:translate-x-0.5 sm:h-3 sm:w-3 md:h-4 md:w-4" />
                    </div>
                </div>
            </Link>
        </article>
    );
}
