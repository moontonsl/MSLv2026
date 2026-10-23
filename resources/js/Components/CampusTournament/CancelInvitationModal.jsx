import BaseModal from '@/Components/Admin/BaseModal';
import { AlertTriangle } from 'lucide-react';

export default function CancelInvitationModal({
    isOpen,
    playerName,
    processing = false,
    onCancel,
    onConfirm,
}) {
    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onCancel}
            title="Cancel Invitation?"
            maxWidth="max-w-md"
            scrollable={false}
            footer={
                <div className="grid gap-3 sm:grid-cols-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={processing}
                        className="min-h-[44px] rounded-lg border border-yellow-500 text-sm font-semibold text-yellow-500 transition-colors hover:bg-yellow-500/10 disabled:opacity-60"
                    >
                        Keep Invitation
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={processing}
                        className="min-h-[44px] rounded-lg bg-red-600 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {processing ? 'Canceling…' : 'Yes, Cancel Invitation'}
                    </button>
                </div>
            }
        >
            <div className="flex items-start gap-3 text-sm leading-relaxed text-gray-300">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-500" />
                <p>
                    Cancel the pending invitation for{' '}
                    <span className="font-semibold text-white">{playerName}</span>?
                    They will no longer be able to accept it.
                </p>
            </div>
        </BaseModal>
    );
}
