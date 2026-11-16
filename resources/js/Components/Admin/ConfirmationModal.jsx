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
            scrollable
            maxWidth="max-w-md sm:max-w-[526px]"
            panelClassName="min-h-[min(360px,88dvh)]"
            bodyClassName="flex items-center justify-center !px-5 !py-10 sm:!px-16 sm:!py-12"
        >
            <div className="w-full">
                <p className="mx-auto mb-8 sm:mb-10 max-w-[400px] break-words text-center font-heading text-lg font-bold leading-[1.45] text-[#F5F1E6] sm:text-2xl sm:leading-[1.35]">
                    {message}
                </p>

                <div className="mx-auto grid w-full max-w-[400px] grid-cols-1 gap-2.5 min-[360px]:grid-cols-2 sm:gap-3">
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
