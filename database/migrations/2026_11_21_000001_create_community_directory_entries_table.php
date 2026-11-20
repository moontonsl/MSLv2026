<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('community_directory_entries', function (Blueprint $table) {
            $table->id();
            $table->string('school');
            $table->string('community');
            $table->string('region', 100)->index();
            $table->string('tier', 50)->default('Level I')->index();
            $table->unsignedInteger('members')->default(0);
            $table->string('href', 500)->nullable();
            $table->unsignedInteger('order')->default(0);
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });

        $now = now();

        $defaults = [
            ['Ateneo de Davao University', 'AdDU - Blue Knights', 'Mindanao', 'Level II', 600],
            ['Bulacan State University', 'BulSU - Student Community', 'North/Central Luzon', 'Level I', 350],
            ['Central Philippine University', 'CPU - Golden Lions', 'Visayas', 'Level I', 500],
            ['National University', 'NU - Bulldogs Esports', 'NCR', 'Level III', 820],
            ['University of Baguio', 'UB - Cardinals Gaming', 'North/Central Luzon', 'Level II', 410],
            ['University of San Carlos', 'USC - Warriors', 'Visayas', 'Level III', 730],
            ['Adamson University', 'AdU - Falcons Esports', 'NCR', 'Level II', 520],
            ['Arellano University', 'AU - Chiefs Gaming', 'NCR', 'Level I', 290],
            ['De La Salle University', 'DLSU - Animo Esports', 'NCR', 'Level III', 940],
            ['Far Eastern University', 'FEU - Tamaraws Gaming', 'NCR', 'Level II', 610],
            ['Mapua University', 'Mapua - Cardinals Esports', 'NCR', 'Level II', 455],
            ['Polytechnic University of the Philippines', 'PUP - Iskolar Gaming', 'NCR', 'Level III', 880],
            ['Technological Institute of the Philippines', 'TIP - Engineers Esports', 'NCR', 'Level I', 365],
            ['University of the East', 'UE - Warriors Gaming', 'NCR', 'Level II', 505],
            ['University of Santo Tomas', 'UST - Tigers Esports', 'NCR', 'Level III', 990],
            ['Pamantasan ng Lungsod ng Maynila', 'PLM - Haribons Gaming', 'NCR', 'Level I', 420],
            ['Angeles University Foundation', 'AUF - Great Danes Esports', 'North/Central Luzon', 'Level I', 315],
            ['Bataan Peninsula State University', 'BPSU - Peninsula Gamers', 'North/Central Luzon', 'Level II', 470],
            ['Cagayan State University', 'CSU - Eagles Esports', 'North/Central Luzon', 'Level I', 340],
            ['Don Honorio Ventura State University', 'DHVSU - Honorians Gaming', 'North/Central Luzon', 'Level II', 510],
            ['Holy Angel University', 'HAU - Angelites Esports', 'North/Central Luzon', 'Level II', 545],
            ['Isabela State University', 'ISU - Falcons Gaming', 'North/Central Luzon', 'Level I', 330],
            ['Nueva Ecija University of Science and Technology', 'NEUST - Phoenix Esports', 'North/Central Luzon', 'Level I', 395],
            ['Pangasinan State University', 'PSU - Golden Lions Gaming', 'North/Central Luzon', 'Level II', 485],
            ['Saint Louis University', 'SLU - Navigators Esports', 'North/Central Luzon', 'Level III', 710],
            ['Tarlac State University', 'TSU - Foxes Gaming', 'North/Central Luzon', 'Level II', 560],
            ['Batangas State University', 'BatStateU - Red Spartans Esports', 'South Luzon', 'Level III', 835],
            ['Cavite State University', 'CvSU - Hornets Gaming', 'South Luzon', 'Level II', 625],
            ['De La Salle Lipa', 'DLSL - Blazers Esports', 'South Luzon', 'Level I', 305],
            ['Laguna State Polytechnic University', 'LSPU - Lakers Gaming', 'South Luzon', 'Level II', 430],
            ['Lyceum of the Philippines University Batangas', 'LPU-B - Pirates Esports', 'South Luzon', 'Level I', 360],
            ['Manuel S. Enverga University Foundation', 'MSEUF - Wildcats Gaming', 'South Luzon', 'Level I', 275],
            ['University of Batangas', 'UBatangas - Brahmans Esports', 'South Luzon', 'Level II', 455],
            ['University of Perpetual Help System DALTA', 'Perpetual - Altas Gaming', 'South Luzon', 'Level I', 385],
            ['Ateneo de Naga University', 'AdNU - Golden Knights Esports', 'South Luzon', 'Level II', 525],
            ['Bicol University', 'BU - Trailblazers Gaming', 'South Luzon', 'Level III', 765],
            ['Aklan State University', 'ASU - Falcons Esports', 'Visayas', 'Level I', 285],
            ['Cebu Institute of Technology - University', 'CIT-U - Wildcats Gaming', 'Visayas', 'Level II', 590],
            ['Cebu Normal University', 'CNU - Normalites Esports', 'Visayas', 'Level I', 315],
            ['Negros Oriental State University', 'NORSU - Wolves Gaming', 'Visayas', 'Level II', 445],
            ['Silliman University', 'SU - Stallions Esports', 'Visayas', 'Level III', 705],
            ['University of Antique', 'UA - Warriors Gaming', 'Visayas', 'Level I', 260],
            ['University of Cebu', 'UC - Webmasters Esports', 'Visayas', 'Level II', 650],
            ['University of Iloilo', 'UI - Wildcats Gaming', 'Visayas', 'Level I', 335],
            ['University of Negros Occidental - Recoletos', 'UNO-R - Rams Esports', 'Visayas', 'Level II', 405],
            ['West Visayas State University', 'WVSU - Taga-West Gaming', 'Visayas', 'Level III', 790],
            ['Ateneo de Zamboanga University', 'AdZU - Azul Aguilas Esports', 'Mindanao', 'Level II', 540],
            ['Bukidnon State University', 'BukSU - Highlanders Gaming', 'Mindanao', 'Level I', 320],
            ['Caraga State University', 'CSU - Gold Panthers Esports', 'Mindanao', 'Level II', 480],
            ['Central Mindanao University', 'CMU - Musuan Gaming', 'Mindanao', 'Level II', 515],
            ['Mindanao State University - Iligan Institute of Technology', 'MSU-IIT - Titans Esports', 'Mindanao', 'Level III', 820],
            ['Notre Dame of Dadiangas University', 'NDDU - Marist Gaming', 'Mindanao', 'Level I', 300],
            ['University of Mindanao', 'UM - Wildcats Esports', 'Mindanao', 'Level III', 860],
            ['University of Science and Technology of Southern Philippines', 'USTP - Trailblazers Gaming', 'Mindanao', 'Level II', 610],
            ['Xavier University - Ateneo de Cagayan', 'XU - Crusaders Esports', 'Mindanao', 'Level II', 575],
            ['Zamboanga Peninsula Polytechnic State University', 'ZPPSU - Builders Gaming', 'Mindanao', 'Level I', 345],
            ['Colegio de San Juan de Letran', 'Letran - Knights Esports', 'NCR', 'Level II', 500],
            ['San Beda University', 'SBU - Red Lions Gaming', 'NCR', 'Level II', 535],
            ['Southern Luzon State University', 'SLSU - Kingfishers Esports', 'South Luzon', 'Level I', 370],
            ['University of the Philippines Los Banos', 'UPLB - Isko Gaming', 'South Luzon', 'Level III', 745],
        ];

        $rows = [];
        foreach ($defaults as $index => [$school, $community, $region, $tier, $members]) {
            $rows[] = [
                'school' => $school,
                'community' => $community,
                'region' => $region,
                'tier' => $tier,
                'members' => $members,
                'href' => '#accreditation',
                'order' => $index + 1,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table('community_directory_entries')->insert($rows);
    }

    public function down(): void
    {
        Schema::dropIfExists('community_directory_entries');
    }
};
