import AdminLayout from '@/Layouts/AdminLayout';
import FeaturedImageUpload from '@/Components/Admin/FeaturedImageUpload';
import { Head, router, useForm } from '@inertiajs/react';
import { ArrowDown, ArrowUp, Eye, EyeOff, ImagePlus, Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const EMPTY_FORM = { title: '', order: 0, is_active: true, image: null };

function CarouselCard({ item, index, count, onEdit, onDelete, onToggle, onMove }) {
    return (
        <article className="overflow-hidden rounded-xl border border-neutral-800 bg-[#1a1a1a]">
            <div className="relative aspect-video bg-neutral-900">
                {item.image_url ? <img src={item.image_url} alt={item.title || 'Carousel image'} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-gray-600"><ImagePlus className="h-10 w-10" /></div>}
                <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${item.is_active ? 'bg-emerald-500/90 text-white' : 'bg-neutral-800/90 text-gray-300'}`}>
                    {item.is_active ? 'Active' : 'Inactive'}
                </span>
                <button type="button" onClick={() => onToggle(item)} className="absolute right-3 top-3 flex min-h-10 min-w-10 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black" title={item.is_active ? 'Hide from carousel' : 'Show in carousel'} aria-label={item.is_active ? 'Hide from carousel' : 'Show in carousel'}>
                    {item.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
            </div>
            <div className="p-4">
                <h3 className="truncate font-semibold text-white">{item.title || 'Untitled'}</h3>
                <p className="mt-1 text-xs text-gray-500">Display order: {index + 1}</p>
                <div className="mt-4 flex items-center justify-between gap-2">
                    <div className="flex gap-1">
                        <button type="button" onClick={() => onMove(index, -1)} disabled={index === 0} className="flex min-h-10 min-w-10 items-center justify-center rounded-md border border-neutral-700 text-gray-300 hover:border-yellow-500 hover:text-yellow-400 disabled:cursor-not-allowed disabled:opacity-30" title="Move up" aria-label="Move up"><ArrowUp className="h-4 w-4" /></button>
                        <button type="button" onClick={() => onMove(index, 1)} disabled={index === count - 1} className="flex min-h-10 min-w-10 items-center justify-center rounded-md border border-neutral-700 text-gray-300 hover:border-yellow-500 hover:text-yellow-400 disabled:cursor-not-allowed disabled:opacity-30" title="Move down" aria-label="Move down"><ArrowDown className="h-4 w-4" /></button>
                    </div>
                    <div className="flex gap-1">
                        <button type="button" onClick={() => onEdit(item)} className="flex min-h-10 items-center gap-1.5 rounded-md border border-neutral-700 px-3 text-sm text-blue-400 hover:border-blue-400" aria-label={`Edit ${item.title || 'carousel item'}`}><Pencil className="h-4 w-4" />Edit</button>
                        <button type="button" onClick={() => onDelete(item)} className="flex min-h-10 items-center justify-center rounded-md border border-red-900 px-3 text-red-400 hover:bg-red-950" aria-label={`Delete ${item.title || 'carousel item'}`}><Trash2 className="h-4 w-4" /></button>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default function Carousel({ carousels: initialCarousels = [] }) {
    const [carousels, setCarousels] = useState(initialCarousels);
    const [formOpen, setFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const { data, setData, post, processing, errors, reset } = useForm(EMPTY_FORM);

    useEffect(() => setCarousels(initialCarousels), [initialCarousels]);

    const openCreate = () => {
        reset();
        setData({ ...EMPTY_FORM, order: carousels.length });
        setEditingItem(null);
        setFormOpen(true);
    };

    const openEdit = (item) => {
        setData({ title: item.title ?? '', order: item.order ?? 0, is_active: item.is_active, image: null });
        setEditingItem(item);
        setFormOpen(true);
    };

    const closeForm = () => {
        reset();
        setEditingItem(null);
        setFormOpen(false);
    };

    const submit = (event) => {
        event.preventDefault();
        const options = {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: closeForm,
        };
        if (editingItem) {
            post(route('admin.carousel.update', editingItem.id), { ...data, _method: 'PUT' }, options);
        } else {
            post(route('admin.carousel.store'), data, options);
        }
    };

    const toggleActive = (item) => {
        router.put(route('admin.carousel.update', item.id), { is_active: !item.is_active }, { preserveScroll: true });
    };

    const deleteItem = (item) => {
        if (!window.confirm(`Delete ${item.title || 'this carousel item'}?`)) return;
        router.delete(route('admin.carousel.delete', item.id), { preserveScroll: true });
    };

    const moveItem = (index, direction) => {
        const nextIndex = index + direction;
        if (nextIndex < 0 || nextIndex >= carousels.length) return;
        const next = [...carousels];
        [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
        setCarousels(next);
        router.post(route('admin.carousel.reorder'), {
            carousels: next.map((item, itemIndex) => ({ id: item.id, order: itemIndex })),
        }, { preserveScroll: true });
    };

    return (
        <AdminLayout activeNavId="carousel" showGlobalSearch>
            <Head title="Carousel Management" />
            <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl">Carousel</h1>
                    <p className="text-sm text-gray-400">Manage homepage carousel images and display order.</p>
                </div>
                <button type="button" onClick={openCreate} className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-yellow-500 px-4 py-2.5 text-sm font-bold text-black hover:bg-yellow-400"><Plus className="h-4 w-4" />Add Carousel Image</button>
            </div>

            {formOpen && (
                <section className="mb-8 rounded-xl border border-neutral-800 bg-[#111111] p-4 sm:p-6">
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <h2 className="text-lg font-bold text-yellow-500">{editingItem ? 'Edit Carousel Image' : 'Add Carousel Image'}</h2>
                        <button type="button" onClick={closeForm} className="text-sm text-gray-400 hover:text-white">Cancel</button>
                    </div>
                    <form onSubmit={submit} className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                            <label htmlFor="carousel-title" className="mb-2 block text-sm font-medium text-gray-300">Title</label>
                            <input id="carousel-title" type="text" value={data.title} onChange={(event) => setData('title', event.target.value)} className="min-h-[44px] w-full rounded-md border border-neutral-800 bg-[#1a1a1a] px-4 py-2.5 text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none" placeholder="Optional title" />
                            {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
                        </div>
                        <div>
                            <label htmlFor="carousel-order" className="mb-2 block text-sm font-medium text-gray-300">Display order</label>
                            <input id="carousel-order" type="number" min="0" value={data.order} onChange={(event) => setData('order', Number(event.target.value))} className="min-h-[44px] w-full rounded-md border border-neutral-800 bg-[#1a1a1a] px-4 py-2.5 text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none" />
                            {errors.order && <p className="mt-1 text-sm text-red-400">{errors.order}</p>}
                        </div>
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-gray-300">Carousel image {editingItem ? '(optional when keeping current image)' : ''}</label>
                            <FeaturedImageUpload value={data.image || (editingItem?.image_url ?? null)} onChange={(file) => setData('image', file)} />
                            {errors.image && <p className="mt-1 text-sm text-red-400">{errors.image}</p>}
                        </div>
                        <label className="inline-flex min-h-[44px] items-center gap-3 text-sm text-gray-300 md:col-span-2">
                            <input type="checkbox" checked={Boolean(data.is_active)} onChange={(event) => setData('is_active', event.target.checked)} className="h-4 w-4 rounded border-neutral-700 bg-[#1a1a1a] text-yellow-500 focus:ring-yellow-500" />
                            Show this image in the active carousel
                        </label>
                        <div className="flex justify-end md:col-span-2"><button type="submit" disabled={processing} className="min-h-[44px] rounded-md bg-yellow-500 px-5 py-2.5 text-sm font-bold text-black hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50">{processing ? 'Saving...' : editingItem ? 'Update Image' : 'Add Image'}</button></div>
                    </form>
                </section>
            )}

            <section className="rounded-xl border border-neutral-800 bg-[#111111] p-4 sm:p-6 md:p-8">
                <div className="mb-6 flex items-center justify-between gap-4"><div><h2 className="text-lg font-bold text-yellow-500 sm:text-xl">Current Carousel Images</h2><p className="mt-1 text-sm text-gray-400">{carousels.length} image{carousels.length === 1 ? '' : 's'} · Use the arrows to reorder.</p></div><ImagePlus className="h-7 w-7 text-yellow-500" /></div>
                {carousels.length === 0 ? <div className="py-14 text-center"><ImagePlus className="mx-auto mb-4 h-10 w-10 text-gray-600" /><p className="text-sm text-gray-400">No carousel images found. Add your first image above.</p></div> : <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">{carousels.map((item, index) => <CarouselCard key={item.id} item={item} index={index} count={carousels.length} onEdit={openEdit} onDelete={deleteItem} onToggle={toggleActive} onMove={moveItem} />)}</div>}
            </section>
        </AdminLayout>
    );
}
