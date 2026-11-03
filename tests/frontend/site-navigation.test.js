import assert from 'node:assert/strict';
import test from 'node:test';
import { ABOUT_ITEMS, PROGRAMS_ITEMS, MAIN_LINKS, COMING_SOON_FEATURES, MSL_NETWORK_HREF, isPathActive, isNavigationItemActive, isNavigationGroupActive } from '../../resources/js/data/siteNavigation.js';
import { homeData } from '../../resources/js/data/homeData.js';

test('active routes ignore query strings, hashes, and trailing slashes without matching a different path', () => {
    assert.equal(isPathActive('/?source=nav', '/'), true);
    assert.equal(isPathActive('/About/?tab=team#members', '/About'), true);
    assert.equal(isPathActive('/News/article-one', '/News'), true);
    assert.equal(isPathActive('/Newsroom', '/News'), false);
    assert.equal(isPathActive('/coming-soon/news', '/'), false);
});

test('parent navigation follows both temporary pages and original destinations', () => {
    const partnerships = ABOUT_ITEMS.find((item) => item.label === 'Partnerships');
    const cup = PROGRAMS_ITEMS.find((item) => item.label === 'MSL Collegiate Cup');
    const news = MAIN_LINKS.find((item) => item.label === 'News');
    assert.equal(isNavigationItemActive('/coming-soon/partnerships', partnerships), true);
    assert.equal(isNavigationItemActive('/Partnerships', partnerships), true);
    assert.equal(isNavigationItemActive('/coming-soon/collegiate-cup', cup), true);
    assert.equal(isNavigationItemActive('/coming-soon/news?from=footer', news), true);
    assert.equal(isNavigationItemActive('/coming-soon/events', news), false);
    assert.equal(ABOUT_ITEMS.some((item) => isNavigationItemActive('/coming-soon/news', item)), false);
});

test('unavailable links keep their original destinations and use a recognized feature page', () => {
    for (const item of [...ABOUT_ITEMS, ...PROGRAMS_ITEMS, ...MAIN_LINKS].filter((item) => item.comingSoon)) {
        assert.ok(item.originalHref);
        assert.notEqual(item.href, item.originalHref);
        assert.ok(COMING_SOON_FEATURES[item.href.split('/').at(-1)]);
    }
});

test('Programs remains active for program destinations reached from the footer', () => {
    assert.equal(isNavigationGroupActive('/coming-soon/mcc-league', 'programs', PROGRAMS_ITEMS), true);
    assert.equal(isNavigationGroupActive('/coming-soon/leadership-summit', 'programs', PROGRAMS_ITEMS), true);
    assert.equal(isNavigationGroupActive('/coming-soon/news', 'programs', PROGRAMS_ITEMS), false);
});

test('membership and partnership calls to action have consistent destinations', () => {
    const member = homeData.hero.actions.find((action) => action.label === 'Be A Member');
    const partner = homeData.hero.actions.find((action) => action.label === 'Partner With Us');
    assert.equal(member.href, '/coming-soon/membership');
    assert.equal(member.comingSoon, true);
    assert.equal(partner.href, MSL_NETWORK_HREF);
    assert.equal(homeData.paths.items.find((path) => path.id === 'students').href, member.href);
    assert.equal(homeData.paths.items.find((path) => path.id === 'partners').href, partner.href);
});

test('community voices remain stored and can be restored through their visibility flag', () => {
    assert.equal(homeData.community.visible, false);
    assert.ok(homeData.community.voices.length > 0);
});
