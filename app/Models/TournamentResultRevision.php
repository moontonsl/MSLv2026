<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use LogicException;

class TournamentResultRevision extends Model
{
    protected $fillable = [
        'tournament_id',
        'version',
        'submitted_by_user_id',
        'reason',
        'submitted_at',
    ];

    protected function casts(): array
    {
        return [
            'submitted_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::updating(fn () => throw new LogicException('Tournament result revisions are immutable.'));
        static::deleting(fn () => throw new LogicException('Tournament result revisions are immutable.'));
    }

    public function tournament(): BelongsTo
    {
        return $this->belongsTo(CampusTournament::class, 'tournament_id');
    }

    public function submitter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'submitted_by_user_id');
    }

    public function entries(): HasMany
    {
        return $this->hasMany(TournamentResultEntry::class, 'result_revision_id');
    }
}
