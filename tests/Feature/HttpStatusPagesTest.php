<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class HttpStatusPagesTest extends TestCase
{
    use RefreshDatabase;

    private function registerStatusTestRoutes(): void
    {
        Route::middleware('web')->get('/_test/http-status/{status}', static function (string $status) {
            abort((int) $status);
        });

        Route::middleware('web')->post('/_test/http-status-validation', static function (Request $request) {
            $request->validate(['name' => ['required', 'string']]);

            return redirect('/');
        });
    }

    public function test_selected_http_statuses_render_the_shared_inertia_page(): void
    {
        $this->registerStatusTestRoutes();

        foreach ([401, 403, 404, 419, 422, 429, 503] as $status) {
            $this->get("/_test/http-status/{$status}")
                ->assertStatus($status)
                ->assertInertia(fn ($page) => $page
                    ->component('Errors/HttpStatus')
                    ->where('status', $status)
                    ->where('isAdminArea', false));
        }
    }

    public function test_production_server_errors_render_safely_without_exposing_details(): void
    {
        config(['app.debug' => false]);

        Route::middleware('web')->get('/_test/http-status/500', static function () {
            throw new \RuntimeException('private server detail');
        });

        $this->get('/_test/http-status/500')
            ->assertStatus(500)
            ->assertInertia(fn ($page) => $page
                ->component('Errors/HttpStatus')
                ->where('status', 500))
            ->assertDontSee('private server detail');
    }

    public function test_json_errors_and_form_validation_keep_their_existing_responses(): void
    {
        $this->registerStatusTestRoutes();

        $this->getJson('/_test/http-status/403')
            ->assertForbidden()
            ->assertJsonStructure(['message']);

        $this->from('/_test/http-status-validation')
            ->post('/_test/http-status-validation', [])
            ->assertRedirect('/_test/http-status-validation')
            ->assertSessionHasErrors(['name']);
    }
}
