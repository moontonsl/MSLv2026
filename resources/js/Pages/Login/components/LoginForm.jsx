import { Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import { Eye, EyeOff } from "react-feather";
import StudentTypeModal from "./StudentTypeModal";

export default function LoginForm({ onBack }) {

    const { post, data, setData, reset } = useForm({
        username: '',
        password: '',
    });

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState('');
    const [showStudentTypeModal, setShowStudentTypeModal] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!data.username.trim() || !data.password.trim()) {
            setError('Please enter your username and password.');
            return;
        }

        post(route('login'), {
            onFinish: () => reset('password'),
            onError: (errors) => {
                if (errors.message) {
                    setError(errors.message);
                } else if (errors.username || errors.password) {
                    setError(errors.username || errors.password);
                } else {
                    setError('⚠️ Wrong username or password.');
                }
            },
        });

        setError('');
    };

    return (
        <div className="min-h-screen flex items-start md:items-center justify-center px-md pt-[50px] md:pt-0">

            {/* SAME CARD */}
            <div className="w-full max-w-md md:max-w-6xl flex flex-col md:flex-row gap-[8px] md:gap-[32px] rounded-[28px] border border-white/10 bg-bg-card overflow-hidden min-h-[450px]">
                
                {/* ================= LEFT ================= */}
                <div className="w-full md:w-[520px] px-[20px] md:pl-[48px] md:pr-[24px] py-lg md:py-xl flex flex-col justify-center">

                    {/* TITLE */}
                    <div className="space-y-xs mb-lg text-center">

                        <h2 className="text-2xl md:text-section font-bold leading-[1.1]">
                            Account Login
                        </h2>

                        <p className="text-xs md:text-sm text-white/70">
                            Unlock your path in student esports and leadership.
                        </p>

                    </div>

                    {/* FORM */}
                    <form onSubmit={handleSubmit} className="space-y-3 md:space-y-md">

                        {/* USERNAME */}
                        <div>
                            <label className="text-sm text-white mb-[4px] block">
                                Username <span className="text-red-500">*</span>
                            </label>

                            <div className="relative">
                                <input
                                    type="text"
                                    value={data.username}
                                    onChange={(e) => {
                                        setData('username', e.target.value);
                                        if (error) setError('');
                                    }}
                                    placeholder="eg. Simeon"
                                    className={`input w-full pr-10 ${
                                        error
                                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                                            : 'focus:ring-yellow-500 focus:border-yellow-500'
                                    }`}
                                />

                                {/* ERROR ICON */}
                                {error && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full border border-red-500 text-red-500 text-xs font-bold">
                                        !
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label className="text-sm text-white mb-[4px] block">
                                Password <span className="text-red-500">*</span>
                            </label>

                            <div className="relative">
                                <input
                                    type={passwordVisible ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) => {
                                        setData('password', e.target.value);
                                        if (error) setError('');
                                    }}
                                    placeholder="********"
                                    className={`input w-full pr-10 ${
                                        error
                                            ? 'pr-20 border-red-500 focus:ring-red-500 focus:border-red-500'
                                            : 'focus:ring-yellow-500 focus:border-yellow-500'
                                    }`}
                                />

                                {/* ERROR ICON */}
                                {error && (
                                    <div className="absolute right-10 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full border border-red-500 text-red-500 text-xs font-bold">
                                        !
                                    </div>
                                )}

                                {/* TOGGLE ICON */}
                                <button
                                    type="button"
                                    onClick={() => setPasswordVisible(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {passwordVisible ? <EyeOff size={18}/> : <Eye size={18}/>}
                                </button>
                            </div>

                            {/* 🔥 ERROR MESSAGE NOW CLOSE */}
                            {error && (
                                <div className="flex items-center gap-2 mt-[4px] text-red-500 text-xs">
                                    <span>{error}</span>
                                </div>
                            )}
                        </div>

                        {/* Footer Container with Login Button and Links */}
                        <div className="footer-container-login flex flex-col items-center">
                            <button
                                type="submit"
                                className="w-full py-3 md:py-4 rounded-xl bg-brand-500 text-black text-sm md:text-base font-semibold hover:bg-brand-600 transition"
                            >
                                LOGIN
                            </button>
                            <p className="text-white text-center mt-4 text-xs md:text-sm">
                                <Link href="/forgot-password" className="forgot-password-link-login text-[#f1c40f] no-underline hover:underline">
                                    Forgot Password
                                </Link> / {' '}
                                <Link href="/forgot-username" className="forgot-password-link-login text-[#f1c40f] no-underline hover:underline">
                                    Forgot Username
                                </Link>
                                <br />
                                Don't have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => setShowStudentTypeModal(true)}
                                    className="sign-in-link-login inline bg-transparent p-0 border-0 text-[#f1c40f] no-underline hover:underline cursor-pointer"
                                >
                                    Sign Up
                                </button>
                            </p>
                        </div>

                    </form>

                </div>

                {/* ================= RIGHT ================= */}
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

            <StudentTypeModal
                isOpen={showStudentTypeModal}
                onClose={() => setShowStudentTypeModal(false)}
                onSelect={(type) => {
                    setShowStudentTypeModal(false);

                    if (type === 'shs') {
                        window.location.href = '/register/shs';
                    } else {
                        window.location.href = '/register/college';
                    }
                }}
            />

        </div>
    );
}
