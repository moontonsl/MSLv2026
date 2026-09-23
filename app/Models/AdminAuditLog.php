<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdminAuditLog extends \Illuminate\Database\Eloquent\Model
{
    protected $fillable = [
        'admin_user_id',
        'route_name',
        'module',
        'action',
        'method',
        'status_code',
        'target_type',
        'target_id',
        'metadata',
        'ip_address',
        'user_agent',
    ];

    protected function casts(): array
    {
        return ['metadata' => 'array'];
    }

    public function adminUser(): BelongsTo
    {
        return $this->belongsTo(AdminUser::class);
    }
}
