import { Link } from "@inertiajs/react";
import { Calendar, Clock, Search, Tag, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { demoArticles, demoHighlights } from "@/data/articleData";

// Set to false to load articles and highlights from your database.
const USE_DEMO_DATA = true;

const FONTS = {
    heading: { fontFamily: "'Manrope', sans-serif" },
    body: { fontFamily: "'Inter', sans-serif" },
    newsletter: { fontFamily: "'Figtree', sans-serif" },
};

const CATEGORIES = [
    { value: "Esports", label: "Esports" },
    { value: "Community", label: "Community" },
    { value: "Events", label: "Events" },
    { value: "Game Update", label: "Game Updates" },
];

const FOCUS =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBBF24] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808]";

function formatDate(value) {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function normalizeHref(value) {
    return String(value || "").replace(/^\/news\//i, "/News/");
}

function getReadTime(content = "") {
    const text = String(content)
        .replace(/<[^>]*>/g, " ")
        .trim();

    if (!text) return "3 min read";

    const words = text.split(/\s+/).length;

    return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

function normalizeArticle(article) {
    const slug = article.canonical || `article-${article.id}`;

    return {
        id: article.id ?? slug,
        slug,
        title: String(article.title || "Untitled article"),
        excerpt: String(article.subtitle || ""),
        category:
            article.category === "Game Updates"
                ? "Game Update"
                : String(article.category || "News"),
        date: formatDate(article.date),
        author: String(article.author || "MSL Philippines"),
        image: article.image || "",
        href: `/News/${encodeURIComponent(slug)}`,
        readTime: getReadTime(article.content),
    };
}

async function fetchNews(url, signal) {
    const response = await fetch(url, {
        signal,
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Unable to load news (${response.status}).`);
    }

    const payload = await response.json();

    if (!Array.isArray(payload)) {
        throw new Error("The news API returned an unexpected response.");
    }

    return payload;
}

function NewsImage({ src, className = "", eager = false }) {
    if (!src) return null;

    return (
        <img
            src={src}
            alt=""
            loading={eager ? "eager" : "lazy"}
            className={className}
            onError={(event) => {
                event.currentTarget.style.display = "none";
            }}
        />
    );
}

function FeaturedArticle({ article }) {
    if (!article) return null;

    return (
        <Link
            href={article.href}
            className={`group relative flex min-h-[460px] w-full items-end overflow-hidden rounded-[20px] bg-[#151515] text-white hover:text-white md:min-h-[540px] lg:min-h-[600px] ${FOCUS}`}
        >
            <NewsImage
                src={article.image}
                eager
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.025]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />

            <div className="relative z-10 w-full p-6 sm:p-8 lg:p-12">
                <span
                    style={FONTS.body}
                    className="mb-3 inline-flex rounded-md bg-[#FBBF24] px-3 py-1 text-[14px] font-bold leading-[22px] text-black"
                >
                    FEATURED
                </span>

                <h2
                    style={FONTS.heading}
                    className="max-w-[900px] text-[30px] font-extrabold leading-[38px] text-white md:text-[48px] md:leading-[58px]"
                >
                    {article.title}
                </h2>

                {article.excerpt && (
                    <p
                        style={FONTS.body}
                        className="mt-2 max-w-[900px] text-[18px] font-normal leading-[28px] text-[#D1D5DB]"
                    >
                        {article.excerpt}
                    </p>
                )}

                <div
                    style={FONTS.body}
                    className="mt-3 flex flex-wrap gap-3 text-[14px] font-semibold leading-[22px] text-white"
                >
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

function NewsArticleCard({ article }) {
    return (
        <article className="group flex h-full min-h-[500px] overflow-hidden rounded-xl border border-[#424650] bg-[#111111] transition-colors hover:border-[#A88410]">
            <Link
                href={article.href}
                className={`flex w-full flex-col text-white no-underline hover:text-white ${FOCUS}`}
            >
                <div className="relative h-[230px] shrink-0 overflow-hidden bg-[#181818]">
                    <NewsImage
                        src={article.image}
                        className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                    <span
                        style={FONTS.body}
                        className="absolute left-4 top-4 inline-flex max-w-[calc(100%-2rem)] items-center gap-2 rounded border border-white/10 bg-black/75 px-3 py-1 text-[14px] font-semibold leading-[22px] text-white"
                    >
                        <Tag
                            aria-hidden="true"
                            className="h-3.5 w-3.5 shrink-0 text-[#FBBF24]"
                        />

                        <span className="truncate">{article.category}</span>
                    </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                    <div
                        style={FONTS.body}
                        className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] font-semibold leading-[22px] text-[#9CA3AF]"
                    >
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

                    <h3
                        style={FONTS.heading}
                        className="line-clamp-2 text-[24px] font-extrabold leading-[24px] text-white transition-colors group-hover:text-[#FBBF24]"
                    >
                        {article.title}
                    </h3>

                    <p
                        style={FONTS.body}
                        className="mt-2 line-clamp-3 text-[12px] font-normal leading-[18px] text-[#A6A6AE]"
                    >
                        {article.excerpt}
                    </p>

                    <span
                        style={FONTS.body}
                        className="mt-auto inline-block pt-8 text-[16px] font-bold leading-[24px] text-[#FBBF24]"
                    >
                        Read Article
                    </span>
                </div>
            </Link>
        </article>
    );
}

export default function NewsUpdatesFullPage() {
    const [articles, setArticles] = useState(USE_DEMO_DATA ? demoArticles : []);
    const [highlights, setHighlights] = useState(
        USE_DEMO_DATA ? demoHighlights : [],
    );
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(!USE_DEMO_DATA);
    const [loadError, setLoadError] = useState("");

    useEffect(() => {
        if (USE_DEMO_DATA) return;

        const controller = new AbortController();

        async function loadNews() {
            const [articleResult, highlightResult] = await Promise.allSettled([
                fetchNews("/api/news/articles", controller.signal),
                fetchNews("/api/news/highlights", controller.signal),
            ]);

            if (controller.signal.aborted) return;

            const loadedArticles =
                articleResult.status === "fulfilled"
                    ? articleResult.value.map(normalizeArticle)
                    : [];

            const loadedHighlights =
                highlightResult.status === "fulfilled"
                    ? highlightResult.value.map((highlight) => {
                          const href = normalizeHref(highlight.link);

                          const matchingArticle = loadedArticles.find(
                              (article) =>
                                  article.href === href ||
                                  article.title === highlight.title,
                          );

                          return {
                              ...matchingArticle,
                              id: highlight.id ?? href,
                              title:
                                  highlight.title ||
                                  matchingArticle?.title ||
                                  "Featured story",
                              excerpt: matchingArticle?.excerpt || "",
                              image:
                                  highlight.src || matchingArticle?.image || "",
                              href: href || matchingArticle?.href || "/News",
                              date: formatDate(highlight.date),
                              author:
                                  highlight.author ||
                                  matchingArticle?.author ||
                                  "MSL Philippines",
                          };
                      })
                    : [];

            setArticles(loadedArticles);
            setHighlights(loadedHighlights);
            setLoadError(
                articleResult.status === "rejected"
                    ? "We could not load the articles. Please refresh to try again."
                    : "",
            );
            setIsLoading(false);
        }

        loadNews();

        return () => controller.abort();
    }, []);

    const filterOptions = useMemo(() => {
        const additionalCategories = [
            ...new Set(
                articles
                    .map((article) => article.category)
                    .filter((category) => category !== "Highlight"),
            ),
        ].filter(
            (category) =>
                !CATEGORIES.some((option) => option.value === category),
        );

        return [
            { value: "All", label: "All" },
            ...CATEGORIES,
            ...additionalCategories.map((category) => ({
                value: category,
                label: category,
            })),
        ];
    }, [articles]);

    const filteredArticles = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return articles.filter((article) => {
            const matchesCategory =
                activeFilter === "All" || article.category === activeFilter;

            const matchesSearch =
                !query ||
                [
                    article.title,
                    article.excerpt,
                    article.category,
                    article.author,
                ].some((value) =>
                    String(value || "")
                        .toLowerCase()
                        .includes(query),
                );

            return matchesCategory && matchesSearch;
        });
    }, [activeFilter, articles, searchQuery]);

    const mobileGroups = useMemo(() => {
        const grouped = new Map();

        filteredArticles.forEach((article) => {
            if (!grouped.has(article.category)) {
                grouped.set(article.category, []);
            }

            grouped.get(article.category).push(article);
        });

        const categoryOrder = [
            ...filterOptions
                .filter((option) => option.value !== "All")
                .map((option) => option.value),
            ...[...grouped.keys()].filter(
                (category) =>
                    !filterOptions.some((option) => option.value === category),
            ),
        ];

        return categoryOrder
            .filter((category) => grouped.has(category))
            .map((category) => ({
                value: category,
                label:
                    filterOptions.find((option) => option.value === category)
                        ?.label || category,
                articles: grouped.get(category),
            }));
    }, [filterOptions, filteredArticles]);

    const featuredSlides = highlights.length
        ? highlights
        : articles.slice(0, 1);

    return (
        <div
            style={{
                ...FONTS.body,
                backgroundImage:
                    "radial-gradient(ellipse 65% 30% at 50% 4%, rgba(251,191,36,0.055), transparent)",
            }}
            className="w-full bg-[#080808] text-white"
        >
            <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-[76px]">
                <header className="border-b border-[#292929] pb-16 pt-16 text-center lg:pb-20 lg:pt-24">
                    <h1
                        style={FONTS.heading}
                        className="text-[40px] font-extrabold leading-[48px] text-[#FAFAF5] md:text-[60px] md:leading-[72px]"
                    >
                        News <span className="text-[#FBBF24]">&amp;</span>{" "}
                        Updates
                    </h1>

                    <p className="mx-auto mt-3 max-w-[640px] text-[18px] font-normal leading-[28px] text-[#D2D2CC]">
                        Stay ahead of the meta. The latest stories, tournament
                        results, and community highlights from MSL Philippines.
                    </p>
                </header>

                {isLoading ? (
                    <p
                        role="status"
                        className="py-24 text-center text-[18px] leading-[28px] text-gray-400"
                    >
                        Loading news…
                    </p>
                ) : (
                    <>
                        {featuredSlides.length > 0 && (
                            <section
                                aria-label="Featured news"
                                className="mt-12 lg:mt-20"
                            >
                                <div className="hidden md:block">
                                    <FeaturedArticle
                                        article={featuredSlides[0]}
                                    />
                                </div>

                                <div className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto md:hidden">
                                    {featuredSlides.map((article) => (
                                        <div
                                            key={article.id}
                                            className="w-full shrink-0 snap-center"
                                        >
                                            <FeaturedArticle
                                                article={article}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {featuredSlides.length > 1 && (
                                    <p className="mt-3 text-center text-[12px] leading-[18px] text-gray-400 md:hidden">
                                        Swipe to explore featured stories
                                    </p>
                                )}
                            </section>
                        )}

                        <section
                            aria-label="Browse news articles"
                            className={
                                featuredSlides.length
                                    ? "mt-24 lg:mt-48"
                                    : "mt-12"
                            }
                        >
                            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                                <div
                                    aria-label="Article categories"
                                    className="hide-scrollbar flex gap-4 overflow-x-auto pb-1"
                                >
                                    {filterOptions.map(({ value, label }) => {
                                        const selected = activeFilter === value;

                                        return (
                                            <button
                                                key={value}
                                                type="button"
                                                aria-pressed={selected}
                                                onClick={() =>
                                                    setActiveFilter(value)
                                                }
                                                className={`inline-flex min-h-[52px] shrink-0 items-center justify-center rounded-xl border px-4 text-[18px] font-semibold leading-[28px] transition-colors ${FOCUS} ${
                                                    selected
                                                        ? "border-[#EAB308] bg-[#EAB308] text-black"
                                                        : "border-[#454952] bg-[#141414] text-[#9CA3AF] hover:border-gray-400 hover:text-white"
                                                }`}
                                            >
                                                {label}
                                            </button>
                                        );
                                    })}
                                </div>

                                <label className="relative block w-full shrink-0 xl:w-[350px]">
                                    <span className="sr-only">
                                        Search articles
                                    </span>

                                    <Search
                                        aria-hidden="true"
                                        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
                                    />

                                    <input
                                        type="search"
                                        value={searchQuery}
                                        onChange={(event) =>
                                            setSearchQuery(event.target.value)
                                        }
                                        placeholder="Search articles..."
                                        className="h-[52px] w-full rounded-xl border border-[#7A7A7A] bg-[#141414] pl-11 pr-4 text-[18px] font-normal leading-[28px] text-white placeholder:text-gray-500 focus:border-[#FBBF24] focus:outline-none focus:ring-1 focus:ring-[#FBBF24]"
                                    />
                                </label>
                            </div>

                            {loadError ? (
                                <p
                                    role="alert"
                                    className="py-16 text-center text-[18px] leading-[28px] text-gray-300"
                                >
                                    {loadError}
                                </p>
                            ) : filteredArticles.length === 0 ? (
                                <p
                                    role="status"
                                    className="py-16 text-center text-[18px] leading-[28px] text-gray-400"
                                >
                                    {articles.length
                                        ? "No articles match your search or category."
                                        : "No articles have been published yet."}
                                </p>
                            ) : (
                                <>
                                    <div className="mt-12 hidden gap-10 md:grid md:grid-cols-2 lg:mt-20 lg:grid-cols-3">
                                        {filteredArticles.map((article) => (
                                            <NewsArticleCard
                                                key={article.id}
                                                article={article}
                                            />
                                        ))}
                                    </div>

                                    <div className="mt-10 space-y-10 md:hidden">
                                        {mobileGroups.map((group) => (
                                            <section key={group.value}>
                                                <h2
                                                    style={FONTS.heading}
                                                    className="mb-4 text-[24px] font-extrabold leading-[24px] text-[#FBBF24]"
                                                >
                                                    {group.label}
                                                </h2>

                                                <div className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
                                                    {group.articles.map(
                                                        (article) => (
                                                            <div
                                                                key={article.id}
                                                                className="w-[85%] max-w-[400px] shrink-0 snap-start"
                                                            >
                                                                <NewsArticleCard
                                                                    article={
                                                                        article
                                                                    }
                                                                />
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </section>
                                        ))}
                                    </div>
                                </>
                            )}
                        </section>
                    </>
                )}

                <section
                    aria-labelledby="news-subscribe-heading"
                    className="pb-20 pt-24 lg:pb-32 lg:pt-44"
                >
                    <div
                        style={{
                            background:
                                "linear-gradient(115deg, #121020 0%, #151020 55%, #251821 100%)",
                        }}
                        className="rounded-xl border border-[#3B3445] px-6 py-12 text-center md:px-12 md:py-16"
                    >
                        <h2
                            id="news-subscribe-heading"
                            style={FONTS.heading}
                            className="text-[32px] font-extrabold leading-[40px] text-white md:text-[48px] md:leading-[58px]"
                        >
                            Never Miss an Update
                        </h2>

                        <p
                            style={FONTS.newsletter}
                            className="mx-auto mt-3 max-w-[820px] text-[20px] font-normal leading-[32px] text-[#C1BEC8]"
                        >
                            Subscribe to our{" "}
                            <strong style={FONTS.body} className="font-bold">
                                monthly digest
                            </strong>{" "}
                            for the latest tournament announcements, community
                            spotlights, and game updates directly to your inbox.
                        </p>

                        <form
                            onSubmit={(event) => event.preventDefault()}
                            className="mx-auto mt-12 flex max-w-[540px] flex-col gap-5 sm:flex-row"
                        >
                            <label className="min-w-0 flex-1">
                                <span className="sr-only">Email address</span>

                                <input
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    required
                                    placeholder="Enter your email address"
                                    className="h-[52px] w-full rounded-xl border border-[#393240] bg-[#100D19] px-4 text-[16px] font-normal leading-[24px] text-white placeholder:text-gray-500 focus:border-[#FBBF24] focus:outline-none focus:ring-1 focus:ring-[#FBBF24]"
                                />
                            </label>

                            <button
                                type="submit"
                                className={`inline-flex min-h-[52px] shrink-0 items-center justify-center rounded-xl bg-[#FBBF24] px-5 text-[16px] font-semibold leading-[24px] text-black transition-colors hover:bg-[#FCD34D] ${FOCUS}`}
                            >
                                Subscribe
                            </button>
                        </form>

                        <p className="mx-auto mt-12 max-w-[960px] text-[12px] font-normal leading-[18px] text-[#9B97A4]">
                            By subscribing, you consent to our collection of
                            your email for newsletter purposes in compliance
                            with the Data Privacy Act of 2012. Unsubscribe at
                            any time.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
