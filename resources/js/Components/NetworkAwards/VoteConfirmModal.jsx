import BaseModal from '@/Components/Admin/BaseModal';

/**
 * Figma: "Are you sure you want to submit your vote?"
 *
 * @param {{
 *   isOpen: boolean;
 *   onConfirm: () => void;
 *   onCancel: () => void;
 * }} props
 */
export default function VoteConfirmModal({ isOpen, onConfirm, onCancel }) {
    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onCancel}
            hideHeader
            showCloseButton={false}
            scrollable={false}
            maxWidth="max-w-md"
            panelClassName="border border-[#8A6800]"
            footer={
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="min-h-[48px] rounded-lg bg-[#FBBF24] px-4 text-sm font-bold text-black transition-colors hover:bg-[#FCD34D]"
                    >
                        Yes, submit vote
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="min-h-[48px] rounded-lg bg-[#2a2a2a] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#333333]"
                    >
                        No, Change Vote.
                    </button>
                </div>
            }
        >
            <div className="px-2 pb-2 pt-4 text-center">
                <h2 className="text-xl font-bold leading-snug text-white sm:text-2xl">
                    Are you sure you want to submit your vote?
                </h2>
            </div>
        </BaseModal>
    );
}
