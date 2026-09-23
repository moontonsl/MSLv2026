<?php

namespace Tests\Feature\Admin;

use App\Models\AdminUser;
use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminFooterTest extends TestCase
{
    use RefreshDatabase;

    private function signInSuperAdmin(): AdminUser
    {
        $admin = AdminUser::create([
            'name' => 'Footer Admin',
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => 'Super Admin',
        ]);

        $this->actingAs($admin, 'admin');

        return $admin;
    }

    public function test_admin_can_view_footer_settings_and_navigation(): void
    {
        $this->signInSuperAdmin();
        Setting::setValue('footer_description', 'Managed footer description.', 'text');
        Setting::setValue('footer_nav_sections', json_encode([
            ['title' => 'Explore', 'links' => [['label' => 'News', 'href' => '/News']]],
        ]), 'json');

        $this->get(route('admin.footer'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Footer/Index')
                ->where('footer.description', 'Managed footer description.')
                ->where('footer.nav_sections.0.title', 'Explore')
                ->where('footer.nav_sections.0.links.0.href', '/News'));
    }

    public function test_super_admin_can_update_footer_content_links_and_navigation(): void
    {
        $this->signInSuperAdmin();
        $sections = [
            [
                'title' => 'Community',
                'links' => [
                    ['label' => 'News', 'href' => '/News'],
                    ['label' => 'Facebook', 'href' => 'https://www.facebook.com/MSLPhilippines'],
                ],
            ],
        ];

        $this->post(route('admin.footer.update'), [
            'description' => 'New footer description.',
            'copyright' => '© 2026 MSL Philippines.',
            'logo' => '/custom-logo.png',
            'facebook_url' => 'https://www.facebook.com/MSLPhilippines',
            'youtube_url' => 'https://www.youtube.com/@MSLPhilippines',
            'tiktok_url' => 'https://www.tiktok.com/@mslphilippines',
            'mlbb_logo' => '/custom-mlbb.png',
            'moonton_logo' => '/custom-moonton.png',
            'nav_sections' => $sections,
        ])->assertRedirect(route('admin.footer'));

        $this->assertSame('New footer description.', Setting::getValue('footer_description'));
        $this->assertSame('© 2026 MSL Philippines.', Setting::getValue('footer_copyright'));
        $this->assertSame($sections, json_decode(Setting::getValue('footer_nav_sections'), true));
        $this->assertSame('https://www.tiktok.com/@mslphilippines', Setting::getValue('footer_tiktok_url'));
    }

    public function test_footer_rejects_invalid_urls_and_nested_navigation(): void
    {
        $this->signInSuperAdmin();

        $this->post(route('admin.footer.update'), [
            'facebook_url' => 'not-a-url',
            'nav_sections' => [
                ['title' => '', 'links' => [['label' => '', 'href' => '']]],
            ],
        ])->assertSessionHasErrors([
            'facebook_url',
            'nav_sections.0.title',
            'nav_sections.0.links.0.label',
            'nav_sections.0.links.0.href',
        ]);
    }

    public function test_footer_settings_are_shared_with_public_pages(): void
    {
        Setting::setValue('footer_description', 'Publicly shared footer.', 'text');
        Setting::setValue('footer_copyright', '© 2026 MSL.', 'string');
        Setting::setValue('footer_nav_sections', json_encode([
            ['title' => 'Community', 'links' => [['label' => 'News', 'href' => '/News']]],
        ]), 'json');

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('footer.description', 'Publicly shared footer.')
                ->where('footer.copyright', '© 2026 MSL.')
                ->where('footer.nav_sections.0.title', 'Community'));
    }

    public function test_admin_without_footer_permission_cannot_manage_footer(): void
    {
        $admin = AdminUser::create([
            'name' => 'Limited Admin',
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => 'Admin',
        ]);
        $this->actingAs($admin, 'admin');

        $this->get(route('admin.footer'))->assertForbidden();
        $this->post(route('admin.footer.update'), [])->assertForbidden();
    }
}
