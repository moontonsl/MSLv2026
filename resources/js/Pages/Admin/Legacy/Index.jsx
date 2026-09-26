import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';

function values(record) {
    return Object.entries(record ?? {})
        .filter(([key]) => !['updated_at', 'created_at', 'deleted_at'].includes(key))
        .slice(0, 6)
        .map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value ?? ''}`)
        .join(' • ');
}

export default function Index({ module, records, createRoute }) {
    const items = records?.data ?? records ?? [];
    const editRoute = module.includes('News Management') ? 'admin.news.edit'
        : module.includes('Event Calendar') ? 'admin.events.edit'
            : module.includes('MSL Event') ? 'admin.msl-events.edit'
                : module.includes('MCC Season') ? 'admin.mcc-seasons.edit'
                    : null;
    const deleteRoute = module.includes('News Management') ? 'admin.news.delete'
        : module.includes('Event Calendar') ? 'admin.events.delete'
            : module.includes('MSL Event') ? 'admin.msl-events.destroy'
                : module.includes('Carousel') ? 'admin.carousel.delete'
                    : module.includes('Event Photos') ? 'admin.event-photos.delete'
                        : module.includes('Share Links') ? 'admin.share-links.destroy'
                            : null;

    return (
        <AdminLayout activeNavId="management">
            <Head title={module} />
            <div className="mb-6 flex items-center justify-between gap-4">
                <h1 className="text-3xl font-bold">{module}</h1>
                {createRoute && <Link href={route(createRoute)} className="rounded bg-amber-400 px-4 py-2 font-semibold text-black">Create</Link>}
            </div>
            <div className="space-y-3">
                {items.length === 0 && <div className="rounded border border-neutral-800 bg-neutral-900 p-5 text-gray-400">No records found.</div>}
                {items.map((record) => (
                    <div key={record.id} className="flex items-center justify-between gap-4 rounded border border-neutral-800 bg-neutral-900 p-4 text-sm text-gray-300">
                        <span>{values(record)}</span>
                        <span className="flex shrink-0 gap-2">
                            {editRoute && <Link href={route(editRoute, record.id)} className="rounded border border-neutral-700 px-3 py-1 text-xs hover:border-amber-400 hover:text-amber-400">Edit</Link>}
                            {deleteRoute && <button type="button" onClick={() => window.confirm('Delete this record?') && router.delete(route(deleteRoute, record.id))} className="rounded border border-red-900 px-3 py-1 text-xs text-red-400 hover:bg-red-950">Delete</button>}
                        </span>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
