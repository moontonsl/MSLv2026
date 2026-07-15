export default function SectionCard({ title, description, children, headerRight }) {
    return (
        <section className="mb-8 w-full rounded-xl border border-neutral-800 bg-[#111111] p-6 md:p-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h2 className="text-xl font-bold text-[#FBBF24]">{title}</h2>
                    {description ? (
                        <p className="mt-1 text-sm text-gray-400">{description}</p>
                    ) : null}
                </div>
                {headerRight ? <div className="shrink-0">{headerRight}</div> : null}
            </div>
            {children}
        </section>
    );
}
