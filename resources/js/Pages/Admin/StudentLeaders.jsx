import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Crown, UserRound, GraduationCap, Building2, MapPin, Search,
    Mail, CalendarDays, ArrowUp, ArrowDown, Eye, Phone,
    ExternalLink, X, Shield, Gamepad2, CheckCircle2, AlertTriangle,
    Users, Award, ChevronDown, ChevronLeft, ChevronRight, Check, LoaderCircle,
    Sparkles, ArrowRight, Filter, RefreshCw
} from 'lucide-react';
import { useState, useMemo } from 'react';

const ACCENT = '#FBBF24';

const LEADERSHIP_POSITIONS = [
    'Chapter Lead / President',
    'Co-Lead / Vice President',
    'Tournament & Esports Director',
    'Community & Logistics Officer',
    'Creative & Media Lead',
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

export default function StudentLeaders({
    slUsers,
    students,
    filters = {},
    stats = {},
    regionsList = [],
    campusBreakdown = [],
    regionBreakdown = [],
    allLeaders = [],
    institutions = [],
}) {
    const [activeTab, setActiveTab] = useState(filters.tab ?? 'leaders');
    const [search, setSearch] = useState(filters.search ?? '');
    const [selectedRegion, setSelectedRegion] = useState(filters.region ?? '');

    // Action Modals
    const [inspectStudent, setInspectStudent] = useState(null);
    const [promoteTarget, setPromoteTarget] = useState(null);
    const [demoteTarget, setDemoteTarget] = useState(null);

    // Data Justification Modals (for Clickable Stat Cards)
    const [isLeadersModalOpen, setIsLeadersModalOpen] = useState(false);
    const [isCampusesModalOpen, setIsCampusesModalOpen] = useState(false);
    const [isRegionsModalOpen, setIsRegionsModalOpen] = useState(false);

    // Pagination & Search for Justification Modals (Strictly Limit 10 Always)
    const [leadersModalPage, setLeadersModalPage] = useState(1);
    const [leadersModalSearch, setLeadersModalSearch] = useState('');
    const [campusesModalPage, setCampusesModalPage] = useState(1);
    const [campusesModalSearch, setCampusesModalSearch] = useState('');
    const [regionsModalPage, setRegionsModalPage] = useState(1);

    // Form states for promotion
    const [assignedCampus, setAssignedCampus] = useState('');
    const [assignedDivision, setAssignedDivision] = useState(LEADERSHIP_POSITIONS[0]);
    const [assignedRegion, setAssignedRegion] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const slItems = slUsers?.data ?? [];
    const studentItems = students?.data ?? [];
    const currentItems = activeTab === 'leaders' ? slItems : studentItems;
    const currentPaginator = activeTab === 'leaders' ? slUsers : students;

    // Filtered lists for Justification Modals (10 per page)
    const filteredModalLeaders = useMemo(() => {
        const query = leadersModalSearch.toLowerCase().trim();
        if (!query) return allLeaders;
        return allLeaders.filter(l =>
            l.name?.toLowerCase().includes(query) ||
            l.email?.toLowerCase().includes(query) ||
            l.university?.toLowerCase().includes(query) ||
            l.ml_ign?.toLowerCase().includes(query) ||
            l.region?.toLowerCase().includes(query)
        );
    }, [allLeaders, leadersModalSearch]);

    const filteredModalCampuses = useMemo(() => {
        const query = campusesModalSearch.toLowerCase().trim();
        if (!query) return campusBreakdown;
        return campusBreakdown.filter(c =>
            c.university?.toLowerCase().includes(query) ||
            c.region?.toLowerCase().includes(query)
        );
    }, [campusBreakdown, campusesModalSearch]);

    // Modal Paginations (10 per page limit)
    const MODAL_PAGE_SIZE = 10;
    const paginatedModalLeaders = useMemo(() => {
        const start = (leadersModalPage - 1) * MODAL_PAGE_SIZE;
        return filteredModalLeaders.slice(start, start + MODAL_PAGE_SIZE);
    }, [filteredModalLeaders, leadersModalPage]);

    const paginatedModalCampuses = useMemo(() => {
        const start = (campusesModalPage - 1) * MODAL_PAGE_SIZE;
        return filteredModalCampuses.slice(start, start + MODAL_PAGE_SIZE);
    }, [filteredModalCampuses, campusesModalPage]);

    const paginatedModalRegions = useMemo(() => {
        const start = (regionsModalPage - 1) * MODAL_PAGE_SIZE;
        return regionBreakdown.slice(start, start + MODAL_PAGE_SIZE);
    }, [regionBreakdown, regionsModalPage]);

    const totalModalLeaderPages = Math.max(1, Math.ceil(filteredModalLeaders.length / MODAL_PAGE_SIZE));
    const totalModalCampusPages = Math.max(1, Math.ceil(filteredModalCampuses.length / MODAL_PAGE_SIZE));
    const totalModalRegionPages = Math.max(1, Math.ceil(regionBreakdown.length / MODAL_PAGE_SIZE));

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        router.get(route('admin.sl-management'), {
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
        router.get(route('admin.sl-management'), {
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
        router.get(route('admin.sl-management'), {
            tab: activeTab,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const openPromoteModal = (student) => {
        setPromoteTarget(student);
        setAssignedCampus(student.university || '');
        const validRole = LEADERSHIP_POSITIONS.includes(student.division)
            ? student.division
            : LEADERSHIP_POSITIONS[0];
        setAssignedDivision(validRole);
        setAssignedRegion(student.region || 'NCR');
    };

    const handleCampusInputChange = (value) => {
        setAssignedCampus(value);
        const match = institutions.find(i => i.name.toLowerCase() === value.toLowerCase());
        if (match && match.region) {
            setAssignedRegion(match.region);
        }
    };

    const handlePromoteSubmit = (e) => {
        e.preventDefault();
        if (!promoteTarget || isSubmitting) return;

        setIsSubmitting(true);
        router.post(route('admin.users.promote-sl', promoteTarget.id), {
            university: assignedCampus,
            division: assignedDivision,
            region: assignedRegion,
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
        router.post(route('admin.users.demote-sl', demoteTarget.id), {}, {
            preserveScroll: true,
            onFinish: () => {
                setIsSubmitting(false);
                setDemoteTarget(null);
            },
        });
    };

    return (
        <AdminLayout activeNavId="sl-management" showGlobalSearch>
            <Head title="Student Leader Management | MSL Admin" />

            {/* Header & Live Telemetry Badge */}
            <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold tracking-wider uppercase mb-3">
                        <Crown className="w-3.5 h-3.5" />
                        Moonton Student Leaders • Executive Operations
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
                        Student Leader <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-brand-400 to-amber-200">Management</span>
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-xl">
                        Appoint chapter officers, manage university jurisdictions, and monitor eligible student candidate pools.
                    </p>
                </div>

                {/* Status Telemetry & Quick Action */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2.5 bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-2.5 backdrop-blur-xl shadow-xl shadow-black/40 text-xs">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]"></span>
                        </span>
                        <span className="font-semibold text-zinc-300">
                            {stats.total_leaders ?? 0} Appointed Leaders
                        </span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-zinc-400">
                            {stats.total_campuses ?? 0} Active Chapters
                        </span>
                    </div>
                </div>
            </div>

            {/* Search and Filter Form */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <form onSubmit={handleSearchSubmit} className="flex w-full gap-2 sm:max-w-md">
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search leader, campus, MLBB IGN..."
                            className="min-h-[44px] w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-10 pr-4 text-xs sm:text-sm text-white placeholder:text-gray-500 transition-all focus:border-amber-400/50 focus:bg-black/80 focus:ring-2 focus:ring-amber-400/20 focus:outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-amber-400 px-5 text-xs sm:text-sm font-bold text-black transition-all hover:bg-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.2)] cursor-pointer"
                    >
                        Search
                    </button>
                    {(search || selectedRegion) && (
                        <button
                            type="button"
                            onClick={handleClearFilters}
                            className="min-h-[44px] rounded-xl border border-white/10 px-3.5 text-xs sm:text-sm font-semibold text-gray-400 hover:border-white/20 hover:text-white cursor-pointer"
                        >
                            Clear
                        </button>
                    )}
                </form>

                {/* Region Selector */}
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-amber-400" /> Hub:
                    </span>
                    <select
                        value={selectedRegion}
                        onChange={(e) => handleRegionFilter(e.target.value)}
                        className="min-h-[42px] rounded-xl border border-white/10 bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white focus:border-amber-400 focus:outline-none cursor-pointer"
                    >
                        <option value="">All Regions ({regionsList.length})</option>
                        {regionsList.map((reg) => (
                            <option key={reg} value={reg}>
                                {reg}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Clickable Stat Cards (Justification Modals) */}
            <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                {/* 1. Active Leaders Card */}
                <button
                    type="button"
                    id="card-active-leaders"
                    onClick={() => {
                        setLeadersModalPage(1);
                        setLeadersModalSearch('');
                        setIsLeadersModalOpen(true);
                    }}
                    className="group relative overflow-hidden rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-400/[0.09] via-amber-400/[0.02] to-transparent p-4 sm:p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/50 hover:shadow-[0_10px_25px_rgba(251,191,36,0.15)] cursor-pointer w-full focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Active Leaders</span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 group-hover:scale-110 transition-transform">
                            <Crown className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="mt-3 text-2xl font-black text-white sm:text-3xl">{stats.total_leaders ?? 0}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-amber-300/80">
                        <span>Official Chapter Heads</span>
                        <span className="inline-flex items-center gap-0.5 font-bold group-hover:translate-x-0.5 transition-transform">
                            View <ArrowRight className="h-3 w-3" />
                        </span>
                    </div>
                </button>

                {/* 2. Campuses Card */}
                <button
                    type="button"
                    id="card-campuses"
                    onClick={() => {
                        setCampusesModalPage(1);
                        setCampusesModalSearch('');
                        setIsCampusesModalOpen(true);
                    }}
                    className="group relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.09] via-emerald-500/[0.02] to-transparent p-4 sm:p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-[0_10px_25px_rgba(16,185,129,0.15)] cursor-pointer w-full focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Campuses</span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                            <Building2 className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="mt-3 text-2xl font-black text-white sm:text-3xl">{stats.total_campuses ?? 0}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-emerald-300/80">
                        <span>Affiliated University Chapters</span>
                        <span className="inline-flex items-center gap-0.5 font-bold group-hover:translate-x-0.5 transition-transform">
                            View <ArrowRight className="h-3 w-3" />
                        </span>
                    </div>
                </button>

                {/* 3. Regions Card */}
                <button
                    type="button"
                    id="card-regions"
                    onClick={() => {
                        setRegionsModalPage(1);
                        setIsRegionsModalOpen(true);
                    }}
                    className="group relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/[0.09] via-blue-500/[0.02] to-transparent p-4 sm:p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-[0_10px_25px_rgba(59,130,246,0.15)] cursor-pointer w-full focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Regional Hubs</span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                            <MapPin className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="mt-3 text-2xl font-black text-white sm:text-3xl">{stats.total_regions ?? 0}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-blue-300/80">
                        <span>Regional Jurisdiction Hubs</span>
                        <span className="inline-flex items-center gap-0.5 font-bold group-hover:translate-x-0.5 transition-transform">
                            View <ArrowRight className="h-3 w-3" />
                        </span>
                    </div>
                </button>

                {/* 4. Candidate Pool Card */}
                <button
                    type="button"
                    id="card-candidate-pool"
                    onClick={() => {
                        setActiveTab('students');
                        const tableElem = document.getElementById('sl-main-table');
                        if (tableElem) tableElem.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="group relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/[0.09] via-purple-500/[0.02] to-transparent p-4 sm:p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/50 hover:shadow-[0_10px_25px_rgba(168,85,247,0.15)] cursor-pointer w-full focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Candidate Pool</span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                            <Users className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="mt-3 text-2xl font-black text-white sm:text-3xl">{stats.total_students ?? 0}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-purple-300/80">
                        <span>Active Eligible Students</span>
                        <span className="inline-flex items-center gap-0.5 font-bold group-hover:translate-x-0.5 transition-transform">
                            Switch Tab <ArrowRight className="h-3 w-3" />
                        </span>
                    </div>
                </button>
            </div>

            {/* View Tabs */}
            <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex rounded-xl border border-white/10 bg-black/40 p-1">
                    <button
                        type="button"
                        onClick={() => setActiveTab('leaders')}
                        className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                            activeTab === 'leaders'
                                ? 'bg-amber-400 text-black shadow-lg shadow-amber-500/20'
                                : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
                        }`}
                    >
                        <Crown className="h-4 w-4" />
                        <span>Active Student Leaders ({slUsers?.total ?? slItems.length})</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('students')}
                        className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                            activeTab === 'students'
                                ? 'bg-amber-400 text-black shadow-lg shadow-amber-500/20'
                                : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
                        }`}
                    >
                        <UserRound className="h-4 w-4" />
                        <span>Eligible Candidates ({students?.total ?? studentItems.length})</span>
                    </button>
                </div>
            </div>

            {/* Main Table Card */}
            <section id="sl-main-table" className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
                {currentItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10 shadow-[0_0_20px_rgba(251,191,36,0.15)]">
                            <GraduationCap className="h-8 w-8 text-amber-400" />
                        </div>
                        <h2 className="text-lg font-bold text-white">
                            {activeTab === 'leaders' ? 'No Student Leaders Found' : 'No Eligible Candidates Found'}
                        </h2>
                        <p className="mt-1 text-sm text-gray-400 max-w-sm">
                            {activeTab === 'leaders'
                                ? 'There are currently no active Student Leaders matching your criteria. Promote eligible students from the Candidates tab.'
                                : 'There are no active regular students matching the current search.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[920px] table-auto text-left text-sm">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/[0.02] text-xs font-bold uppercase tracking-wider text-gray-400">
                                    <th className="px-5 py-4">Leader Profile</th>
                                    <th className="px-5 py-4">University Chapter</th>
                                    <th className="px-5 py-4">MLBB Identity</th>
                                    <th className="px-5 py-4">Region Hub</th>
                                    <th className="px-5 py-4">Status & Role</th>
                                    <th className="px-5 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-gray-300">
                                {currentItems.map((user) => {
                                    const isLeader = user.user_type === 'Student Leader';

                                    return (
                                        <tr key={user.id} className="transition-colors hover:bg-white/[0.02] group">
                                            {/* Profile */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border font-black ${
                                                        isLeader
                                                            ? 'border-amber-400/40 bg-neutral-900 text-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.2)]'
                                                            : 'border-white/10 bg-neutral-900 text-gray-300'
                                                    }`}>
                                                        {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-bold text-white group-hover:text-amber-300 transition-colors">
                                                                {user.name || 'Unnamed Student'}
                                                            </p>
                                                            {isLeader && (
                                                                <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                                                                    SL
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                                                            <Mail className="h-3 w-3 shrink-0" />
                                                            <span className="truncate">{user.email || '—'}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Chapter / University */}
                                            <td className="px-5 py-4">
                                                <div className="min-w-0">
                                                    <p className="flex items-center gap-1.5 font-semibold text-white">
                                                        <Building2 className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                                                        <span className="truncate">{user.university || 'Unassigned Campus'}</span>
                                                    </p>
                                                    <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                                                        <GraduationCap className="h-3 w-3 shrink-0 text-gray-500" />
                                                        <span>{user.course || 'Unspecified course'}</span>
                                                        {user.year_level && <span>• {user.year_level}</span>}
                                                    </p>
                                                </div>
                                            </td>

                                            {/* MLBB Identity */}
                                            <td className="px-5 py-4">
                                                <div className="min-w-0">
                                                    <p className="flex items-center gap-1.5 font-bold text-white">
                                                        <Gamepad2 className="h-3.5 w-3.5 shrink-0 text-blue-400" />
                                                        <span>{user.ml_ign || 'No IGN'}</span>
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-gray-400 font-mono">
                                                        UID: {user.ml_id || '—'} {user.ml_server ? `(${user.ml_server})` : ''}
                                                    </p>
                                                    {user.ml_rank && (
                                                        <span className="mt-1 inline-block rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-gray-300">
                                                            {user.ml_rank}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Region */}
                                            <td className="px-5 py-4">
                                                <span className="inline-flex items-center gap-1 rounded-full border border-blue-400/20 bg-blue-400/10 px-2.5 py-1 text-xs font-semibold text-blue-300">
                                                    <MapPin className="h-3 w-3" />
                                                    <span>{user.region || 'Unassigned'}</span>
                                                </span>
                                            </td>

                                            {/* Role / Position */}
                                            <td className="px-5 py-4 text-xs">
                                                {isLeader ? (
                                                    <div>
                                                        <p className="font-bold text-amber-400">
                                                            {LEADERSHIP_POSITIONS.includes(user.division) ? user.division : (user.division && !['college', 'shs'].includes(user.division.toLowerCase()) ? user.division : 'Chapter Lead / President')}
                                                        </p>
                                                        <p className="mt-0.5 text-gray-500">
                                                            Appointed {timeAgo(user.updated_at)}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 font-semibold text-emerald-400">
                                                        Active Student
                                                    </span>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-5 py-4 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setInspectStudent(user)}
                                                        className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-gray-300 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />
                                                        <span>Dossier</span>
                                                    </button>

                                                    {isLeader ? (
                                                        <button
                                                            type="button"
                                                            id={`demote-leader-btn-${user.id}`}
                                                            onClick={() => setDemoteTarget(user)}
                                                            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-400 transition-colors hover:bg-red-500/20 cursor-pointer"
                                                        >
                                                            <ArrowDown className="h-3.5 w-3.5" />
                                                            <span>Demote</span>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            id={`promote-leader-btn-${user.id}`}
                                                            onClick={() => openPromoteModal(user)}
                                                            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl bg-amber-400 px-3.5 py-1.5 text-xs font-bold text-black transition-all hover:bg-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.15)] cursor-pointer"
                                                        >
                                                            <ArrowUp className="h-3.5 w-3.5" />
                                                            <span>Promote to SL</span>
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
                {currentPaginator?.links?.length > 3 && (
                    <nav className="flex flex-wrap items-center justify-between border-t border-white/10 bg-white/[0.01] px-5 py-3 text-xs" aria-label="Pagination">
                        <span className="text-gray-400">
                            Showing page {currentPaginator.current_page} of {currentPaginator.last_page} ({currentPaginator.total} total)
                        </span>
                        <div className="flex gap-1.5">
                            {currentPaginator.links.map((link, index) => (
                                <Link
                                    key={`${index}-${link.label}`}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`min-h-[34px] rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                                        link.active
                                            ? 'border-amber-400 bg-amber-400 text-black'
                                            : 'border-white/10 text-gray-300 hover:border-white/20 hover:text-white'
                                    } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                                />
                            ))}
                        </div>
                    </nav>
                )}
            </section>

            {/* ========================================================================= */}
            {/* 1. DATA JUSTIFICATION MODAL: ACTIVE STUDENT LEADERS (CENTERED, LIMIT 10)  */}
            {/* ========================================================================= */}
            {isLeadersModalOpen && (
                <div
                    className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center p-4 pt-14 sm:pt-20 pb-10 backdrop-blur-md bg-black/80"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="active-leaders-modal-title"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) setIsLeadersModalOpen(false);
                    }}
                >
                    <div className="w-full max-w-4xl max-h-[calc(100vh-6rem)] sm:max-h-[calc(100vh-8rem)] flex flex-col rounded-3xl border border-amber-400/30 bg-[#0F0F12] shadow-2xl animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
                        {/* Header */}
                        <div className="shrink-0 flex items-center justify-between border-b border-white/10 p-5 sm:p-6 bg-gradient-to-r from-amber-400/10 to-transparent">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                                    <Crown className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 id="active-leaders-modal-title" className="text-lg font-black text-white uppercase tracking-tight">
                                        Active Student Leaders Directory
                                    </h3>
                                    <p className="text-xs text-zinc-400">
                                        Data Justification • {filteredModalLeaders.length} registered chapter officers (Showing 10 per page)
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsLeadersModalOpen(false)}
                                className="rounded-xl p-2 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Search in Modal */}
                        <div className="shrink-0 p-4 sm:px-6 border-b border-white/5 bg-white/[0.01]">
                            <div className="relative">
                                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                                <input
                                    type="text"
                                    value={leadersModalSearch}
                                    onChange={(e) => {
                                        setLeadersModalSearch(e.target.value);
                                        setLeadersModalPage(1);
                                    }}
                                    placeholder="Filter by leader name, campus, IGN, or region..."
                                    className="w-full rounded-xl border border-white/10 bg-black/50 py-2 pl-10 pr-4 text-xs text-white placeholder:text-zinc-500 focus:border-amber-400/50 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Table (Strict Limit 10) */}
                        <div className="flex-1 overflow-y-auto min-h-[300px] p-4 sm:p-6">
                            {paginatedModalLeaders.length === 0 ? (
                                <div className="py-12 text-center text-xs text-zinc-400">
                                    No student leaders match your query.
                                </div>
                            ) : (
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-white/10 bg-white/[0.02] uppercase font-bold text-zinc-400">
                                            <th className="pb-3 px-3">Leader</th>
                                            <th className="pb-3 px-3">Campus Chapter</th>
                                            <th className="pb-3 px-3">Role</th>
                                            <th className="pb-3 px-3">Region</th>
                                            <th className="pb-3 px-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-zinc-300">
                                        {paginatedModalLeaders.map((leader) => (
                                            <tr key={leader.id} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="py-3 px-3">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 font-bold text-xs">
                                                            {leader.name ? leader.name.charAt(0).toUpperCase() : 'S'}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-white">{leader.name}</div>
                                                            <div className="text-[11px] text-zinc-500">{leader.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-3 font-semibold text-zinc-200">
                                                    {leader.university || 'Unassigned'}
                                                </td>
                                                <td className="py-3 px-3">
                                                    <span className="font-semibold text-amber-400">
                                                        {leader.division || 'Chapter Lead / President'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-3">
                                                    <span className="inline-flex items-center gap-1 rounded-full border border-blue-400/20 bg-blue-400/10 px-2 py-0.5 text-[11px] font-medium text-blue-300">
                                                        {leader.region || 'NCR'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-3 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setIsLeadersModalOpen(false);
                                                            setInspectStudent(leader);
                                                        }}
                                                        className="rounded-lg border border-white/10 px-2.5 py-1 text-[11px] font-bold text-zinc-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                                                    >
                                                        Dossier
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Footer with Limit 10 Pagination */}
                        <div className="shrink-0 flex items-center justify-between border-t border-white/10 p-4 sm:px-6 bg-white/[0.02] text-xs">
                            <span className="text-zinc-400">
                                Page {leadersModalPage} of {totalModalLeaderPages} ({filteredModalLeaders.length} leaders)
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    disabled={leadersModalPage === 1}
                                    onClick={() => setLeadersModalPage(p => Math.max(1, p - 1))}
                                    className="inline-flex items-center gap-1 rounded-xl border border-white/10 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 disabled:opacity-40 cursor-pointer"
                                >
                                    <ChevronLeft className="h-3.5 w-3.5" /> Previous
                                </button>
                                <button
                                    type="button"
                                    disabled={leadersModalPage >= totalModalLeaderPages}
                                    onClick={() => setLeadersModalPage(p => Math.min(totalModalLeaderPages, p + 1))}
                                    className="inline-flex items-center gap-1 rounded-xl border border-white/10 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 disabled:opacity-40 cursor-pointer"
                                >
                                    Next <ChevronRight className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* 2. DATA JUSTIFICATION MODAL: AFFILIATED CAMPUSES (CENTERED, LIMIT 10)     */}
            {/* ========================================================================= */}
            {isCampusesModalOpen && (
                <div
                    className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center p-4 pt-14 sm:pt-20 pb-10 backdrop-blur-md bg-black/80"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="campuses-modal-title"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) setIsCampusesModalOpen(false);
                    }}
                >
                    <div className="w-full max-w-3xl max-h-[calc(100vh-6rem)] sm:max-h-[calc(100vh-8rem)] flex flex-col rounded-3xl border border-emerald-500/30 bg-[#0F0F12] shadow-2xl animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
                        {/* Header */}
                        <div className="shrink-0 flex items-center justify-between border-b border-white/10 p-5 sm:p-6 bg-gradient-to-r from-emerald-500/10 to-transparent">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                    <Building2 className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 id="campuses-modal-title" className="text-lg font-black text-white uppercase tracking-tight">
                                        Affiliated University Chapters
                                    </h3>
                                    <p className="text-xs text-zinc-400">
                                        Data Justification • {filteredModalCampuses.length} campuses with active student leaders (Showing 10 per page)
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsCampusesModalOpen(false)}
                                className="rounded-xl p-2 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Search in Campuses Modal */}
                        <div className="shrink-0 p-4 sm:px-6 border-b border-white/5 bg-white/[0.01]">
                            <div className="relative">
                                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                                <input
                                    type="text"
                                    value={campusesModalSearch}
                                    onChange={(e) => {
                                        setCampusesModalSearch(e.target.value);
                                        setCampusesModalPage(1);
                                    }}
                                    placeholder="Filter by university or region..."
                                    className="w-full rounded-xl border border-white/10 bg-black/50 py-2 pl-10 pr-4 text-xs text-white placeholder:text-zinc-500 focus:border-emerald-500/50 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Table (Strict Limit 10) */}
                        <div className="flex-1 overflow-y-auto min-h-[300px] p-4 sm:p-6">
                            {paginatedModalCampuses.length === 0 ? (
                                <div className="py-12 text-center text-xs text-zinc-400">
                                    No campus chapters found matching your filter.
                                </div>
                            ) : (
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-white/10 bg-white/[0.02] uppercase font-bold text-zinc-400">
                                            <th className="pb-3 px-3">University / Campus Name</th>
                                            <th className="pb-3 px-3">Region Hub</th>
                                            <th className="pb-3 px-3">Appointed Leaders</th>
                                            <th className="pb-3 px-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-zinc-300">
                                        {paginatedModalCampuses.map((camp, idx) => (
                                             <tr key={`${camp.university}-${idx}`} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="py-3 px-3 font-bold text-white">
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="h-4 w-4 text-emerald-400 shrink-0" />
                                                        <span>{camp.university}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-3">
                                                    <span className="inline-flex items-center gap-1 rounded-full border border-blue-400/20 bg-blue-400/10 px-2 py-0.5 text-[11px] font-medium text-blue-300">
                                                        {camp.region || 'NCR'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-3 font-semibold text-emerald-400">
                                                    {camp.leaders_count} Leader{camp.leaders_count > 1 ? 's' : ''}
                                                </td>
                                                <td className="py-3 px-3 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setIsCampusesModalOpen(false);
                                                            setSearch(camp.university);
                                                            setActiveTab('leaders');
                                                            router.get(route('admin.sl-management'), {
                                                                search: camp.university,
                                                                tab: 'leaders',
                                                            }, { preserveState: true, preserveScroll: true });
                                                        }}
                                                        className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-300 hover:bg-emerald-500/20 transition-colors cursor-pointer"
                                                    >
                                                        <span>Filter Table</span>
                                                        <ArrowRight className="h-3 w-3" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Footer with Limit 10 Pagination */}
                        <div className="shrink-0 flex items-center justify-between border-t border-white/10 p-4 sm:px-6 bg-white/[0.02] text-xs">
                            <span className="text-zinc-400">
                                Page {campusesModalPage} of {totalModalCampusPages} ({filteredModalCampuses.length} campuses)
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    disabled={campusesModalPage === 1}
                                    onClick={() => setCampusesModalPage(p => Math.max(1, p - 1))}
                                    className="inline-flex items-center gap-1 rounded-xl border border-white/10 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 disabled:opacity-40 cursor-pointer"
                                >
                                    <ChevronLeft className="h-3.5 w-3.5" /> Previous
                                </button>
                                <button
                                    type="button"
                                    disabled={campusesModalPage >= totalModalCampusPages}
                                    onClick={() => setCampusesModalPage(p => Math.min(totalModalCampusPages, p + 1))}
                                    className="inline-flex items-center gap-1 rounded-xl border border-white/10 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 disabled:opacity-40 cursor-pointer"
                                >
                                    Next <ChevronRight className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* 3. DATA JUSTIFICATION MODAL: REGIONAL HUBS (CENTERED, LIMIT 10)           */}
            {/* ========================================================================= */}
            {isRegionsModalOpen && (
                <div
                    className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center p-4 pt-14 sm:pt-20 pb-10 backdrop-blur-md bg-black/80"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="regions-modal-title"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) setIsRegionsModalOpen(false);
                    }}
                >
                    <div className="w-full max-w-2xl max-h-[calc(100vh-6rem)] sm:max-h-[calc(100vh-8rem)] flex flex-col rounded-3xl border border-blue-500/30 bg-[#0F0F12] shadow-2xl animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
                        {/* Header */}
                        <div className="shrink-0 flex items-center justify-between border-b border-white/10 p-5 sm:p-6 bg-gradient-to-r from-blue-500/10 to-transparent">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 id="regions-modal-title" className="text-lg font-black text-white uppercase tracking-tight">
                                        Regional Hubs Breakdown
                                    </h3>
                                    <p className="text-xs text-zinc-400">
                                        Data Justification • {regionBreakdown.length} active regional jurisdictions (Showing 10 per page)
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsRegionsModalOpen(false)}
                                className="rounded-xl p-2 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Table (Strict Limit 10) */}
                        <div className="flex-1 overflow-y-auto min-h-[300px] p-4 sm:p-6">
                            {paginatedModalRegions.length === 0 ? (
                                <div className="py-12 text-center text-xs text-zinc-400">
                                    No regional leaders assigned yet.
                                </div>
                            ) : (
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-white/10 bg-white/[0.02] uppercase font-bold text-zinc-400">
                                            <th className="pb-3 px-3">Regional Hub</th>
                                            <th className="pb-3 px-3">Assigned Leaders</th>
                                            <th className="pb-3 px-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-zinc-300">
                                        {paginatedModalRegions.map((reg) => (
                                            <tr key={reg.region} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="py-3 px-3 font-bold text-white">
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <MapPin className="h-3.5 w-3.5 text-blue-400" />
                                                        {reg.region}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-3 font-semibold text-blue-400">
                                                    {reg.leaders_count} Leader{reg.leaders_count > 1 ? 's' : ''}
                                                </td>
                                                <td className="py-3 px-3 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setIsRegionsModalOpen(false);
                                                            handleRegionFilter(reg.region);
                                                        }}
                                                        className="inline-flex items-center gap-1 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-[11px] font-bold text-blue-300 hover:bg-blue-500/20 transition-colors cursor-pointer"
                                                    >
                                                        <span>Filter By Region</span>
                                                        <ArrowRight className="h-3 w-3" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Footer with Limit 10 Pagination */}
                        <div className="shrink-0 flex items-center justify-between border-t border-white/10 p-4 sm:px-6 bg-white/[0.02] text-xs">
                            <span className="text-zinc-400">
                                Page {regionsModalPage} of {totalModalRegionPages} ({regionBreakdown.length} regions)
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    disabled={regionsModalPage === 1}
                                    onClick={() => setRegionsModalPage(p => Math.max(1, p - 1))}
                                    className="inline-flex items-center gap-1 rounded-xl border border-white/10 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 disabled:opacity-40 cursor-pointer"
                                >
                                    <ChevronLeft className="h-3.5 w-3.5" /> Previous
                                </button>
                                <button
                                    type="button"
                                    disabled={regionsModalPage >= totalModalRegionPages}
                                    onClick={() => setRegionsModalPage(p => Math.min(totalModalRegionPages, p + 1))}
                                    className="inline-flex items-center gap-1 rounded-xl border border-white/10 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 disabled:opacity-40 cursor-pointer"
                                >
                                    Next <ChevronRight className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* PROMOTE TO STUDENT LEADER MODAL (CENTERED WITH SMART AUTOCOMPLETE)        */}
            {/* ========================================================================= */}
            {promoteTarget && (
                <div
                    className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center bg-black/80 p-4 pt-14 sm:pt-20 pb-10 backdrop-blur-md"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="promote-modal-title"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) setPromoteTarget(null);
                    }}
                >
                    <div className="w-full max-w-lg max-h-[calc(100vh-6rem)] sm:max-h-[calc(100vh-8rem)] overflow-y-auto rounded-2xl border border-amber-400/30 bg-[#121214] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
                                    <Crown className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 id="promote-modal-title" className="text-base font-bold text-white">
                                        Appoint Student Leader
                                    </h3>
                                    <p className="text-xs text-gray-400">Promote student to chapter leadership</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setPromoteTarget(null)}
                                className="text-gray-400 hover:text-white cursor-pointer"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Candidate Summary Pill */}
                        <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-800 font-bold text-amber-400">
                                {promoteTarget.name ? promoteTarget.name.charAt(0).toUpperCase() : 'S'}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-bold text-white text-sm">{promoteTarget.name}</p>
                                <p className="text-xs text-gray-400">{promoteTarget.email} • MLBB: {promoteTarget.ml_ign || '—'}</p>
                            </div>
                        </div>

                        {/* Appointment Form */}
                        <form onSubmit={handlePromoteSubmit} className="mt-4 space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                                    Assigned School / University Chapter <span className="text-amber-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    list="institution-options"
                                    value={assignedCampus}
                                    onChange={(e) => handleCampusInputChange(e.target.value)}
                                    placeholder="Type or select university chapter..."
                                    className="w-full rounded-xl border border-white/10 bg-black/60 p-3 text-xs text-white placeholder:text-gray-500 focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 focus:outline-none"
                                />
                                <datalist id="institution-options">
                                    {institutions.slice(0, 1000).map((inst, i) => (
                                        <option key={`${inst.name}-${i}`} value={inst.name}>
                                            {inst.region ? `[${inst.region}] ${inst.name}` : inst.name}
                                        </option>
                                    ))}
                                </datalist>
                                <span className="mt-1 block text-[10px] text-zinc-500">
                                    Auto-completes from official CHED/DepEd institutions registry
                                </span>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                                    Leadership Designation / Role <span className="text-amber-400">*</span>
                                </label>
                                <select
                                    value={assignedDivision}
                                    onChange={(e) => setAssignedDivision(e.target.value)}
                                    className="w-full rounded-xl border border-white/10 bg-black/60 p-3 text-xs text-white focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 focus:outline-none"
                                >
                                    {LEADERSHIP_POSITIONS.map((pos) => (
                                        <option key={pos} value={pos}>
                                            {pos}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                                    Regional Hub / Region <span className="text-amber-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={assignedRegion}
                                    onChange={(e) => setAssignedRegion(e.target.value)}
                                    placeholder="e.g. NCR, Region IV-A, Region VII"
                                    className="w-full rounded-xl border border-white/10 bg-black/60 p-3 text-xs text-white placeholder:text-gray-500 focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 focus:outline-none"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setPromoteTarget(null)}
                                    className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !assignedCampus.trim()}
                                    className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-xs font-bold text-black transition-colors hover:bg-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.2)] disabled:opacity-50 cursor-pointer"
                                >
                                    {isSubmitting ? (
                                        <LoaderCircle className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Crown className="h-4 w-4" />
                                    )}
                                    <span>Appoint Student Leader</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* DEMOTE CONFIRMATION MODAL (CENTERED)                                      */}
            {/* ========================================================================= */}
            {demoteTarget && (
                <div
                    className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center bg-black/80 p-4 pt-14 sm:pt-20 pb-10 backdrop-blur-md"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="demote-modal-title"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) setDemoteTarget(null);
                    }}
                >
                    <div className="w-full max-w-md max-h-[calc(100vh-6rem)] sm:max-h-[calc(100vh-8rem)] overflow-y-auto rounded-2xl border border-red-500/30 bg-[#141416] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 id="demote-modal-title" className="text-base font-bold text-white">
                                    Demote Student Leader
                                </h3>
                                <p className="text-xs text-gray-400">Revert account to regular Student</p>
                            </div>
                        </div>

                        <div className="py-4 text-xs text-gray-300 leading-relaxed">
                            Are you sure you want to demote <strong className="text-white">{demoteTarget.name}</strong> from their Student Leader position?
                            <p className="mt-2 text-gray-400">
                                Their leadership designation and chapter management privileges will be revoked. Their account will remain an active student.
                            </p>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setDemoteTarget(null)}
                                className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={handleDemoteSubmit}
                                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-red-500 disabled:opacity-50 cursor-pointer"
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

            {/* ========================================================================= */}
            {/* STUDENT / LEADER DOSSIER MODAL (CENTERED)                                 */}
            {/* ========================================================================= */}
            {inspectStudent && (
                <div
                    className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center bg-black/85 p-4 pt-14 sm:pt-20 pb-10 backdrop-blur-md"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="inspect-dossier-title"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) setInspectStudent(null);
                    }}
                >
                    <div className="w-full max-w-2xl max-h-[calc(100vh-6rem)] sm:max-h-[calc(100vh-8rem)] overflow-y-auto rounded-3xl border border-white/15 bg-[#101012] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/10 text-amber-400">
                                    <UserRound className="h-6 w-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 id="inspect-dossier-title" className="text-lg font-bold text-white">
                                            {inspectStudent.name}
                                        </h3>
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                                            inspectStudent.user_type === 'Student Leader'
                                                ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
                                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                        }`}>
                                            {inspectStudent.user_type}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        {inspectStudent.email} • ID: #{inspectStudent.id}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setInspectStudent(null)}
                                className="rounded-xl p-2 text-gray-400 hover:bg-white/10 hover:text-white cursor-pointer"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            {/* Academic */}
                            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-2.5">
                                <h4 className="flex items-center gap-2 font-bold uppercase tracking-wider text-amber-400">
                                    <Building2 className="h-4 w-4" /> Academic Affiliation
                                </h4>
                                <div>
                                    <span className="text-gray-500">School / University:</span>
                                    <p className="font-semibold text-white mt-0.5">{inspectStudent.university || 'Unspecified'}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Course & Year Level:</span>
                                    <p className="font-semibold text-gray-200 mt-0.5">
                                        {inspectStudent.course || '—'} {inspectStudent.year_level ? `(${inspectStudent.year_level})` : ''}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Student ID Number:</span>
                                    <p className="font-mono text-amber-300 mt-0.5">{inspectStudent.studentId || '—'}</p>
                                </div>
                            </div>

                            {/* MLBB */}
                            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-2.5">
                                <h4 className="flex items-center gap-2 font-bold uppercase tracking-wider text-blue-400">
                                    <Gamepad2 className="h-4 w-4" /> MLBB Credentials
                                </h4>
                                <div>
                                    <span className="text-gray-500">In-Game Name (IGN):</span>
                                    <p className="font-bold text-white mt-0.5">{inspectStudent.ml_ign || '—'}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">User ID & Server:</span>
                                    <p className="font-mono text-gray-200 mt-0.5">
                                        {inspectStudent.ml_id || '—'} {inspectStudent.ml_server ? `(${inspectStudent.ml_server})` : ''}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-500">In-Game Rank:</span>
                                    <p className="font-semibold text-gray-300 mt-0.5">{inspectStudent.ml_rank || 'Unranked'}</p>
                                </div>
                            </div>

                            {/* Leadership / Region */}
                            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-2.5">
                                <h4 className="flex items-center gap-2 font-bold uppercase tracking-wider text-purple-400">
                                    <Award className="h-4 w-4" /> Leadership Position
                                </h4>
                                <div>
                                    <span className="text-gray-500">Role Designation:</span>
                                    <p className="font-bold text-amber-400 mt-0.5">
                                        {inspectStudent.user_type === 'Student Leader'
                                            ? (LEADERSHIP_POSITIONS.includes(inspectStudent.division) ? inspectStudent.division : (inspectStudent.division && !['college', 'shs'].includes(inspectStudent.division.toLowerCase()) ? inspectStudent.division : 'Chapter Lead / President'))
                                            : 'Regular Student'}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Assigned Region:</span>
                                    <p className="font-semibold text-white mt-0.5">{inspectStudent.region || 'Unassigned'}</p>
                                </div>
                            </div>

                            {/* Contact Details */}
                            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-2.5">
                                <h4 className="flex items-center gap-2 font-bold uppercase tracking-wider text-gray-400">
                                    <Phone className="h-4 w-4" /> Contact Information
                                </h4>
                                <div>
                                    <span className="text-gray-500">Mobile Phone:</span>
                                    <p className="font-semibold text-white mt-0.5">{inspectStudent.contact_number || '—'}</p>
                                </div>
                                {inspectStudent.facebook_link && (
                                    <div>
                                        <span className="text-gray-500">Facebook Profile:</span>
                                        <p className="mt-0.5">
                                            <a
                                                href={inspectStudent.facebook_link}
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
                                onClick={() => setInspectStudent(null)}
                                className="rounded-xl border border-white/10 px-5 py-2.5 text-xs font-bold text-gray-300 hover:bg-white/10 hover:text-white cursor-pointer"
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
