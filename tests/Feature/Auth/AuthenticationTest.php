<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_screen_can_be_rendered(): void
    {
        $response = $this->get('/Login');

        $response->assertStatus(200);
    }

    public function test_users_can_authenticate_using_the_login_screen(): void
    {
        $user = User::factory()->create([
            'user_type' => 'Student',
            'status' => 'active',
        ]);

        $response = $this->post('/Login', [
            'username' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('student.portal'));
    }

    public function test_all_portal_roles_redirect_to_profile_after_login(): void
    {
        foreach (['Student', 'Student Leader', 'Regional Admin', 'Core Admin'] as $role) {
            $user = User::factory()->create([
                'user_type' => $role,
                'status' => 'active',
            ]);

            $response = $this->post('/login', [
                'username' => $user->email,
                'password' => 'password',
            ]);

            $this->assertAuthenticatedAs($user);
            $response->assertRedirect(route('student.portal'));

            $this->actingAs($user)
                ->get(route('student.portal'))
                ->assertOk();

            $this->post('/logout');
        }
    }

    public function test_authenticated_user_visiting_login_is_redirected_to_profile(): void
    {
        $user = User::factory()->create([
            'user_type' => 'Student',
            'status' => 'active',
        ]);

        $this->actingAs($user)
            ->get('/Login')
            ->assertRedirect(route('student.portal'));
    }

    public function test_users_can_not_authenticate_with_invalid_password(): void
    {
        $user = User::factory()->create();

        $this->post('/Login', [
            'username' => $user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_users_can_logout(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/logout');

        $this->assertGuest();
        $response->assertRedirect('/');
    }
}
