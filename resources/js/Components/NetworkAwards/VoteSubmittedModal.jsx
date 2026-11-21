import BaseModal from '@/Components/Admin/BaseModal';

/**
 * Figma: Successfully Submitted! + nominate again prompt.
 *
 * @param {{
 *   isOpen: boolean;
 *   onYes: () => void;
 *   onNo: () => void;
 * }} props
 */
export default function VoteSubmittedModal({ isOpen, onYes, onNo }) {
    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onNo}
            hideHeader
            showCloseButton={false}
            scrollable={false}
            maxWidth="max-w-md"
            panelClassName="border border-[#8A6800]"
            footer={
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={onYes}
                        className="min-h-[48px] rounded-lg bg-[#FBBF24] px-4 text-sm font-bold text-black transition-colors hover:bg-[#FCD34D]"
                    >
                        Yes
                    </button>
                    <button
                        type="button"
                        onClick={onNo}
                        className="min-h-[48px] rounded-lg bg-[#2a2a2a] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#333333]"
                    >
                        No
                    </button>
                </div>
            }
        >
            <div className="space-y-4 px-2 pb-2 pt-4 text-center">
                <h2 className="text-xl font-bold text-white sm:text-2xl">
                    Successfully Submitted!
                </h2>
                <p className="text-sm leading-relaxed text-white sm:text-base">
                    Wait for the verification email of MSL Network Awards
                    committee. Thank you!
                </p>
                <p className="text-sm leading-relaxed text-white sm:text-base">
                    Do you want to nominate again in other awards?
                </p>
            </div>
        </BaseModal>
    );
}
