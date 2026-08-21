import { CalendarDays, ShieldCheck, X } from 'lucide-react';
import { useState } from 'react';

function PromoteDialog({ student, targetRole, onClose }) {
    const [duration, setDuration] = useState('permanent');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    return (
        <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="promote-user-title"
            onMouseDown={(event) => event.target === event.currentTarget && onClose()}
        >
            <div className="relative w-full max-w-[400px] overflow-hidden rounded-2xl border border-white/10 bg-[#121212] shadow-[0_3px_3px_-1.5px_rgba(10,13,18,.04),0_8px_8px_-4px_rgba(10,13,18,.03),0_20px_24px_-4px_rgba(10,13,18,.08)]">
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white/10 hover:text-white"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="space-y-4 px-6 pt-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-500/10 bg-brand-500/10 text-brand-500">
                        <ShieldCheck className="h-6 w-6" />
                    </div>

                    <div className="space-y-1.5">
                        <h2 id="promote-user-title" className="font-heading text-xl font-bold leading-7 text-white">
                            Promote User
                        </h2>
                        <p className="text-sm leading-5 text-gray-300">
                            Are you sure you want to promote{' '}
                            <span className="font-bold leading-[22px]">{student.name}</span> to{' '}
                            <span className="font-bold leading-[22px] text-brand-500">{targetRole}</span>?
                        </p>
                    </div>
                </div>

                <div className="space-y-2 px-5 pt-6">
                    <div className="grid h-11 grid-cols-2 gap-1 rounded-[10px] border border-brand-500/10 bg-brand-500/10 p-1">
                        <button
                            type="button"
                            onClick={() => setDuration('permanent')}
                            className={`rounded-md px-3 text-sm font-semibold leading-5 transition ${
                                duration === 'permanent'
                                    ? 'bg-brand-500 text-gray-900 shadow-sm'
                                    : 'text-gray-300 hover:bg-white/5'
                            }`}
                        >
                            Permanent
                        </button>
                        <button
                            type="button"
                            onClick={() => setDuration('days')}
                            className={`rounded-md px-3 text-sm font-semibold leading-5 transition ${
                                duration === 'days'
                                    ? 'bg-brand-500 text-gray-900 shadow-sm'
                                    : 'text-gray-300 hover:bg-white/5'
                            }`}
                        >
                            For days
                        </button>
                    </div>

                    {duration === 'days' && (
                        <div className="grid gap-2 sm:grid-cols-2">
                            <label className="relative block">
                                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-500" />
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(event) => setStartDate(event.target.value)}
                                    className="h-11 w-full rounded-lg border border-white/10 bg-[#0B0B0B] py-2 pl-10 pr-3 text-sm font-semibold text-white outline-none [color-scheme:dark] focus:border-brand-500 focus:ring-brand-500"
                                />
                            </label>
                            <label className="relative block">
                                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-500" />
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(event) => setEndDate(event.target.value)}
                                    className="h-11 w-full rounded-lg border border-white/10 bg-[#0B0B0B] py-2 pl-10 pr-3 text-sm font-semibold text-white outline-none [color-scheme:dark] focus:border-brand-500 focus:ring-brand-500"
                                />
                            </label>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-3 px-6 pb-6 pt-8">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-11 items-center justify-center rounded-lg border border-brand-500 bg-white/10 px-4 text-base font-semibold leading-6 text-brand-500 shadow-[0_1px_2px_rgba(10,13,18,.05),inset_0_-2px_0_rgba(10,13,18,.05)] transition hover:bg-white/15"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={duration === 'days' && (!startDate || !endDate)}
                        onClick={onClose}
                        className="inline-flex h-11 items-center justify-center rounded-lg border-2 border-white bg-brand-500 px-4 text-base font-semibold leading-6 text-gray-900 shadow-[0_1px_2px_rgba(10,13,18,.05),inset_0_-2px_0_rgba(10,13,18,.05)] transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function PromoteUserButton({ student, targetRole, children, className }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button type="button" className={className} onClick={() => setOpen(true)}>
                {children}
            </button>
            {open && (
                <PromoteDialog
                    student={student}
                    targetRole={targetRole}
                    onClose={() => setOpen(false)}
                />
            )}
        </>
    );
}
