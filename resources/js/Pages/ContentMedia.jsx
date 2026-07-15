import {
    BROADCAST_ITEMS,
    CAPTION_POST,
    DEPARTMENT_HEAD,
    DIVISION_HEADS,
    EDITORIAL_ITEMS,
    FUNCTIONAL_DIVISIONS,
    ON_AIR_TALENT,
    VISUAL_ARTS_GRID,
} from '@/data/contentsSocialMediaData';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    ChevronLeft,
    Globe,
    Heart,
    MessageCircle,
    MessageSquare,
    Mic,
    Palette,
    PenTool,
    Share2,
    Sparkles,
    Video,
} from 'lucide-react';

export default function ContentMedia() {
    return (
        <MainLayout fullWidth>
            <Head title="Contents & Social Media" />

            <div className="min-h-screen overflow-hidden bg-[#0A0A0A] px-4 py-12 font-sans text-white sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-16 sm:space-y-24">
                    <div className="mb-8 flex justify-start">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="flex items-center gap-2 text-sm text-purple-400 transition-colors hover:text-purple-300"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Content & Social Media Department
                        </button>
                    </div>

                    <section className="flex flex-col-reverse items-center justify-between gap-12 pt-8 md:flex-row">
                        <div className="flex w-full flex-col items-center text-center md:max-w-xl md:items-start md:text-left">
                            <div className="mb-6 hidden items-center gap-2 rounded-full border border-purple-500/50 bg-purple-900/30 px-4 py-1.5 text-xs font-bold text-purple-300 md:inline-flex">
                                <Sparkles className="h-4 w-4" />
                                Content & Social Media Department
                            </div>
                            <h1 className="mb-6 text-4xl font-black leading-tight md:text-6xl">
                                Crafting the <br />
                                <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                                    Narrative.
                                </span>
                            </h1>
                            <p className="mb-10 max-w-lg text-sm leading-relaxed text-gray-300 md:text-base">
                                We are the storytellers, the creators, and the voice of MSL
                                Philippines. From pixel-perfect graphics to high-energy
                                broadcasts, we bring the collegiate esports experience to life.
                            </p>
                            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                                <button
                                    type="button"
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#D946EF] px-8 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90 sm:w-auto"
                                >
                                    View Our Works
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    className="flex w-full items-center justify-center rounded-xl bg-[#1F162A] px-8 py-3.5 text-sm font-bold text-gray-300 transition-colors hover:bg-[#2D1F3D] sm:w-auto"
                                >
                                    Join Our Team
                                </button>
                            </div>
                        </div>

                        <div className="pointer-events-none relative min-h-[400px] w-full flex-1 md:min-h-[500px]">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-900/20 to-pink-900/10 blur-[80px]" />

                            <div className="absolute right-[5%] top-[8%] z-10 w-[42%] max-w-[200px] drop-shadow-[0_20px_50px_rgba(239,68,68,0.35)] md:right-[8%] md:top-[10%] md:max-w-[260px] md:w-[45%]">
                                <img
                                    src="/Images/CSM/Rectangle 42.png"
                                    alt="Red 3D Card"
                                    className="h-auto w-full object-contain"
                                />
                            </div>

                            <div className="absolute bottom-[8%] left-[5%] z-20 w-[52%] max-w-[240px] drop-shadow-[-20px_20px_50px_rgba(192,38,211,0.45)] md:bottom-[10%] md:left-[8%] md:max-w-[340px] md:w-[55%]">
                                <img
                                    src="/Images/CSM/Rectangle 41.png"
                                    alt="Purple 3D Card"
                                    className="h-auto w-full object-contain"
                                />
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="mb-12 text-center">
                            <h2 className="text-3xl font-bold md:text-4xl">Our Output</h2>
                            <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-400 md:text-base">
                                Explore the diverse portfolio produced by our student-led
                                creative teams.
                            </p>
                        </div>

                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-900/50">
                                <Palette className="h-4 w-4 text-purple-400" />
                            </div>
                            <span className="font-bold text-white">Visual Arts & Assets</span>
                        </div>
                        <div className="mb-16 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                            <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-[#111111] md:min-h-[420px]">
                                <img
                                    src={VISUAL_ARTS_GRID.feature.src}
                                    alt={VISUAL_ARTS_GRID.feature.alt}
                                    className="h-full min-h-[220px] w-full object-cover md:min-h-[420px]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3 md:gap-4">
                                {VISUAL_ARTS_GRID.topRow.map((item) => (
                                    <div
                                        key={item.alt}
                                        className="aspect-[4/3] overflow-hidden rounded-2xl border border-neutral-800 bg-[#111111]"
                                    >
                                        <img
                                            src={item.src}
                                            alt={item.alt}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                ))}
                                <div className="col-span-2 aspect-video overflow-hidden rounded-2xl border border-neutral-800 bg-[#111111]">
                                    <img
                                        src={VISUAL_ARTS_GRID.bottomWide.src}
                                        alt={VISUAL_ARTS_GRID.bottomWide.alt}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-950/80">
                                <Video className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-bold text-white">Broadcast & Motion</span>
                        </div>
                        <div className="mb-16 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                            {BROADCAST_ITEMS.map((item) => (
                                <article
                                    key={item.id}
                                    className="overflow-hidden rounded-2xl border border-neutral-800 bg-[#111111] md:rounded-3xl"
                                >
                                    <div className="relative aspect-[16/10] bg-neutral-900 md:aspect-video">
                                        <img
                                            src={item.image}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                                        <div className="absolute bottom-0 left-0 right-0 p-5">
                                            {item.live ? (
                                                <span className="inline-block rounded-md bg-red-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                                                    LIVE STREAM
                                                </span>
                                            ) : null}
                                            <h3 className="mt-3 text-base font-black uppercase leading-tight text-white md:text-xl">
                                                {item.title}
                                            </h3>
                                            <p className="mt-1.5 text-xs text-gray-400">
                                                {item.views}
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-12">
                            <div className="lg:col-span-5">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-yellow-500/30 bg-yellow-500/10">
                                        <PenTool className="h-4 w-4 text-yellow-400" />
                                    </div>
                                    <span className="font-bold text-white">
                                        Editorial & Blogs
                                    </span>
                                </div>
                                <div className="flex flex-col gap-4">
                                    {EDITORIAL_ITEMS.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <article
                                                key={item.id}
                                                className="flex gap-4 rounded-2xl border border-neutral-800 bg-[#111111] p-5"
                                            >
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-yellow-500/20 bg-yellow-500/10">
                                                    <Icon className="h-5 w-5 text-yellow-400" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#FBBF24]">
                                                        {item.category}
                                                    </p>
                                                    <p className="mt-2 text-sm font-bold leading-snug text-white">
                                                        {item.title}
                                                    </p>
                                                    <p className="mt-2 text-xs text-gray-500">
                                                        {item.date}
                                                    </p>
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="lg:col-span-7">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/10">
                                        <MessageSquare className="h-4 w-4 text-blue-400" />
                                    </div>
                                    <span className="font-bold text-white">
                                        Caption Writing
                                    </span>
                                </div>
                                <article className="rounded-2xl border border-neutral-800 bg-[#111111] p-5">
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FBBF24] text-sm font-black text-black">
                                            M
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">
                                                {CAPTION_POST.author}
                                            </p>
                                            <p className="flex items-center gap-1 text-xs text-gray-500">
                                                {CAPTION_POST.timestamp}
                                                <Globe className="h-3 w-3" />
                                            </p>
                                        </div>
                                    </div>
                                    <p className="mb-3 text-sm leading-relaxed text-gray-200">
                                        {CAPTION_POST.body}
                                    </p>
                                    <p className="mb-4 text-sm text-blue-400">
                                        {CAPTION_POST.hashtags.join(' ')}
                                    </p>
                                    <div className="mb-4 aspect-video overflow-hidden rounded-xl bg-neutral-800">
                                        <img
                                            src={CAPTION_POST.image}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex items-center gap-6 border-t border-neutral-800 pt-4 text-sm text-gray-500">
                                        <button
                                            type="button"
                                            className="flex items-center gap-2 transition-colors hover:text-gray-300"
                                        >
                                            <Heart className="h-4 w-4" />
                                            Like
                                        </button>
                                        <button
                                            type="button"
                                            className="flex items-center gap-2 transition-colors hover:text-gray-300"
                                        >
                                            <MessageCircle className="h-4 w-4" />
                                            Comment
                                        </button>
                                        <button
                                            type="button"
                                            className="flex items-center gap-2 transition-colors hover:text-gray-300"
                                        >
                                            <Share2 className="h-4 w-4" />
                                            Share
                                        </button>
                                    </div>
                                </article>
                            </div>
                        </div>

                        <div className="mb-4 flex items-center gap-2 font-bold text-green-400">
                            <Mic className="h-5 w-5" />
                            On-Air Talent
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-4">
                            {ON_AIR_TALENT.map((talent, index) => (
                                <article
                                    key={`${talent.name}-${index}`}
                                    className="overflow-hidden rounded-2xl border border-neutral-800 bg-[#111111]"
                                >
                                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-800">
                                        <img
                                            src={talent.image}
                                            alt={talent.name}
                                            className="h-full w-full object-cover object-top"
                                        />
                                        <div className="absolute bottom-0 w-full bg-gradient-to-t from-[#0A0A0A] to-transparent p-2 sm:p-4">
                                            <h3 className="mb-0.5 text-[10px] font-bold text-white sm:text-xs">
                                                {talent.name}
                                            </h3>
                                            <p className="text-[8px] font-bold uppercase leading-tight tracking-wider text-green-400 sm:text-[10px]">
                                                {talent.roleLines.map((line, lineIndex) => (
                                                    <span key={line}>
                                                        {lineIndex > 0 ? <br /> : null}
                                                        {line}
                                                    </span>
                                                ))}
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section>
                        <div className="text-center">
                            <div className="mb-4 inline-flex rounded-full border border-purple-500/50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-purple-300">
                                Functional Divisions
                            </div>
                            <h2 className="text-3xl font-bold md:text-4xl">Functional Divisions</h2>
                            <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-400 md:text-base">
                                Specialized teams that power every part of our content and
                                social media operations.
                            </p>
                        </div>
                        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {FUNCTIONAL_DIVISIONS.map((division) => {
                                const Icon = division.icon;
                                return (
                                    <article
                                        key={division.title}
                                        className={`relative overflow-hidden rounded-xl border border-neutral-800 bg-[#111111] p-6 transition-colors hover:bg-[#151515] ${division.borderColor} border-x border-b border-t-2`}
                                    >
                                        <Icon
                                            className={`mb-4 h-6 w-6 ${division.iconColor}`}
                                        />
                                        <h3 className="mb-2 font-bold text-white">
                                            {division.title}
                                        </h3>
                                        <p className="text-sm leading-relaxed text-gray-400">
                                            {division.description}
                                        </p>
                                    </article>
                                );
                            })}
                        </div>
                    </section>

                    <section>
                        <div className="text-center">
                            <h2 className="text-3xl font-bold md:text-4xl">Leadership</h2>
                        </div>

                        <article className="mx-auto mt-8 flex max-w-5xl flex-col overflow-hidden rounded-3xl bg-[#1a1a1a] md:flex-row">
                            <div className="aspect-[4/5] w-full shrink-0 md:aspect-auto md:w-56 lg:w-64">
                                <img
                                    src={DEPARTMENT_HEAD.image}
                                    alt={DEPARTMENT_HEAD.name}
                                    className="h-full w-full object-cover object-top md:min-h-[280px]"
                                />
                            </div>
                            <div className="flex flex-col justify-center p-6 sm:p-8 md:py-10 md:pl-8 md:pr-10 lg:pl-10 lg:pr-12">
                                <p className="text-xs font-bold uppercase tracking-wider text-purple-500">
                                    {DEPARTMENT_HEAD.role}
                                </p>
                                <h3 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                                    {DEPARTMENT_HEAD.name}
                                </h3>
                                <blockquote className="mt-4 border-l-2 border-purple-500 pl-4 text-sm leading-relaxed text-gray-300">
                                    &ldquo;{DEPARTMENT_HEAD.description}&rdquo;
                                </blockquote>
                            </div>
                        </article>

                        <h4 className="mb-6 mt-16 text-center text-sm font-bold uppercase tracking-widest text-gray-400">
                            Functional Division Heads
                        </h4>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-6">
                            {DIVISION_HEADS.map((head) => (
                                <article
                                    key={head.name}
                                    className="relative aspect-square overflow-hidden rounded-xl border border-neutral-800 bg-[#111111]"
                                >
                                    <img
                                        src={head.image}
                                        alt={head.name}
                                        className="h-full w-full object-cover object-top"
                                    />
                                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-[#0A0A0A] to-transparent p-2">
                                        <p className="text-center text-[10px] font-bold text-white sm:text-xs">
                                            {head.name}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="pb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold">Have a Story to Tell?</h2>
                        <p className="mx-auto mb-8 max-w-lg text-sm text-gray-400">
                            Join our team or reach out—we are always looking for voices that
                            can move the student-gaming community forward.
                        </p>
                        <div className="flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
                            <Link
                                href="/about"
                                className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-bold transition-opacity hover:opacity-90 sm:w-auto sm:px-8"
                            >
                                View Open Roles
                            </Link>
                            <Link
                                href="/"
                                className="w-full rounded-lg border border-neutral-800 bg-[#1A1A1A] px-6 py-3 text-sm font-bold transition-colors hover:bg-[#222222] sm:w-auto sm:px-8"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </MainLayout>
    );
}
