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

        foreach (['registration_opens_at', 'registration_closes_at', 'starts_at', 'ends_at'] as $field) {
            if (! is_string($this->input($field)) || trim($this->input($field)) === '') {
                continue;
            }

            try {
                $normalized[$field] = CarbonImmutable::parse($this->input($field), 'Asia/Manila')
                    ->utc()
                    ->format('Y-m-d H:i:s');
            } catch (Throwable) {
                // Leave invalid input unchanged so the date rule reports it.
            }
        }

        $this->merge($normalized);
    }
}
