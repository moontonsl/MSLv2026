import test from 'node:test';
import assert from 'node:assert/strict';
import { NETWORK_TIERS } from '../../resources/js/data/mslNetworkData.js';

test('Ascension semester budgets match the Quick Application Guide for Network and cross-campus support', () => {
    const budgets = { c: [50000, 20000], b: [70000, 30000], a: [100000, 40000], ss: [150000, 50000] };
    for (const tier of NETWORK_TIERS) {
        assert.deepEqual([tier.details.allocation, tier.details.crossCampus], budgets[tier.id]);
    }
});

test('merchandise and monetary eligibility match the guide without granting money to Tier B or C', () => {
    const merchandise = { c: 1000, b: 1500, a: 2000, ss: 2500 };
    for (const tier of NETWORK_TIERS) {
        assert.equal(tier.details.merchandise, merchandise[tier.id]);
        assert.equal(tier.details.monetaryEligible, ['a', 'ss'].includes(tier.id));
    }
});

test('Airdrop package access follows the guide’s tier eligibility matrix', () => {
    const packages = { c: 'A-1, A-2', b: 'A-1, A-2, B-1, B-2', a: 'A-1, A-2, B-1, B-2, C-1, C-2', ss: 'A-1, A-2, B-1, B-2, C-1, C-2' };
    for (const tier of NETWORK_TIERS) assert.equal(tier.details.airdropPackages, packages[tier.id]);
});
