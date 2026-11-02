import BaseModal from "@/Components/Admin/BaseModal";
import { MODAL_CLOSE_BUTTON_CLASS } from "@/Components/Admin/adminModalFormStyles";
import CaptainTeamCard from "@/Components/CampusTournament/CaptainTeamCard";
import { X } from "lucide-react";

/**
 * View a pending team invitation roster before Accept / Decline.
 *
 * @param {{
 *   isOpen: boolean;
 *   team?: object | null;
 *   onClose: () => void;
 *   onAccept: () => void;
 *   onDecline: () => void;
 * }} props
 */
export default function ViewTeamInvitationModal({
    isOpen,
    team = null,
    onClose,
    onAccept,
    onDecline,
}) {
    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            hideHeader
            scrollable
            maxWidth="max-w-5xl"
            footer={
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onAccept}
                        className="min-h-[44px] rounded-lg bg-yellow-500 px-8 text-sm font-bold text-black transition-colors hover:bg-yellow-400 sm:min-w-[140px]"
                    >
                        Accept
                    </button>
                    <button
                        type="button"
                        onClick={onDecline}
                        className="min-h-[44px] rounded-lg bg-red-600 px-8 text-sm font-semibold text-white transition-colors hover:bg-red-700 sm:min-w-[140px]"
                    >
                        Decline
                    </button>
                </div>
            }
        >
            <div className="relative px-1 pb-2 pt-2">
                <button
                    type="button"
                    onClick={onClose}
                    className={`absolute -right-1 -top-1 ${MODAL_CLOSE_BUTTON_CLASS}`}
                    aria-label="Close"
                >
                    <X className="h-5 w-5" />
                </button>

                <h2 className="mb-5 text-center text-xl font-bold text-yellow-500 sm:text-2xl">
                    Team Invitations
                </h2>

                {team ? (
                    <CaptainTeamCard team={team} memberView />
                ) : null}
            </div>
        </BaseModal>
    );
}
