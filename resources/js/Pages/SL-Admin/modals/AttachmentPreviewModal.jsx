import { ExternalLink, FileCheck2, FileText, Image as ImageIcon, Minus, Plus, RotateCcw, ShieldCheck, X } from 'lucide-react';
import { useEffect, useState } from 'react';

function getStudentName(student) {
    return (student?.name || student?.fullName || 'Student User').trim();
}

function getStudentNumber(student) {
    return student?.studentId || student?.studentID || student?.student_id
        || (student?.id ? `2026-${String(student.id).padStart(5, '0')}` : 'N/A');
}

function getProofUrl(student) {
    const proof = student?.proofOfEnrollment;
    if (!proof) return null;
    return /^(https?:)?\/\//.test(proof) ? proof : `/${proof.replace(/^\//, '')}`;
}

function getProofName(student) {
    const proof = student?.proofOfEnrollment;
    return proof ? proof.split('/').pop().split('?')[0] : 'No document uploaded';
}

function isPdfProof(student) {
    return (student?.proofOfEnrollment || '').toLowerCase().split('?')[0].endsWith('.pdf');
}

function DetailCard({ label, value }) {
    return (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.035] px-3.5 py-3">
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
            <dd className="mt-1 truncate text-sm font-semibold text-gray-200" title={value}>{value}</dd>
        </div>
    );
}

export default function AttachmentPreviewModal({ isOpen, onClose, student }) {
    const [zoom, setZoom] = useState(100);

    useEffect(() => {
        if (!isOpen) return undefined;

        const closeOnEscape = (event) => event.key === 'Escape' && onClose();
        window.addEventListener('keydown', closeOnEscape);
        return () => window.removeEventListener('keydown', closeOnEscape);
    }, [isOpen, onClose]);

    useEffect(() => {
        setZoom(100);
    }, [student, isOpen]);

    if (!isOpen) return null;

    const proofUrl = getProofUrl(student);
    const pdf = isPdfProof(student);
    const details = [
        ['Student ID', getStudentNumber(student)],
        ['School', student?.campus || 'N/A'],
        ['Course', student?.course || 'N/A'],
        ['Year Level', student?.yearLevel || 'N/A'],
    ];

    return (
        <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-3 backdrop-blur-md sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="attachment-preview-title"
            onMouseDown={(event) => event.target === event.currentTarget && onClose()}
        >
            <section className="relative flex max-h-[calc(100vh-1.5rem)] w-full max-w-[1220px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a] shadow-2xl sm:max-h-[calc(100vh-3rem)]">
                <header className="flex shrink-0 items-center justify-between border-b border-white/10 px-5 py-4 sm:px-7 sm:py-5">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-500/25 bg-brand-500/10 text-brand-400">
                            <FileCheck2 className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                            <h1 id="attachment-preview-title" className="truncate font-heading text-lg font-bold text-white sm:text-xl">Attachment preview</h1>
                            <p className="truncate text-xs text-gray-500">Reviewing documents for {getStudentName(student)}</p>
                        </div>
                    </div>
                    <button type="button" onClick={onClose} aria-label="Close attachment preview" className="rounded-xl p-2 text-gray-400 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-500">
                        <X className="h-5 w-5" />
                    </button>
                </header>

                <div className="min-h-0 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
                    <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-500">Student information</p>
                            <h2 className="mt-1 font-heading text-2xl font-extrabold text-white">{getStudentName(student)}</h2>
                        </div>
                        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-1.5 text-xs font-semibold text-emerald-300">
                            <ShieldCheck className="h-3.5 w-3.5" /> Enrollment document
                        </div>
                    </div>

                    <dl className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        {details.map(([label, value]) => <DetailCard key={label} label={label} value={value} />)}
                    </dl>

                    <section className="mt-6" aria-labelledby="proof-of-enrollment-title">
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            <div>
                                <h2 id="proof-of-enrollment-title" className="font-heading text-xl font-bold text-white">Proof of Enrollment</h2>
                                <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                                    {pdf ? <FileText className="h-3.5 w-3.5" /> : <ImageIcon className="h-3.5 w-3.5" />}
                                    <span className="max-w-[280px] truncate">{getProofName(student)}</span>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="inline-flex items-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
                                    <button type="button" onClick={() => setZoom((value) => Math.max(50, value - 25))} disabled={zoom <= 50} aria-label="Zoom out" className="p-2 text-gray-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40">
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <button type="button" onClick={() => setZoom(100)} className="min-w-[58px] border-x border-white/10 px-2 py-2 text-xs font-semibold text-gray-300 transition hover:bg-white/10 hover:text-white" aria-label="Reset zoom">
                                        {zoom}%
                                    </button>
                                    <button type="button" onClick={() => setZoom((value) => Math.min(200, value + 25))} disabled={zoom >= 200} aria-label="Zoom in" className="p-2 text-gray-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40">
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                                <button type="button" onClick={() => setZoom(100)} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-gray-300 transition hover:border-brand-500/50 hover:text-brand-400">
                                    <RotateCcw className="h-3.5 w-3.5" /> Reset
                                </button>
                                {proofUrl ? (
                                    <a href={proofUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-gray-300 transition hover:border-brand-500/50 hover:text-brand-400">
                                        Open in new tab <ExternalLink className="h-3.5 w-3.5" />
                                    </a>
                                ) : null}
                            </div>
                        </div>

                        <div className="mt-4 flex min-h-[360px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#111111] p-2 sm:min-h-[440px] sm:p-4">
                            {proofUrl ? (
                                pdf ? (
                                    <iframe src={proofUrl} title="Proof of enrollment PDF" className="h-[58vh] min-h-[340px] w-full rounded-xl bg-white" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center center' }} />
                                ) : (
                                    <img src={proofUrl} alt="Proof of enrollment" className="max-h-[62vh] w-full rounded-xl object-contain transition-transform duration-200" style={{ transform: `scale(${zoom / 100})` }} />
                                )
                            ) : (
                                <div className="flex flex-col items-center text-center text-gray-500">
                                    <FileText className="h-10 w-10 text-gray-600" />
                                    <p className="mt-3 text-sm font-semibold text-gray-400">No document uploaded</p>
                                    <p className="mt-1 text-xs">The student has not submitted a proof of enrollment yet.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </section>
        </div>
    );
}
