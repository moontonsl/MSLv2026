import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import Toast from "./components/Toast";
import ConfirmModal from "./components/ConfirmModal";
import { 
    Users, Search, Filter, ShieldCheck, ShieldAlert, Check, X, FileText, 
    ExternalLink, Gamepad2, Landmark, User, Mail, Phone, Calendar, 
    Facebook, MapPin, Award, Swords, Compass, LogOut, ClipboardList,
    Crown, RefreshCw, UserX, UserCheck, ChevronLeft, ChevronRight, Settings
} from "lucide-react";

export default function AdminDashboard({ auth, students, filters }) {
    const hasPermission = (slug) => {
        return auth?.permissions?.includes(slug) || false;
    };
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(filters.search || "");
    const [divisionFilter, setDivisionFilter] = useState(filters.division || "");
    const [activeTab, setActiveTab] = useState(filters.status || "pending");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;
    
    // Custom dialog states
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, onConfirm: null, title: "", message: "" });
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
    };
    
    // Rejection modal form state
    const [rejectionReason, setRejectionReason] = useState("");
    const [rejectionChecklist, setRejectionChecklist] = useState({
        invalid_document: false,
        invalid_age: false,
        invalid_info: false,
        other: false
    });

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleApplyFilters = () => {
        setCurrentPage(1);
        router.get(route('admin.dashboard'), {
            search: searchQuery,
            status: activeTab,
            division: divisionFilter
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handleClearFilters = () => {
        setSearchQuery("");
        setDivisionFilter("");
        setActiveTab("pending");
        setCurrentPage(1);
        router.get(route('admin.dashboard'), {}, {
            preserveState: true,
            replace: true
        });
    };

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
        setCurrentPage(1);
        router.get(route('admin.dashboard'), {
            search: searchQuery,
            status: tabName,
            division: divisionFilter
        }, {
            preserveState: true,
            replace: true,
            preserveScroll: true
        });
    };

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
                    }
                });
            },
            onCancel: () => setConfirmDialog(prev => ({ ...prev, isOpen: false }))
        });
    };

    const handleRejectSubmit = (e) => {
        e.preventDefault();
        if (!rejectionReason.trim()) {
            showToast("Please provide a rejection reason.", "error");
            return;
        }

        router.post(route('admin.users.reject', selectedStudent.id), {
            reason: rejectionReason,
            checklist: rejectionChecklist
        }, {
            onSuccess: () => {
                setRejectModalOpen(false);
                setSelectedStudent(null);
                setRejectionReason("");
                setRejectionChecklist({
                    invalid_document: false,
                    invalid_age: false,
                    invalid_info: false,
                    other: false
                });
                showToast("Account registration rejected.", "success");
            }
        });
    };

    const toggleChecklistItem = (key) => {
        setRejectionChecklist(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // Stats calculations from the full search/division-filtered students list
    const pendingCount = students.filter(s => s.user_type === 'Student' && (s.status === 'pending' || s.status === 'pending-review')).length;
    const renewalCount = students.filter(s => s.user_type === 'Student' && s.status === 'renewal-required').length;
    const activeCount = students.filter(s => s.user_type === 'Student' && s.status === 'active').length;
    const rejectedCount = students.filter(s => s.user_type === 'Student' && s.status === 'rejected').length;
    const blockedCount = rejectedCount;
    const studentLeaderCount = students.filter(s => s.user_type === 'Student Leader').length;

    // Filter students to display in table based on selected tab
    const displayedStudents = students.filter(student => {
        if (activeTab === "pending") {
            return student.user_type === 'Student' && (student.status === 'pending' || student.status === 'pending-review');
        }
        if (activeTab === "renewal") {
            return student.user_type === 'Student' && student.status === 'renewal-required';
        }
        if (activeTab === "active") {
            return student.user_type === 'Student' && student.status === 'active';
        }
        if (activeTab === "rejected") {
            return student.user_type === 'Student' && student.status === 'rejected';
        }
        if (activeTab === "student_leader") {
            return student.user_type === 'Student Leader';
        }
        return true;
    });

    const totalCount = displayedStudents.length;
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    
    // Slice current page data
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedStudents = displayedStudents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className="min-h-screen bg-black text-white font-sans flex flex-col justify-between relative overflow-hidden">
            <Head>
                <title>Moonton SLPH Admin Dashboard</title>
                <meta name="description" content="Manage Moonton Student Leader Philippines registrations, approval workflow, and student leader status." />
                <meta property="og:title" content="Moonton SLPH Admin Dashboard" />
                <meta property="og:description" content="Manage Moonton Student Leader Philippines registrations, approval workflow, and student leader status." />
            </Head>
            
            {/* Background glowing effects */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Top Navigation */}
            <header className="w-full bg-zinc-950 border-b border-white/10 px-6 py-4 flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                    <Swords className="h-8 w-8 text-brand-500 animate-pulse" />
                    <div>
                        <span className="font-display font-extrabold text-lg tracking-wider text-white block">
                            MOONTON <span className="text-brand-500">SLPH</span>
                        </span>
                        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block">Admin Control Panel</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {hasPermission('access_admin_management') && (
                        <Link
                            href={route('admin.management')}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-sm font-medium text-gray-300 hover:text-white"
                        >
                            <Settings className="h-4 w-4" />
                            Permissions
                        </Link>
                    )}
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-sm font-medium text-gray-300 hover:text-white"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </Link>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8 z-10">
                <h1 className="sr-only">Moonton Student Leader Philippines Admin Dashboard</h1>
                
                {/* Left panel: stats & filters */}
                <div className="lg:col-span-1 space-y-6">
                    


                    {/* Filter Card */}
                    <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 space-y-5">
                        <h4 className="text-sm uppercase font-bold text-gray-400 tracking-wider flex items-center gap-2">
                            <Filter className="h-4 w-4" /> Filters
                        </h4>
                        
                        <div className="space-y-4">
                            {/* Search bar */}
                            <div>
                                <label className="block text-xs text-gray-500 font-semibold mb-1.5 uppercase tracking-wider">Search</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        placeholder="Name, email, IGN..."
                                        className="w-full !bg-[#0c0c0c] border border-white/10 rounded-xl pl-[38px] pr-md py-sm text-sm !text-white focus:outline-none focus:border-brand-500 transition-colors"
                                        style={{ backgroundColor: '#0c0c0c', color: '#ffffff' }}
                                    />
                                    <Search className="h-4 w-4 text-gray-500 absolute left-[12px] top-[12px] pointer-events-none" />
                                </div>
                            </div>

                            {/* Division selection */}
                            <div>
                                <label className="block text-xs text-gray-400 font-semibold mb-1.5 uppercase tracking-wider">Division</label>
                                <select
                                    value={divisionFilter}
                                    onChange={(e) => setDivisionFilter(e.target.value)}
                                    className="w-full !bg-[#0c0c0c] border border-white/10 rounded-xl px-3 py-2.5 text-sm !text-white focus:outline-none focus:border-brand-500 transition-colors"
                                    style={{ backgroundColor: '#0c0c0c', color: '#ffffff' }}
                                >
                                    <option value="" className="bg-[#0c0c0c] text-white">All Divisions</option>
                                    <option value="shs" className="bg-[#0c0c0c] text-white">Senior High School</option>
                                    <option value="college" className="bg-[#0c0c0c] text-white">College / University</option>
                                </select>
                            </div>

                            {/* Filter Buttons */}
                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={handleApplyFilters}
                                    className="flex-1 bg-brand-500 hover:bg-brand-600 text-black text-xs font-bold py-2.5 rounded-lg transition-colors uppercase tracking-wider"
                                >
                                    Apply
                                </button>
                                <button
                                    onClick={handleClearFilters}
                                    className="flex-1 bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-gray-400 hover:text-white text-xs font-bold py-2.5 rounded-lg transition-colors uppercase tracking-wider"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right panel: registrations list table */}
                <div className="lg:col-span-3 space-y-6">
                    
                    {/* Premium Card-Tabs Filter Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {/* Verified Card */}
                        <button
                            onClick={() => handleTabChange("active")}
                            className={`group relative rounded-2xl border p-5 flex flex-col justify-between text-left transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.02] active:scale-[0.98] ${
                                activeTab === "active"
                                    ? "border-emerald-500/45 bg-emerald-950/15 shadow-[0_0_20px_rgba(16,185,129,0.12)]"
                                    : "border-white/[0.06] bg-[#121212] hover:border-white/15 hover:bg-[#181818]"
                            }`}
                        >
                            <div className="flex justify-between items-start w-full">
                                <UserCheck className={`h-6 w-6 transition-colors ${
                                    activeTab === "active" ? "text-emerald-400" : "text-emerald-500 group-hover:text-emerald-400"
                                }`} />
                                <span className="text-gray-400 text-xs font-semibold tracking-wider">Verified</span>
                            </div>
                            <div className="mt-5">
                                <span className="text-3xl md:text-4xl font-extrabold text-white leading-none font-display block">
                                    {activeCount.toLocaleString()}
                                </span>
                            </div>
                        </button>

                        {/* Pending Card */}
                        <button
                            onClick={() => handleTabChange("pending")}
                            className={`group relative rounded-2xl border p-5 flex flex-col justify-between text-left transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.02] active:scale-[0.98] ${
                                activeTab === "pending"
                                    ? "border-blue-500/45 bg-blue-950/15 shadow-[0_0_20px_rgba(59,130,246,0.12)]"
                                    : "border-white/[0.06] bg-[#121212] hover:border-white/15 hover:bg-[#181818]"
                            }`}
                        >
                            <div className="flex justify-between items-start w-full">
                                <Users className={`h-6 w-6 transition-colors ${
                                    activeTab === "pending" ? "text-blue-400" : "text-blue-500 group-hover:text-blue-400"
                                }`} />
                                <span className="text-gray-400 text-xs font-semibold tracking-wider">Pending</span>
                            </div>
                            <div className="mt-5">
                                <span className="text-3xl md:text-4xl font-extrabold text-white leading-none font-display block">
                                    {pendingCount.toLocaleString()}
                                </span>
                            </div>
                        </button>

                        {/* Renewal Card */}
                        <button
                            onClick={() => handleTabChange("renewal")}
                            className={`group relative rounded-2xl border p-5 flex flex-col justify-between text-left transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.02] active:scale-[0.98] ${
                                activeTab === "renewal"
                                    ? "border-amber-500/45 bg-amber-950/15 shadow-[0_0_20px_rgba(234,179,8,0.12)]"
                                    : "border-white/[0.06] bg-[#121212] hover:border-white/15 hover:bg-[#181818]"
                            }`}
                        >
                            <div className="flex justify-between items-start w-full">
                                <RefreshCw className={`h-6 w-6 transition-colors ${
                                    activeTab === "renewal" ? "text-amber-400" : "text-amber-500 group-hover:text-amber-400"
                                }`} />
                                <span className="text-gray-400 text-xs font-semibold tracking-wider">Renewal</span>
                            </div>
                            <div className="mt-5">
                                <span className="text-3xl md:text-4xl font-extrabold text-white leading-none font-display block">
                                    {renewalCount.toLocaleString()}
                                </span>
                            </div>
                        </button>

                        {/* Blocked Card */}
                        <button
                            onClick={() => handleTabChange("rejected")}
                            className={`group relative rounded-2xl border p-5 flex flex-col justify-between text-left transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.02] active:scale-[0.98] ${
                                activeTab === "rejected"
                                    ? "border-red-500/45 bg-red-950/15 shadow-[0_0_20px_rgba(239,68,68,0.12)]"
                                    : "border-white/[0.06] bg-[#121212] hover:border-white/15 hover:bg-[#181818]"
                            }`}
                        >
                            <div className="flex justify-between items-start w-full">
                                <UserX className={`h-6 w-6 transition-colors ${
                                    activeTab === "rejected" ? "text-red-400" : "text-red-500 group-hover:text-red-400"
                                }`} />
                                <span className="text-gray-400 text-xs font-semibold tracking-wider">Blocked</span>
                            </div>
                            <div className="mt-5">
                                <span className="text-3xl md:text-4xl font-extrabold text-white leading-none font-display block">
                                    {blockedCount.toLocaleString()}
                                </span>
                            </div>
                        </button>

                        {/* Student Leaders Card */}
                        <button
                            onClick={() => handleTabChange("student_leader")}
                            className={`group relative rounded-2xl border p-5 flex flex-col justify-between text-left transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.02] active:scale-[0.98] col-span-2 md:col-span-1 ${
                                activeTab === "student_leader"
                                    ? "border-purple-500/45 bg-purple-950/15 shadow-[0_0_20px_rgba(168,85,247,0.12)]"
                                    : "border-white/[0.06] bg-[#121212] hover:border-white/15 hover:bg-[#181818]"
                            }`}
                        >
                            <div className="flex justify-between items-start w-full">
                                <Crown className={`h-6 w-6 transition-colors ${
                                    activeTab === "student_leader" ? "text-purple-400" : "text-purple-500 group-hover:text-purple-400"
                                }`} />
                                <span className="text-gray-400 text-xs font-semibold tracking-wider">Student Leaders</span>
                            </div>
                            <div className="mt-5">
                                <span className="text-3xl md:text-4xl font-extrabold text-white leading-none font-display block">
                                    {studentLeaderCount.toLocaleString()}
                                </span>
                            </div>
                        </button>
                    </div>

                    {/* Table Box */}
                    <div className="bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-zinc-900/60 border-b border-white/10 text-xs font-bold uppercase tracking-wider text-gray-400">
                                        <th className="py-4 px-6">MSL Account</th>
                                        <th className="py-4 px-6">Division</th>
                                        <th className="py-4 px-6">Region</th>
                                        <th className="py-4 px-6">Status</th>
                                        <th className="py-4 px-6 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                                    {displayedStudents.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="py-12 text-center text-gray-500">
                                                No registration records match the active filters.
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedStudents.map((student) => (
                                            <tr key={student.id} className="hover:bg-white/[0.02] transition-colors group">
                                                {/* MSL Account Profile details */}
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        {/* Avatar with dynamic division color coding */}
                                                        <div className={`w-12 h-12 rounded-full overflow-hidden border-[3px] shrink-0 bg-zinc-900 flex items-center justify-center ${
                                                            student.division === 'shs'
                                                                ? 'border-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.3)]'
                                                                : student.division === 'college'
                                                                    ? 'border-[#fbbf24] shadow-[0_0_8px_rgba(251,191,36,0.3)]'
                                                                    : 'border-zinc-700'
                                                        }`}>
                                                            <img
                                                                src={student.ml_avatar ? `https://api.dicebear.com/7.x/adventurer/svg?seed=avatar-${student.ml_avatar}` : `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(student.name)}`}
                                                                alt="Avatar"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        
                                                        {/* Text details */}
                                                        <div className="flex flex-col text-xs space-y-0.5">
                                                            <span className="font-bold text-sm text-white group-hover:text-brand-500 transition-colors">
                                                                {student.name}
                                                            </span>
                                                            <span className="text-gray-400">
                                                                IGN: <span className="text-gray-200 font-semibold">{student.ml_ign}</span>
                                                            </span>
                                                            <span className="text-gray-400">
                                                                {student.ml_id} ({student.ml_server})
                                                            </span>
                                                            {student.facebook_link && (
                                                                <a
                                                                    href={student.facebook_link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-500 hover:underline font-semibold text-[11px] mt-0.5 inline-block"
                                                                >
                                                                    Facebook
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Division */}
                                                <td className="py-4 px-6">
                                                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                        student.division === 'shs' 
                                                            ? 'bg-amber-950/40 border border-amber-900/60 text-amber-400' 
                                                            : 'bg-blue-950/40 border border-blue-900/60 text-blue-400'
                                                    }`}>
                                                        {student.division === 'shs' ? 'SHS' : 'College'}
                                                    </span>
                                                </td>

                                                {/* Region */}
                                                <td className="py-4 px-6 text-gray-400 text-xs">
                                                    {student.region}
                                                </td>

                                                {/* Status Badge */}
                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                        student.status === 'active' 
                                                            ? 'bg-green-950/40 border border-green-900/60 text-green-400' 
                                                            : student.status === 'rejected'
                                                                ? 'bg-red-950/40 border border-red-900/60 text-red-400'
                                                                : 'bg-yellow-950/40 border border-yellow-900/60 text-yellow-400'
                                                    }`}>
                                                        <span className={`h-1.5 w-1.5 rounded-full ${
                                                            student.status === 'active' 
                                                                ? 'bg-green-400' 
                                                                : student.status === 'rejected'
                                                                    ? 'bg-red-400'
                                                                    : 'bg-yellow-400 animate-pulse'
                                                        }`} />
                                                        {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                                                    </span>
                                                </td>

                                                {/* Details Button */}
                                                <td className="py-4 px-6 text-right">
                                                    <button
                                                        onClick={() => setSelectedStudent(student)}
                                                        className="px-3.5 py-1.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-all"
                                                    >
                                                        Review
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Premium Pagination Footer */}
                        {totalCount > 0 && (
                            <div className="border-t border-white/10 bg-[#0d0d0d] px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 z-20">
                                {/* Total / Current bounds text */}
                                <div className="text-xs text-gray-500 font-medium select-none">
                                    Showing <span className="text-gray-200 font-semibold">{totalCount === 0 ? 0 : startIndex + 1}</span> to{" "}
                                    <span className="text-gray-200 font-semibold">{Math.min(startIndex + ITEMS_PER_PAGE, totalCount)}</span> of{" "}
                                    <span className="text-gray-200 font-semibold">{totalCount.toLocaleString()}</span> registrations
                                </div>

                                {/* Controls container */}
                                {totalPages > 1 && (
                                    <div className="flex items-center gap-1.5">
                                        {/* Prev Button */}
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className={`p-2 rounded-lg border text-gray-300 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center shrink-0 ${
                                                currentPage === 1
                                                    ? "opacity-30 cursor-not-allowed pointer-events-none border-white/5 bg-white/5 text-gray-500"
                                                    : "border-white/10 bg-white/5 hover:bg-white/10 hover:text-white hover:border-white/20"
                                            }`}
                                            title="Previous Page"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>

                                        {/* Page Numbers */}
                                        {(() => {
                                            const pages = [];
                                            const range = 1;
                                            for (let i = 1; i <= totalPages; i++) {
                                                if (i === 1 || i === totalPages || (i >= currentPage - range && i <= currentPage + range)) {
                                                    pages.push(i);
                                                } else if (pages[pages.length - 1] !== "...") {
                                                    pages.push("...");
                                                }
                                            }

                                            return pages.map((page, idx) => {
                                                if (page === "...") {
                                                    return (
                                                        <span key={`ellip-${idx}`} className="px-2 text-gray-600 text-xs font-semibold select-none">
                                                            ...
                                                        </span>
                                                    );
                                                }

                                                const isActive = page === currentPage;
                                                return (
                                                    <button
                                                        key={`page-${page}`}
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 hover:scale-105 active:scale-95 ${
                                                            isActive
                                                                ? "border-brand-500 bg-brand-500/10 text-brand-500 shadow-[0_0_12px_rgba(251,191,36,0.15)]"
                                                                : "border-white/5 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/10"
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            });
                                        })()}

                                        {/* Next Button */}
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className={`p-2 rounded-lg border text-gray-300 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center shrink-0 ${
                                                currentPage === totalPages
                                                    ? "opacity-30 cursor-not-allowed pointer-events-none border-white/5 bg-white/5 text-gray-500"
                                                    : "border-white/10 bg-white/5 hover:bg-white/10 hover:text-white hover:border-white/20"
                                            }`}
                                            title="Next Page"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Sliding Drawer for Student Profile Details */}
            {selectedStudent && (
                <div className="fixed inset-0 z-40 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-300">
                    {/* Back drop click handler */}
                    <div className="flex-1" onClick={() => setSelectedStudent(null)} />
                    
                    {/* Drawer container */}
                    <div className="w-full max-w-xl bg-zinc-950 border-l border-white/10 h-full overflow-y-auto flex flex-col p-6 relative">
                        {/* Drawer Header */}
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
                            <div>
                                <h3 className="text-lg font-bold text-white">{selectedStudent.name}</h3>
                                <span className="text-xs text-gray-400">Student ID: {selectedStudent.studentId}</span>
                            </div>
                            <button
                                onClick={() => setSelectedStudent(null)}
                                className="p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Profile Info Sections */}
                        <div className="flex-1 space-y-6">
                            
                            {/* Section 1: Personal Profile */}
                            <div className="space-y-3">
                                <h4 className="text-xs uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1.5">
                                    <User className="h-3.5 w-3.5" /> Personal Information
                                </h4>
                                <div className="grid grid-cols-2 gap-4 bg-zinc-900/40 border border-white/5 rounded-xl p-4 text-xs">
                                    <div>
                                        <span className="text-gray-400 block mb-0.5">Username</span>
                                        <span className="text-gray-200 font-semibold">@{selectedStudent.username}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block mb-0.5">Email Address</span>
                                        <span className="text-gray-200 font-semibold">{selectedStudent.email}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block mb-0.5">Gender / Age</span>
                                        <span className="text-gray-200 font-semibold">{selectedStudent.gender} • {selectedStudent.age} y/o</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block mb-0.5">Birthday</span>
                                        <span className="text-gray-200 font-semibold">{selectedStudent.birthday || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block mb-0.5">Contact Number</span>
                                        <span className="text-gray-200 font-semibold">{selectedStudent.contact_number}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block mb-0.5">Facebook Link</span>
                                        <a 
                                            href={selectedStudent.facebook_link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-brand-500 font-semibold hover:underline inline-flex items-center gap-1"
                                        >
                                            View Profile <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Academic Profile */}
                            <div className="space-y-3">
                                <h4 className="text-xs uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1.5">
                                    <Landmark className="h-3.5 w-3.5" /> Academic Profile
                                </h4>
                                <div className="grid grid-cols-2 gap-4 bg-zinc-900/40 border border-white/5 rounded-xl p-4 text-xs">
                                    <div>
                                        <span className="text-gray-400 block mb-0.5">School / University</span>
                                        <span className="text-gray-200 font-semibold block truncate">{selectedStudent.university}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block mb-0.5">Course / Track</span>
                                        <span className="text-gray-200 font-semibold block truncate">{selectedStudent.course}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block mb-0.5">Year Level</span>
                                        <span className="text-gray-200 font-semibold">{selectedStudent.year_level}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block mb-0.5">Location</span>
                                        <span className="text-gray-200 font-semibold">{selectedStudent.island} / {selectedStudent.region}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: MLBB Game Profile */}
                            <div className="space-y-3">
                                <h4 className="text-xs uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1.5">
                                    <Gamepad2 className="h-3.5 w-3.5" /> Mobile Legends Profile
                                </h4>
                                <div className="grid grid-cols-2 gap-4 bg-zinc-900/40 border border-white/5 rounded-xl p-4 text-xs">
                                    <div>
                                        <span className="text-gray-400 block mb-0.5">In-Game Name (IGN)</span>
                                        <span className="text-gray-200 font-semibold">{selectedStudent.ml_ign}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block mb-0.5">User ID & Server ID</span>
                                        <span className="text-gray-200 font-semibold">{selectedStudent.ml_id} ({selectedStudent.ml_server})</span>
                                    </div>
                                    <div>
                                         <span className="text-gray-400 block mb-0.5">Competitive Rank / Role</span>
                                         <span className="text-gray-200 font-semibold">
                                             {selectedStudent.ml_rank || (selectedStudent.ml_rank_level ? String(selectedStudent.ml_rank_level) : 'Mythic')} • {selectedStudent.inGameRole}
                                         </span>
                                     </div>
                                     <div>
                                         <span className="text-gray-400 block mb-0.5">MLBB Account Level</span>
                                         <span className="text-gray-200 font-semibold">
                                             {selectedStudent.ml_level ? `Lv. ${selectedStudent.ml_level}` : 'N/A'}
                                         </span>
                                     </div>
                                    <div>
                                        <span className="text-gray-400 block mb-0.5">Main Hero</span>
                                        <span className="text-gray-200 font-semibold">{selectedStudent.mainHero}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block mb-0.5">Squad Name / Tag</span>
                                        <span className="text-gray-200 font-semibold">{selectedStudent.squadName || 'N/A'} ({selectedStudent.squadAbbreviation || 'N/A'})</span>
                                    </div>
                                </div>
                            </div>

                            {/* Section 4: Proof of Enrollment File View */}
                            <div className="space-y-3">
                                <h4 className="text-xs uppercase font-bold text-gray-500 tracking-wider flex items-center gap-1.5">
                                    <FileText className="h-3.5 w-3.5" /> Proof of Enrollment
                                </h4>
                                <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-4">
                                    {selectedStudent.proofOfEnrollment ? (
                                        <div className="space-y-3">
                                            <a 
                                                href={`/${selectedStudent.proofOfEnrollment}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-brand-500 font-semibold text-xs hover:underline flex items-center gap-1 mb-2"
                                            >
                                                Open Document in New Tab <ExternalLink className="h-3 w-3" />
                                            </a>
                                            {selectedStudent.proofOfEnrollment.toLowerCase().endsWith(".pdf") ? (
                                                <div className="h-[200px] border border-white/5 rounded-lg flex items-center justify-center text-xs text-gray-500 bg-zinc-900">
                                                    📄 PDF File Uploaded
                                                </div>
                                            ) : (
                                                <img 
                                                    src={`/${selectedStudent.proofOfEnrollment}`} 
                                                    alt="Proof Document"
                                                    className="w-full h-auto max-h-[280px] object-contain rounded-lg border border-white/5 bg-black"
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-red-500">No enrollment proof uploaded.</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Rejection Details History if rejected */}
                        {selectedStudent.status === 'rejected' && selectedStudent.rejection_reason && (
                            <div className="mb-6 p-4 bg-red-950/20 border border-red-500/20 rounded-xl space-y-2">
                                <span className="text-xs text-red-400 font-bold block">Previous Rejection Log:</span>
                                <p className="text-xs text-gray-300 italic">"{selectedStudent.rejection_reason}"</p>
                            </div>
                        )}

                        {/* Action Buttons Footer */}
                        {selectedStudent.status !== 'active' && (hasPermission('reject_students') || hasPermission('approve_students')) && (
                            <div className="flex gap-4 pt-4 border-t border-white/5 bg-zinc-950 mt-auto sticky bottom-0">
                                {hasPermission('reject_students') && (
                                    <button
                                        onClick={() => setRejectModalOpen(true)}
                                        className="flex-1 py-3 rounded-lg border border-red-500/20 hover:border-red-500/50 bg-red-950/10 hover:bg-red-950/30 text-red-400 text-sm font-bold transition-all uppercase tracking-wider"
                                    >
                                        Reject Application
                                    </button>
                                )}
                                {hasPermission('approve_students') && (
                                    <button
                                        onClick={() => handleApprove(selectedStudent.id)}
                                        className="flex-1 py-3 rounded-lg !bg-[#16a34a] hover:!bg-[#15803d] !text-white text-sm font-bold transition-all uppercase tracking-wider !border-transparent shadow-[0_0_15px_rgba(22,197,94,0.35)] hover:shadow-[0_0_25px_rgba(22,197,94,0.55)]"
                                        style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
                                    >
                                        Approve Account
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Rejection Checklist & Detail Input Modal */}
            {rejectModalOpen && selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-2xl p-6 relative shadow-2xl">
                        <div className="absolute top-0 left-0 w-[4px] h-full bg-red-500" />
                        
                        <div className="flex justify-between items-center mb-5 pb-3 border-b border-white/5">
                            <h3 className="text-lg font-bold text-red-500 flex items-center gap-2">
                                <ShieldAlert className="h-5 w-5" /> Reject Registration
                            </h3>
                            <button
                                onClick={() => setRejectModalOpen(false)}
                                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleRejectSubmit} className="space-y-5">
                            {/* Checklist selectors */}
                            <div className="space-y-3">
                                <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                                    Flag Invalid Fields
                                </label>
                                <div className="space-y-2.5">
                                    <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-300 hover:text-white select-none">
                                        <input
                                            type="checkbox"
                                            checked={rejectionChecklist.invalid_document}
                                            onChange={() => toggleChecklistItem("invalid_document")}
                                            className="rounded bg-zinc-900 border-white/10 text-red-600 focus:ring-0 focus:ring-offset-0"
                                        />
                                        Invalid Proof of Enrollment document
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-300 hover:text-white select-none">
                                        <input
                                            type="checkbox"
                                            checked={rejectionChecklist.invalid_age}
                                            onChange={() => toggleChecklistItem("invalid_age")}
                                            className="rounded bg-zinc-900 border-white/10 text-red-600 focus:ring-0 focus:ring-offset-0"
                                        />
                                        Incorrect / Underage birth details
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-300 hover:text-white select-none">
                                        <input
                                            type="checkbox"
                                            checked={rejectionChecklist.invalid_info}
                                            onChange={() => toggleChecklistItem("invalid_info")}
                                            className="rounded bg-zinc-900 border-white/10 text-red-600 focus:ring-0 focus:ring-offset-0"
                                        />
                                        Mismatched/Incorrect profile info
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-300 hover:text-white select-none">
                                        <input
                                            type="checkbox"
                                            checked={rejectionChecklist.other}
                                            onChange={() => toggleChecklistItem("other")}
                                            className="rounded bg-zinc-900 border-white/10 text-red-600 focus:ring-0 focus:ring-offset-0"
                                        />
                                        Other concerns
                                    </label>
                                </div>
                            </div>

                            {/* Reason details input */}
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                                    Rejection Feedback / Notes
                                </label>
                                <textarea
                                    required
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="Explain why the registration is rejected. The student will read this feedback and be able to correct it..."
                                    rows="4"
                                    className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors placeholder:text-gray-600 resize-none"
                                />
                            </div>

                            {/* Action panel */}
                            <div className="flex gap-3 pt-3 border-t border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setRejectModalOpen(false)}
                                    className="flex-1 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 text-sm font-semibold text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-all uppercase tracking-wider"
                                >
                                    Confirm Reject
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast.show && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast(prev => ({ ...prev, show: false }))} 
                />
            )}

            {/* Action Confirmation Modal */}
            <ConfirmModal 
                isOpen={confirmDialog.isOpen}
                title={confirmDialog.title}
                message={confirmDialog.message}
                onConfirm={confirmDialog.onConfirm}
                onCancel={confirmDialog.onCancel}
                confirmText="Approve"
                cancelText="Cancel"
            />

            {/* Footer */}
            <footer className="w-full py-6 text-center text-xs text-zinc-600 z-10 border-t border-white/5 mt-8">
                © {new Date().getFullYear()} Moonton Student Leader Philippines. All rights reserved.
            </footer>
        </div>
    );
}
