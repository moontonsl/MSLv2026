<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('users')) {
            DB::table('users')
                ->where('user_type', 'Super Admin')
                ->update(['user_type' => 'Core Admin']);
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('users')) {
            DB::table('users')
                ->where('user_type', 'Core Admin')
                ->update(['user_type' => 'Super Admin']);
        }
    }
};
