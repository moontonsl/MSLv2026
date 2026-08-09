<?php

namespace Database\Factories;

use App\Models\Island;
use App\Models\Region;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Region> */
class RegionFactory extends Factory
{
    protected $model = Region::class;

    public function definition(): array
    {
        $number = fake()->unique()->numberBetween(100, 9999);

        return [
            'code' => 'REG-'.$number,
            'name' => 'Region '.$number,
            'region_number' => (string) $number,
            'acronym' => 'R'.$number,
            'island_code' => Island::factory(),
        ];
    }
}
