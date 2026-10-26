<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class AdminRole extends Model
{
    use HasFactory;

    protected $table = 'admin_roles';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'permissions',
        'is_system',
    ];

    protected function casts(): array
    {
        return [
            'permissions' => 'array',
            'is_system' => 'boolean',
        ];
    }

    protected static function boot(): void
    {
        parent::boot();

        static::saving(function (AdminRole $role) {
            if (empty($role->slug) && !empty($role->name)) {
                $role->slug = Str::slug($role->name, '_');
            }
        });
    }

    public function isSuperAdmin(): bool
    {
        return $this->slug === 'super_admin' || strcasecmp($this->name, 'Super Admin') === 0;
    }

    public function users(): HasMany
    {
        return $this->hasMany(AdminUser::class, 'role', 'name');
    }
}
