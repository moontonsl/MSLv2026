import BaseModal from "@/Components/Admin/BaseModal";

export default function RegionalAdminSchoolConfirmationModal({
    isOpen,
    action = "add",
    schoolName = "",
    onCancel,
    onConfirm,
}) {
    const actionLabel = action === "delete" ? "delete" : "add";

    const question = `Are you sure you want to ${actionLabel} ${schoolName}?`;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onCancel}
            title={question}
            hideHeader
            showCloseButton={true}
            scrollable={false}
            maxWidth="max-w-[330px] sm:max-w-[526px]"
            panelClassName="h-[min(465px,90dvh)] border-[#FBBF24]/60 border-t-[#FBBF24] bg-[#0B0B0B]"
            bodyClassName="flex items-center justify-center px-8 py-10 sm:px-16 sm:py-12"
        >
            <div className="w-full">
                <h2
                    id="base-modal-title"
                    className="mx-auto mb-10 max-w-[400px] text-left text-[21px] font-bold leading-[1.5] text-[#F5F5F5] sm:text-center sm:text-2xl sm:leading-[1.35]"
                >
                    Are you sure you want to {actionLabel}{" "}
                    <span className="break-words">{schoolName}</span>?
                </h2>

                <div className="mx-auto grid w-full max-w-[400px] grid-cols-2 gap-2.5 sm:gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        autoFocus
                        className="inline-flex min-h-[54px] items-center justify-center rounded-xl border border-[#1D1D1D] bg-[#1A1A1A] px-4 text-sm font-semibold text-white outline-none transition hover:border-[#333333] hover:bg-[#222222] focus:ring-2 focus:ring-white/40 active:scale-[0.98] sm:text-base"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        className="inline-flex min-h-[54px] items-center justify-center rounded-xl border border-[#FBBF24] bg-[#FBBF24] px-4 text-sm font-bold text-black outline-none transition hover:border-[#FCD34D] hover:bg-[#FCD34D] focus:ring-2 focus:ring-[#FBBF24] focus:ring-offset-2 focus:ring-offset-[#0B0B0B] active:scale-[0.98] sm:text-base"
                    >
                        Yes
                    </button>
                </div>
            </div>
        </BaseModal>
    );
}
