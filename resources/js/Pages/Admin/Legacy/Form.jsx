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
            <h1 className="mb-6 text-3xl font-bold">{module}</h1>
            <form onSubmit={submit} className="max-w-2xl space-y-4 rounded-lg border border-neutral-800 bg-neutral-900 p-6">
                {isMcc ? <>
                    <input type="number" className="w-full rounded border-neutral-700 bg-neutral-800 text-white" placeholder="Season number" value={data.season_number} onChange={(event) => setData('season_number', event.target.value)} />
                    <input className="w-full rounded border-neutral-700 bg-neutral-800 text-white" placeholder="Season name" value={data.season_name} onChange={(event) => setData('season_name', event.target.value)} />
                    <input className="w-full rounded border-neutral-700 bg-neutral-800 text-white" placeholder="Route slug" value={data.route_slug} onChange={(event) => setData('route_slug', event.target.value)} />
                    <textarea className="min-h-32 w-full rounded border-neutral-700 bg-neutral-800 text-white" placeholder="Description" value={data.description} onChange={(event) => setData('description', event.target.value)} />
                </> : isNews ? <>
                    <input className="w-full rounded border-neutral-700 bg-neutral-800 text-white" placeholder="News title" value={data.news_title} onChange={(event) => setData('news_title', event.target.value)} />
                    <input className="w-full rounded border-neutral-700 bg-neutral-800 text-white" placeholder="Author" value={data.news_author} onChange={(event) => setData('news_author', event.target.value)} />
                    <input className="w-full rounded border-neutral-700 bg-neutral-800 text-white" placeholder="Canonical slug (optional)" value={data.news_canonical} onChange={(event) => setData('news_canonical', event.target.value)} />
                    <textarea className="min-h-32 w-full rounded border-neutral-700 bg-neutral-800 text-white" placeholder="News content" value={data.news_content} onChange={(event) => setData('news_content', event.target.value)} />
                    <input type="file" accept="image/*" onChange={(event) => setData('news_img1', event.target.files[0])} />
                </> : isCarousel ? <>
                    <input className="w-full rounded border-neutral-700 bg-neutral-800 text-white" placeholder="Carousel title" value={data.title} onChange={(event) => setData('title', event.target.value)} />
                    <input type="file" accept="image/*" required={!isEdit} onChange={(event) => setData('image', event.target.files[0])} />
                </> : isEventPhoto ? <>
                    <input className="w-full rounded border-neutral-700 bg-neutral-800 text-white" placeholder="Event name" value={data.event_name} onChange={(event) => setData('event_name', event.target.value)} />
                    <input className="w-full rounded border-neutral-700 bg-neutral-800 text-white" placeholder="School name" value={data.school_name} onChange={(event) => setData('school_name', event.target.value)} />
                    <input type="file" accept="image/*" required={!isEdit} onChange={(event) => setData('picture', event.target.files[0])} />
                </> : isMslEvent ? <>
                    <input className="w-full rounded border-neutral-700 bg-neutral-800 text-white" placeholder="Event name" value={data.event_name} onChange={(event) => setData('event_name', event.target.value)} />
                    <input className="w-full rounded border-neutral-700 bg-neutral-800 text-white" placeholder="Event title" value={data.event_title} onChange={(event) => setData('event_title', event.target.value)} />
                    <input className="w-full rounded border-neutral-700 bg-neutral-800 text-white" placeholder="Canonical slug (optional)" value={data.event_canonical} onChange={(event) => setData('event_canonical', event.target.value)} />
                    <textarea className="min-h-32 w-full rounded border-neutral-700 bg-neutral-800 text-white" placeholder="Event subtitle" value={data.event_subtitle} onChange={(event) => setData('event_subtitle', event.target.value)} />
                    <input type="file" accept="image/*" onChange={(event) => setData('event_logo', event.target.files[0])} />
                </> : <>
                    <input className="w-full rounded border-neutral-700 bg-neutral-800 text-white" placeholder="Title / name" value={data.title} onChange={(event) => setData('title', event.target.value)} />
                    <textarea className="min-h-32 w-full rounded border-neutral-700 bg-neutral-800 text-white" placeholder="Description / content" value={data.description} onChange={(event) => setData('description', event.target.value)} />
                    {isEvent && <>
                        <div className="grid gap-4 md:grid-cols-2">
                            <input type="datetime-local" className="rounded border-neutral-700 bg-neutral-800 text-white" value={data.start_date} onChange={(event) => setData('start_date', event.target.value)} />
                            <input type="datetime-local" className="rounded border-neutral-700 bg-neutral-800 text-white" value={data.end_date} onChange={(event) => setData('end_date', event.target.value)} />
                        </div>
                        <input className="w-full rounded border-neutral-700 bg-neutral-800 text-white" placeholder="Location" value={data.location} onChange={(event) => setData('location', event.target.value)} />
                    </>}
                </>}
                {Object.values(errors).map((error) => <p key={error} className="text-sm text-red-400">{error}</p>)}
                <button disabled={processing} className="rounded bg-amber-400 px-4 py-2 font-semibold text-black">Save</button>
            </form>
        </AdminLayout>
    );
}
