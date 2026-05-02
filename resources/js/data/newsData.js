/**
 * Central mock database for News listing & article detail pages.
 * Swap with API responses later without changing UI components.
 */

const IMG_SUMMIT =
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=80';
const IMG_ESPORTS =
    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1600&q=80';
const IMG_COMMUNITY =
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80';
const IMG_PATCH =
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80';
const IMG_REPORT =
    'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80';
const IMG_EVENT =
    'https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=1200&q=80';

/** Placeholder paths from design — swap when assets exist under `public/assets/`. */
export const AVATAR_PLACEHOLDER = '/assets/avatar-placeholder.png';

export const newsArticles = [
    {
        slug: 'student-leader-summit-2024',
        category: 'Events',
        date: 'Nov 27, 2025',
        readTime: '3 mins read',
        title: 'Student Leader Summit 2024 Recap',
        author: {
            name: 'CRISOSTOMO IBARRA',
            role: 'General Affairs',
            avatar: '',
        },
        heroImage: IMG_SUMMIT,
        excerpt:
            'Over 200 student leaders gathered in Manila for a weekend of workshops, networking, and showmatches.',
        content: `
      <p>The energy was electric at the SMX Convention Center last weekend as over 200 student leaders from 50+ universities converged for the annual Student Leader Summit.</p>
      <p>The two-day event featured keynote speakers from the esports industry, including shout casters, project managers, and community builders. Workshops focused on:</p>
      <ul>
        <li><strong>Community Management 101:</strong> How to handle toxicity and build inclusive spaces.</li>
        <li><strong>Event Production:</strong> Running a tournament with zero budget.</li>
        <li><strong>Career Pathways:</strong> Turning passion into a profession.</li>
      </ul>
      <p><strong>"This summit opened my eyes to the reality that esports isn't just about playing,"</strong> said <strong>Mark</strong>, a student leader from Cebu. <strong>"It's about leadership and responsibility."</strong></p>
    `,
    },
    {
        slug: 'collegiate-cup-season-4',
        category: 'Esports',
        date: 'Nov 28, 2025',
        readTime: '5 mins read',
        title: 'MSL Collegiate Cup Season 4: The Road to Nationals Begins',
        author: { name: 'JUAN DELA CRUZ', role: 'Tournament Admin', avatar: '' },
        heroImage: IMG_ESPORTS,
        excerpt:
            'Registration is officially open! Check out the new format, increased prize pool, and region-locking mechanics.',
        content: '<p>Registration is officially open! Full details coming soon...</p>',
    },
    {
        slug: 'community-guidelines-update',
        category: 'Community',
        date: 'Nov 29, 2025',
        readTime: '2 mins read',
        title: 'Updated Community Guidelines for 2024',
        author: { name: 'MARIA CLARA', role: 'Community Manager', avatar: '' },
        heroImage: IMG_COMMUNITY,
        excerpt:
            'Please read through our updated guidelines regarding tournament conduct and discord rules.',
        content: '<p>Our new guidelines aim to foster a safer environment...</p>',
    },
    {
        slug: 'regional-finals-luzon',
        category: 'Events',
        date: 'Nov 27, 2023',
        readTime: '3 min read',
        title: 'Regional Finals Recap: Luzon Highlights',
        author: { name: 'MSL Editorial', role: 'Editorial', avatar: '' },
        heroImage: IMG_EVENT,
        excerpt:
            'Standout plays, MVP performances, and crowd moments from this season’s regional LAN finals.',
        content: '<p>Highlights from the Luzon regional bracket are now available.</p>',
    },
    {
        slug: 'patch-notes-roundup',
        category: 'Game Update',
        date: 'Nov 27, 2023',
        readTime: '3 min read',
        title: 'Patch Notes Roundup for Competitive Play',
        author: { name: 'Game Updates Desk', role: 'Game Updates', avatar: '' },
        heroImage: IMG_PATCH,
        excerpt:
            'A concise breakdown of hero tuning and item adjustments collegiate teams should factor into drafts.',
        content: '<p>Balance changes and competitive implications for the current patch.</p>',
    },
    {
        slug: 'quarterly-impact-report',
        category: 'Reports',
        date: 'Nov 27, 2023',
        readTime: '3 min read',
        title: 'Quarterly Impact Report: Campus Engagement',
        author: { name: 'MSL Research', role: 'Reports', avatar: '' },
        heroImage: IMG_REPORT,
        excerpt:
            'Data-backed highlights from nationwide qualifiers, grassroots initiatives, and leadership workshops.',
        content: '<p>Quarterly metrics and stories from campuses across the network.</p>',
    },
];

/** Slides order for the featured carousel (desktop shows first only). */
export const featuredArticleSlugs = [
    'collegiate-cup-season-4',
    'student-leader-summit-2024',
    'community-guidelines-update',
];

export function getArticleBySlug(slug) {
    return newsArticles.find((a) => a.slug === slug);
}

export function buildFeaturedSlides() {
    return featuredArticleSlugs.map((slug) => {
        const a = getArticleBySlug(slug);
        if (!a) return null;
        return {
            href: `/news/${a.slug}`,
            imageSrc: a.heroImage,
            title: a.title,
            excerpt: a.excerpt,
            date: a.date,
            author: a.author.role,
        };
    }).filter(Boolean);
}
