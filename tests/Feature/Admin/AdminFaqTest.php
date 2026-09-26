<?php

namespace Tests\Feature\Admin;

use App\Models\AdminUser;
use App\Models\Faq;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminFaqTest extends TestCase
{
    use RefreshDatabase;

    private function signInSuperAdmin(): AdminUser
    {
        $admin = AdminUser::create([
            'name' => 'FAQ Admin',
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => 'Super Admin',
        ]);

        $this->actingAs($admin, 'admin');

        return $admin;
    }

    public function test_admin_can_view_faqs_from_the_database(): void
    {
        $this->signInSuperAdmin();
        $faq = Faq::create([
            'category' => 'Account',
            'question' => 'How do I renew my account?',
            'answer' => 'Submit the required renewal information from your student portal.',
        ]);

        $this->get(route('admin.faq'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Faq')
                ->has('faqs', 1)
                ->where('faqs.0.id', $faq->id));
    }

    public function test_super_admin_can_create_update_and_delete_a_faq(): void
    {
        $this->signInSuperAdmin();

        $this->post(route('admin.faq.store'), [
            'category' => 'Tournament',
            'question' => 'Where can I join?',
            'answer' => 'Use the tournament page in the student portal.',
        ])->assertRedirect();

        $faq = Faq::query()->firstOrFail();

        $this->put(route('admin.faq.update', $faq), [
            'category' => 'Tournament',
            'question' => 'Where can I register?',
            'answer' => 'Use the tournament registration page.',
        ])->assertRedirect();

        $this->assertDatabaseHas('faqs', [
            'id' => $faq->id,
            'question' => 'Where can I register?',
        ]);

        $this->delete(route('admin.faq.delete', $faq))
            ->assertRedirect();

        $this->assertDatabaseMissing('faqs', ['id' => $faq->id]);
    }

    public function test_admin_without_faq_permission_cannot_manage_faqs(): void
    {
        $admin = AdminUser::create([
            'name' => 'Limited Admin',
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => 'Admin',
        ]);
        $this->actingAs($admin, 'admin');

        $this->get(route('admin.faq'))->assertForbidden();
    }
}
