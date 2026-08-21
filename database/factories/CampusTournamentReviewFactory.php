<?php

namespace Database\Factories;

use App\Enums\CampusTournamentReviewDecision;
use App\Models\CampusTournamentReview;
use App\Models\CampusTournamentSubmission;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<CampusTournamentReview> */
class CampusTournamentReviewFactory extends Factory
{
    protected $model = CampusTournamentReview::class;

    public function definition(): array
    {
        return [
            'submission_id' => CampusTournamentSubmission::factory(),
            'tournament_id' => fn (array $attributes) => CampusTournamentSubmission::query()
                ->findOrFail($attributes['submission_id'])->tournament_id,
            'reviewer_user_id' => User::factory(),
            'decision' => CampusTournamentReviewDecision::Approved,
            'reason' => null,
        ];
    }
}
