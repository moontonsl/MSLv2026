<?php

namespace App\Support;

use App\Enums\CampusTournamentApprovalStatus;
use App\Models\CampusTournament;
use Carbon\CarbonInterface;
use Illuminate\Validation\ValidationException;

class CampusTournamentScheduleGuard
{
    public function assertValidOrder(
        CarbonInterface $registrationOpensAt,
        CarbonInterface $registrationClosesAt,
        CarbonInterface $startsAt,
        CarbonInterface $endsAt,
    ): void {
        if (! $registrationOpensAt->lt($registrationClosesAt)
            || $registrationClosesAt->gt($startsAt)
            || ! $startsAt->lt($endsAt)) {
            throw ValidationException::withMessages([
                'registration_opens_at' => 'Tournament dates must satisfy registration open < registration close <= event start < event end.',
            ]);
        }
    }

    public function assertNoOverlap(
        int $campusId,
        CarbonInterface $registrationOpensAt,
        CarbonInterface $endsAt,
        ?int $exceptTournamentId = null,
    ): void {
        $overlap = CampusTournament::query()
            ->where('campus_id', $campusId)
            ->whereIn('approval_status', [
                CampusTournamentApprovalStatus::Pending->value,
                CampusTournamentApprovalStatus::Approved->value,
            ])
            ->where('registration_opens_at', '<', $endsAt)
            ->where('ends_at', '>', $registrationOpensAt)
            ->when($exceptTournamentId, fn ($query) => $query->whereKeyNot($exceptTournamentId))
            ->exists();

        if ($overlap) {
            throw ValidationException::withMessages([
                'registration_opens_at' => 'This campus already has a pending or approved tournament in the requested period.',
            ]);
        }
    }
}
