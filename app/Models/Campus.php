<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Campus extends Model
{
    use HasFactory;

    protected $fillable = [
        'institution_id',
        'campus_type_id',
        'name',
        'city_code',
        'barangay_code',
        'address_line',
        'status',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function campusType(): BelongsTo
    {
        return $this->belongsTo(CampusType::class);
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class, 'city_code', 'code');
    }

    public function barangay(): BelongsTo
    {
        return $this->belongsTo(Barangay::class, 'barangay_code', 'code');
    }

    public function community(): HasOne
    {
        return $this->hasOne(CampusCommunity::class);
    }

    public function affiliations(): HasMany
    {
        return $this->hasMany(CampusAffiliation::class);
    }
}
