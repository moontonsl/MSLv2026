import BaseModal from '@/Components/Admin/BaseModal';
import { MODAL_CLOSE_BUTTON_CLASS } from '@/Components/Admin/adminModalFormStyles';
import { AlertTriangle, X } from 'lucide-react';

/**
 * Confirm approve / reject (or similar) actions for Campus Tournament SL view.
 *
 * @param {{
 *   isOpen: boolean;
 *   onCancel: () => void;
 *   onConfirm: () => void;
 *   actionLabel?: string;
 *   subjectName?: string;
 *   stackedButtons?: boolean;
 * }} props
 */
export default function ConfirmActionModal({
    isOpen,
    onCancel,
    onConfirm,
    actionLabel = 'approve',
    subjectName = 'this school',
    stackedButtons = false,
}) {
    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onCancel}
            hideHeader
            scrollable={false}
            maxWidth="max-w-md"
            footer={
                <div
                    className={`gap-3 ${
                        stackedButtons ? 'flex flex-col' : 'grid grid-cols-1 gap-3 sm:grid-cols-2'
                    }`}
                >
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
                        className="min-h-[44px] w-full rounded-lg bg-yellow-500 text-base font-bold text-black transition-colors hover:bg-yellow-400 md:text-sm"
                    >
                        Confirm
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

                <h2 className="mb-2 text-xl font-bold text-white">Confirm Action</h2>
                <p className="text-sm leading-relaxed text-gray-400">
                    Are you sure you want to{' '}
                    <span className="font-bold text-white">{actionLabel}</span> the tournament
                    request from <span className="font-bold text-white">{subjectName}</span>?
                </p>
            </div>
        </BaseModal>
    );
}
