/**
 * Shared Campus Tournament page header (MSL crest + title).
 *
 * @param {{
 *   title?: string;
 *   subtitle?: string;
 *   centered?: boolean;
 *   children?: import('react').ReactNode;
 * }} props
 */
export default function CampusTournamentPageHeader({
    title = 'Campus Tournament',
    subtitle,
    centered = false,
    children,
}) {
    if (centered) {
        return (
            <div className="flex flex-col items-center text-center">
                <img
                    src="/msl-logo.png"
                    alt="MSL"
                    className="h-16 w-16 object-contain sm:h-20 sm:w-20"
                />
                <h1 className="mt-3 text-2xl font-black uppercase tracking-wide text-white sm:text-3xl">
                    {title}
                </h1>
                {subtitle ? <p className="mt-1 text-sm text-gray-400">{subtitle}</p> : null}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
                <img
                    src="/msl-logo.png"
                    alt="MSL"
                    className="h-11 w-11 shrink-0 object-contain sm:h-12 sm:w-12"
                />
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-wide text-white sm:text-3xl md:text-4xl">
                        {title}
                    </h1>
                    {subtitle ? <p className="mt-1 text-sm text-gray-400">{subtitle}</p> : null}
                </div>
            </div>
            {children}
        </div>
    );
}
