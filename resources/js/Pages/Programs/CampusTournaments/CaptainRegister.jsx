import { DEFAULT_TOURNAMENT } from '@/data/campusTournamentCaptainData';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, CircleHelp } from 'lucide-react';
import { useState } from 'react';

const INPUT_CLASS =
    'w-full min-h-[44px] rounded-lg border border-neutral-800 bg-[#0a0a0a] px-4 py-3 text-base text-white outline-none transition-shadow placeholder:text-gray-600 focus:ring-2 focus:ring-yellow-500 md:text-sm';

const LABEL_CLASS = 'mb-2 block text-sm text-white';

export default function CaptainRegister() {
    const [form, setForm] = useState({
        captain: 'DAKI',
        discordId: '',
        teamName: '',
        player2: '',
        player3: '',
        player4: '',
        player5: '',
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        router.visit(
            `/Tournament/CampusTournamentTeam?teamName=${encodeURIComponent(
                form.teamName || 'BINIGNIT',
            )}`,
        );
    };

    return (
        <MainLayout fullWidth>
            <Head title={`Register — ${DEFAULT_TOURNAMENT.title}`} />

            <div className="min-h-screen bg-[#0a0a0a] px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-xl">
                    <div className="rounded-2xl border border-neutral-800 bg-[#111111] p-5 sm:p-8">
                        <Link
                            href="/Tournament/CampusTournament"
                            className="mb-6 inline-flex min-h-[44px] items-center gap-1 text-sm text-gray-400 transition-colors hover:text-white"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Back
                        </Link>

                        <h1 className="mb-6 text-center text-xl font-black uppercase tracking-wide text-white sm:text-2xl">
                            {DEFAULT_TOURNAMENT.title}
                        </h1>

                        <div className="mb-6 rounded-xl border border-yellow-500/70 bg-yellow-500/5 p-4">
                            <p className="mb-2 text-sm font-semibold text-yellow-500">
                                Important Requirements:
                            </p>
                            <ul className="list-disc space-y-2 pl-5 text-sm text-yellow-500/90">
                                <li>
                                    <span className="font-semibold text-yellow-500">
                                        Verification Required:
                                    </span>{' '}
                                    All team members must be verified users to participate in campus
                                    tournaments.
                                </li>
                                <li>
                                    Each team may include only one senior high school student in
                                    their roster.
                                </li>
                            </ul>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="captain" className={LABEL_CLASS}>
                                    Captain (Player 1) <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        id="captain"
                                        name="captain"
                                        type="text"
                                        value={form.captain}
                                        readOnly
                                        className={`${INPUT_CLASS} pr-12 text-gray-300`}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                                        <CircleHelp className="h-4 w-4" />
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="discordId" className={LABEL_CLASS}>
                                    Discord ID{' '}
                                    <span className="font-normal text-gray-500">(optional)</span>
                                </label>
                                <input
                                    id="discordId"
                                    name="discordId"
                                    type="text"
                                    value={form.discordId}
                                    onChange={handleChange}
                                    placeholder="e.g. username00000"
                                    className={INPUT_CLASS}
                                />
                            </div>

                            <div>
                                <label htmlFor="teamName" className={LABEL_CLASS}>
                                    Team Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="teamName"
                                    name="teamName"
                                    type="text"
                                    value={form.teamName}
                                    onChange={handleChange}
                                    placeholder="e.g. MSL PH"
                                    required
                                    className={INPUT_CLASS}
                                />
                            </div>

                            <div className="rounded-lg border border-yellow-500/70 bg-yellow-500/5 px-4 py-3 text-sm text-yellow-500">
                                Note: Players must be from your school, verified, and have an MSL
                                Account.
                            </div>

                            {[2, 3, 4, 5].map((n) => (
                                <div key={n}>
                                    <label htmlFor={`player${n}`} className={LABEL_CLASS}>
                                        Player {n} <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id={`player${n}`}
                                        name={`player${n}`}
                                        type="text"
                                        value={form[`player${n}`]}
                                        onChange={handleChange}
                                        placeholder="e.g. DAKI"
                                        required
                                        className={INPUT_CLASS}
                                    />
                                </div>
                            ))}

                            <button
                                type="submit"
                                className="mt-2 w-full min-h-[44px] rounded-lg bg-yellow-500 py-3 text-base font-bold text-black transition-colors hover:bg-yellow-400 md:text-sm"
                            >
                                Submit
                            </button>
                        </form>
                    </div>

                    <p className="mt-6 text-center text-xs leading-relaxed text-gray-500 sm:text-sm">
                        Make sure that you have read the{' '}
                        <a href="#" className="text-yellow-500 underline">
                            Rulebook
                        </a>{' '}
                        to avoid conflicts. Also, join the{' '}
                        <a href="#" className="text-yellow-500 underline">
                            Discord Server
                        </a>{' '}
                        or our{' '}
                        <a href="#" className="text-yellow-500 underline">
                            Facebook Page
                        </a>{' '}
                        for more information and announcements.
                    </p>
                </div>
            </div>
        </MainLayout>
    );
}
