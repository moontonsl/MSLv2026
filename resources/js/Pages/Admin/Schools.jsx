import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { createPortal } from 'react-dom';
import {
    School, Building2, MapPin, Search, Plus, Edit2, CheckCircle2,
    XCircle, Users, GraduationCap, Globe, Check, LoaderCircle,
    X, AlertTriangle, ArrowUpDown, Filter, BookOpen, ArrowRight,
    ExternalLink, Gamepad2, ShieldCheck
} from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';

const ACCENT = '#FBBF24';

export default function Schools({
    schools,
    activeTab = 'colleges',
    filters = {},
    regions = [],
    islands = ['Luzon', 'Visayas', 'Mindanao'],
    stats = {},
    enrolledLeaders = [],
}) {
    const [currentTab, setCurrentTab] = useState(activeTab);
    const [search, setSearch] = useState(filters.search ?? '');
    const [selectedRegion, setSelectedRegion] = useState(filters.region ?? '');
    const [selectedIsland, setSelectedIsland] = useState(filters.island ?? '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status ?? '');

    // Modals
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingSchool, setEditingSchool] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Enrolled Student Leaders Justification Modal & Filters
    const [isLeadersModalOpen, setIsLeadersModalOpen] = useState(false);
    const [selectedSchoolFilter, setSelectedSchoolFilter] = useState(null);
    const [leaderSearch, setLeaderSearch] = useState('');

    // Form data for create / edit
    const [formData, setFormData] = useState({
        type: 'college',
        name: '',
        acronym: '',
        region: 'NCR',
        island: 'Luzon',
        status: 'active',
        division: '',
        municipality: '',
        sector: 'public',
    });

    const schoolItems = schools?.data ?? [];
    const leadersList = enrolledLeaders || [];

    // Distinct list of universities represented in enrolled student leaders
    const uniqueUniversities = useMemo(() => {
        const set = new Set();
        leadersList.forEach(a => {
            if (a.university) set.add(a.university);
        });
        return Array.from(set);
    }, [leadersList]);

    // Student Leaders filtered for modal view
    const filteredLeaders = useMemo(() => {
        return leadersList.filter(leader => {
            const matchesSchool = !selectedSchoolFilter || leader.university === selectedSchoolFilter;
            const query = leaderSearch.toLowerCase().trim();
            const matchesSearch = !query ||
                leader.name?.toLowerCase().includes(query) ||
                leader.email?.toLowerCase().includes(query) ||
                leader.ml_ign?.toLowerCase().includes(query) ||
                String(leader.ml_id || '').includes(query) ||
                leader.course?.toLowerCase().includes(query) ||
                leader.university?.toLowerCase().includes(query);

            return matchesSchool && matchesSearch;
        });
    }, [leadersList, selectedSchoolFilter, leaderSearch]);

    // Active Card state indicators
    const hasLeadersFilter = Boolean(filters.with_leaders);
    const isCollegesActive = currentTab === 'colleges' && !selectedStatus && !hasLeadersFilter;
    const isActiveCampusesActive = currentTab === 'colleges' && selectedStatus === 'active';
    const isShsActive = currentTab === 'shs';
    const isLeadersActive = hasLeadersFilter || isLeadersModalOpen;

    useEffect(() => {
        if (isCreateModalOpen || editingSchool || isLeadersModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isCreateModalOpen, editingSchool, isLeadersModalOpen]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        applyFilters({ search });
    };

    const applyFilters = (overrides = {}) => {
        const query = {
            tab: currentTab,
            search: search || undefined,
            region: selectedRegion || undefined,
            island: selectedIsland || undefined,
            status: selectedStatus || undefined,
            with_leaders: hasLeadersFilter ? 1 : undefined,
            ...overrides,
        };

        // Strip undefined / empty
        Object.keys(query).forEach((key) => {
            if (query[key] === undefined || query[key] === '') delete query[key];
        });

        router.get(route('admin.school-management'), query, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleTabChange = (newTab) => {
        setCurrentTab(newTab);
        setSearch('');
        setSelectedRegion('');
        setSelectedIsland('');
        setSelectedStatus('');
        router.get(route('admin.school-management'), { tab: newTab }, {
            preserveScroll: true,
        });
    };

    // Click handlers for each of the 4 metric cards
    const handleFilterAllColleges = () => {
        setCurrentTab('colleges');
        setSelectedStatus('');
        applyFilters({ tab: 'colleges', status: '', with_leaders: undefined });
    };

    const handleFilterActiveColleges = () => {
        setCurrentTab('colleges');
        setSelectedStatus('active');
        applyFilters({ tab: 'colleges', status: 'active', with_leaders: undefined });
    };

    const handleFilterSHS = () => {
        handleTabChange('shs');
    };

    const handleOpenLeadersModal = (schoolName = null) => {
        setSelectedSchoolFilter(schoolName);
        setIsLeadersModalOpen(true);
    };

    const handleFilterCampusesWithLeaders = () => {
        setCurrentTab('colleges');
        setSelectedStatus('');
        applyFilters({ tab: 'colleges', status: '', with_leaders: 1 });
    };

    const handleResetFilters = () => {
        setSearch('');
        setSelectedRegion('');
        setSelectedIsland('');
        setSelectedStatus('');
        router.get(route('admin.school-management'), { tab: currentTab }, {
            preserveScroll: true,
        });
    };

    const openCreateModal = () => {
        setFormData({
            type: currentTab === 'shs' ? 'shs' : 'college',
            name: '',
            acronym: '',
            region: regions[0] || 'NCR',
            island: 'Luzon',
            status: 'active',
            division: '',
            municipality: '',
            sector: 'public',
        });
        setIsCreateModalOpen(true);
    };

    const openEditModal = (school) => {
        setEditingSchool(school);
        setFormData({
            name: school.name || '',
            acronym: school.acronym || '',
            region: school.region || 'NCR',
            island: school.island || 'Luzon',
            status: school.status || 'active',
        });
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        router.post(route('admin.schools.store'), formData, {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreateModalOpen(false);
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
            },
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (!editingSchool || isSubmitting) return;

        setIsSubmitting(true);
        router.put(route('admin.schools.update', editingSchool.id), formData, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingSchool(null);
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
            },
        });
    };

    const handleToggleStatus = (school) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        router.post(route('admin.schools.toggle-status', school.id), {}, {
            preserveScroll: true,
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <AdminLayout activeNavId="school-management" showGlobalSearch>
            <Head title="School Management | Command Center | MSL Philippines" />

            {/* Header Section */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20 shadow-[0_0_15px_rgba(251,191,36,0.15)]">
                            <School className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                                School Management
                            </h1>
                            <p className="text-xs text-gray-400 mt-0.5">
                                Directory and accreditation hub for higher education (CHED) and basic education (DepEd).
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Top Actions */}
                <div className="flex flex-wrap items-center gap-2">
                    <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search school, acronym, division..."
                                className="min-h-[40px] w-56 sm:w-72 rounded-xl border border-white/10 bg-black/40 pl-9 pr-3 text-xs text-white placeholder:text-gray-500 focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 focus:outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            className="min-h-[40px] rounded-xl bg-amber-400 px-4 text-xs font-bold text-black transition-all hover:bg-amber-300"
                        >
                            Search
                        </button>
                    </form>

                    <button
                        type="button"
                        id="add-institution-btn"
                        onClick={openCreateModal}
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-emerald-500 px-4 text-xs font-bold text-white transition-all hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add Institution</span>
                    </button>
                </div>
            </div>

            {/* Metric Summary Cards (Taste Skill Clickable Telemetry Cards) */}
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
                {/* 1. Colleges & Universities */}
                <button
                    type="button"
                    onClick={handleFilterAllColleges}
                    className={`group relative overflow-hidden rounded-2xl p-4 sm:p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.99] border cursor-pointer ${
                        isCollegesActive
                            ? 'border-amber-400 ring-2 ring-amber-400/40 bg-gradient-to-br from-amber-500/[0.18] via-amber-500/[0.08] to-transparent shadow-[0_0_20px_rgba(251,191,36,0.15)]'
                            : 'border-amber-500/20 bg-gradient-to-br from-amber-500/[0.08] to-transparent hover:border-amber-400/50'
                    }`}
                >
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                            <span>Higher Ed (CHED)</span>
                            {isCollegesActive && <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />}
                        </span>
                        <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 group-hover:scale-110 transition-transform">
                            <Building2 className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="mt-3 text-2xl font-black text-white sm:text-3xl font-display">
                        {(stats.total_colleges ?? 0).toLocaleString()}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">Colleges & Universities</p>
                    <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] font-semibold text-amber-400/80 group-hover:text-amber-300">
                        <span>{isCollegesActive ? '● Viewing All Colleges' : 'Click to view colleges'}</span>
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </div>
                </button>

                {/* 2. Active Campuses */}
                <button
                    type="button"
                    onClick={handleFilterActiveColleges}
                    className={`group relative overflow-hidden rounded-2xl p-4 sm:p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.99] border cursor-pointer ${
                        isActiveCampusesActive
                            ? 'border-emerald-400 ring-2 ring-emerald-400/40 bg-gradient-to-br from-emerald-500/[0.18] via-emerald-500/[0.08] to-transparent shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                            : 'border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.08] to-transparent hover:border-emerald-400/50'
                    }`}
                >
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                            <span>Active Campuses</span>
                            {isActiveCampusesActive && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                        </span>
                        <div className="p-2 rounded-xl bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 group-hover:scale-110 transition-transform">
                            <CheckCircle2 className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="mt-3 text-2xl font-black text-white sm:text-3xl font-display">
                        {(stats.active_colleges ?? 0).toLocaleString()}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">Active league participants</p>
                    <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] font-semibold text-emerald-400/80 group-hover:text-emerald-300">
                        <span>{isActiveCampusesActive ? '● Viewing Active Only' : 'Click to filter active'}</span>
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </div>
                </button>

                {/* 3. Senior High Schools */}
                <button
                    type="button"
                    onClick={handleFilterSHS}
                    className={`group relative overflow-hidden rounded-2xl p-4 sm:p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.99] border cursor-pointer ${
                        isShsActive
                            ? 'border-blue-400 ring-2 ring-blue-400/40 bg-gradient-to-br from-blue-500/[0.18] via-blue-500/[0.08] to-transparent shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                            : 'border-blue-500/20 bg-gradient-to-br from-blue-500/[0.08] to-transparent hover:border-blue-400/50'
                    }`}
                >
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                            <span>Basic Ed (DepEd)</span>
                            {isShsActive && <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />}
                        </span>
                        <div className="p-2 rounded-xl bg-blue-400/10 border border-blue-400/20 text-blue-400 group-hover:scale-110 transition-transform">
                            <GraduationCap className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="mt-3 text-2xl font-black text-white sm:text-3xl font-display">
                        {(stats.total_shs ?? 0).toLocaleString()}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">Senior High Schools</p>
                    <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] font-semibold text-blue-400/80 group-hover:text-blue-300">
                        <span>{isShsActive ? '● Viewing DepEd SHS' : 'Click to view SHS catalog'}</span>
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </div>
                </button>

                {/* 4. Enrolled Student Leaders */}
                <button
                    type="button"
                    onClick={() => handleOpenLeadersModal()}
                    className={`group relative overflow-hidden rounded-2xl p-4 sm:p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.99] border cursor-pointer ${
                        isLeadersActive
                            ? 'border-purple-400 ring-2 ring-purple-400/40 bg-gradient-to-br from-purple-500/[0.18] via-purple-500/[0.08] to-transparent shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                            : 'border-purple-500/20 bg-gradient-to-br from-purple-500/[0.08] to-transparent hover:border-purple-400/50'
                    }`}
                >
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/40 to-transparent" />
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                            <span>Student Leaders</span>
                            {isLeadersActive && <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />}
                        </span>
                        <div className="p-2 rounded-xl bg-purple-400/10 border border-purple-400/20 text-purple-400 group-hover:scale-110 transition-transform">
                            <Users className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="mt-3 text-2xl font-black text-white sm:text-3xl font-display">
                        {(stats.total_enrolled ?? 0).toLocaleString()}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">Registered campus leaders</p>
                    <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] font-semibold text-purple-400/80 group-hover:text-purple-300">
                        <span>Click to view {stats.total_enrolled ?? 0} student leaders</span>
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </div>
                </button>
            </div>

            {/* Filter and Tab Controls */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                {/* View Tabs */}
                <div className="flex rounded-xl border border-white/10 bg-black/40 p-1">
                    <button
                        type="button"
                        id="tab-colleges-btn"
                        onClick={() => handleTabChange('colleges')}
                        className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                            currentTab === 'colleges'
                                ? 'bg-amber-400 text-black shadow-sm'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <Building2 className="h-4 w-4" />
                        <span>Colleges & Universities ({stats.total_colleges?.toLocaleString() ?? 0})</span>
                    </button>
                    <button
                        type="button"
                        id="tab-shs-btn"
                        onClick={() => handleTabChange('shs')}
                        className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                            currentTab === 'shs'
                                ? 'bg-amber-400 text-black shadow-sm'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <BookOpen className="h-4 w-4" />
                        <span>Senior High Schools ({stats.total_shs?.toLocaleString() ?? 0})</span>
                    </button>
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap items-center gap-2">
                    {/* Island filter (for colleges) */}
                    {currentTab === 'colleges' && (
                        <select
                            value={selectedIsland}
                            onChange={(e) => {
                                setSelectedIsland(e.target.value);
                                applyFilters({ island: e.target.value });
                            }}
                            className="rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-xs font-semibold text-white focus:border-amber-400/50 focus:outline-none"
                        >
                            <option value="">All Islands</option>
                            {islands.map((isl) => (
                                <option key={isl} value={isl}>{isl}</option>
                            ))}
                        </select>
                    )}

                    {/* Region Filter */}
                    <select
                        value={selectedRegion}
                        onChange={(e) => {
                            setSelectedRegion(e.target.value);
                            applyFilters({ region: e.target.value });
                        }}
                        className="rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-xs font-semibold text-white focus:border-amber-400/50 focus:outline-none max-w-[160px] truncate"
                    >
                        <option value="">All Regions</option>
                        {regions.map((reg) => (
                            <option key={reg} value={reg}>{reg}</option>
                        ))}
                    </select>

                    {/* Status Filter (for colleges) */}
                    {currentTab === 'colleges' && (
                        <select
                            value={selectedStatus}
                            onChange={(e) => {
                                setSelectedStatus(e.target.value);
                                applyFilters({ status: e.target.value });
                            }}
                            className="rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-xs font-semibold text-white focus:border-amber-400/50 focus:outline-none"
                        >
                            <option value="">All Status</option>
                            <option value="active">Active Hubs</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    )}

                    {(search || selectedRegion || selectedIsland || selectedStatus) && (
                        <button
                            type="button"
                            onClick={handleResetFilters}
                            className="rounded-xl border border-white/10 px-3 py-2 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5"
                        >
                            Reset Filters
                        </button>
                    )}
                </div>
            </div>

            {/* Filter Active Notification Banner */}
            {Boolean(filters.with_leaders) && (
                <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-500/10 via-purple-500/5 to-transparent p-4 text-xs text-purple-200 shadow-lg">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                            <Users className="h-4 w-4" />
                        </div>
                        <div>
                            <span className="font-bold text-white">Filtering Campuses With Registered Student Leaders</span>
                            <p className="text-[11px] text-purple-300/80">Only displaying institutions that have registered student leaders in the active season.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => handleOpenLeadersModal()}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-purple-500/20 border border-purple-500/30 px-3 py-1.5 text-xs font-bold text-purple-200 hover:bg-purple-500/30 hover:text-white transition-colors cursor-pointer"
                        >
                            <span>View All {stats.total_enrolled ?? 0} Leaders</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => applyFilters({ with_leaders: undefined })}
                            className="rounded-xl border border-white/10 px-3 py-1.5 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                        >
                            Clear Filter
                        </button>
                    </div>
                </div>
            )}

            {/* School Table Container */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
                {schoolItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                        <School className="h-12 w-12 text-gray-600 mb-3" />
                        <p className="text-base font-bold text-white">No institutions found</p>
                        <p className="text-xs text-gray-400 max-w-sm mt-1">
                            Try adjusting your search criteria or clearing selected region/status filters.
                        </p>
                        <button
                            type="button"
                            onClick={handleResetFilters}
                            className="mt-4 rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20 transition-colors"
                        >
                            Reset All Filters
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                    <th className="px-5 py-4">Institution Name</th>
                                    <th className="px-5 py-4">
                                        {currentTab === 'colleges' ? 'Jurisdiction & Island' : 'Division & Municipality'}
                                    </th>
                                    <th className="px-5 py-4">
                                        {currentTab === 'colleges' ? 'Status' : 'Region & Island'}
                                    </th>
                                    <th className="px-5 py-4">
                                        {currentTab === 'colleges' ? 'Student Leaders' : 'Classification'}
                                    </th>
                                    <th className="px-5 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-xs text-gray-300">
                                {schoolItems.map((school) => {
                                    const isCollege = school.type === 'college';
                                    const isActive = school.status === 'active';

                                    return (
                                        <tr
                                            key={`${school.type}-${school.id}`}
                                            className="transition-colors hover:bg-white/[0.02] group"
                                        >
                                            {/* Institution Name */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 font-bold text-white uppercase group-hover:border-amber-400/30 group-hover:bg-amber-400/10 transition-colors">
                                                        {school.acronym ? school.acronym.substring(0, 3) : school.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-white group-hover:text-amber-400 transition-colors">
                                                                {school.name}
                                                            </span>
                                                            {school.acronym && (
                                                                <span className="rounded-md border border-amber-400/30 bg-amber-400/10 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-amber-400">
                                                                    {school.acronym}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-gray-400 mt-0.5 text-[11px]">
                                                            <span>ID: #{school.id}</span>
                                                            <span>•</span>
                                                            <span className="text-gray-500 uppercase">{school.type}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Location / Division */}
                                            <td className="px-5 py-4">
                                                {isCollege ? (
                                                    <div className="space-y-1">
                                                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
                                                            <MapPin className="h-3 w-3" />
                                                            <span>{school.region}</span>
                                                        </span>
                                                        <span className="block text-[11px] text-gray-400">
                                                            Island: {school.island}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-0.5">
                                                        <p className="font-medium text-gray-200">{school.division || '—'}</p>
                                                        <p className="text-[11px] text-gray-400">{school.municipality || '—'}</p>
                                                    </div>
                                                )}
                                            </td>

                                            {/* Status / Region for SHS */}
                                            <td className="px-5 py-4">
                                                {isCollege ? (
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${
                                                            isActive
                                                                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                                                                : 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                                                        }`}
                                                    >
                                                        {isActive ? (
                                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                                        ) : (
                                                            <XCircle className="h-3.5 w-3.5" />
                                                        )}
                                                        <span className="capitalize">{school.status}</span>
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-xs font-bold text-blue-400">
                                                        <MapPin className="h-3 w-3" />
                                                        <span>{school.region}</span>
                                                    </span>
                                                )}
                                            </td>

                                            {/* Enrolled Student Leaders or Classification */}
                                            <td className="px-5 py-4">
                                                {isCollege ? (
                                                    school.students_count > 0 ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleOpenLeadersModal(school.name)}
                                                            title={`Click to view ${school.students_count} student leader${school.students_count > 1 ? 's' : ''} from ${school.name}`}
                                                            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-xs font-bold text-amber-300 hover:bg-amber-400/20 hover:border-amber-400/50 hover:scale-105 transition-all shadow-sm group/btn cursor-pointer"
                                                        >
                                                            <Users className="h-3.5 w-3.5 text-amber-400" />
                                                            <span>{school.students_count} {school.students_count === 1 ? 'student leader' : 'student leaders'}</span>
                                                            <ExternalLink className="h-3 w-3 text-amber-400/60 group-hover/btn:text-amber-300 transition-colors" />
                                                        </button>
                                                    ) : (
                                                        <div className="inline-flex items-center gap-1.5 rounded-xl border border-white/5 bg-white/[0.02] px-2.5 py-1 text-xs text-zinc-500">
                                                            <Users className="h-3.5 w-3.5 text-zinc-600" />
                                                            <span>0 student leaders</span>
                                                        </div>
                                                    )
                                                ) : (
                                                    <span className="text-[11px] text-gray-300">
                                                        {school.classification || 'Basic Ed / SHS'}
                                                    </span>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-5 py-4 text-right">
                                                {isCollege ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => openEditModal(school)}
                                                            className="inline-flex min-h-[34px] items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 text-xs font-medium text-gray-300 hover:border-amber-400/40 hover:text-white hover:bg-white/10 transition-colors"
                                                        >
                                                            <Edit2 className="h-3.5 w-3.5 text-amber-400" />
                                                            <span>Edit</span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleToggleStatus(school)}
                                                            disabled={isSubmitting}
                                                            className={`inline-flex min-h-[34px] items-center gap-1 rounded-xl border px-3 text-xs font-bold transition-all ${
                                                                isActive
                                                                    ? 'border-rose-500/20 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20'
                                                                    : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                                                            }`}
                                                        >
                                                            {isActive ? 'Deactivate' : 'Activate'}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-[11px] text-gray-500 italic">DepEd Catalog</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {schools?.links && schools.links.length > 3 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/10 px-6 py-4 gap-3">
                        <span className="text-xs text-gray-400">
                            Showing page {schools.current_page} of {schools.last_page} ({schools.total?.toLocaleString()} total records)
                        </span>
                        <div className="flex flex-wrap gap-1.5 justify-center">
                            {schools.links.map((link, idx) => (
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

            {/* CREATE INSTITUTION MODAL */}
            {isCreateModalOpen && typeof document !== 'undefined' && createPortal(
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-md transition-all duration-200"
                    role="dialog"
                    aria-modal="true"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setIsCreateModalOpen(false);
                    }}
                >
                    <div className={`w-full max-w-lg rounded-2xl border ${formData.type === 'shs' ? 'border-amber-500/30' : 'border-emerald-500/30'} bg-[#0f0f11]/95 backdrop-blur-2xl p-6 shadow-[0_20px_70px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in-95 duration-150`}>
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div className="flex items-center gap-2.5">
                                <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                                    formData.type === 'shs'
                                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                }`}>
                                    {formData.type === 'shs' ? (
                                        <BookOpen className="h-5 w-5" />
                                    ) : (
                                        <GraduationCap className="h-5 w-5" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-base font-black text-white">
                                        {formData.type === 'shs' ? 'Add Senior High School' : 'Add Higher Ed Institution'}
                                    </h3>
                                    <p className="text-xs text-gray-400">
                                        {formData.type === 'shs'
                                            ? 'Register a new DepEd Basic Education senior high school'
                                            : 'Register a new CHED accredited college or university'}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="rounded-lg p-1 text-gray-400 hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateSubmit} className="mt-5 space-y-4">
                            {/* Segmented Category Selection */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                    Institution Level / Category *
                                </label>
                                <div className="grid grid-cols-2 gap-2 rounded-xl bg-black/60 p-1 border border-white/10">
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, type: 'college' }))}
                                        className={`flex items-center justify-center gap-2 rounded-lg py-2 px-3 text-xs font-bold transition-all ${
                                            formData.type === 'college'
                                                ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                    >
                                        <GraduationCap className="h-4 w-4" />
                                        <span>College / University</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, type: 'shs' }))}
                                        className={`flex items-center justify-center gap-2 rounded-lg py-2 px-3 text-xs font-bold transition-all ${
                                            formData.type === 'shs'
                                                ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                    >
                                        <BookOpen className="h-4 w-4" />
                                        <span>Senior High School</span>
                                    </button>
                                </div>
                            </div>

                            {/* Common Name Field */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                    {formData.type === 'shs' ? 'School Name *' : 'Institution Name *'}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder={
                                        formData.type === 'shs'
                                            ? 'e.g. Ramon Magsaysay High School - Manila'
                                            : 'e.g. University of the Philippines Diliman'
                                    }
                                    className={`w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-white placeholder:text-gray-500 focus:outline-none ${
                                        formData.type === 'shs' ? 'focus:border-amber-400' : 'focus:border-emerald-400'
                                    }`}
                                />
                            </div>

                            {formData.type === 'college' ? (
                                <>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                                Acronym
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.acronym}
                                                onChange={(e) => setFormData({ ...formData, acronym: e.target.value })}
                                                placeholder="e.g. UPD"
                                                className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-white placeholder:text-gray-500 focus:border-emerald-400 focus:outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                                Island Group *
                                            </label>
                                            <select
                                                value={formData.island}
                                                onChange={(e) => setFormData({ ...formData, island: e.target.value })}
                                                className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs font-semibold text-white focus:border-emerald-400 focus:outline-none"
                                            >
                                                {islands.map((isl) => (
                                                    <option key={isl} value={isl}>{isl}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                                Region *
                                            </label>
                                            <select
                                                value={formData.region}
                                                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                                className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs font-semibold text-white focus:border-emerald-400 focus:outline-none"
                                            >
                                                {regions.map((reg) => (
                                                    <option key={reg} value={reg}>{reg}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                                Status *
                                            </label>
                                            <select
                                                value={formData.status}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs font-semibold text-white focus:border-emerald-400 focus:outline-none"
                                            >
                                                <option value="active">Active Hub</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                                Region *
                                            </label>
                                            <select
                                                value={formData.region}
                                                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                                className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs font-semibold text-white focus:border-amber-400 focus:outline-none"
                                            >
                                                {regions.map((reg) => (
                                                    <option key={reg} value={reg}>{reg}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                                Sector *
                                            </label>
                                            <select
                                                value={formData.sector}
                                                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                                                className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs font-semibold text-white focus:border-amber-400 focus:outline-none"
                                            >
                                                <option value="public">Public (DepEd / State)</option>
                                                <option value="private">Private</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                                Schools Division (SDO)
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.division}
                                                onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                                                placeholder="e.g. SDO Manila"
                                                className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-white placeholder:text-gray-500 focus:border-amber-400 focus:outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                                Municipality / City
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.municipality}
                                                onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                                                placeholder="e.g. Manila City"
                                                className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-white placeholder:text-gray-500 focus:border-amber-400 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/10 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-bold text-gray-300 hover:bg-white/5"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold transition-all disabled:opacity-50 ${
                                        formData.type === 'shs'
                                            ? 'bg-amber-400 text-black hover:bg-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                                            : 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Check className="h-4 w-4" />
                                            <span>
                                                {formData.type === 'shs' ? 'Save Senior High School' : 'Save Institution'}
                                            </span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {/* EDIT INSTITUTION MODAL */}
            {editingSchool && typeof document !== 'undefined' && createPortal(
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-md transition-all duration-200"
                    role="dialog"
                    aria-modal="true"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setEditingSchool(null);
                    }}
                >
                    <div className="w-full max-w-lg rounded-2xl border border-amber-400/30 bg-[#0f0f11]/95 backdrop-blur-2xl p-6 shadow-[0_20px_70px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
                                    <Edit2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-black text-white">Edit Institution</h3>
                                    <p className="text-xs text-gray-400">Update institution profile and league status</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEditingSchool(null)}
                                className="rounded-lg p-1 text-gray-400 hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="mt-5 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                    Institution Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-white placeholder:text-gray-500 focus:border-amber-400 focus:outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                        Acronym
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.acronym}
                                        onChange={(e) => setFormData({ ...formData, acronym: e.target.value })}
                                        className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-white placeholder:text-gray-500 focus:border-amber-400 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                        Island Group *
                                    </label>
                                    <select
                                        value={formData.island}
                                        onChange={(e) => setFormData({ ...formData, island: e.target.value })}
                                        className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs font-semibold text-white focus:border-amber-400 focus:outline-none"
                                    >
                                        {islands.map((isl) => (
                                            <option key={isl} value={isl}>{isl}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                        Region *
                                    </label>
                                    <select
                                        value={formData.region}
                                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                        className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs font-semibold text-white focus:border-amber-400 focus:outline-none"
                                    >
                                        {regions.map((reg) => (
                                            <option key={reg} value={reg}>{reg}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                        Status *
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs font-semibold text-white focus:border-amber-400 focus:outline-none"
                                    >
                                        <option value="active">Active Hub</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/10 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingSchool(null)}
                                    className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-bold text-gray-300 hover:bg-white/5"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-5 py-2.5 text-xs font-bold text-black hover:bg-amber-300 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(251,191,36,0.2)]"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                            <span>Updating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Check className="h-4 w-4" />
                                            <span>Update Institution</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {/* REGISTERED STUDENT LEADERS JUSTIFICATION MODAL */}
            {isLeadersModalOpen && typeof document !== 'undefined' && createPortal(
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 sm:p-6 backdrop-blur-md transition-all duration-200 animate-in fade-in duration-200"
                    role="dialog"
                    aria-modal="true"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setIsLeadersModalOpen(false);
                    }}
                >
                    <div className="w-full max-w-3xl max-h-[85vh] flex flex-col rounded-3xl border border-purple-500/30 bg-[#0f0f11]/95 backdrop-blur-2xl shadow-[0_20px_70px_rgba(0,0,0,0.6)] overflow-hidden my-auto">
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 bg-gradient-to-b from-purple-500/[0.08] to-transparent flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.25)]">
                                    <Users className="h-6 w-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-black text-white tracking-tight">
                                            Registered Campus Student Leaders Telemetry
                                        </h3>
                                        <span className="rounded-full border border-purple-400/30 bg-purple-400/10 px-2 py-0.5 text-[10px] font-mono font-bold uppercase text-purple-300">
                                            {filteredLeaders.length} Active Records
                                        </span>
                                    </div>
                                    <p className="text-xs text-zinc-400 mt-0.5">
                                        Data audit trail justifying the {stats.total_enrolled ?? 0} campus student leaders linked to accredited institutions.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsLeadersModalOpen(false)}
                                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Filter Bar */}
                        <div className="p-4 border-b border-white/5 bg-black/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            {/* School filter chips */}
                            <div className="flex flex-wrap items-center gap-1.5 text-xs">
                                <button
                                    type="button"
                                    onClick={() => setSelectedSchoolFilter(null)}
                                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                                        selectedSchoolFilter === null
                                            ? 'bg-purple-500 text-white shadow-sm'
                                            : 'bg-white/5 text-zinc-400 hover:text-white'
                                    }`}
                                >
                                    All Institutions ({leadersList.length})
                                </button>
                                {uniqueUniversities.map((uni) => {
                                    const count = leadersList.filter(a => a.university === uni).length;
                                    const shortName = uni
                                        .replace('University of the Philippines Manila', 'UP Manila')
                                        .replace('University of Santo Tomas Senior High School', 'UST SHS');
                                    return (
                                        <button
                                            key={uni}
                                            type="button"
                                            onClick={() => setSelectedSchoolFilter(uni)}
                                            className={`px-3 py-1.5 rounded-xl font-bold transition-all truncate max-w-[200px] cursor-pointer ${
                                                selectedSchoolFilter === uni
                                                    ? 'bg-purple-500 text-white shadow-sm'
                                                    : 'bg-white/5 text-zinc-400 hover:text-white'
                                            }`}
                                        >
                                            {shortName} ({count})
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Search */}
                            <div className="relative">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="search"
                                    value={leaderSearch}
                                    onChange={(e) => setLeaderSearch(e.target.value)}
                                    placeholder="Filter by name, IGN, ID, course..."
                                    className="h-8 w-full sm:w-48 rounded-xl border border-white/10 bg-black/40 pl-8 pr-3 text-xs text-white placeholder:text-gray-500 focus:border-purple-400/50 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Student Leaders List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-3">
                            {filteredLeaders.length === 0 ? (
                                <div className="text-center py-12 text-zinc-500 text-xs">
                                    No student leaders match the current search or school filter.
                                </div>
                            ) : (
                                filteredLeaders.map((leader) => (
                                    <div
                                        key={leader.id}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 shrink-0 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold flex items-center justify-center">
                                                {leader.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-white text-sm">{leader.name}</span>
                                                    <span className="text-[11px] text-zinc-400">({leader.email})</span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                                                    <span className="inline-flex items-center gap-1 font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                                                        <Gamepad2 className="h-3 w-3" />
                                                        <span>{leader.ml_ign || 'NO IGN'}</span>
                                                        <span className="text-amber-400/60 text-[10px]">[{leader.ml_id || 'N/A'}]</span>
                                                    </span>
                                                    <span className="text-zinc-500">•</span>
                                                    <span className="text-zinc-300 font-medium">{leader.course || 'Enrolled Student Leader'}</span>
                                                    <span className="text-zinc-500">•</span>
                                                    <span className="text-zinc-400 uppercase text-[10px] font-bold">{leader.division}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1.5 shrink-0">
                                            <span className="inline-flex items-center gap-1 rounded-full border border-purple-400/20 bg-purple-400/10 px-2.5 py-0.5 text-[11px] font-bold text-purple-300 max-w-[220px] truncate">
                                                <School className="h-3 w-3 shrink-0" />
                                                <span className="truncate">{leader.university}</span>
                                            </span>
                                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                                leader.status === 'active'
                                                    ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                                                    : leader.status === 'renewal-required'
                                                    ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                                                    : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                                            }`}>
                                                <span>● {leader.status}</span>
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-white/10 bg-black/40 flex flex-wrap items-center justify-between gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLeadersModalOpen(false);
                                    handleFilterCampusesWithLeaders();
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold hover:bg-purple-500/20 transition-all cursor-pointer"
                            >
                                <Building2 className="h-3.5 w-3.5" />
                                <span>Filter Table to Campuses with Leaders</span>
                            </button>

                            <div className="flex items-center gap-2">
                                <Link
                                    href="/admin/users/pending"
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 text-xs font-bold text-zinc-300 hover:text-white hover:bg-white/5 transition-all"
                                >
                                    <span>Open Verification Queue</span>
                                    <ExternalLink className="h-3.5 w-3.5" />
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => setIsLeadersModalOpen(false)}
                                    className="px-4 py-2 rounded-xl bg-white/10 text-xs font-bold text-white hover:bg-white/20 transition-all cursor-pointer"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </AdminLayout>
    );
}
