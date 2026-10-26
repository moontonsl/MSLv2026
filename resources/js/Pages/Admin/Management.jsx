import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    AlertCircle,
    Check,
    CheckCircle2,
    Crown,
    ExternalLink,
    Layers,
    LockKeyhole,
    Megaphone,
    Plus,
    Save,
    Search,
    Shield,
    ShieldCheck,
    Trash2,
    Trophy,
    Undo2,
    UserCheck,
    UserCog,
    UserPlus,
    Users,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

const GROUP_CONFIG = {
    'Community & Student Operations': {
        icon: Users,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
        description: 'Student registration queues, document verification, leadership chapters, and regional governance.',
    },
    'Student operations': {
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
    'Website content': {
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
    'Admin security': {
        icon: ShieldCheck,
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/20',
        description: 'Admin account provisioning, granular role matrices, and back-office governance.',
    },
    'Special modules': {
        icon: Layers,
        color: 'text-pink-400',
        bg: 'bg-pink-500/10',
        border: 'border-pink-500/20',
        description: 'Brand partnership modules, compliance violation reports, and security audit logs.',
    },
};

const DEFAULT_GROUP_ORDER = [
    'Community & Student Operations',
    'Student operations',
    'Esports & Tournaments',
    'Content & Media Management',
    'Website content',
    'System Security & Governance',
    'Admin security',
    'Special modules',
];

export default function Management({
    adminUsers = [],
    roles = [],
    allPermissions = [],
    stats = {
        total_admins: 0,
        super_admins: 0,
        custom_admins: 0,
        total_roles: 0,
        total_permissions: 0,
    },
    roleOptions = ['Admin', 'Content Manager', 'Regional Admin', 'Event Manager'],
}) {
    // Mode tab: 'roles' (Role Management) or 'staff' (Staff Assignment)
    const [workspaceTab, setWorkspaceTab] = useState('roles');

    // Search filters
    const [roleSearch, setRoleSearch] = useState('');
    const [staffSearch, setStaffSearch] = useState('');
    const [permSearch, setPermSearch] = useState('');

    // Selected Role state
    const [selectedRoleId, setSelectedRoleId] = useState(
        roles.find((r) => !r.is_system && r.slug !== 'super_admin')?.id ?? roles[0]?.id ?? null
    );
    const [rolePermissions, setRolePermissions] = useState([]);
    const [savedRolePermissions, setSavedRolePermissions] = useState([]);

    // Selected Staff state
    const [selectedUserId, setSelectedUserId] = useState(adminUsers[0]?.id ?? null);
    const [selectedStaffRole, setSelectedStaffRole] = useState(roleOptions[0] ?? 'Admin');
    const [savedStaffRole, setSavedStaffRole] = useState(roleOptions[0] ?? 'Admin');
    const [staffPermissions, setStaffPermissions] = useState([]);
    const [savedStaffPermissions, setSavedStaffPermissions] = useState([]);

    // Modals & Operation state
    const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);
    const [newRoleForm, setNewRoleForm] = useState({ name: '', description: '', permissions: [] });
    const [createRoleError, setCreateRoleError] = useState('');
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState(null);

    useEffect(() => {
        if (isCreateRoleModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isCreateRoleModalOpen]);

    // Active Role computed
    const filteredRoles = useMemo(() => {
        const query = roleSearch.trim().toLowerCase();
        if (!query) return roles;
        return roles.filter(
            (r) =>
                r.name.toLowerCase().includes(query) ||
                r.slug.toLowerCase().includes(query) ||
                r.description?.toLowerCase().includes(query)
        );
    }, [roles, roleSearch]);

    const selectedRole = useMemo(() => {
        return filteredRoles.find((r) => r.id === selectedRoleId) ?? filteredRoles[0] ?? roles[0] ?? null;
    }, [filteredRoles, selectedRoleId, roles]);

    const isSelectedRoleSuper = Boolean(
        selectedRole?.is_system && (selectedRole?.slug === 'super_admin' || selectedRole?.name === 'Super Admin')
    );

    // Active Staff computed
    const filteredStaff = useMemo(() => {
        const query = staffSearch.trim().toLowerCase();
        if (!query) return adminUsers;
        return adminUsers.filter((u) =>
            [u.name, u.email, u.role].some((field) => field?.toLowerCase().includes(query))
        );
    }, [adminUsers, staffSearch]);

    const selectedStaff = useMemo(() => {
        return filteredStaff.find((u) => u.id === selectedUserId) ?? filteredStaff[0] ?? adminUsers[0] ?? null;
    }, [filteredStaff, selectedUserId, adminUsers]);

    const isSelectedStaffSuper = Boolean(
        selectedStaff?.is_super_admin || selectedStaff?.role === 'Super Admin' || selectedStaff?.email === 'admin@msl.com'
    );

    // Sync Role permissions when selectedRole changes
    useEffect(() => {
        if (!selectedRole) {
            setRolePermissions([]);
            setSavedRolePermissions([]);
            return;
        }

        const perms = Array.isArray(selectedRole.permissions) ? selectedRole.permissions : [];
        setRolePermissions(perms);
        setSavedRolePermissions(perms);
        setSaveMessage(null);
    }, [selectedRole?.id]);

    // Sync Staff permissions & role when selectedStaff changes
    useEffect(() => {
        if (!selectedStaff) {
            setStaffPermissions([]);
            setSavedStaffPermissions([]);
            setSelectedStaffRole(roleOptions[0] ?? 'Admin');
            setSavedStaffRole(roleOptions[0] ?? 'Admin');
            return;
        }

        const perms = Array.isArray(selectedStaff.permissions) ? selectedStaff.permissions : [];
        setStaffPermissions(perms);
        setSavedStaffPermissions(perms);

        setSelectedStaffRole(selectedStaff.role ?? 'Admin');
        setSavedStaffRole(selectedStaff.role ?? 'Admin');
        setSaveMessage(null);
    }, [selectedStaff?.id]);

    // Dirty checkers
    const isRoleDirty = useMemo(() => {
        if (isSelectedRoleSuper) return false;
        const currentSorted = [...rolePermissions].sort().join('|');
        const savedSorted = [...savedRolePermissions].sort().join('|');
        return currentSorted !== savedSorted;
    }, [rolePermissions, savedRolePermissions, isSelectedRoleSuper]);

    const isStaffPermissionsDirty = useMemo(() => {
        if (isSelectedStaffSuper) return false;
        const currentSorted = [...staffPermissions].sort().join('|');
        const savedSorted = [...savedStaffPermissions].sort().join('|');
        return currentSorted !== savedSorted;
    }, [staffPermissions, savedStaffPermissions, isSelectedStaffSuper]);

    const isStaffRoleDirty = useMemo(() => {
        if (isSelectedStaffSuper) return false;
        return selectedStaffRole !== savedStaffRole;
    }, [selectedStaffRole, savedStaffRole, isSelectedStaffSuper]);

    const isStaffDirty = isStaffPermissionsDirty || isStaffRoleDirty;

    // Grouping permissions
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

    // Role Permission Handlers
    const toggleRolePermission = (permissionId) => {
        if (isSelectedRoleSuper) return;
        setRolePermissions((prev) =>
            prev.includes(permissionId) ? prev.filter((id) => id !== permissionId) : [...prev, permissionId]
        );
    };

    const selectAllRolePermissions = () => {
        if (isSelectedRoleSuper) return;
        setRolePermissions(allPermissions.map((p) => p.id));
    };

    const clearAllRolePermissions = () => {
        if (isSelectedRoleSuper) return;
        setRolePermissions([]);
    };

    const toggleRoleGroup = (groupName) => {
        if (isSelectedRoleSuper) return;
        const groupPermIds = (groupedPermissions[groupName] || []).map((p) => p.id);
        const allGroupSelected = groupPermIds.every((id) => rolePermissions.includes(id));

        if (allGroupSelected) {
            setRolePermissions((prev) => prev.filter((id) => !groupPermIds.includes(id)));
        } else {
            setRolePermissions((prev) => Array.from(new Set([...prev, ...groupPermIds])));
        }
    };

    const discardRoleChanges = () => {
        setRolePermissions(savedRolePermissions);
        setSaveMessage(null);
    };

    const saveRolePermissions = () => {
        if (!selectedRole || isSelectedRoleSuper || !isRoleDirty) return;
        setSaving(true);
        setSaveMessage(null);

        router.put(
            route('admin.roles.update', selectedRole.id),
            {
                name: selectedRole.name,
                description: selectedRole.description,
                permissions: rolePermissions,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSavedRolePermissions(rolePermissions);
                    setSaveMessage({
                        type: 'success',
                        text: `Permissions for role '${selectedRole.name}' saved and applied to all assigned staff accounts.`,
                    });
                },
                onError: (err) => {
                    setSaveMessage({
                        type: 'error',
                        text: err?.message || 'Failed to save role permissions. Please review your entries.',
                    });
                },
                onFinish: () => setSaving(false),
            }
        );
    };

    const handleDeleteRole = (role) => {
        if (role.is_system) return;
        if (!window.confirm(`Delete the custom role '${role.name}'? Any assigned staff will be reassigned to Admin.`)) {
            return;
        }

        router.delete(route('admin.roles.destroy', role.id), {
            preserveScroll: true,
            onSuccess: () => {
                setSaveMessage({
                    type: 'success',
                    text: `Role '${role.name}' deleted successfully.`,
                });
            },
        });
    };

    // Create New Role Handlers
    const handleOpenCreateRole = () => {
        setNewRoleForm({ name: '', description: '', permissions: [] });
        setCreateRoleError('');
        setIsCreateRoleModalOpen(true);
    };

    const handleCreateRoleSubmit = (e) => {
        e.preventDefault();
        if (!newRoleForm.name.trim()) {
            setCreateRoleError('Please enter a role name.');
            return;
        }

        setSaving(true);
        setCreateRoleError('');

        router.post(
            route('admin.roles.store'),
            {
                name: newRoleForm.name.trim(),
                description: newRoleForm.description?.trim(),
                permissions: newRoleForm.permissions,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsCreateRoleModalOpen(false);
                    setSaveMessage({
                        type: 'success',
                        text: `New role '${newRoleForm.name.trim()}' created successfully.`,
                    });
                },
                onError: (err) => {
                    setCreateRoleError(err?.name || err?.message || 'Failed to create role.');
                },
                onFinish: () => setSaving(false),
            }
        );
    };

    const toggleNewRolePermission = (permId) => {
        setNewRoleForm((prev) => ({
            ...prev,
            permissions: prev.permissions.includes(permId)
                ? prev.permissions.filter((id) => id !== permId)
                : [...prev.permissions, permId],
        }));
    };

    // Staff Handlers
    const handleSaveStaffChanges = () => {
        if (!selectedStaff || isSelectedStaffSuper || !isStaffDirty) return;
        setSaving(true);
        setSaveMessage(null);

        const promises = [];

        if (isStaffRoleDirty) {
            promises.push(
                new Promise((resolve, reject) => {
                    router.put(
                        route('admin.users.role.update', selectedStaff.id),
                        { role: selectedStaffRole },
                        {
                            preserveScroll: true,
                            onSuccess: () => {
                                setSavedStaffRole(selectedStaffRole);
                                resolve();
                            },
                            onError: (err) => reject(err),
                        }
                    );
                })
            );
        }

        if (isStaffPermissionsDirty) {
            promises.push(
                new Promise((resolve, reject) => {
                    router.post(
                        route('admin.users.permissions.update', selectedStaff.id),
                        { permissions: staffPermissions },
                        {
                            preserveScroll: true,
                            onSuccess: () => {
                                setSavedStaffPermissions(staffPermissions);
                                resolve();
                            },
                            onError: (err) => reject(err),
                        }
                    );
                })
            );
        }

        Promise.all(promises)
            .then(() => {
                setSaveMessage({
                    type: 'success',
                    text: `Staff account settings for ${selectedStaff.name} updated successfully.`,
                });
            })
            .catch((err) => {
                setSaveMessage({
                    type: 'error',
                    text: err?.role || err?.message || 'Failed to save staff updates.',
                });
            })
            .finally(() => setSaving(false));
    };

    return (
        <AdminLayout activeNavId="management" showGlobalSearch>
            <Head title="Permissions & Roles | RBAC Center" />

            {/* Header with Title and Quick Actions */}
            <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20 shadow-[0_0_15px_rgba(251,191,36,0.15)]">
                            <Shield className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                                Permissions &amp; Roles
                            </h1>
                            <p className="mt-1 text-xs text-gray-400">
                                Configure role templates, assign granular capability sets, and provision staff without repeating permission setup.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <button
                        type="button"
                        onClick={handleOpenCreateRole}
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-amber-400 px-4 text-xs font-bold text-black shadow-lg shadow-amber-400/20 transition-all hover:bg-amber-300 active:scale-95"
                    >
                        <Plus className="h-4 w-4 stroke-[3]" />
                        <span>Create New Role</span>
                    </button>

                    <Link
                        href={route('admin.accounts.index')}
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-xs font-bold text-gray-300 transition-colors hover:border-amber-400/40 hover:text-white"
                    >
                        <UserPlus className="h-4 w-4 text-amber-400" />
                        <span>Manage Accounts</span>
                        <ExternalLink className="h-3.5 w-3.5 text-gray-500" />
                    </Link>
                </div>
            </div>

            {/* Metric Summary Cards */}
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
                {/* Total Roles */}
                <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.08] to-transparent p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Configured Roles</span>
                        <ShieldCheck className="h-5 w-5 text-amber-400" />
                    </div>
                    <p className="mt-3 text-2xl font-black text-white sm:text-3xl">{roles.length}</p>
                    <p className="mt-1 text-xs text-gray-400">Role capability templates</p>
                </div>

                {/* Total Back-Office Staff */}
                <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/[0.08] to-transparent p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Total Staff</span>
                        <Users className="h-5 w-5 text-blue-400" />
                    </div>
                    <p className="mt-3 text-2xl font-black text-white sm:text-3xl">{adminUsers.length}</p>
                    <p className="mt-1 text-xs text-gray-400">Authorized staff logins</p>
                </div>

                {/* Super Admins */}
                <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.08] to-transparent p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Super Admins</span>
                        <Crown className="h-5 w-5 text-emerald-400" />
                    </div>
                    <p className="mt-3 text-2xl font-black text-white sm:text-3xl">{stats.super_admins ?? 1}</p>
                    <p className="mt-1 text-xs text-gray-400">Protected root system bypasses</p>
                </div>

                {/* Platform Capabilities */}
                <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/[0.08] to-transparent p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Capabilities</span>
                        <Layers className="h-5 w-5 text-purple-400" />
                    </div>
                    <p className="mt-3 text-2xl font-black text-white sm:text-3xl">{allPermissions.length}</p>
                    <p className="mt-1 text-xs text-gray-400">Granular platform privileges</p>
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
                {/* Left Column: Directory Switcher (Roles vs Staff) */}
                <div className="lg:col-span-4">
                    <div className="sticky top-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-5 shadow-2xl">
                        {/* Tab Switcher */}
                        <div className="mb-4 grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
                            <button
                                type="button"
                                onClick={() => setWorkspaceTab('roles')}
                                className={`rounded-lg py-2 text-xs font-bold transition-all ${
                                    workspaceTab === 'roles'
                                        ? 'bg-amber-400 text-black shadow-md'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                Roles ({roles.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setWorkspaceTab('staff')}
                                className={`rounded-lg py-2 text-xs font-bold transition-all ${
                                    workspaceTab === 'staff'
                                        ? 'bg-amber-400 text-black shadow-md'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                Staff Logins ({adminUsers.length})
                            </button>
                        </div>

                        {/* MODE 1: ROLES DIRECTORY */}
                        {workspaceTab === 'roles' && (
                            <>
                                <div className="mb-3.5 flex items-center justify-between">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                                        Configured Role Templates
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleOpenCreateRole}
                                        className="text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors"
                                    >
                                        + New Role
                                    </button>
                                </div>

                                <div className="relative mb-3.5">
                                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="search"
                                        value={roleSearch}
                                        onChange={(e) => setRoleSearch(e.target.value)}
                                        placeholder="Filter roles (e.g. content, tournament)..."
                                        className="min-h-[40px] w-full rounded-xl border border-white/10 bg-white/[0.04] py-2 pl-10 pr-3 text-xs text-white placeholder:text-gray-500 transition-all focus:border-amber-400/50 focus:bg-black/80 focus:ring-1 focus:ring-amber-400/20 focus:outline-none"
                                    />
                                </div>

                                <div className="max-h-[600px] space-y-2 overflow-y-auto pr-1">
                                    {filteredRoles.map((role) => {
                                        const isSelected = selectedRole?.id === role.id;
                                        const isSuper = role.is_system && (role.slug === 'super_admin' || role.name === 'Super Admin');
                                        const assignedStaffCount = role.users_count ?? adminUsers.filter((u) => u.role === role.name).length;
                                        const permsCount = isSuper ? allPermissions.length : (role.permissions ?? []).length;
                                        const pct = Math.round((permsCount / (allPermissions.length || 1)) * 100);

                                        return (
                                            <button
                                                key={role.id}
                                                type="button"
                                                onClick={() => setSelectedRoleId(role.id)}
                                                className={`group w-full rounded-xl border p-3.5 text-left transition-all ${
                                                    isSelected
                                                        ? 'border-amber-400/80 bg-amber-400/10 shadow-[0_0_20px_rgba(251,191,36,0.12)]'
                                                        : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <p
                                                                className={`truncate text-xs font-bold ${
                                                                    isSelected ? 'text-amber-400' : 'text-white'
                                                                }`}
                                                            >
                                                                {role.name}
                                                            </p>
                                                            <span
                                                                className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                                                                    isSuper
                                                                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                                                                        : role.is_system
                                                                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                                                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                                                }`}
                                                            >
                                                                {isSuper ? 'Root' : role.is_system ? 'System' : 'Custom'}
                                                            </span>
                                                        </div>

                                                        {role.description && (
                                                            <p className="mt-1 line-clamp-1 text-[11px] text-gray-400">
                                                                {role.description}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {!role.is_system && (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteRole(role);
                                                            }}
                                                            className="rounded-lg p-1 text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                                                            title="Delete this role"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="mt-2.5 flex items-center justify-between text-[10px] text-gray-400">
                                                    <span>
                                                        <strong className="text-white">{permsCount}</strong> / {allPermissions.length} grants
                                                    </span>
                                                    <span>{assignedStaffCount} staff assigned</span>
                                                </div>

                                                <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/10">
                                                    <div
                                                        className={`h-full transition-all duration-300 ${
                                                            isSuper
                                                                ? 'bg-amber-400'
                                                                : permsCount > 0
                                                                ? 'bg-blue-500'
                                                                : 'bg-white/20'
                                                        }`}
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </>
                        )}

                        {/* MODE 2: STAFF DIRECTORY */}
                        {workspaceTab === 'staff' && (
                            <>
                                <div className="mb-3.5 flex items-center justify-between">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                                        Staff Logins
                                    </span>
                                    <Link
                                        href={route('admin.accounts.index')}
                                        className="text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors"
                                    >
                                        + Add Staff
                                    </Link>
                                </div>

                                <div className="relative mb-3.5">
                                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="search"
                                        value={staffSearch}
                                        onChange={(e) => setStaffSearch(e.target.value)}
                                        placeholder="Search staff by name or email..."
                                        className="min-h-[40px] w-full rounded-xl border border-white/10 bg-white/[0.04] py-2 pl-10 pr-3 text-xs text-white placeholder:text-gray-500 transition-all focus:border-amber-400/50 focus:bg-black/80 focus:ring-1 focus:ring-amber-400/20 focus:outline-none"
                                    />
                                </div>

                                <div className="max-h-[600px] space-y-2 overflow-y-auto pr-1">
                                    {filteredStaff.map((admin) => {
                                        const isSelected = selectedStaff?.id === admin.id;
                                        const adminIsSuper =
                                            Boolean(admin.is_super_admin) ||
                                            admin.role === 'Super Admin' ||
                                            admin.email === 'admin@msl.com';
                                        const totalGrants = adminIsSuper
                                            ? allPermissions.length
                                            : admin.effective_permissions_count ?? admin.permissions_count ?? 0;

                                        return (
                                            <button
                                                key={admin.id}
                                                type="button"
                                                onClick={() => setSelectedUserId(admin.id)}
                                                className={`group w-full rounded-xl border p-3.5 text-left transition-all ${
                                                    isSelected
                                                        ? 'border-amber-400/80 bg-amber-400/10 shadow-[0_0_20px_rgba(251,191,36,0.12)]'
                                                        : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between gap-1">
                                                    <p
                                                        className={`truncate text-xs font-bold ${
                                                            isSelected ? 'text-amber-400' : 'text-white'
                                                        }`}
                                                    >
                                                        {admin.name}
                                                    </p>
                                                    <span
                                                        className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold ${
                                                            adminIsSuper
                                                                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                                                                : 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                                                        }`}
                                                    >
                                                        {adminIsSuper ? 'Super Admin' : admin.role || 'Admin'}
                                                    </span>
                                                </div>

                                                <p className="mt-0.5 truncate text-[11px] text-gray-400">{admin.email}</p>

                                                <div className="mt-2 flex items-center justify-between text-[10px] text-gray-400">
                                                    <span>Effective Grants:</span>
                                                    <span className="font-semibold text-gray-300">
                                                        {adminIsSuper ? 'Full Root Access' : `${totalGrants} capabilities`}
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Right Column: Active Role or Staff Matrix Workspace */}
                <div className="lg:col-span-8 space-y-6">
                    {/* WORKSPACE VIEW 1: ROLE CAPABILITIES CONFIGURATOR */}
                    {workspaceTab === 'roles' && (
                        <>
                            {!selectedRole ? (
                                <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-12 text-center shadow-2xl">
                                    <Shield className="mx-auto mb-3 h-10 w-10 text-gray-500" />
                                    <h3 className="text-base font-bold text-white">No Role Selected</h3>
                                    <p className="mt-1 text-xs text-gray-400">
                                        Choose a role from the left to configure its assigned permissions.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Role Header Card */}
                                    <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-5 sm:p-6 shadow-2xl">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-black ${
                                                        isSelectedRoleSuper
                                                            ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-black shadow-lg shadow-amber-400/20'
                                                            : 'border border-amber-400/30 bg-amber-400/10 text-amber-400'
                                                    }`}
                                                >
                                                    <ShieldCheck className="h-7 w-7" />
                                                </div>
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h2 className="text-xl font-bold text-white">
                                                            {selectedRole.name}
                                                        </h2>
                                                        <span
                                                            className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                                                isSelectedRoleSuper
                                                                    ? 'border border-amber-400/40 bg-amber-400/10 text-amber-400'
                                                                    : 'border border-blue-500/40 bg-blue-500/10 text-blue-400'
                                                            }`}
                                                        >
                                                            {isSelectedRoleSuper
                                                                ? 'System Root Role'
                                                                : selectedRole.is_system
                                                                ? 'System Default Role'
                                                                : 'Custom Configured Role'}
                                                        </span>
                                                    </div>
                                                    <p className="mt-1 text-xs text-gray-400">
                                                        {selectedRole.description ||
                                                            'Custom administrative role assigned to designated staff.'}
                                                    </p>
                                                </div>
                                            </div>

                                            {isSelectedRoleSuper ? (
                                                <div className="inline-flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2.5 text-xs font-semibold text-amber-300">
                                                    <LockKeyhole className="h-4 w-4 text-amber-400 shrink-0" />
                                                    <span>Protected (All 24 Capabilities Inherited)</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={selectAllRolePermissions}
                                                        className="min-h-[40px] rounded-xl border border-white/10 bg-white/[0.04] px-4 text-xs font-bold text-gray-300 transition-colors hover:border-amber-400/50 hover:text-white"
                                                    >
                                                        Select All
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={clearAllRolePermissions}
                                                        className="min-h-[40px] rounded-xl border border-white/10 bg-white/[0.04] px-4 text-xs font-bold text-gray-300 transition-colors hover:border-red-500/50 hover:text-red-300"
                                                    >
                                                        Clear All
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {isSelectedRoleSuper ? (
                                            <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-4 sm:p-5 text-xs text-amber-200/90 leading-relaxed">
                                                <div className="flex items-start gap-3">
                                                    <Crown className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                                                    <div>
                                                        <strong className="text-amber-300">Full Platform Bypass:</strong> Super Admin has unconditional authorization across all admin modules, bypasses individual permission gates, and cannot be restricted.
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs text-gray-400">
                                                Staff assigned to <strong className="text-white">{selectedRole.name}</strong> automatically inherit all capabilities checked below. When you save modifications, all active staff with this role are updated instantly.
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
                                                    {isSelectedRoleSuper ? allPermissions.length : rolePermissions.length}
                                                </span>{' '}
                                                / {allPermissions.length} Enabled for Role
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

                                            const groupEnabledCount = isSelectedRoleSuper
                                                ? perms.length
                                                : perms.filter((p) => rolePermissions.includes(p.id)).length;
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

                                                            {!isSelectedRoleSuper && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => toggleRoleGroup(groupName)}
                                                                    className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                                                                >
                                                                    {isAllGroupSelected
                                                                        ? 'Deselect group'
                                                                        : 'Select group'}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Permissions Grid */}
                                                    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                                                        {perms.map((permission) => {
                                                            const isChecked =
                                                                isSelectedRoleSuper ||
                                                                rolePermissions.includes(permission.id);

                                                            return (
                                                                <button
                                                                    key={permission.id}
                                                                    type="button"
                                                                    onClick={() => toggleRolePermission(permission.id)}
                                                                    disabled={isSelectedRoleSuper}
                                                                    className={`group flex items-start justify-between gap-3 rounded-xl border p-4 text-left transition-all ${
                                                                        isChecked
                                                                            ? 'border-amber-400/50 bg-amber-400/[0.08] shadow-[0_0_15px_rgba(251,191,36,0.08)]'
                                                                            : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]'
                                                                    } ${isSelectedRoleSuper ? 'cursor-default' : 'cursor-pointer'}`}
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

                                                                    {/* Switch Toggle */}
                                                                    <div className="shrink-0 pt-0.5">
                                                                        {isSelectedRoleSuper ? (
                                                                            <span className="inline-flex items-center gap-1 rounded-md border border-amber-400/30 bg-amber-400/20 px-2 py-1 text-[10px] font-bold text-amber-300">
                                                                                <Check className="h-3 w-3" />
                                                                                Root
                                                                            </span>
                                                                        ) : (
                                                                            <div
                                                                                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                                                                    isChecked
                                                                                        ? 'bg-amber-400'
                                                                                        : 'bg-white/10'
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

                                    {/* Sticky Save Bar for Role */}
                                    {isRoleDirty && (
                                        <div className="sticky bottom-6 z-30 rounded-2xl border border-amber-400/40 bg-[#141416]/95 p-4 sm:p-5 backdrop-blur-xl shadow-2xl shadow-amber-400/10">
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/30">
                                                        <AlertCircle className="h-5 w-5" />
                                                    </span>
                                                    <div>
                                                        <p className="text-xs font-bold text-white">
                                                            Unsaved Role Modifications
                                                        </p>
                                                        <p className="text-[11px] text-gray-400">
                                                            You modified capabilities for role{' '}
                                                            <span className="text-amber-400 font-semibold">
                                                                '{selectedRole.name}'
                                                            </span>
                                                            . Saving will update access across all assigned staff.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2.5 self-end sm:self-center">
                                                    <button
                                                        type="button"
                                                        onClick={discardRoleChanges}
                                                        disabled={saving}
                                                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-xs font-bold text-gray-300 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
                                                    >
                                                        <Undo2 className="h-3.5 w-3.5" />
                                                        Discard
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={saveRolePermissions}
                                                        disabled={saving}
                                                        className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-amber-400 px-5 text-xs font-bold text-black shadow-lg shadow-amber-400/20 transition-all hover:bg-amber-300 active:scale-95 disabled:opacity-50"
                                                    >
                                                        <Save className="h-3.5 w-3.5" />
                                                        {saving ? 'Saving...' : 'Save Role Permissions'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}

                    {/* WORKSPACE VIEW 2: STAFF ACCOUNT ASSIGNMENT */}
                    {workspaceTab === 'staff' && (
                        <>
                            {!selectedStaff ? (
                                <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-12 text-center shadow-2xl">
                                    <Users className="mx-auto mb-3 h-10 w-10 text-gray-500" />
                                    <h3 className="text-base font-bold text-white">No Staff Selected</h3>
                                    <p className="mt-1 text-xs text-gray-400">
                                        Choose an administrator to inspect or reassign their role.
                                    </p>
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-5 sm:p-6 shadow-2xl space-y-6">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-black ${
                                                    isSelectedStaffSuper
                                                        ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-black shadow-lg shadow-amber-400/20'
                                                        : 'border border-white/10 bg-white/5 text-white'
                                                }`}
                                            >
                                                {selectedStaff.name?.charAt(0)?.toUpperCase() || '?'}
                                            </div>
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h2 className="text-xl font-bold text-white">
                                                        {selectedStaff.name}
                                                    </h2>
                                                    <span
                                                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                                            isSelectedStaffSuper
                                                                ? 'border border-amber-400/40 bg-amber-400/10 text-amber-400'
                                                                : 'border border-blue-500/40 bg-blue-500/10 text-blue-400'
                                                        }`}
                                                    >
                                                        {isSelectedStaffSuper ? 'Super Admin' : selectedStaffRole}
                                                    </span>
                                                </div>
                                                <p className="mt-0.5 text-xs text-gray-400">{selectedStaff.email}</p>
                                            </div>
                                        </div>

                                        <Link
                                            href={route('admin.accounts.index')}
                                            className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-xs font-bold text-gray-300 hover:border-amber-400/40 hover:text-white"
                                        >
                                            <UserCog className="h-4 w-4 text-amber-400" />
                                            <span>Manage All Accounts</span>
                                        </Link>
                                    </div>

                                    {/* Role Selector Card */}
                                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                                            Assigned Role
                                        </h3>
                                        {isSelectedStaffSuper ? (
                                            <p className="text-xs text-amber-300">
                                                Super Admin accounts bypass role restrictions and cannot be changed.
                                            </p>
                                        ) : (
                                            <div>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                                    <select
                                                        value={selectedStaffRole}
                                                        onChange={(e) => setSelectedStaffRole(e.target.value)}
                                                        className="min-h-[44px] rounded-xl border border-white/10 bg-[#161618] px-4 py-2 text-xs font-semibold text-white focus:border-amber-400 focus:outline-none sm:w-72"
                                                    >
                                                        {roles
                                                            .filter((r) => r.slug !== 'super_admin')
                                                            .map((r) => (
                                                                <option key={r.id} value={r.name} className="bg-[#18181b] text-white">
                                                                    {r.name} ({r.permissions_count} permissions)
                                                                </option>
                                                            ))}
                                                    </select>

                                                    {isStaffRoleDirty && (
                                                        <span className="text-xs font-semibold text-amber-400">
                                                            (Pending Role Change: {savedStaffRole} ➔ {selectedStaffRole})
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="mt-2 text-xs text-gray-400">
                                                    Switching roles immediately updates the set of capabilities this staff member inherits across the admin panel.
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Sticky Save Bar for Staff */}
                                    {isStaffDirty && (
                                        <div className="sticky bottom-6 z-30 rounded-2xl border border-amber-400/40 bg-[#141416]/95 p-4 sm:p-5 backdrop-blur-xl shadow-2xl shadow-amber-400/10">
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/30">
                                                        <AlertCircle className="h-5 w-5" />
                                                    </span>
                                                    <div>
                                                        <p className="text-xs font-bold text-white">
                                                            Unsaved Staff Modifications
                                                        </p>
                                                        <p className="text-[11px] text-gray-400">
                                                            Role updated for{' '}
                                                            <span className="text-amber-400 font-semibold">
                                                                {selectedStaff.name}
                                                            </span>
                                                            . Save to confirm the change.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2.5 self-end sm:self-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedStaffRole(savedStaffRole)}
                                                        disabled={saving}
                                                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-xs font-bold text-gray-300 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
                                                    >
                                                        <Undo2 className="h-3.5 w-3.5" />
                                                        Discard
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleSaveStaffChanges}
                                                        disabled={saving}
                                                        className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-amber-400 px-5 text-xs font-bold text-black shadow-lg shadow-amber-400/20 transition-all hover:bg-amber-300 active:scale-95 disabled:opacity-50"
                                                    >
                                                        <Save className="h-3.5 w-3.5" />
                                                        {saving ? 'Saving...' : 'Save Staff Changes'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* CREATE NEW ROLE MODAL */}
            {isCreateRoleModalOpen && typeof document !== 'undefined' && createPortal(
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md transition-all duration-200"
                    role="dialog"
                    aria-modal="true"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setIsCreateRoleModalOpen(false);
                    }}
                >
                    <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/15 bg-[#0f0f11]/95 backdrop-blur-2xl p-6 shadow-[0_20px_70px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-white">Create New Admin Role</h3>
                                    <p className="text-xs text-gray-400">
                                        Define a reusable role template with pre-assigned permissions.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsCreateRoleModalOpen(false)}
                                className="rounded-lg p-1.5 text-gray-400 hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {createRoleError && (
                            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                                {createRoleError}
                            </div>
                        )}

                        <form onSubmit={handleCreateRoleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-300 uppercase mb-1.5">
                                    Role Name <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={newRoleForm.name}
                                    onChange={(e) => setNewRoleForm({ ...newRoleForm, name: e.target.value })}
                                    placeholder="e.g. Tournament Manager, Content Moderator..."
                                    className="min-h-[44px] w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs text-white placeholder:text-gray-500 focus:border-amber-400/50 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-300 uppercase mb-1.5">
                                    Description (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={newRoleForm.description}
                                    onChange={(e) => setNewRoleForm({ ...newRoleForm, description: e.target.value })}
                                    placeholder="Brief explanation of this role's purpose..."
                                    className="min-h-[44px] w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs text-white placeholder:text-gray-500 focus:border-amber-400/50 focus:outline-none"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-xs font-bold text-gray-300 uppercase">
                                        Assign Permissions ({newRoleForm.permissions.length} selected)
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setNewRoleForm({
                                                    ...newRoleForm,
                                                    permissions: allPermissions.map((p) => p.id),
                                                })
                                            }
                                            className="text-[11px] font-semibold text-amber-400 hover:text-amber-300"
                                        >
                                            Select All
                                        </button>
                                        <span className="text-gray-600">|</span>
                                        <button
                                            type="button"
                                            onClick={() => setNewRoleForm({ ...newRoleForm, permissions: [] })}
                                            className="text-[11px] font-semibold text-gray-400 hover:text-white"
                                        >
                                            Clear All
                                        </button>
                                    </div>
                                </div>

                                <div className="max-h-60 overflow-y-auto rounded-xl border border-white/10 bg-black/40 p-3 space-y-2">
                                    {allPermissions.map((perm) => {
                                        const isChecked = newRoleForm.permissions.includes(perm.id);
                                        return (
                                            <label
                                                key={perm.id}
                                                className={`flex items-start gap-2.5 rounded-lg p-2 transition-colors cursor-pointer ${
                                                    isChecked
                                                        ? 'bg-amber-400/10 border border-amber-400/30'
                                                        : 'hover:bg-white/5 border border-transparent'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => toggleNewRolePermission(perm.id)}
                                                    className="mt-0.5 rounded border-white/20 bg-black/60 text-amber-400 focus:ring-amber-400"
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs font-bold text-white">{perm.name}</p>
                                                    <p className="text-[11px] text-gray-400">{perm.description}</p>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateRoleModalOpen(false)}
                                    className="min-h-[40px] rounded-xl border border-white/10 bg-white/[0.04] px-4 text-xs font-bold text-gray-300 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-amber-400 px-5 text-xs font-bold text-black shadow-lg shadow-amber-400/20 hover:bg-amber-300 disabled:opacity-50"
                                >
                                    <Plus className="h-4 w-4 stroke-[3]" />
                                    {saving ? 'Creating Role...' : 'Create Role'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </AdminLayout>
    );
}
