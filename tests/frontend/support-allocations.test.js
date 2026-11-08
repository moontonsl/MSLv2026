import assert from 'node:assert/strict';
import test from 'node:test';
import {
    SUPPORT_RANKS,
    SUPPORT_TIERS,
    DIAMOND_TYPES,
    SHS_CATEGORIES,
    SHS_TEAM_BANDS,
    SHS_TYPES,
    CAUSE_TEAM_BANDS,
    CAUSE_TYPES,
    diamondAllocation,
    shsAllocation,
    causeAllocation,
    monetaryAllocation,
} from '../../resources/js/data/supportAllocations.js';

test('rank and tier choices use the approved terminology', () => {
    assert.deepEqual(SUPPORT_RANKS, ['Rank 1', 'Rank 2', 'Rank 3', 'Rank 4', 'Rank 5']);
    assert.deepEqual(SUPPORT_TIERS, ['Tier C', 'Tier B', 'Tier A', 'Superschools']);
    assert.deepEqual(DIAMOND_TYPES, ['Tournament', 'Non-Tournament', 'Cross-campus Tournament']);
    assert.deepEqual(CAUSE_TEAM_BANDS, ['4–7 teams', '8–15 teams', '>16 teams']);
    assert.deepEqual(SHS_TEAM_BANDS, ['4–7 teams', '8–16 teams', '>16 teams']);
});

test('Diamond Support matches every rank and tier cell in Table 5', () => {
    // The shared Rank 1 amounts cover Tier C–A and Superschools.
    const expected = [
        [[12000, 10500], [12000, 10500], [12000, 10500], [12000, 10500]],
        [[12500, 10500], [14000, 11000], [15500, 12000], [17000, 13000]],
        [[14000, 11000], [15500, 12000], [17000, 13000], [18500, 14000]],
        [[15500, 12000], [17000, 13000], [18500, 14000], [20000, 15000]],
        [[17000, 13000], [18500, 14000], [20000, 15000], [25000, 16000]],
    ];

    SUPPORT_RANKS.forEach((rank, rankIndex) => {
        SUPPORT_TIERS.forEach((tier, tierIndex) => {
            ['Tournament', 'Non-Tournament'].forEach((type, typeIndex) => {
                assert.equal(
                    diamondAllocation(rank, tier, type),
                    expected[rankIndex][tierIndex][typeIndex],
                    `${rank}, ${tier}, ${type}`,
                );
            });
            assert.equal(diamondAllocation(rank, tier, 'Cross-campus Tournament'), 10000);
        });
    });
});

test('SHS calculations match all event classifications and team bands in Table 9', () => {
    const expected = [
        [[5000, 3500, 2500, 1000], [9000, 7500, 5500, 4000], [15000, 10000, 8000, 5000]],
        [[9000, 7500, 5500, 4000], [15000, 10000, 8000, 5000], [20000, 12000, 8500, 7000]],
    ];

    ['Intra-strand Event', 'Inter-strand Event'].forEach((category, categoryIndex) => {
        SHS_TEAM_BANDS.forEach((teams, bandIndex) => {
            SHS_TYPES.forEach((type, typeIndex) => {
                assert.equal(
                    shsAllocation(category, teams, type),
                    expected[categoryIndex][bandIndex][typeIndex],
                    `${category}, ${teams}, ${type}`,
                );
            });
        });
    });
    assert.ok(SHS_CATEGORIES.includes('High-school Intramurals'));
    assert.equal(shsAllocation('High-school Intramurals', '', ''), 25000);
});

test('Events for a Cause matches the three supplied team bands in Table 8', () => {
    const expected = [[5000, 4000, 2000], [7000, 5000, 3000], [10000, 7000, 4000]];
    CAUSE_TEAM_BANDS.forEach((teams, bandIndex) => {
        CAUSE_TYPES.forEach((type, typeIndex) => {
            assert.equal(causeAllocation(teams, type), expected[bandIndex][typeIndex], `${teams}, ${type}`);
        });
    });
    // The table does not authorize assigning exactly 16 teams to the >16 band.
    assert.equal(causeAllocation('16 teams', CAUSE_TYPES[0]), null);
});

test('Monetary Grants matches Table 7 in pesos and leaves Rank 5 proposal based', () => {
    const expected = [
        ['Rank 2', 'Tier A', 4000, 2000],
        ['Rank 2', 'Superschools', 6000, 3000],
        ['Rank 3', 'Tier A', 7000, 3000],
        ['Rank 3', 'Superschools', 10000, 4000],
        ['Rank 4', '-', 20000, 4000],
    ];
    for (const [rank, tier, onGround, online] of expected) {
        assert.equal(monetaryAllocation(rank, tier, 'On-Ground Tournament'), onGround);
        assert.equal(monetaryAllocation(rank, tier, 'Online Tournament'), online);
    }
    for (const type of ['On-Ground Tournament', 'Online Tournament']) {
        assert.equal(monetaryAllocation('Rank 5', '-', type), null);
        assert.equal(monetaryAllocation('Rank 1', 'Tier A', type), null);
        assert.equal(monetaryAllocation('Rank 2', 'Tier C', type), null);
        assert.equal(monetaryAllocation('Rank 3', 'Tier B', type), null);
    }
});

test('unknown selections never silently receive an allocation', () => {
    assert.equal(diamondAllocation('Rank 6', 'Tier A', 'Tournament'), null);
    assert.equal(diamondAllocation('Rank 2', 'Tier D', 'Tournament'), null);
    assert.equal(diamondAllocation('Rank 2', 'Tier A', 'Unknown Event'), null);
    assert.equal(diamondAllocation('Rank 6', 'Tier A', 'Cross-campus Tournament'), null);
    assert.equal(diamondAllocation('Rank 2', 'Tier D', 'Cross-campus Tournament'), null);
    assert.equal(shsAllocation('Unknown Category', SHS_TEAM_BANDS[0], SHS_TYPES[0]), null);
    assert.equal(shsAllocation(SHS_CATEGORIES[0], 'Unknown Team Band', SHS_TYPES[0]), null);
    assert.equal(shsAllocation(SHS_CATEGORIES[0], SHS_TEAM_BANDS[0], 'Unknown Event'), null);
    assert.equal(causeAllocation('Unknown Team Band', CAUSE_TYPES[0]), null);
    assert.equal(causeAllocation(CAUSE_TEAM_BANDS[0], 'Unknown Event'), null);
    assert.equal(monetaryAllocation('Rank 6', 'Tier A', 'Online Tournament'), null);
    assert.equal(monetaryAllocation('Rank 2', 'Tier D', 'Online Tournament'), null);
    assert.equal(monetaryAllocation('Rank 2', 'Tier A', 'Unknown Event'), null);
    assert.equal(monetaryAllocation('Rank 4', '-', 'Unknown Event'), null);
});
