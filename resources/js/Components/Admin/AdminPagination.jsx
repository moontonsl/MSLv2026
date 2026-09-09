import { ChevronLeft, ChevronRight } from "lucide-react";

function getPageItems(currentPage, pageCount) {
    if (pageCount <= 7) {
        return Array.from({ length: pageCount }, (_, index) => index + 1);
    }

    if (currentPage <= 4) {
        return [1, 2, 3, 4, 5, "ellipsis", pageCount];
    }

    if (currentPage >= pageCount - 3) {
        return [
            1,
            "ellipsis",
            pageCount - 4,
            pageCount - 3,
            pageCount - 2,
            pageCount - 1,
            pageCount,
        ];
    }

    return [
        1,
        "ellipsis",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "ellipsis",
        pageCount,
    ];
}

export default function AdminPagination({
    currentPage,
    pageCount,
    onChange,
    ariaLabel = "Account pagination",
}) {
    const pages = getPageItems(currentPage, pageCount);

    return (
        <nav
            className="flex items-center justify-end gap-1 text-sm text-gray-500 sm:gap-3"
            aria-label={ariaLabel}
        >
            <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => onChange(currentPage - 1)}
                className="inline-flex min-h-9 min-w-9 items-center justify-center gap-1 rounded-md transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous page"
            >
                <ChevronLeft className="h-4 w-4" />

                <span className="hidden sm:inline">Previous</span>
            </button>

            {pages.map((page, index) =>
                page === "ellipsis" ? (
                    <span
                        key={`ellipsis-${index}`}
                        className="px-1"
                        aria-hidden="true"
                    >
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        type="button"
                        onClick={() => onChange(page)}
                        aria-label={`Go to page ${page}`}
                        aria-current={currentPage === page ? "page" : undefined}
                        className={`min-h-9 min-w-7 rounded px-1.5 py-1 transition ${
                            currentPage === page
                                ? "bg-white/[0.06] text-white"
                                : "hover:bg-white/5 hover:text-white"
                        }`}
                    >
                        {page}
                    </button>
                ),
            )}

            <button
                type="button"
                disabled={currentPage === pageCount}
                onClick={() => onChange(currentPage + 1)}
                className="inline-flex min-h-9 min-w-9 items-center justify-center gap-1 rounded-md transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next page"
            >
                <span className="hidden sm:inline">Next</span>

                <ChevronRight className="h-4 w-4" />
            </button>
        </nav>
    );
}
