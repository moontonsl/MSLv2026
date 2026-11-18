<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CommunityVoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'role',
        'school',
        'quote',
        'image_path',
        'is_active',
        'order',
    ];

    protected $appends = [
        'image_url',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'order' => 'integer',
        ];
    }

    public function getImageUrlAttribute(): string
    {
        if (! $this->image_path) {
            return 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80';
        }

        if (Str::startsWith($this->image_path, ['/', 'http://', 'https://'])) {
            return $this->image_path;
        }

        return Storage::disk('public')->url('community_voices/'.$this->image_path);
    }
}
