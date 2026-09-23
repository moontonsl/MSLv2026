import AdminLayout from '@/Layouts/AdminLayout';
import FeaturedImageUpload from '@/Components/Admin/FeaturedImageUpload';
import { Head, router, useForm } from '@inertiajs/react';
import { CalendarDays, ImagePlus, Pencil, Plus, Search, Trash2 } from 'lucide-react';
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
            <Head title="Event Photos Management" />
            <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl">Event Photos</h1>
                    <p className="text-sm text-gray-400">Manage photos displayed on the Buffs and Support page.</p>
                </div>
                <button type="button" onClick={openCreate} className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-yellow-500 px-4 py-2.5 text-sm font-bold text-black hover:bg-yellow-400">
                    <Plus className="h-4 w-4" />Add Event Photo
                </button>
            </div>

            {formOpen && (
                <section className="mb-8 rounded-xl border border-neutral-800 bg-[#111111] p-4 sm:p-6">
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <h2 className="text-lg font-bold text-yellow-500">{editingPhoto ? 'Edit Event Photo' : 'Add Event Photo'}</h2>
                        <button type="button" onClick={closeForm} className="text-sm text-gray-400 hover:text-white">Cancel</button>
                    </div>
                    <form onSubmit={submit} className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                            <label htmlFor="event-photo-event" className="mb-2 block text-sm font-medium text-gray-300">Event name</label>
                            <input id="event-photo-event" type="text" value={data.event_name} onChange={(event) => setData('event_name', event.target.value)} className="min-h-[44px] w-full rounded-md border border-neutral-800 bg-[#1a1a1a] px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" placeholder="e.g. NDMU CEAC Week" />
                            {errors.event_name && <p className="mt-1 text-sm text-red-400">{errors.event_name}</p>}
                        </div>
                        <div>
                            <label htmlFor="event-photo-school" className="mb-2 block text-sm font-medium text-gray-300">School name</label>
                            <input id="event-photo-school" type="text" value={data.school_name} onChange={(event) => setData('school_name', event.target.value)} className="min-h-[44px] w-full rounded-md border border-neutral-800 bg-[#1a1a1a] px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" placeholder="e.g. Notre Dame of Marbel University" />
                            {errors.school_name && <p className="mt-1 text-sm text-red-400">{errors.school_name}</p>}
                        </div>
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-gray-300">Event photo {editingPhoto ? '(optional when keeping current image)' : ''}</label>
                            <FeaturedImageUpload value={data.picture || (editingPhoto?.image_url ?? null)} onChange={(file) => setData('picture', file)} accept="image/png,image/jpeg,image/jpg,image/gif" hint="PNG, JPG, JPEG, GIF (MAX. 5MB)" />
                            {errors.picture && <p className="mt-1 text-sm text-red-400">{errors.picture}</p>}
                        </div>
                        <div className="flex justify-end md:col-span-2">
                            <button type="submit" disabled={processing} className="min-h-[44px] rounded-md bg-yellow-500 px-5 py-2.5 text-sm font-bold text-black hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50">{processing ? 'Saving...' : editingPhoto ? 'Update Photo' : 'Add Photo'}</button>
                        </div>
                    </form>
                </section>
            )}

            <section className="rounded-xl border border-neutral-800 bg-[#111111] p-4 sm:p-6 md:p-8">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div><h2 className="text-lg font-bold text-yellow-500 sm:text-xl">Current Event Photos</h2><p className="mt-1 text-sm text-gray-400">{eventPhotos.length} photo{eventPhotos.length === 1 ? '' : 's'}</p></div>
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search event or school" className="min-h-[42px] w-full rounded-md border border-neutral-800 bg-[#1a1a1a] pl-9 pr-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" aria-label="Search event photos" />
                    </div>
                </div>
                {filteredPhotos.length === 0 ? <div className="py-14 text-center"><ImagePlus className="mx-auto mb-4 h-10 w-10 text-gray-600" /><p className="text-sm text-gray-400">{search ? 'No event photos match your search.' : 'No event photos found. Add your first photo above.'}</p></div> : <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">{filteredPhotos.map((photo) => <PhotoCard key={photo.id} photo={photo} onEdit={openEdit} onDelete={deletePhoto} />)}</div>}
            </section>
        </AdminLayout>
    );
}
