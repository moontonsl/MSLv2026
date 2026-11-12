<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicNavigationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    public function test_each_unavailable_feature_has_a_public_coming_soon_page(): void
    {
        foreach ([
            'campus', 'partnerships', 'general-affairs', 'collegiate-cup', 'referral',
            'events', 'news', 'membership', 'leadership-summit', 'mcc-league', 'careers',
        ] as $feature) {
            $this->get('/ComingSoon?feature='.$feature)
                ->assertOk()
                ->assertInertia(fn ($page) => $page
                    ->component('ComingSoon')
                    ->where('feature', $feature));
        }
    }

    public function test_generic_coming_soon_page_is_available_and_unknown_features_are_rejected(): void
    {
        $this->get('/ComingSoon')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('ComingSoon')->where('feature', 'msl'));

        $this->get('/ComingSoon?feature=not-a-real-feature')->assertNotFound();
        $this->get('/ComingSoon?feature[]=news')->assertNotFound();
    }

    public function test_network_and_campus_have_separate_public_pages(): void
    {
        $this->get(route('msl.network'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('MSLNetwork')
                ->missing('isNetworkPage'));

        $this->get('/Campus')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Campus/Index')->missing('isNetworkPage'));
    }

    public function test_existing_pages_are_preserved_when_public_links_are_retargeted(): void
    {
        foreach ([
            '/About' => 'About',
            '/Partnerships' => 'Partnerships',
            '/ContentsAndSocialMedia' => 'ContentMedia',
            '/BuffsAndSupport' => 'Buffs and Support/Index',
            '/Programs' => 'Programs/Index',
            '/GeneralAffairs' => 'About',
            '/Event' => 'Events/Index',
            '/ReportViolation' => 'SafeSpaces/ReportViolation',
        ] as $url => $component) {
            $this->get($url)
                ->assertOk()
                ->assertInertia(fn ($page) => $page->component($component));
        }
    }

    public function test_legacy_public_urls_redirect_directly_to_the_canonical_pages(): void
    {
        foreach ([
            '/about' => '/About',
            '/about/campus' => '/Campus',
            '/about/contents-social-media' => '/ContentsAndSocialMedia',
            '/Contents&SocialMedia' => '/ContentsAndSocialMedia',
            '/content-media' => '/ContentsAndSocialMedia',
            '/about/partnerships' => '/Partnerships',
            '/partner' => '/Partnerships',
            '/programs/msl-network' => '/MSLNetwork',
            '/programs/buffs-support' => '/BuffsAndSupport',
            '/Buffs&Support' => '/BuffsAndSupport',
            '/programs' => '/Programs',
            '/report-violation' => '/ReportViolation',
            '/careers' => '/Careers',
            '/campus-tournament' => '/CampusTournaments',
            '/programs/campus-tournaments' => '/CampusTournaments',
            '/coming-soon' => '/ComingSoon',
            '/coming-soon/news' => '/ComingSoon?feature=news',
            '/coming-soon/general-affairs' => '/ComingSoon?feature=general-affairs',
        ] as $oldUrl => $canonicalUrl) {
            $this->get($oldUrl)->assertStatus(301)->assertRedirect($canonicalUrl);
        }
    }

    public function test_named_public_routes_use_the_canonical_urls(): void
    {
        foreach ([
            'about' => '/About',
            'campus' => '/Campus',
            'contents.social.media' => '/ContentsAndSocialMedia',
            'partnerships' => '/Partnerships',
            'msl.network' => '/MSLNetwork',
            'buffs.support' => '/BuffsAndSupport',
            'report.violation' => '/ReportViolation',
            'campus.tournament' => '/CampusTournaments',
            'careers' => '/Careers',
            'coming-soon' => '/ComingSoon',
            'programs' => '/Programs',
        ] as $name => $path) {
            $this->assertSame($path, route($name, [], false));
        }
    }

    public function test_tournament_entry_still_requires_authentication(): void
    {
        $this->get('/CampusTournaments')->assertRedirect(route('login'));
    }

    public function test_careers_opens_its_coming_soon_content(): void
    {
        $this->get('/Careers')->assertOk()
            ->assertInertia(fn ($page) => $page->component('ComingSoon')->where('feature', 'careers'));
    }
}
