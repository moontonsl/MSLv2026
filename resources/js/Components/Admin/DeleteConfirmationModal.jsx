import ConfirmationModal from "@/Components/Admin/ConfirmationModal";

export default function DeleteConfirmationModal({
    isOpen,
    message = "Are you sure you want to delete this data?",
    onCancel,
    onConfirm,
}) {
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
