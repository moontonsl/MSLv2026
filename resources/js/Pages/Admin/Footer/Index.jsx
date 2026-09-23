import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { Plus, Save, Trash2 } from 'lucide-react';

const FIELD_CLASS = 'min-h-[44px] w-full rounded-md border border-neutral-800 bg-[#1a1a1a] px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-yellow-500';
const ERROR_CLASS = 'mt-1 text-sm text-red-400';
const DEFAULT_SECTIONS = [
    {
        title: 'Explore',
        links: [
            { label: 'Events', href: '/Events' },
            { label: 'News', href: '/News' },
            { label: 'Programs', href: '/Programs' },
            { label: 'Resources', href: '/Resources' },
        ],
    },
    {
        title: 'Legal',
        links: [
            { label: 'Privacy Policy', href: '/PrivacyPolicy' },
            { label: 'Terms of Use', href: '/TermsAndConditions' },
        ],
    },
];

function NavigationSection({ section, sectionIndex, onChange, onRemove, onAddLink, onRemoveLink }) {
    return (
        <div className="rounded-lg border border-neutral-800 bg-[#1a1a1a] p-4">
            <div className="flex items-start gap-3">
                <div className="flex-1">
                    <label htmlFor={`footer-section-${sectionIndex}`} className="mb-2 block text-sm font-medium text-gray-300">Section title</label>
                    <input id={`footer-section-${sectionIndex}`} type="text" value={section.title} onChange={(event) => onChange(sectionIndex, 'title', event.target.value)} className={FIELD_CLASS} placeholder="Explore" />
                </div>
                <button type="button" onClick={() => onRemove(sectionIndex)} className="mt-7 flex min-h-10 min-w-10 items-center justify-center rounded-md border border-red-900 text-red-400 hover:bg-red-950" aria-label={`Remove section ${section.title || sectionIndex + 1}`}><Trash2 className="h-4 w-4" /></button>
            </div>
            <div className="mt-4 space-y-3">
                {section.links.map((link, linkIndex) => (
                    <div key={`${sectionIndex}-${linkIndex}`} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                        <label className="sr-only" htmlFor={`footer-link-label-${sectionIndex}-${linkIndex}`}>Link label</label>
                        <input id={`footer-link-label-${sectionIndex}-${linkIndex}`} type="text" value={link.label} onChange={(event) => onChange(sectionIndex, 'link', event.target.value, linkIndex, 'label')} className={FIELD_CLASS} placeholder="Link label" />
                        <label className="sr-only" htmlFor={`footer-link-href-${sectionIndex}-${linkIndex}`}>Link path</label>
                        <input id={`footer-link-href-${sectionIndex}-${linkIndex}`} type="text" value={link.href} onChange={(event) => onChange(sectionIndex, 'link', event.target.value, linkIndex, 'href')} className={FIELD_CLASS} placeholder="/path or https://..." />
                        <button type="button" onClick={() => onRemoveLink(sectionIndex, linkIndex)} className="flex min-h-10 min-w-10 items-center justify-center rounded-md border border-neutral-700 text-gray-400 hover:border-red-900 hover:text-red-400" aria-label="Remove link"><Trash2 className="h-4 w-4" /></button>
                    </div>
                ))}
                <button type="button" onClick={() => onAddLink(sectionIndex)} className="inline-flex min-h-10 items-center gap-2 rounded-md border border-neutral-700 px-3 text-sm text-gray-300 hover:border-yellow-500 hover:text-yellow-400"><Plus className="h-4 w-4" />Add link</button>
            </div>
        </div>
    );
}

export default function FooterIndex({ footer = {} }) {
    const { data, setData, post, processing, errors } = useForm({
        description: footer.description ?? '',
        copyright: footer.copyright ?? '',
        logo: footer.logo ?? '/msl-logo.png',
        facebook_url: footer.facebook_url ?? '',
        youtube_url: footer.youtube_url ?? '',
        tiktok_url: footer.tiktok_url ?? '',
        mlbb_logo: footer.mlbb_logo ?? '/mlbb-logo.png',
        moonton_logo: footer.moonton_logo ?? '/moonton-logo.png',
        nav_sections: footer.nav_sections?.length ? footer.nav_sections : DEFAULT_SECTIONS,
    });

    const updateSection = (sectionIndex, field, value, linkIndex = null, linkField = null) => {
        const sections = data.nav_sections.map((section, currentIndex) => {
            if (currentIndex !== sectionIndex) return section;
            if (field === 'link') {
                return { ...section, links: section.links.map((link, currentLinkIndex) => currentLinkIndex === linkIndex ? { ...link, [linkField]: value } : link) };
            }
            return { ...section, [field]: value };
        });
        setData('nav_sections', sections);
    };

    const addSection = () => setData('nav_sections', [...data.nav_sections, { title: '', links: [{ label: '', href: '' }] }]);
    const removeSection = (sectionIndex) => setData('nav_sections', data.nav_sections.filter((_, index) => index !== sectionIndex));
    const addLink = (sectionIndex) => setData('nav_sections', data.nav_sections.map((section, index) => index === sectionIndex ? { ...section, links: [...section.links, { label: '', href: '' }] } : section));
    const removeLink = (sectionIndex, linkIndex) => setData('nav_sections', data.nav_sections.map((section, index) => index === sectionIndex ? { ...section, links: section.links.filter((_, currentIndex) => currentIndex !== linkIndex) } : section));

    const submit = (event) => {
        event.preventDefault();
        post(route('admin.footer.update'), { preserveScroll: true });
    };

    return (
        <AdminLayout activeNavId="footer" showGlobalSearch>
            <Head title="Footer Management" />

            <div className="mb-6 sm:mb-8"><h1 className="text-2xl font-bold text-white sm:text-3xl">Footer Management</h1><p className="mt-2 text-sm text-gray-400">Manage the public footer content, social links, logos, and navigation sections.</p></div>

            <form onSubmit={submit} className="max-w-6xl space-y-6">
                <section className="rounded-xl border border-neutral-800 bg-[#111111] p-4 sm:p-6 md:p-8">
                    <div className="mb-6"><h2 className="text-lg font-bold text-yellow-500">Basic information</h2><p className="mt-1 text-sm text-gray-400">These values are shared with the public MSLv2026 footer.</p></div>
                    <div className="space-y-5">
                        <div><label htmlFor="footer-description" className="mb-2 block text-sm font-medium text-gray-300">Description</label><textarea id="footer-description" rows="4" value={data.description} onChange={(event) => setData('description', event.target.value)} className={FIELD_CLASS} placeholder="Footer description text..." />{errors.description && <p className={ERROR_CLASS}>{errors.description}</p>}</div>
                        <div><label htmlFor="footer-copyright" className="mb-2 block text-sm font-medium text-gray-300">Copyright text</label><input id="footer-copyright" type="text" value={data.copyright} onChange={(event) => setData('copyright', event.target.value)} className={FIELD_CLASS} placeholder="© 2025 Moonton Student Leaders Philippines. All rights reserved." />{errors.copyright && <p className={ERROR_CLASS}>{errors.copyright}</p>}</div>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-3"><div><label htmlFor="footer-logo" className="mb-2 block text-sm font-medium text-gray-300">Main logo path</label><input id="footer-logo" type="text" value={data.logo} onChange={(event) => setData('logo', event.target.value)} className={FIELD_CLASS} placeholder="/msl-logo.png" />{errors.logo && <p className={ERROR_CLASS}>{errors.logo}</p>}</div><div><label htmlFor="footer-mlbb-logo" className="mb-2 block text-sm font-medium text-gray-300">MLBB logo path</label><input id="footer-mlbb-logo" type="text" value={data.mlbb_logo} onChange={(event) => setData('mlbb_logo', event.target.value)} className={FIELD_CLASS} placeholder="/mlbb-logo.png" />{errors.mlbb_logo && <p className={ERROR_CLASS}>{errors.mlbb_logo}</p>}</div><div><label htmlFor="footer-moonton-logo" className="mb-2 block text-sm font-medium text-gray-300">Moonton logo path</label><input id="footer-moonton-logo" type="text" value={data.moonton_logo} onChange={(event) => setData('moonton_logo', event.target.value)} className={FIELD_CLASS} placeholder="/moonton-logo.png" />{errors.moonton_logo && <p className={ERROR_CLASS}>{errors.moonton_logo}</p>}</div></div>
                    </div>
                </section>

                <section className="rounded-xl border border-neutral-800 bg-[#111111] p-4 sm:p-6 md:p-8"><div className="mb-6"><h2 className="text-lg font-bold text-yellow-500">Social media links</h2><p className="mt-1 text-sm text-gray-400">TikTok is retained as an MSLv2026 extension because the current public footer already displays it.</p></div><div className="grid grid-cols-1 gap-5 md:grid-cols-3"><div><label htmlFor="footer-facebook" className="mb-2 block text-sm font-medium text-gray-300">Facebook URL</label><input id="footer-facebook" type="url" value={data.facebook_url} onChange={(event) => setData('facebook_url', event.target.value)} className={FIELD_CLASS} placeholder="https://www.facebook.com/MSLPhilippines" />{errors.facebook_url && <p className={ERROR_CLASS}>{errors.facebook_url}</p>}</div><div><label htmlFor="footer-youtube" className="mb-2 block text-sm font-medium text-gray-300">YouTube URL</label><input id="footer-youtube" type="url" value={data.youtube_url} onChange={(event) => setData('youtube_url', event.target.value)} className={FIELD_CLASS} placeholder="https://www.youtube.com/@MSLPhilippines" />{errors.youtube_url && <p className={ERROR_CLASS}>{errors.youtube_url}</p>}</div><div><label htmlFor="footer-tiktok" className="mb-2 block text-sm font-medium text-gray-300">TikTok URL</label><input id="footer-tiktok" type="url" value={data.tiktok_url} onChange={(event) => setData('tiktok_url', event.target.value)} className={FIELD_CLASS} placeholder="https://www.tiktok.com/@mslphilippines" />{errors.tiktok_url && <p className={ERROR_CLASS}>{errors.tiktok_url}</p>}</div></div></section>

                <section className="rounded-xl border border-neutral-800 bg-[#111111] p-4 sm:p-6 md:p-8"><div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-lg font-bold text-yellow-500">Navigation sections</h2><p className="mt-1 text-sm text-gray-400">Configure grouped footer links. Internal paths and external URLs are supported.</p></div><button type="button" onClick={addSection} className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border border-yellow-700 px-4 text-sm font-semibold text-yellow-400 hover:bg-yellow-500/10"><Plus className="h-4 w-4" />Add section</button></div><div className="space-y-4">{data.nav_sections.map((section, index) => <NavigationSection key={`section-${index}`} section={section} sectionIndex={index} onChange={updateSection} onRemove={removeSection} onAddLink={addLink} onRemoveLink={removeLink} />)}</div>{errors.nav_sections && <p className={ERROR_CLASS}>{errors.nav_sections}</p>}{Object.entries(errors).filter(([key]) => key.startsWith('nav_sections.')).map(([key, message]) => <p key={key} className={ERROR_CLASS}>{message}</p>)}</section>

                <div className="flex justify-end pb-4"><button type="submit" disabled={processing} className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-yellow-500 px-5 py-2.5 text-sm font-bold text-black hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"><Save className="h-4 w-4" />{processing ? 'Saving...' : 'Save Footer Settings'}</button></div>
            </form>
        </AdminLayout>
    );
}
