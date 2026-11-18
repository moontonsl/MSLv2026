import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Crown, UserRound, GraduationCap, Building2, MapPin, Search,
    Mail, Eye, Phone, ExternalLink, X, Shield, Gamepad2,
    AlertTriangle, Users, Award, ChevronDown, ChevronLeft,
    ChevronRight, LoaderCircle, ArrowRight, CheckCircle2
} from 'lucide-react';
import { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const DEFAULT_ROLE_OPTIONS = [
    'Student',
    'Student Leader',
    'Regional Admin',
    'Core Admin',
];

const LEADERSHIP_POSITIONS = [
    'Chapter Lead / President',
    'Co-Lead / Vice President',
    'Tournament & Esports Director',
    'Community & Logistics Officer',
    'Creative & Media Lead',
];

const PHILIPPINE_REGIONS = [
    'NCR',
    'CAR',
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
    'Region XIII',
    'CARAGA',
    'BARMM',
];

function normalizeTab(tab) {
    if (tab === 'students' || tab === 'Student') return 'Student';
    if (tab === 'leaders' || tab === 'Student Leader') return 'Student Leader';
    if (tab === 'regional_admins' || tab === 'Regional Admin') return 'Regional Admin';
    if (tab === 'core_admins' || tab === 'Core Admin') return 'Core Admin';
    return 'all';
}

function resolveUserRole(user) {
    if (!user) return 'Student';
    if (user.display_role) return user.display_role;
    if (user.user_type === 'Super Admin' || user.user_type === 'Core Admin') return 'Core Admin';
    return user.user_type || 'Student';
}

function resolveLeaderDivision(division) {
    if (!division) return 'Chapter Lead / President';
    if (LEADERSHIP_POSITIONS.includes(division)) return division;
    if (!['college', 'shs'].includes(division.toLowerCase())) return division;
    return 'Chapter Lead / President';
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

function RoleBadge({ role, size = 'sm' }) {
    const paddingClass = size === 'xs' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

    if (role === 'Student Leader') {
        return (
            <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-amber-400/30 bg-amber-400/10 font-bold text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.12)] ${paddingClass}`}>
                <Crown aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                <span>Student Leader</span>
            </span>
        );
    }

    if (role === 'Regional Admin') {
        return (
            <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-cyan-400/30 bg-cyan-500/10 font-bold text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.12)] ${paddingClass}`}>
                <MapPin aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
                <span>Regional Admin</span>
            </span>
        );
    }

    if (role === 'Core Admin') {
        return (
            <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-purple-400/35 bg-gradient-to-r from-purple-500/15 to-rose-500/15 font-bold text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.15)] ${paddingClass}`}>
                <Shield aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-purple-300" />
                <span>Core Admin</span>
            </span>
        );
    }

    return (
        <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-emerald-500/25 bg-emerald-500/10 font-semibold text-emerald-300 ${paddingClass}`}>
            <UserRound aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
            <span>Student</span>
        </span>
    );
}

function getRoleAvatarClasses(role) {
    if (role === 'Student Leader') {
        return 'border-amber-400/40 bg-neutral-900 text-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.2)]';
    }
    if (role === 'Regional Admin') {
        return 'border-cyan-400/40 bg-neutral-900 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.18)]';
    }
    if (role === 'Core Admin') {
        return 'border-purple-400/40 bg-neutral-900 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.2)]';
    }
    return 'border-emerald-500/25 bg-neutral-900 text-emerald-300';
}

function getRoleSelectClasses(role) {
    if (role === 'Student Leader') {
        return 'border-amber-400/35 text-amber-300 hover:border-amber-400/60 focus:border-amber-400 focus:ring-amber-400/25';
    }
    if (role === 'Regional Admin') {
        return 'border-cyan-400/35 text-cyan-300 hover:border-cyan-400/60 focus:border-cyan-400 focus:ring-cyan-400/25';
    }
    if (role === 'Core Admin') {
        return 'border-purple-400/35 text-purple-200 hover:border-purple-400/60 focus:border-purple-400 focus:ring-purple-400/25';
    }
    return 'border-emerald-500/30 text-emerald-300 hover:border-emerald-400/50 focus:border-emerald-400 focus:ring-emerald-400/25';
}

export default function StudentLeaders({
    accounts,
    slUsers,
    students,
    roleOptions = DEFAULT_ROLE_OPTIONS,
    filters = {},
    stats = {},
    regionsList = [],
    campusBreakdown = [],
    regionBreakdown = [],
    allLeaders = [],
    institutions = [],
}) {
    const [activeTab, setActiveTab] = useState(() => normalizeTab(filters.tab));
    const [search, setSearch] = useState(filters.search ?? '');
    const [selectedRegion, setSelectedRegion] = useState(filters.region ?? '');

    // Action & Inspection Modals
    const [inspectStudent, setInspectStudent] = useState(null);
    const [roleChangeTarget, setRoleChangeTarget] = useState(null);

    // Data Justification Modals
    const [isLeadersModalOpen, setIsLeadersModalOpen] = useState(false);
    const [isCampusesModalOpen, setIsCampusesModalOpen] = useState(false);
    const [isRegionsModalOpen, setIsRegionsModalOpen] = useState(false);

    // Pagination & Search for Justification Modals (Strictly Limit 10 Always)
    const [leadersModalPage, setLeadersModalPage] = useState(1);
    const [leadersModalSearch, setLeadersModalSearch] = useState('');
    const [campusesModalPage, setCampusesModalPage] = useState(1);
    const [campusesModalSearch, setCampusesModalSearch] = useState('');
    const [regionsModalPage, setRegionsModalPage] = useState(1);

    // Form states for Role Change Confirmation Modal
    const [modalRegion, setModalRegion] = useState('');
    const [modalCampus, setModalCampus] = useState('');
    const [modalDivision, setModalDivision] = useState('');
    const [modalSlRegion, setModalSlRegion] = useState('');
    const [roleErrors, setRoleErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const tabRefs = useRef({});

    useEffect(() => {
        setActiveTab(normalizeTab(filters.tab));
    }, [filters.tab]);

    useEffect(() => {
        setSearch(filters.search ?? '');
    }, [filters.search]);

    useEffect(() => {
        setSelectedRegion(filters.region ?? '');
    }, [filters.region]);

    useEffect(() => {
        const activeButton = tabRefs.current[activeTab];
        if (activeButton && typeof activeButton.scrollIntoView === 'function') {
            activeButton.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        }
    }, [activeTab]);

    const hasOpenModal = Boolean(
        isLeadersModalOpen ||
        isCampusesModalOpen ||
        isRegionsModalOpen ||
        roleChangeTarget ||
        inspectStudent
    );

    useEffect(() => {
        if (hasOpenModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [hasOpenModal]);

    useEffect(() => {
        if (!hasOpenModal) return undefined;
        const onKeyDown = (event) => {
            if (event.key !== 'Escape' || isSubmitting) return;
            if (roleChangeTarget) {
                setRoleChangeTarget(null);
                setRoleErrors({});
            } else if (inspectStudent) {
                setInspectStudent(null);
            } else if (isLeadersModalOpen) {
                setIsLeadersModalOpen(false);
            } else if (isCampusesModalOpen) {
                setIsCampusesModalOpen(false);
            } else if (isRegionsModalOpen) {
                setIsRegionsModalOpen(false);
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [
        hasOpenModal,
        isSubmitting,
        roleChangeTarget,
        inspectStudent,
        isLeadersModalOpen,
        isCampusesModalOpen,
        isRegionsModalOpen,
    ]);

    const availableRoles = useMemo(() => {
        return Array.isArray(roleOptions) && roleOptions.length > 0
            ? roleOptions
            : DEFAULT_ROLE_OPTIONS;
    }, [roleOptions]);

    const mergedRegionOptions = useMemo(() => {
        const set = new Set([...PHILIPPINE_REGIONS, ...(regionsList || [])]);
        if (roleChangeTarget?.user?.region) {
            set.add(roleChangeTarget.user.region);
        }
        return Array.from(set).filter(Boolean);
    }, [regionsList, roleChangeTarget]);

    // Unified Paginator with safe legacy fallback if `accounts` is omitted
    const currentPaginator = accounts ?? (activeTab === 'Student' ? students : slUsers);
    const currentItems = accounts?.data ?? (activeTab === 'Student' ? (students?.data ?? []) : (slUsers?.data ?? []));

    // Filtered lists for Justification Modals (10 per page)
    const filteredModalLeaders = useMemo(() => {
        const query = leadersModalSearch.toLowerCase().trim();
        if (!query) return allLeaders;
        return allLeaders.filter((l) =>
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
        return campusBreakdown.filter((c) =>
            c.university?.toLowerCase().includes(query) ||
            c.region?.toLowerCase().includes(query)
        );
    }, [campusBreakdown, campusesModalSearch]);

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

    const applyFilters = (nextTab, nextSearch, nextRegion) => {
        router.get(route('admin.sl-management'), {
            tab: nextTab,
            search: nextSearch || undefined,
            region: nextRegion || undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleTabChange = (nextTab, shouldScrollToTable = false) => {
        setActiveTab(nextTab);
        applyFilters(nextTab, search, selectedRegion);
        if (shouldScrollToTable) {
            const tableElem = document.getElementById('sl-main-table');
            if (tableElem) tableElem.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        applyFilters(activeTab, search, selectedRegion);
    };

    const handleRegionFilter = (newRegion) => {
        setSelectedRegion(newRegion);
        applyFilters(activeTab, search, newRegion);
    };

    const handleClearFilters = () => {
        setSearch('');
        setSelectedRegion('');
        applyFilters(activeTab, '', '');
    };

    const handleRoleSelect = (user, nextRole) => {
        const previousRole = resolveUserRole(user);
        if (!nextRole || nextRole === previousRole) return;

        setRoleErrors({});
        setModalRegion(user.region || '');
        setModalCampus(user.university || '');
        const initialDivision = user.division
            ? user.division
            : LEADERSHIP_POSITIONS[0];
        setModalDivision(initialDivision);
        setModalSlRegion(user.region || '');
        setRoleChangeTarget({
            user,
            newRole: nextRole,
            previousRole,
        });
    };

    const handleCampusInputChange = (value) => {
        setModalCampus(value);
        const match = institutions.find((i) => i.name.toLowerCase() === value.toLowerCase());
        if (match && match.region) {
            setModalSlRegion(match.region);
        }
    };

    const closeRoleChangeModal = () => {
        if (isSubmitting) return;
        setRoleChangeTarget(null);
        setRoleErrors({});
    };

    const handleRoleChangeSubmit = (e) => {
        e.preventDefault();
        if (!roleChangeTarget || isSubmitting) return;

        const { user, newRole } = roleChangeTarget;

        if (newRole === 'Regional Admin' && !modalRegion.trim()) {
            setRoleErrors({ region: 'Please select an assigned region for this Regional Admin.' });
            return;
        }

        const payload = {
            role: newRole,
        };

        if (newRole === 'Regional Admin') {
            payload.region = modalRegion.trim();
        } else if (newRole === 'Student Leader') {
            if (modalCampus.trim()) payload.university = modalCampus.trim();
            if (modalDivision.trim()) payload.division = modalDivision.trim();
            if (modalSlRegion.trim()) payload.region = modalSlRegion.trim();
        }

        setIsSubmitting(true);
        setRoleErrors({});

        router.post(route('admin.users.update-role', user.id), payload, {
            preserveScroll: true,
            onSuccess: () => {
                setRoleChangeTarget(null);
                setRoleErrors({});
            },
            onError: (errs) => {
                setRoleErrors(errs || {});
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    const roleTabs = [
        {
            id: 'all',
            label: 'All Accounts',
            count: stats.total_accounts ?? currentPaginator?.total ?? currentItems.length,
            icon: Users,
        },
        {
            id: 'Student',
            label: 'Students',
            count: stats.total_students ?? 0,
            icon: UserRound,
        },
        {
            id: 'Student Leader',
            label: 'Student Leaders',
            count: stats.total_leaders ?? 0,
            icon: Crown,
        },
        {
            id: 'Regional Admin',
            label: 'Regional Admins',
            count: stats.total_regional_admins ?? 0,
            icon: MapPin,
        },
        {
            id: 'Core Admin',
            label: 'Core Admins',
            count: stats.total_core_admins ?? 0,
            icon: Shield,
        },
    ];

    const divisionSelectOptions = useMemo(() => {
        const currentDiv = roleChangeTarget?.user?.division;
        if (currentDiv && !LEADERSHIP_POSITIONS.includes(currentDiv)) {
            return [currentDiv, ...LEADERSHIP_POSITIONS];
        }
        return LEADERSHIP_POSITIONS;
    }, [roleChangeTarget]);

    return (
        <AdminLayout activeNavId="sl-management" showGlobalSearch>
            <Head title="Account Management | MSL Admin" />

            {/* Header & Live Telemetry */}
            <div className="mb-6 flex flex-col gap-4 sm:mb-8 xl:flex-row xl:items-end xl:justify-between">
                <div className="min-w-0">
                    <div className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-400 sm:text-xs">
                        <Shield aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">Moonton Student Leaders • Unified Role Directory</span>
                    </div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-white [text-wrap:balance] sm:text-3xl xl:text-4xl">
                        Account <span className="bg-gradient-to-r from-amber-400 via-brand-400 to-amber-200 bg-clip-text text-transparent">Management</span>
                    </h1>
                    <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-zinc-400 sm:text-sm">
                        Manage all platform accounts, role assignments, campus chapters, and regional jurisdictions across Students, Student Leaders, Regional Admins, and Core Admins.
                    </p>
                </div>

                {/* Live Telemetry & Breakdown Shortcuts */}
                <div className="flex flex-wrap items-center gap-2">
                    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs shadow-xl shadow-black/40 backdrop-blur-xl sm:gap-2.5 sm:px-4">
                        <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]"></span>
                        </span>
                        <span className="font-semibold text-zinc-200">
                            {stats.total_accounts ?? 0} Accounts
                        </span>
                        <span className="text-zinc-600" aria-hidden="true">•</span>
                        <button
                            type="button"
                            onClick={() => {
                                setCampusesModalPage(1);
                                setCampusesModalSearch('');
                                setIsCampusesModalOpen(true);
                            }}
                            className="font-semibold text-emerald-400 underline-offset-4 hover:underline cursor-pointer"
                        >
                            {stats.total_campuses ?? 0} Chapters
                        </button>
                        <span className="text-zinc-600" aria-hidden="true">•</span>
                        <button
                            type="button"
                            onClick={() => {
                                setRegionsModalPage(1);
                                setIsRegionsModalOpen(true);
                            }}
                            className="font-semibold text-cyan-400 underline-offset-4 hover:underline cursor-pointer"
                        >
                            {stats.total_regions ?? 0} Hubs
                        </button>
                    </div>
                </div>
            </div>

            {/* KPI Stat Cards (Responsive Grid across all devices) */}
            <div className="mb-7 grid grid-cols-1 gap-3 min-[460px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 sm:gap-4">
                {/* 1. All Accounts */}
                <button
                    type="button"
                    id="card-all-accounts"
                    onClick={() => handleTabChange('all', true)}
                    className={`group relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-0.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400/40 sm:p-5 ${
                        activeTab === 'all'
                            ? 'border-amber-400/50 bg-gradient-to-br from-amber-400/[0.12] via-amber-400/[0.03] to-transparent shadow-[0_8px_25px_rgba(251,191,36,0.12)]'
                            : 'border-white/10 bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-transparent hover:border-amber-400/40'
                    }`}
                >
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">All Accounts</span>
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] text-amber-300 transition-transform group-hover:scale-110">
                            <Users aria-hidden="true" className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="mt-3 text-2xl font-black text-white sm:text-3xl">{stats.total_accounts ?? 0}</p>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-1.5 text-[11px] text-zinc-400">
                        <span>Verified Platform Users</span>
                        <span className="inline-flex shrink-0 items-center gap-0.5 font-bold text-amber-300 transition-transform group-hover:translate-x-0.5">
                            Filter <ArrowRight aria-hidden="true" className="h-3 w-3" />
                        </span>
                    </div>
                </button>

                {/* 2. Students */}
                <button
                    type="button"
                    id="card-active-students"
                    onClick={() => handleTabChange('Student', true)}
                    className={`group relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-0.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/40 sm:p-5 ${
                        activeTab === 'Student'
                            ? 'border-emerald-400/50 bg-gradient-to-br from-emerald-500/[0.14] via-emerald-500/[0.03] to-transparent shadow-[0_8px_25px_rgba(16,185,129,0.14)]'
                            : 'border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.08] via-emerald-500/[0.02] to-transparent hover:border-emerald-500/45'
                    }`}
                >
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Students</span>
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 transition-transform group-hover:scale-110">
                            <UserRound aria-hidden="true" className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="mt-3 text-2xl font-black text-white sm:text-3xl">{stats.total_students ?? 0}</p>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-1.5 text-[11px] text-emerald-300/80">
                        <span>Active Regular Students</span>
                        <span className="inline-flex shrink-0 items-center gap-0.5 font-bold transition-transform group-hover:translate-x-0.5">
                            Filter <ArrowRight aria-hidden="true" className="h-3 w-3" />
                        </span>
                    </div>
                </button>

                {/* 3. Student Leaders (Clickable Breakdown Modal) */}
                <button
                    type="button"
                    id="card-active-leaders"
                    onClick={() => {
                        setLeadersModalPage(1);
                        setLeadersModalSearch('');
                        setIsLeadersModalOpen(true);
                    }}
                    className={`group relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-0.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400/40 sm:p-5 ${
                        activeTab === 'Student Leader'
                            ? 'border-amber-400/55 bg-gradient-to-br from-amber-400/[0.15] via-amber-400/[0.03] to-transparent shadow-[0_8px_25px_rgba(251,191,36,0.15)]'
                            : 'border-amber-400/25 bg-gradient-to-br from-amber-400/[0.09] via-amber-400/[0.02] to-transparent hover:border-amber-400/50'
                    }`}
                >
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Student Leaders</span>
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-amber-400/25 bg-amber-400/10 text-amber-400 transition-transform group-hover:scale-110">
                            <Crown aria-hidden="true" className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="mt-3 text-2xl font-black text-white sm:text-3xl">{stats.total_leaders ?? 0}</p>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-1.5 text-[11px] text-amber-300/80">
                        <span>Chapter Officers</span>
                        <span className="inline-flex shrink-0 items-center gap-0.5 font-bold transition-transform group-hover:translate-x-0.5">
                            Breakdown <ArrowRight aria-hidden="true" className="h-3 w-3" />
                        </span>
                    </div>
                </button>

                {/* 4. Regional Admins */}
                <button
                    type="button"
                    id="card-regional-admins"
                    onClick={() => handleTabChange('Regional Admin', true)}
                    className={`group relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-0.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400/40 sm:p-5 ${
                        activeTab === 'Regional Admin'
                            ? 'border-cyan-400/55 bg-gradient-to-br from-cyan-500/[0.15] via-cyan-500/[0.03] to-transparent shadow-[0_8px_25px_rgba(34,211,238,0.14)]'
                            : 'border-cyan-500/20 bg-gradient-to-br from-cyan-500/[0.08] via-cyan-500/[0.02] to-transparent hover:border-cyan-400/45'
                    }`}
                >
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">Regional Admins</span>
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-500/10 text-cyan-300 transition-transform group-hover:scale-110">
                            <MapPin aria-hidden="true" className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="mt-3 text-2xl font-black text-white sm:text-3xl">{stats.total_regional_admins ?? 0}</p>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-1.5 text-[11px] text-cyan-300/80">
                        <span>Regional Coordinators</span>
                        <span className="inline-flex shrink-0 items-center gap-0.5 font-bold transition-transform group-hover:translate-x-0.5">
                            Filter <ArrowRight aria-hidden="true" className="h-3 w-3" />
                        </span>
                    </div>
                </button>

                {/* 5. Core Admins */}
                <button
                    type="button"
                    id="card-core-admins"
                    onClick={() => handleTabChange('Core Admin', true)}
                    className={`group relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-0.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400/40 min-[460px]:col-span-2 lg:col-span-1 sm:p-5 ${
                        activeTab === 'Core Admin'
                            ? 'border-purple-400/55 bg-gradient-to-br from-purple-500/[0.16] via-rose-500/[0.04] to-transparent shadow-[0_8px_25px_rgba(168,85,247,0.15)]'
                            : 'border-purple-500/20 bg-gradient-to-br from-purple-500/[0.09] via-rose-500/[0.02] to-transparent hover:border-purple-400/45'
                    }`}
                >
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-300">Core Admins</span>
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-purple-400/25 bg-purple-500/10 text-purple-300 transition-transform group-hover:scale-110">
                            <Shield aria-hidden="true" className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="mt-3 text-2xl font-black text-white sm:text-3xl">{stats.total_core_admins ?? 0}</p>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-1.5 text-[11px] text-purple-300/80">
                        <span>Executive Administrators</span>
                        <span className="inline-flex shrink-0 items-center gap-0.5 font-bold transition-transform group-hover:translate-x-0.5">
                            Filter <ArrowRight aria-hidden="true" className="h-3 w-3" />
                        </span>
                    </div>
                </button>
            </div>

            {/* Search and Region Filter Bar */}
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <form onSubmit={handleSearchSubmit} className="flex w-full flex-wrap gap-2 sm:flex-nowrap md:max-w-lg">
                    <div className="relative min-w-0 flex-1 basis-48">
                        <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="search"
                            aria-label="Search accounts"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search name, email, campus, MLBB IGN, or role..."
                            className="min-h-[44px] w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-10 pr-4 text-xs text-white transition-all placeholder:text-gray-500 focus:border-amber-400/50 focus:bg-black/80 focus:outline-none focus:ring-2 focus:ring-amber-400/20 sm:text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-xl bg-amber-400 px-4 text-xs font-bold text-black shadow-[0_0_15px_rgba(251,191,36,0.2)] transition-all hover:bg-amber-300 cursor-pointer sm:px-5 sm:text-sm"
                    >
                        Search
                    </button>
                    {(search || selectedRegion) && (
                        <button
                            type="button"
                            onClick={handleClearFilters}
                            className="min-h-[44px] shrink-0 rounded-xl border border-white/10 px-3.5 text-xs font-semibold text-gray-400 hover:border-white/20 hover:text-white cursor-pointer sm:text-sm"
                        >
                            Clear
                        </button>
                    )}
                </form>

                {/* Region Selector */}
                <div className="flex w-full min-w-0 items-center gap-2 md:w-auto">
                    <label htmlFor="region-hub-filter" className="flex shrink-0 items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                        <MapPin aria-hidden="true" className="h-3.5 w-3.5 text-amber-400" /> Hub:
                    </label>
                    <select
                        id="region-hub-filter"
                        value={selectedRegion}
                        onChange={(e) => handleRegionFilter(e.target.value)}
                        className="min-h-[44px] min-w-0 flex-1 rounded-xl border border-white/10 bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white focus:border-amber-400 focus:outline-none cursor-pointer md:flex-none"
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

            {/* Role Filter Tabs (Single-row horizontal scroll on compact screens — zero wrap overflow) */}
            <div className="mb-4 max-w-full overflow-x-auto pb-1">
                <div
                    role="group"
                    aria-label="Filter accounts by role"
                    className="inline-flex min-w-full items-center gap-1.5 rounded-2xl border border-white/10 bg-black/40 p-1.5 sm:min-w-0"
                >
                    {roleTabs.map((tabItem) => {
                        const Icon = tabItem.icon;
                        const isSelected = activeTab === tabItem.id;

                        return (
                            <button
                                key={tabItem.id}
                                ref={(el) => {
                                    tabRefs.current[tabItem.id] = el;
                                }}
                                type="button"
                                aria-pressed={isSelected}
                                onClick={() => handleTabChange(tabItem.id)}
                                className={`relative inline-flex min-h-[40px] flex-none items-center justify-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                                    isSelected
                                        ? 'bg-amber-400 text-black shadow-lg shadow-amber-500/20 after:absolute after:inset-x-2.5 after:bottom-0 after:border-b-2 after:border-black/40'
                                        : 'text-gray-400 hover:bg-white/[0.04] hover:text-white'
                                }`}
                            >
                                <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                                <span>{tabItem.label}</span>
                                <span
                                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${
                                        isSelected
                                            ? 'bg-black/15 text-black'
                                            : 'bg-white/10 text-zinc-300'
                                    }`}
                                >
                                    {tabItem.count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Accounts Directory Card */}
            <section id="sl-main-table" className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl backdrop-blur-xl">
                {currentItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10 shadow-[0_0_20px_rgba(251,191,36,0.15)]">
                            <Users aria-hidden="true" className="h-8 w-8 text-amber-400" />
                        </div>
                        <h2 className="text-lg font-bold text-white [text-wrap:balance]">
                            No Matching Accounts Found
                        </h2>
                        <p className="mt-1 max-w-sm text-sm text-gray-400">
                            No platform accounts match your current role filter, region hub, or search query.
                        </p>
                        {(search || selectedRegion || activeTab !== 'all') && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    setSelectedRegion('');
                                    setActiveTab('all');
                                    applyFilters('all', '', '');
                                }}
                                className="mt-4 inline-flex min-h-[40px] items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-bold text-amber-300 hover:bg-amber-400/20 cursor-pointer"
                            >
                                Reset All Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Mobile & Tablet Card List (< 1280px, including 320px phones & iPad Portrait/Landscape) */}
                        <div className="divide-y divide-white/10 xl:hidden">
                            {currentItems.map((user) => {
                                const currentRole = resolveUserRole(user);
                                const isLeader = currentRole === 'Student Leader';
                                const isRegionalAdmin = currentRole === 'Regional Admin';
                                const assignedSchools = user.assigned_schools ?? user.assignedSchools ?? [];

                                return (
                                    <article key={user.id} className="space-y-3.5 p-3.5 transition-colors hover:bg-white/[0.02] sm:p-5">
                                        <div className="flex flex-wrap items-start justify-between gap-2.5">
                                            <div className="flex min-w-0 flex-1 items-center gap-3">
                                                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border font-black ${getRoleAvatarClasses(currentRole)}`}>
                                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-bold text-white sm:text-base">
                                                        {user.name || 'Unnamed Account'}
                                                    </p>
                                                    <p className="mt-0.5 flex min-w-0 items-center gap-1 text-xs text-gray-400">
                                                        <Mail aria-hidden="true" className="h-3 w-3 shrink-0" />
                                                        <span className="truncate">{user.email || '—'}</span>
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-1.5">
                                                <RoleBadge role={currentRole} size="xs" />
                                                <span className="inline-flex items-center gap-1 rounded-full border border-blue-400/20 bg-blue-400/10 px-2 py-0.5 text-[11px] font-semibold text-blue-300">
                                                    <MapPin aria-hidden="true" className="h-3 w-3 shrink-0" />
                                                    <span className="max-w-[120px] truncate">{user.region || 'Unassigned'}</span>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs sm:grid-cols-2">
                                            <div className="min-w-0">
                                                <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                                                    Campus &amp; Jurisdiction
                                                </span>
                                                <p className="flex min-w-0 items-center gap-1.5 font-semibold text-white">
                                                    <Building2 aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                                                    <span className="truncate">{user.university || 'Unassigned Campus'}</span>
                                                </p>
                                                {isLeader ? (
                                                    <p className="mt-1 truncate font-medium text-amber-300/90">
                                                        {resolveLeaderDivision(user.division)}
                                                    </p>
                                                ) : isRegionalAdmin ? (
                                                    <p className="mt-1 truncate text-cyan-300/90">
                                                        {assignedSchools.length > 0
                                                            ? `${assignedSchools.length} Assigned School${assignedSchools.length === 1 ? '' : 's'}`
                                                            : `${user.region || 'Regional'} Jurisdiction`}
                                                    </p>
                                                ) : (
                                                    <p className="mt-1 flex min-w-0 flex-wrap items-center gap-1 text-gray-400">
                                                        <GraduationCap aria-hidden="true" className="h-3 w-3 shrink-0 text-gray-500" />
                                                        <span className="truncate">{user.course || (currentRole === 'Core Admin' ? 'Global Admin Access' : 'Unspecified course')}</span>
                                                        {user.year_level && <span className="shrink-0">• {user.year_level}</span>}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="min-w-0 border-t border-white/5 pt-2.5 sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0">
                                                <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                                                    MLBB Identity
                                                </span>
                                                <div className="flex min-w-0 flex-wrap items-center gap-2">
                                                    <p className="flex min-w-0 items-center gap-1.5 font-bold text-white">
                                                        <Gamepad2 aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-blue-400" />
                                                        <span className="truncate">{user.ml_ign || 'No IGN'}</span>
                                                    </p>
                                                    {user.ml_rank && (
                                                        <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-gray-300">
                                                            {user.ml_rank}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="mt-1 truncate font-mono text-gray-400">
                                                    UID: {user.ml_id || '—'} {user.ml_server ? `(${user.ml_server})` : ''}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 pt-0.5 sm:flex-row sm:items-center sm:justify-between">
                                            <span className="text-[11px] text-gray-500">
                                                {user.updated_at ? `Updated ${timeAgo(user.updated_at)}` : ''}
                                            </span>
                                            <div className="flex w-full flex-col gap-2 min-[400px]:flex-row min-[400px]:items-center sm:w-auto sm:justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() => setInspectStudent(user)}
                                                    className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-semibold text-gray-200 transition-colors hover:bg-white/10 hover:text-white cursor-pointer sm:flex-none"
                                                >
                                                    <Eye aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                                                    <span>View Profile</span>
                                                </button>

                                                <div className="relative min-w-0 flex-1 sm:w-44 sm:flex-none">
                                                    <select
                                                        id={`mobile-role-select-${user.id}`}
                                                        aria-label={`Change role for ${user.name || user.email || 'account'}`}
                                                        value={currentRole}
                                                        onChange={(e) => handleRoleSelect(user, e.target.value)}
                                                        className={`min-h-[44px] w-full appearance-none rounded-xl border bg-neutral-900/95 py-2 pl-3 pr-8 text-xs font-bold transition-all focus:outline-none focus:ring-2 cursor-pointer ${getRoleSelectClasses(currentRole)}`}
                                                    >
                                                        {availableRoles.map((roleOpt) => (
                                                            <option key={roleOpt} value={roleOpt} className="bg-neutral-900 font-semibold text-white">
                                                                {roleOpt}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown
                                                        aria-hidden="true"
                                                        className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>

                        {/* Desktop Full Table (>= 1280px) */}
                        <div
                            className="hidden overflow-x-auto xl:block"
                            tabIndex={0}
                            role="region"
                            aria-label="Platform accounts directory"
                        >
                            <table className="w-full table-auto text-left text-sm">
                                <thead className="sticky top-0 z-10 bg-[#0b0b0d]">
                                    <tr className="border-b border-white/10 bg-white/[0.02] text-xs font-bold uppercase tracking-wider text-gray-400">
                                        <th className="px-5 py-4">Account Profile</th>
                                        <th className="px-4 py-4">Campus / Jurisdiction</th>
                                        <th className="px-4 py-4">MLBB Identity</th>
                                        <th className="px-4 py-4">Region Hub</th>
                                        <th className="px-4 py-4">Role &amp; Status</th>
                                        <th className="px-5 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-gray-300">
                                    {currentItems.map((user) => {
                                        const currentRole = resolveUserRole(user);
                                        const isLeader = currentRole === 'Student Leader';
                                        const isRegionalAdmin = currentRole === 'Regional Admin';
                                        const assignedSchools = user.assigned_schools ?? user.assignedSchools ?? [];

                                        return (
                                            <tr key={user.id} className="group transition-colors hover:bg-white/[0.02]">
                                                {/* Account Profile */}
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border font-black ${getRoleAvatarClasses(currentRole)}`}>
                                                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                                        </div>
                                                        <div className="min-w-0 max-w-[190px] 2xl:max-w-xs">
                                                            <p className="truncate font-bold text-white transition-colors group-hover:text-amber-300">
                                                                {user.name || 'Unnamed Account'}
                                                            </p>
                                                            <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                                                                <Mail aria-hidden="true" className="h-3 w-3 shrink-0" />
                                                                <span className="truncate">{user.email || '—'}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Campus / Jurisdiction */}
                                                <td className="px-4 py-4">
                                                    <div className="min-w-0 max-w-[220px] 2xl:max-w-sm">
                                                        <p className="flex items-center gap-1.5 font-semibold text-white">
                                                            <Building2 aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                                                            <span className="truncate">{user.university || 'Unassigned Campus'}</span>
                                                        </p>
                                                        {isRegionalAdmin ? (
                                                            <p className="mt-1 truncate text-xs text-cyan-300/90">
                                                                {assignedSchools.length > 0
                                                                    ? `${assignedSchools.length} Assigned School${assignedSchools.length === 1 ? '' : 's'}`
                                                                    : `${user.region || 'Regional'} Jurisdiction`}
                                                            </p>
                                                        ) : (
                                                            <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                                                                <GraduationCap aria-hidden="true" className="h-3 w-3 shrink-0 text-gray-500" />
                                                                <span className="truncate">
                                                                    {user.course || (currentRole === 'Core Admin' ? 'Global Admin Access' : 'Unspecified course')}
                                                                </span>
                                                                {user.year_level && <span className="shrink-0">• {user.year_level}</span>}
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* MLBB Identity */}
                                                <td className="whitespace-nowrap px-4 py-4">
                                                    <div className="min-w-0">
                                                        <p className="flex items-center gap-1.5 font-bold text-white">
                                                            <Gamepad2 aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-blue-400" />
                                                            <span>{user.ml_ign || 'No IGN'}</span>
                                                        </p>
                                                        <p className="mt-0.5 font-mono text-xs text-gray-400">
                                                            UID: {user.ml_id || '—'} {user.ml_server ? `(${user.ml_server})` : ''}
                                                        </p>
                                                        {user.ml_rank && (
                                                            <span className="mt-1 inline-block rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-gray-300">
                                                                {user.ml_rank}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Region Hub */}
                                                <td className="whitespace-nowrap px-4 py-4">
                                                    <span className="inline-flex items-center gap-1 rounded-full border border-blue-400/20 bg-blue-400/10 px-2.5 py-1 text-xs font-semibold text-blue-300">
                                                        <MapPin aria-hidden="true" className="h-3 w-3 shrink-0" />
                                                        <span>{user.region || 'Unassigned'}</span>
                                                    </span>
                                                </td>

                                                {/* Role & Status */}
                                                <td className="whitespace-nowrap px-4 py-4 text-xs">
                                                    <div className="flex flex-col items-start gap-1">
                                                        <RoleBadge role={currentRole} />
                                                        {isLeader && (
                                                            <span className="max-w-[180px] truncate text-[11px] font-medium text-amber-300/80">
                                                                {resolveLeaderDivision(user.division)}
                                                            </span>
                                                        )}
                                                        {isRegionalAdmin && assignedSchools.length > 0 && (
                                                            <span className="text-[11px] text-cyan-300/80">
                                                                {assignedSchools.length} school{assignedSchools.length === 1 ? '' : 's'} tagged
                                                            </span>
                                                        )}
                                                        {currentRole === 'Core Admin' && (
                                                            <span className="text-[11px] text-purple-300/75">
                                                                Executive Access
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Actions: View Profile + Direct Role Dropdown */}
                                                <td className="whitespace-nowrap px-5 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => setInspectStudent(user)}
                                                            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-gray-200 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
                                                        >
                                                            <Eye aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                                                            <span>View Profile</span>
                                                        </button>

                                                        <div className="relative w-40">
                                                            <select
                                                                id={`desktop-role-select-${user.id}`}
                                                                aria-label={`Change role for ${user.name || user.email || 'account'}`}
                                                                value={currentRole}
                                                                onChange={(e) => handleRoleSelect(user, e.target.value)}
                                                                className={`min-h-[38px] w-full appearance-none rounded-xl border bg-neutral-900/95 py-1.5 pl-3 pr-8 text-left text-xs font-bold transition-all focus:outline-none focus:ring-2 cursor-pointer ${getRoleSelectClasses(currentRole)}`}
                                                            >
                                                                {availableRoles.map((roleOpt) => (
                                                                    <option key={roleOpt} value={roleOpt} className="bg-neutral-900 font-semibold text-white">
                                                                        {roleOpt}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <ChevronDown
                                                                aria-hidden="true"
                                                                className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400"
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {/* Pagination */}
                {currentPaginator?.links?.length > 3 && (
                    <nav className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-white/[0.01] px-4 py-3 text-xs sm:px-5" aria-label="Pagination">
                        <span className="text-gray-400">
                            Showing page {currentPaginator.current_page} of {currentPaginator.last_page} ({currentPaginator.total} total)
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                            {currentPaginator.links.map((link, index) => (
                                <Link
                                    key={`${index}-${link.label}`}
                                    href={link.url || '#'}
                                    preserveScroll
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`inline-flex min-h-[36px] items-center rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
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
            {/* ROLE CHANGE CONFIRMATION MODAL                                            */}
            {/* ========================================================================= */}
            {roleChangeTarget && typeof document !== 'undefined' && createPortal(
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-md transition-all duration-200"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="role-change-modal-title"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) closeRoleChangeModal();
                    }}
                >
                    <div className="max-h-[90dvh] w-full max-w-lg overflow-y-auto overscroll-contain rounded-2xl border border-amber-400/30 bg-[#0f0f11]/95 p-4 shadow-[0_20px_70px_rgba(0,0,0,0.65)] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 sm:p-6">
                        <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-400/25 bg-amber-400/10 text-amber-400">
                                    <Shield aria-hidden="true" className="h-5 w-5" />
                                </div>
                                <div className="min-w-0">
                                    <h3 id="role-change-modal-title" className="text-base font-bold text-white [text-wrap:balance]">
                                        Confirm Role Update
                                    </h3>
                                    <p className="text-xs text-gray-400">
                                        Review role permissions &amp; jurisdiction details
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                aria-label="Close role confirmation modal"
                                onClick={closeRoleChangeModal}
                                className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-white/10 hover:text-white cursor-pointer"
                            >
                                <X aria-hidden="true" className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Account Summary & Role Transition */}
                        <div className="mt-4 space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
                            <div className="flex items-center gap-3">
                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border font-bold ${getRoleAvatarClasses(roleChangeTarget.newRole)}`}>
                                    {roleChangeTarget.user.name ? roleChangeTarget.user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-bold text-white">
                                        {roleChangeTarget.user.name || 'Unnamed Account'}
                                    </p>
                                    <p className="truncate text-xs text-gray-400">
                                        {roleChangeTarget.user.email}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 border-t border-white/5 pt-3 text-xs">
                                <RoleBadge role={roleChangeTarget.previousRole} size="xs" />
                                <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-zinc-500" />
                                <RoleBadge role={roleChangeTarget.newRole} size="xs" />
                            </div>
                        </div>

                        <form onSubmit={handleRoleChangeSubmit} className="mt-4 space-y-4">
                            {/* Warning when transitioning away from Regional Admin */}
                            {roleChangeTarget.previousRole === 'Regional Admin' && roleChangeTarget.newRole !== 'Regional Admin' && (
                                <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
                                    <AlertTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                                    <p className="leading-relaxed">
                                        Changing <strong className="text-white">{roleChangeTarget.user.name}</strong> from <strong className="text-white">Regional Admin</strong> to <strong className="text-white">{roleChangeTarget.newRole}</strong> will automatically clear all schools currently assigned to their regional jurisdiction.
                                    </p>
                                </div>
                            )}

                            {/* 1. Target Role: Regional Admin (Required Region Selector) */}
                            {roleChangeTarget.newRole === 'Regional Admin' && (
                                <div className="space-y-3">
                                    <p className="text-xs leading-relaxed text-zinc-300">
                                        Assigning <strong className="text-white">{roleChangeTarget.user.name}</strong> as a <strong className="text-cyan-300">Regional Admin</strong> grants verification and operational oversight within their tagged region.
                                    </p>
                                    <div>
                                        <label htmlFor="modal-ra-region" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-300">
                                            Assigned Region Jurisdiction <span className="text-cyan-400">*</span>
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="modal-ra-region"
                                                required
                                                value={modalRegion}
                                                onChange={(e) => {
                                                    setModalRegion(e.target.value);
                                                    if (roleErrors.region) setRoleErrors({});
                                                }}
                                                className="min-h-[44px] w-full appearance-none rounded-xl border border-white/15 bg-black/70 py-2.5 pl-3.5 pr-9 text-xs font-semibold text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
                                            >
                                                <option value="">Select a Philippine region...</option>
                                                {mergedRegionOptions.map((reg) => (
                                                    <option key={reg} value={reg}>
                                                        {reg}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        </div>
                                        {roleErrors.region && (
                                            <p className="mt-1.5 text-xs font-medium text-red-400">{roleErrors.region}</p>
                                        )}
                                        <span className="mt-1.5 block text-[11px] text-zinc-500">
                                            Required so Regional Admins always have a valid regional hub tagged.
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* 2. Target Role: Student Leader (Optional Campus & Chapter Position) */}
                            {roleChangeTarget.newRole === 'Student Leader' && (
                                <div className="space-y-3.5">
                                    <p className="text-xs leading-relaxed text-zinc-300">
                                        Appointing <strong className="text-white">{roleChangeTarget.user.name}</strong> as a <strong className="text-amber-300">Student Leader</strong> grants campus chapter officer privileges. You may optionally confirm or update their campus and position below.
                                    </p>

                                    <div>
                                        <label htmlFor="modal-sl-campus" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400">
                                            Campus / University Chapter <span className="text-zinc-500 font-normal">(Optional)</span>
                                        </label>
                                        <input
                                            id="modal-sl-campus"
                                            type="text"
                                            list="institution-options"
                                            value={modalCampus}
                                            onChange={(e) => handleCampusInputChange(e.target.value)}
                                            placeholder="Type or select university chapter..."
                                            className="min-h-[44px] w-full rounded-xl border border-white/10 bg-black/60 p-3 text-xs text-white placeholder:text-gray-500 focus:border-amber-400/50 focus:outline-none focus:ring-1 focus:ring-amber-400/50"
                                        />
                                        <datalist id="institution-options">
                                            {institutions.slice(0, 1000).map((inst, i) => (
                                                <option key={`${inst.name}-${i}`} value={inst.name}>
                                                    {inst.region ? `[${inst.region}] ${inst.name}` : inst.name}
                                                </option>
                                            ))}
                                        </datalist>
                                    </div>

                                    <div>
                                        <label htmlFor="modal-sl-division" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400">
                                            Chapter Position <span className="text-zinc-500 font-normal">(Optional)</span>
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="modal-sl-division"
                                                value={modalDivision}
                                                onChange={(e) => setModalDivision(e.target.value)}
                                                className="min-h-[44px] w-full appearance-none rounded-xl border border-white/10 bg-black/60 py-2.5 pl-3.5 pr-9 text-xs text-white focus:border-amber-400/50 focus:outline-none focus:ring-1 focus:ring-amber-400/50"
                                            >
                                                {divisionSelectOptions.map((pos) => (
                                                    <option key={pos} value={pos}>
                                                        {pos}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 3. Target Role: Student */}
                            {roleChangeTarget.newRole === 'Student' && (
                                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 text-xs leading-relaxed text-zinc-300">
                                    You are updating <strong className="text-white">{roleChangeTarget.user.name}</strong> from <strong className="text-white">{roleChangeTarget.previousRole}</strong> to <strong className="text-emerald-300">Student</strong>. Elevated administrative or chapter officer permissions will be removed, while their verified student account remains active.
                                </div>
                            )}

                            {/* 4. Target Role: Core Admin */}
                            {roleChangeTarget.newRole === 'Core Admin' && (
                                <div className="rounded-xl border border-purple-500/25 bg-purple-500/10 p-3.5 text-xs leading-relaxed text-purple-100">
                                    You are elevating <strong className="text-white">{roleChangeTarget.user.name}</strong> from <strong className="text-white">{roleChangeTarget.previousRole}</strong> to <strong className="text-purple-300">Core Admin</strong>. Core Admins receive executive administrative capabilities across the MSL Admin Portal.
                                </div>
                            )}

                            {roleErrors.role && (
                                <p className="text-xs font-medium text-red-400">{roleErrors.role}</p>
                            )}

                            <div className="flex flex-col-reverse gap-2.5 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
                                <button
                                    type="button"
                                    onClick={closeRoleChangeModal}
                                    disabled={isSubmitting}
                                    className="min-h-[42px] rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-gray-300 hover:bg-white/5 hover:text-white disabled:opacity-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || (roleChangeTarget.newRole === 'Regional Admin' && !modalRegion.trim())}
                                    className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-xs font-bold text-black shadow-[0_0_15px_rgba(251,191,36,0.2)] transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                                >
                                    {isSubmitting ? (
                                        <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
                                    )}
                                    <span>Confirm Role Change</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {/* ========================================================================= */}
            {/* 1. DATA JUSTIFICATION MODAL: ACTIVE STUDENT LEADERS (CENTERED, LIMIT 10)  */}
            {/* ========================================================================= */}
            {isLeadersModalOpen && typeof document !== 'undefined' && createPortal(
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md transition-all duration-200"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="active-leaders-modal-title"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) setIsLeadersModalOpen(false);
                    }}
                >
                    <div className="flex max-h-[90dvh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-amber-400/30 bg-[#0f0f11]/95 shadow-[0_20px_70px_rgba(0,0,0,0.6)] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-white/10 bg-gradient-to-r from-amber-400/10 to-transparent p-4 sm:items-center sm:p-6">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/10 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.2)] sm:h-11 sm:w-11">
                                    <Crown aria-hidden="true" className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <div className="min-w-0">
                                    <h3 id="active-leaders-modal-title" className="text-base font-black uppercase tracking-tight text-white [text-wrap:balance] sm:text-lg">
                                        Active Student Leaders Directory
                                    </h3>
                                    <p className="text-xs text-zinc-400">
                                        {filteredModalLeaders.length} registered chapter officers (Showing 10 per page)
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                aria-label="Close student leaders modal"
                                onClick={() => setIsLeadersModalOpen(false)}
                                className="shrink-0 rounded-xl p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
                            >
                                <X aria-hidden="true" className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="shrink-0 border-b border-white/5 bg-white/[0.01] p-4 sm:px-6">
                            <div className="relative">
                                <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                                <input
                                    type="search"
                                    aria-label="Filter student leaders"
                                    value={leadersModalSearch}
                                    onChange={(e) => {
                                        setLeadersModalSearch(e.target.value);
                                        setLeadersModalPage(1);
                                    }}
                                    placeholder="Filter by leader name, campus, IGN, or region..."
                                    className="min-h-[42px] w-full rounded-xl border border-white/10 bg-black/50 py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-zinc-500 focus:border-amber-400/50 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
                            {paginatedModalLeaders.length === 0 ? (
                                <div className="py-12 text-center text-xs text-zinc-400">
                                    No student leaders match your query.
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-3 md:hidden">
                                        {paginatedModalLeaders.map((leader) => (
                                            <div key={leader.id} className="space-y-2.5 rounded-2xl border border-white/10 bg-white/[0.02] p-3.5 text-xs">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex min-w-0 items-center gap-2.5">
                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-400/20 bg-amber-400/10 text-xs font-bold text-amber-400">
                                                            {leader.name ? leader.name.charAt(0).toUpperCase() : 'S'}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="truncate font-bold text-white">{leader.name}</div>
                                                            <div className="truncate text-[11px] text-zinc-500">{leader.email}</div>
                                                        </div>
                                                    </div>
                                                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-blue-400/20 bg-blue-400/10 px-2 py-0.5 text-[11px] font-medium text-blue-300">
                                                        {leader.region || 'Unassigned'}
                                                    </span>
                                                </div>
                                                <div className="text-zinc-300">
                                                    <span className="text-zinc-500">Campus: </span>
                                                    <span className="font-semibold text-white">{leader.university || 'Unassigned'}</span>
                                                </div>
                                                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-2">
                                                    <span className="font-semibold text-amber-400">
                                                        {resolveLeaderDivision(leader.division)}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setIsLeadersModalOpen(false);
                                                            setInspectStudent(leader);
                                                        }}
                                                        className="rounded-lg border border-white/10 px-2.5 py-1.5 text-[11px] font-bold text-zinc-300 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
                                                    >
                                                        View Profile
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="hidden overflow-x-auto md:block">
                                        <table className="w-full text-left text-xs">
                                            <thead>
                                                <tr className="border-b border-white/10 bg-white/[0.02] font-bold uppercase text-zinc-400">
                                                    <th className="px-3 pb-3">Leader</th>
                                                    <th className="px-3 pb-3">Campus Chapter</th>
                                                    <th className="px-3 pb-3">Role</th>
                                                    <th className="px-3 pb-3">Region</th>
                                                    <th className="px-3 pb-3 text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5 text-zinc-300">
                                                {paginatedModalLeaders.map((leader) => (
                                                    <tr key={leader.id} className="transition-colors hover:bg-white/[0.02]">
                                                        <td className="px-3 py-3">
                                                            <div className="flex items-center gap-2.5">
                                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-400/20 bg-amber-400/10 text-xs font-bold text-amber-400">
                                                                    {leader.name ? leader.name.charAt(0).toUpperCase() : 'S'}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <div className="truncate font-bold text-white">{leader.name}</div>
                                                                    <div className="truncate text-[11px] text-zinc-500">{leader.email}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-3 font-semibold text-zinc-200">
                                                            {leader.university || 'Unassigned'}
                                                        </td>
                                                        <td className="px-3 py-3">
                                                            <span className="font-semibold text-amber-400">
                                                                {resolveLeaderDivision(leader.division)}
                                                            </span>
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-3">
                                                            <span className="inline-flex items-center gap-1 rounded-full border border-blue-400/20 bg-blue-400/10 px-2 py-0.5 text-[11px] font-medium text-blue-300">
                                                                {leader.region || 'Unassigned'}
                                                            </span>
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-3 text-right">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setIsLeadersModalOpen(false);
                                                                    setInspectStudent(leader);
                                                                }}
                                                                className="rounded-lg border border-white/10 px-2.5 py-1 text-[11px] font-bold text-zinc-300 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
                                                            >
                                                                View Profile
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-white/[0.02] p-4 text-xs sm:px-6">
                            <span className="text-zinc-400">
                                Page {leadersModalPage} of {totalModalLeaderPages} ({filteredModalLeaders.length} leaders)
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsLeadersModalOpen(false);
                                        handleTabChange('Student Leader', true);
                                    }}
                                    className="inline-flex items-center gap-1 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-400/20 cursor-pointer"
                                >
                                    Filter Table
                                </button>
                                <button
                                    type="button"
                                    disabled={leadersModalPage === 1}
                                    onClick={() => setLeadersModalPage((p) => Math.max(1, p - 1))}
                                    className="inline-flex items-center gap-1 rounded-xl border border-white/10 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 disabled:opacity-40 cursor-pointer"
                                >
                                    <ChevronLeft aria-hidden="true" className="h-3.5 w-3.5" /> Previous
                                </button>
                                <button
                                    type="button"
                                    disabled={leadersModalPage >= totalModalLeaderPages}
                                    onClick={() => setLeadersModalPage((p) => Math.min(totalModalLeaderPages, p + 1))}
                                    className="inline-flex items-center gap-1 rounded-xl border border-white/10 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 disabled:opacity-40 cursor-pointer"
                                >
                                    Next <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* ========================================================================= */}
            {/* 2. DATA JUSTIFICATION MODAL: AFFILIATED CAMPUSES (CENTERED, LIMIT 10)     */}
            {/* ========================================================================= */}
            {isCampusesModalOpen && typeof document !== 'undefined' && createPortal(
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md transition-all duration-200"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="campuses-modal-title"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) setIsCampusesModalOpen(false);
                    }}
                >
                    <div className="flex max-h-[90dvh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-emerald-500/30 bg-[#0f0f11]/95 shadow-[0_20px_70px_rgba(0,0,0,0.6)] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-white/10 bg-gradient-to-r from-emerald-500/10 to-transparent p-4 sm:items-center sm:p-6">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)] sm:h-11 sm:w-11">
                                    <Building2 aria-hidden="true" className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <div className="min-w-0">
                                    <h3 id="campuses-modal-title" className="text-base font-black uppercase tracking-tight text-white [text-wrap:balance] sm:text-lg">
                                        Affiliated University Chapters
                                    </h3>
                                    <p className="text-xs text-zinc-400">
                                        {filteredModalCampuses.length} campuses with active student leaders (Showing 10 per page)
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                aria-label="Close campuses modal"
                                onClick={() => setIsCampusesModalOpen(false)}
                                className="shrink-0 rounded-xl p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
                            >
                                <X aria-hidden="true" className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="shrink-0 border-b border-white/5 bg-white/[0.01] p-4 sm:px-6">
                            <div className="relative">
                                <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                                <input
                                    type="search"
                                    aria-label="Filter campuses"
                                    value={campusesModalSearch}
                                    onChange={(e) => {
                                        setCampusesModalSearch(e.target.value);
                                        setCampusesModalPage(1);
                                    }}
                                    placeholder="Filter by university or region..."
                                    className="min-h-[42px] w-full rounded-xl border border-white/10 bg-black/50 py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-zinc-500 focus:border-emerald-500/50 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
                            {paginatedModalCampuses.length === 0 ? (
                                <div className="py-12 text-center text-xs text-zinc-400">
                                    No campus chapters found matching your filter.
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-3 sm:hidden">
                                        {paginatedModalCampuses.map((camp, idx) => (
                                            <div key={`${camp.university}-${idx}`} className="space-y-2.5 rounded-2xl border border-white/10 bg-white/[0.02] p-3.5 text-xs">
                                                <div className="flex items-start gap-2 font-bold text-white">
                                                    <Building2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                                                    <span>{camp.university}</span>
                                                </div>
                                                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="inline-flex items-center gap-1 rounded-full border border-blue-400/20 bg-blue-400/10 px-2 py-0.5 text-[11px] font-medium text-blue-300">
                                                            {camp.region || 'Unassigned'}
                                                        </span>
                                                        <span className="font-semibold text-emerald-400">
                                                            {camp.leaders_count} Leader{camp.leaders_count > 1 ? 's' : ''}
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setIsCampusesModalOpen(false);
                                                            setSearch(camp.university);
                                                            setActiveTab('Student Leader');
                                                            applyFilters('Student Leader', camp.university, selectedRegion);
                                                        }}
                                                        className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-bold text-emerald-300 transition-colors hover:bg-emerald-500/20 cursor-pointer"
                                                    >
                                                        <span>Filter Table</span>
                                                        <ArrowRight aria-hidden="true" className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="hidden overflow-x-auto sm:block">
                                        <table className="w-full text-left text-xs">
                                            <thead>
                                                <tr className="border-b border-white/10 bg-white/[0.02] font-bold uppercase text-zinc-400">
                                                    <th className="px-3 pb-3">University / Campus Name</th>
                                                    <th className="px-3 pb-3">Region Hub</th>
                                                    <th className="px-3 pb-3">Appointed Leaders</th>
                                                    <th className="px-3 pb-3 text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5 text-zinc-300">
                                                {paginatedModalCampuses.map((camp, idx) => (
                                                    <tr key={`${camp.university}-${idx}`} className="transition-colors hover:bg-white/[0.02]">
                                                        <td className="px-3 py-3 font-bold text-white">
                                                            <div className="flex items-center gap-2">
                                                                <Building2 aria-hidden="true" className="h-4 w-4 shrink-0 text-emerald-400" />
                                                                <span>{camp.university}</span>
                                                            </div>
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-3">
                                                            <span className="inline-flex items-center gap-1 rounded-full border border-blue-400/20 bg-blue-400/10 px-2 py-0.5 text-[11px] font-medium text-blue-300">
                                                                {camp.region || 'Unassigned'}
                                                            </span>
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-3 font-semibold text-emerald-400">
                                                            {camp.leaders_count} Leader{camp.leaders_count > 1 ? 's' : ''}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-3 text-right">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setIsCampusesModalOpen(false);
                                                                    setSearch(camp.university);
                                                                    setActiveTab('Student Leader');
                                                                    applyFilters('Student Leader', camp.university, selectedRegion);
                                                                }}
                                                                className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-300 transition-colors hover:bg-emerald-500/20 cursor-pointer"
                                                            >
                                                                <span>Filter Table</span>
                                                                <ArrowRight aria-hidden="true" className="h-3 w-3" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-white/[0.02] p-4 text-xs sm:px-6">
                            <span className="text-zinc-400">
                                Page {campusesModalPage} of {totalModalCampusPages} ({filteredModalCampuses.length} campuses)
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    disabled={campusesModalPage === 1}
                                    onClick={() => setCampusesModalPage((p) => Math.max(1, p - 1))}
                                    className="inline-flex items-center gap-1 rounded-xl border border-white/10 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 disabled:opacity-40 cursor-pointer"
                                >
                                    <ChevronLeft aria-hidden="true" className="h-3.5 w-3.5" /> Previous
                                </button>
                                <button
                                    type="button"
                                    disabled={campusesModalPage >= totalModalCampusPages}
                                    onClick={() => setCampusesModalPage((p) => Math.min(totalModalCampusPages, p + 1))}
                                    className="inline-flex items-center gap-1 rounded-xl border border-white/10 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 disabled:opacity-40 cursor-pointer"
                                >
                                    Next <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* ========================================================================= */}
            {/* 3. DATA JUSTIFICATION MODAL: REGIONAL HUBS (CENTERED, LIMIT 10)           */}
            {/* ========================================================================= */}
            {isRegionsModalOpen && typeof document !== 'undefined' && createPortal(
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md transition-all duration-200"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="regions-modal-title"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) setIsRegionsModalOpen(false);
                    }}
                >
                    <div className="flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-blue-500/30 bg-[#0f0f11]/95 shadow-[0_20px_70px_rgba(0,0,0,0.6)] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-transparent p-4 sm:items-center sm:p-6">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-500/10 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)] sm:h-11 sm:w-11">
                                    <MapPin aria-hidden="true" className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <div className="min-w-0">
                                    <h3 id="regions-modal-title" className="text-base font-black uppercase tracking-tight text-white [text-wrap:balance] sm:text-lg">
                                        Regional Hubs Breakdown
                                    </h3>
                                    <p className="text-xs text-zinc-400">
                                        {regionBreakdown.length} active regional jurisdictions (Showing 10 per page)
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                aria-label="Close regional hubs modal"
                                onClick={() => setIsRegionsModalOpen(false)}
                                className="shrink-0 rounded-xl p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
                            >
                                <X aria-hidden="true" className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
                            {paginatedModalRegions.length === 0 ? (
                                <div className="py-12 text-center text-xs text-zinc-400">
                                    No regional hubs assigned yet.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead>
                                            <tr className="border-b border-white/10 bg-white/[0.02] font-bold uppercase text-zinc-400">
                                                <th className="px-2.5 pb-3 sm:px-3">Regional Hub</th>
                                                <th className="px-2.5 pb-3 sm:px-3">Assigned Leaders</th>
                                                <th className="px-2.5 pb-3 text-right sm:px-3">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5 text-zinc-300">
                                            {paginatedModalRegions.map((reg) => (
                                                <tr key={reg.region} className="transition-colors hover:bg-white/[0.02]">
                                                    <td className="px-2.5 py-3 font-bold text-white sm:px-3">
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <MapPin aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-blue-400" />
                                                            <span>{reg.region}</span>
                                                        </span>
                                                    </td>
                                                    <td className="whitespace-nowrap px-2.5 py-3 font-semibold text-blue-400 sm:px-3">
                                                        {reg.leaders_count} Leader{reg.leaders_count > 1 ? 's' : ''}
                                                    </td>
                                                    <td className="whitespace-nowrap px-2.5 py-3 text-right sm:px-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setIsRegionsModalOpen(false);
                                                                handleRegionFilter(reg.region);
                                                            }}
                                                            className="inline-flex items-center gap-1 rounded-lg border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-[11px] font-bold text-blue-300 transition-colors hover:bg-blue-500/20 cursor-pointer sm:px-3"
                                                        >
                                                            <span>Filter</span>
                                                            <ArrowRight aria-hidden="true" className="h-3 w-3" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-white/[0.02] p-4 text-xs sm:px-6">
                            <span className="text-zinc-400">
                                Page {regionsModalPage} of {totalModalRegionPages} ({regionBreakdown.length} regions)
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    disabled={regionsModalPage === 1}
                                    onClick={() => setRegionsModalPage((p) => Math.max(1, p - 1))}
                                    className="inline-flex items-center gap-1 rounded-xl border border-white/10 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 disabled:opacity-40 cursor-pointer"
                                >
                                    <ChevronLeft aria-hidden="true" className="h-3.5 w-3.5" /> Previous
                                </button>
                                <button
                                    type="button"
                                    disabled={regionsModalPage >= totalModalRegionPages}
                                    onClick={() => setRegionsModalPage((p) => Math.min(totalModalRegionPages, p + 1))}
                                    className="inline-flex items-center gap-1 rounded-xl border border-white/10 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 disabled:opacity-40 cursor-pointer"
                                >
                                    Next <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* ========================================================================= */}
            {/* ACCOUNT PROFILE MODAL (CENTERED)                                          */}
            {/* ========================================================================= */}
            {inspectStudent && typeof document !== 'undefined' && createPortal(
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md transition-all duration-200"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="inspect-profile-title"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) setInspectStudent(null);
                    }}
                >
                    <div className="max-h-[90dvh] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-3xl border border-white/15 bg-[#0f0f11]/95 p-4 shadow-[0_20px_70px_rgba(0,0,0,0.6)] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 sm:p-6">
                        <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4 sm:items-center">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border sm:h-11 sm:w-11 ${getRoleAvatarClasses(resolveUserRole(inspectStudent))}`}>
                                    <UserRound aria-hidden="true" className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 id="inspect-profile-title" className="text-base font-bold text-white sm:text-lg">
                                            {inspectStudent.name || 'Unnamed Account'}
                                        </h3>
                                        <RoleBadge role={resolveUserRole(inspectStudent)} size="xs" />
                                    </div>
                                    <p className="break-all text-xs text-gray-400">
                                        {inspectStudent.email} • ID: #{inspectStudent.id}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                aria-label="Close profile modal"
                                onClick={() => setInspectStudent(null)}
                                className="shrink-0 rounded-xl p-2 text-gray-400 hover:bg-white/10 hover:text-white cursor-pointer"
                            >
                                <X aria-hidden="true" className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-5 grid grid-cols-1 gap-4 text-xs md:grid-cols-2">
                            {/* Academic */}
                            <div className="space-y-2.5 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                                <h4 className="flex items-center gap-2 font-bold uppercase tracking-wider text-amber-400">
                                    <Building2 aria-hidden="true" className="h-4 w-4" /> Academic Affiliation
                                </h4>
                                <div>
                                    <span className="text-gray-500">School / University:</span>
                                    <p className="mt-0.5 font-semibold text-white">{inspectStudent.university || 'Unspecified'}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Course &amp; Year Level:</span>
                                    <p className="mt-0.5 font-semibold text-gray-200">
                                        {inspectStudent.course || '—'} {inspectStudent.year_level ? `(${inspectStudent.year_level})` : ''}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Student ID Number:</span>
                                    <p className="mt-0.5 font-mono text-amber-300">{inspectStudent.studentId || '—'}</p>
                                </div>
                            </div>

                            {/* MLBB */}
                            <div className="space-y-2.5 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                                <h4 className="flex items-center gap-2 font-bold uppercase tracking-wider text-blue-400">
                                    <Gamepad2 aria-hidden="true" className="h-4 w-4" /> MLBB Credentials
                                </h4>
                                <div>
                                    <span className="text-gray-500">In-Game Name (IGN):</span>
                                    <p className="mt-0.5 font-bold text-white">{inspectStudent.ml_ign || '—'}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">User ID &amp; Server:</span>
                                    <p className="mt-0.5 font-mono text-gray-200">
                                        {inspectStudent.ml_id || '—'} {inspectStudent.ml_server ? `(${inspectStudent.ml_server})` : ''}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-500">In-Game Rank:</span>
                                    <p className="mt-0.5 font-semibold text-gray-300">{inspectStudent.ml_rank || 'Unranked'}</p>
                                </div>
                            </div>

                            {/* Role & Jurisdiction */}
                            <div className="space-y-2.5 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                                <h4 className="flex items-center gap-2 font-bold uppercase tracking-wider text-purple-400">
                                    <Award aria-hidden="true" className="h-4 w-4" /> Role &amp; Jurisdiction
                                </h4>
                                <div>
                                    <span className="text-gray-500">Platform Role:</span>
                                    <p className="mt-0.5 font-bold text-white">
                                        {resolveUserRole(inspectStudent) === 'Student Leader'
                                            ? `${resolveUserRole(inspectStudent)} • ${resolveLeaderDivision(inspectStudent.division)}`
                                            : resolveUserRole(inspectStudent)}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Assigned Region:</span>
                                    <p className="mt-0.5 font-semibold text-white">{inspectStudent.region || 'Unassigned'}</p>
                                </div>
                                {(inspectStudent.assigned_schools ?? inspectStudent.assignedSchools ?? []).length > 0 && (
                                    <div>
                                        <span className="text-gray-500">Assigned Schools:</span>
                                        <div className="mt-1 flex flex-wrap gap-1.5">
                                            {(inspectStudent.assigned_schools ?? inspectStudent.assignedSchools ?? []).map((school) => (
                                                <span
                                                    key={school.id ?? school.name}
                                                    className="rounded-md border border-cyan-400/25 bg-cyan-500/10 px-2 py-0.5 text-[11px] font-medium text-cyan-200"
                                                >
                                                    {school.acronym || school.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Contact Details */}
                            <div className="space-y-2.5 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                                <h4 className="flex items-center gap-2 font-bold uppercase tracking-wider text-gray-400">
                                    <Phone aria-hidden="true" className="h-4 w-4" /> Contact Information
                                </h4>
                                <div>
                                    <span className="text-gray-500">Mobile Phone:</span>
                                    <p className="mt-0.5 font-semibold text-white">{inspectStudent.contact_number || '—'}</p>
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
                                                <ExternalLink aria-hidden="true" className="h-3 w-3" />
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
                                className="min-h-[40px] rounded-xl border border-white/10 px-5 py-2.5 text-xs font-bold text-gray-300 hover:bg-white/10 hover:text-white cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </AdminLayout>
    );
}
