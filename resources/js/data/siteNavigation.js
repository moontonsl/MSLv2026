export const PUBLIC_ROUTES = Object.freeze({
    home: '/',
    about: '/about',
    campus: '/about/campus',
    contents: '/about/contents-social-media',
    partnerships: '/about/partnerships',
    network: '/programs/msl-network',
    buffsSupport: '/programs/buffs-support',
    programs: '/#home-programs',
    privacy: '/privacy-policy',
    terms: '/terms-of-service',
});

export const MSL_NETWORK_HREF = PUBLIC_ROUTES.network;

export const COMING_SOON_FEATURES = {
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

export const comingSoonHref = (feature) => `/coming-soon/${feature}`;

// Keep the original destinations alongside the temporary links for reactivation.
export const ABOUT_ITEMS = [
    { label: 'About Us', href: PUBLIC_ROUTES.about, activePaths: ['/About'], exact: true },
    { label: 'Campus', href: PUBLIC_ROUTES.campus, activePaths: ['/Campus', comingSoonHref('campus')] },
    { label: 'Contents & Social Media', href: PUBLIC_ROUTES.contents, activePaths: ['/Contents&SocialMedia', '/content-media'] },
    { label: 'Partnerships', href: PUBLIC_ROUTES.partnerships, activePaths: ['/Partnerships', '/partner', comingSoonHref('partnerships')] },
    { label: 'General Affairs', originalHref: '/GeneralAffairs', href: comingSoonHref('general-affairs'), comingSoon: true },
];

export const PROGRAMS_ITEMS = [
    { label: 'The MSL Network', href: MSL_NETWORK_HREF },
    { label: 'MSL Collegiate Cup', originalHref: '/programs/collegiate-cup', href: comingSoonHref('collegiate-cup'), comingSoon: true },
    { label: 'Campus Tournaments', href: '/campus-tournament', activePaths: ['/Tournament', '/campus-tournaments', '/programs/campus-tournaments'] },
    { label: 'Buffs & Support', href: PUBLIC_ROUTES.buffsSupport, activePaths: ['/Buffs&Support'] },
    { label: 'Referral Program', originalHref: '/programs/referral', href: comingSoonHref('referral'), comingSoon: true },
];

export const MAIN_LINKS = [
    { label: 'Events', originalHref: '/Event', href: comingSoonHref('events'), activePaths: ['/Events', '/events'], comingSoon: true },
    { label: 'News', originalHref: '/News', href: comingSoonHref('news'), activePaths: ['/news'], comingSoon: true },
];

const pathname = (url) => {
    try {
        return new URL(url || '/', 'https://msl.local').pathname.replace(/\/+$/, '') || '/';
    } catch {
        return '/';
    }
};

export function isPathActive(url, href, exact = false) {
    const current = pathname(url);
    const target = pathname(href);
    return current === target || (!exact && target !== '/' && current.startsWith(`${target}/`));
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
