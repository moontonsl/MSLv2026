import AnnouncementBanner from '@/Components/AnnouncementBanner';
import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import {
    ArrowRight,
    ArrowUpRight,
    Building2,
    Calendar,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    GraduationCap,
    MapPin,
    Quote,
    Trophy,
    User,
    Users,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

function HomeHero() {
    const slides = useMemo(
        () => [
            {
                badge: 'LIVE NOW',
                title: 'MCC Season 4: Collegiate Clash',
                description:
                    'The biggest inter-school MLBB tournament is back. Watch the regionals live.',
                dateLabel: 'Nov 27, 2025',
                imageSrc:
                    'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=80',
            },
            {
                badge: 'FEATURED',
                title: 'Campus Scrims: Open Qualifiers',
                description:
                    'Weekly scrims for student teams. Build synergy, earn rankings, get noticed.',
                dateLabel: 'Dec 04, 2025',
                imageSrc:
                    'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=80',
            },
            {
                badge: 'UP NEXT',
                title: 'MSL Partner Spotlight',
                description:
                    'Meet our campus partners and explore resources for esports org leaders.',
                dateLabel: 'Dec 18, 2025',
                imageSrc:
                    'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=80',
            },
        ],
        [],
    );

    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const id = window.setInterval(() => {
            setActiveIndex((i) => (i + 1) % slides.length);
        }, 6000);
        return () => window.clearInterval(id);
    }, [slides.length]);

    const active = slides[activeIndex];

    return (
        <section className="bg-[#0a0a0a]">
            <div className="container-page py-12 md:py-20">
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                    {/* Left column */}
                    <div className="mx-auto max-w-xl text-center md:mx-0 md:text-left">
                        <h1 className="font-heading text-4xl font-black leading-[1.05] tracking-tighter text-white md:text-[56px] lg:text-[64px]">
                            Empowering{' '}
                            <span className="text-[#FFC107]">Student-Gamers</span>
                            <br />
                            to <span className="text-[#FFC107]">Become</span> the Next
                            <br />
                            Generation Leaders
                        </h1>

                        <p className="mt-6 text-base leading-relaxed text-gray-400 sm:text-lg">
                            We equip student-gamers and esports organizations with
                            recognition, resources, and professional mentorship —
                            everything you need to build a thriving campus community.
                        </p>

                        <div className="mt-8 flex w-full flex-col items-center gap-4 md:flex-row md:justify-start">
                            <button
                                type="button"
                                className="inline-flex w-full items-center justify-center rounded-lg bg-yellow-400 px-6 py-3 text-sm font-semibold text-black shadow-[0_0_0_1px_rgba(0,0,0,0.25)] transition hover:bg-yellow-300 md:w-auto"
                            >
                                Be A Member
                            </button>

                            <button
                                type="button"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-transparent px-6 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/5 md:w-auto"
                            >
                                Partner With US
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="w-full">
                        <div className="mb-2 text-xs font-semibold tracking-[0.22em] text-gray-500">
                            HAPPENING NOW
                        </div>

                        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
                            <div className="relative h-[260px] sm:h-[320px] lg:h-[360px]">
                                <img
                                    src={active.imageSrc}
                                    alt="Happening now background"
                                    className="absolute inset-0 h-full w-full object-cover"
                                />

                                {/* Soft dark vignette + bottom gradient for legibility */}
                                <div className="absolute inset-0 bg-black/10" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                                {/* Content */}
                                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                                    <div className="inline-flex items-center rounded-md bg-red-600 px-2 py-0.5 text-[11px] font-bold tracking-wide text-white">
                                        {active.badge}
                                    </div>

                                    <div className="mt-2 font-heading text-2xl font-bold leading-tight text-white sm:text-3xl">
                                        {active.title}
                                    </div>

                                    <div className="mt-1 max-w-lg text-sm leading-relaxed text-white/80">
                                        {active.description}
                                    </div>

                                    <div className="flex items-center gap-4 mt-6 w-full">
                                        <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-lg text-white text-sm font-medium">
                                            <Calendar className="h-4 w-4 text-[#FFC107]" />
                                            <span>{active.dateLabel}</span>
                                        </div>

                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-yellow-300"
                                        >
                                            View Details
                                            <ArrowRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Indicators */}
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
                                    {slides.map((_, i) => {
                                        const isActive = i === activeIndex;
                                        return (
                                            <button
                                                key={i}
                                                type="button"
                                                aria-label={`Go to slide ${i + 1}`}
                                                onClick={() => setActiveIndex(i)}
                                                className={`h-1.5 rounded-full transition ${
                                                    isActive
                                                        ? 'w-10 bg-yellow-400'
                                                        : 'w-4 bg-gray-500'
                                                }`}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function AboutMSLSection() {
    const stats = [
        { icon: User, value: '22K+', label: 'STUDENT GAMERS' },
        { icon: Building2, value: '150+', label: 'CAMPUS COMMUNITIES' },
        { icon: Trophy, value: '110+', label: 'EVENTS SPONSORED' },
        { icon: Users, value: '240+', label: 'STUDENT LEADERS' },
    ];  

    return (
        <section className="relative isolate overflow-hidden bg-[#0a0a0a] py-16 md:py-24">
            <div
                className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-20"
                style={{
                    background:
                        'radial-gradient(circle, rgba(251,191,36,1) 0%, rgba(251,191,36,0) 70%)',
                }}
            />
            <div className="relative z-10 container-page">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-center font-heading text-2xl font-black uppercase tracking-wide text-white md:text-3xl">
                        About MSL Philippines
                    </h2>

                    <p className="mx-auto mt-3 max-w-2xl text-center font-sans text-sm leading-relaxed text-gray-400 md:text-base">
                        We are the official student leader body of Mobile Legends:
                        Bang Bang in the Philippines. Guided by Moonton, we create
                        inclusive campus initiatives that unite players, boost school
                        pride, and prove that gaming passion goes hand-in-hand with
                        academic success.
                    </p>

                    <button
                        type="button"
                        className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#FFC107] transition hover:text-yellow-300 sm:text-base"
                    >
                        Learn More About Us
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>

                <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {stats.map((item) => {
                        const Icon = item.icon;
                        return (
                            <article
                                key={item.label}
                                className="rounded-2xl border border-neutral-700 bg-[#1a1a1a] px-6 py-7"
                            >
                                <div className="flex justify-center">
                                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#2a2a2a]">
                                        <Icon className="h-5 w-5 text-[#FFC107]" />
                                    </span>
                                </div>

                                <div className="stat-number mt-5 text-center text-3xl text-white sm:text-5xl">
                                    {item.value}
                                </div>

                                <div className="mt-2 text-center text-xs font-medium tracking-[0.16em] text-gray-400">
                                    {item.label}
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function NetworkOrganizationsSection() {
    const logos = [
        { src: '/Images/Home/Logo%202.png', alt: 'Network organization logo 2' },
        { src: '/Images/Home/Logo%203.png', alt: 'Network organization logo 3' },
        { src: '/Images/Home/Logo%204.png', alt: 'Network organization logo 4' },
        { src: '/Images/Home/Logo%205.png', alt: 'Network organization logo 5' },
    ];
    const extendedLogos = [...logos, ...logos, ...logos, ...logos];

    return (
        <section className="overflow-hidden bg-[#0a0a0a] py-12 md:py-20 border-y border-white/5">
            <style>{`
                @keyframes networkMarquee {
                    from { transform: translateX(0); }
                    to { transform: translateX(-100%); }
                }
            `}</style>

            <div className="container-page mb-12">
                <h2 className="mb-12 text-center font-heading text-2xl font-black uppercase tracking-wide text-white md:text-3xl">
                    MSL Network Organizations
                </h2>
            </div>

            <div className="flex w-max flex-nowrap">
                <div
                    className="flex shrink-0 items-center gap-16 pr-16 md:gap-24 md:pr-24"
                    style={{ animation: 'networkMarquee 80s linear infinite' }}
                >
                    {extendedLogos.map((logo, idx) => (
                        <div
                            key={`track-1-${logo.src}-${idx}`}
                            className="flex h-28 items-center justify-center shrink-0"
                        >
                            <img
                                src={logo.src}
                                alt={logo.alt}
                                className="h-20 w-auto max-w-[180px] object-contain sm:h-24 sm:max-w-[220px] md:h-28 md:max-w-[260px]"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>

                <div
                    className="flex shrink-0 items-center gap-16 pr-16 md:gap-24 md:pr-24"
                    style={{ animation: 'networkMarquee 80s linear infinite' }}
                    aria-hidden="true"
                >
                    {extendedLogos.map((logo, idx) => (
                        <div
                            key={`track-2-${logo.src}-${idx}`}
                            className="flex h-28 items-center justify-center shrink-0"
                        >
                            <img
                                src={logo.src}
                                alt=""
                                className="h-20 w-auto max-w-[180px] object-contain sm:h-24 sm:max-w-[220px] md:h-28 md:max-w-[260px]"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/** Full class strings per index so Tailwind emits `lg:col-span-*`; 1–2–1 / 2–2 masonry on `lg`. */
const PROGRAM_CARD_LG_COL_SPAN = [
    'lg:col-span-1',
    'lg:col-span-2',
    'lg:col-span-1',
    'lg:col-span-2',
    'lg:col-span-2',
];

function ProgramsSection() {
    const scrollerRef = useRef(null);
    const [activeProgramIndex, setActiveProgramIndex] = useState(0);

    const programs = [
        {
            title: 'Campus Tournament',
            description:
                'Gain official tournaments, grants, and mentorship for your campus community.',
            image:
                'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=80',
        },
        {
            title: 'Event Sponsorships',
            description:
                'Partner-backed events and resources that elevate your student programs.',
            image:
                'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=80',
        },
        {
            title: 'Leadership Labs',
            description:
                'Workshops and training that sharpen skills for the next generation of leaders.',
            image:
                'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=80',
        },
        {
            title: 'MLBB Campaigns',
            description:
                'Creative activations and nationwide drives that celebrate the spirit of Mobile Legends.',
            image:
                'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=80',
        },
        {
            title: 'Community Grants',
            description:
                'Funding and support to help verified campus communities grow sustainably.',
            image:
                'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=80',
        },
    ];

    useEffect(() => {
        const el = scrollerRef.current;
        if (!el) return;

        const update = () => {
            const children = Array.from(el.children);
            if (!children.length) return;
            const center = el.scrollLeft + el.clientWidth / 2;
            let bestIdx = 0;
            let bestDist = Number.POSITIVE_INFINITY;
            children.forEach((child, idx) => {
                const c = child.offsetLeft + child.clientWidth / 2;
                const d = Math.abs(c - center);
                if (d < bestDist) {
                    bestDist = d;
                    bestIdx = idx;
                }
            });
            setActiveProgramIndex(bestIdx);
        };

        update();
        el.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        return () => {
            el.removeEventListener('scroll', update);
            window.removeEventListener('resize', update);
        };
    }, []);

    const scrollPrograms = (direction) => {
        const el = scrollerRef.current;
        if (!el) return;
        const amount = el.clientWidth * 0.9;
        el.scrollBy({
            left: direction === 'left' ? -amount : amount,
            behavior: 'smooth',
        });
    };

    return (
        <section className="bg-[#0a0a0a] py-12 md:py-20">
            <div className="container-page">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="text-center md:text-left">
                        <h2 className="text-center font-heading text-2xl font-black uppercase tracking-wide text-white md:text-left md:text-3xl">
                            Our Programs
                        </h2>
                        <p className="mx-auto mt-3 max-w-2xl text-center font-sans text-sm leading-relaxed text-gray-400 md:mx-0 md:text-left md:text-base">
                            Building opportunities for student leaders through
                            events, training, and nationwide esports initiatives.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="inline-flex w-full items-center justify-center gap-2 self-stretch rounded-full border border-[#FFC107] px-5 py-2.5 text-sm font-medium text-[#FFC107] transition hover:bg-[#FFC107]/10 md:w-auto md:self-auto md:mt-0"
                    >
                        View All Programs
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>

                {/* Mobile carousel, desktop masonry grid */}
                <div className="mt-10 md:mt-12">
                    <div
                        ref={scrollerRef}
                        className="flex overflow-x-auto snap-x snap-mandatory px-6 -mx-6 gap-4 pb-8 md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:gap-4 md:px-0 md:mx-0 md:overflow-visible md:pb-0"
                    >
                        {programs.map((program, idx) => (
                            <article
                                key={`${program.title}-${idx}`}
                                className={`group relative h-[280px] min-w-0 shrink-0 snap-center overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl w-[85vw] max-w-[340px] md:h-[300px] md:w-full md:max-w-none lg:h-[320px] ${PROGRAM_CARD_LG_COL_SPAN[idx] ?? 'lg:col-span-1'}`}
                            >
                                <img
                                    src={program.image}
                                    alt={program.title}
                                    className="absolute inset-0 h-full w-full scale-100 object-cover grayscale transition-all duration-500 ease-in-out group-hover:-translate-y-2 group-hover:scale-105 group-hover:grayscale-0"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                                {/* Mobile in-card arrows */}
                                <button
                                    type="button"
                                    aria-label="Previous program"
                                    onClick={() => scrollPrograms('left')}
                                    className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white/80 backdrop-blur-sm md:hidden"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    aria-label="Next program"
                                    onClick={() => scrollPrograms('right')}
                                    className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white/80 backdrop-blur-sm md:hidden"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>

                                <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-start gap-1 p-6 pr-16">
                                    <h3 className="text-xl font-bold leading-tight text-white lg:text-2xl">
                                        {program.title}
                                    </h3>
                                    <p className="max-w-lg text-xs text-gray-300 opacity-0 -translate-y-2 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:text-sm">
                                        {program.description}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    aria-label={`Open ${program.title}`}
                                    className="absolute bottom-6 right-6 z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFC107] opacity-0 shadow-lg translate-x-4 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                                >
                                    <ArrowUpRight className="h-5 w-5 text-black" />
                                </button>
                            </article>
                        ))}
                    </div>

                    {/* Mobile dots */}
                    <div className="mt-4 flex items-center justify-center gap-2 md:hidden">
                        {programs.map((_, i) => (
                            <span
                                key={i}
                                className={`h-1.5 rounded-full transition ${
                                    i === activeProgramIndex
                                        ? 'w-8 bg-yellow-400'
                                        : 'w-2 bg-gray-600'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function CommunityVoicesSection() {
    const scrollerRef = useRef(null);

    const voices = [
        {
            name: 'Leslie Alexander',
            role: 'Student Leader',
            university: 'University of Santo Tomas',
            quote: 'MSL gave our community a platform to grow as leaders and inspire student-gamers nationwide.',
            image:
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80',
        },
        {
            name: 'Leslie Alexander',
            role: 'Student Leader',
            university: 'University of Santo Tomas',
            quote: 'Through MSL programs, we built stronger campus initiatives and connected with teams across regions.',
            image:
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80',
        },
        {
            name: 'Leslie Alexander',
            role: 'Student Leader',
            university: 'University of Santo Tomas',
            quote: 'The mentorship and opportunities helped us turn our passion into meaningful school impact.',
            image:
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80',
        },
        {
            name: 'Leslie Alexander',
            role: 'Student Leader',
            university: 'University of Santo Tomas',
            quote: 'MSL is where students, organizers, and partners come together to build lasting communities.',
            image:
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80',
        },
        {
            name: 'Jacob Jones',
            role: 'Campus Organizer',
            university: 'Ateneo de Manila University',
            quote: 'Our campus programs became more structured because we learned directly from the MSL network.',
            image:
                'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80',
        },
        {
            name: 'Kristin Watson',
            role: 'Student Leader',
            university: 'De La Salle University',
            quote: 'The mentorship gave us confidence to lead bigger events and support more student-gamers.',
            image:
                'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=1200&q=80',
        },
        {
            name: 'Wade Warren',
            role: 'Partner Representative',
            university: 'Far Eastern University',
            quote: 'MSL bridges campuses and partners in a way that creates real opportunities for students.',
            image:
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80',
        },
        {
            name: 'Jenny Wilson',
            role: 'Community Lead',
            university: 'Mapua University',
            quote: 'We were able to launch initiatives that improved participation and built healthier team culture.',
            image:
                'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80',
        },
    ];

    const scrollVoices = (direction) => {
        if (!scrollerRef.current) return;
        const amount = scrollerRef.current.clientWidth * 0.9;
        scrollerRef.current.scrollBy({
            left: direction === 'left' ? -amount : amount,
            behavior: 'smooth',
        });
    };

    const [activeVoiceIndex, setActiveVoiceIndex] = useState(0);

    useEffect(() => {
        const el = scrollerRef.current;
        if (!el) return;

        const update = () => {
            const children = Array.from(el.children);
            if (!children.length) return;
            const center = el.scrollLeft + el.clientWidth / 2;
            let bestIdx = 0;
            let bestDist = Number.POSITIVE_INFINITY;
            children.forEach((child, idx) => {
                const c = child.offsetLeft + child.clientWidth / 2;
                const d = Math.abs(c - center);
                if (d < bestDist) {
                    bestDist = d;
                    bestIdx = idx;
                }
            });
            setActiveVoiceIndex(bestIdx);
        };

        update();
        el.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        return () => {
            el.removeEventListener('scroll', update);
            window.removeEventListener('resize', update);
        };
    }, []);

    return (
        <section className="relative isolate overflow-hidden bg-[#0a0a0a] py-12 md:py-20">
            <div
                className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[75%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-20"
                style={{
                    background:
                        'radial-gradient(circle, rgba(251,191,36,1) 0%, rgba(251,191,36,0) 70%)',
                }}
            />
            <div className="relative z-10 container-page">
                <div className="text-center md:text-left">
                    <h2 className="text-center font-heading text-2xl font-black uppercase tracking-wide text-white md:text-left md:text-3xl">
                        Community Voices
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-center font-sans text-sm leading-relaxed text-gray-400 md:mx-0 md:text-left md:text-base">
                        Hear from the student leaders, campus organizers, and
                        partners who are driving the MSL Philippines movement
                        forward.
                    </p>
                </div>

                <div className="relative mt-10 md:mt-16">
                    <button
                        type="button"
                        aria-label="Previous voices"
                        onClick={() => scrollVoices('left')}
                        className="absolute -left-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white/80 backdrop-blur-sm transition hover:border-white/20 hover:text-white lg:flex"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    <button
                        type="button"
                        aria-label="Next voices"
                        onClick={() => scrollVoices('right')}
                        className="absolute -right-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white/80 backdrop-blur-sm transition hover:border-white/20 hover:text-white lg:flex"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>

                    <div
                        ref={scrollerRef}
                        className="flex snap-x snap-mandatory gap-6 overflow-x-auto py-8 px-6 -mx-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:py-0 md:px-0 md:mx-0"
                    >
                        {voices.map((voice, idx) => (
                            <article
                                key={`${voice.name}-${idx}`}
                                className="group relative w-[85vw] max-w-[340px] shrink-0 snap-start rounded-2xl border border-transparent bg-[#111111] transition-all duration-300 hover:border-[#FFC107] md:w-auto"
                            >
                                <div className="relative h-64 overflow-hidden rounded-t-2xl">
                                    <img
                                        src={voice.image}
                                        alt={voice.name}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-2"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                </div>

                                <div className="absolute right-6 top-[200px] z-20">
                                    <span className="inline-flex rounded-xl bg-[#FFC107] p-3 shadow-lg transition-transform duration-300 group-hover:-translate-y-4 group-hover:rotate-12">
                                        <Quote className="h-4 w-4 fill-black text-black" />
                                    </span>
                                </div>

                                <div className="relative p-6">
                                    <h3 className="text-2xl leading-tight text-white">
                                        Leslie
                                        <br />
                                        Alexander
                                    </h3>

                                    <p className="mt-2 text-sm font-bold text-[#FFC107]">
                                        {voice.role}
                                    </p>

                                    <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-400">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {voice.university}
                                    </p>

                                    <div className="mb-4 mt-4 border-t border-gray-800" />

                                    <p className="text-sm italic leading-relaxed text-gray-400">
                                        "{voice.quote}"
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* Mobile dots */}
                    <div className="mt-4 flex items-center justify-center gap-2 lg:hidden">
                        {voices.map((_, i) => (
                            <span
                                key={i}
                                className={`h-1.5 rounded-full transition ${
                                    i === activeVoiceIndex
                                        ? 'w-8 bg-yellow-400'
                                        : 'w-2 bg-gray-600'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function ChooseYourPathSection() {
    return (
        <section className="bg-[#0a0a0a] py-16 md:py-24">
            <div className="container-page">
                <div className="text-center">
                    <h2 className="text-center font-heading text-2xl font-black uppercase tracking-wide text-white md:text-3xl">
                        Choose Your Path
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-center font-sans text-sm leading-relaxed text-gray-400 md:text-base">
                        Select how you want to get involved with MSL Philippines.
                    </p>
                </div>

                <div className="mx-auto mt-14 max-w-5xl px-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <article className="group relative rounded-2xl border border-yellow-500/20 bg-[#111111] bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-yellow-500/10 via-[#111111]/50 to-[#111111] p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group-hover:border-yellow-500/50">
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-yellow-500/10 transition-all duration-300 group-hover:bg-yellow-500/20">
                                <GraduationCap className="h-7 w-7 text-[#FFC107]" />
                            </div>

                            <h3 className="mt-8 text-3xl text-white">
                                For Students
                            </h3>

                            <p className="mt-4 leading-relaxed text-gray-400">
                                Establish an MSL community in your school. Gain
                                access to official tournaments, leadership grants,
                                and mentorship programs.
                            </p>

                            <button
                                type="button"
                                className="mt-10 flex w-full items-center justify-center gap-2 rounded-lg bg-[#FFC107] py-3 font-bold text-black transition-all duration-300 group-hover:shadow-lg group-hover:shadow-yellow-500/30"
                            >
                                Be A Member
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </article>

                        <article className="group relative rounded-2xl border border-blue-500/20 bg-[#111111] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-[#111111]/50 to-[#111111] p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group-hover:border-blue-500/50">
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/10 transition-all duration-300 group-hover:bg-blue-500/20">
                                <Building2 className="h-7 w-7 text-blue-400" />
                            </div>

                            <h3 className="mt-8 text-3xl text-white">
                                For Partners
                            </h3>

                            <p className="mt-4 leading-relaxed text-gray-400">
                                Empower the next generation. Collaborate with us
                                for campus activations, brand integration, and
                                student-led events.
                            </p>

                            <button
                                type="button"
                                className="mt-10 flex w-full items-center justify-center gap-2 rounded-lg border border-blue-500/30 py-3 font-bold text-white transition-all duration-300 group-hover:border-transparent group-hover:bg-[#2A2A2A]"
                            >
                                Partner With Us
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </article>
                    </div>
                </div>
            </div>
        </section>
    );
}

function FAQSection() {
    const faqs = [
        {
            q: 'Who can join MSL?',
            a: 'Any student, campus esports organization, or recognized school-based group with a passion for Mobile Legends and esports development can be part of MSL.',
        },
        {
            q: "How can I join if I'm just an individual student?",
            a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        },
        {
            q: 'How do we start an MSL Community in our school?',
            a: 'Lorem ipsum dolor sit amet.',
        },
        {
            q: 'What benefits do MSL Communities receive?',
            a: 'Lorem ipsum dolor sit amet.',
        },
        {
            q: 'How does MSL supports esports tournaments?',
            a: 'Lorem ipsum dolor sit amet.',
        },
        {
            q: 'Can brands and partners collaborate with MSL?',
            a: 'Lorem ipsum dolor sit amet.',
        },
        {
            q: 'What benefits do partners gain when collaborating with MSL?',
            a: 'Lorem ipsum dolor sit amet.',
        },
        {
            q: 'Do MSL members receive training or development opportunities?',
            a: 'Lorem ipsum dolor sit amet.',
        },
        {
            q: 'Is MSL exclusive to Mobile Legends?',
            a: 'Lorem ipsum dolor sit amet.',
        },
        {
            q: 'How can we contact MSL Philippines?',
            a: 'Lorem ipsum dolor sit amet.',
        },
    ];

    const [openIndex, setOpenIndex] = useState(null);

    return (
        <section className="bg-[#0a0a0a] py-16 md:py-24">
            <div className="container-page">
                <div className="text-center">
                    <h2 className="text-center font-heading text-2xl font-black uppercase tracking-wide text-white md:text-3xl">
                        Frequently Asked Questions
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-center font-sans text-sm leading-relaxed text-gray-400 md:text-base">
                        Everything you need to know about joining and partnering
                        with us.
                    </p>
                </div>

                <div className="mx-auto mt-16 flex max-w-4xl flex-col gap-4">
                    {faqs.map((item, idx) => {
                        const isOpen = openIndex === idx;
                        return (
                            <div
                                key={item.q}
                                className={`rounded-xl bg-[#111111] border ${
                                    isOpen
                                        ? 'border-[#FFC107]/40'
                                        : 'border-neutral-800'
                                }`}
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        setOpenIndex((curr) =>
                                            curr === idx ? null : idx,
                                        )
                                    }
                                    className="flex w-full cursor-pointer items-center justify-between p-4 text-left md:p-6"
                                >
                                    <span
                                        className={`text-base font-bold sm:text-lg ${
                                            isOpen
                                                ? 'text-[#FFC107]'
                                                : 'text-white'
                                        }`}
                                    >
                                        {item.q}
                                    </span>
                                    <ChevronDown
                                        className={`h-5 w-5 transition-transform duration-300 ${
                                            isOpen
                                                ? 'rotate-180 text-[#FFC107]'
                                                : 'text-white/70'
                                        }`}
                                    />
                                </button>

                                <div
                                    className={`grid transition-all duration-300 ease-in-out ${
                                        isOpen
                                            ? 'grid-rows-[1fr] opacity-100'
                                            : 'grid-rows-[0fr] opacity-0'
                                    }`}
                                >
                                    <div className="overflow-hidden">
                                        <div className="border-t border-neutral-800 p-4 pt-3 md:p-6 md:pt-4">
                                            <p className="text-sm leading-relaxed text-gray-300 sm:text-base">
                                                {item.a}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default function Home() {
    return (
        <MainLayout>
            <Head title="Home" />
            <AnnouncementBanner />
            <HomeHero />
            <AboutMSLSection />
            <NetworkOrganizationsSection />
            <ProgramsSection />
            <CommunityVoicesSection />
            <ChooseYourPathSection />
            <FAQSection />
        </MainLayout>
    );
}

