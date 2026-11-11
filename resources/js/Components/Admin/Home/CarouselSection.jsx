import CarouselModal from '@/Components/Admin/CarouselModal';
import DeleteConfirmationModal from '@/Components/Admin/DeleteConfirmationModal';
import SuccessModal from '@/Components/Admin/SuccessModal';
import ContentCard from '@/Components/Admin/ContentCard';
import SectionCard from '@/Components/Admin/SectionCard';
import { ADMIN_GOLD_BUTTON_CLASS } from '@/Components/Admin/adminFormStyles';
import { Plus, ImagePlus } from 'lucide-react';
import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function CarouselSection({ initialItems = [] }) {
    const mappedItems = initialItems.map((item) => ({
        id: item.id,
        title: item.title || 'Untitled',
        label: item.label || '',
        subtitle: item.subtitle || '',
        link: item.link || '',
        startDate: item.start_date || '',
        endDate: item.end_date || '',
        order: item.order,
        is_active: item.is_active,
        image: item.image_url || (item.image_path?.startsWith('/') ? item.image_path : `/storage/carousel/${item.image_path}`),
        meta: `Order: ${item.order} | ${item.is_active ? 'Active' : 'Inactive'}${item.start_date ? ` | ${item.start_date}` : ''}`,
    }));

    const [items, setItems] = useState(mappedItems);
    const [modalOpen, setModalOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [wasEditSubmit, setWasEditSubmit] = useState(false);
    const [wasDeleteSubmit, setWasDeleteSubmit] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    useEffect(() => {
        setItems(mappedItems);
    }, [initialItems]);

    const openAddModal = () => {
        setEditingItem(null);
        setModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditingItem({
            id: item.id,
            order: item.order ?? items.indexOf(item),
            label: item.label || '',
            title: item.title || '',
            subtitle: item.subtitle || '',
            link: item.link || '',
            startDate: item.startDate || '',
            endDate: item.endDate || '',
            featuredImage: item.image,
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingItem(null);
    };

    const handleSubmit = (values) => {
        const payload = {
            title: values.title || '',
            label: values.label || '',
            subtitle: values.subtitle || '',
            link: values.link || '',
            start_date: values.startDate || null,
            end_date: values.endDate || null,
            order: editingItem?.order ?? items.length,
            is_active: true,
        };

        if (values.featuredImage instanceof File) {
            payload.image = values.featuredImage;
        }

        const options = { forceFormData: true, preserveScroll: true };

        if (editingItem) {
            router.post(route('admin.carousel.update', editingItem.id), { ...payload, _method: 'PUT' }, options);
        } else {
            router.post(route('admin.carousel.store'), payload, options);
        }

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
        router.delete(route('admin.carousel.delete', pendingDeleteId), { preserveScroll: true });
        setDeleteOpen(false);
        setPendingDeleteId(null);
        setWasEditSubmit(false);
        setWasDeleteSubmit(true);
        setSuccessOpen(true);
    };

    return (
        <>
            <SectionCard title="Hero Carousel (Happening Now)">
                <div className="space-y-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-white">Carousel Slides</h3>
                            <p className="text-xs text-gray-400">
                                Manage slides displayed in the "HAPPENING NOW" hero section of the homepage.
                            </p>
                        </div>
                        <button type="button" className={ADMIN_GOLD_BUTTON_CLASS} onClick={openAddModal}>
                            <Plus className="h-4 w-4" />
                            Add Slide
                        </button>
                    </div>

                    {items.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-neutral-800 p-8 text-center">
                            <ImagePlus className="mx-auto mb-3 h-10 w-10 text-gray-600" />
                            <p className="text-sm text-gray-400">No slides yet. Click "Add Slide" to create the first one.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {items.map((item) => (
                                <ContentCard
                                    key={item.id}
                                    imageSrc={item.image}
                                    imageAlt={item.title}
                                    onEdit={() => openEditModal(item)}
                                    onDelete={() => requestDelete(item.id)}
                                >
                                    <div className="space-y-1">
                                        {item.label && (
                                            <span className="inline-block rounded bg-red-600/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                                                {item.label}
                                            </span>
                                        )}
                                        <p className="font-semibold text-white truncate" title={item.title}>{item.title}</p>
                                        {item.subtitle && (
                                            <p className="line-clamp-2 text-xs text-gray-400">{item.subtitle}</p>
                                        )}
                                        <p className="text-[11px] text-yellow-500/80">{item.meta}</p>
                                    </div>
                                </ContentCard>
                            ))}
                        </div>
                    )}
                </div>
            </SectionCard>

            <CarouselModal
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
                        ? 'Slide has been deleted!'
                        : wasEditSubmit
                          ? 'Slide updated successfully!'
                          : 'Slide added successfully!'
                }
            />
        </>
    );
}
