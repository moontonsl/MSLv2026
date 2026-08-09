<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tournament_types', function (Blueprint $table) {
            $table->string('code', 20)->primary();
            $table->string('name', 50)->unique();
            $table->unsignedTinyInteger('sort_order')->unique();
            $table->timestamps();
        });

        Schema::create('lane_roles', function (Blueprint $table) {
            $table->string('code', 20)->primary();
            $table->string('name', 50)->unique();
            $table->unsignedTinyInteger('sort_order')->unique();
            $table->timestamps();
        });

        Schema::create('tournament_placements', function (Blueprint $table) {
            $table->string('code', 20)->primary();
            $table->string('name', 50)->unique();
            $table->unsignedTinyInteger('sort_order')->unique();
            $table->timestamps();
        });

        Schema::create('region_admins', function (Blueprint $table) {
            $table->string('region_code')->primary();
            $table->foreignId('user_id')
                ->constrained()
                ->restrictOnDelete();
            $table->foreignId('assigned_by_user_id')
                ->nullable()
                ->constrained('users')
                ->restrictOnDelete();
            $table->timestamp('assigned_at');
            $table->timestamps();

            $table->foreign('region_code')
                ->references('code')
                ->on('regions')
                ->restrictOnDelete();
            $table->index('user_id');
        });

        Schema::create('region_admin_assignment_history', function (Blueprint $table) {
            $table->id();
            $table->string('region_code');
            $table->foreignId('user_id')
                ->constrained()
                ->restrictOnDelete();
            $table->foreignId('assigned_by_user_id')
                ->nullable()
                ->constrained('users')
                ->restrictOnDelete();
            $table->timestamp('started_at');
            $table->timestamp('ended_at')->nullable();
            $table->timestamps();

            $table->foreign('region_code')
                ->references('code')
                ->on('regions')
                ->restrictOnDelete();
            $table->index(['region_code', 'started_at']);
            $table->index(['user_id', 'started_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('region_admin_assignment_history');
        Schema::dropIfExists('region_admins');
        Schema::dropIfExists('tournament_placements');
        Schema::dropIfExists('lane_roles');
        Schema::dropIfExists('tournament_types');
    }
};
