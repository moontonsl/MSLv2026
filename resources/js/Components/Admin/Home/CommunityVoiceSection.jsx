import CommunityVoiceModal from '@/Components/Admin/CommunityVoiceModal';
import DeleteConfirmationModal from '@/Components/Admin/DeleteConfirmationModal';
import SuccessModal from '@/Components/Admin/SuccessModal';
import AdminFieldLabel from '@/Components/Admin/AdminFieldLabel';
import ContentCard from '@/Components/Admin/ContentCard';
import ImageDropzone from '@/Components/Admin/ImageDropzone';
import SectionCard from '@/Components/Admin/SectionCard';
import {
    ADMIN_GOLD_BUTTON_CLASS,
    ADMIN_INPUT_CLASS,
    ADMIN_SELECT_CLASS,
    ADMIN_TEXTAREA_CLASS,
} from '@/Components/Admin/adminFormStyles';
import { COMMUNITY_VOICE_ITEMS, SCHOOL_OPTIONS } from '@/data/adminHomeData';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function CommunityVoiceSection() {
    const [items, setItems] = useState(COMMUNITY_VOICE_ITEMS);
    const [modalOpen, setModalOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [wasEditSubmit, setWasEditSubmit] = useState(false);
    const [wasDeleteSubmit, setWasDeleteSubmit] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    const openAddModal = () => {
        setEditingItem(null);
        setModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditingItem({
            fullName: item.name,
            position: item.role,
            school: item.school,
            message: '',
            featuredImage: item.image,
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingItem(null);
    };

    const handleSubmit = (values) => {
        console.log('Community voice submit:', values);
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

    const requestDelete = (id) => {
        setPendingDeleteId(id);
        setDeleteOpen(true);
    };

    const cancelDelete = () => {
        setDeleteOpen(false);
        setPendingDeleteId(null);
    };

    const confirmDelete = () => {
        if (pendingDeleteId == null) return;
        setItems((prev) => prev.filter((item) => item.id !== pendingDeleteId));
        setDeleteOpen(false);
        setPendingDeleteId(null);
        setWasEditSubmit(false);
        setWasDeleteSubmit(true);
        setSuccessOpen(true);
    };

    return (
        <>
            <SectionCard title="Community Voice">
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div>
                            <AdminFieldLabel htmlFor="community-fullname" required>
                                Fullname
                            </AdminFieldLabel>
                            <input
                                id="community-fullname"
                                type="text"
                                placeholder="e.g. Leslie Alexander"
                                className={ADMIN_INPUT_CLASS}
                            />
                        </div>
                        <div>
                            <AdminFieldLabel htmlFor="community-position" required>
                                Position
                            </AdminFieldLabel>
                            <input
                                id="community-position"
                                type="text"
                                placeholder="e.g. Student Leader"
                                className={ADMIN_INPUT_CLASS}
                            />
                        </div>
                        <div>
                            <AdminFieldLabel htmlFor="community-school" required>
                                School
                            </AdminFieldLabel>
                            <select id="community-school" className={ADMIN_SELECT_CLASS} defaultValue="">
                                <option value="" disabled>
                                    Select school
                                </option>
                                {SCHOOL_OPTIONS.map((school) => (
                                    <option key={school} value={school}>
                                        {school}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <AdminFieldLabel htmlFor="community-message" required>
                                Message
                            </AdminFieldLabel>
                            <textarea
                                id="community-message"
                                rows={5}
                                placeholder="Share their story..."
                                className={`${ADMIN_TEXTAREA_CLASS} h-32`}
                            />
                        </div>
                        <div className="flex lg:col-span-1">
                            <ImageDropzone className="min-h-[120px] flex-1 sm:min-h-[8rem] lg:min-h-0 lg:h-32" />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button type="button" className={ADMIN_GOLD_BUTTON_CLASS} onClick={openAddModal}>
                            <Plus className="h-4 w-4" />
                            Add New
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {items.map((item) => (
                            <ContentCard
                                key={item.id}
                                imageSrc={item.image}
                                imageAlt={item.name}
                                imageClassName="h-56 w-full object-cover object-top"
                                onEdit={() => openEditModal(item)}
                                onDelete={() => requestDelete(item.id)}
                            >
                                <p className="font-bold text-white">{item.name}</p>
                                <p className="mt-1 text-sm font-medium text-[#FBBF24]">{item.role}</p>
                                <p className="mt-1 text-sm text-gray-400">{item.school}</p>
                            </ContentCard>
                        ))}
                    </div>
                </div>
            </SectionCard>

            <CommunityVoiceModal
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
