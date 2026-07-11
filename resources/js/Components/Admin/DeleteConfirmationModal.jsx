import BaseModal from '@/Components/Admin/BaseModal';
import {
    MODAL_CANCEL_CLASS,
    MODAL_CONFIRM_YES_CLASS,
} from '@/Components/Admin/adminModalFormStyles';

/**
 * @param {{
 *   isOpen: boolean;
 *   onCancel: () => void;
 *   onConfirm: () => void;
 * }} props
 */
export default function DeleteConfirmationModal({ isOpen, onCancel, onConfirm }) {
    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onCancel}
            hideHeader
            scrollable={false}
            maxWidth="max-w-sm"
            footer={
                <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={onCancel} className={MODAL_CANCEL_CLASS}>
                        Cancel
                    </button>
                    <button type="button" onClick={onConfirm} className={MODAL_CONFIRM_YES_CLASS}>
                        Yes
                    </button>
                </div>
            }
        >
            <div className="px-1 py-4 text-center sm:py-6">
                <p className="text-base font-bold text-white sm:text-lg">
                    Are you sure you want to delete this data?
                </p>
            </div>
        </BaseModal>
    );
}
