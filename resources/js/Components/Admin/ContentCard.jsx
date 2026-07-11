import { MODAL_ACTION_ICON_CLASS } from '@/Components/Admin/adminModalFormStyles';
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
            <footer className="flex items-center justify-end gap-2 border-t border-neutral-800 px-4 py-3">
                <button
                    type="button"
                    onClick={onEdit}
                    className={`${MODAL_ACTION_ICON_CLASS} gap-1.5 px-3 text-sm text-blue-500 hover:bg-blue-500/10 hover:text-blue-400`}
                >
                    <Pencil className="h-4 w-4" />
                    <span className="hidden sm:inline">Edit</span>
                </button>
                <button
                    type="button"
                    onClick={onDelete}
                    className={`${MODAL_ACTION_ICON_CLASS} gap-1.5 px-3 text-sm text-red-500 hover:bg-red-500/10 hover:text-red-400`}
                >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Delete</span>
                </button>
            </footer>
        </article>
    );
}
