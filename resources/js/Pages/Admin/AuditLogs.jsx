import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { ClipboardList, Search } from 'lucide-react';
import { useState } from 'react';

function formatDate(value) {
    if (!value) return '—';
    return new Date(value).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
}

function statusClass(status) {
    if (status >= 200 && status < 300) return 'bg-emerald-500/10 text-emerald-400';
    if (status >= 400) return 'bg-red-500/10 text-red-400';
    return 'bg-yellow-500/10 text-yellow-400';
}

function Pagination({ paginator }) {
    if (!paginator?.links || paginator.links.length <= 3) return null;
    return <nav className="mt-6 flex flex-wrap justify-end gap-2" aria-label="Audit log pagination">{paginator.links.map((link, index) => <Link key={`${index}-${link.label}`} href={link.url || '#'} dangerouslySetInnerHTML={{ __html: link.label }} className={`min-h-[40px] rounded-md border px-3 py-2 text-sm ${link.active ? 'border-yellow-500 bg-yellow-500 text-black' : 'border-neutral-700 text-gray-300 hover:border-neutral-500'} ${!link.url ? 'pointer-events-none opacity-40' : ''}`} />)}</nav>;
}

export default function AuditLogs({ logs, actions = [], admins = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [routeName, setRouteName] = useState(filters.route_name ?? '');
    const [adminId, setAdminId] = useState(filters.admin_id ?? '');
    const [from, setFrom] = useState(filters.from ?? '');
    const [to, setTo] = useState(filters.to ?? '');
    const items = logs?.data ?? [];

    const submitFilters = (event) => {
        event.preventDefault();
        router.get(route('admin.audit-logs.index'), {
            search: search || undefined,
            route_name: routeName || undefined,
            admin_id: adminId || undefined,
            from: from || undefined,
            to: to || undefined,
        }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const clearFilters = () => {
        setSearch('');
        setRouteName('');
        setAdminId('');
        setFrom('');
        setTo('');
        router.get(route('admin.audit-logs.index'), {}, { preserveState: true, preserveScroll: true, replace: true });
    };

    const hasFilters = search || routeName || adminId || from || to;

    return <AdminLayout activeNavId="audit-logs" showGlobalSearch>
        <Head title="Audit Logs" />
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-end lg:justify-between">
            <div><h1 className="flex items-center gap-3 text-2xl font-bold text-white sm:text-3xl"><ClipboardList className="h-7 w-7 text-yellow-500" />Audit Logs</h1><p className="mt-2 text-sm text-gray-400">Review administrator actions without exposing sensitive form payloads.</p></div>
            <form onSubmit={submitFilters} className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:w-auto lg:grid-cols-3">
                <label htmlFor="audit-search" className="sr-only">Search audit logs</label>
                <div className="relative sm:col-span-2 lg:col-span-1"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" /><input id="audit-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search admin or action" className="min-h-[42px] w-full rounded-md border border-neutral-800 bg-[#1a1a1a] pl-9 pr-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" /></div>
                <select value={routeName} onChange={(event) => setRouteName(event.target.value)} className="min-h-[42px] rounded-md border border-neutral-800 bg-[#1a1a1a] px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"><option value="">All actions</option>{actions.map((action) => <option key={action} value={action}>{action}</option>)}</select>
                <select value={adminId} onChange={(event) => setAdminId(event.target.value)} className="min-h-[42px] rounded-md border border-neutral-800 bg-[#1a1a1a] px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"><option value="">All administrators</option>{admins.map((admin) => <option key={admin.id} value={admin.id}>{admin.name}</option>)}</select>
                <input aria-label="From date" type="date" value={from} onChange={(event) => setFrom(event.target.value)} className="min-h-[42px] rounded-md border border-neutral-800 bg-[#1a1a1a] px-3 text-sm text-white [color-scheme:dark] focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                <input aria-label="To date" type="date" value={to} onChange={(event) => setTo(event.target.value)} className="min-h-[42px] rounded-md border border-neutral-800 bg-[#1a1a1a] px-3 text-sm text-white [color-scheme:dark] focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                <div className="flex gap-2"><button type="submit" className="min-h-[42px] flex-1 rounded-md bg-yellow-500 px-4 text-sm font-bold text-black hover:bg-yellow-400">Filter</button>{hasFilters && <button type="button" onClick={clearFilters} className="min-h-[42px] rounded-md border border-neutral-700 px-4 text-sm text-gray-300 hover:border-neutral-500 hover:text-white">Clear</button>}</div>
            </form>
        </div>

        <section className="rounded-xl border border-neutral-800 bg-[#111111] p-4 sm:p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between gap-4"><div><h2 className="text-lg font-bold text-yellow-500 sm:text-xl">Administrator activity</h2><p className="mt-1 text-sm text-gray-400">{logs?.total ?? items.length} recorded action{(logs?.total ?? items.length) === 1 ? '' : 's'}</p></div><ClipboardList className="h-7 w-7 text-yellow-500" /></div>
            {items.length === 0 ? <div className="py-14 text-center"><ClipboardList className="mx-auto mb-4 h-10 w-10 text-gray-600" /><p className="text-sm text-gray-400">No audit logs found.</p></div> : <div className="overflow-x-auto"><table className="w-full min-w-[980px] table-auto"><thead><tr className="border-b border-neutral-800 text-left text-xs uppercase tracking-wide text-gray-500"><th className="px-3 pb-4">Date</th><th className="px-3 pb-4">Administrator</th><th className="px-3 pb-4">Action</th><th className="px-3 pb-4">Target</th><th className="px-3 pb-4">Result</th><th className="px-3 pb-4">IP address</th></tr></thead><tbody>{items.map((log) => <tr key={log.id} className="border-b border-neutral-800/60 text-sm text-gray-300 last:border-0"><td className="whitespace-nowrap px-3 py-4 text-xs text-gray-400">{formatDate(log.created_at)}</td><td className="px-3 py-4"><p className="font-medium text-white">{log.admin?.name || 'Deleted admin'}</p><p className="mt-1 text-xs text-gray-500">{log.admin?.email || '—'}</p></td><td className="px-3 py-4"><p className="font-medium text-white">{log.action}</p><p className="mt-1 text-xs text-gray-500">{log.method} · {log.module} · {log.route_name}</p></td><td className="px-3 py-4 text-gray-400">{log.target_type ? `${log.target_type} #${log.target_id}` : '—'}</td><td className="px-3 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(log.status_code)}`}>{log.status_code ?? '—'}</span></td><td className="px-3 py-4 text-xs text-gray-500">{log.ip_address || '—'}</td></tr>)}</tbody></table></div>}
            <Pagination paginator={logs} />
        </section>
    </AdminLayout>;
}
