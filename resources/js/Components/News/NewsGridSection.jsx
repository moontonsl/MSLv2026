import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    Calendar,
    Clock,
    Search,
    Tag,
} from 'lucide-react';
import { useMemo, useState } from 'react';

const FILTER_OPTIONS = ['All', 'Esports', 'Community', 'Events', 'Game Updates'];

const CATEGORY_ORDER = ['Esports', 'Community', 'Events', 'Game Updates'];

const MOCK_ARTICLES = [
    {
        id: '1',
        href: '/news/student-leader-summit-2024-recap',
        category: 'Events',
        image:
            'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
        date: 'Nov 27, 2025',
        readTime: '3 min read',
        title: 'Student Leader Summit 2024 Recap',
        excerpt:
            'Over 200 student leaders gathered in Manila for a weekend of workshops, networking, and showmatches.',
    },
    {
        id: '2',
        href: '/news/collegiate-cup-highlights',
        category: 'Esports',
        image:
            'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
        date: 'Nov 27, 2025',
        readTime: '3 min read',
        title: 'Regional Finals: Best Moments from Luzon',
        excerpt:
            'Relive the clutch plays, upsets, and crowd energy as campuses battled for a spot at nationals.',
    },
    {
        id: '3',
        href: '/news/community-spotlight',
        category: 'Community',
        image:
            'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
        date: 'Nov 27, 2025',
        readTime: '3 min read',
        title: 'Campus Spotlight: Building Inclusive Guild Cultures',
        excerpt:
            'How student leaders are shaping healthier team dynamics and welcoming new players on campus.',
    },
    {
        id: '4',
        href: '/news/patch-notes-roundup',
        category: 'Game Updates',
        image:
            'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
        date: 'Nov 27, 2025',
        readTime: '3 min read',
        title: 'Patch Notes Roundup: What Changed for Ranked',
        excerpt:
            'A concise breakdown of hero adjustments, item tweaks, and meta shifts competitive teams should watch.',
    },
    {
        id: '5',
        href: '/news/msl-outreach-program',
        category: 'Community',
        image:
            'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
        date: 'Nov 27, 2025',
        readTime: '3 min read',
        title: 'MSL Outreach: Grassroots Events Across Visayas',
        excerpt:
            'Partnerships with local orgs brought pop-up tournaments and leadership clinics to new regions.',
    },
];

function ArticleCard({ article, layout = 'grid' }) {
    const isCarousel = layout === 'carousel';
    return (
        <article
            className={`group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-[#111111] transition-colors hover:border-neutral-600 ${
                isCarousel ? 'w-[85vw] max-w-[400px] shrink-0 snap-center' : ''
            }`}
        >
            <Link
                href={article.href}
                className="flex min-h-0 flex-1 flex-col text-white no-underline visited:text-white hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC107] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]"
            >
                <div className="relative h-48 w-full overflow-hidden">
                    <img
                        src={article.image}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                    <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/70 px-3 py-1 font-sans text-xs font-medium text-white backdrop-blur-sm">
                        <Tag className="h-3 w-3 shrink-0 text-[#FFC107]" />
                        <span>{article.category}</span>
                    </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                    <div className="mb-3 flex items-center gap-4 font-sans text-xs font-normal text-gray-500">
                        <span className="inline-flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 shrink-0" />
                            {article.date}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 shrink-0" />
                            {article.readTime}
                        </span>
                    </div>

                    <h3 className="mb-2 line-clamp-2 font-heading text-xl font-black tracking-tight leading-snug text-white transition-colors group-hover:text-[#FFC107] md:text-2xl">
                        {article.title}
                    </h3>

                    <p className="mb-6 overflow-hidden font-sans text-sm text-gray-400 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
                        {article.excerpt}
                    </p>

                    <div className="mt-auto flex items-center gap-2 font-sans text-sm font-bold text-[#FFC107]">
                        Read Article
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                </div>
            </Link>
        </article>
    );
}

function MobileCategoryCarousel({ category, articles, isLast }) {
    return (
        <div className={`w-full ${isLast ? 'mb-0' : 'mb-6'}`}>
            <h3 className="mb-3 px-4 font-heading text-lg font-black text-[#FFC107] md:px-8">
                {category}
            </h3>
            <div
                className={`hide-scrollbar flex snap-x snap-mandatory flex-row gap-4 overflow-x-auto px-4 md:gap-6 md:px-8 ${
                    isLast ? 'pb-2 md:pb-6' : 'pb-6'
                }`}
            >
                {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} layout="carousel" />
                ))}
            </div>
            <div
                className={`flex justify-center items-center gap-1.5 mt-4 md:hidden ${
                    isLast ? 'mb-0' : 'mb-2'
                }`}
            >
                <div className="w-8 h-1.5 bg-[#FFC107] rounded-full"></div>
                <div className="w-3 h-1.5 bg-[#333333] rounded-full"></div>
                <div className="w-3 h-1.5 bg-[#333333] rounded-full"></div>
            </div>
        </div>
    );
}

export default function NewsGridSection() {
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredArticles = useMemo(() => {
        let list = MOCK_ARTICLES;
        if (activeFilter !== 'All') {
            list = list.filter((a) => a.category === activeFilter);
        }
        const q = searchQuery.trim().toLowerCase();
        if (q) {
            list = list.filter(
                (a) =>
                    a.title.toLowerCase().includes(q) ||
                    a.excerpt.toLowerCase().includes(q) ||
                    a.category.toLowerCase().includes(q)
            );
        }
        return list;
    }, [activeFilter, searchQuery]);

    const mobileGrouped = useMemo(() => {
        const map = new Map();
        filteredArticles.forEach((a) => {
            if (!map.has(a.category)) {
                map.set(a.category, []);
            }
            map.get(a.category).push(a);
        });
        return CATEGORY_ORDER.filter((c) => map.has(c)).map((c) => ({
            category: c,
            articles: map.get(c),
        }));
    }, [filteredArticles]);

    return (
        <div className="mx-auto w-full max-w-6xl px-4 pb-4 md:px-8 md:pb-20">
            <div className="mb-8 flex flex-col items-start justify-between gap-0 md:flex-row md:items-center md:gap-4">
                <div className="hide-scrollbar flex w-full gap-2 overflow-x-auto whitespace-nowrap pb-2 md:w-auto">
                    {FILTER_OPTIONS.map((label) => {
                        const isActive = activeFilter === label;
                        return (
                            <button
                                key={label}
                                type="button"
                                onClick={() => setActiveFilter(label)}
                                className={
                                    isActive
                                        ? 'rounded-lg bg-[#FFC107] px-4 py-2 text-sm font-semibold text-black transition-colors'
                                        : 'rounded-lg border border-neutral-700 bg-transparent px-4 py-2 text-sm text-gray-400 transition-colors hover:border-neutral-500 hover:text-white'
                                }
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>

                <div className="relative mt-4 w-full md:mt-0 md:w-72">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search articles..."
                        className="w-full rounded-lg border border-neutral-700 bg-[#111111] py-2 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 transition-colors focus:border-[#FFC107] focus:outline-none"
                    />
                </div>
            </div>

            {filteredArticles.length === 0 && (
                <p className="py-8 text-center text-sm text-gray-500">
                    No articles match your filters.
                </p>
            )}

            <div className="md:hidden">
                {mobileGrouped.map(({ category, articles }, index) => (
                    <MobileCategoryCarousel
                        key={category}
                        category={category}
                        articles={articles}
                        isLast={index === mobileGrouped.length - 1}
                    />
                ))}
            </div>

            <div className="hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-3">
                {filteredArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} layout="grid" />
                ))}
            </div>
        </div>
    );
}
