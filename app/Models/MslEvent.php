<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MslEvent extends Model
{
    protected $table = 'msl_events_data';

    protected $fillable = [
        'event_name', 'event_state', 'event_canonical', 'event_logo', 'event_title',
        'event_subtitle', 'event_content01', 'event_content02', 'event_img01',
        'event_img02', 'event_img03', 'event_img04', 'event_img05', 'is_featured',
        'redirect_url',
    ];

    protected function casts(): array
    {
        return ['is_featured' => 'boolean'];
    }
}
