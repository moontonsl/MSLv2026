import React from 'react';

/**
 * Reusable shimmering placeholder block
 */
function Skeleton({ className = '' }) {
    return (
        <div
            className={`skeleton-shimmer rounded-lg ${className}`}
            aria-hidden="true"
        />
    );
}

/**
 * 4-Metric Card Grid Skeleton
 */
function StatCardsSkeleton({ count = 4 }) {
    return (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5 backdrop-blur-sm"
                >
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-3.5 w-24 sm:w-28" />
                        <Skeleton className="h-8 w-8 rounded-xl" />
                    </div>
                    <Skeleton className="mt-3.5 h-8 w-20 sm:w-28" />
                    <Skeleton className="mt-2 h-3 w-32" />
                </div>
            ))}
        </div>
    );
}

/**
 * 1. Dashboard Skeleton (/admin/dashboard)
 */
function DashboardSkeleton() {
    return (
        <div className="space-y-8 pb-12" aria-label="Loading dashboard" aria-busy="true">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-amber-400/40 animate-pulse" />
                        <Skeleton className="h-3.5 w-32" />
                    </div>
                    <Skeleton className="h-8 w-64 rounded-xl" />
                    <Skeleton className="h-4 w-80 sm:w-96" />
                </div>
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-44 rounded-xl" />
                </div>
            </div>

            {/* 4 Top Stat Cards */}
            <StatCardsSkeleton count={4} />

            {/* Middle Grid: Charts & Real-Time Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Performance Chart */}
                <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <div className="space-y-1.5">
                            <Skeleton className="h-5 w-44" />
                            <Skeleton className="h-3.5 w-60" />
                        </div>
                        <Skeleton className="h-8 w-36 rounded-lg" />
                    </div>
                    {/* Simulated Bar Chart */}
                    <div className="mt-8 flex items-end justify-between gap-3 h-48 px-2">
                        {[40, 65, 85, 45, 90, 70, 55, 80, 95, 60, 75, 88].map((h, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                                <div
                                    className="w-full rounded-t-md skeleton-shimmer"
                                    style={{ height: `${h}%` }}
                                />
                                <Skeleton className="h-2.5 w-full max-w-[24px]" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Real-time Visitor & Analytics Card */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <Skeleton className="h-5 w-36" />
                            <Skeleton className="h-3 w-16 rounded-full" />
                        </div>
                        <div className="mt-6 flex items-center gap-4">
                            <Skeleton className="h-14 w-28 rounded-xl" />
                            <div className="space-y-1.5">
                                <Skeleton className="h-3.5 w-24" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                        </div>
                        <div className="mt-6 space-y-3">
                            {[1, 2, 3].map((n) => (
                                <div key={n} className="flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-white/[0.01]">
                                    <Skeleton className="h-3.5 w-24" />
                                    <Skeleton className="h-3.5 w-12" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <Skeleton className="mt-6 h-9 w-full rounded-xl" />
                </div>
            </div>

            {/* Bottom Section: Operations & Verification Queue Preview */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                    <div className="space-y-1">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-3.5 w-64" />
                    </div>
                    <Skeleton className="h-8 w-28 rounded-xl" />
                </div>
                <div className="divide-y divide-white/5">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center justify-between py-3.5">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-xl" />
                                <div className="space-y-1.5">
                                    <Skeleton className="h-4 w-36" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                            <div className="hidden sm:flex items-center gap-4">
                                <Skeleton className="h-6 w-32 rounded-lg" />
                                <Skeleton className="h-6 w-20 rounded-full" />
                            </div>
                            <Skeleton className="h-8 w-24 rounded-xl" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * 2. Student Leader Management Skeleton (/admin/sl-management)
 */
function StudentLeadersSkeleton() {
    return (
        <div className="space-y-6 pb-12" aria-label="Loading student leaders" aria-busy="true">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-11 w-11 rounded-2xl" />
                    <div className="space-y-1.5">
                        <Skeleton className="h-7 w-48" />
                        <Skeleton className="h-3.5 w-72" />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-11 w-64 sm:w-72 rounded-xl" />
                    <Skeleton className="h-11 w-20 rounded-xl" />
                </div>
            </div>

            {/* Stat Cards */}
            <StatCardsSkeleton count={4} />

            {/* Filter Tabs & Region Selector */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex gap-1.5 p-1 rounded-xl border border-white/10 bg-black/40">
                    <Skeleton className="h-9 w-44 rounded-lg" />
                    <Skeleton className="h-9 w-44 rounded-lg" />
                </div>
                <Skeleton className="h-10 w-44 rounded-xl" />
            </div>

            {/* Table Container */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl">
                {/* Table Header */}
                <div className="grid grid-cols-12 border-b border-white/10 bg-white/[0.02] px-6 py-4 text-xs font-bold uppercase tracking-wider">
                    <div className="col-span-4 sm:col-span-3"><Skeleton className="h-3.5 w-28" /></div>
                    <div className="hidden sm:block col-span-3"><Skeleton className="h-3.5 w-24" /></div>
                    <div className="col-span-3 sm:col-span-2"><Skeleton className="h-3.5 w-20" /></div>
                    <div className="hidden md:block col-span-2"><Skeleton className="h-3.5 w-16" /></div>
                    <div className="col-span-5 sm:col-span-2 text-right flex justify-end"><Skeleton className="h-3.5 w-16" /></div>
                </div>
                {/* Table Rows */}
                <div className="divide-y divide-white/5">
                    {Array.from({ length: 7 }).map((_, index) => (
                        <div key={index} className="grid grid-cols-12 items-center px-6 py-4">
                            <div className="col-span-4 sm:col-span-3 flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                                <div className="space-y-1.5">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            </div>
                            <div className="hidden sm:block col-span-3 space-y-1">
                                <Skeleton className="h-3.5 w-40" />
                                <Skeleton className="h-2.5 w-24" />
                            </div>
                            <div className="col-span-3 sm:col-span-2">
                                <Skeleton className="h-6 w-24 rounded-lg" />
                            </div>
                            <div className="hidden md:block col-span-2">
                                <Skeleton className="h-6 w-16 rounded-md" />
                            </div>
                            <div className="col-span-5 sm:col-span-2 flex items-center justify-end gap-2">
                                <Skeleton className="h-8 w-16 rounded-xl" />
                                <Skeleton className="h-8 w-20 rounded-xl" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * 3. Regional Admin Management Skeleton (/admin/regional-admin-management)
 */
function RegionalAdminsSkeleton() {
    return (
        <div className="space-y-6 pb-12" aria-label="Loading regional admins" aria-busy="true">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div className="space-y-1.5">
                        <Skeleton className="h-7 w-48" />
                        <Skeleton className="h-3.5 w-72" />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-64 rounded-xl" />
                    <Skeleton className="h-10 w-20 rounded-xl" />
                </div>
            </div>

            {/* Stat Cards */}
            <StatCardsSkeleton count={4} />

            {/* Tabs & Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex gap-1.5 p-1 rounded-xl border border-white/10 bg-black/40">
                    <Skeleton className="h-9 w-44 rounded-lg" />
                    <Skeleton className="h-9 w-48 rounded-lg" />
                </div>
                <Skeleton className="h-10 w-44 rounded-xl" />
            </div>

            {/* Table Container */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl">
                <div className="grid grid-cols-12 border-b border-white/10 bg-white/[0.02] px-6 py-4 text-xs font-bold uppercase tracking-wider">
                    <div className="col-span-4 sm:col-span-4"><Skeleton className="h-3.5 w-28" /></div>
                    <div className="col-span-3 sm:col-span-2"><Skeleton className="h-3.5 w-20" /></div>
                    <div className="hidden sm:block col-span-3"><Skeleton className="h-3.5 w-28" /></div>
                    <div className="hidden md:block col-span-1"><Skeleton className="h-3.5 w-14" /></div>
                    <div className="col-span-5 sm:col-span-2 text-right flex justify-end"><Skeleton className="h-3.5 w-16" /></div>
                </div>
                <div className="divide-y divide-white/5">
                    {Array.from({ length: 7 }).map((_, index) => (
                        <div key={index} className="grid grid-cols-12 items-center px-6 py-4">
                            <div className="col-span-4 sm:col-span-4 flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                                <div className="space-y-1.5">
                                    <Skeleton className="h-4 w-36" />
                                    <Skeleton className="h-3 w-28" />
                                </div>
                            </div>
                            <div className="col-span-3 sm:col-span-2">
                                <Skeleton className="h-6 w-20 rounded-lg" />
                            </div>
                            <div className="hidden sm:block col-span-3 space-y-1">
                                <Skeleton className="h-3.5 w-36" />
                                <Skeleton className="h-2.5 w-20" />
                            </div>
                            <div className="hidden md:block col-span-1">
                                <Skeleton className="h-6 w-16 rounded-full" />
                            </div>
                            <div className="col-span-5 sm:col-span-2 flex items-center justify-end gap-2">
                                <Skeleton className="h-8 w-24 rounded-xl" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * 4. School Management Skeleton (/admin/school-management)
 */
function SchoolManagementSkeleton() {
    return (
        <div className="space-y-6 pb-12" aria-label="Loading school management" aria-busy="true">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div className="space-y-1.5">
                        <Skeleton className="h-7 w-52" />
                        <Skeleton className="h-3.5 w-80 sm:w-96" />
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Skeleton className="h-10 w-56 sm:w-64 rounded-xl" />
                    <Skeleton className="h-10 w-20 rounded-xl" />
                    <Skeleton className="h-10 w-36 rounded-xl" />
                </div>
            </div>

            {/* Stat Cards */}
            <StatCardsSkeleton count={4} />

            {/* Filter Tabs & Selectors */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex gap-1.5 p-1 rounded-xl border border-white/10 bg-black/40">
                    <Skeleton className="h-9 w-44 rounded-lg" />
                    <Skeleton className="h-9 w-44 rounded-lg" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-28 rounded-xl" />
                    <Skeleton className="h-9 w-36 rounded-xl" />
                    <Skeleton className="h-9 w-28 rounded-xl" />
                </div>
            </div>

            {/* Table Container */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl">
                <div className="grid grid-cols-12 border-b border-white/10 bg-white/[0.02] px-6 py-4 text-xs font-bold uppercase tracking-wider">
                    <div className="col-span-5 sm:col-span-4"><Skeleton className="h-3.5 w-32" /></div>
                    <div className="hidden sm:block col-span-3"><Skeleton className="h-3.5 w-36" /></div>
                    <div className="col-span-3 sm:col-span-2"><Skeleton className="h-3.5 w-20" /></div>
                    <div className="hidden md:block col-span-1"><Skeleton className="h-3.5 w-16" /></div>
                    <div className="col-span-4 sm:col-span-2 text-right flex justify-end"><Skeleton className="h-3.5 w-16" /></div>
                </div>
                <div className="divide-y divide-white/5">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="grid grid-cols-12 items-center px-6 py-4">
                            <div className="col-span-5 sm:col-span-4 flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                                <div className="space-y-1.5">
                                    <Skeleton className="h-4 w-44 sm:w-56" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            </div>
                            <div className="hidden sm:block col-span-3 space-y-1">
                                <Skeleton className="h-3.5 w-36" />
                                <Skeleton className="h-2.5 w-20" />
                            </div>
                            <div className="col-span-3 sm:col-span-2">
                                <Skeleton className="h-6 w-20 rounded-full" />
                            </div>
                            <div className="hidden md:block col-span-1">
                                <Skeleton className="h-6 w-16 rounded-md" />
                            </div>
                            <div className="col-span-4 sm:col-span-2 flex items-center justify-end gap-2">
                                <Skeleton className="h-8 w-16 rounded-xl" />
                                <Skeleton className="h-8 w-16 rounded-xl" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * 5. Pending Queue Skeleton (/admin/users/pending)
 */
function PendingUsersSkeleton() {
    return (
        <div className="space-y-6 pb-12" aria-label="Loading pending queue" aria-busy="true">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
                <div>
                    <div className="flex items-center gap-2.5">
                        <Skeleton className="h-8 w-44" />
                        <Skeleton className="h-6 w-32 rounded-full" />
                    </div>
                    <Skeleton className="mt-2 h-3.5 w-80 sm:w-96" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-11 w-64 sm:w-72 rounded-xl" />
                    <Skeleton className="h-11 w-20 rounded-xl" />
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl border border-white/10 bg-black/40 w-fit mb-6">
                <Skeleton className="h-8 w-32 rounded-lg" />
                <Skeleton className="h-8 w-32 rounded-lg" />
                <Skeleton className="h-8 w-24 rounded-lg" />
                <Skeleton className="h-8 w-24 rounded-lg" />
            </div>

            {/* Table Container */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl">
                <div className="grid grid-cols-12 border-b border-white/10 bg-white/[0.02] px-6 py-4 text-xs font-bold uppercase tracking-wider">
                    <div className="col-span-4 sm:col-span-3"><Skeleton className="h-3.5 w-28" /></div>
                    <div className="hidden sm:block col-span-3"><Skeleton className="h-3.5 w-32" /></div>
                    <div className="col-span-3 sm:col-span-2"><Skeleton className="h-3.5 w-24" /></div>
                    <div className="hidden md:block col-span-2"><Skeleton className="h-3.5 w-20" /></div>
                    <div className="col-span-5 sm:col-span-2 text-right flex justify-end"><Skeleton className="h-3.5 w-20" /></div>
                </div>
                <div className="divide-y divide-white/5">
                    {Array.from({ length: 7 }).map((_, index) => (
                        <div key={index} className="grid grid-cols-12 items-center px-6 py-4">
                            <div className="col-span-4 sm:col-span-3 flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                                <div className="space-y-1.5">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                            <div className="hidden sm:block col-span-3 space-y-1">
                                <Skeleton className="h-3.5 w-44" />
                                <Skeleton className="h-2.5 w-24" />
                            </div>
                            <div className="col-span-3 sm:col-span-2">
                                <Skeleton className="h-10 w-16 rounded-lg border border-white/10" />
                            </div>
                            <div className="hidden md:block col-span-2">
                                <Skeleton className="h-6 w-24 rounded-full" />
                            </div>
                            <div className="col-span-5 sm:col-span-2 flex items-center justify-end">
                                <Skeleton className="h-9 w-28 rounded-xl" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * 6. Permissions & Roles Skeleton (/admin/management)
 */
function ManagementSkeleton() {
    return (
        <div className="space-y-6 pb-12" aria-label="Loading permissions and roles" aria-busy="true">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div className="space-y-1.5">
                        <Skeleton className="h-7 w-56" />
                        <Skeleton className="h-3.5 w-80 sm:w-96" />
                    </div>
                </div>
                <Skeleton className="h-10 w-44 rounded-xl" />
            </div>

            {/* Quick Stat Cards */}
            <StatCardsSkeleton count={4} />

            {/* Dual Pane Layout (Directory + Permissions Matrix) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Pane: Staff Directory */}
                <div className="lg:col-span-1 rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md space-y-4">
                    <Skeleton className="h-10 w-full rounded-xl" />
                    <div className="space-y-2.5">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 p-3.5 rounded-xl border border-white/5 bg-white/[0.01]"
                            >
                                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                                <div className="space-y-1.5 flex-1">
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="h-4 w-28" />
                                        <Skeleton className="h-4 w-16 rounded" />
                                    </div>
                                    <Skeleton className="h-3 w-36" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Pane: Capabilities & Role Matrix */}
                <div className="lg:col-span-2 space-y-6">
                    {/* User Profile Card */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-14 w-14 rounded-2xl shrink-0" />
                            <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-6 w-44" />
                                    <Skeleton className="h-5 w-24 rounded-full" />
                                </div>
                                <Skeleton className="h-3.5 w-48" />
                            </div>
                        </div>

                        {/* Presets Row */}
                        <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap items-center gap-2">
                            <Skeleton className="h-8 w-24 rounded-lg" />
                            <Skeleton className="h-8 w-28 rounded-lg" />
                            <Skeleton className="h-8 w-32 rounded-lg" />
                            <Skeleton className="h-8 w-24 rounded-lg" />
                        </div>
                    </div>

                    {/* Permissions Blocks */}
                    <div className="space-y-4">
                        {[1, 2, 3].map((group) => (
                            <div key={group} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md">
                                <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                                    <Skeleton className="h-5 w-48" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {Array.from({ length: 4 }).map((_, c) => (
                                        <div
                                            key={c}
                                            className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.01]"
                                        >
                                            <Skeleton className="h-5 w-5 rounded-md shrink-0" />
                                            <div className="space-y-1.5 flex-1">
                                                <Skeleton className="h-3.5 w-32" />
                                                <Skeleton className="h-2.5 w-40" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Action Footer */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Skeleton className="h-10 w-24 rounded-xl" />
                        <Skeleton className="h-10 w-36 rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Universal Default Skeleton
 */
function DefaultSkeleton({ rows = 6 }) {
    return (
        <div className="space-y-6 pb-12" aria-label="Loading page" aria-busy="true">
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <Skeleton className="h-8 w-60 rounded-xl" />
                <Skeleton className="h-10 w-44 rounded-xl" />
            </div>
            <StatCardsSkeleton count={4} />
            <div className="rounded-2xl border border-white/10 bg-black/40 p-6 shadow-2xl">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-10 w-56 rounded-xl" />
                </div>
                <div className="space-y-4">
                    {Array.from({ length: rows }).map((_, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-1 gap-3 border-b border-white/5 pb-4 md:grid-cols-4"
                        >
                            <Skeleton className="h-5" />
                            <Skeleton className="h-5" />
                            <Skeleton className="h-5" />
                            <Skeleton className="h-10 rounded-xl" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * Main AdminPageSkeleton switcher
 * Maps page activeNavId/type directly to its tailored esports skeleton
 */
export default function AdminPageSkeleton({ type = 'default', rows = 6 }) {
    switch (type) {
        case 'dashboard':
            return <DashboardSkeleton />;
        case 'sl-management':
            return <StudentLeadersSkeleton />;
        case 'regional-admins':
        case 'regional-admin-management':
            return <RegionalAdminsSkeleton />;
        case 'school-management':
        case 'schools':
            return <SchoolManagementSkeleton />;
        case 'pending-users':
        case 'users-pending':
            return <PendingUsersSkeleton />;
        case 'management':
        case 'roles-permissions':
            return <ManagementSkeleton />;
        default:
            return <DefaultSkeleton rows={rows} />;
    }
}
