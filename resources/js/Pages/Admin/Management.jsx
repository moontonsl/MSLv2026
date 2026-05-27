import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import Toast from "./components/Toast";
import { 
    Swords, LogOut, ArrowLeft, Shield, ShieldCheck, ShieldAlert,
    User, Mail, Check, X, Settings, HelpCircle, Save, Crown
} from "lucide-react";

export default function AdminManagement({ auth, adminUsers, allPermissions }) {
    const [editingUser, setEditingUser] = useState(null);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
    };

    // Group permissions by type
    const actionPermissions = allPermissions.filter(p => p.type === "action");
    const pagePermissions = allPermissions.filter(p => p.type === "page");

    const handleOpenEdit = (user) => {
        if (user.user_type === "Super Admin") return; // Super Admin cannot be edited
        setEditingUser(user);
        setSelectedPermissions(user.permissions.map(p => p.id));
    };

    const handleCloseEdit = () => {
        setEditingUser(null);
        setSelectedPermissions([]);
    };

    const handleTogglePermission = (permissionId) => {
        setSelectedPermissions(prev => 
            prev.includes(permissionId)
                ? prev.filter(id => id !== permissionId)
                : [...prev, permissionId]
        );
    };

    const handleSavePermissions = (e) => {
        e.preventDefault();
        if (!editingUser) return;

        setIsSaving(true);
        router.post(route('admin.users.permissions.update', editingUser.id), {
            permissions: selectedPermissions
        }, {
            onSuccess: () => {
                setIsSaving(false);
                handleCloseEdit();
                showToast("Permissions updated successfully.", "success");
            },
            onError: (errors) => {
                setIsSaving(false);
                showToast(errors.message || "Failed to update permissions.", "error");
            }
        });
    };

    const getUserTypeBadge = (type) => {
        switch(type) {
            case 'Super Admin':
                return 'border-brand-500 bg-brand-500/10 text-brand-500 shadow-[0_0_12px_rgba(251,191,36,0.15)]';
            case 'Regional Admin':
                return 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400';
            case 'Student Leader':
                return 'border-blue-500/40 bg-blue-950/20 text-blue-400';
            default:
                return 'border-zinc-700 bg-zinc-900 text-zinc-400';
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans flex flex-col justify-between relative overflow-hidden">
            <Head>
                <title>Moonton SLPH Admin Permissions</title>
                <meta name="description" content="Manage admin account permissions, access rules, and capabilities." />
            </Head>
            
            {/* Background glowing effects */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none" />

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
                    <Link
                        href={route('admin.dashboard')}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-sm font-medium text-gray-300 hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Link>
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
            <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 z-10">
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold font-display tracking-tight text-white flex items-center gap-2">
                            <Settings className="h-6 w-6 text-brand-500" /> Admin Permissions Manager
                        </h1>
                        <p className="text-sm text-gray-400 mt-1">Configure capability access and restricted action overrides for admin accounts.</p>
                    </div>
                </div>

                {/* Users List Card-Table */}
                <div className="bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-900/60 border-b border-white/10 text-xs font-bold uppercase tracking-wider text-gray-400">
                                    <th className="py-4 px-6">Administrator Name</th>
                                    <th className="py-4 px-6">Role / Type</th>
                                    <th className="py-4 px-6">Active Capabilities</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                                {adminUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                        {/* Profile details */}
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full border border-white/10 bg-zinc-900 flex items-center justify-center shrink-0">
                                                    <User className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-white group-hover:text-brand-500 transition-colors">
                                                        {user.name}
                                                    </span>
                                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                                        <Mail className="h-3 w-3" /> {user.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* User Type */}
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold border ${getUserTypeBadge(user.user_type)}`}>
                                                {user.user_type === 'Super Admin' && <Crown className="h-3 w-3" />}
                                                {user.user_type === 'Regional Admin' && <Shield className="h-3 w-3" />}
                                                {user.user_type}
                                            </span>
                                        </td>

                                        {/* Allowed Permissions Badges */}
                                        <td className="py-4 px-6">
                                            {user.user_type === 'Super Admin' ? (
                                                <span className="text-xs text-brand-500 font-semibold tracking-wide uppercase bg-brand-500/5 px-2 py-0.5 rounded border border-brand-500/20">
                                                    Full Access (All Permissions)
                                                </span>
                                            ) : user.permissions.length === 0 ? (
                                                <span className="text-xs text-gray-500 italic">No custom permissions assigned</span>
                                            ) : (
                                                <div className="flex flex-wrap gap-1.5 max-w-md">
                                                    {user.permissions.map(p => (
                                                        <span 
                                                            key={p.id}
                                                            className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                                                                p.type === 'page' 
                                                                    ? 'bg-blue-950/20 border-blue-900/40 text-blue-400' 
                                                                    : 'bg-emerald-950/20 border-emerald-900/40 text-emerald-400'
                                                            }`}
                                                        >
                                                            {p.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="py-4 px-6 text-right">
                                            {user.user_type === 'Super Admin' ? (
                                                <span className="text-xs text-zinc-600 font-semibold select-none">Unmodifiable</span>
                                            ) : (
                                                <button
                                                    onClick={() => handleOpenEdit(user)}
                                                    className="px-3.5 py-1.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-all hover:scale-105 active:scale-95"
                                                >
                                                    Configure Access
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Sliding Drawer Configuration Panel */}
            {editingUser && (
                <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-opacity duration-300">
                    <div className="flex-1" onClick={handleCloseEdit} />
                    
                    <div className="w-full max-w-xl bg-zinc-950 border-l border-white/10 h-full overflow-y-auto flex flex-col p-6 relative">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
                            <div>
                                <h3 className="text-lg font-bold text-white">Configure User Access</h3>
                                <span className="text-xs text-gray-400">Setting custom capabilities for {editingUser.name}</span>
                            </div>
                            <button
                                onClick={handleCloseEdit}
                                className="p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSavePermissions} className="flex-1 flex flex-col justify-between">
                            <div className="space-y-6">
                                {/* Actions Section */}
                                <div className="space-y-3">
                                    <h4 className="text-xs uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1.5">
                                        <ShieldCheck className="h-4 w-4" /> Allowed Actions
                                    </h4>
                                    <p className="text-xs text-gray-500">Authorize specific write operations on student registration records.</p>
                                    
                                    <div className="grid grid-cols-1 gap-2">
                                        {actionPermissions.map(p => (
                                            <label 
                                                key={p.id}
                                                className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                                                    selectedPermissions.includes(p.id)
                                                        ? 'bg-emerald-950/10 border-emerald-500/30 text-white'
                                                        : 'bg-zinc-900/20 border-white/5 text-gray-400 hover:border-white/10'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPermissions.includes(p.id)}
                                                    onChange={() => handleTogglePermission(p.id)}
                                                    className="mt-0.5 rounded border-white/20 bg-zinc-900 text-emerald-500 focus:ring-emerald-500"
                                                />
                                                <div className="flex flex-col text-xs">
                                                    <span className="font-bold text-sm text-white">{p.name}</span>
                                                    <span className="text-gray-400 mt-0.5">{p.description}</span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Page Access Section */}
                                <div className="space-y-3">
                                    <h4 className="text-xs uppercase font-bold text-blue-400 tracking-wider flex items-center gap-1.5">
                                        <ShieldAlert className="h-4 w-4" /> Page & Menu Access
                                    </h4>
                                    <p className="text-xs text-gray-500">Authorize user access to specific navigation screens and menu options.</p>
                                    
                                    <div className="grid grid-cols-1 gap-2">
                                        {pagePermissions.map(p => (
                                            <label 
                                                key={p.id}
                                                className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                                                    selectedPermissions.includes(p.id)
                                                        ? 'bg-blue-950/10 border-blue-500/30 text-white'
                                                        : 'bg-zinc-900/20 border-white/5 text-gray-400 hover:border-white/10'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPermissions.includes(p.id)}
                                                    onChange={() => handleTogglePermission(p.id)}
                                                    className="mt-0.5 rounded border-white/20 bg-zinc-900 text-blue-500 focus:ring-blue-500"
                                                />
                                                <div className="flex flex-col text-xs">
                                                    <span className="font-bold text-sm text-white">{p.name}</span>
                                                    <span className="text-gray-400 mt-0.5">{p.description}</span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Footer Submit Buttons */}
                            <div className="border-t border-white/5 pt-4 mt-8 flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleCloseEdit}
                                    className="flex-1 bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-gray-400 hover:text-white text-xs font-bold py-3 rounded-xl transition-all uppercase tracking-wider"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 bg-brand-500 hover:bg-brand-600 text-black text-xs font-bold py-3 rounded-xl transition-all uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(251,191,36,0.15)] disabled:opacity-50"
                                >
                                    <Save className="h-4 w-4" />
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Simple Footer */}
            <footer className="w-full bg-zinc-950 border-t border-white/5 px-6 py-4 flex justify-between items-center z-10 text-[11px] text-gray-600">
                <span>© 2026 MOONTON Student Leader Philippines. All rights reserved.</span>
                <span className="flex items-center gap-1"><HelpCircle className="h-3 w-3" /> Security Access logs active</span>
            </footer>

            {/* Toast Notification */}
            {toast.show && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast(prev => ({ ...prev, show: false }))} 
                />
            )}
        </div>
    );
}
