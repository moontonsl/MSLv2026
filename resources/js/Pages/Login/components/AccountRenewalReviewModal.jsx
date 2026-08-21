import { CheckCircle2, Clock3, Home } from 'lucide-react';

export default function AccountRenewalReviewModal({
    type = 'reviewing',
    onGoHome,
}) {
    const isThankYou = type === 'thank-you';

    return (
        <div className="fixed inset-0 z-[85] flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm">
            <div className="w-full max-w-[520px] overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0b] shadow-2xl">
                <div className="relative px-6 py-8 text-center md:px-10 md:py-10">
                    <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-brand-500/10 blur-3xl" />
                    <div className="pointer-events-none absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />

                    <div className="relative z-10 flex flex-col items-center">
                        <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border ${
                            isThankYou
                                ? 'border-green-500/30 bg-green-500/10 text-green-400'
                                : 'border-brand-500/30 bg-brand-500/10 text-brand-500'
                        }`}>
                            {isThankYou ? <CheckCircle2 className="h-8 w-8" /> : <Clock3 className="h-8 w-8" />}
                        </div>

                        <h2 className="font-['League_Spartan'] text-3xl font-black leading-8 text-white">
                            {isThankYou
                                ? 'Thank you for renewing your MSL Account.'
                                : 'Account Renewal is being reviewed.'}
                        </h2>

                        <p className="mt-3 text-base leading-6 text-gray-300">
                            {isThankYou
                                ? 'Your renewal request has been submitted. Our team will review your updated details.'
                                : 'Your renewal request is already with our team. You will receive an email notification once your account has been verified.'}
                        </p>

                        <div className="mt-6 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-left">
                            <div className="text-sm font-semibold leading-5 text-white">
                                Current status
                            </div>
                            <div className="mt-2 inline-flex rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-sm font-semibold text-brand-500">
                                Pending Review
                            </div>
                            <p className="mt-3 text-sm leading-5 text-gray-400">
                                Access to some MSL platform features may remain limited while your request is being checked.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={onGoHome}
                            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-brand-500 bg-brand-500 px-4 py-3 text-base font-semibold text-black transition hover:bg-brand-400"
                        >
                            <Home className="h-5 w-5" />
                            Go to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
