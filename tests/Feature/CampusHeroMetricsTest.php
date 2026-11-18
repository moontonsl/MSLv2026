<?php

namespace Tests\Feature;

use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CampusHeroMetricsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    public function test_campus_hero_uses_approved_defaults_when_settings_are_missing(): void
    {
        $this->get('/Campus')->assertOk()->assertInertia(fn ($page) => $page
            ->component('Campus/Index')
            ->where('campusMetrics.campus_sls', 115)
            ->where('campusMetrics.communities', 99));
    }

    public function test_campus_hero_uses_stored_values_including_zero(): void
    {
        Setting::setValue('campus_stat_student_leaders', '120');
        Setting::setValue('campus_stat_communities', '0');

        $this->get('/Campus')->assertOk()->assertInertia(fn ($page) => $page
            ->where('campusMetrics.campus_sls', '120')
            ->where('campusMetrics.communities', '0'));
    }
}
