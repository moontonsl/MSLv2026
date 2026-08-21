<?php

namespace Database\Factories;

use App\Models\Island;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Island> */
class IslandFactory extends Factory
{
    protected $model = Island::class;

    public function definition(): array
    {
        return [
            'code' => fake()->unique()->bothify('ISL-####'),
            'name' => fake()->unique()->words(2, true),
        ];
    }
}
