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

        // Add prominent branch campuses (NU, Letran, UST, DLSU, FEU, LPU, Mapua, OLFU, UPH, BatStateU, CvSU, BulSU, PHINMA, etc.)
        $majorBranches = [
            ['name' => 'National University - Manila', 'acronym' => 'NU NU-Manila', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'National University - Fairview', 'acronym' => 'NU NU-FV NU-Fairview', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'National University - Mall of Asia', 'acronym' => 'NU NU-MOA MOA', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'National University - East Ortigas', 'acronym' => 'NU NU-EO', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'National University - Baliwag', 'acronym' => 'NU NU-Baliwag', 'region' => 'Region III', 'island' => 'Luzon'],
            ['name' => 'National University - Clark', 'acronym' => 'NU NU-Clark', 'region' => 'Region III', 'island' => 'Luzon'],
            ['name' => 'National University - Laguna', 'acronym' => 'NU NU-Laguna', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'National University - Lipa', 'acronym' => 'NU NU-Lipa', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'National University - Dasmariñas', 'acronym' => 'NU NU-Dasma NU-Dasmariñas', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'National University - Bacolod', 'acronym' => 'NU NU-Bacolod', 'region' => 'Region VI', 'island' => 'Visayas'],
            ['name' => 'National University - Cebu', 'acronym' => 'NU NU-Cebu', 'region' => 'Region VII', 'island' => 'Visayas'],
            ['name' => 'Nazareth School of National University', 'acronym' => 'NMS NU-Nazareth', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Colegio de San Juan de Letran - Manila', 'acronym' => 'CSJL Letran', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Colegio de San Juan de Letran - Calamba', 'acronym' => 'CSJL-C Letran', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Colegio de San Juan de Letran - Bataan', 'acronym' => 'CSJL-B Letran', 'region' => 'Region III', 'island' => 'Luzon'],
            ['name' => 'Colegio de San Juan de Letran - Manaoag', 'acronym' => 'CSJL-M Letran', 'region' => 'Region I', 'island' => 'Luzon'],
            ['name' => 'University of Santo Tomas - Manila', 'acronym' => 'UST', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'University of Santo Tomas - General Santos', 'acronym' => 'UST UST-GenSan', 'region' => 'Region XII', 'island' => 'Mindanao'],
            ['name' => 'University of Santo Tomas - Legazpi', 'acronym' => 'UST UST-Legazpi', 'region' => 'Region V', 'island' => 'Luzon'],
            ['name' => 'UST Angelicum College', 'acronym' => 'UST-AC Angelicum', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'De La Salle University - Manila', 'acronym' => 'DLSU', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'De La Salle University - Laguna Campus', 'acronym' => 'DLSU-Laguna DLSU', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'De La Salle-College of Saint Benilde', 'acronym' => 'DLS-CSB CSB Benilde', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'De La Salle University – Dasmariñas', 'acronym' => 'DLSU-D DLSU', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'De La Salle Lipa', 'acronym' => 'DLSL', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'De La Salle Medical and Health Sciences Institute', 'acronym' => 'DLSMHSI DLS-HSI', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'De La Salle Araneta University', 'acronym' => 'DLSAU', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Far Eastern University - Manila', 'acronym' => 'FEU', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Far Eastern University - Diliman', 'acronym' => 'FEU FEU-Diliman', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Far Eastern University - Alabang', 'acronym' => 'FEU FEU-Alabang', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Far Eastern University - Cavite', 'acronym' => 'FEU FEU-Cavite', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'FEU Institute of Technology', 'acronym' => 'FEU-Tech FEU', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'FEU Roosevelt - Cainta', 'acronym' => 'FEU-Roosevelt', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'FEU Roosevelt - Marikina', 'acronym' => 'FEU-Roosevelt', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'FEU Roosevelt - Rodriguez', 'acronym' => 'FEU-Roosevelt', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Lyceum of the Philippines University - Manila', 'acronym' => 'LPU LPU-Manila', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Lyceum of the Philippines University - Makati', 'acronym' => 'LPU LPU-Makati', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Lyceum of the Philippines University - Batangas', 'acronym' => 'LPU LPU-Batangas', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Lyceum of the Philippines University - Laguna', 'acronym' => 'LPU LPU-Laguna', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Lyceum of the Philippines University - Cavite', 'acronym' => 'LPU LPU-Cavite', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Lyceum of the Philippines University - Davao', 'acronym' => 'LPU LPU-Davao', 'region' => 'Region XI', 'island' => 'Mindanao'],
            ['name' => 'University of the East - Manila', 'acronym' => 'UE UE-Manila', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'University of the East - Caloocan', 'acronym' => 'UE UE-Caloocan', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Mapúa University - Manila', 'acronym' => 'MU MAPUA', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Mapúa University - Makati', 'acronym' => 'MU MAPUA', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Mapúa Malayan Colleges Laguna', 'acronym' => 'MMCL MCL MAPUA', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Mapúa Malayan Colleges Mindanao', 'acronym' => 'MMCM MCM MAPUA', 'region' => 'Region XI', 'island' => 'Mindanao'],
            ['name' => 'Our Lady of Fatima University - Valenzuela', 'acronym' => 'OLFU', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Our Lady of Fatima University - Quezon City', 'acronym' => 'OLFU', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Our Lady of Fatima University - Antipolo', 'acronym' => 'OLFU', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Our Lady of Fatima University - Pampanga', 'acronym' => 'OLFU', 'region' => 'Region III', 'island' => 'Luzon'],
            ['name' => 'Our Lady of Fatima University - Cabanatuan', 'acronym' => 'OLFU', 'region' => 'Region III', 'island' => 'Luzon'],
            ['name' => 'Our Lady of Fatima University - Laguna (Santa Rosa)', 'acronym' => 'OLFU', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'University of Perpetual Help System DALTA - Las Piñas', 'acronym' => 'UPHSD UPH', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'University of Perpetual Help System DALTA - Molino', 'acronym' => 'UPHSD UPH', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'University of Perpetual Help System DALTA - Calamba', 'acronym' => 'UPHSD UPH', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'University of Perpetual Help System Laguna - Biñan', 'acronym' => 'UPHSL UPH', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'San Beda University - Manila', 'acronym' => 'SBU', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'San Beda College - Alabang', 'acronym' => 'SBCA SBU', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'San Beda College - Taytay (Rizal)', 'acronym' => 'SBU', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Batangas State University - Pablo Borbon (Main Campus)', 'acronym' => 'BatStateU BSU', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Batangas State University - Alangilan', 'acronym' => 'BatStateU BSU', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Batangas State University - Lipa', 'acronym' => 'BatStateU BSU', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Batangas State University - Malvar', 'acronym' => 'BatStateU BSU', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Batangas State University - Nasugbu (ARASOF)', 'acronym' => 'BatStateU BSU', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Batangas State University - Balayan', 'acronym' => 'BatStateU BSU', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Batangas State University - Lemery', 'acronym' => 'BatStateU BSU', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Batangas State University - Rosario', 'acronym' => 'BatStateU BSU', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Batangas State University - San Juan', 'acronym' => 'BatStateU BSU', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Batangas State University - Lobo', 'acronym' => 'BatStateU BSU', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Batangas State University - Mabini', 'acronym' => 'BatStateU BSU', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Cavite State University - Main Campus (Indang)', 'acronym' => 'CvSU', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Cavite State University - Bacoor', 'acronym' => 'CvSU', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Cavite State University - Carmona', 'acronym' => 'CvSU', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Cavite State University - Cavite City', 'acronym' => 'CvSU', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Cavite State University - General Trias', 'acronym' => 'CvSU', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Cavite State University - Imus', 'acronym' => 'CvSU', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Cavite State University - Maragondon', 'acronym' => 'CvSU', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Cavite State University - Naic', 'acronym' => 'CvSU', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Cavite State University - Rosario', 'acronym' => 'CvSU', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Cavite State University - Silang', 'acronym' => 'CvSU', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Cavite State University - Tanza', 'acronym' => 'CvSU', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Cavite State University - Trece Martires', 'acronym' => 'CvSU', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Bulacan State University - Main Campus (Malolos)', 'acronym' => 'BulSU', 'region' => 'Region III', 'island' => 'Luzon'],
            ['name' => 'Bulacan State University - Bustos', 'acronym' => 'BulSU', 'region' => 'Region III', 'island' => 'Luzon'],
            ['name' => 'Bulacan State University - Sarmiento (San Jose del Monte)', 'acronym' => 'BulSU', 'region' => 'Region III', 'island' => 'Luzon'],
            ['name' => 'Bulacan State University - Meneses (Bulakan)', 'acronym' => 'BulSU', 'region' => 'Region III', 'island' => 'Luzon'],
            ['name' => 'Bulacan State University - Hagonoy', 'acronym' => 'BulSU', 'region' => 'Region III', 'island' => 'Luzon'],
            ['name' => 'Bulacan State University - Pulilan', 'acronym' => 'BulSU', 'region' => 'Region III', 'island' => 'Luzon'],
            ['name' => 'Bulacan State University - San Rafael', 'acronym' => 'BulSU', 'region' => 'Region III', 'island' => 'Luzon'],
            ['name' => 'PHINMA Araullo University - Cabanatuan', 'acronym' => 'PHINMA AU', 'region' => 'Region III', 'island' => 'Luzon'],
            ['name' => 'PHINMA Araullo University - San Jose', 'acronym' => 'PHINMA AU', 'region' => 'Region III', 'island' => 'Luzon'],
            ['name' => 'PHINMA Cagayan de Oro College', 'acronym' => 'PHINMA COC', 'region' => 'Region X', 'island' => 'Mindanao'],
            ['name' => 'PHINMA University of Pangasinan - Dagupan', 'acronym' => 'PHINMA UPang', 'region' => 'Region I', 'island' => 'Luzon'],
            ['name' => 'PHINMA University of Pangasinan - Urdaneta', 'acronym' => 'PHINMA UPang', 'region' => 'Region I', 'island' => 'Luzon'],
            ['name' => 'PHINMA University of Iloilo', 'acronym' => 'PHINMA UI', 'region' => 'Region VI', 'island' => 'Visayas'],
            ['name' => 'PHINMA Southwestern University', 'acronym' => 'PHINMA SWU', 'region' => 'Region VII', 'island' => 'Visayas'],
            ['name' => 'PHINMA Saint Jude College - Manila', 'acronym' => 'PHINMA SJC', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'PHINMA Saint Jude College - Quezon City', 'acronym' => 'PHINMA SJC', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'PHINMA Rizal College of Laguna', 'acronym' => 'PHINMA RCL', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'PHINMA Union College of Laguna', 'acronym' => 'PHINMA UCL', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'University of the Philippines Diliman', 'acronym' => 'UPD UP', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'University of the Philippines Manila', 'acronym' => 'UPM UP', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'University of the Philippines Los Baños', 'acronym' => 'UPLB UP', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'University of the Philippines Visayas', 'acronym' => 'UPV UP', 'region' => 'Region VI', 'island' => 'Visayas'],
            ['name' => 'University of the Philippines Baguio', 'acronym' => 'UPB UP', 'region' => 'CAR', 'island' => 'Luzon'],
            ['name' => 'University of the Philippines Mindanao', 'acronym' => 'UPMin UP', 'region' => 'Region XI', 'island' => 'Mindanao'],
            ['name' => 'University of the Philippines Cebu', 'acronym' => 'UPC UP', 'region' => 'Region VII', 'island' => 'Visayas'],
            ['name' => 'University of the Philippines Open University', 'acronym' => 'UPOU UP', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'University of the Philippines Tacloban', 'acronym' => 'UPTC UP', 'region' => 'Region VIII', 'island' => 'Visayas'],
            ['name' => 'Ateneo de Manila University', 'acronym' => 'ADMU', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Ateneo de Davao University', 'acronym' => 'ADDU', 'region' => 'Region XI', 'island' => 'Mindanao'],
            ['name' => 'Ateneo de Naga University', 'acronym' => 'ADNU', 'region' => 'Region V', 'island' => 'Luzon'],
            ['name' => 'Ateneo de Zamboanga University', 'acronym' => 'ADZU', 'region' => 'Region IX', 'island' => 'Mindanao'],
            ['name' => 'Xavier University - Ateneo de Cagayan', 'acronym' => 'XU Ateneo', 'region' => 'Region X', 'island' => 'Mindanao'],
            ['name' => 'Technological University of the Philippines - Manila', 'acronym' => 'TUP TUP-Manila', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Technological University of the Philippines - Taguig', 'acronym' => 'TUP TUP-Taguig', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Technological University of the Philippines - Cavite', 'acronym' => 'TUP TUP-Cavite', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Technological University of the Philippines - Visayas', 'acronym' => 'TUP TUP-Visayas', 'region' => 'Region VI', 'island' => 'Visayas'],
            ['name' => 'Centro Escolar University - Manila', 'acronym' => 'CEU CEU-Manila', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Centro Escolar University - Malolos', 'acronym' => 'CEU CEU-Malolos', 'region' => 'Region III', 'island' => 'Luzon'],
            ['name' => 'Centro Escolar University - Makati', 'acronym' => 'CEU CEU-Makati', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Quezon City University - San Bartolome (Main)', 'acronym' => 'QCU', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Quezon City University - San Francisco', 'acronym' => 'QCU', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Quezon City University - Batasan', 'acronym' => 'QCU', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'University of Caloocan City - South Campus (Biglang Awa)', 'acronym' => 'UCC', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'University of Caloocan City - North Campus (Camarin)', 'acronym' => 'UCC', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'University of Caloocan City - Congressional', 'acronym' => 'UCC', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'University of Caloocan City - Bagong Silang', 'acronym' => 'UCC', 'region' => 'NCR', 'island' => 'Luzon'],
        ];

        $campusesJsonPath = base_path('database/data/philippine_campuses.json');
        if (File::exists($campusesJsonPath)) {
            $extraCampuses = json_decode(File::get($campusesJsonPath), true);
            if (is_array($extraCampuses)) {
                $majorBranches = array_merge($majorBranches, $extraCampuses);
            }
        }

        foreach ($majorBranches as $branch) {
            $name = trim($branch['name']);
            $allEntries[$name] = [
                'name' => mb_substr($name, 0, 255),
                'acronym' => !empty($branch['acronym']) ? mb_substr($branch['acronym'], 0, 50) : null,
                'region' => $branch['region'],
                'island' => $branch['island'],
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
