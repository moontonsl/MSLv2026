<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class FilipinoStudentSeeder extends Seeder
{
    public function run(): void
    {
        $students = [
            ['first_name' => 'Juan', 'surname' => 'Dela Cruz', 'username' => 'juan.delacruz', 'email' => 'juan.delacruz@example.com', 'gender' => 'male', 'course' => 'BS Information Technology', 'year_level' => 'Freshman (1st Year)', 'studentId' => 'NCR-2026-0001', 'ml_ign' => 'JUANPH', 'mainHero' => 'Tigreal'],
            ['first_name' => 'Maria', 'surname' => 'Santos', 'username' => 'maria.santos', 'email' => 'maria.santos@example.com', 'gender' => 'female', 'course' => 'BS Computer Science', 'year_level' => 'Sophomore (2nd Year)', 'studentId' => 'NCR-2026-0002', 'ml_ign' => 'MARIAH', 'mainHero' => 'Floryn'],
            ['first_name' => 'Jose', 'surname' => 'Reyes', 'username' => 'jose.reyes', 'email' => 'jose.reyes@example.com', 'gender' => 'male', 'course' => 'BS Business Administration', 'year_level' => 'Junior (3rd Year)', 'studentId' => 'NCR-2026-0003', 'ml_ign' => 'JOSEPH', 'mainHero' => 'Grock'],
            ['first_name' => 'Ana', 'surname' => 'Garcia', 'username' => 'ana.garcia', 'email' => 'ana.garcia@example.com', 'gender' => 'female', 'course' => 'BS Psychology', 'year_level' => 'Senior (4th Year)', 'studentId' => 'NCR-2026-0004', 'ml_ign' => 'ANAKWEEN', 'mainHero' => 'Rafaela'],
            ['first_name' => 'Miguel', 'surname' => 'Mendoza', 'username' => 'miguel.mendoza', 'email' => 'miguel.mendoza@example.com', 'gender' => 'male', 'course' => 'BS Civil Engineering', 'year_level' => 'Freshman (1st Year)', 'studentId' => 'NCR-2026-0005', 'ml_ign' => 'MIGZPH', 'mainHero' => 'Fredrinn'],
            ['first_name' => 'Liza', 'surname' => 'Bautista', 'username' => 'liza.bautista', 'email' => 'liza.bautista@example.com', 'gender' => 'female', 'course' => 'BS Accountancy', 'year_level' => 'Sophomore (2nd Year)', 'studentId' => 'NCR-2026-0006', 'ml_ign' => 'LIZABEE', 'mainHero' => 'Mathilda'],
            ['first_name' => 'Ramon', 'surname' => 'Navarro', 'username' => 'ramon.navarro', 'email' => 'ramon.navarro@example.com', 'gender' => 'male', 'course' => 'BS Information Systems', 'year_level' => 'Junior (3rd Year)', 'studentId' => 'NCR-2026-0007', 'ml_ign' => 'RAMBOph', 'mainHero' => 'Atlas'],
            ['first_name' => 'Cecilia', 'surname' => 'Flores', 'username' => 'cecilia.flores', 'email' => 'cecilia.flores@example.com', 'gender' => 'female', 'course' => 'BA Communication', 'year_level' => 'Senior (4th Year)', 'studentId' => 'NCR-2026-0008', 'ml_ign' => 'CECIPH', 'mainHero' => 'Vexana'],
            ['first_name' => 'Paolo', 'surname' => 'Villanueva', 'username' => 'paolo.villanueva', 'email' => 'paolo.villanueva@example.com', 'gender' => 'male', 'course' => 'BS Tourism Management', 'year_level' => 'Freshman (1st Year)', 'studentId' => 'NCR-2026-0009', 'ml_ign' => 'PAOLOPH', 'mainHero' => 'Johnson'],
            ['first_name' => 'Teresa', 'surname' => 'Aquino', 'username' => 'teresa.aquino', 'email' => 'teresa.aquino@example.com', 'gender' => 'female', 'course' => 'BS Nursing', 'year_level' => 'Junior (3rd Year)', 'studentId' => 'NCR-2026-0010', 'ml_ign' => 'TERESAPH', 'mainHero' => 'Estes'],
        ];

        foreach ($students as $index => $student) {
            $name = $student['first_name'] . ' ' . $student['surname'];

            User::updateOrCreate(
                ['username' => $student['username']],
                [
                    ...$student,
                    'name' => $name,
                    'password' => Hash::make('Student@123'),
                    'email_verified_at' => now(),
                    'status' => match ($index) {
                        7 => 'renewal-required',
                        8 => 'blocked',
                        9 => 'pending',
                        default => 'active',
                    },
                    'user_type' => 'Student',
                    'division' => 'college',
                    'university' => 'University of the Philippines Manila',
                    'contact_number' => '09' . (170000000 + $index),
                    'birthday' => now()->subYears(18 + ($index % 4))->subDays($index)->toDateString(),
                    'age' => 18 + ($index % 4),
                    'facebook_link' => 'https://www.facebook.com/' . $student['username'],
                    'region' => 'NCR',
                    'island' => 'Luzon',
                    'ml_id' => '90000000' . str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT),
                    'ml_server' => (string) (1000 + $index),
                    'ml_level' => 30 + $index,
                    'ml_rank' => 'Mythic',
                    'ml_rank_level' => 20 + $index,
                    'is_mlbb_verified' => true,
                    'ml_avatar' => (string) (($index % 8) + 1),
                    'inGameRole' => ['Tank', 'Support', 'Fighter', 'Mage'][$index % 4],
                    'squadAbbreviation' => 'MSL' . ($index + 1),
                    'squadName' => 'NCR Scholars',
                    'proofOfEnrollment' => null,
                ]
            );
        }
    }
}
