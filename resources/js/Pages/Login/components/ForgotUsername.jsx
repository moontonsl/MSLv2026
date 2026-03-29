import { useState } from "react";
import { Mail } from "react-feather";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function ForgotUsername() {

    const [email, setEmail] = useState('');
    const [cooldown, setCooldown] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email.trim()) {
            setError('Email address is required');
            setSuccess(false);
            return;
        }

        // simulate API check
        const emailNotFound = false;

        if (emailNotFound) {
            setError("We couldn't find an account associated with this email.");
            setSuccess(false);
            return;
        }

        setError('');
        setSuccess(true);
        setCooldown(60);

        const timer = setInterval(() => {
            setCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setSuccess(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Forgot Username" />

            <div className="min-h-screen flex items-start md:items-center justify-center px-md pt-[70px] md:pt-0">

                <div className="w-full max-w-md md:max-w-6xl flex flex-col md:flex-row gap-[12px] md:gap-[32px] rounded-[28px] border border-white/10 bg-bg-card overflow-hidden min-h-[450px]">

                    {/* LEFT */}
                    <div className="w-full md:w-[520px] px-[20px] md:pl-[48px] md:pr-[24px] py-lg md:py-xl flex flex-col justify-center">

                        {/* TITLE */}
                        <div className="space-y-xs mb-lg text-center">
                            <h2 className="text-xl md:text-section font-bold leading-[1.1]">
                                Recover Your Username
                            </h2>

                            <p className="text-xs md:text-sm text-white/70">
                                Enter your email address and we’ll send your username to your email
                            </p>
                        </div>

                        {/* NOTE */}
                        <div className="mb-md">
                            <div className="flex items-center gap-2 border border-yellow-500/30 bg-yellow-500/10 rounded-xl px-2.5 md:px-3 py-1.5 md:py-2 whitespace-nowrap overflow-hidden">

                                <span className="flex items-center gap-1.5 px-2 py-[2px] rounded-md border border-yellow-400/40 bg-yellow-500/10 text-yellow-300 text-xs md:text-sm font-medium shrink-0">
                                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                                    Note
                                </span>

                                <p className="text-[11px] md:text-sm text-yellow-300 truncate">
                                    You can request a new reset link in{' '}
                                    <span className="font-semibold text-yellow-200">
                                        {cooldown > 0 ? `${cooldown}s` : '60s'}
                                    </span>
                                </p>

                            </div>
                        </div>

                        {/* FORM */}
                        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-md">

                            <div>
                                <label className="text-sm text-white mb-[4px] block">
                                    Email Address <span className="text-red-500">*</span>
                                </label>

                                <div className="relative">

                                    <Mail
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                    />

                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (error) setError('');
                                            if (success) setSuccess(false);
                                        }}
                                        placeholder="Enter your email address"
                                        className={`input w-full pl-11 pr-10 h-[44px] md:h-[48px] ${
                                            error
                                                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                                                : 'focus:ring-yellow-500 focus:border-yellow-500'
                                        }`}
                                    />

                                    {error && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full border border-red-500 text-red-500 text-xs font-bold">
                                            !
                                        </div>
                                    )}

                                </div>

                                {error && (
                                    <p className="text-red-500 text-xs mt-[4px] leading-tight">
                                        {error}
                                    </p>
                                )}

                                {success && (
                                    <p className="text-green-500 text-xs mt-[4px] flex items-center gap-1">
                                        <span className="w-4 h-4 flex items-center justify-center rounded-full bg-green-500 text-white text-[10px]">
                                            ✓
                                        </span>
                                        Username sent to your email
                                    </p>
                                )}

                            </div>

                            {/* BUTTON */}
                            <button
                                type="submit"
                                disabled={cooldown > 0}
                                className={`w-full py-3 md:py-4 rounded-xl text-sm md:text-base font-semibold transition ${
                                    cooldown > 0
                                        ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                                        : 'bg-brand-500 text-black hover:bg-brand-600'
                                }`}
                            >
                                RECOVER USERNAME
                            </button>

                            {/* BACK */}
                            <p className="text-center text-xs md:text-sm text-white/70 mt-md">
                                Remember username?{' '}
                                <Link href="/login" className="text-brand-500 hover:underline">
                                    Back to Sign in
                                </Link>
                            </p>

                        </form>

                    </div>

                    {/* RIGHT */}
                    <div className="w-full md:flex-1 relative aspect-video md:aspect-auto">
                        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90">
                            <iframe
                                src="https://player.vimeo.com/video/1091173390?h=b2f78d509b&autoplay=1&loop=1&muted=1&background=1"
                                title="MSL Video"
                                frameBorder="0"
                                allow="autoplay; fullscreen; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full border-none"
                            />
                        </div>
                    </div>

                </div>

            </div>
        </AuthenticatedLayout>
    );
}