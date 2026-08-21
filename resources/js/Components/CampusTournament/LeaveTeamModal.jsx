import BaseModal from '@/Components/Admin/BaseModal';
import { MODAL_CLOSE_BUTTON_CLASS } from '@/Components/Admin/adminModalFormStyles';
import { AlertTriangle, X } from 'lucide-react';

/**
 * Confirm leaving a solo matchmaking team.
 *
 * @param {{
 *   isOpen: boolean;
 *   teamName?: string;
 *   lockedRole?: string;
 *   onCancel: () => void;
 *   onConfirm: () => void;
 * }} props
 */
export default function LeaveTeamModal({
    isOpen,
    teamName = 'MSL TEAM 1',
    lockedRole = 'JUNGLER',
    onCancel,
    onConfirm,
}) {
    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onCancel}
            hideHeader
            scrollable={false}
            maxWidth="max-w-md"
            footer={
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="min-h-[44px] w-full rounded-lg border border-yellow-500 bg-transparent text-base font-semibold text-yellow-500 transition-colors hover:bg-yellow-500/10 md:text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="min-h-[44px] w-full rounded-lg bg-red-600 text-base font-bold text-white transition-colors hover:bg-red-700 md:text-sm"
                    >
                        Leave
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
                    <AlertTriangle className="h-6 w-6 text-yellow-500" />
                </div>

                <h2 className="mb-2 text-xl font-bold text-white">Leave Team?</h2>
                <p className="text-sm leading-relaxed text-gray-300">
                    You are currently locked as{' '}
                    <span className="font-bold text-yellow-500">{lockedRole}</span> in {teamName}.
                </p>
            </div>
        </BaseModal>
    );
}
