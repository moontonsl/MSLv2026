<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            if (Schema::hasColumn('users', 'status')) {
                $table->string('status')->nullable()->change();
            }
            if (Schema::hasColumn('users', 'user_type')) {
                $table->string('user_type')->nullable()->change();
            }
        });
    }

    public function down(): void
    {
        // Keep the compatibility fields nullable when rolling back this normalization.
    }
};
