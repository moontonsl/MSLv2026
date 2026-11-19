import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { ArrowRight, CheckCircle2, Crown, Diamond, Gamepad2, Gift, MonitorPlay, Network, ShieldCheck, Star, Target, TrendingUp, Trophy, Users, X, Zap } from 'lucide-react';
import { FaDiscord } from 'react-icons/fa';
import MainLayout from '@/Layouts/MainLayout';
import DepartmentBadge from '@/Components/DepartmentBadge';
import SupportApplicationButton from '@/Components/SupportApplicationButton';
import HoverOutline from '@/Components/HoverOutline';
import NetworkLogoWall from '@/Pages/Home/Components/NetworkLogoWall';
import { homeData } from '@/data/homeData';
import { LEADERBOARD, NETWORK_GALLERY, NETWORK_LINKS, NETWORK_TIERS, ORGANIZATION_BUFFS, SPOTLIGHT } from '@/data/mslNetworkData';
import typography from './ContentMedia.module.css';
import styles from './MSLNetwork.module.css';

const number = (value) => value.toLocaleString('en-PH');
const SHOW_PARTNER_LEADERBOARD = false;
const BUFF_ICONS = { financial: Diamond, ecosystem: Gamepad2, industry: Trophy };
const NETWORK_PROGRAMS = [
    {
        title: 'Buffs and Support',
        description: 'Apply for diamond funding, monetary grants, and merchandise support for your community.',
        icon: Diamond,
        href: 'https://forms.gle/qADENJyDirsrKE6P9',
        hoverColor: '#facc15', color: 'text-yellow-400', accent: 'bg-yellow-400',
        frame: 'border-yellow-400/30 bg-yellow-400/10',
    },
    {
        title: 'AirDrops',
        description: 'Apply for available Airdrop packages for your community activities.',
        icon: Gift,
        href: 'https://forms.gle/86NPozxsxoMGBjrPA',
        hoverColor: '#c084fc', color: 'text-purple-400', accent: 'bg-purple-400',
        frame: 'border-purple-400/30 bg-purple-400/10',
    },
    {
        title: 'Tournament Lobby',
        description: 'Request Tournament Lobby access for your organized MLBB events.',
        icon: MonitorPlay,
        href: 'https://forms.gle/GQZWtpVob91riAfh6',
        hoverColor: '#60a5fa', color: 'text-blue-400', accent: 'bg-blue-400',
        frame: 'border-blue-400/30 bg-blue-400/10',
    },
];

function SectionHeading({ id, badge, icon = Network, title, children }) {
    return (
        <div className={styles.sectionHeading}>
            {badge && <DepartmentBadge icon={icon} tone="gold" className={typography.departmentBadge}>{badge}</DepartmentBadge>}
            <h2 id={id} className={typography.sectionTitle}>{title}</h2>
            {children && <p className={typography.sectionDescription}>{children}</p>}
        </div>
    );
}

function ActionLink({ href, secondary = false, children }) {
    if (/^https?:\/\//.test(href)) {
        return <a href={href} target="_blank" rel="noopener noreferrer" className={`${styles.button} ${secondary ? styles.secondaryButton : styles.primaryButton}`}>{children}</a>;
    }
    return <Link href={href} className={`${styles.button} ${secondary ? styles.secondaryButton : styles.primaryButton}`}>{children}</Link>;
}

function TierPanel({ tier }) {
    const details = tier.details;
    const TierIcon = tier.id === 'ss' ? Crown : tier.id === 'a' ? Star : tier.id === 'b' ? TrendingUp : Target;
    return (
        <div className={styles.tierPanel} style={{ '--tier-color': tier.color }}>
            <div className={styles.tierHeader}><h3>{tier.title}</h3><TierIcon size={28} aria-hidden="true" /></div>
            <div className={styles.tierSummary}>
                <div className={styles.allocation}>
                    <span className={styles.eyebrow}>Max allocation</span>
                    <strong>{number(details.allocation)}</strong><small>Diamonds / Semester · MSL Network</small>
                    <Diamond className={styles.allocationIcon} size={42} aria-hidden="true" />
                </div>
                <div className={styles.requirements}>
                    <div className={styles.requirementsHeading}><span className={styles.eyebrow}>Support availability</span><a href={NETWORK_LINKS.guidelines} target="_blank" rel="noopener noreferrer" className={styles.guidelinesLink}>View Guidelines<ArrowRight size={12} aria-hidden="true" /></a></div>
                    <dl className={styles.metrics}>
                        <div><dt>Merchandise</dt><dd>₱{number(details.merchandise)}</dd></div>
                        <div><dt>Airdrop tracks</dt><dd>{details.airdropTracks}</dd></div>
                        <div><dt>Monetary</dt><dd className={styles.eligibilityValue}>{details.monetaryEligible ? 'Eligible' : 'Not eligible'}</dd></div>
                    </dl>
                </div>
            </div>
            <div className={styles.privileges}>
                <div className={styles.inlineLabel}><Star size={18} aria-hidden="true" /><span className={styles.eyebrow}>Perks & privileges</span></div>
                <dl className={styles.perks}>
                    <div><dt>Cross-campus budget</dt><dd>{number(details.crossCampus)} diamonds</dd><small>Maximum per semester for cross-campus support.</small></div>
                    <div><dt>Eligible Airdrop packages</dt><dd>{details.airdropPackages}</dd><small>Subject to officially announced availability. First come, first served.</small></div>
                    <div><dt>Monetary sponsorship</dt><dd>{details.monetaryEligible ? 'Subject to approval' : 'Tier A & Superschools only'}</dd><small>{details.monetaryEligible ? 'Apply at least 2 months before the event. Finance and Sponsorship approval required.' : 'The guide does not provide monetary grants for this tier.'}</small></div>
                </dl>
            </div>
            <div className={styles.compliance}>
                <div className={styles.inlineLabel}><ShieldCheck size={15} aria-hidden="true" /><span className={styles.eyebrow}>Eligibility requirements</span></div>
                <ul><li><CheckCircle2 size={16} aria-hidden="true" />Official MSL Network partner school</li><li><CheckCircle2 size={16} aria-hidden="true" />Event hosted or approved by a student organization or school administration</li></ul>
                <p className={styles.tierSourceNote}>Maximum budgets are subject to the guide’s event allocations and approval requirements. Merchandise applications must be submitted at least 2 months before the event.</p>
            </div>
            <HoverOutline color="var(--tier-color)" />
        </div>
    );
}

export default function MSLNetwork({ networkLogos = [] }) {
    const [tierId, setTierId] = useState('c');
    const [preview, setPreview] = useState(null);
    const selectedTier = NETWORK_TIERS.find((tier) => tier.id === tierId);

    return (
        <MainLayout fullWidth>
            <Head title="The MSL Network"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Raleway:wght@700&display=swap" /></Head>
            <div className={`${styles.page} ${typography.typography} ${typography.interactionScope}`}>
                <section className={styles.hero} aria-labelledby="network-hero-title">
                    <img className={styles.heroImage} src="/Images/Home/campus-scrims.jpg" alt="" fetchPriority="high" />
                    <div className={styles.heroShade} aria-hidden="true" />
                    <div className={`${styles.container} ${styles.heroContent}`}>
                        <DepartmentBadge icon={Network} tone="gold" className={typography.departmentBadge}>THE MSL NETWORK</DepartmentBadge>
                        <h1 id="network-hero-title" className={typography.heroTitle}>Turn Your Esports Org<br className={styles.desktopBreak} />{' '}Into a <span>Powerhouse.</span></h1>
                        <p className={typography.heroDescription}>Unlock the full ecosystem. Secure official resources and funding, access Industry Masterclasses, and join Exclusive Campaigns to professionalize your campus organization.</p>
                        <div className={styles.actions}>
                            <ActionLink href={NETWORK_LINKS.membership}>Apply for Membership<ArrowRight size={20} aria-hidden="true" /></ActionLink>
                            <ActionLink href={NETWORK_LINKS.partner} secondary><Zap size={19} aria-hidden="true" />Already a Partner?</ActionLink>
                        </div>
                    </div>
                </section>

                <div className={styles.allianceStrip}>
                    <div className={styles.container}>
                        {/* Same curved 3D logo wall as the Home page */}
                        <NetworkLogoWall logos={networkLogos.length > 0 ? networkLogos : homeData.network.logos} />
                    </div>
                </div>

                <section className={`${styles.section} ${styles.spotlightSection}`} aria-labelledby="spotlight-title">
                    <div className={styles.container}>
                        <div className={styles.spotlightHeading}><span className={styles.spotlightBadge}><Star size={16} aria-hidden="true" />MVP Spotlight</span><h2 id="spotlight-title" className={styles.eyebrow}>Partner of the month</h2></div>
                        <div className={styles.spotlightGrid}>
                            <figure className={styles.eventPhoto}>
                                <img src={SPOTLIGHT.image} alt={SPOTLIGHT.event} loading="lazy" />
                                <figcaption><h3>{SPOTLIGHT.event}</h3><p>{SPOTLIGHT.caption}</p></figcaption>
                                <HoverOutline color="var(--gold)" />
                            </figure>
                            <div className={styles.spotlightDetails}>
                                <article className={styles.organizationCard}><h3>{SPOTLIGHT.organization}</h3><p className={styles.school}>{SPOTLIGHT.school}</p><blockquote>“{SPOTLIGHT.quote}”</blockquote><HoverOutline color="var(--gold)" /></article>
                                <div className={styles.equippedCard}>
                                    <h3 className={styles.inlineLabel}><Zap size={16} aria-hidden="true" /><span className={styles.eyebrow}>Equipped buffs</span></h3>
                                    <Link href={NETWORK_LINKS.tournamentLobby}><MonitorPlay size={24} aria-hidden="true" /><span><strong>Tournament Lobby</strong><small>+ Pro production</small></span><ArrowRight size={17} aria-hidden="true" /></Link>
                                    <Link href={NETWORK_LINKS.support}><Diamond size={24} aria-hidden="true" /><span><strong>Prize Pool Support</strong><small>+ Cash & diamonds</small></span><ArrowRight size={17} aria-hidden="true" /></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className={styles.section} aria-labelledby="buffs-title">
                    <div className={styles.container}>
                        <SectionHeading id="buffs-title" title="Organization Buffs">More than just a logo placement. We provide the fuel to level up your organization’s engine.</SectionHeading>
                        <div className={styles.buffGrid}>
                            {ORGANIZATION_BUFFS.map((buff) => {
                                const Icon = BUFF_ICONS[buff.id];
                                return <SupportApplicationButton key={buff.id} className={`${styles.buffCard} w-full cursor-pointer text-left`} style={{ '--accent': buff.color }}>
                                    <img src={buff.image} alt="" loading="lazy" /><span className={styles.buffIcon}><Icon size={23} aria-hidden="true" /></span>
                                    <div className={styles.buffCopy}><h3>{buff.title}</h3><p>{buff.description}</p><span className={styles.accentLine} aria-hidden="true" /></div>
                                    <HoverOutline color="var(--accent)" />
                                </SupportApplicationButton>;
                            })}
                        </div>
                    </div>
                </section>

                <section className={styles.section} aria-labelledby="network-programs-title">
                    <div className={styles.container}>
                        <SectionHeading id="network-programs-title" title="MSL Network Programs" />
                        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 lg:mt-20">
                            {NETWORK_PROGRAMS.map((program) => {
                                const Icon = program.icon;
                                return (
                                    <a
                                        key={program.title}
                                        href={program.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`Apply for ${program.title} (opens in a new tab)`}
                                        style={{ color: program.hoverColor }}
                                        className={`${typography.interactiveCard} relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-neutral-800 bg-[#191919] p-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current ${program.color}`}
                                    >
                                        <span className={`absolute inset-x-0 top-0 h-1 ${program.accent}`} aria-hidden="true" />
                                        <span className={`${typography.interactiveCardIcon} flex h-12 w-12 items-center justify-center rounded-lg border ${program.frame}`}>
                                            <Icon className="h-6 w-6" aria-hidden="true" />
                                        </span>
                                        <h3 className="mt-6 font-inter text-xl font-bold leading-8 text-white">{program.title}</h3>
                                        <p className="mt-3 font-inter text-sm leading-[22px] text-gray-400">{program.description}</p>
                                        <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold">
                                            Apply now<ArrowRight className="h-4 w-4" aria-hidden="true" />
                                        </span>
                                        <HoverOutline />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section className={`${styles.section} ${styles.ascension}`} aria-labelledby="ascension-title">
                    <div className={styles.container}>
                        <SectionHeading id="ascension-title" title="The Ascension">Start your journey. Prove your worth.<br /><span className={styles.gold}>Climb the ranks</span> to unlock greater power.</SectionHeading>
                        <div className={styles.tierLayout}>
                            <div className={styles.tierRail} role="group" aria-label="Network tiers">
                                {NETWORK_TIERS.map((tier) => <button type="button" key={tier.id} aria-pressed={tier.id === tierId} aria-controls="network-tier-panel" onClick={() => setTierId(tier.id)} className={`${styles.tierButton} ${tier.id === tierId ? styles.selectedTier : ''}`} style={{ '--tier-color': tier.color }}>
                                    <span>{tier.label}</span><span className={styles.tierNode} aria-hidden="true"><span /></span>
                                </button>)}
                            </div>
                            <div id="network-tier-panel" role="region" aria-label={`${selectedTier.label} details`} aria-live="polite"><TierPanel key={tierId} tier={selectedTier} /></div>
                        </div>
                    </div>
                </section>

                {SHOW_PARTNER_LEADERBOARD && (
                <section className={styles.section} aria-labelledby="leaderboard-title">
                    <div className={styles.container}>
                        <SectionHeading id="leaderboard-title" title="Partner Leaderboard">Top performing organizations of Season 2025</SectionHeading>
                        <ol className={styles.podium}>
                            {LEADERBOARD.slice(0, 3).map((partner) => <li key={partner.rank} className={`${styles.podiumCard} ${styles[`rank${partner.rank}`]}`}>
                                {partner.rank === 1 && <Crown className={styles.podiumCrown} size={36} aria-hidden="true" />}
                                <span className="sr-only">Rank {partner.rank}.</span><div className={styles.partnerAvatar}>{partner.initials}</div>
                                <h3>{partner.name}</h3><p>{partner.school}</p><div className={styles.points}><strong>{number(partner.points)}</strong><small>pts</small></div><div className={styles.podiumBase} aria-hidden="true" />
                            </li>)}
                        </ol>
                        <ol className={styles.remainingRanks} start={4}>
                            {LEADERBOARD.slice(3).map((partner) => <li key={partner.rank}><span className={styles.rankNumber} aria-hidden="true">{partner.rank}</span><span className={styles.smallAvatar} aria-hidden="true">{partner.initials}</span><div><h3>{partner.name}</h3><p>{partner.school}</p></div><strong>{number(partner.points)} pts</strong></li>)}
                        </ol>
                    </div>
                </section>
                )}

                <section className={`${styles.section} ${styles.discordSection}`} aria-labelledby="discord-title">
                    <div className={styles.container}>
                        <SectionHeading id="discord-title" title="Showcase Your Org. Connect with the Nation.">The official platform for our partners to showcase their organization and connect with the general MLBB community of student-gamers all over the Philippines.</SectionHeading>
                        {NETWORK_LINKS.discord ? <a href={NETWORK_LINKS.discord} target="_blank" rel="noopener noreferrer" className={`${styles.button} ${styles.discordButton}`}><FaDiscord size={20} aria-hidden="true" />Join the Discord Server</a> : <>
                            <button type="button" disabled aria-describedby="discord-link-status" className={`${styles.button} ${styles.discordButton}`}><FaDiscord size={20} aria-hidden="true" />Join the Discord Server</button>
                            <p id="discord-link-status" className={styles.connectionNote}>The invitation link will be available soon.</p>
                        </>}
                    </div>
                </section>

                <section className={`${styles.section} ${styles.gallerySection}`} aria-labelledby="gallery-title">
                    <SectionHeading id="gallery-title" badge="Community" icon={Users} title="Life in the Network" />
                    <div className={styles.gallery}>
                        {NETWORK_GALLERY.map((photo) => <button type="button" key={photo.image} onClick={() => setPreview(photo)} className={styles.galleryPhoto} aria-label={`Enlarge image: ${photo.alt}`}><img src={photo.image} alt={photo.alt} loading="lazy" /><HoverOutline color="var(--gold)" /></button>)}
                    </div>
                </section>

                <section className={`${styles.section} ${styles.closingSection}`} aria-labelledby="legacy-title">
                    <div className={styles.container}><SectionHeading id="legacy-title" title="Build Your Legacy.">Join the elite network of student organizations redefining collegiate esports. Secure funding, mentorship, and a lasting impact.</SectionHeading><ActionLink href={NETWORK_LINKS.membership}>Apply for Membership<ArrowRight size={20} aria-hidden="true" /></ActionLink></div>
                </section>
            </div>

            <Dialog open={Boolean(preview)} onClose={() => setPreview(null)} className="relative z-[90]">
                <div className="fixed inset-0 bg-black/90" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-8">
                    <DialogPanel className="relative">
                        <DialogTitle className="sr-only">{preview?.alt || 'Network photo'}</DialogTitle>
                        <button type="button" onClick={() => setPreview(null)} aria-label="Close image preview" className={styles.previewClose}><X size={22} aria-hidden="true" /></button>
                        {preview && <img src={preview.image} alt={preview.alt} className={styles.previewImage} />}
                    </DialogPanel>
                </div>
            </Dialog>
        </MainLayout>
    );
}
