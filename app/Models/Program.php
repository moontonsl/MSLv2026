<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Program extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'link',
        'image_path',
        'icon',
        'color',
        'is_bookmarked',
        'is_active',
        'order',
    ];

    protected $appends = [
        'image_url',
    ];

    protected function casts(): array
    {
        return [
            'is_bookmarked' => 'boolean',
            'is_active' => 'boolean',
            'order' => 'integer',
        ];
    }

    public function getImageUrlAttribute(): string
    {
        if (! $this->image_path) {
            return '/Images/Home/campus-tournament.png';
        }

        if (Str::startsWith($this->image_path, ['/', 'http://', 'https://'])) {
            return $this->image_path;
        }

        return Storage::disk('public')->url('programs/'.$this->image_path);
    }
}
