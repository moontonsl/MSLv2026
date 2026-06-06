import AdminNewsFormModal from '@/Components/Admin/AdminNewsFormModal';
import AdminSuccessModal from '@/Components/Admin/AdminSuccessModal';
import { SUCCESS_MESSAGES, isSuccessModal } from '@/data/adminModalConfig';
import { NEWS_ITEMS } from '@/data/adminNewsData';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

export default function NewsUpdates() {
    const [modalType, setModalType] = useState(null);
    const [localSearch, setLocalSearch] = useState('');

    const closeModal = useCallback(() => {
        setModalType(null);
    }, []);

    const handleFormSubmit = useCallback(() => {
        setModalType('success-news-added');
    }, []);

    const filteredNews = useMemo(() => {
        const q = localSearch.trim().toLowerCase();
        if (!q) return NEWS_ITEMS;
        return NEWS_ITEMS.filter(
            (item) =>
                item.title.toLowerCase().includes(q) ||
                item.writer.toLowerCase().includes(q) ||
                item.description.toLowerCase().includes(q),
        );
    }, [localSearch]);

    const successMessage = isSuccessModal(modalType) ? SUCCESS_MESSAGES[modalType] : '';

    return (
        <AdminLayout activeNavId="news" showGlobalSearch>
            <Head title="News & Updates Settings" />

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="mb-2 text-3xl font-bold text-white">News & Updates</h1>
                    <p className="text-sm text-gray-400">Simple Description</p>
                </div>
                <button
                    type="button"
                    onClick={() => setModalType('add-news')}
                    className="flex shrink-0 items-center gap-2 rounded-md bg-[#FBBF24] px-4 py-2 text-sm font-bold text-black"
                >
                    <Plus className="h-4 w-4" />
                    Create News
                </button>
            </div>

            <div className="relative w-full rounded-xl border border-neutral-800 bg-[#111111] p-6 md:p-8">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xl font-bold text-[#FBBF24]">News Management</h2>
                    <div className="relative w-full sm:w-56">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <input
                            type="search"
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            placeholder="Search..."
                            className="w-full rounded-md border border-neutral-800 bg-[#1A1A1A] py-2 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:border-neutral-600 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px] table-auto border-collapse">
                        <thead>
                            <tr>
                                <th className="pb-4 text-left text-sm font-semibold text-white">
                                    Title
                                </th>
                                <th className="pb-4 text-left text-sm font-semibold text-white">
                                    Writer
                                </th>
                                <th className="pb-4 text-left text-sm font-semibold text-white">
                                    Published Date
                                </th>
                                <th className="pb-4 pr-4 text-right text-sm font-semibold text-white">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredNews.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="py-8 text-center text-sm text-gray-500"
                                    >
                                        No news articles found.
                                    </td>
                                </tr>
                            ) : (
                                filteredNews.map((item) => (
                                    <tr key={item.id}>
                                        <td className="border-b border-neutral-800/50 align-top">
                                            <div className="max-w-xl space-y-3 py-4">
                                                <h3 className="text-base font-bold text-white">
                                                    {item.title}
                                                </h3>
                                                <p className="line-clamp-3 text-sm leading-relaxed text-gray-400">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="border-b border-neutral-800/50 py-4 align-top text-sm text-gray-300">
                                            {item.writer}
                                        </td>
                                        <td className="border-b border-neutral-800/50 py-4 align-top text-sm text-gray-300">
                                            {item.publishedDate}
                                        </td>
                                        <td className="border-b border-neutral-800/50 py-4 pr-4 text-right align-top">
                                            <div className="inline-flex items-center justify-end gap-4">
                                                <button
                                                    type="button"
                                                    className="flex items-center gap-1.5 text-sm text-blue-500 transition-colors hover:text-blue-400"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    className="flex items-center gap-1.5 text-sm text-red-500 transition-colors hover:text-red-400"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 flex justify-end">
                    <nav
                        className="flex items-center gap-2 text-sm text-gray-400"
                        aria-label="News pagination"
                    >
                        <button type="button" className="transition-colors hover:text-white">
                            &lt; Previous
                        </button>
                        <button type="button" className="font-medium text-white">
                            1
                        </button>
                        <button type="button" className="transition-colors hover:text-white">
                            2
                        </button>
                        <button type="button" className="transition-colors hover:text-white">
                            3
                        </button>
                        <span>...</span>
                        <button type="button" className="transition-colors hover:text-white">
                            10
                        </button>
                        <button type="button" className="transition-colors hover:text-white">
                            Next &gt;
                        </button>
                    </nav>
                </div>
            </div>

            {modalType === 'add-news' && (
                <AdminNewsFormModal
                    isOpen
                    onClose={closeModal}
                    onSubmit={handleFormSubmit}
                />
            )}

            {isSuccessModal(modalType) && (
                <AdminSuccessModal
                    isOpen
                    onClose={closeModal}
                    message={successMessage}
                />
            )}
        </AdminLayout>
    );
}
