import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { ExternalLink, FileText, Search, ShieldAlert, X } from 'lucide-react';
import { useState } from 'react';

const STATUS_STYLES = {
    Pending: 'bg-yellow-500/10 text-yellow-400',
    Reviewed: 'bg-blue-500/10 text-blue-400',
    Resolved: 'bg-emerald-500/10 text-emerald-400',
    Dismissed: 'bg-neutral-800 text-gray-400',
};

function formatDate(value) {
    if (!value) return '—';
    return new Date(value).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
}

function Pagination({ paginator }) {
    if (!paginator?.links || paginator.links.length <= 3) return null;
    return <nav className="mt-6 flex flex-wrap justify-end gap-2" aria-label="Violation reports pagination">{paginator.links.map((link, index) => <Link key={`${index}-${link.label}`} href={link.url || '#'} dangerouslySetInnerHTML={{ __html: link.label }} className={`min-h-[40px] rounded-md border px-3 py-2 text-sm ${link.active ? 'border-yellow-500 bg-yellow-500 text-black' : 'border-neutral-700 text-gray-300 hover:border-neutral-500'} ${!link.url ? 'pointer-events-none opacity-40' : ''}`} />)}</nav>;
}

function StatusBadge({ status }) {
    return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[status] ?? STATUS_STYLES.Pending}`}>{status}</span>;
}

function ReportDetails({ report, onClose }) {
    if (!report) return null;
    return <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-labelledby="report-details-title"><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-neutral-700 bg-[#151515] p-5 shadow-2xl sm:p-7"><div className="mb-6 flex items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-wide text-yellow-500">Report #{report.id}</p><h2 id="report-details-title" className="mt-1 text-xl font-bold text-white">Report details</h2></div><button type="button" onClick={onClose} className="flex min-h-10 min-w-10 items-center justify-center rounded-md border border-neutral-700 text-gray-400 hover:text-white" aria-label="Close report details"><X className="h-5 w-5" /></button></div><dl className="grid grid-cols-1 gap-5 text-sm sm:grid-cols-2"><div><dt className="text-gray-500">Reporter</dt><dd className="mt-1 text-white">{report.is_anonymous ? 'Anonymous' : report.name || 'Unnamed reporter'}</dd></div><div><dt className="text-gray-500">School / organization</dt><dd className="mt-1 text-white">{report.is_anonymous ? 'Hidden' : report.school || '—'}</dd></div><div><dt className="text-gray-500">Incident type</dt><dd className="mt-1 text-white">{report.incident_type}</dd></div><div><dt className="text-gray-500">Submitted</dt><dd className="mt-1 text-white">{formatDate(report.created_at)}</dd></div><div className="sm:col-span-2"><dt className="text-gray-500">Current status</dt><dd className="mt-2"><StatusBadge status={report.status} /></dd></div><div className="sm:col-span-2"><dt className="text-gray-500">Description</dt><dd className="mt-2 whitespace-pre-wrap rounded-md border border-neutral-800 bg-[#1a1a1a] p-4 leading-relaxed text-gray-300">{report.description}</dd></div><div className="sm:col-span-2"><dt className="text-gray-500">Evidence</dt><dd className="mt-2">{report.evidence_url ? <a href={report.evidence_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 break-all text-blue-400 hover:underline">{report.evidence_url}<ExternalLink className="h-4 w-4 shrink-0" /></a> : report.evidence ? <span className="break-all text-gray-300">{report.evidence}</span> : <span className="text-gray-500">No evidence provided.</span>}</dd></div></dl></div></div>;
}

export default function ViolationReports({ reports, filters = {}, statuses = [] }) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? 'all');
    const [selectedReport, setSelectedReport] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);
    const items = reports?.data ?? [];

    const submitFilters = (event) => {
        event.preventDefault();
        router.get(route('admin.violation-reports.index'), { search: search || undefined, status: status === 'all' ? undefined : status }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const clearFilters = () => {
        setSearch('');
        setStatus('all');
        router.get(route('admin.violation-reports.index'), {}, { preserveState: true, preserveScroll: true, replace: true });
    };

    const updateStatus = (report, nextStatus) => {
        if (nextStatus === report.status || !window.confirm(`Mark report #${report.id} as ${nextStatus}?`)) return;
        setUpdatingId(report.id);
        router.put(route('admin.violation-reports.update', report.id), { status: nextStatus }, { preserveScroll: true, onFinish: () => setUpdatingId(null) });
    };

    return <AdminLayout activeNavId="violations" showGlobalSearch><Head title="Violation Reports" /><div className="mb-6 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-end lg:justify-between"><div><h1 className="mb-2 flex items-center gap-3 text-2xl font-bold text-white sm:text-3xl"><ShieldAlert className="h-7 w-7 text-red-400" />Violation Reports</h1><p className="text-sm text-gray-400">Review and track Safe Spaces reports submitted to MSL.</p></div><form onSubmit={submitFilters} className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto"><label htmlFor="violation-search" className="sr-only">Search violation reports</label><div className="relative flex-1 sm:w-64"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" /><input id="violation-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search reports" className="min-h-[42px] w-full rounded-md border border-neutral-800 bg-[#1a1a1a] pl-9 pr-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" /></div><select value={status} onChange={(event) => setStatus(event.target.value)} className="min-h-[42px] rounded-md border border-neutral-800 bg-[#1a1a1a] px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"><option value="all">All statuses</option>{statuses.map((item) => <option key={item} value={item}>{item}</option>)}</select><button type="submit" className="min-h-[42px] rounded-md bg-yellow-500 px-4 text-sm font-bold text-black hover:bg-yellow-400">Search</button>{(search || status !== 'all') && <button type="button" onClick={clearFilters} className="min-h-[42px] rounded-md border border-neutral-700 px-4 text-sm text-gray-300 hover:border-neutral-500 hover:text-white">Clear</button>}</form></div>
        <section className="rounded-xl border border-neutral-800 bg-[#111111] p-4 sm:p-6 md:p-8"><div className="mb-6 flex items-center justify-between"><div><h2 className="text-lg font-bold text-yellow-500 sm:text-xl">Submitted reports</h2><p className="mt-1 text-sm text-gray-400">{reports?.total ?? items.length} report{(reports?.total ?? items.length) === 1 ? '' : 's'}</p></div><FileText className="h-7 w-7 text-yellow-500" /></div>{items.length === 0 ? <div className="py-14 text-center"><ShieldAlert className="mx-auto mb-4 h-10 w-10 text-gray-600" /><p className="text-sm text-gray-400">No violation reports found.</p></div> : <div className="overflow-x-auto"><table className="w-full min-w-[1050px] table-auto"><thead><tr className="border-b border-neutral-800 text-left text-xs uppercase tracking-wide text-gray-500"><th className="px-3 pb-4">Date</th><th className="px-3 pb-4">Reporter</th><th className="px-3 pb-4">Incident type</th><th className="px-3 pb-4">Description</th><th className="px-3 pb-4">Evidence</th><th className="px-3 pb-4">Status</th><th className="px-3 pb-4 text-right">Action</th></tr></thead><tbody>{items.map((report) => <tr key={report.id} className="border-b border-neutral-800/60 text-sm text-gray-300 last:border-0"><td className="whitespace-nowrap px-3 py-4 text-xs text-gray-400">{formatDate(report.created_at)}</td><td className="px-3 py-4">{report.is_anonymous ? <span className="rounded-full bg-neutral-800 px-2.5 py-1 text-xs text-gray-300">Anonymous</span> : <><p className="font-medium text-white">{report.name || 'Unnamed reporter'}</p><p className="mt-1 text-xs text-gray-500">{report.school || '—'}</p></>}</td><td className="px-3 py-4 text-white">{report.incident_type}</td><td className="max-w-xs px-3 py-4"><p className="truncate" title={report.description}>{report.description}</p><button type="button" onClick={() => setSelectedReport(report)} className="mt-2 text-xs text-blue-400 hover:underline">View details</button></td><td className="px-3 py-4">{report.evidence_url ? <a href={report.evidence_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-400 hover:underline">View <ExternalLink className="h-3.5 w-3.5" /></a> : report.evidence ? <span className="text-xs text-gray-400">Provided</span> : <span className="text-gray-600">None</span>}</td><td className="px-3 py-4"><StatusBadge status={report.status} /></td><td className="px-3 py-4 text-right"><select value={report.status} disabled={updatingId === report.id} onChange={(event) => updateStatus(report, event.target.value)} className="min-h-10 rounded-md border border-neutral-700 bg-[#1a1a1a] px-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" aria-label={`Update status for report ${report.id}`}>{statuses.map((item) => <option key={item} value={item}>{item}</option>)}</select></td></tr>)}</tbody></table></div>}<Pagination paginator={reports} /></section><ReportDetails report={selectedReport} onClose={() => setSelectedReport(null)} />
    </AdminLayout>;
}
