import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { Check, Copy, ExternalLink, Link2, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';

const FIELD_CLASS = 'min-h-[44px] w-full rounded-md border border-neutral-800 bg-[#1a1a1a] px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-yellow-500';
const ERROR_CLASS = 'mt-1 text-sm text-red-400';
const EMPTY_FORM = { code: '', original_url: '' };

function ShareLinkForm({ editingLink, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm(editingLink ? { code: editingLink.code, original_url: editingLink.original_url } : EMPTY_FORM);

    const submit = (event) => {
        event.preventDefault();
        const options = { preserveScroll: true, onSuccess: () => { reset(); onClose(); } };
        if (editingLink) {
            post(route('admin.share-links.update', editingLink.id), { ...data, _method: 'PUT' }, options);
        } else {
            post(route('admin.share-links.store'), data, options);
        }
    };

    return (
        <section className="mb-8 rounded-xl border border-neutral-800 bg-[#111111] p-4 sm:p-6">
            <div className="mb-6 flex items-center justify-between gap-4"><div><h2 className="text-lg font-bold text-yellow-500">{editingLink ? 'Edit share link' : 'Create share link'}</h2><p className="mt-1 text-sm text-gray-400">Use a short code to share a long destination URL.</p></div><button type="button" onClick={onClose} className="flex min-h-10 min-w-10 items-center justify-center rounded-md border border-neutral-700 text-gray-400 hover:text-white" aria-label="Close share link form"><X className="h-4 w-4" /></button></div>
            <form onSubmit={submit} className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_2fr_auto] md:items-end">
                <div><label htmlFor="short-link-code" className="mb-2 block text-sm font-medium text-gray-300">Short code {editingLink ? '' : <span className="font-normal text-gray-500">(optional)</span>}</label><input id="short-link-code" type="text" value={data.code} onChange={(event) => setData('code', event.target.value)} className={FIELD_CLASS} placeholder={editingLink ? 'my-event' : 'Auto-generate'} />{errors.code && <p className={ERROR_CLASS}>{errors.code}</p>}</div>
                <div><label htmlFor="short-link-destination" className="mb-2 block text-sm font-medium text-gray-300">Destination URL</label><input id="short-link-destination" type="text" value={data.original_url} onChange={(event) => setData('original_url', event.target.value)} className={FIELD_CLASS} placeholder="https://example.com/page" />{errors.original_url && <p className={ERROR_CLASS}>{errors.original_url}</p>}</div>
                <div className="flex gap-2"><button type="submit" disabled={processing} className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-md bg-yellow-500 px-4 text-sm font-bold text-black hover:bg-yellow-400 disabled:opacity-50"><Check className="h-4 w-4" />{processing ? 'Saving...' : editingLink ? 'Update' : 'Create'}</button><button type="button" onClick={onClose} className="min-h-[44px] rounded-md border border-neutral-700 px-4 text-sm text-gray-300 hover:text-white">Cancel</button></div>
            </form>
        </section>
    );
}

function LinkRow({ link, onEdit, onDelete }) {
    const [copied, setCopied] = useState(false);
    const copy = async () => {
        try {
            await navigator.clipboard.writeText(link.short_url);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
        } catch {
            setCopied(false);
        }
    };

    return <article className="rounded-xl border border-neutral-800 bg-[#1a1a1a] p-4 sm:p-5"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="rounded-md bg-yellow-500/10 px-2.5 py-1 font-mono text-sm font-semibold text-yellow-400">/s/{link.code}</span><span className="text-xs text-gray-500">{link.clicks} click{link.clicks === 1 ? '' : 's'}</span></div><p className="mt-3 break-all text-sm text-gray-300">{link.original_url}</p><p className="mt-1 text-xs text-gray-500">Created {link.created_at ? new Date(link.created_at).toLocaleDateString() : '—'}</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={copy} className="inline-flex min-h-10 items-center gap-1.5 rounded-md border border-neutral-700 px-3 text-sm text-gray-300 hover:border-yellow-500 hover:text-yellow-400">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? 'Copied' : 'Copy'}</button><a href={link.short_url} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-1.5 rounded-md border border-neutral-700 px-3 text-sm text-gray-300 hover:border-yellow-500 hover:text-yellow-400"><ExternalLink className="h-4 w-4" />Open</a><button type="button" onClick={() => onEdit(link)} className="inline-flex min-h-10 items-center gap-1.5 rounded-md border border-neutral-700 px-3 text-sm text-blue-400 hover:border-blue-400"><Pencil className="h-4 w-4" />Edit</button><button type="button" onClick={() => onDelete(link)} className="inline-flex min-h-10 items-center gap-1.5 rounded-md border border-red-900 px-3 text-sm text-red-400 hover:bg-red-950"><Trash2 className="h-4 w-4" />Delete</button></div></div></article>;
}

export default function Index({ shortLinks: initialShortLinks = [] }) {
    const [shortLinks, setShortLinks] = useState(initialShortLinks);
    const [search, setSearch] = useState('');
    const [formOpen, setFormOpen] = useState(false);
    const [editingLink, setEditingLink] = useState(null);

    const filteredLinks = useMemo(() => {
        const value = search.trim().toLowerCase();
        if (!value) return shortLinks;
        return shortLinks.filter((link) => link.code.toLowerCase().includes(value) || link.original_url.toLowerCase().includes(value));
    }, [search, shortLinks]);

    const openCreate = () => { setEditingLink(null); setFormOpen(true); };
    const openEdit = (link) => { setEditingLink(link); setFormOpen(true); };
    const closeForm = () => { setEditingLink(null); setFormOpen(false); };
    const remove = (link) => {
        if (!window.confirm(`Delete /s/${link.code}?`)) return;
        setShortLinks((items) => items.filter((item) => item.id !== link.id));
        router.delete(route('admin.share-links.destroy', link.id), { preserveScroll: true });
    };

    const totalClicks = shortLinks.reduce((total, link) => total + Number(link.clicks || 0), 0);

    return <AdminLayout activeNavId="share-links" showGlobalSearch>
        <Head title="Share Links" />
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-2xl font-bold text-white sm:text-3xl">Share Links</h1><p className="mt-2 text-sm text-gray-400">Create and manage trackable short URLs.</p></div><button type="button" onClick={openCreate} className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-yellow-500 px-4 py-2.5 text-sm font-bold text-black hover:bg-yellow-400"><Plus className="h-4 w-4" />Create Share Link</button></div>
        {formOpen && <ShareLinkForm editingLink={editingLink} onClose={closeForm} />}
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2"><div className="rounded-xl border border-neutral-800 bg-[#111111] p-5"><p className="text-sm text-gray-400">Total links</p><p className="mt-2 text-3xl font-bold text-white">{shortLinks.length}</p></div><div className="rounded-xl border border-neutral-800 bg-[#111111] p-5"><p className="text-sm text-gray-400">Total clicks</p><p className="mt-2 text-3xl font-bold text-yellow-400">{totalClicks}</p></div></section>
        <section className="rounded-xl border border-neutral-800 bg-[#111111] p-4 sm:p-6 md:p-8"><div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-lg font-bold text-yellow-500 sm:text-xl">All share links</h2><p className="mt-1 text-sm text-gray-400">{filteredLinks.length} of {shortLinks.length} link{shortLinks.length === 1 ? '' : 's'}</p></div><div className="relative w-full sm:w-80"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" /><label htmlFor="share-link-search" className="sr-only">Search share links</label><input id="share-link-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} className={`${FIELD_CLASS} pl-9`} placeholder="Search code or destination" /></div></div>{filteredLinks.length === 0 ? <div className="py-14 text-center"><Link2 className="mx-auto mb-4 h-10 w-10 text-gray-600" /><p className="text-sm text-gray-400">{search ? 'No matching share links found.' : 'No share links created yet.'}</p><p className="mt-1 text-xs text-gray-600">{search ? 'Try another code or destination.' : 'Create a short link to get started.'}</p></div> : <div className="space-y-3">{filteredLinks.map((link) => <LinkRow key={link.id} link={link} onEdit={openEdit} onDelete={remove} />)}</div>}</section>
    </AdminLayout>;
}
