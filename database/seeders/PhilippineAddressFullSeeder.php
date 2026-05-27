<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use App\Models\Island;
use App\Models\Region;
use App\Models\Province;
use App\Models\City;
use App\Models\Barangay;

class PhilippineAddressFullSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ini_set('memory_limit', '512M');
        set_time_limit(0);

        $this->command->info('Seeding Islands...');
        $islands = [
            ['code' => 'LUZ', 'name' => 'Luzon'],
            ['code' => 'VIS', 'name' => 'Visayas'],
            ['code' => 'MIN', 'name' => 'Mindanao'],
        ];
        foreach ($islands as $island) {
            Island::updateOrCreate(['code' => $island['code']], $island);
        }

        // Helper to determine Island code by region code prefix
        $getIslandCode = function($regCode) {
            $luzonRegions = ['01', '02', '03', '04', '05', '13', '14', '17'];
            $visayasRegions = ['06', '07', '08'];
            return in_array($regCode, $luzonRegions) ? 'LUZ' : (in_array($visayasRegions, $luzonRegions) ? 'VIS' : 'MIN');
        };

        // 1. Regions
        $this->command->info('Downloading and seeding Regions...');
        $regionsCsv = Http::get('https://raw.githubusercontent.com/clavearnel/philippines-region-province-citymun-brgy/master/csv/refregion.csv')->body();
        $lines = explode("\n", str_replace("\r", "", $regionsCsv));
        // Skip header
        $header = array_shift($lines);
        foreach ($lines as $line) {
            if (empty($line)) continue;
            $row = str_getcsv($line);
            if (count($row) < 4) continue;
            
            $psgcCode = trim($row[1], '" ');
            $regDesc = trim($row[2], '" ');
            $regCode = trim($row[3], '" ');

            // Parse acronym and number from: REGION I (ILOCOS REGION)
            $acronym = $regCode;
            $regionNumber = $regCode;
            if (preg_match('/^(REGION\s+[IVXLCDM]+|[A-Za-z0-9\-]+)\s*\((.+)\)$/i', $regDesc, $matches)) {
                $regionNumber = trim($matches[1]);
                $acronym = trim($matches[2]);
            }

            Region::updateOrCreate(['code' => $psgcCode], [
                'name' => $regDesc,
                'region_number' => $regionNumber,
                'acronym' => $acronym,
                'island_code' => $getIslandCode($regCode),
            ]);
        }

        // 2. Provinces
        $this->command->info('Downloading and seeding Provinces...');
        $provincesCsv = Http::get('https://raw.githubusercontent.com/clavearnel/philippines-region-province-citymun-brgy/master/csv/refprovince.csv')->body();
        $lines = explode("\n", str_replace("\r", "", $provincesCsv));
        array_shift($lines);
        foreach ($lines as $line) {
            if (empty($line)) continue;
            $row = str_getcsv($line);
            if (count($row) < 5) continue;

            $psgcCode = trim($row[1], '" ');
            $provDesc = trim($row[2], '" ');
            $regCode = trim($row[3], '" ');

            Province::updateOrCreate(['code' => $psgcCode], [
                'name' => ucwords(strtolower($provDesc)),
                'region_code' => str_pad($regCode, 9, '0', STR_PAD_RIGHT),
            ]);
        }

        // 3. Cities
        $this->command->info('Downloading and seeding Cities...');
        $citiesCsv = Http::get('https://raw.githubusercontent.com/clavearnel/philippines-region-province-citymun-brgy/master/csv/refcitymun.csv')->body();
        $lines = explode("\n", str_replace("\r", "", $citiesCsv));
        array_shift($lines);
        
        $citiesData = [];
        foreach ($lines as $line) {
            if (empty($line)) continue;
            $row = str_getcsv($line);
            if (count($row) < 6) continue;

            $psgcCode = trim($row[1], '" ');
            $cityDesc = trim($row[2], '" ');
            $regCode = trim($row[3], '" ');
            $provCode = trim($row[4], '" ');
            
            // Simple mapping for zip codes for prominent cities
            $zipCode = null;
            $lowerName = strtolower($cityDesc);
            if ($lowerName === 'manila') $zipCode = '1000';
            elseif ($lowerName === 'quezon city') $zipCode = '1100';
            elseif ($lowerName === 'calamba') $zipCode = '4027';
            elseif ($lowerName === 'cebu city') $zipCode = '6000';
            elseif ($lowerName === 'davao city') $zipCode = '8000';

            $citiesData[] = [
                'code' => $psgcCode,
                'name' => ucwords(strtolower($cityDesc)),
                'zip_code' => $zipCode,
                'province_code' => !empty($provCode) ? str_pad($provCode, 9, '0', STR_PAD_RIGHT) : null,
                'region_code' => str_pad($regCode, 9, '0', STR_PAD_RIGHT),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        
        // Chunk insert cities for speed
        foreach (array_chunk($citiesData, 500) as $chunk) {
            DB::table('cities')->insertOrIgnore($chunk);
        }

        // 4. Barangays
        $this->command->info('Downloading and seeding Barangays (this may take a few seconds)...');
        $brgysCsv = Http::get('https://raw.githubusercontent.com/clavearnel/philippines-region-province-citymun-brgy/master/csv/refbrgy.csv')->body();
        $lines = explode("\n", str_replace("\r", "", $brgysCsv));
        array_shift($lines);

        $barangaysData = [];
        foreach ($lines as $line) {
            if (empty($line)) continue;
            $row = str_getcsv($line);
            if (count($row) < 6) continue;

            $brgyCode = trim($row[1], '" ');
            $brgyDesc = trim($row[2], '" ');
            $provCode = trim($row[4], '" ');
            $cityCode = trim($row[5], '" ');

            $barangaysData[] = [
                'code' => $brgyCode,
                'name' => ucwords(strtolower($brgyDesc)),
                'city_code' => str_pad($cityCode, 9, '0', STR_PAD_RIGHT),
                'province_code' => !empty($provCode) ? str_pad($provCode, 9, '0', STR_PAD_RIGHT) : null,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // Chunk insert 1000 at a time
        $this->command->info('Inserting 42,000+ barangays into database...');
        foreach (array_chunk($barangaysData, 1000) as $chunk) {
            DB::table('barangays')->insertOrIgnore($chunk);
        }
        
        $this->command->info('Complete Philippine address seeding completed successfully!');
    }
}
