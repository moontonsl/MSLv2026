import assert from 'node:assert/strict';
import test from 'node:test';
import { ABOUT_ITEMS, PROGRAMS_ITEMS, MAIN_LINKS, COMING_SOON_FEATURES, MSL_NETWORK_HREF, PUBLIC_ROUTES, isPathActive, isNavigationItemActive, isNavigationGroupActive } from '../../resources/js/data/siteNavigation.js';
import { homeData } from '../../resources/js/data/homeData.js';

test('active routes ignore query strings, hashes, and trailing slashes without matching a different path', () => {
    assert.equal(isPathActive('/?source=nav', '/'), true);
    assert.equal(isPathActive('/About/?tab=team#members', '/About'), true);
    assert.equal(isPathActive('/News/article-one', '/News'), true);
    assert.equal(isPathActive('/Newsroom', '/News'), false);
    assert.equal(isPathActive('/coming-soon/news', '/'), false);
});

test('parent navigation follows both temporary pages and original destinations', () => {
    const campus = ABOUT_ITEMS.find((item) => item.label === 'Campus');
    const partnerships = ABOUT_ITEMS.find((item) => item.label === 'Partnerships');
    const cup = PROGRAMS_ITEMS.find((item) => item.label === 'MSL Collegiate Cup');
    const news = MAIN_LINKS.find((item) => item.label === 'News');
    assert.equal(isNavigationItemActive('/coming-soon/campus', campus), true);
    assert.equal(isNavigationItemActive('/Campus', campus), true);
    assert.equal(isNavigationGroupActive('/coming-soon/campus', 'about', ABOUT_ITEMS), true);
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
        assert.ok(COMING_SOON_FEATURES[new URL(item.href, 'https://msl.local').searchParams.get('feature')]);
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
    assert.equal(member.href, '/ComingSoon?feature=membership');
    assert.equal(member.comingSoon, true);
    assert.equal(partner.href, MSL_NETWORK_HREF);
    assert.equal(homeData.paths.items.find((path) => path.id === 'students').href, member.href);
    assert.equal(homeData.paths.items.find((path) => path.id === 'partners').href, partner.href);
});

test('community voices remain stored and can be restored through their visibility flag', () => {
    assert.equal(homeData.community.visible, false);
    assert.ok(homeData.community.voices.length > 0);
});

test('Partnerships is publicly available and keeps About active for its page and aliases', () => {
    const partnerships = ABOUT_ITEMS.find((item) => item.label === 'Partnerships');
    assert.equal(partnerships.href, PUBLIC_ROUTES.partnerships);
    assert.equal(Boolean(partnerships.comingSoon), false);
    for (const url of ['/Partnerships', '/about/partnerships', '/partner']) {
        assert.equal(isNavigationItemActive(url, partnerships), true);
        assert.equal(isNavigationGroupActive(url, 'about', ABOUT_ITEMS), true);
    }
});

test('nested About pages select only their own submenu item and keep About active', () => {
    for (const [url, label] of [
        ['/about', 'About Us'],
        ['/about/campus', 'Campus'],
        ['/about/contents-social-media', 'Contents & Social Media'],
        ['/about/partnerships/?source=home#team', 'Partnerships'],
    ]) {
        assert.deepEqual(
            ABOUT_ITEMS.filter((item) => isNavigationItemActive(url, item)).map((item) => item.label),
            [label],
        );
        assert.equal(isNavigationGroupActive(url, 'about', ABOUT_ITEMS), true);
    }
    assert.equal(isNavigationGroupActive('/MSLNetAdmin', 'programs', PROGRAMS_ITEMS), false);
});

test('homepage destinations use canonical public routes and the dedicated Programs page', () => {
    assert.equal(homeData.about.href, '/About');
    assert.equal(homeData.programs.href, '/Programs');
    assert.equal(homeData.programs.items.find((item) => item.id === 'buffs-support').href, '/BuffsAndSupport');
    assert.equal(homeData.programs.items.find((item) => item.id === 'msl-network').href, MSL_NETWORK_HREF);
    assert.equal(isPathActive(homeData.programs.href, '/'), false);
    assert.equal(isNavigationGroupActive('/Programs', 'programs', PROGRAMS_ITEMS), true);
});

test('public page destinations use flat PascalCase URLs and retain their parent navigation', () => {
    for (const [key, href] of Object.entries(PUBLIC_ROUTES)) {
        if (key === 'home' || key === 'programs') continue;
        assert.match(href, /^\/[A-Z][A-Za-z]*$/);
    }
    for (const item of [...ABOUT_ITEMS, ...PROGRAMS_ITEMS].filter((item) => !item.comingSoon)) {
        const group = ABOUT_ITEMS.includes(item) ? 'about' : 'programs';
        const items = group === 'about' ? ABOUT_ITEMS : PROGRAMS_ITEMS;
        assert.equal(isNavigationGroupActive(item.href, group, items), true);
        for (const alias of item.activePaths || []) {
            assert.equal(isNavigationItemActive(alias, item), true);
        }
    }
    assert.equal(MSL_NETWORK_HREF, '/MSLNetwork');
});

test('Coming Soon active states distinguish features while ignoring unrelated query parameters', () => {
    const news = MAIN_LINKS.find((item) => item.label === 'News');
    const events = MAIN_LINKS.find((item) => item.label === 'Events');
    assert.equal(isNavigationItemActive('/ComingSoon?source=footer&feature=news#top', news), true);
    assert.equal(isNavigationItemActive('/ComingSoon?feature=news', events), false);
    assert.equal(isNavigationGroupActive('/ComingSoon?feature=news', 'about', ABOUT_ITEMS), false);
    assert.equal(isNavigationGroupActive('/ComingSoon?feature=news', 'programs', PROGRAMS_ITEMS), false);
    assert.equal(isNavigationGroupActive('/ComingSoon?feature=collegiate-cup', 'programs', PROGRAMS_ITEMS), true);
    assert.equal(isNavigationGroupActive('/ComingSoon?feature=general-affairs', 'about', ABOUT_ITEMS), true);
    assert.equal(isPathActive('/coming-soon/news', news.href), true);
});
