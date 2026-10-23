export const REQUESTS_PER_PAGE = 10;

export function paginateRequests(requests, page, pageSize = REQUESTS_PER_PAGE) {
    const totalPages = Math.max(1, Math.ceil(requests.length / pageSize));
    const currentPage = Math.min(Math.max(Number.isInteger(page) ? page : 1, 1), totalPages);
    const start = (currentPage - 1) * pageSize;

    return {
        currentPage,
        totalPages,
        items: requests.slice(start, start + pageSize),
    };
}

export function visiblePageNumbers(currentPage, totalPages) {
    const pages = [];

    for (let page = 1; page <= totalPages; page += 1) {
        if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
            const gap = pages.length > 0 ? page - pages[pages.length - 1] : 1;
            if (gap === 2) {
                pages.push(page - 1);
            } else if (gap > 2) {
                pages.push('...');
            }
            pages.push(page);
        }
    }

    return pages;
}
