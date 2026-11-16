import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Form({ module, action, record = {} }) {
    const isEdit = Boolean(record.id);
    const isNews = module.includes('News');
    const isMcc = module.includes('MCC Season');
    const isMslEvent = module.includes('MSL Event');
    const isCarousel = module.includes('Carousel');
    const isEventPhoto = module.includes('Event Photo');
    const isEvent = module.endsWith('Event') || module.includes('Create Event') || module.includes('Edit Event');
    const { data, setData, post, processing, errors } = useForm({
        _method: isEdit ? 'PUT' : 'POST',
        image: null,
        title: record.title ?? '',
        description: record.description ?? '',
        start_date: record.start_date ?? '',
        end_date: record.end_date ?? '',
        location: record.location ?? '',
        news_title: record.news_title ?? '',
        news_subtitle: record.news_subtitle ?? '',
        news_author: record.news_writer ?? '',
        news_canonical: record.news_canonical ?? '',
        news_content: record.news_content ?? '',
        news_img1: null,
        news_img2: null,
        news_img3: null,
        news_state: record.news_state ?? 'Published',
        event_name: record.event_name ?? '',
        event_title: record.event_title ?? '',
        event_subtitle: record.event_subtitle ?? '',
        event_content01: record.event_content01 ?? '',
        event_logo: null,
        school_name: record.school_name ?? '',
        picture: null,
        event_state: record.event_state ?? 'Active',
        event_canonical: record.event_canonical ?? '',
        season_number: record.season_number ?? '',
        season_name: record.season_name ?? '',
        route_slug: record.route_slug ?? '',
        is_active: Boolean(record.is_active),
    });

    const submit = (event) => {
        event.preventDefault();
        post(action, { forceFormData: true });
    };

    return (
        <AdminLayout activeNavId="management">
            <Head title={module} />
            <header className="mb-6 sm:mb-8">
                <h1 className="text-2xl font-bold text-white sm:text-3xl">{module}</h1>
                <p className="mt-2 text-sm leading-6 text-gray-400">
                    Update the details for this {module.toLowerCase()} record.
                </p>
            </header>
            <form onSubmit={submit} className="w-full space-y-4 rounded-lg border border-neutral-800 bg-neutral-900 p-4 sm:p-6">
                {isMcc ? <>
                    <input type="number" className="min-h-[44px] w-full min-w-0 rounded border-neutral-700 bg-neutral-800 px-3 text-white" placeholder="Season number" value={data.season_number} onChange={(event) => setData('season_number', event.target.value)} />
                    <input className="min-h-[44px] w-full min-w-0 rounded border-neutral-700 bg-neutral-800 px-3 text-white" placeholder="Season name" value={data.season_name} onChange={(event) => setData('season_name', event.target.value)} />
                    <input className="min-h-[44px] w-full min-w-0 rounded border-neutral-700 bg-neutral-800 px-3 text-white" placeholder="Route slug" value={data.route_slug} onChange={(event) => setData('route_slug', event.target.value)} />
                    <textarea className="min-h-32 w-full min-w-0 rounded border-neutral-700 bg-neutral-800 p-3 text-white" placeholder="Description" value={data.description} onChange={(event) => setData('description', event.target.value)} />
                </> : isNews ? <>
                    <input className="min-h-[44px] w-full min-w-0 rounded border-neutral-700 bg-neutral-800 px-3 text-white" placeholder="News title" value={data.news_title} onChange={(event) => setData('news_title', event.target.value)} />
                    <input className="min-h-[44px] w-full min-w-0 rounded border-neutral-700 bg-neutral-800 px-3 text-white" placeholder="Author" value={data.news_author} onChange={(event) => setData('news_author', event.target.value)} />
                    <input className="min-h-[44px] w-full min-w-0 rounded border-neutral-700 bg-neutral-800 px-3 text-white" placeholder="Canonical slug (optional)" value={data.news_canonical} onChange={(event) => setData('news_canonical', event.target.value)} />
                    <textarea className="min-h-32 w-full min-w-0 rounded border-neutral-700 bg-neutral-800 p-3 text-white" placeholder="News content" value={data.news_content} onChange={(event) => setData('news_content', event.target.value)} />
                    <input type="file" accept="image/*" className="block w-full max-w-full text-sm text-gray-300 file:mr-3 file:rounded file:border-0 file:bg-amber-400 file:px-3 file:py-1.5 file:font-semibold file:text-black" onChange={(event) => setData('news_img1', event.target.files[0])} />
                </> : isCarousel ? <>
                    <input className="min-h-[44px] w-full min-w-0 rounded border-neutral-700 bg-neutral-800 px-3 text-white" placeholder="Carousel title" value={data.title} onChange={(event) => setData('title', event.target.value)} />
                    <input type="file" accept="image/*" required={!isEdit} className="block w-full max-w-full text-sm text-gray-300 file:mr-3 file:rounded file:border-0 file:bg-amber-400 file:px-3 file:py-1.5 file:font-semibold file:text-black" onChange={(event) => setData('image', event.target.files[0])} />
                </> : isEventPhoto ? <>
                    <input className="min-h-[44px] w-full min-w-0 rounded border-neutral-700 bg-neutral-800 px-3 text-white" placeholder="Event name" value={data.event_name} onChange={(event) => setData('event_name', event.target.value)} />
                    <input className="min-h-[44px] w-full min-w-0 rounded border-neutral-700 bg-neutral-800 px-3 text-white" placeholder="School name" value={data.school_name} onChange={(event) => setData('school_name', event.target.value)} />
                    <input type="file" accept="image/*" required={!isEdit} className="block w-full max-w-full text-sm text-gray-300 file:mr-3 file:rounded file:border-0 file:bg-amber-400 file:px-3 file:py-1.5 file:font-semibold file:text-black" onChange={(event) => setData('picture', event.target.files[0])} />
                </> : isMslEvent ? <>
                    <input className="min-h-[44px] w-full min-w-0 rounded border-neutral-700 bg-neutral-800 px-3 text-white" placeholder="Event name" value={data.event_name} onChange={(event) => setData('event_name', event.target.value)} />
                    <input className="min-h-[44px] w-full min-w-0 rounded border-neutral-700 bg-neutral-800 px-3 text-white" placeholder="Event title" value={data.event_title} onChange={(event) => setData('event_title', event.target.value)} />
                    <input className="min-h-[44px] w-full min-w-0 rounded border-neutral-700 bg-neutral-800 px-3 text-white" placeholder="Canonical slug (optional)" value={data.event_canonical} onChange={(event) => setData('event_canonical', event.target.value)} />
                    <textarea className="min-h-32 w-full min-w-0 rounded border-neutral-700 bg-neutral-800 p-3 text-white" placeholder="Event subtitle" value={data.event_subtitle} onChange={(event) => setData('event_subtitle', event.target.value)} />
                    <input type="file" accept="image/*" className="block w-full max-w-full text-sm text-gray-300 file:mr-3 file:rounded file:border-0 file:bg-amber-400 file:px-3 file:py-1.5 file:font-semibold file:text-black" onChange={(event) => setData('event_logo', event.target.files[0])} />
                </> : <>
                    <input className="min-h-[44px] w-full min-w-0 rounded border-neutral-700 bg-neutral-800 px-3 text-white" placeholder="Title / name" value={data.title} onChange={(event) => setData('title', event.target.value)} />
                    <textarea className="min-h-32 w-full min-w-0 rounded border-neutral-700 bg-neutral-800 p-3 text-white" placeholder="Description / content" value={data.description} onChange={(event) => setData('description', event.target.value)} />
                    {isEvent && <>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <input type="datetime-local" className="min-h-[44px] w-full min-w-0 rounded border-neutral-700 bg-neutral-800 px-3 text-white [color-scheme:dark]" value={data.start_date} onChange={(event) => setData('start_date', event.target.value)} />
                            <input type="datetime-local" className="min-h-[44px] w-full min-w-0 rounded border-neutral-700 bg-neutral-800 px-3 text-white [color-scheme:dark]" value={data.end_date} onChange={(event) => setData('end_date', event.target.value)} />
                        </div>
                        <input className="min-h-[44px] w-full min-w-0 rounded border-neutral-700 bg-neutral-800 px-3 text-white" placeholder="Location" value={data.location} onChange={(event) => setData('location', event.target.value)} />
                    </>}
                </>}
                {Object.values(errors).map((error) => <p key={error} className="text-sm text-red-400">{error}</p>)}
                <button disabled={processing} className="inline-flex min-h-[44px] w-full items-center justify-center rounded bg-amber-400 px-5 py-2 font-semibold text-black hover:bg-amber-300 disabled:opacity-50 sm:w-auto">Save</button>
            </form>
        </AdminLayout>
    );
}
