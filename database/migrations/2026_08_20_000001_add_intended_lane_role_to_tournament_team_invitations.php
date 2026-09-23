<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tournament_team_invitations', function (Blueprint $table) {
            $table->string('intended_lane_role_code', 20)
                ->nullable()
                ->after('invited_by_user_id');

            $table->foreign('intended_lane_role_code')
                ->references('code')
                ->on('lane_roles')
                ->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('tournament_team_invitations', function (Blueprint $table) {
            $isSqlite = DB::connection()->getDriverName() === 'sqlite';

            if ($isSqlite) {
                $table->dropForeign(['intended_lane_role_code']);
            } else {
                $table->dropForeign(['intended_lane_role_code']);
            }

            $table->dropColumn('intended_lane_role_code');
        });
    }
};
