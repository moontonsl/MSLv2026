export default function AdminPageSkeleton({ rows = 6 }) {
    return (
        <div className="space-y-6" aria-label="Loading admin page" aria-busy="true">
            <div className="h-9 w-64 animate-pulse rounded bg-neutral-800" />
            <div className="rounded-xl border border-neutral-800 bg-[#111111] p-6">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div className="h-6 w-48 animate-pulse rounded bg-neutral-800" />
                    <div className="h-11 w-56 animate-pulse rounded bg-neutral-800" />
                </div>
                <div className="space-y-4">
                    {Array.from({ length: rows }).map((_, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-1 gap-3 border-b border-neutral-800/70 pb-4 md:grid-cols-4"
                        >
                            <div className="h-5 animate-pulse rounded bg-neutral-800" />
                            <div className="h-5 animate-pulse rounded bg-neutral-800" />
                            <div className="h-5 animate-pulse rounded bg-neutral-800" />
                            <div className="h-10 animate-pulse rounded bg-neutral-800" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
