import { CloudUpload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const ACCEPT = 'image/png,image/jpeg,image/jpg';
const DEFAULT_HINT = 'PNG, JPG, JPEG (MAX. 5MB), Must be 1920x1080 pixels';

export default function FeaturedImageUpload({
    value,
    onChange,
    className = '',
    hint = DEFAULT_HINT,
}) {
    const inputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [objectUrl, setObjectUrl] = useState(null);

    const previewUrl =
        value instanceof File ? objectUrl : typeof value === 'string' && value ? value : null;

    useEffect(() => {
        if (!(value instanceof File)) {
            setObjectUrl(null);
            return undefined;
        }

        const url = URL.createObjectURL(value);
        setObjectUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [value]);

    const handleFile = (file) => {
        if (!file || !file.type.startsWith('image/')) return;
        onChange?.(file);
    };

    const handleInputChange = (event) => {
        const file = event.target.files?.[0];
        handleFile(file);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFile(event.dataTransfer.files?.[0]);
    };

    return (
        <div className={className}>
            <input
                ref={inputRef}
                type="file"
                accept={ACCEPT}
                className="hidden"
                onChange={handleInputChange}
            />
            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex min-h-[120px] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-md border-2 border-dashed p-4 text-gray-400 transition-colors sm:min-h-[150px] sm:p-8 ${
                    isDragging
                        ? 'border-yellow-500 bg-yellow-500/5'
                        : 'border-gray-600 bg-[#1a1a1a] hover:border-gray-500'
                }`}
            >
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt="Featured preview"
                        className="mb-3 max-h-32 w-full rounded-md object-cover sm:max-h-40"
                    />
                ) : (
                    <CloudUpload className="mb-3 h-8 w-8 text-gray-400" />
                )}
                <span className="text-center text-sm text-gray-300 sm:text-sm">
                    Click to upload or drag and drop
                </span>
                <span className="mt-1 px-2 text-center text-xs text-gray-500">{hint}</span>
            </button>
        </div>
    );
}
