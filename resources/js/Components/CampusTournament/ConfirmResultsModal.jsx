import BaseModal from '@/Components/Admin/BaseModal';
import { MODAL_CLOSE_BUTTON_CLASS } from '@/Components/Admin/adminModalFormStyles';
import { HelpCircle, X } from 'lucide-react';

/**
 * Confirm submit / update of Match Management placements.
 *
 * @param {{
 *   isOpen: boolean;
 *   mode?: 'submit' | 'update';
 *   placements?: Array<{ id: string; label: string; rankColor: string; teamName: string }>;
 *   onCancel: () => void;
 *   onConfirm: () => void;
 * }} props
 */
export default function ConfirmResultsModal({
    isOpen,
    mode = 'submit',
    placements = [],
    onCancel,
    onConfirm,
}) {
    const isUpdate = mode === 'update';

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
                        className="min-h-[44px] w-full rounded-lg bg-yellow-500 text-base font-bold text-black transition-colors hover:bg-yellow-400 md:text-sm"
                    >
                        Submit
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
                    <HelpCircle className="h-6 w-6 text-yellow-500" />
                </div>

                <h2 className="mb-2 text-xl font-bold text-white">
                    {isUpdate ? 'Confirm Results Update?' : 'Confirm Results Submission?'}
                </h2>
                <p className="text-sm leading-relaxed text-gray-400">
                    {isUpdate
                        ? 'Are you sure you want to update the results?'
                        : 'Are you sure you want to submit the results?'}
                </p>

                <ul className="mt-5 space-y-2">
                    {placements.map((item) => (
                        <li key={item.id} className="text-sm">
                            <span className={`font-bold ${item.rankColor}`}>{item.label}:</span>{' '}
                            <span className="text-white">{item.teamName}</span>
                        </li>
                    ))}
                </ul>

                {isUpdate ? (
                    <p className="mt-4 text-sm text-gray-500">
                        This will update the existing rankings.
                    </p>
                ) : null}
            </div>
        </BaseModal>
    );
}
