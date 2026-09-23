<?php

namespace Tests\Feature\Admin;

use App\Models\AdminUser;
use App\Models\Carousel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminCarouselTest extends TestCase
{
    use RefreshDatabase;

    private function signInSuperAdmin(): AdminUser
    {
        $admin = AdminUser::create([
            'name' => 'Carousel Admin',
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => 'Super Admin',
        ]);

        $this->actingAs($admin, 'admin');

        return $admin;
    }

    public function test_admin_can_view_ordered_carousel_items(): void
    {
        $this->signInSuperAdmin();
        $first = Carousel::create(['title' => 'First slide', 'image_path' => 'first.jpg', 'order' => 0]);
        Carousel::create(['title' => 'Second slide', 'image_path' => 'second.jpg', 'order' => 1]);

        $this->get(route('admin.carousel'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Carousel')
                ->has('carousels', 2)
                ->where('carousels.0.id', $first->id)
                ->where('carousels.0.title', 'First slide'));
    }

    public function test_super_admin_can_create_carousel_with_image(): void
    {
        Storage::fake('public');
        $this->signInSuperAdmin();

        $this->post(route('admin.carousel.store'), [
            'title' => 'Homepage hero',
            'image' => UploadedFile::fake()->image('hero.jpg'),
            'is_active' => true,
        ])->assertRedirect();

        $carousel = Carousel::query()->firstOrFail();
        $this->assertDatabaseHas('carousels', [
            'id' => $carousel->id,
            'title' => 'Homepage hero',
            'order' => 0,
        ]);
        Storage::disk('public')->assertExists('carousel/' . $carousel->image_path);
    }

    public function test_super_admin_can_update_toggle_delete_and_reorder_carousel_items(): void
    {
        Storage::fake('public');
        $this->signInSuperAdmin();
        Storage::disk('public')->put('carousel/old.jpg', 'old image');
        $first = Carousel::create(['title' => 'First', 'image_path' => 'old.jpg', 'order' => 0, 'is_active' => true]);
        $second = Carousel::create(['title' => 'Second', 'image_path' => 'second.jpg', 'order' => 1, 'is_active' => true]);

        $this->put(route('admin.carousel.update', $first), [
            'title' => 'Updated first',
            'is_active' => false,
        ])->assertRedirect();

        $this->assertDatabaseHas('carousels', [
            'id' => $first->id,
            'title' => 'Updated first',
            'is_active' => false,
        ]);

        $this->post(route('admin.carousel.reorder'), [
            'carousels' => [
                ['id' => $second->id, 'order' => 0],
                ['id' => $first->id, 'order' => 1],
            ],
        ])->assertRedirect();

        $this->assertDatabaseHas('carousels', ['id' => $second->id, 'order' => 0]);
        $this->assertDatabaseHas('carousels', ['id' => $first->id, 'order' => 1]);

        $this->delete(route('admin.carousel.delete', $first))
            ->assertRedirect();
        $this->assertDatabaseMissing('carousels', ['id' => $first->id]);
        Storage::disk('public')->assertMissing('carousel/old.jpg');
    }

    public function test_admin_without_carousel_permission_cannot_manage_carousel(): void
    {
        $admin = AdminUser::create([
            'name' => 'Limited Admin',
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => 'Admin',
        ]);
        $this->actingAs($admin, 'admin');

        $this->get(route('admin.carousel'))->assertForbidden();
    }
}
