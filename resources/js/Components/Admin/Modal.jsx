import { X } from 'lucide-react';
import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, children, maxWidth = 'max-w-md' }) {
    useEffect(() => {
        if (!isOpen) return undefined;

        const handleEscape = (event) => {
            if (event.key === 'Escape') onClose();
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleEscape);

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
        >
            <button
                type="button"
                className="absolute inset-0 cursor-default"
                aria-label="Close modal"
                onClick={onClose}
            />
            <div className={`relative w-full ${maxWidth} rounded-xl border border-neutral-800 bg-[#111111] p-8 shadow-2xl`}>
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-500 transition-colors hover:text-white"
                    aria-label="Close"
                >
                    <X className="h-5 w-5" />
                </button>
                {children}
            </div>
        </div>
    );
}
