import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token || '',
        email: email || '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <MainLayout>
            <Head title="Reset Password" />

            <div className="min-h-screen flex items-start md:items-center justify-center px-4 md:px-8 pt-[70px] md:pt-0">
                <div className="w-full max-w-md md:max-w-6xl flex flex-col md:flex-row gap-3 md:gap-8 rounded-[28px] border border-white/10 bg-[#0f0f10] overflow-hidden min-h-[450px] shadow-2xl">
                    <div className="w-full md:w-[520px] px-5 md:px-12 py-8 md:py-12 flex flex-col justify-center">
                        <div className="space-y-2 mb-6 text-center">
                            <h2 className="text-xl md:text-3xl font-bold leading-tight text-white">
                                Set New Password
                            </h2>

                            <p className="text-xs md:text-sm text-white/70">
                                Enter your email address and new password below to reset your account.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email Field */}
                            <div>
                                <label className="text-sm text-white font-medium mb-1.5 block">
                                    Email Address <span className="text-red-500">*</span>
                                </label>

                                <div className="relative">
                                    <Mail
                                        size={18}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                    />

                                    <input
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="Enter your email address"
                                        required
                                        autoComplete="username"
                                        className={`w-full pl-11 pr-10 h-11 md:h-12 bg-black/50 border rounded-xl text-white placeholder-gray-500 text-sm transition outline-none focus:ring-2 ${
                                            errors.email
                                                ? 'border-red-500 focus:ring-red-500/30 focus:border-red-500'
                                                : 'border-white/15 focus:ring-yellow-500/30 focus:border-yellow-500'
                                        }`}
                                    />

                                    {errors.email && (
                                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none">
                                            <AlertCircle size={18} />
                                        </div>
                                    )}
                                </div>

                                {errors.email && (
                                    <p className="text-red-400 text-xs mt-1.5 leading-tight">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* New Password Field */}
                            <div>
                                <label className="text-sm text-white font-medium mb-1.5 block">
                                    New Password <span className="text-red-500">*</span>
                                </label>

                                <div className="relative">
                                    <Lock
                                        size={18}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                    />

                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Enter new password (min. 8 chars)"
                                        required
                                        autoComplete="new-password"
                                        className={`w-full pl-11 pr-11 h-11 md:h-12 bg-black/50 border rounded-xl text-white placeholder-gray-500 text-sm transition outline-none focus:ring-2 ${
                                            errors.password
                                                ? 'border-red-500 focus:ring-red-500/30 focus:border-red-500'
                                                : 'border-white/15 focus:ring-yellow-500/30 focus:border-yellow-500'
                                        }`}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>

                                {errors.password && (
                                    <p className="text-red-400 text-xs mt-1.5 leading-tight">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label className="text-sm text-white font-medium mb-1.5 block">
                                    Confirm New Password <span className="text-red-500">*</span>
                                </label>

                                <div className="relative">
                                    <Lock
                                        size={18}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                    />

                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Re-enter your new password"
                                        required
                                        autoComplete="new-password"
                                        className={`w-full pl-11 pr-11 h-11 md:h-12 bg-black/50 border rounded-xl text-white placeholder-gray-500 text-sm transition outline-none focus:ring-2 ${
                                            errors.password_confirmation
                                                ? 'border-red-500 focus:ring-red-500/30 focus:border-red-500'
                                                : 'border-white/15 focus:ring-yellow-500/30 focus:border-yellow-500'
                                        }`}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>

                                {errors.password_confirmation && (
                                    <p className="text-red-400 text-xs mt-1.5 leading-tight">
                                        {errors.password_confirmation}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className={`w-full py-3.5 rounded-xl text-sm md:text-base font-bold tracking-wide transition shadow-lg mt-2 ${
                                    processing
                                        ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                                        : 'bg-[#f1c40f] text-black hover:bg-[#e2b70e] hover:shadow-yellow-500/20 cursor-pointer active:scale-[0.99]'
                                }`}
                            >
                                {processing ? 'SAVING NEW PASSWORD...' : 'UPDATE PASSWORD'}
                            </button>

                            <p className="text-center text-xs md:text-sm text-white/70 pt-2">
                                Remember password?{' '}
                                <Link href="/login" className="text-[#f1c40f] font-medium hover:underline">
                                    Back to Sign in
                                </Link>
                            </p>
                        </form>
                    </div>

                    <div className="w-full md:flex-1 relative aspect-video md:aspect-auto min-h-[220px] md:min-h-full">
                        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90 z-10 pointer-events-none" />
                        <iframe
                            src="https://player.vimeo.com/video/1091173390?context=Vimeo%5CController%5CApi%5CResources%5CVideoController.&h=b2f78d509b&s=e3ba5b9062fe0eb9a97262a95d7f03fe2cb1c579_1778490740&autoplay=1&loop=1&muted=1"
                            title="MSL Video"
                            frameBorder="0"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
