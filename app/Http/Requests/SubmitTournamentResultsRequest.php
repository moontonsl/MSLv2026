<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SubmitTournamentResultsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'entries' => ['required', 'array', 'min:1'],
            'entries.*.team_id' => [
                'required',
                'integer',
                'distinct',
                Rule::exists('tournament_teams', 'id'),
            ],
            'entries.*.placement_code' => [
                'required',
                'string',
                Rule::exists('tournament_placements', 'code'),
            ],
        ];
    }
}
