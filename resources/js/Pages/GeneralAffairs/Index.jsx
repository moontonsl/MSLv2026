import { Head, Link } from '@inertiajs/react';
import { Check, Gem, Gift, HeartHandshake, UserPlus, Users } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import { SiGmail } from 'react-icons/si';
import DepartmentBadge from '@/Components/DepartmentBadge';
import HoverOutline from '@/Components/HoverOutline';
import { PUBLIC_ROUTES } from '@/data/siteNavigation';
import {
    GA_DIAMOND_PERKS,
    GA_DIAMOND_POOL,
    GA_DIVISIONS,
    GA_LEADERSHIP,
    GA_PROCESS,
} from '@/data/generalAffairsData';
import typography from '../ContentMedia.module.css';
import styles from './GeneralAffairs.module.css';

const PRIMARY_BUTTON = `${styles.primaryButton} inline-flex min-h-[60px] w-full items-center justify-center gap-3 rounded-xl bg-green-600 px-7 py-4 font-semibold text-white hover:text-white sm:w-auto`;
const SECONDARY_BUTTON = `${styles.secondaryButton} inline-flex min-h-[60px] w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-[#18181b] px-7 py-4 font-semibold text-gray-200 hover:text-white sm:w-auto`;

function Pill({ icon: Icon, children }) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 font-inter text-xs font-bold uppercase leading-[18px] tracking-wider text-green-400">
            {Icon ? <Icon className="h-3.5 w-3.5" aria-hidden="true" /> : null}
            {children}
        </span>
    );
}

function Monogram({ person, className = '' }) {
    if (person.image) {
        return <img src={person.image} alt="" className={`${typography.posterImage} h-full w-full object-cover object-top ${className}`} />;
    }
    return (
        <span
            aria-hidden="true"
            className={`${typography.posterImage} flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(74,222,128,0.22),transparent_60%),linear-gradient(160deg,#0f2418,#0b0b0b)] font-heading text-5xl font-extrabold text-green-300/80 sm:text-6xl ${className}`}
        >
            {person.name.charAt(0)}
        </span>
    );
}

export default function GeneralAffairsIndex() {
    const { head, divisionHeads } = GA_LEADERSHIP;

    return (
        <>
            <Head title="General Affairs Department">
                <link head-key="csmd-raleway" rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Raleway:wght@700&display=swap" />
            </Head>

            <MainLayout fullWidth>
                <div className={`${styles.page} ${typography.typography} ${typography.interactionScope} overflow-hidden bg-[#050505] text-white`}>
                    {/* ================= HERO ================= */}
                    <section className="relative border-b border-white/10">
                        <div className="absolute -left-40 top-0 h-96 w-96 rotate-12 bg-green-600/10 blur-3xl" />
                        <div className="absolute -right-32 bottom-0 h-96 w-96 bg-emerald-400/10 blur-3xl" />

                        <div className="relative mx-auto grid max-w-7xl gap-14 px-4 py-12 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
                            <div className="text-center lg:text-left">
                                <DepartmentBadge icon={HeartHandshake} tone="green" className={typography.departmentBadge}>
                                    General Affairs Department
                                </DepartmentBadge>

                                <h1 className={`mx-auto mt-6 max-w-3xl text-white lg:mx-0 ${typography.heroTitle}`}>
                                    The Heart of the <br />
                                    <span className="text-green-400">Organization.</span>
                                </h1>
                                <p className={`mx-auto mt-6 max-w-xl text-gray-300 lg:mx-0 ${typography.heroDescription}`}>
                                    We are the Human Resources of MSL Philippines. We complement every other department
                                    by taking care of what matters most: <strong className="font-bold text-white">Our People.</strong>
                                </p>

                                <div className="mt-6 flex flex-col gap-2.5 sm:flex-row lg:mt-8">
                                    <Link href={PUBLIC_ROUTES.careers} className={PRIMARY_BUTTON}>
                                        Join The Team
                                        <UserPlus className="h-5 w-5" aria-hidden="true" />
                                    </Link>
                                    <a href="#support-system" className={SECONDARY_BUTTON}>
                                        How We Work
                                    </a>
                                </div>
                            </div>

                            {/* Hero visual (desktop), same composition as the Campus hero */}
                            <div className="relative mx-auto hidden w-full max-w-lg lg:block">
                                <div className={`${styles.heroPhoto} relative mx-auto w-[64%] overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-2xl shadow-green-950/40`}>
                                    <div className="aspect-[5/4] overflow-hidden">
                                        <img
                                            src="/Images/Home/msl-network.jpeg"
                                            alt="MSL student leaders working together"
                                            className={`${styles.portraitImage} h-full w-full object-cover`}
                                        />
                                    </div>
                                    <div className="px-5 py-5 text-center">
                                        <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-green-500/15 text-green-400">
                                            <Users className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                        <div className="mt-3 font-bold">New Recruits</div>
                                        <div className="text-xs text-gray-400">Onboarding in progress</div>
                                    </div>
                                </div>

                                <div className="absolute left-0 top-[-10px] w-48 -rotate-6 rounded-xl border border-white/10 bg-slate-950/70 p-4 shadow-xl backdrop-blur">
                                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-300">
                                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-500/15 text-green-400">
                                            <Gift className="h-4 w-4" aria-hidden="true" />
                                        </span>
                                        Rewards
                                    </div>
                                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
                                        <div className="h-full w-4/5 bg-green-500" />
                                    </div>
                                    <div className="mt-2 text-sm font-bold">Diamond Payouts</div>
                                </div>

                                <div className="absolute bottom-[-20px] right-[-10px] w-52 rotate-3 rounded-2xl border border-white/10 bg-slate-950/70 p-4 shadow-xl backdrop-blur">
                                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-300">
                                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-500/15 text-green-400">
                                            <Check className="h-4 w-4" aria-hidden="true" />
                                        </span>
                                        Tasks
                                    </div>
                                    {['Performance Review', 'Volunteer Audit'].map((task) => (
                                        <div key={task} className="mt-2.5 flex items-center gap-2 text-xs text-slate-300">
                                            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-sm bg-green-500 text-black">
                                                <Check className="h-2.5 w-2.5" strokeWidth={3} aria-hidden="true" />
                                            </span>
                                            {task}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ================= PROCESS ================= */}
                    <section aria-label="What General Affairs does" className="border-b border-white/10 bg-[#0b0b0b]">
                        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 sm:gap-4 sm:px-6 lg:grid-cols-4">
                            {GA_PROCESS.map(({ id, title, description, icon: Icon }) => (
                                <article key={id} className={`${styles.card} rounded-2xl border border-white/10 bg-[#111111] px-4 py-7 text-center sm:px-6`}>
                                    <span className={`${styles.cardIcon} mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-green-400`}>
                                        <Icon className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                    <h3 className="mt-4 text-base font-bold text-white sm:text-lg">{title}</h3>
                                    <p className="mt-1.5 text-xs text-gray-400 sm:text-sm">{description}</p>
                                    <HoverOutline />
                                </article>
                            ))}
                        </div>
                    </section>

                    {/* ================= THE SUPPORT SYSTEM ================= */}
                    <section id="support-system" aria-labelledby="support-system-title" className="bg-[#050505]">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6">
                            <div className="text-center">
                                <Pill>Internal Structure</Pill>
                                <h2 id="support-system-title" className={`mt-4 ${typography.sectionTitle}`}>The Support System</h2>
                                <p className={`mx-auto mt-4 max-w-2xl text-gray-400 ${typography.sectionDescription}`}>
                                    Everything that other departments don’t do, we do. We fill the gaps to create a seamless organization.
                                </p>
                            </div>

                            <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 lg:mt-20">
                                {GA_DIVISIONS.map(({ id, title, description, icon: Icon, accent }) => (
                                    <article
                                        key={id}
                                        style={{ '--accent': accent }}
                                        className={`${styles.card} relative flex h-full flex-col overflow-hidden rounded-xl border border-neutral-800 bg-[#191919] p-6`}
                                    >
                                        <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: `rgb(${accent})` }} aria-hidden="true" />
                                        <div
                                            className={`${styles.cardIcon} flex h-12 w-12 items-center justify-center rounded-lg border`}
                                            style={{ color: `rgb(${accent})`, borderColor: `rgb(${accent} / 30%)`, backgroundColor: `rgb(${accent} / 10%)` }}
                                        >
                                            <Icon className="h-6 w-6" aria-hidden="true" />
                                        </div>
                                        <h3 className="mt-6 font-inter text-xl font-bold leading-8 text-white">{title}</h3>
                                        <p className="mt-3 font-inter text-sm leading-[22px] text-gray-400">{description}</p>
                                        <HoverOutline />
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ================= THE DIAMOND ECONOMY ================= */}
                    <section aria-labelledby="diamond-economy-title" className="relative border-y border-white/10 bg-[#07110b]">
                        <div className="absolute right-0 top-1/2 h-96 w-96 -translate-y-1/2 bg-green-500/10 blur-3xl" aria-hidden="true" />
                        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14">
                            <div>
                                <Pill icon={Gift}>Exclusive Perk</Pill>
                                <h2 id="diamond-economy-title" className={`mt-4 ${typography.sectionTitle}`}>The Diamond Economy</h2>
                                <p className={`mt-5 text-gray-300 ${typography.sectionDescription}`}>
                                    At MSL Philippines, passion pays off. General Affairs manages a proprietary compensation system
                                    where student leaders and volunteers earn <strong className="font-bold text-white">Mobile Legends Diamonds</strong> for
                                    their contributions.
                                </p>
                                <ul className="mt-8 space-y-5">
                                    {GA_DIAMOND_PERKS.map(({ id, title, description, icon: Icon }) => (
                                        <li key={id} className="flex gap-4">
                                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
                                                <Icon className="h-4 w-4" aria-hidden="true" />
                                            </span>
                                            <div>
                                                <p className="font-bold text-white">{title}</p>
                                                <p className="mt-0.5 text-sm text-gray-400">{description}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className={`${styles.card} rounded-3xl border border-white/10 bg-[#121212] p-6 sm:p-8`}>
                                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
                                    <div>
                                        <p className="text-sm text-gray-400">{GA_DIAMOND_POOL.label}</p>
                                        <p className="mt-1 flex items-center gap-2 font-heading text-3xl font-extrabold sm:text-4xl">
                                            {GA_DIAMOND_POOL.value}
                                            <Gem className="h-5 w-5 text-sky-400" aria-hidden="true" />
                                        </p>
                                    </div>
                                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/10 text-sky-400">
                                        <Gem className="h-6 w-6" aria-hidden="true" />
                                    </span>
                                </div>
                                <ul className="mt-5 space-y-3" aria-label="Example payouts">
                                    {GA_DIAMOND_POOL.payouts.map((amount) => (
                                        <li key={amount} className="flex items-center gap-3 rounded-xl bg-white/[0.04] px-4 py-4">
                                            <span className="h-8 w-8 shrink-0 rounded-full bg-slate-600/70" aria-hidden="true" />
                                            <span className="h-2 w-24 rounded-full bg-slate-600/70" aria-hidden="true" />
                                            <span className="ml-auto flex items-center gap-1.5 font-bold text-green-400">
                                                {amount}
                                                <Gem className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                <HoverOutline />
                            </div>
                        </div>
                    </section>

                    {/* ================= LEADERSHIP (same layout as Campus / Contents) ================= */}
                    <section aria-labelledby="ga-leadership-title" className="border-t border-white/10 bg-[#0b0b0b]">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6">
                            <div className="text-center">
                                <h2 id="ga-leadership-title" className={typography.sectionTitle}>Leadership</h2>
                                <p className={`mt-4 text-gray-400 ${typography.sectionDescription}`}>The people taking care of the people.</p>
                            </div>

                            <article className="relative mx-auto mt-12 flex max-w-3xl flex-col overflow-hidden rounded-[2rem] border border-neutral-800 bg-[#111111] p-4 md:flex-row lg:mt-20 lg:p-5">
                                <div className={`${typography.zoomFrame} aspect-square w-full shrink-0 overflow-hidden rounded-t-2xl md:w-5/12 md:self-center md:rounded-l-2xl md:rounded-tr-none`}>
                                    <Monogram person={head} />
                                </div>
                                <div className="flex min-w-0 flex-1 flex-col justify-center rounded-b-2xl bg-[#1e1e1e] p-4 sm:p-6 md:rounded-b-none md:rounded-r-2xl">
                                    <p className={`uppercase text-green-400 ${typography.featuredRole}`}>{head.role}</p>
                                    <h3 className={`mt-2 text-xl font-bold leading-7 text-white sm:text-2xl sm:leading-8 lg:text-subsection ${typography.ralewayTitle}`}>{head.name}</h3>
                                    <blockquote className={`mt-5 border-l-2 border-green-400 pl-4 italic text-gray-300 ${typography.featuredQuote}`}>“{head.quote}”</blockquote>
                                </div>
                                <HoverOutline color="#4ade80" />
                            </article>

                            <div className="mt-12 border-t border-neutral-800 pt-8 lg:mt-16">
                                <h3 className="mb-6 font-inter text-sm font-bold uppercase leading-5 text-gray-400 lg:text-xl lg:leading-7">Functional Division Heads</h3>
                                <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
                                    {divisionHeads.map((person) => (
                                        <article key={person.id} className={`${typography.zoomFrame} relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-neutral-800 bg-[#111111]`}>
                                            <Monogram person={person} />
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-3 pt-16 sm:p-4 sm:pt-20">
                                                <h4 className="mb-1 font-inter text-xs font-bold leading-[18px] text-white sm:text-sm lg:text-lg lg:leading-7">{person.name}</h4>
                                                <p className="text-[10px] font-semibold uppercase leading-4 tracking-wide text-green-300 lg:text-xs lg:leading-[18px]">{person.role}</p>
                                            </div>
                                            <HoverOutline color="#4ade80" />
                                        </article>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ================= CTA ================= */}
                    <section aria-labelledby="ga-cta-title" className="relative overflow-hidden border-t border-white/10 bg-white/5">
                        <div className="absolute inset-0 bg-green-600/5" aria-hidden="true" />
                        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
                            <h2 id="ga-cta-title" className="font-heading text-3xl font-bold leading-[38px] sm:text-5xl sm:font-extrabold">Need Administrative Support?</h2>
                            <p className="mx-auto mt-5 max-w-2xl text-base leading-[26px] text-gray-300 sm:text-lg sm:leading-8">
                                For concerns on governance, internal reporting, disputes, or official documents, reach out directly to the National Admin for General Affairs.
                            </p>
                            <div className="mt-8 flex justify-center">
                                <a
                                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(head.email)}&su=${encodeURIComponent('MSL General Affairs Inquiry')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Contact the National Admin for General Affairs (opens in a new tab)"
                                    className={PRIMARY_BUTTON}
                                >
                                    <SiGmail className="h-5 w-5" aria-hidden="true" />
                                    Contact National Admin
                                </a>
                            </div>
                        </div>
                    </section>
                </div>
            </MainLayout>
        </>
    );
}
