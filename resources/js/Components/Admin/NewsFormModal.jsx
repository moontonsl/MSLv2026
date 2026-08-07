import BaseModal from '@/Components/Admin/BaseModal';
import FeaturedImagesUpload from '@/Components/Admin/FeaturedImagesUpload';
import {
    MODAL_INPUT_CLASS,
    MODAL_LABEL_CLASS,
    MODAL_SELECT_CLASS,
    MODAL_SUBMIT_FOOTER_CLASS,
    MODAL_TEXTAREA_CLASS,
} from '@/Components/Admin/adminModalFormStyles';
import { NEWS_CATEGORY_OPTIONS } from '@/data/adminNewsData';
import { useEffect, useId, useState } from 'react';

const EMPTY_FORM = {
    category: 'Community',
    title: '',
    authorName: '',
    publishedDate: '',
    shortDescription: '',
    articleContent: '',
    featuredImages: [],
};

/**
 * @param {{
 *   isOpen: boolean;
 *   onClose: () => void;
 *   initialData?: Record<string, unknown> | null;
 *   onSubmit: (values: typeof EMPTY_FORM) => void;
 * }} props
 */
export default function NewsFormModal({ isOpen, onClose, initialData = null, onSubmit }) {
    const isEditing = initialData != null;
    const formId = useId();
    const [form, setForm] = useState(EMPTY_FORM);

    useEffect(() => {
        if (!isOpen) return;

        if (initialData) {
            setForm({
                category: initialData.category ?? 'Community',
                title: initialData.title ?? '',
                authorName: initialData.authorName ?? initialData.writer ?? '',
                publishedDate: initialData.publishedDate ?? '',
                shortDescription:
                    initialData.shortDescription ?? initialData.description ?? '',
                articleContent: initialData.articleContent ?? '',
                featuredImages: initialData.featuredImages ?? [],
            });
            return;
        }

        setForm(EMPTY_FORM);
    }, [isOpen, initialData]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(form);
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            maxWidth="max-w-2xl"
            title={isEditing ? 'Edit News & Update' : 'Add News & Update'}
            footer={
                <button type="submit" form={formId} className={MODAL_SUBMIT_FOOTER_CLASS}>
                    {isEditing ? 'Update' : 'Submit'}
                </button>
            }
        >
            <form id={formId} onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="news-category" className={MODAL_LABEL_CLASS}>
                        Category
                    </label>
                    <select
                        id="news-category"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className={MODAL_SELECT_CLASS}
                    >
                        {NEWS_CATEGORY_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="news-title" className={MODAL_LABEL_CLASS}>
                        Title
                    </label>
                    <input
                        id="news-title"
                        name="title"
                        type="text"
                        value={form.title}
                        onChange={handleChange}
                        className={MODAL_INPUT_CLASS}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label htmlFor="news-author" className={MODAL_LABEL_CLASS}>
                            Author Name
                        </label>
                        <input
                            id="news-author"
                            name="authorName"
                            type="text"
                            value={form.authorName}
                            onChange={handleChange}
                            className={MODAL_INPUT_CLASS}
                        />
                    </div>
                    <div>
                        <label htmlFor="news-published-date" className={MODAL_LABEL_CLASS}>
                            Published Date
                        </label>
                        <input
                            id="news-published-date"
                            name="publishedDate"
                            type="date"
                            value={form.publishedDate}
                            onChange={handleChange}
                            className={MODAL_INPUT_CLASS}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="news-short-description" className={MODAL_LABEL_CLASS}>
                        Short Description
                    </label>
                    <input
                        id="news-short-description"
                        name="shortDescription"
                        type="text"
                        value={form.shortDescription}
                        onChange={handleChange}
                        className={MODAL_INPUT_CLASS}
                    />
                </div>

                <div>
                    <label htmlFor="news-article-content" className={MODAL_LABEL_CLASS}>
                        Article Content
                    </label>
                    <textarea
                        id="news-article-content"
                        name="articleContent"
                        value={form.articleContent}
                        onChange={handleChange}
                        placeholder="Enter text here..."
                        className={`${MODAL_TEXTAREA_CLASS} min-h-[160px]`}
                    />
                </div>

                <div>
                    <p className={MODAL_LABEL_CLASS}>Featured Images (Max 3)</p>
                    <FeaturedImagesUpload
                        value={form.featuredImages}
                        onChange={(featuredImages) =>
                            setForm((prev) => ({ ...prev, featuredImages }))
                        }
                    />
                </div>
            </form>
        </BaseModal>
    );
}
