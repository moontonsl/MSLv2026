import { useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Banknote,
    Check,
    ChevronDown,
    Gamepad2,
    Gift,
    GraduationCap,
    HeartHandshake,
    Layers,
    Medal,
    Megaphone,
    Pencil,
    Shield,
    Sparkles,
    Trophy,
    Zap,
} from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';

const SCOPE_OPTIONS = ['Department', 'College', 'University', 'System', 'Nationwide'];
const MONETARY_SCOPES = ['College', 'University', 'System', 'Nationwide'];
const VOLUME_TIERS = [
    { key: 'small', label: 'SMALL', caption: '4-7 Teams (Small)', diamonds: 8000 },
    { key: 'medium', label: 'MEDIUM', caption: '8-15 Teams (Medium)', diamonds: 15000 },
    { key: 'large', label: 'LARGE', caption: '16+ Teams (Large)', diamonds: 25000 },
];

const ROADMAP_STEPS = [
    {
        title: 'Application Process',
        body: 'Submit proposals and pitch decks (2–3 weeks before for diamonds, 45 days for monetary).',
    },
    {
        title: 'Registration',
        body: 'Participants must pre-register on the MSL website.',
    },
    {
        title: 'Acknowledgement',
        body: 'Official confirmation receipt of approved budget and resources.',
    },
    {
        title: 'Post-Event Report',
        body: 'Submission of winner lists, event reports, and media documentation.',
    },
    {
        title: 'Release of Rewards',
        body: 'Diamonds (3–4 weeks after reports) or funds (45 days after approval).',
    },
];

const EVENT_TYPES = [
    { icon: Trophy, title: 'Tournaments', desc: 'Official campus MLBB competitions' },
    { icon: Megaphone, title: 'Campus Rallies', desc: 'Community activations & showcases' },
    { icon: Pencil, title: 'MLBB School', desc: 'Workshops, clinics & training days' },
];

const PROVIDE_ITEMS = [
    { label: 'Diamonds', value: '10,000', color: 'text-brand-500' },
    { label: 'Cash', value: '₱5,000', color: 'text-emerald-400' },
    { label: 'Tournament Lobby', value: '1 week', color: 'text-sky-400' },
    { label: 'Merch', value: 'Sets', color: 'text-orange-400' },
];

function formatDiamonds(n) {
    return `${n.toLocaleString('en-US')} Diamonds`;
}

function ScopeButtons({ options, value, onChange }) {
    return (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {options.map((opt) => {
                const active = value === opt;
                return (
                    <button
                        key={opt}
                        type="button"
                        onClick={() => onChange(opt)}
                        className={`rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition ${
                            active
                                ? 'bg-brand-500 text-gray-900'
                                : 'bg-[#1A1A1A] text-white hover:bg-[#222222]'
                        }`}
                    >
                        {opt}
                    </button>
                );
            })}
        </div>
    );
}

function FieldSelect({ label, required, value, options, onChange }) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400">
                {label}
                {required ? <span className="text-red-500">*</span> : null}
            </span>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-white/10 bg-[#111111] px-3.5 py-2.5 pr-10 font-sans text-sm font-medium text-white outline-none transition focus:border-brand-500"
                >
                    {options.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
        </label>
    );
}

function TeamVolumeSlider({ value, onChange }) {
    const index = VOLUME_TIERS.findIndex((t) => t.key === value);
    const pct = index <= 0 ? 0 : index === 1 ? 50 : 100;

    return (
        <div>
            <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Team Volume
                </span>
                <span className="text-xs font-medium text-gray-300">
                    {VOLUME_TIERS[index]?.caption}
                </span>
            </div>
            <div className="relative px-1 pt-1">
                <div className="h-2 rounded-full bg-gray-700" />
                <div
                    className="absolute top-1 h-2 rounded-full bg-gray-500 transition-all"
                    style={{ width: `${pct}%`, left: 4, maxWidth: 'calc(100% - 8px)' }}
                />
                <input
                    type="range"
                    min={0}
                    max={2}
                    step={1}
                    value={index}
                    onChange={(e) => onChange(VOLUME_TIERS[Number(e.target.value)].key)}
                    className="absolute inset-x-0 top-0 h-4 w-full cursor-pointer appearance-none bg-transparent
                        [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                        [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full
                        [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white"
                    aria-label="Team volume"
                />
            </div>
            <div className="mt-2 flex justify-between text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                {VOLUME_TIERS.map((t) => (
                    <button
                        key={t.key}
                        type="button"
                        onClick={() => onChange(t.key)}
                        className={value === t.key ? 'text-white' : ''}
                    >
                        {t.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

function AllocationFooter({ amount, highlight }) {
    return (
        <div className="mt-auto border-t border-white/10 pt-4">
            <div className="rounded-xl bg-black/40 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                    Total Allocation
                </p>
                <p
                    className={`mt-1 font-heading text-2xl font-extrabold ${
                        highlight ? 'text-brand-500' : 'text-white'
                    }`}
                >
                    {amount}
                </p>
            </div>
        </div>
    );
}

function ConfigCard({ icon: Icon, iconClass, title, children, amount, highlight }) {
    return (
        <article className="flex h-full flex-col gap-5 rounded-2xl border border-white/10 bg-[#121212] p-5 shadow-[0_0_40px_rgba(0,0,0,0.35)] sm:p-6">
            <div className="flex items-center gap-3">
                <span
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
                >
                    <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-heading text-lg font-bold text-white sm:text-xl">{title}</h3>
            </div>
            <div className="flex flex-1 flex-col gap-4">{children}</div>
            <AllocationFooter amount={amount} highlight={highlight} />
        </article>
    );
}

function BuffConfigurator() {
    const [diamondScope, setDiamondScope] = useState('Department');
    const [eventType, setEventType] = useState('Tournament');
    const [accreditation, setAccreditation] = useState('Level 1');

    const [shEvent, setShEvent] = useState('High School Intramurals');
    const [shType, setShType] = useState('Tournament');
    const [shSetup, setShSetup] = useState('Onsite');
    const [shMode, setShMode] = useState('Livestreamed');

    const [causeSetup, setCauseSetup] = useState('Onsite / Physical');
    const [volume, setVolume] = useState('small');

    const [moneyScope, setMoneyScope] = useState('College');
    const [activityBase, setActivityBase] = useState('Tournament');

    const diamondTotal = useMemo(() => {
        const base = { Department: 10000, College: 12000, University: 15000, System: 20000, Nationwide: 25000 };
        const levelBoost = accreditation === 'Level 2' ? 2000 : accreditation === 'Level 3' ? 5000 : 0;
        return (base[diamondScope] ?? 10000) + levelBoost;
    }, [diamondScope, accreditation]);

    const shTotal = useMemo(() => {
        if (shType === 'Non-Tournament') return 8000;
        if (shSetup === 'Hybrid') return 25000;
        return shMode === 'Livestreamed' ? 8000 : 12000;
    }, [shType, shSetup, shMode]);

    const causeTotal = VOLUME_TIERS.find((t) => t.key === volume)?.diamonds ?? 8000;

    const moneyTotal = useMemo(() => {
        const map = { College: 10000, University: 15000, System: 20000, Nationwide: 30000 };
        return map[moneyScope] ?? 10000;
    }, [moneyScope]);

    return (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <ConfigCard
                icon={GraduationCap}
                iconClass="bg-brand-500/20 text-brand-500"
                title="Diamonds Support"
                amount={formatDiamonds(diamondTotal)}
                highlight
            >
                <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Scope of Event
                    </p>
                    <ScopeButtons
                        options={SCOPE_OPTIONS}
                        value={diamondScope}
                        onChange={setDiamondScope}
                    />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FieldSelect
                        label="Event Type"
                        required
                        value={eventType}
                        onChange={setEventType}
                        options={['Tournament', 'Non-Tournament', 'Hybrid']}
                    />
                    <FieldSelect
                        label="Accreditation"
                        required
                        value={accreditation}
                        onChange={setAccreditation}
                        options={['Level 1', 'Level 2', 'Level 3']}
                    />
                </div>
            </ConfigCard>

            <ConfigCard
                icon={Layers}
                iconClass="bg-white/10 text-white"
                title="Senior High School"
                amount={formatDiamonds(shTotal)}
            >
                <FieldSelect
                    label="Program"
                    value={shEvent}
                    onChange={setShEvent}
                    options={[
                        'High School Intramurals',
                        'Inter-School Cup',
                        'Club Championship',
                    ]}
                />
                <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Event Type
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        {['Tournament', 'Non-Tournament'].map((opt) => (
                            <button
                                key={opt}
                                type="button"
                                onClick={() => setShType(opt)}
                                className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                                    shType === opt
                                        ? 'bg-[#2A2A2A] text-white ring-1 ring-white/20'
                                        : 'bg-[#1A1A1A] text-gray-400 hover:text-white'
                                }`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FieldSelect
                        label="Setup"
                        required
                        value={shSetup}
                        onChange={setShSetup}
                        options={['Onsite', 'Online', 'Hybrid']}
                    />
                    <FieldSelect
                        label="Mode"
                        required
                        value={shMode}
                        onChange={setShMode}
                        options={['Livestreamed', 'Offline Only']}
                    />
                </div>
            </ConfigCard>

            <ConfigCard
                icon={HeartHandshake}
                iconClass="bg-white/10 text-white"
                title="Events for a Cause"
                amount={formatDiamonds(causeTotal)}
            >
                <FieldSelect
                    label="Setup Type"
                    required
                    value={causeSetup}
                    onChange={setCauseSetup}
                    options={['Onsite / Physical', 'Online', 'Hybrid']}
                />
                <TeamVolumeSlider value={volume} onChange={setVolume} />
            </ConfigCard>

            <ConfigCard
                icon={Banknote}
                iconClass="bg-brand-500/20 text-brand-500"
                title="Monetary Grants"
                amount={formatDiamonds(moneyTotal)}
                highlight
            >
                <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Target Scope
                    </p>
                    <ScopeButtons
                        options={MONETARY_SCOPES}
                        value={moneyScope}
                        onChange={setMoneyScope}
                    />
                </div>
                <FieldSelect
                    label="Activity Base"
                    required
                    value={activityBase}
                    onChange={setActivityBase}
                    options={['Tournament', 'Community Drive', 'Leadership Summit']}
                />
            </ConfigCard>
        </div>
    );
}

function SponsorshipRoadmap() {
    return (
        <ol className="relative mx-auto max-w-3xl">
            {ROADMAP_STEPS.map((step, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === ROADMAP_STEPS.length - 1;
                return (
                    <li key={step.title} className="relative flex gap-4 pb-6 last:pb-0 sm:gap-6">
                        <div className="relative flex w-10 shrink-0 flex-col items-center">
                            {!isLast && (
                                <span
                                    className={`absolute top-10 bottom-0 w-0.5 ${
                                        isFirst ? 'bg-brand-500' : 'bg-white/15'
                                    }`}
                                />
                            )}
                            <span
                                className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border bg-[#121212] font-heading text-base font-bold ${
                                    isFirst
                                        ? 'border-brand-500 text-brand-500 shadow-[0_0_16px_rgba(242,194,26,0.45)]'
                                        : 'border-white/15 text-white'
                                }`}
                            >
                                {idx + 1}
                            </span>
                        </div>
                        <div className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-[#121212] px-5 py-4 sm:px-6 sm:py-5">
                            <h3 className="font-heading text-lg font-bold text-white sm:text-xl">
                                {step.title}
                            </h3>
                            <p className="mt-1.5 font-sans text-body-sm text-gray-400">{step.body}</p>
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}

export default function BuffsAndSupportIndex() {
    return (
        <MainLayout fullWidth>
            <Head title="Buffs & Support" />

            {/* Hero */}
            <section className="relative overflow-hidden border-b border-white/10 bg-[#050505]">
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.12]"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
                        backgroundSize: '48px 48px',
                    }}
                />
                <div className="container-page relative py-12 md:py-16 lg:py-20">
                    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
                        <div className="text-left">
                            <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-gray-900">
                                <Zap className="h-3.5 w-3.5" />
                                Sponsorship Program
                            </div>
                            <h1 className="mt-5 font-heading text-[40px] font-extrabold leading-[48px] text-white sm:text-hero-md sm:leading-[58px]">
                                Power Up Your{' '}
                                <span className="text-brand-500 drop-shadow-[0_0_24px_rgba(242,194,26,0.35)]">
                                    Events
                                </span>
                            </h1>
                            <p className="mt-5 max-w-xl font-sans text-body-md text-gray-400">
                                The ultimate support system for student esports. Unlock diamonds,
                                funds, and specialized tools to take your campus tournaments to the
                                next level.
                            </p>
                            <div className="mt-7 flex flex-wrap items-center gap-3">
                                <a
                                    href="#roadmap"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-600 bg-brand-500 px-5 py-3 font-sans text-body-md font-semibold text-gray-900 no-underline transition hover:bg-brand-400"
                                >
                                    Apply for Support
                                    <ArrowRight className="h-5 w-5" />
                                </a>
                                <a
                                    href="#guidelines"
                                    className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-transparent px-5 py-3 font-sans text-body-md font-semibold text-white no-underline transition hover:bg-white/5"
                                >
                                    Download Guidelines
                                </a>
                            </div>
                        </div>

                        {/* Admin's Blessing card */}
                        <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
                            <div className="pointer-events-none absolute left-1/2 top-1/3 h-48 w-48 -translate-x-1/2 rounded-full bg-brand-500/25 blur-3xl" />
                            <article className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#121212] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.45)] sm:p-8">
                                <div className="flex justify-center">
                                    <span className="rounded-full bg-brand-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-gray-900">
                                        Mythic Item
                                    </span>
                                </div>
                                <div className="relative mx-auto mt-8 flex h-28 w-28 items-center justify-center">
                                    <div className="absolute inset-0 rounded-full bg-brand-500/30 blur-xl" />
                                    <Gift className="relative h-14 w-14 text-brand-400" strokeWidth={1.5} />
                                    <span className="absolute -right-1 top-2 h-2.5 w-2.5 rotate-12 bg-purple-500" />
                                    <span className="absolute bottom-3 -left-2 h-2 w-2 rotate-45 bg-emerald-400" />
                                    <span className="absolute -bottom-1 right-4 h-2 w-2 bg-sky-400" />
                                    <span className="absolute left-6 top-0 h-2 w-2 bg-orange-400" />
                                </div>
                                <h2 className="mt-6 text-center font-heading text-2xl font-extrabold text-white">
                                    Admin&apos;s Blessing
                                </h2>
                                <div className="mx-auto mt-3 h-px w-16 bg-white/15" />
                                <p className="mt-4 text-center font-sans text-sm italic leading-relaxed text-gray-400">
                                    &ldquo;Grants the wielder immense resources to host legendary
                                    campus events. Increases student engagement by 200%.&rdquo;
                                </p>
                                <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-3">
                                    {[
                                        { value: 'SS', label: 'Tier' },
                                        { value: '∞', label: 'Limit' },
                                        { value: '0S', label: 'CD' },
                                    ].map((stat) => (
                                        <div
                                            key={stat.label}
                                            className="rounded-xl border border-white/10 bg-black/40 px-2 py-3 text-center"
                                        >
                                            <div
                                                className={`font-heading text-xl font-extrabold sm:text-2xl ${
                                                    stat.label === 'Tier'
                                                        ? 'text-brand-500'
                                                        : 'text-gray-300'
                                                }`}
                                            >
                                                {stat.value}
                                            </div>
                                            <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                                                {stat.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </section>

            {/* Eligible + Provide */}
            <section className="border-b border-white/10 bg-[#050505] py-12 md:py-16">
                <div className="container-page grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <article className="rounded-2xl border border-white/10 bg-[#121212] p-6 sm:p-8">
                        <div className="flex items-center gap-3">
                            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400">
                                <Shield className="h-5 w-5" />
                            </span>
                            <h2 className="font-heading text-xl font-bold text-white sm:text-2xl">
                                Eligible Event Types
                            </h2>
                        </div>
                        <ul className="mt-6 space-y-3">
                            {EVENT_TYPES.map(({ icon: Icon, title, desc }) => (
                                <li
                                    key={title}
                                    className="flex items-start gap-3 rounded-xl border border-white/5 bg-[#1A1A1A] px-4 py-3.5"
                                >
                                    <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-gray-300">
                                        <Icon className="h-4 w-4" />
                                    </span>
                                    <div>
                                        <p className="font-semibold text-white">{title}</p>
                                        <p className="text-sm text-gray-400">{desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </article>

                    <article className="rounded-2xl border border-white/10 bg-[#121212] p-6 sm:p-8">
                        <div className="flex items-center gap-3">
                            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/20 text-brand-500">
                                <Medal className="h-5 w-5" />
                            </span>
                            <h2 className="font-heading text-xl font-bold text-white sm:text-2xl">
                                What We Provide
                            </h2>
                        </div>
                        <div className="mt-6 grid grid-cols-2 gap-3">
                            {PROVIDE_ITEMS.map((item) => (
                                <div
                                    key={item.label}
                                    className="rounded-xl border border-white/5 bg-[#1A1A1A] px-4 py-5"
                                >
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        {item.label}
                                    </p>
                                    <p
                                        className={`mt-2 font-heading text-xl font-extrabold sm:text-2xl ${item.color}`}
                                    >
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </article>
                </div>
            </section>

            {/* Reward Your Community */}
            <section className="border-b border-white/10 bg-[#0B0B0B] py-12 md:py-20">
                <div className="container-page grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-500">
                            Rewards and More
                        </p>
                        <h2 className="mt-3 font-heading text-section font-bold text-white">
                            Reward Your{' '}
                            <span className="text-brand-500">Community</span>
                        </h2>
                        <p className="mt-4 max-w-lg font-sans text-body-lg text-gray-400">
                            Reward your student leaders and participants with everything from
                            in-game currency to physical merchandise.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white">
                                <Sparkles className="h-4 w-4 text-brand-500" />
                                Leader Loot
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white">
                                <Gift className="h-4 w-4 text-brand-500" />
                                Giveaways
                            </span>
                        </div>
                        <ul className="mt-6 space-y-2.5">
                            {['Diamond prizes', 'Official merch'].map((item) => (
                                <li key={item} className="flex items-center gap-2.5 text-sm text-gray-300">
                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-gray-900">
                                        <Check className="h-3 w-3" strokeWidth={3} />
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#121212]">
                        <img
                            src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80"
                            alt="Community rewards"
                            className="aspect-[4/3] w-full object-cover grayscale"
                            loading="lazy"
                        />
                    </div>
                </div>
            </section>

            {/* Buff Configurator */}
            <section className="border-b border-white/10 bg-[#050505] py-12 md:py-20">
                <div className="container-page">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="font-heading text-section font-bold text-white">
                            Buff Configurator
                        </h2>
                        <p className="mt-3 font-sans text-body-md text-gray-400">
                            Select a package to see the buff value you can get for your community.
                        </p>
                    </div>
                    <div className="mt-10 md:mt-12">
                        <BuffConfigurator />
                    </div>
                </div>
            </section>

            {/* Tournament Lobby */}
            <section className="relative overflow-hidden border-b border-white/10 bg-[#0B0B0B] py-12 md:py-20">
                <div className="pointer-events-none absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-violet-600/20 blur-3xl" />
                <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-blue-600/15 blur-3xl" />
                <div className="container-page relative grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
                    <div>
                        <span className="inline-flex rounded-full bg-violet-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-violet-300">
                            The Hub
                        </span>
                        <h2 className="mt-4 font-heading text-section font-bold text-white">
                            Access the{' '}
                            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                                Tournament Lobby
                            </span>
                        </h2>
                        <p className="mt-4 max-w-lg font-sans text-body-lg text-gray-400">
                            Gain access to official settings, broadcast-ready tools, and
                            professional match infrastructure for your campus events.
                        </p>
                        <ul className="mt-6 space-y-3">
                            {[
                                'Professional Settings',
                                'Official MPL Map',
                                'Real-time Stats',
                                'Broadcast-ready features',
                            ].map((item) => (
                                <li key={item} className="flex items-center gap-2.5 text-sm text-gray-300">
                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <button
                            type="button"
                            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-5 py-3 font-sans text-body-md font-semibold text-white transition hover:brightness-110"
                        >
                            Request Access
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </div>

                    <article className="rounded-3xl border border-white/10 bg-[#121212] p-8 text-center sm:p-10">
                        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-white/5">
                            <Gamepad2 className="h-12 w-12 text-gray-500" strokeWidth={1.25} />
                        </div>
                        <h3 className="mt-6 font-heading text-xl font-bold text-white">
                            Restricted Access
                        </h3>
                        <p className="mx-auto mt-2 max-w-sm text-sm text-gray-400">
                            Sign in with an approved Student Leader account to unlock the official
                            Tournament Lobby tools.
                        </p>
                        <Link
                            href="/Login"
                            className="mt-6 inline-flex items-center justify-center rounded-xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-white no-underline transition hover:bg-white/5"
                        >
                            Login / Register
                        </Link>
                    </article>
                </div>
            </section>

            {/* Sponsorship Roadmap */}
            <section id="roadmap" className="bg-[#050505] py-12 md:py-20">
                <div className="container-page">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="font-heading text-section font-bold text-white">
                            Sponsorship Roadmap
                        </h2>
                        <p className="mt-3 font-sans text-body-md text-gray-400">
                            Get your community rewards in 5 simple steps.
                        </p>
                    </div>
                    <div className="mt-10 md:mt-14">
                        <SponsorshipRoadmap />
                    </div>
                    <div
                        id="guidelines"
                        className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
                    >
                        <button
                            type="button"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-brand-600 bg-brand-500 px-6 py-3.5 font-sans text-body-md font-semibold text-gray-900 transition hover:bg-brand-400 sm:w-auto"
                        >
                            Apply for Support
                            <ArrowRight className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 px-6 py-3.5 font-sans text-body-md font-semibold text-white transition hover:bg-white/5 sm:w-auto"
                        >
                            View Guidelines
                        </button>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
