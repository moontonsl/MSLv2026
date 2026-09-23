<?php

namespace Tests\Feature\Admin;

use App\Models\AdminUser;
use App\Models\News;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminNewsUpdatesTest extends TestCase
{
    use RefreshDatabase;

    private function signInSuperAdmin(): AdminUser
    {
        $admin = AdminUser::create([
            'name' => 'News Admin',
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => 'Super Admin',
        ]);

        $this->actingAs($admin, 'admin');

        return $admin;
    }

    public function test_admin_can_view_news_from_the_legacy_news_table(): void
    {
        $this->signInSuperAdmin();
        $news = News::create([
            'news_canonical' => 'campus-news',
            'news_state' => 'Announcements',
            'news_title' => 'Campus tournament opens',
            'news_subtitle' => 'Registration is now available.',
            'news_published' => now(),
            'news_writer' => 'MSL Team',
            'news_content' => 'Full announcement content.',
        ]);

        $this->get(route('admin.news-updates'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/NewsUpdates')
                ->has('newsItems', 1)
                ->where('newsItems.0.id', $news->id)
                ->where('newsItems.0.title', 'Campus tournament opens'));
    }

    public function test_super_admin_can_create_news_with_featured_image(): void
    {
        Storage::fake('public');
        $this->signInSuperAdmin();

        $this->post(route('admin.news-modern.store'), [
            'category' => 'Events',
            'title' => 'New campus event',
            'authorName' => 'MSL Team',
            'publishedDate' => '2026-09-16',
            'shortDescription' => 'Event details.',
            'articleContent' => 'Full event details.',
            'featuredImages' => [UploadedFile::fake()->image('event.jpg')],
        ])->assertRedirect();

        $news = News::query()->firstOrFail();

        $this->assertDatabaseHas('msl_news_data', [
            'id' => $news->id,
            'news_title' => 'New campus event',
            'news_img1' => $news->news_img1,
        ]);
        Storage::disk('public')->assertExists('news/' . $news->news_img1);
    }

    public function test_super_admin_can_update_and_delete_news(): void
    {
        Storage::fake('public');
        $this->signInSuperAdmin();
        Storage::disk('public')->put('news/old.jpg', 'old image');
        $news = News::create([
            'news_canonical' => 'old-title',
            'news_state' => 'Community',
            'news_title' => 'Old title',
            'news_img1' => 'old.jpg',
        ]);

        $this->put(route('admin.news-modern.update', $news), [
            'category' => 'Community',
            'title' => 'Updated title',
            'authorName' => 'Editor',
            'shortDescription' => 'Updated summary.',
            'articleContent' => 'Updated content.',
            'existingImages' => [],
            'featuredImages' => [],
        ])->assertRedirect();

        $this->assertDatabaseHas('msl_news_data', [
            'id' => $news->id,
            'news_title' => 'Updated title',
            'news_img1' => null,
        ]);
        Storage::disk('public')->assertMissing('news/old.jpg');

        $this->delete(route('admin.news-modern.delete', $news))
            ->assertRedirect();

        $this->assertDatabaseMissing('msl_news_data', ['id' => $news->id]);
    }

    public function test_admin_without_news_permission_cannot_manage_news_updates(): void
    {
        $admin = AdminUser::create([
            'name' => 'Limited Admin',
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => 'Admin',
        ]);
        $this->actingAs($admin, 'admin');

        $this->get(route('admin.news-updates'))->assertForbidden();
    }
}
