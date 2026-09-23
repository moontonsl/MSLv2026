import AdminLayout from '@/Layouts/AdminLayout';
import FeaturedImageUpload from '@/Components/Admin/FeaturedImageUpload';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { CalendarDays, Edit3, ExternalLink, ImagePlus, Search, Star, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const IMAGE_FIELDS = ['event_img01', 'event_img02', 'event_img03', 'event_img04', 'event_img05'];
const FIELD_CLASS = 'min-h-[44px] w-full rounded-md border border-neutral-800 bg-[#1a1a1a] px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500';
const ERROR_CLASS = 'mt-1 text-sm text-red-400';
const EMPTY_FORM = {
    event_name: '', event_title: '', event_subtitle: '', event_canonical: '', event_logo: null,
    event_state: 'Active', is_featured: false, redirect_url: '', event_content01: '', event_content02: '',
    event_img01: null, event_img02: null, event_img03: null, event_img04: null, event_img05: null, _method: null,
};

function Pagination({ paginator }) {
    if (!paginator?.links || paginator.links.length <= 3) return null;

    return (
        <nav className="mt-6 flex flex-wrap justify-end gap-2" aria-label="MSL event pagination">
            {paginator.links.map((link, index) => (
                <Link key={`${index}-${link.label}`} href={link.url || '#'} dangerouslySetInnerHTML={{ __html: link.label }} className={`min-h-[40px] rounded-md border px-3 py-2 text-sm ${link.active ? 'border-yellow-500 bg-yellow-500 text-black' : 'border-neutral-700 text-gray-300 hover:border-neutral-500'} ${!link.url ? 'pointer-events-none opacity-40' : ''}`} />
            ))}
        </nav>
    );
}

function GalleryImageInput({ field, index, value, existingUrl, onChange }) {
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (!(value instanceof File)) {
            setPreview(null);
            return undefined;
        }
        const url = URL.createObjectURL(value);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [value]);

    const imageUrl = preview || existingUrl;

    return (
        <div className="rounded-lg border border-neutral-800 bg-[#1a1a1a] p-3">
            <label htmlFor={`msl-${field}`} className="mb-2 block text-sm font-medium text-gray-300">Gallery image {index}</label>
            {imageUrl && <img src={imageUrl} alt={`Gallery image ${index}`} className="mb-3 h-24 w-full rounded-md object-cover" />}
            <input id={`msl-${field}`} type="file" accept="image/png,image/jpeg,image/jpg,image/gif" onChange={(event) => onChange(event.target.files?.[0] ?? null)} className="block w-full text-xs text-gray-400 file:mr-3 file:rounded-md file:border-0 file:bg-neutral-700 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-neutral-600" />
            <p className="mt-2 text-xs text-gray-500">PNG, JPG, GIF · max 5MB</p>
        </div>
    );
}

function EventCard({ event, onEdit, onDelete, onToggleStatus }) {
    return (
        <article className="overflow-hidden rounded-xl border border-neutral-800 bg-[#1a1a1a]">
            <div className="relative aspect-[16/9] bg-neutral-900">
                {event.event_logo_url ? <img src={event.event_logo_url} alt={event.event_title} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-gray-600"><ImagePlus className="h-10 w-10" /></div>}
                <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${event.event_state === 'Active' ? 'bg-emerald-500/90 text-white' : 'bg-neutral-800/90 text-gray-300'}`}>{event.event_state}</span>
                {event.is_featured && <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-yellow-500 px-2.5 py-1 text-xs font-bold text-black"><Star className="h-3 w-3 fill-current" />Featured</span>}
            </div>
            <div className="p-4">
                <p className="text-xs uppercase tracking-wide text-yellow-500">{event.event_name}</p>
                <h3 className="mt-1 line-clamp-2 text-lg font-semibold text-white">{event.event_title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-gray-400">{event.event_subtitle || 'No subtitle provided.'}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500"><span className="inline-flex items-center gap-1"><ExternalLink className="h-3.5 w-3.5" />{event.event_canonical || 'No canonical path'}</span>{event.created_at && <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{new Date(event.created_at).toLocaleDateString()}</span>}</div>
                <div className="mt-4 flex flex-wrap gap-2">
                    <button type="button" onClick={() => onEdit(event)} className="inline-flex min-h-10 items-center gap-1.5 rounded-md border border-neutral-700 px-3 text-sm text-blue-400 hover:border-blue-400"><Edit3 className="h-4 w-4" />Edit</button>
                    <button type="button" onClick={() => onToggleStatus(event)} className={`min-h-10 rounded-md border px-3 text-sm ${event.event_state === 'Active' ? 'border-yellow-900 text-yellow-400 hover:bg-yellow-950' : 'border-emerald-900 text-emerald-400 hover:bg-emerald-950'}`}>{event.event_state === 'Active' ? 'Deactivate' : 'Activate'}</button>
                    <button type="button" onClick={() => onDelete(event)} className="inline-flex min-h-10 items-center gap-1.5 rounded-md border border-red-900 px-3 text-sm text-red-400 hover:bg-red-950"><Trash2 className="h-4 w-4" />Delete</button>
                </div>
            </div>
        </article>
    );
}

export default function MslEvents({ events, filters = {}, showForm: initialShowForm = false, editingEvent: initialEditingEvent = null }) {
    const [formOpen, setFormOpen] = useState(initialShowForm);
    const [editingEvent, setEditingEvent] = useState(initialEditingEvent);
    const [search, setSearch] = useState(filters.search ?? '');
    const [state, setState] = useState(filters.state ?? 'all');
    const [featured, setFeatured] = useState(Boolean(filters.featured));
    const { data, setData, post, processing, errors, reset } = useForm(EMPTY_FORM);
    const items = events?.data ?? [];

    useEffect(() => {
        setFormOpen(initialShowForm);
        setEditingEvent(initialEditingEvent);
        setSearch(filters.search ?? '');
        setState(filters.state ?? 'all');
        setFeatured(Boolean(filters.featured));
        if (initialEditingEvent) {
            setData({
                event_name: initialEditingEvent.event_name ?? '', event_title: initialEditingEvent.event_title ?? '', event_subtitle: initialEditingEvent.event_subtitle ?? '', event_canonical: initialEditingEvent.event_canonical ?? '', event_logo: null,
                event_state: initialEditingEvent.event_state ?? 'Active', is_featured: Boolean(initialEditingEvent.is_featured), redirect_url: initialEditingEvent.redirect_url ?? '', event_content01: initialEditingEvent.event_content01 ?? '', event_content02: initialEditingEvent.event_content02 ?? '',
                event_img01: null, event_img02: null, event_img03: null, event_img04: null, event_img05: null, _method: 'PUT',
            });
        } else if (initialShowForm) {
            setData({ ...EMPTY_FORM });
        }
    }, [initialEditingEvent, initialShowForm, filters.featured, filters.search, filters.state]);

    const openCreate = () => {
        reset();
        setData({ ...EMPTY_FORM });
        setEditingEvent(null);
        setFormOpen(true);
    };

    const openEdit = (event) => {
        setData({
            event_name: event.event_name ?? '', event_title: event.event_title ?? '', event_subtitle: event.event_subtitle ?? '', event_canonical: event.event_canonical ?? '', event_logo: null,
            event_state: event.event_state ?? 'Active', is_featured: Boolean(event.is_featured), redirect_url: event.redirect_url ?? '', event_content01: event.event_content01 ?? '', event_content02: event.event_content02 ?? '',
            event_img01: null, event_img02: null, event_img03: null, event_img04: null, event_img05: null, _method: 'PUT',
        });
        setEditingEvent(event);
        setFormOpen(true);
    };

    const closeForm = () => {
        reset();
        setEditingEvent(null);
        setFormOpen(false);
    };

    const submit = (event) => {
        event.preventDefault();
        const url = editingEvent ? route('admin.msl-events.update', editingEvent.id) : route('admin.msl-events.store');
        post(url, { forceFormData: true, preserveScroll: true, onSuccess: closeForm });
    };

    const submitFilters = (event) => {
        event.preventDefault();
        router.get(route('admin.msl-events.index'), { search: search || undefined, state, featured: featured ? 1 : undefined }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const clearFilters = () => {
        setSearch('');
        setState('all');
        setFeatured(false);
        router.get(route('admin.msl-events.index'), {}, { preserveState: true, preserveScroll: true, replace: true });
    };

    const deleteEvent = (event) => {
        if (!window.confirm(`Delete ${event.event_title}?`)) return;
        router.delete(route('admin.msl-events.destroy', event.id), { preserveScroll: true });
    };

    const toggleStatus = (event) => {
        router.put(route('admin.msl-events.update-status', event.id), { event_state: event.event_state === 'Active' ? 'Inactive' : 'Active' }, { preserveScroll: true });
    };

    return (
        <AdminLayout activeNavId="msl-events" showGlobalSearch>
            <Head title="MSL Events" />
            <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl">MSL Events</h1><p className="text-sm text-gray-400">Manage event cards, landing links, and promotional content.</p></div><button type="button" onClick={openCreate} className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-yellow-500 px-4 py-2.5 text-sm font-bold text-black hover:bg-yellow-400"><Edit3 className="h-4 w-4" />Create MSL Event</button></div>

            {formOpen && <section className="mb-8 rounded-xl border border-neutral-800 bg-[#111111] p-4 sm:p-6"><div className="mb-6 flex items-center justify-between gap-4"><h2 className="text-lg font-bold text-yellow-500">{editingEvent ? 'Edit MSL Event' : 'Create MSL Event'}</h2><button type="button" onClick={closeForm} className="text-sm text-gray-400 hover:text-white">Cancel</button></div><form onSubmit={submit} className="space-y-6">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2"><div><label htmlFor="msl-event-name" className="mb-2 block text-sm font-medium text-gray-300">Event name</label><input id="msl-event-name" type="text" value={data.event_name} onChange={(event) => setData('event_name', event.target.value)} className={FIELD_CLASS} placeholder="e.g. Campus Tournament" />{errors.event_name && <p className={ERROR_CLASS}>{errors.event_name}</p>}</div><div><label htmlFor="msl-event-title" className="mb-2 block text-sm font-medium text-gray-300">Event title</label><input id="msl-event-title" type="text" value={data.event_title} onChange={(event) => setData('event_title', event.target.value)} className={FIELD_CLASS} placeholder="Public card title" />{errors.event_title && <p className={ERROR_CLASS}>{errors.event_title}</p>}</div><div><label htmlFor="msl-event-canonical" className="mb-2 block text-sm font-medium text-gray-300">Canonical path / identifier</label><input id="msl-event-canonical" type="text" value={data.event_canonical} onChange={(event) => setData('event_canonical', event.target.value)} className={FIELD_CLASS} placeholder="Auto-generated when blank" />{errors.event_canonical && <p className={ERROR_CLASS}>{errors.event_canonical}</p>}</div><div><label htmlFor="msl-event-redirect" className="mb-2 block text-sm font-medium text-gray-300">Redirect URL (optional)</label><input id="msl-event-redirect" type="url" value={data.redirect_url} onChange={(event) => setData('redirect_url', event.target.value)} className={FIELD_CLASS} placeholder="https://example.com/event" />{errors.redirect_url && <p className={ERROR_CLASS}>{errors.redirect_url}</p>}</div></div>
                <div><label htmlFor="msl-event-subtitle" className="mb-2 block text-sm font-medium text-gray-300">Subtitle</label><textarea id="msl-event-subtitle" rows="3" value={data.event_subtitle} onChange={(event) => setData('event_subtitle', event.target.value)} className={FIELD_CLASS} placeholder="Short event description" />{errors.event_subtitle && <p className={ERROR_CLASS}>{errors.event_subtitle}</p>}</div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2"><div><label className="mb-2 block text-sm font-medium text-gray-300">Status</label><select value={data.event_state} onChange={(event) => setData('event_state', event.target.value)} className={FIELD_CLASS}><option value="Active">Active</option><option value="Inactive">Inactive</option></select>{errors.event_state && <p className={ERROR_CLASS}>{errors.event_state}</p>}</div><label className="mt-7 inline-flex min-h-[44px] items-center gap-3 text-sm text-gray-300"><input type="checkbox" checked={Boolean(data.is_featured)} onChange={(event) => setData('is_featured', event.target.checked)} className="h-4 w-4 rounded border-neutral-700 bg-[#1a1a1a] text-yellow-500 focus:ring-yellow-500" />Featured event</label></div>
                <div><label className="mb-2 block text-sm font-medium text-gray-300">Event logo</label><FeaturedImageUpload value={data.event_logo || (editingEvent?.event_logo_url ?? null)} onChange={(file) => setData('event_logo', file)} accept="image/png,image/jpeg,image/jpg,image/gif" hint="PNG, JPG, GIF (MAX. 5MB)" />{errors.event_logo && <p className={ERROR_CLASS}>{errors.event_logo}</p>}</div>
                <div><h3 className="mb-3 text-sm font-medium text-gray-300">Gallery images</h3><div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{IMAGE_FIELDS.map((field, index) => <GalleryImageInput key={field} field={field} index={index + 1} value={data[field]} existingUrl={editingEvent?.event_image_urls?.[field]} onChange={(file) => setData(field, file)} />)}</div>{IMAGE_FIELDS.map((field) => errors[field] && <p key={field} className={ERROR_CLASS}>{errors[field]}</p>)}</div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2"><div><label htmlFor="msl-content-1" className="mb-2 block text-sm font-medium text-gray-300">Additional content 1</label><textarea id="msl-content-1" rows="5" value={data.event_content01} onChange={(event) => setData('event_content01', event.target.value)} className={FIELD_CLASS} /></div><div><label htmlFor="msl-content-2" className="mb-2 block text-sm font-medium text-gray-300">Additional content 2</label><textarea id="msl-content-2" rows="5" value={data.event_content02} onChange={(event) => setData('event_content02', event.target.value)} className={FIELD_CLASS} /></div></div>
                <div className="flex justify-end"><button type="submit" disabled={processing} className="min-h-[44px] rounded-md bg-yellow-500 px-5 py-2.5 text-sm font-bold text-black hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50">{processing ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}</button></div>
            </form></section>}

            <section className="rounded-xl border border-neutral-800 bg-[#111111] p-4 sm:p-6 md:p-8"><div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><h2 className="text-lg font-bold text-yellow-500 sm:text-xl">Event Cards</h2><p className="mt-1 text-sm text-gray-400">{events?.total ?? items.length} event{(events?.total ?? items.length) === 1 ? '' : 's'}</p></div><form onSubmit={submitFilters} className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto"><label htmlFor="msl-event-search" className="sr-only">Search MSL events</label><div className="relative flex-1 sm:w-64"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" /><input id="msl-event-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search events" className={`${FIELD_CLASS} pl-9`} /></div><select value={state} onChange={(event) => setState(event.target.value)} className={`${FIELD_CLASS} sm:w-32`}><option value="all">All status</option><option value="Active">Active</option><option value="Inactive">Inactive</option></select><label className="inline-flex min-h-[42px] items-center gap-2 rounded-md border border-neutral-800 px-3 text-sm text-gray-300"><input type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} className="h-4 w-4 rounded border-neutral-700 bg-[#1a1a1a] text-yellow-500 focus:ring-yellow-500" />Featured</label><button type="submit" className="min-h-[42px] rounded-md bg-yellow-500 px-4 text-sm font-bold text-black hover:bg-yellow-400">Search</button>{(search || state !== 'all' || featured) && <button type="button" onClick={clearFilters} className="min-h-[42px] rounded-md border border-neutral-700 px-4 text-sm text-gray-300 hover:border-neutral-500 hover:text-white">Clear</button>}</form></div>{items.length === 0 ? <div className="py-14 text-center"><ImagePlus className="mx-auto mb-4 h-10 w-10 text-gray-600" /><p className="text-sm text-gray-400">No MSL events found. Create your first event card above.</p></div> : <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">{items.map((event) => <EventCard key={event.id} event={event} onEdit={openEdit} onDelete={deleteEvent} onToggleStatus={toggleStatus} />)}</div>}<Pagination paginator={events} /></section>
        </AdminLayout>
    );
}
