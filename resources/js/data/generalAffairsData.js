import {
    Award,
    CircleCheck,
    ClipboardCheck,
    Clock,
    FileText,
    Gift,
    Smile,
    UserCheck,
} from 'lucide-react';

// General Affairs (HR) department page content. Text follows the GA design (ga1–ga7).

// Under the hero: what GA does, in four steps.
export const GA_PROCESS = [
    { id: 'recruitment', title: 'Recruitment', description: 'We find the best talent.', icon: UserCheck },
    { id: 'onboarding', title: 'Onboarding', description: 'We train and integrate.', icon: ClipboardCheck },
    { id: 'evaluation', title: 'Evaluation', description: 'We track performance.', icon: CircleCheck },
    { id: 'rewards', title: 'Rewards', description: 'We distribute diamonds.', icon: Award },
];

// "The Support System": GA's internal divisions. `accent` is an RGB triplet.
export const GA_DIVISIONS = [
    {
        id: 'people-culture',
        title: 'People & Culture',
        description: 'The morale boosters. We organize town halls, game nights, and welfare checks to ensure our volunteers stay happy, motivated, and burnout-free.',
        icon: Smile,
        accent: '45 212 191', // teal-400
    },
    {
        id: 'compensation-benefits',
        title: 'Compensation & Benefits',
        description: "The reward specialists. We manage the 'Diamond Salary' system, ensuring every volunteer is compensated fairly and on time for their contributions.",
        icon: Gift,
        accent: '52 211 153', // emerald-400
    },
    {
        id: 'secretariat-admin',
        title: 'Secretariat & Admin',
        description: 'The backbone of operations. We handle documentation, official issuances, certificates, and ensuring inter-departmental workflows run smoothly.',
        icon: FileText,
        accent: '163 230 53', // lime-400
    },
];

// "The Diamond Economy"
export const GA_DIAMOND_PERKS = [
    { id: 'performance', title: 'Performance-Based', description: 'Rewards scale with your activity level and role complexity.', icon: Clock },
    { id: 'monthly', title: 'Monthly Payouts', description: 'Consistent rewards distributed directly to your game account.', icon: Award },
];
export const GA_DIAMOND_POOL = { label: 'Estimated Monthly Pool', value: '3,000,000+', payouts: ['+5,000', '+3,500', '+1,500'] };

// "Leadership". Add `image: '/Images/...'` to show a photo instead of the initial.
export const GA_LEADERSHIP = {
    head: {
        id: 'zander',
        name: 'John Zander Del Valle',
        role: 'Department Head · National Admin for General Affairs',
        image: '/Images/GeneralAffairs/Team/zander-gold.png',
        portraitFrame: { '--portrait-width': '110%', '--portrait-left': '-5%', '--portrait-top': '-3%' },
        email: 'zander.generalaffairs.mslph@gmail.com',
        quote: 'Our department oversees the administrative backbone of our organization, ensuring that operations run seamlessly. Our focus is to strengthen organizational governance, optimizing internal communication systems and providing administrative support to empower our teams and foster a collaborative work environment.',
    },
    divisionHeads: [
        { id: 'leo', name: 'Leo Angelo Calo', role: 'Dispute Manager and Support', image: '/Images/GeneralAffairs/Team/leeyan-gold.png' },
        { id: 'gabriel', name: 'Gabriel Matawaran', role: 'Internal Reporting Division Head', image: '/Images/GeneralAffairs/Team/gab-gold.png' },
    ],
};
