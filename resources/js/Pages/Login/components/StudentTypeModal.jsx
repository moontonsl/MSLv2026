import { X } from "react-feather";

export default function StudentTypeModal({ isOpen, onClose, onSelect }) {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10010] flex items-center justify-center bg-black/70 backdrop-blur-sm">

            <div className="w-full max-w-md bg-[#0b0b0b] border border-white/10 rounded-2xl p-6 relative">

                {/* CLOSE */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-white/60 hover:text-white"
                >
                    <X size={20} />
                </button>

                {/* ICON */}
                <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xl">
                        🎓
                    </div>
                </div>

                {/* TITLE */}
                <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-white">
                        Type of Student
                    </h2>
                    <p className="text-sm text-white/60">
                        Select your current academic level
                    </p>
                </div>

                {/* BUTTONS */}
                <div className="flex flex-col gap-3">

                    <button
                        onClick={() => onSelect('shs')}
                        className="w-full py-3 rounded-xl bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition"
                    >
                        SHS
                    </button>

                    <button
                        onClick={() => onSelect('college')}
                        className="w-full py-3 rounded-xl border border-yellow-500 text-yellow-400 font-semibold hover:bg-yellow-500 hover:text-black transition"
                    >
                        College
                    </button>

                </div>

            </div>

        </div>
    );
}
