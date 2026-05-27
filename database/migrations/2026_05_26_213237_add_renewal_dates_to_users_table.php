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
        Schema::table('users', function (Blueprint $table) {
            $table->timestamp('renewal_requested_at')->nullable();
            $table->timestamp('renewal_submitted_at')->nullable();
            $table->timestamp('renewal_approved_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'renewal_requested_at',
                'renewal_submitted_at',
                'renewal_approved_at',
            ]);
        });
    }
};
