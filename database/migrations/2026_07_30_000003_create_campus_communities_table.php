<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('campus_communities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campus_id')
                ->unique()
                ->constrained()
                ->restrictOnDelete();
            $table->string('name');
            $table->string('acronym', 50)->nullable();
            $table->foreignId('community_tier_id')
                ->constrained()
                ->restrictOnDelete();
            $table->string('status', 20)->default('pending')->index();
            $table->timestamp('accredited_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campus_communities');
    }
};
