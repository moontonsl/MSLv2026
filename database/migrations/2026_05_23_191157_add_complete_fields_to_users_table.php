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
            // ML related fields
            if (!Schema::hasColumn('users', 'ml_id')) {
                $table->string('ml_id')->nullable();
            }
            if (!Schema::hasColumn('users', 'ml_server')) {
                $table->string('ml_server')->nullable();
            }
            if (!Schema::hasColumn('users', 'ml_ign')) {
                $table->string('ml_ign')->nullable();
            }
            if (!Schema::hasColumn('users', 'ml_avatar')) {
                $table->string('ml_avatar')->nullable();
            }
            if (!Schema::hasColumn('users', 'ml_level')) {
                $table->integer('ml_level')->nullable();
            }
            if (!Schema::hasColumn('users', 'ml_rank_level')) {
                $table->integer('ml_rank_level')->nullable();
            }
            if (!Schema::hasColumn('users', 'is_mlbb_verified')) {
                $table->boolean('is_mlbb_verified')->default(false);
            }
            if (!Schema::hasColumn('users', 'status')) {
                $table->string('status')->default('active');
            }

            // Personal details
            if (!Schema::hasColumn('users', 'username')) {
                $table->string('username')->nullable();
            }
            if (!Schema::hasColumn('users', 'first_name')) {
                $table->string('first_name')->nullable();
            }
            if (!Schema::hasColumn('users', 'surname')) {
                $table->string('surname')->nullable();
            }
            if (!Schema::hasColumn('users', 'suffix')) {
                $table->string('suffix')->nullable();
            }
            if (!Schema::hasColumn('users', 'birthday')) {
                $table->date('birthday')->nullable();
            }
            if (!Schema::hasColumn('users', 'age')) {
                $table->integer('age')->nullable();
            }
            if (!Schema::hasColumn('users', 'gender')) {
                $table->string('gender')->nullable();
            }
            if (!Schema::hasColumn('users', 'contact_number')) {
                $table->string('contact_number')->nullable();
            }
            if (!Schema::hasColumn('users', 'facebook_link')) {
                $table->string('facebook_link')->nullable();
            }

            // Academic details
            if (!Schema::hasColumn('users', 'course')) {
                $table->string('course')->nullable();
            }
            if (!Schema::hasColumn('users', 'university')) {
                $table->string('university')->nullable();
            }
            if (!Schema::hasColumn('users', 'year_level')) {
                $table->string('year_level')->nullable();
            }
            if (!Schema::hasColumn('users', 'studentId')) {
                $table->string('studentId')->nullable();
            }
            if (!Schema::hasColumn('users', 'proofOfEnrollment')) {
                $table->string('proofOfEnrollment')->nullable();
            }

            // Location details
            if (!Schema::hasColumn('users', 'region')) {
                $table->string('region')->nullable();
            }
            if (!Schema::hasColumn('users', 'island')) {
                $table->string('island')->nullable();
            }

            // Squad details
            if (!Schema::hasColumn('users', 'squadAbbreviation')) {
                $table->string('squadAbbreviation')->nullable();
            }
            if (!Schema::hasColumn('users', 'squadName')) {
                $table->string('squadName')->nullable();
            }
            if (!Schema::hasColumn('users', 'inGameRole')) {
                $table->string('inGameRole')->nullable();
            }
            if (!Schema::hasColumn('users', 'mainHero')) {
                $table->string('mainHero')->nullable();
            }

            // User type
            if (!Schema::hasColumn('users', 'user_type')) {
                $table->string('user_type')->nullable();
            }
        });

        // Ensure unique constraints exist
        Schema::table('users', function (Blueprint $table) {
            $table->unique('ml_id');
            $table->unique('username');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['ml_id']);
            $table->dropUnique(['username']);
            $table->dropColumn([
                'ml_id', 'ml_server', 'ml_ign', 'ml_avatar', 'ml_level', 'ml_rank_level', 'is_mlbb_verified', 'status',
                'username', 'first_name', 'surname', 'suffix', 'birthday', 'age', 'gender', 'contact_number', 'facebook_link',
                'course', 'university', 'year_level', 'studentId', 'proofOfEnrollment',
                'region', 'island',
                'squadAbbreviation', 'squadName', 'inGameRole', 'mainHero',
                'user_type'
            ]);
        });
    }
};
