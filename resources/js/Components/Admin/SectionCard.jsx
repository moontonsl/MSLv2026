export default function SectionCard({
    title,
    description,
    children,
    headerRight,
    registrationMobile = false,
}) {
    return (
        <section
            className={
                registrationMobile
                    ? "mb-11 -mx-4 w-auto rounded-none border-y border-neutral-900 bg-[#111111] px-4 py-6 sm:mx-0 sm:mb-8 sm:w-full sm:rounded-xl sm:border sm:border-neutral-800 sm:p-6 md:p-8"
                    : "mb-8 w-full rounded-xl border border-neutral-800 bg-[#111111] p-6 md:p-8"
            }
        >
            <div
                className={
                    registrationMobile
                        ? "mb-5 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
                        : "mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
                }
            >
                <div>
                    <h2
                        className={
                            registrationMobile
                                ? "text-base font-bold text-[#FBBF24] sm:text-xl"
                                : "text-xl font-bold text-[#FBBF24]"
                        }
                    >
                        {title}
                    </h2>

                    {description ? (
                        <p className="mt-1 text-sm text-gray-400">
                            {description}
                        </p>
                    ) : null}
                </div>

                {headerRight ? (
                    <div
                        className={
                            registrationMobile
                                ? "w-full min-w-0 sm:w-auto sm:shrink-0"
                                : "shrink-0"
                        }
                    >
                        {headerRight}
                    </div>
                ) : null}
            </div>

            {children}
        </section>
    );
}
