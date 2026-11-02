import BaseModal from "@/Components/Admin/BaseModal";
import SuccessModal from "@/Components/Admin/SuccessModal";
import { MODAL_CLOSE_BUTTON_CLASS } from "@/Components/Admin/adminModalFormStyles";
import MemberInviteModal from "@/Components/CampusTournament/MemberInviteModal";
import TeamInvitationRow from "@/Components/CampusTournament/TeamInvitationRow";
import ViewTeamInvitationModal from "@/Components/CampusTournament/ViewTeamInvitationModal";
import { router } from "@inertiajs/react";
import { BellOff, X } from "lucide-react";
import { useState } from "react";

/**
 * Team Invitations list modal (Figma — overlay on hub, not a separate page).
 *
 * @param {{
 *   isOpen: boolean;
 *   invitations?: Array<object>;
 *   onClose: () => void;
 * }} props
 */
export default function TeamInvitationsModal({
    isOpen,
    invitations = [],
    onClose,
}) {
    const [viewInvitation, setViewInvitation] = useState(null);
    const [selectedInvitation, setSelectedInvitation] = useState(null);
    const [decision, setDecision] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    const openDecision = (invitation, nextDecision) => {
        setViewInvitation(null);
        setSelectedInvitation(invitation);
        setDecision(nextDecision);
        setError(null);
    };

    const openDeclineAll = () => {
        setViewInvitation(null);
        setSelectedInvitation(null);
        setDecision("decline-all");
        setError(null);
    };

    const closeConfirm = () => {
        if (processing) return;
        setSelectedInvitation(null);
        setDecision(null);
    };

    const respond = (invitation, nextDecision, { onDone } = {}) => {
        router.post(
            `/tournament-invitations/${invitation.id}/respond`,
            { decision: nextDecision === "accept" ? "accepted" : "declined" },
            {
                preserveScroll: true,
                onStart: () => {
                    setProcessing(true);
                    setError(null);
                },
                onSuccess: () => {
                    onDone?.();
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

    const confirmInvite = () => {
        if (decision === "decline-all") {
            const targets = [...invitations];
            if (targets.length === 0) return;

            setProcessing(true);
            setError(null);

            const declineNext = (index) => {
                if (index >= targets.length) {
                    setProcessing(false);
                    setDecision(null);
                    setSelectedInvitation(null);
                    setSuccessMessage("All invitations declined.");
                    router.reload({ preserveScroll: true });
                    return;
                }

                router.post(
                    `/tournament-invitations/${targets[index].id}/respond`,
                    { decision: "declined" },
                    {
                        preserveScroll: true,
                        preserveState: true,
                        onError: (errors) => {
                            setProcessing(false);
                            setError(
                                Object.values(errors ?? {})[0] ??
                                    "Unable to decline all invitations.",
                            );
                        },
                        onSuccess: () => declineNext(index + 1),
                    },
                );
            };

            declineNext(0);
            return;
        }

        if (!selectedInvitation || !decision) return;

        respond(selectedInvitation, decision, {
            onDone: () => {
                setSuccessMessage(
                    decision === "accept"
                        ? "You joined the team."
                        : "Invitation declined.",
                );
                setSelectedInvitation(null);
                setDecision(null);
                setViewInvitation(null);
                if (decision !== "accept") {
                    router.reload({ preserveScroll: true });
                }
            },
        });
    };

    const handleClose = () => {
        if (processing) return;
        setViewInvitation(null);
        setSelectedInvitation(null);
        setDecision(null);
        setError(null);
        onClose();
    };

    return (
        <>
            <BaseModal
                isOpen={isOpen}
                onClose={handleClose}
                hideHeader
                showCloseButton={false}
                scrollable
                maxWidth="max-w-5xl"
                panelClassName="max-h-[90vh]"
            >
                <div className="relative px-1 pb-2 pt-2">
                    <button
                        type="button"
                        onClick={handleClose}
                        className={`absolute -right-1 -top-1 ${MODAL_CLOSE_BUTTON_CLASS}`}
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <h2 className="mb-6 text-center text-xl font-bold text-yellow-500 sm:text-2xl">
                        Team Invitations
                    </h2>

                    {error ? (
                        <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                            {error}
                        </div>
                    ) : null}

                    {invitations.length === 0 ? (
                        <section className="rounded-xl border border-neutral-800 bg-[#0a0a0a] px-6 py-16 text-center">
                            <BellOff className="mx-auto h-10 w-10 text-gray-500" />
                            <h3 className="mt-4 text-xl font-bold text-white">
                                No team invitations yet.
                            </h3>
                            <p className="mt-2 text-sm text-gray-400">
                                Active team invitations will appear here until
                                they expire or you respond.
                            </p>
                        </section>
                    ) : (
                        <div className="space-y-3">
                            {invitations.map((invitation) => (
                                <TeamInvitationRow
                                    key={invitation.id}
                                    invitation={invitation}
                                    onView={() => setViewInvitation(invitation)}
                                    onAccept={() =>
                                        openDecision(invitation, "accept")
                                    }
                                    onDecline={() =>
                                        openDecision(invitation, "decline")
                                    }
                                />
                            ))}

                            <div className="flex justify-end pt-2">
                                <button
                                    type="button"
                                    onClick={openDeclineAll}
                                    className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-red-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                                >
                                    Decline All
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </BaseModal>

            <ViewTeamInvitationModal
                isOpen={viewInvitation != null}
                team={viewInvitation?.team}
                onClose={() => setViewInvitation(null)}
                onAccept={() => openDecision(viewInvitation, "accept")}
                onDecline={() => openDecision(viewInvitation, "decline")}
            />

            <MemberInviteModal
                isOpen={decision != null}
                variant={decision ?? "accept"}
                teamName={selectedInvitation?.team?.name}
                processing={processing}
                onCancel={closeConfirm}
                onConfirm={confirmInvite}
            />

            <SuccessModal
                isOpen={Boolean(successMessage)}
                onClose={() => {
                    setSuccessMessage("");
                    handleClose();
                }}
                message={successMessage}
            />
        </>
    );
}
