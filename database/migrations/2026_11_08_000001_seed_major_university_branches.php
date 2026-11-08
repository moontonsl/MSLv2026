<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $timestamp = now();

        $branches = [
            // ==========================================
            // National University (NU) Campuses
            // ==========================================
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

            // ==========================================
            // Colegio de San Juan de Letran
            // ==========================================
            ['name' => 'Colegio de San Juan de Letran - Manila', 'acronym' => 'CSJL Letran', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Colegio de San Juan de Letran - Calamba', 'acronym' => 'CSJL-C Letran', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Colegio de San Juan de Letran - Bataan', 'acronym' => 'CSJL-B Letran', 'region' => 'Region III', 'island' => 'Luzon'],
            ['name' => 'Colegio de San Juan de Letran - Manaoag', 'acronym' => 'CSJL-M Letran', 'region' => 'Region I', 'island' => 'Luzon'],

            // ==========================================
            // University of Santo Tomas (UST)
            // ==========================================
            ['name' => 'University of Santo Tomas - Manila', 'acronym' => 'UST', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'University of Santo Tomas - General Santos', 'acronym' => 'UST UST-GenSan', 'region' => 'Region XII', 'island' => 'Mindanao'],
            ['name' => 'University of Santo Tomas - Legazpi', 'acronym' => 'UST UST-Legazpi', 'region' => 'Region V', 'island' => 'Luzon'],
            ['name' => 'UST Angelicum College', 'acronym' => 'UST-AC Angelicum', 'region' => 'NCR', 'island' => 'Luzon'],

            // ==========================================
            // De La Salle System
            // ==========================================
            ['name' => 'De La Salle University - Manila', 'acronym' => 'DLSU', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'De La Salle University - Laguna Campus', 'acronym' => 'DLSU-Laguna DLSU', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'De La Salle-College of Saint Benilde', 'acronym' => 'DLS-CSB CSB Benilde', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'De La Salle University – Dasmariñas', 'acronym' => 'DLSU-D DLSU', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'De La Salle Lipa', 'acronym' => 'DLSL', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'De La Salle Medical and Health Sciences Institute', 'acronym' => 'DLSMHSI DLS-HSI', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'De La Salle Araneta University', 'acronym' => 'DLSAU', 'region' => 'NCR', 'island' => 'Luzon'],

            // ==========================================
            // Far Eastern University (FEU)
            // ==========================================
            ['name' => 'Far Eastern University - Manila', 'acronym' => 'FEU', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Far Eastern University - Diliman', 'acronym' => 'FEU FEU-Diliman', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Far Eastern University - Alabang', 'acronym' => 'FEU FEU-Alabang', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Far Eastern University - Cavite', 'acronym' => 'FEU FEU-Cavite', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'FEU Institute of Technology', 'acronym' => 'FEU-Tech FEU', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'FEU Roosevelt - Cainta', 'acronym' => 'FEU-Roosevelt', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'FEU Roosevelt - Marikina', 'acronym' => 'FEU-Roosevelt', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'FEU Roosevelt - Rodriguez', 'acronym' => 'FEU-Roosevelt', 'region' => 'Region IV-A', 'island' => 'Luzon'],

            // ==========================================
            // Lyceum of the Philippines University (LPU)
            // ==========================================
            ['name' => 'Lyceum of the Philippines University - Manila', 'acronym' => 'LPU LPU-Manila', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Lyceum of the Philippines University - Makati', 'acronym' => 'LPU LPU-Makati', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Lyceum of the Philippines University - Batangas', 'acronym' => 'LPU LPU-Batangas', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Lyceum of the Philippines University - Laguna', 'acronym' => 'LPU LPU-Laguna', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Lyceum of the Philippines University - Cavite', 'acronym' => 'LPU LPU-Cavite', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Lyceum of the Philippines University - Davao', 'acronym' => 'LPU LPU-Davao', 'region' => 'Region XI', 'island' => 'Mindanao'],

            // ==========================================
            // University of the East (UE)
            // ==========================================
            ['name' => 'University of the East - Manila', 'acronym' => 'UE UE-Manila', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'University of the East - Caloocan', 'acronym' => 'UE UE-Caloocan', 'region' => 'NCR', 'island' => 'Luzon'],

            // ==========================================
            // Mapúa & Malayan Colleges
            // ==========================================
            ['name' => 'Mapúa University - Manila', 'acronym' => 'MU MAPUA', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Mapúa University - Makati', 'acronym' => 'MU MAPUA', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Mapúa Malayan Colleges Laguna', 'acronym' => 'MMCL MCL MAPUA', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Mapúa Malayan Colleges Mindanao', 'acronym' => 'MMCM MCM MAPUA', 'region' => 'Region XI', 'island' => 'Mindanao'],

            // ==========================================
            // Our Lady of Fatima University (OLFU)
            // ==========================================
            ['name' => 'Our Lady of Fatima University - Valenzuela', 'acronym' => 'OLFU', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Our Lady of Fatima University - Quezon City', 'acronym' => 'OLFU', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Our Lady of Fatima University - Antipolo', 'acronym' => 'OLFU', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Our Lady of Fatima University - Pampanga', 'acronym' => 'OLFU', 'region' => 'Region III', 'island' => 'Luzon'],
            ['name' => 'Our Lady of Fatima University - Cabanatuan', 'acronym' => 'OLFU', 'region' => 'Region III', 'island' => 'Luzon'],
            ['name' => 'Our Lady of Fatima University - Laguna (Santa Rosa)', 'acronym' => 'OLFU', 'region' => 'Region IV-A', 'island' => 'Luzon'],

            // ==========================================
            // University of Perpetual Help System (UPH)
            // ==========================================
            ['name' => 'University of Perpetual Help System DALTA - Las Piñas', 'acronym' => 'UPHSD UPH', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'University of Perpetual Help System DALTA - Molino', 'acronym' => 'UPHSD UPH', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'University of Perpetual Help System DALTA - Calamba', 'acronym' => 'UPHSD UPH', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'University of Perpetual Help System Laguna - Biñan', 'acronym' => 'UPHSL UPH', 'region' => 'Region IV-A', 'island' => 'Luzon'],

            // ==========================================
            // San Beda
            // ==========================================
            ['name' => 'San Beda University - Manila', 'acronym' => 'SBU', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'San Beda College - Alabang', 'acronym' => 'SBCA SBU', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'San Beda College - Taytay (Rizal)', 'acronym' => 'SBU', 'region' => 'Region IV-A', 'island' => 'Luzon'],

            // ==========================================
            // Batangas State University (The National Engineering University)
            // ==========================================
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

            // ==========================================
            // Cavite State University (CvSU)
            // ==========================================
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

            // ==========================================
            // Bulacan State University (BulSU)
            // ==========================================
            ['name' => 'Bulacan State University - Main Campus (Malolos)', 'acronym' => 'BulSU', 'region' => 'Region III', 'island' => 'Luzon'],
            ['name' => 'Bulacan State University - Bustos', 'acronym' => 'BulSU', 'region' => 'Region III', 'island' => 'Luzon'],
            ['name' => 'Bulacan State University - Sarmiento (San Jose del Monte)', 'acronym' => 'BulSU', 'region' => 'Region III', 'island' => 'Luzon'],
            ['name' => 'Bulacan State University - Meneses (Bulakan)', 'acronym' => 'BulSU', 'region' => 'Region III', 'island' => 'Luzon'],
            ['name' => 'Bulacan State University - Hagonoy', 'acronym' => 'BulSU', 'region' => 'Region III', 'island' => 'Luzon'],
            ['name' => 'Bulacan State University - Pulilan', 'acronym' => 'BulSU', 'region' => 'Region III', 'island' => 'Luzon'],
            ['name' => 'Bulacan State University - San Rafael', 'acronym' => 'BulSU', 'region' => 'Region III', 'island' => 'Luzon'],

            // ==========================================
            // PHINMA Education Network
            // ==========================================
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

            // ==========================================
            // University of the Philippines (UP System)
            // ==========================================
            ['name' => 'University of the Philippines Diliman', 'acronym' => 'UPD UP', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'University of the Philippines Manila', 'acronym' => 'UPM UP', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'University of the Philippines Los Baños', 'acronym' => 'UPLB UP', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'University of the Philippines Visayas', 'acronym' => 'UPV UP', 'region' => 'Region VI', 'island' => 'Visayas'],
            ['name' => 'University of the Philippines Baguio', 'acronym' => 'UPB UP', 'region' => 'CAR', 'island' => 'Luzon'],
            ['name' => 'University of the Philippines Mindanao', 'acronym' => 'UPMin UP', 'region' => 'Region XI', 'island' => 'Mindanao'],
            ['name' => 'University of the Philippines Cebu', 'acronym' => 'UPC UP', 'region' => 'Region VII', 'island' => 'Visayas'],
            ['name' => 'University of the Philippines Open University', 'acronym' => 'UPOU UP', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'University of the Philippines Tacloban', 'acronym' => 'UPTC UP', 'region' => 'Region VIII', 'island' => 'Visayas'],

            // ==========================================
            // Ateneo Universities
            // ==========================================
            ['name' => 'Ateneo de Manila University', 'acronym' => 'ADMU', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Ateneo de Davao University', 'acronym' => 'ADDU', 'region' => 'Region XI', 'island' => 'Mindanao'],
            ['name' => 'Ateneo de Naga University', 'acronym' => 'ADNU', 'region' => 'Region V', 'island' => 'Luzon'],
            ['name' => 'Ateneo de Zamboanga University', 'acronym' => 'ADZU', 'region' => 'Region IX', 'island' => 'Mindanao'],
            ['name' => 'Xavier University - Ateneo de Cagayan', 'acronym' => 'XU Ateneo', 'region' => 'Region X', 'island' => 'Mindanao'],

            // ==========================================
            // Technological University of the Philippines (TUP)
            // ==========================================
            ['name' => 'Technological University of the Philippines - Manila', 'acronym' => 'TUP TUP-Manila', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Technological University of the Philippines - Taguig', 'acronym' => 'TUP TUP-Taguig', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Technological University of the Philippines - Cavite', 'acronym' => 'TUP TUP-Cavite', 'region' => 'Region IV-A', 'island' => 'Luzon'],
            ['name' => 'Technological University of the Philippines - Visayas', 'acronym' => 'TUP TUP-Visayas', 'region' => 'Region VI', 'island' => 'Visayas'],

            // ==========================================
            // Centro Escolar University (CEU)
            // ==========================================
            ['name' => 'Centro Escolar University - Manila', 'acronym' => 'CEU CEU-Manila', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Centro Escolar University - Malolos', 'acronym' => 'CEU CEU-Malolos', 'region' => 'Region III', 'island' => 'Luzon'],
            ['name' => 'Centro Escolar University - Makati', 'acronym' => 'CEU CEU-Makati', 'region' => 'NCR', 'island' => 'Luzon'],

            // ==========================================
            // Quezon City University (QCU)
            // ==========================================
            ['name' => 'Quezon City University - San Bartolome (Main)', 'acronym' => 'QCU', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Quezon City University - San Francisco', 'acronym' => 'QCU', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'Quezon City University - Batasan', 'acronym' => 'QCU', 'region' => 'NCR', 'island' => 'Luzon'],

            // ==========================================
            // University of Caloocan City (UCC)
            // ==========================================
            ['name' => 'University of Caloocan City - South Campus (Biglang Awa)', 'acronym' => 'UCC', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'University of Caloocan City - North Campus (Camarin)', 'acronym' => 'UCC', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'University of Caloocan City - Congressional', 'acronym' => 'UCC', 'region' => 'NCR', 'island' => 'Luzon'],
            ['name' => 'University of Caloocan City - Bagong Silang', 'acronym' => 'UCC', 'region' => 'NCR', 'island' => 'Luzon'],
        ];

        $records = [];
        foreach ($branches as $b) {
            $records[] = [
                'name' => $b['name'],
                'acronym' => $b['acronym'],
                'region' => $b['region'],
                'island' => $b['island'],
                'status' => 'active',
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ];
        }

        DB::table('institutions')->upsert(
            $records,
            ['name'],
            ['acronym', 'region', 'island', 'status', 'updated_at']
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Keep records intact or remove if explicitly rolled back
    }
};
