import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import test from 'node:test';
import { PROGRAMS, CAMPAIGNS, CAMPUS_TOURNAMENT_PREVIEWS, filterCampusTournaments } from '../../resources/js/data/programsData.js';
import { PUBLIC_ROUTES } from '../../resources/js/data/siteNavigation.js';

test('program, campaign, and tournament previews reference available local artwork', () => {
    for (const item of [...PROGRAMS, ...CAMPAIGNS, ...CAMPUS_TOURNAMENT_PREVIEWS]) {
        assert.ok(existsSync(new URL('../../public' + item.image, import.meta.url)), item.image);
    }
});

test('program links use public pages and retain Coming Soon for unfinished destinations', () => {
    assert.equal(PROGRAMS.find((item) => item.id === 'network').href, PUBLIC_ROUTES.network);
    assert.equal(PROGRAMS.find((item) => item.id === 'training').href, '/BuffsAndSupport#tournament-lobby');
    assert.equal(PROGRAMS.find((item) => item.id === 'referral').href, '/ComingSoon?feature=referral');
    assert.ok(CAMPAIGNS.every((item) => item.href === '/ComingSoon?feature=events'));
});

test('region filters handle all, matching, and empty tournament results', () => {
    const entries = [{ region: 'Luzon' }, { region: 'Visayas' }, { region: 'Luzon' }];
    assert.deepEqual(filterCampusTournaments(entries, 'All Regions'), entries);
    assert.deepEqual(filterCampusTournaments(entries, 'Luzon'), [entries[0], entries[2]]);
    assert.deepEqual(filterCampusTournaments(entries, 'Visayas'), [entries[1]]);
    assert.deepEqual(filterCampusTournaments(entries, 'Mindanao'), []);
});
