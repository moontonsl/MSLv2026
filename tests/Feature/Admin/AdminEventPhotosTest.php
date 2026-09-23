<?php

namespace Tests\Feature\Admin;

use App\Models\AdminUser;
use App\Models\EventPhoto;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminEventPhotosTest extends TestCase
{
    use RefreshDatabase;

    private function signInSuperAdmin(): AdminUser
    {
        $admin = AdminUser::create([
            'name' => 'Event Photo Admin',
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => 'Super Admin',
        ]);

        $this->actingAs($admin, 'admin');

        return $admin;
    }

    public function test_admin_can_view_event_photos(): void
    {
        $this->signInSuperAdmin();
        $photo = EventPhoto::create([
            'event_name' => 'Leadership Camp',
            'school_name' => 'MSU',
            'picture' => 'camp.jpg',
        ]);

        $this->get(route('admin.event-photos'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/EventPhotos')
                ->has('eventPhotos', 1)
                ->where('eventPhotos.0.id', $photo->id)
                ->where('eventPhotos.0.event_name', 'Leadership Camp')
                ->where('eventPhotos.0.image_url', '/images/EventPhotos/camp.jpg'));
    }

    public function test_super_admin_can_create_event_photo_with_image(): void
    {
        Storage::fake('public');
        $this->signInSuperAdmin();

        $this->post(route('admin.event-photos.store'), [
            'event_name' => 'Regional Summit',
            'school_name' => 'Notre Dame of Marbel University',
            'picture' => UploadedFile::fake()->image('summit.jpg'),
        ])->assertRedirect();

        $photo = EventPhoto::query()->firstOrFail();
        $this->assertDatabaseHas('event_photos', [
            'id' => $photo->id,
            'event_name' => 'Regional Summit',
            'school_name' => 'Notre Dame of Marbel University',
        ]);
        Storage::disk('public')->assertExists('event-photos/' . $photo->getRawOriginal('picture'));
    }

    public function test_super_admin_can_update_and_delete_event_photo_with_file_cleanup(): void
    {
        Storage::fake('public');
        $this->signInSuperAdmin();
        Storage::disk('public')->put('event-photos/old.jpg', 'old image');
        $photo = EventPhoto::create([
            'event_name' => 'Old event',
            'school_name' => 'Old school',
            'picture' => 'old.jpg',
        ]);

        $this->post(route('admin.event-photos.update', $photo), [
            '_method' => 'PUT',
            'event_name' => 'Updated event',
            'school_name' => 'Updated school',
            'picture' => UploadedFile::fake()->image('updated.jpg'),
        ])->assertRedirect();

        $photo->refresh();
        $newPicture = $photo->getRawOriginal('picture');
        $this->assertDatabaseHas('event_photos', ['id' => $photo->id, 'event_name' => 'Updated event']);
        Storage::disk('public')->assertMissing('event-photos/old.jpg');
        Storage::disk('public')->assertExists('event-photos/' . $newPicture);

        $this->delete(route('admin.event-photos.delete', $photo))->assertRedirect();
        $this->assertDatabaseMissing('event_photos', ['id' => $photo->id]);
        Storage::disk('public')->assertMissing('event-photos/' . $newPicture);
    }

    public function test_admin_without_event_photo_permission_cannot_manage_event_photos(): void
    {
        $admin = AdminUser::create([
            'name' => 'Limited Admin',
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => 'Admin',
        ]);
        $this->actingAs($admin, 'admin');

        $this->get(route('admin.event-photos'))->assertForbidden();
    }
}
