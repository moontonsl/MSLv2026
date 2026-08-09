<?php

namespace Database\Factories;

use App\Models\CampusTournament;
use App\Models\CampusTournamentSubmission;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<CampusTournamentSubmission> */
class CampusTournamentSubmissionFactory extends Factory
{
    protected $model = CampusTournamentSubmission::class;

    public function definition(): array
    {
        return [
            'tournament_id' => CampusTournament::factory(),
            'submitted_by_user_id' => fn (array $attributes) => CampusTournament::query()
                ->findOrFail($attributes['tournament_id'])->created_by_user_id,
            'version' => 1,
            'campus_id' => fn (array $attributes) => CampusTournament::query()
                ->findOrFail($attributes['tournament_id'])->campus_id,
            'name' => fn (array $attributes) => CampusTournament::query()
                ->findOrFail($attributes['tournament_id'])->name,
            'tournament_type_code' => fn (array $attributes) => CampusTournament::query()
                ->findOrFail($attributes['tournament_id'])->tournament_type_code,
            'registration_opens_at' => fn (array $attributes) => CampusTournament::query()
                ->findOrFail($attributes['tournament_id'])->registration_opens_at,
            'registration_closes_at' => fn (array $attributes) => CampusTournament::query()
                ->findOrFail($attributes['tournament_id'])->registration_closes_at,
            'starts_at' => fn (array $attributes) => CampusTournament::query()
                ->findOrFail($attributes['tournament_id'])->starts_at,
            'ends_at' => fn (array $attributes) => CampusTournament::query()
                ->findOrFail($attributes['tournament_id'])->ends_at,
            'submitted_at' => now(),
        ];
    }
}
