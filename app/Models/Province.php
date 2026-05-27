<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Province extends Model
{
    use HasFactory;

    protected $primaryKey = 'code';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'code',
        'name',
        'region_code',
    ];

    public function region()
    {
        return $this->belongsTo(Region::class, 'region_code', 'code');
    }

    public function cities()
    {
        return $this->hasMany(City::class, 'province_code', 'code');
    }
}
