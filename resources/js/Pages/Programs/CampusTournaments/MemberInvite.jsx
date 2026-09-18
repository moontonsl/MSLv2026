import CampusTournamentPageHeader from '@/Components/CampusTournament/CampusTournamentPageHeader';
import CaptainTeamCard from '@/Components/CampusTournament/CaptainTeamCard';
import InviteActionBanner from '@/Components/CampusTournament/InviteActionBanner';
import LeaveTeamModal from '@/Components/CampusTournament/LeaveTeamModal';
import MemberInviteModal from '@/Components/CampusTournament/MemberInviteModal';
import SuccessModal from '@/Components/Admin/SuccessModal';
import { INITIAL_MEMBER_INVITE_TEAM } from '@/data/campusTournamentCaptainData';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
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
    const [leaveOpen, setLeaveOpen] = useState(false);

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

    const confirmLeave = () => {
        setLeaveOpen(false);
        setSuccessMessage('You left the team.');
        setSuccessOpen(true);
        window.setTimeout(() => {
            router.visit('/Tournament/CampusTournament');
        }, 900);
    };

    return (
        <MainLayout fullWidth>
            <Head title="Team Invite — Campus Tournament" />

            <div className="min-h-screen bg-[#0a0a0a] px-4 py-8 text-white sm:px-6 sm:py-10 lg:px-8">
                <div className="mx-auto max-w-6xl space-y-6">
                    <CampusTournamentPageHeader>
                        <Link
                            href="/Tournament/CampusTournament"
                            className="text-sm text-gray-400 transition-colors hover:text-white"
                        >
                            ← Back to registration hub
                        </Link>
                    </CampusTournamentPageHeader>

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
                        onLeave={() => setLeaveOpen(true)}
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

            <LeaveTeamModal
                isOpen={leaveOpen}
                teamName={team.name}
                onCancel={() => setLeaveOpen(false)}
                onConfirm={confirmLeave}
            />

            <SuccessModal
                isOpen={successOpen}
                onClose={() => setSuccessOpen(false)}
                message={successMessage}
            />
        </MainLayout>
    );
}
