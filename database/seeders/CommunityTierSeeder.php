<?php

namespace Database\Seeders;

use App\Models\CommunityTier;
use Illuminate\Database\Seeder;

class CommunityTierSeeder extends Seeder
{
    public function run(): void
    {
        $tiers = [
            ['name' => 'Tier C', 'code' => 'tier_c', 'rank' => 1],
            ['name' => 'Tier B', 'code' => 'tier_b', 'rank' => 2],
            ['name' => 'Tier A', 'code' => 'tier_a', 'rank' => 3],
            ['name' => 'Super School', 'code' => 'super_school', 'rank' => 4],
        ];

        foreach ($tiers as $tier) {
            CommunityTier::updateOrCreate(
                ['code' => $tier['code']],
                $tier
            );
        }
    }
}
