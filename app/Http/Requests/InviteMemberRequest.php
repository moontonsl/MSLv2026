<?php

namespace App\Http\Requests;

use App\Support\TournamentRegistrationGuard;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class InviteMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'user_id' => ['required', 'integer', Rule::exists('users', 'id')],
            'intended_lane_role_code' => [
                'required',
                'string',
                Rule::in(TournamentRegistrationGuard::LANE_ROLE_CODES),
                Rule::exists('lane_roles', 'code'),
            ],
        ];
    }
}
