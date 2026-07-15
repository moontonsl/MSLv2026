import { Pencil, Trash2 } from 'lucide-react';

export default function ContentCard({
    imageSrc,
    imageAlt = '',
    imageClassName = 'h-40 w-full object-cover',
    children,
    onEdit,
    onDelete,
}) {
    return (
        <article className="overflow-hidden rounded-xl border border-neutral-800 bg-[#1A1A1A]">
            <img src={imageSrc} alt={imageAlt} className={imageClassName} />
            <div className="p-4">{children}</div>
            <footer className="flex items-center justify-end gap-4 border-t border-neutral-800 px-4 py-3">
                <button
                    type="button"
                    onClick={onEdit}
                    className="flex items-center gap-1.5 text-sm text-blue-500 transition-colors hover:text-blue-400"
                >
                    <Pencil className="h-4 w-4" />
                    Edit
                </button>
                <button
                    type="button"
                    onClick={onDelete}
                    className="flex items-center gap-1.5 text-sm text-red-500 transition-colors hover:text-red-400"
                >
                    <Trash2 className="h-4 w-4" />
                    Delete
                </button>
            </footer>
        </article>
    );
}
