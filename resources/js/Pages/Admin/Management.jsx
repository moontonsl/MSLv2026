import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { Check, CheckSquare, LockKeyhole, Search, Shield, Square, Users, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const GROUP_ORDER = ['Student operations', 'Admin security', 'Website content', 'Special modules'];

function groupPermissions(permissions) {
    return permissions.reduce((groups, permission) => {
        const group = permission.group || 'Other';
        groups[group] = [...(groups[group] || []), permission];
        return groups;
    }, {});
}

export default function Management({ adminUsers = [], allPermissions = [] }) {
    const [search, setSearch] = useState('');
    const [selectedUserId, setSelectedUserId] = useState(adminUsers[0]?.id ?? null);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [savedPermissions, setSavedPermissions] = useState([]);
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState(null);

    const filteredUsers = useMemo(() => {
        const value = search.trim().toLowerCase();
        if (!value) return adminUsers;
        return adminUsers.filter((admin) => [admin.name, admin.email, admin.role].some((field) => field?.toLowerCase().includes(value)));
    }, [adminUsers, search]);

    const selectedUser = filteredUsers.find((admin) => admin.id === selectedUserId) ?? filteredUsers[0] ?? null;
    const groupedPermissions = useMemo(() => groupPermissions(allPermissions), [allPermissions]);
    const permissionGroups = GROUP_ORDER.filter((group) => groupedPermissions[group]).concat(Object.keys(groupedPermissions).filter((group) => !GROUP_ORDER.includes(group)));
    const isSuperAdmin = Boolean(selectedUser?.is_super_admin) || selectedUser?.role === 'Super Admin' || selectedUser?.email === 'admin@msl.com';
    const isDirty = selectedPermissions.slice().sort().join('|') !== savedPermissions.slice().sort().join('|');

    useEffect(() => {
        if (!selectedUser) {
            setSelectedPermissions([]);
            setSavedPermissions([]);
            return;
        }

        const permissions = Array.isArray(selectedUser.permissions) ? selectedUser.permissions : [];
        setSelectedPermissions(permissions);
        setSavedPermissions(permissions);
        setSaveMessage(null);
    }, [selectedUser?.id]);

    const togglePermission = (permissionId) => {
        setSelectedPermissions((current) => current.includes(permissionId)
            ? current.filter((permission) => permission !== permissionId)
            : [...current, permissionId]);
        setSaveMessage(null);
    };

    const selectAll = () => {
        setSelectedPermissions(allPermissions.map((permission) => permission.id));
        setSaveMessage(null);
    };

    const clearAll = () => {
        setSelectedPermissions([]);
        setSaveMessage(null);
    };

    const savePermissions = () => {
        if (!selectedUser || isSuperAdmin || !isDirty) return;
        setSaving(true);
        setSaveMessage(null);
        router.post(route('admin.users.permissions.update', selectedUser.id), { permissions: selectedPermissions }, {
            preserveScroll: true,
            onSuccess: () => {
                setSavedPermissions(selectedPermissions);
                setSaveMessage({ type: 'success', text: 'Permissions saved successfully.' });
            },
            onError: () => setSaveMessage({ type: 'error', text: 'Permissions could not be saved.' }),
            onFinish: () => setSaving(false),
        });
    };

    return <AdminLayout activeNavId="management" showGlobalSearch>
        <Head title="Admin Permissions" />
        <div className="mb-6 sm:mb-8"><h1 className="text-2xl font-bold text-white sm:text-3xl">Admin Permissions</h1><p className="mt-2 text-sm text-gray-400">Control which admin areas each regular Admin account can access.</p></div>

        <section className="mb-6 rounded-xl border border-neutral-800 bg-[#111111] p-4 sm:p-6"><div className="mb-5 flex items-start gap-3"><div className="rounded-lg bg-yellow-500/10 p-2 text-yellow-500"><Shield className="h-5 w-5" /></div><div><h2 className="text-lg font-bold text-yellow-500">Permission matrix</h2><p className="mt-1 text-sm text-gray-400">Select an account, adjust its permissions, and save the changes together.</p></div></div><div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_20rem]"><div><label htmlFor="permission-account" className="mb-2 block text-sm font-medium text-gray-300">Admin account</label><select id="permission-account" value={selectedUser?.id ?? ''} onChange={(event) => setSelectedUserId(Number(event.target.value))} className="min-h-[44px] w-full rounded-md border border-neutral-800 bg-[#1a1a1a] px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-yellow-500">{filteredUsers.map((admin) => <option key={admin.id} value={admin.id}>{admin.name} ({admin.email})</option>)}</select></div><div><label htmlFor="permission-search" className="mb-2 block text-sm font-medium text-gray-300">Filter accounts</label><div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" /><input id="permission-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} className="min-h-[44px] w-full rounded-md border border-neutral-800 bg-[#1a1a1a] pl-9 pr-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-yellow-500" placeholder="Name, email, or role" /></div></div></div></section>

        {!selectedUser ? <section className="rounded-xl border border-neutral-800 bg-[#111111] py-16 text-center"><Users className="mx-auto mb-4 h-10 w-10 text-gray-600" /><p className="text-sm text-gray-400">No admin accounts match your search.</p></section> : <section className="rounded-xl border border-neutral-800 bg-[#111111] p-4 sm:p-6 md:p-8"><div className="mb-6 flex flex-col gap-4 border-b border-neutral-800 pb-6 lg:flex-row lg:items-center lg:justify-between"><div className="flex items-center gap-3"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-500/10 text-lg font-bold text-yellow-400">{selectedUser.name?.charAt(0)?.toUpperCase() || '?'}</span><div><div className="flex flex-wrap items-center gap-2"><h2 className="text-lg font-bold text-white">{selectedUser.name}</h2><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isSuperAdmin ? 'bg-yellow-500/10 text-yellow-400' : 'bg-blue-500/10 text-blue-400'}`}>{isSuperAdmin ? 'Super Admin' : selectedUser.role}</span></div><p className="mt-1 text-sm text-gray-500">{selectedUser.email}</p></div></div>{isSuperAdmin ? <div className="inline-flex items-start gap-2 rounded-lg border border-yellow-900/70 bg-yellow-500/5 px-4 py-3 text-sm text-yellow-300"><LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" /><span><strong>Full access protected.</strong><br /><span className="text-xs text-yellow-500/80">Super Admin permissions cannot be modified.</span></span></div> : <div className="flex flex-wrap items-center gap-2"><button type="button" onClick={selectAll} className="min-h-10 rounded-md border border-neutral-700 px-3 text-sm text-gray-300 hover:border-yellow-500 hover:text-yellow-400">Select all</button><button type="button" onClick={clearAll} className="min-h-10 rounded-md border border-neutral-700 px-3 text-sm text-gray-300 hover:border-yellow-500 hover:text-yellow-400">Clear all</button><button type="button" onClick={savePermissions} disabled={!isDirty || saving} className="inline-flex min-h-10 items-center gap-2 rounded-md bg-yellow-500 px-4 text-sm font-bold text-black hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-40"><Check className="h-4 w-4" />{saving ? 'Saving...' : 'Save permissions'}</button></div>}</div>{saveMessage && <div className={`mb-5 flex items-center justify-between rounded-md border px-4 py-3 text-sm ${saveMessage.type === 'success' ? 'border-emerald-900 bg-emerald-500/10 text-emerald-300' : 'border-red-900 bg-red-500/10 text-red-300'}`}><span>{saveMessage.text}</span><button type="button" onClick={() => setSaveMessage(null)} aria-label="Dismiss message"><X className="h-4 w-4" /></button></div>}{isSuperAdmin ? <div className="rounded-lg border border-neutral-800 bg-[#1a1a1a] p-5 text-sm text-gray-400">This account bypasses individual permission checks because it is the Super Admin.</div> : <div className="space-y-6">{permissionGroups.map((group) => <div key={group}><div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-bold uppercase tracking-wide text-gray-400">{group}</h3><span className="text-xs text-gray-600">{groupedPermissions[group].filter((permission) => selectedPermissions.includes(permission.id)).length} / {groupedPermissions[group].length}</span></div><div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">{groupedPermissions[group].map((permission) => { const checked = selectedPermissions.includes(permission.id); return <button key={permission.id} type="button" onClick={() => togglePermission(permission.id)} className={`flex min-h-[54px] items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${checked ? 'border-yellow-700 bg-yellow-500/10 text-yellow-300' : 'border-neutral-800 bg-[#1a1a1a] text-gray-400 hover:border-neutral-600 hover:text-gray-200'}`}><span className="text-sm">{permission.name}</span>{checked ? <CheckSquare className="h-5 w-5 shrink-0 text-yellow-400" /> : <Square className="h-5 w-5 shrink-0 text-neutral-600" />}</button>; })}</div></div>)}</div>}</section>}
    </AdminLayout>;
}
