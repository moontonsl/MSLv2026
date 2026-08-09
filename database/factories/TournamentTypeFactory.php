<?php

namespace Database\Factories;

use App\Models\TournamentType;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<TournamentType> */
class TournamentTypeFactory extends Factory
{
    protected $model = TournamentType::class;

    public function definition(): array
    {
        $order = fake()->unique()->numberBetween(10, 250);

        return [
            'code' => 'type-'.$order,
            'name' => 'Tournament Type '.$order,
            'sort_order' => $order,
        ];
    }
}
