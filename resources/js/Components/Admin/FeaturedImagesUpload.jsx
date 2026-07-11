import { CloudUpload, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const ACCEPT = 'image/png,image/jpeg,image/jpg';
const DEFAULT_HINT = 'PNG, JPG, JPEG (MAX. 5MB), Must be 1920x1080 pixels';
const MAX_IMAGES = 3;

function resolvePreview(item, objectUrls) {
    if (item instanceof File) {
        return objectUrls.get(item) ?? null;
    }
    if (typeof item === 'string' && item) {
        return item;
    }
    return null;
}

/**
 * @param {{
 *   value?: Array<File | string>;
 *   onChange?: (images: Array<File | string>) => void;
 *   className?: string;
 *   hint?: string;
 * }} props
 */
export default function FeaturedImagesUpload({
    value = [],
    onChange,
    className = '',
    hint = DEFAULT_HINT,
}) {
    const inputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [objectUrls, setObjectUrls] = useState(new Map());

    useEffect(() => {
        const nextUrls = new Map();
        const created = [];

        value.forEach((item) => {
            if (item instanceof File) {
                const url = URL.createObjectURL(item);
                nextUrls.set(item, url);
                created.push(url);
            }
        });

        setObjectUrls(nextUrls);

        return () => {
            created.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [value]);

    const canAddMore = value.length < MAX_IMAGES;

    const addFiles = (files) => {
        if (!files?.length || !canAddMore) return;

        const remaining = MAX_IMAGES - value.length;
        const nextFiles = Array.from(files)
            .filter((file) => file.type.startsWith('image/'))
            .slice(0, remaining);

        if (nextFiles.length === 0) return;
        onChange?.([...value, ...nextFiles]);
    };

    const handleInputChange = (event) => {
        addFiles(event.target.files);
        event.target.value = '';
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        if (canAddMore) setIsDragging(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        addFiles(event.dataTransfer.files);
    };

    const removeAt = (index) => {
        onChange?.(value.filter((_, itemIndex) => itemIndex !== index));
    };

    return (
        <div className={className}>
            <input
                ref={inputRef}
                type="file"
                accept={ACCEPT}
                multiple
                className="hidden"
                onChange={handleInputChange}
            />

            {value.length > 0 && (
                <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {value.map((item, index) => {
                        const preview = resolvePreview(item, objectUrls);
                        return (
                            <div
                                key={`${index}-${preview ?? 'image'}`}
                                className="relative aspect-video overflow-hidden rounded-md border border-[#333] bg-[#1a1a1a]"
                            >
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt=""
                                        className="h-full w-full object-cover"
                                    />
                                ) : null}
                                <button
                                    type="button"
                                    onClick={() => removeAt(index)}
                                    className="absolute right-1 top-1 flex min-h-11 min-w-11 items-center justify-center rounded-full bg-black/70 text-white transition-colors hover:bg-black"
                                    aria-label="Remove image"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {canAddMore ? (
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
                    <CloudUpload className="mb-3 h-8 w-8 text-gray-400" />
                    <span className="text-center text-sm text-gray-300">
                        Click to upload or drag and drop
                    </span>
                    <span className="mt-1 px-2 text-center text-xs text-gray-500">{hint}</span>
                    <span className="mt-2 text-xs text-gray-500">
                        {value.length} / {MAX_IMAGES} images selected
                    </span>
                </button>
            ) : (
                <p className="text-center text-xs text-gray-500">
                    Maximum of {MAX_IMAGES} images reached.
                </p>
            )}
        </div>
    );
}
