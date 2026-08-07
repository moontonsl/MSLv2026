<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tournament_teams', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tournament_id')
                ->constrained('campus_tournaments')
                ->restrictOnDelete();
            $table->string('name');
            $table->string('active_name')->nullable();
            $table->enum('formation_method', ['premade', 'solo']);
            $table->enum('status', [
                'assembling',
                'registered',
                'merged',
                'withdrawn',
                'not_qualified',
            ])->default('assembling');
            $table->foreignId('captain_user_id')
                ->constrained('users')
                ->restrictOnDelete();
            $table->string('discord_id')->nullable();
            $table->timestamp('registered_at')->nullable();
            $table->timestamp('merged_at')->nullable();
            $table->timestamp('withdrawn_at')->nullable();
            $table->timestamps();

            $table->unique(['tournament_id', 'active_name']);
            $table->index(['tournament_id', 'formation_method', 'status']);
        });

        Schema::create('tournament_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tournament_id')
                ->constrained('campus_tournaments')
                ->restrictOnDelete();
            $table->foreignId('user_id')
                ->constrained()
                ->restrictOnDelete();
            $table->foreignId('team_id')
                ->nullable()
                ->constrained('tournament_teams')
                ->restrictOnDelete();
            $table->enum('entry_method', ['premade', 'solo']);
            $table->enum('roster_role', ['captain', 'member'])->default('member');
            $table->string('preferred_lane_role_code', 20)->nullable();
            $table->string('assigned_lane_role_code', 20)->nullable();
            $table->enum('status', [
                'pending',
                'active',
                'declined',
                'withdrawn',
                'not_qualified',
            ])->default('pending');
            $table->timestamp('registered_at');
            $table->timestamp('accepted_at')->nullable();
            $table->timestamp('withdrawn_at')->nullable();
            $table->timestamps();

            $table->foreign('preferred_lane_role_code')
                ->references('code')
                ->on('lane_roles')
                ->restrictOnDelete();
            $table->foreign('assigned_lane_role_code')
                ->references('code')
                ->on('lane_roles')
                ->restrictOnDelete();
            $table->unique(['tournament_id', 'user_id']);
            $table->unique(['team_id', 'assigned_lane_role_code']);
            $table->index(['team_id', 'status']);
            $table->index(['tournament_id', 'entry_method', 'status', 'registered_at'], 'tournament_participants_merge_pool_index');
        });

        Schema::create('tournament_team_invitations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_id')
                ->constrained('tournament_teams')
                ->restrictOnDelete();
            $table->foreignId('invited_user_id')
                ->constrained('users')
                ->restrictOnDelete();
            $table->foreignId('invited_by_user_id')
                ->constrained('users')
                ->restrictOnDelete();
            $table->enum('status', [
                'pending',
                'accepted',
                'declined',
                'cancelled',
                'expired',
            ])->default('pending');
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('responded_at')->nullable();
            $table->timestamps();

            $table->index(['team_id', 'status']);
            $table->index(['invited_user_id', 'status']);
        });

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

        Schema::create('tournament_roster_merge_runs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tournament_id')
                ->unique()
                ->constrained('campus_tournaments')
                ->restrictOnDelete();
            $table->enum('status', ['running', 'completed', 'failed']);
            $table->unsignedInteger('pooled_participant_count')->default(0);
            $table->unsignedInteger('formed_team_count')->default(0);
            $table->unsignedInteger('not_qualified_count')->default(0);
            $table->timestamp('started_at');
            $table->timestamp('completed_at')->nullable();
            $table->text('failure_message')->nullable();
            $table->timestamps();
        });

        Schema::create('tournament_roster_assignment_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('merge_run_id')
                ->constrained('tournament_roster_merge_runs')
                ->restrictOnDelete();
            $table->foreignId('participant_id')
                ->constrained('tournament_participants')
                ->restrictOnDelete();
            $table->foreignId('source_team_id')
                ->nullable()
                ->constrained('tournament_teams')
                ->restrictOnDelete();
            $table->foreignId('final_team_id')
                ->nullable()
                ->constrained('tournament_teams')
                ->restrictOnDelete();
            $table->string('preferred_lane_role_code', 20)->nullable();
            $table->string('previous_assigned_lane_role_code', 20)->nullable();
            $table->string('final_assigned_lane_role_code', 20)->nullable();
            $table->unsignedInteger('ordering_position');
            $table->enum('outcome', ['assigned', 'not_qualified']);
            $table->timestamp('assigned_at');
            $table->timestamps();

            $table->foreign(
                'preferred_lane_role_code',
                'roster_history_preferred_lane_role_foreign'
            )
                ->references('code')
                ->on('lane_roles')
                ->restrictOnDelete();
            $table->foreign(
                'previous_assigned_lane_role_code',
                'roster_history_previous_lane_role_foreign'
            )
                ->references('code')
                ->on('lane_roles')
                ->restrictOnDelete();
            $table->foreign(
                'final_assigned_lane_role_code',
                'roster_history_final_lane_role_foreign'
            )
                ->references('code')
                ->on('lane_roles')
                ->restrictOnDelete();
            $table->unique(
                ['merge_run_id', 'participant_id'],
                'roster_history_run_participant_unique'
            );
            $table->index(
                ['merge_run_id', 'ordering_position'],
                'roster_history_run_position_index'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tournament_roster_assignment_history');
        Schema::dropIfExists('tournament_roster_merge_runs');
        Schema::dropIfExists('tournament_team_join_codes');
        Schema::dropIfExists('tournament_team_invitations');
        Schema::dropIfExists('tournament_participants');
        Schema::dropIfExists('tournament_teams');
    }
};
