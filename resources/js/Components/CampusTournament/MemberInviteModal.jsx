import BaseModal from "@/Components/Admin/BaseModal";
import { MODAL_CLOSE_BUTTON_CLASS } from "@/Components/Admin/adminModalFormStyles";
import { Check, X } from "lucide-react";

/**
 * Accept / Decline / Decline All team invite confirmation (member view).
 *
 * @param {{
 *   isOpen: boolean;
 *   variant?: 'accept' | 'decline' | 'decline-all';
 *   teamName?: string;
 *   processing?: boolean;
 *   onCancel: () => void;
 *   onConfirm: () => void;
 * }} props
 */
export default function MemberInviteModal({
    isOpen,
    variant = "accept",
    teamName = "BINIGNIT",
    processing = false,
    onCancel,
    onConfirm,
}) {
    const isAccept = variant === "accept";
    const isDeclineAll = variant === "decline-all";
    const confirmLabel = isAccept
        ? "Accept"
        : isDeclineAll
          ? "Decline all"
          : "Decline";
    const confirmClass = isAccept
        ? "bg-yellow-500 text-black hover:bg-yellow-400"
        : "bg-red-600 text-white hover:bg-red-700";

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onCancel}
            hideHeader
            showCloseButton={false}
            scrollable={false}
            maxWidth="max-w-md"
            footer={
                <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={processing}
                        className="order-2 min-h-[44px] w-full rounded-lg border border-yellow-500 bg-transparent text-base font-semibold text-yellow-500 transition-colors hover:bg-yellow-500/10 sm:order-1 md:text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={processing}
                        className={`order-1 min-h-[44px] w-full rounded-lg text-base font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60 sm:order-2 md:text-sm ${confirmClass}`}
                    >
                        {processing ? "Saving…" : confirmLabel}
                    </button>
                </div>
            }
        >
            <div className="relative px-1 pb-2 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className={`absolute -right-1 -top-1 ${MODAL_CLOSE_BUTTON_CLASS}`}
                    aria-label="Close"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-yellow-500/50 bg-yellow-500/10">
                    {isAccept ? (
                        <Check
                            className="h-6 w-6 text-yellow-500"
                            strokeWidth={2.5}
                        />
                    ) : (
                        <X
                            className="h-6 w-6 text-yellow-500"
                            strokeWidth={2.5}
                        />
                    )}
                </div>

                <h2 className="mb-2 text-xl font-bold text-white">
                    {isAccept
                        ? "Accept Invite?"
                        : isDeclineAll
                          ? "Decline All Invites?"
                          : "Decline Invite?"}
                </h2>

                {isAccept ? (
                    <p className="text-sm leading-relaxed text-gray-300">
                        Are you sure you want to join team{" "}
                        <span className="font-bold text-white">{teamName}</span>
                        ? Your status will be updated to{" "}
                        <span className="font-bold text-white">Accepted.</span>
                    </p>
                ) : isDeclineAll ? (
                    <p className="text-sm leading-relaxed text-gray-300">
                        Are you sure you want to decline{" "}
                        <span className="font-bold text-white">
                            ALL TEAM INVITATIONS
                        </span>
                        ?
                    </p>
                ) : (
                    <p className="text-sm leading-relaxed text-gray-300">
                        Are you sure you want to decline an invitation from team{" "}
                        <span className="font-bold text-white">{teamName}</span>
                        ? Your status will be{" "}
                        <span className="font-bold text-white">Removed</span>{" "}
                        from the team.
                    </p>
                )}
            </div>
        </BaseModal>
    );
}
