import {
    TrendingUp,
    Book,
    Trophy,
    Target,
} from 'lucide-react';

export const campusStats = [
    { value: '150+', label: 'Active Communities' },
    { value: '22k+', label: 'Student Gamers' },
    { value: '3,600+', label: 'Yearly Events' },
];

export const campusPillars = [
    {
        title: 'Community Management',
        description:
            'We monitor the health of 150+ MSL Communities. This involves enforcing community guidelines, conflict resolution, and ensuring every student leader has the resources to run their local hub effectively.',
        Icon: Target,
    },
    {
        title: 'Tournament Operations',
        description:
            "We execute Campus Tournaments, a circuit of Online and Onsite events. Our team handles bracket management, ruleset enforcement, and disputes to ensure fair play across Luzon, Visayas, and Mindanao.",
        Icon: Trophy,
    },
    {
        title: 'Student Development',
        description:
            "We don't just build gamers; we build leaders. Through our mentorship programs, we train Community Heads in event management, leadership, and professional communication.",
        Icon: Book,
    },
];

export const accreditationBenefits = [
    'Official Recognition',
    'Monthly Diamond Support',
    'Tournament Kits',
];

export const campusPrograms = [
    {
        title: 'Ongoing Campus Tournaments',
        description:
            "Compete for school pride in our official competitive circuits. Whether it's the Monthly Online Tournaments for remote play or the Onsite Events held within campus premises.",
        action: 'Find Your Tournament',
        href: '/Events',
        Icon: Trophy,
    },
    {
        title: 'Leadership Training',
        description:
            'Workshops, seminars, and mentorship programs designed to mold student gamers into capable, professional community leaders.',
        action: 'View Programs',
        href: '#campus-pillars',
        Icon: TrendingUp,
    },
];

export const campusJourney = [
    {
        number: '01',
        title: 'Application',
        description: 'Submit requirements and pass the interview.',
        accent: 'border-white/30 text-white',
    },
    {
        number: '02',
        title: 'Tier C / B',
        description: 'Probationary to Development phase.',
        accent: 'border-blue-500 text-blue-400',
    },
    {
        number: '03',
        title: 'Tier A',
        description: 'High performance & consistent events.',
        accent: 'border-purple-500 text-purple-400',
    },
    {
        number: '04',
        title: 'Super School',
        description: 'Top-tier performance. Max funding & exclusive perks.',
        accent: 'border-amber-400 text-amber-300',
    },
];

export const departmentHead = {
    name: 'Mary Clarence S. Pasco',
    role: 'Department Head',
    image: '/profile-background.jpg',
    quote:
        "We are the voice and the face of the MSL network. Our mission is to tell the stories of our student leaders, amplify the excitement of our tournaments, and create content that resonates with the collegiate gaming community.",
};

export const regionalAdmins = [
    { region: 'NCR-North', name: 'Jamie Rivera' },
    { region: 'NCR-South', name: 'Mark Corpus' },
    { region: 'South Luzon', name: 'Leo Valdez' },
    { region: 'North Luzon', name: 'Nina Santos' },
    { region: 'Central Luzon', name: 'Kenji Tanaka' },
    { region: 'Bicol Region', name: 'Ria Jose' },
    { region: 'West Visayas', name: 'Jamie Rivera' },
    { region: 'Central Visayas', name: 'Mark Corpus' },
    { region: 'East Visayas', name: 'Leo Valdez' },
    { region: 'North Mindanao', name: 'Nina Santos' },
    { region: 'South Mindanao', name: 'Kenji Tanaka' },
    { region: 'West Mindanao', name: 'Ria Jose' },
    { region: 'BARMM', name: 'Jamie Rivera' },
];

export const campusCommunities = [
    {
        school: 'Ateneo de Davao University',
        community: 'AdDU - Blue Knights',
        region: 'Mindanao',
        tier: 'Tier B',
        members: 600,
        image: '/msl campus icon image.png',
        href: '#accreditation',
    },
    {
        school: 'Bulacan State University',
        community: 'BulSU - Student Community',
        region: 'North/Central Luzon',
        tier: 'Tier C',
        members: 350,
        image: '/msl campus icon image.png',
        href: '#accreditation',
    },
    {
        school: 'Central Philippine University',
        community: 'CPU - Golden Lions',
        region: 'Visayas',
        tier: 'Tier C',
        members: 500,
        image: '/msl campus icon image.png',
        href: '#accreditation',
    },
    {
        school: 'National University',
        community: 'NU - Bulldogs Esports',
        region: 'NCR',
        tier: 'Tier A',
        members: 820,
        image: '/msl campus icon image.png',
        href: '#accreditation',
    },
    {
        school: 'University of Baguio',
        community: 'UB - Cardinals Gaming',
        region: 'North/Central Luzon',
        tier: 'Tier B',
        members: 410,
        image: '/msl campus icon image.png',
        href: '#accreditation',
    },
    {
        school: 'University of San Carlos',
        community: 'USC - Warriors',
        region: 'Visayas',
        tier: 'Tier A',
        members: 730,
        image: '/msl campus icon image.png',
        href: '#accreditation',
    },
];
