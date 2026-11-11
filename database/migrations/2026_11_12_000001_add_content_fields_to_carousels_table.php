<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('carousels', function (Blueprint $table): void {
            if (!Schema::hasColumn('carousels', 'label')) {
                $table->string('label')->nullable()->after('title');
            }
            if (!Schema::hasColumn('carousels', 'subtitle')) {
                $table->text('subtitle')->nullable()->after('label');
            }
            if (!Schema::hasColumn('carousels', 'link')) {
                $table->string('link')->nullable()->after('subtitle');
            }
            if (!Schema::hasColumn('carousels', 'start_date')) {
                $table->date('start_date')->nullable()->after('link');
            }
            if (!Schema::hasColumn('carousels', 'end_date')) {
                $table->date('end_date')->nullable()->after('start_date');
            }
        });
    }

    public function down(): void
    {
        Schema::table('carousels', function (Blueprint $table): void {
            $columns = array_filter(['label', 'subtitle', 'link', 'start_date', 'end_date'], fn ($col) => Schema::hasColumn('carousels', $col));
            if (!empty($columns)) {
                $table->dropColumn($columns);
            }
        });
    }
};
