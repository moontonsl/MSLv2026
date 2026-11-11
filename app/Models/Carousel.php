<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Carousel extends Model
{
    protected $fillable = [
        'title',
        'label',
        'subtitle',
        'link',
        'start_date',
        'end_date',
        'image_path',
        'order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'order' => 'integer',
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }
}
