import { useEffect, useRef, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Building2, Gem, GraduationCap, Layers, Network, ShieldCheck, X } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import DepartmentBadge from '@/Components/DepartmentBadge';
import ContentDetailModal from '@/Components/ContentDetailModal';
import HoverOutline from '@/Components/HoverOutline';
import { CAMPAIGNS, CORE_PROGRAMS, NETWORK_BENEFITS, PARTNER_STATS, PARTNERSHIP_DIVISIONS, PARTNERSHIP_HEAD, PARTNERSHIP_TEAM, PARTNERSHIP_TEAM_GROUPS, PARTNERSHIP_LINKS } from '@/data/partnershipsData';
import type from './ContentMedia.module.css';
import styles from './Partnerships.module.css';

function ProgramLink({ program }) {
    const Icon = program.icon;
    return (
        <Link href={program.href} className={styles.programLink}>
            <span className={styles.smallIcon}><Icon size={20} aria-hidden="true" /></span>
            <span><strong className="block text-sm leading-5 text-white">{program.title}</strong><span className="mt-1 block text-xs leading-5 text-gray-400">{program.description}</span></span>
            <ArrowRight className={styles.linkArrow} size={16} aria-hidden="true" />
            <HoverOutline color="#a58a24" />
        </Link>
    );
}

function TeamCard({ profile, onOpen }) {
    return (
        <button type="button" aria-haspopup="dialog" onClick={() => onOpen(profile)} className={`${styles.leaderCard} cursor-pointer`} aria-label={`Enlarge ${profile.name} photo`}>
            <div className={`portrait-glass ${styles.teamPortraitFrame}`} style={profile.portraitFrame}>
                <img src={profile.image} alt="" loading="lazy" />
            </div>
            <span><small>{profile.role}</small><strong>{profile.name}</strong></span>
            <HoverOutline color="#F2C21A" />
        </button>
    );
}

function FeaturedTeamHead({ profile, onOpen }) {
    return (
        <article className={styles.featuredLeader}>
            <button type="button" onClick={() => onOpen(profile)} aria-label={`Enlarge ${profile.name} photo`} aria-haspopup="dialog" className={`portrait-glass relative ${styles.leaderImage} cursor-pointer`}>
                <img src={profile.image} alt={profile.name} loading="lazy" />
            </button>
            <div className={styles.leaderCopy}>
                <p className="text-xs font-bold uppercase tracking-widest text-brand-500">{profile.role}</p>
                <h3>{profile.name}</h3>
            </div>
            <HoverOutline color="#F2C21A" />
        </article>
    );
}

export default function Partnerships() {
    const [detail, setDetail] = useState(null);
    const [portrait, setPortrait] = useState(null);
    const portraitDialog = useRef(null);
    const openProfile = (profile) => setPortrait(profile);

    useEffect(() => {
        if (!portrait) return;
        if (!portraitDialog.current.open) portraitDialog.current.showModal();
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = previousOverflow; };
    }, [portrait]);

    return (
        <MainLayout fullWidth>
            <Head title="Partnerships">
                <link head-key="csmd-raleway" rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Raleway:wght@700&display=swap" />
            </Head>
            <div className={`${styles.page} ${type.typography} ${type.interactionScope}`}>
                <section className={styles.hero} aria-labelledby="partnerships-title">
                    <div className={`${styles.container} ${styles.heroGrid}`}>
                        <div className={styles.heroCopy}>
                            <DepartmentBadge icon={Gem} tone="gold" className={type.departmentBadge}>Partnership Department</DepartmentBadge>
                            <h1 id="partnerships-title" className={`mt-6 ${type.heroTitle}`}>Fueling the<br /><span className={styles.gold}>Ecosystem.</span></h1>
                            <p className={`mt-6 max-w-xl text-gray-300 ${type.heroDescription}`}>We act as the centralized bridge for esports organizations across the Philippines. Our team facilitates impactful brand campaigns, nationwide activations, and corporate sponsorships that elevate the student gaming experience.</p>
                            <div className={styles.heroActions}>
                                <a href="#work-with-us" className={styles.primaryButton}>Partner With Us <ArrowRight size={18} aria-hidden="true" /></a>
                                <a href="#partnership-leadership" className={styles.secondaryButton}>Meet The Team</a>
                            </div>
                            <dl className={styles.stats}>
                                {PARTNER_STATS.map((stat) => <div key={stat.label}><dt>{stat.label}</dt><dd>{stat.value}</dd></div>)}
                            </dl>
                        </div>
                        <div className={styles.heroArtwork} aria-hidden="true">
                            <img src="/MSL_LOGO.png" alt="" className={styles.heroLogo} />
                            {[
                                { title: 'University Partners', subtitle: 'Relations', icon: GraduationCap, position: styles.universities, color: '#60a5fa' },
                                { title: 'Corporate Brands', subtitle: 'Sponsorships', icon: Building2, position: styles.brands, color: '#c084fc' },
                                { title: 'Asset Treasury', subtitle: 'Resources', icon: Gem, position: styles.treasury, color: '#4ade80' },
                                { title: 'Infrastructure', subtitle: 'Systems', icon: Layers, position: styles.infrastructure, color: '#f2c21a' },
                            ].map(({ title, subtitle, icon: Icon, position, color }) => <div key={title} className={`${styles.artLabel} ${position}`}><span style={{ color }}><Icon size={22} /></span><div><strong>{title}</strong><small>{subtitle}</small></div></div>)}
                        </div>
                    </div>
                </section>

                <section className={styles.campaignSection} aria-label="Events and campaigns">
                    <div className={styles.container}>
                        <div className={styles.flagshipGrid}>
                            <Link href={PARTNERSHIP_LINKS.cup} className={styles.flagship}>
                                <img src="/champ poster.jpg" alt="NU Bulldogs, MCC champions" />
                                <div className={styles.flagshipCopy}><span className={styles.eventBadge}>Flagship Event</span><h2>MCC Season 4</h2><p>The road to the nationals starts here. Witness the pinnacle of competitive Mobile Legends: Bang Bang. Powered by Partnerships.</p></div>
                                <HoverOutline color="#F2C21A" />
                            </Link>
                            <div className={styles.actionPanel}>
                                <p className="text-sm font-bold text-brand-500">Spearheading the Action</p>
                                <h2 className="mt-4 text-lg font-bold leading-7">The Architects of Esports, Events, and Education.</h2>
                                <p className="mt-3 text-sm leading-6 text-gray-400">We build more than just tournaments. We design <span className={styles.gold}>educational programs</span> and <span className="text-blue-400">immersive activations</span> that empower student organizations to grow, sustain, and lead the next generation of digital athletes.</p>
                                <div className="mt-6 space-y-3">{CORE_PROGRAMS.map((program) => <ProgramLink key={program.title} program={program} />)}</div>
                            </div>
                        </div>
                        <div className="mt-8"><h3 className="text-base font-bold">Active Campaigns</h3><p className="mt-1 text-sm text-gray-400">Explore upcoming feats and exclusive in-game events.</p></div>
                        <div className={styles.campaignGrid}>{CAMPAIGNS.map((campaign) => <Link key={campaign.title} href={campaign.href} className={styles.campaignCard}><img src={campaign.image} alt="" loading="lazy" /><span>{campaign.title}</span><HoverOutline color="#F2C21A" /></Link>)}</div>
                    </div>
                </section>

                <section id="partner-ecosystem" className={styles.section} aria-labelledby="ecosystem-title">
                    <div className={styles.container}>
                        <h2 id="ecosystem-title" className={type.sectionTitle}>The Partner Ecosystem</h2>
                        <p className={`mt-3 max-w-2xl text-gray-400 ${type.sectionDescription}`}>A comprehensive suite of programs designed to discover talent, recognize excellence, and sustain the collegiate esports industry.</p>
                        <div className={styles.networkPanel}>
                            <div>
                                <h3 className={styles.networkTitle}>The MSL Network</h3>
                                <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-300">Our core ecosystem managing official relations with collegiate esports organizations. We act as the centralized bridge handling accreditation, partnership growth, and exclusive resource distribution.</p>
                                <div className={styles.benefitGrid}>{NETWORK_BENEFITS.map(({ title, icon: Icon, href, items }) => <div key={title}><Link href={href} className="inline-flex items-center gap-2 text-sm font-bold text-brand-500 hover:text-brand-300"><Icon size={16} aria-hidden="true" />{title}</Link><ul className="mt-3 space-y-2 text-xs leading-5 text-gray-300">{items.map((item) => <li key={item} className={styles.benefitItem}>{item}</li>)}</ul></div>)}</div>
                                <Link href={PARTNERSHIP_LINKS.network} className={`mt-6 ${styles.primaryButton}`}>Join With Us <ArrowRight size={16} aria-hidden="true" /></Link>
                            </div>
                            <div className={styles.corePillars}><h4 className="mb-4 text-sm font-semibold text-gray-400">Core Pillars</h4>{CORE_PROGRAMS.map((program) => <ProgramLink key={program.title} program={program} />)}</div>
                        </div>
                    </div>
                </section>

                <section className={styles.section} aria-labelledby="partnership-divisions-title">
                    <div className={styles.container}>
                        <div className={styles.sectionIntro}><h2 id="partnership-divisions-title" className={type.sectionTitle}>Functional Divisions</h2><p className={`mt-3 text-gray-400 ${type.sectionDescription}`}>The machine behind the magic. Specialized units working in sync to power the ecosystem.</p></div>
                        <div className={styles.divisionGrid}>{PARTNERSHIP_DIVISIONS.filter((division) => ['network', 'sponsorships', 'activations'].includes(division.id)).map((division) => {
                            const Icon = division.icon;
                            return <button key={division.id} type="button" aria-haspopup="dialog" onClick={() => setDetail({ ...division, kind: 'division' })} className={styles.divisionCard} style={{ '--division-accent': division.color }}><span className={styles.divisionIcon}><Icon size={24} aria-hidden="true" /></span><h3>{division.title}</h3><p>{division.description}</p><HoverOutline color="var(--division-accent)" /></button>;
                        })}</div>
                    </div>
                </section>

                <section id="partnership-leadership" className={styles.section} aria-labelledby="partnership-leadership-title">
                    <div className={styles.container}>
                        <div className={styles.sectionIntro}><h2 id="partnership-leadership-title" className={type.sectionTitle}>Meet the Partnership Team</h2><p className={`mt-3 text-gray-400 ${type.sectionDescription}`}>We build bridges between passion and profession.</p></div>
                        <div className="mt-12 lg:mt-20"><FeaturedTeamHead profile={PARTNERSHIP_HEAD} onOpen={openProfile} /></div>
                        {PARTNERSHIP_TEAM_GROUPS.map((group) => {
                            const members = PARTNERSHIP_TEAM.filter((profile) => profile.division === group.id);
                            const head = members.find((profile) => profile.isHead);
                            const Icon = group.icon;
                            return (
                                <section key={group.id} aria-labelledby={`partnership-team-${group.id}`} className={styles.teamGroup}>
                                    <div className={styles.teamGroupHeading}>
                                        <span className={styles.teamGroupIcon}><Icon aria-hidden="true" /></span>
                                        <h3 id={`partnership-team-${group.id}`} className={type.subsectionTitle}>{group.title}</h3>
                                    </div>
                                    {head && <FeaturedTeamHead profile={head} onOpen={openProfile} />}
                                    <div className={styles.leaderGrid}>
                                        {members.filter((profile) => !profile.isHead).map((profile) => <TeamCard key={profile.id} profile={profile} onOpen={openProfile} />)}
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                </section>

                <section id="work-with-us" className={styles.workSection} aria-labelledby="work-with-us-title">
                    <div className={styles.container}>
                        <div className={styles.sectionIntro}><h2 id="work-with-us-title" className={type.sectionTitle}>Work With Us</h2><p className={`mt-3 text-gray-400 ${type.sectionDescription}`}>Whether you represent a student organization looking to join The MSL Network or a brand looking to sponsor, drop us a message.</p></div>
                        <div className={styles.workGrid}>
                            <a href={PARTNERSHIP_LINKS.application} target="_blank" rel="noopener noreferrer" className={`${styles.workCard} ${styles.brandWork}`}><Building2 size={28} aria-hidden="true" /><h3>I'm a Brand/Corporation</h3><p>Looking to sponsor events, maximize brand visibility, or invest in the collegiate scene.</p><span>Explore Opportunities <ArrowRight size={17} aria-hidden="true" /></span><HoverOutline color="var(--work-accent)" /></a>
                            <a href={PARTNERSHIP_LINKS.application} target="_blank" rel="noopener noreferrer" className={styles.workCard}><GraduationCap size={28} aria-hidden="true" /><h3>I'm a Campus Esports Org</h3><p>Looking to join MSL Network, get accredited, and receive diamond funding.</p><span>Join The Network <ArrowRight size={17} aria-hidden="true" /></span><HoverOutline color="var(--work-accent)" /></a>
                        </div>
                    </div>
                </section>
            </div>
            <ContentDetailModal open={Boolean(detail)} onClose={() => setDetail(null)} title={detail?.name || detail?.title || ''} subtitle={detail?.role || 'Partnership Department'} titleClassName="text-brand-500" tabs={[{ id: 'overview', label: 'Overview' }]} renderTab={() => detail && <div className="mx-auto max-w-2xl"><p className="text-base leading-7 text-gray-300">{detail.quote || detail.description}</p></div>} />
            <dialog
                ref={portraitDialog}
                onClose={() => setPortrait(null)}
                onClick={(event) => { if (event.target === event.currentTarget) portraitDialog.current.close(); }}
                aria-label={portrait ? `${portrait.name} photo` : 'Team photo'}
                className="fixed inset-0 m-auto h-fit max-h-none w-fit max-w-none overflow-visible border-0 bg-transparent p-0 text-white backdrop:bg-black/90"
            >
                {portrait && <>
                    <button type="button" onClick={() => portraitDialog.current.close()} aria-label="Close image preview" className="fixed right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/70 hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F2C21A]">
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <img src={portrait.image} alt={portrait.name} className="block h-[90dvh] w-[92vw] object-contain" />
                </>}
            </dialog>
        </MainLayout>
    );
}
