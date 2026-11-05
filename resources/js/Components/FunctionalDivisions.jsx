import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import ContentDetailModal from './ContentDetailModal';
import styles from '@/Pages/ContentMedia.module.css';

const NAVIGATION_LABELS = {
    'Why We Exist': 'Why we exist',
    'What Writers Actually Work on': 'Responsibilities',
    'What We’re Here to Deliver': 'Deliverables',
};

export default function FunctionalDivisions({ divisions }) {
    const [openId, setOpenId] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const selected = divisions.find((division) => division.id === openId);
    const SelectedIcon = selected?.icon;
    const tabs = selected ? [
        { id: 'overview', label: 'Overview' },
        ...(selected.sections || []).map((section, index) => ({ id: `section-${index}`, label: NAVIGATION_LABELS[section.heading] || section.heading })),
    ] : [];

    const closeDetails = () => {
        setOpenId(null);
    };

    const renderDivisionTab = (tabId) => {
        if (!selected) return null;
        if (tabId === 'overview') return (
            <section className="mx-auto max-w-prose space-y-4">
                <h3 className="text-lg font-bold text-white">Overview</h3>
                {selected.paragraphs.map((paragraph) => <p key={paragraph} className="text-sm leading-6 text-gray-300 sm:text-base sm:leading-7">{paragraph}</p>)}
            </section>
        );
        const section = selected.sections?.[Number(tabId.slice(8))];
        if (!section) return null;
        return (
            <section className="mx-auto max-w-prose space-y-5">
                <h3 className="text-xl font-bold leading-snug text-white">{section.heading}</h3>
                {section.paragraphs?.map((paragraph) => <p key={paragraph} className="text-sm leading-6 text-gray-300 sm:text-base sm:leading-7">{paragraph}</p>)}
                {section.items && (
                    <ul className="list-disc space-y-3 pl-5 text-sm leading-6 text-gray-300 sm:text-base sm:leading-7">
                        {section.items.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                )}
            </section>
        );
    };

    return (
        <section aria-labelledby="functional-divisions-title">
            <div className="text-center">
                <span className="mb-4 inline-flex rounded-full border border-purple-500/40 bg-purple-500/10 px-3 py-1 font-inter text-xs font-bold uppercase leading-[18px] tracking-wider text-purple-300 lg:text-lg lg:leading-7">
                    The Engine Room
                </span>
                <h2 id="functional-divisions-title" className={styles.sectionTitle}>Functional Divisions</h2>
                <p className={`mx-auto mt-4 max-w-2xl text-gray-400 ${styles.sectionDescription}`}>How we organize our volunteers to deliver consistent quality.</p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 lg:mt-20">
                {divisions.map((division) => {
                    const Icon = division.icon;
                    const isOpen = division.id === openId;
                    return (
                        <article key={division.id} className={`${styles.interactiveCard} relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-neutral-800 bg-[#191919] p-6 ${division.iconColor}`}>
                            <div className={`absolute inset-x-0 top-0 h-1 ${division.accentColor}`} aria-hidden="true" />
                            <div className={`${styles.interactiveCardIcon} flex h-12 w-12 items-center justify-center rounded-lg border ${division.iconFrame}`}>
                                <Icon className={`h-6 w-6 ${division.iconColor}`} aria-hidden="true" />
                            </div>
                            <h3 className="mt-6 font-inter text-xl font-bold leading-8 text-white">{division.title}</h3>
                            <p className="mt-3 font-inter text-sm leading-[22px] text-gray-400">{division.description}</p>
                            <div className="mt-auto pt-6">
                                <button
                                    type="button"
                                    aria-expanded={isOpen}
                                    aria-haspopup="dialog"
                                    aria-label={`View ${division.title} details`}
                                    onClick={() => { setActiveTab('overview'); setOpenId(division.id); }}
                                    className={`inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-semibold after:absolute after:inset-0 after:z-10 after:rounded-xl after:content-[''] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current ${division.iconColor}`}
                                >
                                    View details
                                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                </button>
                            </div>
                        </article>
                    );
                })}
            </div>

            <ContentDetailModal
                open={Boolean(selected)}
                onClose={closeDetails}
                title={selected?.title || 'Division details'}
                subtitle="Functional Divisions"
                leading={selected && <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${selected.iconFrame}`}><SelectedIcon className={`h-6 w-6 ${selected.iconColor}`} aria-hidden="true" /></span>}
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                renderTab={renderDivisionTab}
            />
        </section>
    );
}
