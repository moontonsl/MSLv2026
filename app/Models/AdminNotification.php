<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdminNotification extends Model
{
    protected $fillable = [
        'admin_user_id',
        'actor_admin_id',
        'type',
        'title',
        'message',
        'action_url',
        'read_at',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'read_at' => 'datetime',
            'metadata' => 'array',
        ];
    }

    public function adminUser(): BelongsTo
    {
        return $this->belongsTo(AdminUser::class);
    }

    public function actor(): BelongsTo
    {
        return $this->belongsTo(AdminUser::class, 'actor_admin_id');
    }
}
