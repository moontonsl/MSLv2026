import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { ChevronRight, Play, Users, Zap } from 'lucide-react';

const OPTIONS = [
    {
        id: 'create',
        title: 'Create a New Team',
        description: 'Start fresh and build your roster.',
        href: '/Tournament/CampusTournamentReg',
        icon: Users,
        highlight: true,
    },
    {
        id: 'join',
        title: 'Join an Existing Team',
        description: 'Join a team that already has a slot.',
        href: '/Tournament/MemberJoin',
        icon: ChevronRight,
        highlight: false,
    },
    {
        id: 'solo',
        title: 'Solo Matchmaking',
        description: 'Get matched with other solo players.',
        href: '/Tournament/SoloPlayer',
        icon: Zap,
        highlight: false,
    },
];

function MediaPanel({ className = '' }) {
    return (
        <div className={`relative overflow-hidden rounded-2xl ${className}`}>
            <img
                src="/profile-background.jpg"
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <button
                type="button"
                className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-yellow-500 text-black transition-transform hover:scale-105"
                aria-label="Play video"
            >
                <Play className="h-6 w-6 fill-current" />
            </button>
        </div>
    );
}

export default function CaptainHub() {
    return (
        <MainLayout fullWidth>
            <Head title="Campus Tournament Registration" />

            <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-[#0a0a0a] px-4 py-8 sm:px-6 sm:py-10">
                {/* Mobile: stacked cards matching mobile registration screen */}
                <div className="w-full max-w-md space-y-4 md:hidden">
                    <div className="rounded-3xl border border-neutral-800 bg-[#111111] p-6">
                        <div className="mb-5 flex items-center gap-2">
                            <img src="/msl-logo.png" alt="" className="h-8 w-auto" />
                            <span className="text-sm font-semibold text-white">MSL Philippines</span>
                        </div>
                        <h1 className="text-2xl font-bold leading-tight text-white">
                            Where Student Gamers{' '}
                            <span className="text-yellow-500">Become Campus Legends</span>
                        </h1>

                        <div className="mt-6 space-y-3">
                            {OPTIONS.map((option) => {
                                const Icon = option.icon;
                                return (
                                    <Link
                                        key={option.id}
                                        href={option.href}
                                        className={`group flex min-h-[72px] items-center gap-3 rounded-xl border px-3 py-3 transition-colors ${
                                            option.highlight
                                                ? 'border-yellow-500/40 bg-yellow-500/10'
                                                : 'border-neutral-800 bg-[#0a0a0a]'
                                        }`}
                                    >
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-500 text-black">
                                            <Icon className="h-5 w-5" />
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block text-sm font-bold text-white">
                                                {option.title}
                                            </span>
                                            <span className="block text-xs text-gray-400">
                                                {option.description}
                                            </span>
                                        </span>
                                        <ChevronRight className="h-5 w-5 shrink-0 text-gray-400" />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <MediaPanel className="aspect-[16/10] min-h-[180px] border border-neutral-800" />
                </div>

                {/* Desktop: split card */}
                <div className="hidden w-full max-w-5xl overflow-hidden rounded-3xl border border-neutral-800 bg-[#111111] md:grid md:grid-cols-2">
                    <div className="flex flex-col justify-center p-8 md:p-10">
                        <div className="mb-6 flex items-center gap-2">
                            <img src="/msl-logo.png" alt="" className="h-8 w-auto" />
                            <span className="text-sm font-semibold text-white">MSL Philippines</span>
                        </div>

                        <h1 className="text-3xl font-bold text-white sm:text-4xl">
                            Campus Tournament
                        </h1>
                        <p className="mt-2 text-xl font-semibold text-yellow-500 sm:text-2xl">
                            Monthly Tournament Registration
                        </p>

                        <div className="mt-8 space-y-3">
                            {OPTIONS.map((option) => {
                                const Icon = option.icon;
                                return (
                                    <Link
                                        key={option.id}
                                        href={option.href}
                                        className={`group flex min-h-[72px] items-center gap-4 rounded-xl border px-4 py-3 transition-colors ${
                                            option.highlight
                                                ? 'border-yellow-500/40 bg-yellow-500/10 hover:bg-yellow-500/15'
                                                : 'border-neutral-800 bg-[#0a0a0a] hover:border-neutral-600'
                                        }`}
                                    >
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-500 text-black">
                                            <Icon className="h-5 w-5" />
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block text-sm font-bold text-white sm:text-base">
                                                {option.title}
                                            </span>
                                            <span className="block text-xs text-gray-400 sm:text-sm">
                                                {option.description}
                                            </span>
                                        </span>
                                        <ChevronRight className="h-5 w-5 shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <MediaPanel className="min-h-[420px] rounded-none" />
                </div>
            </div>
        </MainLayout>
    );
}
