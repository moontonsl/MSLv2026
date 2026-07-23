import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowUp,
    Ban,
    Camera,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Copy,
    Mars,
    Pencil,
    RefreshCw,
    Search,
    Sparkles,
    Venus,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import NewStudentProfileModal from './modals/NewStudentProfileModal';
import BlockedStudentProfileModal from './modals/BlockedStudentProfileModal';
import InactiveStudentProfileModal from './modals/InactiveStudentProfileModal';
import PendingStudentProfileModal from './modals/PendingStudentProfileModal';
import VerifiedStudentProfileModal from './modals/VerifiedStudentProfileModal';
import {
    accountCounts,
    slAdminProfile,
    studentCount,
    roleOptions,
    statusOptions,
} from './slAdminData';
import { students } from './studentsData';
import { getTemporaryAccountView } from './temporarySession';

const PAGE_SIZE = 10;

const statusStyles = {
    Verified: {
        icon: CheckCircle2,
        className: 'bg-green-950/60 text-green-500',
    },
    New: {
        icon: RefreshCw,
        className: 'bg-yellow-900/40 text-brand-500',
    },
    Pending: {
        icon: RefreshCw,
        className: 'bg-yellow-900/40 text-brand-500',
    },
    Blocked: {
        icon: Ban,
        className: 'bg-red-950/50 text-red-500',
    },
    Inactive: {
        icon: Ban,
        className: 'bg-gray-800 text-gray-400',
    },
};

const statCards = [
    {
        label: 'Verified',
        value: accountCounts.verified,
        icon: CheckCircle2,
        color: 'text-green-500',
        background: 'bg-green-500/10',
    },
    {
        label: 'New',
        value: accountCounts.new,
        icon: Sparkles,
        color: 'text-blue-500',
        background: 'bg-blue-500/10',
    },
    {
        label: 'Renewal',
        value: accountCounts.renewal,
        icon: RefreshCw,
        color: 'text-brand-600',
        background: 'bg-brand-500/20',
    },
    {
        label: 'Blocked',
        value: accountCounts.blocked,
        icon: Ban,
        color: 'text-red-500',
        background: 'bg-red-500/10',
    },
];

function GenderIcon({ gender, className = 'h-5 w-5' }) {
    const Icon = gender === 'female' ? Venus : Mars;

    return <Icon className={`${className} shrink-0 text-brand-500`} aria-hidden="true" />;
}

function ProfileMeta({ label, value }) {
    return (
        <div>
            <div className="text-sm font-bold leading-[22px] text-brand-300">{label}</div>
            <div className="mt-1 font-heading text-base font-bold leading-[26px] text-gray-300 sm:text-lg">
                {value}
            </div>
        </div>
    );
}

function SortControls({ column, sort, onSort }) {
    return (
        <span className="ml-1 inline-flex flex-col">
            <button
                type="button"
                className={`h-2.5 ${sort.column === column && sort.direction === 'asc' ? 'text-brand-400' : 'text-gray-500'}`}
                onClick={() => onSort(column, 'asc')}
                aria-label={`Sort ${column} ascending`}
            >
                <ArrowUp className="h-3 w-3" />
            </button>
            <button
                type="button"
                className={`h-2.5 ${sort.column === column && sort.direction === 'desc' ? 'text-brand-400' : 'text-gray-500'}`}
                onClick={() => onSort(column, 'desc')}
                aria-label={`Sort ${column} descending`}
            >
                <ArrowDown className="h-3 w-3" />
            </button>
        </span>
    );
}

function StatusBadge({ status }) {
    const style = statusStyles[status] ?? statusStyles.Verified;
    const Icon = style.icon;

    return (
        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium leading-[18px] ${style.className}`}>
            <Icon className="h-3 w-3" />
            {status}
        </span>
    );
}

function DetailCard({ label, value }) {
    return (
        <div className="rounded-xl bg-[#121212] px-3 py-2">
            <div className="text-sm leading-6 text-gray-400">{label}</div>
            <div className="break-words text-sm font-semibold leading-6 text-gray-300">{value}</div>
        </div>
    );
}

function LegacyNewStudentProfileModal({ student, accountView, onClose }) {
    if (!student) return null;

    const studentNumber = `2026-${String(student.id).padStart(5, '0')}`;
    const joinedDate = new Date(2026, 2, 21 + (student.id % 7)).toLocaleDateString('en-US');

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="student-profile-title"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <div className="relative grid max-h-[calc(100vh-1.5rem)] w-full max-w-[1260px] overflow-y-auto rounded-2xl bg-[#0B0B0B] p-3 shadow-2xl ring-1 ring-brand-500/20 sm:max-h-[calc(100vh-3rem)] sm:gap-6 sm:rounded-3xl sm:p-6 lg:grid-cols-[minmax(300px,367px)_minmax(0,1fr)] lg:items-start lg:overflow-hidden">
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close student profile"
                    className="absolute right-5 top-5 z-10 rounded-lg bg-black/60 p-2 text-gray-300 transition hover:bg-white/10 hover:text-white"
                >
                    <X className="h-5 w-5" />
                </button>

                <aside className="overflow-hidden rounded-xl border border-brand-500/20 bg-[#0B0B0B] pb-6 sm:pb-10">
                    <div
                        className="flex min-h-[260px] flex-col items-center justify-end bg-cover bg-center px-6 pb-5 pt-14 text-center"
                        style={{
                            backgroundImage: `linear-gradient(180deg, rgba(102,102,102,0) 0%, rgba(0,0,0,.55) 100%), url("${slAdminProfile.cover}")`,
                        }}
                    >
                        <div className="flex h-28 w-28 items-center justify-center rounded-2xl border-[2.5px] border-brand-700 bg-[#111111] shadow-sm">
                            <GenderIcon gender={student.gender} className="h-14 w-14" />
                        </div>
                        <div className="mt-3 flex max-w-full items-center justify-center gap-1.5">
                            <h2 className="truncate font-heading text-2xl font-extrabold leading-tight text-brand-400 sm:text-3xl" title={student.name}>
                                {student.name}
                            </h2>
                            <GenderIcon gender={student.gender} className="h-5 w-5" />
                        </div>
                        <div className="mt-1 flex flex-wrap items-center justify-center gap-2 text-sm font-semibold text-gray-500">
                            <span>@{student.ign.toLowerCase()}.gg</span>
                            <Copy className="h-4 w-4" />
                            <span className="inline-flex items-center gap-1 rounded-md bg-purple-500/30 px-2 py-0.5 text-xs font-medium text-purple-300">
                                <Sparkles className="h-3 w-3" /> New
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3 px-6 pt-5">
                        <DetailCard label="Role" value={student.role} />
                        <DetailCard label="MLBB ID" value={student.uid} />
                        <DetailCard label="Server" value={student.server} />
                        <DetailCard label="IGN" value={student.ign} />
                    </div>
                </aside>

                <section className="min-w-0 rounded-xl border border-brand-500/20 bg-[#0B0B0B] py-6 sm:py-10 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
                    <div className="border-b border-white/10 px-5 pb-5 sm:px-8">
                        <div className="flex items-center justify-between gap-4 pr-9">
                            <h1 id="student-profile-title" className="font-heading text-2xl font-extrabold text-white sm:text-3xl">Student Information</h1>
                            <span className="hidden rounded-md border border-white/10 px-2 py-1 text-xs font-semibold text-gray-400 sm:inline">{accountView}</span>
                        </div>
                    </div>

                    <div className="space-y-6 px-5 py-6 sm:px-8">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <h3 className="font-heading text-lg font-bold text-brand-500">School Information</h3>
                                <div className="space-y-3">
                                    <DetailCard label="School" value={student.campus} />
                                    <DetailCard label="Year Level" value={student.yearLevel} />
                                    <DetailCard label="Course" value="Bachelor of Science in Computer Science" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="font-heading text-lg font-bold text-brand-500">Contact Details</h3>
                                <div className="space-y-3">
                                    <DetailCard label="Email" value={`${student.ign.toLowerCase()}@schoolemail.edu.ph`} />
                                    <DetailCard label="Phone" value="+63 991 883 9321" />
                                    <DetailCard label="Student ID" value={studentNumber} />
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-white/10 pt-6">
                            <h3 className="font-heading text-lg font-bold text-brand-500">Verification Details</h3>
                            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                <DetailCard label="Joined" value={joinedDate} />
                                <DetailCard label="Verified by" value="Awaiting review" />
                                <DetailCard label="Verified on" value="—" />
                                <DetailCard label="Validity" value="—" />
                            </div>
                        </div>

                        <button type="button" className="flex w-full items-center justify-center gap-2 rounded-xl border border-brand-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-500/10">
                            <FileText className="h-5 w-5" />
                            View Attachment
                        </button>

                        <div className="grid gap-3 sm:grid-cols-3">
                            <button type="button" className="rounded-lg border border-green-500 bg-green-500/30 px-4 py-3 text-sm font-semibold text-gray-50 transition hover:bg-green-500/40">Verify</button>
                            <button type="button" className="rounded-xl border border-brand-500 bg-brand-500/30 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-500/40">Renew</button>
                            <button type="button" className="rounded-xl border border-red-500 bg-red-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600">Block User</button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

function Pagination({ currentPage, pageCount, onChange }) {
    const groupSize = Math.min(3, pageCount);
    const firstGroup = Array.from({ length: groupSize }, (_, index) => index + 1);
    const lastGroup = Array.from(
        { length: groupSize },
        (_, index) => pageCount - groupSize + index + 1,
    );
    const isInEdgeGroup = currentPage <= groupSize || currentPage >= pageCount - groupSize + 1;
    const currentGroup = isInEdgeGroup
        ? firstGroup
        : Array.from({ length: groupSize }, (_, index) => currentPage - groupSize + index + 1);
    const hasGap = currentGroup[currentGroup.length - 1] < lastGroup[0] - 1;
    const combinedPages = [...new Set([...currentGroup, ...lastGroup])].sort((first, second) => first - second);
    const pages = hasGap
        ? [...currentGroup, 'ellipsis', ...lastGroup]
        : combinedPages;

    return (
        <div className="grid w-full grid-cols-2 items-center gap-3 lg:grid-cols-[1fr_auto_1fr] lg:gap-4">
            <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => onChange(currentPage - 1)}
                className="col-start-1 row-start-1 inline-flex h-9 w-fit items-center justify-center gap-1 rounded-lg border border-brand-500 bg-brand-500 px-3 text-sm font-semibold text-gray-900 transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
                <ChevronLeft className="h-5 w-5" />
                Previous
            </button>

            <nav
                className="col-span-2 row-start-2 flex flex-wrap items-center justify-center gap-0.5 lg:col-span-1 lg:col-start-2 lg:row-start-1"
                aria-label="Table pagination"
            >
                {pages.map((page, index) => page === 'ellipsis' ? (
                    <span key={`ellipsis-${index}`} className="flex h-10 w-10 items-center justify-center text-sm text-gray-300">
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        type="button"
                        onClick={() => onChange(page)}
                        aria-current={currentPage === page ? 'page' : undefined}
                        className={`h-10 w-10 rounded-lg text-sm font-medium transition ${
                            currentPage === page
                                ? 'bg-brand-500 text-gray-900'
                                : 'text-gray-300 hover:bg-white/5'
                        }`}
                    >
                        {page}
                    </button>
                ))}
            </nav>

            <button
                type="button"
                disabled={currentPage === pageCount}
                onClick={() => onChange(currentPage + 1)}
                className="col-start-2 row-start-1 inline-flex h-9 w-fit items-center justify-center justify-self-end gap-1 rounded-lg border border-brand-500 bg-brand-500 px-3 text-sm font-semibold text-gray-900 transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-40 lg:col-start-3"
            >
                Next
                <ChevronRight className="h-5 w-5" />
            </button>
        </div>
    );
}

export default function SLAdmin() {
    const [statusFilter, setStatusFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('all');
    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sort, setSort] = useState({ column: 'account', direction: 'asc' });
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [accountView] = useState(getTemporaryAccountView);
    const searchRef = useRef(null);

    const filteredStudents = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        const filtered = students.filter((student) => {
            const matchesStatus =
                statusFilter === 'all' || student.status.toLowerCase() === statusFilter;
            const matchesRole =
                roleFilter === 'all' || student.role.toLowerCase().replace(' ', '-') === roleFilter;
            const matchesSearch =
                !normalizedQuery
                || [
                    student.name,
                    student.ign,
                    student.uid,
                    student.server,
                    student.account,
                    student.campus,
                    student.yearLevel,
                    student.status,
                ].join(' ').toLowerCase().includes(normalizedQuery);

            return matchesStatus && matchesRole && matchesSearch;
        });

        return [...filtered].sort((first, second) => {
            const comparison = first[sort.column].localeCompare(second[sort.column], undefined, {
                numeric: true,
            });

            return sort.direction === 'asc' ? comparison : -comparison;
        });
    }, [statusFilter, roleFilter, query, sort]);

    const pageCount = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE));
    const pageStudents = filteredStudents.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter, roleFilter, query, sort]);

    useEffect(() => {
        const focusSearch = (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                searchRef.current?.focus();
            }
        };

        window.addEventListener('keydown', focusSearch);
        return () => window.removeEventListener('keydown', focusSearch);
    }, []);

    const handleViewProfile = (student) => {
        if (['New', 'Pending', 'Verified', 'Blocked', 'Inactive'].includes(student.status)) {
            setSelectedStudent(student);
        }
    };

    return (
        <MainLayout fullWidth>
            <Head title="SL Admin" />

            <div className="min-h-screen bg-[#050505] px-4 py-8 text-white sm:px-6 lg:px-10">
                <div className="mx-auto flex max-w-[1360px] flex-col gap-2.5">
                    <section className="overflow-hidden rounded-[28px] border-2 border-white/10 bg-[#0B0B0B]">
                        <div
                            className="relative h-[240px] bg-cover bg-center sm:h-[344px]"
                            style={{
                                backgroundImage: `linear-gradient(180deg, rgba(102,102,102,0) 0%, rgba(0,0,0,.3) 100%), url("${slAdminProfile.cover}")`,
                                boxShadow: 'inset 0 -50px 30px rgba(0,0,0,.4)',
                            }}
                        >
                            <button
                                type="button"
                                className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-xl border border-white/10 bg-black/60 px-3 py-1 text-sm font-semibold leading-[22px] text-white shadow-sm sm:right-8 sm:top-8"
                            >
                                <Camera className="h-5 w-5" />
                                Edit Background
                            </button>
                        </div>

                        <div className="flex flex-col items-center gap-8 px-5 py-6 sm:px-10 lg:flex-row lg:items-start lg:justify-between lg:gap-12 lg:px-12 xl:gap-16 xl:pr-32">
                            <div className="flex min-w-0 w-full flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:gap-2.5 sm:text-left lg:flex-1">
                                <div className="relative -mt-20 h-[150px] w-[150px] shrink-0 self-center sm:-mt-24 lg:mt-0">
                                    <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-3xl border-[3px] border-brand-700 bg-[#111111] shadow-sm">
                                        <img
                                            src={slAdminProfile.avatar}
                                            alt={`${slAdminProfile.name} profile`}
                                            className="h-24 w-24 object-contain"
                                        />
                                    </div>
                                    <span className="absolute -bottom-2 right-0 rounded-lg border border-white/10 bg-[#0B0B0B] px-2.5 py-1 text-sm font-bold leading-[22px] text-brand-500 shadow-[0_0_10px_rgba(242,194,26,.1)]">
                                        LVL {slAdminProfile.level}
                                    </span>
                                </div>

                                <div className="w-full min-w-0 px-0 py-3 text-center sm:px-6 sm:text-left">
                                    <div className="flex min-w-0 items-center justify-center gap-2 sm:justify-start lg:gap-3">
                                        <h1
                                            title={slAdminProfile.name}
                                            className="min-w-0 truncate font-heading text-[clamp(1.75rem,8.5vw,3rem)] font-extrabold leading-tight text-brand-400 sm:text-5xl lg:text-[clamp(2.5rem,4vw,3.75rem)] lg:leading-[64px]"
                                        >
                                            {slAdminProfile.name}
                                        </h1>

                                        <div className="flex shrink-0 items-center gap-2">
                                            <GenderIcon gender={slAdminProfile.gender} />
                                            <button
                                                type="button"
                                                aria-label="Edit profile"
                                                className="rounded-xl bg-brand-500/20 p-2 text-brand-500"
                                            >
                                                <Pencil className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-1 flex items-center justify-center gap-2 text-xs font-bold leading-[18px] text-gray-500 sm:justify-start">
                                        <span>{slAdminProfile.username}</span>
                                        <Copy className="h-4 w-4" />
                                        {slAdminProfile.verified ? (
                                            <span className="inline-flex items-center gap-1 rounded-md bg-green-950/60 px-2 py-0.5 font-medium text-green-500">
                                                <Check className="h-3 w-3" />
                                                Verified
                                            </span>
                                        ) : null}
                                    </div>

                                    <div className="mt-2 text-center sm:text-left">
                                        <div className="text-base font-semibold leading-[26px] text-gray-400">
                                            {slAdminProfile.campus}
                                        </div>
                                        <div className="text-sm font-semibold leading-[22px] text-gray-500">
                                            {slAdminProfile.course}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid w-full shrink-0 grid-cols-2 gap-x-8 gap-y-3 rounded-[32px] border border-brand-500/20 bg-[#0B0B0B] p-6 backdrop-blur-xl sm:w-auto lg:ml-4 xl:ml-8">
                                <ProfileMeta label="ROLE" value={slAdminProfile.role} />
                                <ProfileMeta label="YEAR LEVEL" value={slAdminProfile.yearLevel} />
                                <ProfileMeta label="AREA" value={slAdminProfile.area} />
                                <ProfileMeta label="REGION" value={slAdminProfile.region} />
                            </div>
                        </div>
                    </section>

                    <section className="border-white/10">
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                            {statCards.map(({ label, value, icon: Icon, color, background }) => (
                                <div
                                    key={label}
                                    className="flex min-h-[132px] flex-col items-start gap-3 rounded-xl border border-white/5 bg-[#0B0B0B] px-4 py-4 sm:min-h-[154px] sm:px-6 sm:py-5"
                                >
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-black/80 to-black/30 ${background} ${color}`}>
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="font-heading text-lg font-bold uppercase leading-[26px] text-brand-500">{label}</div>
                                        <div className="mt-2 text-xl font-bold leading-7 text-white">{value.toLocaleString()}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="flex flex-col gap-4 rounded-[14px] bg-[#0B0B0B] p-6 md:flex-row md:items-center md:justify-between">
                        <label className="flex h-10 w-full max-w-[547px] items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3 shadow-sm">
                            <Search className="h-5 w-5 shrink-0 text-gray-300" />
                            <input
                                ref={searchRef}
                                type="search"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Search students..."
                                className="min-w-0 flex-1 border-0 bg-transparent p-0 text-base text-gray-300 outline-none placeholder:text-gray-300 focus:border-0 focus:ring-0"
                            />
                            <kbd className="hidden rounded border border-gray-300 px-1 text-xs font-medium leading-[18px] text-gray-300 sm:block">
                                Ctrl K
                            </kbd>
                        </label>

                        <div className="grid w-full grid-cols-1 gap-3 md:w-auto md:grid-cols-[auto_minmax(160px,1fr)_minmax(160px,1fr)] md:items-center">
                            <div className="text-center text-sm leading-[26px] text-gray-300 sm:text-base md:text-left">
                                <span className="font-semibold">Student Count:</span>{' '}
                                <span>{studentCount}</span>
                            </div>
                            <label className="relative block min-w-0">
                                <span className="sr-only">Status</span>
                                <select
                                    value={statusFilter}
                                    onChange={(event) => setStatusFilter(event.target.value)}
                                    className="h-10 w-full appearance-none rounded-lg border border-white/10 bg-black/20 py-2 pl-4 pr-10 text-sm font-semibold text-gray-300 shadow-[0_1px_2px_rgba(10,13,18,.05),inset_0_-2px_0_rgba(10,13,18,.05)] focus:border-brand-500 focus:ring-brand-500"
                                >
                                    {statusOptions.map((option) => (
                                        <option key={option.value} value={option.value} className="bg-[#0B0B0B]">
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-300" />
                            </label>
                            <label className="relative block min-w-0">
                                <span className="sr-only">Role</span>
                                <select
                                    value={roleFilter}
                                    onChange={(event) => setRoleFilter(event.target.value)}
                                    className="h-10 w-full appearance-none rounded-lg border border-white/10 bg-black/20 py-2 pl-4 pr-10 text-sm font-semibold text-gray-300 shadow-[0_1px_2px_rgba(10,13,18,.05),inset_0_-2px_0_rgba(10,13,18,.05)] focus:border-brand-500 focus:ring-brand-500"
                                >
                                    {roleOptions.map((option) => (
                                        <option key={option.value} value={option.value} className="bg-[#0B0B0B]">
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-300" />
                            </label>
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-xl border border-white/10 bg-[#050505] shadow-sm">
                        <div className="md:hidden">
                            <table className="w-full table-fixed border-collapse text-left">
                                <thead>
                                    <tr className="h-11 border-b border-white/10 bg-white/10 text-xs font-semibold leading-[18px] text-brand-400">
                                        <th className="w-[68%] px-4">
                                            <span className="inline-flex items-center">
                                                MSL Account
                                                <SortControls column="account" sort={sort} onSort={(column, direction) => setSort({ column, direction })} />
                                            </span>
                                        </th>
                                        <th className="w-[32%] px-3 text-center">Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pageStudents.map((student) => (
                                        <tr key={student.id} className="h-[84px] border-b border-white/10 last:border-b-0 hover:bg-white/[0.025]">
                                            <td className="px-4 py-3">
                                                <div className="flex min-w-0 items-center gap-2.5">
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/10 bg-[#CFCBDC]">
                                                        <GenderIcon gender={student.gender} className="h-4 w-4" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="truncate text-sm font-medium leading-5 text-gray-300">
                                                            {student.name}
                                                        </div>
                                                        <div className="truncate text-xs font-normal leading-[18px] text-gray-400">
                                                            IGN: {student.ign}
                                                        </div>
                                                        <div className="truncate text-xs font-normal leading-[18px] text-gray-400">
                                                            UID: {student.uid} ({student.server})
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-3 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleViewProfile(student)}
                                                    aria-haspopup={['New', 'Pending', 'Verified', 'Blocked', 'Inactive'].includes(student.status) ? 'dialog' : undefined}
                                                    className="whitespace-nowrap rounded-lg border border-brand-500 bg-brand-500 px-2.5 py-2 text-xs font-semibold leading-5 text-black transition hover:bg-brand-400"
                                                >
                                                    View Profile
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {!pageStudents.length ? (
                                        <tr>
                                            <td colSpan="2" className="px-4 py-12 text-center text-sm text-gray-400">
                                                No student accounts match these filters.
                                            </td>
                                        </tr>
                                    ) : null}
                                </tbody>
                            </table>
                        </div>

                        <div className="hidden overflow-x-auto md:block">
                            <table className="w-full min-w-[1050px] table-fixed border-collapse text-left">
                                <thead>
                                    <tr className="h-11 border-b border-white/10 bg-white/10 text-xs font-semibold leading-[18px] text-brand-400">
                                        <th className="w-[29%] px-6">
                                            <span className="inline-flex items-center">
                                                MSL Account
                                                <SortControls column="account" sort={sort} onSort={(column, direction) => setSort({ column, direction })} />
                                            </span>
                                        </th>
                                        <th className="w-[25%] px-6">
                                            <span className="inline-flex items-center">
                                                Campus
                                                <SortControls column="campus" sort={sort} onSort={(column, direction) => setSort({ column, direction })} />
                                            </span>
                                        </th>
                                        <th className="w-[18%] px-6">
                                            <span className="inline-flex items-center">
                                                Year Level
                                                <SortControls column="yearLevel" sort={sort} onSort={(column, direction) => setSort({ column, direction })} />
                                            </span>
                                        </th>
                                        <th className="w-[14%] px-6">Status</th>
                                        <th className="w-[14%] px-6 text-center">Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pageStudents.map((student) => (
                                        <tr key={student.id} className="h-[84px] border-b border-white/10 last:border-b-0 hover:bg-white/[0.025]">
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/10 bg-[#CFCBDC]">
                                                        <GenderIcon gender={student.gender} className="h-4 w-4" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="truncate text-sm font-medium leading-5 text-gray-300">
                                                            {student.name}
                                                        </div>
                                                        <div className="truncate text-xs font-normal leading-[18px] text-gray-400">
                                                            IGN: {student.ign}
                                                        </div>
                                                        <div className="truncate text-xs font-normal leading-[18px] text-gray-400">
                                                            UID: {student.uid} ({student.server})
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-sm font-normal leading-5 text-gray-300">
                                                {student.campus}
                                            </td>
                                            <td className="px-6 py-3 text-sm font-normal leading-5 text-gray-300">
                                                {student.yearLevel}
                                            </td>
                                            <td className="px-6 py-3">
                                                <StatusBadge status={student.status} />
                                            </td>
                                            <td className="px-6 py-3 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleViewProfile(student)}
                                                    aria-haspopup={['New', 'Pending', 'Verified', 'Blocked', 'Inactive'].includes(student.status) ? 'dialog' : undefined}
                                                    className="rounded-lg border border-brand-500 bg-brand-500 px-3 py-2 text-sm font-semibold leading-5 text-black transition hover:bg-brand-400"
                                                >
                                                    View Profile
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {!pageStudents.length ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-16 text-center text-sm text-gray-400">
                                                No student accounts match these filters.
                                            </td>
                                        </tr>
                                    ) : null}
                                </tbody>
                            </table>
                        </div>

                        <div className="border-t border-white/10 px-6 py-4">
                            <Pagination currentPage={currentPage} pageCount={pageCount} onChange={setCurrentPage} />
                        </div>
                    </section>
                </div>
            </div>

            <NewStudentProfileModal
                student={selectedStudent?.status === 'New' ? selectedStudent : null}
                accountView={accountView}
                onClose={() => setSelectedStudent(null)}
            />
            <VerifiedStudentProfileModal
                student={selectedStudent?.status === 'Verified' ? selectedStudent : null}
                accountView={accountView}
                onClose={() => setSelectedStudent(null)}
            />
            <PendingStudentProfileModal
                student={selectedStudent?.status === 'Pending' ? selectedStudent : null}
                accountView={accountView}
                onClose={() => setSelectedStudent(null)}
            />
            <BlockedStudentProfileModal
                student={selectedStudent?.status === 'Blocked' ? selectedStudent : null}
                accountView={accountView}
                onClose={() => setSelectedStudent(null)}
            />
            <InactiveStudentProfileModal
                student={selectedStudent?.status === 'Inactive' ? selectedStudent : null}
                accountView={accountView}
                onClose={() => setSelectedStudent(null)}
            />
        </MainLayout>
    );
}
