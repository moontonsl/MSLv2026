import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import {
    ShieldCheck, UserRound, Building2, MapPin, Search,
    Mail, CalendarDays, ArrowUp, ArrowDown, Eye, Phone,
    ExternalLink, X, Shield, Gamepad2, CheckCircle2, AlertTriangle,
    Users, Award, ChevronDown, Check, LoaderCircle, Globe, Crown,
    UserPlus, Sparkles, FileText, CheckCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

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
    filters = {},
    stats = {},
    regionsList = [],
}) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [selectedRegion, setSelectedRegion] = useState(filters.region ?? '');

    // Modals
    const [inspectAdmin, setInspectAdmin] = useState(null);
    const [promoteTarget, setPromoteTarget] = useState(null);
    const [demoteTarget, setDemoteTarget] = useState(null);

    // Search Student Modal States
    const [isSearchStudentModalOpen, setIsSearchStudentModalOpen] = useState(false);
    const [studentSearchQuery, setStudentSearchQuery] = useState('');
    const [studentSearchResults, setStudentSearchResults] = useState([]);
    const [isSearchingStudents, setIsSearchingStudents] = useState(false);
    const [hasSearchedStudents, setHasSearchedStudents] = useState(false);

    // Form states for promotion
    const [assignedRegion, setAssignedRegion] = useState(PHILIPPINE_REGIONS[0]);
    const [assignedDesignation, setAssignedDesignation] = useState(REGIONAL_DESIGNATIONS[0]);
    const [assignedCampus, setAssignedCampus] = useState('');
    const [demoteTargetRole, setDemoteTargetRole] = useState('Student');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (inspectAdmin || promoteTarget || demoteTarget || isSearchStudentModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [inspectAdmin, promoteTarget, demoteTarget, isSearchStudentModalOpen]);

    const adminItems = regionalAdmins?.data ?? [];

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        router.get(route('admin.regional-admin-management'), {
            search: search || undefined,
            region: selectedRegion || undefined,
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
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleClearFilters = () => {
        setSearch('');
        setSelectedRegion('');
        router.get(route('admin.regional-admin-management'), {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    // Live student search handler
    const handleSearchStudents = async (e) => {
        if (e) e.preventDefault();
        const q = studentSearchQuery.trim();
        if (!q) return;

        setIsSearchingStudents(true);
        setHasSearchedStudents(true);
        try {
            const res = await axios.get(route('admin.regional-admins.search-students'), {
                params: { q },
            });
            setStudentSearchResults(res.data || []);
        } catch (err) {
            console.error('Failed to search students:', err);
            setStudentSearchResults([]);
        } finally {
            setIsSearchingStudents(false);
        }
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
                setIsSearchStudentModalOpen(false);
                setInspectAdmin(null);
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
                                Regional website controllers and esports operations directors across the Philippines.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Top Action Bar */}
                <div className="flex flex-wrap items-center gap-2.5">
                    {/* Search Regional Admins Input */}
                    <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search admin, region, IGN..."
                                className="min-h-[40px] w-52 sm:w-64 rounded-xl border border-white/10 bg-black/40 pl-9 pr-3 text-xs text-white placeholder:text-gray-500 focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 focus:outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            className="min-h-[40px] rounded-xl border border-white/10 bg-white/5 px-3.5 text-xs font-semibold text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                        >
                            Filter
                        </button>
                    </form>

                    {/* Appoint Regional Admin Button */}
                    <button
                        type="button"
                        onClick={() => {
                            setStudentSearchQuery('');
                            setStudentSearchResults([]);
                            setHasSearchedStudents(false);
                            setIsSearchStudentModalOpen(true);
                        }}
                        className="min-h-[40px] flex items-center gap-2 rounded-xl bg-amber-400 px-4 text-xs font-bold text-black transition-all hover:bg-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.25)] hover:scale-[1.02]"
                    >
                        <UserPlus className="h-4 w-4" />
                        <span>Appoint Regional Admin</span>
                    </button>
                </div>
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

                {/* Verified Pool */}
                <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/[0.08] to-transparent p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Verified Pool</span>
                        <Users className="h-5 w-5 text-purple-400" />
                    </div>
                    <p className="mt-3 text-2xl font-black text-white sm:text-3xl">{stats.total_eligible ?? 0}</p>
                    <p className="mt-1 text-xs text-gray-400">Active students & leaders</p>
                </div>
            </div>

            {/* Filter Controls Row */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Active Appointees ({regionalAdmins?.total ?? adminItems.length})
                    </span>
                    {(search || selectedRegion) && (
                        <button
                            type="button"
                            onClick={handleClearFilters}
                            className="rounded-lg border border-white/10 px-2.5 py-1 text-[11px] font-medium text-amber-400 hover:bg-white/5"
                        >
                            Reset Filter
                        </button>
                    )}
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
                {adminItems.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-gray-500">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <h3 className="mt-4 text-base font-bold text-white">
                            No Regional Admins Found
                        </h3>
                        <p className="mt-1 text-xs text-gray-400 max-w-sm mx-auto">
                            No regional website controllers matched your filter criteria. Click "Appoint Regional Admin" to search and assign a student.
                        </p>
                        <div className="mt-5 flex items-center justify-center gap-3">
                            {(search || selectedRegion) && (
                                <button
                                    type="button"
                                    onClick={handleClearFilters}
                                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-gray-300 hover:bg-white/10"
                                >
                                    Clear Filters
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => {
                                    setStudentSearchQuery('');
                                    setStudentSearchResults([]);
                                    setHasSearchedStudents(false);
                                    setIsSearchStudentModalOpen(true);
                                }}
                                className="rounded-xl bg-amber-400 px-4 py-2 text-xs font-bold text-black hover:bg-amber-300 flex items-center gap-1.5"
                            >
                                <UserPlus className="h-3.5 w-3.5" />
                                <span>Appoint Regional Admin</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                    <th className="px-5 py-4">Admin Profile</th>
                                    <th className="px-5 py-4">Assigned Jurisdiction</th>
                                    <th className="px-5 py-4">Designation & Role</th>
                                    <th className="px-5 py-4">Campus Affiliation</th>
                                    <th className="px-5 py-4">MLBB Identity</th>
                                    <th className="px-5 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-xs text-gray-300">
                                {adminItems.map((user) => {
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
                                                            <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-amber-400">
                                                                RA
                                                            </span>
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

                                            {/* Designation */}
                                            <td className="px-5 py-4">
                                                <div className="space-y-0.5">
                                                    <span className="inline-flex items-center gap-1.5 font-bold text-amber-300">
                                                        <Shield className="h-3 w-3 text-amber-400" />
                                                        {user.division || 'Regional Director'}
                                                    </span>
                                                    <p className="text-[11px] text-gray-500">
                                                        Appointed {timeAgo(user.updated_at)}
                                                    </p>
                                                </div>
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
                                                        <span>{user.ml_ign || '—'}</span>
                                                    </div>
                                                    <div className="text-[11px] text-gray-400 font-mono">
                                                        ID: {user.ml_id || '—'} {user.ml_server ? `(${user.ml_server})` : ''}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setInspectAdmin(user)}
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />
                                                        <span>Details</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => openDemoteModal(user)}
                                                        className="inline-flex items-center gap-1 rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-colors"
                                                        title="Revoke Regional Admin"
                                                    >
                                                        <ArrowDown className="h-3.5 w-3.5" />
                                                        <span>Demote</span>
                                                    </button>
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
                {regionalAdmins?.links && regionalAdmins.links.length > 3 && (
                    <div className="flex items-center justify-between border-t border-white/10 px-5 py-3 text-xs text-gray-400">
                        <span>
                            Showing {regionalAdmins.from || 0} to {regionalAdmins.to || 0} of {regionalAdmins.total || 0} regional administrators
                        </span>
                        <div className="flex gap-1">
                            {regionalAdmins.links.map((link, idx) => (
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

            {/* ======================================================== */}
            {/* SEARCH STUDENT TO APPOINT AS REGIONAL ADMIN MODAL        */}
            {/* ======================================================== */}
            {isSearchStudentModalOpen && typeof document !== 'undefined' && createPortal(
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md transition-all duration-200"
                    role="dialog"
                    aria-modal="true"
                    onClick={(e) => { if (e.target === e.currentTarget) setIsSearchStudentModalOpen(false); }}
                >
                    <div className="w-full max-w-2xl rounded-2xl border border-amber-400/30 bg-[#0f0f11]/95 backdrop-blur-2xl p-6 shadow-[0_20px_70px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
                                    <UserPlus className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-base sm:text-lg font-bold text-white">
                                        Find Student to Appoint as Regional Admin
                                    </h3>
                                    <p className="text-xs text-gray-400">
                                        Search active students or student leaders to assign regional leadership
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsSearchStudentModalOpen(false)}
                                className="rounded-lg p-1 text-gray-400 hover:bg-white/10 hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Search Input Bar */}
                        <form onSubmit={handleSearchStudents} className="mt-4 flex gap-2 shrink-0">
                            <div className="relative flex-1">
                                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    autoFocus
                                    value={studentSearchQuery}
                                    onChange={(e) => setStudentSearchQuery(e.target.value)}
                                    placeholder="Search by student Name, Student ID, Email, Username, or MLBB IGN..."
                                    className="w-full rounded-xl border border-white/10 bg-black/60 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-gray-500 focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 focus:outline-none"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSearchingStudents || !studentSearchQuery.trim()}
                                className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 text-xs font-bold text-black transition-colors hover:bg-amber-300 disabled:opacity-50"
                            >
                                {isSearchingStudents ? (
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Search className="h-4 w-4" />
                                )}
                                <span>Search</span>
                            </button>
                        </form>

                        {/* Search Results Area */}
                        <div className="mt-4 flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-[220px]">
                            {isSearchingStudents ? (
                                <div className="py-12 text-center">
                                    <LoaderCircle className="h-8 w-8 animate-spin text-amber-400 mx-auto" />
                                    <p className="mt-3 text-xs text-gray-400">Searching verified students across the Philippines...</p>
                                </div>
                            ) : studentSearchResults.length > 0 ? (
                                studentSearchResults.map((student) => (
                                    <div
                                        key={student.id}
                                        className="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-amber-400/30 hover:bg-white/[0.04] transition-all"
                                    >
                                        <div className="flex items-start gap-3 min-w-0">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 font-bold text-amber-400 uppercase border border-amber-400/20">
                                                {student.name?.charAt(0) || 'U'}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-bold text-white text-sm truncate">
                                                        {student.name}
                                                    </span>
                                                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                                                        student.user_type === 'Student Leader'
                                                            ? 'border border-amber-400/40 bg-amber-400/15 text-amber-400'
                                                            : 'border border-blue-400/40 bg-blue-400/15 text-blue-400'
                                                    }`}>
                                                        {student.user_type}
                                                    </span>
                                                    {student.region && (
                                                        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                                                            {student.region}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-400 truncate mt-0.5">
                                                    {student.email} • ID: <span className="font-mono text-gray-300">{student.studentId || '—'}</span>
                                                </p>
                                                <p className="text-xs text-gray-400 truncate mt-0.5 flex items-center gap-1.5">
                                                    <Building2 className="h-3 w-3 text-amber-400 shrink-0" />
                                                    <span className="text-gray-300">{student.university || 'No campus specified'}</span>
                                                    {student.ml_ign && (
                                                        <span className="text-purple-400 ml-1">• MLBB: {student.ml_ign}</span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action buttons on card */}
                                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                            <button
                                                type="button"
                                                onClick={() => setInspectAdmin(student)}
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                                <span>View Details</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => openPromoteModal(student)}
                                                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-bold text-black hover:bg-amber-300 transition-colors shadow-[0_0_10px_rgba(251,191,36,0.2)]"
                                            >
                                                <ShieldCheck className="h-3.5 w-3.5" />
                                                <span>Promote</span>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : hasSearchedStudents ? (
                                <div className="py-12 text-center">
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-500">
                                        <Search className="h-5 w-5" />
                                    </div>
                                    <h4 className="mt-3 text-sm font-bold text-white">No Verified Students Found</h4>
                                    <p className="mt-1 text-xs text-gray-400 max-w-sm mx-auto">
                                        No active students or leaders matched "{studentSearchQuery}". Try checking the spelling or search by student ID or email.
                                    </p>
                                </div>
                            ) : (
                                <div className="py-12 text-center">
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-amber-400">
                                        <Sparkles className="h-5 w-5" />
                                    </div>
                                    <h4 className="mt-3 text-sm font-bold text-white">Search for a Student Candidate</h4>
                                    <p className="mt-1 text-xs text-gray-400 max-w-sm mx-auto">
                                        Type a student's full name, email, student ID, or MLBB IGN in the search bar above to view their verified credentials and appoint them as Regional Admin.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="mt-4 pt-3 border-t border-white/10 flex justify-end shrink-0">
                            <button
                                type="button"
                                onClick={() => setIsSearchStudentModalOpen(false)}
                                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* ======================================================== */}
            {/* APPOINT REGIONAL ADMIN CONFIGURATION MODAL               */}
            {/* ======================================================== */}
            {promoteTarget && typeof document !== 'undefined' && createPortal(
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md transition-all duration-200"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="appoint-ra-modal-title"
                    onClick={(e) => { if (e.target === e.currentTarget) setPromoteTarget(null); }}
                >
                    <div className="w-full max-w-lg rounded-2xl border border-amber-400/30 bg-[#0f0f11]/95 backdrop-blur-2xl p-6 shadow-[0_20px_70px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95 duration-150">
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
                        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3.5 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/20 font-bold text-amber-400 uppercase">
                                {promoteTarget.name?.charAt(0) || 'U'}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-bold text-white truncate">{promoteTarget.name}</p>
                                <p className="text-xs text-gray-400 truncate">
                                    {promoteTarget.email} • ID: <span className="font-mono text-gray-300">{promoteTarget.studentId || '—'}</span>
                                </p>
                                {promoteTarget.university && (
                                    <p className="text-xs text-amber-400/90 truncate mt-0.5">{promoteTarget.university}</p>
                                )}
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
                                    Affiliated University / Base Institution
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
                                    <span>Confirm & Appoint</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {/* ======================================================== */}
            {/* DEMOTE REGIONAL ADMIN MODAL                              */}
            {/* ======================================================== */}
            {demoteTarget && typeof document !== 'undefined' && createPortal(
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md transition-all duration-200"
                    role="dialog"
                    aria-modal="true"
                    onClick={(e) => { if (e.target === e.currentTarget) setDemoteTarget(null); }}
                >
                    <div className="w-full max-w-md rounded-2xl border border-red-500/30 bg-[#0f0f11]/95 backdrop-blur-2xl p-6 shadow-[0_20px_70px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-white">
                                    Revoke Regional Admin Rights
                                </h3>
                                <p className="text-xs text-gray-400">Demote appointee to standard membership</p>
                            </div>
                        </div>

                        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3 flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/20 font-bold text-red-400 uppercase">
                                {demoteTarget.name?.charAt(0) || 'U'}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-bold text-white text-xs truncate">{demoteTarget.name}</p>
                                <p className="text-[11px] text-gray-400 truncate">Current Region: {demoteTarget.region || 'Unassigned'}</p>
                            </div>
                        </div>

                        <p className="mt-4 text-xs text-gray-300 leading-relaxed">
                            Are you sure you want to revoke regional website controls for <strong className="text-white">{demoteTarget.name}</strong>?
                            They will immediately lose access to the Regional Admin Verification Hub and Tournament Center.
                        </p>

                        <div className="mt-4">
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                                Revert Role To
                            </label>
                            <select
                                value={demoteTargetRole}
                                onChange={(e) => setDemoteTargetRole(e.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-black/60 p-3 text-xs text-white focus:border-amber-400/50 focus:outline-none"
                            >
                                <option value="Student">Regular Student</option>
                                <option value="Student Leader">Student Leader</option>
                            </select>
                        </div>

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
                                className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-red-400 disabled:opacity-50"
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
                </div>,
                document.body
            )}

            {/* ======================================================== */}
            {/* VIEW CANDIDATE / ADMIN DETAILS MODAL                     */}
            {/* ======================================================== */}
            {inspectAdmin && typeof document !== 'undefined' && createPortal(
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md transition-all duration-200"
                    role="dialog"
                    aria-modal="true"
                    onClick={(e) => { if (e.target === e.currentTarget) setInspectAdmin(null); }}
                >
                    <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0f0f11]/95 backdrop-blur-2xl p-6 shadow-[0_20px_70px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
                                    <UserRound className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-white">
                                        {inspectAdmin.user_type === 'Regional Admin' ? 'Regional Admin Profile' : 'Candidate Details'}
                                    </h3>
                                    <p className="text-xs text-gray-400">Complete verified membership profile</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setInspectAdmin(null)}
                                className="rounded-lg p-1 text-gray-400 hover:bg-white/10 hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Top Identity Card */}
                        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/20 text-xl font-black text-amber-400 uppercase border border-amber-400/30">
                                        {inspectAdmin.name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="text-lg font-bold text-white">{inspectAdmin.name}</h3>
                                            <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-xs font-bold text-amber-400">
                                                {inspectAdmin.user_type}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            @{inspectAdmin.username || 'username'} • {inspectAdmin.email}
                                        </p>
                                    </div>
                                </div>

                                {inspectAdmin.user_type === 'Regional Admin' && (
                                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-right">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">Territory</span>
                                        <span className="text-xs font-bold text-white">{inspectAdmin.region || 'Unassigned'}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            {/* Academic Credentials */}
                            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-2.5">
                                <h4 className="flex items-center gap-2 font-bold uppercase tracking-wider text-amber-400">
                                    <Building2 className="h-4 w-4" /> Academic Credentials
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
                                <div>
                                    <span className="text-gray-500">Regional Location:</span>
                                    <p className="font-medium text-gray-300 mt-0.5">{inspectAdmin.region || 'Unspecified'}</p>
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

                            {/* Proof of Enrollment */}
                            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-2.5">
                                <h4 className="flex items-center gap-2 font-bold uppercase tracking-wider text-blue-400">
                                    <FileText className="h-4 w-4" /> Proof of Enrollment
                                </h4>
                                <div>
                                    <span className="text-gray-500">Enrollment Document:</span>
                                    {inspectAdmin.proofOfEnrollment ? (
                                        <div className="mt-1">
                                            <a
                                                href={`/uploads/proofs/${inspectAdmin.proofOfEnrollment}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:underline"
                                            >
                                                <span>View Uploaded Proof</span>
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </div>
                                    ) : (
                                        <p className="text-gray-400 mt-0.5 italic">No document on file</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer Actions */}
                        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                            <button
                                type="button"
                                onClick={() => setInspectAdmin(null)}
                                className="rounded-xl border border-white/10 px-5 py-2.5 text-xs font-bold text-gray-300 hover:bg-white/10 hover:text-white"
                            >
                                Close
                            </button>
                            {/* If candidate is not yet a Regional Admin, allow appointing directly from details modal */}
                            {inspectAdmin.user_type !== 'Regional Admin' && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        openPromoteModal(inspectAdmin);
                                    }}
                                    className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-xs font-bold text-black transition-colors hover:bg-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                                >
                                    <ShieldCheck className="h-4 w-4" />
                                    <span>Appoint as Regional Admin</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </AdminLayout>
    );
}
