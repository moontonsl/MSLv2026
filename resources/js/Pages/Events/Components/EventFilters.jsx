import { Search } from "lucide-react";
import { focusStyles } from "../eventStyles";

export default function EventFilters({
    filters,
    activeFilter,
    query,
    onFilterChange,
    onQueryChange,
}) {
    return (
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div
                role="group"
                aria-label="Filter events by status"
                className="flex flex-wrap items-center gap-3 lg:gap-5"
            >
                {filters.map((filter) => {
                    const isActive = filter.key === activeFilter;

                    return (
                        <button
                            key={filter.key}
                            type="button"
                            aria-pressed={isActive}
                            onClick={() => onFilterChange(filter.key)}
                            className={`inline-flex h-11 items-center justify-center whitespace-nowrap rounded-xl border px-[15px] text-body-sm font-semibold transition-colors lg:h-[52px] lg:text-body-xl ${
                                isActive
                                    ? "border-brand-500/20 bg-brand-600 text-black"
                                    : "border-gray-500 bg-white/[0.08] text-gray-500 hover:border-gray-300 hover:text-gray-300"
                            } ${focusStyles}`}
                        >
                            {filter.label}
                        </button>
                    );
                })}
            </div>

            <label className="flex h-[52px] w-full items-center gap-2.5 rounded-xl border border-gray-300/70 bg-white/[0.06] px-3 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-400/30 xl:w-[350px] xl:shrink-0">
                <span className="sr-only">Search events</span>

                <Search
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 text-gray-500"
                />

                <input
                    type="search"
                    value={query}
                    onChange={(event) => onQueryChange(event.target.value)}
                    placeholder="Search events, schools, location..."
                    className="min-w-0 flex-1 truncate border-0 bg-transparent p-0 text-body-lg font-normal text-white outline-none placeholder:text-gray-500 focus:ring-0"
                />
            </label>
        </div>
    );
}
