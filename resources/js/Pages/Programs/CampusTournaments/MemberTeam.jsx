import CampusTournamentPageHeader from "@/Components/CampusTournament/CampusTournamentPageHeader";
import CaptainTeamCard from "@/Components/CampusTournament/CaptainTeamCard";
import LeaveTeamModal from "@/Components/CampusTournament/LeaveTeamModal";
import TeamNoticeBanner from "@/Components/CampusTournament/TeamNoticeBanner";
import MainLayout from "@/Layouts/MainLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useMemo, useState } from "react";

export default function MemberTeam({ team, participantId }) {
    const [leaveOpen, setLeaveOpen] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);

    const rosterTeam = useMemo(
        () => ({
            ...team,
            players: (team.players ?? []).map((player) => ({
                ...player,
                id: `${player.status}-${player.id}-${player.role ?? "slot"}`,
            })),
        }),
        [team],
    );

    const confirmLeave = () => {
        if (!participantId) return;

        router.delete(`/tournament-participants/${participantId}`, {
            preserveScroll: true,
            onStart: () => {
                setProcessing(true);
                setError(null);
            },
            onSuccess: () => setLeaveOpen(false),
            onError: (errors) =>
                setError(
                    Object.values(errors ?? {})[0] ??
                        "Unable to leave this team.",
                ),
            onFinish: () => setProcessing(false),
        });
    };

    const notice =
        team.status === "disqualified" ? (
            <TeamNoticeBanner label="Notice">
                Your team was disqualified due to incomplete members.
            </TeamNoticeBanner>
        ) : null;

    return (
        <MainLayout fullWidth>
            <Head title="My Team — Campus Tournament" />

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

                    {error ? (
                        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                            {error}
                        </div>
                    ) : null}

                    <CaptainTeamCard
                        team={rosterTeam}
                        memberView
                        notice={notice}
                        onLeave={() => setLeaveOpen(true)}
                    />
                </div>
            </div>

            <LeaveTeamModal
                isOpen={leaveOpen}
                teamName={team.name}
                processing={processing}
                onCancel={() => !processing && setLeaveOpen(false)}
                onConfirm={confirmLeave}
            />
        </MainLayout>
    );
}
