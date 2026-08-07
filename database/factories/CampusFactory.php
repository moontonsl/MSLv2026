<?php

namespace Database\Factories;

use App\Models\Campus;
use App\Models\CampusType;
use App\Models\City;
use App\Models\Institution;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Campus> */
class CampusFactory extends Factory
{
    protected $model = Campus::class;

    public function definition(): array
    {
        return [
            'institution_id' => Institution::factory(),
            'campus_type_id' => CampusType::factory(),
            'name' => fake()->unique()->city().' Campus',
            'city_code' => City::factory(),
            'status' => 'active',
        ];
    }
}
