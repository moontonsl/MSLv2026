<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CampusCommunity extends Model
{
    use HasFactory;

    protected $fillable = [
        'campus_id',
        'name',
        'acronym',
        'community_tier_id',
        'status',
        'accredited_at',
    ];

    protected function casts(): array
    {
        return [
            'accredited_at' => 'datetime',
        ];
    }

    public function campus(): BelongsTo
    {
        return $this->belongsTo(Campus::class);
    }

    public function communityTier(): BelongsTo
    {
        return $this->belongsTo(CommunityTier::class);
    }
}
