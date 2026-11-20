import { BarChart3, BriefcaseBusiness, Building2, Gift, GraduationCap, Layers, Network, Package, Paintbrush, Share2, ShieldCheck, Wallet } from 'lucide-react';
import { comingSoonHref, MSL_NETWORK_HREF, PUBLIC_ROUTES } from './siteNavigation.js';

export const PARTNERSHIP_LINKS = {
    application: 'https://docs.google.com/forms/d/e/1FAIpQLSeGDXCrZTQlFxh4WhfDm-CnYGmV9bIIEnmb-g0OTiGpt1MpvA/viewform',
    network: MSL_NETWORK_HREF,
    support: PUBLIC_ROUTES.buffsSupport,
    cup: comingSoonHref('collegiate-cup'),
    events: comingSoonHref('events'),
    summit: comingSoonHref('leadership-summit'),
    tournaments: PUBLIC_ROUTES.tournaments,
    contact: 'mailto:contact@moontonslph.org?subject=Partnership%20Enquiry',
};

export const PARTNER_STATS = [
    { value: '80+', label: 'Active communities' },
    { value: '2,000+', label: 'Events powered' },
    { value: '₱7.9M+', label: 'Community investment' },
];

export const CAMPAIGNS = [
    { title: 'M-series Watch Fest', image: '/Images/Home/events.jpg', href: PARTNERSHIP_LINKS.events },
    { title: 'MPL Watch Fest', image: '/Images/Home/msl-partner.jpg', href: PARTNERSHIP_LINKS.events },
    { title: 'Golden Month', image: '/extra banner.jpg', href: PARTNERSHIP_LINKS.events },
    { title: 'AllStar', image: '/streamer night.jpeg', href: PARTNERSHIP_LINKS.events },
];

export const CORE_PROGRAMS = [
    { title: 'MSL Collegiate Cup', description: 'The official collegiate league of MLBB in the Philippines.', icon: Layers, href: PARTNERSHIP_LINKS.cup },
    { title: 'Moonton Game Campaigns', description: 'Translating global campaigns into grassroots campus activations.', icon: Building2, href: PARTNERSHIP_LINKS.events },
];

export const OTHER_INITIATIVES = [
    { title: 'Beyond The Classroom', description: 'A webinar series targeting high school students to promote digital literacy, responsible gaming, and introductory esports careers.', icon: GraduationCap, href: PARTNERSHIP_LINKS.events },
    { title: 'Esports Management Masterclass', description: 'Comprehensive modules teaching end-to-end esports organization management and production.', icon: BriefcaseBusiness, href: PARTNERSHIP_LINKS.events },
    { title: 'The MSL Summit', description: 'The annual onsite convergence of all stakeholders to connect, strategize, and collaborate.', icon: Network, href: PARTNERSHIP_LINKS.summit },
    { title: 'Phil. Collegiate Training Grounds', description: 'Grants access to the professional Tournament Lobby client for universities preparing for official collegiate leagues.', icon: ShieldCheck, href: PARTNERSHIP_LINKS.support + '#tournament-lobby' },
];

export const PARTNERSHIP_DIVISIONS = [
    { id: 'network', title: 'Network Development', description: 'Owns the partner lifecycle—onboarding new schools, onboarding organizations, and fostering long-term engagement.', icon: Share2, color: '#60a5fa' },
    { id: 'sponsorships', title: 'Sponsorships', description: 'Processes and audits sponsorship requests, ensuring strict compliance and quality control.', icon: ShieldCheck, color: '#4ade80' },
    { id: 'products', title: 'Products & Engineering', description: 'Builds and maintains the digital ecosystem powering MSL operations for a seamless user experience.', icon: Package, color: '#c084fc' },
    { id: 'activations', title: 'Activations & Campaigns', description: 'Manages Moonton campaigns and brand partnerships by mobilizing our network with necessary resources.', icon: Paintbrush, color: '#fb923c' },
    { id: 'finance', title: 'Finance & Treasury', description: 'Stewards all assets, managing and auditing both financial funds and in-game resources.', icon: Wallet, color: '#fb7185' },
    { id: 'analytics', title: 'Data & Analytics', description: 'Transforms raw activity data into actionable insights to drive growth and measure impact.', icon: BarChart3, color: '#2dd4bf' },
];

export const NETWORK_BENEFITS = [
    { title: 'Via Buffs & Support', icon: Gift, href: PARTNERSHIP_LINKS.support, items: ['Monthly Diamond Support', 'Monetary Sponsorship', 'Tournament Lobby Access'] },
    { title: 'Network Perks', icon: Network, href: PARTNERSHIP_LINKS.network, items: ['Exclusive Campaign Access', 'Esports Training & Seminars', 'Education Modules', 'Partner Visibility'] },
];

const teamPortrait = (id) => `/Images/Partnerships/Team/${id}-gold.png`;

export const PARTNERSHIP_HEAD = { id: 'aileen-sunga', name: 'Aileen Sunga', role: 'Partnership Department Head', image: teamPortrait('aileen-sunga') };

// Region labels stand in for display names until the team provides them.
export const PARTNERSHIP_TEAM = [
    { id: 'pm-jm', name: 'JM', role: 'Project Manager', division: 'activations', image: teamPortrait('pm-jm'), portraitFrame: { '--portrait-width': '125%', '--portrait-left': '-12.5%', '--portrait-top': '-2%' } },
    { id: 'pm-bonoan', name: 'Bonoan', role: 'Project Manager', division: 'activations', image: teamPortrait('pm-bonoan') },
    { id: 'ro-south-luzon', name: 'Southern Luzon', role: 'Regional Officer', division: 'network', image: teamPortrait('ro-south-luzon') },
    { id: 'ro-north-central-luzon', name: 'Morales', role: 'Regional Officer — Northern & Central Luzon', division: 'network', image: teamPortrait('ro-north-central-luzon') },
    { id: 'ro-mindanao', name: 'Mindanao', role: 'Regional Officer', division: 'network', image: teamPortrait('ro-mindanao'), portraitFrame: { '--portrait-width': '140%', '--portrait-left': '-20%', '--portrait-top': '-6%' } },
    { id: 'pulmano', name: 'Pulmano', role: 'Sponsorships Head', division: 'sponsorships', isHead: true, image: teamPortrait('pulmano') },
    { id: 'sioson', name: 'Sioson', role: 'Sponsorships Officer', division: 'sponsorships', image: teamPortrait('sioson') },
    { id: 'sanchez', name: 'Sanchez', role: 'Sponsorships Officer', division: 'sponsorships', image: teamPortrait('sanchez') },
    { id: 'dolor', name: 'Dolor', role: 'Sponsorships Officer', division: 'sponsorships', image: teamPortrait('dolor') },
];

export const PARTNERSHIP_TEAM_GROUPS = ['activations', 'network', 'sponsorships']
    .map((id) => PARTNERSHIP_DIVISIONS.find((division) => division.id === id));
