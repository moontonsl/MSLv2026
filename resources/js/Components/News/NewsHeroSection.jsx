import { Link } from '@inertiajs/react';
import { CalendarDays, User } from 'lucide-react';
import { useMemo } from 'react';

const DEFAULT_FEATURED_IMAGE =
    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=2000&q=80';

const DEFAULT_EXCERPT =
    'Registration is officially open! Check out the new format, increased prize pool, and region-locking mechanics for this season. Teams from Luzon, Visayas, and Mindanao will battle for supremacy.';

/**
 * @typedef {{ href?: string; imageSrc?: string; title?: string; excerpt?: string; date?: string; author?: string }} FeaturedSlide
 * @param {{
 *   featuredHref?: string;
 *   featuredImageSrc?: string;
 *   featuredTitle?: string;
 *   featuredExcerpt?: string;
 *   featuredDate?: string;
 *   featuredAuthor?: string;
 *   featuredSlides?: FeaturedSlide[];
 * }} [props]
 */
export default function NewsHeroSection({
    featuredHref = '#',
    featuredImageSrc = DEFAULT_FEATURED_IMAGE,
    featuredTitle = 'MSL Collegiate Cup Season 4: The Road to Nationals Begins',
    featuredExcerpt = DEFAULT_EXCERPT,
    featuredDate = 'Nov 27, 2025',
    featuredAuthor = 'Tournament Admin',
    featuredSlides,
}) {
    const slides = useMemo(() => {
        if (featuredSlides?.length) {
            return featuredSlides;
        }
        return [
            {
                href: featuredHref,
                imageSrc: featuredImageSrc,
                title: featuredTitle,
                excerpt: featuredExcerpt,
                date: featuredDate,
                author: featuredAuthor,
            },
        ];
    }, [
        featuredSlides,
        featuredHref,
        featuredImageSrc,
        featuredTitle,
        featuredExcerpt,
        featuredDate,
        featuredAuthor,
    ]);

    return (
        <div className="flex w-full flex-col items-center bg-[#0A0A0A] px-4 py-16 text-white md:px-8">
            <h1 className="mb-4 text-center font-heading text-4xl font-black tracking-tighter text-white md:text-5xl lg:text-6xl">
                News <span className="text-[#FFC107]">&</span> Updates
            </h1>

            <p className="max-w-2xl text-center font-sans text-sm leading-relaxed text-gray-400 md:text-base">
                Stay ahead of the meta. The latest stories, tournament results, and community
                highlights from MSL Philippines.
            </p>

            <div className="my-10 w-full max-w-6xl border-t border-neutral-800" />

            <div className="w-full max-w-6xl">
                <div
                    className="hide-scrollbar flex w-full snap-x snap-mandatory overflow-x-auto pb-6 md:block md:overflow-visible md:pb-0"
                >
                    {slides.map((slide, index) => (
                        <div
                            key={`${slide.title}-${index}`}
                            className={`shrink-0 snap-center pr-4 last:pr-0 md:pr-0 ${
                                index === 0
                                    ? 'w-[90vw] max-w-6xl md:w-full'
                                    : 'w-[90vw] max-w-6xl md:hidden'
                            }`}
                        >
                            <Link
                                href={slide.href ?? '#'}
                                className="group relative block h-[400px] w-full cursor-pointer overflow-hidden rounded-3xl shadow-2xl md:h-[500px]"
                            >
                                <img
                                    src={slide.imageSrc ?? DEFAULT_FEATURED_IMAGE}
                                    alt="Featured news"
                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

                                <div className="absolute bottom-0 left-0 flex w-full flex-col items-start p-6 md:w-3/4 md:p-10">
                                    <span className="mb-4 rounded-md bg-[#FFC107] px-3 py-1 text-xs font-bold uppercase tracking-wider text-black">
                                        FEATURED
                                    </span>

                                    <h2 className="mb-3 font-heading text-2xl font-black tracking-tight leading-tight text-white md:text-4xl">
                                        {slide.title ?? featuredTitle}
                                    </h2>

                                    <p className="mb-6 overflow-hidden font-sans text-sm text-gray-300 md:text-base [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
                                        {slide.excerpt ?? featuredExcerpt}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/50 px-3 py-1.5 font-sans text-xs font-medium text-gray-300 backdrop-blur-sm">
                                            <CalendarDays className="h-4 w-4 shrink-0 text-[#FFC107]" />
                                            <span>{slide.date ?? featuredDate}</span>
                                        </div>
                                        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/50 px-3 py-1.5 font-sans text-xs font-medium text-gray-300 backdrop-blur-sm">
                                            <User className="h-4 w-4 shrink-0 text-[#FFC107]" />
                                            <span>{slide.author ?? featuredAuthor}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center items-center gap-1.5 mt-4 mb-2 md:hidden">
                    <div className="w-8 h-1.5 bg-[#FFC107] rounded-full"></div>
                    <div className="w-3 h-1.5 bg-[#333333] rounded-full"></div>
                    <div className="w-3 h-1.5 bg-[#333333] rounded-full"></div>
                </div>
            </div>
        </div>
    );
}
