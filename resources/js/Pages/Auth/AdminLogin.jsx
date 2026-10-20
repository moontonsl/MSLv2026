import { Head, router, useForm } from "@inertiajs/react";
import { LockKeyhole, UserRound } from "lucide-react";
import { useState } from "react";

import AdminLoginBackground from "./components/AdminLoginBackground";
import AdminLoginField from "./components/AdminLoginField";
import PasswordToggle from "./components/PasswordToggle";

const LOGO_IMAGE = "/Images/Admin/logo/msl-logo.png";

export default function AdminLogin({ authenticatedAdmin }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        post(route("admin.login.submit"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title="Admin Login" />

            <main className="relative isolate min-h-[100svh] overflow-x-hidden bg-brand-50">
                <AdminLoginBackground />

                <section
                    aria-label="Administrator login"
                    className="relative z-10 flex min-h-[100svh] items-center justify-center px-4 py-8 md:block md:px-0 md:py-0"
                >
                    <div className="w-full max-w-[500px] rounded-xl border border-black/10 bg-white px-[26px] pb-[55px] pt-[39px] shadow-[0_4px_50px_5px_rgba(0,0,0,0.2)] md:absolute md:left-[38.1726%] md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
                        <img
                            src={LOGO_IMAGE}
                            alt="MSL Philippines"
                            draggable="false"
                            className="mx-auto block h-auto w-[303px] max-w-full object-contain"
                        />

                        {authenticatedAdmin ? (
                            <div className="mx-auto mt-[37px] w-full max-w-[445px] text-center">
                                <h1 className="font-heading text-2xl font-bold text-gray-900">
                                    You’re already signed in
                                </h1>

                                <p className="mt-3 text-sm text-gray-600">
                                    Signed in as{" "}
                                    <span className="font-semibold">
                                        {authenticatedAdmin.name ||
                                            authenticatedAdmin.email}
                                    </span>
                                    .
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        router.post(route("admin.logout"))
                                    }
                                    className="mt-8 flex h-[60px] w-full items-center justify-center rounded-xl border border-black/20 bg-brand-500 px-[15px] py-[15px] font-heading text-label font-bold leading-[26px] text-black transition-colors hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                                >
                                    LOG OUT TO SWITCH ACCOUNT
                                </button>
                            </div>
                        ) : (
                            <form
                                className="mx-auto mt-[37px] w-full max-w-[445px]"
                                onSubmit={handleSubmit}
                            >
                                <div className="space-y-4">
                                    <AdminLoginField
                                        id="admin-email"
                                        name="email"
                                        label="Admin email address"
                                        placeholder="Email Address"
                                        value={data.email}
                                        error={errors.email}
                                        icon={UserRound}
                                        autoComplete="username"
                                        onChange={(event) =>
                                            setData("email", event.target.value)
                                        }
                                    />

                                    <AdminLoginField
                                        id="admin-password"
                                        name="password"
                                        label="Password"
                                        placeholder="Password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        value={data.password}
                                        error={errors.password}
                                        icon={LockKeyhole}
                                        autoComplete="current-password"
                                        onChange={(event) =>
                                            setData(
                                                "password",
                                                event.target.value,
                                            )
                                        }
                                        endAdornment={
                                            <PasswordToggle
                                                visible={showPassword}
                                                onToggle={() =>
                                                    setShowPassword(
                                                        (visible) => !visible,
                                                    )
                                                }
                                            />
                                        }
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    aria-busy={processing}
                                    className="mt-9 flex h-[60px] w-full items-center justify-center rounded-xl border border-black/20 bg-brand-500 px-[15px] py-[15px] font-heading text-label font-bold leading-[26px] text-black transition-colors hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {processing ? "LOGGING IN..." : "LOGIN"}
                                </button>
                            </form>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
}
