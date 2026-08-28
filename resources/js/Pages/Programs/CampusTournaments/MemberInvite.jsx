import CaptainTeamCard from '@/Components/CampusTournament/CaptainTeamCard';
import InviteActionBanner from '@/Components/CampusTournament/InviteActionBanner';
import MemberInviteModal from '@/Components/CampusTournament/MemberInviteModal';
import SuccessModal from '@/Components/Admin/SuccessModal';
import { INITIAL_MEMBER_INVITE_TEAM } from '@/data/campusTournamentCaptainData';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Shield } from 'lucide-react';
import { useState } from 'react';

/**
 * Member view — invited player sees Action Required + team roster.
 * Captain adds them; they Accept or Decline the invite.
 */
export default function MemberInvite() {
    const [team, setTeam] = useState(INITIAL_MEMBER_INVITE_TEAM);
    const [invitePending, setInvitePending] = useState(true);
    const [modalVariant, setModalVariant] = useState(null);
    const [successOpen, setSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const openAccept = () => setModalVariant('accept');
    const openDecline = () => setModalVariant('decline');
    const closeModal = () => setModalVariant(null);

    const confirmInvite = () => {
        if (modalVariant === 'accept') {
            setInvitePending(false);
            setTeam((prev) => ({
                ...prev,
                status: 'approved',
                players: prev.players.map((player, index) =>
                    index === 0 ? { ...player, status: 'confirmed' } : player,
                ),
            }));
            setSuccessMessage('You joined the team!');
            setSuccessOpen(true);
        } else if (modalVariant === 'decline') {
            setInvitePending(false);
            setSuccessMessage('Invite declined.');
            setSuccessOpen(true);
            window.setTimeout(() => {
                router.visit('/Tournament/CampusTournament');
            }, 900);
        }
        closeModal();
    };

    return (
        <MainLayout fullWidth>
            <Head title="Team Invite — Campus Tournament" />

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

                    {invitePending ? (
                        <InviteActionBanner
                            teamName={team.name}
                            onAccept={openAccept}
                            onDecline={openDecline}
                        />
                    ) : null}

                    <CaptainTeamCard
                        team={team}
                        memberView
                        onEdit={() =>
                            router.visit('/Tournament/CampusTournamentReg')
                        }
                    />
                </div>
            </div>

            <MemberInviteModal
                isOpen={modalVariant != null}
                variant={modalVariant ?? 'accept'}
                teamName={team.name}
                onCancel={closeModal}
                onConfirm={confirmInvite}
            />

            <SuccessModal
                isOpen={successOpen}
                onClose={() => setSuccessOpen(false)}
                message={successMessage}
            />
        </MainLayout>
    );
}
