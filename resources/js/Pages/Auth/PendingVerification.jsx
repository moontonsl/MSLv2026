import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { ShieldAlert, LogOut, CheckCircle2, Clock, Swords, User, School, Gamepad2, Mail, BadgeCheck } from "lucide-react";

export default function PendingVerification({ userData }) {
    const { auth } = usePage().props;
    const user = userData || auth?.user || {};

    const fullName = user.name || [user.first_name, user.surname].filter(Boolean).join(" ") || "N/A";
    const username = user.username || "N/A";
    const email = user.email || "N/A";
    const school = user.university || "N/A";
    const mlbbIgn = user.ml_ign || user.ign || "N/A";

    return (
        <div className="min-h-screen bg-black text-white font-sans flex flex-col justify-between relative overflow-hidden py-4 sm:py-8">
            <Head title="Verification Pending" />

            {/* Background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(242,194,26,0.08)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-500 to-transparent" />

            {/* Header / Logo */}
            <header className="w-full max-w-7xl mx-auto px-6 py-4 flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                    <Swords className="h-8 w-8 text-brand-500 animate-pulse" />
                    <span className="font-display font-extrabold text-xl tracking-wider text-white">
                        MOONTON <span className="text-brand-500">SLPH</span>
                    </span>
                </div>

                <Link
                    href={route("logout")}
                    method="post"
                    as="button"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-sm font-medium text-gray-300 hover:text-white"
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </Link>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10">
                <div className="w-full max-w-xl bg-zinc-950 border border-white/10 rounded-2xl p-6 sm:p-8 md:p-10 relative shadow-2xl">
                    {/* Glowing effect inside card */}
                    <div className="absolute -top-[1px] -left-[1px] w-[50px] h-[50px] border-t-2 border-l-2 border-brand-500 rounded-tl-2xl pointer-events-none" />
                    <div className="absolute -bottom-[1px] -right-[1px] w-[50px] h-[50px] border-b-2 border-r-2 border-brand-500 rounded-br-2xl pointer-events-none" />

                    <div className="flex flex-col items-center text-center">
                        {/* Status Icon Wrapper */}
                        <div className="w-20 h-20 rounded-full bg-brand-500/10 border border-brand-500/30 flex items-center justify-center mb-5 relative animate-pulse">
                            <Clock className="h-10 w-10 text-brand-500" />
                        </div>

                        {/* Heading */}
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-white">
                            Verification Pending
                        </h2>

                        <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6 max-w-md">
                            Thank you for registering with Moonton Student Leader Philippines! Our team is currently reviewing your registration details and proof of student enrollment.
                        </p>

                        {/* Account Details Card (Old Design ported into Modern Card) */}
                        <div className="w-full bg-[#18181b]/80 border border-neutral-800 rounded-xl p-5 sm:p-6 mb-5 text-left">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-800">
                                <User className="h-4 w-4 text-brand-500" />
                                <h3 className="text-base font-semibold text-white tracking-wide">
                                    Account Details
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                                <div>
                                    <span className="text-xs uppercase tracking-wider text-gray-400 block mb-1">
                                        Full Name
                                    </span>
                                    <span className="font-medium text-white block text-sm sm:text-base truncate" title={fullName}>
                                        {fullName}
                                    </span>
                                </div>

                                <div>
                                    <span className="text-xs uppercase tracking-wider text-gray-400 block mb-1">
                                        Username
                                    </span>
                                    <span className="font-medium text-white block text-sm sm:text-base truncate" title={username}>
                                        {username}
                                    </span>
                                </div>

                                <div>
                                    <span className="text-xs uppercase tracking-wider text-gray-400 block mb-1">
                                        Email
                                    </span>
                                    <span className="font-medium text-white block text-sm sm:text-base break-all" title={email}>
                                        {email}
                                    </span>
                                </div>

                                <div>
                                    <span className="text-xs uppercase tracking-wider text-gray-400 block mb-1">
                                        School/Institution
                                    </span>
                                    <span className="font-medium text-white block text-sm sm:text-base truncate" title={school}>
                                        {school}
                                    </span>
                                </div>

                                <div>
                                    <span className="text-xs uppercase tracking-wider text-gray-400 block mb-1">
                                        MLBB IGN
                                    </span>
                                    <span className="font-medium text-white block text-sm sm:text-base truncate" title={mlbbIgn}>
                                        {mlbbIgn}
                                    </span>
                                </div>

                                <div>
                                    <span className="text-xs uppercase tracking-wider text-gray-400 block mb-1">
                                        Current Status
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-brand-500/10 border border-brand-500/40 text-brand-500">
                                        <span className="h-2 w-2 rounded-full bg-brand-500 animate-ping" />
                                        Pending Verification
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* What happens next? Section */}
                        <div className="w-full bg-[#18181b]/50 border border-neutral-800 rounded-xl p-5 mb-5 text-left">
                            <div className="flex items-center gap-2 mb-3">
                                <CheckCircle2 className="h-5 w-5 text-blue-400 shrink-0" />
                                <h3 className="text-sm sm:text-base font-semibold text-white">
                                    What happens next?
                                </h3>
                            </div>
                            <ul className="text-xs sm:text-sm text-gray-300 space-y-2 pl-7 list-disc">
                                <li>Our team will review your submitted registration details and proof of student enrollment.</li>
                                <li>Verification usually takes <span className="text-white font-medium">24 to 48 hours</span>.</li>
                                <li>Once approved, you will have full access to the Student Portal, campus events, and tournament participation.</li>
                            </ul>
                        </div>

                        {/* Need Help Tip */}
                        <div className="flex items-start gap-3 bg-zinc-900/40 rounded-xl p-4 border border-white/5 text-left w-full">
                            <ShieldAlert className="h-5 w-5 text-zinc-500 shrink-0 mt-0.5" />
                            <div className="text-xs text-gray-400 leading-relaxed">
                                <span className="font-semibold text-gray-300 block mb-0.5">Need help or made a mistake?</span>
                                If you submitted incorrect information, you will be able to update and resubmit your application if our administrators request changes.
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full py-4 text-center text-xs text-zinc-600 z-10 border-t border-white/5">
                © {new Date().getFullYear()} Moonton Student Leader Philippines. All rights reserved.
            </footer>
        </div>
    );
}
