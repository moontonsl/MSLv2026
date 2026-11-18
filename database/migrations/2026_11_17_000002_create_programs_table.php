<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('programs', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('link', 500)->nullable();
            $table->string('image_path', 500)->nullable();
            $table->string('icon', 50)->default('swords');
            $table->string('color', 30)->default('#f2c21a');
            $table->boolean('is_bookmarked')->default(false);
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('order')->default(0);
            $table->timestamps();
        });

        $now = now();

        DB::table('programs')->insert([
            [
                'title' => 'Campus Tournaments',
                'description' => 'Monthly online and onsite competitive circuits exclusively for student members. Compete for school pride and national rankings.',
                'link' => '/CampusTournaments',
                'image_path' => '/Images/Home/campus-tournament.png',
                'icon' => 'swords',
                'color' => '#60a5fa',
                'is_bookmarked' => true,
                'is_active' => true,
                'order' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'title' => 'The MSL Network',
                'description' => 'Our flagship ecosystem managing official relations with collegiate esports organizations. We bridge the gap between student leaders and Moonton Games.',
                'link' => '/MSLNetwork',
                'image_path' => '/Images/Home/msl-network.jpeg',
                'icon' => 'network',
                'color' => '#f2c21a',
                'is_bookmarked' => true,
                'is_active' => true,
                'order' => 2,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'title' => 'Events',
                'description' => 'Explore MSL events, watch fests, and campus activities across the nation.',
                'link' => '/ComingSoon?feature=events',
                'image_path' => '/Images/Home/events.jpg',
                'icon' => 'gamepad',
                'color' => '#f2c21a',
                'is_bookmarked' => true,
                'is_active' => true,
                'order' => 3,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'title' => 'Buffs & Support',
                'description' => 'The official sponsorship arm providing diamond funding, merchandise, and event resources to empower partner organizations.',
                'link' => '/BuffsAndSupport',
                'image_path' => '/Images/Home/buffsandsupport.png',
                'icon' => 'gift',
                'color' => '#f2c21a',
                'is_bookmarked' => true,
                'is_active' => true,
                'order' => 4,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'title' => 'MCC League',
                'description' => 'The pinnacle of collegiate esports where schools clash for national championship glory.',
                'link' => '/ComingSoon?feature=mcc-league',
                'image_path' => '/champ poster.jpg',
                'icon' => 'presentation',
                'color' => '#f2c21a',
                'is_bookmarked' => true,
                'is_active' => true,
                'order' => 5,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'title' => 'The Referral Program',
                'description' => 'Empowering student leaders as recruiters. Refer new members and organizations to grow the MSL community.',
                'link' => '/ComingSoon?feature=referral',
                'image_path' => '/Images/BuffsSupport/pnu-sulo-general-assembly-mlbb.jpg',
                'icon' => 'user',
                'color' => '#4ade80',
                'is_bookmarked' => false,
                'is_active' => true,
                'order' => 6,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('programs');
    }
};
