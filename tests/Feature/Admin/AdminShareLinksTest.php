<?php

namespace Tests\Feature\Admin;

use App\Models\AdminUser;
use App\Models\ShortLink;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminShareLinksTest extends TestCase
{
    use RefreshDatabase;

    private function signInSuperAdmin(): AdminUser
    {
        $admin = AdminUser::create([
            'name' => 'Share Link Admin',
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => 'Super Admin',
        ]);

        $this->actingAs($admin, 'admin');

        return $admin;
    }

    public function test_admin_can_view_share_links_with_public_short_urls(): void
    {
        $this->signInSuperAdmin();
        $link = ShortLink::create([
            'code' => 'campus',
            'original_url' => 'https://example.com/campus',
            'clicks' => 4,
        ]);

        $this->get(route('admin.share-links.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/ShareLinks/Index')
                ->has('shortLinks', 1)
                ->where('shortLinks.0.code', 'campus')
                ->where('shortLinks.0.clicks', 4)
                ->where('shortLinks.0.short_url', route('short-link.redirect', $link->code)));
    }

    public function test_super_admin_can_create_update_and_delete_share_links(): void
    {
        $this->signInSuperAdmin();

        $this->post(route('admin.share-links.store'), [
            'code' => 'summer-event',
            'original_url' => 'example.com/summer-event',
        ])->assertRedirect();

        $link = ShortLink::query()->firstOrFail();
        $this->assertSame('https://example.com/summer-event', $link->original_url);

        $this->put(route('admin.share-links.update', $link), [
            'code' => 'updated-event',
            'original_url' => 'https://example.com/updated-event',
        ])->assertRedirect();

        $link->refresh();
        $this->assertSame('updated-event', $link->code);
        $this->assertSame('https://example.com/updated-event', $link->original_url);

        $this->delete(route('admin.share-links.destroy', $link))->assertRedirect();
        $this->assertDatabaseMissing('short_links', ['id' => $link->id]);
    }

    public function test_share_links_reject_invalid_destinations_and_duplicate_codes(): void
    {
        $this->signInSuperAdmin();
        ShortLink::create(['code' => 'existing', 'original_url' => 'https://example.com']);

        $this->post(route('admin.share-links.store'), [
            'code' => 'new-code',
            'original_url' => 'not a destination',
        ])->assertSessionHasErrors(['original_url']);

        $this->post(route('admin.share-links.store'), [
            'code' => 'existing',
            'original_url' => 'https://example.com/valid',
        ])->assertSessionHasErrors(['code']);
    }

    public function test_public_short_link_redirects_and_increments_clicks(): void
    {
        $link = ShortLink::create([
            'code' => 'join-now',
            'original_url' => 'https://example.com/join',
            'clicks' => 2,
        ]);

        $this->get(route('short-link.redirect', $link->code))
            ->assertRedirect('https://example.com/join');

        $this->assertDatabaseHas('short_links', ['id' => $link->id, 'clicks' => 3]);
    }

    public function test_admin_without_share_link_permission_cannot_manage_share_links(): void
    {
        $admin = AdminUser::create([
            'name' => 'Limited Admin',
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => 'Admin',
        ]);
        $this->actingAs($admin, 'admin');

        $this->get(route('admin.share-links.index'))->assertForbidden();
        $this->post(route('admin.share-links.store'), [])->assertForbidden();
    }
}
