<?php

use App\Http\Controllers\Admin\AdminPermissionController;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admin_roles', function (Blueprint $table): void {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->json('permissions')->nullable();
            $table->boolean('is_system')->default(false);
            $table->timestamps();
        });

        // Seed initial default roles
        $allPermissions = collect(AdminPermissionController::availablePermissions())->pluck('id')->all();

        $defaultRoles = [
            [
                'name' => 'Super Admin',
                'slug' => 'super_admin',
                'description' => 'Unconditional full-access root administrator. Bypasses all permission checks.',
                'permissions' => json_encode($allPermissions),
                'is_system' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Admin',
                'slug' => 'admin',
                'description' => 'Standard administrator. Configure operational and verification permissions in the matrix.',
                'permissions' => json_encode([]),
                'is_system' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Content Manager',
                'slug' => 'content_manager',
                'description' => 'Manages portal news articles, homepage hero carousel banners, FAQs, and content media.',
                'permissions' => json_encode([]),
                'is_system' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Tournament Manager',
                'slug' => 'tournament_manager',
                'description' => 'Oversees MCC seasons, collegiate tournaments, event calendars, and photo galleries.',
                'permissions' => json_encode([]),
                'is_system' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Regional Admin',
                'slug' => 'regional_admin',
                'description' => 'Coordinates campus student leaders and institutional affiliations across island regions.',
                'permissions' => json_encode([]),
                'is_system' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Event Manager',
                'slug' => 'event_manager',
                'description' => 'Coordinates calendar scheduling, campus activities, and tournament photo albums.',
                'permissions' => json_encode([]),
                'is_system' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('admin_roles')->insert($defaultRoles);
    }

    public function down(): void
    {
        Schema::dropIfExists('admin_roles');
    }
};
