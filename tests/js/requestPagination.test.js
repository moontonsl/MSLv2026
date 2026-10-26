import assert from 'node:assert/strict';
import test from 'node:test';
import {
    paginateRequests,
    visiblePageNumbers,
} from '../../resources/js/Components/CampusTournament/requestPagination.js';

test('request rows are divided into real pages', () => {
    const requests = Array.from({ length: 21 }, (_, index) => index + 1);

    assert.deepEqual(paginateRequests(requests, 1), {
        currentPage: 1,
        totalPages: 3,
        items: requests.slice(0, 10),
    });
    assert.deepEqual(paginateRequests(requests, 2).items, requests.slice(10, 20));
    assert.deepEqual(paginateRequests(requests, 3).items, [21]);
});

test('page clamps when the final request is removed', () => {
    const requests = Array.from({ length: 20 }, (_, index) => index + 1);
    assert.deepEqual(paginateRequests(requests, 3), {
        currentPage: 2,
        totalPages: 2,
        items: requests.slice(10),
    });
    assert.deepEqual(paginateRequests([], 5), {
        currentPage: 1,
        totalPages: 1,
        items: [],
    });
});

test('page buttons reflect the actual count and current page', () => {
    assert.deepEqual(visiblePageNumbers(1, 1), [1]);
    assert.deepEqual(visiblePageNumbers(1, 2), [1, 2]);
    assert.deepEqual(visiblePageNumbers(3, 6), [1, 2, 3, 4, 5, 6]);
    assert.deepEqual(visiblePageNumbers(1, 10), [1, 2, '...', 10]);
    assert.deepEqual(visiblePageNumbers(5, 10), [1, '...', 4, 5, 6, '...', 10]);
    assert.deepEqual(visiblePageNumbers(10, 10), [1, '...', 9, 10]);
});
