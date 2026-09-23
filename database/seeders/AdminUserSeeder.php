<?php

namespace Database\Seeders;

use App\Models\AdminUser;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('ADMIN_EMAIL');
        $password = env('ADMIN_PASSWORD');

        if (!$email || !$password) {
            return;
        }

        AdminUser::updateOrCreate(
            ['email' => strtolower($email)],
            [
                'name' => env('ADMIN_NAME', 'MSL Super Admin'),
                'password' => Hash::make($password),
                'role' => env('ADMIN_ROLE', 'Super Admin'),
                'permissions' => [],
                'email_verified_at' => now(),
            ],
        );
    }
}
