<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LegalPagesTest extends TestCase
{
    use RefreshDatabase;

    public function test_policy_pages_are_publicly_accessible_from_the_canonical_footer_destinations(): void
    {
        $this->withoutVite();

        $this->get('/PrivacyPolicy')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('PrivacyPolicy'));

        $this->get('/TermsAndConditions')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('TermsAndConditions'));
    }

    public function test_legacy_policy_urls_redirect_to_the_canonical_pages(): void
    {
        $this->get('/privacy-policy')->assertStatus(301)->assertRedirect('/PrivacyPolicy');
        $this->get('/terms-of-service')->assertStatus(301)->assertRedirect('/TermsAndConditions');
        $this->get('/TermsOfService')->assertStatus(301)->assertRedirect('/TermsAndConditions');
    }
}
