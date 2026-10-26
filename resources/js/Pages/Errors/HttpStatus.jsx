import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, Home, LogIn, RefreshCw } from 'lucide-react';
import { useState } from 'react';

const STATUS_CONTENT = {
    401: {
        title: 'Sign in to continue',
        description: 'Your session is not authenticated. Sign in to continue to this page.',
    },
    403: {
        title: 'Access denied',
        description: 'Your account does not have permission to open this page. Contact an administrator if you think you should have access.',
    },
    404: {
        title: 'Page not found',
        description: 'The page or record may have moved, or the address may be incorrect.',
    },
    419: {
        title: 'Your session expired',
        description: 'For security, this page needs a fresh session. Sign in again before continuing.',
    },
    422: {
        title: 'We could not process that request',
        description: 'Check the information you entered and try again.',
    },
    429: {
        title: 'Too many requests',
        description: 'Please wait a moment before trying this action again.',
    },
    500: {
        title: 'Something went wrong',
        description: 'The server could not complete your request. Try again shortly.',
    },
    503: {
        title: 'Temporarily unavailable',
        description: 'The service is currently unavailable. Please try again in a little while.',
    },
};

function getInitialLightTheme() {
    if (typeof window === 'undefined') return false;

    try {
        return window.localStorage.getItem('msl-admin-theme') === 'light';
    } catch {
        return false;
    }
}

export default function HttpStatus({ status, isAdminArea = false }) {
    const [isLightTheme] = useState(getInitialLightTheme);
    const content = STATUS_CONTENT[status] ?? STATUS_CONTENT[500];
    const requiresSignIn = status === 401 || status === 419;
    const canRetry = status === 500 || status === 503;
    const homeHref = isAdminArea ? '/admin/dashboard' : '/';
    const loginHref = isAdminArea ? '/admin/login' : '/login';

    const goBack = () => {
        if (window.history.length > 1) {
            window.history.back();
            return;
        }

        window.location.assign(homeHref);
    };

    return (
        <>
            <Head title={`${status} — ${content.title}`} />

            <main
                className={`flex min-h-screen flex-col px-5 py-6 font-sans sm:px-8 sm:py-8 ${
                    isLightTheme
                        ? 'bg-gray-100 text-gray-900'
                        : 'bg-[#0A0A0A] text-gray-100'
                }`}
            >
                <header className="mx-auto flex w-full max-w-6xl items-center">
                    <Link
                        href={isAdminArea ? loginHref : '/'}
                        className="inline-flex min-h-11 items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBBF24]"
                    >
                        <img
                            src="/Images/Admin/logo/msl-logo.png"
                            alt=""
                            className="h-10 w-10 object-contain"
                        />
                        <span className="text-lg font-bold">MSL Philippines</span>
                    </Link>
                </header>

                <section className="mx-auto flex w-full max-w-2xl flex-1 items-center py-12">
                    <div
                        role="alert"
                        aria-labelledby="http-status-title"
                        className={`w-full rounded-2xl border p-6 sm:p-10 ${
                            isLightTheme
                                ? 'border-gray-300 bg-gray-50'
                                : 'border-neutral-800 bg-[#111111]'
                        }`}
                    >
                        <div className="mb-6 flex items-center gap-3">
                            <span
                                className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#FBBF24]/15 ${
                                    isLightTheme ? 'text-[#916000]' : 'text-[#FBBF24]'
                                }`}
                            >
                                <AlertTriangle aria-hidden="true" className="h-5 w-5" />
                            </span>
                            <p className="font-semibold text-[#B77900] dark:text-[#FBBF24]">
                                HTTP {status}
                            </p>
                        </div>

                        <h1
                            id="http-status-title"
                            className="text-3xl font-bold tracking-tight sm:text-4xl"
                        >
                            {content.title}
                        </h1>
                        <p
                            className={`mt-4 max-w-prose text-base leading-7 ${
                                isLightTheme ? 'text-gray-700' : 'text-gray-300'
                            }`}
                        >
                            {content.description}
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link
                                href={requiresSignIn ? loginHref : homeHref}
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#FBBF24] px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBBF24] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]"
                            >
                                {requiresSignIn ? (
                                    <LogIn aria-hidden="true" className="h-4 w-4" />
                                ) : (
                                    <Home aria-hidden="true" className="h-4 w-4" />
                                )}
                                {requiresSignIn
                                    ? 'Sign in'
                                    : isAdminArea
                                      ? 'Go to dashboard'
                                      : 'Go to homepage'}
                            </Link>

                            {canRetry ? (
                                <button
                                    type="button"
                                    onClick={() => window.location.reload()}
                                    className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBBF24] ${
                                        isLightTheme
                                            ? 'border-gray-300 text-gray-800 hover:bg-gray-100 focus-visible:ring-offset-gray-50'
                                            : 'border-neutral-700 text-gray-200 hover:bg-white/5 focus-visible:ring-offset-[#111111]'
                                    }`}
                                >
                                    <RefreshCw aria-hidden="true" className="h-4 w-4" />
                                    Try again
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={goBack}
                                    className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBBF24] ${
                                        isLightTheme
                                            ? 'border-gray-300 text-gray-800 hover:bg-gray-100 focus-visible:ring-offset-gray-50'
                                            : 'border-neutral-700 text-gray-200 hover:bg-white/5 focus-visible:ring-offset-[#111111]'
                                    }`}
                                >
                                    <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                                    Go back
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                <footer
                    className={`mx-auto w-full max-w-6xl border-t pt-5 text-center text-xs ${
                        isLightTheme
                            ? 'border-gray-300 text-gray-600'
                            : 'border-neutral-800 text-gray-400'
                    }`}
                >
                    © {new Date().getFullYear()} Moonton Student Leader Philippines
                </footer>
            </main>
        </>
    );
}
