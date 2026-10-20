import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ShieldCheck, UserRound, Building2, MapPin, Search,
    Mail, CalendarDays, ArrowUp, ArrowDown, Eye, Phone,
    ExternalLink, X, Shield, Gamepad2, CheckCircle2, AlertTriangle,
    Users, Award, ChevronDown, Check, LoaderCircle, Globe, Crown
} from 'lucide-react';
import { useState } from 'react';

const ACCENT = '#FBBF24';

const REGIONAL_DESIGNATIONS = [
    'Regional Director',
    'Regional Operations Lead',
    'Regional Tournament Officer',
    'Regional Esports & Community Head',
    'Regional Logistics Coordinator',
];

const PHILIPPINE_REGIONS = [
    'NCR',
    'Region I',
    'Region II',
    'Region III',
    'Region IV-A',
    'Region IV-B',
    'Region V',
    'Region VI',
    'Region VII',
    'Region VIII',
    'Region IX',
    'Region X',
    'Region XI',
    'Region XII',
    'CARAGA',
    'CAR',
    'BARMM',
];

function formatDate(value) {
    if (!value) return '—';
    return new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

function timeAgo(dateString) {
    if (!dateString) return '';
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.max(0, Math.floor((now - date) / 1000));

    if (diffInSeconds < 60) return 'Just now';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function RegionalAdmins({
    regionalAdmins,
    eligibleUsers,
    filters = {},
    stats = {},
    regionsList = [],
}) {
    const [activeTab, setActiveTab] = useState(filters.tab ?? 'admins');
    const [search, setSearch] = useState(filters.search ?? '');
    const [selectedRegion, setSelectedRegion] = useState(filters.region ?? '');

    // Modals
    const [inspectAdmin, setInspectAdmin] = useState(null);
    const [promoteTarget, setPromoteTarget] = useState(null);
    const [demoteTarget, setDemoteTarget] = useState(null);

    // Form states for promotion
    const [assignedRegion, setAssignedRegion] = useState(PHILIPPINE_REGIONS[0]);
    const [assignedDesignation, setAssignedDesignation] = useState(REGIONAL_DESIGNATIONS[0]);
    const [assignedCampus, setAssignedCampus] = useState('');
    const [demoteTargetRole, setDemoteTargetRole] = useState('Student');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const adminItems = regionalAdmins?.data ?? [];
    const eligibleItems = eligibleUsers?.data ?? [];
    const currentItems = activeTab === 'admins' ? adminItems : eligibleItems;
    const currentPaginator = activeTab === 'admins' ? regionalAdmins : eligibleUsers;

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        router.get(route('admin.regional-admin-management'), {
            search: search || undefined,
            region: selectedRegion || undefined,
            tab: activeTab,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleRegionFilter = (newRegion) => {
        setSelectedRegion(newRegion);
        router.get(route('admin.regional-admin-management'), {
            search: search || undefined,
            region: newRegion || undefined,
            tab: activeTab,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleClearFilters = () => {
        setSearch('');
        setSelectedRegion('');
        router.get(route('admin.regional-admin-management'), {
            tab: activeTab,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const openPromoteModal = (user) => {
        setPromoteTarget(user);
        setAssignedCampus(user.university || '');
        const validDesignation = REGIONAL_DESIGNATIONS.includes(user.division)
            ? user.division
            : REGIONAL_DESIGNATIONS[0];
        setAssignedDesignation(validDesignation);
        setAssignedRegion(user.region || 'NCR');
    };

    const openDemoteModal = (user) => {
        setDemoteTarget(user);
        setDemoteTargetRole(user.user_type === 'Student Leader' ? 'Student Leader' : 'Student');
    };

    const handlePromoteSubmit = (e) => {
        e.preventDefault();
        if (!promoteTarget || isSubmitting) return;

        setIsSubmitting(true);
        router.post(route('admin.users.promote-regional-admin', promoteTarget.id), {
            region: assignedRegion,
            division: assignedDesignation,
            university: assignedCampus,
        }, {
            preserveScroll: true,
            onFinish: () => {
                setIsSubmitting(false);
                setPromoteTarget(null);
            },
        });
    };

    const handleDemoteSubmit = () => {
        if (!demoteTarget || isSubmitting) return;

        setIsSubmitting(true);
        router.post(route('admin.users.demote-regional-admin', demoteTarget.id), {
            target_role: demoteTargetRole,
        }, {
            preserveScroll: true,
            onFinish: () => {
                setIsSubmitting(false);
                setDemoteTarget(null);
            },
        });
    };

    // Combine distinct regions for filtering
    const availableRegions = Array.from(new Set([
        ...regionsList,
        ...PHILIPPINE_REGIONS,
    ])).filter(Boolean).sort();

    return (
        <AdminLayout activeNavId="regional-admins" showGlobalSearch>
            <Head title="Regional Admins | Command Center | MSL Philippines" />

            {/* Header Section */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20 shadow-[0_0_15px_rgba(251,191,36,0.15)]">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                                Regional Admins
                            </h1>
                            <p className="text-xs text-gray-400 mt-0.5">
                                Regional website controllers and esports operations directors.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search name, region, IGN..."
                            className="min-h-[40px] w-56 sm:w-72 rounded-xl border border-white/10 bg-black/40 pl-9 pr-3 text-xs text-white placeholder:text-gray-500 focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 focus:outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        className="min-h-[40px] rounded-xl bg-amber-400 px-4 text-xs font-bold text-black transition-colors hover:bg-amber-300"
                    >
                        Search
                    </button>
                    {(search || selectedRegion) && (
                        <button
                            type="button"
                            onClick={handleClearFilters}
                            className="min-h-[40px] rounded-xl border border-white/10 px-3 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5"
                        >
                            Reset
                        </button>
                    )}
                </form>
            </div>

            {/* Metric Summary Cards */}
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
                {/* Active Regional Admins */}
                <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.08] to-transparent p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Regional Admins</span>
                        <ShieldCheck className="h-5 w-5 text-amber-400" />
                    </div>
                    <p className="mt-3 text-2xl font-black text-white sm:text-3xl">{stats.total_admins ?? 0}</p>
                    <p className="mt-1 text-xs text-gray-400">Territory controllers</p>
                </div>

                {/* Covered Regions */}
                <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.08] to-transparent p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Covered Hubs</span>
                        <MapPin className="h-5 w-5 text-emerald-400" />
                    </div>
                    <p className="mt-3 text-2xl font-black text-white sm:text-3xl">{stats.covered_regions ?? 0}</p>
                    <p className="mt-1 text-xs text-gray-400">Active regional territories</p>
                </div>

                {/* Covered Campuses */}
                <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/[0.08] to-transparent p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Campuses</span>
                        <Building2 className="h-5 w-5 text-blue-400" />
                    </div>
                    <p className="mt-3 text-2xl font-black text-white sm:text-3xl">{stats.total_campuses ?? 0}</p>
                    <p className="mt-1 text-xs text-gray-400">Affiliated institutions</p>
                </div>

                {/* Candidate Pool */}
                <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/[0.08] to-transparent p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Candidate Pool</span>
                        <Users className="h-5 w-5 text-purple-400" />
                    </div>
                    <p className="mt-3 text-2xl font-black text-white sm:text-3xl">{stats.total_eligible ?? 0}</p>
                    <p className="mt-1 text-xs text-gray-400">Verified leaders & students</p>
                </div>
            </div>

            {/* Filter Controls Row */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                {/* View Tabs */}
                <div className="flex rounded-xl border border-white/10 bg-black/40 p-1">
                    <button
                        type="button"
                        onClick={() => setActiveTab('admins')}
                        className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                            activeTab === 'admins'
                                ? 'bg-amber-400 text-black shadow-sm'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <ShieldCheck className="h-4 w-4" />
                        <span>Active Regional Admins ({regionalAdmins?.total ?? adminItems.length})</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('eligible')}
                        className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                            activeTab === 'eligible'
                                ? 'bg-amber-400 text-black shadow-sm'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <UserRound className="h-4 w-4" />
                        <span>Eligible Candidates ({eligibleUsers?.total ?? eligibleItems.length})</span>
                    </button>
                </div>

                {/* Region Filter */}
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-medium">Jurisdiction:</span>
                    <select
                        value={selectedRegion}
                        onChange={(e) => handleRegionFilter(e.target.value)}
                        className="rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-xs font-semibold text-white focus:border-amber-400/50 focus:outline-none"
                    >
                        <option value="">All Regions</option>
                        {availableRegions.map((reg) => (
                            <option key={reg} value={reg}>
                                {reg}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table Container */}
            <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden shadow-2xl">
                {currentItems.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-gray-500">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <h3 className="mt-4 text-base font-bold text-white">
                            {activeTab === 'admins' ? 'No Regional Admins Found' : 'No Eligible Candidates Found'}
                        </h3>
                        <p className="mt-1 text-xs text-gray-400 max-w-sm mx-auto">
                            {activeTab === 'admins'
                                ? 'No regional website controllers matched your filter criteria.'
                                : 'No verified students or leaders currently match the search criteria.'}
                        </p>
                        {(search || selectedRegion) && (
                            <button
                                type="button"
                                onClick={handleClearFilters}
                                className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-bold text-amber-400 hover:bg-amber-400/20"
                            >
                                Clear All Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                    <th className="px-5 py-4">Admin Profile</th>
                                    <th className="px-5 py-4">Assigned Jurisdiction</th>
                                    <th className="px-5 py-4">Campus Affiliation</th>
                                    <th className="px-5 py-4">MLBB Identity</th>
                                    <th className="px-5 py-4">Status & Role</th>
                                    <th className="px-5 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-xs text-gray-300">
                                {currentItems.map((user) => {
                                    const isRA = user.user_type === 'Regional Admin';
                                    return (
                                        <tr
                                            key={user.id}
                                            className="transition-colors hover:bg-white/[0.02] group"
                                        >
                                            {/* Profile */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 font-bold text-white uppercase group-hover:border-amber-400/30 group-hover:bg-amber-400/10 transition-colors">
                                                        {user.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-white group-hover:text-amber-400 transition-colors">
                                                                {user.name || 'Unnamed User'}
                                                            </span>
                                                            {isRA && (
                                                                <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-amber-400">
                                                                    RA
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-gray-400 mt-0.5">
                                                            <Mail className="h-3 w-3 text-gray-500" />
                                                            <span>{user.email || '—'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Jurisdiction */}
                                            <td className="px-5 py-4">
                                                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400">
                                                    <MapPin className="h-3 w-3" />
                                                    <span>{user.region || 'Unassigned'}</span>
                                                </span>
                                            </td>

                                            {/* Campus */}
                                            <td className="px-5 py-4">
                                                <div className="space-y-0.5">
                                                    <div className="flex items-center gap-1.5 font-medium text-gray-200">
                                                        <Building2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                                                        <span className="truncate max-w-[200px]" title={user.university}>
                                                            {user.university || 'Unassigned Campus'}
                                                        </span>
                                                    </div>
                                                    {user.course && (
                                                        <span className="text-[11px] text-gray-400">
                                                            {user.course} {user.year_level ? `• ${user.year_level}` : ''}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* MLBB Identity */}
                                            <td className="px-5 py-4">
                                                <div className="space-y-0.5">
                                                    <div className="flex items-center gap-1.5 font-bold text-white">
                                                        <Gamepad2 className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                                                        <span>{user.ml_ign || 'No IGN'}</span>
                                                    </div>
                                                    <p className="text-[11px] font-mono text-gray-400">
                                                        UID: {user.ml_id || '—'} {user.ml_server ? `(${user.ml_server})` : ''}
                                                    </p>
                                                    {user.ml_rank && (
                                                        <span className="inline-block text-[10px] uppercase font-bold text-amber-300/80">
                                                            {user.ml_rank}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Status & Role */}
                                            <td className="px-5 py-4 text-xs">
                                                {isRA ? (
                                                    <div>
                                                        <p className="font-bold text-amber-400">
                                                            {REGIONAL_DESIGNATIONS.includes(user.division) ? user.division : (user.division && !['college', 'shs'].includes(user.division.toLowerCase()) ? user.division : 'Regional Director')}
                                                        </p>
                                                        <p className="mt-0.5 text-gray-500">
                                                            Appointed {timeAgo(user.updated_at)}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 font-semibold text-purple-300">
                                                        {user.user_type === 'Student Leader' ? 'Student Leader' : 'Active Student'}
                                                    </span>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-5 py-4 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setInspectAdmin(user)}
                                                        className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />
                                                        <span>Dossier</span>
                                                    </button>

                                                    {isRA ? (
                                                        <button
                                                            type="button"
                                                            id={`demote-ra-btn-${user.id}`}
                                                            onClick={() => openDemoteModal(user)}
                                                            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-400 transition-colors hover:bg-red-500/20"
                                                        >
                                                            <ArrowDown className="h-3.5 w-3.5" />
                                                            <span>Demote</span>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            id={`promote-ra-btn-${user.id}`}
                                                            onClick={() => openPromoteModal(user)}
                                                            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl bg-amber-400 px-3.5 py-1.5 text-xs font-bold text-black transition-all hover:bg-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.15)]"
                                                        >
                                                            <ArrowUp className="h-3.5 w-3.5" />
                                                            <span>Appoint as RA</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {currentPaginator?.links && currentPaginator.links.length > 3 && (
                    <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
                        <span className="text-xs text-gray-400">
                            Showing page {currentPaginator.current_page} of {currentPaginator.last_page} ({currentPaginator.total} total)
                        </span>
                        <div className="flex gap-1.5">
                            {currentPaginator.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                                        link.active
                                            ? 'bg-amber-400 text-black'
                                            : 'border border-white/10 text-gray-300 hover:bg-white/5'
                                    } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* APPOINT REGIONAL ADMIN MODAL */}
            {promoteTarget && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="appoint-ra-modal-title"
                >
                    <div className="w-full max-w-lg rounded-2xl border border-amber-400/30 bg-[#141416] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 id="appoint-ra-modal-title" className="text-base font-bold text-white">
                                        Appoint Regional Admin
                                    </h3>
                                    <p className="text-xs text-gray-400">Assign territorial jurisdiction and operational role</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setPromoteTarget(null)}
                                className="rounded-lg p-1 text-gray-400 hover:bg-white/10 hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Candidate Summary Card */}
                        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/20 font-bold text-amber-400 uppercase">
                                {promoteTarget.name?.charAt(0) || 'U'}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-bold text-white truncate">{promoteTarget.name}</p>
                                <p className="text-xs text-gray-400 truncate">{promoteTarget.email} • MLBB: {promoteTarget.ml_ign || promoteTarget.ml_id || '—'}</p>
                            </div>
                        </div>

                        <form onSubmit={handlePromoteSubmit} className="mt-5 space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                                    Territorial Jurisdiction / Regional Hub <span className="text-amber-400">*</span>
                                </label>
                                <select
                                    required
                                    value={assignedRegion}
                                    onChange={(e) => setAssignedRegion(e.target.value)}
                                    className="w-full rounded-xl border border-white/10 bg-black/60 p-3 text-xs text-white focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 focus:outline-none"
                                >
                                    {availableRegions.map((reg) => (
                                        <option key={reg} value={reg}>
                                            {reg}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                                    Operational Designation / Role <span className="text-amber-400">*</span>
                                </label>
                                <select
                                    value={assignedDesignation}
                                    onChange={(e) => setAssignedDesignation(e.target.value)}
                                    className="w-full rounded-xl border border-white/10 bg-black/60 p-3 text-xs text-white focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 focus:outline-none"
                                >
                                    {REGIONAL_DESIGNATIONS.map((pos) => (
                                        <option key={pos} value={pos}>
                                            {pos}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                                    Affiliated University / Mother Institution
                                </label>
                                <input
                                    type="text"
                                    value={assignedCampus}
                                    onChange={(e) => setAssignedCampus(e.target.value)}
                                    placeholder="e.g. University of the Philippines Diliman"
                                    className="w-full rounded-xl border border-white/10 bg-black/60 p-3 text-xs text-white placeholder:text-gray-500 focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 focus:outline-none"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setPromoteTarget(null)}
                                    className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !assignedRegion}
                                    className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-xs font-bold text-black transition-colors hover:bg-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.2)] disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <LoaderCircle className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <ShieldCheck className="h-4 w-4" />
                                    )}
                                    <span>Appoint Regional Admin</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DEMOTE CONFIRMATION MODAL */}
            {demoteTarget && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="demote-ra-modal-title"
                >
                    <div className="w-full max-w-md rounded-2xl border border-red-500/30 bg-[#141416] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center gap-3 text-red-400 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 id="demote-ra-modal-title" className="text-base font-bold text-white">
                                    Demote Regional Admin
                                </h3>
                                <p className="text-xs text-gray-400">Revoke regional website and tournament control</p>
                            </div>
                        </div>

                        <p className="text-xs leading-relaxed text-gray-300">
                            Are you sure you want to demote <strong className="text-white font-semibold">{demoteTarget.name}</strong> from their Regional Admin position for <strong className="text-amber-400 font-semibold">{demoteTarget.region || 'their region'}</strong>?
                        </p>

                        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3 space-y-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                                Revert Role To:
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setDemoteTargetRole('Student')}
                                    className={`rounded-xl border p-2.5 text-center text-xs font-bold transition-all ${
                                        demoteTargetRole === 'Student'
                                            ? 'border-red-500/50 bg-red-500/15 text-white'
                                            : 'border-white/10 bg-black/30 text-gray-400 hover:text-white'
                                    }`}
                                >
                                    Regular Student
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDemoteTargetRole('Student Leader')}
                                    className={`rounded-xl border p-2.5 text-center text-xs font-bold transition-all ${
                                        demoteTargetRole === 'Student Leader'
                                            ? 'border-amber-400/50 bg-amber-400/15 text-amber-300'
                                            : 'border-white/10 bg-black/30 text-gray-400 hover:text-white'
                                    }`}
                                >
                                    Student Leader
                                </button>
                            </div>
                        </div>

                        <p className="mt-3 text-[11px] text-gray-400">
                            Their regional jurisdiction privileges will be immediately revoked. Their account credentials and MLBB record will remain intact.
                        </p>

                        <div className="mt-6 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setDemoteTarget(null)}
                                className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={handleDemoteSubmit}
                                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                ) : (
                                    <ArrowDown className="h-4 w-4" />
                                )}
                                <span>Confirm Demotion</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DOSSIER INSPECTOR MODAL */}
            {inspectAdmin && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="ra-dossier-modal-title"
                >
                    <div className="w-full max-w-2xl rounded-2xl border border-white/15 bg-[#141416] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/20 font-black text-amber-400 text-lg uppercase border border-amber-400/30">
                                    {inspectAdmin.name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 id="ra-dossier-modal-title" className="text-lg font-bold text-white">
                                            {inspectAdmin.name}
                                        </h3>
                                        <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-xs font-bold text-amber-400">
                                            {inspectAdmin.user_type}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {inspectAdmin.email} • ID: #{inspectAdmin.id}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setInspectAdmin(null)}
                                className="rounded-lg p-1.5 text-gray-400 hover:bg-white/10 hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Dossier Grid */}
                        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                            {/* Territorial Jurisdiction */}
                            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] p-4 space-y-2.5">
                                <h4 className="flex items-center gap-2 font-bold uppercase tracking-wider text-emerald-400">
                                    <MapPin className="h-4 w-4" /> Territorial Jurisdiction
                                </h4>
                                <div>
                                    <span className="text-gray-500">Assigned Regional Hub:</span>
                                    <p className="font-bold text-white mt-0.5 text-sm">{inspectAdmin.region || 'Unassigned'}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Designation / Role:</span>
                                    <p className="font-bold text-amber-400 mt-0.5">
                                        {inspectAdmin.user_type === 'Regional Admin'
                                            ? (REGIONAL_DESIGNATIONS.includes(inspectAdmin.division) ? inspectAdmin.division : (inspectAdmin.division && !['college', 'shs'].includes(inspectAdmin.division.toLowerCase()) ? inspectAdmin.division : 'Regional Director'))
                                            : (inspectAdmin.division || 'Regular Student')}
                                    </p>
                                </div>
                            </div>

                            {/* Academic Affiliation */}
                            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-2.5">
                                <h4 className="flex items-center gap-2 font-bold uppercase tracking-wider text-amber-400">
                                    <Building2 className="h-4 w-4" /> Academic Affiliation
                                </h4>
                                <div>
                                    <span className="text-gray-500">School / University:</span>
                                    <p className="font-semibold text-white mt-0.5">{inspectAdmin.university || 'Unspecified'}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Course & Year Level:</span>
                                    <p className="font-medium text-gray-300 mt-0.5">
                                        {inspectAdmin.course || '—'} {inspectAdmin.year_level ? `(${inspectAdmin.year_level})` : ''}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Student ID Number:</span>
                                    <p className="font-mono text-amber-300 mt-0.5">{inspectAdmin.studentId || '—'}</p>
                                </div>
                            </div>

                            {/* MLBB Identity */}
                            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-2.5">
                                <h4 className="flex items-center gap-2 font-bold uppercase tracking-wider text-purple-400">
                                    <Gamepad2 className="h-4 w-4" /> MLBB Credentials
                                </h4>
                                <div>
                                    <span className="text-gray-500">In-Game Name (IGN):</span>
                                    <p className="font-bold text-white mt-0.5">{inspectAdmin.ml_ign || '—'}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">User ID & Server:</span>
                                    <p className="font-mono text-gray-200 mt-0.5">
                                        {inspectAdmin.ml_id || '—'} {inspectAdmin.ml_server ? `(${inspectAdmin.ml_server})` : ''}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-500">In-Game Rank:</span>
                                    <p className="font-semibold text-gray-300 mt-0.5">{inspectAdmin.ml_rank || 'Unranked'}</p>
                                </div>
                            </div>

                            {/* Contact Details */}
                            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-2.5">
                                <h4 className="flex items-center gap-2 font-bold uppercase tracking-wider text-gray-400">
                                    <Phone className="h-4 w-4" /> Contact Information
                                </h4>
                                <div>
                                    <span className="text-gray-500">Mobile Phone:</span>
                                    <p className="font-semibold text-white mt-0.5">{inspectAdmin.contact_number || '—'}</p>
                                </div>
                                {inspectAdmin.facebook_link && (
                                    <div>
                                        <span className="text-gray-500">Facebook Profile:</span>
                                        <p className="mt-0.5">
                                            <a
                                                href={inspectAdmin.facebook_link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1 text-amber-400 hover:underline"
                                            >
                                                <span>View Facebook</span>
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setInspectAdmin(null)}
                                className="rounded-xl border border-white/10 px-5 py-2.5 text-xs font-bold text-gray-300 hover:bg-white/10 hover:text-white"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
