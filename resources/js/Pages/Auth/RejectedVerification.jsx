import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { ShieldAlert, LogOut, ArrowRight, Upload, CheckCircle2, AlertTriangle, User, GraduationCap, Trophy, HelpCircle } from "lucide-react";

export default function RejectedVerification({ rejectionReason, rejectionChecklist, userData }) {
    const [activeTab, setActiveTab] = useState("basic");
    const [previewUrl, setPreviewUrl] = useState(userData.proofOfEnrollment ? `/${userData.proofOfEnrollment}` : null);

    // Prepare initial data from existing user properties
    // Format birthday from YYYY-MM-DD back to MM/DD/YYYY for the regex validation
    let formattedBirthday = "";
    if (userData.birthday) {
        const parts = userData.birthday.split("-");
        if (parts.length === 3) {
            formattedBirthday = `${parts[1]}/${parts[2]}/${parts[0]}`; // MM/DD/YYYY
        }
    }

    const { data, setData, post, processing, errors } = useForm({
        firstName: userData.first_name || "",
        lastName: userData.surname || "",
        suffix: userData.suffix || "N/A",
        gender: userData.gender || "",
        birthday: formattedBirthday,
        age: userData.age || 0,
        contactNo: userData.contact_number || "",
        facebookLink: userData.facebook_link || "",

        yearLevel: userData.year_level || "",
        university: userData.university || "",
        island: userData.island || "",
        region: userData.region || "",
        studentId: userData.studentId || "",
        course: userData.course || "",
        proofOfEnrollment: null, // Keep null unless uploaded

        userId: userData.ml_id || "",
        serverId: userData.ml_server || "",
        ign: userData.ml_ign || "",
        squadName: userData.squadName || "",
        squadAbbreviation: userData.squadAbbreviation || "",
        rank: userData.ml_rank || (userData.ml_rank_level ? String(userData.ml_rank_level) : "Mythic"),
        inGameRole: userData.inGameRole || "",
        mainHero: userData.mainHero || "",

        username: userData.username || "",
        email: userData.email || "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("proofOfEnrollment", file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("reapply"));
    };

    const checklistLabels = {
        invalid_document: "Invalid Proof of Enrollment",
        invalid_age: "Invalid Age Details",
        invalid_info: "Incorrect or Missing User Info",
        other: "Other Issues"
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.05)_0%,transparent_70%)]" />
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent" />

            {/* Header */}
            <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                    <ShieldAlert className="h-8 w-8 text-red-500 animate-pulse" />
                    <span className="font-display font-extrabold text-xl tracking-wider text-white">
                        MOONTON <span className="text-red-500">SLPH</span>
                    </span>
                </div>
                
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-sm font-medium text-gray-300 hover:text-white"
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </Link>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-4xl w-full mx-auto p-6 z-10">
                {/* Rejection Notice Banner */}
                <div className="bg-zinc-950 border border-red-500/20 rounded-2xl p-6 md:p-8 mb-8 relative shadow-2xl overflow-hidden">
                    <div className="absolute top-0 left-0 w-[4px] h-full bg-red-500" />
                    
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20 text-red-500 shrink-0">
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                        <div className="space-y-3">
                            <h2 className="text-xl font-bold text-red-500">Registration Rejected</h2>
                            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                                Your student registration could not be verified by the admin team. Please review the reasons below, correct the necessary fields in the form, and resubmit.
                            </p>
                            
                            {/* Checklist Flags */}
                            {rejectionChecklist && Object.keys(rejectionChecklist).length > 0 && (
                                <div className="pt-2">
                                    <span className="text-xs uppercase font-bold text-gray-500 tracking-wider block mb-2">Identified Issues</span>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(rejectionChecklist).map(([key, val]) => {
                                            if (!val) return null;
                                            return (
                                                <span key={key} className="px-3 py-1 text-xs font-semibold rounded-full bg-red-950/40 border border-red-900/60 text-red-400">
                                                    ⚠️ {checklistLabels[key] || key}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Custom Reason Text */}
                            {rejectionReason && (
                                <div className="bg-zinc-900 border border-white/5 rounded-xl p-4 mt-3">
                                    <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold block mb-1">Feedback from Admin</span>
                                    <p className="text-sm text-gray-300 italic">"{rejectionReason}"</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Re-application Form */}
                <form onSubmit={handleSubmit} className="bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
                    {/* Corner accents */}
                    <div className="absolute top-0 right-0 w-[40px] h-[40px] border-t-2 border-r-2 border-red-500/30 rounded-tr-2xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[40px] h-[40px] border-b-2 border-l-2 border-red-500/30 rounded-bl-2xl pointer-events-none" />

                    {/* Tabs navigation */}
                    <div className="flex border-b border-white/5 bg-zinc-900/50">
                        <button
                            type="button"
                            onClick={() => setActiveTab("basic")}
                            className={`flex-1 py-4 px-3 flex items-center justify-center gap-2 text-sm font-semibold border-b-2 transition-all ${
                                activeTab === "basic" 
                                    ? "border-red-500 text-red-500 bg-red-500/5" 
                                    : "border-transparent text-gray-400 hover:text-white"
                            }`}
                        >
                            <User className="h-4 w-4" />
                            Personal
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("academic")}
                            className={`flex-1 py-4 px-3 flex items-center justify-center gap-2 text-sm font-semibold border-b-2 transition-all ${
                                activeTab === "academic" 
                                    ? "border-red-500 text-red-500 bg-red-500/5" 
                                    : "border-transparent text-gray-400 hover:text-white"
                            } ${rejectionChecklist?.invalid_document ? "text-red-400 animate-pulse" : ""}`}
                        >
                            <GraduationCap className="h-4 w-4" />
                            Academic {rejectionChecklist?.invalid_document && "(!)"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("game")}
                            className={`flex-1 py-4 px-3 flex items-center justify-center gap-2 text-sm font-semibold border-b-2 transition-all ${
                                activeTab === "game" 
                                    ? "border-red-500 text-red-500 bg-red-500/5" 
                                    : "border-transparent text-gray-400 hover:text-white"
                            }`}
                        >
                            <Trophy className="h-4 w-4" />
                            Game
                        </button>
                    </div>

                    {/* Tab contents */}
                    <div className="p-6 md:p-8">
                        {/* TAB 1: BASIC DETAILS */}
                        {activeTab === "basic" && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-gray-300 mb-4 flex items-center gap-2">
                                    Personal Profile
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={data.firstName}
                                            onChange={handleInputChange}
                                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                                        />
                                        {errors.firstName && <span className="text-xs text-red-500 mt-1 block">{errors.firstName}</span>}
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={data.lastName}
                                            onChange={handleInputChange}
                                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                                        />
                                        {errors.lastName && <span className="text-xs text-red-500 mt-1 block">{errors.lastName}</span>}
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Suffix</label>
                                        <input
                                            type="text"
                                            name="suffix"
                                            value={data.suffix}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Jr, III, N/A"
                                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Gender</label>
                                        <select
                                            name="gender"
                                            value={data.gender}
                                            onChange={handleInputChange}
                                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Birthday (MM/DD/YYYY)</label>
                                        <input
                                            type="text"
                                            name="birthday"
                                            value={data.birthday}
                                            onChange={handleInputChange}
                                            placeholder="e.g. 10/24/2005"
                                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                                        />
                                        {errors.birthday && <span className="text-xs text-red-500 mt-1 block">{errors.birthday}</span>}
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Age</label>
                                        <input
                                            type="number"
                                            name="age"
                                            value={data.age}
                                            onChange={handleInputChange}
                                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                                        />
                                        {errors.age && <span className="text-xs text-red-500 mt-1 block">{errors.age}</span>}
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Contact Number</label>
                                        <input
                                            type="text"
                                            name="contactNo"
                                            value={data.contactNo}
                                            onChange={handleInputChange}
                                            placeholder="09XXXXXXXXX"
                                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                                        />
                                        {errors.contactNo && <span className="text-xs text-red-500 mt-1 block">{errors.contactNo}</span>}
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Facebook Profile Link</label>
                                        <input
                                            type="text"
                                            name="facebookLink"
                                            value={data.facebookLink}
                                            onChange={handleInputChange}
                                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                                        />
                                        {errors.facebookLink && <span className="text-xs text-red-500 mt-1 block">{errors.facebookLink}</span>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 2: ACADEMIC DETAILS */}
                        {activeTab === "academic" && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-gray-300 mb-4">
                                    Academic Information & Enrollment Proof
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">School / University</label>
                                        <input
                                            type="text"
                                            name="university"
                                            value={data.university}
                                            onChange={handleInputChange}
                                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                                        />
                                        {errors.university && <span className="text-xs text-red-500 mt-1 block">{errors.university}</span>}
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Year Level</label>
                                        <input
                                            type="text"
                                            name="yearLevel"
                                            value={data.yearLevel}
                                            onChange={handleInputChange}
                                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                                        />
                                        {errors.yearLevel && <span className="text-xs text-red-500 mt-1 block">{errors.yearLevel}</span>}
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Student ID Number</label>
                                        <input
                                            type="text"
                                            name="studentId"
                                            value={data.studentId}
                                            onChange={handleInputChange}
                                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                                        />
                                        {errors.studentId && <span className="text-xs text-red-500 mt-1 block">{errors.studentId}</span>}
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Course / Track</label>
                                        <input
                                            type="text"
                                            name="course"
                                            value={data.course}
                                            onChange={handleInputChange}
                                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                                        />
                                        {errors.course && <span className="text-xs text-red-500 mt-1 block">{errors.course}</span>}
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Island Group</label>
                                        <select
                                            name="island"
                                            value={data.island}
                                            onChange={handleInputChange}
                                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                                        >
                                            <option value="">Select Island</option>
                                            <option value="Luzon">Luzon</option>
                                            <option value="Visayas">Visayas</option>
                                            <option value="Mindanao">Mindanao</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Region</label>
                                        <input
                                            type="text"
                                            name="region"
                                            value={data.region}
                                            onChange={handleInputChange}
                                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Proof of Enrollment Upload */}
                                <div className={`pt-4 border-t border-white/5 ${rejectionChecklist?.invalid_document ? "p-4 bg-red-950/10 rounded-xl border border-red-500/20" : ""}`}>
                                    <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2 flex items-center gap-1.5">
                                        Proof of Enrollment Document 
                                        {rejectionChecklist?.invalid_document && <span className="text-red-500 text-xs font-bold font-sans">(Required Update)</span>}
                                    </label>
                                    <p className="text-xs text-gray-500 mb-4">
                                        Upload a valid Certificate of Registration, Student ID card, or official enrollment document (JPG, PNG, PDF max 5MB).
                                    </p>

                                    <div className="flex flex-col md:flex-row gap-5 items-start">
                                        <div className="relative flex-1 w-full">
                                            <input
                                                type="file"
                                                id="proofOfEnrollment"
                                                onChange={handleFileChange}
                                                accept="image/*,.pdf"
                                                className="hidden"
                                            />
                                            <label
                                                htmlFor="proofOfEnrollment"
                                                className="flex flex-col items-center justify-center border-2 border-dashed border-white/15 hover:border-red-500/50 bg-zinc-900/50 hover:bg-zinc-900 rounded-xl p-6 text-center cursor-pointer transition-all duration-300 min-h-[160px]"
                                            >
                                                <Upload className="h-8 w-8 text-gray-500 mb-2" />
                                                <span className="text-sm font-semibold block text-gray-300">
                                                    {data.proofOfEnrollment ? data.proofOfEnrollment.name : "Choose file to upload"}
                                                </span>
                                                <span className="text-xs text-gray-500 mt-1">or drag & drop here</span>
                                            </label>
                                            {errors.proofOfEnrollment && <span className="text-xs text-red-500 mt-1 block">{errors.proofOfEnrollment}</span>}
                                        </div>

                                        {previewUrl && (
                                            <div className="w-full md:w-[220px] bg-zinc-900 border border-white/10 rounded-xl p-3 text-center shrink-0">
                                                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold block mb-2">Current Upload Preview</span>
                                                {previewUrl.toLowerCase().endsWith(".pdf") ? (
                                                    <div className="h-[120px] bg-zinc-800 rounded-lg flex items-center justify-center text-xs text-gray-400 border border-white/5">
                                                        📄 PDF Document
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={previewUrl}
                                                        alt="Proof Preview"
                                                        className="h-[120px] w-full object-cover rounded-lg border border-white/5 bg-black"
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 3: GAME DETAILS */}
                        {activeTab === "game" && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-gray-300 mb-4">
                                    Mobile Legends: Bang Bang & Team details
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">MLBB Account ID (Verified)</label>
                                        <input
                                            type="text"
                                            name="userId"
                                            value={data.userId}
                                            disabled={true}
                                            className="w-full bg-zinc-900/50 border border-white/5 rounded-xl px-4 py-3 text-gray-400 cursor-not-allowed outline-none"
                                        />
                                        {errors.userId && <span className="text-xs text-red-500 mt-1 block">{errors.userId}</span>}
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Server ID (Verified)</label>
                                        <input
                                            type="text"
                                            name="serverId"
                                            value={data.serverId}
                                            disabled={true}
                                            className="w-full bg-zinc-900/50 border border-white/5 rounded-xl px-4 py-3 text-gray-400 cursor-not-allowed outline-none"
                                        />
                                        {errors.serverId && <span className="text-xs text-red-500 mt-1 block">{errors.serverId}</span>}
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">In-Game Name (IGN) (Verified)</label>
                                        <input
                                            type="text"
                                            name="ign"
                                            value={data.ign}
                                            disabled={true}
                                            className="w-full bg-zinc-900/50 border border-white/5 rounded-xl px-4 py-3 text-gray-400 cursor-not-allowed outline-none"
                                        />
                                        {errors.ign && <span className="text-xs text-red-500 mt-1 block">{errors.ign}</span>}
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Current Highest Rank</label>
                                        <input
                                            type="text"
                                            name="rank"
                                            value={data.rank}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Mythical Glory"
                                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">In-Game Primary Role</label>
                                        <select
                                            name="inGameRole"
                                            value={data.inGameRole}
                                            onChange={handleInputChange}
                                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                                        >
                                            <option value="">Select Role</option>
                                            <option value="Jungler">Jungler</option>
                                            <option value="Gold Laner">Gold Laner</option>
                                            <option value="Exp Laner">Exp Laner</option>
                                            <option value="Mid Laner">Mid Laner</option>
                                            <option value="Roamer">Roamer</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Main Hero</label>
                                        <input
                                            type="text"
                                            name="mainHero"
                                            value={data.mainHero}
                                            onChange={handleInputChange}
                                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Squad Name (Optional)</label>
                                        <input
                                            type="text"
                                            name="squadName"
                                            value={data.squadName}
                                            onChange={handleInputChange}
                                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Squad Abbrev (Optional)</label>
                                        <input
                                            type="text"
                                            name="squadAbbreviation"
                                            value={data.squadAbbreviation}
                                            onChange={handleInputChange}
                                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Form Action Bar */}
                    <div className="bg-zinc-900/60 border-t border-white/5 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex gap-2">
                            {activeTab !== "basic" && (
                                <button
                                    type="button"
                                    onClick={() => setActiveTab(activeTab === "game" ? "academic" : "basic")}
                                    className="px-5 py-2.5 rounded-lg border border-white/10 text-sm font-semibold hover:bg-white/5 transition-colors"
                                >
                                    Back
                                </button>
                            )}
                            {activeTab !== "game" && (
                                <button
                                    type="button"
                                    onClick={() => setActiveTab(activeTab === "basic" ? "academic" : "game")}
                                    className="px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 text-sm font-semibold flex items-center gap-1.5 hover:bg-white/10 transition-colors"
                                >
                                    Next Tab
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full md:w-auto px-8 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {processing ? "Submitting Application..." : "Submit Re-application"}
                        </button>
                    </div>
                </form>
            </main>

            {/* Footer */}
            <footer className="w-full py-6 text-center text-xs text-zinc-600 z-10 border-t border-white/5 mt-8">
                © {new Date().getFullYear()} Moonton Student Leader Philippines. All rights reserved.
            </footer>
        </div>
    );
}
