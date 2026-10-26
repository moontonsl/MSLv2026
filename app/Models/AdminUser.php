<?php

namespace App\Models;

use App\Http\Controllers\Admin\AdminPermissionController;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class AdminUser extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'admin_users';

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'permissions',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'permissions' => 'array',
        ];
    }

    public function roleModel(): BelongsTo
    {
        return $this->belongsTo(AdminRole::class, 'role', 'name');
    }

    public function isSuperAdmin(): bool
    {
        return strcasecmp((string) $this->role, 'Super Admin') === 0
            || strcasecmp((string) $this->role, 'super_admin') === 0
            || strcasecmp((string) $this->email, 'admin@msl.com') === 0;
    }

    /**
     * Get the combined effective permissions (inherited from Role + any direct user overrides).
     */
    public function getEffectivePermissionsAttribute(): array
    {
        if ($this->isSuperAdmin()) {
            return collect(AdminPermissionController::availablePermissions())->pluck('id')->all();
        }

        // Match either by role name or slug
        $rolePerms = $this->roleModel?->permissions;
        if ($rolePerms === null) {
            $matchedRole = AdminRole::where('slug', strtolower(str_replace(' ', '_', (string) $this->role)))->first();
            $rolePerms = $matchedRole?->permissions ?? [];
        }

        $userPerms = $this->permissions ?? [];

        return array_values(array_unique(array_merge($rolePerms, $userPerms)));
    }

    public function hasPermission(string $permission): bool
    {
        if ($this->isSuperAdmin()) {
            return true;
        }

        if ($permission === 'access_admin_dashboard' && strcasecmp((string) $this->role, 'Admin') === 0) {
            return true;
        }

        return in_array($permission, $this->effective_permissions, true);
    }
}
