<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('basic_education_institutions', function (Blueprint $table) {
            $table->index('school_name', 'bei_school_name_idx');
        });
    }

    public function down(): void
    {
        Schema::table('basic_education_institutions', function (Blueprint $table) {
            $table->dropIndex('bei_school_name_idx');
        });
    }
};
