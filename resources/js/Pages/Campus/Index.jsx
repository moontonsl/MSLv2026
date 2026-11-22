import { useEffect, useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { FaFacebook } from 'react-icons/fa';
import {
    ArrowRight,
    Building2,
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Clock,
    Globe2,
    MapPin,
    Search,
    ShieldCheck,
    Sparkles,
    Users,
    Trophy,
} from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import DepartmentBadge from '@/Components/DepartmentBadge';
import HoverOutline from '@/Components/HoverOutline';
import { PUBLIC_ROUTES } from '@/data/siteNavigation';
import typography from '../ContentMedia.module.css';
import styles from './Campus.module.css';
import CampusTeam from './CampusTeam';
import {
    campusCommunities,
    campusJoinSteps,
    campusJourney,
    campusOpenRoles,
    campusPillars,
    campusPrograms,
    campusStats,
} from './campusData';

const PAGE_SIZE = 6;

const sectionTitleClass =
    `${typography.sectionTitle} text-white`;

const tierStyles = {
    'Level III': 'border-purple-400/40 bg-purple-500/10 text-purple-300',
    'Level II': 'border-teal-400/40 bg-teal-500/10 text-teal-300',
    'Level I': 'border-white/15 bg-white/5 text-gray-300',
};

function Pagination({ currentPage, pageCount, onChange }) {
    const groupSize = Math.min(3, pageCount);
    const firstGroup = Array.from({ length: groupSize }, (_, index) => index + 1);
    const lastGroup = Array.from(
        { length: groupSize },
        (_, index) => pageCount - groupSize + index + 1,
    );
    const isInEdgeGroup = currentPage <= groupSize || currentPage >= pageCount - groupSize + 1;
    const currentGroup = isInEdgeGroup
        ? firstGroup
        : Array.from({ length: groupSize }, (_, index) => currentPage - groupSize + index + 1);
    const hasGap = currentGroup[currentGroup.length - 1] < lastGroup[0] - 1;
    const combinedPages = [...new Set([...currentGroup, ...lastGroup])].sort((first, second) => first - second);
    const pages = hasGap
        ? [...currentGroup, 'ellipsis', ...lastGroup]
        : combinedPages;

    return (
        <div className="grid w-full grid-cols-2 items-center gap-3 lg:grid-cols-[1fr_auto_1fr] lg:gap-4">
            <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => onChange(currentPage - 1)}
                className={`${styles.primaryButton} col-start-1 row-start-1 inline-flex h-9 w-fit items-center justify-center gap-1 rounded-lg border border-blue-500 bg-blue-600 px-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40`}
            >
                <ChevronLeft className="h-5 w-5" />
                Previous
            </button>

            <nav
                className="col-span-2 row-start-2 flex flex-wrap items-center justify-center gap-0.5 lg:col-span-1 lg:col-start-2 lg:row-start-1"
                aria-label="Community directory pagination"
            >
                {pages.map((page, index) => page === 'ellipsis' ? (
                    <span key={`ellipsis-${index}`} className="flex h-10 w-10 items-center justify-center text-sm text-gray-300">
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        type="button"
                        onClick={() => onChange(page)}
                        aria-current={currentPage === page ? 'page' : undefined}
                        className={`h-10 w-10 rounded-lg text-sm font-medium transition ${
                            currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-300 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                        {page}
                    </button>
                ))}
            </nav>

            <button
                type="button"
                disabled={currentPage === pageCount}
                onClick={() => onChange(currentPage + 1)}
                className={`${styles.primaryButton} col-start-2 row-start-1 inline-flex h-9 w-fit items-center justify-center justify-self-end gap-1 rounded-lg border border-blue-500 bg-blue-600 px-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40 lg:col-start-3`}
            >
                Next
                <ChevronRight className="h-5 w-5" />
            </button>
        </div>
    );
}

function SectionHeading({ title, description, centered = true }) {
    return (
        <div className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
            <h2 className={sectionTitleClass}>{title}</h2>
            <p className={`mt-3 text-gray-300 ${typography.sectionDescription}`}>{description}</p>
        </div>
    );
}

export default function Campus({ campusMetrics = {}, communityDirectory = null }) {
    // Backend keys remain stable when the visible labels or order change.
    // Nullish fallback preserves a genuine zero supplied by the server.
    const heroStats = campusStats.map((stat) => ({
        ...stat,
        value: campusMetrics[stat.id] ?? stat.value,
    }));
    const directoryEntries = Array.isArray(communityDirectory) ? communityDirectory : campusCommunities;
    const [search, setSearch] = useState('');
    const [region, setRegion] = useState('All Regions');
    const [currentPage, setCurrentPage] = useState(1);

    const regions = useMemo(
        () => ['All Regions', ...new Set(directoryEntries.map((community) => community.region))],
        [directoryEntries],
    );

    const filteredCommunities = useMemo(() => {
        const query = search.trim().toLowerCase();

        return directoryEntries.filter((community) => {
            const matchesRegion = region === 'All Regions' || community.region === region;
            const matchesQuery =
                !query ||
                [community.school, community.community, community.region, community.tier]
                    .join(' ')
                    .toLowerCase()
                    .includes(query);

            return matchesRegion && matchesQuery;
        });
    }, [directoryEntries, region, search]);

    const pageCount = Math.max(1, Math.ceil(filteredCommunities.length / PAGE_SIZE));
    const pageCommunities = filteredCommunities.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [region, search]);

    useEffect(() => {
        if (currentPage > pageCount) {
            setCurrentPage(pageCount);
        }
    }, [currentPage, pageCount]);

    return (
        <>
            <Head title="Campus Department">
                <link head-key="csmd-raleway" rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Raleway:wght@700&display=swap" />
            </Head>

            <MainLayout fullWidth>
                <div className={`${styles.page} ${typography.typography} ${typography.interactionScope} overflow-hidden bg-[#050505] text-white`}>
                    <section className="relative border-b border-white/10">
                        <div className="absolute -left-40 top-0 h-96 w-96 rotate-12 bg-blue-600/10 blur-3xl" />
                        <div className="absolute -right-32 bottom-0 h-96 w-96 bg-blue-400/10 blur-3xl" />

                        <div className="relative mx-auto grid max-w-7xl gap-14 px-4 py-12 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
                            <div className="text-center lg:text-left">
                                <DepartmentBadge icon={Building2} tone="blue" className={typography.departmentBadge}>
                                    Campus Department
                                </DepartmentBadge>

                                <h1 className={`mx-auto mt-6 max-w-3xl text-white lg:mx-0 ${typography.heroTitle}`}>
                                    United by <br />
                                    <span className="text-blue-500">School Spirit.</span>
                                </h1>
                                <p className={`mx-auto mt-6 max-w-xl text-gray-300 lg:mx-0 ${typography.heroDescription}`}>
                                    We manage the largest network of Collegiate and High School gaming communities
                                    in the Philippines. From Luzon to Mindanao, we empower student
                                    leaders to build thriving esports communities.
                                </p>

                                <div className="mt-6 flex flex-col gap-2.5 sm:flex-row lg:mt-8">
                                    <a
                                        href="#community-directory"
                                        className={`${styles.primaryButton} inline-flex min-h-[60px] w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-7 py-4 font-semibold text-white transition hover:bg-blue-500 sm:w-auto`}
                                    >
                                        Find Your School
                                        <Search className="h-5 w-5" />
                                    </a>
                                    <a
                                        href="https://tally.so/r/w261dL"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`${styles.secondaryButton} inline-flex min-h-[60px] w-full items-center justify-center rounded-xl border border-white/10 bg-[#18181b] px-7 py-4 font-semibold text-gray-200 sm:w-auto`}
                                    >
                                        Start an MSL Community
                                    </a>
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/30 pt-8 sm:mt-10 sm:gap-6 lg:text-left">
                                    {heroStats.map((stat) => (
                                        <div key={stat.id} className="text-center">
                                            <div className="font-heading text-2xl font-extrabold leading-6 sm:text-3xl sm:leading-normal">
                                                {stat.value}
                                            </div>
                                            <div className="mt-1 text-[10px] uppercase tracking-wider text-gray-400 sm:text-xs">
                                                {stat.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative mx-auto hidden w-full max-w-lg lg:block">
                                <div className="relative mx-auto aspect-[4/5] w-[72%] overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900 shadow-2xl shadow-blue-950/50">
                                    <img
                                        src="/Images/Campus/campus-hero.jpg"
                                        alt="Students playing Mobile Legends together during a campus community match"
                                        className={`${styles.portraitImage} h-full w-full object-cover object-[45%_center]`}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/20 to-transparent" />
                                    <div className="absolute inset-x-0 bottom-0 p-7">
                                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-200">
                                            <span className="h-2 w-2 rounded-full bg-green-500" />
                                            Live Tournament
                                        </div>
                                        <div className="mt-2 font-heading text-3xl font-extrabold">
                                            Campus <br></br>Showdown
                                        </div>
                                        <div className="mt-1 text-sm text-slate-300">
                                            Monthly Community Match
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute left-[-25px] top-[25px] w-48 -rotate-3 rounded-xl border border-white/10 bg-slate-950/60 p-4 shadow-xl backdrop-blur">
                                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                        <ShieldCheck className="h-5 w-5 text-blue-400" />
                                        Status
                                    </div>
                                    <div className="mt-3 text-sm font-bold">Accredited Community</div>
                                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                                        <div className="h-full w-4/5 bg-blue-500" />
                                    </div>
                                </div>

                                <div className="absolute bottom-[-25px] right-0 w-52 -rotate-2 rounded-2xl border border-white/10 bg-slate-950/60 p-5 shadow-xl backdrop-blur">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                Coverage
                                            </div>
                                            <div className="mt-1 font-bold">Nationwide Reach</div>
                                        </div>
                                        <Globe2 className="h-5 w-5 text-blue-400 mt-1" />
                                    </div>
                                    <div className="mt-4 border-t border-white/10 pt-3 text-[10px] text-slate-400 whitespace-nowrap">
                                        Luzon / Visayas / Mindanao
                                        <span className="inline-block ml-2 align-middle rounded-md bg-blue-500/20 px-2 py-1 text-[10px] font-bold text-blue-400 border border-blue-400/30">
                                            PH
                                        </span>
                                    </div>
                                </div>

                                <div className="absolute top-[35px] right-[-50px] rotate-[25deg] rounded-2xl border border-brand-500/30 bg-brand-500/10 p-4 shadow-[0_0_25px_rgba(242,194,26,.35)] backdrop-blur-md">
                                    <Trophy className="h-8 w-8 text-brand-500" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="campus-pillars" className="border-b border-white/10 bg-[#0b0b0b] py-12 sm:py-24">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6">
                            <SectionHeading
                                title="What We Do"
                                description="The Campus Department operates on three core pillars to ensure sustainability and growth for every community."
                            />
                            <div className="mt-6 grid gap-5 sm:mt-12 sm:gap-6 md:grid-cols-3">
                                {campusPillars.map(({ title, description, Icon }) => (
                                    <article
                                        key={title}
                                        className={`${styles.sectionCard} cursor-pointer rounded-2xl border border-white/10 bg-[#111111] px-4 py-8 sm:p-7`}
                                    >
                                        <div className={`${styles.cardIcon} inline-flex rounded-xl bg-blue-500/10 p-3 text-blue-400`}>
                                            <Icon className="h-7 w-7" />
                                        </div>
                                        <h3 className="mt-4 font-sans text-xl font-bold sm:mt-6 sm:font-heading">{title}</h3>
                                        <p className="mt-1 text-sm leading-[22px] text-gray-400 sm:mt-4 sm:leading-7">
                                            {description
                                                .split(/(Campus Tournaments)/g)
                                                .map((part, i) =>
                                                    part === 'Campus Tournaments' ? (
                                                        <span key={i} className="font-semibold text-gray-200">
                                                            {part}
                                                        </span>
                                                    ) : (
                                                        part
                                                    )
                                                )}
                                        </p>
                                        <HoverOutline />
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="bg-[#0b0b0b] py-12 sm:bg-[#050505] sm:py-24">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6">
                            <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:items-center sm:text-left">
                                <div className="max-w-3xl">
                                    <h2 className="font-heading text-4xl font-bold leading-[44px] text-white lg:text-[60px] lg:font-extrabold lg:leading-[72px]">
                                        Exclusive Programs
                                    </h2>
                                    <p className="mt-4 text-sm leading-[22px] text-white sm:mt-2 sm:text-[18px] sm:leading-[28px]">
                                        Initiatives designed specifically for our accredited campus communities.
                                    </p>
                                </div>

                                <Link
                                    href={PUBLIC_ROUTES.programs}
                                    className="flex items-center gap-2 text-[16px] font-semibold text-blue-500 hover:text-blue-400"
                                >
                                    View All MSL Programs
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>

                            <div className="mt-6 grid gap-5 sm:mt-12 sm:gap-6 lg:grid-cols-2">
                                <article className={`${styles.sectionCard} relative flex min-h-[565px] flex-col justify-between gap-6 overflow-hidden rounded-3xl border border-white/10 bg-[#0D1526] p-6 text-left sm:min-h-0 sm:flex-row sm:p-10`}>
                                    <img src={campusPrograms[0].image} alt=""
                                        style={{ objectPosition: campusPrograms[0].imagePosition }}
                                        className="absolute inset-0 h-full w-full object-cover" />
                                    <div className="absolute inset-0 bg-black/80" />
                                    <div className="relative max-w-md">
                                        <div className="inline-flex rounded-full bg-blue-900/30 px-4 py-2">
                                            <span className="text-xs font-bold uppercase tracking-widest text-blue-300">Flagship System</span>
                                        </div>
                                        <h3 className="mt-4 text-2xl font-extrabold leading-8 text-white">{campusPrograms[0].title}</h3>
                                        <p className="mt-4 max-w-[380px] text-sm leading-[22px] text-white">{campusPrograms[0].description}</p>
                                        <ul className="mt-6 space-y-3">
                                            {campusPrograms[0].benefits.map((benefit) => (
                                                <li key={benefit} className="flex items-center gap-3">
                                                    <Check className="h-5 w-5 shrink-0 text-blue-300" />
                                                    <span className="text-sm text-white">{benefit}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <HoverOutline />
                                </article>
                                <div className="grid gap-5 sm:gap-6">
                                    {campusPrograms.slice(1).map((program) => {
                                        const external = program.href.startsWith('https://');
                                        const Action = external ? 'a' : Link;
                                        return (
                                            <article key={program.id} className={`${styles.sectionCard} relative overflow-hidden rounded-2xl border border-white/10 bg-[#121212] p-6`}>
                                                <img src={program.image} alt="" style={{ objectPosition: program.imagePosition }} className="absolute inset-0 h-full w-full object-cover" />
                                                <div className="absolute inset-0 bg-black/80" />
                                                <div className="relative">
                                                    <div className="flex items-center gap-3">
                                                        <Trophy className="h-5 w-5 text-blue-300" />
                                                        <h3 className="text-lg font-bold text-white">{program.title}</h3>
                                                    </div>
                                                    <p className="mt-4 text-sm leading-[22px] text-gray-300">{program.description}</p>
                                                    <Action href={program.href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                                        className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold ${program.id === 'monthly-tournaments' ? `${styles.primaryButton} bg-blue-600 text-white` : `${styles.secondaryButton} border border-gray-700 text-gray-200`}`}>
                                                        {program.action}<ArrowRight className="h-4 w-4" />
                                                    </Action>
                                                </div>
                                                <HoverOutline />
                                            </article>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="border-y border-white/10 bg-[#0b0b0b] py-12 sm:py-24">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6">
                            <SectionHeading
                                title="Journey to Level III"
                                description="How your student community grows within the MSL ecosystem."
                            />
                            <div className="relative mt-8 grid gap-5 sm:mt-14 sm:gap-8 md:grid-cols-4 md:items-start">
                                {/* MOBILE VERTICAL LINE */}
                                <div
                                    className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] md:hidden"
                                    style={{
                                        background: 'linear-gradient(180deg, #4F46E5 0%, #374151 100%)'
                                    }}
                                />

                                {/* DESKTOP LINE (already yours) */}
                                <div
                                    className="absolute left-0 right-0 top-1/2 -translate-y-1/2 hidden h-[2px] md:block"
                                    style={{
                                        background: 'linear-gradient(90deg, #4F46E5 0%, #374151 100%)'
                                    }}
                                />
                                {campusJourney.map((step) => (
                                    <article key={step.number}
                                        style={{ '--journey-accent': { '01': '255 255 255', '02': '59 130 246', '03': '168 85 247', '04': '242 194 26' }[step.number] }}
                                        className={`${styles.journeyCard} relative cursor-pointer rounded-2xl border border-white/10 bg-[#0f0f0f] p-6 text-center`}>
                                        {/* NUMBER INSIDE */}
                                        <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 bg-[#0b0b0b] font-bold ${step.accent}`}>
                                            {step.number}
                                        </div>

                                        {/* TITLE */}
                                        <h3 className="mt-5 text-lg font-bold text-white">
                                            {step.title}
                                        </h3>

                                        {/* DESC */}
                                        <p className="mt-2 text-sm text-gray-400">
                                            {step.description}
                                        </p>
                                        <HoverOutline />
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="py-12 sm:py-24">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6">
                            <CampusTeam />
                        </div>
                    </section>

                    <section id="community-directory" className="border-y border-white/10 bg-[#0b0b0b] py-12 sm:py-24">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6">
                            <div className="flex flex-col gap-6 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
                                {/* LEFT TEXT */}
                                <div>
                                    <h2 className="font-heading text-4xl font-bold leading-[44px] text-white lg:text-3xl">
                                        Community Directory
                                    </h2>

                                    <p className="mt-3 text-sm leading-[22px] text-gray-300 lg:mt-2 lg:text-base">
                                        Browse our{' '}
                                        <span className="text-blue-500">
                                            network of official campus communities.
                                        </span>
                                    </p>
                                </div>

                                    {/* RIGHT FILTERS */}
                                <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
                                    
                                    {/* SEARCH */}
                                    <label className="relative w-full sm:w-[320px]">
                                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                                        <input
                                            type="search"
                                            value={search}
                                            onChange={(event) => setSearch(event.target.value)}
                                            placeholder="Search events, schools, location ..."
                                            className="w-full rounded-xl border border-white/10 bg-[#111111] py-3 pl-12 pr-4 text-white placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-0"
                                        />
                                    </label>

                                    {/* DROPDOWN */}
                                    <label className="relative w-full sm:w-[200px]">
                                        <select
                                            value={region}
                                            onChange={(event) => setRegion(event.target.value)}
                                            className="w-full appearance-none rounded-xl border-0 bg-[#111111] bg-none px-4 py-3 pr-10 text-gray-300 shadow-none outline-none focus:outline-none focus:ring-0"
                                        >
                                            {regions.map((option) => (
                                                <option key={option}>{option}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                                    </label>
                                </div>
                            </div>

                                <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
                                    <div className="hidden grid-cols-[2fr_1fr_0.7fr_0.6fr_0.8fr] gap-4 bg-white/5 px-6 py-4 text-xs font-bold uppercase tracking-wide text-gray-400 md:grid">
                                        <div>School / Community</div>
                                        <div>Region</div>
                                        <div>Status</div>
                                        <div>Members</div>
                                        <div>Join Community</div>
                                    </div>

                                    {filteredCommunities.length ? (
                                        pageCommunities.map((community) => {
                                            const isExternalHref = /^https?:\/\//i.test(community.href || '');
                                            return (
                                            <article
                                                key={community.id ?? community.school}
                                                className={`${styles.communityRow} relative cursor-pointer grid gap-3 border-t border-white/10 bg-[#121212] px-6 py-4 first:border-t-0 md:grid-cols-[2fr_1fr_0.7fr_0.6fr_0.8fr] md:items-center md:gap-4 md:bg-[#111111] md:p-5 md:px-6`}
                                            >
                                                <div className="flex min-w-0 items-center gap-4 border-b border-white/20 pb-4 pr-20 md:border-0 md:pb-0 md:pr-0">
                                                    <div className="min-w-0">
                                                        <h3 className="font-bold leading-6 md:truncate">{community.school}</h3>
                                                        {community.community ? (
                                                            <p className="mt-1 truncate text-xs text-gray-400">{community.community}</p>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm font-semibold text-gray-300 md:block">
                                                    {/* MOBILE: Region + Members inline */}
                                                    <div className="flex items-center gap-4 md:hidden">
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="h-4 w-4 text-blue-400" />
                                                            {community.region}
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <Users className="h-4 w-4 text-gray-500" />
                                                            {Number(community.members || 0).toLocaleString()}
                                                        </div>
                                                    </div>

                                                    {/* DESKTOP: Region only */}
                                                    <div className="hidden md:flex items-center gap-2">
                                                        {community.region}
                                                    </div>

                                                </div>
                                                <div className="absolute right-6 top-4 md:static">
                                                    <span className={`inline-flex whitespace-nowrap rounded-md border px-2.5 py-1 text-xs font-bold uppercase ${tierStyles[community.tier] ?? tierStyles['Level I']}`}>
                                                        {community.tier}
                                                    </span>
                                                </div>
                                                
                                                {/* MEMBERS (DESKTOP ONLY) */}
                                                <div className="hidden md:flex items-center gap-2 text-sm font-semibold text-gray-300">
                                                    {Number(community.members || 0).toLocaleString()}
                                                </div>
                                                
                                                <a
                                                    href={community.href || '#accreditation'}
                                                    target={isExternalHref ? '_blank' : undefined}
                                                    rel={isExternalHref ? 'noopener noreferrer' : undefined}
                                                    className={`${styles.stretchedLink} ${styles.facebookButton} mt-1 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1877F2] px-4 py-2 text-sm font-semibold text-white md:mt-0 md:w-fit`}
                                                >
                                                    <FaFacebook className="h-5 w-5 shrink-0" aria-hidden="true" />
                                                    Join Group
                                                </a>
                                                <HoverOutline color="rgb(96 165 250)" />
                                            </article>
                                            );
                                        })
                                    ) : (
                                        <div className="bg-[#111111] px-6 py-14 text-center text-gray-400">
                                            No campus communities match your search.
                                        </div>
                                    )}
                                </div>

                                {filteredCommunities.length ? (
                                    <div className="border-x border-b border-white/10 px-4 py-4 sm:px-6">
                                        <Pagination currentPage={currentPage} pageCount={pageCount} onChange={setCurrentPage} />
                                    </div>
                                ) : null}
                        </div>
                    </section>

                    <section id="open-roles" aria-labelledby="open-roles-title" className="bg-[#0b0b0b] py-12 sm:py-24">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6">
                            <div id="open-roles-title">
                                <SectionHeading
                                    centered={false}
                                    title="Open Roles"
                                    description="Find your place in the Land of Dawn."
                                />
                            </div>

                            <div className="mt-12 flex items-center gap-3 lg:mt-14">
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                                    <Building2 className="h-4 w-4" aria-hidden="true" />
                                </span>
                                <h3 className="font-heading text-lg font-bold text-white">Campus Department</h3>
                            </div>

                            <ul className="mt-5 flex flex-col gap-4">
                                {campusOpenRoles.map((role) => (
                                    <li
                                        key={role.id}
                                        className={`${styles.sectionCard} ${styles.brandCard} flex flex-col gap-6 rounded-2xl border border-white/10 bg-[#121212] p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:p-8`}
                                    >
                                        <div className="min-w-0">
                                            <h4 className="text-base font-bold text-white sm:text-lg">{role.title}</h4>
                                            <p className="mt-2 text-sm leading-[22px] text-gray-400">{role.description}</p>
                                            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                                                <span className="inline-flex items-center gap-1.5">
                                                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                                                    {role.location}
                                                </span>
                                                <span className="inline-flex items-center gap-1.5">
                                                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                                                    {role.schedule}
                                                </span>
                                            </div>
                                        </div>
                                        <a
                                            href={role.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`Apply now for ${role.title} (opens in a new tab)`}
                                            className={`${styles.applyButton} relative z-10 inline-flex w-full shrink-0 items-center justify-center gap-2 min-h-[44px] rounded-lg border border-[#D4A810] bg-[#F2C21A] px-6 py-2.5 text-sm font-bold text-[#18181B] hover:text-[#18181B] focus-visible:text-[#18181B] sm:w-auto`}
                                        >
                                            Apply Now
                                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                        </a>
                                        <HoverOutline />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    <section id="how-to-join" aria-labelledby="how-to-join-title" className="border-y border-white/10 bg-black py-12 sm:py-24">
                        <div className="mx-auto max-w-6xl px-4 sm:px-6">
                            <h2 id="how-to-join-title" className="text-center font-heading text-3xl font-bold text-white">
                                How to Join
                            </h2>

                            <div className="relative mt-10 sm:mt-14">
                                <ol className="relative grid gap-8 md:grid-cols-4 md:gap-6">
                                    {campusJoinSteps.map((step) => (
                                        <li key={step.number} className={`${styles.joinStep} relative flex gap-4 md:flex-col md:items-center md:gap-0 md:text-center`}>
                                            <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-brand-500 bg-black text-sm font-bold text-brand-500 shadow-[0_0_16px_rgba(242,194,26,0.35)]">
                                                {step.number}
                                            </span>
                                            <div className="md:mt-5">
                                                <h3 className="text-base font-bold text-brand-500">{step.title}</h3>
                                                <p className="mt-1 text-sm leading-[22px] text-gray-400">{step.description}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    </section>

                    <section id="accreditation" className="relative overflow-hidden border-b border-white/30 bg-white/5 py-24 sm:py-28">
                        <div className="absolute inset-0 bg-blue-600/10" />
                        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 bg-blue-500/20 blur-3xl" />
                        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
                            <h2 className="font-heading text-3xl font-bold leading-[38px] sm:mt-7 sm:text-5xl sm:font-extrabold">
                                Don&apos;t See Your School?
                            </h2>
                            <p className="mx-auto mt-5 max-w-2xl text-base leading-[26px] text-white sm:text-lg sm:leading-8 sm:text-gray-300">
                                Be the one to bring the Moonton Student Leaders program to your campus. 
                                Establish a legacy, lead your peers, and unlock exclusive opportunities.
                            </p>
                            <a
                                href="https://tally.so/r/w261dL"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${styles.primaryButton} mt-8 inline-flex min-h-[60px] w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white sm:w-auto`}
                            >
                                Apply for Accreditation
                                <ArrowRight className="h-5 w-5" />
                            </a>
                        </div>
                    </section>
                </div>
            </MainLayout>
        </>
    );
}
