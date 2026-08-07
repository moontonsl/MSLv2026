import BaseModal from '@/Components/Admin/BaseModal';
import {
    MODAL_READONLY_CLASS,
    MODAL_READONLY_TEXTAREA_CLASS,
    MODAL_VIEW_LABEL_CLASS,
} from '@/Components/Admin/adminModalFormStyles';

function ReadOnlyField({ label, value, multiline = false }) {
    return (
        <div>
            <p className={MODAL_VIEW_LABEL_CLASS}>{label}</p>
            {multiline ? (
                <div className={MODAL_READONLY_TEXTAREA_CLASS}>{value || '—'}</div>
            ) : (
                <div className={MODAL_READONLY_CLASS}>{value || '—'}</div>
            )}
        </div>
    );
}

/**
 * @param {{
 *   isOpen: boolean;
 *   onClose: () => void;
 *   data?: Record<string, unknown> | null;
 * }} props
 */
export default function NewsViewModal({ isOpen, onClose, data = null }) {
    if (!data) return null;

    const authorName = data.authorName ?? data.writer ?? '';
    const shortDescription = data.shortDescription ?? data.description ?? '';
    const featuredImages = Array.isArray(data.featuredImages) ? data.featuredImages : [];

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            maxWidth="max-w-2xl"
            title="News & Update Details"
        >
            <div className="space-y-4 pb-1">
                <ReadOnlyField label="Category" value={data.category} />
                <ReadOnlyField label="Title" value={data.title} />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <ReadOnlyField label="Author Name" value={authorName} />
                    <ReadOnlyField label="Published Date" value={data.publishedDate} />
                </div>

                <ReadOnlyField label="Short Description" value={shortDescription} multiline />
                <ReadOnlyField label="Article Content" value={data.articleContent} multiline />

                <div>
                    <p className={MODAL_VIEW_LABEL_CLASS}>Featured Images</p>
                    {featuredImages.length > 0 ? (
                        <div className="rounded-md border border-[#333] bg-[#1a1a1a] p-3 sm:p-4">
                            <div className="-mx-1 flex gap-3 overflow-x-auto pb-1 md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible">
                                {featuredImages.map((image, index) => {
                                    const src =
                                        typeof image === 'string'
                                            ? image
                                            : image instanceof File
                                              ? URL.createObjectURL(image)
                                              : '';

                                    if (!src) return null;

                                    return (
                                        <div
                                            key={`${index}-${src}`}
                                            className="aspect-video w-[min(85vw,280px)] shrink-0 overflow-hidden rounded-md border border-[#333] md:w-auto"
                                        >
                                            <img
                                                src={src}
                                                alt=""
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className={MODAL_READONLY_CLASS}>No featured images uploaded.</div>
                    )}
                </div>
            </div>
        </BaseModal>
    );
}
