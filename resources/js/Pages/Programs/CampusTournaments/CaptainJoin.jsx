import JoinTeamRow from '@/Components/CampusTournament/JoinTeamRow';
import { INITIAL_JOINABLE_TEAMS } from '@/data/campusTournamentCaptainData';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { Shield } from 'lucide-react';
import { useState } from 'react';

export default function CaptainJoin() {
    const [teams, setTeams] = useState(INITIAL_JOINABLE_TEAMS);

    const handleJoin = (team) => {
        setTeams((prev) =>
            prev.map((item) =>
                item.id === team.id ? { ...item, joined: true } : item,
            ),
        );
    };

    const handleLeave = (team) => {
        setTeams((prev) =>
            prev.map((item) =>
                item.id === team.id ? { ...item, joined: false } : item,
            ),
        );
    };

    return (
        <MainLayout fullWidth>
            <Head title="Join a Team — Campus Tournament" />

            <div className="min-h-screen bg-[#0a0a0a] px-4 py-8 text-white sm:px-6 sm:py-10 lg:px-8">
                <div className="mx-auto max-w-6xl space-y-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-yellow-500/40 bg-yellow-500/10 text-yellow-500">
                                <Shield className="h-6 w-6" strokeWidth={2.2} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black uppercase tracking-wide text-white sm:text-3xl">
                                    Campus Tournament
                                </h1>
                                <p className="mt-1 text-sm text-gray-400">
                                    Join an assembling team or leave your current lobby.
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/Tournament/CampusTournament"
                            className="text-sm text-gray-400 transition-colors hover:text-white"
                        >
                            ← Back to registration hub
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {teams.map((team) => (
                            <JoinTeamRow
                                key={team.id}
                                team={team}
                                onJoin={handleJoin}
                                onLeave={handleLeave}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
