<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OppoRoadshowDate extends Model
{
    protected $fillable = ['event_date', 'is_active'];

    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }
}
