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
 *   reason?: string;
 *   onReasonChange?: (reason: string) => void;
 *   error?: string;
 *   processing?: boolean;
 *   onCancel: () => void;
 *   onConfirm: () => void;
 * }} props
 */
export default function ConfirmResultsModal({
    isOpen,
    mode = 'submit',
    placements = [],
    reason = '',
    onReasonChange,
    error = '',
    processing = false,
    onCancel,
    onConfirm,
}) {
    const isUpdate = mode === 'update';

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={() => !processing && onCancel()}
            hideHeader
            showCloseButton={false}
            scrollable={false}
            maxWidth="max-w-md"
            footer={
                <div className="flex flex-col gap-3">
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={processing}
                        className="min-h-[44px] w-full rounded-lg bg-yellow-500 text-base font-bold text-black transition-colors hover:bg-yellow-400 disabled:opacity-50 md:text-sm"
                    >
                        {processing ? 'Saving…' : 'Submit'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={processing}
                        className="min-h-[44px] w-full rounded-lg border border-yellow-500 bg-transparent text-base font-semibold text-yellow-500 transition-colors hover:bg-yellow-500/10 md:text-sm"
                    >
                        Cancel
                    </button>
                </div>
            }
        >
            <div className="relative px-1 pb-2 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={processing}
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

                {isUpdate && onReasonChange ? (
                    <label className="mt-4 block text-sm text-gray-300">
                        Correction reason <span className="text-red-400">*</span>
                        <textarea
                            value={reason}
                            onChange={(event) => onReasonChange?.(event.target.value)}
                            rows={3}
                            maxLength={2000}
                            className="mt-2 w-full rounded-lg border border-neutral-700 bg-[#0a0a0a] p-3 text-white"
                        />
                    </label>
                ) : null}
                {error ? <p role="alert" className="mt-3 text-sm text-red-400">{error}</p> : null}
            </div>
        </BaseModal>
    );
}
