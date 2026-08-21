<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TournamentReferenceSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        DB::table('tournament_types')->upsert([
            ['code' => 'online', 'name' => 'Online', 'sort_order' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['code' => 'onsite', 'name' => 'Onsite', 'sort_order' => 2, 'created_at' => $now, 'updated_at' => $now],
        ], ['code'], ['name', 'sort_order', 'updated_at']);

        DB::table('lane_roles')->upsert([
            ['code' => 'jungler', 'name' => 'Jungler', 'sort_order' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['code' => 'roam', 'name' => 'Roam', 'sort_order' => 2, 'created_at' => $now, 'updated_at' => $now],
            ['code' => 'gold_laner', 'name' => 'Gold Laner', 'sort_order' => 3, 'created_at' => $now, 'updated_at' => $now],
            ['code' => 'exp_laner', 'name' => 'EXP Laner', 'sort_order' => 4, 'created_at' => $now, 'updated_at' => $now],
            ['code' => 'mid_laner', 'name' => 'Mid Laner', 'sort_order' => 5, 'created_at' => $now, 'updated_at' => $now],
        ], ['code'], ['name', 'sort_order', 'updated_at']);

        DB::table('tournament_placements')->upsert([
            ['code' => '1st', 'name' => '1st Place', 'sort_order' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['code' => '2nd', 'name' => '2nd Place', 'sort_order' => 2, 'created_at' => $now, 'updated_at' => $now],
            ['code' => '3rd', 'name' => '3rd Place', 'sort_order' => 3, 'created_at' => $now, 'updated_at' => $now],
            ['code' => '4th', 'name' => '4th Place', 'sort_order' => 4, 'created_at' => $now, 'updated_at' => $now],
            ['code' => 'participant', 'name' => 'Participant', 'sort_order' => 5, 'created_at' => $now, 'updated_at' => $now],
        ], ['code'], ['name', 'sort_order', 'updated_at']);
    }
}
