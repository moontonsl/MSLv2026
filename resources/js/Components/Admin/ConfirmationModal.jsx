import BaseModal from "@/Components/Admin/BaseModal";

import {
    MODAL_CANCEL_CLASS,
    MODAL_CONFIRM_YES_CLASS,
} from "@/Components/Admin/adminModalFormStyles";

export default function ConfirmationModal({
    isOpen,
    message,
    cancelText = "Cancel",
    confirmText = "Yes",
    onCancel,
    onConfirm,
}) {
    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onCancel}
            title={message}
            ariaLabel={message}
            hideHeader
            showCloseButton
            scrollable={false}
            maxWidth="max-w-[330px] sm:max-w-[526px]"
            panelClassName="h-[min(465px,90dvh)]"
            bodyClassName="flex items-center justify-center !px-8 !py-10 sm:!px-16 sm:!py-12"
        >
            <div className="w-full">
                <p className="mx-auto mb-10 max-w-[400px] break-words text-left font-heading text-lg font-bold leading-[1.5] text-[#F5F1E6] sm:text-center sm:text-2xl sm:leading-[1.35]">
                    {message}
                </p>

                <div className="mx-auto grid w-full max-w-[400px] grid-cols-2 gap-2.5 sm:gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className={MODAL_CANCEL_CLASS}
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        className={MODAL_CONFIRM_YES_CLASS}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </BaseModal>
    );
}
