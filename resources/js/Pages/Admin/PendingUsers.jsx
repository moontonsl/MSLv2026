import AdminPageSkeleton from '@/Components/Admin/AdminPageSkeleton';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Check, Search, UserRound, Mail, CalendarDays, LoaderCircle } from 'lucide-react';
import { useState } from 'react';

function formatDate(value) {
    if (!value) return '—';
    return new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function statusLabel(user) {
    if (user.status === 'pending-review') return 'Renewal review';
    if (user.status === 'pending') return 'Pending';
    return 'Email verification';
}

export default function PendingUsers({ users, filters = {} }) {
    const [search, setSearch] = useState(filters.search ?? '');
    const { post, processing } = useForm();
    const items = users?.data ?? [];

    const submitSearch = (event) => {
        event.preventDefault();
        router.get(route('admin.users.pending'), { search }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const clearSearch = () => {
        setSearch('');
        router.get(route('admin.users.pending'), {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleVerify = (userId) => {
        post(route('admin.users.verify', userId), { preserveScroll: true });
    };

    return (
        <AdminLayout activeNavId="pending-users" showGlobalSearch>
            <Head title="Pending Users" />

            <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl">Pending Users</h1>
                    <p className="text-sm text-gray-400">Accounts awaiting email or initial verification.</p>
                </div>
                <form onSubmit={submitSearch} className="flex w-full gap-2 sm:w-auto">
                    <label htmlFor="pending-users-search" className="sr-only">Search pending users</label>
                    <div className="relative flex-1 sm:w-64">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <input
                            id="pending-users-search"
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search users..."
                            className="min-h-[44px] w-full rounded-md border border-neutral-800 bg-[#1a1a1a] py-2.5 pl-10 pr-4 text-base text-white placeholder:text-gray-500 focus:ring-2 focus:ring-yellow-500 focus:outline-none md:text-sm"
                        />
                    </div>
                    <button type="submit" className="min-h-[44px] rounded-md bg-yellow-500 px-4 text-sm font-bold text-black hover:bg-yellow-400">
                        Search
                    </button>
                    {search && (
                        <button type="button" onClick={clearSearch} className="min-h-[44px] rounded-md border border-neutral-700 px-4 text-sm text-gray-300 hover:border-neutral-500 hover:text-white">
                            Clear
                        </button>
                    )}
                </form>
            </div>

            <section className="rounded-xl border border-neutral-800 bg-[#111111] p-4 sm:p-6 md:p-8">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-yellow-500 sm:text-xl">Verification Queue</h2>
                        <p className="mt-1 text-sm text-gray-400">
                            {users?.total ?? items.length} account{(users?.total ?? items.length) === 1 ? '' : 's'} awaiting action
                        </p>
                    </div>
                    <UserRound className="h-7 w-7 text-yellow-500" aria-hidden="true" />
                </div>

                {items.length === 0 ? (
                    <div className="py-14 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
                            <Check className="h-8 w-8 text-emerald-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">All users verified</h3>
                        <p className="mt-2 text-sm text-gray-400">There are no pending accounts matching your search.</p>
                    </div>
                ) : (
                    <>
                        <div className="hidden overflow-x-auto md:block">
                            <table className="w-full min-w-[760px] table-auto">
                                <thead>
                                    <tr className="border-b border-neutral-800 text-left text-xs uppercase tracking-wide text-gray-500">
                                        <th className="px-3 pb-4"><span className="inline-flex items-center gap-2"><UserRound className="h-4 w-4" />Name</span></th>
                                        <th className="px-3 pb-4"><span className="inline-flex items-center gap-2"><Mail className="h-4 w-4" />Email</span></th>
                                        <th className="px-3 pb-4"><span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4" />Registered</span></th>
                                        <th className="px-3 pb-4">Status</th>
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
                                            <td className="px-3 py-4">{formatDate(user.created_at)}</td>
                                            <td className="px-3 py-4"><span className="rounded-full bg-yellow-500/10 px-2.5 py-1 text-xs text-yellow-400">{statusLabel(user)}</span></td>
                                            <td className="px-3 py-4 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => handleVerify(user.id)}
                                                    disabled={processing}
                                                    className="inline-flex min-h-[40px] items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    {processing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                                    Verify Email
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="space-y-3 md:hidden">
                            {items.map((user) => (
                                <article key={user.id} className="rounded-lg border border-neutral-800 bg-[#1a1a1a] p-4">
                                    <div className="mb-3 flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="font-semibold text-white">{user.name || 'Unnamed user'}</h3>
                                            <p className="mt-1 text-xs text-gray-500">ML-ID: {user.ml_id || '—'}</p>
                                        </div>
                                        <span className="rounded-full bg-yellow-500/10 px-2.5 py-1 text-xs text-yellow-400">{statusLabel(user)}</span>
                                    </div>
                                    <p className="break-all text-sm text-gray-300">{user.email || '—'}</p>
                                    <p className="mt-2 text-xs text-gray-500">Registered {formatDate(user.created_at)}</p>
                                    <button
                                        type="button"
                                        onClick={() => handleVerify(user.id)}
                                        disabled={processing}
                                        className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {processing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                        Verify Email
                                    </button>
                                </article>
                            ))}
                        </div>
                    </>
                )}

                {users?.links?.length > 3 && (
                    <nav className="mt-6 flex flex-wrap justify-end gap-2" aria-label="Pending users pagination">
                        {users.links.map((link, index) => (
                            <Link
                                key={`${index}-${link.label}`}
                                href={link.url || '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`min-h-[40px] rounded-md border px-3 py-2 text-sm ${link.active ? 'border-yellow-500 bg-yellow-500 text-black' : 'border-neutral-700 text-gray-300 hover:border-neutral-500'} ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                            />
                        ))}
                    </nav>
                )}
            </section>
        </AdminLayout>
    );
}
