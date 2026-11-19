// Public FAQ page categories (see data/faqCategories.js) plus the original ones.
// Legacy values still work: Account/Registration show under "MSL Account", Events under
// "Campus Tournament", and General shows when no category is selected on the FAQ page.
const FAQ_PAGE_CATEGORY_NAMES = [
    'MSL Account',
    'Campus Tournament',
    'Buff & Support',
    'The MSL Network',
    'Campus',
    'Partnership',
    'Content & Social Media',
    'General Affairs',
];

export const FAQ_CATEGORY_OPTIONS = ['General', ...FAQ_PAGE_CATEGORY_NAMES, 'Registration', 'Events', 'Account'];

export const FAQ_FILTER_CATEGORIES = ['All', ...FAQ_CATEGORY_OPTIONS];

export const FAQ_ITEMS = [
    {
        id: 1,
        question: 'Sample Question',
        answer: 'Sample Answer',
        category: 'General',
    },
    {
        id: 2,
        question: 'Sample Question',
        answer: 'Sample Answer',
        category: 'General',
    },
    {
        id: 3,
        question: 'Sample Question',
        answer: 'Sample Answer',
        category: 'Registration',
    },
    {
        id: 4,
        question: 'Sample Question',
        answer: 'Sample Answer',
        category: 'Events',
    },
];
