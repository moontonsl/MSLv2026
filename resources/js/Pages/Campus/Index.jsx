import { useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle, Star, Wallet, Shield } from 'lucide-react';
import { Facebook } from 'lucide-react';
import {
    ArrowRight,
    Building2,
    Check,
    ChevronDown,
    Globe2,
    MapPin,
    Search,
    ShieldCheck,
    Sparkles,
    Users,
    Trophy,
    TrendingUp,
} from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import {
    accreditationBenefits,
    campusCommunities,
    campusJourney,
    campusPillars,
    campusPrograms,
    campusStats,
    departmentHead,
    regionalAdmins,
} from './campusData';

const sectionTitleClass =
    'font-heading text-4xl font-bold leading-[44px] text-white sm:text-4xl lg:text-5xl lg:font-extrabold lg:leading-tight';

const tierStyles = {
    'Tier A': 'border-purple-400/40 bg-purple-500/10 text-purple-300',
    'Tier B': 'border-teal-400/40 bg-teal-500/10 text-teal-300',
    'Tier C': 'border-white/15 bg-white/5 text-gray-300',
};

function SectionHeading({ title, description, centered = true }) {
    return (
        <div className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
            <h2 className={sectionTitleClass}>{title}</h2>
            <p className="mt-4 text-sm leading-[22px] text-gray-300 sm:text-base sm:leading-7">{description}</p>
        </div>
    );
}

export default function Campus() {
    const [search, setSearch] = useState('');
    const [region, setRegion] = useState('All Regions');

    const regions = useMemo(
        () => ['All Regions', ...new Set(campusCommunities.map((community) => community.region))],
        [],
    );

    const filteredCommunities = useMemo(() => {
        const query = search.trim().toLowerCase();

        return campusCommunities.filter((community) => {
            const matchesRegion = region === 'All Regions' || community.region === region;
            const matchesQuery =
                !query ||
                [community.school, community.community, community.region, community.tier]
                    .join(' ')
                    .toLowerCase()
                    .includes(query);

            return matchesRegion && matchesQuery;
        });
    }, [region, search]);

    return (
        <>
            <Head title="Campus" />

            <MainLayout fullWidth>
                <div className="overflow-hidden bg-[#050505] font-sans text-white">
                    <section className="relative border-b border-white/10">
                        <div className="absolute -left-40 top-0 h-96 w-96 rotate-12 bg-blue-600/10 blur-3xl" />
                        <div className="absolute -right-32 bottom-0 h-96 w-96 bg-blue-400/10 blur-3xl" />

                        <div className="relative mx-auto grid max-w-7xl gap-14 px-4 py-12 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
                            <div className="text-center lg:text-left">
                                <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-950/40 px-5 py-3 text-base font-semibold text-blue-400 lg:gap-3 lg:text-base lg:font-bold">
                                    <Building2 className="h-[18px] w-[18px] lg:h-5 lg:w-5" />
                                    Campus Department
                                </div>

                                <h1 className="mx-auto mt-6 max-w-3xl font-heading text-4xl font-bold leading-[44px] text-white sm:text-5xl lg:mx-0 lg:mt-7 lg:text-6xl lg:font-extrabold lg:leading-[1.08]">
                                    United by <br />
                                    <span className="text-blue-500">School Spirit.</span>
                                </h1>
                                <p className="mx-auto mt-6 max-w-2xl text-sm leading-[22px] text-white sm:text-lg sm:leading-8 lg:mx-0 lg:text-gray-300">
                                    We manage the largest network of collegiate gaming communities
                                    in the Philippines. From Luzon to Mindanao, we empower student
                                    leaders to build thriving esports communities.
                                </p>

                                <div className="mt-6 flex flex-col gap-2.5 sm:flex-row lg:mt-8">
                                    <a
                                        href="#community-directory"
                                        className="inline-flex min-h-[60px] w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-7 py-4 font-semibold text-white transition hover:bg-blue-500 sm:w-auto"
                                    >
                                        Find Your School
                                        <Search className="h-5 w-5" />
                                    </a>
                                    <a
                                        href="#accreditation"
                                        className="inline-flex min-h-[60px] w-full items-center justify-center rounded-xl border border-white/10 bg-[#18181b] px-7 py-4 font-semibold text-gray-200 transition hover:border-blue-500/50 hover:text-white sm:w-auto"
                                    >
                                        Start an MSL Community
                                    </a>
                                </div>

                                <div className="mt-6 grid grid-cols-3 gap-2 border-t border-white/30 pt-8 sm:mt-10 sm:gap-4 lg:text-left">
                                    {campusStats.map((stat) => (
                                        <div key={stat.label} className="text-center lg:text-left">
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
                                        src="/most used hero.png"
                                        alt="Campus esports community"
                                        className="h-full w-full object-cover"
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

                                <div className="absolute top-[35px] right-[-50px] rotate-[25deg] rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-4 shadow-[0_0_25px_rgba(250,204,21,.35)] backdrop-blur-md">
                                    <Trophy className="h-8 w-8 text-yellow-400" />
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
                                        className="rounded-2xl border border-white/10 bg-[#111111] px-4 py-8 transition hover:-translate-y-1 hover:border-blue-500/40 sm:p-7"
                                    >
                                        <div className="inline-flex rounded-xl bg-blue-500/10 p-3 text-blue-400">
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
                                    href="#"
                                    className="flex items-center gap-2 text-[16px] font-semibold text-blue-500 hover:text-blue-400"
                                >
                                    View All MSL Programs
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>

                            <div className="mt-6 grid gap-5 sm:mt-12 sm:gap-6 lg:grid-cols-2">
                                <article className="relative flex min-h-[565px] flex-col justify-between gap-6 overflow-hidden rounded-3xl border border-white/10 bg-[#0D1526] p-6 text-left sm:min-h-0 sm:flex-row sm:p-10">
                                    {/* LEFT CONTENT */}
                                    <div className="relative max-w-md">
                                        <div className="inline-flex rounded-full bg-blue-900/30 px-4 py-2">
                                            <span className="text-[12px] font-bold uppercase tracking-widest text-blue-300">
                                                Flagship System
                                            </span>
                                        </div>

                                        <h3 className="mt-4 text-[24px] font-extrabold leading-[32px] text-white">
                                            The Accreditation System
                                        </h3>

                                        <p className="mt-4 max-w-[380px] text-[14px] leading-[22px] text-white">
                                            A tiered framework (Tier C, Tier B, Tier A, Super School) that rewards active communities.
                                            The more active your chapter, the more support you receive—from diamond funding to official
                                            merchandise and event logistics.
                                        </p>

                                        {/* BENEFITS */}
                                        <ul className="mt-6 space-y-3">
                                            {accreditationBenefits.map((benefit) => {
                                                let Icon;

                                                if (benefit === 'Official Recognition') Icon = CheckCircle;
                                                else if (benefit === 'Monthly Diamond Support') Icon = Star;
                                                else if (benefit === 'Tournament Kits') Icon = Wallet;

                                                return (
                                                    <li key={benefit} className="flex items-center gap-3 text-[14px] leading-[20px] text-gray-300">
                                                        <Icon className="h-5 w-5 text-blue-400" />
                                                        <span className="text-[#D1D5DB]">{benefit}</span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>

                                    {/* RIGHT SIDE ICON BOX */}
                                    <div className="relative flex items-center justify-center sm:justify-end">
                                        <div className="mt-6 sm:mt-0 w-[180px] h-[180px] sm:w-[160px] sm:h-[160px] rounded-xl bg-blue-900/30 flex items-center justify-center">
                                            <Shield className="h-24 w-24 sm:h-20 sm:w-20 text-blue-300" />
                                        </div>
                                    </div>
                                </article>

                                <div className="grid gap-5 sm:gap-6">
                                    {campusPrograms.map(({ title, description, action, href, Icon }) => (
                                        <article
                                            key={title}
                                            className="rounded-2xl border border-white/10 bg-[#121212] p-6"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon
                                                    className={`h-5 w-5 ${
                                                        Icon === TrendingUp ? 'text-green-400' : 'text-yellow-400'
                                                    }`}
                                                />
                                                <h3 className="text-[18px] font-bold text-white">
                                                    {title}
                                                </h3>
                                            </div>

                                            <p className="mt-4 text-[14px] leading-[22px] text-gray-400">
                                                {description
                                                    .split(/(Monthly Online Tournaments|Onsite Events)/g)
                                                    .map((part, i) =>
                                                        part === 'Monthly Online Tournaments' || part === 'Onsite Events' ? (
                                                            <span key={i} className="font-semibold text-gray-200">
                                                                {part}
                                                            </span>
                                                        ) : (
                                                            part
                                                        )
                                                    )}
                                            </p>

                                            <Link
                                                href={href}
                                                className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[14px] font-bold ${
                                                    action === 'Find Your Tournament'
                                                        ? 'bg-blue-600 text-white hover:bg-blue-500'
                                                        : 'border border-gray-700 text-gray-200 hover:bg-white/5'
                                                }`}
                                            >
                                                {action}
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="border-y border-white/10 bg-[#0b0b0b] py-12 sm:py-24">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6">
                            <SectionHeading
                                title="Journey to Super School"
                                description="How your student community can grow within the MSL ecosystem."
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
                                    <article key={step.number} className="relative rounded-2xl border border-white/10 bg-[#0f0f0f] p-6 text-center transition hover:-translate-y-1 hover:border-white/20">
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
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="py-12 sm:py-24">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6">
                            <SectionHeading
                                title="Meet the Campus Team"
                                description="Dedicated managers ensuring every school and region gets the support it needs."
                            />

                            <div className="mx-auto mt-6 max-w-3xl rounded-[40px] border border-white/5 bg-[#121212] p-[22px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] sm:mt-12 sm:p-5">
                                <div className="flex flex-col overflow-hidden rounded-[30px] bg-white/5 sm:flex-row">
                                    
                                    {/* IMAGE */}
                                    <div className="h-[236px] w-full shrink-0 overflow-hidden rounded-t-[30px] sm:h-auto sm:w-[280px] sm:rounded-l-[30px] sm:rounded-tr-none">
                                        <img
                                            src={departmentHead.image}
                                            alt={departmentHead.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    {/* CONTENT */}
                                    <div className="flex flex-col justify-center gap-6 px-2.5 py-4 sm:p-8">
                                        
                                        {/* HEADER */}
                                        <div className="space-y-1">
                                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">
                                                {departmentHead.role}
                                            </div>

                                            <h3 className="text-2xl font-extrabold leading-8 text-white sm:text-[30px] sm:font-bold sm:leading-[38px]">
                                                {departmentHead.name}
                                            </h3>
                                        </div>

                                        {/* QUOTE */}
                                        <div className="flex gap-4">
                                            {/* LEFT GRADIENT BAR */}
                                            <div className="w-[2px] rounded-full bg-gradient-to-b from-blue-600 to-blue-500 self-stretch" />

                                            {/* TEXT WRAPPER */}
                                            <div className="flex-1">
                                                <p className="text-xs leading-[18px] text-white sm:text-[14px] sm:leading-[22px]">
                                                    “{departmentHead.quote}”
                                                </p>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 flex gap-3 sm:mt-12 sm:justify-start">
                                {/* BLUE VERTICAL LINE */}
                                <div className="h-6 w-[3px] rounded-full bg-blue-500" />

                                {/* TEXT */}
                                <h3 className="font-heading text-xl font-bold uppercase tracking-wide text-gray-400">
                                    Regional Admins
                                </h3>

                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-6">
                                {regionalAdmins.map((admin) => (
                                    <article
                                        key={`${admin.region}-${admin.name}`}
                                        className="group relative flex h-[140px] flex-col justify-end overflow-hidden rounded-xl border border-white/10 p-4 sm:p-5"
                                    >
                                        {/* BACKGROUND IMAGE */}
                                        <img
                                            src="/profile-background.jpg"
                                            alt="background"
                                            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
                                        />

                                        {/* OVERLAY */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                                        {/* CONTENT */}
                                        <div className="relative z-10">
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                                                {admin.region}
                                            </div>
                                            <div className="mt-1 font-heading text-sm font-bold text-white">
                                                {admin.name}
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
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
                                        <span className="text-blue-500 underline">
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
                                            className="w-full rounded-xl border border-white/10 bg-[#111111] py-3 pl-12 pr-4 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </label>

                                    {/* DROPDOWN */}
                                    <label className="relative w-full sm:w-[200px]">
                                        <select
                                            value={region}
                                            onChange={(event) => setRegion(event.target.value)}
                                            className="w-full appearance-none rounded-xl border border-white/10 bg-[#111111] px-4 py-3 pr-10 text-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
                                        filteredCommunities.map((community) => (
                                            <article
                                                key={community.school}
                                                className="relative grid gap-3 border-t border-white/10 bg-[#121212] px-6 py-4 first:border-t-0 md:grid-cols-[2fr_1fr_0.7fr_0.6fr_0.8fr] md:items-center md:gap-4 md:bg-[#111111] md:p-5 md:px-6"
                                            >
                                                <div className="flex min-w-0 items-center gap-4 border-b border-white/20 pb-4 pr-20 md:border-0 md:pb-0 md:pr-0">
                                                    <div className="min-w-0">
                                                        <h3 className="font-bold leading-6 md:truncate">{community.school}</h3>
                                                        <p className="mt-1 truncate text-xs text-gray-400">{community.community}</p>
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
                                                            {community.members.toLocaleString()}
                                                        </div>
                                                    </div>

                                                    {/* DESKTOP: Region only */}
                                                    <div className="hidden md:flex items-center gap-2">
                                                        {community.region}
                                                    </div>

                                                </div>
                                                <div className="absolute right-6 top-4 md:static">
                                                    <span className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-bold uppercase ${tierStyles[community.tier] ?? tierStyles['Tier C']}`}>
                                                        {community.tier}
                                                    </span>
                                                </div>
                                                
                                                {/* MEMBERS (DESKTOP ONLY) */}
                                                <div className="hidden md:flex items-center gap-2 text-sm font-semibold text-gray-300">
                                                    {community.members.toLocaleString()}
                                                </div>
                                                
                                                <a
                                                    href={community.href}
                                                    className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1877F2] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#166fe0] md:mt-0 md:w-fit"
                                                >
                                                    <span className="flex h-7 w-7 items-end justify-center rounded-full bg-white overflow-hidden">
                                                        <Facebook className="h-6 w-6 text-[#1877F2] translate-y-[2px]" />
                                                    </span>
                                                    Join Group
                                                </a>
                                            </article>
                                        ))
                                    ) : (
                                        <div className="bg-[#111111] px-6 py-14 text-center text-gray-400">
                                            No campus communities match your search.
                                        </div>
                                    )}
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
                                href="mailto:campus@mslphilippines.com"
                                className="mt-8 inline-flex min-h-[60px] w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-500 sm:w-auto"
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
