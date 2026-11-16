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
            className={`flex min-h-[120px] w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-700 bg-[#1A1A1A] p-4 sm:p-5 text-gray-400 transition-colors hover:border-[#FBBF24] ${className}`}
        >
            <CloudUpload className="mb-2.5 h-7 w-7 shrink-0" />
            <span className="text-center text-sm font-medium text-gray-300">
                Click to upload or drag and drop
            </span>
            <span className="mt-1 break-words text-center text-xs text-gray-500">{hint}</span>
        </button>
    );
}
