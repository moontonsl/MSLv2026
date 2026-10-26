export const TOURNAMENT_STATUS_TABS = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'ongoing', label: 'Ongoing' },
    { id: 'completed', label: 'Completed' },
];

/** SL View filter tabs (Figma: Tournament Req. | Upcoming | Ongoing | Completed) */
export const SL_MANAGEMENT_TABS = [
    { id: 'requests', label: 'Tournament Req.' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'ongoing', label: 'Ongoing' },
    { id: 'completed', label: 'Completed' },
];

export const MONTH_OPTIONS = [
    { value: '', label: 'Month' },
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
];

export const YEAR_OPTIONS = [
    { value: '', label: 'Year' },
    { value: '2025', label: '2025' },
    { value: '2026', label: '2026' },
    { value: '2027', label: '2027' },
];

/** Organizer view: own pending submissions */
export const INITIAL_PENDING_REQUESTS = [
    {
        id: 'pending-1',
        title: "ILOILO DOCTOR'S COLLEGE TOURNAMENT",
        startDate: '2026-05-13',
        endDate: '2026-05-14',
        mode: 'Online',
        status: 'pending',
    },
    {
        id: 'pending-2',
        title: 'WEST VISAYAS STATE UNIVERSITY',
        startDate: '2026-05-29',
        endDate: '2026-06-01',
        mode: 'Onsite',
        status: 'pending',
    },
];

export const INITIAL_REJECTED_REQUESTS = [
    {
        id: 'rejected-1',
        title: 'WEST VISAYAS STATE UNIVERSITY',
        startDate: '2026-05-29',
        endDate: '2026-06-01',
        mode: 'Onsite',
        status: 'rejected',
    },
];

/** Organizer view: public tournament listings */
export const INITIAL_TOURNAMENTS = [
    {
        id: 'tour-1',
        title: "ILOILO DOCTOR'S COLLEGE TOURNAMENT",
        startDate: '2026-04-24',
        endDate: '2026-05-10',
        mode: 'Online',
        status: 'upcoming',
        school: "Iloilo Doctor's College",
    },
    {
        id: 'tour-2',
        title: 'WEST VISAYAS STATE UNIVERSITY CUP',
        startDate: '2026-05-01',
        endDate: '2026-05-15',
        mode: 'Onsite',
        status: 'upcoming',
        school: 'West Visayas State University',
    },
    {
        id: 'tour-3',
        title: "ILOILO DOCTOR'S COLLEGE TOURNAMENT",
        startDate: '2026-04-24',
        endDate: '2026-05-10',
        mode: 'Online',
        status: 'ongoing',
        school: "Iloilo Doctor's College",
    },
    {
        id: 'tour-4',
        title: 'MSL CAMPUS INVITATIONAL',
        startDate: '2026-03-01',
        endDate: '2026-03-20',
        mode: 'Onsite',
        status: 'ongoing',
        school: 'University of Santo Tomas',
    },
    {
        id: 'tour-5',
        title: 'COLLEGIATE OPEN SERIES',
        startDate: '2026-01-10',
        endDate: '2026-01-25',
        mode: 'Online',
        status: 'completed',
        school: 'Ateneo de Manila University',
    },
    {
        id: 'tour-6',
        title: 'REGIONAL CAMPUS SHOWDOWN',
        startDate: '2025-12-01',
        endDate: '2025-12-15',
        mode: 'Onsite',
        status: 'completed',
        school: 'University of the Philippines',
    },
];

/** SL view: incoming requests awaiting Approve / Reject */
export const INITIAL_SL_TOURNAMENT_REQUESTS = [
    {
        id: 'sl-req-1',
        schoolName: "Iloilo Doctor's College",
        type: 'Online',
        startDate: '2026-05-13',
        endDate: '2026-05-14',
        slName: 'Jose Rizal',
    },
    {
        id: 'sl-req-2',
        schoolName: 'West Visayas State University',
        type: 'Onsite',
        startDate: '2026-05-29',
        endDate: '2026-06-01',
        slName: 'Salazar Slytherin',
    },
    {
        id: 'sl-req-3',
        schoolName: 'West Visayas State University',
        type: 'Onsite',
        startDate: '2026-05-30',
        endDate: '2026-06-02',
        slName: 'Helga Hufflepuff',
    },
];

/** Placement options for Match Management status dropdown (Figma Item_Dropdown) */
export const PLACEMENT_OPTIONS = [
    {
        id: 'participant',
        label: 'Participant',
        buttonClass: 'border-emerald-700 bg-[#0f2e22] text-emerald-400',
        menuClass: 'border-emerald-700 bg-[#0f2e22] text-emerald-400',
        rankColor: 'text-emerald-400',
    },
    {
        id: '1st',
        label: '1st Place',
        buttonClass: 'border-yellow-600 bg-[#3d3208] text-yellow-500',
        menuClass: 'border-yellow-600 bg-[#3d3208] text-yellow-500',
        rankColor: 'text-yellow-500',
    },
    {
        id: '2nd',
        label: '2nd Place',
        buttonClass: 'border-neutral-500 bg-[#2a2a2a] text-neutral-200',
        menuClass: 'border-neutral-500 bg-[#2a2a2a] text-neutral-200',
        rankColor: 'text-neutral-300',
    },
    {
        id: '3rd',
        label: '3rd Place',
        buttonClass: 'border-amber-700 bg-[#3a2410] text-amber-500',
        menuClass: 'border-amber-700 bg-[#3a2410] text-amber-500',
        rankColor: 'text-amber-500',
    },
    {
        id: '4th',
        label: '4th Place',
        buttonClass: 'border-red-800 bg-[#3b1212] text-red-400',
        menuClass: 'border-red-800 bg-[#3b1212] text-red-400',
        rankColor: 'text-red-400',
    },
];

export const SL_ROSTER_FILTER_TABS = [
    { id: 'all', label: 'All' },
    { id: 'solo', label: 'Solo' },
    { id: 'team', label: 'Team' },
];

const SL_DEMO_PLAYER = {
    name: 'Olivia Rhye',
    ign: 'DAKI',
    uid: '71244743(1234)',
};

const ROSTER_ROLES = ['JUNGLER', 'ROAM', 'GOLD', 'EXP', 'MID'];

export function buildMatchTeam(id, placement) {
    return {
        id,
        name: 'O.M.A.D - One Meal a Day',
        placement,
        players: Array.from({ length: 5 }, (_, index) => ({
            ...SL_DEMO_PLAYER,
            id: `${id}-p${index + 1}`,
            slotLabel: index === 0 ? 'Captain' : `Player ${index + 1}`,
            role: ROSTER_ROLES[index],
        })),
    };
}

export function buildRosterTeam(id, options = {}) {
    const type = options.type === 'solo' ? 'solo' : 'team';
    const players = ROSTER_ROLES.map((role, index) => ({
        ...SL_DEMO_PLAYER,
        id: `${id}-p${index + 1}`,
        role,
        slotLabel: index === 0 ? 'Captain' : `Player ${index + 1}`,
    }));

    const rosterPlayers = type === 'solo' ? [players[0]] : players;

    return {
        id,
        name: type === 'solo' ? 'SOLO PLAYER' : 'MSL TEAM 1',
        type,
        status: 'confirmed',
        placement: 'participant',
        captain: players[0],
        players: rosterPlayers,
        matchReady: true,
    };
}

/** SL view: managed tournaments with match + roster demo data */
export const INITIAL_SL_MANAGED_TOURNAMENTS = [
    {
        id: 'sl-up-1',
        title: "ILOILO DOCTOR'S COLLEGE TOURNAMENT",
        schoolName: "Iloilo Doctor's College",
        startDate: '2026-04-24',
        endDate: '2026-05-10',
        mode: 'Online',
        status: 'upcoming',
        rosterLockDate: 'May 14, 2026',
        resultsSubmitted: false,
        teams: [
            buildMatchTeam('sl-up-1-t1', '1st'),
            buildMatchTeam('sl-up-1-t2', '2nd'),
            buildMatchTeam('sl-up-1-t3', '3rd'),
            buildMatchTeam('sl-up-1-t4', '4th'),
            buildMatchTeam('sl-up-1-t5', 'participant'),
            buildMatchTeam('sl-up-1-t6', 'participant'),
        ],
        rosterTeams: [
            buildRosterTeam('sl-up-1-r1'),
            buildRosterTeam('sl-up-1-r2'),
            buildRosterTeam('sl-up-1-s1', { type: 'solo' }),
            buildRosterTeam('sl-up-1-s2', { type: 'solo' }),
        ],
    },
    {
        id: 'sl-up-2',
        title: 'WEST VISAYAS STATE UNIVERSITY CUP',
        schoolName: 'West Visayas State University',
        startDate: '2026-05-01',
        endDate: '2026-05-15',
        mode: 'Onsite',
        status: 'upcoming',
        rosterLockDate: 'May 20, 2026',
        resultsSubmitted: false,
        teams: [
            buildMatchTeam('sl-up-2-t1', 'participant'),
            buildMatchTeam('sl-up-2-t2', 'participant'),
        ],
        rosterTeams: [buildRosterTeam('sl-up-2-r1')],
    },
    {
        id: 'sl-ong-1',
        title: "ILOILO DOCTOR'S COLLEGE TOURNAMENT",
        schoolName: "Iloilo Doctor's College",
        startDate: '2026-04-24',
        endDate: '2026-05-10',
        mode: 'Online',
        status: 'ongoing',
        rosterLockDate: 'May 14, 2026',
        resultsSubmitted: false,
        teams: [
            buildMatchTeam('sl-ong-1-t1', '1st'),
            buildMatchTeam('sl-ong-1-t2', '2nd'),
            buildMatchTeam('sl-ong-1-t3', '3rd'),
            buildMatchTeam('sl-ong-1-t4', '4th'),
            buildMatchTeam('sl-ong-1-t5', 'participant'),
        ],
        rosterTeams: [
            buildRosterTeam('sl-ong-1-r1'),
            buildRosterTeam('sl-ong-1-r2'),
            buildRosterTeam('sl-ong-1-s1', { type: 'solo' }),
            buildRosterTeam('sl-ong-1-s2', { type: 'solo' }),
        ],
    },
    {
        id: 'sl-ong-2',
        title: 'WEST VISAYAS STATE UNIVERSITY CUP',
        schoolName: 'West Visayas State University',
        startDate: '2026-05-20',
        endDate: '2026-05-22',
        mode: 'Onsite',
        status: 'ongoing',
        rosterLockDate: 'May 22, 2026',
        resultsSubmitted: false,
        teams: [
            buildMatchTeam('sl-ong-2-t1', 'participant'),
            buildMatchTeam('sl-ong-2-t2', 'participant'),
        ],
        rosterTeams: [buildRosterTeam('sl-ong-2-r1')],
    },
    {
        id: 'sl-comp-1',
        title: 'MSL CAMPUS INVITATIONAL',
        schoolName: 'University of Santo Tomas',
        startDate: '2026-03-01',
        endDate: '2026-03-20',
        mode: 'Online',
        status: 'completed',
        rosterLockDate: 'March 15, 2026',
        resultsSubmitted: true,
        resultsSubmittedOn: '03/21/2026',
        teams: [
            buildMatchTeam('sl-comp-1-t1', '1st'),
            buildMatchTeam('sl-comp-1-t2', '2nd'),
            buildMatchTeam('sl-comp-1-t3', '3rd'),
            buildMatchTeam('sl-comp-1-t4', '4th'),
        ],
        rosterTeams: [buildRosterTeam('sl-comp-1-r1')],
    },
    {
        id: 'sl-comp-2',
        title: 'REGIONAL CAMPUS SHOWDOWN',
        schoolName: 'University of the Philippines',
        startDate: '2025-12-01',
        endDate: '2025-12-15',
        mode: 'Onsite',
        status: 'completed',
        rosterLockDate: 'December 10, 2025',
        resultsSubmitted: true,
        resultsSubmittedOn: '12/16/2025',
        teams: [
            buildMatchTeam('sl-comp-2-t1', '1st'),
            buildMatchTeam('sl-comp-2-t2', '2nd'),
        ],
        rosterTeams: [buildRosterTeam('sl-comp-2-r1')],
    },
];

/** Regional Admin view: approved tournaments with registration stats + match/roster demo */
export const INITIAL_RA_MANAGED_TOURNAMENTS = [
    {
        id: 'ra-ong-1',
        title: "ILOILO DOCTOR'S COLLEGE TOURNAMENT",
        schoolName: "Iloilo Doctor's College",
        startDate: '2026-04-24',
        endDate: '2026-05-10',
        mode: 'Online',
        status: 'ongoing',
        rosterLockDate: 'May 14, 2026',
        resultsSubmitted: false,
        verifiedTeams: 12,
        pendingTeams: 3,
        totalRegistration: 15,
        teams: [
            buildMatchTeam('ra-ong-1-t1', '1st'),
            buildMatchTeam('ra-ong-1-t2', '2nd'),
            buildMatchTeam('ra-ong-1-t3', '3rd'),
            buildMatchTeam('ra-ong-1-t4', '4th'),
            buildMatchTeam('ra-ong-1-t5', 'participant'),
        ],
        rosterTeams: [buildRosterTeam('ra-ong-1-r1'), buildRosterTeam('ra-ong-1-r2')],
    },
    {
        id: 'ra-ong-2',
        title: 'WEST VISAYAS STATE UNIVERSITY CUP',
        schoolName: 'West Visayas State University',
        startDate: '2026-05-01',
        endDate: '2026-05-15',
        mode: 'Onsite',
        status: 'ongoing',
        rosterLockDate: 'May 12, 2026',
        resultsSubmitted: false,
        verifiedTeams: 8,
        pendingTeams: 5,
        totalRegistration: 13,
        teams: [
            buildMatchTeam('ra-ong-2-t1', 'participant'),
            buildMatchTeam('ra-ong-2-t2', 'participant'),
        ],
        rosterTeams: [buildRosterTeam('ra-ong-2-r1')],
    },
    {
        id: 'ra-up-1',
        title: 'MSL CAMPUS INVITATIONAL',
        schoolName: 'University of Santo Tomas',
        startDate: '2026-06-01',
        endDate: '2026-06-20',
        mode: 'Onsite',
        status: 'upcoming',
        rosterLockDate: 'June 15, 2026',
        resultsSubmitted: false,
        verifiedTeams: 4,
        pendingTeams: 6,
        totalRegistration: 10,
        teams: [
            buildMatchTeam('ra-up-1-t1', 'participant'),
            buildMatchTeam('ra-up-1-t2', 'participant'),
        ],
        rosterTeams: [buildRosterTeam('ra-up-1-r1')],
    },
    {
        id: 'ra-comp-1',
        title: "ILOILO DOCTOR'S COLLEGE TOURNAMENT",
        schoolName: "Iloilo Doctor's College",
        startDate: '2026-04-24',
        endDate: '2026-05-10',
        mode: 'Online',
        status: 'completed',
        rosterLockDate: 'May 14, 2026',
        resultsSubmitted: true,
        resultsSubmittedOn: '05/11/2026',
        reviewed: false,
        createdBy: 'SL Jenard',
        reportedBy: 'SL Jenard',
        verifiedTeams: 16,
        pendingTeams: 0,
        totalRegistration: 16,
        teams: [
            buildMatchTeam('ra-comp-1-t1', '1st'),
            buildMatchTeam('ra-comp-1-t2', '2nd'),
            buildMatchTeam('ra-comp-1-t3', '3rd'),
            buildMatchTeam('ra-comp-1-t4', '4th'),
            buildMatchTeam('ra-comp-1-t5', 'participant'),
        ],
        rosterTeams: [buildRosterTeam('ra-comp-1-r1')],
    },
    {
        id: 'ra-comp-2',
        title: 'REGIONAL CAMPUS SHOWDOWN',
        schoolName: 'University of the Philippines',
        startDate: '2025-12-01',
        endDate: '2025-12-15',
        mode: 'Onsite',
        status: 'completed',
        rosterLockDate: 'December 10, 2025',
        resultsSubmitted: true,
        resultsSubmittedOn: '12/16/2025',
        reviewed: true,
        createdBy: 'SL Jenard',
        reportedBy: 'SL Jenard',
        reviewedBy: 'RA Jenard',
        verifiedTeams: 10,
        pendingTeams: 0,
        totalRegistration: 10,
        teams: [
            buildMatchTeam('ra-comp-2-t1', '1st'),
            buildMatchTeam('ra-comp-2-t2', '2nd'),
        ],
        rosterTeams: [buildRosterTeam('ra-comp-2-r1')],
    },
];

/**
 * @param {Array<{ id: string; name: string; placement: string }>} teams
 */
export function getPlacementSummary(teams) {
    return ['1st', '2nd', '3rd', '4th'].map((placementId) => {
        const option = PLACEMENT_OPTIONS.find((item) => item.id === placementId);
        const team = teams.find((item) => item.placement === placementId);
        return {
            id: placementId,
            label: option?.label ?? placementId,
            rankColor: option?.rankColor ?? 'text-white',
            teamName: team?.name ?? '—',
        };
    });
}

const MONTH_SHORT = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];

const MONTH_LONG = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

/**
 * @param {string} isoDate YYYY-MM-DD
 */
export function formatTournamentDate(isoDate) {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-').map(Number);
    if (!year || !month || !day) return isoDate;
    return `${MONTH_LONG[month - 1]} ${day}, ${year}`;
}

/**
 * @param {string} isoDate YYYY-MM-DD
 */
export function formatShortDate(isoDate) {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-').map(Number);
    if (!year || !month || !day) return isoDate;
    return `${MONTH_SHORT[month - 1]} ${day}, ${year}`;
}

export function formatDateRange(startDate, endDate, mode) {
    const range = `${formatTournamentDate(startDate)} - ${formatTournamentDate(endDate)}`;
    return mode ? `${range} - ${mode}` : range;
}

/**
 * Dates that show a gold event dot in the calendar (demo markers).
 */
export const CALENDAR_EVENT_DATES = ['2024-01-11', '2024-01-24', '2023-12-26'];
