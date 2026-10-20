<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use LogicException;

class TournamentResultEntry extends Model
{
    protected $fillable = [
        'result_revision_id',
        'team_id',
        'placement_code',
        'team_name_snapshot',
        'roster_snapshot',
    ];

    protected function casts(): array
    {
        return [
            'roster_snapshot' => 'array',
        ];
    }

    protected static function booted(): void
    {
        static::updating(fn () => throw new LogicException('Tournament result entries are immutable.'));
        static::deleting(fn () => throw new LogicException('Tournament result entries are immutable.'));
    }

    public function revision(): BelongsTo
    {
        return $this->belongsTo(TournamentResultRevision::class, 'result_revision_id');
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(TournamentTeam::class, 'team_id');
    }
}
