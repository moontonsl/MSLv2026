<?php

namespace App\Models;

use App\Enums\ParticipantStatus;
use App\Enums\TeamFormationMethod;
use App\Enums\TeamStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TournamentTeam extends Model
{
    use HasFactory;

    protected $fillable = [
        'tournament_id',
        'name',
        'active_name',
        'formation_method',
        'status',
        'captain_user_id',
        'discord_id',
        'registered_at',
        'merged_at',
        'withdrawn_at',
    ];

    protected function casts(): array
    {
        return [
            'formation_method' => TeamFormationMethod::class,
            'status' => TeamStatus::class,
            'registered_at' => 'datetime',
            'merged_at' => 'datetime',
            'withdrawn_at' => 'datetime',
        ];
    }

    public function tournament(): BelongsTo
    {
        return $this->belongsTo(CampusTournament::class, 'tournament_id');
    }

    public function captain(): BelongsTo
    {
        return $this->belongsTo(User::class, 'captain_user_id');
    }

    public function participants(): HasMany
    {
        return $this->hasMany(TournamentParticipant::class, 'team_id');
    }

    public function activeParticipants(): HasMany
    {
        return $this->hasMany(TournamentParticipant::class, 'team_id')
            ->where('status', ParticipantStatus::Active);
    }

    public function invitations(): HasMany
    {
        return $this->hasMany(TournamentTeamInvitation::class, 'team_id');
    }

    public function joinCodes(): HasMany
    {
        return $this->hasMany(TournamentTeamJoinCode::class, 'team_id');
    }

    public function scopeOpenSoloForTournament(Builder $query, int $tournamentId): Builder
    {
        return $query
            ->where('tournament_id', $tournamentId)
            ->where('formation_method', TeamFormationMethod::Solo)
            ->where('status', TeamStatus::Assembling)
            ->withCount('activeParticipants');
    }
}
