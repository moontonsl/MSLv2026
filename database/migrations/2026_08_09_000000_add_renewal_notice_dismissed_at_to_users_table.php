<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->timestamp('renewal_notice_dismissed_at')->nullable()->after('renewal_approved_at');
        });

        DB::table('users')
            ->whereNotNull('renewal_approved_at')
            ->update(['renewal_notice_dismissed_at' => DB::raw('renewal_approved_at')]);
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('renewal_notice_dismissed_at');
        });
    }
};
