<?php

namespace Tests\Feature\Admin;

use App\Models\AdminUser;
use App\Models\Event;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminEventCalendarTest extends TestCase
{
    use RefreshDatabase;

    private function signInSuperAdmin(): AdminUser
    {
        $admin = AdminUser::create([
            'name' => 'Event Admin',
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => 'Super Admin',
        ]);

        $this->actingAs($admin, 'admin');

        return $admin;
    }

    public function test_admin_can_view_searchable_event_calendar(): void
    {
        $this->signInSuperAdmin();
        $event = Event::create([
            'title' => 'Regional Summit',
            'description' => 'Annual gathering',
            'start_date' => now()->addDays(3),
            'end_date' => now()->addDays(3)->addHours(4),
            'location' => 'Marbel Convention Center',
        ]);
        Event::create([
            'title' => 'Other event',
            'start_date' => now()->addDays(5),
            'end_date' => now()->addDays(5)->addHours(2),
        ]);

        $this->get(route('admin.events', ['search' => 'Summit', 'filter' => 'upcoming']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Events')
                ->where('filters.search', 'Summit')
                ->where('filters.filter', 'upcoming')
                ->where('events.total', 1)
                ->where('events.data.0.id', $event->id)
                ->where('events.data.0.title', 'Regional Summit'));
    }

    public function test_super_admin_can_create_event_with_admin_creator(): void
    {
        $admin = $this->signInSuperAdmin();

        $this->post(route('admin.events.store'), [
            'title' => 'Campus Tournament Finals',
            'description' => 'Finals day schedule',
            'start_date' => '2026-10-10T09:00',
            'end_date' => '2026-10-10T18:00',
            'location' => 'NDMU Gymnasium',
        ])->assertRedirect(route('admin.events'));

        $this->assertDatabaseHas('events', [
            'title' => 'Campus Tournament Finals',
            'location' => 'NDMU Gymnasium',
            'created_by' => $admin->id,
        ]);
    }

    public function test_event_end_date_must_be_after_start_date(): void
    {
        $this->signInSuperAdmin();

        $this->from(route('admin.events'))->post(route('admin.events.store'), [
            'title' => 'Invalid schedule',
            'start_date' => '2026-10-10T18:00',
            'end_date' => '2026-10-10T09:00',
        ])->assertSessionHasErrors('end_date');

        $this->assertDatabaseMissing('events', ['title' => 'Invalid schedule']);
    }

    public function test_super_admin_can_update_and_soft_delete_event(): void
    {
        $this->signInSuperAdmin();
        $event = Event::create([
            'title' => 'Draft event',
            'start_date' => now()->addDay(),
            'end_date' => now()->addDay()->addHours(2),
            'location' => 'Old location',
        ]);

        $this->put(route('admin.events.update', $event), [
            'title' => 'Updated event',
            'description' => 'Updated details',
            'start_date' => '2026-11-01T10:00',
            'end_date' => '2026-11-01T12:00',
            'location' => 'New location',
        ])->assertRedirect(route('admin.events'));

        $this->assertDatabaseHas('events', ['id' => $event->id, 'title' => 'Updated event', 'location' => 'New location']);

        $this->delete(route('admin.events.delete', $event))->assertRedirect();
        $this->assertSoftDeleted('events', ['id' => $event->id]);
    }

    public function test_admin_without_event_permission_cannot_manage_event_calendar(): void
    {
        $admin = AdminUser::create([
            'name' => 'Limited Admin',
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => 'Admin',
        ]);
        $this->actingAs($admin, 'admin');

        $this->get(route('admin.events'))->assertForbidden();
    }
}
