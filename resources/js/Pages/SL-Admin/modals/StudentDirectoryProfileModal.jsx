import { useEffect } from 'react';

const DETAILS = [
    ['Campus', 'campus'],
    ['Year level', 'yearLevel'],
    ['Course', 'course'],
    ['Email', 'email'],
    ['Phone', 'phone'],
    ['Student ID', 'studentId'],
    ['MLBB IGN', 'ign'],
    ['MLBB ID', 'uid'],
    ['Server', 'server'],
    ['Joined', 'joinedAt'],
    ['Email verified on', 'emailVerifiedAt'],
];

export default function StudentDirectoryProfileModal({ student, onClose }) {
    useEffect(() => {
        if (!student) return undefined;

        const onKeyDown = (event) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [student, onClose]);

    if (!student) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            role="presentation"
            onMouseDown={(event) => event.target === event.currentTarget && onClose()}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="student-directory-title"
                className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#111111] p-5 text-white sm:p-7"
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 id="student-directory-title" className="text-2xl font-bold text-brand-400">{student.name}</h2>
                        <p className="mt-1 text-sm text-gray-400">@{student.account} · {student.status}</p>
                    </div>
                    <button type="button" onClick={onClose} className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10">Close</button>
                </div>
                <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                    {DETAILS.map(([label, field]) => (
                        <div key={field} className="rounded-xl bg-[#1b1b1b] p-3">
                            <dt className="text-xs text-gray-400">{label}</dt>
                            <dd className="mt-1 break-words text-sm font-semibold">{student[field] || '—'}</dd>
                        </div>
                    ))}
                </dl>
                {student.hasProofOfEnrollment ? (
                    <p className="mt-5 text-sm text-gray-400">Proof of enrollment is on file.</p>
                ) : null}
            </section>
        </div>
    );
}
