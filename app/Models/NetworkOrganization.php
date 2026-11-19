<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class NetworkOrganization extends Model
{
    public static function publicLogos(): \Illuminate\Support\Collection
    {
        return static::query()
            ->where('is_active', true)
            ->orderBy('order')
            ->get()
            ->map(fn (self $org) => [
                'id' => $org->id,
                'src' => $org->logo_url,
                'alt' => $org->name,
                'name' => $org->name,
                'link' => $org->link,
            ])
            ->values();
    }

    protected $fillable = [
        'name',
        'logo_path',
        'link',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    public function getLogoUrlAttribute(): ?string
    {
        if (!$this->logo_path) {
            return null;
        }

        if (Str::startsWith($this->logo_path, ['/', 'http://', 'https://'])) {
            return $this->logo_path;
        }

        return Storage::disk('public')->url('network_organizations/' . $this->logo_path);
    }
}
