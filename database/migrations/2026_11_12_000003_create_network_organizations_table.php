<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('network_organizations')) {
            Schema::create('network_organizations', function (Blueprint $table): void {
                $table->id();
                $table->string('name')->default('Organization');
                $table->string('logo_path');
                $table->string('link')->nullable();
                $table->integer('order')->default(0);
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });

            // Seed initial 5 organizations
            $initialLogos = [
                [
                    'name' => 'Fatima Esports',
                    'logo_path' => '/Images/Home/Logo 1.png',
                    'link' => 'https://www.facebook.com',
                    'order' => 0,
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'name' => 'Alpha Esports',
                    'logo_path' => '/Images/Home/Logo 2.png',
                    'link' => 'https://www.facebook.com',
                    'order' => 1,
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'name' => 'UMESA',
                    'logo_path' => '/Images/Home/Logo 3.png',
                    'link' => 'https://www.facebook.com',
                    'order' => 2,
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'name' => 'Raptors Esports',
                    'logo_path' => '/Images/Home/Logo 4.png',
                    'link' => 'https://www.facebook.com',
                    'order' => 3,
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'name' => 'Warrior Arena',
                    'logo_path' => '/Images/Home/Logo 5.png',
                    'link' => 'https://www.facebook.com',
                    'order' => 4,
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ];

            DB::table('network_organizations')->insert($initialLogos);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('network_organizations');
    }
};
