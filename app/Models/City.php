<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    use HasFactory;

    protected $primaryKey = 'code';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'code',
        'name',
        'zip_code',
        'province_code',
        'region_code',
    ];

    public function province()
    {
        return $this->belongsTo(Province::class, 'province_code', 'code');
    }

    public function region()
    {
        return $this->belongsTo(Region::class, 'region_code', 'code');
    }

    public function barangays()
    {
        return $this->hasMany(Barangay::class, 'city_code', 'code');
    }
}
