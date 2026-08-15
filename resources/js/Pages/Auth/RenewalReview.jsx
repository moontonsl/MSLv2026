import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, Clock3, LogOut, ShieldCheck, Swords } from 'lucide-react';

export default function RenewalReview() {
    return (
        <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#050505] font-sans text-white">
            <Head title="Renewal Under Review" />

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(242,194,26,0.12),transparent_42%)]" />
            <div className="absolute left-1/2 top-0 h-px w-full max-w-3xl -translate-x-1/2 bg-gradient-to-r from-transparent via-brand-500 to-transparent" />

            <header className="relative z-10 flex w-full items-center justify-between border-b border-white/10 px-5 py-5 sm:px-10">
                <div className="flex items-center gap-3">
                    <Swords className="h-7 w-7 text-brand-500" />
                    <div className="font-heading text-lg font-extrabold tracking-wide">
                        MOONTON <span className="text-brand-500">SLPH</span>
                    </div>
                </div>

                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-gray-300 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </Link>
            </header>

            <main className="relative z-10 flex flex-1 items-center justify-center px-5 py-12 sm:px-6">
                <section className="w-full max-w-xl rounded-[28px] border border-white/10 bg-[#0b0b0b]/95 p-6 shadow-2xl shadow-black/40 sm:p-10">
                    <div className="flex flex-col items-center text-center">
                        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-brand-500/30 bg-brand-500/10 text-brand-500">
                            <Clock3 className="h-10 w-10" />
                            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-brand-500 shadow-[0_0_16px_rgba(242,194,26,.8)]" />
                        </div>

                        <p className="mt-7 text-xs font-bold uppercase tracking-[0.22em] text-brand-500">Account status</p>
                        <h1 className="mt-3 font-heading text-3xl font-black leading-tight text-white sm:text-4xl">
                            Renewal under review
                        </h1>
                        <p className="mt-4 max-w-md text-base leading-7 text-gray-400">
                            Your renewal request and proof of enrollment have been submitted successfully. Our team is reviewing your account.
                        </p>
                    </div>

                    <div className="mt-8 rounded-2xl border border-brand-500/20 bg-brand-500/[0.06] p-5">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-500" />
                            <span className="font-semibold text-white">Pending Review</span>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-gray-400">
                            Your access will be restored once an administrator verifies your updated details. You may log out and return later.
                        </p>
                    </div>

                    <div className="mt-4 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
                        <p className="text-sm leading-6 text-gray-400">
                            You will be notified when your renewal has been approved or if additional information is needed.
                        </p>
                    </div>
                </section>
            </main>

            <footer className="relative z-10 border-t border-white/10 px-5 py-5 text-center text-xs text-gray-600">
                © {new Date().getFullYear()} Moonton Student Leader Philippines. All rights reserved.
            </footer>
        </div>
    );
}
