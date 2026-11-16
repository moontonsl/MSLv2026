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
    const isLegacyNews = module === 'News Management';
    const pageTitle = isLegacyNews ? 'Legacy News Manager' : module;
    const pageDescription = isLegacyNews
        ? 'Review and manage news records from the legacy publishing workflow.'
        : `Review and manage ${module.toLowerCase()} records.`;
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
        <AdminLayout activeNavId={isLegacyNews ? 'legacy-news' : 'management'}>
            <Head title={pageTitle} />
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                    <h1 className="text-2xl font-bold text-white sm:text-3xl">{pageTitle}</h1>
                    <p className="mt-2 text-sm leading-6 text-gray-400">
                        {pageDescription}
                    </p>
                </div>
                {createRoute && (
                    <Link
                        href={route(createRoute)}
                        className="inline-flex min-h-[44px] w-full shrink-0 items-center justify-center rounded bg-amber-400 px-4 py-2 font-semibold text-black hover:bg-amber-300 sm:w-auto"
                    >
                        Create
                    </Link>
                )}
            </div>
            <div className="space-y-3">
                {items.length === 0 && <div className="rounded border border-neutral-800 bg-neutral-900 p-5 text-gray-400">No records found.</div>}
                {items.map((record) => (
                    <div
                        key={record.id}
                        className="flex flex-col justify-between gap-4 rounded border border-neutral-800 bg-neutral-900 p-4 text-sm text-gray-300 sm:flex-row sm:items-center"
                    >
                        <span className="min-w-0 flex-1 break-words">{values(record)}</span>
                        <span className="flex shrink-0 flex-wrap gap-2">
                            {editRoute && (
                                <Link
                                    href={route(editRoute, record.id)}
                                    className="inline-flex min-h-[38px] items-center justify-center rounded border border-neutral-700 px-3.5 py-1 text-xs hover:border-amber-400 hover:text-amber-400"
                                >
                                    Edit
                                </Link>
                            )}
                            {deleteRoute && (
                                <button
                                    type="button"
                                    onClick={() => window.confirm('Delete this record?') && router.delete(route(deleteRoute, record.id))}
                                    className="inline-flex min-h-[38px] items-center justify-center rounded border border-red-900 px-3.5 py-1 text-xs text-red-400 hover:bg-red-950"
                                >
                                    Delete
                                </button>
                            )}
                        </span>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
