<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
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
        'ml_level',
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
        ];
    }
}
