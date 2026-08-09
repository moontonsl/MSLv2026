<?php

namespace Tests\Feature;

use App\Models\Campus;
use App\Models\CampusAffiliation;
use App\Models\RegionAdmin;
use App\Models\User;
use Database\Seeders\CampusTournamentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class CampusTournamentSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_an_idempotent_lspu_tournament_fixture(): void
    {
        $this->seed(CampusTournamentSeeder::class);
        $this->seed(CampusTournamentSeeder::class);

        $campus = Campus::query()
            ->where('name', 'Los Baños Campus')
            ->whereHas('institution', fn ($query) => $query->where('name', 'Laguna State Polytechnic University'))
            ->firstOrFail();
        $regionalAdmin = User::query()->where('username', 'lspu_regional_admin')->firstOrFail();
        $studentLeader = User::query()->where('username', 'lspu_student_leader')->firstOrFail();

        $this->assertSame('043411000', $campus->city_code);
        $this->assertSame('043411010', $campus->barangay_code);
        $this->assertSame('active', $campus->status);
        $this->assertTrue(Hash::check('password', $regionalAdmin->password));
        $this->assertTrue(Hash::check('password', $studentLeader->password));

        $this->assertDatabaseHas('region_admins', [
            'region_code' => '040000000',
            'user_id' => $regionalAdmin->id,
        ]);
        $this->assertSame(1, DB::table('region_admin_assignment_history')
            ->where('region_code', '040000000')
            ->where('user_id', $regionalAdmin->id)
            ->whereNull('ended_at')
            ->count());

        $this->assertDatabaseHas('campus_affiliations', [
            'campus_id' => $campus->id,
            'user_id' => $studentLeader->id,
            'role' => 'student_leader',
            'status' => 'active',
            'approved_by_user_id' => $regionalAdmin->id,
        ]);

        $this->assertSame(1, CampusAffiliation::query()
            ->where('campus_id', $campus->id)
            ->where('user_id', $studentLeader->id)
            ->count());
        $this->assertSame($regionalAdmin->id, RegionAdmin::query()->findOrFail('040000000')->user_id);
        $this->assertDatabaseCount('campus_tournaments', 0);
    }
}
