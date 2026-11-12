import { useEffect, useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
import {
    ArrowRight,
    Banknote,
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Gift,
    GraduationCap,
    HeartHandshake,
    Layers,
    Medal,
    Megaphone,
    Pencil,
    Shield,
    Trophy,
    Zap,
} from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import DepartmentBadge from '@/Components/DepartmentBadge';
import SupportConfigurator from '@/Components/SupportConfigurator';
import typography from '../ContentMedia.module.css';
import styles from './BuffsSupport.module.css';

const SPONSORSHIP_GUIDELINES_URL = 'https://bit.ly/SponsorshipsByMSL';
const SPONSORSHIP_GUIDELINES_DOWNLOAD_URL = '/downloads/buffs-and-support-quick-application-guide.pdf';

const ROADMAP_STEPS = [
    {
        title: 'Application Process',
        body: 'Submit application for at least 1–2 weeks before for diamonds and tournament lobby, and 2 months before for merchandise and monetary support.',
    },
    {
        title: 'Registration',
        body: 'Participants must pre-register on the MSL website.',
    },
    {
        title: 'Acknowledgement',
        body: 'Official confirmation receipt of approved budget and resources.',
    },
    {
        title: 'Post-Event Report',
        body: 'Submission of winner lists, event reports, and media documentation.',
    },
    {
        title: 'Release of Rewards',
        body: 'Diamonds (3–4 weeks after reports) or funds (45 days after approval).',
    },
];

const EVENT_TYPES = [
    { icon: Trophy, title: 'Tournaments', desc: 'Official campus MLBB competitions' },
    { icon: Megaphone, title: 'Campus Rallies', desc: 'Community activations & showcases' },
    { icon: Pencil, title: 'MLBB School', desc: 'Workshops, clinics & training days' },
];

const PROVIDE_ITEMS = [
    { label: 'Diamonds', value: 'Funding', color: 'text-brand-500', border: 'border-brand-500/25' },
    { label: 'Cash', value: 'Grants', color: 'text-emerald-400', border: 'border-emerald-500/25' },
    { label: 'Tournament Lobby', value: 'Access', color: 'text-sky-400', border: 'border-sky-500/25' },
    { label: 'Merch', value: 'Swag', color: 'text-orange-400', border: 'border-orange-500/25' },
];

const EVENT_PHOTOS = [
    {
        id: 1,
        event: 'Ascend 2025: Sovereign',
        school: 'Technological University of the Philippines - Manila',
        image: '/Images/BuffsSupport/tup-ascend-2025-sovereign.jpg',
        alt: 'Participants at Ascend 2025: Sovereign, Technological University of the Philippines - Manila',
        position: '50% 62%',
    },
    {
        id: 2,
        event: '59th University Intramural Games "SIEVING FOR EXCELLENCE: Shaping Athletes, Building Legacy"',
        school: 'Nueva Ecija University of Science and Technology',
        image: '/Images/BuffsSupport/neust-59th-intramural-games.jpg',
        alt: 'Participants at the 59th University Intramural Games, Nueva Ecija University of Science and Technology',
        position: '50% 68%',
    },
    {
        id: 3,
        event: 'NUlympics 2026',
        school: 'National University Clark',
        image: '/Images/BuffsSupport/nu-clark-nulympics-2026.jpg',
        alt: 'National University Clark students participating in NUlympics 2026',
        position: '50% 40%',
    },
    {
        id: 4,
        event: 'ATENEOLYMPICS 2026',
        school: 'ATENEO DE DAVAO UNIVERSITY',
        image: '/Images/BuffsSupport/ateneo-de-davao-ateneolympics-2026.jpg',
        alt: 'Ateneo de Davao University players competing in ATENEOLYMPICS 2026',
        position: '50% 42%',
    },
    {
        id: 5,
        event: 'PNU Sulo General Assembly: Featuring MLBB',
        school: 'Philippine Normal University Manila',
        image: '/Images/BuffsSupport/pnu-sulo-general-assembly-mlbb.jpg',
        alt: 'Philippine Normal University Manila participants at PNU Sulo General Assembly: Featuring MLBB',
        position: '50% 50%',
    },
    {
        id: 6,
        event: '78th JBLFMU Foundation Esports Tournament',
        school: 'John B. Lacson Foundation Maritime University (Arevalo) Inc.',
        image: '/Images/BuffsSupport/jblfmu-78th-foundation-esports-tournament.jpg',
        alt: 'John B. Lacson Foundation Maritime University (Arevalo) Inc. participants at the 78th JBLFMU Foundation Esports Tournament',
        position: '50% 45%',
    },
];

function EventPhotoCarousel() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [dragX, setDragX] = useState(0);
    const gesture = useRef(null);
    const move = (direction) => setActiveIndex((index) => (index + direction + EVENT_PHOTOS.length) % EVENT_PHOTOS.length);

    const endGesture = (event, cancelled = false) => {
        const start = gesture.current;
        if (!start || start.id !== event.pointerId) return;
        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;
        if (!cancelled && Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1);
        gesture.current = null;
        setDragX(0);
    };

    return (
        <div role="region" aria-roledescription="carousel" aria-label="Event photos" className={styles.eventCarousel}>
            <h2 className={`text-center text-white ${typography.sectionTitle}`}>Event Photos</h2>
            <p className={`mx-auto mt-3 max-w-2xl text-center text-gray-400 ${typography.sectionDescription}`}>
                Capturing memorable moments from our latest tournaments and events.
            </p>
            <div
                className={`${styles.photoStage} ${dragX ? styles.draggingPhotos : ''}`}
                style={{ '--photo-drag': `${dragX}px` }}
                onPointerDown={(event) => {
                    if (!event.isPrimary || event.button !== 0) return;
                    gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
                    event.currentTarget.setPointerCapture(event.pointerId);
                }}
                onPointerMove={(event) => {
                    const start = gesture.current;
                    if (!start || start.id !== event.pointerId) return;
                    const dx = event.clientX - start.x;
                    if (Math.abs(dx) > Math.abs(event.clientY - start.y)) setDragX(Math.max(-80, Math.min(80, dx)));
                }}
                onPointerUp={(event) => endGesture(event)}
                onPointerCancel={(event) => endGesture(event, true)}
                onLostPointerCapture={(event) => endGesture(event, true)}
            >
                {EVENT_PHOTOS.map((photo, index) => {
                    const offset = ((index - activeIndex + EVENT_PHOTOS.length + 2) % EVENT_PHOTOS.length) - 2;
                    const active = offset === 0;
                    return (
                        <div
                            key={photo.id}
                            className={`${styles.photoSlide} ${active ? styles.activePhoto : offset === -1 ? styles.previousPhoto : offset === 1 ? styles.nextPhoto : styles.hiddenPhoto}`}
                            style={Math.abs(offset) > 1 ? { '--hidden-direction': offset < 0 ? -1 : 1 } : undefined}
                            aria-hidden={!active}
                            role={active ? 'group' : undefined}
                            aria-roledescription={active ? 'slide' : undefined}
                            aria-label={active ? `${index + 1} of ${EVENT_PHOTOS.length}` : undefined}
                        >
                            <img src={photo.image} alt={photo.alt} style={{ objectPosition: photo.position || 'center' }} loading="lazy" draggable={false} />
                            <div className={styles.photoCaption}>
                                <span className="block text-sm font-bold sm:text-base">{photo.event}</span>
                                <span className="mt-1 block text-xs text-gray-300 sm:text-sm">{photo.school}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className={styles.photoControls}>
                <button type="button" onClick={() => move(-1)} aria-label="Previous event photo" className={styles.photoArrow}>
                    <ChevronLeft size={18} aria-hidden="true" />
                </button>
                <div className="flex items-center gap-1">
                    {EVENT_PHOTOS.map((photo, index) => (
                        <button
                            key={photo.id}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            aria-label={`Show event photo ${index + 1}`}
                            aria-current={activeIndex === index ? 'true' : undefined}
                            className={styles.photoDot}
                        ><span /></button>
                    ))}
                </div>
                <button type="button" onClick={() => move(1)} aria-label="Next event photo" className={styles.photoArrow}>
                    <ChevronRight size={18} aria-hidden="true" />
                </button>
            </div>
            <p className="sr-only" aria-live="polite" aria-atomic="true">{EVENT_PHOTOS[activeIndex].event}, {EVENT_PHOTOS[activeIndex].school}</p>
        </div>
    );
}

function FieldSelect({ label, required, value, options, onChange, disabled = false }) {
    return (
        <label className="block min-w-0">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400">
                {label}
                {required ? <span className="text-red-500">*</span> : null}
            </span>
            <div className="relative">
                <select
                    value={value}
                    disabled={disabled}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-white/10 bg-[#0b0b0b] px-3.5 py-2.5 pr-10 font-sans text-sm font-medium text-white outline-none transition focus:border-brand-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {options.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
        </label>
    );
}

function AllocationFooter({ amount, selectionKey }) {
    const panelRef = useRef(null);
    const amountRef = useRef(null);
    const previousSelection = useRef(selectionKey);
    const displayedNumber = useRef(Number(amount.match(/[\d,]+/)?.[0]?.replaceAll(',', '')) || 0);

    useEffect(() => {
        // Defaults are immediately readable; animate only after a selection changes.
        if (previousSelection.current === selectionKey) return;
        previousSelection.current = selectionKey;

        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        const numericPart = amount.match(/[\d,]+/);
        const target = numericPart ? Number(numericPart[0].replaceAll(',', '')) : null;
        const from = displayedNumber.current;
        let frame;
        let highlight;

        const finish = () => {
            window.cancelAnimationFrame(frame);
            highlight?.cancel();
            if (amountRef.current) amountRef.current.textContent = amount;
            displayedNumber.current = target ?? 0;
        };

        if (media.matches) {
            finish();
            return;
        }

        highlight = panelRef.current?.animate?.([
            { backgroundColor: 'rgba(242, 194, 26, 0.16)', borderColor: 'rgba(242, 194, 26, 0.7)' },
            { backgroundColor: 'rgba(0, 0, 0, 0.4)', borderColor: 'transparent' },
        ], { duration: 420, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });

        if (target !== null && from !== target) {
            const start = performance.now();
            const renderNumber = (value) => {
                displayedNumber.current = value;
                if (amountRef.current) amountRef.current.textContent = amount.replace(numericPart[0], Math.round(value).toLocaleString('en-PH'));
            };
            renderNumber(from);
            const tick = (time) => {
                const progress = Math.min(1, (time - start) / 420);
                renderNumber(from + (target - from) * (1 - (1 - progress) ** 3));
                if (progress < 1) frame = window.requestAnimationFrame(tick);
            };
            frame = window.requestAnimationFrame(tick);
        } else {
            if (amountRef.current) amountRef.current.textContent = amount;
            displayedNumber.current = target ?? 0;
        }

        const onMotionPreference = () => { if (media.matches) finish(); };
        media.addEventListener('change', onMotionPreference);
        return () => {
            window.cancelAnimationFrame(frame);
            highlight?.cancel();
            media.removeEventListener('change', onMotionPreference);
        };
    }, [amount, selectionKey]);

    return (
        <div className="mt-auto border-t border-white/10 pt-4">
            <div ref={panelRef} className={`${styles.budgetPanel} rounded-xl border border-transparent bg-black/40 px-4 py-3`}>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                    Maximum Allowable Budget
                </p>
                <p
                    className={`font-heading text-2xl font-extrabold tabular-nums ${styles.configAmount}`}
                    aria-hidden="true"
                    ref={amountRef}
                >
                    {amount}
                </p>
                <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">Maximum Allowable Budget: {amount}</span>
            </div>
        </div>
    );
}

function ConfigCard({ icon: Icon, title, children, amount, selectionKey }) {
    return (
        <article className={`${styles.configCard} flex h-full flex-col gap-5 rounded-2xl border p-5 sm:p-6`}>
            <div className="flex items-center gap-3">
                <span
                    className={`${styles.configIcon} inline-flex h-11 w-11 items-center justify-center rounded-xl`}
                >
                    <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-heading text-lg font-bold text-white sm:text-xl">{title}</h3>
            </div>
            <div className="flex flex-1 flex-col gap-4">{children}</div>
            <AllocationFooter amount={amount} selectionKey={selectionKey} />
        </article>
    );
}

function SponsorshipRoadmap() {
    const roadmapRef = useRef(null);
    const [motionState, setMotionState] = useState('off');

    useEffect(() => {
        const roadmap = roadmapRef.current;
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (!roadmap || !window.IntersectionObserver) return;
        let inView = false;
        const updateMotion = () => {
            setMotionState(media.matches ? 'off' : inView && !document.hidden ? 'running' : 'paused');
        };
        const observer = new IntersectionObserver((entries) => {
            inView = entries[0].isIntersecting;
            updateMotion();
        }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
        observer.observe(roadmap);
        media.addEventListener('change', updateMotion);
        document.addEventListener('visibilitychange', updateMotion);
        updateMotion();

        return () => {
            observer.disconnect();
            media.removeEventListener('change', updateMotion);
            document.removeEventListener('visibilitychange', updateMotion);
        };
    }, []);

    return (
        <div className="mx-auto max-w-3xl">
            <ol ref={roadmapRef} data-motion={motionState} className={`relative ${styles.roadmap}`}>
            {ROADMAP_STEPS.map((step, idx) => {
                const isLast = idx === ROADMAP_STEPS.length - 1;
                return (
                    <li key={step.title} style={{ '--step-delay': `${idx * 2}s` }} className={`relative flex gap-4 pb-6 last:pb-0 sm:gap-6 ${styles.roadmapStep}`}>
                        <div className="relative flex w-10 shrink-0 flex-col items-center">
                            {!isLast && (
                                <span aria-hidden="true" className={`absolute top-10 -bottom-6 w-0.5 ${styles.roadmapLine}`} />
                            )}
                            <span
                                className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border font-heading text-base font-bold ${styles.roadmapBadge}`}
                            >
                                {idx + 1}
                            </span>
                        </div>
                        <div className={`min-w-0 flex-1 rounded-2xl border px-5 py-4 sm:px-6 sm:py-5 ${styles.roadmapContent}`}>
                            <svg className={styles.roadmapOutline} aria-hidden="true" focusable="false">
                                <rect x="1" y="1" rx="15" pathLength="100" strokeDasharray="100 100" className={styles.roadmapOutlineStroke} />
                            </svg>
                            <h3 className="font-heading text-lg font-bold text-white sm:text-xl">
                                {step.title}
                            </h3>
                            <p className="mt-1.5 font-sans text-body-sm text-gray-400">{step.body}</p>
                        </div>
                    </li>
                );
            })}
            </ol>
        </div>
    );
}

export default function BuffsAndSupportIndex() {
    return (
        <MainLayout fullWidth>
            <Head title="Buffs & Support">
                <link head-key="csmd-raleway" rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Raleway:wght@700&display=swap" />
            </Head>
            <div className={`${styles.page} ${typography.typography} ${typography.interactionScope} text-white`}>

            {/* Hero */}
            <section className="relative overflow-hidden border-b border-white/10 bg-[#050505]">
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.12]"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
                        backgroundSize: '48px 48px',
                    }}
                />
                <div className="container-page relative py-12 md:py-16 lg:py-20">
                    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
                        <div className="text-center lg:text-left">
                            <DepartmentBadge icon={Zap} tone="gold" className={typography.departmentBadge}>
                                Sponsorship Program
                            </DepartmentBadge>
                            <h1 className={`mt-6 text-white ${typography.heroTitle}`}>
                                Power Up Your{' '}
                                <span className="text-brand-500 drop-shadow-[0_0_24px_rgba(242,194,26,0.35)]">
                                    Events
                                </span>
                            </h1>
                            <p className={`mx-auto mt-6 max-w-xl text-gray-400 lg:mx-0 ${typography.heroDescription}`}>
                                The ultimate support system for student esports. Unlock diamonds,
                                funds, and specialized tools to take your campus tournaments to the
                                next level.
                            </p>
                            <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center lg:mt-8 lg:justify-start">
                                <a
                                    href="https://forms.gle/qADENJyDirsrKE6P9"
                                    className={`${styles.actionButton} ${styles.primaryButton}`}
                                >
                                    Apply for Buffs Now
                                    <ArrowRight className="h-5 w-5" />
                                </a>
                                <a
                                    href={SPONSORSHIP_GUIDELINES_DOWNLOAD_URL}
                                    download="[PUBLIC] Buffs and Support Program - Quick Application Guide.pdf"
                                    className={`${styles.actionButton} ${styles.secondaryButton}`}
                                >
                                    View Quick Application Guide
                                </a>
                            </div>
                        </div>

                        {/* Admin's Blessing card */}
                        <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
                            <div className="pointer-events-none absolute left-1/2 top-1/3 h-48 w-48 -translate-x-1/2 rounded-full bg-brand-500/25 blur-3xl" />
                            <article className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#121212] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.45)] sm:p-8">
                                <div className="flex justify-center">
                                    <span className="rounded-full bg-brand-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-gray-900">
                                        Mythic Item
                                    </span>
                                </div>
                                <div className="relative mx-auto mt-8 flex h-28 w-28 items-center justify-center">
                                    <div className="absolute inset-0 rounded-full bg-brand-500/30 blur-xl" />
                                    <Gift className="relative h-14 w-14 text-brand-400" strokeWidth={1.5} />
                                    <span className="absolute -right-1 top-2 h-2.5 w-2.5 rotate-12 bg-purple-500" />
                                    <span className="absolute bottom-3 -left-2 h-2 w-2 rotate-45 bg-emerald-400" />
                                    <span className="absolute -bottom-1 right-4 h-2 w-2 bg-sky-400" />
                                    <span className="absolute left-6 top-0 h-2 w-2 bg-orange-400" />
                                </div>
                                <h2 className="mt-6 text-center font-heading text-2xl font-extrabold text-white">
                                    Admin&apos;s Blessing
                                </h2>
                                <div className="mx-auto mt-3 h-px w-16 bg-white/15" />
                                <p className="mt-4 text-center font-sans text-sm italic leading-relaxed text-gray-400">
                                    &ldquo;Grants the wielder immense resources to host legendary
                                    campus events. Increases student engagement by 200%.&rdquo;
                                </p>
                                <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-3">
                                    {[
                                        { value: 'SS', label: 'Tier' },
                                        { value: '∞', label: 'Limit' },
                                        { value: '0S', label: 'CD' },
                                    ].map((stat) => (
                                        <div
                                            key={stat.label}
                                            className="rounded-xl border border-white/10 bg-black/40 px-2 py-3 text-center"
                                        >
                                            <div
                                                className={`font-heading text-xl font-extrabold sm:text-2xl ${
                                                    stat.label === 'Tier'
                                                        ? 'text-brand-500'
                                                        : 'text-gray-300'
                                                }`}
                                            >
                                                {stat.value}
                                            </div>
                                            <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                                                {stat.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </section>

            {/* Eligible + Provide */}
            <section className="border-b border-white/10 bg-[#050505] py-12 md:py-16">
                <div className="container-page grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <article className="rounded-2xl border border-white/10 bg-[#121212] p-6 sm:p-8">
                        <div className="flex items-center gap-3">
                            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400">
                                <Shield className="h-5 w-5" />
                            </span>
                            <h2 className="font-heading text-xl font-bold text-white sm:text-2xl">
                                Eligible Event Types
                            </h2>
                        </div>
                        <ul className="mt-6 space-y-3">
                            {EVENT_TYPES.map(({ icon: Icon, title, desc }) => (
                                <li
                                    key={title}
                                    className="flex items-start gap-3 rounded-xl border border-white/5 bg-[#1A1A1A] px-4 py-3.5"
                                >
                                    <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-gray-300">
                                        <Icon className="h-4 w-4" />
                                    </span>
                                    <div>
                                        <p className="font-semibold text-white">{title}</p>
                                        <p className="text-sm text-gray-400">{desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </article>

                    <article className="rounded-2xl border border-white/10 bg-[#121212] p-6 sm:p-8">
                        <div className="flex flex-col items-start gap-4">
                            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500">
                                <Gift className="h-5 w-5" />
                            </span>
                            <h2 className="font-heading text-xl font-bold text-white sm:text-2xl">
                                What We Provide
                            </h2>
                        </div>
                        <div className="mt-6 grid grid-cols-2 gap-3">
                            {PROVIDE_ITEMS.map((item) => (
                                <div
                                    key={item.label}
                                    className={`flex min-h-[100px] flex-col items-center justify-center rounded-xl border bg-[#0b0b0b] px-3 py-5 text-center ${item.border}`}
                                >
                                    <p className={`font-heading text-xl font-extrabold leading-7 sm:text-2xl ${item.color}`}>
                                        {item.label}
                                    </p>
                                    <p
                                        className="mt-1 text-[10px] font-bold uppercase leading-4 tracking-widest text-gray-500"
                                    >
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </article>
                </div>
            </section>

            {/* Event Photos */}
            <section className="border-b border-white/10 bg-[#0B0B0B] py-12 md:py-20">
                <div className="container-page">
                    <EventPhotoCarousel />
                </div>
            </section>

            {/* Tournament Lobby */}
            <section id="tournament-lobby" className="relative overflow-hidden border-b border-white/10 bg-[#0B0B0B] py-12 md:py-20">
                <div className="pointer-events-none absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-violet-600/20 blur-3xl" />
                <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-blue-600/15 blur-3xl" />
                <div className="container-page relative grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
                    <div>
                        <span className="inline-flex rounded-full bg-violet-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-violet-300">
                            The Hub
                        </span>
                        <h2 className={`mt-4 text-white ${typography.sectionTitle}`}>
                            Access the{' '}
                            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                                Tournament Lobby
                            </span>
                        </h2>
                        <p className="mt-4 max-w-lg font-sans text-body-lg text-gray-400">
                            Gain access to official settings, broadcast-ready tools, and
                            professional match infrastructure for your campus events.
                        </p>
                        <ul className="mt-6 space-y-3">
                            {[
                                'Professional Settings',
                                'Official MPL Map',
                                'Real-time Stats',
                                'Broadcast-ready features',
                            ].map((item) => (
                                <li key={item} className="flex items-center gap-2.5 text-sm text-gray-300">
                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <a
                            href="https://forms.gle/GQZWtpVob91riAfh6"
                            className={`mt-8 ${styles.actionButton} ${styles.primaryButton}`}
                        >
                            TL Application
                            <ArrowRight className="h-5 w-5" />
                        </a>
                    </div>

                    <figure className={styles.lobbyPreview}>
                        <img
                            src="/Images/BuffsSupport/tournament-lobby.jpg"
                            alt="MLBB Tournament Lobby showing the blue and red team slots, referee area, and Start Game control"
                            width={2048}
                            height={956}
                            loading="lazy"
                            className={styles.lobbyImage}
                        />
                    </figure>
                </div>
            </section>

            {/* Buff Configurator */}
            <section className="border-b border-white/10 bg-[#050505] py-12 md:py-20">
                <div className="container-page">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className={`text-white ${typography.sectionTitle}`}>
                            Buff Configurator
                        </h2>
                        <p className="mt-3 font-sans text-body-md text-gray-400">
                            Select a package to see the buff value you can get for your community.
                        </p>
                    </div>
                    <div className="mt-10 md:mt-12">
                        <SupportConfigurator ConfigCard={ConfigCard} FieldSelect={FieldSelect} />
                    </div>
                </div>
            </section>

            {/* Sponsorship Roadmap */}
            <section id="roadmap" className="bg-[#050505] py-12 md:py-20">
                <div className="container-page">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className={`text-white ${typography.sectionTitle}`}>
                            Sponsorship Roadmap
                        </h2>
                        <p className="mt-3 font-sans text-body-md text-gray-400">
                            Get your community rewards in 5 simple steps.
                        </p>
                    </div>
                    <div className="mt-10 md:mt-14">
                        <SponsorshipRoadmap />
                    </div>
                    <div
                        id="guidelines"
                        className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
                    >
                        <a
                            href="https://forms.gle/qADENJyDirsrKE6P9"
                            className={`${styles.actionButton} ${styles.primaryButton}`}
                        >
                            Apply for Buffs Now
                            <ArrowRight className="h-5 w-5" />
                        </a>
                        <a
                            href={SPONSORSHIP_GUIDELINES_URL}
                            className={`${styles.actionButton} ${styles.secondaryButton}`}
                        >
                            View Quick Application Guide
                        </a>
                    </div>
                </div>
            </section>
            </div>
        </MainLayout>
    );
}
