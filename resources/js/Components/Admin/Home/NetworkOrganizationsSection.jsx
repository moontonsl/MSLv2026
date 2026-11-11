import DeleteConfirmationModal from "@/Components/Admin/DeleteConfirmationModal";
import SuccessModal from "@/Components/Admin/SuccessModal";
import SectionCard from "@/Components/Admin/SectionCard";
import NetworkOrganizationModal from "./NetworkOrganizationModal";
import { ADMIN_GOLD_BUTTON_CLASS } from "@/Components/Admin/adminFormStyles";
import { router } from "@inertiajs/react";
import { ExternalLink, Globe, ImagePlus, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function NetworkOrganizationsSection({ initialItems = [] }) {
    const [items, setItems] = useState(initialItems);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);
    const [successOpen, setSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        setItems(initialItems);
    }, [initialItems]);

    const openAddModal = () => {
        setEditingItem(null);
        setModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setModalOpen(true);
    };

    const requestDelete = (id) => {
        setPendingDeleteId(id);
        setDeleteOpen(true);
    };

    const confirmDelete = () => {
        if (!pendingDeleteId) return;
        router.delete(route("admin.home-page.network-organizations.delete", pendingDeleteId), {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteOpen(false);
                setPendingDeleteId(null);
                setSuccessMessage("Network organization logo removed successfully.");
                setSuccessOpen(true);
            },
        });
    };

    const handleSubmit = (values) => {
        const payload = {
            name: values.name,
            link: values.link || null,
            order: values.order ?? 0,
            is_active: values.is_active ? 1 : 0,
        };

        if (values.logo instanceof File) {
            payload.logo = values.logo;
        }

        const options = {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setModalOpen(false);
                setEditingItem(null);
                setSuccessMessage(
                    editingItem
                        ? "Network organization updated successfully."
                        : "Network organization logo added successfully."
                );
                setSuccessOpen(true);
            },
        };

        if (editingItem) {
            router.post(
                route("admin.home-page.network-organizations.update", editingItem.id),
                { ...payload, _method: "POST" },
                options
            );
        } else {
            router.post(
                route("admin.home-page.network-organizations.store"),
                payload,
                options
            );
        }
    };

    return (
        <>
            <SectionCard
                title="MSL Network Organizations"
                description="Manage the partner and organization logos featured in the continuous scrolling marquee on the homepage. Each logo can have a destination link so visitors can click to visit their page."
                headerRight={
                    <button
                        type="button"
                        onClick={openAddModal}
                        className={ADMIN_GOLD_BUTTON_CLASS}
                    >
                        <Plus className="h-4 w-4" />
                        Add Organization Logo
                    </button>
                }
            >
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-800 py-12 text-center">
                        <ImagePlus className="h-10 w-10 text-neutral-600 mb-3" />
                        <p className="text-sm text-neutral-400">
                            No network organization logos yet.
                        </p>
                        <button
                            type="button"
                            onClick={openAddModal}
                            className="mt-4 text-xs font-semibold text-[#FBBF24] hover:underline"
                        >
                            + Add First Organization Logo
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-neutral-800 bg-[#161616] p-4 transition-colors hover:border-neutral-700"
                            >
                                <div>
                                    {/* Logo Display Container */}
                                    <div className="flex h-32 w-full items-center justify-center rounded-lg border border-neutral-800 bg-neutral-950/80 p-4">
                                        <img
                                            src={item.logo_url || item.logo_path}
                                            alt={item.name}
                                            className="max-h-full max-w-full object-contain transition-transform group-hover:scale-105"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="mt-3.5">
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="truncate font-semibold text-white text-base">
                                                {item.name}
                                            </h3>
                                            <span
                                                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                                    item.is_active
                                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                        : "bg-neutral-800 text-gray-400 border border-neutral-700"
                                                }`}
                                            >
                                                {item.is_active ? "Active" : "Inactive"}
                                            </span>
                                        </div>

                                        {/* Link */}
                                        <div className="mt-2 flex items-center gap-1.5 text-xs text-neutral-400">
                                            <Globe className="h-3.5 w-3.5 shrink-0 text-[#FBBF24]" />
                                            {item.link ? (
                                                <a
                                                    href={item.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="truncate text-[#FBBF24] hover:underline flex items-center gap-1"
                                                    title={item.link}
                                                >
                                                    <span className="truncate">{item.link}</span>
                                                    <ExternalLink className="h-3 w-3 shrink-0" />
                                                </a>
                                            ) : (
                                                <span className="italic text-neutral-500">
                                                    No link set (not clickable)
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-1 text-[11px] text-neutral-500">
                                            Display Order: <strong className="text-neutral-300">{item.order}</strong>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions Footer */}
                                <div className="mt-4 flex items-center justify-end gap-2 border-t border-neutral-800/80 pt-3">
                                    <button
                                        type="button"
                                        onClick={() => openEditModal(item)}
                                        className="inline-flex items-center gap-1.5 rounded-md border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-200 transition-colors hover:bg-neutral-800 hover:text-white"
                                    >
                                        <Pencil className="h-3.5 w-3.5 text-[#FBBF24]" />
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => requestDelete(item.id)}
                                        className="inline-flex items-center gap-1.5 rounded-md border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20 hover:text-red-300"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </SectionCard>

            <NetworkOrganizationModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditingItem(null);
                }}
                initialData={editingItem}
                onSubmit={handleSubmit}
            />

            <DeleteConfirmationModal
                isOpen={deleteOpen}
                onClose={() => {
                    setDeleteOpen(false);
                    setPendingDeleteId(null);
                }}
                onConfirm={confirmDelete}
                title="Delete Organization Logo"
                message="Are you sure you want to remove this network organization logo from the homepage?"
            />

            <SuccessModal
                isOpen={successOpen}
                onClose={() => setSuccessOpen(false)}
                title="Success"
                message={successMessage}
            />
        </>
    );
}
