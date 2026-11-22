<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RegionAdminCampusAssignment extends Model
{
    protected $fillable = [
        'region_admin_id',
        'campus_id',
        'assigned_by_user_id',
        'assigned_by_admin_user_id',
        'assigned_at',
    ];

    protected function casts(): array
    {
        return ['assigned_at' => 'datetime'];
    }

    public function regionAdmin(): BelongsTo
    {
        return $this->belongsTo(RegionAdmin::class);
    }

    public function campus(): BelongsTo
    {
        return $this->belongsTo(Campus::class);
    }

    public function assignedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_by_user_id');
    }

    public function assignedByAdmin(): BelongsTo
    {
        return $this->belongsTo(AdminUser::class, 'assigned_by_admin_user_id');
    }
}
