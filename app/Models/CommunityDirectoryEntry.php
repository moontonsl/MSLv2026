<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

class CommunityDirectoryEntry extends Model
{
    public const REGIONS = [
        'NCR',
        'North/Central Luzon',
        'South Luzon',
        'Visayas',
        'Mindanao',
    ];

    public const TIERS = [
        'Level I',
        'Level II',
        'Level III',
    ];

    protected $fillable = [
        'school',
        'community',
        'region',
        'tier',
        'members',
        'href',
        'order',
        'is_active',
    ];

    protected $casts = [
        'members' => 'integer',
        'order' => 'integer',
        'is_active' => 'boolean',
    ];

    public static function publicEntries(): Collection
    {
        return static::query()
            ->where('is_active', true)
            ->orderBy('order')
            ->orderBy('id')
            ->get()
            ->map(fn (self $entry): array => [
                'id' => $entry->id,
                'school' => $entry->school,
                'community' => $entry->community,
                'region' => $entry->region,
                'tier' => $entry->tier,
                'members' => $entry->members,
                'href' => filled($entry->href) ? $entry->href : '#accreditation',
            ])
            ->values();
    }
}
