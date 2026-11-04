<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class ErrorPageTest extends TestCase
{
    public function test_unknown_pages_use_the_custom_design_and_keep_the_404_status(): void
    {
        $this->withoutVite();

        $this->get('/this-page-does-not-exist')
            ->assertNotFound()
            ->assertInertia(fn ($page) => $page->component('Errors/NotFound'));
    }

    public function test_missing_pages_return_a_valid_inertia_error_page_during_client_navigation(): void
    {
        $this->withoutVite();

        $this->withHeaders(['X-Inertia' => 'true', 'Accept' => 'text/html'])
            ->get('/this-inertia-page-does-not-exist')
            ->assertNotFound()
            ->assertHeader('X-Inertia', 'true')
            ->assertJsonPath('component', 'Errors/NotFound');
    }

    public function test_json_not_found_responses_are_preserved(): void
    {
        $this->getJson('/api/this-endpoint-does-not-exist')
            ->assertNotFound()
            ->assertJsonStructure(['message'])
            ->assertJsonMissingPath('component');
    }

    public function test_the_500_error_page_uses_the_custom_internal_server_error_design(): void
    {
        Route::get('/test-internal-server-error', fn () => abort(500));

        $response = $this->get('/test-internal-server-error');

        $response
            ->assertStatus(500)
            ->assertSee('Internal Server Error')
            ->assertSee('Johnson’s full-speed ultimate')
            ->assertSee('Go back to Homepage');
    }

    public function test_the_403_error_page_uses_the_custom_access_forbidden_design(): void
    {
        Route::get('/test-access-forbidden', fn () => abort(403));

        $response = $this->get('/test-access-forbidden');

        $response
            ->assertForbidden()
            ->assertSee('Access Forbidden')
            ->assertSee('Edith’s shield is up and blocking the path')
            ->assertSee('Go back to Homepage');
    }

    public function test_the_419_error_page_uses_the_custom_page_expired_design(): void
    {
        Route::get('/test-page-expired', fn () => abort(419));

        $response = $this->get('/test-page-expired');

        $response
            ->assertStatus(419)
            ->assertSee('Page Expired')
            ->assertSee('Your session timed out like a bad Retribution play')
            ->assertSee('Go back to Homepage');
    }
}
