<?php

namespace Database\Factories;

use App\Models\CampusType;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<CampusType> */
class CampusTypeFactory extends Factory
{
    protected $model = CampusType::class;

    public function definition(): array
    {
        $code = fake()->unique()->bothify('type-####');

        return ['name' => 'Campus Type '.$code, 'code' => $code];
    }
}
