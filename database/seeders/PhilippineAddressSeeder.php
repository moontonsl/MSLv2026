<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Island;
use App\Models\Region;
use App\Models\Province;
use App\Models\City;
use App\Models\Barangay;

class PhilippineAddressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Seed Islands
        $islands = [
            ['code' => 'LUZ', 'name' => 'Luzon'],
            ['code' => 'VIS', 'name' => 'Visayas'],
            ['code' => 'MIN', 'name' => 'Mindanao'],
        ];

        foreach ($islands as $island) {
            Island::updateOrCreate(['code' => $island['code']], $island);
        }

        // 2. Seed Regions
        $regions = [
            ['code' => '130000000', 'name' => 'National Capital Region', 'region_number' => 'NCR', 'acronym' => 'NCR', 'island_code' => 'LUZ'],
            ['code' => '040000000', 'name' => 'CALABARZON', 'region_number' => 'Region IV-A', 'acronym' => 'CALABARZON', 'island_code' => 'LUZ'],
            ['code' => '070000000', 'name' => 'Central Visayas', 'region_number' => 'Region VII', 'acronym' => 'NIR', 'island_code' => 'VIS'],
            ['code' => '110000000', 'name' => 'Davao Region', 'region_number' => 'Region XI', 'acronym' => 'DAVAO', 'island_code' => 'MIN'],
        ];

        foreach ($regions as $region) {
            Region::updateOrCreate(['code' => $region['code']], $region);
        }

        // 3. Seed Provinces
        $provinces = [
            // NCR
            ['code' => '133900000', 'name' => 'Metro Manila', 'region_code' => '130000000'],
            // CALABARZON
            ['code' => '042100000', 'name' => 'Cavite', 'region_code' => '040000000'],
            ['code' => '043400000', 'name' => 'Laguna', 'region_code' => '040000000'],
            ['code' => '045800000', 'name' => 'Rizal', 'region_code' => '040000000'],
            // Central Visayas
            ['code' => '072200000', 'name' => 'Cebu', 'region_code' => '070000000'],
            // Davao Region
            ['code' => '112400000', 'name' => 'Davao del Sur', 'region_code' => '110000000'],
        ];

        foreach ($provinces as $province) {
            Province::updateOrCreate(['code' => $province['code']], $province);
        }

        // 4. Seed Cities / Municipalities
        $cities = [
            // Metro Manila
            ['code' => '133901000', 'name' => 'Manila', 'zip_code' => '1000', 'province_code' => '133900000', 'region_code' => '130000000'],
            ['code' => '133902000', 'name' => 'Quezon City', 'zip_code' => '1100', 'province_code' => '133900000', 'region_code' => '130000000'],
            
            // Cavite
            ['code' => '042101000', 'name' => 'Bacoor', 'zip_code' => '4102', 'province_code' => '042100000', 'region_code' => '040000000'],
            ['code' => '042102000', 'name' => 'Imus', 'zip_code' => '4103', 'province_code' => '042100000', 'region_code' => '040000000'],
            ['code' => '042103000', 'name' => 'Dasmariñas', 'zip_code' => '4114', 'province_code' => '042100000', 'region_code' => '040000000'],

            // Laguna
            ['code' => '043401000', 'name' => 'Calamba', 'zip_code' => '4027', 'province_code' => '043400000', 'region_code' => '040000000'],
            ['code' => '043402000', 'name' => 'Los Baños', 'zip_code' => '4030', 'province_code' => '043400000', 'region_code' => '040000000'],
            ['code' => '043403000', 'name' => 'Santa Rosa', 'zip_code' => '4026', 'province_code' => '043400000', 'region_code' => '040000000'],

            // Rizal
            ['code' => '045801000', 'name' => 'Antipolo', 'zip_code' => '1870', 'province_code' => '045800000', 'region_code' => '040000000'],

            // Cebu
            ['code' => '072201000', 'name' => 'Cebu City', 'zip_code' => '6000', 'province_code' => '072200000', 'region_code' => '070000000'],

            // Davao
            ['code' => '112401000', 'name' => 'Davao City', 'zip_code' => '8000', 'province_code' => '112400000', 'region_code' => '110000000'],
        ];

        foreach ($cities as $city) {
            City::updateOrCreate(['code' => $city['code']], $city);
        }

        // 5. Seed Barangays
        $barangays = [
            // Manila
            ['code' => '133901001', 'name' => 'Intramuros', 'city_code' => '133901000', 'province_code' => '133900000'],
            ['code' => '133901002', 'name' => 'Binondo', 'city_code' => '133901000', 'province_code' => '133900000'],
            
            // Quezon City
            ['code' => '133902001', 'name' => 'Batasan Hills', 'city_code' => '133902000', 'province_code' => '133900000'],
            ['code' => '133902002', 'name' => 'Diliman', 'city_code' => '133902000', 'province_code' => '133900000'],

            // Calamba
            ['code' => '043401001', 'name' => 'Poblacion Real', 'city_code' => '043401000', 'province_code' => '043400000'],
            ['code' => '043401002', 'name' => 'Bucal', 'city_code' => '043401000', 'province_code' => '043400000'],
            ['code' => '043401003', 'name' => 'Pansol', 'city_code' => '043401000', 'province_code' => '043400000'],

            // Los Banos
            ['code' => '043402001', 'name' => 'Batong Malake', 'city_code' => '043402000', 'province_code' => '043400000'],
            ['code' => '043402002', 'name' => 'Poblacion', 'city_code' => '043402000', 'province_code' => '043400000'],

            // Cebu City
            ['code' => '072201001', 'name' => 'Lahug', 'city_code' => '072201000', 'province_code' => '072200000'],
            ['code' => '072201002', 'name' => 'Mabolo', 'city_code' => '072201000', 'province_code' => '072200000'],

            // Davao City
            ['code' => '112401001', 'name' => 'Buhangin', 'city_code' => '112401000', 'province_code' => '112400000'],
            ['code' => '112401002', 'name' => 'Talomo', 'city_code' => '112401000', 'province_code' => '112400000'],
        ];

        foreach ($barangays as $barangay) {
            Barangay::updateOrCreate(['code' => $barangay['code']], $barangay);
        }
    }
}
