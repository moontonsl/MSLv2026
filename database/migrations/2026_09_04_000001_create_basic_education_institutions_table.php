<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('basic_education_institutions', function (Blueprint $table) {
            $table->id();
            $table->string('region', 50);
            $table->string('division', 100);
            $table->string('district', 100);
            $table->string('beis_school_id', 30)->unique();
            $table->string('school_name', 255);
            $table->string('street_address', 255);
            $table->string('municipality', 100);
            $table->string('legislative_district', 100);
            $table->string('barangay', 100)->nullable();
            $table->string('sector', 30);
            $table->string('settlement_type', 50);
            $table->string('school_subclassification', 100);
            $table->string('modified_cultural_offering_classification', 50);
            $table->string('masterlist_page', 30);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('basic_education_institutions');
    }
};
