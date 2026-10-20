<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $supportsForeignKeyRollback = Schema::getConnection()->getDriverName() !== 'sqlite';

        Schema::table('tournament_result_revisions', function (Blueprint $table) use ($supportsForeignKeyRollback): void {
            $table->foreignId('submitted_by_user_id')->nullable()->change();
            $table->unsignedBigInteger('submitted_by_admin_user_id')
                ->nullable()
                ->after('submitted_by_user_id');
            $table->index('submitted_by_admin_user_id', 'trr_admin_submitter_idx');

            // SQLite cannot drop this new foreign key on rollback. MySQL enforces it.
            if ($supportsForeignKeyRollback) {
                $table->foreign('submitted_by_admin_user_id', 'trr_admin_submitter_fk')
                    ->references('id')
                    ->on('admin_users')
                    ->restrictOnDelete();
            }
        });
    }

    public function down(): void
    {
        if (DB::table('tournament_result_revisions')->whereNotNull('submitted_by_admin_user_id')->exists()) {
            throw new RuntimeException('Cannot roll back while admin-authored result revisions exist.');
        }

        if (Schema::getConnection()->getDriverName() !== 'sqlite') {
            Schema::table('tournament_result_revisions', function (Blueprint $table): void {
                $table->dropForeign('trr_admin_submitter_fk');
            });
        }

        Schema::table('tournament_result_revisions', function (Blueprint $table): void {
            $table->dropIndex('trr_admin_submitter_idx');
            $table->dropColumn('submitted_by_admin_user_id');
            $table->foreignId('submitted_by_user_id')->nullable(false)->change();
        });
    }
};
