import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Gamepad2, Gift, MapPin, Mic2, Network, Presentation, Repeat2, Search, Swords, UserPlus, Zap } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import { PUBLIC_ROUTES, comingSoonHref } from '@/data/siteNavigation';
import { PROGRAMS, CAMPAIGNS, CAMPUS_TOURNAMENT_PREVIEWS, REGIONS, filterCampusTournaments } from '@/data/programsData';
import typography from '../ContentMedia.module.css';
import styles from './Programs.module.css';

const ICONS = { swords: Swords, network: Network, gift: Gift, gamepad: Gamepad2, presentation: Presentation, microphone: Mic2, user: UserPlus };

function CampaignGroup({ group, title }) {
    const Icon = group === 'ongoing' ? Zap : Repeat2;
    return (
        <section className={styles.campaignGroup} aria-labelledby={`${group}-title`}>
            <h3 id={`${group}-title`} className={`${styles.groupTitle} ${group === 'recurring' ? styles.recurringTitle : ''}`}>{title}</h3>
            <div className={styles.campaignGrid}>
                {CAMPAIGNS.filter((campaign) => campaign.group === group).map((campaign) => (
                    <article key={campaign.id} className={styles.campaignCard}>
                        <div className={styles.campaignImage}>
                            <img src={campaign.image} alt="" loading="lazy" />
                            <span className={`${styles.campaignStatus} ${group === 'ongoing' ? styles.ongoingStatus : styles.recurringStatus}`}><Icon size={12} aria-hidden="true" />{group === 'ongoing' ? 'Ongoing' : 'Recurring'}</span>
                        </div>
                        <div className={styles.campaignBody}>
                            <h4>{campaign.title}</h4>
                            <p>{campaign.description}</p>
                            <Link href={campaign.href} className={styles.detailsLink} aria-label={`Details about ${campaign.title}`}>Details <ArrowRight size={14} aria-hidden="true" /></Link>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default function Programs() {
    const [region, setRegion] = useState('All Regions');
    const tournaments = filterCampusTournaments(CAMPUS_TOURNAMENT_PREVIEWS, region);

    return (
        <MainLayout fullWidth>
            <Head title="Our Programs" />
            <div className={`${styles.page} ${typography.typography} ${typography.interactionScope}`}>
                <section className={styles.hero} aria-labelledby="programs-title">
                    <div className={styles.container}>
                        <h1 id="programs-title">Our <span>Programs</span></h1>
                        <p>Designed to discover talent, build communities, and recognize excellence.<br className="hidden sm:block" /> Choose your path in the MSL ecosystem.</p>
                    </div>
                </section>

                <section className={`${styles.container} ${styles.programSection}`} aria-label="Explore our programs">
                    <div className={styles.programGrid}>
                        {PROGRAMS.map((program) => {
                            const Icon = ICONS[program.icon];
                            return (
                                <article key={program.id} className={styles.programCard}>
                                    <div className={styles.programImage}>
                                        <img src={program.image} alt="" loading="lazy" />
                                        <span className={styles.programIcon} style={{ color: program.color }}><Icon size={20} aria-hidden="true" /></span>
                                    </div>
                                    <div className={styles.programBody}>
                                        <h2>{program.title}</h2>
                                        <p>{program.description}</p>
                                        <Link href={program.href} className={styles.learnMore} aria-label={`Learn more about ${program.title}`}>Learn More <ArrowRight size={14} aria-hidden="true" /></Link>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </section>

                <section className={styles.eventsSection} aria-labelledby="campaigns-title">
                    <div className={styles.sectionHeading}>
                        <h2 id="campaigns-title">Events &amp; Campaigns</h2>
                        <p>What’s happening in the Land of Dawn right now.</p>
                    </div>
                    <div className={styles.container}>
                        <article className={styles.flagship}>
                            <img src="/champ poster.jpg" alt="" loading="lazy" />
                            <div className={styles.flagshipContent}>
                                <h3>MSL Collegiate Cup</h3>
                                <p className={styles.flagshipTagline}>The official collegiate league of MLBB in the Philippines</p>
                                <p>The pinnacle of collegiate esports. Schools from Luzon, Visayas, and Mindanao clash for the title of National Champion and the chance to represent the country on the international stage.</p>
                                <div className={styles.flagshipActions}>
                                    <Link href={comingSoonHref('collegiate-cup')} className={styles.primaryButton}>Register Your Team</Link>
                                    <Link href={comingSoonHref('collegiate-cup')} className={styles.secondaryButton}>Learn More <ArrowRight size={16} aria-hidden="true" /></Link>
                                </div>
                            </div>
                        </article>
                        <CampaignGroup group="ongoing" title="Ongoing Campaigns" />
                        <CampaignGroup group="recurring" title="Recurring Campaigns" />
                    </div>
                </section>

                <section className={styles.tournamentsSection} aria-labelledby="campus-tournaments-title">
                    <div className={styles.container}>
                        <div className={styles.tournamentHeader}>
                            <div>
                                <h2 id="campus-tournaments-title"><Swords size={26} aria-hidden="true" />Campus Tournaments</h2>
                                <p>Ongoing tournaments organized by Moonton Student Leaders. Support your school!</p>
                            </div>
                            <div className={styles.regionFilters} role="group" aria-label="Filter campus tournaments by region">
                                {REGIONS.map((item) => <button key={item} type="button" aria-pressed={region === item} onClick={() => setRegion(item)}>{item}</button>)}
                            </div>
                        </div>
                        <p className={styles.previewNote}>Reference examples — schedules and registration details are to be confirmed.</p>
                        <div className={styles.tournamentResults} aria-live="polite" aria-atomic="true">
                            {tournaments.length ? <div className={styles.tournamentGrid}>
                                {tournaments.map((tournament) => (
                                    <article key={tournament.id} className={styles.tournamentCard}>
                                        <div className={styles.tournamentImage}><img src={tournament.image} alt="" loading="lazy" /></div>
                                        <div className={styles.tournamentBody}>
                                            <h3>{tournament.title}</h3>
                                            <p><MapPin size={13} aria-hidden="true" />{tournament.school}</p>
                                            <div className={styles.tournamentAction}><span>Schedule to be announced</span><Link href={PUBLIC_ROUTES.tournaments} aria-label={`View tournaments for ${tournament.school}`}>View <ArrowRight size={13} aria-hidden="true" /></Link></div>
                                        </div>
                                    </article>
                                ))}
                            </div> : <div className={styles.emptyState}>No tournament previews for {region} yet. Find your school in the community directory below.</div>}
                        </div>
                        <div className={styles.communityCta}>
                            <Search size={26} aria-hidden="true" />
                            <div><h3>Find Your Community</h3><p>Don’t see your school listed above? Check our directory to join your local MSL chapter.</p></div>
                            <Link href={`${PUBLIC_ROUTES.campus}#community-directory`}>Search your school’s MSL Community <ArrowRight size={16} aria-hidden="true" /></Link>
                        </div>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
