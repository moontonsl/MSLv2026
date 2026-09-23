<?php

namespace Tests\Feature\Admin;

use App\Models\AdminUser;
use App\Models\MslEvent;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminMslEventsTest extends TestCase
{
    use RefreshDatabase;

    private function signInSuperAdmin(): AdminUser
    {
        $admin = AdminUser::create([
            'name' => 'MSL Event Admin',
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => 'Super Admin',
        ]);

        $this->actingAs($admin, 'admin');

        return $admin;
    }

    public function test_admin_can_view_searchable_filtered_msl_events(): void
    {
        $this->signInSuperAdmin();
        $event = MslEvent::create([
            'event_name' => 'Campus Tournament',
            'event_title' => 'Season Finals',
            'event_subtitle' => 'The grand finals',
            'event_canonical' => '/SeasonFinals',
            'event_state' => 'Active',
            'is_featured' => true,
        ]);
        MslEvent::create([
            'event_name' => 'Other event',
            'event_title' => 'Other card',
            'event_canonical' => 'other-card',
            'event_state' => 'Inactive',
        ]);

        $this->get(route('admin.msl-events.index', ['search' => 'Finals', 'state' => 'Active', 'featured' => 1]))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/MslEvents')
                ->where('filters.search', 'Finals')
                ->where('filters.state', 'Active')
                ->where('filters.featured', true)
                ->where('events.total', 1)
                ->where('events.data.0.id', $event->id)
                ->where('events.data.0.event_canonical', '/SeasonFinals'));
    }

    public function test_super_admin_can_create_msl_event_with_logo_and_gallery_image(): void
    {
        Storage::fake('public');
        $this->signInSuperAdmin();

        $this->post(route('admin.msl-events.store'), [
            'event_name' => 'MCC Season 4',
            'event_title' => 'MCC Season 4 Finals',
            'event_subtitle' => 'Watch the best campus teams compete.',
            'event_canonical' => '/MCCSeason4',
            'event_state' => 'Active',
            'is_featured' => true,
            'redirect_url' => 'https://example.com/mcc-season-4',
            'event_content01' => 'Content block one',
            'event_logo' => UploadedFile::fake()->image('logo.jpg'),
            'event_img01' => UploadedFile::fake()->image('gallery-1.jpg'),
        ])->assertRedirect(route('admin.msl-events.index'));

        $event = MslEvent::query()->firstOrFail();
        $this->assertDatabaseHas('msl_events_data', [
            'id' => $event->id,
            'event_name' => 'MCC Season 4',
            'event_canonical' => '/MCCSeason4',
            'is_featured' => 1,
        ]);
        Storage::disk('public')->assertExists('events/' . $event->getRawOriginal('event_logo'));
        Storage::disk('public')->assertExists('events/' . $event->getRawOriginal('event_img01'));
    }

    public function test_super_admin_can_update_status_and_cleanup_msl_event_images(): void
    {
        Storage::fake('public');
        $this->signInSuperAdmin();
        Storage::disk('public')->put('events/old-logo.jpg', 'old logo');
        $event = MslEvent::create([
            'event_name' => 'Old event',
            'event_title' => 'Old title',
            'event_canonical' => 'old-event',
            'event_state' => 'Active',
            'event_logo' => 'old-logo.jpg',
        ]);

        $this->post(route('admin.msl-events.update', $event), [
            '_method' => 'PUT',
            'event_name' => 'Updated event',
            'event_title' => 'Updated title',
            'event_canonical' => 'updated-event',
            'event_state' => 'Inactive',
            'event_logo' => UploadedFile::fake()->image('new-logo.jpg'),
        ])->assertRedirect(route('admin.msl-events.index'));

        $event->refresh();
        $newLogo = $event->getRawOriginal('event_logo');
        $this->assertDatabaseHas('msl_events_data', ['id' => $event->id, 'event_title' => 'Updated title', 'event_state' => 'Inactive']);
        Storage::disk('public')->assertMissing('events/old-logo.jpg');
        Storage::disk('public')->assertExists('events/' . $newLogo);

        $this->put(route('admin.msl-events.update-status', $event), ['event_state' => 'Active'])->assertRedirect();
        $this->assertDatabaseHas('msl_events_data', ['id' => $event->id, 'event_state' => 'Active']);

        $this->delete(route('admin.msl-events.destroy', $event))->assertRedirect();
        $this->assertDatabaseMissing('msl_events_data', ['id' => $event->id]);
        Storage::disk('public')->assertMissing('events/' . $newLogo);
    }

    public function test_msl_event_requires_valid_state_and_redirect_url(): void
    {
        $this->signInSuperAdmin();

        $this->from(route('admin.msl-events.index'))->post(route('admin.msl-events.store'), [
            'event_name' => 'Invalid event',
            'event_title' => 'Invalid event',
            'event_state' => 'Draft',
            'redirect_url' => 'not-a-url',
        ])->assertSessionHasErrors(['event_state', 'redirect_url']);

        $this->assertDatabaseMissing('msl_events_data', ['event_name' => 'Invalid event']);
    }

    public function test_admin_without_msl_event_permission_cannot_manage_msl_events(): void
    {
        $admin = AdminUser::create([
            'name' => 'Limited Admin',
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => 'Admin',
        ]);
        $this->actingAs($admin, 'admin');

        $this->get(route('admin.msl-events.index'))->assertForbidden();
    }
}
