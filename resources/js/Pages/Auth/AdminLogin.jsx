import InputError from "@/Components/InputError";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";

const adminHero = "/Images/Admin/heroes/brody.png";
const adminBackground = "/Images/Admin/background/eruditio.png";
const mslLogo = "/Images/Admin/logo/msl-logo.png";

const fieldClassName =
    "flex h-[60px] w-full items-center rounded-xl border bg-white px-[15px] transition-colors focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/30";

const getFieldClassName = (hasError) =>
    `${fieldClassName} ${hasError ? "border-error-500" : "border-black/20"}`;

export default function AdminLogin() {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        post(route("admin.login.store"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title="Admin Login" />

            <main className="relative isolate min-h-[100svh] overflow-x-hidden bg-brand-50">
                <div aria-hidden="true" className="absolute inset-0">
                    {/* Left hero panel */}
                    <div className="absolute inset-0 overflow-hidden bg-brand-50 md:right-auto md:w-[38.1726%]">
                        <img
                            src={adminHero}
                            alt=""
                            className="absolute inset-0 h-full w-full scale-[1.08] object-cover object-center opacity-80"
                        />
                    </div>

                    {/* Right background panel */}
                    <div className="absolute inset-y-0 right-0 hidden w-[61.8274%] overflow-hidden shadow-[-10px_0_50px_6px_rgba(0,0,0,0.25)] md:block">
                        <div className="absolute inset-y-0 -left-[5.75%] right-0">
                            <img
                                src={adminBackground}
                                alt=""
                                className="h-full w-full object-cover object-right"
                            />
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-l from-black/50 via-black/50 to-black/30" />
                    </div>
                </div>

                <section
                    aria-label="Administrator login"
                    className="relative z-10 flex min-h-[100svh] items-center justify-center px-4 py-8 md:block md:px-0 md:py-0"
                >
                    <div className="min-h-[450px] w-full max-w-[500px] rounded-xl border border-black/10 bg-white px-[26px] pb-[55px] pt-[39px] shadow-[0_4px_50px_5px_rgba(0,0,0,0.2)] md:absolute md:left-[38.1726%] md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
                        <img
                            src={mslLogo}
                            alt="MSL Philippines"
                            className="mx-auto block h-auto w-[303px] max-w-full object-contain"
                        />

                        <form
                            className="mx-auto mt-[37px] w-full max-w-[445px]"
                            onSubmit={handleSubmit}
                        >
                            <div className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="admin-email"
                                        className="sr-only"
                                    >
                                        Email Address
                                    </label>

                                    <div
                                        className={getFieldClassName(
                                            Boolean(errors.username),
                                        )}
                                    >
                                        <UserRound
                                            aria-hidden="true"
                                            className="mr-[5px] h-7 w-7 shrink-0 text-black/20"
                                            strokeWidth={1.25}
                                        />

                                        <input
                                            id="admin-email"
                                            name="username"
                                            type="email"
                                            autoComplete="username"
                                            required
                                            aria-invalid={Boolean(
                                                errors.username,
                                            )}
                                            aria-describedby={
                                                errors.username
                                                    ? "admin-email-error"
                                                    : undefined
                                            }
                                            placeholder="Email Address"
                                            value={data.username}
                                            onChange={(event) =>
                                                setData(
                                                    "username",
                                                    event.target.value,
                                                )
                                            }
                                            className="h-full min-w-0 flex-1 border-0 bg-transparent p-0 font-heading text-label font-bold leading-[26px] text-gray-800 outline-none placeholder:text-black/20 placeholder:opacity-100 focus:border-transparent focus:ring-0"
                                        />
                                    </div>

                                    <InputError
                                        id="admin-email-error"
                                        message={errors.username}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="admin-password"
                                        className="sr-only"
                                    >
                                        Password
                                    </label>

                                    <div
                                        className={getFieldClassName(
                                            Boolean(errors.password),
                                        )}
                                    >
                                        <LockKeyhole
                                            aria-hidden="true"
                                            className="mr-[5px] h-7 w-7 shrink-0 text-black/20"
                                            strokeWidth={1.25}
                                        />

                                        <input
                                            id="admin-password"
                                            name="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            autoComplete="current-password"
                                            required
                                            aria-invalid={Boolean(
                                                errors.password,
                                            )}
                                            aria-describedby={
                                                errors.password
                                                    ? "admin-password-error"
                                                    : undefined
                                            }
                                            placeholder="Password"
                                            value={data.password}
                                            onChange={(event) =>
                                                setData(
                                                    "password",
                                                    event.target.value,
                                                )
                                            }
                                            className="h-full min-w-0 flex-1 border-0 bg-transparent p-0 font-heading text-label font-bold leading-[26px] text-gray-800 outline-none placeholder:text-black/20 placeholder:opacity-100 focus:border-transparent focus:ring-0"
                                        />

                                        <button
                                            type="button"
                                            aria-label={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                            aria-pressed={showPassword}
                                            onClick={() =>
                                                setShowPassword(
                                                    (visible) => !visible,
                                                )
                                            }
                                            className="ml-3 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded text-black/20 transition-colors hover:text-black/50 focus:outline-none "
                                        >
                                            {showPassword ? (
                                                <EyeOff
                                                    aria-hidden="true"
                                                    className="h-[22px] w-[22px]"
                                                />
                                            ) : (
                                                <Eye
                                                    aria-hidden="true"
                                                    className="h-[22px] w-[22px]"
                                                />
                                            )}
                                        </button>
                                    </div>

                                    <InputError
                                        id="admin-password-error"
                                        message={errors.password}
                                        className="mt-2"
                                    />
                                </div>
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
                    </div>
                </section>
            </main>
        </>
    );
}
