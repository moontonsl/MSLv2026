import { X } from 'lucide-react';
import { useEffect } from 'react';

function getStudentNameParts(student) {
    const parts = (student?.name || student?.fullName || 'Student User').trim().split(/\s+/).filter(Boolean);

    return {
        firstName: parts[0] || 'Student',
        lastName: parts.slice(1).join(' ') || parts[0] || 'User',
    };
}

function getStudentNumber(student) {
    return student?.studentId || student?.studentID || student?.student_id
        || (student?.id ? `2026-${String(student.id).padStart(5, '0')}` : '2025-F1234');
}

function getProofUrl(student) {
    const proof = student?.proofOfEnrollment;
    if (!proof) return 'https://placehold.co/1147x396?text=Proof+of+Enrollment';
    return /^(https?:)?\/\//.test(proof) ? proof : `/${proof.replace(/^\//, '')}`;
}

function DetailCard({ label, value }) {
    return (
        <div className="min-w-0 rounded-xl bg-[#121212] px-3 py-2">
            <dt className="text-base leading-[26px] text-gray-400">{label}</dt>
            <dd className="break-words text-base font-semibold leading-[26px] text-gray-300">{value}</dd>
        </div>
    );
}

function ProgressIndicator() {
    return (
        <div className="w-full max-w-[320px] pt-2" aria-label="Enrollment proof review progress: 25 percent">
            <div className="relative h-14">
                <div className="absolute inset-x-0 top-2 h-2 rounded-full bg-[#E9EAEB]" />
                <div className="absolute left-0 top-2 h-2 w-1/4 rounded-full bg-brand-500" />
                <ProgressStop label="0%" position="left-0" />
                <ProgressStop label="25%" position="left-[calc(25%-12px)]" />
            </div>
        </div>
    );
}

function ProgressStop({ label, position }) {
    return (
        <div className={`absolute top-0 ${position} flex w-6 flex-col items-center`}>
            <span className="h-6 w-6 rounded-full border-2 border-brand-500 bg-[#18181B] shadow-md" />
            <span className="mt-2 whitespace-nowrap text-center text-base font-medium leading-6 text-gray-300">{label}</span>
        </div>
    );
}

export default function AttachmentPreviewModal({ isOpen, onClose, student }) {
    useEffect(() => {
        if (!isOpen) return undefined;

        const closeOnEscape = (event) => event.key === 'Escape' && onClose();
        window.addEventListener('keydown', closeOnEscape);
        return () => window.removeEventListener('keydown', closeOnEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const { firstName, lastName } = getStudentNameParts(student);
    const details = [
        ['First Name', firstName],
        ['Last Name', lastName],
        ['Student ID', getStudentNumber(student)],
        ['School', student?.campus || 'West Visayas State University'],
        ['Course', student?.course || 'Bachelor of Science in Computer Science'],
        ['Year Level', student?.yearLevel || 'Alumni'],
    ];
    const desktopColumns = [[details[0], details[3]], [details[1], details[4]], [details[5], details[2]]];

    return (
        <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="attachment-preview-title"
            onMouseDown={(event) => event.target === event.currentTarget && onClose()}
        >
            <section className="relative flex max-h-[calc(100vh-1.5rem)] w-full max-w-[1211px] flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0B0B0B] shadow-2xl sm:max-h-[calc(100vh-3rem)]">
                <header className="flex shrink-0 items-center justify-between border-b border-white/10 px-6 py-5 sm:px-8 sm:py-6">
                    <h1 id="attachment-preview-title" className="font-heading text-xl font-bold leading-7 text-white sm:text-3xl sm:font-extrabold sm:leading-[38px]">Attachment preview</h1>
                    <button type="button" onClick={onClose} aria-label="Close attachment preview" className="rounded-lg p-2 text-gray-300 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-500">
                        <X className="h-5 w-5" />
                    </button>
                </header>

                <div className="min-h-0 overflow-y-auto px-6 py-5 sm:px-8 sm:py-6">
                    <section aria-labelledby="student-information-title">
                        <h2 id="student-information-title" className="font-heading text-xl font-bold leading-7 text-white sm:text-3xl sm:font-extrabold sm:leading-[38px]">Student Information</h2>

                        <dl className="mt-5 grid gap-3 border-b border-white/10 pb-5 sm:hidden">
                            {details.map(([label, value]) => <DetailCard key={label} label={label} value={value} />)}
                        </dl>
                        <div className="mt-5 hidden grid-cols-3 gap-3 sm:grid">
                            {desktopColumns.map((column, index) => (
                                <dl key={index} className="grid content-start gap-4">
                                    {column.map(([label, value]) => <DetailCard key={label} label={label} value={value} />)}
                                </dl>
                            ))}
                        </div>
                    </section>

                    <section className="mt-5 sm:mt-6" aria-labelledby="proof-of-enrollment-title">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
                            <h2 id="proof-of-enrollment-title" className="font-heading text-xl font-bold leading-7 text-white sm:text-3xl sm:font-extrabold sm:leading-[38px]">Proof of Enrollment</h2>
                            <ProgressIndicator />
                        </div>
                        <div className="mt-4 flex min-h-[372px] items-center justify-center overflow-hidden rounded-2xl bg-[#121212] sm:mt-5 sm:min-h-[396px]">
                            <img src={getProofUrl(student)} alt="Proof of enrollment" className="h-full max-h-[65vh] w-full object-contain" />
                        </div>
                    </section>
                </div>
            </section>
        </div>
    );
}
