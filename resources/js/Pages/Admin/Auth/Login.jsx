import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminLogin({ errors = {}, status, main_site_url }) {
    const [showPassword, setShowPassword] = useState(false);
    const cursorSpotlightRef = useRef(null);

    const { data, setData, post, processing, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        // Only run on devices with a fine pointer (mouse)
        if (window.matchMedia('(pointer: coarse)').matches) {
            return;
        }

        let animationFrameId;

        const handleMouseMove = (e) => {
            const { clientX: x, clientY: y } = e;
            cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(() => {
                if (cursorSpotlightRef.current) {
                    cursorSpotlightRef.current.style.background = `radial-gradient(550px circle at ${x}px ${y}px, rgba(245, 158, 11, 0.16), rgba(245, 158, 11, 0.04) 40%, transparent 75%)`;
                    cursorSpotlightRef.current.style.opacity = '1';
                }
            });
        };

        const handleMouseLeave = () => {
            if (cursorSpotlightRef.current) cursorSpotlightRef.current.style.opacity = '0';
        };

        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    const submit = (event) => {
        event.preventDefault();
        post(route('admin.login.submit'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center bg-[#070709] text-white selection:bg-brand-500 selection:text-black overflow-hidden px-4 py-8">
            <Head title="Admin Portal Login | MSL Philippines" />

            {/* Interactive Cursor Ambient Glow (Smooth spotlight without solid circle) */}
            <div
                ref={cursorSpotlightRef}
                className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-300 opacity-0"
            />

            {/* Ambient Lighting & Esports Glow Effects */}
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-amber-500/15 via-brand-500/5 to-transparent blur-[120px] pointer-events-none rounded-full" />
            <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] bg-amber-600/10 blur-[140px] pointer-events-none rounded-full" />
            <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] bg-blue-600/5 blur-[140px] pointer-events-none rounded-full" />

            {/* Subtle Grid Backdrop */}
            <div 
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                }}
            />

            <div className="relative w-full max-w-[460px] z-10">
                {/* Back to Public Site Link */}
                <div className="mb-6 flex items-center justify-between">
                    <a
                        href={main_site_url || "/"}
                        className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-brand-400 transition-colors duration-200 group"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                        <span>Back to MSL Website</span>
                    </a>

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-semibold text-amber-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        Official Control Panel
                    </div>
                </div>

                {/* Login Glassmorphism Card */}
                <div className="relative rounded-2xl bg-[#0e0e12]/90 backdrop-blur-2xl border border-white/10 p-8 sm:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden">
                    {/* Top Accent Gradient Bar */}
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 via-brand-500 to-amber-300" />

                    {/* Logo & Header */}
                    <div className="flex items-center justify-between gap-4 mb-8">
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-zinc-800/80 border border-white/5 text-[10px] font-bold uppercase tracking-widest text-zinc-300 mb-2">
                                <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
                                Authorized Staff Only
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase leading-none">
                                Admin <span className="text-brand-400">Portal</span>
                            </h1>
                            <p className="mt-1.5 text-xs text-zinc-400">
                                Enter your verified MSL administrative credentials to proceed.
                            </p>
                        </div>

                        <div className="relative shrink-0 flex items-center justify-center">
                            <div className="absolute inset-0 bg-brand-500/20 blur-xl rounded-full" />
                            <img
                                src="/MSL_LOGO.png"
                                alt="MSL Philippines Logo"
                                className="relative h-16 w-auto object-contain drop-shadow-[0_4px_12px_rgba(242,194,26,0.35)]"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = '/msl-logo.png';
                                }}
                            />
                        </div>
                    </div>

                    {/* Status Feedback (e.g. Password reset or logout status) */}
                    {status && (
                        <div className="mb-6 flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs leading-relaxed">
                            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{status}</span>
                        </div>
                    )}

                    {/* General Errors Banner if any non-field error exists */}
                    {errors.message && (
                        <div className="mb-6 flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs leading-relaxed">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{errors.message}</span>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={submit} className="space-y-5">
                        {/* Email Input */}
                        <div>
                            <label 
                                htmlFor="email" 
                                className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5"
                            >
                                Admin Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="admin@mslphilippines.com"
                                    autoComplete="username"
                                    autoFocus
                                    className={`w-full bg-[#15151a] text-sm text-white placeholder-zinc-500 rounded-xl pl-10 pr-4 py-3 border transition-all duration-200 outline-none ${
                                        errors.email 
                                            ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' 
                                            : 'border-white/10 hover:border-white/20 focus:border-brand-500 focus:ring-1 focus:ring-brand-500'
                                    }`}
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Input */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label 
                                    htmlFor="password" 
                                    className="block text-xs font-semibold uppercase tracking-wider text-zinc-300"
                                >
                                    Password
                                </label>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••••••"
                                    autoComplete="current-password"
                                    className={`w-full bg-[#15151a] text-sm text-white placeholder-zinc-500 rounded-xl pl-10 pr-11 py-3 border transition-all duration-200 outline-none ${
                                        errors.password 
                                            ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' 
                                            : 'border-white/10 hover:border-white/20 focus:border-brand-500 focus:ring-1 focus:ring-brand-500'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-2 cursor-pointer select-none group">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-brand-500 focus:ring-brand-500 focus:ring-offset-0 transition-colors cursor-pointer"
                                />
                                <span className="text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors">
                                    Remember this session
                                </span>
                            </label>

                            <span className="text-[11px] text-zinc-500">
                                256-Bit Encrypted
                            </span>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-amber-400 via-brand-500 to-amber-500 p-px font-bold text-black shadow-lg shadow-amber-500/20 active:scale-[0.99] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <div className="w-full h-full py-3.5 px-6 rounded-[11px] bg-gradient-to-r from-amber-400 via-brand-500 to-amber-500 flex items-center justify-center gap-2 transition-transform duration-200 group-hover:brightness-105">
                                {processing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                        <span className="text-sm font-extrabold uppercase tracking-wider text-black">
                                            Authenticating...
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-sm font-extrabold uppercase tracking-wider text-black">
                                            Sign In to Admin
                                        </span>
                                        <ShieldCheck className="w-4 h-4 text-black transition-transform group-hover:scale-110" />
                                    </>
                                )}
                            </div>
                        </button>
                    </form>

                    {/* Security Footnote */}
                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-[11px] text-zinc-500 leading-relaxed">
                            Moonton Student Leaders Philippines &copy; {new Date().getFullYear()}
                            <br />
                            Unauthorized access attempts are logged and monitored.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
