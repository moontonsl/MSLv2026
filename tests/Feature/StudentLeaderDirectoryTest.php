<?php

namespace Tests\Feature;

use App\Models\Campus;
use App\Models\CampusAffiliation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class StudentLeaderDirectoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_and_non_leader_cannot_view_student_directory(): void
    {
        $this->get(route('student.leader'))->assertRedirect(route('login'));

        $this->actingAs(User::factory()->create(['status' => 'active']))
            ->get(route('student.leader'))
            ->assertForbidden();
    }

    public function test_leader_sees_real_profile_and_only_current_members_of_their_campuses(): void
    {
        $campus = Campus::factory()->create(['name' => 'Host Campus']);
        $otherCampus = Campus::factory()->create(['name' => 'Other Campus']);
        $leader = User::factory()->create([
            'name' => 'Real Student Leader',
            'username' => 'real_leader',
            'status' => 'active',
            'course' => 'Computer Science',
        ]);
        $visible = User::factory()->create([
            'name' => 'Visible Member',
            'username' => 'visible_member',
            'status' => 'active',
            'year_level' => '3rd Year',
        ]);
        $student = User::factory()->create([
            'name' => 'Visible Student',
            'username' => 'visible_student',
            'status' => 'active',
        ]);
        $other = User::factory()->create(['name' => 'Other Campus Member']);
        $expired = User::factory()->create(['name' => 'Expired Member']);

        $this->affiliate($leader, $campus, 'student_leader');
        $this->affiliate($visible, $campus, 'member');
        $this->affiliate($student, $campus, 'student');
        $this->affiliate($other, $otherCampus, 'member');
        $this->affiliate($expired, $campus, 'member', now()->subDay());

        $this->actingAs($leader)->get(route('student.leader'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('VerificationPages/StudentLeader')
                ->where('profile.name', 'Real Student Leader')
                ->where('profile.username', '@real_leader')
                ->where('profile.campus', 'Host Campus')
                ->has('students', 2)
                ->where('students.0.name', 'Visible Member')
                ->where('students.0.account', 'visible_member')
                ->where('students.0.yearLevel', '3rd Year')
                ->where('students.1.name', 'Visible Student')
                ->where('students.1.account', 'visible_student')
                ->etc());
    }

    public function test_expired_or_inactive_student_leader_affiliation_denies_access(): void
    {
        $leader = User::factory()->create(['status' => 'active']);
        $this->affiliate($leader, Campus::factory()->create(), 'student_leader', now()->subDay());

        $this->actingAs($leader)->get(route('student.leader'))->assertForbidden();
    }

    private function affiliate(User $user, Campus $campus, string $role, $endedAt = null): void
    {
        CampusAffiliation::query()->create([
            'campus_id' => $campus->id,
            'user_id' => $user->id,
            'role' => $role,
            'status' => 'active',
            'started_at' => now()->subMonth(),
            'ended_at' => $endedAt,
        ]);
    }
}
