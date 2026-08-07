<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tournament_result_revisions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tournament_id')
                ->constrained('campus_tournaments')
                ->restrictOnDelete();
            $table->unsignedInteger('version');
            $table->foreignId('submitted_by_user_id')
                ->constrained('users')
                ->restrictOnDelete();
            $table->text('reason')->nullable();
            $table->timestamp('submitted_at');
            $table->timestamps();

            $table->unique(['tournament_id', 'version']);
            $table->index(
                ['submitted_by_user_id', 'submitted_at'],
                'result_revisions_submitter_submitted_index'
            );
        });

        Schema::create('tournament_result_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('result_revision_id')
                ->constrained('tournament_result_revisions')
                ->restrictOnDelete();
            $table->foreignId('team_id')
                ->constrained('tournament_teams')
                ->restrictOnDelete();
            $table->string('placement_code', 20);
            $table->string('team_name_snapshot');
            $table->json('roster_snapshot');
            $table->timestamps();

            $table->foreign('placement_code')
                ->references('code')
                ->on('tournament_placements')
                ->restrictOnDelete();
            $table->unique(['result_revision_id', 'team_id']);
            $table->index(
                ['result_revision_id', 'placement_code'],
                'result_entries_revision_placement_index'
            );
        });

        Schema::table('campus_tournaments', function (Blueprint $table) {
            $table->foreignId('current_result_revision_id')
                ->nullable()
                ->after('roster_locked_at')
                ->constrained('tournament_result_revisions')
                ->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('campus_tournaments', function (Blueprint $table) {
            $table->dropConstrainedForeignId('current_result_revision_id');
        });

        Schema::dropIfExists('tournament_result_entries');
        Schema::dropIfExists('tournament_result_revisions');
    }
};
