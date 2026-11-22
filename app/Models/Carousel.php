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

    /**
     * Slides that are active and currently within their scheduled [start_date, end_date) window.
     */
    public function scopeScheduledActive($query, ?\Carbon\CarbonInterface $now = null)
    {
        $today = ($now ?? now())->toDateString();

        return $query
            ->where('is_active', true)
            ->where(function ($q) use ($today) {
                $q->whereNull('start_date')
                    ->orWhereDate('start_date', '<=', $today);
            })
            ->where(function ($q) use ($today) {
                $q->whereNull('end_date')
                    ->orWhereDate('end_date', '>', $today);
            });
    }

    /**
     * Homepage default hero carousel placeholders.
     */
    public static function defaultPlaceholders(): array
    {
        return [
            [
                'label' => 'LIVE NOW',
                'title' => 'MCC Season 4: Collegiate Clash',
                'subtitle' => 'The biggest inter-school MLBB tournament is back. Watch the regionals live.',
                'link' => '/events',
                'start_date' => '2025-11-27',
                'end_date' => null,
                'image_path' => '/champ poster.jpg',
                'order' => 0,
                'is_active' => true,
            ],
            [
                'label' => 'FEATURED',
                'title' => 'Campus Scrims: Open Qualifiers',
                'subtitle' => 'Weekly scrims for student teams. Build synergy, earn rankings, get noticed.',
                'link' => '/events',
                'start_date' => '2025-12-04',
                'end_date' => null,
                'image_path' => '/Images/Home/campus-scrims.jpg',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'label' => 'UP NEXT',
                'title' => 'MSL Partner Spotlight',
                'subtitle' => 'Meet our campus partners and explore resources for esports org leaders.',
                'link' => '/Partnerships',
                'start_date' => '2025-12-18',
                'end_date' => null,
                'image_path' => '/Images/Home/msl-partner.jpg',
                'order' => 2,
                'is_active' => true,
            ],
        ];
    }
}
