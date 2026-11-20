import { useState } from 'react';
import ContentDetailModal from './ContentDetailModal';
import styles from '@/Pages/ContentMedia.module.css';
import HoverOutline from '@/Components/HoverOutline';

export default function Leadership({ profiles }) {
    const [selectedId, setSelectedId] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const departmentHead = profiles.find((profile) => profile.id === 'mary') || profiles[0];
    // The featured card always shows the Department Head; hovering a division head
    // only highlights that head's own card, it never replaces the featured profile.
    const featured = departmentHead;
    const selected = profiles.find((profile) => profile.id === selectedId);
    const divisionHeads = profiles.filter((profile) => profile.id !== departmentHead?.id);
    const tabs = selected ? [
        { id: 'overview', label: 'Overview' },
        ...selected.sections.map((_, index) => ({ id: `story-${index}`, label: ['Journey', 'Milestones', 'About me', 'Principles'][index] })),
    ] : [];

    const openProfile = (profile) => {
        setActiveTab('overview');
        setSelectedId(profile.id);
    };

    const closeProfile = () => {
        setSelectedId(null);
    };

    const renderProfileTab = (tabId) => {
        if (!selected) return null;
        if (tabId === 'overview') return (
            <section className="mx-auto max-w-3xl">
                <div className="grid items-start gap-6 sm:grid-cols-2 sm:gap-8">
                    <div className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-neutral-800 bg-[#121212] sm:max-w-none">
                        <img src={selected.image} alt={selected.name} className="block h-auto w-full object-contain" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="mb-4 text-lg font-bold text-white">MLBB Profile</h3>
                        <dl className="grid gap-3 text-sm">
                            {[
                                ['IGN', selected.ign],
                                ['Favorite Hero / Heroes', selected.heroes],
                                ['Highest Rank', selected.rank],
                            ].map(([label, value]) => (
                                <div key={label} className="rounded-lg bg-[#121212] px-4 py-3">
                                    <dt className="text-xs leading-5 text-gray-400">{label}</dt>
                                    <dd className="mt-1 break-words font-semibold leading-6 text-gray-200">{value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
                <div className="mt-8 border-t border-neutral-800 pt-6">
                    <h3 className="text-xs font-bold uppercase tracking-wide text-[#F2C21A]">Motto</h3>
                    <blockquote className="mt-3 text-base italic leading-relaxed text-gray-200 sm:text-lg">“{selected.motto}”</blockquote>
                    {selected.mottoSource && <p className="mt-3 text-xs text-gray-400 sm:text-sm">{selected.mottoSource}</p>}
                </div>
            </section>
        );
        const section = selected.sections[Number(tabId.slice(6))];
        if (!section) return null;
        return (
            <section className="mx-auto max-w-prose space-y-5">
                <h3 className="text-xl font-bold leading-snug text-white">{section.heading}</h3>
                <div className="space-y-4">
                    {section.paragraphs.map((paragraph) => <p key={paragraph} className="text-sm leading-6 text-gray-300 sm:text-base sm:leading-7">{paragraph}</p>)}
                    {section.items && <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-gray-300 sm:text-base sm:leading-7">{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}
                    {section.closing?.map((paragraph) => <p key={paragraph} className="text-sm leading-6 text-gray-300 sm:text-base sm:leading-7">{paragraph}</p>)}
                </div>
            </section>
        );
    };

    if (!featured) return null;

    return (
        <section aria-labelledby="leadership-title">
            <div className="text-center">
                <h2 id="leadership-title" className={styles.sectionTitle}>Leadership</h2>
                <p className={`mt-4 text-gray-400 ${styles.sectionDescription}`}>The creative minds steering the department.</p>
            </div>

            <article className="relative mx-auto mt-12 flex max-w-3xl flex-col overflow-hidden rounded-[2rem] border border-neutral-800 bg-[#111111] p-4 md:flex-row lg:mt-20 lg:p-5">
                <button
                    type="button"
                    onClick={() => openProfile(featured)}
                    aria-label={`Read ${featured.name}’s full profile`}
                    aria-haspopup="dialog"
                    className={`${styles.zoomFrame} aspect-[3/4] w-full shrink-0 overflow-hidden rounded-t-2xl focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#F2C21A] md:w-5/12 md:self-center md:rounded-l-2xl md:rounded-tr-none`}
                >
                    <div className={`portrait-glass ${styles.leadershipFrame}`}>
                        <img src={featured.image} alt={featured.name} style={featured.portraitFrame} className={styles.leadershipPortrait} />
                    </div>
                </button>
                <div className="flex min-w-0 flex-1 flex-col justify-center rounded-b-2xl bg-[#1e1e1e] p-4 sm:p-6 md:rounded-b-none md:rounded-r-2xl">
                    <p className={`uppercase text-[#F2C21A] ${styles.featuredRole}`}>{featured.featuredRole || featured.role}</p>
                    <h3 className={`mt-2 text-xl font-bold leading-7 text-white sm:text-2xl sm:leading-8 lg:text-subsection ${styles.ralewayTitle}`}>
                        <button type="button" onClick={() => openProfile(featured)} aria-label={`Read ${featured.name}’s full profile`} aria-haspopup="dialog" className="rounded-sm text-left hover:text-[#F8D54B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F2C21A]">
                            {featured.displayName || featured.name}
                        </button>
                    </h3>
                    <blockquote className={`mt-5 border-l-2 border-[#F2C21A] pl-4 italic text-gray-300 ${styles.featuredQuote}`}>“{featured.featuredQuote || featured.motto}”</blockquote>
                </div>
                <HoverOutline color="#F2C21A" />
            </article>

            <div className="mt-12 border-t border-neutral-800 pt-8 lg:mt-16">
                <h3 className="mb-6 font-inter text-sm font-bold uppercase leading-5 text-gray-400 lg:text-xl lg:leading-7">Functional Division Heads</h3>
                <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
                    {divisionHeads.map((profile) => (
                        <button
                            key={profile.id}
                            type="button"
                            onClick={() => openProfile(profile)}
                            aria-label={`Read ${profile.name}’s full profile`}
                            aria-haspopup="dialog"
                            className={`${styles.poster} ${styles.leadershipCard} relative block w-full overflow-hidden rounded-2xl border bg-[#111111] text-left focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#F2C21A] border-neutral-800`}
                        >
                            <div className={styles.leadershipFrame}>
                            <img src={profile.image} alt="" loading="lazy" style={profile.portraitFrame} className={styles.leadershipPortrait} />
                            <span className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] bg-gradient-to-t from-black via-black/70 to-transparent p-3 pt-16 sm:p-4 sm:pt-20">
                                <span className="block text-[10px] font-bold uppercase leading-tight text-[#F2C21A]">{profile.role}</span>
                                <span className="mt-1 block font-inter text-xs font-bold leading-[18px] text-white sm:text-sm lg:text-lg lg:leading-7">{profile.name}</span>
                            </span>
                            </div>
                            <HoverOutline color="#F2C21A" />
                        </button>
                    ))}
                </div>
            </div>

            <ContentDetailModal
                open={Boolean(selected)}
                onClose={closeProfile}
                title={selected?.displayName || selected?.name || 'Leadership profile'}
                subtitle={selected?.role}
                leading={selected && <img src={selected.image} alt="" className="h-11 w-11 shrink-0 rounded-xl object-cover object-top sm:h-12 sm:w-12" />}
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                renderTab={renderProfileTab}
            />
        </section>
    );
}
