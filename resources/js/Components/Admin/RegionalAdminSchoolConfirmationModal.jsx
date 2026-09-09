import ConfirmationModal from "@/Components/Admin/ConfirmationModal";

export default function RegionalAdminSchoolConfirmationModal({
    isOpen,
    action = "add",
    schoolName = "",
    onCancel,
    onConfirm,
}) {
    const actionLabel = action === "delete" ? "delete" : "add";

    const message = `Are you sure you want to ${actionLabel} ${schoolName}?`;

    return (
        <ConfirmationModal
            isOpen={isOpen}
            message={message}
            cancelText="Cancel"
            confirmText="Yes"
            onCancel={onCancel}
            onConfirm={onConfirm}
        />
    );
}
