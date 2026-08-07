export const NEWS_ARTICLE_EXCERPT =
    'Through MPL Smart Battle Trips, Smart Communications brings the MPL Philippines Season 17 experience beyond the screen, allowing fans from different regions to step into the arena, immerse themselves in the world of professional esports, and become part of a growing community built around shared passion for MLBB.';

export const NEWS_ARTICLE_CONTENT = `${NEWS_ARTICLE_EXCERPT}

Mobile Legends: Bang Bang (MLBB) continues to unite communities through campus and national tournaments, giving student leaders and players a platform to grow, compete, and represent their schools with pride.`;

export const NEWS_CATEGORY_OPTIONS = [
    'Community',
    'Game Updates',
    'Events',
    'Announcements',
];

export const NEWS_ITEMS = [
    {
        id: 1,
        category: 'Community',
        title: 'From Screen to Stage: MPL Smart Battle Trips Brings Fans Closer to the Action',
        description: NEWS_ARTICLE_EXCERPT,
        shortDescription: NEWS_ARTICLE_EXCERPT,
        writer: 'Jay Howell C. Dela Cruz',
        authorName: 'Jay Howell C. Dela Cruz',
        publishedDate: '2026-03-23',
        articleContent: NEWS_ARTICLE_CONTENT,
        featuredImages: ['/most used hero.png', '/most used hero.png', '/most used hero.png'],
    },
    {
        id: 2,
        category: 'Community',
        title: 'From Screen to Stage: MPL Smart Battle Trips Brings Fans Closer to the Action',
        description: NEWS_ARTICLE_EXCERPT,
        shortDescription: NEWS_ARTICLE_EXCERPT,
        writer: 'Jay Howell C. Dela Cruz',
        authorName: 'Jay Howell C. Dela Cruz',
        publishedDate: '2026-03-23',
        articleContent: NEWS_ARTICLE_CONTENT,
        featuredImages: ['/most used hero.png'],
    },
    {
        id: 3,
        category: 'Events',
        title: 'From Screen to Stage: MPL Smart Battle Trips Brings Fans Closer to the Action',
        description: NEWS_ARTICLE_EXCERPT,
        shortDescription: NEWS_ARTICLE_EXCERPT,
        writer: 'Jay Howell C. Dela Cruz',
        authorName: 'Jay Howell C. Dela Cruz',
        publishedDate: '2026-03-23',
        articleContent: NEWS_ARTICLE_CONTENT,
        featuredImages: ['/most used hero.png', '/most used hero.png'],
    },
];

export function formatNewsDisplayDate(isoDate) {
    if (!isoDate) return '';
    const parts = isoDate.split('-');
    if (parts.length !== 3) return isoDate;
    const [year, month, day] = parts;
    return `${month}/${day}/${year}`;
}
