<?php

namespace App\Http\Requests;

use Carbon\CarbonImmutable;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Throwable;

abstract class CampusTournamentSubmissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'campus_id' => ['required', 'integer', Rule::exists('campuses', 'id')],
            'name' => ['required', 'string', 'max:255'],
            'tournament_type_code' => ['required', 'string', Rule::exists('tournament_types', 'code')],
            'registration_opens_at' => ['required', 'date'],
            'registration_closes_at' => ['required', 'date', 'after:registration_opens_at'],
            'starts_at' => ['required', 'date', 'after_or_equal:registration_closes_at'],
            'ends_at' => ['required', 'date', 'after:starts_at'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $normalized = [];

        // 1. Alias mode -> tournament_type_code
        if (! $this->has('tournament_type_code') && $this->has('mode')) {
            $normalized['tournament_type_code'] = strtolower((string) $this->input('mode'));
        }

        // 2. Alias startDate/endDate -> starts_at/ends_at
        if (! $this->has('starts_at') && $this->has('startDate')) {
            $normalized['starts_at'] = (string) $this->input('startDate');
        }
        if (! $this->has('ends_at') && $this->has('endDate')) {
            $normalized['ends_at'] = (string) $this->input('endDate');
        }

        // 3. Auto-resolve campus_id from user's active student leader affiliation if not provided
        $campusId = $this->input('campus_id') ?? ($normalized['campus_id'] ?? null);
        if (! $campusId && $this->user()) {
            $resolvedCampusId = $this->user()->campusAffiliations()
                ->where('role', 'student_leader')
                ->where('status', 'active')
                ->value('campus_id');
            if ($resolvedCampusId) {
                $campusId = $resolvedCampusId;
                $normalized['campus_id'] = $campusId;
            }
        }

        // 4. Auto-resolve name if omitted
        if (! $this->has('name') && $campusId) {
            $campus = \App\Models\Campus::query()->find($campusId);
            $normalized['name'] = $campus
                ? strtoupper($campus->name) . ' TOURNAMENT'
                : 'CAMPUS TOURNAMENT';
        }

        // 5. Format and default dates
        $startsAtRaw = $this->input('starts_at') ?? ($normalized['starts_at'] ?? null);
        $endsAtRaw = $this->input('ends_at') ?? ($normalized['ends_at'] ?? null);

        if ($startsAtRaw && is_string($startsAtRaw)) {
            $startsAtParsed = strlen(trim($startsAtRaw)) === 10
                ? CarbonImmutable::parse(trim($startsAtRaw) . ' 08:00:00', 'Asia/Manila')
                : CarbonImmutable::parse($startsAtRaw, 'Asia/Manila');

            $normalized['starts_at'] = $startsAtParsed->utc()->format('Y-m-d H:i:s');

            if (! $this->has('registration_closes_at')) {
                $normalized['registration_closes_at'] = $startsAtParsed->utc()->format('Y-m-d H:i:s');
            }

            if (! $this->has('registration_opens_at')) {
                $nowUtc = CarbonImmutable::now('UTC');
                $regClosesUtc = CarbonImmutable::parse($normalized['registration_closes_at'], 'UTC');
                $leadTimeOpens = $startsAtParsed->subDays(7)->utc();

                if ($leadTimeOpens->gt($nowUtc) && $leadTimeOpens->lt($regClosesUtc)) {
                    $normalized['registration_opens_at'] = $leadTimeOpens->format('Y-m-d H:i:s');
                } else {
                    $normalized['registration_opens_at'] = $nowUtc->lt($regClosesUtc)
                        ? $nowUtc->subMinute()->format('Y-m-d H:i:s')
                        : $regClosesUtc->subDay()->format('Y-m-d H:i:s');
                }
            }
        }

        if ($endsAtRaw && is_string($endsAtRaw)) {
            $endsAtParsed = strlen(trim($endsAtRaw)) === 10
                ? CarbonImmutable::parse(trim($endsAtRaw) . ' 20:00:00', 'Asia/Manila')
                : CarbonImmutable::parse($endsAtRaw, 'Asia/Manila');

            $normalized['ends_at'] = $endsAtParsed->utc()->format('Y-m-d H:i:s');
        }

        foreach (['registration_opens_at', 'registration_closes_at'] as $field) {
            $val = $this->input($field) ?? ($normalized[$field] ?? null);
            if (! is_string($val) || trim($val) === '') {
                continue;
            }

            try {
                $normalized[$field] = CarbonImmutable::parse($val, 'Asia/Manila')
                    ->utc()
                    ->format('Y-m-d H:i:s');
            } catch (Throwable) {
                // Leave invalid input unchanged so validation catches it.
            }
        }

        $this->merge($normalized);
    }
}
