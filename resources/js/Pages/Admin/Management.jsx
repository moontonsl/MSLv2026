import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Check,
    CheckSquare,
    LockKeyhole,
    Search,
    Square,
    Users,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const GROUP_ORDER = [
    'Student operations',
    'Admin security',
    'Website content',
    'Special modules',
];

function groupPermissions(permissions) {
    return permissions.reduce((groups, permission) => {
        const group = permission.group || 'Other';
        groups[group] = [...(groups[group] || []), permission];
        return groups;
    }, {});
}

function isSuperAdminAccount(admin) {
    return (
        Boolean(admin?.is_super_admin) ||
        admin?.role === 'Super Admin' ||
        admin?.email === 'admin@msl.com'
    );
}

function getRoleLabel(role) {
    const normalizedRole = String(role ?? 'Admin')
        .trim()
        .toLowerCase()
        .replace(/[\s-]+/g, '_');

    const labels = {
        admin: 'Admin',
        content_admin: 'Content Manager',
        content_manager: 'Content Manager',
        regional_admin: 'Regional Admin',
        event_admin: 'Event Manager',
        event_manager: 'Event Manager',
        super_admin: 'Super Admin',
    };

    return labels[normalizedRole] ?? role ?? 'Admin';
}

function getEditableRole(role, roleOptions) {
    const label = getRoleLabel(role);
    return roleOptions.includes(label) ? label : roleOptions[0] ?? 'Admin';
}

export default function Management({
    adminUsers = [],
    allPermissions = [],
    roleOptions = ['Admin', 'Content Manager', 'Regional Admin', 'Event Manager'],
}) {
    const { auth } = usePage().props;
    const [search, setSearch] = useState('');
    const [selectedUserId, setSelectedUserId] = useState(adminUsers[0]?.id ?? null);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [savedPermissions, setSavedPermissions] = useState([]);
    const [selectedRole, setSelectedRole] = useState(roleOptions[0] ?? 'Admin');
    const [savedRole, setSavedRole] = useState(roleOptions[0] ?? 'Admin');
    const [saving, setSaving] = useState(false);
    const [savingRole, setSavingRole] = useState(false);
    const [saveMessage, setSaveMessage] = useState(null);
    const [roleMessage, setRoleMessage] = useState(null);

    const canManageAdminAccounts =
        auth?.is_super_admin ||
        auth?.permissions?.includes('manage_admin_accounts');

    const filteredUsers = useMemo(() => {
        const value = search.trim().toLowerCase();

        if (!value) return adminUsers;

        return adminUsers.filter((admin) =>
            [admin.name, admin.email, admin.role].some((field) =>
                field?.toLowerCase().includes(value)
            )
        );
    }, [adminUsers, search]);

    const selectedUser =
        filteredUsers.find((admin) => admin.id === selectedUserId) ??
        filteredUsers[0] ??
        null;
    const groupedPermissions = useMemo(
        () => groupPermissions(allPermissions),
        [allPermissions]
    );
    const permissionGroups = GROUP_ORDER.filter(
        (group) => groupedPermissions[group]
    ).concat(
        Object.keys(groupedPermissions).filter(
            (group) => !GROUP_ORDER.includes(group)
        )
    );
    const isSuperAdmin = isSuperAdminAccount(selectedUser);
    const isDirty =
        selectedPermissions.slice().sort().join('|') !==
        savedPermissions.slice().sort().join('|');
    const isRoleDirty = selectedRole !== savedRole;

    useEffect(() => {
        if (!selectedUser) {
            setSelectedPermissions([]);
            setSavedPermissions([]);
            setSelectedRole(roleOptions[0] ?? 'Admin');
            setSavedRole(roleOptions[0] ?? 'Admin');
            return;
        }

        const permissions = Array.isArray(selectedUser.permissions)
            ? selectedUser.permissions
            : [];

        setSelectedPermissions(permissions);
        setSavedPermissions(permissions);
        const role = getEditableRole(selectedUser.role, roleOptions);
        setSelectedRole(role);
        setSavedRole(role);
        setSaveMessage(null);
        setRoleMessage(null);
    }, [selectedUser?.id]);

    const togglePermission = (permissionId) => {
        setSelectedPermissions((current) =>
            current.includes(permissionId)
                ? current.filter((permission) => permission !== permissionId)
                : [...current, permissionId]
        );
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

        router.post(
            route('admin.users.permissions.update', selectedUser.id),
            { permissions: selectedPermissions },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSavedPermissions(selectedPermissions);
                    setSaveMessage({
                        type: 'success',
                        text: 'Permissions saved successfully.',
                    });
                },
                onError: () =>
                    setSaveMessage({
                        type: 'error',
                        text: 'Permissions could not be saved.',
                    }),
                onFinish: () => setSaving(false),
            }
        );
    };

    const saveRole = () => {
        if (!selectedUser || isSuperAdmin || !isRoleDirty || savingRole) return;

        setSavingRole(true);
        setRoleMessage(null);

        router.put(
            route('admin.users.role.update', selectedUser.id),
            { role: selectedRole },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSavedRole(selectedRole);
                    setRoleMessage({
                        type: 'success',
                        text: 'Role updated successfully.',
                    });
                },
                onError: (errors) =>
                    setRoleMessage({
                        type: 'error',
                        text: errors.role || 'Role could not be updated.',
                    }),
                onFinish: () => setSavingRole(false),
            }
        );
    };

    return (
        <AdminLayout activeNavId="management">
            <Head title="Account Roles & Permissions" />

            <header className="mb-6 sm:mb-8">
                <h1 className="text-2xl font-bold text-[#FFFBEB] sm:text-3xl">
                    Account Roles &amp; Permissions
                </h1>
                <p className="mt-2 text-sm leading-6 text-gray-400">
                    Review administrator accounts and manage their page access.
                </p>
            </header>

            <section
                aria-labelledby="administrator-accounts-heading"
                className="mb-6 rounded-xl border border-neutral-800 bg-[#111111] p-4 sm:p-6"
            >
                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2
                            id="administrator-accounts-heading"
                            className="text-lg font-bold text-yellow-500 sm:text-xl"
                        >
                            Administrator accounts
                        </h2>
                        <p className="mt-1 text-sm text-gray-400">
                            {filteredUsers.length} of {adminUsers.length} account
                            {adminUsers.length === 1 ? '' : 's'}
                        </p>
                    </div>

                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                        <label className="relative block min-w-0 sm:w-72">
                            <span className="sr-only">Search administrator accounts</span>
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <input
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search name, email, or role"
                                className="min-h-11 w-full rounded-md border border-neutral-800 bg-[#1a1a1a] py-2.5 pl-9 pr-4 text-sm text-white outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                        </label>

                        {canManageAdminAccounts && (
                            <Link
                                href="/admin/administrator-accounts"
                                className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-md border border-neutral-700 px-4 text-sm font-semibold text-gray-300 transition hover:border-yellow-500 hover:text-yellow-400"
                            >
                                Manage accounts
                            </Link>
                        )}
                    </div>
                </div>

                {filteredUsers.length === 0 ? (
                    <div className="rounded-lg border border-neutral-800 bg-[#1a1a1a] py-12 text-center">
                        <Users className="mx-auto mb-3 h-9 w-9 text-gray-600" />
                        <p className="text-sm text-gray-400">
                            {search
                                ? 'No administrator accounts match your search.'
                                : 'No administrator accounts are available.'}
                        </p>
                    </div>
                ) : (
                    <div className="max-h-[28rem] overflow-auto rounded-lg border border-neutral-800">
                        <table className="min-w-full text-left text-sm">
                            <thead className="sticky top-0 z-10 border-b border-neutral-800 bg-[#151515] text-xs uppercase tracking-wide text-gray-500">
                                <tr>
                                    <th scope="col" className="px-4 py-3 font-semibold">
                                        Administrator
                                    </th>
                                    <th scope="col" className="px-4 py-3 font-semibold">
                                        Role
                                    </th>
                                    <th scope="col" className="px-4 py-3 font-semibold">
                                        Access
                                    </th>
                                    <th scope="col" className="px-4 py-3 text-right font-semibold">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((admin) => {
                                    const selected = admin.id === selectedUser?.id;
                                    const adminIsSuperAdmin = isSuperAdminAccount(admin);
                                    const permissionCount = Array.isArray(admin.permissions)
                                        ? admin.permissions.length
                                        : 0;

                                    return (
                                        <tr
                                            key={admin.id}
                                            className={`border-b border-neutral-800/70 last:border-0 ${
                                                selected ? 'bg-yellow-500/[0.06]' : ''
                                            }`}
                                        >
                                            <td className="px-4 py-4">
                                                <div className="flex min-w-56 items-center gap-3">
                                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-500/10 font-bold text-yellow-400">
                                                        {admin.name?.charAt(0)?.toUpperCase() || '?'}
                                                    </span>
                                                    <div className="min-w-0">
                                                        <p className="truncate font-semibold text-white">
                                                            {admin.name || 'Unnamed administrator'}
                                                        </p>
                                                        <p className="truncate text-xs text-gray-500">
                                                            {admin.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4">
                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                        adminIsSuperAdmin
                                                            ? 'bg-yellow-500/10 text-yellow-400'
                                                            : 'bg-blue-500/10 text-blue-400'
                                                    }`}
                                                >
                                                    {adminIsSuperAdmin
                                                        ? 'Super Admin'
                                                    : getRoleLabel(admin.role)}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4 text-gray-400">
                                                {adminIsSuperAdmin
                                                    ? 'Full access'
                                                    : `${permissionCount} assigned`}
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <button
                                                    type="button"
                                                    aria-pressed={selected}
                                                    onClick={() => setSelectedUserId(admin.id)}
                                                    className={`min-h-10 whitespace-nowrap rounded-md px-3 text-sm font-semibold transition ${
                                                        selected
                                                            ? 'bg-yellow-500/10 text-yellow-400'
                                                            : 'border border-neutral-700 text-gray-300 hover:border-yellow-500 hover:text-yellow-400'
                                                    }`}
                                                >
                                                    {selected
                                                        ? 'Selected'
                                                        : 'Manage permissions'}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {!selectedUser ? (
                <section className="rounded-xl border border-neutral-800 bg-[#111111] py-16 text-center">
                    <p className="text-sm text-gray-400">
                        Select an administrator account to manage permissions.
                    </p>
                </section>
            ) : (
                <section className="rounded-xl border border-neutral-800 bg-[#111111] p-4 sm:p-6 md:p-8">
                    <div className="mb-6 flex flex-col gap-4 border-b border-neutral-800 pb-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-3">
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-500/10 text-lg font-bold text-yellow-400">
                                {selectedUser.name?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="text-lg font-bold text-white">
                                        Permissions for {selectedUser.name}
                                    </h2>
                                    <span
                                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                            isSuperAdmin
                                                ? 'bg-yellow-500/10 text-yellow-400'
                                                : 'bg-blue-500/10 text-blue-400'
                                        }`}
                                    >
                                        {isSuperAdmin
                                            ? 'Super Admin'
                                            : getRoleLabel(selectedUser.role)}
                                    </span>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">
                                    {selectedUser.email}
                                </p>
                            </div>
                        </div>

                        {isSuperAdmin ? (
                            <div className="inline-flex items-start gap-2 rounded-lg border border-yellow-900/70 bg-yellow-500/5 px-4 py-3 text-sm text-yellow-300">
                                <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" />
                                <span>
                                    <strong>Full access protected.</strong>
                                    <br />
                                    <span className="text-xs text-yellow-500/80">
                                        Super Admin permissions cannot be modified.
                                    </span>
                                </span>
                            </div>
                        ) : (
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={selectAll}
                                    className="min-h-10 rounded-md border border-neutral-700 px-3 text-sm text-gray-300 hover:border-yellow-500 hover:text-yellow-400"
                                >
                                    Select all
                                </button>
                                <button
                                    type="button"
                                    onClick={clearAll}
                                    className="min-h-10 rounded-md border border-neutral-700 px-3 text-sm text-gray-300 hover:border-yellow-500 hover:text-yellow-400"
                                >
                                    Clear all
                                </button>
                                <button
                                    type="button"
                                    onClick={savePermissions}
                                    disabled={!isDirty || saving}
                                    className="inline-flex min-h-10 items-center gap-2 rounded-md bg-yellow-500 px-4 text-sm font-bold text-black hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <Check className="h-4 w-4" />
                                    {saving ? 'Saving...' : 'Save permissions'}
                                </button>
                            </div>
                        )}
                    </div>

                    {!isSuperAdmin && (
                        <div className="mb-6 rounded-lg border border-neutral-800 bg-[#151515] p-4 sm:p-5">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                                <div>
                                    <label
                                        htmlFor="selected-admin-role"
                                        className="mb-2 block text-sm font-semibold text-gray-200"
                                    >
                                        Account role
                                    </label>
                                    <select
                                        id="selected-admin-role"
                                        value={selectedRole}
                                        onChange={(event) => {
                                            setSelectedRole(event.target.value);
                                            setRoleMessage(null);
                                        }}
                                        disabled={savingRole}
                                        className="min-h-11 w-full rounded-md border border-neutral-800 bg-[#1a1a1a] px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-yellow-500 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {roleOptions.map((role) => (
                                            <option key={role} value={role}>
                                                {role}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="mt-2 text-xs leading-5 text-gray-500">
                                        The role describes this account. Page access is managed with the permissions below.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3 sm:items-end">
                                    {roleMessage && (
                                        <p
                                            role="status"
                                            className={`text-sm ${
                                                roleMessage.type === 'success'
                                                    ? 'text-emerald-300'
                                                    : 'text-red-300'
                                            }`}
                                        >
                                            {roleMessage.text}
                                        </p>
                                    )}
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedRole(savedRole);
                                                setRoleMessage(null);
                                            }}
                                            disabled={!isRoleDirty || savingRole}
                                            className="min-h-10 rounded-md border border-neutral-700 px-3 text-sm text-gray-300 hover:border-neutral-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={saveRole}
                                            disabled={!isRoleDirty || savingRole}
                                            className="min-h-10 rounded-md bg-yellow-500 px-4 text-sm font-bold text-black hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            {savingRole ? 'Saving role...' : 'Save role'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {saveMessage && (
                        <div
                            role="status"
                            className={`mb-5 flex items-center justify-between rounded-md border px-4 py-3 text-sm ${
                                saveMessage.type === 'success'
                                    ? 'border-emerald-900 bg-emerald-500/10 text-emerald-300'
                                    : 'border-red-900 bg-red-500/10 text-red-300'
                            }`}
                        >
                            <span>{saveMessage.text}</span>
                            <button
                                type="button"
                                onClick={() => setSaveMessage(null)}
                                aria-label="Dismiss message"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                    {isSuperAdmin ? (
                        <div className="rounded-lg border border-neutral-800 bg-[#1a1a1a] p-5 text-sm text-gray-400">
                            This account bypasses individual permission checks because it is the Super Admin.
                        </div>
                    ) : permissionGroups.length === 0 ? (
                        <div className="rounded-lg border border-neutral-800 bg-[#1a1a1a] p-5 text-sm text-gray-400">
                            No permissions are currently available.
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {permissionGroups.map((group) => {
                                const permissions = groupedPermissions[group];
                                const selectedCount = permissions.filter(
                                    (permission) =>
                                        selectedPermissions.includes(permission.id)
                                ).length;

                                return (
                                    <div key={group}>
                                        <div className="mb-3 flex items-center justify-between">
                                            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-400">
                                                {group}
                                            </h3>
                                            <span className="text-xs text-gray-600">
                                                {selectedCount} / {permissions.length}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                                            {permissions.map((permission) => {
                                                const checked =
                                                    selectedPermissions.includes(
                                                        permission.id
                                                    );

                                                return (
                                                    <button
                                                        key={permission.id}
                                                        type="button"
                                                        aria-pressed={checked}
                                                        onClick={() =>
                                                            togglePermission(
                                                                permission.id
                                                            )
                                                        }
                                                        className={`flex min-h-[54px] items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
                                                            checked
                                                                ? 'border-yellow-700 bg-yellow-500/10 text-yellow-300'
                                                                : 'border-neutral-800 bg-[#1a1a1a] text-gray-400 hover:border-neutral-600 hover:text-gray-200'
                                                        }`}
                                                    >
                                                        <span className="text-sm">
                                                            {permission.name}
                                                        </span>
                                                        {checked ? (
                                                            <CheckSquare className="h-5 w-5 shrink-0 text-yellow-400" />
                                                        ) : (
                                                            <Square className="h-5 w-5 shrink-0 text-neutral-600" />
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            )}
        </AdminLayout>
    );
}
