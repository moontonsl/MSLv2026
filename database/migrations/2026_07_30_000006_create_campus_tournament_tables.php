<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('campus_tournaments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campus_id')
                ->constrained()
                ->restrictOnDelete();
            $table->foreignId('created_by_user_id')
                ->constrained('users')
                ->restrictOnDelete();
            $table->string('name');
            $table->string('tournament_type_code', 20);
            $table->enum('approval_status', [
                'pending',
                'approved',
                'rejected',
                'cancelled',
            ])->default('pending');
            $table->timestamp('registration_opens_at');
            $table->timestamp('registration_closes_at');
            $table->timestamp('starts_at');
            $table->timestamp('ends_at');
            $table->timestamp('roster_locked_at')->nullable();
            $table->foreignId('cancelled_by_user_id')
                ->nullable()
                ->constrained('users')
                ->restrictOnDelete();
            $table->text('cancellation_reason')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamps();

            $table->foreign('tournament_type_code')
                ->references('code')
                ->on('tournament_types')
                ->restrictOnDelete();
            $table->index(['campus_id', 'approval_status']);
            $table->index(['approval_status', 'registration_closes_at']);
            $table->index(['approval_status', 'starts_at', 'ends_at']);
        });

        Schema::create('campus_tournament_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tournament_id')
                ->constrained('campus_tournaments')
                ->restrictOnDelete();
            $table->foreignId('reviewer_user_id')
                ->constrained('users')
                ->restrictOnDelete();
            $table->enum('decision', ['approved', 'rejected']);
            $table->text('reason')->nullable();
            $table->timestamps();

            $table->index(
                ['tournament_id', 'created_at'],
                'tournament_reviews_tournament_created_index'
            );
            $table->index(['reviewer_user_id', 'created_at']);
        });

        Schema::create('campus_tournament_schedule_revisions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tournament_id')
                ->constrained('campus_tournaments')
                ->restrictOnDelete();
            $table->foreignId('changed_by_user_id')
                ->constrained('users')
                ->restrictOnDelete();
            $table->timestamp('previous_registration_opens_at');
            $table->timestamp('previous_registration_closes_at');
            $table->timestamp('previous_starts_at');
            $table->timestamp('previous_ends_at');
            $table->timestamp('new_registration_opens_at');
            $table->timestamp('new_registration_closes_at');
            $table->timestamp('new_starts_at');
            $table->timestamp('new_ends_at');
            $table->text('reason');
            $table->timestamps();

            $table->index(
                ['tournament_id', 'created_at'],
                'tournament_schedule_revisions_tournament_created_index'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campus_tournament_schedule_revisions');
        Schema::dropIfExists('campus_tournament_reviews');
        Schema::dropIfExists('campus_tournaments');
    }
};
