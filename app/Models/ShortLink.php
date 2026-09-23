<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShortLink extends Model
{
    protected $fillable = ['code', 'original_url', 'clicks'];

    protected function casts(): array
    {
        return ['clicks' => 'integer'];
    }
}
