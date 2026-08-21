<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('campus_tournament_submissions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tournament_id');
            $table->unsignedBigInteger('submitted_by_user_id');
            $table->unsignedInteger('version');
            $table->unsignedBigInteger('campus_id');
            $table->string('name');
            $table->string('tournament_type_code', 20);
            $table->timestamp('registration_opens_at');
            $table->timestamp('registration_closes_at');
            $table->timestamp('starts_at');
            $table->timestamp('ends_at');
            $table->text('resubmission_reason')->nullable();
            $table->timestamp('submitted_at');
            $table->timestamps();

            $table->unique(['tournament_id', 'version'], 'ct_submissions_tournament_version_unique');
            $table->index(['submitted_by_user_id', 'submitted_at'], 'ct_submissions_submitter_time_index');

            $table->foreign('tournament_id', 'ct_submissions_tournament_fk')
                ->references('id')->on('campus_tournaments')->restrictOnDelete();
            $table->foreign('submitted_by_user_id', 'ct_submissions_submitter_fk')
                ->references('id')->on('users')->restrictOnDelete();
            $table->foreign('campus_id', 'ct_submissions_campus_fk')
                ->references('id')->on('campuses')->restrictOnDelete();
            $table->foreign('tournament_type_code', 'ct_submissions_type_fk')
                ->references('code')->on('tournament_types')->restrictOnDelete();
        });

        Schema::table('campus_tournaments', function (Blueprint $table) {
            $table->unsignedBigInteger('current_submission_id')->nullable()->after('approval_status');
            $table->index('current_submission_id', 'ct_current_submission_index');
            $table->foreign('current_submission_id', 'ct_current_submission_fk')
                ->references('id')->on('campus_tournament_submissions')->restrictOnDelete();
        });

        Schema::table('campus_tournament_reviews', function (Blueprint $table) {
            $table->unsignedBigInteger('submission_id')->nullable()->after('tournament_id');
            $table->unique('submission_id', 'ct_reviews_submission_unique');
            $table->foreign('submission_id', 'ct_reviews_submission_fk')
                ->references('id')->on('campus_tournament_submissions')->restrictOnDelete();
        });

        $this->backfillCurrentSubmissions();
    }

    public function down(): void
    {
        $isSqlite = DB::connection()->getDriverName() === 'sqlite';

        Schema::table('campus_tournament_reviews', function (Blueprint $table) {
            if (DB::connection()->getDriverName() === 'sqlite') {
                $table->dropForeign(['submission_id']);
            } else {
                $table->dropForeign('ct_reviews_submission_fk');
            }
            $table->dropUnique('ct_reviews_submission_unique');
            $table->dropColumn('submission_id');
        });

        Schema::table('campus_tournaments', function (Blueprint $table) use ($isSqlite) {
            if ($isSqlite) {
                $table->dropForeign(['current_submission_id']);
            } else {
                $table->dropForeign('ct_current_submission_fk');
            }
            $table->dropIndex('ct_current_submission_index');
            $table->dropColumn('current_submission_id');
        });

        Schema::dropIfExists('campus_tournament_submissions');
    }

    private function backfillCurrentSubmissions(): void
    {
        DB::table('campus_tournaments')
            ->orderBy('id')
            ->each(function (object $tournament): void {
                $submissionId = DB::table('campus_tournament_submissions')->insertGetId([
                    'tournament_id' => $tournament->id,
                    'submitted_by_user_id' => $tournament->created_by_user_id,
                    'version' => 1,
                    'campus_id' => $tournament->campus_id,
                    'name' => $tournament->name,
                    'tournament_type_code' => $tournament->tournament_type_code,
                    'registration_opens_at' => $tournament->registration_opens_at,
                    'registration_closes_at' => $tournament->registration_closes_at,
                    'starts_at' => $tournament->starts_at,
                    'ends_at' => $tournament->ends_at,
                    'resubmission_reason' => null,
                    'submitted_at' => $tournament->created_at ?? now(),
                    'created_at' => $tournament->created_at ?? now(),
                    'updated_at' => $tournament->created_at ?? now(),
                ]);

                DB::table('campus_tournaments')
                    ->where('id', $tournament->id)
                    ->update(['current_submission_id' => $submissionId]);
            });
    }
};
