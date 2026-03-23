import { useForm } from "@inertiajs/react";
import { useState } from "react";
import { Eye, EyeOff } from "react-feather";

export default function LoginForm({ onBack }) {

    const { post, data, setData, reset } = useForm({
        username: '',
        password: '',
    });

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!data.username || !data.password) {
            setError('⚠️ Please enter account details.');
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
        <div className="min-h-screen flex items-center justify-center px-md">

            {/* SAME CARD */}
            <div className="w-full max-w-6xl flex rounded-[28px] border border-white/10 bg-bg-card overflow-hidden">

                {/* ================= LEFT ================= */}
                <div className="w-[520px] pl-[48px] pr-[24px] py-lg flex flex-col justify-center">

                    {/* TITLE */}
                    <div className="space-y-xs mb-lg">
                        <h2 className="text-section font-bold leading-[1.1]">
                            Unlock your path in student esports and leadership.
                        </h2>
                    </div>

                    {/* FORM */}
                    <form onSubmit={handleSubmit} className="space-y-md">

                        {/* USERNAME */}
                        <div>
                            <label className="text-sm text-gray-400 mb-xs block">
                                Username
                            </label>
                            <input
                                type="text"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                placeholder="eg. Simeon"
                                className="input w-full"
                            />
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label className="text-sm text-gray-400 mb-xs block">
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    type={passwordVisible ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="********"
                                    className="input w-full pr-10"
                                />

                                <button
                                    type="button"
                                    onClick={() => setPasswordVisible(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {passwordVisible ? <EyeOff size={18}/> : <Eye size={18}/>}
                                </button>
                            </div>
                        </div>

                        {/* ERROR */}
                        {error && (
                            <div className="bg-error-500/10 border border-error-500 text-error-500 p-3 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        {/* Footer Container with Login Button and Links */}
                        <div className="footer-container-login flex flex-col items-center">
                            <button
                                type="submit"
                                className="login-btn-login w-full py-4 rounded-xl bg-brand-500 text-black font-semibold hover:bg-brand-600 transition duration-300 block mx-auto text-base md:py-3"
                            >
                                Login
                            </button>
                            <p className="footer-text-login text-white text-center mt-4 text-sm">
                                <a href="/forgot-password" className="forgot-password-link-login text-[#f1c40f] no-underline hover:underline">
                                    Forgot Password
                                </a> / {' '}
                                <a href="/forgot-username" className="forgot-password-link-login text-[#f1c40f] no-underline hover:underline">
                                    Forgot Username
                                </a>
                                <br />
                                Don't have an account?{' '}
                                <a href="/register" className="sign-in-link-login text-[#f1c40f] no-underline hover:underline">
                                    Sign Up
                                </a>
                            </p>
                        </div>

                    </form>

                </div>

                {/* ================= RIGHT ================= */}
                <div className="flex-1 relative">

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
    );
}