<?php

namespace App\Models;

use App\Enums\ParticipantStatus;
use App\Enums\TeamFormationMethod;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TournamentParticipant extends Model
{
    use HasFactory;

    protected $fillable = [
        'tournament_id',
        'user_id',
        'team_id',
        'entry_method',
        'roster_role',
        'preferred_lane_role_code',
        'assigned_lane_role_code',
        'status',
        'registered_at',
        'accepted_at',
        'withdrawn_at',
    ];

    protected function casts(): array
    {
        return [
            'entry_method' => TeamFormationMethod::class,
            'status' => ParticipantStatus::class,
            'registered_at' => 'datetime',
            'accepted_at' => 'datetime',
            'withdrawn_at' => 'datetime',
        ];
    }

    public function tournament(): BelongsTo
    {
        return $this->belongsTo(CampusTournament::class, 'tournament_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(TournamentTeam::class, 'team_id');
    }

    public function preferredLaneRole(): BelongsTo
    {
        return $this->belongsTo(LaneRole::class, 'preferred_lane_role_code', 'code');
    }

    public function assignedLaneRole(): BelongsTo
    {
        return $this->belongsTo(LaneRole::class, 'assigned_lane_role_code', 'code');
    }
}
