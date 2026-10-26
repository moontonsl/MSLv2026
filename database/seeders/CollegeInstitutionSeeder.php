<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class CollegeInstitutionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jsonPath = base_path('database/data/colleges.json');
        if (!File::exists($jsonPath)) {
            $this->command->error('colleges.json not found!');
            return;
        }

        $colleges = json_decode(File::get($jsonPath), true);
        $timestamp = now();

        $commonAcronyms = [
            'De La Salle University' => 'DLSU',
            'De La Salle-College of Saint Benilde' => 'DLS-CSB CSB',
            'De La Salle–College of Saint Benilde' => 'DLS-CSB CSB',
            'De La Salle University – Dasmariñas' => 'DLSU-D',
            'De La Salle Lipa' => 'DLSL',
            'University of Santo Tomas' => 'UST',
            'Ateneo de Manila University' => 'ADMU',
            'Ateneo de Davao University' => 'ADDU',
            'Ateneo de Naga University' => 'ADNU',
            'Ateneo de Zamboanga University' => 'ADZU',
            'University of the Philippines' => 'UP',
            'University of the Philippines Diliman' => 'UPD UP',
            'University of the Philippines Manila' => 'UPM UP',
            'University of the Philippines Los Baños' => 'UPLB UP',
            'University of the Philippines Visayas' => 'UPV UP',
            'Polytechnic University of the Philippines' => 'PUP',
            'Far Eastern University' => 'FEU',
            'University of the East' => 'UE',
            'Technological Institute of the Philippines' => 'TIP',
            'Technological University of the Philippines' => 'TUP',
            'Mapúa University' => 'MU MAPUA',
            'Mapúa Malayan Colleges Laguna' => 'MMCL MCL MAPUA',
            'Mapúa Malayan Colleges Mindanao' => 'MMCM MCM MAPUA',
            'Pamantasan ng Lungsod ng Maynila' => 'PLM',
            'Pamantasan ng Lungsod ng Marikina' => 'PLMAR',
            'Pamantasan ng Lungsod ng Pasig' => 'PLP',
            'Pamantasan ng Lungsod ng Muntinlupa' => 'PLMUN',
            'Pamantasan ng Lungsod ng Valenzuela' => 'PLV',
            'University of Makati' => 'UMAK',
            'Universidad de Manila' => 'UDM',
            'National University' => 'NU',
            'Lyceum of the Philippines University' => 'LPU',
            'Adamson University' => 'AdU',
            'San Beda University' => 'SBU',
            'Saint Louis University' => 'SLU',
            'University of San Carlos' => 'USC',
            'University of San Jose-Recoletos' => 'USJ-R',
            'Central Philippine University' => 'CPU',
            'Silliman University' => 'SU',
            'Xavier University - Ateneo de Cagayan' => 'XU',
            'Mindanao State University' => 'MSU',
            'Central Luzon State University' => 'CLSU',
            'Rizal Technological University' => 'RTU',
            'Eulogio "Amang" Rodriguez Institute of Science and Technology' => 'EARIST',
            'Bicol University' => 'BU',
            'West Visayas State University' => 'WVSU',
            'Cebu Technological University' => 'CTU',
            'Cebu Normal University' => 'CNU',
            'New Era University' => 'NEU',
            'Emilio Aguinaldo College' => 'EAC',
            'Centro Escolar University' => 'CEU',
            'Miriam College' => 'MC',
            'Trinity University of Asia' => 'TUA',
            'Philippine Normal University' => 'PNU',
            'Philippine Christian University' => 'PCU',
            'Philippine Women\'s University' => 'PWU',
            'Laguna University' => 'LU',
            'City College of Calamba' => 'CCC',
            'Pamantasan ng Cabuyao' => 'PnC',
            'Dalubhasaan ng Lungsod ng San Pablo' => 'DLSP',
            'Kolehiyo ng Lungsod ng Lipa' => 'KLL',
            'Tanauan City College' => 'TCC',
            'Gordon College' => 'GC',
            'Bataan Peninsula State University' => 'BPSU',
            'Quezon City University' => 'QCU',
            'Taguig City University' => 'TCU',
            'University of Caloocan City' => 'UCC',
            'City University of Pasay' => 'CUP',
            'Bulacan Polytechnic College' => 'BPC',
            'Urdaneta City University' => 'UCU',
        ];

        // 1. Explicit prominent Local Universities and Colleges (LUCs) & specialized colleges
        $explicitLucs = [
            ['name' => 'Laguna University', 'acronym' => 'LU', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'City College of Calamba', 'acronym' => 'CCC', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Dalubhasaan ng Lungsod ng San Pablo', 'acronym' => 'DLSP', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Pamantasan ng Cabuyao', 'acronym' => 'PnC', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Kolehiyo ng Lungsod ng Lipa', 'acronym' => 'KLL', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Tanauan City College', 'acronym' => 'TCC', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'City College of Tagaytay', 'acronym' => 'CCT', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Cavite City College', 'acronym' => 'CCC', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Trece Martires City College', 'acronym' => 'TMCC', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Bacoor City College', 'acronym' => 'BCC', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Colegio de Montalban', 'acronym' => 'CdM', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'San Mateo Municipal College', 'acronym' => 'SMMC', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Antipolo Institute of Technology', 'acronym' => 'AiTech', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Batangas Eastern Colleges', 'acronym' => 'BEC', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Pagsanjan College', 'acronym' => '', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'San Pablo Colleges', 'acronym' => 'SPC', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Canossa College San Pablo', 'acronym' => 'CCSP', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Calamba Doctors\' College', 'acronym' => 'CDC', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'St. Vincent College of Cabuyao', 'acronym' => 'SVCC', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Gordon College', 'acronym' => 'GC', 'region' => 'Region III', 'island' => 'Luzon'],
            ['name' => 'Mabalacat City College', 'acronym' => 'MCC', 'region' => 'Region III', 'island' => 'Luzon'],
            ['name' => 'City College of Angeles', 'acronym' => 'CCA', 'region' => 'Region III', 'island' => 'Luzon'],
            ['name' => 'City College of San Fernando', 'acronym' => 'CCSF', 'region' => 'Region III', 'island' => 'Luzon'],
            ['name' => 'Bulacan Polytechnic College', 'acronym' => 'BPC', 'region' => 'Region III', 'island' => 'Luzon'],
            ['name' => 'Norzagaray College', 'acronym' => 'NC', 'region' => 'Region III', 'island' => 'Luzon'],
            ['name' => 'Baliwag Polytechnic College', 'acronym' => 'BPoly', 'region' => 'Region III', 'island' => 'Luzon'],
            ['name' => 'Guagua Community College', 'acronym' => 'GCC', 'region' => 'Region III', 'island' => 'Luzon'],
            ['name' => 'Kolehiyo ng Subic', 'acronym' => 'KnS', 'region' => 'Region III', 'island' => 'Luzon'],
            ['name' => 'City College of San Jose del Monte', 'acronym' => 'CCSJDM', 'region' => 'Region III', 'island' => 'Luzon'],
            ['name' => 'Quezon City University', 'acronym' => 'QCU', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Navotas Polytechnic College', 'acronym' => 'NPC', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Taguig City University', 'acronym' => 'TCU', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'City University of Pasay', 'acronym' => 'CUP', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'City of Malabon University', 'acronym' => 'CMU', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'University of Caloocan City', 'acronym' => 'UCC', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Pateros Technological College', 'acronym' => 'PTC', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Valenzuela City Polytechnic College', 'acronym' => 'VCPC', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Urdaneta City University', 'acronym' => 'UCU', 'region' => 'Region I', 'island' => 'Luzon'],
            ['name' => 'Binalatongan Community College', 'acronym' => 'BCC', 'region' => 'Region I', 'island' => 'Luzon'],
            ['name' => 'Pangasinan Polytechnic College', 'acronym' => 'PPC', 'region' => 'Region I', 'island' => 'Luzon'],
            ['name' => 'Mandaue City College', 'acronym' => 'MCC', 'region' => 'Region VII', 'island' => 'Visayas'],
            ['name' => 'Lapu-Lapu City College', 'acronym' => 'LLCC', 'region' => 'Region VII', 'island' => 'Visayas'],
            ['name' => 'Talisay City College', 'acronym' => 'TCC', 'region' => 'Region VII', 'island' => 'Visayas'],
            ['name' => 'Carcar City College', 'acronym' => 'CCC', 'region' => 'Region VII', 'island' => 'Visayas'],
            ['name' => 'Toledo City College', 'acronym' => 'TCC', 'region' => 'Region VII', 'island' => 'Visayas'],
            ['name' => 'Cordova Public College', 'acronym' => 'CPC', 'region' => 'Region VII', 'island' => 'Visayas'],
            ['name' => 'Consolacion Community College', 'acronym' => 'CCC', 'region' => 'Region VII', 'island' => 'Visayas'],
            ['name' => 'Tagum City College', 'acronym' => 'TCC', 'region' => 'Region XI', 'island' => 'Mindanao'],
        ];

        // 2. Query basic_education_institutions for all tertiary entities (SUCs, LUCs, Colleges, Universities)
        $depedColleges = DB::table('basic_education_institutions')
            ->where(function ($q) {
                $q->where('school_name', 'LIKE', '%University%')
                    ->orWhere('school_name', 'LIKE', '%College%')
                    ->orWhere('school_name', 'LIKE', '%Colleges%')
                    ->orWhere('school_name', 'LIKE', '%Pamantasan%')
                    ->orWhere('school_name', 'LIKE', '%Dalubhasaan%')
                    ->orWhere('school_name', 'LIKE', '%Kolehiyo%')
                    ->orWhere('school_name', 'LIKE', '%Polytechnic%')
                    ->orWhere('school_name', 'LIKE', '%Institute of Technology%')
                    ->orWhere('sector', 'suc_luc');
            })
            ->where('school_name', 'NOT LIKE', '%Elementary%')
            ->where('school_name', 'NOT LIKE', '%Nursery%')
            ->where('school_name', 'NOT LIKE', '%Kindergarten%')
            ->where('school_name', 'NOT LIKE', '%Preparatory%')
            ->where('school_name', 'NOT LIKE', '%Primary%')
            ->select('school_name', 'region')
            ->distinct()
            ->get();

        $allEntries = [];

        // Add 649 HEIs from colleges.json
        foreach ($colleges as $college) {
            $name = trim($college['name'] ?? '');
            if (empty($name)) {
                continue;
            }

            $acronym = $commonAcronyms[$name] ?? ($college['acronym'] ?? null);
            $region = $college['region'] ?? 'NCR';

            $allEntries[$name] = [
                'name' => mb_substr($name, 0, 255),
                'acronym' => $acronym ? mb_substr($acronym, 0, 50) : null,
                'region' => $region,
                'island' => $college['island'] ?? $this->resolveIsland($region),
                'status' => 'active',
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ];
        }

        // Add explicit LUCs
        foreach ($explicitLucs as $luc) {
            $name = trim($luc['name']);
            $allEntries[$name] = [
                'name' => mb_substr($name, 0, 255),
                'acronym' => !empty($luc['acronym']) ? mb_substr($luc['acronym'], 0, 50) : null,
                'region' => $luc['region'],
                'island' => $luc['island'],
                'status' => 'active',
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ];
        }

        // Add DepEd Colleges/Universities/LUCs/SUCs
        foreach ($depedColleges as $item) {
            $rawName = trim($item->school_name);
            // Clean common secondary department suffixes
            $cleanName = preg_replace('/\s*[-–]\s*(Senior High School|Junior High School|High School Department|High School|SHS|JHS|Basic Education.*)$/i', '', $rawName);
            $cleanName = preg_replace('/\s+(Laboratory High School|Special Science High School|Special Science HS)$/i', '', $cleanName);
            $cleanName = trim($cleanName);

            if (empty($cleanName) || isset($allEntries[$cleanName])) {
                continue;
            }

            $acronym = $commonAcronyms[$cleanName] ?? null;
            $region = $item->region ?: 'NCR';

            $allEntries[$cleanName] = [
                'name' => mb_substr($cleanName, 0, 255),
                'acronym' => $acronym ? mb_substr($acronym, 0, 50) : null,
                'region' => $region,
                'island' => $this->resolveIsland($region),
                'status' => 'active',
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ];
        }

        // Upsert into institutions table in batches
        $batch = [];
        foreach ($allEntries as $entry) {
            $batch[] = $entry;

            if (count($batch) >= 100) {
                DB::table('institutions')->upsert(
                    $batch,
                    ['name'],
                    ['acronym', 'region', 'island', 'status', 'updated_at']
                );
                $batch = [];
            }
        }

        if (!empty($batch)) {
            DB::table('institutions')->upsert(
                $batch,
                ['name'],
                ['acronym', 'region', 'island', 'status', 'updated_at']
            );
        }

        $count = DB::table('institutions')->count();
        $this->command->info("Successfully seeded {$count} Higher Education Institutions (including SUCs & LUCs) into 'institutions' table.");
    }

    /**
     * Resolve island group from Philippine administrative region.
     */
    private function resolveIsland(string $region): string
    {
        $reg = strtoupper(trim($region));

        if (in_array($reg, ['NCR', 'CAR', 'REGION I', 'REGION II', 'REGION III', 'REGION IV-A', 'REGION IV-B', 'REGION V', 'CALABARZON', 'MIMAROPA', 'BICOL'], true)) {
            return 'Luzon';
        }

        if (in_array($reg, ['REGION VI', 'REGION VII', 'REGION VIII', 'WESTERN VISAYAS', 'CENTRAL VISAYAS', 'EASTERN VISAYAS'], true)) {
            return 'Visayas';
        }

        return 'Mindanao';
    }
}
