<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CampusTournamentScheduleRevision extends Model
{
    protected $fillable = [
        'tournament_id', 'changed_by_user_id',
        'previous_registration_opens_at', 'previous_registration_closes_at',
        'previous_starts_at', 'previous_ends_at',
        'new_registration_opens_at', 'new_registration_closes_at',
        'new_starts_at', 'new_ends_at', 'reason',
    ];

    protected function casts(): array
    {
        return [
            'previous_registration_opens_at' => 'datetime',
            'previous_registration_closes_at' => 'datetime',
            'previous_starts_at' => 'datetime',
            'previous_ends_at' => 'datetime',
            'new_registration_opens_at' => 'datetime',
            'new_registration_closes_at' => 'datetime',
            'new_starts_at' => 'datetime',
            'new_ends_at' => 'datetime',
        ];
    }

    public function tournament(): BelongsTo
    {
        return $this->belongsTo(CampusTournament::class, 'tournament_id');
    }

    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by_user_id');
    }
}
