<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'username',
        'first_name',
        // MLBB fields
        'ml_id',
        'ml_server',
        'ml_ign',
        'ml_avatar',
        'profile_background',
        'ml_level',
        'ml_rank',
        'ml_rank_level',
        'is_mlbb_verified',
        'status',
        // Personal details
        'surname',
        'suffix',
        'birthday',
        'age',
        'gender',
        'contact_number',
        'facebook_link',
        // Academic details
        'course',
        'university',
        'year_level',
        'studentId',
        'proofOfEnrollment',
        // Location details
        'region',
        'island',
        // Squad/Game details
        'squadAbbreviation',
        'squadName',
        'inGameRole',
        'mainHero',
        // User type
        'user_type',
        'division',
        // Renewal dates
        'renewal_requested_at',
        'renewal_submitted_at',
        'renewal_approved_at',
        'renewal_notice_dismissed_at',
        'renewal_requirements',
        // Rejection fields
        'rejection_reason',
        'rejection_checklist',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_mlbb_verified' => 'boolean',
            'renewal_requested_at' => 'datetime',
            'renewal_submitted_at' => 'datetime',
            'renewal_approved_at' => 'datetime',
            'renewal_notice_dismissed_at' => 'datetime',
            'renewal_requirements' => 'array',
            'rejection_checklist' => 'array',
        ];
    }

    public function campusAffiliations(): HasMany
    {
        return $this->hasMany(CampusAffiliation::class);
    }

    public function approvedCampusAffiliations(): HasMany
    {
        return $this->hasMany(CampusAffiliation::class, 'approved_by_user_id');
    }

    public function createdCampusTournaments(): HasMany
    {
        return $this->hasMany(CampusTournament::class, 'created_by_user_id');
    }

    public function tournamentSubmissions(): HasMany
    {
        return $this->hasMany(CampusTournamentSubmission::class, 'submitted_by_user_id');
    }

    public function tournamentReviews(): HasMany
    {
        return $this->hasMany(CampusTournamentReview::class, 'reviewer_user_id');
    }

    public function regionAdminAssignments(): HasMany
    {
        return $this->hasMany(RegionAdmin::class);
    }

    public function tournamentParticipations(): HasMany
    {
        return $this->hasMany(TournamentParticipant::class);
    }

    public function captainedTeams(): HasMany
    {
        return $this->hasMany(TournamentTeam::class, 'captain_user_id');
    }

    public function receivedInvitations(): HasMany
    {
        return $this->hasMany(TournamentTeamInvitation::class, 'invited_user_id');
    }

    /**
     * The permissions assigned to the user.
     */
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class);
    }

    /**
     * Check if the user has a specific permission slug.
     */
    public function hasPermission(string $slug): bool
    {
        // Super Admins automatically bypass all permission checks
        if ($this->user_type === 'Super Admin') {
            return true;
        }

        return $this->permissions()->where('slug', $slug)->exists();
    }
}
