<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::updateOrCreate(
            ['email' => 'admin@msl.ph'],
            [
                'name' => 'Super Admin',
                'username' => 'admin',
                'password' => Hash::make('admin123'),
                'user_type' => 'Super Admin',
                'status' => 'active',
                'first_name' => 'Super',
                'surname' => 'Admin',
                'is_mlbb_verified' => true,
            ]
        );

        // Assign all permissions to the Super Admin
        $permissions = \App\Models\Permission::all();
        $admin->permissions()->sync($permissions->pluck('id'));
    }
}
