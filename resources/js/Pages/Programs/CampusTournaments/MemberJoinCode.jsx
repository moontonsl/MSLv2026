import CampusTournamentPageHeader from '@/Components/CampusTournament/CampusTournamentPageHeader';
import JoinTeamRow from '@/Components/CampusTournament/JoinTeamRow';
import { INITIAL_JOINABLE_TEAMS } from '@/data/campusTournamentCaptainData';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

/**
 * Join an assembling team that already has an open slot.
 */
export default function MemberJoinCode() {
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
            <Head title="Join an Existing Team — Campus Tournament" />

            <div className="min-h-screen bg-[#0a0a0a] px-4 py-8 text-white sm:px-6 sm:py-10 lg:px-8">
                <div className="mx-auto max-w-6xl space-y-6">
                    <CampusTournamentPageHeader subtitle="Join a team that already has a slot.">
                        <Link
                            href="/Tournament/CampusTournament"
                            className="text-sm text-gray-400 transition-colors hover:text-white"
                        >
                            ← Back to registration hub
                        </Link>
                    </CampusTournamentPageHeader>

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
