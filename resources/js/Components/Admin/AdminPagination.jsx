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

export default function AdminPagination({ currentPage, pageCount, onChange }) {
    const pages = getPageItems(currentPage, pageCount);

    return (
        <nav
            className="flex items-center justify-end gap-3 text-sm text-gray-500"
            aria-label="Account pagination"
        >
            <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => onChange(currentPage - 1)}
                className="inline-flex items-center gap-1 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
                <ChevronLeft className="h-4 w-4" />
                Previous
            </button>

            {pages.map((page, index) =>
                page === "ellipsis" ? (
                    <span key={`ellipsis-${index}`}>...</span>
                ) : (
                    <button
                        key={page}
                        type="button"
                        onClick={() => onChange(page)}
                        aria-current={currentPage === page ? "page" : undefined}
                        className={`min-w-7 rounded px-1.5 py-1 transition ${
                            currentPage === page
                                ? "text-white"
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
                className="inline-flex items-center gap-1 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
                Next
                <ChevronRight className="h-4 w-4" />
            </button>
        </nav>
    );
}
