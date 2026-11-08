import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { ArrowRight, CheckCircle2, Crown, Diamond, Gamepad2, MonitorPlay, Network, ShieldCheck, Star, Target, Trophy, Users, X, Zap } from 'lucide-react';
import { FaDiscord } from 'react-icons/fa';
import MainLayout from '@/Layouts/MainLayout';
import DepartmentBadge from '@/Components/DepartmentBadge';
import { COMMUNITY_AWARDS, INDIVIDUAL_AWARDS, LEADERBOARD, MAJOR_AWARDS, NETWORK_GALLERY, NETWORK_LINKS, NETWORK_TIERS, ORGANIZATION_BUFFS, SPOTLIGHT } from '@/data/mslNetworkData';
import typography from './ContentMedia.module.css';
import styles from './MSLNetwork.module.css';

const number = (value) => value.toLocaleString('en-PH');
const BUFF_ICONS = { financial: Diamond, ecosystem: Gamepad2, industry: Trophy };

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
    return <Link href={href} className={`${styles.button} ${secondary ? styles.secondaryButton : styles.primaryButton}`}>{children}</Link>;
}

function AwardCard({ award }) {
    return (
        <article className={`${styles.awardCard} ${award.featured ? styles.featuredAward : ''}`}>
            {award.grant && <div className={styles.awardTop}>
                {award.featured ? <Crown size={26} aria-hidden="true" /> : <Trophy size={22} aria-hidden="true" />}
                <span className={styles.grant}>{award.grant}</span>
            </div>}
            <h4>{award.title}</h4>
            <p>{award.description}</p>
            <ul className={styles.rewards} aria-label="Award recognition">
                {award.rewards.map((reward) => <li key={reward}>{reward}</li>)}
            </ul>
        </article>
    );
}

function TierPanel({ tier }) {
    if (!tier.details) {
        return <div className={`${styles.tierPanel} ${styles.pendingTier}`}>
            <Target size={30} aria-hidden="true" />
            <h3>{tier.label}</h3>
            <p>Allocation, requirements, and privileges are awaiting confirmation.</p>
        </div>;
    }

    const details = tier.details;
    return (
        <div className={styles.tierPanel}>
            <div className={styles.tierHeader}><h3>{tier.label}</h3><Target size={28} aria-hidden="true" /></div>
            <div className={styles.tierSummary}>
                <div className={styles.allocation}>
                    <span className={styles.eyebrow}>Max allocation</span>
                    <strong>{number(details.allocation)}</strong><small>Diamonds / Sem</small>
                    <Diamond className={styles.allocationIcon} size={42} aria-hidden="true" />
                </div>
                <div className={styles.requirements}>
                    <div className={styles.requirementsHeading}><span className={styles.eyebrow}>Community requirements</span><small>via Campus Dept</small></div>
                    <dl className={styles.metrics}>
                        <div><dt>Members</dt><dd>{details.members}</dd></div>
                        <div><dt>Active %</dt><dd>{details.active}</dd></div>
                        <div><dt>Turnout</dt><dd>{details.turnout}</dd></div>
                    </dl>
                </div>
            </div>
            <div className={styles.privileges}>
                <div className={styles.inlineLabel}><Star size={18} aria-hidden="true" /><span className={styles.eyebrow}>Perks & privileges</span></div>
                <dl className={styles.perks}>
                    <div><dt>Event activation priority</dt><dd>{details.activation}</dd></div>
                    <div><dt>Creative space *</dt><dd>{details.creativeSpace}</dd><small>* Subject to availability</small></div>
                    <div><dt>Monetary sponsorship *</dt><dd>{details.sponsorship}</dd><small>* Ascend to Tier B to unlock</small></div>
                </dl>
            </div>
            <div className={styles.compliance}>
                <div className={styles.inlineLabel}><ShieldCheck size={15} aria-hidden="true" /><span className={styles.eyebrow}>Compliance gate</span></div>
                <ul><li><CheckCircle2 size={16} aria-hidden="true" />Recognized by School</li><li><CheckCircle2 size={16} aria-hidden="true" />Endorsed by Adviser</li></ul>
            </div>
        </div>
    );
}

export default function MSLNetwork() {
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

                <div className={styles.allianceStrip} aria-label="Alliance members">
                    <div className={`${styles.container} ${styles.allianceLogos}`}>
                        {[1, 2, 3, 4, 5].map((index) => <img key={index} src={`/Images/Home/Logo ${index}.png`} alt={`Alliance member mark ${index}`} loading="lazy" />)}
                    </div>
                </div>

                <section className={`${styles.section} ${styles.spotlightSection}`} aria-labelledby="spotlight-title">
                    <div className={styles.container}>
                        <div className={styles.spotlightHeading}><span className={styles.spotlightBadge}><Star size={16} aria-hidden="true" />MVP Spotlight</span><h2 id="spotlight-title" className={styles.eyebrow}>Partner of the month</h2></div>
                        <div className={styles.spotlightGrid}>
                            <figure className={styles.eventPhoto}>
                                <img src={SPOTLIGHT.image} alt={SPOTLIGHT.event} loading="lazy" />
                                <figcaption><h3>{SPOTLIGHT.event}</h3><p>{SPOTLIGHT.caption}</p></figcaption>
                            </figure>
                            <div className={styles.spotlightDetails}>
                                <article className={styles.organizationCard}><h3>{SPOTLIGHT.organization}</h3><p className={styles.school}>{SPOTLIGHT.school}</p><blockquote>“{SPOTLIGHT.quote}”</blockquote></article>
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
                                return <Link key={buff.id} href={buff.href} className={styles.buffCard} style={{ '--accent': buff.color }}>
                                    <img src={buff.image} alt="" loading="lazy" /><span className={styles.buffIcon}><Icon size={23} aria-hidden="true" /></span>
                                    <div className={styles.buffCopy}><h3>{buff.title}</h3><p>{buff.description}</p><span className={styles.accentLine} aria-hidden="true" /></div>
                                </Link>;
                            })}
                        </div>
                    </div>
                </section>

                <section className={`${styles.section} ${styles.ascension}`} aria-labelledby="ascension-title">
                    <div className={styles.container}>
                        <SectionHeading id="ascension-title" title="The Ascension">Start your journey. Prove your worth.<br /><span className={styles.gold}>Climb the ranks</span> to unlock greater power.</SectionHeading>
                        <div className={styles.tierLayout}>
                            <div className={styles.tierRail} role="group" aria-label="Network tiers">
                                {NETWORK_TIERS.map((tier) => <button type="button" key={tier.id} aria-pressed={tier.id === tierId} aria-controls="network-tier-panel" onClick={() => setTierId(tier.id)} className={`${styles.tierButton} ${tier.id === tierId ? styles.selectedTier : ''}`}>
                                    <span>{tier.label}</span><span className={styles.tierNode} aria-hidden="true"><span /></span>
                                </button>)}
                            </div>
                            <div id="network-tier-panel" role="region" aria-label={`${selectedTier.label} details`} aria-live="polite"><TierPanel key={tierId} tier={selectedTier} /></div>
                        </div>
                    </div>
                </section>

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

                <section className={`${styles.section} ${styles.awardsSection}`} aria-labelledby="awards-title">
                    <div className={styles.awardsContainer}>
                        <SectionHeading id="awards-title" badge="Hall of Legends" icon={Crown} title="The MSL Network Awards">Honoring the outstanding achievements of student organizations and leaders who have elevated the campus esports experience.</SectionHeading>
                        <h3 className={styles.awardGroupHeading}><Trophy aria-hidden="true" />Major Awards</h3>
                        <div className={styles.majorAwards}>{MAJOR_AWARDS.map((award) => <AwardCard key={award.title} award={award} />)}</div>
                        <div className={styles.awardColumns}>
                            <div><h3 className={styles.awardGroupHeading}><Users className={styles.blue} aria-hidden="true" />Community Awards</h3><div className={styles.awardStack}>{COMMUNITY_AWARDS.map((award) => <AwardCard key={award.title} award={award} />)}</div></div>
                            <div><h3 className={styles.awardGroupHeading}><Star className={styles.purple} aria-hidden="true" />Individual Awards</h3><div className={styles.awardStack}>{INDIVIDUAL_AWARDS.map((award) => <AwardCard key={award.title} award={award} />)}</div></div>
                        </div>
                        <Link href={NETWORK_LINKS.nomination} className={styles.nomination}><span className={styles.nominationArrow}><ArrowRight size={25} aria-hidden="true" /></span><strong>Make a Nomination</strong></Link>
                    </div>
                </section>

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
                        {NETWORK_GALLERY.map((photo) => <button type="button" key={photo.image} onClick={() => setPreview(photo)} className={styles.galleryPhoto} aria-label={`Enlarge image: ${photo.alt}`}><img src={photo.image} alt={photo.alt} loading="lazy" /></button>)}
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
