<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LaneRole extends Model
{
    protected $primaryKey = 'code';

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = ['code', 'name', 'sort_order'];

    public function participantsPreferring(): HasMany
    {
        return $this->hasMany(TournamentParticipant::class, 'preferred_lane_role_code', 'code');
    }

    public function participantsAssigned(): HasMany
    {
        return $this->hasMany(TournamentParticipant::class, 'assigned_lane_role_code', 'code');
    }
}
