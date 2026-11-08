export const SUPPORT_RANKS = ['Rank 1', 'Rank 2', 'Rank 3', 'Rank 4', 'Rank 5'];
export const SUPPORT_TIERS = ['Tier C', 'Tier B', 'Tier A', 'Superschools'];
export const DIAMOND_TYPES = ['Tournament', 'Non-Tournament', 'Cross-campus Tournament'];
export const SHS_TYPES = ['On-Ground Tournament', 'Online Tournament', 'Other MLBB Events (Non-Tournament)', 'Other Events (Not MLBB-Related)'];
export const CAUSE_TYPES = ['On-Ground Tournament', 'Online Tournament', 'Other Types of Event'];

// Columns: Tournament, Non-Tournament. Rows: Tier C, B, A, Superschools.
const diamonds = {
    'Rank 1': [[12000, 10500], [12000, 10500], [12000, 10500], [12000, 10500]],
    'Rank 2': [[12500, 10500], [14000, 11000], [15500, 12000], [17000, 13000]],
    'Rank 3': [[14000, 11000], [15500, 12000], [17000, 13000], [18500, 14000]],
    'Rank 4': [[15500, 12000], [17000, 13000], [18500, 14000], [20000, 15000]],
    'Rank 5': [[17000, 13000], [18500, 14000], [20000, 15000], [25000, 16000]],
};

export function diamondAllocation(rank, tier, type) {
    if (!SUPPORT_RANKS.includes(rank) || !SUPPORT_TIERS.includes(tier) || !DIAMOND_TYPES.includes(type)) return null;
    if (type === 'Cross-campus Tournament') return 10000;
    return diamonds[rank]?.[SUPPORT_TIERS.indexOf(tier)]?.[DIAMOND_TYPES.indexOf(type)] ?? null;
}

export const SHS_TEAM_BANDS = ['4–7 teams', '8–16 teams', '>16 teams'];
export const SHS_CATEGORIES = ['Intra-strand Event', 'Inter-strand Event', 'High-school Intramurals'];
const shs = {
    'Intra-strand Event': [[5000, 3500, 2500, 1000], [9000, 7500, 5500, 4000], [15000, 10000, 8000, 5000]],
    'Inter-strand Event': [[9000, 7500, 5500, 4000], [15000, 10000, 8000, 5000], [20000, 12000, 8500, 7000]],
};
export function shsAllocation(category, teams, type) {
    if (category === 'High-school Intramurals') return 25000;
    return shs[category]?.[SHS_TEAM_BANDS.indexOf(teams)]?.[SHS_TYPES.indexOf(type)] ?? null;
}

export const CAUSE_TEAM_BANDS = ['4–7 teams', '8–15 teams', '>16 teams'];
const cause = [[5000, 4000, 2000], [7000, 5000, 3000], [10000, 7000, 4000]];
export function causeAllocation(teams, type) {
    return cause[CAUSE_TEAM_BANDS.indexOf(teams)]?.[CAUSE_TYPES.indexOf(type)] ?? null;
}

export function monetaryAllocation(rank, tier, type) {
    if (!['On-Ground Tournament', 'Online Tournament'].includes(type)) return null;
    if (!SUPPORT_RANKS.includes(rank) || ![...SUPPORT_TIERS, '-'].includes(tier)) return null;
    if (rank === 'Rank 5') return null;
    if (rank === 'Rank 4') return type === 'On-Ground Tournament' ? 20000 : 4000;
    const amounts = {
        'Rank 2': { 'Tier A': [4000, 2000], Superschools: [6000, 3000] },
        'Rank 3': { 'Tier A': [7000, 3000], Superschools: [10000, 4000] },
    };
    return amounts[rank]?.[tier]?.[type === 'On-Ground Tournament' ? 0 : 1] ?? null;
}
