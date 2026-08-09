<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CampusTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $timestamp = now();

        DB::table('campus_types')->upsert(
            [
                [
                    'name' => 'Private',
                    'code' => 'private',
                    'created_at' => $timestamp,
                    'updated_at' => $timestamp,
                ],
                [
                    'name' => 'SUC Main',
                    'code' => 'suc_main',
                    'created_at' => $timestamp,
                    'updated_at' => $timestamp,
                ],
                [
                    'name' => 'SUC Satellite',
                    'code' => 'suc_satellite',
                    'created_at' => $timestamp,
                    'updated_at' => $timestamp,
                ],
                [
                    'name' => 'LUC',
                    'code' => 'luc',
                    'created_at' => $timestamp,
                    'updated_at' => $timestamp,
                ],
                [
                    'name' => 'OGS',
                    'code' => 'ogs',
                    'created_at' => $timestamp,
                    'updated_at' => $timestamp,
                ],
            ],
            ['code'],
            ['name', 'updated_at']
        );
    }
}
