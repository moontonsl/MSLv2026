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
            'events', 'news', 'membership', 'leadership-summit', 'mcc-league',
        ] as $feature) {
            $this->get('/coming-soon/'.$feature)
                ->assertOk()
                ->assertInertia(fn ($page) => $page
                    ->component('ComingSoon')
                    ->where('feature', $feature));
        }
    }

    public function test_generic_coming_soon_page_is_available_and_unknown_features_are_rejected(): void
    {
        $this->get('/coming-soon')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('ComingSoon')->where('feature', 'msl'));

        $this->get('/coming-soon/not-a-real-feature')->assertNotFound();
    }

    public function test_network_and_campus_have_separate_public_pages(): void
    {
        $this->get(route('msl.network'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('MSLNetwork')
                ->missing('isNetworkPage'));

        $this->get('/about/campus')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Campus/Index')->missing('isNetworkPage'));
    }

    public function test_existing_pages_are_preserved_when_public_links_are_retargeted(): void
    {
        foreach ([
            '/about' => 'About',
            '/about/partnerships' => 'Partnerships',
            '/about/contents-social-media' => 'ContentMedia',
            '/programs/buffs-support' => 'Buffs and Support/Index',
            '/GeneralAffairs' => 'About',
            '/Event' => 'Events/Index',
            '/report-violation' => 'SafeSpaces/ReportViolation',
        ] as $url => $component) {
            $this->get($url)
                ->assertOk()
                ->assertInertia(fn ($page) => $page->component($component));
        }
    }

    public function test_legacy_public_urls_redirect_directly_to_the_canonical_pages(): void
    {
        foreach ([
            '/About' => '/about',
            '/Campus' => '/about/campus',
            '/Contents&SocialMedia' => '/about/contents-social-media',
            '/content-media' => '/about/contents-social-media',
            '/Partnerships' => '/about/partnerships',
            '/partner' => '/about/partnerships',
            '/Buffs&Support' => '/programs/buffs-support',
            '/Programs' => '/#home-programs',
            '/programs' => '/#home-programs',
        ] as $oldUrl => $canonicalUrl) {
            $this->get($oldUrl)->assertStatus(301)->assertRedirect($canonicalUrl);
        }
    }

    public function test_named_public_routes_use_the_canonical_urls(): void
    {
        foreach ([
            'about' => '/about',
            'campus' => '/about/campus',
            'contents.social.media' => '/about/contents-social-media',
            'partnerships' => '/about/partnerships',
            'msl.network' => '/programs/msl-network',
            'buffs.support' => '/programs/buffs-support',
        ] as $name => $path) {
            $this->assertSame($path, route($name, [], false));
        }
    }

    public function test_tournament_entry_still_requires_authentication(): void
    {
        $this->get('/campus-tournament')->assertRedirect(route('login'));
    }
}
