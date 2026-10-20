import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    AlertCircle,
    Check,
    CheckCircle2,
    Crown,
    ExternalLink,
    Filter,
    Info,
    KeyRound,
    Layers,
    LayoutGrid,
    LockKeyhole,
    Megaphone,
    RotateCcw,
    Save,
    Search,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Sparkles,
    Trophy,
    Undo2,
    UserCheck,
    UserCog,
    Users,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const GROUP_CONFIG = {
    'Community & Student Operations': {
        icon: Users,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
        description: 'Student registration queues, document verification, leadership chapters, and regional governance.',
    },
    'Esports & Tournaments': {
        icon: Trophy,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        description: 'Campus championship seasons, collegiate brackets, event calendars, and photo galleries.',
    },
    'Content & Media Management': {
        icon: Megaphone,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        description: 'Portal news articles, hero carousel banners, FAQs, footer links, and marketing redirect URLs.',
    },
    'System Security & Governance': {
        icon: ShieldCheck,
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/20',
        description: 'Admin account provisioning, granular role matrices, audit logs, and security settings.',
    },
};

const DEFAULT_GROUP_ORDER = [
    'Community & Student Operations',
    'Esports & Tournaments',
    'Content & Media Management',
    'System Security & Governance',
];

export default function Management({
    adminUsers = [],
    allPermissions = [],
    rolePresets = [],
    stats = {
        total_admins: 0,
        super_admins: 0,
        custom_admins: 0,
        total_permissions: 0,
    },
}) {
    const [adminSearch, setAdminSearch] = useState('');
    const [permSearch, setPermSearch] = useState('');
    const [selectedUserId, setSelectedUserId] = useState(adminUsers[0]?.id ?? null);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [savedPermissions, setSavedPermissions] = useState([]);
    const [appliedPresetNotice, setAppliedPresetNotice] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState(null);

    // Filter admins
    const filteredUsers = useMemo(() => {
        const query = adminSearch.trim().toLowerCase();
        if (!query) return adminUsers;
        return adminUsers.filter((admin) =>
            [admin.name, admin.email, admin.role].some((field) =>
                field?.toLowerCase().includes(query)
            )
        );
    }, [adminUsers, adminSearch]);

    // Currently selected admin
    const selectedUser = useMemo(() => {
        return filteredUsers.find((admin) => admin.id === selectedUserId) ?? filteredUsers[0] ?? null;
    }, [filteredUsers, selectedUserId]);

    const isSuperAdmin = Boolean(
        selectedUser?.is_super_admin ||
        selectedUser?.role === 'Super Admin' ||
        selectedUser?.email === 'admin@msl.com'
    );

    // Sync selected permissions when chosen admin changes
    useEffect(() => {
        if (!selectedUser) {
            setSelectedPermissions([]);
            setSavedPermissions([]);
            return;
        }

        const perms = Array.isArray(selectedUser.permissions) ? selectedUser.permissions : [];
        setSelectedPermissions(perms);
        setSavedPermissions(perms);
        setAppliedPresetNotice(null);
        setSaveMessage(null);
    }, [selectedUser?.id]);

    // Check if changes exist
    const isDirty = useMemo(() => {
        if (isSuperAdmin) return false;
        const currentSorted = [...selectedPermissions].sort().join('|');
        const savedSorted = [...savedPermissions].sort().join('|');
        return currentSorted !== savedSorted;
    }, [selectedPermissions, savedPermissions, isSuperAdmin]);

    // Group permissions
    const groupedPermissions = useMemo(() => {
        return allPermissions.reduce((acc, perm) => {
            const groupName = perm.group || 'Other';
            if (!acc[groupName]) acc[groupName] = [];
            acc[groupName].push(perm);
            return acc;
        }, {});
    }, [allPermissions]);

    const orderedGroupNames = useMemo(() => {
        const known = DEFAULT_GROUP_ORDER.filter((name) => groupedPermissions[name]);
        const custom = Object.keys(groupedPermissions).filter((name) => !DEFAULT_GROUP_ORDER.includes(name));
        return [...known, ...custom];
    }, [groupedPermissions]);

    // Filtered permissions by search
    const filteredGroupedPermissions = useMemo(() => {
        const query = permSearch.trim().toLowerCase();
        if (!query) return groupedPermissions;

        const result = {};
        Object.entries(groupedPermissions).forEach(([group, perms]) => {
            const matching = perms.filter(
                (p) =>
                    p.name.toLowerCase().includes(query) ||
                    p.id.toLowerCase().includes(query) ||
                    p.description?.toLowerCase().includes(query)
            );
            if (matching.length > 0) {
                result[group] = matching;
            }
        });
        return result;
    }, [groupedPermissions, permSearch]);

    // Handlers
    const togglePermission = (permissionId) => {
        if (isSuperAdmin) return;
        setSelectedPermissions((prev) =>
            prev.includes(permissionId)
                ? prev.filter((id) => id !== permissionId)
                : [...prev, permissionId]
        );
        setAppliedPresetNotice(null);
    };

    const applyPreset = (preset) => {
        if (isSuperAdmin) return;
        const validIds = allPermissions.map((p) => p.id);
        const presetIds = preset.permissions.filter((id) => validIds.includes(id));
        setSelectedPermissions(presetIds);
        setAppliedPresetNotice(preset.name);
        setSaveMessage(null);
    };

    const selectAll = () => {
        if (isSuperAdmin) return;
        setSelectedPermissions(allPermissions.map((p) => p.id));
        setAppliedPresetNotice('Full Platform Grants');
    };

    const clearAll = () => {
        if (isSuperAdmin) return;
        setSelectedPermissions([]);
        setAppliedPresetNotice(null);
    };

    const toggleGroup = (groupName) => {
        if (isSuperAdmin) return;
        const groupPermIds = (groupedPermissions[groupName] || []).map((p) => p.id);
        const allGroupSelected = groupPermIds.every((id) => selectedPermissions.includes(id));

        if (allGroupSelected) {
            setSelectedPermissions((prev) => prev.filter((id) => !groupPermIds.includes(id)));
        } else {
            setSelectedPermissions((prev) => Array.from(new Set([...prev, ...groupPermIds])));
        }
        setAppliedPresetNotice(null);
    };

    const discardChanges = () => {
        setSelectedPermissions(savedPermissions);
        setAppliedPresetNotice(null);
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
                    setAppliedPresetNotice(null);
                    setSaveMessage({
                        type: 'success',
                        text: `Permissions for ${selectedUser.name} updated successfully.`,
                    });
                },
                onError: (errors) => {
                    setSaveMessage({
                        type: 'error',
                        text: errors?.message || 'Failed to save permissions. Please review your entries.',
                    });
                },
                onFinish: () => setSaving(false),
            }
        );
    };

    return (
        <AdminLayout activeNavId="management" showGlobalSearch>
            <Head title="Permissions & Roles | Command Center" />

            {/* Header with Title and Quick Nav to Accounts */}
            <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20 shadow-[0_0_15px_rgba(251,191,36,0.15)]">
                            <Shield className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                                Permissions & Roles
                            </h1>
                            <p className="mt-1 text-xs text-gray-400">
                                Configure granular back-office administrative privileges, assign fast role presets, and govern operational staff capabilities.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href={route('admin.accounts.index')}
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-xs font-bold text-gray-300 transition-colors hover:border-amber-400/40 hover:text-white"
                    >
                        <Users className="h-4 w-4 text-amber-400" />
                        <span>Manage Admin Accounts</span>
                        <ExternalLink className="h-3.5 w-3.5 text-gray-500" />
                    </Link>
                </div>
            </div>

            {/* Metric Summary Cards (Standardized with RegionalAdmins & StudentLeaders) */}
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
                {/* Total Back-Office Admins */}
                <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.08] to-transparent p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Total Admins</span>
                        <Users className="h-5 w-5 text-amber-400" />
                    </div>
                    <p className="mt-3 text-2xl font-black text-white sm:text-3xl">{stats.total_admins ?? 0}</p>
                    <p className="mt-1 text-xs text-gray-400">Authorized staff with login access</p>
                </div>

                {/* Super Admins */}
                <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.08] to-transparent p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Super Admins</span>
                        <Crown className="h-5 w-5 text-emerald-400" />
                    </div>
                    <p className="mt-3 text-2xl font-black text-white sm:text-3xl">{stats.super_admins ?? 0}</p>
                    <p className="mt-1 text-xs text-gray-400">Protected root system bypasses</p>
                </div>

                {/* Configured Staff Roles */}
                <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/[0.08] to-transparent p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Configured Staff</span>
                        <UserCog className="h-5 w-5 text-blue-400" />
                    </div>
                    <p className="mt-3 text-2xl font-black text-white sm:text-3xl">{stats.custom_admins ?? 0}</p>
                    <p className="mt-1 text-xs text-gray-400">Granular custom role profiles</p>
                </div>

                {/* Platform Capabilities */}
                <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/[0.08] to-transparent p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Capabilities</span>
                        <Layers className="h-5 w-5 text-purple-400" />
                    </div>
                    <p className="mt-3 text-2xl font-black text-white sm:text-3xl">{stats.total_permissions ?? 0}</p>
                    <p className="mt-1 text-xs text-gray-400">Active permissions in 4 domains</p>
                </div>
            </div>

            {/* Save Message Banner */}
            {saveMessage && (
                <div
                    className={`mb-6 flex items-center justify-between rounded-2xl border p-4 sm:p-5 text-sm ${
                        saveMessage.type === 'success'
                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                            : 'border-red-500/30 bg-red-500/10 text-red-300'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        {saveMessage.type === 'success' ? (
                            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                        ) : (
                            <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
                        )}
                        <span className="font-semibold text-xs sm:text-sm">{saveMessage.text}</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setSaveMessage(null)}
                        className="rounded-lg p-1 text-gray-400 hover:text-white"
                        aria-label="Dismiss message"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Master-Detail Dual-Pane Workspace */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Left Column: Admin Directory List */}
                <div className="lg:col-span-4">
                    <div className="sticky top-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-5 shadow-2xl">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                                    Admin Directory
                                </h2>
                                <p className="text-xs text-gray-400">
                                    {filteredUsers.length} of {adminUsers.length} accounts
                                </p>
                            </div>
                            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-semibold text-gray-400">
                                Staff Logins
                            </span>
                        </div>

                        {/* Search Box */}
                        <div className="relative mb-4">
                            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="search"
                                value={adminSearch}
                                onChange={(e) => setAdminSearch(e.target.value)}
                                placeholder="Search by name, email..."
                                className="min-h-[44px] w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-10 pr-3 text-xs text-white placeholder:text-gray-500 transition-all focus:border-amber-400/50 focus:bg-black/80 focus:ring-1 focus:ring-amber-400/20 focus:outline-none"
                            />
                        </div>

                        {/* Admins List */}
                        <div className="max-h-[640px] space-y-2.5 overflow-y-auto pr-1">
                            {filteredUsers.length === 0 ? (
                                <div className="py-12 text-center text-xs text-gray-500">
                                    No admin accounts found matching your query.
                                </div>
                            ) : (
                                filteredUsers.map((admin) => {
                                    const isSelected = selectedUser?.id === admin.id;
                                    const adminIsSuper =
                                        Boolean(admin.is_super_admin) ||
                                        admin.role === 'Super Admin' ||
                                        admin.email === 'admin@msl.com';
                                    const activeCount = adminIsSuper
                                        ? allPermissions.length
                                        : (admin.permissions ?? []).length;
                                    const pct = Math.round(
                                        (activeCount / (allPermissions.length || 1)) * 100
                                    );

                                    return (
                                        <button
                                            key={admin.id}
                                            type="button"
                                            onClick={() => setSelectedUserId(admin.id)}
                                            className={`group w-full rounded-xl border p-4 text-left transition-all ${
                                                isSelected
                                                    ? 'border-amber-400/80 bg-amber-400/10 shadow-[0_0_20px_rgba(251,191,36,0.12)]'
                                                    : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]'
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="relative">
                                                    <div
                                                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                                                            adminIsSuper
                                                                ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-black shadow-md'
                                                                : 'border border-white/10 bg-white/5 text-gray-300 group-hover:text-white'
                                                        }`}
                                                    >
                                                        {admin.name?.charAt(0)?.toUpperCase() || '?'}
                                                    </div>
                                                    {adminIsSuper && (
                                                        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] text-amber-400 shadow">
                                                            <Crown className="h-2.5 w-2.5" />
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center justify-between gap-1">
                                                        <p
                                                            className={`truncate text-xs font-bold ${
                                                                isSelected ? 'text-amber-400' : 'text-white'
                                                            }`}
                                                        >
                                                            {admin.name}
                                                        </p>
                                                        <span
                                                            className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                                                                adminIsSuper
                                                                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                                                                    : 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                                                            }`}
                                                        >
                                                            {adminIsSuper ? 'Super Admin' : admin.role || 'Admin'}
                                                        </span>
                                                    </div>

                                                    <p className="truncate text-[11px] text-gray-400">
                                                        {admin.email}
                                                    </p>

                                                    {/* Capabilities Counter & Mini Progress */}
                                                    <div className="mt-2.5">
                                                        <div className="flex items-center justify-between text-[10px]">
                                                            <span className="font-medium text-gray-400">
                                                                {adminIsSuper
                                                                    ? 'Full Platform Access'
                                                                    : `${activeCount} of ${allPermissions.length} Grants`}
                                                            </span>
                                                            <span
                                                                className={`font-mono font-bold ${
                                                                    adminIsSuper
                                                                        ? 'text-amber-400'
                                                                        : activeCount > 0
                                                                        ? 'text-gray-300'
                                                                        : 'text-gray-500'
                                                                }`}
                                                            >
                                                                {pct}%
                                                            </span>
                                                        </div>
                                                        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                                                            <div
                                                                className={`h-full transition-all duration-300 ${
                                                                    adminIsSuper
                                                                        ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                                                                        : activeCount > 0
                                                                        ? 'bg-blue-500'
                                                                        : 'bg-white/20'
                                                                }`}
                                                                style={{ width: `${pct}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Roles & Permission Matrix Controls */}
                <div className="lg:col-span-8 space-y-6">
                    {!selectedUser ? (
                        <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-12 text-center shadow-2xl">
                            <Users className="mx-auto mb-3 h-10 w-10 text-gray-500" />
                            <h3 className="text-base font-bold text-white">No Admin Selected</h3>
                            <p className="mt-1 text-xs text-gray-400">
                                Choose an administrator from the directory to review and manage permissions.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Selected Admin Profile & Status Header */}
                            <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-5 sm:p-6 shadow-2xl">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-black ${
                                                isSuperAdmin
                                                    ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-black shadow-lg shadow-amber-400/20'
                                                    : 'border border-white/10 bg-white/5 text-white'
                                            }`}
                                        >
                                            {selectedUser.name?.charAt(0)?.toUpperCase() || '?'}
                                        </div>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h2 className="text-xl font-bold text-white">
                                                    {selectedUser.name}
                                                </h2>
                                                <span
                                                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                                        isSuperAdmin
                                                            ? 'border border-amber-400/40 bg-amber-400/10 text-amber-400'
                                                            : 'border border-blue-500/40 bg-blue-500/10 text-blue-400'
                                                    }`}
                                                >
                                                    {isSuperAdmin ? 'Super Admin' : selectedUser.role || 'Staff Admin'}
                                                </span>
                                            </div>
                                            <p className="mt-0.5 text-xs text-gray-400">
                                                {selectedUser.email}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Super Admin Tag vs Batch Actions */}
                                    {isSuperAdmin ? (
                                        <div className="inline-flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2.5 text-xs font-semibold text-amber-300">
                                            <LockKeyhole className="h-4 w-4 text-amber-400 shrink-0" />
                                            <span>Root Protected (Full Privileges Inherited)</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={selectAll}
                                                className="min-h-[40px] rounded-xl border border-white/10 bg-white/[0.04] px-4 text-xs font-bold text-gray-300 transition-colors hover:border-amber-400/50 hover:text-white"
                                            >
                                                Select All
                                            </button>
                                            <button
                                                type="button"
                                                onClick={clearAll}
                                                className="min-h-[40px] rounded-xl border border-white/10 bg-white/[0.04] px-4 text-xs font-bold text-gray-300 transition-colors hover:border-red-500/50 hover:text-red-300"
                                            >
                                                Clear All
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Super Admin Explanation Notice */}
                                {isSuperAdmin ? (
                                    <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-4 sm:p-5 text-xs text-amber-200/90 leading-relaxed">
                                        <div className="flex items-start gap-3">
                                            <Crown className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                                            <div>
                                                <strong className="text-amber-300">Full Platform Bypass:</strong> This root account possesses unconditional authorization across all admin modules, bypasses individual permission gates, and cannot be restricted. The matrix below displays active capabilities in read-only audit mode.
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* Quick Role Presets Toolbar for Custom Admins */
                                    <div className="mt-6 border-t border-white/10 pt-5">
                                        <div className="flex items-center justify-between mb-3.5">
                                            <div className="flex items-center gap-2">
                                                <Sparkles className="h-4 w-4 text-amber-400" />
                                                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                                                    1-Click Role Presets (Templates)
                                                </h3>
                                            </div>
                                            {appliedPresetNotice && (
                                                <span className="text-[11px] font-semibold text-emerald-400 animate-pulse">
                                                    ✓ Applied template: {appliedPresetNotice}
                                                </span>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                                            {rolePresets.map((preset) => {
                                                return (
                                                    <button
                                                        key={preset.id}
                                                        type="button"
                                                        onClick={() => applyPreset(preset)}
                                                        className="group flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3 sm:p-3.5 text-left transition-all hover:border-amber-400/50 hover:bg-white/[0.06]"
                                                    >
                                                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-amber-400 group-hover:bg-amber-400 group-hover:text-black transition-colors">
                                                            <Sparkles className="h-3.5 w-3.5" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="truncate text-xs font-bold text-white group-hover:text-amber-400">
                                                                {preset.name}
                                                            </p>
                                                            <p className="line-clamp-1 text-[10px] text-gray-400">
                                                                {preset.permissions.length} capabilities
                                                            </p>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Permission Search Bar & Matrix Counter */}
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="relative flex-1">
                                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="search"
                                        value={permSearch}
                                        onChange={(e) => setPermSearch(e.target.value)}
                                        placeholder="Filter capabilities by keyword (e.g. approve, news, tournament, audit)..."
                                        className="min-h-[44px] w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-gray-500 transition-all focus:border-amber-400/50 focus:bg-black/80 focus:ring-1 focus:ring-amber-400/20 focus:outline-none"
                                    />
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="min-h-[44px] inline-flex items-center rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-xs font-semibold text-gray-300">
                                        <span className="text-amber-400 font-bold mr-1">
                                            {isSuperAdmin ? allPermissions.length : selectedPermissions.length}
                                        </span>{' '}
                                        / {allPermissions.length} Enabled
                                    </span>
                                </div>
                            </div>

                            {/* Granular Permission Groups */}
                            <div className="space-y-6">
                                {orderedGroupNames.map((groupName) => {
                                    const perms = filteredGroupedPermissions[groupName];
                                    if (!perms || perms.length === 0) return null;

                                    const groupMeta = GROUP_CONFIG[groupName] || {
                                        icon: Shield,
                                        color: 'text-gray-400',
                                        bg: 'bg-white/5',
                                        border: 'border-white/10',
                                        description: 'Operational capabilities within this scope.',
                                    };
                                    const GroupIcon = groupMeta.icon;

                                    const groupEnabledCount = isSuperAdmin
                                        ? perms.length
                                        : perms.filter((p) => selectedPermissions.includes(p.id)).length;
                                    const isAllGroupSelected = groupEnabledCount === perms.length;

                                    return (
                                        <div
                                            key={groupName}
                                            className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-5 sm:p-6 shadow-2xl"
                                        >
                                            {/* Group Header */}
                                            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${groupMeta.bg} ${groupMeta.color} border border-white/10`}
                                                    >
                                                        <GroupIcon className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm font-bold text-white">
                                                            {groupName}
                                                        </h3>
                                                        <p className="text-xs text-gray-400">
                                                            {groupMeta.description}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-gray-300">
                                                        {groupEnabledCount} / {perms.length}
                                                    </span>

                                                    {!isSuperAdmin && (
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleGroup(groupName)}
                                                            className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                                                        >
                                                            {isAllGroupSelected ? 'Deselect group' : 'Select group'}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Permissions Grid */}
                                            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                                                {perms.map((permission) => {
                                                    const isChecked =
                                                        isSuperAdmin || selectedPermissions.includes(permission.id);

                                                    return (
                                                        <button
                                                            key={permission.id}
                                                            type="button"
                                                            disabled={isSuperAdmin}
                                                            onClick={() => togglePermission(permission.id)}
                                                            className={`flex items-start justify-between gap-3.5 rounded-xl border p-4 text-left transition-all ${
                                                                isSuperAdmin
                                                                    ? 'border-amber-400/20 bg-amber-400/[0.04] cursor-default'
                                                                    : isChecked
                                                                    ? 'border-amber-400/50 bg-amber-400/10 hover:border-amber-400/70 hover:bg-amber-400/15'
                                                                    : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]'
                                                            }`}
                                                        >
                                                            <div className="min-w-0 flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <p
                                                                        className={`text-xs font-bold leading-tight ${
                                                                            isChecked
                                                                                ? 'text-amber-300'
                                                                                : 'text-gray-200'
                                                                        }`}
                                                                    >
                                                                        {permission.name}
                                                                    </p>
                                                                </div>
                                                                <p className="mt-1 text-[11px] text-gray-400 line-clamp-2">
                                                                    {permission.description}
                                                                </p>
                                                                <span className="mt-1.5 inline-block font-mono text-[9px] text-gray-500">
                                                                    {permission.id}
                                                                </span>
                                                            </div>

                                                            {/* Toggle Switch / Badge */}
                                                            <div className="shrink-0 pt-0.5">
                                                                {isSuperAdmin ? (
                                                                    <span className="inline-flex items-center gap-1 rounded-md border border-amber-400/30 bg-amber-400/20 px-2 py-1 text-[10px] font-bold text-amber-300">
                                                                        <Check className="h-3 w-3" />
                                                                        Super
                                                                    </span>
                                                                ) : (
                                                                    <div
                                                                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                                                            isChecked ? 'bg-amber-400' : 'bg-white/10'
                                                                        }`}
                                                                    >
                                                                        <span
                                                                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                                                                isChecked
                                                                                    ? 'translate-x-4 bg-black'
                                                                                    : 'translate-x-0'
                                                                            }`}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Sticky Save Action Bar (Shown when dirty) */}
                            {isDirty && (
                                <div className="sticky bottom-6 z-30 rounded-2xl border border-amber-400/40 bg-[#141416]/95 p-4 sm:p-5 backdrop-blur-xl shadow-2xl shadow-amber-400/10">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/30">
                                                <AlertCircle className="h-5 w-5" />
                                            </span>
                                            <div>
                                                <p className="text-xs font-bold text-white">
                                                    Unsaved Permission Modifications
                                                </p>
                                                <p className="text-[11px] text-gray-400">
                                                    You have modified capabilities for{' '}
                                                    <span className="text-amber-400 font-semibold">
                                                        {selectedUser.name}
                                                    </span>
                                                    . Remember to save to update their access.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2.5 self-end sm:self-center">
                                            <button
                                                type="button"
                                                onClick={discardChanges}
                                                disabled={saving}
                                                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-xs font-bold text-gray-300 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
                                            >
                                                <Undo2 className="h-3.5 w-3.5" />
                                                Discard
                                            </button>
                                            <button
                                                type="button"
                                                onClick={savePermissions}
                                                disabled={saving}
                                                className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-amber-400 px-5 text-xs font-bold text-black shadow-lg shadow-amber-400/20 transition-all hover:bg-amber-300 active:scale-95 disabled:opacity-50"
                                            >
                                                <Save className="h-3.5 w-3.5" />
                                                {saving ? 'Saving Grants...' : 'Save Permissions'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
