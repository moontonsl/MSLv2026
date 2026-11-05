import { useState } from 'react';
import ContentDetailModal from './ContentDetailModal';
import styles from '@/Pages/ContentMedia.module.css';

const portraitStyle = (profile) =>
    profile.id === 'aj'
        ? { objectPosition: '50% 30%', scale: '1.06', transformOrigin: '50% 40%' }
        : undefined;

export default function Leadership({ profiles }) {
    const [featuredId, setFeaturedId] = useState('mary');
    const [selectedId, setSelectedId] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const departmentHead = profiles.find((profile) => profile.id === 'mary') || profiles[0];
    const featured = profiles.find((profile) => profile.id === featuredId) || departmentHead;
    const selected = profiles.find((profile) => profile.id === selectedId);
    const divisionHeads = profiles.filter((profile) => profile.id !== departmentHead?.id);
    const tabs = selected ? [
        { id: 'overview', label: 'Overview' },
        ...selected.sections.map((_, index) => ({ id: `story-${index}`, label: ['Journey', 'Milestones', 'About me', 'Principles'][index] })),
    ] : [];

    const openProfile = (profile) => {
        setActiveTab('overview');
        setFeaturedId(profile.id);
        setSelectedId(profile.id);
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
                    <h3 className="text-xs font-bold uppercase tracking-wide text-purple-300">Motto</h3>
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
        <section aria-labelledby="leadership-title" onMouseLeave={() => setFeaturedId(departmentHead.id)}>
            <div className="text-center">
                <h2 id="leadership-title" className={styles.sectionTitle}>Leadership</h2>
                <p className={`mt-4 text-gray-400 ${styles.sectionDescription}`}>The creative minds steering the department.</p>
            </div>

            <article className="mx-auto mt-12 flex max-w-3xl flex-col overflow-hidden rounded-[2rem] border border-neutral-800 bg-[#111111] p-4 md:flex-row lg:mt-20 lg:p-5">
                <button
                    type="button"
                    onClick={() => openProfile(featured)}
                    aria-label={`Read ${featured.name}’s full profile`}
                    aria-haspopup="dialog"
                    className={`${styles.zoomFrame} aspect-square w-full shrink-0 overflow-hidden rounded-t-2xl focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-purple-400 md:w-5/12 md:self-center md:rounded-l-2xl md:rounded-tr-none`}
                >
                    <img src={featured.image} alt={featured.name} style={portraitStyle(featured)} className={`${styles.posterImage} h-full w-full object-cover object-center`} />
                </button>
                <div className="flex min-w-0 flex-1 flex-col justify-center rounded-b-2xl bg-[#1e1e1e] p-4 sm:p-6 md:rounded-b-none md:rounded-r-2xl">
                    <p className={`uppercase text-purple-400 ${styles.featuredRole}`}>{featured.featuredRole || featured.role}</p>
                    <h3 className={`mt-2 text-xl font-bold leading-7 text-white sm:text-2xl sm:leading-8 lg:text-subsection ${styles.ralewayTitle}`}>
                        <button type="button" onClick={() => openProfile(featured)} aria-label={`Read ${featured.name}’s full profile`} aria-haspopup="dialog" className="rounded-sm text-left hover:text-purple-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-400">
                            {featured.displayName || featured.name}
                        </button>
                    </h3>
                    <blockquote className={`mt-5 border-l-2 border-purple-400 pl-4 italic text-gray-300 ${styles.featuredQuote}`}>“{featured.featuredQuote || featured.motto}”</blockquote>
                </div>
            </article>

            <div className="mt-12 border-t border-neutral-800 pt-8 lg:mt-16">
                <h3 className="mb-6 font-inter text-sm font-bold uppercase leading-5 text-gray-400 lg:text-xl lg:leading-7">Functional Division Heads</h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
                    {divisionHeads.map((profile) => (
                        <button
                            key={profile.id}
                            type="button"
                            onMouseEnter={() => {
                                if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) setFeaturedId(profile.id);
                            }}
                            onFocus={() => setFeaturedId(profile.id)}
                            onClick={() => openProfile(profile)}
                            aria-label={`Read ${profile.name}’s full profile`}
                            aria-haspopup="dialog"
                            className={`${styles.poster} relative aspect-square w-full overflow-hidden rounded-xl border bg-[#111111] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-400 ${featured.id === profile.id ? 'border-purple-400' : 'border-neutral-800'}`}
                        >
                            <img src={profile.image} alt="" loading="lazy" style={portraitStyle(profile)} className={`${styles.posterImage} h-full w-full object-cover object-center`} />
                            <span className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] bg-gradient-to-t from-black via-black/70 to-transparent p-3 pt-10">
                                <span className="block text-[10px] font-bold uppercase leading-tight text-purple-300">{profile.role}</span>
                                <span className="mt-1 block font-inter text-sm font-bold leading-5 text-white lg:text-xl lg:leading-7">{profile.name}</span>
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <ContentDetailModal
                open={Boolean(selected)}
                onClose={() => setSelectedId(null)}
                title={selected?.displayName || selected?.name || 'Leadership profile'}
                subtitle={selected?.role}
                leading={selected && <img src={selected.image} alt="" style={portraitStyle(selected)} className="h-11 w-11 shrink-0 rounded-xl object-cover object-center sm:h-12 sm:w-12" />}
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                renderTab={renderProfileTab}
            />
        </section>
    );
}
