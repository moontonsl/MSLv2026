<?php

namespace App\Models;

use Database\Factories\CampusTypeFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CampusType extends Model
{
    /** @use HasFactory<CampusTypeFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
    ];

    public function campuses(): HasMany
    {
        return $this->hasMany(Campus::class);
    }
}
