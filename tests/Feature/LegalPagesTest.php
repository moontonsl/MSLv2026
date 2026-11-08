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

        $this->get('/privacy-policy')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('PrivacyPolicy'));

        $this->get('/terms-of-service')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('TermsAndConditions'));
    }

    public function test_legacy_policy_urls_redirect_to_the_canonical_pages(): void
    {
        $this->get('/PrivacyPolicy')->assertStatus(301)->assertRedirect('/privacy-policy');
        $this->get('/TermsAndConditions')->assertStatus(301)->assertRedirect('/terms-of-service');
    }
}
