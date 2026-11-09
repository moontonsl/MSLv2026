<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Institution extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'acronym',
        'region',
        'island',
        'status',
    ];

    public function campuses(): HasMany
    {
        return $this->hasMany(Campus::class);
    }

    public function regionalAdmins(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'regional_admin_schools', 'institution_id', 'user_id')
            ->withTimestamps();
    }
}
