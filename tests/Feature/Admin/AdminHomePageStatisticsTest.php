<?php

namespace Tests\Feature\Admin;

use App\Models\AdminUser;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminHomePageStatisticsTest extends TestCase
{
    use RefreshDatabase;

    private function signInSuperAdmin(): AdminUser
    {
        $admin = AdminUser::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@example.com',
            'password' => Hash::make('password'),
            'role' => 'Super Admin',
        ]);

        $this->actingAs($admin, 'admin');

        return $admin;
    }

    public function test_public_homepage_renders_live_statistics_when_in_live_mode(): void
    {
        User::factory()->create([
            'user_type' => 'Student',
            'status' => 'active',
        ]);

        $response = $this->get('/');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Home/Index')
            ->has('statistics', 4)
            ->where('statistics.0.value', '1+')
            ->where('statistics.0.label', 'STUDENT GAMERS')
        );
    }

    public function test_admin_can_view_statistics_and_live_counts_in_home_page_settings(): void
    {
        $this->signInSuperAdmin();

        User::factory()->create([
            'user_type' => 'Student',
            'status' => 'active',
        ]);

        $response = $this->get(route('admin.home-page'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/HomePage')
            ->has('statistics')
            ->where('statistics.mode', 'live')
            ->has('liveCounts')
            ->where('liveCounts.student_gamers', '1+')
        );
    }

    public function test_admin_can_update_homepage_statistics_to_custom(): void
    {
        $this->signInSuperAdmin();

        $payload = [
            'mode' => 'custom',
            'student_gamers' => '30K+',
            'student_gamers_label' => 'ACTIVE GAMERS',
            'campus_communities' => '200+',
            'campus_communities_label' => 'CAMPUSES NATIONWIDE',
            'events_sponsored' => '175+',
            'events_sponsored_label' => 'SPONSORED TOURNAMENTS',
            'student_leaders' => '350+',
            'student_leaders_label' => 'STUDENT AMBASSADORS',
        ];

        $response = $this->post(route('admin.home-page.statistics'), $payload);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Homepage statistics updated successfully.');

        $this->assertEquals('custom', Setting::getValue('homepage_stat_mode'));
        $this->assertEquals('30K+', Setting::getValue('homepage_stat_student_gamers'));
        $this->assertEquals('ACTIVE GAMERS', Setting::getValue('homepage_stat_student_gamers_label'));

        // Public homepage now reflects the updated settings in custom mode
        $publicResponse = $this->get('/');
        $publicResponse->assertOk();
        $publicResponse->assertInertia(fn ($page) => $page
            ->component('Home/Index')
            ->where('statistics.0.value', '30K+')
            ->where('statistics.0.label', 'ACTIVE GAMERS')
            ->where('statistics.1.value', '200+')
            ->where('statistics.1.label', 'CAMPUSES NATIONWIDE')
            ->where('statistics.2.value', '175+')
            ->where('statistics.2.label', 'SPONSORED TOURNAMENTS')
            ->where('statistics.3.value', '350+')
            ->where('statistics.3.label', 'STUDENT AMBASSADORS')
        );
    }

    public function test_guest_cannot_update_homepage_statistics(): void
    {
        $response = $this->post(route('admin.home-page.statistics'), [
            'student_gamers' => '50K+',
            'student_gamers_label' => 'STUDENT GAMERS',
            'campus_communities' => '300+',
            'campus_communities_label' => 'CAMPUS COMMUNITIES',
            'events_sponsored' => '200+',
            'events_sponsored_label' => 'EVENTS SPONSORED',
            'student_leaders' => '500+',
            'student_leaders_label' => 'STUDENT LEADERS',
        ]);

        $response->assertRedirect(route('admin.login'));
    }
}

