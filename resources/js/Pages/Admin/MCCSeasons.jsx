import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import axios from 'axios';
import { CalendarDays, Edit3, ImagePlus, Plus, Search, Star, Trash2, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';

const FIELD_CLASS = 'min-h-[44px] w-full rounded-md border border-neutral-800 bg-[#1a1a1a] px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500';
const ERROR_CLASS = 'mt-1 text-sm text-red-400';
const EMPTY_FORM = { season_number: 1, season_name: '', start_date: '', end_date: '', route_slug: '', description: '', is_active: false, _method: null };
const IMAGE_SLOTS = [
    { type: 'hero_images', key: 'hero_left', label: 'Hero image — left' },
    { type: 'hero_images', key: 'hero_right', label: 'Hero image — right' },
    { type: 'logos', key: 'mcc_logo', label: 'MCC logo' },
    { type: 'backgrounds', key: 'main_bg', label: 'Main background' },
];

function Pagination({ paginator }) {
    if (!paginator?.links || paginator.links.length <= 3) return null;
    return <nav className="mt-6 flex flex-wrap justify-end gap-2" aria-label="MCC season pagination">{paginator.links.map((link, index) => <Link key={`${index}-${link.label}`} href={link.url || '#'} dangerouslySetInnerHTML={{ __html: link.label }} className={`min-h-[40px] rounded-md border px-3 py-2 text-sm ${link.active ? 'border-yellow-500 bg-yellow-500 text-black' : 'border-neutral-700 text-gray-300 hover:border-neutral-500'} ${!link.url ? 'pointer-events-none opacity-40' : ''}`} />)}</nav>;
}

function SeasonCard({ season, onEdit, onDelete, onToggle }) {
    return <article className="rounded-xl border border-neutral-800 bg-[#1a1a1a] p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs uppercase tracking-wide text-yellow-500">Season {season.season_number}</p><h3 className="mt-1 text-lg font-semibold text-white">{season.season_name}</h3><p className="mt-1 text-sm text-gray-500">/{season.route_slug}</p></div><div className="flex flex-col items-end gap-2">{season.is_active ? <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">Active</span> : <span className="rounded-full bg-neutral-800 px-2.5 py-1 text-xs text-gray-400">Inactive</span>}<span className="inline-flex items-center gap-1 text-xs text-gray-500"><ImagePlus className="h-3.5 w-3.5" />{season.content_count} content</span></div></div><p className="mt-4 line-clamp-2 text-sm text-gray-400">{season.description || 'No season description.'}</p><p className="mt-3 inline-flex items-center gap-1.5 text-xs text-gray-500"><CalendarDays className="h-3.5 w-3.5" />{season.start_date || 'No start date'}{season.end_date ? ` — ${season.end_date}` : ''}</p><div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => onEdit(season)} className="inline-flex min-h-10 items-center gap-1.5 rounded-md border border-neutral-700 px-3 text-sm text-blue-400 hover:border-blue-400"><Edit3 className="h-4 w-4" />Edit</button>{!season.is_active && <button type="button" onClick={() => onToggle(season)} className="min-h-10 rounded-md border border-emerald-900 px-3 text-sm text-emerald-400 hover:bg-emerald-950">Set active</button>}{season.is_active ? <button type="button" disabled className="min-h-10 rounded-md border border-neutral-800 px-3 text-sm text-gray-600">Active season</button> : <button type="button" onClick={() => onDelete(season)} className="inline-flex min-h-10 items-center gap-1.5 rounded-md border border-red-900 px-3 text-sm text-red-400 hover:bg-red-950"><Trash2 className="h-4 w-4" />Delete</button>}</div></article>;
}

function ContentManager({ season, contentTypes }) {
    const [content, setContent] = useState(season?.content ?? []);
    const [uploading, setUploading] = useState(null);
    const [contentForm, setContentForm] = useState({ content_type: contentTypes?.[0] ?? 'text_content', content_key: '', content_value: '', display_order: 0 });
    const [contentMessage, setContentMessage] = useState('');

    useEffect(() => setContent(season?.content ?? []), [season?.id, season?.content]);

    const getContent = (key) => content.find((item) => item.content_key === key);

    const uploadImage = async (slot, file) => {
        if (!file || !season) return;
        setUploading(slot.key);
        setContentMessage('');
        const formData = new FormData();
        formData.append('season_id', season.id);
        formData.append('content_type', slot.type);
        formData.append('content_key', slot.key);
        formData.append('image', file);
        try {
            const response = await axios.post(route('admin.mcc-seasons.upload-image'), formData);
            setContent((items) => [...items.filter((item) => item.content_key !== slot.key), response.data.content]);
            setContentMessage('Image uploaded successfully.');
        } catch (error) {
            setContentMessage(error.response?.data?.message || 'Image upload failed.');
        } finally {
            setUploading(null);
        }
    };

    const saveContent = async (event) => {
        event.preventDefault();
        if (!contentForm.content_key.trim() || !contentForm.content_value.trim()) return;
        setContentMessage('');
        try {
            const response = await axios.post(route('admin.mcc-seasons.update-content', season.id), contentForm);
            setContent((items) => [...items.filter((item) => item.content_key !== contentForm.content_key), response.data.content]);
            setContentForm({ ...contentForm, content_key: '', content_value: '' });
            setContentMessage('Content saved successfully.');
        } catch (error) {
            setContentMessage(error.response?.data?.message || 'Content could not be saved.');
        }
    };

    const removeContent = async (item) => {
        if (!window.confirm(`Delete content ${item.content_key}?`)) return;
        try {
            await axios.delete(route('admin.mcc-seasons.delete-content', [season.id, item.id]));
            setContent((items) => items.filter((contentItem) => contentItem.id !== item.id));
            setContentMessage('Content deleted successfully.');
        } catch (error) {
            setContentMessage(error.response?.data?.message || 'Content could not be deleted.');
        }
    };

    if (!season) return null;

    return <section className="rounded-xl border border-neutral-800 bg-[#111111] p-4 sm:p-6"><div className="mb-6"><h2 className="text-lg font-bold text-yellow-500">Season content</h2><p className="mt-1 text-sm text-gray-400">Upload standard season visuals or maintain additional content entries.</p></div><div className="grid grid-cols-1 gap-4 md:grid-cols-2">{IMAGE_SLOTS.map((slot) => { const item = getContent(slot.key); const image = item?.content_value?.url || item?.content_value?.path; return <div key={slot.key} className="rounded-lg border border-neutral-800 bg-[#1a1a1a] p-4"><p className="mb-3 text-sm font-medium text-gray-300">{slot.label}</p>{image && <img src={image} alt={slot.label} className="mb-3 h-28 w-full rounded-md object-cover" />}<label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-md border border-neutral-700 px-3 text-sm text-gray-300 hover:border-yellow-500"><Upload className="h-4 w-4" />{uploading === slot.key ? 'Uploading...' : item ? 'Replace image' : 'Upload image'}<input type="file" accept="image/png,image/jpeg,image/jpg,image/gif,image/webp" className="hidden" disabled={Boolean(uploading)} onChange={(event) => uploadImage(slot, event.target.files?.[0])} /></label></div>; })}</div><form onSubmit={saveContent} className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_2fr_auto]"><select value={contentForm.content_type} onChange={(event) => setContentForm({ ...contentForm, content_type: event.target.value })} className={FIELD_CLASS}>{(contentTypes ?? []).map((type) => <option key={type} value={type}>{type}</option>)}</select><input type="text" value={contentForm.content_key} onChange={(event) => setContentForm({ ...contentForm, content_key: event.target.value })} placeholder="Content key" className={FIELD_CLASS} /><input type="text" value={contentForm.content_value} onChange={(event) => setContentForm({ ...contentForm, content_value: event.target.value })} placeholder="Text or JSON content value" className={FIELD_CLASS} /><button type="submit" className="min-h-[44px] rounded-md bg-yellow-500 px-4 text-sm font-bold text-black hover:bg-yellow-400">Save content</button></form>{contentMessage && <p className="mt-3 text-sm text-gray-400">{contentMessage}</p>}<div className="mt-6 space-y-2">{content.filter((item) => !IMAGE_SLOTS.some((slot) => slot.key === item.content_key)).map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-neutral-800 px-3 py-3 text-sm"><div><span className="text-yellow-400">{item.content_key}</span><span className="ml-3 text-gray-500">{item.content_type}</span><p className="mt-1 max-w-2xl truncate text-gray-400">{typeof item.content_value === 'string' ? item.content_value : JSON.stringify(item.content_value)}</p></div><button type="button" onClick={() => removeContent(item)} className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-red-900 px-3 text-red-400 hover:bg-red-950"><Trash2 className="h-4 w-4" />Delete</button></div>)}</div></section>;
}

export default function MCCSeasons({ seasons, nextSeasonNumber = 1, filters = {}, showForm: initialShowForm = false, editingSeason: initialEditingSeason = null, contentTypes = [] }) {
    const [formOpen, setFormOpen] = useState(initialShowForm);
    const [editingSeason, setEditingSeason] = useState(initialEditingSeason);
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? 'all');
    const { data, setData, post, put, processing, errors, reset } = useForm({ ...EMPTY_FORM, season_number: nextSeasonNumber, route_slug: `S${nextSeasonNumber}` });
    const items = seasons?.data ?? [];

    useEffect(() => { setFormOpen(initialShowForm); setEditingSeason(initialEditingSeason); setSearch(filters.search ?? ''); setStatus(filters.status ?? 'all'); if (initialEditingSeason) setData({ season_number: initialEditingSeason.season_number, season_name: initialEditingSeason.season_name ?? '', start_date: initialEditingSeason.start_date ?? '', end_date: initialEditingSeason.end_date ?? '', route_slug: initialEditingSeason.route_slug ?? '', description: initialEditingSeason.description ?? '', is_active: Boolean(initialEditingSeason.is_active), _method: 'PUT' }); else if (initialShowForm) setData({ ...EMPTY_FORM, season_number: nextSeasonNumber, route_slug: `S${nextSeasonNumber}` }); }, [initialEditingSeason, initialShowForm, filters.search, filters.status, nextSeasonNumber]);

    const openCreate = () => { reset(); setData({ ...EMPTY_FORM, season_number: nextSeasonNumber, route_slug: `S${nextSeasonNumber}` }); setEditingSeason(null); setFormOpen(true); };
    const openEdit = (season) => { setData({ season_number: season.season_number, season_name: season.season_name ?? '', start_date: season.start_date ?? '', end_date: season.end_date ?? '', route_slug: season.route_slug ?? '', description: season.description ?? '', is_active: Boolean(season.is_active), _method: 'PUT' }); setEditingSeason(season); setFormOpen(true); };
    const closeForm = () => { reset(); setEditingSeason(null); setFormOpen(false); };
    const submit = (event) => { event.preventDefault(); const options = { preserveScroll: true, onSuccess: closeForm }; if (editingSeason) put(route('admin.mcc-seasons.update', editingSeason.id), options); else post(route('admin.mcc-seasons.store'), options); };
    const submitFilters = (event) => { event.preventDefault(); router.get(route('admin.mcc-seasons.index'), { search: search || undefined, status }, { preserveState: true, preserveScroll: true, replace: true }); };
    const clearFilters = () => { setSearch(''); setStatus('all'); router.get(route('admin.mcc-seasons.index'), {}, { preserveState: true, preserveScroll: true, replace: true }); };
    const toggleActive = (season) => { if (window.confirm(`Set Season ${season.season_number} as active?`)) router.post(route('admin.mcc-seasons.toggle-active', season.id), {}, { preserveScroll: true }); };
    const deleteSeason = (season) => { if (window.confirm(`Delete Season ${season.season_number}?`)) router.delete(route('admin.mcc-seasons.destroy', season.id), { preserveScroll: true }); };

    return <AdminLayout activeNavId="mcc-seasons" showGlobalSearch><Head title="MCC Seasons" /><div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl">MCC Seasons</h1><p className="text-sm text-gray-400">Manage Pamantasang Lakas season metadata and content.</p></div><button type="button" onClick={openCreate} className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-yellow-500 px-4 py-2.5 text-sm font-bold text-black hover:bg-yellow-400"><Plus className="h-4 w-4" />Create Season</button></div>
        {formOpen && <section className="mb-8 rounded-xl border border-neutral-800 bg-[#111111] p-4 sm:p-6"><div className="mb-6 flex items-center justify-between gap-4"><h2 className="text-lg font-bold text-yellow-500">{editingSeason ? `Edit Season ${editingSeason.season_number}` : 'Create MCC Season'}</h2><button type="button" onClick={closeForm} className="text-sm text-gray-400 hover:text-white">Cancel</button></div><form onSubmit={submit} className="grid grid-cols-1 gap-5 md:grid-cols-2"><div><label className="mb-2 block text-sm font-medium text-gray-300">Season number</label><input type="number" min="1" value={data.season_number} onChange={(event) => setData('season_number', Number(event.target.value))} className={FIELD_CLASS} />{errors.season_number && <p className={ERROR_CLASS}>{errors.season_number}</p>}</div><div><label className="mb-2 block text-sm font-medium text-gray-300">Route slug</label><input type="text" value={data.route_slug} onChange={(event) => setData('route_slug', event.target.value)} className={FIELD_CLASS} placeholder="S1" />{errors.route_slug && <p className={ERROR_CLASS}>{errors.route_slug}</p>}</div><div className="md:col-span-2"><label className="mb-2 block text-sm font-medium text-gray-300">Season name</label><input type="text" value={data.season_name} onChange={(event) => setData('season_name', event.target.value)} className={FIELD_CLASS} placeholder="Pamantasang Lakas, Season 1" />{errors.season_name && <p className={ERROR_CLASS}>{errors.season_name}</p>}</div><div><label className="mb-2 block text-sm font-medium text-gray-300">Start date</label><input type="date" value={data.start_date} onChange={(event) => setData('start_date', event.target.value)} className={`${FIELD_CLASS} [color-scheme:dark]`} />{errors.start_date && <p className={ERROR_CLASS}>{errors.start_date}</p>}</div><div><label className="mb-2 block text-sm font-medium text-gray-300">End date</label><input type="date" value={data.end_date} onChange={(event) => setData('end_date', event.target.value)} className={`${FIELD_CLASS} [color-scheme:dark]`} />{errors.end_date && <p className={ERROR_CLASS}>{errors.end_date}</p>}</div><div className="md:col-span-2"><label className="mb-2 block text-sm font-medium text-gray-300">Description</label><textarea rows="4" value={data.description} onChange={(event) => setData('description', event.target.value)} className={FIELD_CLASS} placeholder="Brief season description" />{errors.description && <p className={ERROR_CLASS}>{errors.description}</p>}</div><label className="inline-flex min-h-[44px] items-center gap-3 text-sm text-gray-300"><input type="checkbox" checked={Boolean(data.is_active)} onChange={(event) => setData('is_active', event.target.checked)} className="h-4 w-4 rounded border-neutral-700 bg-[#1a1a1a] text-yellow-500 focus:ring-yellow-500" />Set as active season</label><div className="flex justify-end"><button type="submit" disabled={processing} className="min-h-[44px] rounded-md bg-yellow-500 px-5 py-2.5 text-sm font-bold text-black hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50">{processing ? 'Saving...' : editingSeason ? 'Update Season' : 'Create Season'}</button></div></form></section>}
        <section className="rounded-xl border border-neutral-800 bg-[#111111] p-4 sm:p-6 md:p-8"><div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><h2 className="text-lg font-bold text-yellow-500 sm:text-xl">Season list</h2><p className="mt-1 text-sm text-gray-400">{seasons?.total ?? items.length} season{(seasons?.total ?? items.length) === 1 ? '' : 's'}</p></div><form onSubmit={submitFilters} className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto"><label htmlFor="mcc-season-search" className="sr-only">Search MCC seasons</label><div className="relative flex-1 sm:w-64"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" /><input id="mcc-season-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search seasons" className={`${FIELD_CLASS} pl-9`} /></div><select value={status} onChange={(event) => setStatus(event.target.value)} className={FIELD_CLASS}><option value="all">All status</option><option value="active">Active</option><option value="inactive">Inactive</option></select><button type="submit" className="min-h-[42px] rounded-md bg-yellow-500 px-4 text-sm font-bold text-black hover:bg-yellow-400">Search</button>{(search || status !== 'all') && <button type="button" onClick={clearFilters} className="min-h-[42px] rounded-md border border-neutral-700 px-4 text-sm text-gray-300 hover:border-neutral-500 hover:text-white">Clear</button>}</form></div>{items.length === 0 ? <div className="py-14 text-center"><Star className="mx-auto mb-4 h-10 w-10 text-gray-600" /><p className="text-sm text-gray-400">No MCC seasons found. Create your first season above.</p></div> : <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">{items.map((season) => <SeasonCard key={season.id} season={season} onEdit={openEdit} onDelete={deleteSeason} onToggle={toggleActive} />)}</div>}<Pagination paginator={seasons} /></section>
        {editingSeason && <ContentManager season={editingSeason} contentTypes={contentTypes} />}
    </AdminLayout>;
}
