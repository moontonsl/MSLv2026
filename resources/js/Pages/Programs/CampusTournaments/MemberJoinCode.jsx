import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, Shield } from 'lucide-react';
import { useState } from 'react';

const INPUT_CLASS =
    'w-full min-h-[44px] rounded-lg border border-neutral-800 bg-[#0a0a0a] px-4 py-3 text-base text-white outline-none transition-shadow placeholder:text-gray-600 focus:ring-2 focus:ring-yellow-500 md:text-sm';

/**
 * Member flow — join a team using the captain’s invite code.
 */
export default function MemberJoinCode() {
    const [teamCode, setTeamCode] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!teamCode.trim()) return;
        router.visit('/Tournament/MemberInvite');
    };

    return (
        <MainLayout fullWidth>
            <Head title="Join an Existing Team — Campus Tournament" />

            <div className="min-h-screen bg-[#0a0a0a] px-4 py-8 text-white sm:px-6 sm:py-10 lg:px-8">
                <div className="mx-auto max-w-xl space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-yellow-500/40 bg-yellow-500/10 text-yellow-500">
                            <Shield className="h-6 w-6" strokeWidth={2.2} />
                        </div>
                        <h1 className="text-2xl font-black uppercase tracking-wide text-white sm:text-3xl">
                            Campus Tournament
                        </h1>
                    </div>

                    <div className="rounded-2xl border border-neutral-800 bg-[#111111] p-5 sm:p-8">
                        <Link
                            href="/Tournament/CampusTournament"
                            className="mb-6 inline-flex min-h-[44px] items-center gap-1 text-sm text-gray-400 transition-colors hover:text-white"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Back
                        </Link>

                        <h2 className="text-center text-xl font-bold text-white sm:text-2xl">
                            Join an Existing Team
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-400">
                            Log in using your MSL Credentials to continue.
                        </p>

                        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                            <div>
                                <label htmlFor="teamCode" className="mb-2 block text-sm text-white">
                                    Team Code <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="teamCode"
                                    name="teamCode"
                                    type="text"
                                    value={teamCode}
                                    onChange={(event) => setTeamCode(event.target.value)}
                                    placeholder="Enter Team Code"
                                    required
                                    className={INPUT_CLASS}
                                    autoComplete="off"
                                />
                            </div>

                            <p className="text-center text-xs leading-relaxed text-gray-500 sm:text-sm">
                                Need a Team Code? Reach out to your team captain, as they are the
                                only ones authorized to generate it. Make sure to copy the code
                                exactly as provided.
                            </p>

                            <button
                                type="submit"
                                className="mt-2 inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-yellow-500 text-base font-bold text-black transition-colors hover:bg-yellow-400"
                            >
                                Join Team
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
