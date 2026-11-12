import { homeData } from '@/data/homeData';

export const NETWORK_AWARDS_BANNER = '/Images/NetworkAwards/banner.png';

export const NETWORK_AWARDS_ABOUT =
    'The MSL Network Awards is an annual recognition program that celebrates excellence, innovation, and outstanding contributions within the MSL Network community. It honors individuals, teams, and organizations who demonstrate commitment, professionalism, and impact in their respective fields. The awards aim to inspire continuous improvement, collaboration, and excellence across the network.';

export const NETWORK_AWARDS_FAQS = homeData.faq.items;

export const NOMINATION_TRACKS = [
    {
        id: 'individual',
        label: 'INDIVIDUAL AWARDS',
        href: '/NetworkAwards/Individual',
        image: '/Images/NetworkAwards/categories/individual-awards.png',
    },
    {
        id: 'organization',
        label: 'ORGANIZATION AWARDS',
        href: '/NetworkAwards/Organization',
        image: '/Images/NetworkAwards/categories/organization-awards.png',
    },
];

export const INDIVIDUAL_AWARD_CATEGORIES = [
    {
        id: 'esports-advocate-of-the-year',
        label: 'ESPORTS ADVOCATE OF THE YEAR',
        image: '/Images/NetworkAwards/categories/esports-advocate.png',
        formId: 'esports-advocate-of-the-year',
    },
    {
        id: 'student-talent-of-the-year',
        label: 'STUDENT TALENT OF THE YEAR',
        image: '/Images/NetworkAwards/categories/student-talent.png',
        formId: 'student-talent-of-the-year',
    },
    {
        id: 'student-creator-of-the-year',
        label: 'STUDENT CREATOR OF THE YEAR',
        image: '/Images/NetworkAwards/categories/student-creator.png',
        formId: 'student-creator-of-the-year',
    },
];

export const ORGANIZATION_AWARD_CATEGORIES = [
    {
        id: 'organization-of-the-year',
        label: 'ORGANIZATION OF THE YEAR',
        image: '/Images/NetworkAwards/categories/organization-of-the-year.png',
        formId: 'organization-of-the-year',
    },
    {
        id: 'best-event-of-the-year',
        label: 'BEST EVENT OF THE YEAR',
        image: '/Images/NetworkAwards/categories/best-event.png',
        formId: 'best-event-of-the-year',
    },
    {
        id: 'rising-organization-award',
        label: 'RISING ORGANIZATION AWARD',
        image: '/Images/NetworkAwards/categories/rising-organization.png',
        formId: 'rising-organization-award',
    },
    {
        id: 'student-community-impact-award',
        label: 'STUDENT COMMUNITY IMPACT AWARD',
        image: '/Images/NetworkAwards/categories/community-impact.png',
        formId: 'student-community-impact-award',
    },
    {
        id: 'collaboration-of-the-year',
        label: 'COLLABORATION OF THE YEAR',
        image: '/Images/NetworkAwards/categories/collaboration.png',
        formId: 'collaboration-of-the-year',
    },
    {
        id: 'service-through-esports-award',
        label: 'SERVICE THROUGH ESPORTS AWARD',
        image: '/Images/NetworkAwards/categories/service-esports.png',
        formId: 'service-through-esports-award',
    },
    {
        id: 'organization-partner-of-the-year',
        label: 'ORGANIZATION PARTNER OF THE YEAR',
        image: '/Images/NetworkAwards/categories/org-partner.png',
        formId: 'organization-partner-of-the-year',
    },
];

export const ORGANIZATION_NAME_OPTIONS = [
    'MSL Organization',
    'University of Sto. Thomas',
    'Iloilo Doctors College',
    'West Visayas State University',
];

/** Nomination form copy keyed by category id (Figma). */
export const NOMINATION_FORMS = {
    'student-talent-of-the-year': {
        id: 'student-talent-of-the-year',
        track: 'individual',
        title: 'Student Talent of the Year',
        headline: 'The Voice and Face of the League',
        description:
            'Honors outstanding individual performance in shout casting, hosting, or analysis.',
        criteria: [
            'Technical Skill (40%)',
            'Versatility (30%)',
            'Professionalism (30%)',
        ],
        fields: [
            {
                name: 'fullname',
                label: 'Fullname',
                type: 'text',
                placeholder: 'Crisostomo Ibarra',
            },
            {
                name: 'nomineeName',
                label: 'Name of Nominee',
                type: 'text',
                placeholder: 'MSL Organization',
            },
            {
                name: 'reason',
                label: 'Reason for Nomination',
                type: 'textarea',
                placeholder: 'Insert reason here...',
            },
        ],
    },
    'organization-of-the-year': {
        id: 'organization-of-the-year',
        track: 'organization',
        title: 'Organization of the Year',
        headline: 'The Grand Prix of the MSL Network',
        description:
            'This award is presented to the MSL chapter that demonstrates the highest level of excellence across leadership, execution, creativity, and community impact. It recognizes the organization that best embodies the spirit of Pamantasang Lakas by balancing competitive success with sustainable organizational growth.',
        criteria: [
            'Organizational Health & Governance (25%)',
            'Event Execution & Consistency (25%)',
            'Student Development & Welfare (25%)',
            'Brand Strength & Engagement (15%)',
        ],
        fields: [
            {
                name: 'fullname',
                label: 'Fullname',
                type: 'text',
                placeholder: 'Crisostomo Ibarra',
            },
            {
                name: 'organizationName',
                label: 'Organization Name',
                type: 'select',
                placeholder: 'MSL Organization',
                options: ORGANIZATION_NAME_OPTIONS,
            },
            {
                name: 'reason',
                label: 'Reason for Nomination',
                type: 'textarea',
                placeholder: 'Insert reason here...',
            },
        ],
    },
    'esports-advocate-of-the-year': {
        id: 'esports-advocate-of-the-year',
        track: 'individual',
        title: 'Esports Advocate of the Year',
        headline: 'The Voice and Face of the League',
        description:
            'Honors outstanding individual performance in shout casting, hosting, or analysis.',
        criteria: [
            'Technical Skill (40%)',
            'Versatility (30%)',
            'Professionalism (30%)',
        ],
        fields: [
            {
                name: 'fullname',
                label: 'Fullname',
                type: 'text',
                placeholder: 'Crisostomo Ibarra',
            },
            {
                name: 'nomineeName',
                label: 'Name of Nominee',
                type: 'text',
                placeholder: 'MSL Organization',
            },
            {
                name: 'reason',
                label: 'Reason for Nomination',
                type: 'textarea',
                placeholder: 'Insert reason here...',
            },
        ],
    },
    'student-creator-of-the-year': {
        id: 'student-creator-of-the-year',
        track: 'individual',
        title: 'Student Creator of the Year',
        headline: 'The Voice and Face of the League',
        description:
            'Honors outstanding individual performance in shout casting, hosting, or analysis.',
        criteria: [
            'Technical Skill (40%)',
            'Versatility (30%)',
            'Professionalism (30%)',
        ],
        fields: [
            {
                name: 'fullname',
                label: 'Fullname',
                type: 'text',
                placeholder: 'Crisostomo Ibarra',
            },
            {
                name: 'nomineeName',
                label: 'Name of Nominee',
                type: 'text',
                placeholder: 'MSL Organization',
            },
            {
                name: 'reason',
                label: 'Reason for Nomination',
                type: 'textarea',
                placeholder: 'Insert reason here...',
            },
        ],
    },
};

// Reuse org-of-the-year form structure for other org categories (Figma only detailed OOY + Student Talent).
const ORG_FORM_TEMPLATE = NOMINATION_FORMS['organization-of-the-year'];

[
    'best-event-of-the-year',
    'rising-organization-award',
    'student-community-impact-award',
    'collaboration-of-the-year',
    'service-through-esports-award',
    'organization-partner-of-the-year',
].forEach((id) => {
    const match = ORGANIZATION_AWARD_CATEGORIES.find((item) => item.id === id);
    NOMINATION_FORMS[id] = {
        ...ORG_FORM_TEMPLATE,
        id,
        title: match
            ? match.label
                  .toLowerCase()
                  .replace(/\b\w/g, (c) => c.toUpperCase())
            : id,
    };
});

export const NETWORK_AWARDS_CATEGORIES = {
    // Figma: campus / org cards
    'organization-of-the-year': {
        id: 'organization-of-the-year',
        title: 'Organization of the Year',
        type: 'organization',
        votePath: '/NetworkAwards/Voting/OrganizationOfTheYear',
        nominees: [
            {
                id: 'org-1',
                name: 'Organization Name',
                school: 'University of Sto. Thomas',
                image: '/Images/NetworkAwards/org-nominee.png',
            },
            {
                id: 'org-2',
                name: 'Organization Name',
                school: 'University of Sto. Thomas',
                image: '/Images/NetworkAwards/org-nominee.png',
            },
            {
                id: 'org-3',
                name: 'Organization Name',
                school: 'University of Sto. Thomas',
                image: '/Images/NetworkAwards/org-nominee.png',
            },
        ],
    },
    // Figma: individual portrait cards
    'student-talent-of-the-year': {
        id: 'student-talent-of-the-year',
        title: 'Student Talent of the Year',
        type: 'individual',
        votePath: '/NetworkAwards/Voting/StudentTalentOfTheYear',
        nominees: [
            {
                id: 'talent-1',
                name: 'Leslie Alexander',
                school: 'University of Sto. Thomas',
                image: '/Images/NetworkAwards/individual-nominee.png',
            },
            {
                id: 'talent-2',
                name: 'Leslie Alexander',
                school: 'University of Sto. Thomas',
                image: '/Images/NetworkAwards/individual-nominee.png',
            },
            {
                id: 'talent-3',
                name: 'Leslie Alexander',
                school: 'University of Sto. Thomas',
                image: '/Images/NetworkAwards/individual-nominee.png',
            },
        ],
    },
};

export function getNetworkAwardsCategory(categoryId) {
    return (
        NETWORK_AWARDS_CATEGORIES[categoryId] ??
        NETWORK_AWARDS_CATEGORIES['organization-of-the-year']
    );
}

export function getNominationForm(categoryId) {
    return (
        NOMINATION_FORMS[categoryId] ??
        NOMINATION_FORMS['student-talent-of-the-year']
    );
}
