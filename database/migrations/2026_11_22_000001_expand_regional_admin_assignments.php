<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('region_admins_v2', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->string('region_code');
            $table->foreignId('assigned_by_user_id')->nullable()->constrained('users')->restrictOnDelete();
            $table->foreignId('assigned_by_admin_user_id')->nullable()->constrained('admin_users')->restrictOnDelete();
            $table->dateTime('assigned_at');
            $table->timestamps();

            $table->unique(['user_id', 'region_code'], 'ra_user_region_unique');
            $table->index('region_code', 'ra_region_index');
            $table->foreign('region_code', 'ra_region_fk')->references('code')->on('regions')->restrictOnDelete();
        });

        DB::table('region_admins')->orderBy('region_code')->get()->each(function (object $assignment): void {
            DB::table('region_admins_v2')->insert([
                'user_id' => $assignment->user_id,
                'region_code' => $assignment->region_code,
                'assigned_by_user_id' => $assignment->assigned_by_user_id,
                'assigned_by_admin_user_id' => null,
                'assigned_at' => $assignment->assigned_at,
                'created_at' => $assignment->created_at,
                'updated_at' => $assignment->updated_at,
            ]);
        });

        Schema::drop('region_admins');
        Schema::rename('region_admins_v2', 'region_admins');

        Schema::table('region_admin_assignment_history', function (Blueprint $table): void {
            $table->foreignId('assigned_by_admin_user_id')->nullable()->after('assigned_by_user_id');
            $table->foreignId('ended_by_admin_user_id')->nullable()->after('ended_at');
            $table->foreign('assigned_by_admin_user_id', 'ra_hist_assign_admin_fk')
                ->references('id')->on('admin_users')->restrictOnDelete();
            $table->foreign('ended_by_admin_user_id', 'ra_hist_end_admin_fk')
                ->references('id')->on('admin_users')->restrictOnDelete();
        });

        Schema::create('region_admin_campus_assignments', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('region_admin_id');
            $table->foreignId('campus_id')->unique();
            $table->foreignId('assigned_by_user_id')->nullable();
            $table->foreignId('assigned_by_admin_user_id')->nullable();
            $table->dateTime('assigned_at');
            $table->timestamps();
            $table->foreign('region_admin_id', 'ra_campus_region_admin_fk')
                ->references('id')->on('region_admins')->restrictOnDelete();
            $table->foreign('campus_id', 'ra_campus_campus_fk')
                ->references('id')->on('campuses')->restrictOnDelete();
            $table->foreign('assigned_by_user_id', 'ra_campus_assign_user_fk')
                ->references('id')->on('users')->restrictOnDelete();
            $table->foreign('assigned_by_admin_user_id', 'ra_campus_assign_admin_fk')
                ->references('id')->on('admin_users')->restrictOnDelete();
        });

        Schema::create('region_admin_campus_assignment_history', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id');
            $table->string('region_code');
            $table->foreignId('campus_id');
            $table->foreignId('assigned_by_user_id')->nullable();
            $table->foreignId('assigned_by_admin_user_id')->nullable();
            $table->dateTime('started_at');
            $table->dateTime('ended_at')->nullable();
            $table->foreignId('ended_by_admin_user_id')->nullable();
            $table->timestamps();

            $table->foreign('user_id', 'ra_campus_hist_user_fk')->references('id')->on('users')->restrictOnDelete();
            $table->foreign('region_code', 'ra_campus_hist_region_fk')->references('code')->on('regions')->restrictOnDelete();
            $table->foreign('campus_id', 'ra_campus_hist_campus_fk')->references('id')->on('campuses')->restrictOnDelete();
            $table->foreign('assigned_by_user_id', 'ra_campus_hist_assign_user_fk')->references('id')->on('users')->restrictOnDelete();
            $table->foreign('assigned_by_admin_user_id', 'ra_campus_hist_assign_admin_fk')->references('id')->on('admin_users')->restrictOnDelete();
            $table->foreign('ended_by_admin_user_id', 'ra_campus_hist_end_admin_fk')->references('id')->on('admin_users')->restrictOnDelete();
            $table->index(['campus_id', 'started_at'], 'ra_campus_history_campus_index');
            $table->index(['user_id', 'started_at'], 'ra_campus_history_user_index');
        });
    }

    public function down(): void
    {
        $duplicates = DB::table('region_admins')
            ->select('region_code')
            ->groupBy('region_code')
            ->havingRaw('COUNT(*) > 1')
            ->exists();

        if ($duplicates) {
            throw new RuntimeException('Cannot roll back while a region has multiple Regional Admin assignments.');
        }

        Schema::dropIfExists('region_admin_campus_assignment_history');
        Schema::dropIfExists('region_admin_campus_assignments');

        Schema::table('region_admin_assignment_history', function (Blueprint $table): void {
            if (DB::getDriverName() === 'sqlite') {
                $table->dropForeign(['ended_by_admin_user_id']);
                $table->dropForeign(['assigned_by_admin_user_id']);
            } else {
                $table->dropForeign('ra_hist_end_admin_fk');
                $table->dropForeign('ra_hist_assign_admin_fk');
            }
            $table->dropColumn(['ended_by_admin_user_id', 'assigned_by_admin_user_id']);
        });

        Schema::create('region_admins_legacy', function (Blueprint $table): void {
            $table->string('region_code')->primary();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->foreignId('assigned_by_user_id')->nullable()->constrained('users')->restrictOnDelete();
            $table->dateTime('assigned_at');
            $table->timestamps();
            $table->foreign('region_code')->references('code')->on('regions')->restrictOnDelete();
            $table->index('user_id');
        });

        DB::table('region_admins')->orderBy('id')->get()->each(function (object $assignment): void {
            DB::table('region_admins_legacy')->insert([
                'region_code' => $assignment->region_code,
                'user_id' => $assignment->user_id,
                'assigned_by_user_id' => $assignment->assigned_by_user_id,
                'assigned_at' => $assignment->assigned_at,
                'created_at' => $assignment->created_at,
                'updated_at' => $assignment->updated_at,
            ]);
        });

        Schema::drop('region_admins');
        Schema::rename('region_admins_legacy', 'region_admins');
    }
};
