import { ChevronDown, X } from 'lucide-react';
import { useState } from 'react';

const blockReasons = [
    'Not Enrolled to the school',
    'Inaccurate/Fake Proof of Enrollment',
    "User doesn't match the Proof of Enrollment",
    'Student ID or enrollment proof is already in use',
    'Multiple account creation using the same identity',
    'Provided false or misleading personal details',
    'Impersonating another student, school official, or admin',
    'Unauthorized sharing or selling of account credentials',
    'Violation of community guidelines or code of conduct',
    'Repeated spamming, self-promotion, or posting scam links',
    'Harassment, hate speech, or toxic behavior toward other members',
    'Posting offensive, explicit, or inappropriate content',
];

const renewReasons = [
    'Wrong docs',
    'School',
    'Course',
    'Name',
    'School ID',
];

const actionConfig = {
    verify: {
        successTitle: 'Verified Account!',
        successButton: 'Success!',
    },
    renew: {
        reasonTitle: 'Please select a reason to Renew',
        reasons: renewReasons,
        successTitle: 'Renewal Submitted!',
        successButton: 'Success!',
    },
    block: {
        reasonTitle: 'Please select a reason to Block',
        reasons: blockReasons,
        confirmTitle: 'Do you really want to Block this User?',
        successTitle: 'Blocked Account!',
        successButton: 'Success!',
    },
};

function DialogShell({ children, onClose, labelledBy }) {
    return (
        <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            onMouseDown={(event) => event.target === event.currentTarget && onClose()}
        >
            <div className="relative w-full max-w-[400px] overflow-hidden rounded-2xl border border-white/10 bg-[#121212] py-4 shadow-[0_3px_3px_-1.5px_rgba(10,13,18,.04),0_8px_8px_-4px_rgba(10,13,18,.03),0_20px_24px_-4px_rgba(10,13,18,.08)]">
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white/10 hover:text-white"
                >
                    <X className="h-5 w-5" />
                </button>
                {children}
            </div>
        </div>
    );
}

function PrimaryButton({ children, onClick, disabled = false }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-brand-500 bg-brand-500 px-4 text-base font-semibold leading-[26px] text-black transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
            {children}
        </button>
    );
}

function SecondaryButton({ children, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-brand-500 bg-white/10 px-4 text-sm font-semibold leading-5 text-brand-500 shadow-[0_1px_2px_rgba(10,13,18,.05),inset_0_-2px_0_rgba(10,13,18,.05)] transition hover:bg-white/15"
        >
            {children}
        </button>
    );
}

function ReasonDialog({ config, reason, setReason, onProceed, onClose }) {
    return (
        <DialogShell onClose={onClose} labelledBy="account-action-reason-title">
            <div className="px-4 pt-8 text-center">
                <h2 id="account-action-reason-title" className="font-heading text-xl font-bold leading-7 text-white">
                    {config.reasonTitle}
                </h2>
            </div>
            <div className="px-6 pb-2 pt-6">
                <label className="relative block">
                    <select
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                        className="h-11 w-full appearance-none rounded-xl border border-white/10 bg-[#0B0B0B] px-3.5 pr-10 text-base leading-6 text-white shadow-sm outline-none focus:border-brand-500 focus:ring-brand-500"
                    >
                        <option value="">Select an option</option>
                        {config.reasons.map((item) => (
                            <option key={item} value={item} className="bg-[#0B0B0B]">
                                {item}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                </label>
            </div>
            <div className="px-6 pb-4 pt-4">
                <PrimaryButton onClick={onProceed} disabled={!reason}>
                    Proceed
                </PrimaryButton>
            </div>
        </DialogShell>
    );
}

function ConfirmDialog({ config, onYes, onClose }) {
    return (
        <DialogShell onClose={onClose} labelledBy="account-action-confirm-title">
            <div className="px-6 pt-8 text-center">
                <h2 id="account-action-confirm-title" className="font-heading text-xl font-bold leading-6 text-white">
                    {config.confirmTitle}
                </h2>
            </div>
            <div className="grid grid-cols-2 gap-3 px-6 pb-2 pt-6">
                <PrimaryButton onClick={onYes}>Yes</PrimaryButton>
                <SecondaryButton onClick={onClose}>No</SecondaryButton>
            </div>
        </DialogShell>
    );
}

function SuccessDialog({ config, onClose }) {
    return (
        <DialogShell onClose={onClose} labelledBy="account-action-success-title">
            <div className="px-4 pt-8 text-center">
                <h2 id="account-action-success-title" className="font-heading text-xl font-bold leading-7 text-white">
                    {config.successTitle}
                </h2>
            </div>
            <div className="px-6 pb-4 pt-6">
                <PrimaryButton onClick={onClose}>{config.successButton}</PrimaryButton>
            </div>
        </DialogShell>
    );
}

export default function AccountActionButton({ action, children, className }) {
    const config = actionConfig[action];
    const [phase, setPhase] = useState(null);
    const [reason, setReason] = useState('');

    const close = () => {
        setPhase(null);
        setReason('');
    };

    const start = () => {
        setPhase(config.reasons ? 'reason' : 'success');
    };

    return (
        <>
            <button type="button" className={className} onClick={start}>
                {children}
            </button>

            {phase === 'reason' && (
                <ReasonDialog
                    config={config}
                    reason={reason}
                    setReason={setReason}
                    onProceed={() => setPhase(action === 'block' ? 'confirm' : 'success')}
                    onClose={close}
                />
            )}
            {phase === 'confirm' && (
                <ConfirmDialog
                    config={config}
                    onYes={() => setPhase('success')}
                    onClose={close}
                />
            )}
            {phase === 'success' && (
                <SuccessDialog config={config} onClose={close} />
            )}
        </>
    );
}
