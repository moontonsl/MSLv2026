import AdminLayout from '@/Layouts/AdminLayout';
import FeaturedImageUpload from '@/Components/Admin/FeaturedImageUpload';
import { Head, router, useForm } from '@inertiajs/react';
import { createPortal } from 'react-dom';
import { CalendarDays, ImagePlus, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const EMPTY_FORM = { event_name: '', school_name: '', picture: null, _method: null };

function PhotoCard({ photo, onEdit, onDelete }) {
    return (
        <article className="overflow-hidden rounded-xl border border-neutral-800 bg-[#1a1a1a]">
            <div className="aspect-[4/3] bg-neutral-900">
                {photo.image_url ? (
                    <img src={photo.image_url} alt={photo.event_name || 'Event photo'} className="h-full w-full object-cover" />
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-600"><ImagePlus className="h-10 w-10" /></div>
                )}
            </div>
            <div className="p-4">
                <h3 className="truncate font-semibold text-white">{photo.event_name || 'Untitled event'}</h3>
                <p className="mt-1 truncate text-sm text-gray-400">{photo.school_name || 'No school name'}</p>
                {photo.created_at && (
                    <p className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {new Date(photo.created_at).toLocaleDateString()}
                    </p>
                )}
                <div className="mt-4 flex gap-2">
                    <button type="button" onClick={() => onEdit(photo)} className="flex min-h-10 items-center gap-1.5 rounded-md border border-neutral-700 px-3 text-sm text-blue-400 hover:border-blue-400" aria-label={`Edit ${photo.event_name || 'event photo'}`}>
                        <Pencil className="h-4 w-4" />Edit
                    </button>
                    <button type="button" onClick={() => onDelete(photo)} className="flex min-h-10 items-center gap-1.5 rounded-md border border-red-900 px-3 text-sm text-red-400 hover:bg-red-950" aria-label={`Delete ${photo.event_name || 'event photo'}`}>
                        <Trash2 className="h-4 w-4" />Delete
                    </button>
                </div>
            </div>
        </article>
    );
}

export default function EventPhotos({ eventPhotos: initialEventPhotos = [] }) {
    const [eventPhotos, setEventPhotos] = useState(initialEventPhotos);
    const [search, setSearch] = useState('');
    const [formOpen, setFormOpen] = useState(false);
    const [editingPhoto, setEditingPhoto] = useState(null);
    const { data, setData, post, processing, errors, reset } = useForm(EMPTY_FORM);

    useEffect(() => setEventPhotos(initialEventPhotos), [initialEventPhotos]);

    const filteredPhotos = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return eventPhotos;

        return eventPhotos.filter((photo) => `${photo.event_name} ${photo.school_name}`.toLowerCase().includes(query));
    }, [eventPhotos, search]);

    const openCreate = () => {
        reset();
        setData({ ...EMPTY_FORM });
        setEditingPhoto(null);
        setFormOpen(true);
    };

    const openEdit = (photo) => {
        setData({ event_name: photo.event_name ?? '', school_name: photo.school_name ?? '', picture: null, _method: 'PUT' });
        setEditingPhoto(photo);
        setFormOpen(true);
    };

    const closeForm = () => {
        reset();
        setEditingPhoto(null);
        setFormOpen(false);
    };

    const submit = (event) => {
        event.preventDefault();
        const url = editingPhoto ? route('admin.event-photos.update', editingPhoto.id) : route('admin.event-photos.store');
        post(url, { forceFormData: true, preserveScroll: true, onSuccess: closeForm });
    };

    const deletePhoto = (photo) => {
        if (!window.confirm(`Delete ${photo.event_name || 'this event photo'}?`)) return;
        router.delete(route('admin.event-photos.delete', photo.id), { preserveScroll: true });
    };

    return (
        <AdminLayout activeNavId="event-photos" showGlobalSearch>
            <Head title="Event Photos" />
            <div className="mb-6 flex flex-col gap-4 sm:mb-8 xl:flex-row xl:items-end xl:justify-between">
                <div>
                    <h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl">Event Photos</h1>
                    <p className="text-sm leading-6 text-gray-400">Manage photos displayed on the Buffs and Support page.</p>
                </div>
                <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
                    <label className="relative block min-w-0 flex-1 sm:w-64 sm:flex-none">
                        <span className="sr-only">Search event photos</span>
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search event or school" aria-label="Search event photos" className="min-h-[44px] w-full rounded-md border border-neutral-800 bg-[#1a1a1a] py-2.5 pl-9 pr-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                    </label>
                    <button type="button" onClick={openCreate} className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-md bg-yellow-500 px-4 py-2.5 text-sm font-bold text-black hover:bg-yellow-400">
                        <Plus className="h-4 w-4" />Add Event Photo
                    </button>
                </div>
            </div>

            {formOpen && typeof document !== 'undefined' && createPortal(
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-md transition-all duration-200"
                    role="dialog"
                    aria-modal="true"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) closeForm();
                    }}
                >
                    <div className="w-full max-w-xl rounded-2xl border border-yellow-500/30 bg-[#0f0f11]/95 backdrop-blur-2xl p-6 shadow-[0_20px_70px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                                    <ImagePlus className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-base font-black text-white">{editingPhoto ? 'Edit Event Photo' : 'Add Event Photo'}</h2>
                                    <p className="text-xs text-gray-400">Upload school event highlights and gallery photos</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={closeForm}
                                className="rounded-lg p-1 text-gray-400 hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={submit} className="mt-5 space-y-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="event-photo-event" className="block text-xs font-semibold text-gray-300 mb-1.5">Event name *</label>
                                    <input id="event-photo-event" type="text" value={data.event_name} onChange={(event) => setData('event_name', event.target.value)} className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-white placeholder:text-gray-500 focus:border-yellow-400 focus:outline-none" placeholder="e.g. NDMU CEAC Week" />
                                    {errors.event_name && <p className="mt-1 text-xs text-red-400">{errors.event_name}</p>}
                                </div>
                                <div>
                                    <label htmlFor="event-photo-school" className="block text-xs font-semibold text-gray-300 mb-1.5">School name *</label>
                                    <input id="event-photo-school" type="text" value={data.school_name} onChange={(event) => setData('school_name', event.target.value)} className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-white placeholder:text-gray-500 focus:border-yellow-400 focus:outline-none" placeholder="e.g. Notre Dame of Marbel University" />
                                    {errors.school_name && <p className="mt-1 text-xs text-red-400">{errors.school_name}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Event photo {editingPhoto ? '(optional when keeping current image)' : '*'}</label>
                                <FeaturedImageUpload value={data.picture || (editingPhoto?.image_url ?? null)} onChange={(file) => setData('picture', file)} accept="image/png,image/jpeg,image/jpg,image/gif" hint="PNG, JPG, JPEG, GIF (MAX. 5MB)" />
                                {errors.picture && <p className="mt-1 text-xs text-red-400">{errors.picture}</p>}
                            </div>

                            <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4 mt-6">
                                <button type="button" onClick={closeForm} className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-bold text-gray-300 hover:bg-white/5">Cancel</button>
                                <button type="submit" disabled={processing} className="inline-flex items-center gap-1.5 rounded-xl bg-yellow-400 px-5 py-2.5 text-xs font-bold text-black hover:bg-yellow-300 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                                    <span>{processing ? 'Saving...' : editingPhoto ? 'Update Photo' : 'Add Photo'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            <section className="rounded-xl border border-neutral-800 bg-[#111111] p-4 sm:p-6 md:p-8">
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-yellow-500 sm:text-xl">Current Event Photos</h2>
                    <p className="mt-1 text-sm text-gray-400">{eventPhotos.length} photo{eventPhotos.length === 1 ? '' : 's'}</p>
                </div>
                {filteredPhotos.length === 0 ? <div className="py-14 text-center"><ImagePlus className="mx-auto mb-4 h-10 w-10 text-gray-600" /><p className="text-sm text-gray-400">{search ? 'No event photos match your search.' : 'No event photos found. Add your first photo above.'}</p></div> : <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">{filteredPhotos.map((photo) => <PhotoCard key={photo.id} photo={photo} onEdit={openEdit} onDelete={deletePhoto} />)}</div>}
            </section>
        </AdminLayout>
    );
}
