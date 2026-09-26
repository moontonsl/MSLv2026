<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $add = function (string $column, callable $definition): void {
            if (!Schema::hasColumn('users', $column)) {
                Schema::table('users', $definition);
            }
        };

        $add('username', fn (Blueprint $table) => $table->string('username')->nullable()->unique());
        $add('first_name', fn (Blueprint $table) => $table->string('first_name')->nullable());
        $add('ml_id', fn (Blueprint $table) => $table->string('ml_id')->nullable());
        $add('ml_server', fn (Blueprint $table) => $table->string('ml_server')->nullable());
        $add('ml_ign', fn (Blueprint $table) => $table->string('ml_ign')->nullable());
        $add('ml_avatar', fn (Blueprint $table) => $table->string('ml_avatar')->nullable());
        $add('ml_level', fn (Blueprint $table) => $table->unsignedInteger('ml_level')->nullable());
        $add('ml_rank', fn (Blueprint $table) => $table->string('ml_rank')->nullable());
        $add('ml_rank_level', fn (Blueprint $table) => $table->string('ml_rank_level')->nullable());
        $add('is_mlbb_verified', fn (Blueprint $table) => $table->boolean('is_mlbb_verified')->default(false));
        $add('status', fn (Blueprint $table) => $table->string('status')->nullable());
        $add('surname', fn (Blueprint $table) => $table->string('surname')->nullable());
        $add('suffix', fn (Blueprint $table) => $table->string('suffix')->nullable());
        $add('birthday', fn (Blueprint $table) => $table->date('birthday')->nullable());
        $add('age', fn (Blueprint $table) => $table->unsignedTinyInteger('age')->nullable());
        $add('gender', fn (Blueprint $table) => $table->string('gender')->nullable());
        $add('contact_number', fn (Blueprint $table) => $table->string('contact_number')->nullable());
        $add('facebook_link', fn (Blueprint $table) => $table->string('facebook_link')->nullable());
        $add('course', fn (Blueprint $table) => $table->string('course')->nullable());
        $add('university', fn (Blueprint $table) => $table->string('university')->nullable());
        $add('year_level', fn (Blueprint $table) => $table->string('year_level')->nullable());
        $add('studentId', fn (Blueprint $table) => $table->string('studentId')->nullable());
        $add('proofOfEnrollment', fn (Blueprint $table) => $table->string('proofOfEnrollment')->nullable());
        $add('region', fn (Blueprint $table) => $table->string('region')->nullable());
        $add('island', fn (Blueprint $table) => $table->string('island')->nullable());
        $add('squadAbbreviation', fn (Blueprint $table) => $table->string('squadAbbreviation')->nullable());
        $add('squadName', fn (Blueprint $table) => $table->string('squadName')->nullable());
        $add('inGameRole', fn (Blueprint $table) => $table->string('inGameRole')->nullable());
        $add('mainHero', fn (Blueprint $table) => $table->string('mainHero')->nullable());
        $add('user_type', fn (Blueprint $table) => $table->string('user_type')->nullable());
        $add('division', fn (Blueprint $table) => $table->string('division')->nullable());
        $add('renewal_requested_at', fn (Blueprint $table) => $table->timestamp('renewal_requested_at')->nullable());
        $add('renewal_submitted_at', fn (Blueprint $table) => $table->timestamp('renewal_submitted_at')->nullable());
        $add('renewal_approved_at', fn (Blueprint $table) => $table->timestamp('renewal_approved_at')->nullable());
        $add('rejection_checklist', fn (Blueprint $table) => $table->json('rejection_checklist')->nullable());
        $add('rejection_reason', fn (Blueprint $table) => $table->text('rejection_reason')->nullable());
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropUnique(['username']);
            $table->dropColumn([
                'username', 'first_name', 'ml_id', 'ml_server', 'ml_ign', 'ml_avatar',
                'ml_level', 'ml_rank', 'ml_rank_level', 'is_mlbb_verified', 'status',
                'surname', 'suffix', 'birthday', 'age', 'gender', 'contact_number',
                'facebook_link', 'course', 'university', 'year_level', 'studentId',
                'proofOfEnrollment', 'region', 'island', 'squadAbbreviation', 'squadName',
                'inGameRole', 'mainHero', 'user_type', 'division', 'renewal_requested_at',
                'renewal_submitted_at', 'renewal_approved_at',
                'rejection_checklist', 'rejection_reason',
            ]);
        });
    }
};
