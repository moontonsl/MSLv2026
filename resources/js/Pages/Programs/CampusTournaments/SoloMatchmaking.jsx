import SuccessModal from "@/Components/Admin/SuccessModal";
import CampusTournamentPageHeader from "@/Components/CampusTournament/CampusTournamentPageHeader";
import CreateSoloTeamModal from "@/Components/CampusTournament/CreateSoloTeamModal";
import LeaveTeamModal from "@/Components/CampusTournament/LeaveTeamModal";
import LockRoleModal from "@/Components/CampusTournament/LockRoleModal";
import RosterLockCard from "@/Components/CampusTournament/RosterLockCard";
import SoloTeamRow from "@/Components/CampusTournament/SoloTeamRow";
import { ROLE_SLOTS } from "@/data/campusTournamentCaptainData";
import MainLayout from "@/Layouts/MainLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Plus, Users } from "lucide-react";
import { useMemo, useState } from "react";

const firstError = (errors) => Object.values(errors ?? {})[0] ?? null;
const roleLabel = (code) =>
    ROLE_SLOTS.find((role) => role.id === code)?.label ?? code;

export default function SoloMatchmaking({
    tournament = null,
    availableTournaments = [],
    teams: serverTeams = [],
    canCreateTeam = false,
}) {
    const [createOpen, setCreateOpen] = useState(false);
    const [joinTarget, setJoinTarget] = useState(null);
    const [leaveTarget, setLeaveTarget] = useState(null);
    const [successOpen, setSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [processing, setProcessing] = useState(false);
    const [actionError, setActionError] = useState(null);

    const teams = useMemo(
        () =>
            serverTeams.map((team) => ({
                ...team,
                lockedRole: roleLabel(team.locked_lane_role),
                availableRoles: team.available_lane_roles,
                slots: ROLE_SLOTS.map((role) => {
                    const participant = team.participants.find(
                        (item) => item.lane_role_code === role.id,
                    );

                    return {
                        code: role.id,
                        role: role.label,
                        occupied: Boolean(participant),
                        player: participant
                            ? {
                                  name: participant.name,
                                  ign: participant.ign || participant.name,
                                  uid: participant.uid || "",
                              }
                            : null,
                    };
                }),
            })),
        [serverTeams],
    );

    const handleCreateTeam = ({ teamName, role }) => {
        if (!tournament) return;

        router.post(
            `/campus-tournaments/${tournament.id}/participants`,
            { name: teamName, preferred_lane_role_code: role },
            {
                preserveScroll: true,
                onStart: () => {
                    setProcessing(true);
                    setActionError(null);
                },
                onSuccess: () => {
                    setCreateOpen(false);
                    setSuccessMessage(
                        "Your solo team is now open for matchmaking.",
                    );
                    setSuccessOpen(true);
                },
                onError: (errors) => setActionError(firstError(errors)),
                onFinish: () => setProcessing(false),
            },
        );
    };

    const handleLockRole = (role) => {
        if (!joinTarget) return;

        router.post(
            `/tournament-teams/${joinTarget.id}/solo-participants`,
            { lane_role_code: role },
            {
                preserveScroll: true,
                onStart: () => {
                    setProcessing(true);
                    setActionError(null);
                },
                onSuccess: () => {
                    setJoinTarget(null);
                    setSuccessMessage(
                        "You joined the solo team and locked your lane.",
                    );
                    setSuccessOpen(true);
                },
                onError: (errors) => setActionError(firstError(errors)),
                onFinish: () => setProcessing(false),
            },
        );
    };

    const confirmLeave = () => {
        if (!leaveTarget?.participant_id) return;

        router.delete(
            `/tournament-participants/${leaveTarget.participant_id}`,
            {
                preserveScroll: true,
                onStart: () => {
                    setProcessing(true);
                    setActionError(null);
                },
                onSuccess: () => setLeaveTarget(null),
                onError: (errors) => setActionError(firstError(errors)),
                onFinish: () => setProcessing(false),
            },
        );
    };

    const selectTournament = (event) => {
        router.get(
            "/Tournament/SoloPlayer",
            { tournament: event.target.value },
            { preserveState: false, replace: true },
        );
    };

    return (
        <MainLayout fullWidth>
            <Head title="Solo Matchmaking — Campus Tournament" />

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

                    {availableTournaments.length > 1 && (
                        <label className="block max-w-md text-sm text-gray-300">
                            Tournament
                            <select
                                value={tournament?.id ?? ""}
                                onChange={selectTournament}
                                className="mt-2 min-h-[44px] w-full rounded-lg border border-neutral-700 bg-[#111111] px-3 text-white focus:border-yellow-500 focus:ring-yellow-500"
                            >
                                {availableTournaments.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.title} — {item.school}
                                    </option>
                                ))}
                            </select>
                        </label>
                    )}

                    {actionError && (
                        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                            {actionError}
                        </div>
                    )}

                    {!tournament ? (
                        <section className="rounded-2xl border border-neutral-800 bg-[#111111] px-6 py-16 text-center">
                            <Users className="mx-auto h-10 w-10 text-gray-500" />
                            <h2 className="mt-4 text-xl font-bold text-white">
                                No tournament is open for registration
                            </h2>
                            <p className="mt-2 text-sm text-gray-400">
                                An approved tournament for your campus will
                                appear here during its registration period.
                            </p>
                        </section>
                    ) : (
                        <section className="rounded-2xl border border-neutral-800 bg-[#111111] p-4 sm:p-6 lg:p-8">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                <div className="min-w-0 flex-1">
                                    <h2 className="text-xl font-black uppercase tracking-wide text-white sm:text-2xl">
                                        {tournament.title}:{" "}
                                        <span className="text-yellow-500">
                                            {tournament.school}
                                        </span>
                                    </h2>
                                    <p className="mt-2 max-w-2xl text-sm text-gray-400">
                                        Teams register when all five lanes are
                                        locked. Incomplete teams remain
                                        assembling until registration closes.
                                    </p>
                                </div>
                                <RosterLockCard
                                    lockDate={tournament.rosterLockDate}
                                    className="w-full shrink-0 lg:max-w-xs"
                                />
                            </div>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-white">
                                        Join an Active Team
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-400">
                                        Select an assembling team with your
                                        preferred lane open.
                                    </p>
                                </div>
                                {canCreateTeam && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setActionError(null);
                                            setCreateOpen(true);
                                        }}
                                        className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-yellow-500 px-5 text-sm font-bold text-black transition-colors hover:bg-yellow-400 sm:w-auto"
                                    >
                                        <Plus
                                            className="h-4 w-4"
                                            strokeWidth={2.5}
                                        />
                                        Create a New Team
                                    </button>
                                )}
                            </div>

                            <div className="mt-5">
                                {teams.length === 0 ? (
                                    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-neutral-800 bg-[#0a0a0a] px-6 py-12 text-center">
                                        <Users className="h-7 w-7 text-gray-500" />
                                        <p className="mt-4 text-base font-bold text-white">
                                            No teams assembling yet
                                        </p>
                                        <p className="mt-1 text-sm text-gray-400">
                                            {canCreateTeam
                                                ? "Be the first to start a solo team for your campus."
                                                : "You already have a registration in this tournament."}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {teams.map((team) => (
                                            <SoloTeamRow
                                                key={team.id}
                                                team={team}
                                                canJoin={canCreateTeam}
                                                onLeave={setLeaveTarget}
                                                onJoin={(target) => {
                                                    setActionError(null);
                                                    setJoinTarget(target);
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>
                    )}
                </div>
            </div>

            <CreateSoloTeamModal
                isOpen={createOpen}
                processing={processing}
                error={actionError}
                onClose={() => !processing && setCreateOpen(false)}
                onSubmit={handleCreateTeam}
            />
            <LockRoleModal
                isOpen={joinTarget != null}
                teamName={joinTarget?.name}
                availableRoles={joinTarget?.availableRoles ?? []}
                processing={processing}
                error={actionError}
                onClose={() => !processing && setJoinTarget(null)}
                onSubmit={handleLockRole}
            />
            <LeaveTeamModal
                isOpen={leaveTarget != null}
                teamName={leaveTarget?.name}
                lockedRole={leaveTarget?.lockedRole}
                processing={processing}
                onCancel={() => !processing && setLeaveTarget(null)}
                onConfirm={confirmLeave}
            />
            <SuccessModal
                isOpen={successOpen}
                onClose={() => setSuccessOpen(false)}
                message="Registration Successful"
                description={successMessage}
            />
        </MainLayout>
    );
}
