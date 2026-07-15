import {
    Clapperboard,
    FileText,
    Keyboard,
    Layers,
    MessageSquare,
    Mic,
    PenLine,
    Shield,
    Users,
} from 'lucide-react';

export const VISUAL_ARTS_GRID = {
    feature: {
        src: '/Images/CSM/Rectangle 41.png',
        alt: 'Abstract visual arts showcase',
    },
    topRow: [
        {
            src: '/announcement sample 1.png',
            alt: 'Comic and graphic design assets',
        },
        {
            src: '/most used hero.png',
            alt: 'Retro gaming creative setup',
        },
    ],
    bottomWide: {
        src: '/profile-background.jpg',
        alt: 'Esports broadcast production',
    },
};

export const BROADCAST_ITEMS = [
    {
        id: 1,
        title: 'GRAND FINALS: TLPH VS FLCN',
        views: '120.6K views',
        image: '/most used hero.png',
        live: true,
    },
    {
        id: 2,
        title: 'GRAND FINALS: TLPH VS FLCN',
        views: '120.6K views',
        image: '/most used hero.png',
        live: true,
    },
];

export const EDITORIAL_ITEMS = [
    {
        id: 1,
        category: 'NEWS / ARTICLE',
        date: '2 days ago',
        title: 'The Collegiate Meta Shift: Tank Junglers',
        icon: Keyboard,
    },
    {
        id: 2,
        category: 'BLOG',
        date: '1 week ago',
        title: 'Diary of a Student Leader: Balancing Acads & Esports',
        icon: PenLine,
    },
];

export const CAPTION_POST = {
    author: 'MSL Philippines',
    timestamp: 'Just now',
    body: 'Victory tastes sweet, but the journey is sweeter. 🏆✨ Congratulations to Teletigers Esports for securing the crown! 👑🐯 To all the teams who fought bravely, GGWP! The collegiate spirit is alive and burning. 🔥',
    hashtags: [
        '#MSLPhilippines',
        '#CollegiateEsports',
        '#MLBBEports',
        '#StudentGamers',
    ],
    image: '/most used hero.png',
};

export const ON_AIR_TALENT = [
    {
        name: 'Leslie Alexander',
        roleLines: ['ON-AIR', 'TALENT'],
        image: '/profile-background.jpg',
    },
    {
        name: 'Leslie Alexander',
        roleLines: ['ON-AIR', 'TALENT'],
        image: '/profile-background.jpg',
    },
    {
        name: 'Leslie Alexander',
        roleLines: ['ON-AIR', 'TALENT'],
        image: '/profile-background.jpg',
    },
    {
        name: 'Leslie Alexander',
        roleLines: ['ON-AIR', 'TALENT'],
        image: '/profile-background.jpg',
    },
];

export const FUNCTIONAL_DIVISIONS = [
    {
        title: 'Content Coordination',
        description:
            'Plans campaigns, calendars, and cross-platform storytelling that keep MSL PH’s voice consistent.',
        borderColor: 'border-t-blue-500',
        icon: Layers,
        iconColor: 'text-blue-400',
    },
    {
        title: 'Page Moderation',
        description:
            'Keeps communities safe, engaged, and informed across official pages and channels.',
        borderColor: 'border-t-green-500',
        icon: Shield,
        iconColor: 'text-green-400',
    },
    {
        title: 'Creatives',
        description:
            'Designs visuals, motion assets, and brand-forward content for every major initiative.',
        borderColor: 'border-t-purple-500',
        icon: Clapperboard,
        iconColor: 'text-purple-400',
    },
    {
        title: 'Writers',
        description:
            'Crafts articles, scripts, captions, and long-form stories that connect with students.',
        borderColor: 'border-t-orange-500',
        icon: PenLine,
        iconColor: 'text-orange-400',
    },
    {
        title: 'Production Team',
        description:
            'Runs live broadcasts, recordings, and post-production for MSL PH events and shows.',
        borderColor: 'border-t-red-500',
        icon: Mic,
        iconColor: 'text-red-400',
    },
    {
        title: 'Internal',
        description:
            'Supports department operations, documentation, and team coordination behind the scenes.',
        borderColor: 'border-t-teal-500',
        icon: Users,
        iconColor: 'text-teal-400',
    },
];

export const DIVISION_HEADS = [
    { name: 'Jannie Rivera', image: '/profile-background.jpg' },
    { name: 'Mark Corpus', image: '/profile-background.jpg' },
    { name: 'Leo Valdez', image: '/profile-background.jpg' },
    { name: 'Rina Santos', image: '/profile-background.jpg' },
    { name: 'Daryl Tanoco', image: '/profile-background.jpg' },
    { name: 'Ria Jose', image: '/profile-background.jpg' },
];

export const DEPARTMENT_HEAD = {
    name: 'Mary Clarence S. Pasco',
    role: 'DEPARTMENT HEAD',
    description:
        'We are the voice and the face of the MSL network. Our mission is to tell the stories of our student leaders, amplify the excitement of our tournaments, and create content that resonates with the collegiate gaming community.',
    image: '/profile-background.jpg',
};
