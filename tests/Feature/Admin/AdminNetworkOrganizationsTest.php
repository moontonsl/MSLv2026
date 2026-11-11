<?php

namespace Tests\Feature\Admin;

use App\Models\AdminUser;
use App\Models\NetworkOrganization;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminNetworkOrganizationsTest extends TestCase
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

    public function test_admin_can_view_network_organizations_in_home_page(): void
    {
        NetworkOrganization::truncate();
        $this->signInSuperAdmin();

        NetworkOrganization::create([
            'name' => 'Test Org',
            'logo_path' => '/Images/Home/Logo 1.png',
            'link' => 'https://facebook.com/testorg',
            'order' => 0,
            'is_active' => true,
        ]);

        $response = $this->get(route('admin.home-page'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/HomePage')
            ->has('networkOrganizations', 1)
            ->where('networkOrganizations.0.name', 'Test Org')
            ->where('networkOrganizations.0.link', 'https://facebook.com/testorg')
        );
    }

    public function test_admin_can_create_network_organization_with_logo_and_link(): void
    {
        NetworkOrganization::truncate();
        Storage::fake('public');
        $this->signInSuperAdmin();

        $file = UploadedFile::fake()->image('test_logo.png', 400, 400);

        $response = $this->post(route('admin.home-page.network-organizations.store'), [
            'name' => 'New Campus Esports',
            'link' => 'https://facebook.com/newcampus',
            'logo' => $file,
            'order' => 1,
            'is_active' => 1,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('network_organizations', [
            'name' => 'New Campus Esports',
            'link' => 'https://facebook.com/newcampus',
            'order' => 1,
            'is_active' => true,
        ]);

        // Homepage receives the new logo
        $public = $this->get('/');
        $public->assertOk();
        $public->assertInertia(fn ($page) => $page
            ->component('Home/Index')
            ->has('networkLogos', 1)
            ->where('networkLogos.0.alt', 'New Campus Esports')
            ->where('networkLogos.0.link', 'https://facebook.com/newcampus')
        );
    }

    public function test_admin_can_update_network_organization(): void
    {
        $this->signInSuperAdmin();

        $org = NetworkOrganization::create([
            'name' => 'Old Name',
            'logo_path' => '/Images/Home/Logo 1.png',
            'link' => 'https://facebook.com/old',
            'order' => 0,
            'is_active' => true,
        ]);

        $response = $this->post(route('admin.home-page.network-organizations.update', $org), [
            'name' => 'Updated Name',
            'link' => 'https://facebook.com/updated',
            'order' => 2,
            'is_active' => 1,
        ]);

        $response->assertRedirect();
        $this->assertEquals('Updated Name', $org->fresh()->name);
        $this->assertEquals('https://facebook.com/updated', $org->fresh()->link);
        $this->assertEquals(2, $org->fresh()->order);
    }

    public function test_admin_can_delete_network_organization(): void
    {
        $this->signInSuperAdmin();

        $org = NetworkOrganization::create([
            'name' => 'To Delete',
            'logo_path' => '/Images/Home/Logo 1.png',
            'link' => 'https://facebook.com/delete',
            'order' => 0,
            'is_active' => true,
        ]);

        $response = $this->delete(route('admin.home-page.network-organizations.delete', $org));

        $response->assertRedirect();
        $this->assertDatabaseMissing('network_organizations', ['id' => $org->id]);
    }
}
