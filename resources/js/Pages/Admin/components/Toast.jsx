import React, { useEffect } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

export default function Toast({ message, type = "success", onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const isSuccess = type === "success";

    return (
        <div 
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3.5 rounded-xl border text-sm font-medium shadow-2xl transition-all duration-300 hover:scale-[1.02] ${
                isSuccess 
                    ? "bg-zinc-950 border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]" 
                    : "bg-zinc-950 border-red-500/30 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.1)]"
            }`}
        >
            {isSuccess ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            ) : (
                <XCircle className="h-5 w-5 text-red-400 shrink-0" />
            )}
            
            <span className="text-gray-200">{message}</span>
            
            <button 
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-colors ml-2 shrink-0"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}
