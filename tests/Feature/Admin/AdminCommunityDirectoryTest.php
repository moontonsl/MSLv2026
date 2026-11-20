<?php

namespace Tests\Feature\Admin;

use App\Models\AdminUser;
use App\Models\CommunityDirectoryEntry;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminCommunityDirectoryTest extends TestCase
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

    public function test_admin_can_view_community_directory(): void
    {
        CommunityDirectoryEntry::truncate();
        $this->signInSuperAdmin();

        CommunityDirectoryEntry::create([
            'school' => 'Ateneo de Davao University',
            'community' => 'AdDU - Blue Knights',
            'region' => 'Mindanao',
            'tier' => 'Level II',
            'members' => 600,
            'href' => 'https://facebook.com/groups/addu',
            'order' => 1,
            'is_active' => true,
        ]);

        $response = $this->get(route('admin.community-directory.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/CommunityDirectory')
            ->has('entries', 1)
            ->where('entries.0.school', 'Ateneo de Davao University')
            ->where('entries.0.tier', 'Level II')
        );
    }

    public function test_admin_can_create_update_toggle_and_delete_entry(): void
    {
        CommunityDirectoryEntry::truncate();
        $this->signInSuperAdmin();

        // Create
        $this->post(route('admin.community-directory.store'), [
            'school' => 'University of the Philippines Diliman',
            'community' => 'UPD - Fighting Maroons Esports',
            'region' => 'NCR',
            'tier' => 'Level III',
            'members' => 950,
            'href' => 'https://facebook.com/groups/updesports',
            'order' => 1,
            'is_active' => true,
        ])->assertRedirect();

        $entry = CommunityDirectoryEntry::firstOrFail();
        $this->assertSame('University of the Philippines Diliman', $entry->school);
        $this->assertSame(950, $entry->members);
        $this->assertTrue($entry->is_active);

        // Update
        $this->put(route('admin.community-directory.update', $entry), [
            'school' => 'UP Diliman',
            'community' => 'UPD - Maroons Gaming',
            'region' => 'NCR',
            'tier' => 'Level II',
            'members' => 1020,
            'href' => 'https://facebook.com/groups/updmaroons',
            'order' => 2,
            'is_active' => true,
        ])->assertRedirect();

        $entry->refresh();
        $this->assertSame('UP Diliman', $entry->school);
        $this->assertSame('Level II', $entry->tier);
        $this->assertSame(1020, $entry->members);

        // Toggle visibility
        $this->patch(route('admin.community-directory.toggle', $entry))
            ->assertRedirect();
        $entry->refresh();
        $this->assertFalse($entry->is_active);

        // Delete
        $this->delete(route('admin.community-directory.delete', $entry))
            ->assertRedirect();
        $this->assertDatabaseMissing('community_directory_entries', ['id' => $entry->id]);
    }

    public function test_public_campus_page_renders_only_active_directory_entries(): void
    {
        CommunityDirectoryEntry::truncate();

        CommunityDirectoryEntry::create([
            'school' => 'Visible University',
            'community' => 'VU - Gamers',
            'region' => 'NCR',
            'tier' => 'Level III',
            'members' => 700,
            'href' => 'https://facebook.com/groups/vu',
            'order' => 1,
            'is_active' => true,
        ]);

        CommunityDirectoryEntry::create([
            'school' => 'Hidden University',
            'community' => 'HU - Gamers',
            'region' => 'Visayas',
            'tier' => 'Level I',
            'members' => 120,
            'href' => '#accreditation',
            'order' => 2,
            'is_active' => false,
        ]);

        $response = $this->get(route('campus'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Campus/Index')
            ->has('communityDirectory', 1)
            ->where('communityDirectory.0.school', 'Visible University')
        );
    }

    public function test_admin_without_permission_cannot_access_community_directory(): void
    {
        $limitedAdmin = AdminUser::create([
            'name' => 'Limited Admin',
            'email' => 'limited@example.com',
            'password' => Hash::make('password'),
            'role' => 'Event Manager',
            'permissions' => ['manage_faq'],
        ]);

        $this->actingAs($limitedAdmin, 'admin');

        $this->get(route('admin.community-directory.index'))->assertForbidden();
    }
}
