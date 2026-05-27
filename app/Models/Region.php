<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Region extends Model
{
    use HasFactory;

    protected $primaryKey = 'code';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'code',
        'name',
        'region_number',
        'acronym',
        'island_code',
    ];

    public function island()
    {
        return $this->belongsTo(Island::class, 'island_code', 'code');
    }

    public function provinces()
    {
        return $this->hasMany(Province::class, 'region_code', 'code');
    }

    public function cities()
    {
        return $this->hasMany(City::class, 'region_code', 'code');
    }
}
