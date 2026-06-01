import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import {
    ArrowRight,
    Building2,
    CheckCircle2,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    CircleDollarSign,
    Gamepad2,
    Gift,
    HandHeart,
    Medal,
    ShieldCheck,
    Square,
    Star,
    Zap,
    Trophy,
} from 'lucide-react';
import {
    calculatorDefaults,
    diamondEventCategoryOptions,
    diamondEventTypeOptions,
    formatDiamondBudget,
    formatPesoBudget,
    eventsForCauseEventTypeOptions,
    eventsForCauseTeamOptions,
    getDiamondConditionOptions,
    getDiamondSupportBudget,
    getEventsForCauseBudget,
    getMonetaryGrantBudget,
    getMonetaryGrantClassificationOptions,
    getShsBudget,
    monetaryGrantEventTypeOptions,
    monetaryGrantScopeOptions,
    shsCategoryOptions,
    shsEventTypeOptions,
    shsTeamOptions,
} from './buffCalculatorData';

const eventTypes = [
    { title: 'Tournaments', subtitle: 'Onsite & Online', color: 'text-dept-blue-500' },
    { title: 'Community Games', subtitle: 'Non-Tournament Activities', color: 'text-dept-purple-500' },
    { title: 'Charity Events', subtitle: 'Gaming for a Cause', color: 'text-pink-500' },
];

const supportItems = [
    { title: 'Diamonds', label: 'FUNDING', color: 'text-brand-500' },
    { title: 'Cash', label: 'GRANTS', color: 'text-dept-green-500' },
    { title: 'Tournament Lobby', label: 'ACCESS', color: 'text-dept-blue-500' },
    { title: 'Merch', label: 'SWAG', color: 'text-orange-500' },
];

const configurators = [
    {
        title: 'Diamonds Support',
        icon: Gift,
        accent: 'text-brand-500',
        chips: ['Department', 'College', 'University', 'System', 'Nationwide'],
        fields: [
            ['EVENT TYPE', calculatorDefaults.diamondSupport.eventType],
            ['RANK', calculatorDefaults.diamondSupport.rank],
            ['LEVEL / CONDITION', calculatorDefaults.diamondSupport.condition],
        ],
        total: formatDiamondBudget(getDiamondSupportBudget()),
        totalClass: 'text-brand-500',
    },
    {
        title: 'Senior High School',
        icon: Building2,
        accent: 'text-white',
        total: formatDiamondBudget(getShsBudget()),
        totalClass: 'text-white',
    },
    {
        title: 'Events for a Cause',
        icon: HandHeart,
        accent: 'text-white',
        total: formatDiamondBudget(getEventsForCauseBudget()),
        totalClass: 'text-white',
    },
    {
        title: 'Monetary Grants',
        icon: CircleDollarSign,
        accent: 'text-brand-500',
        total: formatPesoBudget(getMonetaryGrantBudget()),
        totalClass: 'text-brand-500',
    },
];

const roadmap = [
    ['Application Process', 'Submit proposals and pitch decks (2-3 weeks before for diamonds, 45 days for monetary).'],
    ['Registration', 'Participants must pre-register on the MSL website.'],
    ['Acknowledgement', 'Official confirmation receipt of approved budget and resources.'],
    ['Post-Event Report', 'Submission of winner lists, event reports, and media documentation.'],
    ['Release of Rewards', 'Diamonds (3-4 weeks after reports) or funds (45 days after approval).'],
];

const lootSlides = [
    '/announcement sample 1.png',
    '/profile-background.jpg',
    '/rank image.png',
];

function Badge({ icon: Icon = Zap, children, className = '' }) {
    return (
        <div className={`inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-brand-500 ${className}`}>
            <Icon className="h-4 w-4" />
            {children}
        </div>
    );
}

function PrimaryButton({ children, purple = false, href = null }) {
    const className = `inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-base font-semibold transition duration-300 hover:scale-105 sm:min-h-14 sm:w-auto sm:py-4 sm:text-lg ${
        purple
            ? 'bg-gradient-to-r from-dept-purple-500 to-indigo-500 text-white hover:shadow-[0_0_28px_rgba(168,85,247,.55)]'
            : 'bg-brand-500 text-black shadow-glow hover:bg-brand-400 hover:shadow-[0_0_32px_rgba(242,194,26,.55)]'
    }`;

    if (href) {
        return (
            <a href={href} target="_blank" rel="noreferrer" className={className}>
                {children}
                <ArrowRight className="h-5 w-5" />
            </a>
        );
    }

    return (
        <button type="button" className={className}>
            {children}
            <ArrowRight className="h-5 w-5" />
        </button>
    );
}

function SecondaryButton({ children }) {
    return (
        <button
            type="button"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-base font-semibold text-white transition duration-300 hover:scale-105 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_0_28px_rgba(255,255,255,.16)] sm:min-h-14 sm:w-auto sm:py-4 sm:text-lg"
        >
            {children}
        </button>
    );
}

function HeroCard() {
    return (
        <div className="group relative w-full max-w-lg overflow-hidden rounded-[32px] border border-white/10 bg-bg-card p-8 shadow-2xl transition duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:border-brand-500/40 hover:shadow-[0_0_46px_rgba(242,194,26,.24)]">
            <div className="absolute left-1/2 top-20 h-48 w-48 -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl transition duration-500 group-hover:scale-125 group-hover:bg-brand-500/30" />
            <div className="relative z-10 flex flex-col items-center gap-6 text-center">
                <span className="rounded-full bg-[#FFD100] px-4 py-1 text-xs font-bold text-black shadow-glow transition duration-300 group-hover:shadow-[0_0_26px_rgba(255,209,0,.65)]">
                    MYTHIC ITEM
                </span>
                <div className="relative flex h-36 w-full items-center justify-center">
                    {[
                        ['left-4 top-4 rotate-12 text-dept-purple-500', 'fill-purple-500/70'],
                        ['bottom-6 left-10 -rotate-12 text-dept-green-500', 'fill-green-500/70'],
                        ['bottom-4 right-8 rotate-12 text-orange-500', 'fill-orange-500/70'],
                        ['right-12 top-8 -rotate-6 text-sky-400', 'fill-sky-400/70'],
                    ].map(([position, fill]) => (
                        <Square
                            key={position}
                            className={`absolute h-5 w-5 rounded-sm ${position} ${fill}`}
                            strokeWidth={1.5}
                        />
                    ))}
                    <Gift className="h-20 w-20 text-white transition duration-500 group-hover:-translate-y-1 group-hover:scale-110 group-hover:text-brand-500" strokeWidth={1.8} />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-white transition duration-300 group-hover:text-brand-500">Admin&apos;s Blessing</h2>
                    <div className="mx-auto my-5 h-0.5 w-12 bg-gray-600 transition duration-300 group-hover:w-20 group-hover:bg-brand-500" />
                    <p className="text-sm leading-6 text-gray-400">
                        &quot;Grants the wielder immense resources to host legendary campus events. Increases student engagement by 200%.&quot;
                    </p>
                </div>
                <div className="grid w-full grid-cols-3 gap-3">
                    {[
                        ['SS', 'TIER', 'text-brand-500'],
                        ['∞', 'LIMIT', 'text-white'],
                        ['0S', 'CD', 'text-white'],
                    ].map(([value, label, color]) => (
                        <div key={label} className="rounded-lg border border-gray-800 bg-[#181A1F] p-3 text-center">
                            <div className={`text-lg font-bold ${color}`}>{value}</div>
                            <div className="mt-1 text-xs font-bold text-gray-500">{label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function InfoCard({ title, icon: Icon, children, accent = 'border-white/10' }) {
    return (
        <article className={`group relative flex h-full flex-col overflow-hidden rounded-[22px] border ${accent} bg-bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-[0_0_34px_rgba(242,194,26,.16)] sm:p-10`}>
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
            <div className="relative z-10 flex flex-1 flex-col">
                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 transition duration-300 group-hover:scale-110 group-hover:bg-brand-500/20 sm:mb-10">
                    <Icon className="h-8 w-8 text-brand-500" />
                </div>
                <h2 className="mb-5 text-2xl font-black text-white sm:text-3xl">{title}</h2>
                {children}
            </div>
        </article>
    );
}

function SelectField({ label, value }) {
    return (
        <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-gray-400">
                {label} <span className="text-red-600">*</span>
            </div>
            <button
                type="button"
                className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-bg-surface px-3.5 py-2.5 text-left text-base text-white"
            >
                {value}
                <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
        </div>
    );
}

function DropdownField({ label, value, options, onChange }) {
    return (
        <label className="min-w-0 flex-1">
            <span className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-gray-400">
                {label} <span className="text-red-600">*</span>
            </span>
            <span className="relative block">
                <select
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    className="w-full appearance-none rounded-xl border border-white/10 bg-bg-surface px-3.5 py-2.5 pr-10 text-base text-white shadow-none outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
                >
                    {options.map((option) => (
                        <option key={option} value={option} className="bg-bg-surface text-white">
                            {option}
                        </option>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </span>
        </label>
    );
}

function DiamondSupportCard({ item }) {
    const Icon = item.icon;
    const [eventCategory, setEventCategory] = useState(calculatorDefaults.diamondSupport.rank);
    const [levelCondition, setLevelCondition] = useState(calculatorDefaults.diamondSupport.condition);
    const [eventType, setEventType] = useState(calculatorDefaults.diamondSupport.eventType);

    const conditionOptions = useMemo(
        () => getDiamondConditionOptions(eventCategory),
        [eventCategory],
    );
    const effectiveLevelCondition = conditionOptions.includes(levelCondition)
        ? levelCondition
        : conditionOptions[0];

    useEffect(() => {
        if (!conditionOptions.includes(levelCondition)) {
            setLevelCondition(conditionOptions[0]);
        }
    }, [conditionOptions, levelCondition]);

    const total = formatDiamondBudget(
        getDiamondSupportBudget({
            rank: eventCategory,
            condition: effectiveLevelCondition,
            eventType,
        }),
    );

    return (
        <article className="relative flex min-h-[520px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-bg-card p-6 shadow-2xl sm:p-8">
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-brand-500/5 blur-3xl" />
            <div className="relative z-10 flex flex-1 flex-col">
                <div className="mb-8 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-bg-surface">
                        <Icon className={`h-7 w-7 ${item.accent}`} />
                    </div>
                    <h3 className="text-2xl font-black leading-7 text-white">{item.title}</h3>
                </div>

                <div className="space-y-6">
                    <div>
                        <div className="mb-4 text-xs font-bold text-[#808080]">SCOPE OF EVENT</div>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {item.chips.map((chip, index) => (
                                <button
                                    key={chip}
                                    type="button"
                                    className={`rounded-lg border px-3 py-2.5 text-sm font-semibold ${
                                        index === 0
                                            ? 'border-brand-500 bg-brand-500 text-black'
                                            : 'border-white/10 bg-bg-card text-gray-400'
                                    }`}
                                >
                                    {chip}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-4">
                        <DropdownField
                            label="EVENT CATEGORY / RANK"
                            value={eventCategory}
                            options={diamondEventCategoryOptions}
                            onChange={setEventCategory}
                        />
                        <DropdownField
                            label="LEVEL / CONDITION"
                            value={effectiveLevelCondition}
                            options={conditionOptions}
                            onChange={setLevelCondition}
                        />
                        <DropdownField
                            label="EVENT TYPE"
                            value={eventType}
                            options={diamondEventTypeOptions}
                            onChange={setEventType}
                        />
                    </div>
                </div>

                <div className="mt-auto pt-8">
                    <div className="border-t border-white/10 pt-6">
                        <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
                            <span className="text-base font-semibold text-gray-400">TOTAL ALLOCATION</span>
                            <span className="text-3xl font-bold leading-tight text-brand-500 sm:text-4xl">{total}</span>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}

function SeniorHighSchoolCard({ item }) {
    const Icon = item.icon;
    const [category, setCategory] = useState(calculatorDefaults.shsEvents.category);
    const [teams, setTeams] = useState(calculatorDefaults.shsEvents.teams);
    const [classification, setClassification] = useState(calculatorDefaults.shsEvents.classification);
    const [highSchoolIntramurals, setHighSchoolIntramurals] = useState(
        calculatorDefaults.shsEvents.highSchoolIntramurals,
    );

    const total = formatDiamondBudget(
        getShsBudget({
            category,
            teams,
            classification,
            highSchoolIntramurals,
        }),
    );

    return (
        <article className="relative flex min-h-[520px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-bg-card p-6 shadow-2xl sm:p-8">
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
            <div className="relative z-10 flex flex-1 flex-col">
                <div className="mb-8 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-bg-surface">
                        <Icon className={`h-7 w-7 ${item.accent}`} />
                    </div>
                    <h3 className="text-2xl font-black leading-7 text-white">{item.title}</h3>
                </div>

                <div className="space-y-6">
                    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-white/10 bg-bg-surface px-5 py-4 transition hover:border-brand-500/30 hover:bg-white/[0.04]">
                        <span>
                            <span className="block font-bold text-white">High-school Intramurals</span>
                        </span>
                        <input
                            type="checkbox"
                            checked={highSchoolIntramurals}
                            onChange={(event) => setHighSchoolIntramurals(event.target.checked)}
                            className="h-5 w-5 rounded border-gray-300 bg-bg-surface text-brand-500 focus:ring-brand-500"
                        />
                    </label>

                    <div className={highSchoolIntramurals ? 'pointer-events-none opacity-45' : 'space-y-8'}>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <DropdownField
                                label="CATEGORY"
                                value={category}
                                options={shsCategoryOptions}
                                onChange={setCategory}
                            />
                            <DropdownField
                                label="NUMBER OF TEAMS"
                                value={teams}
                                options={shsTeamOptions}
                                onChange={setTeams}
                            />
                        </div>
                        <br></br>
                        <DropdownField
                            label="EVENT TYPE"
                            value={classification}
                            options={shsEventTypeOptions}
                            onChange={setClassification}
                        />
                    </div>
                </div>

                <div className="mt-auto pt-8">
                    <div className="border-t border-white/10 pt-6">
                        <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
                            <span className="text-base font-semibold text-gray-400">TOTAL ALLOCATION</span>
                            <span className="text-3xl font-bold leading-tight text-white sm:text-4xl">{total}</span>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}

function MonetaryGrantsCard({ item }) {
    const Icon = item.icon;
    const [eventType, setEventType] = useState(calculatorDefaults.monetaryGrants.activityBase);
    const [eventScope, setEventScope] = useState(calculatorDefaults.monetaryGrants.rank);
    const [classification, setClassification] = useState(calculatorDefaults.monetaryGrants.condition);

    const classificationOptions = useMemo(
        () => getMonetaryGrantClassificationOptions(eventScope),
        [eventScope],
    );
    const effectiveClassification = classificationOptions.includes(classification)
        ? classification
        : classificationOptions[0];

    useEffect(() => {
        if (!classificationOptions.includes(classification)) {
            setClassification(classificationOptions[0]);
        }
    }, [classificationOptions, classification]);

    const rawTotal = getMonetaryGrantBudget({
        rank: eventScope,
        condition: effectiveClassification,
        activityBase: eventType,
    });
    const total = formatPesoBudget(rawTotal);
    const isProposalNote = typeof rawTotal === 'string';

    return (
        <article className="relative flex min-h-[520px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-bg-card p-6 shadow-2xl sm:p-8">
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-brand-500/5 blur-3xl" />
            <div className="relative z-10 flex flex-1 flex-col">
                <div className="mb-8 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-bg-surface">
                        <Icon className={`h-7 w-7 ${item.accent}`} />
                    </div>
                    <h3 className="text-2xl font-black leading-7 text-white">{item.title}</h3>
                </div>

                <div className="space-y-6">
                    <DropdownField
                        label="EVENT TYPE"
                        value={eventType}
                        options={monetaryGrantEventTypeOptions}
                        onChange={setEventType}
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                        <DropdownField
                            label="EVENT SCOPE"
                            value={eventScope}
                            options={monetaryGrantScopeOptions}
                            onChange={setEventScope}
                        />
                        <DropdownField
                            label="SCHOOL LEVEL / CLASSIFICATION"
                            value={effectiveClassification}
                            options={classificationOptions}
                            onChange={setClassification}
                        />
                    </div>
                </div>

                <div className="mt-auto pt-8">
                    <div className="border-t border-white/10 pt-6">
                        <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
                            <span className="text-base font-semibold text-gray-400">TOTAL ALLOCATION</span>
                            <span
                                className={`whitespace-pre-line text-right font-bold leading-snug ${
                                    isProposalNote ? 'text-sm sm:text-base' : 'text-3xl sm:text-4xl'
                                } ${item.totalClass}`}
                            >
                                {total}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}

function EventsForCauseCard({ item }) {
    const Icon = item.icon;
    const [eventType, setEventType] = useState(calculatorDefaults.eventsForCause.setupType);
    const [teamVolume, setTeamVolume] = useState(calculatorDefaults.eventsForCause.teamVolume);
    const selectedTeamIndex = Math.max(
        eventsForCauseTeamOptions.findIndex((option) => option.value === teamVolume),
        0,
    );
    const selectedTeamOption = eventsForCauseTeamOptions[selectedTeamIndex];

    const total = formatDiamondBudget(
        getEventsForCauseBudget({
            setupType: eventType,
            teamVolume,
        }),
    );

    return (
        <article className="relative flex min-h-[520px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-bg-card p-6 shadow-2xl sm:p-8">
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
            <div className="relative z-10 flex flex-1 flex-col">
                <div className="mb-8 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-bg-surface">
                        <Icon className={`h-7 w-7 ${item.accent}`} />
                    </div>
                    <h3 className="text-2xl font-black leading-7 text-white">{item.title}</h3>
                </div>

                <div className="space-y-6">
                    <DropdownField
                        label="EVENT TYPE"
                        value={eventType}
                        options={eventsForCauseEventTypeOptions}
                        onChange={setEventType}
                    />

                    <div>
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <span className="text-xs font-bold text-[#808080]">NUMBER OF TEAMS</span>
                            <span className="rounded-lg border border-white/10 bg-bg-surface px-3 py-1 text-xs font-semibold text-white">
                                {selectedTeamOption.display}
                            </span>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-bg-surface px-4 py-4">
                            <input
                                type="range"
                                min="0"
                                max={eventsForCauseTeamOptions.length - 1}
                                step="1"
                                value={selectedTeamIndex}
                                onChange={(event) => setTeamVolume(eventsForCauseTeamOptions[Number(event.target.value)].value)}
                                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-700 accent-brand-500 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_18px_rgba(242,194,26,.55)]"
                            />
                            <div className="mt-3 grid grid-cols-3 text-center text-sm font-semibold">
                                {eventsForCauseTeamOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => setTeamVolume(option.value)}
                                        className={`rounded-md px-2 py-1 transition ${
                                            option.value === teamVolume
                                                ? 'text-brand-500'
                                                : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-8">
                    <div className="border-t border-white/10 pt-6">
                        <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
                            <span className="text-base font-semibold text-gray-400">TOTAL ALLOCATION</span>
                            <span className={`text-3xl font-bold leading-tight sm:text-4xl ${item.totalClass}`}>{total}</span>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}

function ConfigCard({ item }) {
    const Icon = item.icon;

    return (
        <article className="relative flex min-h-[520px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-bg-card p-6 shadow-2xl sm:p-8">
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-brand-500/5 blur-3xl" />
            <div className="relative z-10 flex flex-1 flex-col">
                <div className="mb-8 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-bg-surface">
                        <Icon className={`h-7 w-7 ${item.accent}`} />
                    </div>
                    <h3 className="text-2xl font-black leading-7 text-white">{item.title}</h3>
                </div>

                <div className="space-y-6">
                    {item.custom ? (
                        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-bg-surface px-5 py-4">
                            <span className="font-bold text-white">{item.custom}</span>
                            <span className="h-5 w-5 rounded-md border border-gray-300" />
                        </div>
                    ) : null}

                    {item.chips ? (
                        <div>
                            <div className="mb-4 text-xs font-bold text-[#808080]">
                                {item.title === 'Monetary Grants' ? 'TARGET SCOPE' : 'SCOPE OF EVENT'}
                            </div>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                {item.chips.map((chip, index) => (
                                    <button
                                        key={chip}
                                        type="button"
                                        className={`rounded-lg border px-3 py-2.5 text-sm font-semibold ${
                                            index === 0
                                                ? 'border-brand-500 bg-brand-500 text-black'
                                                : 'border-white/10 bg-bg-card text-gray-400'
                                        }`}
                                    >
                                        {chip}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {item.title === 'Senior High School' ? (
                        <div>
                            <div className="mb-3 text-xs font-bold text-[#808080]">EVENT TYPE</div>
                            <div className="grid rounded-xl border border-white/10 bg-bg-surface p-1.5 sm:grid-cols-2">
                                <button type="button" className="rounded-md bg-gray-800 px-3 py-2.5 font-semibold text-white">
                                    Tournament
                                </button>
                                <button type="button" className="rounded-md px-3 py-2.5 font-semibold text-gray-500">
                                    Non-Tournament
                                </button>
                            </div>
                        </div>
                    ) : null}

                    <div className="grid gap-4 sm:grid-cols-2">
                        {item.fields.map(([label, value]) => (
                            <SelectField key={label} label={label} value={value} />
                        ))}
                    </div>

                    {item.slider ? (
                        <div>
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <span className="text-xs font-bold text-[#808080]">TEAM VOLUME</span>
                                <span className="rounded-lg border border-white/10 bg-bg-surface px-3 py-1 text-xs font-semibold text-white">
                                    4-7 Teams (Small)
                                </span>
                            </div>
                            <div className="h-4 rounded-full bg-gray-700">
                                <div className="h-4 w-4 rounded-full bg-white" />
                            </div>
                            <div className="mt-2 flex justify-between text-sm font-semibold">
                                <span className="text-gray-300">SMALL</span>
                                <span className="text-gray-400">MEDIUM</span>
                                <span className="text-gray-400">LARGE</span>
                            </div>
                        </div>
                    ) : null}
                </div>

                <div className="mt-auto pt-8">
                    <div className="border-t border-white/10 pt-6">
                        <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
                            <span className="text-base font-semibold text-gray-400">TOTAL ALLOCATION</span>
                            <span className={`text-3xl font-bold leading-tight sm:text-4xl ${item.totalClass}`}>{item.total}</span>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default function BuffsAndSupport() {
    const [activeLootSlide, setActiveLootSlide] = useState(0);

    useEffect(() => {
        const id = window.setInterval(() => {
            setActiveLootSlide((index) => (index + 1) % lootSlides.length);
        }, 7000);

        return () => window.clearInterval(id);
    }, []);

    const changeLootSlide = (direction) => {
        setActiveLootSlide((index) => {
            const next = direction === 'next' ? index + 1 : index - 1;
            return (next + lootSlides.length) % lootSlides.length;
        });
    };

    return (
        <MainLayout fullWidth>
            <Head title="Buffs & Support" />

            <div className="overflow-hidden bg-bg text-white">
                <section className="relative px-4 py-8 sm:px-6 sm:py-20 lg:px-12 lg:py-28">
                    <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(rgba(254,243,199,.45)_1px,transparent_1px),linear-gradient(90deg,rgba(254,243,199,.45)_1px,transparent_1px)] [background-size:80px_80px]" />
                    <div className="absolute left-0 top-20 h-[520px] w-[520px] rounded-full bg-brand-500/10 blur-3xl" />
                    <div className="absolute right-0 top-20 h-[520px] w-[520px] rounded-full bg-brand-500/10 blur-3xl" />
                    <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-8 sm:gap-12 lg:grid-cols-[1fr_500px]">
                        <div className="max-w-xl">
                            <Badge icon={Zap}>Sponsorship Program</Badge>
                            <h1 className="mt-6 text-5xl font-black leading-none text-white sm:text-7xl">
                                Power Up
                                <br />
                                Your <span className="text-[#FFD100] drop-shadow-[0_0_16px_rgba(255,209,0,.45)]">Events</span>
                            </h1>
                            <p className="mt-6 text-base leading-7 text-gray-400 sm:text-lg sm:leading-8">
                                The ultimate support system for student esports. Unlock diamonds, funds, and specialized tools to take your campus tournaments to the next level.
                            </p>
                            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                                <PrimaryButton href="https://docs.google.com/document/d/14rAnSyb5goYr2nAfe10RtGE5k_rNQ2AA3yow0UEncS8/edit?usp=sharing">
                                    Apply for Support
                                </PrimaryButton>
                                <SecondaryButton>Download Guidelines</SecondaryButton>
                            </div>
                        </div>
                        <HeroCard />
                    </div>
                </section>

                <section className="px-4 py-8 sm:px-6 sm:py-16 lg:px-12">
                    <div className="mx-auto grid max-w-5xl items-stretch gap-8 lg:grid-cols-2">
                        <InfoCard title="Eligible Event Types" icon={Trophy} accent="border-dept-blue-400/20">
                            <div className="grid h-full gap-4">
                                {eventTypes.map((event) => (
                                    <div key={event.title} className="flex min-h-24 items-center gap-5 rounded-xl border border-white/10 bg-bg-surface p-5 transition duration-300 hover:scale-[1.02] hover:border-white/20 hover:bg-white/[0.06]">
                                        <Medal className={`h-5 w-5 ${event.color}`} />
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                                            <p className="text-sm font-semibold text-gray-400">{event.subtitle}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </InfoCard>

                        <InfoCard title="What We Provide" icon={Gift} accent="border-brand-500/20">
                            <div className="grid h-full grid-cols-2 gap-4">
                                {supportItems.map((item) => (
                                    <div key={item.title} className="flex min-h-24 flex-col items-center justify-center rounded-xl border border-brand-500/10 bg-bg-surface p-4 text-center transition duration-300 hover:scale-[1.03] hover:border-brand-500/30 hover:bg-white/[0.06] sm:p-5">
                                        <div className={`text-xl font-black sm:text-2xl ${item.color}`}>{item.title}</div>
                                        <div className="mt-1 text-xs font-bold text-gray-400">{item.label}</div>
                                    </div>
                                ))}
                            </div>
                        </InfoCard>
                    </div>
                </section>

                <section className="px-4 py-10 sm:px-6 sm:py-20 lg:px-12">
                    <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
                        <div>
                            <Badge icon={Gift}>Community Loot</Badge>
                            <h2 className="mt-6 text-5xl font-black leading-none sm:text-7xl">
                                Reward Your
                                <br />
                                <span className="text-brand-500">Community</span>
                            </h2>
                            <p className="mt-6 text-base font-semibold leading-7 text-gray-400 sm:text-lg sm:leading-8">
                                Elevate your event with official MSL gear drops. We provide premium merchandise to be used as <span className="text-white">giveaways</span> and <span className="text-white">tournament prizes</span>.
                            </p>
                            <p className="mt-5 text-base font-semibold leading-7 text-gray-400 sm:text-lg sm:leading-8">
                                Accredited partners receive care packages containing jerseys, shirts, and accessories to hype up their audience. Make your event unforgettable with legendary loot.
                            </p>
                            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                                {[
                                    ['Grand Prizes', 'For Champions', Trophy, 'text-brand-500', 'hover:border-brand-500/30'],
                                    ['Giveaways', 'For Trivia & Raffles', Gift, 'text-dept-purple-500', 'hover:border-dept-purple-500/40'],
                                ].map(([title, subtitle, Icon, iconColor, hoverBorder]) => (
                                    <div key={title} className={`flex items-center gap-4 rounded-2xl border border-white/10 bg-[#1A1A1A] px-6 py-4 transition duration-300 hover:-translate-y-1 hover:scale-[1.03] ${hoverBorder} hover:shadow-[0_0_24px_rgba(242,194,26,.18)]`}>
                                        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black">
                                            <Icon className={`h-5 w-5 ${iconColor}`} />
                                        </span>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">{title}</h3>
                                            <p className="text-xs text-gray-400">{subtitle}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative min-h-72 overflow-hidden rounded-3xl border border-white/10 bg-bg-card shadow-2xl sm:min-h-80">
                            {lootSlides.map((slide, index) => (
                                <img
                                    key={slide}
                                    src={slide}
                                    alt=""
                                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                                        index === activeLootSlide ? 'opacity-100' : 'opacity-0'
                                    }`}
                                />
                            ))}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-bg-cardHover/60 to-bg-card" />
                            <button
                                type="button"
                                aria-label="Previous loot image"
                                onClick={() => changeLootSlide('previous')}
                                className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white transition hover:scale-110 hover:bg-black/70"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                                type="button"
                                aria-label="Next loot image"
                                onClick={() => changeLootSlide('next')}
                                className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white transition hover:scale-110 hover:bg-black/70"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                            <div className="absolute bottom-4 left-1/2 flex w-28 -translate-x-1/2 items-center gap-2">
                                {lootSlides.map((slide, index) => (
                                    <button
                                        key={slide}
                                        type="button"
                                        aria-label={`Go to loot image ${index + 1}`}
                                        onClick={() => setActiveLootSlide(index)}
                                        className={`h-1.5 rounded-full transition ${
                                            index === activeLootSlide
                                                ? 'flex-1 bg-brand-500'
                                                : 'w-5 bg-gray-600'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="px-4 py-10 sm:px-6 sm:py-20 lg:px-12">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-10 text-center">
                            <h2 className="text-4xl font-black text-white sm:text-5xl">Buff Configurator</h2>
                            <p className="mt-3 text-base text-[#808080] sm:text-lg">Select your parameters to optimize your sponsorship loadout.</p>
                        </div>
                        <div className="grid gap-8 lg:grid-cols-2">
                            {configurators.map((item) => (
                                item.title === 'Diamonds Support' ? (
                                    <DiamondSupportCard key={item.title} item={item} />
                                ) : item.title === 'Senior High School' ? (
                                    <SeniorHighSchoolCard key={item.title} item={item} />
                                ) : item.title === 'Events for a Cause' ? (
                                    <EventsForCauseCard key={item.title} item={item} />
                                ) : item.title === 'Monetary Grants' ? (
                                    <MonetaryGrantsCard key={item.title} item={item} />
                                ) : (
                                    <ConfigCard key={item.title} item={item} />
                                )
                            ))}
                        </div>
                    </div>
                </section>

                <section className="relative px-4 py-10 sm:px-6 sm:py-20 lg:px-12">
                    <div className="absolute -left-48 -top-20 h-[720px] w-[720px] rounded-full bg-dept-purple-500/10 blur-3xl" />
                    <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[584px_1fr]">
                        <div>
                            <Badge icon={Star} className="border-dept-purple-500/20 bg-dept-purple-500/10 text-purple-300">
                                Pro Tier
                            </Badge>
                            <h2 className="mt-8 text-4xl font-black leading-tight text-white sm:text-5xl">
                                Access the
                                <br />
                                <span className="text-dept-purple-500">Tournament Lobby</span>
                            </h2>
                            <p className="mt-6 border-l-2 border-dept-purple-600 pl-5 text-base leading-7 text-gray-400 sm:text-lg sm:leading-8">
                                Experience the game like the pros. Unlock the official tournament client used in MPL and M-Series, featuring comprehensive spectator tools and draft modes.
                            </p>
                            <div className="mt-8 grid gap-3 sm:grid-cols-2">
                                {['Full Hero/Skin Access', 'Cross-Server Matches', 'Pro Draft (6/10 Bans)', 'Broadcast Quality Spec'].map((feature) => (
                                    <div key={feature} className="flex items-center gap-3 text-sm font-semibold text-white">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-dept-green-500/20">
                                            <CheckCircle2 className="h-4 w-4 text-dept-green-600" />
                                        </span>
                                        {feature}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8">
                                <PrimaryButton href="https://forms.gle/uT3v5bU2zxK6mTjMA" purple>
                                    Request Access
                                </PrimaryButton>
                            </div>
                        </div>
                        <div className="relative flex min-h-80 flex-col items-center justify-center overflow-hidden rounded-3xl border border-dept-purple-500/20 bg-bg-surface p-8 text-center shadow-[0_0_40px_-10px_rgba(168,85,247,.3)] sm:min-h-[500px] sm:p-12">
                            <div className="absolute h-80 w-80 rounded-full bg-purple-300/20 blur-3xl" />
                            <Gamepad2 className="relative z-10 h-20 w-20 text-white/20 sm:h-28 sm:w-28" />
                            <div className="relative z-10 mt-8">
                                <h3 className="text-2xl font-black text-white sm:text-3xl">Restricted Access</h3>
                                <p className="mt-1 text-sm text-slate-400 sm:text-base">Verified organizers only</p>
                                <div className="mt-6 inline-flex items-center gap-2 rounded-md border border-slate-700 bg-[#1E1E2E]/80 px-4 py-2 text-xs text-purple-300">
                                    <ShieldCheck className="h-4 w-4" />
                                    CLIENT_VER: 2.1.0_PRO
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="px-4 py-10 sm:px-6 sm:py-20 lg:px-12">
                    <div className="mx-auto max-w-4xl text-center">
                        <h2 className="text-3xl font-bold text-white sm:text-4xl">Sponsorship Roadmap</h2>
                        <p className="mt-2 text-base text-gray-400">Step-by-step process to secure your support.</p>
                        <div className="relative mt-14 space-y-3 text-left">
                            {roadmap.map(([title, description], index) => (
                                <div key={title} className="relative grid grid-cols-[56px_1fr] items-stretch gap-4">
                                    <div className="relative flex items-center justify-center">
                                        {index < roadmap.length - 1 ? (
                                            <div className="absolute left-1/2 top-1/2 h-[calc(100%+0.75rem)] w-px -translate-x-1/2 bg-white/10" />
                                        ) : null}
                                        <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-bg-card text-2xl font-black text-white sm:h-14 sm:w-14 sm:text-3xl">
                                            {index + 1}
                                        </div>
                                    </div>
                                    <div className="rounded-xl border border-white/10 bg-bg-cardHover p-6">
                                        <h3 className="text-lg font-bold text-white">{title}</h3>
                                        <p className="mt-2 text-sm leading-6 text-[#A0A0A0]">{description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-14 flex flex-col justify-center gap-4 sm:flex-row">
                            <PrimaryButton href="https://forms.gle/fpaS8gRR61VgTdY26">
                                Apply for Buffs Now
                            </PrimaryButton>
                            <SecondaryButton>View Full Documentation</SecondaryButton>
                        </div>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
