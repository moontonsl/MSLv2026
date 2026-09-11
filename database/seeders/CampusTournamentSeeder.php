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
                    'email_verified_at' => now(),
                    'is_mlbb_verified' => true,
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
                    'email_verified_at' => now(),
                    'is_mlbb_verified' => true,
                ],
            );

            $coreAdmin = User::query()->updateOrCreate(
                ['username' => 'lspu_core_admin'],
                [
                    'name' => 'MSL Test Core Admin',
                    'email' => 'lspu.core.admin@example.test',
                    'password' => 'password',
                    'status' => 'active',
                    'user_type' => 'Super Admin',
                    'email_verified_at' => now(),
                    'is_mlbb_verified' => true,
                ],
            );

            $manualTestAccounts = [
                ['lspu_premade_captain', 'LSPU Premade Captain', 'PREMADECAP', true],
                ['lspu_premade_player_2', 'LSPU Premade Player 2', 'PREMADE02', true],
                ['lspu_premade_player_3', 'LSPU Premade Player 3', 'PREMADE03', true],
                ['lspu_premade_player_4', 'LSPU Premade Player 4', 'PREMADE04', true],
                ['lspu_premade_player_5', 'LSPU Premade Player 5', 'PREMADE05', true],
                ['lspu_solo_player_1', 'LSPU Solo Player 1', 'SOLO01', true],
                ['lspu_solo_player_2', 'LSPU Solo Player 2', 'SOLO02', true],
                ['lspu_solo_player_3', 'LSPU Solo Player 3', 'SOLO03', true],
                ['lspu_solo_player_4', 'LSPU Solo Player 4', 'SOLO04', true],
                ['lspu_solo_player_5', 'LSPU Solo Player 5', 'SOLO05', true],
                ['lspu_solo_player_6', 'LSPU Solo Player 6', 'SOLO06', true],
                ['lspu_unverified_player', 'LSPU Unverified Player', 'UNVERIFIED', false],
            ];

            $players = collect($manualTestAccounts)->map(function (array $account, int $index) use ($campus, $regionalAdmin): User {
                [$username, $name, $ign, $verified] = $account;
                $user = User::query()->updateOrCreate(
                    ['username' => $username],
                    [
                        'name' => $name,
                        'email' => str_replace('_', '.', $username).'@example.test',
                        'email_verified_at' => $verified ? now() : null,
                        'password' => 'password',
                        'status' => 'active',
                        'user_type' => 'Student',
                        'ml_id' => '99000'.str_pad((string) ($index + 1), 3, '0', STR_PAD_LEFT),
                        'ml_server' => '1234',
                        'ml_ign' => $ign,
                        'is_mlbb_verified' => $verified,
                    ],
                );

                $this->affiliateUser($campus, $user, $regionalAdmin, 'student');

                return $user;
            });

            $outsider = User::query()->updateOrCreate(
                ['username' => 'campus_tournament_outsider'],
                [
                    'name' => 'Campus Tournament Unaffiliated Player',
                    'email' => 'campus.tournament.outsider@example.test',
                    'email_verified_at' => now(),
                    'password' => 'password',
                    'status' => 'active',
                    'user_type' => 'Student',
                    'ml_id' => '99000999',
                    'ml_server' => '1234',
                    'ml_ign' => 'OUTSIDER',
                    'is_mlbb_verified' => true,
                ],
            );

            $this->assignRegionalAdmin($city->region_code, $regionalAdmin);
            $this->affiliateUser($campus, $studentLeader, $regionalAdmin, 'student_leader');

            $permissions = Permission::query()->pluck('id');
            $studentLeader->permissions()->sync($permissions);
            $regionalAdmin->permissions()->sync($permissions);
            $coreAdmin->permissions()->sync($permissions);

            return compact('institution', 'campus', 'regionalAdmin', 'studentLeader', 'coreAdmin', 'players', 'outsider');
        });

        $this->command?->info('Campus tournament development fixtures are ready.');
        $this->command?->table(
            ['Fixture', 'Value'],
            [
                ['Institution', $fixtures['institution']->name],
                ['Campus ID', $fixtures['campus']->id],
                ['Regional Admin', 'lspu_regional_admin / password'],
                ['Student Leader', 'lspu_student_leader / password'],
                ['Core/Super Admin', 'lspu_core_admin / password'],
                ['Premade Captain', 'lspu_premade_captain / password'],
                ['Premade Invitees', 'lspu_premade_player_2 through lspu_premade_player_5 / password'],
                ['Solo Players', 'lspu_solo_player_1 through lspu_solo_player_6 / password'],
                ['Unverified Player', 'lspu_unverified_player / password'],
                ['Unaffiliated Player', 'campus_tournament_outsider / password'],
            ],
        );
    }

    private function affiliateUser(
        Campus $campus,
        User $user,
        User $approvedBy,
        string $role,
    ): void {
        $affiliation = CampusAffiliation::query()->firstOrNew([
            'campus_id' => $campus->id,
            'user_id' => $user->id,
        ]);
        $affiliation->fill([
            'role' => $role,
            'status' => 'active',
            'ended_at' => null,
            'approved_by_user_id' => $approvedBy->id,
        ]);
        $affiliation->started_at ??= now();
        $affiliation->approved_at ??= now();
        $affiliation->save();
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
