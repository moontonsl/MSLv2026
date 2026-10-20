import { Link } from "@inertiajs/react";
import { Calendar, User } from "lucide-react";
import NewsImage from "./NewsImage";

function FeaturedArticle({ article, eager = false }) {
    return (
        <Link
            href={article.href}
            className="group relative flex min-h-[460px] w-full items-end overflow-hidden rounded-[20px] bg-[#151515] text-white hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBBF24] md:min-h-[540px] lg:min-h-[600px]"
        >
            <NewsImage
                src={article.image}
                eager={eager}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.025] motion-reduce:transition-none"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />

            <div className="relative z-10 w-full p-6 sm:p-8 lg:p-12">
                <span className="mb-3 inline-flex rounded-md bg-[#FBBF24] px-3 py-1 text-[14px] font-bold leading-[22px] text-black">
                    FEATURED
                </span>

                <h2 className="max-w-[900px] font-heading text-[30px] font-extrabold leading-[38px] text-white md:text-[48px] md:leading-[58px]">
                    {article.title}
                </h2>

                {article.excerpt && (
                    <p className="mt-2 max-w-[900px] text-[18px] font-normal leading-[28px] text-[#D1D5DB]">
                        {article.excerpt}
                    </p>
                )}

                <div className="mt-3 flex flex-wrap gap-3 text-[14px] font-semibold leading-[22px] text-white">
                    {article.date && (
                        <span className="inline-flex items-center gap-2 rounded bg-black/70 px-3 py-1.5">
                            <Calendar
                                aria-hidden="true"
                                className="h-4 w-4 text-[#FBBF24]"
                            />
                            {article.date}
                        </span>
                    )}

                    <span className="inline-flex items-center gap-2 rounded bg-black/70 px-3 py-1.5">
                        <User
                            aria-hidden="true"
                            className="h-4 w-4 text-[#FBBF24]"
                        />
                        {article.author}
                    </span>
                </div>
            </div>
        </Link>
    );
}

export default function FeaturedNews({ articles }) {
    if (!articles.length) return null;

    return (
        <section aria-label="Featured news" className="mt-12 lg:mt-20">
            <div className="hidden md:block">
                <FeaturedArticle article={articles[0]} eager />
            </div>

            <div className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto md:hidden">
                {articles.map((article, index) => (
                    <div
                        key={article.id}
                        className="w-full shrink-0 snap-center"
                    >
                        <FeaturedArticle
                            article={article}
                            eager={index === 0}
                        />
                    </div>
                ))}
            </div>

            {articles.length > 1 && (
                <p className="mt-3 text-center text-[12px] leading-[18px] text-gray-400 md:hidden">
                    Swipe to explore featured stories
                </p>
            )}
        </section>
    );
}
