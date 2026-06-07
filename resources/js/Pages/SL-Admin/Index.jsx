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
import {
    accountCounts,
    categoryOptions,
    slAdminProfile,
    studentCount,
} from './slAdminData';
import { students } from './studentsData';

const PAGE_SIZE = 10;

const statusStyles = {
    Verified: {
        icon: CheckCircle2,
        className: 'bg-green-950/60 text-green-500',
    },
    Renew: {
        icon: RefreshCw,
        className: 'bg-yellow-900/40 text-brand-500',
    },
    Blocked: {
        icon: Ban,
        className: 'bg-red-950/50 text-red-500',
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
            <div className="mt-1 font-['Manrope'] text-base font-bold leading-[26px] text-gray-300 sm:text-lg">
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
    const [category, setCategory] = useState('all');
    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sort, setSort] = useState({ column: 'account', direction: 'asc' });
    const searchRef = useRef(null);

    const filteredStudents = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        const filtered = students.filter((student) => {
            const matchesCategory =
                category === 'all'
                || (category === 'new' && student.isNew)
                || student.status.toLowerCase() === category;
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

            return matchesCategory && matchesSearch;
        });

        return [...filtered].sort((first, second) => {
            const comparison = first[sort.column].localeCompare(second[sort.column], undefined, {
                numeric: true,
            });

            return sort.direction === 'asc' ? comparison : -comparison;
        });
    }, [category, query, sort]);

    const pageCount = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE));
    const pageStudents = filteredStudents.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [category, query, sort]);

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

                        <div className="flex flex-col items-center gap-8 px-5 py-6 sm:px-10 lg:flex-row lg:items-start lg:justify-between lg:px-12 lg:pr-40">
                            <div className="flex min-w-0 flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:gap-2.5 sm:text-left">
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

                                <div className="min-w-0 px-0 py-3 sm:px-6">
                                    <div className="flex flex-wrap items-center justify-center gap-2.5 sm:justify-start">
                                        <h1 className="font-['Manrope'] text-4xl font-extrabold leading-tight text-brand-400 sm:text-5xl lg:text-[60px] lg:leading-[72px]">
                                            {slAdminProfile.name}
                                        </h1>
                                        <GenderIcon gender={slAdminProfile.gender} />
                                        <button
                                            type="button"
                                            aria-label="Edit profile"
                                            className="rounded-xl bg-brand-500/20 p-2 text-brand-500"
                                        >
                                            <Pencil className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-center gap-2 text-xs font-bold leading-[18px] text-gray-500 sm:justify-start">
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

                            <div className="grid w-full shrink-0 grid-cols-2 gap-x-8 gap-y-3 rounded-[32px] border border-brand-500/20 bg-[#0B0B0B] p-6 backdrop-blur-xl sm:w-auto">
                                <ProfileMeta label="ROLE" value={slAdminProfile.role} />
                                <ProfileMeta label="YEAR LEVEL" value={slAdminProfile.yearLevel} />
                                <ProfileMeta label="AREA" value={slAdminProfile.area} />
                                <ProfileMeta label="REGION" value={slAdminProfile.region} />
                            </div>
                        </div>
                    </section>

                    <section className="border-b border-white/10">
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
                                        <div className="font-['Manrope'] text-lg font-bold uppercase leading-[26px] text-brand-500">{label}</div>
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

                        <div className="flex w-full items-center justify-between gap-3 md:w-auto">
                            <div className="shrink-0 text-sm leading-[26px] text-gray-300 sm:text-base">
                                <span className="font-semibold">Student Count:</span>{' '}
                                <span>{studentCount}</span>
                            </div>
                            <label className="relative block min-w-0 flex-1 sm:min-w-[180px] md:flex-none">
                                <span className="sr-only">Account category</span>
                                <select
                                    value={category}
                                    onChange={(event) => setCategory(event.target.value)}
                                    className="h-10 w-full appearance-none rounded-lg border border-white/10 bg-black/20 py-2 pl-4 pr-10 text-sm font-semibold text-gray-300 shadow-[0_1px_2px_rgba(10,13,18,.05),inset_0_-2px_0_rgba(10,13,18,.05)] focus:border-brand-500 focus:ring-brand-500"
                                >
                                    {categoryOptions.map((option) => (
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
                                                No student accounts match this search and category.
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
                                                No student accounts match this search and category.
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
        </MainLayout>
    );
}
