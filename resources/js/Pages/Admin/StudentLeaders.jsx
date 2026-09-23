import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowDown, ArrowUp, CalendarDays, CheckCircle2, GraduationCap, Mail, Search, UserRound } from 'lucide-react';
import { useState } from 'react';

function formatDate(value) {
    if (!value) return '—';
    return new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

function Pagination({ paginator, pageName }) {
    if (!paginator?.links || paginator.links.length <= 3) return null;

    return (
        <nav className="mt-6 flex flex-wrap justify-end gap-2" aria-label={`${pageName} pagination`}>
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

function EmptyState({ title, description }) {
    return (
        <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-500/15">
                <GraduationCap className="h-7 w-7 text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm text-gray-400">{description}</p>
        </div>
    );
}

export default function StudentLeaders({ slUsers, students, filters = {} }) {
    const [activeView, setActiveView] = useState('leaders');
    const [search, setSearch] = useState(filters.search ?? '');
    const { post, processing } = useForm();
    const slItems = slUsers?.data ?? [];
    const studentItems = students?.data ?? [];

    const submitSearch = (event) => {
        event.preventDefault();
        router.get(route('admin.sl-management'), { search }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const clearSearch = () => {
        setSearch('');
        router.get(route('admin.sl-management'), {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handlePromote = (id) => {
        if (!window.confirm('Are you sure you want to promote this student to Student Leader?')) return;
        post(route('admin.users.promote-sl', id), { preserveScroll: true });
    };

    const handleDemote = (id) => {
        if (!window.confirm('Are you sure you want to demote this Student Leader to Student?')) return;
        post(route('admin.users.demote-sl', id), { preserveScroll: true });
    };

    const items = activeView === 'leaders' ? slItems : studentItems;

    return (
        <AdminLayout activeNavId="sl-management" showGlobalSearch>
            <Head title="Student Leaders" />

            <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl">Student Leaders</h1>
                    <p className="text-sm text-gray-400">Manage Student Leader assignments and eligible active students.</p>
                </div>
                <form onSubmit={submitSearch} className="flex w-full gap-2 sm:w-auto">
                    <label htmlFor="student-leader-search" className="sr-only">Search Student Leaders</label>
                    <div className="relative flex-1 sm:w-64">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <input
                            id="student-leader-search"
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search users..."
                            className="min-h-[44px] w-full rounded-md border border-neutral-800 bg-[#1a1a1a] py-2.5 pl-10 pr-4 text-base text-white placeholder:text-gray-500 focus:ring-2 focus:ring-yellow-500 focus:outline-none md:text-sm"
                        />
                    </div>
                    <button type="submit" className="min-h-[44px] rounded-md bg-yellow-500 px-4 text-sm font-bold text-black hover:bg-yellow-400">Search</button>
                    {search && <button type="button" onClick={clearSearch} className="min-h-[44px] rounded-md border border-neutral-700 px-4 text-sm text-gray-300 hover:border-neutral-500 hover:text-white">Clear</button>}
                </form>
            </div>

            <section className="rounded-xl border border-neutral-800 bg-[#111111] p-4 sm:p-6 md:p-8">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-yellow-500 sm:text-xl">Student Leader Management</h2>
                        <p className="mt-1 text-sm text-gray-400">{items.length} result{items.length === 1 ? '' : 's'} on this page</p>
                    </div>
                    <div className="flex rounded-lg border border-neutral-800 bg-[#1a1a1a] p-1" role="tablist" aria-label="Student Leader views">
                        <button type="button" role="tab" aria-selected={activeView === 'leaders'} onClick={() => setActiveView('leaders')} className={`min-h-[42px] rounded-md px-3 text-sm font-semibold sm:px-4 ${activeView === 'leaders' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-white'}`}>
                            <span className="inline-flex items-center gap-2"><GraduationCap className="h-4 w-4" />Leaders ({slUsers?.total ?? slItems.length})</span>
                        </button>
                        <button type="button" role="tab" aria-selected={activeView === 'students'} onClick={() => setActiveView('students')} className={`min-h-[42px] rounded-md px-3 text-sm font-semibold sm:px-4 ${activeView === 'students' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                            <span className="inline-flex items-center gap-2"><UserRound className="h-4 w-4" />Students ({students?.total ?? studentItems.length})</span>
                        </button>
                    </div>
                </div>

                {items.length === 0 ? (
                    <EmptyState
                        title={activeView === 'leaders' ? 'No Student Leaders' : 'No eligible students'}
                        description={activeView === 'leaders' ? 'No Student Leaders matched your search.' : 'Only active students can be promoted to Student Leader.'}
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[780px] table-auto">
                            <thead>
                                <tr className="border-b border-neutral-800 text-left text-xs uppercase tracking-wide text-gray-500">
                                    <th className="px-3 pb-4"><span className="inline-flex items-center gap-2"><UserRound className="h-4 w-4" />Name</span></th>
                                    <th className="px-3 pb-4"><span className="inline-flex items-center gap-2"><Mail className="h-4 w-4" />Email</span></th>
                                    <th className="px-3 pb-4">University</th>
                                    <th className="px-3 pb-4">Region</th>
                                    <th className="px-3 pb-4"><span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4" />Registered</span></th>
                                    <th className="px-3 pb-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((user) => (
                                    <tr key={user.id} className="border-b border-neutral-800/60 text-sm text-gray-300 last:border-0">
                                        <td className="px-3 py-4">
                                            <p className="font-medium text-white">{user.name || 'Unnamed user'}</p>
                                            <p className="mt-1 text-xs text-gray-500">ML-ID: {user.ml_id || '—'}</p>
                                        </td>
                                        <td className="px-3 py-4">{user.email || '—'}</td>
                                        <td className="px-3 py-4">{user.university || '—'}</td>
                                        <td className="px-3 py-4">{user.region || '—'}</td>
                                        <td className="px-3 py-4">{formatDate(user.created_at)}</td>
                                        <td className="px-3 py-4 text-right">
                                            {activeView === 'leaders' ? (
                                                <button type="button" onClick={() => handleDemote(user.id)} disabled={processing} className="inline-flex min-h-[40px] items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50">
                                                    <ArrowDown className="h-4 w-4" />Demote
                                                </button>
                                            ) : (
                                                <button type="button" onClick={() => handlePromote(user.id)} disabled={processing} className="inline-flex min-h-[40px] items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50">
                                                    <ArrowUp className="h-4 w-4" />Promote
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <Pagination paginator={activeView === 'leaders' ? slUsers : students} pageName={activeView === 'leaders' ? 'Student Leaders' : 'eligible students'} />
            </section>
        </AdminLayout>
    );
}
