import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Check, Search, UserRound, Mail, CalendarDays, LoaderCircle,
    Eye, FileText, AlertTriangle, X, ShieldCheck, CheckCircle2,
    XCircle, ExternalLink, ZoomIn, ZoomOut, RotateCcw, Building2,
    GraduationCap, Gamepad2, Phone, Clock, FileCheck2, Filter,
    CheckSquare, Square
} from 'lucide-react';
import { useState, useEffect } from 'react';

const ACCENT = '#FBBF24';

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

const COMMON_REJECTION_REASONS = [
    'Blurry or unreadable proof of enrollment',
    'Student ID does not match applicant name',
    'Expired document / Not enrolled for the current academic term',
    'Document appears tampered, altered, or fraudulent',
    'Non-accredited school or unverified university branch',
    'Wrong file submitted (not a School ID or Certificate of Registration)',
];

export default function PendingUsers({ users, filters = {}, stats = {} }) {
    const [search, setSearch] = useState(filters.search ?? '');
    const activeTab = filters.tab ?? 'all';
    const items = users?.data ?? [];

    // Modal state
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [docZoom, setDocZoom] = useState(100);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [rejectionChecklist, setRejectionChecklist] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [auditChecks, setAuditChecks] = useState({
        nameMatches: false,
        schoolMatches: false,
        validTerm: false,
        clearDoc: false,
    });

    const submitSearch = (event) => {
        event.preventDefault();
        router.get(route('admin.users.pending'), { search, tab: activeTab }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleTabChange = (newTab) => {
        router.get(route('admin.users.pending'), { search: search || undefined, tab: newTab }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const clearSearch = () => {
        setSearch('');
        router.get(route('admin.users.pending'), { tab: activeTab }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const openReview = (student) => {
        setSelectedStudent(student);
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
        router.post(route('admin.users.pending-approve', student.id), {}, {
            preserveScroll: true,
            onFinish: () => {
                setIsProcessing(false);
                closeReview();
            },
        });
    };

    const handleRejectSubmit = (e) => {
        e.preventDefault();
        if (!selectedStudent || isProcessing) return;
        if (!rejectionReason.trim()) {
            alert('Please provide a rejection reason for the applicant.');
            return;
        }

        setIsProcessing(true);
        router.post(route('admin.users.pending-reject', selectedStudent.id), {
            reason: rejectionReason,
            checklist: rejectionChecklist,
        }, {
            preserveScroll: true,
            onFinish: () => {
                setIsProcessing(false);
                closeReview();
            },
        });
    };

    const toggleChecklist = (reason) => {
        setRejectionChecklist((prev) => {
            if (prev.includes(reason)) {
                return prev.filter((r) => r !== reason);
            }
            return [...prev, reason];
        });
    };

    // Close on Escape
    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === 'Escape' && selectedStudent) {
                closeReview();
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedStudent]);

    return (
        <AdminLayout activeNavId="pending-users" showGlobalSearch>
            <Head title="Pending Queue | Student Verification" />

            {/* Header Section */}
            <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">Pending Queue</h1>
                        <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-xs font-bold text-amber-400">
                            {stats.all ?? items.length} awaiting review
                        </span>
                    </div>
                    <p className="mt-1.5 text-sm text-gray-400">
                        Inspect submitted student credentials, audit proof of enrollment documents, and verify registrations.
                    </p>
                </div>

                {/* Search Bar */}
                <form onSubmit={submitSearch} className="flex w-full gap-2 sm:w-auto">
                    <label htmlFor="pending-users-search" className="sr-only">Search pending users</label>
                    <div className="relative flex-1 sm:w-72">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            id="pending-users-search"
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search name, school, ML-ID..."
                            className="min-h-[44px] w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 transition-all focus:border-amber-400/50 focus:bg-black/80 focus:ring-2 focus:ring-amber-400/20 focus:outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-amber-400 px-5 text-sm font-bold text-black transition-all hover:bg-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.15)]"
                    >
                        Search
                    </button>
                    {search && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="min-h-[44px] rounded-xl border border-white/10 px-3.5 text-sm font-semibold text-gray-400 hover:border-white/20 hover:text-white"
                        >
                            Clear
                        </button>
                    )}
                </form>
            </div>

            {/* Filter Tabs & Stat Counters */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-white/10 bg-black/40 p-1">
                    <button
                        type="button"
                        onClick={() => handleTabChange('all')}
                        className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                            activeTab === 'all'
                                ? 'bg-amber-400 text-black shadow-sm'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        All Applications ({stats.all ?? 0})
                    </button>
                    <button
                        type="button"
                        onClick={() => handleTabChange('pending')}
                        className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                            activeTab === 'pending'
                                ? 'bg-amber-400 text-black shadow-sm'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        New Registrations ({stats.pending ?? 0})
                    </button>
                    <button
                        type="button"
                        onClick={() => handleTabChange('renewal')}
                        className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                            activeTab === 'renewal'
                                ? 'bg-amber-400 text-black shadow-sm'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Renewal Reviews ({stats.renewal ?? 0})
                    </button>
                    <button
                        type="button"
                        onClick={() => handleTabChange('has-doc')}
                        className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                            activeTab === 'has-doc'
                                ? 'bg-amber-400 text-black shadow-sm'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        With Document ({stats.has_doc ?? 0})
                    </button>
                </div>
            </div>

            {/* Main Queue Table Card */}
            <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#111113] shadow-2xl">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                        </div>
                        <h2 className="text-lg font-bold text-white">Queue is clear!</h2>
                        <p className="mt-1 text-sm text-gray-400 max-w-sm">
                            {search
                                ? 'No pending student applications match your search query.'
                                : 'There are currently zero applications awaiting verification.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] table-auto text-left text-sm">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/[0.02] text-xs font-bold uppercase tracking-wider text-gray-400">
                                    <th className="px-5 py-4">Student Profile</th>
                                    <th className="px-5 py-4">Academic Details</th>
                                    <th className="px-5 py-4">MLBB Identity</th>
                                    <th className="px-5 py-4">Proof of Enrollment</th>
                                    <th className="px-5 py-4">Applied</th>
                                    <th className="px-5 py-4 text-right">Verification Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-gray-300">
                                {items.map((user) => {
                                    const hasDoc = Boolean(user.proofOfEnrollment);
                                    const isRenewal = user.status === 'pending-review';

                                    return (
                                        <tr
                                            key={user.id}
                                            className="transition-colors hover:bg-white/[0.02] group"
                                        >
                                            {/* Profile */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-400/20 bg-neutral-900 font-bold text-amber-400">
                                                        {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-bold text-white group-hover:text-amber-300 transition-colors">
                                                                {user.name || 'Unnamed Student'}
                                                            </p>
                                                            {isRenewal ? (
                                                                <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-400">
                                                                    Renewal
                                                                </span>
                                                            ) : (
                                                                <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                                                                    New Reg
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

                                            {/* Academic */}
                                            <td className="px-5 py-4">
                                                <div className="min-w-0">
                                                    <p className="flex items-center gap-1.5 font-semibold text-white">
                                                        <Building2 className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                                                        <span className="truncate">{user.university || 'No campus recorded'}</span>
                                                    </p>
                                                    <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                                                        <GraduationCap className="h-3 w-3 shrink-0 text-gray-500" />
                                                        <span>{user.course || 'Unspecified course'}</span>
                                                        {user.year_level && <span>• {user.year_level}</span>}
                                                    </p>
                                                    <p className="mt-0.5 text-[11px] text-gray-500 font-mono">
                                                        ID: {user.studentId || '—'}
                                                    </p>
                                                </div>
                                            </td>

                                            {/* MLBB */}
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

                                            {/* Proof Document */}
                                            <td className="px-5 py-4">
                                                {hasDoc ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => openReview(user)}
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/20"
                                                    >
                                                        <FileCheck2 className="h-3.5 w-3.5" />
                                                        <span>{isPdf(user.proofOfEnrollment) ? 'View PDF Proof' : 'View ID Photo'}</span>
                                                    </button>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-xs text-amber-500/90 font-medium">
                                                        <AlertTriangle className="h-3.5 w-3.5" />
                                                        <span>No doc uploaded</span>
                                                    </span>
                                                )}
                                            </td>

                                            {/* Registered */}
                                            <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">
                                                <p className="font-medium text-gray-300">{timeAgo(user.created_at)}</p>
                                                <p className="mt-0.5 text-[11px] text-gray-500">{formatDate(user.created_at)}</p>
                                            </td>

                                            {/* Action Button */}
                                            <td className="px-5 py-4 text-right whitespace-nowrap">
                                                <button
                                                    type="button"
                                                    id={`review-student-btn-${user.id}`}
                                                    onClick={() => openReview(user)}
                                                    className="inline-flex min-h-[38px] items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 text-xs font-bold text-black transition-all hover:bg-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.15)]"
                                                >
                                                    <Eye className="h-3.5 w-3.5" />
                                                    <span>Review Application</span>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {users?.links?.length > 3 && (
                    <nav className="flex flex-wrap items-center justify-between border-t border-white/10 bg-white/[0.01] px-5 py-3 text-xs" aria-label="Pagination">
                        <span className="text-gray-400">
                            Showing page {users.current_page} of {users.last_page}
                        </span>
                        <div className="flex gap-1.5">
                            {users.links.map((link, index) => (
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

            {/* FULL STUDENT VERIFICATION DOSSIER & DOCUMENT INSPECTOR MODAL */}
            {selectedStudent && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 backdrop-blur-md sm:p-6"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="student-dossier-title"
                >
                    <div className="relative flex flex-col h-full max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-3xl border border-white/15 bg-[#0f0f11] shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                        {/* Modal Header */}
                        <header className="flex shrink-0 items-center justify-between border-b border-white/10 bg-white/[0.02] px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/10 text-amber-400">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 id="student-dossier-title" className="text-lg font-bold text-white tracking-tight">
                                            {selectedStudent.name || 'Student Application'}
                                        </h2>
                                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                            selectedStudent.status === 'pending-review'
                                                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                                : 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
                                        }`}>
                                            {selectedStudent.status === 'pending-review' ? 'Annual Renewal' : 'New Registration'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        Applicant ID: #{selectedStudent.id} • Registered {formatDate(selectedStudent.created_at)}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={closeReview}
                                aria-label="Close modal"
                                className="rounded-xl border border-white/10 bg-white/[0.03] p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </header>

                        {/* Modal Body: Split Dossier (Left) + Document Inspector (Right) */}
                        <div className="grid flex-1 min-h-0 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/10 overflow-hidden">
                            {/* Left Pane: Student Information Dossier (5 cols) */}
                            <div className="lg:col-span-5 flex flex-col h-full overflow-y-auto p-5 sm:p-6 space-y-5 scrollbar-thin">
                                {/* Academic Information */}
                                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                                    <div className="mb-3 flex items-center justify-between">
                                        <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                                            <Building2 className="h-4 w-4" /> Academic Credentials
                                        </h3>
                                    </div>
                                    <dl className="space-y-3 text-xs">
                                        <div>
                                            <dt className="text-gray-500 font-medium">University / Campus</dt>
                                            <dd className="mt-0.5 text-sm font-semibold text-white">
                                                {selectedStudent.university || 'Not provided'}
                                            </dd>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <dt className="text-gray-500 font-medium">Course</dt>
                                                <dd className="mt-0.5 text-sm font-semibold text-gray-200">
                                                    {selectedStudent.course || 'Not provided'}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-gray-500 font-medium">Year Level</dt>
                                                <dd className="mt-0.5 text-sm font-semibold text-gray-200">
                                                    {selectedStudent.year_level || 'Not provided'}
                                                </dd>
                                            </div>
                                        </div>
                                        <div>
                                            <dt className="text-gray-500 font-medium">Student ID Number</dt>
                                            <dd className="mt-0.5 font-mono text-sm font-bold text-amber-300">
                                                {selectedStudent.studentId || 'Not provided'}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                {/* MLBB Game Credentials */}
                                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                                    <div className="mb-3 flex items-center justify-between">
                                        <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
                                            <Gamepad2 className="h-4 w-4" /> MLBB In-Game Identity
                                        </h3>
                                    </div>
                                    <dl className="grid grid-cols-2 gap-3 text-xs">
                                        <div>
                                            <dt className="text-gray-500 font-medium">In-Game Name (IGN)</dt>
                                            <dd className="mt-0.5 text-sm font-bold text-white">
                                                {selectedStudent.ml_ign || '—'}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-gray-500 font-medium">In-Game Rank</dt>
                                            <dd className="mt-0.5 text-sm font-semibold text-gray-200">
                                                {selectedStudent.ml_rank || 'Unranked'}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-gray-500 font-medium">User ID</dt>
                                            <dd className="mt-0.5 font-mono text-xs font-bold text-gray-300">
                                                {selectedStudent.ml_id || '—'}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-gray-500 font-medium">Server ID</dt>
                                            <dd className="mt-0.5 font-mono text-xs font-bold text-gray-300">
                                                {selectedStudent.ml_server || '—'}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                {/* Contact Details */}
                                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                                    <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                                        Contact Information
                                    </h3>
                                    <dl className="space-y-2 text-xs">
                                        <div className="flex items-center justify-between">
                                            <dt className="text-gray-500">Email Address</dt>
                                            <dd className="font-semibold text-white">{selectedStudent.email || '—'}</dd>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <dt className="text-gray-500">Phone Number</dt>
                                            <dd className="font-semibold text-white">{selectedStudent.contact_number || '—'}</dd>
                                        </div>
                                        {selectedStudent.facebook_link && (
                                            <div className="flex items-center justify-between">
                                                <dt className="text-gray-500">Social Profile</dt>
                                                <dd>
                                                    <a
                                                        href={selectedStudent.facebook_link}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-1 text-amber-400 hover:underline"
                                                    >
                                                        <span>View Facebook</span>
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                </dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>

                                {/* Interactive Verification Audit Checklist */}
                                <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.03] p-4">
                                    <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                                        Verification Checklist
                                    </h3>
                                    <p className="text-[11px] text-gray-400 mb-3">
                                        Review the document on the right and check each requirement:
                                    </p>
                                    <div className="space-y-2 text-xs">
                                        <label className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white">
                                            <input
                                                type="checkbox"
                                                checked={auditChecks.nameMatches}
                                                onChange={(e) => setAuditChecks({ ...auditChecks, nameMatches: e.target.checked })}
                                                className="h-4 w-4 rounded border-white/20 bg-black/60 text-amber-400 focus:ring-amber-400/20"
                                            />
                                            <span>Full name matches enrollment document</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white">
                                            <input
                                                type="checkbox"
                                                checked={auditChecks.schoolMatches}
                                                onChange={(e) => setAuditChecks({ ...auditChecks, schoolMatches: e.target.checked })}
                                                className="h-4 w-4 rounded border-white/20 bg-black/60 text-amber-400 focus:ring-amber-400/20"
                                            />
                                            <span>Campus and Student ID number match</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white">
                                            <input
                                                type="checkbox"
                                                checked={auditChecks.validTerm}
                                                onChange={(e) => setAuditChecks({ ...auditChecks, validTerm: e.target.checked })}
                                                className="h-4 w-4 rounded border-white/20 bg-black/60 text-amber-400 focus:ring-amber-400/20"
                                            />
                                            <span>Enrolled for current academic year / semester</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white">
                                            <input
                                                type="checkbox"
                                                checked={auditChecks.clearDoc}
                                                onChange={(e) => setAuditChecks({ ...auditChecks, clearDoc: e.target.checked })}
                                                className="h-4 w-4 rounded border-white/20 bg-black/60 text-amber-400 focus:ring-amber-400/20"
                                            />
                                            <span>Photo / PDF is genuine and clear (not fake or altered)</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Right Pane: Document Inspector (7 cols) */}
                            <div className="lg:col-span-7 flex flex-col h-full bg-black/60 overflow-hidden">
                                {/* Document Toolbar */}
                                <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-black/40 px-5 py-3">
                                    <div className="flex items-center gap-2">
                                        <FileCheck2 className="h-4 w-4 text-emerald-400" />
                                        <span className="text-xs font-bold text-white">Proof of Enrollment</span>
                                        {selectedStudent.proofOfEnrollment && (
                                            <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-mono text-gray-400">
                                                {isPdf(selectedStudent.proofOfEnrollment) ? 'PDF Document' : 'Image File'}
                                            </span>
                                        )}
                                    </div>

                                    {selectedStudent.proofOfEnrollment && (
                                        <div className="flex items-center gap-2">
                                            {!isPdf(selectedStudent.proofOfEnrollment) && (
                                                <div className="flex items-center gap-1 border-r border-white/10 pr-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setDocZoom((z) => Math.max(50, z - 25))}
                                                        className="rounded-lg p-1.5 text-gray-400 hover:bg-white/10 hover:text-white"
                                                        title="Zoom out"
                                                    >
                                                        <ZoomOut className="h-4 w-4" />
                                                    </button>
                                                    <span className="min-w-[40px] text-center text-xs font-mono text-gray-400">{docZoom}%</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setDocZoom((z) => Math.min(250, z + 25))}
                                                        className="rounded-lg p-1.5 text-gray-400 hover:bg-white/10 hover:text-white"
                                                        title="Zoom in"
                                                    >
                                                        <ZoomIn className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setDocZoom(100)}
                                                        className="rounded-lg p-1.5 text-gray-400 hover:bg-white/10 hover:text-white"
                                                        title="Reset zoom"
                                                    >
                                                        <RotateCcw className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            )}

                                            <a
                                                href={selectedStudent.proofOfEnrollment}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-gray-300 hover:bg-white/10 hover:text-white"
                                            >
                                                <span>Open Full</span>
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {/* Document Canvas */}
                                <div className="flex-1 min-h-0 overflow-auto p-4 flex items-center justify-center">
                                    {!selectedStudent.proofOfEnrollment ? (
                                        <div className="flex flex-col items-center justify-center text-center p-8 max-w-sm">
                                            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10">
                                                <AlertTriangle className="h-7 w-7 text-amber-400" />
                                            </div>
                                            <p className="text-sm font-bold text-white">No Document Uploaded</p>
                                            <p className="mt-1 text-xs text-gray-400">
                                                This student did not attach a Certificate of Registration or School ID. You may reject the application requesting a valid document upload.
                                            </p>
                                        </div>
                                    ) : isPdf(selectedStudent.proofOfEnrollment) ? (
                                        <div className="w-full h-full flex flex-col">
                                            <iframe
                                                src={selectedStudent.proofOfEnrollment}
                                                title="Proof of Enrollment PDF"
                                                className="w-full flex-1 rounded-xl border border-white/10 bg-neutral-900"
                                            />
                                        </div>
                                    ) : (
                                        <div className="relative max-w-full max-h-full transition-transform duration-200" style={{ transform: `scale(${docZoom / 100})`, transformOrigin: 'center center' }}>
                                            <img
                                                src={selectedStudent.proofOfEnrollment}
                                                alt="Proof of Enrollment"
                                                className="rounded-xl border border-white/10 max-h-[60vh] max-w-full object-contain shadow-2xl"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Modal Action Footer */}
                        <footer className="flex shrink-0 items-center justify-between border-t border-white/10 bg-[#0c0c0e] px-6 py-4">
                            <button
                                type="button"
                                onClick={closeReview}
                                className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                            >
                                Cancel
                            </button>

                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    id="open-reject-modal-btn"
                                    onClick={() => setShowRejectModal(true)}
                                    disabled={isProcessing}
                                    className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs font-bold text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                                >
                                    <XCircle className="h-4 w-4" />
                                    <span>Reject Application</span>
                                </button>

                                <button
                                    type="button"
                                    id="approve-student-btn"
                                    onClick={() => handleApprove(selectedStudent)}
                                    disabled={isProcessing}
                                    className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-emerald-500 px-6 py-2.5 text-xs font-extrabold text-black transition-all hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50"
                                >
                                    {isProcessing ? (
                                        <LoaderCircle className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Check className="h-4 w-4 stroke-[3]" />
                                    )}
                                    <span>Approve & Verify Student</span>
                                </button>
                            </div>
                        </footer>

                        {/* REJECTION REASON PROMPT OVERLAY */}
                        {showRejectModal && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in duration-100">
                                <div className="w-full max-w-lg rounded-2xl border border-red-500/30 bg-[#141416] p-6 shadow-2xl">
                                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                        <div className="flex items-center gap-2.5">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                                                <AlertTriangle className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-white">Reject Application</h3>
                                                <p className="text-xs text-gray-400">Specify reason for {selectedStudent.name}</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowRejectModal(false)}
                                            className="text-gray-400 hover:text-white"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleRejectSubmit} className="mt-4 space-y-4">
                                        {/* Predefined reason checklist */}
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                                Select Applicable Violations / Issues
                                            </label>
                                            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                                                {COMMON_REJECTION_REASONS.map((reason) => {
                                                    const isChecked = rejectionChecklist.includes(reason);
                                                    return (
                                                        <button
                                                            key={reason}
                                                            type="button"
                                                            onClick={() => toggleChecklist(reason)}
                                                            className={`flex w-full items-start gap-2.5 rounded-lg border p-2 text-left text-xs transition-colors ${
                                                                isChecked
                                                                    ? 'border-red-500/40 bg-red-500/10 text-white'
                                                                    : 'border-white/5 bg-white/[0.02] text-gray-400 hover:bg-white/5 hover:text-gray-300'
                                                            }`}
                                                        >
                                                            {isChecked ? (
                                                                <CheckSquare className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                                                            ) : (
                                                                <Square className="h-4 w-4 shrink-0 text-gray-600 mt-0.5" />
                                                            )}
                                                            <span>{reason}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Custom remarks */}
                                        <div>
                                            <label htmlFor="rejection-remarks" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                                                Remarks / Message to Student <span className="text-red-400">*</span>
                                            </label>
                                            <textarea
                                                id="rejection-remarks"
                                                rows={3}
                                                required
                                                value={rejectionReason}
                                                onChange={(e) => setRejectionReason(e.target.value)}
                                                placeholder="Explain why the registration was rejected and what requirements must be resubmitted..."
                                                className="w-full rounded-xl border border-white/10 bg-black/60 p-3 text-xs text-white placeholder:text-gray-500 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 focus:outline-none"
                                            />
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-end gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => setShowRejectModal(false)}
                                                className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white"
                                            >
                                                Back
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isProcessing || !rejectionReason.trim()}
                                                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-red-500 disabled:opacity-50"
                                            >
                                                {isProcessing ? (
                                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <XCircle className="h-4 w-4" />
                                                )}
                                                <span>Confirm Rejection</span>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

