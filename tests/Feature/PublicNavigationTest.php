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
            'partnerships', 'general-affairs', 'collegiate-cup', 'referral',
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

    public function test_network_is_a_public_view_of_the_existing_campus_directory(): void
    {
        $this->get(route('msl.network'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Campus/Index')
                ->where('isNetworkPage', true));

        $this->get('/Campus')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Campus/Index')->missing('isNetworkPage'));
    }

    public function test_existing_pages_are_preserved_when_public_links_are_retargeted(): void
    {
        foreach ([
            '/About' => 'About',
            '/Partnerships' => 'About',
            '/GeneralAffairs' => 'About',
            '/Event' => 'Events/Index',
            '/report-violation' => 'SafeSpaces/ReportViolation',
        ] as $url => $component) {
            $this->get($url)
                ->assertOk()
                ->assertInertia(fn ($page) => $page->component($component));
        }
    }
}
