import ImageDropzone from '@/Components/Admin/ImageDropzone';
import Modal from '@/Components/Admin/Modal';
import { NEWS_CATEGORY_OPTIONS } from '@/data/adminNewsData';
import { useEffect, useState } from 'react';

const inputClassName =
    'w-full rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3 text-white outline-none transition-all placeholder:text-gray-600 focus:border-[#FBBF24]';

const submitClassName =
    'mt-6 w-full rounded-lg bg-[#FBBF24] py-3 font-bold text-black transition-all hover:brightness-110 active:scale-[0.98]';

export default function AdminNewsFormModal({ isOpen, onClose, onSubmit }) {
    const [values, setValues] = useState({
        category: 'Community',
        title: '',
        shortDescription: '',
        authorName: '',
        articleContent: '',
    });

    useEffect(() => {
        if (!isOpen) return;
        setValues({
            category: 'Community',
            title: '',
            shortDescription: '',
            authorName: '',
            articleContent: '',
        });
    }, [isOpen]);

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(values);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
            <div className="max-h-[calc(90vh-4rem)] overflow-y-auto pr-2">
                <h2 className="mb-6 text-xl font-bold text-[#FBBF24]">Add News & Update</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="news-category" className="mb-2 block text-sm text-gray-400">
                            Category
                        </label>
                        <select
                            id="news-category"
                            value={values.category}
                            onChange={(e) =>
                                setValues((prev) => ({ ...prev, category: e.target.value }))
                            }
                            className={inputClassName}
                        >
                            {NEWS_CATEGORY_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="news-title" className="mb-2 block text-sm text-gray-400">
                            Title
                        </label>
                        <input
                            id="news-title"
                            type="text"
                            value={values.title}
                            onChange={(e) =>
                                setValues((prev) => ({ ...prev, title: e.target.value }))
                            }
                            className={inputClassName}
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="news-short-description"
                            className="mb-2 block text-sm text-gray-400"
                        >
                            Short Description
                        </label>
                        <input
                            id="news-short-description"
                            type="text"
                            value={values.shortDescription}
                            onChange={(e) =>
                                setValues((prev) => ({
                                    ...prev,
                                    shortDescription: e.target.value,
                                }))
                            }
                            className={inputClassName}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="news-author" className="mb-2 block text-sm text-gray-400">
                            Author Name
                        </label>
                        <input
                            id="news-author"
                            type="text"
                            value={values.authorName}
                            onChange={(e) =>
                                setValues((prev) => ({ ...prev, authorName: e.target.value }))
                            }
                            className={inputClassName}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="news-content" className="mb-2 block text-sm text-gray-400">
                            Article Content
                        </label>
                        <textarea
                            id="news-content"
                            value={values.articleContent}
                            onChange={(e) =>
                                setValues((prev) => ({
                                    ...prev,
                                    articleContent: e.target.value,
                                }))
                            }
                            placeholder="Enter text here..."
                            rows={5}
                            className={`${inputClassName} h-32 resize-none`}
                        />
                    </div>

                    <div className="mb-4">
                        <span className="mb-2 block text-sm text-gray-400">
                            Featured Images (Max 3)
                        </span>
                        <ImageDropzone hint="PNG, JPG, JPEG (MAX. 5MB), Must be 1920x1080 pixels" />
                    </div>

                    <button type="submit" className={submitClassName}>
                        Submit
                    </button>
                </form>
            </div>
        </Modal>
    );
}
