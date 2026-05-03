import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    Award,
    CheckCircle2,
    ChevronDown,
    Clock3,
    Copy,
    Flame,
    Gamepad2,
    Info,
    Mars,
    MoreHorizontal,
    PencilLine,
    Trophy,
    Venus,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { announcementData as announcements } from './announcementData';
import EditProfileModal from './EditProfileModal';
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

function seasonWithCurrent(label) {
    return label.includes('(Current)') ? label : `${label} (Current)`;
}

const reactionStorageKey = 'student-profile-announcement-reactions';

function loadSavedAnnouncementItems(items) {
    if (typeof window === 'undefined') {
        return items;
    }

    try {
        const savedCounts = JSON.parse(window.localStorage.getItem(reactionStorageKey) ?? '{}');

        return items.map((item) => ({
            ...item,
            reactions: item.reactions.map((reaction) => ({
                ...reaction,
                count: savedCounts[item.id]?.[reaction.id] ?? reaction.count,
            })),
        }));
    } catch {
        return items;
    }
}

function saveAnnouncementReactionCounts(items) {
    if (typeof window === 'undefined') {
        return;
    }

    const counts = items.reduce((announcementCounts, item) => {
        announcementCounts[item.id] = item.reactions.reduce((reactionCounts, reaction) => {
            reactionCounts[reaction.id] = reaction.count;
            return reactionCounts;
        }, {});

        return announcementCounts;
    }, {});

    window.localStorage.setItem(reactionStorageKey, JSON.stringify(counts));
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

function StatBlock({ title, value, icon }) {
    const Icon = statIcons[icon] ?? Trophy;

    return (
        <div className="rounded-lg border border-white/10 bg-[#111111] px-3 py-3 shadow-[0_2px_10px_rgba(242,194,26,0.1)] sm:rounded-2xl sm:px-5 sm:py-5">
            <div className="mb-2 flex h-6 w-6 items-center justify-center rounded-2xl border border-brand-500/20 bg-[linear-gradient(180deg,rgba(0,0,0,0.8),rgba(0,0,0,0.3))] text-brand-700 sm:mb-4 sm:h-8 sm:w-8">
                <Icon className="h-3.5 w-3.5 text-brand-500 sm:h-4 sm:w-4" strokeWidth={2.3} />
            </div>
            <Title className="text-xs font-bold leading-3 text-brand-500 sm:text-lg sm:leading-4">
                {title}
            </Title>
            <div className="mt-1 text-sm font-bold leading-5 text-white sm:mt-2 sm:text-xl sm:leading-7">
                {value}
            </div>
        </div>
    );
}

function AnnouncementCard({ item, index, onReact, burst }) {
    return (
        <div>
            <div className="rounded-2xl bg-[#1a1a1a] p-4 shadow-[0_4px_8px_rgba(0,0,0,0.04)]">
                <div className="mb-3 flex items-start justify-between gap-4">
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

                <div className="mb-4 text-sm font-normal leading-5 text-gray-300">
                    {item.body}
                </div>

                <div className="relative overflow-hidden rounded-2xl bg-black/20">
                    <img
                        src={item.image}
                        alt=""
                        className="h-auto w-full rounded-2xl object-center"
                    />

                    {burst?.map((emote) => (
                        <img
                            key={emote.id}
                            src={emote.icon}
                            alt=""
                            className="pointer-events-none absolute h-12 w-12 object-contain opacity-0"
                            style={{
                                left: `${emote.x}%`,
                                top: `${emote.y}%`,
                                animation: `reaction-burst 2s ease-out forwards`,
                                animationDelay: `${emote.delay}ms`,
                                transform: `translate(-50%, -50%) scale(${emote.scale}) rotate(${emote.rotate}deg)`,
                            }}
                        />
                    ))}
                </div>

                <div className="mt-3 inline-flex flex-wrap items-start gap-3">
                    {item.reactions.map((reaction) => (
                        <button
                            key={reaction.id}
                            type="button"
                            className="inline-flex min-w-[50px] items-center justify-center gap-1 rounded-[10px] p-1.5 text-[10px] font-bold text-gray-300 transition hover:bg-white/5 active:scale-95 sm:min-w-[74px] sm:gap-1.5 sm:rounded-[20px] sm:p-2.5 sm:text-xs"
                            aria-label={`${reaction.label} reaction`}
                            onClick={() => onReact(item.id, reaction.id)}
                        >
                            <img
                                src={reaction.icon}
                                alt=""
                            className="h-7 w-7 object-contain sm:h-10 sm:w-10"
                        />
                            <span>{reaction.count}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function HeroRow({ rank, image, name, matches, wr }) {
    return (
        <div className="flex items-start gap-2 rounded-lg border border-white/5 bg-[#111111] px-3 py-2.5 shadow-[0_2px_10px_rgba(242,194,26,0.1)] sm:gap-3 sm:rounded-xl sm:px-5 sm:py-4">
            <div className="relative z-20 h-8 w-8 shrink-0 overflow-visible sm:h-12 sm:w-12">
                <div className="relative h-full w-full overflow-hidden rounded-lg border border-brand-700 shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
                    <img src={image} alt="" className="h-full w-full object-cover object-center" />
                </div>
                <div className="absolute -bottom-1 -left-1 z-30 rounded-sm border border-white/10 bg-[#1a1a1a] px-1.5 py-0.5 text-[6px] font-bold leading-[6px] text-brand-500">
                    {rank}
                </div>
            </div>
            <div className="min-w-0">
                <div className="text-xs font-bold leading-4 text-gray-300 sm:text-base sm:leading-6">{name}</div>
                <div className="flex items-center gap-1.5 font-['Figtree'] text-[8px] font-bold leading-3 text-gray-500 sm:gap-2 sm:text-xs sm:leading-4">
                    <span>{matches}</span>
                    <span>{wr}</span>
                </div>
            </div>
        </div>
    );
}

export default function Index() {
    const [profile, setProfile] = useState(data);
    const [announcementItems, setAnnouncementItems] = useState(() => loadSavedAnnouncementItems(announcements));
    const [reactionBursts, setReactionBursts] = useState({});
    const [activeMobileTab, setActiveMobileTab] = useState('about');
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

    useEffect(() => {
        saveAnnouncementReactionCounts(announcementItems);
    }, [announcementItems]);

    function handleReaction(announcementId, reactionId) {
        const announcement = announcementItems.find((item) => item.id === announcementId);
        const reaction = announcement?.reactions.find((item) => item.id === reactionId);

        if (!reaction) {
            return;
        }

        setAnnouncementItems((items) =>
            items.map((item) =>
                item.id === announcementId
                    ? {
                          ...item,
                          reactions: item.reactions.map((currentReaction) =>
                              currentReaction.id === reactionId
                                  ? { ...currentReaction, count: currentReaction.count + 1 }
                                  : currentReaction,
                          ),
                      }
                    : item,
            ),
        );

        const burst = Array.from({ length: 7 }, (_, index) => ({
            id: `${announcementId}-${reactionId}-${Date.now()}-${index}`,
            icon: reaction.icon,
            x: 12 + Math.random() * 76,
            y: 18 + Math.random() * 64,
            delay: index * 70,
            scale: 0.82 + Math.random() * 0.55,
            rotate: -20 + Math.random() * 40,
        }));

        setReactionBursts((current) => ({
            ...current,
            [announcementId]: burst,
        }));

        window.setTimeout(() => {
            setReactionBursts((current) => ({
                ...current,
                [announcementId]: [],
            }));
        }, 2200);
    }

    function handleMobileTabClick(tab) {
        setActiveMobileTab(tab);
    }

    return (
        <MainLayout fullWidth>
            <Head title="Student Portal" />

            <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-10">
                <style>
                    {`
                        @keyframes reaction-burst {
                            0% {
                                opacity: 0;
                                margin-top: 28px;
                                filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.45));
                            }
                            18% {
                                opacity: 1;
                            }
                            78% {
                                opacity: 1;
                            }
                            100% {
                                opacity: 0;
                                margin-top: -96px;
                                filter: drop-shadow(0 10px 16px rgba(0, 0, 0, 0.35));
                            }
                        }
                    `}
                </style>

                <SurfaceCard className="mb-2.5 rounded-xl !overflow-visible lg:rounded-3xl lg:!overflow-hidden">
                    <div className="relative h-36 overflow-hidden bg-[#111111] p-1 shadow-[inset_0_-20px_12px_rgba(0,0,0,0.4)] lg:h-80 lg:p-2.5 lg:shadow-[inset_0_-50px_30px_rgba(0,0,0,0.4)]">
                        <img
                            src={profile.profileBackground}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,193,74,0.18),transparent_24%),linear-gradient(90deg,rgba(8,8,8,0.78),rgba(24,14,32,0.48),rgba(8,8,8,0.18)),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_20%,transparent_70%,rgba(0,0,0,0.18))]" />
                    </div>

                    <div className="flex w-full max-w-full flex-col overflow-visible lg:overflow-hidden">
                        <div
                            className="border-b border-white/10"
                            style={{
                                paddingLeft: `${profile.header.paddingX}px`,
                                paddingRight: `${profile.header.paddingX}px`,
                                paddingTop: `${profile.header.paddingY}px`,
                                paddingBottom: `${profile.header.paddingY}px`,
                            }}
                        >
                            <div className="flex flex-col items-center gap-5 lg:flex-row lg:items-start lg:justify-between">
                                <div className="flex min-w-0 flex-col items-center lg:flex-row lg:items-center" style={{ gap: `${profile.header.gap}px` }}>
                                    <div className="relative z-20 -mt-16 flex h-20 w-20 shrink-0 items-center justify-center overflow-visible lg:mt-0 lg:h-36 lg:w-36">
                                        <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl border-2 border-brand-700 shadow-[0_2px_4px_rgba(16,24,40,0.05)] lg:rounded-3xl lg:border-[3px]">
                                            <img
                                                src={profile.featuredIcon}
                                                alt=""
                                                className="h-full w-full object-contain object-center"
                                            />
                                        </div>
                                        <div className="absolute bottom-[-6px] right-[-10px] z-30 rounded border border-white/10 bg-[#111111] px-1.5 py-0.5 text-[7px] font-bold leading-3 text-brand-500 shadow-[0_0_10px_rgba(242,194,26,0.1)] lg:bottom-0 lg:rounded-lg lg:px-2.5 lg:py-1 lg:text-sm">
                                            {profile.playerLevel}
                                        </div>
                                    </div>

                                    <div
                                        className="flex min-w-0 flex-col items-center gap-1.5 overflow-hidden px-0 py-0 pt-2 text-center sm:px-6 sm:py-3 sm:pt-4 lg:items-start lg:text-left"
                                        style={{ maxWidth: `${profile.header.rowMaxWidth}px` }}
                                    >
                                        <div className="inline-flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 self-center lg:justify-start lg:self-start">
                                            <div className="min-w-0 max-w-full text-center text-3xl font-black leading-8 text-brand-400 lg:text-left lg:text-[2.45rem] lg:leading-[1.08] xl:text-[3.2rem]">
                                                {profile.playerName}
                                            </div>
                                            <span className="inline-flex translate-y-[1px] items-center self-center">
                                                <GenderIcon gender={profile.playerGender} />
                                            </span>
                                            <button
                                                type="button"
                                                className="inline-flex items-center justify-center rounded-md bg-brand-500/20 p-1 text-brand-500 transition hover:bg-brand-500/30 lg:hidden"
                                                aria-label="Edit player profile"
                                                onClick={() => setIsEditProfileOpen(true)}
                                            >
                                                <PencilLine className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <div className="flex flex-nowrap items-center gap-1.5 text-[15px] font-bold leading-5 text-gray-500 font-['Figtree']">
                                            <span className="whitespace-nowrap">{profile.playerUsername}</span>
                                            <button
                                                type="button"
                                                className="inline-flex shrink-0 items-center justify-center rounded-md p-0.5 text-gray-500 transition hover:bg-white/5 hover:text-gray-300"
                                                aria-label="Copy username"
                                                onClick={async () => {
                                                    try {
                                                        await copyToClipboard(profile.playerUsername);
                                                        toast.success('Username copied');
                                                    } catch {
                                                        toast.error('Copy failed');
                                                    }
                                                }}
                                            >
                                                <Copy className="h-4 w-4" />
                                            </button>
                                            {profile.isVerified ? (
                                                <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-green-500/30 bg-green-900/30 px-1.5 py-1 text-[11px] font-medium text-dept-green-500">
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                    Verified
                                                </span>
                                            ) : null}
                                        </div>

                                        <div className="flex flex-col gap-0.5">
                                            <div className="text-base font-semibold leading-6 text-gray-400">
                                                {profile.schoolName}
                                            </div>
                                            <div className="text-sm font-semibold leading-5 text-gray-500">
                                                {profile.yearLevel} - {profile.courseName}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="hidden shrink-0 items-center justify-center gap-2 self-center rounded-xl border border-gray-500/50 bg-transparent px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-500/30 lg:mr-2 lg:mt-4 lg:inline-flex lg:self-start"
                                    aria-label="Edit player profile"
                                    onClick={() => setIsEditProfileOpen(true)}
                                >
                                    <PencilLine className="h-5 w-5 text-yellow-400" />
                                    {profile.profileEditLabel}
                                </button>
                            </div>
                        </div>
                    </div>
                </SurfaceCard>

                <div className="mb-2.5 grid grid-cols-2 gap-1 rounded-[10px] border border-brand-500/10 bg-brand-500/10 p-1 lg:hidden">
                    {[
                        { id: 'about', label: 'About' },
                        { id: 'announcements', label: 'Announcements' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            className={`h-9 rounded-md px-3 text-sm font-semibold transition ${
                                activeMobileTab === tab.id
                                    ? 'bg-brand-500 text-gray-900 shadow-[0_1px_3px_rgba(16,24,40,0.1)]'
                                    : 'text-gray-300 hover:bg-white/5'
                            }`}
                            onClick={() => handleMobileTabClick(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col gap-1.5 lg:hidden">
                    {activeMobileTab === 'about' && (
                    <div>
                        <div className="flex flex-col gap-1.5">
                            <SurfaceCard className="rounded-xl p-6 pb-2.5 backdrop-blur-md">
                                <div className="mb-3 flex items-start justify-between gap-4">
                                    <div className="text-lg font-bold leading-4 text-brand-400">
                                        Player Information
                                    </div>
                                    <div className="group relative">
                                        <button
                                            type="button"
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-brand-500 transition hover:bg-white/5"
                                            aria-label={profile.syncNotice}
                                        >
                                            <Info className="h-4 w-4" />
                                        </button>
                                        <div className="pointer-events-none absolute right-0 top-10 z-30 w-64 rounded-xl border border-brand-500/20 bg-[#111111] px-4 py-3 text-xs font-medium leading-5 text-brand-500 opacity-0 shadow-xl transition group-hover:opacity-100">
                                            {profile.syncNotice}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex min-w-0 flex-col gap-1">
                                        {[
                                            ['IGN', profile.playerInformation.ign],
                                            ['UID', profile.playerInformation.uid],
                                            ['SERVER', profile.playerInformation.server],
                                            ['SQUAD', profile.playerInformation.squad],
                                            ['ROLE', profile.playerInformation.role],
                                        ].map(([label, value]) => (
                                            <div key={label} className="flex items-center gap-2">
                                                <div className="text-sm font-medium leading-5 text-stone-300">
                                                    {label}
                                                </div>
                                                <div className={`text-base font-semibold leading-5 ${label === 'SQUAD' ? 'text-brand-400' : 'text-gray-300'}`}>
                                                    {value}
                                                </div>
                                                {label === 'UID' && (
                                                    <button
                                                        type="button"
                                                        className="inline-flex shrink-0 items-center justify-center rounded-md p-0.5 text-gray-400 transition hover:bg-white/5 hover:text-gray-200"
                                                        aria-label="Copy UID"
                                                        onClick={async () => {
                                                            try {
                                                                await copyToClipboard(profile.playerInformation.uid);
                                                                toast.success('UID copied');
                                                            } catch {
                                                                toast.error('Copy failed');
                                                            }
                                                        }}
                                                    >
                                                        <Copy className="h-3.5 w-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <img
                                        src={profile.playerInformation.rankImage}
                                        alt="Ranked Image"
                                        className="h-40 w-36 shrink-0 rounded-2xl object-cover object-center shadow-[0_2px_4px_rgba(16,24,40,0.05)]"
                                    />
                                </div>
                            </SurfaceCard>

                            <SurfaceCard className="rounded-xl p-4 backdrop-blur-md">
                                <div className="grid grid-cols-[minmax(0,42%)_minmax(0,58%)] gap-2.5">
                                    <div className="flex flex-col items-center gap-3.5 text-center">
                                        <div>
                                            <div className="text-lg font-bold leading-4 text-brand-400">
                                                Most Used Hero
                                            </div>
                                            <button
                                                type="button"
                                                className="mt-1 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[8px] font-normal leading-3 text-gray-300 transition hover:bg-white/5"
                                                aria-label="Select season"
                                            >
                                                {seasonWithCurrent(profile.mostUsedHero.seasonLabel)}
                                                <ChevronDown className="h-2.5 w-2.5" />
                                            </button>
                                        </div>

                                        <div className="flex flex-col items-center gap-2">
                                            <img
                                                src={profile.mostUsedHero.image}
                                                alt=""
                                                className="h-24 w-24 rounded-2xl border-2 border-brand-700 object-cover object-center"
                                            />
                                            <div className="text-lg font-bold leading-4 text-brand-400">
                                                {profile.mostUsedHero.name}
                                            </div>
                                        </div>

                                        <div className="grid w-full grid-cols-2 gap-1.5">
                                            {[
                                                ['MATCHES', profile.mostUsedHero.stats.matches],
                                                ['WIN RATE', profile.mostUsedHero.stats.winRate],
                                            ].map(([label, value]) => (
                                                <div key={label} className="rounded-lg border border-white/5 bg-[#111111] px-2 py-2 shadow-[0_1px_6px_rgba(242,194,26,0.1)]">
                                                    <div className="text-left text-[9px] font-bold leading-4 text-brand-500">
                                                        {label}
                                                    </div>
                                                    <div className="text-left text-[9px] font-semibold leading-4 text-white">
                                                        {value}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-between gap-1.5">
                                        {profile.heroList.slice(0, 4).map((hero) => (
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

                            <div className="grid grid-cols-3 gap-1.5">
                                {profile.stats.slice(0, 3).map((stat) => (
                                    <StatBlock key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} />
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-1.5">
                                {profile.stats.slice(3, 5).map((stat) => (
                                    <StatBlock key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} />
                                ))}
                            </div>

                            <SurfaceCard className="rounded-md p-2.5 backdrop-blur-md">
                                <div className="text-xs font-semibold leading-4 text-gray-100">
                                    Announcements
                                </div>

                                <div className="mt-1.5 flex flex-col gap-2.5">
                                    {announcementItems.map((item, index) => (
                                        <AnnouncementCard
                                            key={item.id}
                                            item={item}
                                            index={index}
                                            onReact={handleReaction}
                                            burst={reactionBursts[item.id]}
                                        />
                                    ))}
                                </div>
                            </SurfaceCard>
                        </div>
                    </div>
                    )}

                    {activeMobileTab === 'announcements' && (
                    <div>
                        <SurfaceCard className="rounded-md p-2.5 backdrop-blur-md">
                            <div className="text-xs font-semibold leading-4 text-gray-100">
                                Announcements
                            </div>

                            <div className="mt-1.5 flex flex-col gap-2.5">
                                {announcementItems.map((item, index) => (
                                    <AnnouncementCard
                                        key={item.id}
                                        item={item}
                                        index={index}
                                        onReact={handleReaction}
                                        burst={reactionBursts[item.id]}
                                    />
                                ))}
                            </div>
                        </SurfaceCard>
                    </div>
                    )}
                </div>

                <div className="hidden gap-2.5 lg:grid lg:grid-cols-[minmax(0,515px)_minmax(0,834px)] lg:items-start lg:justify-center">
                    <div className="flex min-w-0 flex-col gap-2.5">
                        <SurfaceCard className="p-8 pb-4 backdrop-blur-md">
                            <div className="mb-3 flex items-start justify-between gap-4">
                                <div className="text-2xl font-black leading-6 text-brand-400">
                                    Player Information
                                </div>
                                <div className="group relative">
                                    <button
                                        type="button"
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-brand-500 transition hover:bg-white/5"
                                        aria-label={profile.syncNotice}
                                    >
                                        <Info className="h-5 w-5" />
                                    </button>
                                    <div className="pointer-events-none absolute right-0 top-11 z-30 w-72 rounded-xl border border-brand-500/20 bg-[#111111] px-4 py-3 text-xs font-medium leading-5 text-brand-500 opacity-0 shadow-xl transition group-hover:opacity-100">
                                        {profile.syncNotice}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start justify-between gap-4">
                                <div className="flex flex-col gap-1 py-1">
                                    <div className="flex items-center gap-3">
                                        <div className="text-sm font-bold leading-5 text-stone-300">
                                            IGN
                                        </div>
                                        <div className="text-lg font-bold leading-6 text-gray-300">
                                            {profile.playerInformation.ign}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="text-sm font-bold leading-5 text-stone-300">
                                            UID
                                        </div>
                                        <div className="flex items-center gap-2 text-lg font-bold leading-6 text-gray-300">
                                            <span>{profile.playerInformation.uid}</span>
                                            <button
                                                type="button"
                                                className="inline-flex shrink-0 items-center justify-center rounded-md p-0.5 text-gray-400 transition hover:bg-white/5 hover:text-gray-200"
                                                aria-label="Copy UID"
                                                onClick={async () => {
                                                    try {
                                                        await copyToClipboard(profile.playerInformation.uid);
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
                                            {profile.playerInformation.server}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="text-sm font-bold leading-5 text-stone-300">
                                            SQUAD
                                        </div>
                                        <div className="text-lg font-bold leading-6 text-brand-400">
                                            {profile.playerInformation.squad}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="text-sm font-bold leading-5 text-stone-300">
                                            ROLE
                                        </div>
                                        <div className="text-lg font-bold leading-6 text-gray-300">
                                            {profile.playerInformation.role}
                                        </div>
                                    </div>
                                </div>

                                <div className="h-[calc(100%-8px)] w-40 overflow-hidden rounded-3xl shadow-[0_2px_4px_rgba(16,24,40,0.05)]">
                                    <img
                                        src={profile.playerInformation.rankImage}
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
                                        {seasonWithCurrent(profile.mostUsedHero.seasonLabel)}
                                        <ChevronDown className="h-3.5 w-3.5" />
                                    </button>

                                    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-4">
                                        <div className="relative h-36 w-36">
                                            <div className="absolute inset-0 rounded-3xl border-[3px] border-brand-700 bg-[radial-gradient(circle_at_50%_30%,rgba(190,205,255,0.96),rgba(79,99,219,0.9)_38%,rgba(17,24,39,0.98)_88%)] shadow-[0_2px_4px_rgba(16,24,40,0.05)]" />
                                            <img
                                                src={profile.mostUsedHero.image}
                                                alt=""
                                                className="absolute inset-0 h-full w-full rounded-3xl object-cover object-center scale-110"
                                            />
                                        </div>
                                        <div className="text-2xl font-black leading-6 text-brand-400">
                                            {profile.mostUsedHero.name}
                                        </div>
                                    </div>

                                    <div className="mt-auto grid w-full grid-cols-2 gap-2.5 pt-4">
                                        <div className="rounded-xl border border-white/5 bg-[#111111] px-3 py-3 shadow-[0_2px_10px_rgba(242,194,26,0.1)]">
                                            <div className="text-sm font-bold leading-5 text-brand-500">
                                                MATCHES
                                            </div>
                                            <div className="mt-1 text-sm font-semibold leading-5 text-white">
                                                {profile.mostUsedHero.stats.matches}
                                            </div>
                                        </div>
                                        <div className="rounded-xl border border-white/5 bg-[#111111] px-3 py-3 shadow-[0_2px_10px_rgba(242,194,26,0.1)]">
                                            <div className="text-sm font-bold leading-5 text-brand-500">
                                                WIN RATE
                                            </div>
                                            <div className="mt-1 text-sm font-semibold leading-5 text-white">
                                                {profile.mostUsedHero.stats.winRate}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2.5">
                                    {profile.heroList.map((hero) => (
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

                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                            {profile.stats.slice(0, 3).map((stat) => (
                                <StatBlock key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} />
                            ))}
                        </div>

                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                            {profile.stats.slice(3, 5).map((stat) => (
                                <StatBlock key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} />
                            ))}
                        </div>
                    </div>

                    <SurfaceCard className="p-6 backdrop-blur-md">
                        <div className="text-xl font-semibold leading-8 text-gray-100">
                            Announcements
                        </div>

                        <div className="mt-4 flex flex-col gap-6">
                            {announcementItems.map((item, index) => (
                                <AnnouncementCard
                                    key={item.id}
                                    item={item}
                                    index={index}
                                    onReact={handleReaction}
                                    burst={reactionBursts[item.id]}
                                />
                            ))}
                        </div>
                    </SurfaceCard>
                </div>
            </div>

            {isEditProfileOpen ? (
                <EditProfileModal
                    profile={profile}
                    onClose={() => setIsEditProfileOpen(false)}
                    onSave={(updates) => {
                        setProfile((current) => ({
                            ...current,
                            ...updates,
                            editableProfile: {
                                ...current.editableProfile,
                                ...updates.editableProfile,
                            },
                            playerInformation: {
                                ...current.playerInformation,
                                ...updates.playerInformation,
                            },
                        }));
                    }}
                />
            ) : null}
        </MainLayout>
    );
}
