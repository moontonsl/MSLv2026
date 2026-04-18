import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import {
    Award,
    CheckCircle2,
    ChevronDown,
    Clock3,
    Copy,
    Flame,
    Gamepad2,
    Mars,
    MoreHorizontal,
    PencilLine,
    Trophy,
    Venus,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { announcementData as announcements } from './announcementData';
import { studentProfileData as data } from './studentProfileData';

function SurfaceCard({ className = '', children }) {
    return (
        <div
            className={`overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0b] shadow-[0_4px_4px_rgba(0,0,0,0.2)] ${className}`}
        >
            {children}
        </div>
    );
}

function Title({ children, className = '' }) {
    return (
        <div className={`font-['League_Spartan'] ${className}`}>
            {children}
        </div>
    );
}

function GenderIcon({ gender }) {
    const Icon = gender === 'female' ? Venus : Mars;

    return <Icon className="h-5 w-5 shrink-0 text-brand-500" strokeWidth={2.2} />;
}

async function copyToClipboard(text) {
    if (navigator.clipboard?.writeText && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();

    const success = document.execCommand('copy');
    document.body.removeChild(textarea);

    if (!success) {
        throw new Error('copy failed');
    }
}

const statIcons = {
    trophy: Trophy,
    gamepad: Gamepad2,
    clock: Clock3,
    fire: Flame,
    award: Award,
};

function StatBlock({ title, value, icon, fullWidth = false }) {
    const Icon = statIcons[icon] ?? Trophy;

    return (
        <div
            className={`rounded-2xl border border-white/10 bg-[#111111] px-6 py-5 shadow-[0_2px_10px_rgba(242,194,26,0.1)] ${fullWidth ? 'col-span-2' : ''}`}
        >
            <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-2xl border border-brand-500/20 bg-[linear-gradient(180deg,rgba(0,0,0,0.8),rgba(0,0,0,0.3))] text-brand-700">
                <Icon className="h-4 w-4 text-brand-500" strokeWidth={2.3} />
            </div>
            <Title className="text-lg font-bold leading-4 text-brand-500">
                {title}
            </Title>
            <div className="mt-2 text-xl font-bold leading-7 text-white">
                {value}
            </div>
        </div>
    );
}

function HeroRow({ rank, image, name, matches, wr }) {
    return (
        <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-[#111111] px-5 py-4 shadow-[0_2px_10px_rgba(242,194,26,0.1)]">
            <div className="relative z-20 h-12 w-12 shrink-0 overflow-visible">
                <div className="relative h-full w-full overflow-hidden rounded-lg border border-brand-700 shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
                    <img src={image} alt="" className="h-full w-full object-cover object-center" />
                </div>
                <div className="absolute -bottom-1 -left-1 z-30 rounded-sm border border-white/10 bg-[#1a1a1a] px-1.5 py-0.5 text-[6px] font-bold leading-[6px] text-brand-500">
                    {rank}
                </div>
            </div>
            <div className="min-w-0">
                <div className="text-base font-bold leading-6 text-gray-300">{name}</div>
                <div className="flex items-center gap-2 font-['Figtree'] text-xs font-bold leading-4 text-gray-500">
                    <span>{matches}</span>
                    <span>{wr}</span>
                </div>
            </div>
        </div>
    );
}

export default function Index() {
    return (
        <MainLayout fullWidth>
            <Head title="Student Portal" />

            <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-10">
                <div className="grid gap-2.5 lg:grid-cols-[minmax(0,834px)_minmax(0,515px)] lg:items-start lg:justify-center">
                    <div className="flex min-w-0 flex-col gap-2.5">
                        <SurfaceCard>
                            <div className="relative h-80 overflow-hidden bg-[#111111] p-2.5 shadow-[inset_0_-50px_30px_rgba(0,0,0,0.4)]">
                                <img
                                    src="/profile-background.jpg"
                                    alt=""
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,193,74,0.18),transparent_24%),linear-gradient(90deg,rgba(8,8,8,0.78),rgba(24,14,32,0.48),rgba(8,8,8,0.18)),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_20%,transparent_70%,rgba(0,0,0,0.18))]" />
                                <button
                                    type="button"
                                    className="absolute right-4 top-4 z-10 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/60 px-3 py-1 text-sm font-semibold text-white shadow-[inset_0_-2px_0_rgba(10,13,18,0.05)] backdrop-blur-sm"
                                >
                                    <PencilLine className="h-4 w-4" />
                                    {data.backgroundEditLabel}
                                </button>
                            </div>

                            <div className="flex w-full max-w-full flex-col overflow-hidden">
                                <div
                                    className="border-b border-white/10"
                                    style={{
                                        paddingLeft: `${data.header.paddingX}px`,
                                        paddingRight: `${data.header.paddingX}px`,
                                        paddingTop: `${data.header.paddingY}px`,
                                        paddingBottom: `${data.header.paddingY}px`,
                                    }}
                                >
                                    <div
                                        className="flex flex-col lg:flex-row lg:items-center"
                                        style={{ gap: `${data.header.gap}px` }}
                                    >
                                        <div className="relative z-20 flex h-36 w-36 shrink-0 items-center justify-center overflow-visible">
                                            <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-3xl border-[3px] border-brand-700 shadow-[0_2px_4px_rgba(16,24,40,0.05)]">
                                                <img
                                                    src={data.featuredIcon}
                                                    alt=""
                                                    className="h-full w-full object-contain object-center"
                                                />
                                            </div>
                                            <div className="absolute bottom-0 right-[-10px] z-30 rounded-lg border border-white/10 bg-[#111111] px-2.5 py-1 text-sm font-bold text-brand-500 shadow-[0_0_10px_rgba(242,194,26,0.1)]">
                                                {data.playerLevel}
                                            </div>
                                        </div>

                                        <div
                                            className="flex min-w-0 basis-0 flex-col gap-1.5 overflow-hidden px-0 py-0 pt-2 sm:px-6 sm:py-3 sm:pt-4"
                                            style={{ flex: data.header.textFlex }}
                                        >
                                            <div
                                                className="inline-flex max-w-full items-center gap-x-2 gap-y-1 self-start"
                                                style={{ maxWidth: `${data.header.rowMaxWidth}px` }}
                                            >
                                                <div className="min-w-0 max-w-full text-left whitespace-normal break-words text-2xl font-black leading-[1.08] text-brand-400 sm:text-[2.45rem] xl:text-[3.2rem]">
                                                    {data.playerName}
                                                </div>
                                                <div className="flex shrink-0 items-center gap-1.5">
                                                    <GenderIcon gender={data.playerGender} />
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center justify-center rounded-xl bg-brand-500/20 p-2 text-brand-500 transition hover:bg-brand-500/30"
                                                        aria-label="Edit player profile"
                                                    >
                                                        <PencilLine className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex flex-nowrap items-center gap-1.5 text-[15px] font-bold leading-5 text-gray-500 font-['Figtree']">
                                                <span className="whitespace-nowrap">{data.playerUsername}</span>
                                                <button
                                                    type="button"
                                                    className="inline-flex shrink-0 items-center justify-center rounded-md p-0.5 text-gray-500 transition hover:bg-white/5 hover:text-gray-300"
                                                    aria-label="Copy username"
                                                    onClick={async () => {
                                                        try {
                                                            await copyToClipboard(data.playerUsername);
                                                            toast.success('Username copied');
                                                        } catch {
                                                            toast.error('Copy failed');
                                                        }
                                                    }}
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </button>
                                                <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-green-500/30 bg-green-900/30 px-1.5 py-1 text-[11px] font-medium text-dept-green-500">
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                    Verified
                                                </span>
                                            </div>

                                            <div className="flex flex-col gap-0.5">
                                                <div className="text-base font-semibold leading-6 text-gray-400">
                                                    {data.schoolName}
                                                </div>
                                                <div className="text-sm font-semibold leading-5 text-gray-500">
                                                    {data.courseName}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SurfaceCard>

                        <SurfaceCard className="p-6 backdrop-blur-md">
                            <div className="text-xl font-semibold leading-8 text-gray-100">
                                Announcements
                            </div>

                            <div className="mt-4 flex flex-col gap-6">
                                {announcements.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="overflow-hidden rounded-2xl bg-[#1a1a1a] p-4 shadow-[0_4px_8px_rgba(0,0,0,0.04)]"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-2">
                                                <img
                                                    src={item.icon}
                                                    alt=""
                                                    className="h-10 w-10 rounded-full object-cover object-center"
                                                />
                                                <div className="flex flex-col">
                                                    <div className="text-sm font-semibold leading-5 text-gray-200">
                                                        {item.title}
                                                    </div>
                                                    <div className="text-xs font-normal leading-4 text-gray-500">
                                                        {item.posted}
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                className="rounded-lg px-2 py-2 text-gray-300 hover:bg-white/5"
                                                aria-label={`More options for announcement ${index + 1}`}
                                            >
                                                <MoreHorizontal className="h-5 w-5" />
                                            </button>
                                        </div>

                                        <div className="mt-4 text-sm font-normal leading-5 text-gray-300">
                                            {item.body}
                                        </div>

                                        <div className="mt-4 overflow-hidden rounded-2xl">
                                            <img
                                                src={item.image}
                                                alt=""
                                                className="h-[725px] w-full rounded-2xl object-cover object-center"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </SurfaceCard>
                    </div>

                    <div className="flex min-w-0 flex-col gap-2">
                        <SurfaceCard className="p-8 pb-4 backdrop-blur-md">
                            <div className="mb-3 text-2xl font-black leading-6 text-brand-400">
                                Player Information
                            </div>

                            <div className="flex items-start justify-between gap-4">
                                <div className="flex flex-col gap-1 py-1">
                                    <div className="flex items-center gap-3">
                                        <div className="text-sm font-bold leading-5 text-stone-300">
                                            IGN
                                        </div>
                                        <div className="text-lg font-bold leading-6 text-gray-300">
                                            {data.playerInformation.ign}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="text-sm font-bold leading-5 text-stone-300">
                                            UID
                                        </div>
                                        <div className="flex items-center gap-2 text-lg font-bold leading-6 text-gray-300">
                                            <span>{data.playerInformation.uid}</span>
                                            <button
                                                type="button"
                                                className="inline-flex shrink-0 items-center justify-center rounded-md p-0.5 text-gray-400 transition hover:bg-white/5 hover:text-gray-200"
                                                aria-label="Copy UID"
                                                onClick={async () => {
                                                    try {
                                                        await copyToClipboard(data.playerInformation.uid);
                                                        toast.success('UID copied');
                                                    } catch {
                                                        toast.error('Copy failed');
                                                    }
                                                }}
                                            >
                                                <Copy className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="text-sm font-bold leading-5 text-stone-300">
                                            SERVER
                                        </div>
                                        <div className="text-lg font-bold leading-6 text-gray-300">
                                            {data.playerInformation.server}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="text-sm font-bold leading-5 text-stone-300">
                                            SQUAD
                                        </div>
                                        <div className="text-lg font-bold leading-6 text-brand-400">
                                            {data.playerInformation.squad}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="text-sm font-bold leading-5 text-stone-300">
                                            ROLE
                                        </div>
                                        <div className="text-lg font-bold leading-6 text-gray-300">
                                            {data.playerInformation.role}
                                        </div>
                                    </div>
                                </div>

                                <div className="h-[calc(100%-8px)] w-40 overflow-hidden rounded-3xl shadow-[0_2px_4px_rgba(16,24,40,0.05)]">
                                    <img
                                        src={data.playerInformation.rankImage}
                                        alt="Ranked Image"
                                        className="h-full w-full object-cover object-center"
                                    />
                                </div>
                            </div>
                        </SurfaceCard>

                        <SurfaceCard className="p-6 backdrop-blur-md">
                            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-stretch">
                                <div className="flex h-full flex-col items-center text-center">
                                    <div className="text-2xl font-black leading-6 text-brand-400">
                                        Most Used Hero
                                    </div>
                                    <button
                                        type="button"
                                        className="mt-1 inline-flex items-center gap-1 rounded-md px-3 py-0.5 text-xs font-normal leading-4 text-gray-300 transition hover:bg-white/5"
                                        aria-label="Select season"
                                    >
                                        {data.mostUsedHero.seasonLabel}
                                        <ChevronDown className="h-3.5 w-3.5" />
                                    </button>

                                    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-4">
                                        <div className="relative h-36 w-36">
                                            <div className="absolute inset-0 rounded-3xl border-[3px] border-brand-700 bg-[radial-gradient(circle_at_50%_30%,rgba(190,205,255,0.96),rgba(79,99,219,0.9)_38%,rgba(17,24,39,0.98)_88%)] shadow-[0_2px_4px_rgba(16,24,40,0.05)]" />
                                            <img
                                                src={data.mostUsedHero.image}
                                                alt=""
                                                className="absolute inset-0 h-full w-full rounded-3xl object-cover object-center scale-110"
                                            />
                                        </div>
                                        <div className="text-2xl font-black leading-6 text-brand-400">
                                            {data.mostUsedHero.name}
                                        </div>
                                    </div>

                                    <div className="mt-auto grid w-full grid-cols-2 gap-2.5 pt-4">
                                        <div className="rounded-xl border border-white/5 bg-[#111111] px-3 py-3 shadow-[0_2px_10px_rgba(242,194,26,0.1)]">
                                            <div className="text-sm font-bold leading-5 text-brand-500">
                                                MATCHES
                                            </div>
                                            <div className="mt-1 text-sm font-semibold leading-5 text-white">
                                                {data.mostUsedHero.stats.matches}
                                            </div>
                                        </div>
                                        <div className="rounded-xl border border-white/5 bg-[#111111] px-3 py-3 shadow-[0_2px_10px_rgba(242,194,26,0.1)]">
                                            <div className="text-sm font-bold leading-5 text-brand-500">
                                                WINS
                                            </div>
                                            <div className="mt-1 text-sm font-semibold leading-5 text-white">
                                                {data.mostUsedHero.stats.wins}
                                            </div>
                                        </div>
                                        <div className="col-span-2 rounded-xl border border-white/5 bg-[#111111] px-3 py-3 shadow-[0_2px_10px_rgba(242,194,26,0.1)]">
                                            <div className="text-sm font-bold leading-5 text-brand-500">
                                                WIN RATE
                                            </div>
                                            <div className="mt-1 text-sm font-semibold leading-5 text-white">
                                                {data.mostUsedHero.stats.winRate}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2.5">
                                    {data.heroList.map((hero) => (
                                        <HeroRow
                                            key={hero.id}
                                            rank={hero.id}
                                            image={hero.image}
                                            name={hero.name}
                                            matches={hero.matches}
                                            wr={hero.wr}
                                        />
                                    ))}
                                </div>
                            </div>
                        </SurfaceCard>

                        <div className="grid grid-cols-2 gap-2.5">
                            <StatBlock
                                title={data.stats[0].title}
                                value={data.stats[0].value}
                                icon={data.stats[0].icon}
                                fullWidth
                            />
                            <StatBlock title={data.stats[1].title} value={data.stats[1].value} icon={data.stats[1].icon} />
                            <StatBlock title={data.stats[2].title} value={data.stats[2].value} icon={data.stats[2].icon} />
                            <StatBlock title={data.stats[3].title} value={data.stats[3].value} icon={data.stats[3].icon} />
                            <StatBlock title={data.stats[4].title} value={data.stats[4].value} icon={data.stats[4].icon} />
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
