<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RegionAdmin extends Model
{
    protected $fillable = [
        'region_code',
        'user_id',
        'assigned_by_user_id',
        'assigned_by_admin_user_id',
        'assigned_at',
    ];

    protected function casts(): array
    {
        return ['assigned_at' => 'datetime'];
    }

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class, 'region_code', 'code');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function assignedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_by_user_id');
    }

    public function assignedByAdmin(): BelongsTo
    {
        return $this->belongsTo(AdminUser::class, 'assigned_by_admin_user_id');
    }

    public function campusAssignments(): HasMany
    {
        return $this->hasMany(RegionAdminCampusAssignment::class);
    }
}
