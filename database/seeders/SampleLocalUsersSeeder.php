<?php

namespace Database\Seeders;

use App\Models\Institution;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SampleLocalUsersSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('password123');

        // 1. Regional Admin
        $ra = User::updateOrCreate(
            ['username' => 'ra.marco'],
            [
                'name' => 'Marco Valderama',
                'first_name' => 'Marco',
                'surname' => 'Valderama',
                'email' => 'ra.marco@msl.ph',
                'password' => $password,
                'email_verified_at' => now(),
                'status' => 'active',
                'user_type' => 'Regional Admin',
                'division' => 'Regional Director',
                'region' => 'NCR',
                'island' => 'Luzon',
                'university' => 'Polytechnic University of the Philippines',
                'course' => 'BS Information Technology',
                'year_level' => 'Senior (4th Year)',
                'studentId' => 'PUP-2022-0941',
                'contact_number' => '09171234567',
                'facebook_link' => 'https://facebook.com/ra.marco.msl',
                'ml_ign' => 'RA_Valderama',
                'ml_id' => '87654321',
                'ml_server' => '3001',
                'ml_rank' => 'Mythical Glory',
                'ml_rank_level' => 75,
                'is_mlbb_verified' => true,
                'inGameRole' => 'Roamer',
                'mainHero' => 'Tigreal',
                'squadName' => 'MSL NCR HQ',
                'squadAbbreviation' => 'NCR1',
            ]
        );

        // Assign sample schools to Marco Valderama (PUP, UST, DLSU)
        $sampleInstitutions = Institution::query()
            ->whereIn('acronym', ['PUP', 'UST', 'DLSU'])
            ->pluck('id')
            ->toArray();

        if (!empty($sampleInstitutions)) {
            $ra->assignedSchools()->sync($sampleInstitutions);
        }

        // Also assign schools to existing Regional Admin user #1 (Sam Belen) if exists
        $user1 = User::find(1);
        if ($user1 && $user1->user_type === 'Regional Admin' && !empty($sampleInstitutions)) {
            $user1->assignedSchools()->syncWithoutDetaching($sampleInstitutions);
        }

        // 2. Student Leader (SL)
        User::updateOrCreate(
            ['username' => 'sl.bea'],
            [
                'name' => 'Bea Alcantara',
                'first_name' => 'Bea',
                'surname' => 'Alcantara',
                'email' => 'sl.bea@msl.ph',
                'password' => $password,
                'email_verified_at' => now(),
                'status' => 'active',
                'user_type' => 'Student Leader',
                'division' => 'college',
                'region' => 'NCR',
                'island' => 'Luzon',
                'university' => 'University of Santo Tomas',
                'course' => 'BS Computer Science',
                'year_level' => 'Junior (3rd Year)',
                'studentId' => 'UST-2026-0491',
                'contact_number' => '09181234567',
                'facebook_link' => 'https://facebook.com/sl.bea.msl',
                'ml_ign' => 'Bea_Leader',
                'ml_id' => '88991122',
                'ml_server' => '3002',
                'ml_rank' => 'Mythic Honor',
                'ml_rank_level' => 32,
                'is_mlbb_verified' => true,
                'inGameRole' => 'Midlaner',
                'mainHero' => 'Pharsa',
                'squadName' => 'Tomasino Esports',
                'squadAbbreviation' => 'USTE',
            ]
        );

        // 3. Ten Regular Active Students (Users)
        $students = [
            [
                'first_name' => 'Christian',
                'surname' => 'Ramos',
                'username' => 'user.christian',
                'email' => 'christian.ramos@msl.ph',
                'university' => 'De La Salle University',
                'studentId' => 'DLSU-2026-101',
                'course' => 'BS Computer Science',
                'year_level' => 'Freshman (1st Year)',
                'ml_ign' => 'GreenArcher_X',
                'inGameRole' => 'Gold Lane',
                'mainHero' => 'Beatrix',
                'region' => 'NCR',
            ],
            [
                'first_name' => 'Alyssa',
                'surname' => 'Dizon',
                'username' => 'user.alyssa',
                'email' => 'alyssa.dizon@msl.ph',
                'university' => 'Ateneo de Manila University',
                'studentId' => 'ADMU-2026-102',
                'course' => 'BS Management Engineering',
                'year_level' => 'Sophomore (2nd Year)',
                'ml_ign' => 'BlueEagle_Fly',
                'inGameRole' => 'Mage',
                'mainHero' => 'Kagura',
                'region' => 'NCR',
            ],
            [
                'first_name' => 'Joshua',
                'surname' => 'Fernandez',
                'username' => 'user.joshua',
                'email' => 'joshua.fernandez@msl.ph',
                'university' => 'Polytechnic University of the Philippines',
                'studentId' => 'PUP-2026-103',
                'course' => 'BS Information Technology',
                'year_level' => 'Junior (3rd Year)',
                'ml_ign' => 'PUP_Slayer',
                'inGameRole' => 'Jungler',
                'mainHero' => 'Ling',
                'region' => 'NCR',
            ],
            [
                'first_name' => 'Kaye',
                'surname' => 'Gonzaga',
                'username' => 'user.kaye',
                'email' => 'kaye.gonzaga@msl.ph',
                'university' => 'University of the Philippines Diliman',
                'studentId' => 'UPD-2026-104',
                'course' => 'BS Business Administration',
                'year_level' => 'Senior (4th Year)',
                'ml_ign' => 'Maroon_Kaye',
                'inGameRole' => 'Roamer',
                'mainHero' => 'Angela',
                'region' => 'NCR',
            ],
            [
                'first_name' => 'Mark Anthony',
                'surname' => 'Cruz',
                'username' => 'user.mark',
                'email' => 'mark.cruz@msl.ph',
                'university' => 'Far Eastern University',
                'studentId' => 'FEU-2026-105',
                'course' => 'BS Tourism Management',
                'year_level' => 'Freshman (1st Year)',
                'ml_ign' => 'Tamaraw_Mark',
                'inGameRole' => 'EXP Lane',
                'mainHero' => 'Yu Zhong',
                'region' => 'NCR',
            ],
            [
                'first_name' => 'Patricia Nicole',
                'surname' => 'Santos',
                'username' => 'user.patricia',
                'email' => 'patricia.santos@msl.ph',
                'university' => 'Adamson University',
                'studentId' => 'ADU-2026-106',
                'course' => 'BS Chemical Engineering',
                'year_level' => 'Sophomore (2nd Year)',
                'ml_ign' => 'Falcon_Patty',
                'inGameRole' => 'Midlaner',
                'mainHero' => 'Lylia',
                'region' => 'NCR',
            ],
            [
                'first_name' => 'Gabriel',
                'surname' => 'Mercado',
                'username' => 'user.gabriel',
                'email' => 'gabriel.mercado@msl.ph',
                'university' => 'Mapúa University',
                'studentId' => 'MU-2026-107',
                'course' => 'BS Mechanical Engineering',
                'year_level' => 'Junior (3rd Year)',
                'ml_ign' => 'Cardinal_Gab',
                'inGameRole' => 'Jungler',
                'mainHero' => 'Hayabusa',
                'region' => 'NCR',
            ],
            [
                'first_name' => 'Danielle',
                'surname' => 'Soriano',
                'username' => 'user.danielle',
                'email' => 'danielle.soriano@msl.ph',
                'university' => 'Technological Institute of the Philippines',
                'studentId' => 'TIP-2026-108',
                'course' => 'BS Computer Engineering',
                'year_level' => 'Senior (4th Year)',
                'ml_ign' => 'TIP_Dani',
                'inGameRole' => 'Gold Lane',
                'mainHero' => 'Brody',
                'region' => 'NCR',
            ],
            [
                'first_name' => 'Kevin Kyle',
                'surname' => 'Castro',
                'username' => 'user.kevin',
                'email' => 'kevin.castro@msl.ph',
                'university' => 'National University',
                'studentId' => 'NU-2026-109',
                'course' => 'BS Architecture',
                'year_level' => 'Sophomore (2nd Year)',
                'ml_ign' => 'Bulldog_Kev',
                'inGameRole' => 'EXP Lane',
                'mainHero' => 'Lapu-Lapu',
                'region' => 'NCR',
            ],
            [
                'first_name' => 'Angelica Mae',
                'surname' => 'Torres',
                'username' => 'user.angelica',
                'email' => 'angelica.torres@msl.ph',
                'university' => 'University of the East',
                'studentId' => 'UE-2026-110',
                'course' => 'BS Accountancy',
                'year_level' => 'Freshman (1st Year)',
                'ml_ign' => 'RedWarrior_Angie',
                'inGameRole' => 'Support',
                'mainHero' => 'Floryn',
                'region' => 'NCR',
            ],
        ];

        foreach ($students as $idx => $s) {
            $name = $s['first_name'] . ' ' . $s['surname'];
            User::updateOrCreate(
                ['username' => $s['username']],
                [
                    'name' => $name,
                    'first_name' => $s['first_name'],
                    'surname' => $s['surname'],
                    'email' => $s['email'],
                    'password' => $password,
                    'email_verified_at' => now(),
                    'status' => 'active',
                    'user_type' => 'Student',
                    'division' => 'college',
                    'university' => $s['university'],
                    'studentId' => $s['studentId'],
                    'course' => $s['course'],
                    'year_level' => $s['year_level'],
                    'region' => $s['region'],
                    'island' => 'Luzon',
                    'contact_number' => '0919' . str_pad((string) (1000000 + $idx), 7, '0', STR_PAD_LEFT),
                    'facebook_link' => 'https://facebook.com/' . $s['username'],
                    'ml_ign' => $s['ml_ign'],
                    'ml_id' => (string) (70000000 + $idx),
                    'ml_server' => '3003',
                    'ml_rank' => 'Mythic',
                    'ml_rank_level' => 15 + $idx,
                    'is_mlbb_verified' => true,
                    'inGameRole' => $s['inGameRole'],
                    'mainHero' => $s['mainHero'],
                    'squadName' => 'Varsity League',
                    'squadAbbreviation' => 'VAR',
                ]
            );
        }
    }
}

