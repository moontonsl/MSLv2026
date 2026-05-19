import { Check } from 'lucide-react';
import Modal from './Modal';

const submitClassName =
    'mt-6 w-full rounded-lg bg-[#FBBF24] py-3 font-bold text-black transition-all hover:brightness-110 active:scale-[0.98]';

export default function AdminSuccessModal({ isOpen, onClose, message }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#FBBF24]">
                    <Check className="h-6 w-6 text-[#FBBF24]" />
                </div>
                <p className="text-lg font-bold text-[#FBBF24]">{message}</p>
                <button type="button" onClick={onClose} className={submitClassName}>
                    Confirm
                </button>
            </div>
        </Modal>
    );
}
