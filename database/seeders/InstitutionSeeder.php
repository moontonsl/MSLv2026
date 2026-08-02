<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InstitutionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $timestamp = now();

        $institutions = [
            [
                'name' => 'National University',
                'acronym' => 'NU',
                'status' => 'active',
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ],

            // Add other verified parent institutions here.
        ];

        DB::table('institutions')->upsert(
            $institutions,
            ['name'],
            ['acronym', 'status', 'updated_at']
        );
    }
}
