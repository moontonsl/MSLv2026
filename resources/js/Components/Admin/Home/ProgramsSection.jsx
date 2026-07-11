import ProgramModal from '@/Components/Admin/ProgramModal';
import DeleteConfirmationModal from '@/Components/Admin/DeleteConfirmationModal';
import SuccessModal from '@/Components/Admin/SuccessModal';
import { MODAL_ACTION_ICON_CLASS } from '@/Components/Admin/adminModalFormStyles';
import { ADMIN_GOLD_BUTTON_CLASS } from '@/Components/Admin/adminFormStyles';
import SectionCard from '@/Components/Admin/SectionCard';
import { PROGRAMS_DATA } from '@/data/adminHomeData';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function ProgramsSection() {
    const [programs, setPrograms] = useState(PROGRAMS_DATA);
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [wasEditSubmit, setWasEditSubmit] = useState(false);
    const [wasDeleteSubmit, setWasDeleteSubmit] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [pendingDeleteTitle, setPendingDeleteTitle] = useState(null);

    const filteredPrograms = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return programs;
        return programs.filter(
            (row) =>
                row.title.toLowerCase().includes(q) ||
                row.link.toLowerCase().includes(q),
        );
    }, [programs, search]);

    const openAddModal = () => {
        setEditingItem(null);
        setModalOpen(true);
    };

    const openEditModal = (row) => {
        setEditingItem({
            title: row.title,
            shortDescription: '',
            links: row.link,
            featuredImage: row.thumbnail,
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingItem(null);
    };

    const handleSubmit = (values) => {
        console.log('Program submit:', values);
        setWasEditSubmit(editingItem != null);
        setWasDeleteSubmit(false);
        setModalOpen(false);
        setEditingItem(null);
        setSuccessOpen(true);
    };

    const closeSuccess = () => {
        setSuccessOpen(false);
        setWasEditSubmit(false);
        setWasDeleteSubmit(false);
    };

    const requestDelete = (title) => {
        setPendingDeleteTitle(title);
        setDeleteOpen(true);
    };

    const cancelDelete = () => {
        setDeleteOpen(false);
        setPendingDeleteTitle(null);
    };

    const confirmDelete = () => {
        if (!pendingDeleteTitle) return;
        setPrograms((prev) => prev.filter((row) => row.title !== pendingDeleteTitle));
        setDeleteOpen(false);
        setPendingDeleteTitle(null);
        setWasEditSubmit(false);
        setWasDeleteSubmit(true);
        setSuccessOpen(true);
    };

    const headerRight = (
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="w-full min-h-[44px] rounded-md border border-neutral-800 bg-[#1A1A1A] py-2.5 pl-10 pr-4 text-base text-white placeholder:text-gray-500 focus:ring-2 focus:ring-yellow-500 focus:outline-none md:text-sm"
                />
            </div>
            <button type="button" className={ADMIN_GOLD_BUTTON_CLASS} onClick={openAddModal}>
                <Plus className="h-4 w-4" />
                Add Program
            </button>
        </div>
    );

    return (
        <>
            <SectionCard title="Our Programs" headerRight={headerRight}>
                <div className="hidden overflow-x-auto md:block">
                    <table className="w-full table-auto border-collapse">
                        <thead>
                            <tr>
                                <th className="pb-4 text-left text-sm font-semibold text-white">Title</th>
                                <th className="pb-4 text-left text-sm font-semibold text-white">Links</th>
                                <th className="pb-4 pr-4 text-right text-sm font-semibold text-white">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPrograms.map((row) => (
                                <tr key={row.title}>
                                    <td className="border-b border-neutral-800/50 py-4 text-sm text-gray-300">
                                        {row.title}
                                    </td>
                                    <td className="border-b border-neutral-800/50 py-4 text-sm text-gray-300">
                                        {row.link}
                                    </td>
                                    <td className="border-b border-neutral-800/50 py-4 pr-4 text-right">
                                        <div className="inline-flex items-center justify-end gap-2">
                                            <img
                                                src={row.thumbnail}
                                                alt=""
                                                className="h-10 w-10 rounded-md border border-neutral-700 object-cover"
                                            />
                                            <button
                                                type="button"
                                                className={`${MODAL_ACTION_ICON_CLASS} text-blue-500 hover:bg-blue-500/10 hover:text-blue-400`}
                                                aria-label="Edit program"
                                                onClick={() => openEditModal(row)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                className={`${MODAL_ACTION_ICON_CLASS} text-red-500 hover:bg-red-500/10 hover:text-red-400`}
                                                aria-label="Delete program"
                                                onClick={() => requestDelete(row.title)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="space-y-3 md:hidden">
                    {filteredPrograms.map((row) => (
                        <article
                            key={row.title}
                            className="rounded-lg border border-neutral-800 bg-[#1a1a1a] p-4"
                        >
                            <div className="mb-3 border-b border-neutral-800/60 pb-3">
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Title
                                </p>
                                <p className="mt-1 text-sm text-gray-200">{row.title}</p>
                            </div>
                            <div className="mb-4 border-b border-neutral-800/60 pb-3">
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Links
                                </p>
                                <p className="mt-1 break-all text-sm text-gray-200">{row.link}</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <img
                                    src={row.thumbnail}
                                    alt=""
                                    className="h-10 w-10 rounded-md border border-neutral-700 object-cover"
                                />
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        className={`${MODAL_ACTION_ICON_CLASS} text-blue-500 hover:bg-blue-500/10 hover:text-blue-400`}
                                        aria-label="Edit program"
                                        onClick={() => openEditModal(row)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        className={`${MODAL_ACTION_ICON_CLASS} text-red-500 hover:bg-red-500/10 hover:text-red-400`}
                                        aria-label="Delete program"
                                        onClick={() => requestDelete(row.title)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="mt-6 flex justify-end">
                    <nav
                        className="flex items-center gap-2 text-sm text-gray-400"
                        aria-label="Programs pagination"
                    >
                        <button type="button" className="min-h-[44px] px-2 transition-colors hover:text-white">
                            &lt; Previous
                        </button>
                        <button type="button" className="min-h-[44px] px-2 font-medium text-white">
                            1
                        </button>
                        <button type="button" className="min-h-[44px] px-2 transition-colors hover:text-white">
                            2
                        </button>
                        <button type="button" className="min-h-[44px] px-2 transition-colors hover:text-white">
                            3
                        </button>
                        <span>...</span>
                        <button type="button" className="min-h-[44px] px-2 transition-colors hover:text-white">
                            10
                        </button>
                        <button type="button" className="min-h-[44px] px-2 transition-colors hover:text-white">
                            Next &gt;
                        </button>
                    </nav>
                </div>
            </SectionCard>

            <ProgramModal
                isOpen={modalOpen}
                onClose={closeModal}
                initialData={editingItem}
                onSubmit={handleSubmit}
            />

            <DeleteConfirmationModal
                isOpen={deleteOpen}
                onCancel={cancelDelete}
                onConfirm={confirmDelete}
            />

            <SuccessModal
                isOpen={successOpen}
                onClose={closeSuccess}
                message={
                    wasDeleteSubmit
                        ? 'Data has been deleted!'
                        : wasEditSubmit
                          ? 'Updated Successfully!'
                          : 'Successfully Added!'
                }
            />
        </>
    );
}
