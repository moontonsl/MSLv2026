<?php

namespace Database\Factories;

use App\Enums\CampusTournamentApprovalStatus;
use App\Models\Campus;
use App\Models\CampusTournament;
use App\Models\TournamentType;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<CampusTournament> */
class CampusTournamentFactory extends Factory
{
    protected $model = CampusTournament::class;

    public function definition(): array
    {
        $registrationOpens = now()->addWeek();
        $registrationCloses = $registrationOpens->copy()->addDays(3);

        return [
            'campus_id' => Campus::factory(),
            'created_by_user_id' => User::factory(),
            'name' => fake()->unique()->words(3, true),
            'tournament_type_code' => TournamentType::factory(),
            'approval_status' => CampusTournamentApprovalStatus::Pending,
            'registration_opens_at' => $registrationOpens,
            'registration_closes_at' => $registrationCloses,
            'starts_at' => $registrationCloses,
            'ends_at' => $registrationCloses->copy()->addHours(6),
        ];
    }
}
