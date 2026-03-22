import { useForm } from "@inertiajs/react";
import { useState } from "react";
import { Eye, EyeOff } from "react-feather";

export default function LoginForm({ onBack }) {

    const { post, data, setData, reset } = useForm({
        username: '',
        password: '',
        remember: false,
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
                setError(errors.username || errors.password || 'Invalid credentials.');
            },
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-md">

            {/* SAME CARD AS LANDING */}
            <div className="w-full max-w-6xl flex rounded-[28px] border border-white/10 bg-bg-card overflow-hidden">

                {/* ================= LEFT ================= */}
                <div className="w-[460px] pl-[48px] pr-[24px] py-xl flex flex-col justify-center">

                    {/* TITLE */}
                    <h2 className="text-section font-bold mb-lg">
                        Sign in to your account
                    </h2>

                    {/* FORM */}
                    <form onSubmit={handleSubmit} className="space-y-md">

                        {/* USERNAME */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-xs">
                                Username
                            </label>
                            <input
                                type="text"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                className="input w-full"
                                placeholder="Enter your username"
                            />
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-xs">
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    type={passwordVisible ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="input w-full pr-10"
                                    placeholder="Enter your password"
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
                            <div className="text-error-500 text-sm">
                                {error}
                            </div>
                        )}

                        {/* SUBMIT */}
                        <button
                            type="submit"
                            className="w-[354px] py-md px-lg rounded-xl bg-brand-500 text-black font-semibold hover:bg-brand-600 transition"
                        >
                            Login
                        </button>

                        {/* LINKS */}
                        <div className="text-sm text-gray-400 space-y-xs">
                            <a href="/forgot-password" className="block hover:text-brand-500">
                                Forgot Password?
                            </a>

                            <a href="/register" className="block hover:text-brand-500">
                                Create an Account
                            </a>
                        </div>

                    </form>

                </div>


                {/* ================= RIGHT ================= */}
                <div className="flex-1 p-md flex items-center justify-center">

                    <div className="w-full h-[500px] rounded-[24px] border border-white/10 relative overflow-hidden shadow-soft">

                        {/* VIDEO */}
                        <div className="absolute inset-0 bg-bg-card flex items-center justify-center">
                            🎥 Video Placeholder
                        </div>

                        {/* OVERLAY */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-bg-cardHover/60 to-bg-card/60" />

                    </div>

                </div>

            </div>

        </div>
    );
}