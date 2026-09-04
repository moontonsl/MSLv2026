<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::dropIfExists('tournament_team_join_codes');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('tournament_team_join_codes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_id')
                ->constrained('tournament_teams')
                ->restrictOnDelete();
            $table->char('code_hash', 64)->unique();
            $table->string('code_hint', 4)->nullable();
            $table->foreignId('created_by_user_id')
                ->constrained('users')
                ->restrictOnDelete();
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('revoked_at')->nullable();
            $table->timestamps();

            $table->index(['team_id', 'revoked_at', 'expires_at']);
        });
    }
};
