<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('campuses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')
                ->constrained()
                ->restrictOnDelete();
            $table->foreignId('campus_type_id')
                ->constrained()
                ->restrictOnDelete();
            $table->string('name');
            $table->string('city_code');
            $table->string('barangay_code')->nullable();
            $table->string('address_line')->nullable();
            $table->string('status', 20)->default('active')->index();
            $table->timestamps();

            $table->unique(['institution_id', 'name']);
            $table->foreign('city_code')
                ->references('code')
                ->on('cities')
                ->restrictOnDelete();
            $table->foreign('barangay_code')
                ->references('code')
                ->on('barangays')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campuses');
    }
};
