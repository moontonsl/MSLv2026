import React from "react";
import { Head, useForm, router } from "@inertiajs/react";
import { KeyRound, ShieldAlert, Swords, Power, LogOut, CheckCircle, XCircle } from "lucide-react";

export default function BypassGate({ isAuthenticated, mlbbBypass, success, error }) {
    // Form for password login
    const loginForm = useForm({
        password: "",
    });

    const handleLogin = (e) => {
        e.preventDefault();
        loginForm.post(route("bypass.gate.login"), {
            onFinish: () => loginForm.reset("password"),
        });
    };

    const handleToggle = (enabled) => {
        router.post(route("bypass.gate.toggle"), {
            enabled: enabled ? 1 : 0,
        });
    };

    const handleLogout = () => {
        router.post(route("bypass.gate.logout"));
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans flex flex-col justify-between relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.05)_0%,transparent_70%)]" />
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />

            {/* Header */}
            <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                    <Swords className="h-8 w-8 text-yellow-500 animate-pulse" />
                    <span className="font-display font-extrabold text-xl tracking-wider text-white">
                        MOONTON <span className="text-yellow-500">SLPH</span>
                    </span>
                </div>

                {isAuthenticated && (
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-sm font-medium text-gray-300 hover:text-white"
                    >
                        <LogOut className="h-4 w-4" />
                        Lock Gate
                    </button>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-6 z-10">
                <div className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-2xl p-8 relative shadow-2xl">
                    <div className="absolute -top-[1px] -left-[1px] w-[50px] h-[50px] border-t-2 border-l-2 border-yellow-500 rounded-tl-2xl" />
                    <div className="absolute -bottom-[1px] -right-[1px] w-[50px] h-[50px] border-b-2 border-r-2 border-yellow-500 rounded-br-2xl" />

                    {!isAuthenticated ? (
                        /* PASSWORD SCREEN */
                        <form onSubmit={handleLogin} className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center mb-6">
                                <KeyRound className="h-8 w-8 text-yellow-500" />
                            </div>

                            <h2 className="text-2xl font-bold tracking-tight mb-2 text-center">
                                Bypass Gate Access
                            </h2>
                            <p className="text-gray-400 text-sm text-center mb-6">
                                Enter the administrator password to manage system verification bypass options.
                            </p>

                            <div className="w-full mb-4">
                                <input
                                    type="password"
                                    value={loginForm.data.password}
                                    onChange={(e) => loginForm.setData("password", e.target.value)}
                                    placeholder="Enter bypass password"
                                    className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none text-white transition-all text-center"
                                />
                                {loginForm.errors.password && (
                                    <p className="mt-1 text-xs text-red-500">{loginForm.errors.password}</p>
                                )}
                                {error && (
                                    <p className="mt-2 text-sm text-red-400 text-center bg-red-500/10 border border-red-500/30 py-2 rounded">
                                        {error}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loginForm.processing}
                                className="w-full py-3 rounded-xl bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition disabled:opacity-50"
                            >
                                {loginForm.processing ? "Verifying..." : "Unlock Gate"}
                            </button>
                        </form>
                    ) : (
                        /* BYPASS CONTROL SCREEN */
                        <div className="flex flex-col items-center">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
                                mlbbBypass 
                                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 animate-pulse" 
                                    : "bg-zinc-800 border border-zinc-700 text-zinc-500"
                            }`}>
                                <Power className="h-8 w-8" />
                            </div>

                            <h2 className="text-2xl font-bold tracking-tight mb-2 text-center">
                                Verification Bypass
                            </h2>
                            <p className="text-gray-400 text-sm text-center mb-6">
                                Toggle whether the MLBB game accounts and registration emails bypass real API/mailbox checks.
                            </p>

                            {/* Status Alert */}
                            <div className={`w-full rounded-xl p-4 mb-6 border text-center flex flex-col items-center justify-center ${
                                mlbbBypass 
                                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                                    : "bg-red-500/10 border-red-500/30 text-red-400"
                            }`}>
                                <div className="flex items-center gap-2 mb-1">
                                    {mlbbBypass ? (
                                        <>
                                            <CheckCircle className="h-5 w-5" />
                                            <span className="font-bold text-lg">Bypass is ACTIVE</span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="h-5 w-5" />
                                            <span className="font-bold text-lg">Bypass is INACTIVE</span>
                                        </>
                                    )}
                                </div>
                                <p className="text-xs opacity-80 mt-1">
                                    {mlbbBypass 
                                        ? "All registrants will automatically verify using mockup accounts." 
                                        : "Registrants must perform real API and mailbox verification code checks."}
                                </p>
                            </div>

                            {success && (
                                <p className="w-full text-center text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 py-2 rounded mb-4">
                                    {success}
                                </p>
                            )}

                            {/* Controls */}
                            <div className="w-full flex flex-col gap-3">
                                {mlbbBypass ? (
                                    <button
                                        type="button"
                                        onClick={() => handleToggle(false)}
                                        className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold transition"
                                    >
                                        Disable Bypass
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => handleToggle(true)}
                                        className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition"
                                    >
                                        Enable Bypass
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full py-6 text-center text-xs text-zinc-600 z-10 border-t border-white/5">
                © {new Date().getFullYear()} Moonton Student Leader Philippines. All rights reserved.
            </footer>
        </div>
    );
}
