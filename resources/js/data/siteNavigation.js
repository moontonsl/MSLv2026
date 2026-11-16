export const PUBLIC_ROUTES = Object.freeze({
    home: '/',
    about: '/About',
    campus: '/Campus',
    contents: '/ContentsAndSocialMedia',
    partnerships: '/Partnerships',
    network: '/MSLNetwork',
    buffsSupport: '/BuffsAndSupport',
    programs: '/Programs',
    privacy: '/PrivacyPolicy',
    terms: '/TermsAndConditions',
    comingSoon: '/ComingSoon',
    reportViolation: '/ReportViolation',
    tournaments: '/CampusTournaments',
    careers: '/Careers',
});

export const MSL_NETWORK_HREF = PUBLIC_ROUTES.network;

export const COMING_SOON_FEATURES = {
    careers: { title: 'Careers', description: 'Opportunities to join the MSL Philippines team will be available soon.' },
    msl: { title: 'More from MSL', description: 'More ways to connect with the MSL Philippines community are on the way.' },
    campus: { title: 'Campus', description: 'A dedicated space for campus communities is on the way. Check back for updates.' },
    partnerships: { title: 'Partnerships', description: 'A new space for collaborations that support student-gamers and campus communities is on the way.' },
    'general-affairs': { title: 'General Affairs', description: 'We’re preparing a dedicated space for General Affairs updates and resources.' },
    'collegiate-cup': { title: 'MSL Collegiate Cup', description: 'The next chapter of collegiate competition is on the way. Check back for official updates.' },
    referral: { title: 'Referral Program', description: 'More ways to bring your community into the MSL network are on the way.' },
    events: { title: 'Events', description: 'A new home for MSL events and campus experiences is on the way.' },
    news: { title: 'News & Updates', description: 'Stories, announcements, and highlights from the MSL community will be here soon.' },
    membership: { title: 'Be a Member', description: 'Your next step into the MSL community is on the way. Check back for membership updates.' },
    'leadership-summit': { title: 'Leadership Summit', description: 'A space for student leaders to connect, learn, and grow is on the way.' },
    'mcc-league': { title: 'MCC League', description: 'More collegiate competition is on the way. Check back for official league updates.' },
};

export const comingSoonHref = (feature) => `${PUBLIC_ROUTES.comingSoon}?feature=${encodeURIComponent(feature)}`;

// Keep the original destinations alongside the temporary links for reactivation.
export const ABOUT_ITEMS = [
    { label: 'About Us', href: PUBLIC_ROUTES.about, activePaths: ['/about'], exact: true },
    { label: 'Campus', href: PUBLIC_ROUTES.campus, activePaths: ['/about/campus', comingSoonHref('campus')] },
    { label: 'Contents & Social Media', href: PUBLIC_ROUTES.contents, activePaths: ['/about/contents-social-media', '/Contents&SocialMedia', '/content-media'] },
    { label: 'Partnerships', href: PUBLIC_ROUTES.partnerships, activePaths: ['/about/partnerships', '/partner', comingSoonHref('partnerships')] },
    { label: 'General Affairs', originalHref: '/GeneralAffairs', href: comingSoonHref('general-affairs'), comingSoon: true },
];

export const PROGRAMS_ITEMS = [
    { label: 'The MSL Network', href: MSL_NETWORK_HREF, activePaths: ['/programs/msl-network'] },
    { label: 'MSL Collegiate Cup', originalHref: '/programs/collegiate-cup', href: comingSoonHref('collegiate-cup'), comingSoon: true },
    { label: 'Campus Tournaments', href: PUBLIC_ROUTES.tournaments, activePaths: ['/campus-tournament', '/Tournament', '/campus-tournaments', '/programs/campus-tournaments'] },
    { label: 'Buffs & Support', href: PUBLIC_ROUTES.buffsSupport, activePaths: ['/programs/buffs-support', '/Buffs&Support'] },
    { label: 'Referral Program', originalHref: '/programs/referral', href: comingSoonHref('referral'), comingSoon: true },
];

export const MAIN_LINKS = [
    { label: 'Events', originalHref: '/Event', href: comingSoonHref('events'), activePaths: ['/Events', '/events'], comingSoon: true },
    { label: 'News', originalHref: '/News', href: comingSoonHref('news'), activePaths: ['/news'], comingSoon: true },
];

const navigationTarget = (url) => {
    try {
        const parsed = new URL(url || '/', 'https://msl.local');
        const path = parsed.pathname.replace(/\/+$/, '') || '/';
        const legacyComingSoon = path.match(/^\/coming-soon(?:\/([^/]+))?$/);
        return {
            path: legacyComingSoon ? PUBLIC_ROUTES.comingSoon : path,
            feature: legacyComingSoon?.[1] || parsed.searchParams.get('feature') || 'msl',
        };
    } catch {
        return { path: '/', feature: 'msl' };
    }
};

export function isPathActive(url, href, exact = false) {
    const current = navigationTarget(url);
    const target = navigationTarget(href);
    if (target.path === PUBLIC_ROUTES.comingSoon) {
        return current.path === target.path && current.feature === target.feature;
    }
    return current.path === target.path
        || (!exact && target.path !== '/' && current.path.startsWith(`${target.path}/`));
}

export function isNavigationItemActive(url, item) {
    return [item.href, item.originalHref, ...(item.activePaths || [])]
        .filter(Boolean)
        .some((href) => isPathActive(url, href, item.exact));
}

export function isNavigationGroupActive(url, id, items) {
    const additionalPaths = id === 'programs'
        ? ['/Programs', '/programs', comingSoonHref('mcc-league'), comingSoonHref('leadership-summit')]
        : [];

    return items.some((item) => isNavigationItemActive(url, item))
        || additionalPaths.some((href) => isPathActive(url, href));
}
