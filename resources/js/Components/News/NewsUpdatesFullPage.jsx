import ArticleCard from '@/Components/ArticleCard';
import { buildFeaturedSlides, newsArticles } from '@/data/newsData';
import { Link } from '@inertiajs/react';
import { Clock, Search, User } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

const ACCENT = '#FBBF24';

const FILTER_OPTIONS = ['All', 'Esports', 'Community', 'Events', 'Game Update', 'Reports'];

/** Display labels for mobile section headers (matches article `category` values). */
const MOBILE_CATEGORY_ORDER = [
    { label: 'Esports', match: 'Esports' },
    { label: 'Community', match: 'Community' },
    { label: 'Events', match: 'Events' },
    { label: 'Game Updates', match: 'Game Update' },
    { label: 'Reports', match: 'Reports' },
];

function useCarouselActiveIndex(ref, itemCount, depsKey) {
    const [active, setActive] = useState(0);

    useEffect(() => {
        const el = ref.current;
        if (!el || itemCount <= 1) {
            setActive(0);
            return;
        }

        const onScroll = () => {
            const children = Array.from(el.children);
            if (!children.length) return;
            const center = el.scrollLeft + el.clientWidth / 2;
            let best = 0;
            let bestDist = Infinity;
            children.forEach((child, idx) => {
                const c = child.offsetLeft + child.offsetWidth / 2;
                const d = Math.abs(c - center);
                if (d < bestDist) {
                    bestDist = d;
                    best = idx;
                }
            });
            setActive(best);
        };

        onScroll();
        el.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            el.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, [ref, itemCount, depsKey]);

    return active;
}

function FeaturedSlideCard({ slide, reserveDotsSpace = false }) {
    return (
        <Link
            href={slide.href}
            className="group relative block min-h-[280px] w-full shrink-0 snap-center overflow-hidden rounded-2xl border border-neutral-700 bg-black sm:min-h-[300px] md:min-h-[380px] lg:rounded-3xl"
        >
            <img
                src={slide.imageSrc}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />

            <div
                className={`absolute bottom-0 left-0 flex max-w-full flex-col items-start p-5 sm:p-6 md:max-w-[85%] md:p-10 lg:max-w-3xl ${reserveDotsSpace ? 'pb-12' : 'pb-8 md:pb-10'}`}
            >
                <span
                    className="mb-3 font-sans text-xs font-bold uppercase tracking-wider md:mb-4"
                    style={{ color: ACCENT }}
                >
                    FEATURED
                </span>
                <h2 className="font-sans text-xl font-black leading-tight tracking-tight text-white sm:text-2xl md:text-3xl lg:text-4xl">
                    {slide.title}
                </h2>
                <p className="mt-2 font-sans text-xs leading-relaxed text-white sm:text-sm md:mt-3 md:text-base">
                    {slide.excerpt}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3 font-sans text-xs text-white sm:text-sm md:mt-6 md:gap-4">
                    <span className="inline-flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" style={{ color: ACCENT }} />
                        {slide.date}
                    </span>
                    <span className="inline-flex items-center gap-2">
                        <User className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" style={{ color: ACCENT }} />
                        {slide.author}
                    </span>
                </div>
            </div>
        </Link>
    );
}

export default function NewsUpdatesFullPage() {
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const FEATURED_SLIDES = useMemo(() => buildFeaturedSlides(), []);

    const featuredScrollerRef = useRef(null);
    const featuredActive = useCarouselActiveIndex(
        featuredScrollerRef,
        FEATURED_SLIDES.length,
        FEATURED_SLIDES.length,
    );

    const filteredArticles = useMemo(() => {
        let list = newsArticles;
        if (activeFilter !== 'All') {
            list = list.filter((a) => a.category === activeFilter);
        }
        const q = searchQuery.trim().toLowerCase();
        if (q) {
            list = list.filter(
                (a) =>
                    a.title.toLowerCase().includes(q) ||
                    a.excerpt.toLowerCase().includes(q) ||
                    a.category.toLowerCase().includes(q),
            );
        }
        return list;
    }, [activeFilter, searchQuery]);

    const mobileGrouped = useMemo(() => {
        const map = new Map();
        filteredArticles.forEach((a) => {
            if (!map.has(a.category)) map.set(a.category, []);
            map.get(a.category).push(a);
        });
        return MOBILE_CATEGORY_ORDER.filter(({ match }) => map.has(match)).map(({ label, match }) => ({
            label,
            articles: map.get(match),
        }));
    }, [filteredArticles]);

    const featuredDesktop = FEATURED_SLIDES[0];

    return (
        <div className="w-full bg-[#0A0A0A] font-sans text-white">
            {/* Page header */}
            <section className="w-full px-4 pb-4 pt-14 md:px-8 md:pb-10 md:pt-20">
                <div className="mx-auto flex max-w-6xl flex-col items-center px-1 text-center sm:px-0">
                    <h1 className="font-sans text-3xl font-black tracking-tighter text-white sm:text-4xl md:text-5xl lg:text-6xl">
                        News{' '}
                        <span style={{ color: ACCENT }}>& Updates</span>
                    </h1>
                    <p className="mt-4 max-w-2xl px-1 text-sm leading-relaxed text-gray-400 md:mt-5 md:text-base">
                        Stay ahead of the meta. The latest stories, tournament results, and community
                        highlights from MSL Philippines.
                    </p>
                    <hr className="my-8 w-full max-w-6xl border-neutral-800" />
                </div>
            </section>

            {/* Featured article — mobile carousel */}
            <section className="w-full px-4 md:hidden">
                <div className="relative mx-auto max-w-6xl">
                    <div
                        ref={featuredScrollerRef}
                        className="hide-scrollbar flex w-full snap-x snap-mandatory overflow-x-auto [-webkit-overflow-scrolling:touch]"
                    >
                        {FEATURED_SLIDES.map((slide) => (
                            <div
                                key={slide.href}
                                className="w-full shrink-0 snap-center basis-full flex-[0_0_100%]"
                            >
                                <FeaturedSlideCard slide={slide} reserveDotsSpace />
                            </div>
                        ))}
                    </div>
                    <div className="pointer-events-none absolute bottom-3 left-0 z-10 flex w-full justify-center md:bottom-4">
                        <div className="flex items-center justify-center gap-2 pointer-events-none">
                            {FEATURED_SLIDES.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 rounded-full ${
                                        i === featuredActive ? 'w-8 bg-[#FBBF24]' : 'w-4 bg-neutral-600'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured article — desktop single */}
            <section className="hidden w-full px-4 md:block md:px-8">
                <div className="mx-auto max-w-6xl">
                    <FeaturedSlideCard slide={featuredDesktop} />
                </div>
            </section>

            {/* Filters + search */}
            <section className="w-full px-4 pt-10 md:px-8 md:pt-16">
                <div className="mx-auto flex max-w-6xl flex-col md:flex-row md:items-center md:justify-between md:gap-6">
                    <div className="hide-scrollbar flex w-full gap-3 overflow-x-auto whitespace-nowrap pb-2 md:flex-wrap md:overflow-visible md:whitespace-normal">
                        {FILTER_OPTIONS.map((label) => {
                            const active = activeFilter === label;
                            return (
                                <button
                                    key={label}
                                    type="button"
                                    onClick={() => setActiveFilter(label)}
                                    className={
                                        active
                                            ? 'inline-flex shrink-0 rounded-lg px-4 py-2 font-sans text-sm font-semibold text-black transition-colors'
                                            : 'inline-flex shrink-0 rounded-lg border border-neutral-600 bg-black px-4 py-2 font-sans text-sm font-medium text-gray-400 transition-colors hover:border-neutral-500 hover:text-white'
                                    }
                                    style={
                                        active
                                            ? { backgroundColor: ACCENT }
                                            : undefined
                                    }
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="relative mt-4 w-full md:mt-0 md:w-72 md:shrink-0">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search articles..."
                            className="w-full rounded-lg border border-neutral-600 bg-black py-2.5 pl-10 pr-4 font-sans text-sm text-white placeholder:text-gray-500 focus:border-neutral-500 focus:outline-none"
                        />
                    </div>
                </div>
            </section>

            {/* Article grid — desktop */}
            <section className="hidden w-full px-4 py-12 md:block md:px-8 md:py-16">
                <div className="mx-auto max-w-6xl">
                    {filteredArticles.length === 0 ? (
                        <p className="py-12 text-center text-sm text-gray-500">
                            No articles match your filters.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                            {filteredArticles.map((article) => (
                                <ArticleCard key={article.slug} article={article} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Mobile: grouped category carousels */}
            <section className="w-full px-4 py-10 md:hidden md:py-0">
                <div className="mx-auto max-w-6xl">
                    {filteredArticles.length === 0 ? (
                        <p className="py-8 text-center text-sm text-gray-500">
                            No articles match your filters.
                        </p>
                    ) : (
                        mobileGrouped.map(({ label, articles }) => (
                            <MobileCategoryCarousel key={label} label={label} articles={articles} />
                        ))
                    )}
                </div>
            </section>

            {/* Newsletter */}
            <section className="w-full px-4 pb-16 pt-4 md:px-8 md:pb-24 md:pt-8">
                <div className="mx-auto mt-16 w-full max-w-5xl rounded-2xl border border-white/5 bg-[#8979F01A] p-6 text-center md:mt-24 md:p-16">
                    <h2 className="mb-4 font-heading text-2xl font-black text-white md:text-4xl">
                        Never Miss an Update
                    </h2>
                    <p className="mx-auto mb-8 max-w-2xl text-sm text-gray-300 md:text-base">
                        Subscribe to our{' '}
                        <span className="font-bold text-white">monthly digest</span>{' '}
                        for the latest tournament announcements, community spotlights, and game updates directly to
                        your inbox.
                    </p>

                    <form
                        className="mx-auto flex w-full max-w-lg flex-col gap-3 sm:flex-row sm:items-stretch"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email address"
                            required
                            autoComplete="email"
                            className="min-h-[44px] w-full min-w-0 flex-1 rounded-xl border border-neutral-600 bg-neutral-900/80 px-4 py-3 font-sans text-base text-white placeholder:text-gray-500 focus:border-neutral-400 focus:outline-none focus:ring-1 focus:ring-white/20 sm:text-sm md:py-3"
                        />
                        <button
                            type="submit"
                            className="min-h-[44px] w-full shrink-0 rounded-xl px-6 py-3 font-sans text-sm font-bold text-black transition hover:brightness-110 sm:w-auto sm:px-8 md:text-base"
                            style={{ backgroundColor: ACCENT }}
                        >
                            Subscribe
                        </button>
                    </form>

                    <p className="mx-auto mt-6 max-w-2xl text-[10px] leading-relaxed text-gray-400 md:text-xs">
                        By subscribing, you consent to our collection of your email for newsletter purposes in
                        compliance with the Data Privacy Act of 2012. Unsubscribe at any time.
                    </p>
                </div>
            </section>
        </div>
    );
}

function MobileCategoryCarousel({ label, articles }) {
    const scrollerRef = useRef(null);
    const depsKey = articles.map((a) => a.slug).join(',');
    const activeIndex = useCarouselActiveIndex(scrollerRef, articles.length, depsKey);
    const dotActive = Math.min(activeIndex, 2);

    return (
        <div className="mb-10 w-full">
            <h3 className="mb-4 font-heading text-xl font-bold text-[#FBBF24]">{label}</h3>
            <div className="relative w-full">
                <div
                    ref={scrollerRef}
                    className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto [-webkit-overflow-scrolling:touch]"
                >
                    {articles.map((article) => (
                        <ArticleCard
                            key={article.slug}
                            article={article}
                            articleClassName="w-[85vw] max-w-[380px] shrink-0 snap-center"
                        />
                    ))}
                </div>
                <div className="pointer-events-none absolute bottom-3 left-0 z-10 flex w-full justify-center md:bottom-4">
                    <div className="flex items-center justify-center gap-2 pointer-events-none">
                        <div
                            className={`h-1.5 rounded-full ${dotActive === 0 ? 'w-8 bg-[#FBBF24]' : 'w-4 bg-neutral-600'}`}
                        />
                        <div
                            className={`h-1.5 rounded-full ${dotActive === 1 ? 'w-8 bg-[#FBBF24]' : 'w-4 bg-neutral-600'}`}
                        />
                        <div
                            className={`h-1.5 rounded-full ${dotActive === 2 ? 'w-8 bg-[#FBBF24]' : 'w-4 bg-neutral-600'}`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
