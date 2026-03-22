import { useForm } from "@inertiajs/react";
import { Eye, EyeOff } from "react-feather";
import { useState } from "react";

export default function LoginForm() {

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
                if (errors.message) {
                    setError(errors.message);
                } else if (errors.username || errors.password) {
                    setError(errors.username || errors.password);
                } else {
                    setError('⚠️ Wrong username or password.');
                }
            },
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center">

            <div className="bg-bg-card rounded-xl p-xl flex gap-xl w-full max-w-5xl">

                {/* LEFT SIDE */}
                <div className="flex-1 space-y-lg">

                    <h2 className="text-section font-bold">
                        Unlock your path in student esports and leadership.
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-md">

                        {/* USERNAME */}
                        <div>
                            <label className="block mb-1 text-sm text-gray-400">
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
                            <label className="block mb-1 text-sm text-gray-400">
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
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    {passwordVisible ? <EyeOff size={20}/> : <Eye size={20}/>}
                                </button>
                            </div>
                        </div>

                        {/* ERROR */}
                        {error && (
                            <div className="bg-error-500/10 border border-error-500 text-error-500 p-3 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        {/* BUTTON */}
                        <button type="submit" className="btn-primary w-full">
                            Login
                        </button>

                        {/* LINKS */}
                        <div className="text-sm text-gray-400 text-center">
                            <a href="/forgot-password" className="text-brand-500 hover:underline">
                                Forgot Password
                            </a>{" "}
                            /{" "}
                            <a href="/forgot-username" className="text-brand-500 hover:underline">
                                Forgot Username
                            </a>

                            <br />

                            Don't have an account?{" "}
                            <a href="/register" className="text-brand-500 hover:underline">
                                Sign Up
                            </a>
                        </div>

                    </form>

                </div>

                {/* RIGHT SIDE (VIDEO / IMAGE) */}
                <div className="hidden md:flex flex-1 bg-bg-surface rounded-xl items-center justify-center">
                    🎥 Video Placeholder
                </div>

            </div>

        </div>
    );
}