import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { HelpCircle, X } from "lucide-react";

export default function ConfirmModal({ 
    isOpen, 
    title, 
    message, 
    onConfirm, 
    onCancel, 
    confirmText = "Confirm", 
    cancelText = "Cancel" 
}) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen || typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-md p-4 transition-all duration-200">
            {/* Backdrop click handler */}
            <div className="absolute inset-0" onClick={onCancel} />
            
            <div className="w-full max-w-md bg-[#0f0f11]/95 backdrop-blur-2xl border border-white/15 rounded-2xl p-6 relative shadow-[0_20px_70px_rgba(0,0,0,0.6)] z-10 animate-in fade-in zoom-in-95 duration-150">
                {/* Visual identity left accent border */}
                <div className="absolute top-0 left-0 w-[4px] h-full bg-brand-500 rounded-l-2xl" />
                
                {/* Header */}
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-brand-500" /> {title}
                    </h3>
                    <button
                        onClick={onCancel}
                        className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="mb-6">
                    <p className="text-sm text-gray-300 leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-3 border-t border-white/5">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-sm font-semibold text-gray-400 hover:text-white transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-black text-sm font-bold transition-all uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
