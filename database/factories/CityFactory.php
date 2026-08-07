<?php

namespace Database\Factories;

use App\Models\City;
use App\Models\Region;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<City> */
class CityFactory extends Factory
{
    protected $model = City::class;

    public function definition(): array
    {
        return [
            'code' => fake()->unique()->bothify('CITY-######'),
            'name' => fake()->city(),
            'region_code' => Region::factory(),
        ];
    }
}
