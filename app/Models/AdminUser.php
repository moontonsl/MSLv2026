<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
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

    public function isSuperAdmin(): bool
    {
        return strcasecmp((string) $this->role, 'Super Admin') === 0
            || strcasecmp((string) $this->role, 'super_admin') === 0
            || strcasecmp((string) $this->email, 'admin@msl.com') === 0;
    }

    public function hasPermission(string $permission): bool
    {
        return $this->isSuperAdmin()
            || ($permission === 'access_admin_dashboard' && strcasecmp((string) $this->role, 'Admin') === 0)
            || in_array($permission, $this->permissions ?? [], true);
    }
}
