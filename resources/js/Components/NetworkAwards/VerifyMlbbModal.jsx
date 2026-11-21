import BaseModal from '@/Components/Admin/BaseModal';

/**
 * Figma Overlay Modal: Verify your MLBB Account before nominations.
 *
 * @param {{
 *   isOpen: boolean;
 *   onContinue: () => void;
 *   onCancel: () => void;
 * }} props
 */
export default function VerifyMlbbModal({ isOpen, onContinue, onCancel }) {
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
                <div className="flex flex-col gap-3">
                    <button
                        type="button"
                        onClick={onContinue}
                        className="min-h-[48px] w-full rounded-lg bg-[#FBBF24] px-4 text-sm font-bold text-black transition-colors hover:bg-[#FCD34D]"
                    >
                        Continue
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="min-h-[48px] w-full rounded-lg bg-[#2a2a2a] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#333333]"
                    >
                        Cancel
                    </button>
                </div>
            }
        >
            <div className="space-y-4 px-2 pb-2 pt-4 text-center">
                <h2 className="text-xl font-bold text-white sm:text-2xl">
                    Verify your MLBB Account
                </h2>
                <p className="text-sm leading-relaxed text-[#D1D5DB] sm:text-base">
                    You will be redirected to log in and verify your Mobile
                    Legends account. This step confirms your MLBB profile before
                    submitting your entry.
                </p>
            </div>
        </BaseModal>
    );
}
