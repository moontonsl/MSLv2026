<?php

namespace Database\Seeders;

use App\Models\Carousel;
use Illuminate\Database\Seeder;

class CarouselSeeder extends Seeder
{
    public function run(): void
    {
        if (Carousel::count() > 0) {
            return;
        }

        Carousel::create([
            'label' => 'LIVE NOW',
            'title' => 'MCC Season 4: Collegiate Clash',
            'subtitle' => 'The biggest inter-school MLBB tournament is back. Watch the regionals live.',
            'link' => '/events',
            'start_date' => '2025-11-27',
            'image_path' => '/champ poster.jpg',
            'order' => 0,
            'is_active' => true,
        ]);

        Carousel::create([
            'label' => 'FEATURED',
            'title' => 'Campus Scrims: Open Qualifiers',
            'subtitle' => 'Weekly scrims for student teams. Build synergy, earn rankings, get noticed.',
            'link' => '/events',
            'start_date' => '2025-12-04',
            'image_path' => '/Images/Home/campus-scrims.jpg',
            'order' => 1,
            'is_active' => true,
        ]);

        Carousel::create([
            'label' => 'UP NEXT',
            'title' => 'MSL Partner Spotlight',
            'subtitle' => 'Meet our campus partners and explore resources for esports org leaders.',
            'link' => '/events',
            'start_date' => '2025-12-18',
            'image_path' => '/champ poster.jpg',
            'order' => 2,
            'is_active' => true,
        ]);
    }
}
