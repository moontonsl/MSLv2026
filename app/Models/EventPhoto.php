<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventPhoto extends Model
{
    protected $fillable = ['event_name', 'school_name', 'picture'];

    public function getPictureAttribute($value): ?string
    {
        return $value ? (str_starts_with($value, '/') ? $value : '/images/EventPhotos/' . $value) : null;
    }
}
