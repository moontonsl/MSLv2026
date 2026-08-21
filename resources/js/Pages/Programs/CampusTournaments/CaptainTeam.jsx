import CaptainTeamCard from '@/Components/CampusTournament/CaptainTeamCard';
import TeamInviteCodeModal from '@/Components/CampusTournament/TeamInviteCodeModal';
import { INITIAL_CAPTAIN_TEAM } from '@/data/campusTournamentCaptainData';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Shield } from 'lucide-react';
import { useMemo, useState } from 'react';

function generateInviteCode() {
    const suffix = Math.floor(10000 + Math.random() * 90000);
    return `INV-${suffix}`;
}

export default function CaptainTeam() {
    const { url } = usePage();
    const params = useMemo(() => new URLSearchParams(url.split('?')[1] ?? ''), [url]);
    const teamNameFromQuery = params.get('teamName');

    const [team, setTeam] = useState({
        ...INITIAL_CAPTAIN_TEAM,
        name: teamNameFromQuery || INITIAL_CAPTAIN_TEAM.name,
    });
    const [inviteModalOpen, setInviteModalOpen] = useState(false);
    const [generatedCode, setGeneratedCode] = useState(team.inviteCode ?? '');

    const handleGenerateCode = () => {
        const code = team.inviteCode || generateInviteCode();
        setGeneratedCode(code);
        setTeam((prev) => ({
            ...prev,
            status: 'approved',
            inviteCode: code,
            players: prev.players.map((player) => ({ ...player, status: 'confirmed' })),
        }));
        setInviteModalOpen(true);
    };

    const handleCopyCode = async () => {
        if (!team.inviteCode) return;
        try {
            await navigator.clipboard.writeText(team.inviteCode);
        } catch {
            // ignore clipboard errors in demo
        }
    };

    return (
        <MainLayout fullWidth>
            <Head title="Captain Team — Campus Tournament" />

            <div className="min-h-screen bg-[#0a0a0a] px-4 py-8 text-white sm:px-6 sm:py-10 lg:px-8">
                <div className="mx-auto max-w-6xl space-y-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-yellow-500/40 bg-yellow-500/10 text-yellow-500">
                                <Shield className="h-6 w-6" strokeWidth={2.2} />
                            </div>
                            <h1 className="text-2xl font-black uppercase tracking-wide text-white sm:text-3xl">
                                Campus Tournament
                            </h1>
                        </div>
                        <Link
                            href="/Tournament/CampusTournament"
                            className="text-sm text-gray-400 transition-colors hover:text-white"
                        >
                            ← Back to registration hub
                        </Link>
                    </div>

                    <CaptainTeamCard
                        team={team}
                        onEdit={() => router.visit('/Tournament/CampusTournamentReg')}
                        onGenerateCode={handleGenerateCode}
                        onCopyCode={handleCopyCode}
                    />
                </div>
            </div>

            <TeamInviteCodeModal
                isOpen={inviteModalOpen}
                onClose={() => setInviteModalOpen(false)}
                inviteCode={generatedCode || 'INV-11042'}
            />
        </MainLayout>
    );
}
