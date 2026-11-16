<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Tests\TestCase;

class PascalCasePageUrlsTest extends TestCase
{
    use RefreshDatabase;

    public function test_legacy_bookmarks_redirect_with_their_query_parameters(): void
    {
        foreach ([
            '/login' => '/Login',
            '/forgot-password' => '/ForgotPassword',
            '/profile' => '/Profile',
            '/studentportal' => '/StudentPortal',
            '/admin/home-page' => '/Admin/HomePage',
            '/admin/account-roles-permissions' => '/Admin/AccountRolesAndPermissions',
            '/Tournament/SL' => '/Tournament/StudentLeader',
            '/Tournament/CampusTournament' => '/Tournament/Captain',
            '/TermsOfService' => '/TermsAndConditions',
        ] as $old => $canonical) {
            $this->get($old.'?source=bookmark')->assertStatus(301)
                ->assertRedirect($canonical.'?source=bookmark');
        }
    }

    public function test_reset_tokens_email_and_short_link_codes_are_preserved(): void
    {
        $this->get('/reset-password/AbC123?email=test%40example.com')
            ->assertStatus(301)->assertRedirect('/ResetPassword/AbC123?email=test%40example.com');
        $this->get('/s/MixedCase123')->assertStatus(301)->assertRedirect('/S/MixedCase123');
    }

    public function test_canonical_pages_retain_their_authentication_guards(): void
    {
        $this->get('/Profile')->assertRedirect(route('login'));
        $this->get('/StudentPortal')->assertRedirect(route('login'));
        $this->get('/Tournament/StudentLeader')->assertRedirect(route('login'));
        $this->get('/Admin/HomePage')->assertRedirect(route('admin.login'));
        $this->get('/Admin/AccountRolesAndPermissions')->assertRedirect(route('admin.login'));
    }

    public function test_old_form_actions_keep_the_canonical_controller_and_middleware(): void
    {
        foreach ([
            ['POST', '/login', '/Login'],
            ['POST', '/forgot-password', '/ForgotPassword'],
            ['POST', '/reset-password', '/ResetPassword'],
            ['PATCH', '/profile', '/Profile'],
            ['POST', '/admin/login', '/Admin/Login'],
        ] as [$method, $old, $canonical]) {
            $routes = app('router')->getRoutes();
            $legacyRoute = $routes->match(Request::create($old, $method));
            $canonicalRoute = $routes->match(Request::create($canonical, $method));
            $this->assertSame($canonicalRoute->getActionName(), $legacyRoute->getActionName());
            $this->assertSame($canonicalRoute->gatherMiddleware(), $legacyRoute->gatherMiddleware());
        }
    }
}
