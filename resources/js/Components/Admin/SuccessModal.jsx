import BaseModal from "@/Components/Admin/BaseModal";

import { MODAL_SUBMIT_FOOTER_CLASS } from "@/Components/Admin/adminModalFormStyles";

import { Check } from "lucide-react";

export default function SuccessModal({
    isOpen,
    onClose,
    message,
    description,
    isEditMode = false,
}) {
    const displayMessage =
        message ??
        (isEditMode ? "Updated Successfully!" : "Successfully Added!");

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={displayMessage}
            ariaLabel={displayMessage}
            hideHeader
            showCloseButton
            scrollable={false}
            maxWidth="max-w-[330px] sm:max-w-[526px]"
            panelClassName="min-h-[min(420px,90dvh)]"
            bodyClassName="flex items-center justify-center !px-8 !py-12 sm:!px-16"
        >
            <div className="w-full text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#FBBF24] bg-[#151515]">
                    <Check className="h-8 w-8 text-[#FBBF24]" />
                </div>

                <h2 className="font-heading text-lg font-bold text-[#FBBF24] sm:text-2xl">
                    {displayMessage}
                </h2>

                {description ? (
                    <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-[#A8A8B3]">
                        {description}
                    </p>
                ) : null}

                <button
                    type="button"
                    onClick={onClose}
                    className={`mt-8 ${MODAL_SUBMIT_FOOTER_CLASS}`}
                >
                    Confirm
                </button>
            </div>
        </BaseModal>
    );
}
