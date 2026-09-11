import SuccessModal from "@/Components/Admin/SuccessModal";
import CaptainTeamCard from "@/Components/CampusTournament/CaptainTeamCard";
import InviteActionBanner from "@/Components/CampusTournament/InviteActionBanner";
import MemberInviteModal from "@/Components/CampusTournament/MemberInviteModal";
import MainLayout from "@/Layouts/MainLayout";
import { Head, Link, router } from "@inertiajs/react";
import { BellOff, Shield } from "lucide-react";
import { useState } from "react";

export default function MemberInvite({ invitations = [] }) {
    const [selectedInvitation, setSelectedInvitation] = useState(null);
    const [decision, setDecision] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    const openDecision = (invitation, nextDecision) => {
        setSelectedInvitation(invitation);
        setDecision(nextDecision);
        setError(null);
    };

    const closeModal = () => {
        if (processing) return;
        setSelectedInvitation(null);
        setDecision(null);
    };

    const confirmInvite = () => {
        if (!selectedInvitation || !decision) return;

        router.post(
            `/tournament-invitations/${selectedInvitation.id}/respond`,
            { decision: decision === "accept" ? "accepted" : "declined" },
            {
                preserveScroll: true,
                onStart: () => {
                    setProcessing(true);
                    setError(null);
                },
                onSuccess: () => {
                    setSuccessMessage(
                        decision === "accept"
                            ? "You joined the team."
                            : "Invitation declined.",
                    );
                    setSelectedInvitation(null);
                    setDecision(null);
                },
                onError: (errors) =>
                    setError(
                        Object.values(errors ?? {})[0] ??
                            "Unable to respond to this invitation.",
                    ),
                onFinish: () => setProcessing(false),
            },
        );
    };

    return (
        <MainLayout fullWidth>
            <Head title="Team Invitations — Campus Tournament" />

            <div className="min-h-screen bg-[#0a0a0a] px-4 py-8 text-white sm:px-6 sm:py-10 lg:px-8">
                <div className="mx-auto max-w-6xl space-y-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-yellow-500/40 bg-yellow-500/10 text-yellow-500">
                                <Shield className="h-6 w-6" strokeWidth={2.2} />
                            </div>
                            <h1 className="text-2xl font-black uppercase tracking-wide text-white sm:text-3xl">
                                Team Invitations
                            </h1>
                        </div>
                        <Link
                            href="/Tournament/CampusTournament"
                            className="text-sm text-gray-400 transition-colors hover:text-white"
                        >
                            ← Back to registration hub
                        </Link>
                    </div>

                    {error && (
                        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                            {error}
                        </div>
                    )}

                    {invitations.length === 0 ? (
                        <section className="rounded-2xl border border-neutral-800 bg-[#111111] px-6 py-16 text-center">
                            <BellOff className="mx-auto h-10 w-10 text-gray-500" />
                            <h2 className="mt-4 text-xl font-bold">
                                No pending invitations
                            </h2>
                            <p className="mt-2 text-sm text-gray-400">
                                Active team invitations will appear here until
                                they expire or you respond.
                            </p>
                        </section>
                    ) : (
                        invitations.map((invitation) => (
                            <section key={invitation.id} className="space-y-4">
                                <InviteActionBanner
                                    teamName={invitation.team.name}
                                    onAccept={() =>
                                        openDecision(invitation, "accept")
                                    }
                                    onDecline={() =>
                                        openDecision(invitation, "decline")
                                    }
                                />
                                <CaptainTeamCard
                                    team={invitation.team}
                                    memberView
                                />
                            </section>
                        ))
                    )}
                </div>
            </div>

            <MemberInviteModal
                isOpen={selectedInvitation != null}
                variant={decision ?? "accept"}
                teamName={selectedInvitation?.team.name}
                processing={processing}
                onCancel={closeModal}
                onConfirm={confirmInvite}
            />

            <SuccessModal
                isOpen={Boolean(successMessage)}
                onClose={() => setSuccessMessage("")}
                message={successMessage}
            />
        </MainLayout>
    );
}
