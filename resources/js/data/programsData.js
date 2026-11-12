import { PUBLIC_ROUTES, comingSoonHref } from './siteNavigation.js';

export const PROGRAMS = [
    {
        id: 'campus', title: 'Campus Tournaments', icon: 'swords', color: '#60a5fa',
        description: 'Monthly online and onsite competitive circuits exclusively for student members. Compete for school pride and national rankings.',
        image: '/Images/Home/campus-scrims.jpg', href: PUBLIC_ROUTES.tournaments,
    },
    {
        id: 'network', title: 'The MSL Network', icon: 'network', color: '#f2c21a',
        description: 'Our flagship ecosystem managing official relations with collegiate esports organizations. We bridge the gap between student leaders and Moonton Games.',
        image: '/Images/Home/msl-network.jpeg', href: PUBLIC_ROUTES.network,
    },
    {
        id: 'support', title: 'Buffs & Support', icon: 'gift', color: '#f2c21a',
        description: 'The official sponsorship arm providing diamond funding, merchandise, and event resources to empower partner organizations.',
        image: '/Images/Home/buffsandsupport.png', href: PUBLIC_ROUTES.buffsSupport,
    },
    {
        id: 'training', title: 'Phil. Collegiate Training Grounds', icon: 'gamepad', color: '#f2c21a',
        description: 'Grants access to the professional Tournament Lobby client for universities preparing for official athletic leagues.',
        image: '/Images/BuffsSupport/tournament-lobby.jpg', href: `${PUBLIC_ROUTES.buffsSupport}#tournament-lobby`,
    },
    {
        id: 'masterclass', title: 'Esports Management Masterclass', icon: 'presentation', color: '#f2c21a',
        description: 'Comprehensive educational modules teaching end-to-end esports organization management, production, and leadership.',
        image: '/Images/Home/msl-partner.jpg', href: comingSoonHref('events'),
    },
    {
        id: 'summit', title: 'The MSL Summit', icon: 'microphone', color: '#f2c21a',
        description: 'The annual onsite convergence of all stakeholders to connect, strategize, and celebrate the year’s achievements.',
        image: '/Images/Home/events.jpg', href: comingSoonHref('leadership-summit'),
    },
    {
        id: 'referral', title: 'The Referral Program', icon: 'user', color: '#4ade80',
        description: 'Empowering student leaders as recruiters. Refer new members and organizations to grow the MSL community.',
        image: '/Images/BuffsSupport/pnu-sulo-general-assembly-mlbb.jpg', href: comingSoonHref('referral'),
    },
];

export const CAMPAIGNS = [
    { id: 'mpl-watch', group: 'ongoing', title: 'MPL Watch Fest', description: 'Bring the arena atmosphere to school. Official watch parties for the MPL Philippines Regular Season and Playoffs.', image: '/Images/Home/events.jpg' },
    { id: 'm-series', group: 'ongoing', title: 'M-series Watch Fest', description: 'Support Pinas on the world stage. Campus gatherings for the M-Series World Championship.', image: '/Images/Home/msl-partner.jpg' },
    { id: 'battle-trips', group: 'recurring', title: 'MPL Battle Trips', description: 'An all-expense paid immersion. Attend backstage esports seminars and watch live MPL matches onsite.', image: '/battle-trips-caption.jpg' },
    { id: 'golden-month', group: 'recurring', title: 'Golden Month', description: 'A festive season of promo diamonds, exclusive skins, and campus-wide challenges to celebrate the community.', image: '/extra banner.jpg' },
    { id: 'all-star', group: 'recurring', title: 'All Star', description: 'The biggest pop-culture crossover event. Student leaders host local showmatches and music fests inspired by the stars.', image: '/streamer night.jpeg' },
    { id: 'project-next', group: 'recurring', title: 'Project NEXT', description: 'Experience the next evolution of MLBB. We bring the latest revamps and mechanics to student hubs before anyone else.', image: '/Images/Home/campus-tournament.png' },
].map((campaign) => ({ ...campaign, href: comingSoonHref('events') }));

// Reference examples for the requested layout, not live registration listings.
export const CAMPUS_TOURNAMENT_PREVIEWS = [
    { id: 'ust', title: 'Teletigers Esports', school: 'University of Santo Tomas', region: 'Luzon', image: '/Images/Home/msl-partner.jpg' },
    { id: 'dlsu', title: 'Viridis Arcus', school: 'De La Salle University', region: 'Luzon', image: '/Images/Home/campus-scrims.jpg' },
    { id: 'usc', title: 'Warrior’s Arena', school: 'University of San Carlos', region: 'Visayas', image: '/Images/Home/campus-tournament.png' },
    { id: 'jru', title: 'Campus MSL', school: 'Jose Rizal University', region: 'Luzon', image: '/Images/Home/events.jpg' },
];

export const REGIONS = ['All Regions', 'Luzon', 'Visayas', 'Mindanao'];

export function filterCampusTournaments(tournaments, region) {
    return region === 'All Regions' ? tournaments : tournaments.filter((tournament) => tournament.region === region);
}
