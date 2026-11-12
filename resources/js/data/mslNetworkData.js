import { comingSoonHref, PUBLIC_ROUTES } from './siteNavigation.js';

export const NETWORK_LINKS = {
    membership: comingSoonHref('membership'),
    partner: '/Login',
    support: PUBLIC_ROUTES.buffsSupport,
    tournamentLobby: `${PUBLIC_ROUTES.buffsSupport}#tournament-lobby`,
    nomination: comingSoonHref('msl'),
    discord: null,
};

// Spotlight, rankings, and awards reproduce the supplied reference content.
// Existing local photographs are temporary artwork for the new layout.
export const SPOTLIGHT = {
    image: '/Images/Home/events.jpg',
    event: 'Paskuhan Cup ’24 Grand Finals',
    caption: 'Powered by The MSL Network • Live at UST Quadricentennial Pavilion',
    organization: 'UST Teletigers Esports Club',
    school: 'University of Santo Tomas',
    quote: 'The MSL Network didn’t just sponsor us; they upgraded our entire event infrastructure.',
};

export const ORGANIZATION_BUFFS = [
    {
        id: 'financial', title: 'Financial Fuel', color: '#60a5fa',
        description: 'Access up to 150,000 diamonds per semester, cash grants for major events, and official merchandise loot drops for your community.',
        image: '/Images/Home/buffsandsupport.png', href: NETWORK_LINKS.support,
    },
    {
        id: 'ecosystem', title: 'Pro-Tier Ecosystem', color: '#c084fc',
        description: 'Unlock the restricted Tournament Lobby client used by pros. Full hero access, spectator tools, and developer-grade support.',
        image: '/Images/Home/campus-scrims.jpg', href: NETWORK_LINKS.tournamentLobby,
    },
    {
        id: 'industry', title: 'Industry Access', color: '#facc15',
        description: 'Direct line to Moonton via the MSL Summit. Exclusive masterclasses, internship priority, and official campaign hosting rights.',
        image: '/Images/Home/msl-network.jpeg', href: PUBLIC_ROUTES.partnerships,
    },
];

// Only Tier C requirements were supplied. Do not infer the other allocations.
export const NETWORK_TIERS = [
    { id: 'ss', label: 'Tier SS', details: null },
    { id: 'a', label: 'Tier A', details: null },
    { id: 'b', label: 'Tier B', details: null },
    {
        id: 'c', label: 'Tier C',
        details: {
            allocation: 50000, members: '<100', active: '≤5%', turnout: '40+',
            activation: 'Low', creativeSpace: 'N/A', sponsorship: 'Locked',
        },
    },
];

export const LEADERBOARD = [
    { rank: 1, initials: 'UST', name: 'Teletigers Esports', school: 'UST', points: 12450 },
    { rank: 2, initials: 'LG', name: 'LG Esports', school: 'Ateneo', points: 11200 },
    { rank: 3, initials: 'VA', name: 'Viridis Arcus', school: 'DLSU', points: 10850 },
    { rank: 4, initials: 'P', name: 'Paradigm', school: 'New Era', points: 9500 },
    { rank: 5, initials: 'G', name: 'Gearharts', school: 'TIP', points: 9100 },
];

export const MAJOR_AWARDS = [
    {
        title: 'Organization of the Year',
        description: 'The grand award presented to the most outstanding MSL chapter that demonstrated excellence across leadership, execution, creativity, and community impact through MLBB initiatives.',
        grant: '₱15,000 Grant', rewards: ['Trophy', 'Certificate', 'Cash'], featured: true,
    },
    {
        title: 'Rising Organization Award',
        description: 'Presented to a new or growing MSL chapter that showed remarkable development, initiative, and promise within its first year of active participation.',
        grant: '₱10,000 Grant', rewards: ['Trophy', 'Certificate', 'Cash'],
    },
    {
        title: 'Best Event of the Year',
        description: 'Recognizes the most exceptional MLBB-related event distinguished by strong organization, innovation, and engagement both on-site and online.',
        rewards: ['Trophy', 'Certificate'],
    },
    {
        title: 'Student Community Impact Award',
        description: 'Given to an organization that made a significant positive difference within its campus community through MLBB events, partnerships, and student-led initiatives.',
        rewards: ['Trophy', 'Certificate'],
    },
];

export const COMMUNITY_AWARDS = [
    {
        title: 'Service Through Esports',
        description: 'Awarded to organizations that used MLBB-related initiatives to create meaningful social impact, community service, or educational advocacy.',
        grant: '₱10,000 Grant', rewards: ['Trophy', 'Certificate', 'Cash'],
    },
    {
        title: 'Collaboration of the Year',
        description: 'Recognizes the best joint project or event between multiple schools or organizations that strengthened community ties within the MSL Network.',
        rewards: ['Trophy', 'Certificate'],
    },
    {
        title: 'Organization Partner of the Year',
        description: 'Given to a brand, institution, or organization that provided outstanding support and collaboration, contributing significantly to the success and growth of MSL and MLBB campus initiatives.',
        rewards: ['Trophy', 'Certificate'],
    },
];

export const INDIVIDUAL_AWARDS = [
    {
        title: 'Esports Advocate of the Year',
        description: 'Given to a student leader who exemplifies passion, leadership, and dedication in advancing MLBB esports and its positive influence on students.',
        grant: '₱5,000', rewards: ['Certificate', 'Trophy', 'Cash'],
    },
    {
        title: 'Student Talent of the Year',
        description: 'Honors outstanding individual performance in areas such as shoutcasting, hosting, or other MLBB-related talents that uplifted the MSL community.',
        grant: '₱5,000', rewards: ['Certificate', 'Trophy', 'Cash'],
    },
    {
        title: 'Student Creator of the Year',
        description: 'Recognizes a student who demonstrated exceptional creativity and influence through MLBB-centered digital content or storytelling.',
        grant: '₱5,000', rewards: ['Certificate', 'Trophy', 'Cash'],
    },
];

export const NETWORK_GALLERY = [
    { image: '/Images/Home/events.jpg', alt: 'Students attending a campus community event' },
    { image: '/Images/Home/campus-scrims.jpg', alt: 'Student players participating in campus scrims' },
    { image: '/Images/Home/msl-partner.jpg', alt: 'Student esports organizations gathering on stage' },
    { image: '/Images/Home/campus-tournament.png', alt: 'Mobile Legends being played during a campus activity' },
    { image: '/Images/Home/msl-network.jpeg', alt: 'Students participating in a network gaming activity' },
    { image: '/Images/Home/buffsandsupport.png', alt: 'A supported campus community activity' },
    { image: '/champ poster.jpg', alt: 'NU Bulldogs MSL Collegiate Cup championship poster' },
    { image: '/battle-trips-caption.jpg', alt: 'Student gamers taking part in MPL Battle Trips' },
];
