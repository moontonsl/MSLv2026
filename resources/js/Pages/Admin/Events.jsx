import AdminLayout from '@/Layouts/AdminLayout';
import AdminFilterSelect from '@/Components/Admin/AdminFilterSelect';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { createPortal } from 'react-dom';
import { CalendarDays, Clock3, MapPin, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const EMPTY_FORM = { title: '', description: '', start_date: '', end_date: '', location: '' };

function formatDateTime(value) {
    if (!value) return '—';
    return new Date(value).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
}

function Pagination({ paginator }) {
    if (!paginator?.links || paginator.links.length <= 3) return null;

    return (
        <nav className="mt-6 flex flex-wrap justify-end gap-2" aria-label="Event pagination">
            {paginator.links.map((link, index) => (
                <Link
                    key={`${index}-${link.label}`}
                    href={link.url || '#'}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className={`min-h-[40px] rounded-md border px-3 py-2 text-sm ${link.active ? 'border-yellow-500 bg-yellow-500 text-black' : 'border-neutral-700 text-gray-300 hover:border-neutral-500'} ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                />
            ))}
        </nav>
    );
}

function EventRow({ event, onEdit, onDelete }) {
    const isPast = event.end_date && new Date(event.end_date) < new Date();

    return (
        <tr className="border-b border-neutral-800/60 text-sm text-gray-300 last:border-0">
            <td className="px-3 py-4">
                <p className="font-semibold text-white">{event.title}</p>
                {event.description && <p className="mt-1 max-w-sm truncate text-xs text-gray-500">{event.description}</p>}
            </td>
            <td className="px-3 py-4 whitespace-nowrap">
                <p className="inline-flex items-center gap-2 text-white"><CalendarDays className="h-4 w-4 text-yellow-400" />{formatDateTime(event.start_date)}</p>
                <p className="mt-1 inline-flex items-center gap-2 text-xs text-gray-500"><Clock3 className="h-3.5 w-3.5" />Until {formatDateTime(event.end_date)}</p>
            </td>
            <td className="px-3 py-4">{event.location ? <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-500" />{event.location}</span> : '—'}</td>
            <td className="px-3 py-4"><span className={`rounded-full px-2.5 py-1 text-xs ${isPast ? 'bg-neutral-800 text-gray-400' : 'bg-emerald-500/10 text-emerald-400'}`}>{isPast ? 'Past' : 'Upcoming'}</span></td>
            <td className="px-3 py-4 text-right">
                <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => onEdit(event)} className="inline-flex min-h-10 items-center gap-1.5 rounded-md border border-neutral-700 px-3 text-sm text-blue-400 hover:border-blue-400" aria-label={`Edit ${event.title}`}><Pencil className="h-4 w-4" />Edit</button>
                    <button type="button" onClick={() => onDelete(event)} className="inline-flex min-h-10 items-center gap-1.5 rounded-md border border-red-900 px-3 text-sm text-red-400 hover:bg-red-950" aria-label={`Delete ${event.title}`}><Trash2 className="h-4 w-4" />Delete</button>
                </div>
            </td>
        </tr>
    );
}

export default function Events({ events, filters = {}, showForm: initialShowForm = false, editingEvent: initialEditingEvent = null }) {
    const [formOpen, setFormOpen] = useState(initialShowForm);
    const [editingEvent, setEditingEvent] = useState(initialEditingEvent);
    const [search, setSearch] = useState(filters.search ?? '');
    const [filter, setFilter] = useState(filters.filter ?? 'all');
    const { data, setData, post, put, processing, errors, reset } = useForm(EMPTY_FORM);
    const items = events?.data ?? [];

    useEffect(() => {
        setFormOpen(initialShowForm);
        setEditingEvent(initialEditingEvent);
        setSearch(filters.search ?? '');
        setFilter(filters.filter ?? 'all');
        if (initialEditingEvent) {
            setData({
                title: initialEditingEvent.title ?? '',
                description: initialEditingEvent.description ?? '',
                start_date: initialEditingEvent.start_date ?? '',
                end_date: initialEditingEvent.end_date ?? '',
                location: initialEditingEvent.location ?? '',
            });
        } else if (initialShowForm) {
            setData({ ...EMPTY_FORM });
        }
    }, [initialEditingEvent, initialShowForm, filters.filter, filters.search]);

    const openCreate = () => {
        reset();
        setData({ ...EMPTY_FORM });
        setEditingEvent(null);
        setFormOpen(true);
    };

    const openEdit = (event) => {
        setData({
            title: event.title ?? '',
            description: event.description ?? '',
            start_date: event.start_date ?? '',
            end_date: event.end_date ?? '',
            location: event.location ?? '',
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
        const options = { preserveScroll: true, onSuccess: closeForm };
        if (editingEvent) {
            put(route('admin.events.update', editingEvent.id), options);
        } else {
            post(route('admin.events.store'), options);
        }
    };

    const submitFilters = (event) => {
        event.preventDefault();
        router.get(route('admin.events'), { search: search || undefined, filter }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const clearFilters = () => {
        setSearch('');
        setFilter('all');
        router.get(route('admin.events'), {}, { preserveState: true, preserveScroll: true, replace: true });
    };

    const deleteEvent = (event) => {
        if (!window.confirm(`Delete ${event.title}?`)) return;
        router.delete(route('admin.events.delete', event.id), { preserveScroll: true });
    };

    return (
        <AdminLayout activeNavId="events" showGlobalSearch>
            <Head title="Scheduled Events" />
            <div className="mb-6 flex flex-col gap-4 sm:mb-8 xl:flex-row xl:items-end xl:justify-between">
                <div>
                    <h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl">Scheduled Events</h1>
                    <p className="text-sm text-gray-400">Manage event dates, locations, and schedules shown in the calendar.</p>
                </div>
                <div className="flex w-full flex-col gap-2 xl:flex-row xl:w-auto">
                    <form onSubmit={submitFilters} className="grid w-full grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto] xl:w-[620px]">
                        <label htmlFor="event-search" className="sr-only">Search events</label>
                        <div className="relative min-w-0"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" /><input id="event-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search events" className="min-h-[44px] w-full rounded-md border border-neutral-800 bg-[#1a1a1a] py-2.5 pl-9 pr-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" /></div>
                        <AdminFilterSelect value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter events by date"><option value="all">All events</option><option value="upcoming">Upcoming</option><option value="past">Past</option></AdminFilterSelect>
                        <button type="submit" className="min-h-[44px] rounded-md bg-yellow-500 px-4 text-sm font-bold text-black hover:bg-yellow-400">Filter</button>
                        {(search || filter !== 'all') && <button type="button" onClick={clearFilters} className="min-h-[44px] rounded-md border border-neutral-700 px-4 text-sm text-gray-300 hover:border-neutral-500 hover:text-white">Clear</button>}
                    </form>
                    <button type="button" onClick={openCreate} className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-md bg-yellow-500 px-4 py-2.5 text-sm font-bold text-black hover:bg-yellow-400"><Plus className="h-4 w-4" />Add Event</button>
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
                    <div className="w-full max-w-2xl rounded-2xl border border-yellow-500/30 bg-[#0f0f11]/95 backdrop-blur-2xl p-6 shadow-[0_20px_70px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                                    <CalendarDays className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-base font-black text-white">{editingEvent ? 'Edit Event' : 'Add Event'}</h2>
                                    <p className="text-xs text-gray-400">Configure event schedule, venue location, and description</p>
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
                            <div>
                                <label htmlFor="event-title" className="block text-xs font-semibold text-gray-300 mb-1.5">
                                    Title *
                                </label>
                                <input
                                    id="event-title"
                                    type="text"
                                    required
                                    value={data.title}
                                    onChange={(event) => setData('title', event.target.value)}
                                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-white placeholder:text-gray-500 focus:border-yellow-400 focus:outline-none"
                                    placeholder="e.g. MSL Philippines Regional Summit"
                                />
                                {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title}</p>}
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="event-start" className="block text-xs font-semibold text-gray-300 mb-1.5">
                                        Start date and time *
                                    </label>
                                    <input
                                        id="event-start"
                                        type="datetime-local"
                                        required
                                        value={data.start_date}
                                        onChange={(event) => setData('start_date', event.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-white [color-scheme:dark] focus:border-yellow-400 focus:outline-none"
                                    />
                                    {errors.start_date && <p className="mt-1 text-xs text-red-400">{errors.start_date}</p>}
                                </div>
                                <div>
                                    <label htmlFor="event-end" className="block text-xs font-semibold text-gray-300 mb-1.5">
                                        End date and time *
                                    </label>
                                    <input
                                        id="event-end"
                                        type="datetime-local"
                                        required
                                        value={data.end_date}
                                        onChange={(event) => setData('end_date', event.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-white [color-scheme:dark] focus:border-yellow-400 focus:outline-none"
                                    />
                                    {errors.end_date && <p className="mt-1 text-xs text-red-400">{errors.end_date}</p>}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="event-location" className="block text-xs font-semibold text-gray-300 mb-1.5">
                                    Location
                                </label>
                                <input
                                    id="event-location"
                                    type="text"
                                    value={data.location}
                                    onChange={(event) => setData('location', event.target.value)}
                                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-white placeholder:text-gray-500 focus:border-yellow-400 focus:outline-none"
                                    placeholder="Optional location or online link"
                                />
                                {errors.location && <p className="mt-1 text-xs text-red-400">{errors.location}</p>}
                            </div>

                            <div>
                                <label htmlFor="event-description" className="block text-xs font-semibold text-gray-300 mb-1.5">
                                    Description
                                </label>
                                <textarea
                                    id="event-description"
                                    rows="3"
                                    value={data.description}
                                    onChange={(event) => setData('description', event.target.value)}
                                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-white placeholder:text-gray-500 focus:border-yellow-400 focus:outline-none"
                                    placeholder="Optional event details"
                                />
                                {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description}</p>}
                            </div>

                            <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4 mt-6">
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-bold text-gray-300 hover:bg-white/5"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-yellow-400 px-5 py-2.5 text-xs font-bold text-black hover:bg-yellow-300 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(251,191,36,0.2)]"
                                >
                                    <span>{processing ? 'Saving...' : editingEvent ? 'Update Event' : 'Add Event'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            <section className="rounded-xl border border-neutral-800 bg-[#111111] p-4 sm:p-6 md:p-8">
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-yellow-500 sm:text-xl">Scheduled Events</h2>
                    <p className="mt-1 text-sm text-gray-400">{events?.total ?? items.length} event{(events?.total ?? items.length) === 1 ? '' : 's'}</p>
                </div>
                {items.length === 0 ? <div className="py-14 text-center"><CalendarDays className="mx-auto mb-4 h-10 w-10 text-gray-600" /><p className="text-sm text-gray-400">No events found. Add your first event above.</p></div> : <div className="overflow-x-auto"><table className="w-full min-w-[980px] table-auto"><thead><tr className="border-b border-neutral-800 text-left text-xs uppercase tracking-wide text-gray-500"><th className="px-3 pb-4">Event</th><th className="px-3 pb-4">Schedule</th><th className="px-3 pb-4">Location</th><th className="px-3 pb-4">Status</th><th className="px-3 pb-4 text-right">Actions</th></tr></thead><tbody>{items.map((event) => <EventRow key={event.id} event={event} onEdit={openEdit} onDelete={deleteEvent} />)}</tbody></table></div>}
                <Pagination paginator={events} />
            </section>
        </AdminLayout>
    );
}
