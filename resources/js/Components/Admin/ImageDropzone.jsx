import { CloudUpload } from 'lucide-react';

export default function ImageDropzone({
    className = '',
    hint = 'PNG, JPG, JPEG (Max. 5MB)',
    onClick,
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-700 bg-[#1A1A1A] p-8 text-gray-400 transition-colors hover:border-[#FBBF24] ${className}`}
        >
            <CloudUpload className="mb-3 h-8 w-8" />
            <span className="text-center text-sm font-medium text-gray-300">
                Click to upload or drag and drop
            </span>
            <span className="mt-1 text-center text-xs text-gray-500">{hint}</span>
        </button>
    );
}
