import { Search } from "lucide-react";

export default function NewsFilters({
    options,
    activeFilter,
    searchQuery,
    onFilterChange,
    onSearchChange,
}) {
    return (
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div
                role="group"
                aria-label="Article categories"
                className="hide-scrollbar flex gap-4 overflow-x-auto pb-1"
            >
                {options.map(({ value, label }) => {
                    const selected = activeFilter === value;

                    return (
                        <button
                            key={value}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => onFilterChange(value)}
                            className={`inline-flex min-h-[52px] shrink-0 items-center justify-center rounded-xl border px-4 text-[18px] font-semibold leading-[28px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBBF24] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808] ${
                                selected
                                    ? "border-[#EAB308] bg-[#EAB308] text-black"
                                    : "border-[#454952] bg-[#141414] text-[#9CA3AF] hover:border-gray-400 hover:text-white"
                            }`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>

            <label className="relative block w-full shrink-0 xl:w-[350px]">
                <span className="sr-only">Search articles</span>

                <Search
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
                />

                <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Search articles..."
                    className="h-[52px] w-full rounded-xl border border-[#7A7A7A] bg-[#141414] pl-11 pr-4 text-[18px] font-normal leading-[28px] text-white placeholder:text-gray-500 focus:border-[#FBBF24] focus:outline-none focus:ring-1 focus:ring-[#FBBF24]"
                />
            </label>
        </div>
    );
}
