<?php

namespace App\Http\Requests;

class CorrectTournamentResultsRequest extends SubmitTournamentResultsRequest
{
    public function rules(): array
    {
        return [
            ...parent::rules(),
            'reason' => ['required', 'string', 'max:2000'],
        ];
    }
}
