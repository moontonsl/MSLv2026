<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('mcc_seasons')) {
            Schema::create('mcc_seasons', function (Blueprint $table): void {
                $table->id();
                $table->unsignedInteger('season_number')->unique();
                $table->string('season_name');
                $table->boolean('is_active')->default(false);
                $table->date('start_date')->nullable();
                $table->date('end_date')->nullable();
                $table->string('route_slug')->unique();
                $table->text('description')->nullable();
                $table->timestamps();
                $table->softDeletes();
            });
        }

        if (!Schema::hasTable('mcc_season_content')) {
            Schema::create('mcc_season_content', function (Blueprint $table): void {
                $table->id();
                $table->foreignId('season_id')->constrained('mcc_seasons')->cascadeOnDelete();
                $table->string('content_type');
                $table->string('content_key');
                $table->json('content_value');
                $table->integer('display_order')->default(0);
                $table->timestamps();
                $table->index(['season_id', 'content_type']);
            });
        }

        if (!Schema::hasTable('oppo_roadshow_schools')) {
            Schema::create('oppo_roadshow_schools', function (Blueprint $table): void {
                $table->id();
                // Legacy MSL-1 points to `schools`; MSLv2026 has institution/reference tables instead.
                $table->unsignedBigInteger('school_id');
                $table->timestamps();
                $table->unique('school_id');
            });
        }

        if (!Schema::hasTable('oppo_roadshow_dates')) {
            Schema::create('oppo_roadshow_dates', function (Blueprint $table): void {
                $table->id();
                $table->string('event_date');
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('oppo_roadshow_dates');
        Schema::dropIfExists('oppo_roadshow_schools');
        Schema::dropIfExists('mcc_season_content');
        Schema::dropIfExists('mcc_seasons');
    }
};
