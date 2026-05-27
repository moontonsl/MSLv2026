import React from "react";
import { Head, Link } from "@inertiajs/react";
import { ShieldAlert, LogOut, CheckCircle2, Clock, Swords } from "lucide-react";

export default function PendingVerification() {
    return (
        <div className="min-h-screen bg-black text-white font-sans flex flex-col justify-between relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,136,0,0.08)_0%,transparent_70%)]" />
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-500 to-transparent" />
            
            {/* Header / Logo */}
            <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                    <Swords className="h-8 w-8 text-brand-500 animate-pulse" />
                    <span className="font-display font-extrabold text-xl tracking-wider text-white">
                        MOONTON <span className="text-brand-500">SLPH</span>
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
            <main className="flex-1 flex items-center justify-center p-6 z-10">
                <div className="w-full max-w-lg bg-zinc-950 border border-white/10 rounded-2xl p-8 md:p-10 relative shadow-2xl">
                    {/* Glowing effect inside card */}
                    <div className="absolute -top-[1px] -left-[1px] w-[50px] h-[50px] border-t-2 border-l-2 border-brand-500 rounded-tl-2xl" />
                    <div className="absolute -bottom-[1px] -right-[1px] w-[50px] h-[50px] border-b-2 border-r-2 border-brand-500 rounded-br-2xl" />

                    <div className="flex flex-col items-center text-center">
                        {/* Status Icon Wrapper */}
                        <div className="w-20 h-20 rounded-full bg-brand-500/10 border border-brand-500/30 flex items-center justify-center mb-6 relative animate-pulse">
                            <Clock className="h-10 w-10 text-brand-500" />
                        </div>

                        {/* Heading */}
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
                            Verification Pending
                        </h2>

                        <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8">
                            Thank you for registering with Moonton Student Leader Philippines! 
                            Our team is currently reviewing your registration details and proof of student enrollment.
                        </p>

                        {/* Status Tracker */}
                        <div className="w-full bg-zinc-900 border border-white/5 rounded-xl p-5 mb-8 text-left space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Account Status</span>
                                <span className="font-semibold text-brand-500 flex items-center gap-1.5">
                                    <span className="h-2.5 w-2.5 rounded-full bg-brand-500 animate-ping inline-block" />
                                    Pending Review
                                </span>
                            </div>
                            <div className="h-[1px] bg-white/5" />
                            <div className="space-y-2">
                                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold block">Estimated Wait Time</span>
                                <p className="text-sm text-gray-300">
                                    Usually approved within 24 to 48 hours. We appreciate your patience.
                                </p>
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="flex items-start gap-3 bg-zinc-900/50 rounded-xl p-4 border border-white/5 text-left w-full">
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
            <footer className="w-full py-6 text-center text-xs text-zinc-600 z-10 border-t border-white/5">
                © {new Date().getFullYear()} Moonton Student Leader Philippines. All rights reserved.
            </footer>
        </div>
    );
}
