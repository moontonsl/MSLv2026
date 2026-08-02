import { Copy, FileText, Mars, Moon, Venus, X } from 'lucide-react';
import AccountActionButton from './AccountActionDialog';
import { slAdminProfile } from '../slAdminData';

function GenderIcon({ gender, className = 'h-5 w-5' }) {
    const Icon = gender === 'female' ? Venus : Mars;
    return <Icon className={`${className} shrink-0 text-brand-500`} aria-hidden="true" />;
}

function DetailCard({ label, value }) {
    return <div className="rounded-xl bg-[#121212] px-3 py-2"><div className="text-sm leading-6 text-gray-400">{label}</div><div className="break-words text-sm font-semibold leading-6 text-gray-300">{value}</div></div>;
}

export default function InactiveStudentProfileModal({ student, accountView, onClose }) {
    if (!student) return null;

    const studentNumber = `2026-${String(student.id).padStart(5, '0')}`;
    const joinedDate = new Date(2026, 2, 7 + (student.id % 7)).toLocaleDateString('en-US');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-labelledby="inactive-student-profile-title" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
            <div className="relative grid max-h-[calc(100vh-1.5rem)] w-full max-w-[1260px] overflow-y-auto rounded-2xl bg-[#0B0B0B] p-3 shadow-2xl ring-1 ring-brand-500/20 sm:max-h-[calc(100vh-3rem)] sm:gap-6 sm:rounded-3xl sm:p-6 lg:grid-cols-[minmax(300px,367px)_minmax(0,1fr)] lg:items-start lg:overflow-hidden">
                <button type="button" onClick={onClose} aria-label="Close student profile" className="absolute right-5 top-5 z-10 rounded-lg bg-black/60 p-2 text-gray-300 transition hover:bg-white/10 hover:text-white"><X className="h-5 w-5" /></button>
                <aside className="overflow-hidden rounded-xl border border-brand-500/20 bg-[#0B0B0B] pb-6 sm:pb-10">
                    <div className="flex min-h-[260px] flex-col items-center justify-end bg-cover bg-center px-6 pb-5 pt-14 text-center" style={{ backgroundImage: `linear-gradient(180deg, rgba(102,102,102,0) 0%, rgba(0,0,0,.55) 100%), url("${slAdminProfile.cover}")` }}>
                        <div className="flex h-28 w-28 items-center justify-center rounded-2xl border-[2.5px] border-brand-700 bg-[#111111] shadow-sm"><GenderIcon gender={student.gender} className="h-14 w-14" /></div>
                        <div className="mt-3 flex max-w-full items-center justify-center gap-1.5"><h2 className="truncate font-heading text-2xl font-extrabold leading-tight text-brand-400 sm:text-3xl" title={student.name}>{student.name}</h2><GenderIcon gender={student.gender} className="h-5 w-5" /></div>
                        <div className="mt-1 flex flex-wrap items-center justify-center gap-2 text-sm font-semibold text-gray-500"><span>@{student.ign.toLowerCase()}.gg</span><Copy className="h-4 w-4" /><span className="inline-flex items-center gap-1 rounded-md bg-orange-500/20 px-2 py-0.5 text-xs font-medium text-orange-400"><Moon className="h-3 w-3" /> Inactive</span></div>
                    </div>
                    <div className="space-y-3 px-6 pt-5"><DetailCard label="Role" value={student.role} /><DetailCard label="MLBB ID" value={student.uid} /><DetailCard label="Server" value={student.server} /><DetailCard label="IGN" value={student.ign} /></div>
                </aside>
                <section className="min-w-0 rounded-xl border border-brand-500/20 bg-[#0B0B0B] py-6 sm:py-10 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
                    <div className="border-b border-white/10 px-5 pb-5 sm:px-8"><div className="flex items-center justify-between gap-4 pr-9"><h1 id="inactive-student-profile-title" className="font-heading text-2xl font-extrabold text-white sm:text-3xl">Student Information</h1><span className="hidden rounded-md border border-white/10 px-2 py-1 text-xs font-semibold text-gray-400 sm:inline">{accountView}</span></div></div>
                    <div className="space-y-6 px-5 py-6 sm:px-8">
                        <div className="grid gap-6 md:grid-cols-2"><div className="space-y-4"><h3 className="font-heading text-lg font-bold text-brand-500">School Information</h3><div className="space-y-3"><DetailCard label="School" value={student.campus} /><DetailCard label="Year Level" value={student.yearLevel} /><DetailCard label="Course" value="Bachelor of Science in Computer Science" /></div></div><div className="space-y-4"><h3 className="font-heading text-lg font-bold text-brand-500">Contact Details</h3><div className="space-y-3"><DetailCard label="Email" value={`${student.ign.toLowerCase()}@schoolemail.edu.ph`} /><DetailCard label="Phone" value="+63 991 883 9321" /><DetailCard label="Student ID" value={studentNumber} /></div></div></div>
                        <div className="border-t border-white/10 pt-6"><h3 className="font-heading text-lg font-bold text-brand-500">Verification Details</h3><div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><DetailCard label="Joined" value={joinedDate} /><DetailCard label="Verified by" value="Jose Rizal" /><DetailCard label="Verified on" value="3/14/2026" /><DetailCard label="Last Activity" value="10/14/2026" /></div></div>
                        <button type="button" className="flex w-full items-center justify-center gap-2 rounded-xl border border-brand-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-500/10"><FileText className="h-5 w-5" />View Attachment</button>
                        <AccountActionButton action="verify" className="w-full rounded-xl border border-brand-500 bg-brand-500/30 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-500/40">Activate Account</AccountActionButton>
                    </div>
                </section>
            </div>
        </div>
    );
}
