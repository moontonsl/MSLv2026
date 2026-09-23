<?php

namespace Tests\Feature\Admin;

use App\Models\AdminNotification;
use App\Models\AdminUser;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminNotificationsTest extends TestCase
{
    use RefreshDatabase;

    private function makeAdmin(string $name, string $role = 'Admin'): AdminUser
    {
        return AdminUser::create([
            'name' => $name,
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => $role,
            'permissions' => [],
        ]);
    }

    public function test_important_successful_actions_notify_other_admins(): void
    {
        $actor = $this->makeAdmin('Super Admin', 'Super Admin');
        $recipient = $this->makeAdmin('Content Admin');
        $this->actingAs($actor, 'admin');

        $this->post(route('admin.faq.store'), [
            'category' => 'General',
            'question' => 'What is MSL?',
            'answer' => 'A student leader community.',
        ])->assertRedirect();

        $this->assertDatabaseHas('admin_notifications', [
            'admin_user_id' => $recipient->id,
            'actor_admin_id' => $actor->id,
            'type' => 'content',
        ]);
        $this->assertDatabaseMissing('admin_notifications', ['admin_user_id' => $actor->id]);
    }

    public function test_rejected_or_unmapped_actions_do_not_create_notifications(): void
    {
        $actor = $this->makeAdmin('Limited Admin');
        $this->makeAdmin('Other Admin');
        $this->actingAs($actor, 'admin');

        $this->post(route('admin.faq.store'), [])->assertForbidden();

        $this->assertDatabaseCount('admin_notifications', 0);
    }

    public function test_dashboard_promotion_action_notifies_other_admins(): void
    {
        $actor = $this->makeAdmin('Super Admin', 'Super Admin');
        $recipient = $this->makeAdmin('Operations Admin');
        $student = User::factory()->create(['user_type' => 'Student', 'status' => 'active']);
        $this->actingAs($actor, 'admin');

        $this->post(route('admin.users.promote', $student->id))->assertRedirect();

        $this->assertDatabaseHas('admin_notifications', [
            'admin_user_id' => $recipient->id,
            'actor_admin_id' => $actor->id,
            'type' => 'student',
        ]);
    }

    public function test_admin_can_view_unread_count_and_filter_notifications(): void
    {
        $admin = $this->makeAdmin('Notification Admin');
        $this->actingAs($admin, 'admin');

        AdminNotification::create([
            'admin_user_id' => $admin->id,
            'title' => 'Unread item',
            'message' => 'Unread message.',
            'type' => 'student',
        ]);
        AdminNotification::create([
            'admin_user_id' => $admin->id,
            'title' => 'Read item',
            'message' => 'Read message.',
            'type' => 'security',
            'read_at' => now(),
        ]);

        $this->get(route('admin.notifications.index', ['filter' => 'unread']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Notifications')
                ->where('unreadCount', 1)
                ->where('filter', 'unread')
                ->where('notifications.total', 1)
                ->where('notifications.data.0.title', 'Unread item'));
    }

    public function test_admin_can_mark_only_own_notifications_as_read(): void
    {
        $admin = $this->makeAdmin('Notification Admin');
        $otherAdmin = $this->makeAdmin('Other Admin');
        $own = AdminNotification::create([
            'admin_user_id' => $admin->id,
            'title' => 'Own item',
            'message' => 'Own message.',
            'type' => 'student',
        ]);
        $other = AdminNotification::create([
            'admin_user_id' => $otherAdmin->id,
            'title' => 'Other item',
            'message' => 'Other message.',
            'type' => 'student',
        ]);
        $this->actingAs($admin, 'admin');

        $this->post(route('admin.notifications.read', $other->id))->assertRedirect();
        $this->assertNull($other->refresh()->read_at);

        $this->post(route('admin.notifications.read', $own->id))->assertRedirect();
        $this->assertNotNull($own->refresh()->read_at);
    }

    public function test_admin_can_mark_all_own_notifications_as_read(): void
    {
        $admin = $this->makeAdmin('Notification Admin');
        $first = AdminNotification::create(['admin_user_id' => $admin->id, 'title' => 'First', 'message' => 'First', 'type' => 'student']);
        $second = AdminNotification::create(['admin_user_id' => $admin->id, 'title' => 'Second', 'message' => 'Second', 'type' => 'student']);
        $otherAdmin = $this->makeAdmin('Other Admin');
        $other = AdminNotification::create(['admin_user_id' => $otherAdmin->id, 'title' => 'Other', 'message' => 'Other', 'type' => 'student']);
        $this->actingAs($admin, 'admin');

        $this->post(route('admin.notifications.read-all'))->assertRedirect();

        $this->assertNotNull($first->refresh()->read_at);
        $this->assertNotNull($second->refresh()->read_at);
        $this->assertNull($other->refresh()->read_at);
    }
}
