<?php

namespace Database\Seeders;

use App\Models\Campus;
use App\Models\CampusAffiliation;
use App\Models\CampusType;
use App\Models\City;
use App\Models\Institution;
use App\Models\Permission;
use App\Models\RegionAdmin;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class CampusTournamentSeeder extends Seeder
{
    public function run(): void
    {
        if (app()->environment('production')) {
            throw new RuntimeException('CampusTournamentSeeder contains development credentials and cannot run in production.');
        }

        $this->call([
            CampusTypeSeeder::class,
            PhilippineAddressSeeder::class,
            TournamentReferenceSeeder::class,
            PermissionSeeder::class,
        ]);

        $fixtures = DB::transaction(function (): array {
            $institution = Institution::query()->updateOrCreate(
                ['name' => 'Laguna State Polytechnic University'],
                ['acronym' => 'LSPU', 'status' => 'active'],
            );

            $campusType = CampusType::query()->where('code', 'suc_satellite')->firstOrFail();
            $city = City::query()->whereKey('043411000')->firstOrFail();

            $campus = Campus::query()->updateOrCreate(
                [
                    'institution_id' => $institution->id,
                    'name' => 'Los Baños Campus',
                ],
                [
                    'campus_type_id' => $campusType->id,
                    'city_code' => $city->code,
                    'barangay_code' => '043411010',
                    'address_line' => null,
                    'status' => 'active',
                ],
            );

            $regionalAdmin = User::query()->updateOrCreate(
                ['username' => 'lspu_regional_admin'],
                [
                    'name' => 'LSPU Test Regional Admin',
                    'email' => 'lspu.regional.admin@example.test',
                    'password' => 'password',
                    'status' => 'active',
                    'user_type' => 'Regional Admin',
                ],
            );

            $studentLeader = User::query()->updateOrCreate(
                ['username' => 'lspu_student_leader'],
                [
                    'name' => 'LSPU Test Student Leader',
                    'email' => 'lspu.student.leader@example.test',
                    'password' => 'password',
                    'status' => 'active',
                    'user_type' => 'Student Leader',
                ],
            );

            $this->assignRegionalAdmin($city->region_code, $regionalAdmin);

            $affiliation = CampusAffiliation::query()->firstOrNew([
                'campus_id' => $campus->id,
                'user_id' => $studentLeader->id,
            ]);
            $affiliation->fill([
                'role' => 'student_leader',
                'status' => 'active',
                'ended_at' => null,
                'approved_by_user_id' => $regionalAdmin->id,
            ]);
            $affiliation->started_at ??= now();
            $affiliation->approved_at ??= now();
            $affiliation->save();

            $permissions = Permission::query()->pluck('id');
            $studentLeader->permissions()->sync($permissions);
            $regionalAdmin->permissions()->sync($permissions);

            return compact('institution', 'campus', 'regionalAdmin', 'studentLeader');
        });

        $this->command?->info('Campus tournament development fixtures are ready.');
        $this->command?->table(
            ['Fixture', 'Value'],
            [
                ['Institution', $fixtures['institution']->name],
                ['Campus ID', $fixtures['campus']->id],
                ['Regional Admin', 'lspu_regional_admin / password'],
                ['Student Leader', 'lspu_student_leader / password'],
            ],
        );
    }

    private function assignRegionalAdmin(string $regionCode, User $regionalAdmin): void
    {
        $current = RegionAdmin::query()->find($regionCode);

        if ($current && $current->user_id !== $regionalAdmin->id) {
            DB::table('region_admin_assignment_history')
                ->where('region_code', $regionCode)
                ->whereNull('ended_at')
                ->update(['ended_at' => now(), 'updated_at' => now()]);
        }

        $assignment = RegionAdmin::query()->updateOrCreate(
            ['region_code' => $regionCode],
            [
                'user_id' => $regionalAdmin->id,
                'assigned_by_user_id' => null,
                'assigned_at' => $current?->user_id === $regionalAdmin->id
                    ? $current->assigned_at
                    : now(),
            ],
        );

        $openHistoryExists = DB::table('region_admin_assignment_history')
            ->where('region_code', $regionCode)
            ->where('user_id', $regionalAdmin->id)
            ->whereNull('ended_at')
            ->exists();

        if (! $openHistoryExists) {
            DB::table('region_admin_assignment_history')->insert([
                'region_code' => $regionCode,
                'user_id' => $regionalAdmin->id,
                'assigned_by_user_id' => null,
                'started_at' => $assignment->assigned_at,
                'ended_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
