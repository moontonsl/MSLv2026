<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            // Actions
            [
                'name' => 'Approve Students',
                'slug' => 'approve_students',
                'type' => 'action',
                'description' => 'Allows approving student registrations'
            ],
            [
                'name' => 'Reject Students',
                'slug' => 'reject_students',
                'type' => 'action',
                'description' => 'Allows rejecting student registrations'
            ],
            [
                'name' => 'Block Students',
                'slug' => 'block_students',
                'type' => 'action',
                'description' => 'Allows blocking/blacklisting student accounts'
            ],
            [
                'name' => 'Promote Students',
                'slug' => 'promote_students',
                'type' => 'action',
                'description' => 'Allows promoting a verified student to Student Leader'
            ],
            [
                'name' => 'Verify Students',
                'slug' => 'verify_students',
                'type' => 'action',
                'description' => 'Allows verifying student details and identity documents'
            ],
            [
                'name' => 'Renew Students',
                'slug' => 'renew_students',
                'type' => 'action',
                'description' => 'Allows reviewing and approving student renewal requests'
            ],
            // Pages
            [
                'name' => 'Access Admin Dashboard',
                'slug' => 'access_admin_dashboard',
                'type' => 'page',
                'description' => 'Allows viewing the main student list admin dashboard'
            ],
            [
                'name' => 'Access Admin Management',
                'slug' => 'access_admin_management',
                'type' => 'page',
                'description' => 'Allows viewing and managing other admin user permissions'
            ],
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(
                ['slug' => $permission['slug']],
                $permission
            );
        }
    }
}
