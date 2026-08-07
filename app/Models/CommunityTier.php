<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CommunityTier extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'rank',
    ];

    public function communities(): HasMany
    {
        return $this->hasMany(CampusCommunity::class);
    }
}
