export const diamondSupportMatrix = {
    crossCampusTournament: {
        label: 'Cross-campus Tournament',
        conditions: ['All Tier & Super schools'],
        tournament: 10000,
    },
    rank1: {
        label: 'Rank 1',
        conditions: {
            'Tier C-A': { tournament: 12000, nonTournament: 10500 },
            'Super schools': { tournament: 12000, nonTournament: 10500 },
        },
    },
    rank2: {
        label: 'Rank 2',
        conditions: {
            'Tier C': { tournament: 12500, nonTournament: 10500 },
            'Tier B': { tournament: 14000, nonTournament: 11000 },
            'Tier A': { tournament: 15500, nonTournament: 12000 },
            'Super schools': { tournament: 17000, nonTournament: 13000 },
        },
    },
    rank3: {
        label: 'Rank 3',
        conditions: {
            'Tier C': { tournament: 14000, nonTournament: 11000 },
            'Tier B': { tournament: 15500, nonTournament: 12000 },
            'Tier A': { tournament: 17000, nonTournament: 13000 },
            'Super schools': { tournament: 18500, nonTournament: 14000 },
        },
    },
    rank4: {
        label: 'Rank 4',
        conditions: {
            'Tier C': { tournament: 15500, nonTournament: 12000 },
            'Tier B': { tournament: 17000, nonTournament: 13000 },
            'Tier A': { tournament: 18500, nonTournament: 14000 },
            'Super schools': { tournament: 20000, nonTournament: 15000 },
        },
    },
    rank5: {
        label: 'Rank 5',
        conditions: {
            'Tier C': { tournament: 17000, nonTournament: 13000 },
            'Tier B': { tournament: 18500, nonTournament: 14000 },
            'Tier A': { tournament: 20000, nonTournament: 15000 },
            'Super schools': { tournament: 25000, nonTournament: 16000 },
        },
    },
};

export const shsEventMatrix = {
    'Intra-strand Event': {
        '4-7 teams': {
            onGroundWithStream: 5000,
            onGroundWithoutStream: 4000,
            onlineWithStream: 3500,
            onlineWithoutStream: 3000,
            otherMlbbNonTournament: 2500,
            otherNonMlbb: 1000,
        },
        '8-16 teams': {
            onGroundWithStream: 9000,
            onGroundWithoutStream: 8000,
            onlineWithStream: 7500,
            onlineWithoutStream: 6000,
            otherMlbbNonTournament: 5500,
            otherNonMlbb: 4000,
        },
        '>16 teams': {
            onGroundWithStream: 15000,
            onGroundWithoutStream: 12000,
            onlineWithStream: 10000,
            onlineWithoutStream: 9000,
            otherMlbbNonTournament: 8000,
            otherNonMlbb: 5000,
        },
    },
    'Inter-strand Event': {
        '4-7 teams': {
            onGroundWithStream: 9000,
            onGroundWithoutStream: 8000,
            onlineWithStream: 7500,
            onlineWithoutStream: 6000,
            otherMlbbNonTournament: 5500,
            otherNonMlbb: 4000,
        },
        '8-16 teams': {
            onGroundWithStream: 15000,
            onGroundWithoutStream: 12000,
            onlineWithStream: 10000,
            onlineWithoutStream: 9000,
            otherMlbbNonTournament: 8000,
            otherNonMlbb: 5000,
        },
        '>16 teams': {
            onGroundWithStream: 20000,
            onGroundWithoutStream: 15000,
            onlineWithStream: 12000,
            onlineWithoutStream: 10000,
            otherMlbbNonTournament: 8500,
            otherNonMlbb: 7000,
        },
    },
    'High-school Intramurals': {
        fixed: 25000,
    },
};

export const eventsForCauseMatrix = {
    '4-7 teams': {
        onGround: 5000,
        online: 4000,
        other: 2000,
    },
    '8-15 teams': {
        onGround: 7000,
        online: 5000,
        other: 3000,
    },
    '>16 teams': {
        onGround: 10000,
        online: 7000,
        other: 4000,
    },
};

export const monetaryGrantMatrix = {
    rank2: {
        label: 'Rank 2',
        conditions: {
            'Tier A': { onGroundWithStream: 4000, onlineWithStream: 2000 },
            'Super School': { onGroundWithStream: 6000, onlineWithStream: 3000 },
        },
    },
    rank3: {
        label: 'Rank 3',
        conditions: {
            'Tier A': { onGroundWithStream: 7000, onlineWithStream: 3000 },
            'Super School': { onGroundWithStream: 10000, onlineWithStream: 4000 },
        },
    },
    rank4: {
        label: 'Rank 4',
        conditions: {
            '-': { onGroundWithStream: 20000, onlineWithStream: 4000 },
        },
    },
    rank5: {
        label: 'Rank 5',
        conditions: {
            '-': {
                onGroundWithStream: 'varies depending upon proposal\n(A comprehensive pitch deck is required)',
                onlineWithStream: 'varies depending upon proposal\n(A comprehensive pitch deck is required)',
            },
        },
    },
};

export const calculatorDefaults = {
    diamondSupport: {
        scope: 'Department',
        rank: 'Cross-campus Tournament',
        condition: 'All Tier & Super schools',
        eventType: 'Tournament',
    },
    shsEvents: {
        category: 'Intra-strand Event',
        teams: '4-7 teams',
        classification: 'On-Ground Tournament (with Livestream)',
        highSchoolIntramurals: false,
    },
    eventsForCause: {
        setupType: 'On-ground Events (with/without stream)',
        teamVolume: '4-7 teams',
    },
    monetaryGrants: {
        scope: 'College',
        rank: 'Rank 2',
        condition: 'Tier A',
        activityBase: 'On-Ground Tournament (with Livestream)',
    },
};

const peso = new Intl.NumberFormat('en-PH');

export const diamondEventCategoryOptions = [
    'Cross-campus Tournament',
    'Rank 1',
    'Rank 2',
    'Rank 3',
    'Rank 4',
    'Rank 5',
];

export const diamondEventTypeOptions = ['Tournament', 'Non-Tournament'];

export const shsCategoryOptions = ['Intra-strand Event', 'Inter-strand Event'];

export const shsTeamOptions = ['4-7 teams', '8-16 teams', '>16 teams'];

export const shsEventTypeOptions = [
    'On-Ground Tournament (with Livestream)',
    'On-Ground Tournament (w/o Livestream)',
    'Online Tournament (with Livestream)',
    'Online Tournament (w/o Livestream)',
    'Other MLBB Events but non- Tournament*',
    'Other Events; not MLBB- related**',
];

export const eventsForCauseEventTypeOptions = [
    'On-ground Events (with/without stream)',
    'Online Events (with/without stream)',
    'Other types of Event (with/without stream)',
];

export const eventsForCauseTeamOptions = [
    { label: 'Small', value: '4-7 teams', display: '4 - 7 teams (Small)' },
    { label: 'Medium', value: '8-15 teams', display: '8 - 15 teams (Medium)' },
    { label: 'Large', value: '>16 teams', display: '>16 teams (Large)' },
];

export const monetaryGrantEventTypeOptions = [
    'On-Ground Tournament (with Livestream)',
    'Online Tournament (with Livestream)',
];

export const monetaryGrantScopeOptions = ['Rank 2', 'Rank 3', 'Rank 4', 'Rank 5'];

export function getDiamondConditionOptions(rank = calculatorDefaults.diamondSupport.rank) {
    if (rank === 'Cross-campus Tournament') {
        return ['All Tier & Super schools'];
    }

    const rankEntry = Object.values(diamondSupportMatrix).find((entry) => entry.label === rank);

    return Object.keys(rankEntry?.conditions ?? {});
}

export function getMonetaryGrantClassificationOptions(rank = calculatorDefaults.monetaryGrants.rank) {
    const rankEntry = Object.values(monetaryGrantMatrix).find((entry) => entry.label === rank);

    return Object.keys(rankEntry?.conditions ?? {});
}

export function formatDiamondBudget(value) {
    return typeof value === 'number' ? `${peso.format(value)} Diamonds` : value;
}

export function formatPesoBudget(value) {
    return typeof value === 'number' ? `PHP ${peso.format(value)}` : value;
}

export function getDiamondSupportBudget({
    rank = calculatorDefaults.diamondSupport.rank,
    condition = calculatorDefaults.diamondSupport.condition,
    eventType = calculatorDefaults.diamondSupport.eventType,
} = {}) {
    if (rank === 'Cross-campus Tournament') {
        return diamondSupportMatrix.crossCampusTournament.tournament;
    }

    const rankEntry = Object.values(diamondSupportMatrix).find((entry) => entry.label === rank);
    const conditionEntry = rankEntry?.conditions?.[condition];
    const key = eventType === 'Non-Tournament' ? 'nonTournament' : 'tournament';

    return conditionEntry?.[key] ?? 0;
}

export function getShsBudget({
    category = calculatorDefaults.shsEvents.category,
    teams = calculatorDefaults.shsEvents.teams,
    classification = calculatorDefaults.shsEvents.classification,
    highSchoolIntramurals = calculatorDefaults.shsEvents.highSchoolIntramurals,
} = {}) {
    if (highSchoolIntramurals) {
        return shsEventMatrix['High-school Intramurals'].fixed;
    }

    const categoryEntry = shsEventMatrix[category];

    if (categoryEntry?.fixed) {
        return categoryEntry.fixed;
    }

    const keyMap = {
        'On-Ground Tournament (with Livestream)': 'onGroundWithStream',
        'On-Ground Tournament (w/o Livestream)': 'onGroundWithoutStream',
        'Online Tournament (with Livestream)': 'onlineWithStream',
        'Online Tournament (w/o Livestream)': 'onlineWithoutStream',
        'Other MLBB Events but non-Tournament': 'otherMlbbNonTournament',
        'Other MLBB Events but non- Tournament*': 'otherMlbbNonTournament',
        'Other Events; not MLBB-related': 'otherNonMlbb',
        'Other Events; not MLBB- related**': 'otherNonMlbb',
    };

    return categoryEntry?.[teams]?.[keyMap[classification]] ?? 0;
}

export function getEventsForCauseBudget({
    setupType = calculatorDefaults.eventsForCause.setupType,
    teamVolume = calculatorDefaults.eventsForCause.teamVolume,
} = {}) {
    const keyMap = {
        'On-ground Events': 'onGround',
        'On-ground Events (with/without stream)': 'onGround',
        'Online Events': 'online',
        'Online Events (with/without stream)': 'online',
        'Other types of Event': 'other',
        'Other types of Event (with/without stream)': 'other',
    };

    return eventsForCauseMatrix[teamVolume]?.[keyMap[setupType]] ?? 0;
}

export function getMonetaryGrantBudget({
    rank = calculatorDefaults.monetaryGrants.rank,
    condition = calculatorDefaults.monetaryGrants.condition,
    activityBase = calculatorDefaults.monetaryGrants.activityBase,
} = {}) {
    const rankEntry = Object.values(monetaryGrantMatrix).find((entry) => entry.label === rank);
    const conditionEntry = rankEntry?.conditions?.[condition];
    const key = activityBase === 'Online Tournament' || activityBase === 'Online Tournament (with Livestream)'
        ? 'onlineWithStream'
        : 'onGroundWithStream';

    return conditionEntry?.[key] ?? 0;
}
