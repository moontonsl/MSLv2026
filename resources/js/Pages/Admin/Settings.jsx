import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { Image, Save, ShieldCheck } from 'lucide-react';

const FIELD_CLASS = 'min-h-[44px] w-full rounded-md border border-neutral-800 bg-[#1a1a1a] px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-yellow-500';
const ERROR_CLASS = 'mt-1 text-sm text-red-400';

function AssetPreview({ label, url, file, compact = false }) {
    return (
        <div className="mt-3 flex items-center gap-4 rounded-lg border border-neutral-800 bg-[#1a1a1a] p-3">
            <div className={`flex shrink-0 items-center justify-center overflow-hidden rounded-md bg-neutral-900 ${compact ? 'h-12 w-12' : 'h-16 w-24'}`}>
                {url ? <img src={url} alt={`Current ${label}`} className="h-full w-full object-contain" /> : <Image className="h-6 w-6 text-neutral-600" />}
            </div>
            <div className="min-w-0 text-sm">
                <p className="text-gray-300">{file ? `Selected: ${file.name}` : url ? `Current ${label}` : `No ${label} uploaded`}</p>
                {file && <p className="mt-1 text-xs text-yellow-500">The selected file will replace the current asset when saved.</p>}
            </div>
        </div>
    );
}

export default function Settings({ settings = {} }) {
    const { data, setData, post, processing, errors } = useForm({
        website_name: settings.website_name ?? '',
        website_title: settings.website_title ?? '',
        maintenance_mode: Boolean(settings.maintenance_mode),
        maintenance_message: settings.maintenance_message ?? '',
        logo: null,
        favicon: null,
    });

    const submit = (event) => {
        event.preventDefault();
        post(route('admin.settings.update'), { forceFormData: true, preserveScroll: true });
    };

    return (
        <AdminLayout activeNavId="settings" showGlobalSearch>
            <Head title="Website Settings" />

            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl font-bold text-white sm:text-3xl">Website Settings</h1>
                <p className="mt-2 text-sm text-gray-400">Manage the public website identity and maintenance notice.</p>
            </div>

            <form onSubmit={submit} className="max-w-4xl space-y-6">
                <section className="rounded-xl border border-neutral-800 bg-[#111111] p-4 sm:p-6 md:p-8">
                    <div className="mb-6 flex items-start gap-3">
                        <div className="rounded-lg bg-yellow-500/10 p-2 text-yellow-500"><ShieldCheck className="h-5 w-5" /></div>
                        <div><h2 className="text-lg font-bold text-yellow-500">Website identity</h2><p className="mt-1 text-sm text-gray-400">These values are stored for the website title and name.</p></div>
                    </div>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                            <label htmlFor="website-name" className="mb-2 block text-sm font-medium text-gray-300">Website name</label>
                            <input id="website-name" type="text" value={data.website_name} onChange={(event) => setData('website_name', event.target.value)} className={FIELD_CLASS} placeholder="MSL Philippines" />
                            {errors.website_name && <p className={ERROR_CLASS}>{errors.website_name}</p>}
                        </div>
                        <div>
                            <label htmlFor="website-title" className="mb-2 block text-sm font-medium text-gray-300">Website title</label>
                            <input id="website-title" type="text" value={data.website_title} onChange={(event) => setData('website_title', event.target.value)} className={FIELD_CLASS} placeholder="Moonton Student Leaders Philippines" />
                            {errors.website_title && <p className={ERROR_CLASS}>{errors.website_title}</p>}
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border border-neutral-800 bg-[#111111] p-4 sm:p-6 md:p-8">
                    <div className="mb-6"><h2 className="text-lg font-bold text-yellow-500">Website assets</h2><p className="mt-1 text-sm text-gray-400">Upload a logo or favicon. Existing uploaded files are cleaned up when replaced.</p></div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="website-logo" className="mb-2 block text-sm font-medium text-gray-300">Logo <span className="font-normal text-gray-500">(max 2 MB)</span></label>
                            <input id="website-logo" type="file" accept="image/png,image/jpeg,image/jpg,image/gif,image/webp" onChange={(event) => setData('logo', event.target.files?.[0] ?? null)} className="block min-h-[44px] w-full rounded-md border border-neutral-800 bg-[#1a1a1a] px-3 py-2 text-sm text-gray-300 file:mr-3 file:rounded file:border-0 file:bg-yellow-500 file:px-3 file:py-1.5 file:font-semibold file:text-black" />
                            <AssetPreview label="logo" url={settings.logo_url} file={data.logo} />
                            {errors.logo && <p className={ERROR_CLASS}>{errors.logo}</p>}
                        </div>
                        <div>
                            <label htmlFor="website-favicon" className="mb-2 block text-sm font-medium text-gray-300">Favicon <span className="font-normal text-gray-500">(max 512 KB)</span></label>
                            <input id="website-favicon" type="file" accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/x-icon" onChange={(event) => setData('favicon', event.target.files?.[0] ?? null)} className="block min-h-[44px] w-full rounded-md border border-neutral-800 bg-[#1a1a1a] px-3 py-2 text-sm text-gray-300 file:mr-3 file:rounded file:border-0 file:bg-yellow-500 file:px-3 file:py-1.5 file:font-semibold file:text-black" />
                            <AssetPreview label="favicon" url={settings.favicon_url} file={data.favicon} compact />
                            {errors.favicon && <p className={ERROR_CLASS}>{errors.favicon}</p>}
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border border-neutral-800 bg-[#111111] p-4 sm:p-6 md:p-8">
                    <div className="mb-6"><h2 className="text-lg font-bold text-yellow-500">Maintenance notice</h2><p className="mt-1 text-sm text-gray-400">Save the maintenance status and message used by the public site integration.</p></div>
                    <label className="flex min-h-[44px] items-center gap-3 text-sm text-gray-300">
                        <input type="checkbox" checked={Boolean(data.maintenance_mode)} onChange={(event) => setData('maintenance_mode', event.target.checked)} className="h-4 w-4 rounded border-neutral-700 bg-[#1a1a1a] text-yellow-500 focus:ring-yellow-500" />
                        Enable maintenance mode
                    </label>
                    {errors.maintenance_mode && <p className={ERROR_CLASS}>{errors.maintenance_mode}</p>}
                    <div className="mt-5">
                        <label htmlFor="maintenance-message" className="mb-2 block text-sm font-medium text-gray-300">Maintenance message</label>
                        <textarea id="maintenance-message" rows="4" value={data.maintenance_message} onChange={(event) => setData('maintenance_message', event.target.value)} className={FIELD_CLASS} placeholder="The site is under maintenance. Please check back later." />
                        {errors.maintenance_message && <p className={ERROR_CLASS}>{errors.maintenance_message}</p>}
                    </div>
                </section>

                <div className="flex justify-end pb-4"><button type="submit" disabled={processing} className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-yellow-500 px-5 py-2.5 text-sm font-bold text-black hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"><Save className="h-4 w-4" />{processing ? 'Saving...' : 'Save Settings'}</button></div>
            </form>
        </AdminLayout>
    );
}
