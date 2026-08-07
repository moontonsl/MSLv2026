<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use LogicException;

class CampusTournamentSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'tournament_id',
        'submitted_by_user_id',
        'version',
        'campus_id',
        'name',
        'tournament_type_code',
        'registration_opens_at',
        'registration_closes_at',
        'starts_at',
        'ends_at',
        'resubmission_reason',
        'submitted_at',
    ];

    protected function casts(): array
    {
        return [
            'registration_opens_at' => 'datetime',
            'registration_closes_at' => 'datetime',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'submitted_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::updating(fn () => throw new LogicException('Tournament submissions are immutable.'));
        static::deleting(fn () => throw new LogicException('Tournament submissions are immutable.'));
    }

    public function tournament(): BelongsTo
    {
        return $this->belongsTo(CampusTournament::class, 'tournament_id');
    }

    public function submitter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'submitted_by_user_id');
    }

    public function campus(): BelongsTo
    {
        return $this->belongsTo(Campus::class);
    }

    public function tournamentType(): BelongsTo
    {
        return $this->belongsTo(TournamentType::class, 'tournament_type_code', 'code');
    }

    public function review(): HasOne
    {
        return $this->hasOne(CampusTournamentReview::class, 'submission_id');
    }
}
