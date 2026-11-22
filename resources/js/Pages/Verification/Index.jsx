import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    Building2,
    Check,
    CheckCircle2,
    CheckSquare,
    Clock,
    ExternalLink,
    Eye,
    FileCheck2,
    FileText,
    Gamepad2,
    GraduationCap,
    LoaderCircle,
    Mail,
    Phone,
    RotateCcw,
    Search,
    ShieldCheck,
    Square,
    UserRound,
    X,
    XCircle,
    ZoomIn,
    ZoomOut,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

function formatDate(value) {
    if (!value) return '—';
    return new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
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

function isPdf(url) {
    return Boolean(url && url.toLowerCase().split('?')[0].endsWith('.pdf'));
}

function resolveProofUrl(proof) {
    if (!proof) return '';
    if (proof.startsWith('http://') || proof.startsWith('https://') || proof.startsWith('/')) {
        return proof;
    }
    return `/uploads/proofs/${proof}`;
}

const COMMON_REJECTION_REASONS = [
    'Blurry or unreadable proof of enrollment',
    'Student ID does not match applicant name',
    'Expired document / Not enrolled for the current academic term',
    'Document appears tampered, altered, or fraudulent',
    'Non-accredited school or unverified university branch',
    'Wrong file submitted (not a School ID or Certificate of Registration)',
];

const TABS = [
    { id: 'all', label: 'All Queue', statKey: 'all' },
    { id: 'pending', label: 'New Registrations', statKey: 'pending' },
    { id: 'renewal', label: 'Renewal Reviews', statKey: 'renewal' },
    { id: 'has-doc', label: 'With COR', statKey: 'has_doc' },
    { id: 'missing-doc', label: 'Missing COR', statKey: 'missing_doc' },
];

export default function VerificationIndex({
    users,
    filters = {},
    stats = {},
    scope = { role: '', schools: [], availableSchools: [], isAllSchools: false },
}) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search ?? '');
    const [selectedSchool, setSelectedSchool] = useState(filters.school ?? '');
    const activeTab = filters.tab ?? 'all';
    const items = users?.data ?? [];

    // Review modal state
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [mobileTab, setMobileTab] = useState('info');
    const [docZoom, setDocZoom] = useState(100);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [rejectionChecklist, setRejectionChecklist] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [bannerMessage, setBannerMessage] = useState(flash?.success || '');
    const [auditChecks, setAuditChecks] = useState({
        nameMatches: false,
        schoolMatches: false,
        validTerm: false,
        clearDoc: false,
    });

    useEffect(() => {
        if (flash?.success) {
            setBannerMessage(flash.success);
        }
    }, [flash?.success]);

    useEffect(() => {
        if (selectedStudent || showRejectModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [selectedStudent, showRejectModal]);

    const applyFilters = (nextParams) => {
        router.get(
            route('verification.index'),
            {
                search: nextParams.search || undefined,
                tab: nextParams.tab || 'all',
                school: nextParams.school || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const submitSearch = (event) => {
        event.preventDefault();
        applyFilters({ search, tab: activeTab, school: selectedSchool });
    };

    const handleTabChange = (newTab) => {
        applyFilters({ search, tab: newTab, school: selectedSchool });
    };

    const handleSchoolFilterChange = (newSchool) => {
        setSelectedSchool(newSchool);
        applyFilters({ search, tab: activeTab, school: newSchool });
    };

    const clearSearch = () => {
        setSearch('');
        applyFilters({ search: '', tab: activeTab, school: selectedSchool });
    };

    const openReview = (student) => {
        setSelectedStudent(student);
        setMobileTab('info');
        setDocZoom(100);
        setShowRejectModal(false);
        setRejectionReason('');
        setRejectionChecklist([]);
        setAuditChecks({
            nameMatches: false,
            schoolMatches: false,
            validTerm: false,
            clearDoc: false,
        });
    };

    const closeReview = () => {
        setSelectedStudent(null);
        setShowRejectModal(false);
    };

    const handleApprove = (student) => {
        if (!student || isProcessing) return;
        setIsProcessing(true);

        router.post(
            route('verification.approve', student.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    closeReview();
                },
                onFinish: () => {
                    setIsProcessing(false);
                },
            }
        );
    };

    const toggleRejectionCheck = (reason) => {
        setRejectionChecklist((prev) => {
            const exists = prev.includes(reason);
            const next = exists ? prev.filter((item) => item !== reason) : [...prev, reason];
            if (!exists && !rejectionReason.trim()) {
                setRejectionReason(reason);
            }
            return next;
        });
    };

    const handleConfirmReject = (event) => {
        event.preventDefault();
        if (!selectedStudent || isProcessing) return;

        const finalReason =
            rejectionReason.trim() || rejectionChecklist.join('; ') || 'Application did not meet verification requirements.';

        setIsProcessing(true);

        router.post(
            route('verification.reject', selectedStudent.id),
            {
                reason: finalReason,
                checklist: rejectionChecklist,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    closeReview();
                },
                onFinish: () => {
                    setIsProcessing(false);
                },
            }
        );
    };

    const hasNoAssignedSchools =
        !scope.isAllSchools &&
        !scope.includesUncoveredRegionSchools &&
        (scope.schools?.length ?? 0) === 0;
    const proofUrl = resolveProofUrl(selectedStudent?.proofOfEnrollment);

    return (
        <MainLayout fullWidth>
            <Head title="Student Verification" />

            <div className="min-h-[calc(100dvh-5rem)] bg-[#070709] py-8 text-white sm:py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                <span>{scope.role || 'Verifier'} Portal</span>
                            </div>
                            <h1 className="mt-3 font-heading text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                                Student Verification
                            </h1>
                            <p className="mt-1.5 text-sm text-gray-400">
                                Review submitted student profiles and Certificates of Registration (COR) to approve or reject pending applications.
                            </p>
                        </div>

                        {/* Scope Badge */}
                        <div className="rounded-xl border border-white/10 bg-[#111114] px-4 py-3 text-xs">
                            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-amber-400">
                                <Building2 className="h-3.5 w-3.5" />
                                <span>Verification Scope</span>
                            </div>
                            {scope.isAllSchools ? (
                                <p className="mt-1 text-gray-300">All Affiliated Schools (Nationwide)</p>
                            ) : scope.schools?.length > 0 || scope.includesUncoveredRegionSchools ? (
                                <div className="mt-1.5 flex max-w-md flex-wrap gap-1.5">
                                    {scope.schools?.slice(0, 3).map((school) => (
                                        <span
                                            key={school}
                                            className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-gray-200"
                                        >
                                            {school}
                                        </span>
                                    ))}
                                    {scope.schools?.length > 3 && (
                                        <span className="rounded-md border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-[11px] font-semibold text-amber-300">
                                            +{scope.schools.length - 3} more
                                        </span>
                                    )}
                                    {scope.includesUncoveredRegionSchools && (
                                        <span className="rounded-md border border-blue-400/30 bg-blue-500/15 px-2 py-0.5 text-[11px] font-semibold text-blue-300">
                                            + Uncovered {scope.region} Schools (No SL)
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <p className="mt-1 text-amber-300">No school assigned yet</p>
                            )}
                        </div>
                    </div>

                    {/* Flash Success Banner */}
                    {bannerMessage && (
                        <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                            <div className="flex items-center gap-2.5">
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                                <span className="font-medium">{bannerMessage}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setBannerMessage('')}
                                className="rounded-lg p-1 text-emerald-300/70 hover:text-white"
                                aria-label="Dismiss message"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                    {/* Empty Scope Warning */}
                    {hasNoAssignedSchools && (
                        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3.5 text-xs text-amber-200">
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                            <div>
                                <p className="font-bold text-amber-300">No school is linked to your account yet.</p>
                                <p className="mt-0.5 text-amber-200/80">
                                    {scope.role === 'Regional Admin'
                                        ? 'Ask a Super Admin to assign your schools in Regional Admin Management before you can view or verify pending students.'
                                        : 'Make sure your profile has your school/university set so pending students from your campus appear here.'}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* KPI Cards */}
                    <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
                        <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.08] to-transparent p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Pending Queue</span>
                                <Clock className="h-4 w-4 text-amber-400" />
                            </div>
                            <p className="mt-2.5 text-2xl font-black text-white">{stats.all ?? 0}</p>
                            <p className="mt-0.5 text-xs text-gray-400">Awaiting your review</p>
                        </div>

                        <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/[0.08] to-transparent p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">New Applicants</span>
                                <UserRound className="h-4 w-4 text-blue-400" />
                            </div>
                            <p className="mt-2.5 text-2xl font-black text-white">{stats.pending ?? 0}</p>
                            <p className="mt-0.5 text-xs text-gray-400">First-time registrations</p>
                        </div>

                        <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/[0.08] to-transparent p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">Renewals</span>
                                <RotateCcw className="h-4 w-4 text-purple-400" />
                            </div>
                            <p className="mt-2.5 text-2xl font-black text-white">{stats.renewal ?? 0}</p>
                            <p className="mt-0.5 text-xs text-gray-400">Submitted updated COR</p>
                        </div>

                        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.08] to-transparent p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">With Document</span>
                                <FileCheck2 className="h-4 w-4 text-emerald-400" />
                            </div>
                            <p className="mt-2.5 text-2xl font-black text-white">{stats.has_doc ?? 0}</p>
                            <p className="mt-0.5 text-xs text-gray-400">{stats.missing_doc ?? 0} missing COR</p>
                        </div>
                    </div>

                    {/* Main Queue Container */}
                    <div className="rounded-2xl border border-white/10 bg-[#101014] p-4 shadow-2xl sm:p-6">
                        {/* Tabs */}
                        <div className="mb-5 flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
                            {TABS.map((tab) => {
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => handleTabChange(tab.id)}
                                        className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-colors ${
                                            isActive
                                                ? 'bg-amber-400 text-black shadow'
                                                : 'border border-white/10 bg-white/[0.03] text-gray-300 hover:bg-white/[0.08] hover:text-white'
                                        }`}
                                    >
                                        <span>{tab.label}</span>
                                        <span
                                            className={`rounded-md px-1.5 py-0.5 text-[10px] font-extrabold ${
                                                isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-gray-300'
                                            }`}
                                        >
                                            {stats[tab.statKey] ?? 0}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Search & School Filter */}
                        <form onSubmit={submitSearch} className="mb-5 flex flex-col gap-3 sm:flex-row">
                            <div className="relative flex-1">
                                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="search"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search student name, email, username, MLBB ID, or Student ID..."
                                    className="min-h-[44px] w-full rounded-xl border border-white/10 bg-[#16161b] py-2.5 pl-10 pr-10 text-xs text-white placeholder:text-gray-500 focus:border-amber-400/60 focus:outline-none"
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        aria-label="Clear search"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            {scope.availableSchools?.length > 1 && (
                                <select
                                    value={selectedSchool}
                                    onChange={(e) => handleSchoolFilterChange(e.target.value)}
                                    className="min-h-[44px] rounded-xl border border-white/10 bg-[#16161b] px-3.5 py-2.5 text-xs font-medium text-gray-200 focus:border-amber-400/60 focus:outline-none sm:w-64"
                                >
                                    <option value="">All Assigned Schools</option>
                                    {scope.availableSchools.map((school) => (
                                        <option key={school} value={school}>
                                            {school}
                                        </option>
                                    ))}
                                </select>
                            )}

                            <button
                                type="submit"
                                className="min-h-[44px] shrink-0 rounded-xl bg-amber-400 px-5 text-xs font-bold text-black transition hover:bg-amber-300"
                            >
                                Search
                            </button>
                        </form>

                        {/* Desktop Table */}
                        <div className="hidden overflow-x-auto rounded-xl border border-white/10 md:block">
                            <table className="w-full border-collapse text-left text-sm">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/[0.03] text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                        <th className="px-4 py-3.5">Student</th>
                                        <th className="px-4 py-3.5">School &amp; Course</th>
                                        <th className="px-4 py-3.5">MLBB Account</th>
                                        <th className="px-4 py-3.5">Type &amp; COR</th>
                                        <th className="px-4 py-3.5">Submitted</th>
                                        <th className="px-4 py-3.5 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {items.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-14 text-center text-sm text-gray-400">
                                                No pending students awaiting verification in your scope.
                                            </td>
                                        </tr>
                                    ) : (
                                        items.map((student) => (
                                            <tr key={student.id} className="transition-colors hover:bg-white/[0.03]">
                                                <td className="px-4 py-3.5">
                                                    <div className="font-semibold text-white">
                                                        {student.name || `${student.first_name ?? ''} ${student.surname ?? ''}`.trim() || 'Unnamed'}
                                                    </div>
                                                    <div className="mt-0.5 text-xs text-gray-400">{student.email}</div>
                                                    {student.studentId && (
                                                        <div className="mt-0.5 font-mono text-[11px] text-gray-500">
                                                            ID: {student.studentId}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <div className="flex flex-wrap items-center gap-1.5">
                                                        <span className="text-xs font-semibold text-gray-200">
                                                            {student.university || '—'}
                                                        </span>
                                                        {student.has_student_leader === false && (
                                                            <span className="rounded border border-blue-400/30 bg-blue-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase text-blue-300">
                                                                No SL
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="mt-0.5 text-[11px] text-gray-400">
                                                        {[student.course, student.year_level].filter(Boolean).join(' · ') || '—'}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <div className="text-xs font-semibold text-gray-200">
                                                        {student.ml_ign || '—'}
                                                    </div>
                                                    <div className="mt-0.5 font-mono text-[11px] text-gray-400">
                                                        {student.ml_id ? `${student.ml_id} (${student.ml_server || '—'})` : '—'}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <div className="flex flex-wrap items-center gap-1.5">
                                                        <span
                                                            className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase ${
                                                                student.status === 'pending-review'
                                                                    ? 'border-purple-400/30 bg-purple-500/15 text-purple-300'
                                                                    : 'border-amber-400/30 bg-amber-400/15 text-amber-300'
                                                            }`}
                                                        >
                                                            {student.status === 'pending-review' ? 'Renewal' : 'New'}
                                                        </span>
                                                        <span
                                                            className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase ${
                                                                student.proofOfEnrollment
                                                                    ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300'
                                                                    : 'border-red-500/30 bg-red-500/15 text-red-300'
                                                            }`}
                                                        >
                                                            {student.proofOfEnrollment ? 'COR Attached' : 'No COR'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3.5 text-xs text-gray-400">
                                                    {timeAgo(student.updated_at || student.created_at)}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3.5 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => openReview(student)}
                                                        className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-3.5 py-2 text-xs font-bold text-black transition hover:bg-amber-300"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />
                                                        Review &amp; Verify
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card List */}
                        <div className="space-y-3 md:hidden">
                            {items.length === 0 ? (
                                <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-12 text-center text-sm text-gray-400">
                                    No pending students awaiting verification in your scope.
                                </div>
                            ) : (
                                items.map((student) => (
                                    <div key={student.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <h3 className="truncate text-sm font-bold text-white">
                                                    {student.name || 'Unnamed'}
                                                </h3>
                                                <p className="truncate text-xs text-gray-400">{student.email}</p>
                                            </div>
                                            <span
                                                className={`shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase ${
                                                    student.status === 'pending-review'
                                                        ? 'border-purple-400/30 bg-purple-500/15 text-purple-300'
                                                        : 'border-amber-400/30 bg-amber-400/15 text-amber-300'
                                                }`}
                                            >
                                                {student.status === 'pending-review' ? 'Renewal' : 'New'}
                                            </span>
                                        </div>

                                        <div className="mt-3 space-y-1 text-xs text-gray-300">
                                            <p className="font-medium text-white">{student.university || '—'}</p>
                                            <p className="text-gray-400">
                                                MLBB: {student.ml_ign || '—'} ({student.ml_id || '—'})
                                            </p>
                                        </div>

                                        <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                                            <span
                                                className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase ${
                                                    student.proofOfEnrollment
                                                        ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300'
                                                        : 'border-red-500/30 bg-red-500/15 text-red-300'
                                                }`}
                                            >
                                                {student.proofOfEnrollment ? 'COR Attached' : 'No COR'}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => openReview(student)}
                                                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-3.5 py-2 text-xs font-bold text-black"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                                Review
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Pagination */}
                        {users?.links?.length > 3 && (
                            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                                <p className="text-xs text-gray-400">
                                    Showing <span className="font-semibold text-white">{users.from ?? 0}</span>–
                                    <span className="font-semibold text-white">{users.to ?? 0}</span> of{' '}
                                    <span className="font-semibold text-white">{users.total ?? 0}</span>
                                </p>
                                <div className="flex flex-wrap items-center gap-1.5">
                                    {users.links.map((link, idx) => (
                                        <Link
                                            key={`${link.label}-${idx}`}
                                            href={link.url || '#'}
                                            preserveScroll
                                            preserveState
                                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                                                link.active
                                                    ? 'bg-amber-400 text-black'
                                                    : link.url
                                                      ? 'border border-white/10 bg-white/[0.04] text-gray-300 hover:bg-white/10 hover:text-white'
                                                      : 'pointer-events-none border border-white/5 text-gray-600'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* REVIEW & VERIFICATION MODAL */}
            {selectedStudent &&
                typeof document !== 'undefined' &&
                createPortal(
                    <div
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 backdrop-blur-md sm:p-6"
                        role="dialog"
                        aria-modal="true"
                        onClick={(e) => {
                            if (e.target === e.currentTarget && !isProcessing) closeReview();
                        }}
                    >
                        <div className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-amber-400/30 bg-[#0f0f12] shadow-2xl sm:max-h-[calc(100dvh-3rem)]">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-[#141418] px-5 py-4">
                                <div className="min-w-0">
                                    <h2 className="truncate text-base font-bold text-white sm:text-lg">
                                        Verify Student: {selectedStudent.name}
                                    </h2>
                                    <p className="truncate text-xs text-gray-400">
                                        {selectedStudent.university || 'No school listed'} · Submitted{' '}
                                        {formatDate(selectedStudent.updated_at || selectedStudent.created_at)}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={closeReview}
                                    disabled={isProcessing}
                                    className="rounded-lg p-1.5 text-gray-400 hover:bg-white/10 hover:text-white"
                                    aria-label="Close review modal"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Mobile Tab Switcher */}
                            <div className="grid grid-cols-2 border-b border-white/10 bg-[#121216] p-1.5 lg:hidden">
                                <button
                                    type="button"
                                    onClick={() => setMobileTab('info')}
                                    className={`rounded-lg py-2 text-xs font-bold ${
                                        mobileTab === 'info' ? 'bg-amber-400 text-black' : 'text-gray-400'
                                    }`}
                                >
                                    Student Profile
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMobileTab('doc')}
                                    className={`rounded-lg py-2 text-xs font-bold ${
                                        mobileTab === 'doc' ? 'bg-amber-400 text-black' : 'text-gray-400'
                                    }`}
                                >
                                    COR Document
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-12">
                                {/* Left: Student Info & Audit Checklist */}
                                <div
                                    className={`space-y-5 border-b border-white/10 p-5 lg:col-span-5 lg:overflow-y-auto lg:border-b-0 lg:border-r ${
                                        mobileTab === 'doc' ? 'hidden lg:block' : 'block'
                                    }`}
                                >
                                    <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs">
                                        <h3 className="font-bold uppercase tracking-wider text-amber-400">
                                            Student Information
                                        </h3>
                                        <div className="grid grid-cols-1 gap-2.5">
                                            <div className="flex items-start gap-2.5">
                                                <UserRound className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-500" />
                                                <div>
                                                    <span className="text-gray-500">Full Name / Username</span>
                                                    <p className="font-semibold text-white">
                                                        {selectedStudent.name} (@{selectedStudent.username || '—'})
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2.5">
                                                <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-500" />
                                                <div className="min-w-0">
                                                    <span className="text-gray-500">Email</span>
                                                    <p className="break-all font-semibold text-white">
                                                        {selectedStudent.email || '—'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2.5">
                                                <GraduationCap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-500" />
                                                <div>
                                                    <span className="text-gray-500">School / Course / Year</span>
                                                    <p className="font-semibold text-white">
                                                        {selectedStudent.university || '—'}
                                                    </p>
                                                    <p className="text-gray-400">
                                                        {[selectedStudent.course, selectedStudent.year_level].filter(Boolean).join(' · ') || '—'}
                                                    </p>
                                                    {selectedStudent.studentId && (
                                                        <p className="font-mono text-[11px] text-amber-300">
                                                            Student ID: {selectedStudent.studentId}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2.5">
                                                <Gamepad2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-500" />
                                                <div>
                                                    <span className="text-gray-500">MLBB Account</span>
                                                    <p className="font-semibold text-white">
                                                        {selectedStudent.ml_ign || '—'}
                                                    </p>
                                                    <p className="font-mono text-[11px] text-gray-400">
                                                        UID: {selectedStudent.ml_id || '—'} · Server: {selectedStudent.ml_server || '—'}
                                                    </p>
                                                </div>
                                            </div>
                                            {selectedStudent.contact_number && (
                                                <div className="flex items-start gap-2.5">
                                                    <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-500" />
                                                    <div>
                                                        <span className="text-gray-500">Contact</span>
                                                        <p className="font-semibold text-white">
                                                            {selectedStudent.contact_number}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Quick Audit Checklist */}
                                    <div className="space-y-2.5 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs">
                                        <h3 className="font-bold uppercase tracking-wider text-gray-300">
                                            Verification Checklist
                                        </h3>
                                        {[
                                            { key: 'nameMatches', label: 'Applicant name matches School ID / COR' },
                                            { key: 'schoolMatches', label: 'School / University matches submitted document' },
                                            { key: 'validTerm', label: 'Enrolled for current academic term' },
                                            { key: 'clearDoc', label: 'Document is clear and untampered' },
                                        ].map((item) => {
                                            const checked = auditChecks[item.key];
                                            return (
                                                <button
                                                    key={item.key}
                                                    type="button"
                                                    onClick={() =>
                                                        setAuditChecks((prev) => ({ ...prev, [item.key]: !prev[item.key] }))
                                                    }
                                                    className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition hover:bg-white/5"
                                                >
                                                    {checked ? (
                                                        <CheckSquare className="h-4 w-4 shrink-0 text-emerald-400" />
                                                    ) : (
                                                        <Square className="h-4 w-4 shrink-0 text-gray-500" />
                                                    )}
                                                    <span className={checked ? 'text-white' : 'text-gray-400'}>
                                                        {item.label}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Right: Document Viewer */}
                                <div
                                    className={`flex flex-col bg-[#09090b] p-5 lg:col-span-7 ${
                                        mobileTab === 'info' ? 'hidden lg:flex' : 'flex'
                                    }`}
                                >
                                    <div className="mb-3 flex items-center justify-between gap-2">
                                        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-300">
                                            <FileText className="h-4 w-4 text-amber-400" />
                                            Proof of Enrollment / COR
                                        </span>
                                        {proofUrl && (
                                            <div className="flex items-center gap-1.5">
                                                {!isPdf(proofUrl) && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() => setDocZoom((z) => Math.max(50, z - 25))}
                                                            className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-gray-300 hover:text-white"
                                                            title="Zoom out"
                                                        >
                                                            <ZoomOut className="h-3.5 w-3.5" />
                                                        </button>
                                                        <span className="px-1 font-mono text-[11px] text-gray-400">
                                                            {docZoom}%
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => setDocZoom((z) => Math.min(250, z + 25))}
                                                            className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-gray-300 hover:text-white"
                                                            title="Zoom in"
                                                        >
                                                            <ZoomIn className="h-3.5 w-3.5" />
                                                        </button>
                                                    </>
                                                )}
                                                <a
                                                    href={proofUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] font-semibold text-amber-300 hover:bg-white/10"
                                                >
                                                    Open
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex min-h-[320px] flex-1 items-center justify-center overflow-auto rounded-xl border border-white/10 bg-black/60 p-3">
                                        {!proofUrl ? (
                                            <div className="text-center text-xs text-gray-500">
                                                <FileText className="mx-auto mb-2 h-8 w-8 text-gray-600" />
                                                No Proof of Enrollment / COR uploaded by this student.
                                            </div>
                                        ) : isPdf(proofUrl) ? (
                                            <iframe
                                                src={proofUrl}
                                                title="Proof of Enrollment PDF"
                                                className="h-[420px] w-full rounded-lg bg-white"
                                            />
                                        ) : (
                                            <img
                                                src={proofUrl}
                                                alt="Proof of Enrollment"
                                                style={{ width: `${docZoom}%` }}
                                                className="max-w-none rounded-lg object-contain transition-all"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer Actions */}
                            <div className="flex flex-col-reverse gap-2.5 border-t border-white/10 bg-[#141418] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <button
                                    type="button"
                                    onClick={() => setShowRejectModal(true)}
                                    disabled={isProcessing}
                                    className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 text-xs font-bold text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
                                >
                                    <XCircle className="h-4 w-4" />
                                    Reject Application
                                </button>

                                <div className="flex items-center gap-2.5">
                                    <button
                                        type="button"
                                        onClick={closeReview}
                                        disabled={isProcessing}
                                        className="min-h-[42px] flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-xs font-bold text-gray-300 hover:bg-white/10 sm:flex-none"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleApprove(selectedStudent)}
                                        disabled={isProcessing}
                                        className="inline-flex min-h-[42px] flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 text-xs font-bold text-black shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 disabled:opacity-50 sm:flex-none"
                                    >
                                        {isProcessing ? (
                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Check className="h-4 w-4 stroke-[3]" />
                                        )}
                                        Approve &amp; Verify
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}

            {/* REJECTION REASON MODAL */}
            {showRejectModal &&
                selectedStudent &&
                typeof document !== 'undefined' &&
                createPortal(
                    <div
                        className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
                        role="dialog"
                        aria-modal="true"
                    >
                        <form
                            onSubmit={handleConfirmReject}
                            className="w-full max-w-lg rounded-2xl border border-red-500/30 bg-[#121216] p-5 shadow-2xl sm:p-6"
                        >
                            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
                                <div className="flex items-center gap-2 text-red-400">
                                    <AlertTriangle className="h-5 w-5" />
                                    <h3 className="text-base font-bold text-white">Reject Application</h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowRejectModal(false)}
                                    className="rounded-lg p-1 text-gray-400 hover:text-white"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            <p className="mb-3 text-xs text-gray-400">
                                Select deficiencies or enter a clear reason for rejecting{' '}
                                <strong className="text-white">{selectedStudent.name}</strong>:
                            </p>

                            <div className="mb-4 space-y-1.5">
                                {COMMON_REJECTION_REASONS.map((reason) => {
                                    const checked = rejectionChecklist.includes(reason);
                                    return (
                                        <button
                                            key={reason}
                                            type="button"
                                            onClick={() => toggleRejectionCheck(reason)}
                                            className={`flex w-full items-start gap-2.5 rounded-xl border px-3 py-2 text-left text-xs transition ${
                                                checked
                                                    ? 'border-red-500/40 bg-red-500/15 text-red-200'
                                                    : 'border-white/10 bg-white/[0.02] text-gray-300 hover:bg-white/[0.05]'
                                            }`}
                                        >
                                            {checked ? (
                                                <CheckSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
                                            ) : (
                                                <Square className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-500" />
                                            )}
                                            <span>{reason}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mb-5">
                                <label className="mb-1.5 block text-xs font-bold uppercase text-gray-300">
                                    Rejection Remarks <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="Explain what the student needs to fix before reapplying..."
                                    className="w-full rounded-xl border border-white/10 bg-[#0b0b0e] p-3 text-xs text-white placeholder:text-gray-500 focus:border-red-400/60 focus:outline-none"
                                />
                            </div>

                            <div className="flex justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setShowRejectModal(false)}
                                    disabled={isProcessing}
                                    className="min-h-[40px] rounded-xl border border-white/10 bg-white/[0.04] px-4 text-xs font-bold text-gray-300 hover:bg-white/10"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-red-500 px-5 text-xs font-bold text-white transition hover:bg-red-400 disabled:opacity-50"
                                >
                                    {isProcessing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                                    Confirm Rejection
                                </button>
                            </div>
                        </form>
                    </div>,
                    document.body
                )}
        </MainLayout>
    );
}
