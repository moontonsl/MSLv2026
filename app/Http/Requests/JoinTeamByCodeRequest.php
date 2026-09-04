<?php

namespace App\Http\Requests;

use App\Support\TournamentRegistrationGuard;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class JoinTeamByCodeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'string'],
            'assigned_lane_role_code' => [
                'required',
                'string',
                Rule::in(TournamentRegistrationGuard::LANE_ROLE_CODES),
                Rule::exists('lane_roles', 'code'),
            ],
        ];
    }
}
