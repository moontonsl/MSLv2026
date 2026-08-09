<?php

namespace App\Models;

use App\Enums\CampusTournamentReviewDecision;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CampusTournamentReview extends Model
{
    use HasFactory;

    protected $fillable = ['tournament_id', 'submission_id', 'reviewer_user_id', 'decision', 'reason'];

    protected function casts(): array
    {
        return ['decision' => CampusTournamentReviewDecision::class];
    }

    public function tournament(): BelongsTo
    {
        return $this->belongsTo(CampusTournament::class, 'tournament_id');
    }

    public function submission(): BelongsTo
    {
        return $this->belongsTo(CampusTournamentSubmission::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_user_id');
    }
}
