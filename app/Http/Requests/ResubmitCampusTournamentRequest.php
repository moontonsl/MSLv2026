<?php

namespace App\Http\Requests;

class ResubmitCampusTournamentRequest extends CampusTournamentSubmissionRequest
{
    public function rules(): array
    {
        return [
            ...parent::rules(),
            'resubmission_reason' => ['required', 'string', 'max:2000'],
        ];
    }
}
