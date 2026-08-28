import BaseModal from '@/Components/Admin/BaseModal';
import { MODAL_SUBMIT_FOOTER_CLASS } from '@/Components/Admin/adminModalFormStyles';
import { Check } from 'lucide-react';

/**
 * Global success feedback modal for add, update, delete, and approval actions.
 *
 * @param {{
 *   isOpen: boolean;
 *   onClose: () => void;
 *   message: string;
 *   description?: string;
 *   isEditMode?: boolean;
 * }} props
 */
export default function SuccessModal({
    isOpen,
    onClose,
    message,
    description,
    isEditMode = false,
}) {
    const displayMessage =
        message ?? (isEditMode ? 'Updated Successfully!' : 'Successfully Added!');

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            hideHeader
            scrollable={false}
            maxWidth="max-w-sm"
            footer={
                <button type="button" onClick={onClose} className={MODAL_SUBMIT_FOOTER_CLASS}>
                    Confirm
                </button>
            }
        >
            <div className="px-1 py-2 text-center sm:py-4">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-yellow-500 bg-[#1a1a1a] sm:h-16 sm:w-16">
                    <Check className="h-7 w-7 text-yellow-500 sm:h-8 sm:w-8" />
                </div>
                <h2
                    className={`text-lg font-bold sm:text-xl ${
                        description ? 'text-white' : 'text-yellow-500'
                    }`}
                >
                    {displayMessage}
                </h2>
                {description ? (
                    <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-gray-400">
                        {description}
                    </p>
                ) : null}
            </div>
        </BaseModal>
    );
}
