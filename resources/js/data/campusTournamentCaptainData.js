export const DEFAULT_TOURNAMENT = {
    id: 'idc-2026',
    title: "ILOILO DOCTORS COLLEGE TOURNAMENT",
    school: 'ILOILO DOCTORS COLLEGE',
};

export const INITIAL_CAPTAIN_TEAM = {
    id: 'team-binignit',
    name: 'BINIGNIT',
    school: 'ILOILO DOCTORS COLLEGE',
    status: 'pending', // pending | approved
    inviteCode: null,
    captain: {
        id: 'p1',
        name: 'Olivia Rhye',
        ign: 'DAKI',
        uid: '71244743(1234)',
        role: 'Captain',
        status: 'confirmed',
    },
    players: [
        {
            id: 'p2',
            name: 'Olivia Rhye',
            ign: 'DAKI',
            uid: '71244743(1234)',
            role: 'Player 2',
            status: 'pending',
        },
        {
            id: 'p3',
            name: 'Olivia Rhye',
            ign: 'DAKI',
            uid: '71244743(1234)',
            role: 'Player 3',
            status: 'pending',
        },
        {
            id: 'p4',
            name: 'Olivia Rhye',
            ign: 'DAKI',
            uid: '71244743(1234)',
            role: 'Player 4',
            status: 'pending',
        },
        {
            id: 'p5',
            name: 'Olivia Rhye',
            ign: 'DAKI',
            uid: '71244743(1234)',
            role: 'Player 5',
            status: 'pending',
        },
        {
            id: 'p6',
            name: 'Olivia Rhye',
            ign: 'DAKI',
            uid: '71244743(1234)',
            role: 'Player 6',
            status: 'pending',
        },
    ],
};

/** Invited member’s view of a team (captain already created roster). */
export const INITIAL_MEMBER_INVITE_TEAM = {
    ...INITIAL_CAPTAIN_TEAM,
    status: 'pending',
    inviteCode: null,
};

export const ROLE_SLOTS = [
    { id: 'jungler', label: 'JUNGLER', icon: 'jungler' },
    { id: 'roam', label: 'ROAM', icon: 'roam' },
    { id: 'gold', label: 'GOLD', icon: 'gold' },
    { id: 'exp', label: 'EXP', icon: 'exp' },
    { id: 'mid', label: 'MID', icon: 'mid' },
];

export const SOLO_ROLE_OPTIONS = ROLE_SLOTS.map((role) => ({
    value: role.label,
    label: role.label,
}));

export const SOLO_ROSTER_LOCK_DATE = 'May 14, 2026';

export const SOLO_DEMO_PLAYER = {
    name: 'Olivia Rhye',
    ign: 'DAKI',
    uid: '71244743(1234)',
};

/** Solo matchmaking seed — one assembling team with open roles to join. */
export const INITIAL_SOLO_TEAMS = [
    {
        id: 'solo-1',
        name: 'MSL TEAM 1',
        status: 'assembling',
        joined: false,
        lockedRole: null,
        slots: [
            {
                role: 'JUNGLER',
                occupied: true,
                player: { ...SOLO_DEMO_PLAYER },
            },
            { role: 'ROAM', occupied: false, player: null },
            { role: 'GOLD', occupied: false, player: null },
            { role: 'EXP', occupied: false, player: null },
            { role: 'MID', occupied: false, player: null },
        ],
    },
];

export const INITIAL_JOINABLE_TEAMS = [
    {
        id: 'join-1',
        name: 'MSL TEAM 1',
        status: 'assembling',
        slots: [
            { role: 'JUNGLER', player: { name: 'TestSubjectMSL', detail: 'SOGEN JR.' }, occupied: true },
            { role: 'ROAM', player: null, occupied: false },
            { role: 'GOLD', player: null, occupied: false },
            { role: 'EXP', player: null, occupied: false },
            { role: 'MID', player: null, occupied: false },
        ],
        joined: false,
    },
    {
        id: 'join-2',
        name: 'SpiderJL',
        status: 'assembling',
        slots: [
            { role: 'JUNGLER', player: { name: 'TestSubjectMSL', detail: 'SOGEN JR.' }, occupied: true },
            { role: 'ROAM', player: null, occupied: false },
            { role: 'GOLD', player: null, occupied: false },
            { role: 'EXP', player: null, occupied: false },
            { role: 'MID', player: null, occupied: false },
        ],
        joined: true,
    },
    {
        id: 'join-3',
        name: 'MSL TEAM 2',
        status: 'assembling',
        slots: [
            {
                role: 'JUNGLER',
                player: { name: 'AlphaLead', detail: 'PH SERVER' },
                occupied: true,
            },
            {
                role: 'ROAM',
                player: { name: 'BetaRoam', detail: 'PH SERVER' },
                occupied: true,
            },
            {
                role: 'GOLD',
                player: { name: 'GammaGold', detail: 'PH SERVER' },
                occupied: true,
            },
            {
                role: 'EXP',
                player: { name: 'DeltaExp', detail: 'PH SERVER' },
                occupied: true,
            },
            {
                role: 'MID',
                player: { name: 'EpsilonMid', detail: 'PH SERVER' },
                occupied: true,
            },
        ],
        joined: true,
    },
];
