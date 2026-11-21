<?php

namespace Tests\Feature;

use App\Models\CampusTournament;
use App\Models\TournamentTeam;
use App\Models\User;
use Database\Seeders\CampusTournamentDeploymentTestSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use RuntimeException;
use Tests\TestCase;

class CampusTournamentDeploymentTestSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_requires_an_explicit_opt_in(): void
    {
        config()->set('campus-tournament.deployment_test_seeding.enabled', false);

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('CAMPUS_TOURNAMENT_TEST_SEEDING_ENABLED=true');

        $this->seed(CampusTournamentDeploymentTestSeeder::class);
    }

    public function test_it_creates_idempotent_deployment_test_scenarios(): void
    {
        config()->set('campus-tournament.deployment_test_seeding.enabled', true);
        config()->set('campus-tournament.deployment_test_seeding.password', 'DeploymentTest!2026');

        $this->seed(CampusTournamentDeploymentTestSeeder::class);
        $this->seed(CampusTournamentDeploymentTestSeeder::class);

        $this->assertSame(4, CampusTournament::query()
            ->where('name', 'like', '[TEST] %')
            ->count());

        $pending = CampusTournament::query()
            ->where('name', '[TEST] Pending Approval')
            ->firstOrFail();
        $registrationOpen = CampusTournament::query()
            ->where('name', '[TEST] Registration Open')
            ->firstOrFail();
        $ongoing = CampusTournament::query()
            ->where('name', '[TEST] Ongoing Operations')
            ->firstOrFail();
        $completed = CampusTournament::query()
            ->where('name', '[TEST] Completed - Report Ready')
            ->firstOrFail();

        $this->assertSame('pending', $pending->lifecycle());
        $this->assertSame('registration_open', $registrationOpen->lifecycle());
        $this->assertSame('ongoing', $ongoing->lifecycle());
        $this->assertSame('completed', $completed->lifecycle());
        $this->assertNull($completed->current_result_revision_id);
        $this->assertNotNull($completed->roster_locked_at);

        $this->assertSame(2, TournamentTeam::query()
            ->where('tournament_id', $completed->id)
            ->where('status', 'registered')
            ->count());
        $this->assertSame(10, $completed->participants()
            ->where('status', 'active')
            ->count());

        foreach ($completed->teams as $team) {
            $this->assertSame(5, $team->activeParticipants()->count());
            $this->assertSame(1, $team->activeParticipants()->where('roster_role', 'captain')->count());
            $this->assertSame(
                $team->captain_user_id,
                $team->activeParticipants()->where('roster_role', 'captain')->value('user_id'),
            );
        }

        $studentLeader = User::query()->where('username', 'lspu_student_leader')->firstOrFail();
        $this->assertTrue(Hash::check('DeploymentTest!2026', $studentLeader->password));
        $this->assertDatabaseHas('campus_affiliations', [
            'campus_id' => $ongoing->campus_id,
            'user_id' => $studentLeader->id,
            'role' => 'student_leader',
            'status' => 'active',
        ]);
    }
}
