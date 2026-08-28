import CreateSoloTeamModal from '@/Components/CampusTournament/CreateSoloTeamModal';
import LeaveTeamModal from '@/Components/CampusTournament/LeaveTeamModal';
import LockRoleModal from '@/Components/CampusTournament/LockRoleModal';
import RosterLockCard from '@/Components/CampusTournament/RosterLockCard';
import SoloTeamRow from '@/Components/CampusTournament/SoloTeamRow';
import SuccessModal from '@/Components/Admin/SuccessModal';
import {
    DEFAULT_TOURNAMENT,
    INITIAL_SOLO_TEAMS,
    SOLO_DEMO_PLAYER,
    SOLO_ROSTER_LOCK_DATE,
} from '@/data/campusTournamentCaptainData';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { Plus, Shield, Users } from 'lucide-react';
import { useState } from 'react';

const EMPTY_SLOTS = ['JUNGLER', 'ROAM', 'GOLD', 'EXP', 'MID'].map((role) => ({
    role,
    occupied: false,
    player: null,
}));

/**
 * Solo Player’s View — Solo Matchmaking dashboard.
 */
export default function SoloMatchmaking() {
    const [teams, setTeams] = useState(INITIAL_SOLO_TEAMS);
    const [createOpen, setCreateOpen] = useState(false);
    const [joinTarget, setJoinTarget] = useState(null);
    const [leaveTarget, setLeaveTarget] = useState(null);
    const [successOpen, setSuccessOpen] = useState(false);

    const availableRoles =
        joinTarget?.slots.filter((slot) => !slot.occupied).map((slot) => slot.role) ?? [];

    const handleCreateTeam = ({ teamName, role }) => {
        const slots = EMPTY_SLOTS.map((slot) =>
            slot.role === role
                ? { ...slot, occupied: true, player: { ...SOLO_DEMO_PLAYER } }
                : slot,
        );

        setTeams([
            {
                id: `solo-${Date.now()}`,
                name: teamName,
                status: 'assembling',
                joined: true,
                lockedRole: role,
                slots,
            },
        ]);
        setCreateOpen(false);
        setSuccessOpen(true);
    };

    const handleLockRole = (role) => {
        if (!joinTarget) return;

        setTeams((prev) =>
            prev.map((item) => {
                if (item.id !== joinTarget.id) {
                    return item.joined
                        ? {
                              ...item,
                              joined: false,
                              lockedRole: null,
                              slots: item.slots.map((slot) =>
                                  slot.role === item.lockedRole
                                      ? { ...slot, occupied: false, player: null }
                                      : slot,
                              ),
                          }
                        : item;
                }
                return {
                    ...item,
                    joined: true,
                    lockedRole: role,
                    slots: item.slots.map((slot) =>
                        slot.role === role
                            ? { ...slot, occupied: true, player: { ...SOLO_DEMO_PLAYER } }
                            : slot,
                    ),
                };
            }),
        );
        setJoinTarget(null);
        setSuccessOpen(true);
    };

    const confirmLeave = () => {
        if (!leaveTarget) return;
        const role = leaveTarget.lockedRole;

        setTeams((prev) =>
            prev
                .map((item) => {
                    if (item.id !== leaveTarget.id) return item;
                    return {
                        ...item,
                        joined: false,
                        lockedRole: null,
                        slots: item.slots.map((slot) =>
                            slot.role === role
                                ? { ...slot, occupied: false, player: null }
                                : slot,
                        ),
                    };
                })
                .filter((item) => item.slots.some((slot) => slot.occupied)),
        );
        setLeaveTarget(null);
    };

    return (
        <MainLayout fullWidth>
            <Head title="Solo Matchmaking — Campus Tournament" />

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

                    <section className="rounded-2xl border border-neutral-800 bg-[#111111] p-4 sm:p-6 lg:p-8">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0 flex-1">
                                <h2 className="text-xl font-black uppercase tracking-wide text-white sm:text-2xl">
                                    Solo Matchmaking:{' '}
                                    <span className="text-yellow-500">
                                        {DEFAULT_TOURNAMENT.school}
                                    </span>
                                </h2>
                                <p className="mt-2 max-w-2xl text-sm text-gray-400">
                                    Teams will be formally registered once all 5 roles are locked.
                                    Until then, the status remains{' '}
                                    <span className="font-semibold text-yellow-500">Assembling</span>
                                    .
                                </p>
                            </div>
                            <RosterLockCard
                                lockDate={SOLO_ROSTER_LOCK_DATE}
                                className="w-full shrink-0 lg:max-w-xs"
                            />
                        </div>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-white">Join an Active Team</h3>
                                <p className="mt-1 text-sm text-gray-400">
                                    Look for teams needing your specific role.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setCreateOpen(true)}
                                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-yellow-500 px-5 text-sm font-bold text-black transition-colors hover:bg-yellow-400 sm:w-auto"
                            >
                                <Plus className="h-4 w-4" strokeWidth={2.5} />
                                Create a New Team
                            </button>
                        </div>

                        <div className="mt-5">
                            {teams.length === 0 ? (
                                <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-neutral-800 bg-[#0a0a0a] px-6 py-12 text-center">
                                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#1a1a1a] text-gray-500">
                                        <Users className="h-7 w-7" />
                                    </div>
                                    <p className="text-base font-bold text-white">
                                        No teams assembling yet
                                    </p>
                                    <p className="mt-1 text-sm text-gray-400">
                                        Be the first to start a team for your school!
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {teams.map((team) => (
                                        <SoloTeamRow
                                            key={team.id}
                                            team={team}
                                            onLeave={setLeaveTarget}
                                            onJoin={setJoinTarget}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>

            <CreateSoloTeamModal
                isOpen={createOpen}
                onClose={() => setCreateOpen(false)}
                onSubmit={handleCreateTeam}
            />

            <LockRoleModal
                isOpen={joinTarget != null}
                teamName={joinTarget?.name}
                availableRoles={availableRoles}
                onClose={() => setJoinTarget(null)}
                onSubmit={handleLockRole}
            />

            <LeaveTeamModal
                isOpen={leaveTarget != null}
                teamName={leaveTarget?.name}
                lockedRole={leaveTarget?.lockedRole ?? 'JUNGLER'}
                onCancel={() => setLeaveTarget(null)}
                onConfirm={confirmLeave}
            />

            <SuccessModal
                isOpen={successOpen}
                onClose={() => setSuccessOpen(false)}
                message="Tournament Application Successful!"
                description="You are now successfully added to the team roster and ready for the tournament."
            />
        </MainLayout>
    );
}
