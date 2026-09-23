<?php

namespace Tests\Feature\Admin;

use App\Models\AdminUser;
use App\Models\MCCSeason;
use App\Models\MCCSeasonContent;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminMccSeasonsTest extends TestCase
{
    use RefreshDatabase;

    private function signInSuperAdmin(): AdminUser
    {
        $admin = AdminUser::create([
            'name' => 'MCC Admin',
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => 'Super Admin',
        ]);

        $this->actingAs($admin, 'admin');

        return $admin;
    }

    public function test_admin_can_view_searchable_mcc_seasons_with_content_count(): void
    {
        $this->signInSuperAdmin();
        $season = MCCSeason::create([
            'season_number' => 4,
            'season_name' => 'Pamantasang Lakas Season 4',
            'route_slug' => 'S4',
            'is_active' => true,
        ]);
        MCCSeasonContent::create([
            'season_id' => $season->id,
            'content_type' => 'text_content',
            'content_key' => 'intro',
            'content_value' => 'Welcome',
        ]);

        $this->get(route('admin.mcc-seasons.index', ['search' => 'Season 4', 'status' => 'active']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/MCCSeasons')
                ->where('filters.search', 'Season 4')
                ->where('filters.status', 'active')
                ->where('seasons.total', 1)
                ->where('seasons.data.0.id', $season->id)
                ->where('seasons.data.0.content_count', 1));
    }

    public function test_super_admin_can_create_active_season_and_deactivate_previous_one(): void
    {
        $this->signInSuperAdmin();
        $previous = MCCSeason::create(['season_number' => 1, 'season_name' => 'Season 1', 'route_slug' => 'S1', 'is_active' => true]);

        $this->post(route('admin.mcc-seasons.store'), [
            'season_number' => 2,
            'season_name' => 'Season 2',
            'route_slug' => 'S2',
            'start_date' => '2026-01-01',
            'end_date' => '2026-02-01',
            'description' => 'Second season',
            'is_active' => true,
        ])->assertRedirect();

        $this->assertDatabaseHas('mcc_seasons', ['season_number' => 2, 'is_active' => 1]);
        $this->assertDatabaseHas('mcc_seasons', ['id' => $previous->id, 'is_active' => 0]);
    }

    public function test_season_dates_must_be_in_order_and_metadata_can_be_updated(): void
    {
        $this->signInSuperAdmin();
        $season = MCCSeason::create(['season_number' => 3, 'season_name' => 'Season 3', 'route_slug' => 'S3']);

        $this->from(route('admin.mcc-seasons.index'))->put(route('admin.mcc-seasons.update', $season), [
            'season_number' => 3,
            'season_name' => 'Updated Season',
            'route_slug' => 'S3-updated',
            'start_date' => '2026-03-10',
            'end_date' => '2026-03-01',
        ])->assertSessionHasErrors('end_date');

        $this->put(route('admin.mcc-seasons.update', $season), [
            'season_number' => 3,
            'season_name' => 'Updated Season',
            'route_slug' => 'S3-updated',
            'start_date' => '2026-03-01',
            'end_date' => '2026-03-10',
            'is_active' => false,
        ])->assertRedirect(route('admin.mcc-seasons.index'));

        $this->assertDatabaseHas('mcc_seasons', ['id' => $season->id, 'season_name' => 'Updated Season', 'route_slug' => 'S3-updated']);
    }

    public function test_super_admin_can_manage_season_content_images_and_delete_inactive_season(): void
    {
        Storage::fake('public');
        $this->signInSuperAdmin();
        $season = MCCSeason::create(['season_number' => 5, 'season_name' => 'Season 5', 'route_slug' => 'S5', 'is_active' => false]);

        $this->post(route('admin.mcc-seasons.upload-image'), [
            'season_id' => $season->id,
            'content_type' => 'hero_images',
            'content_key' => 'hero_left',
            'image' => UploadedFile::fake()->image('hero.jpg'),
        ])->assertOk()->assertJsonPath('success', true);

        $content = MCCSeasonContent::where('season_id', $season->id)->firstOrFail();
        $path = $content->content_value['path'];
        Storage::disk('public')->assertExists($path);

        $this->post(route('admin.mcc-seasons.update-content', $season->id), [
            'content_type' => 'text_content',
            'content_key' => 'intro',
            'content_value' => 'Welcome to season five',
            'display_order' => 1,
        ])->assertOk()->assertJsonPath('content.content_key', 'intro');

        $this->delete(route('admin.mcc-seasons.delete-content', [$season->id, $content->id]))->assertOk();
        Storage::disk('public')->assertMissing($path);
        $this->assertDatabaseMissing('mcc_season_content', ['id' => $content->id]);

        $this->delete(route('admin.mcc-seasons.destroy', $season))->assertRedirect();
        $this->assertSoftDeleted('mcc_seasons', ['id' => $season->id]);
    }

    public function test_active_season_cannot_be_deleted_and_limited_admin_cannot_manage_seasons(): void
    {
        $this->signInSuperAdmin();
        $season = MCCSeason::create(['season_number' => 6, 'season_name' => 'Season 6', 'route_slug' => 'S6', 'is_active' => true]);
        $this->delete(route('admin.mcc-seasons.destroy', $season))->assertRedirect()->assertSessionHas('error');
        $this->assertDatabaseHas('mcc_seasons', ['id' => $season->id, 'deleted_at' => null]);

        $admin = AdminUser::create(['name' => 'Limited Admin', 'email' => fake()->unique()->safeEmail(), 'password' => Hash::make('password'), 'role' => 'Admin']);
        $this->actingAs($admin, 'admin');
        $this->get(route('admin.mcc-seasons.index'))->assertForbidden();
    }
}
