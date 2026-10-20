import React, { useEffect, useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Toast from './components/Toast';
import ConfirmModal from './components/ConfirmModal';
import { 
    Users, Newspaper, CalendarDays, Trophy, Activity, Eye, Clock, 
    ArrowUpRight, TrendingUp, BarChart3, Globe, MousePointerClick, 
    Layers, RefreshCw, CheckCircle2, ChevronRight, Search, Filter,
    ShieldCheck, X, FileText, ExternalLink, Gamepad2, Landmark, 
    User, Mail, Phone, Calendar, Facebook, MapPin, Award, Swords,
    Compass, Crown, UserX, Ban, ArrowUpCircle
} from 'lucide-react';

export default function AdminDashboard({ 
    auth, 
    pendingUsers = 0, 
    activeUsers = 0, 
    totalNews = 0, 
    upcomingEvents = 0, 
    tournaments = 0, 
    analytics = {}, 
    students = [], 
    filters = {} 
}) {
    const adminRole = auth?.user?.role ?? auth?.user?.user_type;
    const reviewRoles = ['Admin', 'Super Admin'];
    const canReview = auth?.guard === 'admin' && reviewRoles.includes(adminRole);
    const isSuperAdmin = auth?.is_super_admin ?? ['Super Admin', 'super_admin'].includes(adminRole);
    const hasPermission = (slug) => canReview && (isSuperAdmin || auth?.permissions?.includes(slug));

    // Real-time state matching MSL-1
    const [realTimeData, setRealTimeData] = useState(analytics?.realTime || {});
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [showAllPages, setShowAllPages] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [hoveredBarIndex, setHoveredBarIndex] = useState(null);

    // Student quick queue & drawer modal state
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [searchQuery, setSearchQuery] = useState(filters.search || "");
    const [divisionFilter, setDivisionFilter] = useState(filters.division || "");
    const [studentQueueTab, setStudentQueueTab] = useState("pending");
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, onConfirm: null, title: "", message: "" });
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
    };

    // Polling real-time analytics every 30 seconds (matching MSL-1)
    const fetchRealTimeData = async () => {
        setIsRefreshing(true);
        try {
            const response = await fetch('/api/analytics/real-time');
            if (response.ok) {
                const data = await response.json();
                setRealTimeData(data);
                setLastUpdated(new Date());
            }
        } catch (error) {
            console.error('Failed to fetch real-time data:', error);
        } finally {
            setTimeout(() => setIsRefreshing(false), 400);
        }
    };

    useEffect(() => {
        fetchRealTimeData();
        const interval = setInterval(fetchRealTimeData, 30000);
        return () => clearInterval(interval);
    }, []);

    // Format session duration from seconds to readable string
    const formatDuration = (seconds = 0) => {
        if (!seconds || seconds <= 0) return "0s";
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        if (minutes === 0) return `${remainingSeconds}s`;
        return `${minutes}m ${remainingSeconds}s`;
    };

    // Top 4 stats configuration matching MSL-1 with STRICT ACTUAL DATABASE NUMBERS
    const stats = [
        {
            title: 'Active Students',
            value: (activeUsers ?? 0).toLocaleString(),
            subtext: `${(students?.length || 0).toLocaleString()} total registered students`,
            icon: Users,
            accent: 'from-amber-500/20 to-amber-600/5',
            badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
            indicatorColor: activeUsers > 0 ? 'text-emerald-400' : 'text-zinc-500',
            indicatorText: activeUsers > 0 ? 'Active in DB' : 'None',
            href: '/admin/users/pending',
            cta: 'View student queue'
        },
        {
            title: 'Total News Articles',
            value: (totalNews ?? 0).toLocaleString(),
            subtext: totalNews === 0 ? 'No published articles yet' : `${totalNews} published articles`,
            icon: Newspaper,
            accent: 'from-blue-500/20 to-blue-600/5',
            badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            indicatorColor: totalNews > 0 ? 'text-blue-400' : 'text-zinc-500',
            indicatorText: totalNews > 0 ? 'Published' : 'Empty',
            href: '/admin/news-updates',
            cta: 'Manage news articles'
        },
        {
            title: 'Upcoming Events',
            value: (upcomingEvents ?? 0).toLocaleString(),
            subtext: upcomingEvents === 0 ? 'No upcoming events scheduled' : `${upcomingEvents} scheduled events`,
            icon: CalendarDays,
            accent: 'from-emerald-500/20 to-emerald-600/5',
            badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            indicatorColor: upcomingEvents > 0 ? 'text-emerald-400' : 'text-zinc-500',
            indicatorText: upcomingEvents > 0 ? 'Scheduled' : 'None',
            href: '/admin/event-management',
            cta: 'Open events calendar'
        },
        {
            title: 'Active Tournaments',
            value: (tournaments ?? 0).toLocaleString(),
            subtext: tournaments === 0 ? 'No active tournaments' : `${tournaments} active brackets/seasons`,
            icon: Trophy,
            accent: 'from-purple-500/20 to-purple-600/5',
            badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
            indicatorColor: tournaments > 0 ? 'text-purple-400' : 'text-zinc-500',
            indicatorText: tournaments > 0 ? 'Ongoing' : 'None',
            href: '/admin/mcc-seasons',
            cta: 'Open tournament hub'
        }
    ];

    // Actual page views array from server
    const pageViewsArray = analytics?.pageViews?.pageViews || [0, 0, 0, 0, 0, 0, 0];
    const daysArray = analytics?.pageViews?.days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const totalViewsInWeek = analytics?.pageViews?.total ?? 0;
    const maxViews = Math.max(...pageViewsArray, 1);
    const growth = analytics?.pageViews?.growth ?? 0;

    // Student counts for queue summary
    const studentQueueCounts = useMemo(() => {
        return {
            pending: students.filter(s => s.status === 'pending-review' || s.status === 'pending').length,
            active: students.filter(s => s.status === 'active').length,
            renewal: students.filter(s => s.status === 'renewal-required' || s.renewal_requested_at).length,
            blocked: students.filter(s => s.status === 'blocked').length,
        };
    }, [students]);

    // Filtered students for quick review list
    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            let matchesTab = true;
            if (studentQueueTab === "pending") {
                matchesTab = student.status === "pending-review" || student.status === "pending";
            } else if (studentQueueTab === "active") {
                matchesTab = student.status === "active";
            } else if (studentQueueTab === "renewal") {
                matchesTab = student.status === "renewal-required" || Boolean(student.renewal_requested_at);
            } else if (studentQueueTab === "blocked") {
                matchesTab = student.status === "blocked";
            }

            const query = searchQuery.toLowerCase().trim();
            const matchesSearch = !query || 
                student.name?.toLowerCase().includes(query) ||
                student.username?.toLowerCase().includes(query) ||
                student.ml_ign?.toLowerCase().includes(query) ||
                String(student.ml_id || "").includes(query) ||
                student.email?.toLowerCase().includes(query);

            const matchesDivision = !divisionFilter || student.division === divisionFilter;

            return matchesTab && matchesSearch && matchesDivision;
        });
    }, [students, studentQueueTab, searchQuery, divisionFilter]);

    // Student action handlers
    const handleApprove = (studentId) => {
        setConfirmDialog({
            isOpen: true,
            title: "Approve Student Account",
            message: "Are you sure you want to approve this student's registration? This will mark their profile status as active.",
            onConfirm: () => {
                setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                router.post(route('admin.users.approve', studentId), {}, {
                    onSuccess: () => {
                        setSelectedStudent(null);
                        showToast("Account approved successfully.");
                    },
                    onError: () => showToast("Approval failed. Please check permissions.", "error")
                });
            }
        });
    };

    return (
        <AdminLayout activeNavId="dashboard">
            <Head title="Admin Command Center | MSL Philippines" />

            {/* Custom Confirm Modal & Toast */}
            <ConfirmModal
                isOpen={confirmDialog.isOpen}
                title={confirmDialog.title}
                message={confirmDialog.message}
                confirmLabel="Confirm Action"
                cancelLabel="Cancel"
                isDangerous={false}
                onConfirm={confirmDialog.onConfirm}
                onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
            />

            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ show: false, message: "", type: "success" })}
                />
            )}

            <div className="space-y-8 pb-12">
                {/* 1. Header & Real-Time Telemetry Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 relative">
                    <div>
                        <div className="flex items-center gap-2.5 mb-1.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400 shadow-[0_0_10px_#FBBF24]"></span>
                            </span>
                            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-400/90">
                                Command Telemetry • Live Operations
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
                            Command <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-brand-400 to-amber-200">Center</span>
                        </h1>
                        <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-xl">
                            High-frequency website telemetry, student verification queue, and real-time tournament operations.
                        </p>
                    </div>

                    {/* Live Telemetry Status Pill */}
                    <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-2.5 backdrop-blur-xl shadow-xl shadow-black/40">
                        <div className="flex items-center gap-2.5 text-xs">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                            </span>
                            <span className="font-mono font-bold uppercase tracking-wider text-emerald-400 text-[11px]">
                                Online
                            </span>
                            <span className="text-zinc-600">|</span>
                            <span className="text-zinc-400 text-[11px] font-mono">
                                Sync: {lastUpdated.toLocaleTimeString()}
                            </span>
                        </div>
                        <button
                            onClick={fetchRealTimeData}
                            disabled={isRefreshing}
                            title="Refresh Real-Time Data"
                            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50"
                        >
                            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* 2. Top Stats Cards Grid (Taste Skill High-End Glassmorphic Cards - Clickable) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                    {stats.map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <Link
                                key={idx}
                                href={stat.href}
                                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] via-white/[0.02] to-transparent p-5 sm:p-6 backdrop-blur-xl shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/40 hover:shadow-[0_16px_36px_rgba(0,0,0,0.5)] block cursor-pointer"
                            >
                                {/* Top Edge Light */}
                                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none group-hover:via-amber-400/50 transition-colors" />

                                <div className="flex items-start justify-between">
                                    <div className={`p-3 rounded-xl border backdrop-blur-md transition-transform duration-300 group-hover:scale-105 ${stat.badgeBg}`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <span className="inline-flex items-center gap-1 rounded-full border border-white/5 bg-white/[0.03] px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-400 group-hover:border-white/10">
                                        <span className={stat.indicatorColor}>●</span>
                                        <span>{stat.indicatorText}</span>
                                    </span>
                                </div>
                                <div className="mt-5">
                                    <span className="text-zinc-400 text-[11px] font-mono font-bold uppercase tracking-wider block mb-1">
                                        {stat.title}
                                    </span>
                                    <span className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight block">
                                        {stat.value}
                                    </span>
                                    <span className="text-xs text-zinc-500 mt-1 block truncate">
                                        {stat.subtext}
                                    </span>
                                </div>

                                {/* Justification Action Footer */}
                                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-semibold text-zinc-400 group-hover:text-amber-400 transition-colors">
                                    <span>{stat.cta}</span>
                                    <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* 3. Website Analytics & User Engagement (Taste Skill Two-Column Console) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* LEFT PANEL: Website Analytics */}
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#0e0e14]/90 to-[#070709]/90 p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 blur-[80px] pointer-events-none rounded-full" />
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                                        <BarChart3 className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-white tracking-tight">Website Performance</h2>
                                        <p className="text-[11px] text-zinc-400">7-day traffic telemetry & visitor flow</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">
                                    <TrendingUp className="h-3.5 w-3.5" />
                                    <span>{growth >= 0 ? `+${growth}%` : `${growth}%`} velocity</span>
                                </div>
                            </div>

                            {/* Page Views (Last 7 Days) Bar Chart */}
                            <div className="rounded-xl border border-white/5 bg-black/40 p-4 sm:p-5 mb-5 backdrop-blur-sm">
                                <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                                        Page Views (7 Days)
                                    </span>
                                    <span className="text-xs font-mono font-bold text-amber-400">
                                        Total: {totalViewsInWeek.toLocaleString()}
                                    </span>
                                </div>

                                <div className="h-44 flex items-end justify-between gap-2.5 pt-4 px-1 border-b border-white/10">
                                    {pageViewsArray.map((views, index) => {
                                        const heightPercent = totalViewsInWeek > 0 && maxViews > 0 
                                            ? Math.max(12, (views / maxViews) * 100) 
                                            : 8;
                                        const isHovered = hoveredBarIndex === index;
                                        return (
                                            <div 
                                                key={index} 
                                                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                                                onMouseEnter={() => setHoveredBarIndex(index)}
                                                onMouseLeave={() => setHoveredBarIndex(null)}
                                            >
                                                {/* Tooltip */}
                                                <div className={`absolute -top-8 px-2.5 py-1 rounded-lg bg-black/90 text-[10px] font-mono text-white shadow-2xl border border-white/20 pointer-events-none transition-all duration-200 z-20 whitespace-nowrap ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                                                    <span className="text-amber-400 font-bold">{daysArray[index]}</span>: {views.toLocaleString()} views
                                                </div>
                                                
                                                {/* Bar */}
                                                <div 
                                                    className={`w-full rounded-t-lg transition-all duration-300 relative ${
                                                        views > 0
                                                            ? (isHovered 
                                                                ? 'bg-gradient-to-t from-amber-500 via-amber-400 to-amber-200 shadow-[0_0_20px_rgba(251,191,36,0.6)]' 
                                                                : 'bg-gradient-to-t from-blue-700/80 via-blue-500 to-cyan-400 hover:from-amber-600 hover:to-amber-400')
                                                            : 'bg-white/5 border-t border-white/10'
                                                    }`}
                                                    style={{ height: `${heightPercent}%` }}
                                                >
                                                    {views > 0 && (
                                                        <div className="absolute top-0 inset-x-0 h-1 bg-white/60 rounded-t-lg" />
                                                    )}
                                                </div>
                                                
                                                {/* Day label */}
                                                <span className="text-[10px] font-mono font-semibold text-zinc-400 mt-2.5 block group-hover:text-amber-400 transition-colors">
                                                    {daysArray[index]}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Key Metrics Grid (Total Views & Unique Visitors) */}
                            <div className="grid grid-cols-2 gap-3 mb-5">
                                <div className="rounded-xl border border-white/5 bg-black/40 p-4 text-center">
                                    <span className="text-2xl sm:text-3xl font-black text-white font-display block">
                                        {(analytics?.metrics?.totalViews ?? 0).toLocaleString()}
                                    </span>
                                    <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-400 mt-1 block">
                                        Total Impressions
                                    </span>
                                </div>
                                <div className="rounded-xl border border-white/5 bg-black/40 p-4 text-center">
                                    <span className="text-2xl sm:text-3xl font-black text-amber-400 font-display block">
                                        {(analytics?.metrics?.uniqueVisitors ?? 0).toLocaleString()}
                                    </span>
                                    <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-400 mt-1 block">
                                        Unique Visitors
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Real-time Activity Card */}
                        <div className="rounded-xl border border-blue-500/20 bg-gradient-to-r from-blue-950/40 to-black/40 p-4 backdrop-blur-sm">
                            <div className="flex items-center gap-2 mb-2.5">
                                <Activity className="h-4 w-4 text-blue-400" />
                                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-300">Live Traffic Pulse</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-xs">
                                <div className="flex items-center justify-between border-r border-blue-500/20 pr-4">
                                    <span className="text-zinc-400">Active (Last 15m):</span>
                                    <span className="font-black text-white font-mono text-sm">
                                        {realTimeData?.activeUsers ?? 0}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between pl-2">
                                    <span className="text-zinc-400">New Today:</span>
                                    <span className="font-black text-emerald-400 font-mono text-sm">
                                        +{realTimeData?.recentRegistrations ?? 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL: User Engagement */}
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#0e0e14]/90 to-[#070709]/90 p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 blur-[80px] pointer-events-none rounded-full" />
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                                        <MousePointerClick className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-white tracking-tight">User Engagement</h2>
                                        <p className="text-[11px] text-zinc-400">Retention, session depth & interactions</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                                    Core UX Telemetry
                                </span>
                            </div>

                            <div className="space-y-4 mb-6">
                                {/* Bounce Rate */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5 text-xs">
                                        <span className="text-zinc-400 flex items-center gap-1.5">
                                            <span>Bounce Rate</span>
                                            <span className="text-[10px] text-zinc-500 font-mono">(1-Page Exits)</span>
                                        </span>
                                        <span className="font-bold text-white font-mono">
                                            {analytics?.metrics?.bounceRate ?? 0}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden border border-white/5 p-0.5">
                                        <div 
                                            className="bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 h-1.5 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(242,194,26,0.3)]" 
                                            style={{ width: `${Math.min(analytics?.metrics?.bounceRate ?? 0, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Average Session Duration */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5 text-xs">
                                        <span className="text-zinc-400">Avg. Session Duration</span>
                                        <span className="font-bold text-cyan-400 font-mono">
                                            {formatDuration(analytics?.metrics?.avgSessionDuration ?? 0)}
                                        </span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden border border-white/5 p-0.5">
                                        <div 
                                            className="bg-gradient-to-r from-blue-500 to-cyan-400 h-1.5 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(6,182,212,0.4)]" 
                                            style={{ width: `${Math.min(((analytics?.metrics?.avgSessionDuration ?? 0) / 600) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Pages per Session */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5 text-xs">
                                        <span className="text-zinc-400">Pages per Session</span>
                                        <span className="font-bold text-purple-400 font-mono">
                                            {analytics?.metrics?.pagesPerSession ?? 0} pages
                                        </span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden border border-white/5 p-0.5">
                                        <div 
                                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(168,85,247,0.4)]" 
                                            style={{ width: `${Math.min(((analytics?.metrics?.pagesPerSession ?? 0) / 8) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top Pages List */}
                        <div className="rounded-xl border border-white/5 bg-black/40 p-4 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
                                    Most Active Pathways
                                </span>
                                {(analytics?.topPages || []).length > 3 && (
                                    <button 
                                        className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                                        onClick={() => setShowAllPages(!showAllPages)}
                                    >
                                        {showAllPages ? 'Show Top 3' : `View All (${analytics.topPages.length})`}
                                    </button>
                                )}
                            </div>
                            <div className="space-y-2">
                                {(analytics?.topPages || []).length === 0 ? (
                                    <div className="py-6 text-center text-xs text-zinc-500 font-mono">
                                        No tracked page views yet. Real-time traffic will appear here.
                                    </div>
                                ) : (
                                    (analytics?.topPages || []).slice(0, showAllPages ? 10 : 3).map((page, index) => (
                                        <div key={index} className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg hover:bg-white/5 transition-colors">
                                            <div className="flex items-center gap-2 truncate">
                                                <span className="text-[10px] font-mono text-amber-400/80 font-bold w-4">#{index + 1}</span>
                                                <span className="text-zinc-200 font-medium truncate">{page.page}</span>
                                                <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline">[{page.path}]</span>
                                            </div>
                                            <span className="text-zinc-300 font-mono text-[11px] whitespace-nowrap ml-2">
                                                {page.views.toLocaleString()} views
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                            {(analytics?.topPages?.length > 3 && !showAllPages) && (
                                <div className="text-[10px] font-mono text-zinc-500 mt-2 text-right">
                                    +{analytics.topPages.length - 3} more pages tracked
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 4. Student Registrations Queue & Operational Hub (Taste Skill High-Density Console) */}
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#0e0e14]/90 to-[#070709]/90 p-6 backdrop-blur-xl shadow-2xl">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent pointer-events-none" />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6">
                        <div>
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
                                    <ShieldCheck className="h-4 w-4" />
                                </div>
                                <h2 className="text-base font-bold text-white tracking-tight uppercase">
                                    Student Registration Operations
                                </h2>
                            </div>
                            <p className="text-xs text-zinc-400 mt-1">
                                Real database verification queue and latest campus applicants ({students.length} total registered).
                            </p>
                        </div>

                        {/* Link to full pending queue page */}
                        <Link
                            href="/admin/users/pending"
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 text-black text-xs font-bold hover:bg-amber-300 transition-all shadow-[0_0_15px_rgba(251,191,36,0.2)] active:scale-95"
                        >
                            <span>Open Dedicated Queue</span>
                            <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
                        </Link>
                    </div>

                    {/* Operational Queue Metric Pills */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                        <button
                            onClick={() => setStudentQueueTab("pending")}
                            className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                                studentQueueTab === "pending"
                                    ? "bg-amber-500/15 border-amber-400/50 text-amber-400 shadow-[0_0_20px_rgba(242,194,26,0.15)] ring-1 ring-amber-400/30"
                                    : "bg-black/40 border-white/5 text-zinc-400 hover:border-white/15 hover:bg-white/[0.02]"
                            }`}
                        >
                            <span className="text-[11px] font-mono font-bold uppercase tracking-wider block mb-1">Pending Review</span>
                            <span className="text-2xl font-black text-white font-display">
                                {studentQueueCounts.pending}
                            </span>
                        </button>

                        <button
                            onClick={() => setStudentQueueTab("active")}
                            className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                                studentQueueTab === "active"
                                    ? "bg-emerald-500/15 border-emerald-400/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-400/30"
                                    : "bg-black/40 border-white/5 text-zinc-400 hover:border-white/15 hover:bg-white/[0.02]"
                            }`}
                        >
                            <span className="text-[11px] font-mono font-bold uppercase tracking-wider block mb-1">Active / Verified</span>
                            <span className="text-2xl font-black text-white font-display">
                                {studentQueueCounts.active}
                            </span>
                        </button>

                        <button
                            onClick={() => setStudentQueueTab("renewal")}
                            className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                                studentQueueTab === "renewal"
                                    ? "bg-blue-500/15 border-blue-400/50 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)] ring-1 ring-blue-400/30"
                                    : "bg-black/40 border-white/5 text-zinc-400 hover:border-white/15 hover:bg-white/[0.02]"
                            }`}
                        >
                            <span className="text-[11px] font-mono font-bold uppercase tracking-wider block mb-1">Account Renewal</span>
                            <span className="text-2xl font-black text-white font-display">
                                {studentQueueCounts.renewal}
                            </span>
                        </button>

                        <button
                            onClick={() => setStudentQueueTab("blocked")}
                            className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                                studentQueueTab === "blocked"
                                    ? "bg-rose-500/15 border-rose-400/50 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.15)] ring-1 ring-rose-400/30"
                                    : "bg-black/40 border-white/5 text-zinc-400 hover:border-white/15 hover:bg-white/[0.02]"
                            }`}
                        >
                            <span className="text-[11px] font-mono font-bold uppercase tracking-wider block mb-1">Blocked Accounts</span>
                            <span className="text-2xl font-black text-white font-display">
                                {studentQueueCounts.blocked}
                            </span>
                        </button>
                    </div>

                    {/* Filter and Quick Table */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
                        <div className="relative flex-1">
                            <Search className="h-4 w-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by student name, IGN, MLBB ID..."
                                className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/30 transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>

                        <select
                            value={divisionFilter}
                            onChange={(e) => setDivisionFilter(e.target.value)}
                            aria-label="Filter by division"
                            className="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-semibold text-zinc-300 focus:outline-none focus:border-amber-400/50"
                        >
                            <option value="">All Divisions</option>
                            <option value="College">College</option>
                            <option value="High School">High School</option>
                        </select>
                    </div>

                    {/* Registrations Mini Table */}
                    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead className="bg-white/[0.02] text-zinc-400 uppercase text-[10px] font-mono tracking-wider border-b border-white/10">
                                <tr>
                                    <th className="py-3.5 px-4 font-bold">Student & MLBB Identity</th>
                                    <th className="py-3.5 px-4 font-bold">Campus & Division</th>
                                    <th className="py-3.5 px-4 font-bold">Region Hub</th>
                                    <th className="py-3.5 px-4 font-bold">Status</th>
                                    <th className="py-3.5 px-4 text-right font-bold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-10 text-center text-zinc-500 text-xs font-mono">
                                            No student records found matching the active filter.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.slice(0, 5).map((student) => (
                                        <tr key={student.id} className="hover:bg-white/[0.03] transition-colors group">
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-200 flex items-center justify-center font-black text-black text-xs shrink-0 shadow-[0_0_12px_rgba(251,191,36,0.3)]">
                                                        {student.name?.charAt(0)?.toUpperCase() || 'S'}
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-white block group-hover:text-amber-400 transition-colors">
                                                            {student.name}
                                                        </span>
                                                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-mono mt-0.5">
                                                            <Gamepad2 className="h-3 w-3 text-amber-400" />
                                                            <span className="text-amber-300 font-semibold">{student.ml_ign || 'No IGN'}</span>
                                                            <span className="text-zinc-500">[{student.ml_id || 'ID N/A'}]</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="font-medium text-zinc-200 block">{student.university || 'N/A'}</span>
                                                <span className="text-[10px] font-mono text-zinc-500 uppercase">{student.division || 'College'} • {student.year_level || 'N/A'}</span>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 text-[10px] font-mono text-zinc-300 border border-white/5">
                                                    <MapPin className="h-2.5 w-2.5 text-amber-400" />
                                                    {student.region || 'NCR'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                    student.status === 'active' 
                                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                        : student.status === 'blocked'
                                                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                }`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full ${
                                                        student.status === 'active' ? 'bg-emerald-400' : student.status === 'blocked' ? 'bg-rose-400' : 'bg-amber-400'
                                                    }`}></span>
                                                    {student.status || 'Pending'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {(student.status === 'pending-review' || student.status === 'pending') && (
                                                        <button
                                                            onClick={() => handleApprove(student.id)}
                                                            className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-[11px] font-bold transition-colors cursor-pointer border border-emerald-500/30"
                                                        >
                                                            Approve
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => setSelectedStudent(student)}
                                                        className="px-3 py-1.5 rounded-lg bg-white/5 text-zinc-300 hover:bg-white/10 text-[11px] font-semibold transition-colors cursor-pointer border border-white/10 hover:text-white"
                                                    >
                                                        Details
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {filteredStudents.length > 5 && (
                        <div className="mt-3 flex items-center justify-between text-xs text-zinc-400">
                            <span>Showing top 5 of {filteredStudents.length} records in this view.</span>
                            <Link href="/admin/users/pending" className="text-brand-400 hover:underline font-semibold flex items-center gap-1">
                                <span>View all {filteredStudents.length} records</span>
                                <ChevronRight className="h-3 w-3" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Student Detail Modal if clicked */}
            {selectedStudent && (
                <div
                    className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center p-4 pt-14 sm:pt-20 pb-10 bg-black/80 backdrop-blur-sm animate-fadeIn"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) setSelectedStudent(null);
                    }}
                >
                    <div className="relative w-full max-w-lg max-h-[calc(100vh-6rem)] sm:max-h-[calc(100vh-8rem)] overflow-y-auto rounded-2xl border border-white/10 bg-[#0e0e13] p-6 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold">
                                    {selectedStudent.name?.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-base">{selectedStudent.name}</h3>
                                    <span className="text-xs text-zinc-400">{selectedStudent.email}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedStudent(null)}
                                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div className="grid grid-cols-2 gap-2 bg-[#14141c] p-3 rounded-xl border border-white/5">
                                <div>
                                    <span className="text-zinc-500 block">MLBB IGN:</span>
                                    <span className="font-semibold text-white">{selectedStudent.ml_ign || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="text-zinc-500 block">MLBB ID & Zone:</span>
                                    <span className="font-semibold text-white font-mono">
                                        {selectedStudent.ml_id} ({selectedStudent.ml_server || 'Zone'})
                                    </span>
                                </div>
                                <div className="mt-2">
                                    <span className="text-zinc-500 block">School / University:</span>
                                    <span className="font-semibold text-white">{selectedStudent.university || 'N/A'}</span>
                                </div>
                                <div className="mt-2">
                                    <span className="text-zinc-500 block">Division & Course:</span>
                                    <span className="font-semibold text-white">{selectedStudent.division} • {selectedStudent.course || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between bg-[#14141c] p-3 rounded-xl border border-white/5">
                                <span className="text-zinc-400">Current Account Status:</span>
                                <span className="font-bold uppercase tracking-wider text-amber-400">
                                    {selectedStudent.status}
                                </span>
                            </div>

                            {selectedStudent.proofOfEnrollment && (
                                <a
                                    href={`/storage/${selectedStudent.proofOfEnrollment}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 font-semibold"
                                >
                                    <FileText className="h-4 w-4" />
                                    <span>View Proof of Enrollment</span>
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            )}
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/10 pt-4">
                            <button
                                onClick={() => setSelectedStudent(null)}
                                className="px-4 py-2 rounded-xl border border-white/10 text-xs font-semibold text-zinc-400 hover:text-white"
                            >
                                Close
                            </button>
                            {(selectedStudent.status === 'pending-review' || selectedStudent.status === 'pending') && (
                                <button
                                    onClick={() => handleApprove(selectedStudent.id)}
                                    className="px-4 py-2 rounded-xl bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400"
                                >
                                    Approve Registration
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
