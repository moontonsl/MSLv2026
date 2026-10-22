import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ExternalLink, KeyRound, Plus, Search, Shield, ShieldCheck, Trash2, UserPlus, X } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function Index({ adminUsers = [], roles = [], roleOptions = [] }) {
    const [search, setSearch] = useState('');
    const [formOpen, setFormOpen] = useState(false);

    const availableRoleNames = useMemo(() => {
        if (roleOptions && roleOptions.length > 0) return roleOptions;
        if (roles && roles.length > 0) return roles.map((r) => r.name);
        return ['Admin', 'Content Manager', 'Tournament Manager', 'Regional Admin', 'Event Manager'];
    }, [roles, roleOptions]);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: availableRoleNames[0] ?? 'Admin',
    });

    const submit = (event) => {
        event.preventDefault();
        post(route('admin.accounts.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setFormOpen(false);
            },
        });
    };

    const filteredUsers = useMemo(() => {
        const value = search.trim().toLowerCase();
        if (!value) return adminUsers;
        return adminUsers.filter((admin) =>
            [admin.name, admin.email, admin.role].some((field) => field?.toLowerCase().includes(value))
        );
    }, [adminUsers, search]);

    const closeForm = () => {
        reset();
        setFormOpen(false);
    };

    const remove = (admin) => {
        if (admin.is_super_admin) return;
        if (!window.confirm(`Delete admin account ${admin.email}?`)) return;
        router.delete(route('admin.accounts.destroy', admin.id), { preserveScroll: true });
    };

    const selectedRoleMeta = roles.find((r) => r.name === data.role);

    return (
        <AdminLayout activeNavId="accounts" showGlobalSearch>
            <Head title="Administrator Accounts" />
            
            <div className="mb-6 flex flex-col gap-4 sm:mb-8 xl:flex-row xl:items-end xl:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white sm:text-3xl">Administrator Accounts</h1>
                    <p className="mt-2 text-sm leading-6 text-gray-400">
                        Create staff accounts and assign them configured roles to inherit permissions instantly.
                    </p>
                </div>
                
                <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
                    <Link
                        href={route('admin.management')}
                        className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border border-neutral-700 bg-neutral-800/80 px-4 py-2.5 text-sm font-semibold text-gray-300 hover:border-yellow-500 hover:text-white transition-colors"
                    >
                        <Shield className="h-4 w-4 text-yellow-400" />
                        <span>Manage Roles &amp; Permissions</span>
                        <ExternalLink className="h-3.5 w-3.5 text-gray-500" />
                    </Link>

                    <label className="relative block min-w-0 flex-1 sm:w-64 sm:flex-none">
                        <span className="sr-only">Search admin accounts</span>
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <input
                            id="admin-search"
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className="min-h-[44px] w-full rounded-md border border-neutral-800 bg-[#1a1a1a] py-2.5 pl-9 pr-4 text-sm text-white outline-none focus:ring-2 focus:ring-yellow-500"
                            placeholder="Search name, email, or role"
                        />
                    </label>

                    <button
                        type="button"
                        onClick={() => setFormOpen(true)}
                        className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-md bg-yellow-500 px-4 py-2.5 text-sm font-bold text-black hover:bg-yellow-400"
                    >
                        <UserPlus className="h-4 w-4" />
                        Create Admin
                    </button>
                </div>
            </div>

            {formOpen && (
                <section className="mb-8 rounded-xl border border-neutral-800 bg-[#111111] p-4 sm:p-6">
                    <div className="mb-6 flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-yellow-500">Create Admin Account</h2>
                            <p className="mt-1 text-sm text-gray-400">
                                Select an assigned role. The account automatically inherits all permissions of that role.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={closeForm}
                            className="flex min-h-10 min-w-10 items-center justify-center rounded-md border border-neutral-700 text-gray-400 hover:text-white"
                            aria-label="Close create admin form"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <form onSubmit={submit} className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                            <label htmlFor="admin-name" className="mb-2 block text-sm font-medium text-gray-300">
                                Full name
                            </label>
                            <input
                                id="admin-name"
                                type="text"
                                required
                                value={data.name}
                                onChange={(event) => setData('name', event.target.value)}
                                className="min-h-[44px] w-full rounded-md border border-neutral-800 bg-[#1a1a1a] px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-yellow-500"
                                placeholder="Jane Doe"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="admin-email" className="mb-2 block text-sm font-medium text-gray-300">
                                Email
                            </label>
                            <input
                                id="admin-email"
                                type="email"
                                required
                                value={data.email}
                                onChange={(event) => setData('email', event.target.value)}
                                className="min-h-[44px] w-full rounded-md border border-neutral-800 bg-[#1a1a1a] px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-yellow-500"
                                placeholder="admin@example.com"
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="admin-role" className="mb-2 block text-sm font-medium text-gray-300">
                                Assigned Role
                            </label>
                            <select
                                id="admin-role"
                                value={data.role}
                                onChange={(event) => setData('role', event.target.value)}
                                className="min-h-[44px] w-full rounded-md border border-neutral-800 bg-[#1a1a1a] px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-yellow-500"
                            >
                                {availableRoleNames.map((r) => (
                                    <option key={r} value={r}>
                                        {r}
                                    </option>
                                ))}
                            </select>
                            <p className="mt-1.5 text-xs text-amber-400/90">
                                ✓ Inherits {selectedRoleMeta?.permissions_count ?? 'configured'} capabilities from the {data.role} role.
                            </p>
                            {errors.role && <p className="mt-1 text-sm text-red-400">{errors.role}</p>}
                        </div>

                        <div>
                            <label htmlFor="admin-password" className="mb-2 block text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <input
                                id="admin-password"
                                type="password"
                                required
                                minLength={8}
                                value={data.password}
                                onChange={(event) => setData('password', event.target.value)}
                                className="min-h-[44px] w-full rounded-md border border-neutral-800 bg-[#1a1a1a] px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-yellow-500"
                                placeholder="At least 8 characters"
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
                        </div>

                        <div>
                            <label htmlFor="admin-password-confirmation" className="mb-2 block text-sm font-medium text-gray-300">
                                Confirm password
                            </label>
                            <input
                                id="admin-password-confirmation"
                                type="password"
                                required
                                minLength={8}
                                value={data.password_confirmation}
                                onChange={(event) => setData('password_confirmation', event.target.value)}
                                className="min-h-[44px] w-full rounded-md border border-neutral-800 bg-[#1a1a1a] px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-yellow-500"
                                placeholder="Repeat password"
                            />
                            {errors.password_confirmation && (
                                <p className="mt-1 text-sm text-red-400">{errors.password_confirmation}</p>
                            )}
                        </div>

                        <div className="md:col-span-2 flex flex-wrap items-center justify-end gap-3 border-t border-neutral-800 pt-5">
                            <button
                                type="button"
                                onClick={closeForm}
                                className="min-h-[44px] rounded-md border border-neutral-700 px-4 text-sm text-gray-300 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-yellow-500 px-5 py-2.5 text-sm font-bold text-black hover:bg-yellow-400 disabled:opacity-50"
                            >
                                <Plus className="h-4 w-4" />
                                {processing ? 'Creating...' : 'Create Account'}
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <section className="rounded-xl border border-neutral-800 bg-[#111111] p-4 sm:p-6 md:p-8">
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-yellow-500 sm:text-xl">Administrator list</h2>
                    <p className="mt-1 text-sm text-gray-400">
                        {filteredUsers.length} of {adminUsers.length} account{adminUsers.length === 1 ? '' : 's'}
                    </p>
                </div>

                {filteredUsers.length === 0 ? (
                    <div className="py-14 text-center">
                        <ShieldCheck className="mx-auto mb-4 h-10 w-10 text-gray-600" />
                        <p className="text-sm text-gray-400">
                            {search ? 'No matching admin accounts found.' : 'No admin accounts found.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="border-b border-neutral-800 text-xs uppercase tracking-wide text-gray-500">
                                <tr>
                                    <th className="px-4 py-3">Administrator</th>
                                    <th className="px-4 py-3">Role</th>
                                    <th className="px-4 py-3">Effective Access</th>
                                    <th className="px-4 py-3">Created</th>
                                    <th className="px-4 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((admin) => (
                                    <tr key={admin.id} className="border-b border-neutral-800/70 last:border-0">
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-500/10 font-bold text-yellow-400">
                                                    {admin.name?.charAt(0)?.toUpperCase() || '?'}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="truncate font-semibold text-white">{admin.name}</p>
                                                    <p className="truncate text-xs text-gray-500">{admin.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                    admin.is_super_admin
                                                        ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                }`}
                                            >
                                                {admin.is_super_admin ? 'Super Admin' : admin.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-gray-300">
                                            {admin.is_super_admin ? (
                                                <span className="text-amber-400 font-semibold">Full access (Root)</span>
                                            ) : (
                                                <span>
                                                    <strong className="text-white">
                                                        {admin.effective_permissions_count ?? admin.permissions_count}
                                                    </strong>{' '}
                                                    capabilities inherited
                                                </span>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4 text-gray-500">
                                            {admin.created_at
                                                ? new Date(admin.created_at).toLocaleDateString(undefined, {
                                                      year: 'numeric',
                                                      month: 'short',
                                                      day: 'numeric',
                                                  })
                                                : '—'}
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            {admin.is_super_admin ? (
                                                <span className="inline-flex items-center gap-1.5 text-xs italic text-gray-500">
                                                    <KeyRound className="h-3.5 w-3.5" />
                                                    Protected
                                                </span>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => remove(admin)}
                                                    className="inline-flex min-h-10 items-center gap-1.5 rounded-md border border-red-900 px-3 text-sm text-red-400 hover:bg-red-950 transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </AdminLayout>
    );
}
