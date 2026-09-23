<?php

namespace Tests\Feature\Admin;

use App\Models\AdminUser;
use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminSettingsTest extends TestCase
{
    use RefreshDatabase;

    private function signInSuperAdmin(): AdminUser
    {
        $admin = AdminUser::create([
            'name' => 'Settings Admin',
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => 'Super Admin',
        ]);

        $this->actingAs($admin, 'admin');

        return $admin;
    }

    public function test_admin_can_view_supported_website_settings(): void
    {
        $this->signInSuperAdmin();
        Setting::setValue('website_name', 'MSL Philippines', 'string');
        Setting::setValue('website_title', 'Student Leaders', 'string');
        Setting::setValue('maintenance_mode', true, 'boolean');
        Setting::setValue('maintenance_message', 'Back soon.', 'string');

        $this->get(route('admin.settings'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Settings')
                ->where('settings.website_name', 'MSL Philippines')
                ->where('settings.website_title', 'Student Leaders')
                ->where('settings.maintenance_mode', true)
                ->where('settings.maintenance_message', 'Back soon.'));
    }

    public function test_super_admin_can_update_settings_and_upload_assets(): void
    {
        Storage::fake('public');
        $this->signInSuperAdmin();
        Storage::disk('public')->put('settings/old-logo.png', 'old logo');
        Setting::setValue('logo', 'settings/old-logo.png', 'file');

        $this->post(route('admin.settings.update'), [
            'website_name' => 'Updated MSL',
            'website_title' => 'Updated Title',
            'maintenance_mode' => true,
            'maintenance_message' => 'System update in progress.',
            'logo' => UploadedFile::fake()->image('new-logo.png'),
            'favicon' => UploadedFile::fake()->image('new-favicon.png'),
        ])->assertRedirect(route('admin.settings'));

        $logo = Setting::getValue('logo');
        $favicon = Setting::getValue('favicon');

        $this->assertDatabaseHas('settings', ['key' => 'website_name', 'value' => 'Updated MSL']);
        $this->assertDatabaseHas('settings', ['key' => 'maintenance_mode', 'value' => '1']);
        Storage::disk('public')->assertMissing('settings/old-logo.png');
        Storage::disk('public')->assertExists($logo);
        Storage::disk('public')->assertExists($favicon);
    }

    public function test_settings_reject_invalid_text_and_images(): void
    {
        $this->signInSuperAdmin();

        $this->post(route('admin.settings.update'), [
            'website_name' => str_repeat('a', 256),
            'logo' => UploadedFile::fake()->create('logo.pdf', 10, 'application/pdf'),
        ])->assertSessionHasErrors(['website_name', 'logo']);
    }

    public function test_admin_without_settings_permission_cannot_manage_settings(): void
    {
        $admin = AdminUser::create([
            'name' => 'Limited Admin',
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => 'Admin',
        ]);
        $this->actingAs($admin, 'admin');

        $this->get(route('admin.settings'))->assertForbidden();
        $this->post(route('admin.settings.update'), [])->assertForbidden();
    }
}
