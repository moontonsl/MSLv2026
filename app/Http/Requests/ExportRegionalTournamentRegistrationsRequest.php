<?php

namespace App\Http\Requests;

use App\Models\Campus;
use App\Models\RegionAdmin;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class ExportRegionalTournamentRegistrationsRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        return $user !== null
            && $user->status === 'active'
            && RegionAdmin::query()->where('user_id', $user->id)->exists();
    }

    public function rules(): array
    {
        return [
            'campus_id' => [
                'required',
                function (string $attribute, mixed $value, \Closure $fail): void {
                    if ($value !== 'all' && filter_var($value, FILTER_VALIDATE_INT) === false) {
                        $fail('Select a valid school.');
                    }
                },
            ],
            'start_date' => ['required', 'date_format:Y-m-d'],
            'end_date' => ['required', 'date_format:Y-m-d', 'after_or_equal:start_date'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $campusId = $this->input('campus_id');
                if ($campusId === 'all' || $validator->errors()->has('campus_id')) {
                    return;
                }

                $regionCodes = RegionAdmin::query()
                    ->where('user_id', $this->user()->id)
                    ->pluck('region_code');

                $authorized = Campus::query()
                    ->whereKey((int) $campusId)
                    ->whereHas('city', fn ($query) => $query->whereIn('region_code', $regionCodes))
                    ->exists();

                if (! $authorized) {
                    $validator->errors()->add('campus_id', 'Select a school in your assigned region.');
                }
            },
        ];
    }
}
