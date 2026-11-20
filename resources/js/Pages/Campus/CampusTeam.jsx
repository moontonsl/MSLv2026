import { useEffect, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, Description } from '@headlessui/react';
import { Check, Copy, GraduationCap, Mail, MapPin, School, Users, X } from 'lucide-react';
import { SiGmail } from 'react-icons/si';
import toast from 'react-hot-toast';
import HoverOutline from '@/Components/HoverOutline';
import typography from '../ContentMedia.module.css';
import styles from './Campus.module.css';
import { campusTeamProfiles } from './campusTeamData';
import Pagination from '@/Components/Admin/AdminPagination';

// Gold portraits retain the normalised 3:4 framing used by the original cards.
const cardImage = (profile) => `/Images/Campus/Team/gold/${profile.id}.png`;

// Regional admins are grouped by island from their region label (NCR counts as Luzon).
const landOf = (profile) => {
    if (/visayas/i.test(profile.role)) return 'visayas';
    if (/mindanao/i.test(profile.role)) return 'mindanao';
    return 'luzon';
};

// Same subsection style as Contents & Social Media "On-Air Talent": icon tile + title.
const TEAM_SECTIONS = [
    { id: 'luzon', title: 'Luzon', icon: MapPin, match: (p) => p.group === 'regional' && landOf(p) === 'luzon' },
    { id: 'visayas', title: 'Visayas', icon: MapPin, match: (p) => p.group === 'regional' && landOf(p) === 'visayas' },
    { id: 'mindanao', title: 'Mindanao', icon: MapPin, match: (p) => p.group === 'regional' && landOf(p) === 'mindanao' },
    { id: 'shs', title: 'Senior High School', icon: GraduationCap, match: (p) => p.group === 'shs' },
    { id: 'support', title: 'Campus Support Team', icon: Users, match: (p) => p.group === 'support' },
];

const SCHOOLS_PER_PAGE = 5; // longer school lists are paginated in the pop-up

const inquirySubject = (profile) => `MSL Campus Inquiry for ${profile.name}`;
const gmailComposeUrl = (profile) =>
    `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profile.email)}&su=${encodeURIComponent(inquirySubject(profile))}`;

function TalentCard({ profile, onOpen }) {
    return (
        <button
            type="button"
            onClick={() => onOpen(profile)}
            aria-haspopup="dialog"
            aria-label={`View ${profile.name}, ${profile.role}: schools handled and contact`}
            className={`${typography.poster} ${styles.talentCard} group block w-full overflow-hidden rounded-2xl border border-neutral-800 bg-[#111111] text-left focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#F2C21A]`}
        >
            <div className={styles.talentFrame}>
                {/* Pre-framed 3:4 portrait: every face is the same size and position. */}
                <img src={cardImage(profile)} alt="" loading="lazy" className={typography.posterImage} />
                <div className="absolute bottom-0 z-[2] w-full bg-gradient-to-t from-black via-black/70 to-transparent p-3 pt-16 sm:p-4 sm:pt-20">
                    <h4 className="mb-1 font-inter text-xs font-bold leading-[18px] text-white sm:text-sm lg:text-lg lg:leading-7">{profile.name}</h4>
                    <p className="text-[10px] font-semibold uppercase leading-4 tracking-wide text-[#F2C21A] lg:text-xs lg:leading-[18px]">{profile.role}</p>
                </div>
            </div>
            <HoverOutline />
        </button>
    );
}

function TeamMemberModal({ profile, onClose }) {
    const [copied, setCopied] = useState(false);
    const [schoolPage, setSchoolPage] = useState(1);
    const schools = profile?.schools ?? [];
    const schoolPageCount = Math.max(1, Math.ceil(schools.length / SCHOOLS_PER_PAGE));
    const pageSchools = schools.slice((schoolPage - 1) * SCHOOLS_PER_PAGE, schoolPage * SCHOOLS_PER_PAGE);

    useEffect(() => {
        setCopied(false);
        setSchoolPage(1);
    }, [profile?.id]);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(profile.email);
            setCopied(true);
            toast.success('Email copied', { id: 'campus-team-email' });
        } catch {
            toast(profile.email, { id: 'campus-team-email' });
        }
    };

    return (
        <Dialog open={Boolean(profile)} onClose={onClose} className="relative z-[100]">
            <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4">
                {profile ? (
                    <DialogPanel
                        className={`${styles.teamModal} relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#111111] text-white shadow-2xl`}
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close"
                            className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-gray-300 transition-colors hover:bg-black hover:text-white"
                        >
                            <X className="h-5 w-5" aria-hidden="true" />
                        </button>

                        {/* Header */}
                        <div className="flex items-center gap-4 border-b border-white/10 p-5 sm:p-6">
                            <img src={cardImage(profile)} alt="" className="h-20 w-16 shrink-0 rounded-xl object-cover object-top" />
                            <div className="min-w-0 pr-10">
                                <p className="text-[11px] font-bold uppercase tracking-wider text-[#F2C21A]">{profile.role}</p>
                                <DialogTitle className="mt-1 text-2xl font-bold leading-tight">{profile.name}</DialogTitle>
                                <Description className="mt-1 text-sm text-gray-400">
                                    {schools.length > 0 ? `Handles ${schools.length} ${schools.length === 1 ? 'school' : 'schools'}` : 'Campus team member'}
                                </Description>
                            </div>
                        </div>

                        <div className="p-5 sm:p-6">
                            {/* Schools handled */}
                            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                                <School className="h-4 w-4 text-[#F2C21A]" aria-hidden="true" />
                                Schools Handled
                            </h3>
                            {/* Fixed-height area: always fits SCHOOLS_PER_PAGE one-line rows, so the
                                pop-up keeps the same size whether someone has 1 school or 17. */}
                            <div className={`mt-3 ${styles.teamSchoolList}`}>
                                {schools.length > 0 ? (
                                    <ul className="space-y-1.5" aria-live="polite">
                                        {pageSchools.map((school) => (
                                            <li key={school} title={school} className="flex h-9 items-center gap-2.5 rounded-lg bg-white/[0.03] px-3 text-sm text-gray-200">
                                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#F2C21A]" aria-hidden="true" />
                                                <span className="min-w-0 truncate">{school}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="flex h-full items-center justify-center rounded-lg border border-dashed border-white/10 text-sm text-gray-400">
                                        No schools assigned yet.
                                    </p>
                                )}
                            </div>

                            {/* Status + pagination row: always takes the same space. */}
                            <div className="mt-3 flex min-h-9 flex-wrap items-center justify-between gap-2">
                                <p role="status" aria-live="polite" aria-atomic="true" className="text-xs text-gray-400">
                                    {schools.length > 0
                                        ? `Showing ${(schoolPage - 1) * SCHOOLS_PER_PAGE + 1}–${Math.min(schoolPage * SCHOOLS_PER_PAGE, schools.length)} of ${schools.length} ${schools.length === 1 ? 'school' : 'schools'}`
                                        : '0 schools'}
                                </p>
                                {schoolPageCount > 1 ? (
                                    <div className="overflow-x-auto">
                                        <div className="min-w-max">
                                            <Pagination
                                                currentPage={schoolPage}
                                                pageCount={schoolPageCount}
                                                onChange={setSchoolPage}
                                                ariaLabel={`${profile.name}'s schools pagination`}
                                            />
                                        </div>
                                    </div>
                                ) : null}
                            </div>

                            {/* Email + connect (same layout with or without an email) */}
                            <h3 className="mt-5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                                <Mail className="h-4 w-4 text-[#F2C21A]" aria-hidden="true" />
                                Email
                            </h3>
                            <div className="mt-3 flex h-[50px] items-center gap-2 rounded-xl border border-white/10 bg-[#0b0b0b] py-1.5 pl-4 pr-1.5">
                                <span className={`min-w-0 flex-1 truncate text-sm ${profile.email ? 'text-gray-200' : 'text-gray-500'}`}>
                                    {profile.email || 'Email not available yet'}
                                </span>
                                {profile.email ? (
                                    <button
                                        type="button"
                                        onClick={copy}
                                        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-xs font-semibold text-gray-200 transition-colors hover:bg-white/10"
                                    >
                                        {copied ? <Check className="h-3.5 w-3.5 text-green-400" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
                                        {copied ? 'Copied' : 'Copy'}
                                    </button>
                                ) : null}
                            </div>
                            {/* MSL yellow button (same colours as the site's yellow buttons). Opens a
                                ready-to-send email in Gmail, so it works without a desktop mail app. */}
                            {profile.email ? (
                                <a
                                    href={gmailComposeUrl(profile)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`Contact ${profile.name} by email (opens in a new tab)`}
                                    className={`${styles.applyButton} mt-5 inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl border border-[#D4A810] bg-[#F2C21A] px-5 text-[15px] font-semibold text-[#18181B] hover:text-[#18181B] focus-visible:text-[#18181B]`}
                                >
                                    <SiGmail className="h-4 w-4" aria-hidden="true" />
                                    Contact {profile.name}
                                </a>
                            ) : (
                                <button
                                    type="button"
                                    disabled
                                    className="mt-5 inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl border border-[#D4A810] bg-[#F2C21A] px-5 text-[15px] font-semibold text-[#18181B] opacity-40"
                                >
                                    <SiGmail className="h-4 w-4" aria-hidden="true" />
                                    Contact {profile.name}
                                </button>
                            )}
                        </div>
                    </DialogPanel>
                ) : null}
            </div>
        </Dialog>
    );
}

export default function CampusTeam() {
    const head = campusTeamProfiles[0];
    const members = campusTeamProfiles.filter((profile) => profile.id !== head.id);
    const [selected, setSelected] = useState(null);
    const open = (profile) => setSelected(profile);
    const close = () => setSelected(null);

    return (
        <>
            <div className="text-center">
                <h2 className={typography.sectionTitle}>Meet the Campus Team</h2>
                <p className={`mt-4 text-gray-400 ${typography.sectionDescription}`}>
                    Dedicated managers ensuring every school and region gets the support it needs.
                </p>
            </div>

            {/* Department Head */}
            <article className="relative mx-auto mt-12 flex max-w-3xl flex-col overflow-hidden rounded-[2rem] border border-neutral-800 bg-[#111111] p-4 md:flex-row lg:mt-20 lg:p-5">
                <div style={head.portraitFrame}
                    className={`portrait-glass ${typography.zoomFrame} ${styles.teamPortrait} cursor-pointer aspect-square w-full shrink-0 overflow-hidden rounded-t-2xl focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#F2C21A] md:w-5/12 md:self-center md:rounded-l-2xl md:rounded-tr-none`}>
                    <img src={head.image} alt={head.name} className={`${typography.posterImage} h-full w-full object-cover object-top`} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center rounded-b-2xl bg-[#1e1e1e] p-4 sm:p-6 md:rounded-b-none md:rounded-r-2xl">
                    <p className={`uppercase text-[#F2C21A] ${typography.featuredRole}`}>{head.role}</p>
                    <h3 className={`mt-2 text-xl font-bold leading-7 text-white sm:text-2xl sm:leading-8 lg:text-subsection ${typography.ralewayTitle}`}>{head.name}</h3>
                    <blockquote className={`mt-5 whitespace-pre-line border-l-2 border-[#F2C21A] pl-4 italic text-gray-300 ${typography.featuredQuote}`}>{head.quote}</blockquote>
                </div>
                <HoverOutline color="#F2C21A" />
            </article>

            {/* Team, grouped like the Contents & Social Media talent section */}
            {TEAM_SECTIONS.map((section) => {
                const people = members.filter(section.match);
                if (people.length === 0) return null;
                const Icon = section.icon;
                return (
                    <section key={section.id} aria-labelledby={`campus-team-${section.id}`} className="mt-14 lg:mt-20">
                        <div className="mb-8 flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#F2C21A]/20 bg-[#F2C21A]/10 lg:h-14 lg:w-14">
                                <Icon className="h-5 w-5 text-[#F2C21A] lg:h-7 lg:w-7" aria-hidden="true" />
                            </span>
                            <h3 id={`campus-team-${section.id}`} className={`text-white ${typography.subsectionTitle}`}>
                                {section.title}
                            </h3>
                            <span className="ml-1 rounded-full border border-white/10 px-2.5 py-0.5 text-xs font-semibold text-gray-400">
                                {people.length}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
                            {people.map((profile) => (
                                <TalentCard key={profile.id} profile={profile} onOpen={open} />
                            ))}
                        </div>
                    </section>
                );
            })}

            <TeamMemberModal profile={selected} onClose={close} />
        </>
    );
}
