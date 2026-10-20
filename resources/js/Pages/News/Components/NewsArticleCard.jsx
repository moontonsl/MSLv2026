import { Link } from "@inertiajs/react";
import { Calendar, Clock, Tag } from "lucide-react";
import NewsImage from "./NewsImage";

export default function NewsArticleCard({ article }) {
    return (
        <article className="group flex h-full min-h-[500px] overflow-hidden rounded-xl border border-[#424650] bg-[#111111] transition-colors hover:border-[#A88410]">
            <Link
                href={article.href}
                className="flex w-full flex-col text-white no-underline hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FBBF24]"
            >
                <div className="relative h-[230px] shrink-0 overflow-hidden bg-[#181818]">
                    <NewsImage
                        src={article.image}
                        className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03] motion-reduce:transition-none"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                    <span className="absolute left-4 top-4 inline-flex max-w-[calc(100%-2rem)] items-center gap-2 rounded border border-white/10 bg-black/75 px-3 py-1 text-[14px] font-semibold leading-[22px] text-white">
                        <Tag
                            aria-hidden="true"
                            className="h-3.5 w-3.5 shrink-0 text-[#FBBF24]"
                        />

                        <span className="truncate">{article.category}</span>
                    </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                    <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] font-semibold leading-[22px] text-[#9CA3AF]">
                        {article.date && (
                            <span className="inline-flex items-center gap-1.5">
                                <Calendar
                                    aria-hidden="true"
                                    className="h-3.5 w-3.5 shrink-0"
                                />
                                {article.date}
                            </span>
                        )}

                        <span className="inline-flex items-center gap-1.5">
                            <Clock
                                aria-hidden="true"
                                className="h-3.5 w-3.5 shrink-0"
                            />
                            {article.readTime}
                        </span>
                    </div>

                    <h3 className="line-clamp-2 font-heading text-[24px] font-extrabold leading-[24px] text-white transition-colors group-hover:text-[#FBBF24]">
                        {article.title}
                    </h3>

                    <p className="mt-2 line-clamp-3 text-[12px] font-normal leading-[18px] text-[#A6A6AE]">
                        {article.excerpt}
                    </p>

                    <span className="mt-auto inline-block pt-8 text-[16px] font-bold leading-[24px] text-[#FBBF24]">
                        Read Article
                    </span>
                </div>
            </Link>
        </article>
    );
}
