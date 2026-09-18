<?php

namespace App\Models;

use App\Enums\CampusTournamentApprovalStatus;
use App\Enums\CampusTournamentLifecycle;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CampusTournament extends Model
{
    use HasFactory;

    protected $fillable = [
        'campus_id',
        'created_by_user_id',
        'name',
        'tournament_type_code',
        'approval_status',
        'current_submission_id',
        'registration_opens_at',
        'registration_closes_at',
        'starts_at',
        'ends_at',
        'roster_locked_at',
        'cancelled_by_user_id',
        'cancellation_reason',
        'cancelled_at',
    ];

    protected function casts(): array
    {
        return [
            'approval_status' => CampusTournamentApprovalStatus::class,
            'registration_opens_at' => 'datetime',
            'registration_closes_at' => 'datetime',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'roster_locked_at' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }

    public function scopePendingForReviewer(Builder $query, User $user): Builder
    {
        $query->where('approval_status', CampusTournamentApprovalStatus::Pending->value);

        if ($user->status !== 'active') {
            return $query->whereRaw('1 = 0');
        }

        if ($user->user_type === 'Super Admin') {
            return $query;
        }

        return $query->whereHas('campus.city', function (Builder $cityQuery) use ($user): void {
            $cityQuery->whereIn('region_code', RegionAdmin::query()
                ->select('region_code')
                ->where('user_id', $user->id));
        });
    }

    public function lifecycle(?CarbonInterface $at = null): string
    {
        if ($this->approval_status !== CampusTournamentApprovalStatus::Approved) {
            return $this->approval_status->value;
        }

        $at ??= now();

        if ($at->lt($this->registration_opens_at)) {
            return CampusTournamentLifecycle::Scheduled->value;
        }

        if ($at->lt($this->registration_closes_at)) {
            return CampusTournamentLifecycle::RegistrationOpen->value;
        }

        if ($at->lt($this->starts_at)) {
            return CampusTournamentLifecycle::RegistrationClosed->value;
        }

        if ($at->lt($this->ends_at)) {
            return CampusTournamentLifecycle::Ongoing->value;
        }

        return CampusTournamentLifecycle::Completed->value;
    }

    public function campus(): BelongsTo
    {
        return $this->belongsTo(Campus::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    public function tournamentType(): BelongsTo
    {
        return $this->belongsTo(TournamentType::class, 'tournament_type_code', 'code');
    }

    public function currentSubmission(): BelongsTo
    {
        return $this->belongsTo(CampusTournamentSubmission::class, 'current_submission_id');
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(CampusTournamentSubmission::class, 'tournament_id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(CampusTournamentReview::class, 'tournament_id');
    }

    public function scheduleRevisions(): HasMany
    {
        return $this->hasMany(CampusTournamentScheduleRevision::class, 'tournament_id');
    }

    public function cancelledBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cancelled_by_user_id');
    }

    public function teams(): HasMany
    {
        return $this->hasMany(TournamentTeam::class, 'tournament_id');
    }

    public function participants(): HasMany
    {
        return $this->hasMany(TournamentParticipant::class, 'tournament_id');
    }

    /**
     * Whether registration is currently open based on approval, schedule, and roster state.
     */
    public function isRegistrationOpen(): bool
    {
        if ($this->approval_status !== CampusTournamentApprovalStatus::Approved) {
            return false;
        }

        if ($this->cancelled_at !== null || $this->roster_locked_at !== null) {
            return false;
        }

        $now = now();

        return $now->gte($this->registration_opens_at)
            && $now->lt($this->registration_closes_at);
    }
}
