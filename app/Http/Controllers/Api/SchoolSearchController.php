<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Institution;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SchoolSearchController extends Controller
{
    /**
     * Map common Philippine school acronyms and abbreviations to full keywords.
     */
    private function expandSearchTerms(string $q): array
    {
        $q = trim($q);
        if (empty($q)) {
            return [
                'original' => '',
                'expanded' => '',
                'words' => [],
            ];
        }

        $acronyms = [
            'NHS' => 'National High School',
            'SHS' => 'Senior High School',
            'IS' => 'Integrated School',
            'CS' => 'Central School',
            'UST' => 'Santo Tomas',
            'DLSU' => 'De La Salle',
            'ADMU' => 'Ateneo de Manila',
            'ADDU' => 'Ateneo de Davao',
            'ADNU' => 'Ateneo de Naga',
            'ADZU' => 'Ateneo de Zamboanga',
            'FEU' => 'Far Eastern',
            'PUP' => 'Polytechnic University of the Philippines',
            'PLM' => 'Pamantasan ng Lungsod ng Maynila',
            'UP' => 'University of the Philippines',
            'UPD' => 'University of the Philippines Diliman',
            'UPM' => 'University of the Philippines Manila',
            'UPLB' => 'University of the Philippines Los Baños',
            'UPV' => 'University of the Philippines Visayas',
            'UPB' => 'University of the Philippines Baguio',
            'UPMin' => 'University of the Philippines Mindanao',
            'UPC' => 'University of the Philippines Cebu',
            'UPOU' => 'University of the Philippines Open University',
            'TIP' => 'Technological Institute of the Philippines',
            'NU' => 'National University',
            'UE' => 'University of the East',
            'AU' => 'Arellano University',
            'MCU' => 'Manila Central University',
            'LPU' => 'Lyceum of the Philippines University',
            'CEU' => 'Centro Escolar University',
            'DLSZ' => 'De La Salle Santiago Zobel',
            'CSB' => 'College of Saint Benilde',
            'DLS-CSB' => 'College of Saint Benilde',
            'DLSU-D' => 'De La Salle University Dasmariñas',
            'DLSUD' => 'De La Salle University Dasmariñas',
            'DLSL' => 'De La Salle Lipa',
            'DLSAU' => 'De La Salle Araneta',
            'DLSMHSI' => 'De La Salle Medical and Health Sciences Institute',
            'MAPUA' => 'Mapua',
            'MIT' => 'Mapua',
            'MMCL' => 'Mapua Malayan Colleges Laguna',
            'MCL' => 'Mapua Malayan Colleges Laguna',
            'MMCM' => 'Mapua Malayan Colleges Mindanao',
            'MCM' => 'Mapua Malayan Colleges Mindanao',
            'SLU' => 'Saint Louis University',
            'USC' => 'University of San Carlos',
            'UIC' => 'University of the Immaculate Conception',
            'XU' => 'Xavier University',
            'CPU' => 'Central Philippine University',
            'CIT' => 'Cebu Institute of Technology',
            'CIT-U' => 'Cebu Institute of Technology',
            'USJ-R' => 'University of San Jose-Recoletos',
            'USJR' => 'University of San Jose-Recoletos',
            'DHVSU' => 'Don Honorio Ventura State University',
            'LSPU' => 'Laguna State Polytechnic University',
            'SLSU' => 'Southern Luzon State University',
            'TSU' => 'Tarlac State University',
            'NEUST' => 'Nueva Ecija University of Science and Technology',
            'PSU' => 'Pangasinan State University',
            'WMSU' => 'Western Mindanao State University',
            'EVSU' => 'Eastern Visayas State University',
            'CTU' => 'Cebu Technological University',
            'USTP' => 'University of Science and Technology of Southern Philippines',
            'USEP' => 'University of Southeastern Philippines',
            'USM' => 'University of Southern Mindanao',
            'BUKSU' => 'Bukidnon State University',
            'MINSU' => 'Mindoro State University',
            'OMSC' => 'Occidental Mindoro State College',
            'RSU' => 'Romblon State University',
            'RMSU' => 'Ramon Magsaysay State University',
            'BATSTATEU' => 'Batangas State University',
            'CVSU' => 'Cavite State University',
            'BULSU' => 'Bulacan State University',
            'BPSU' => 'Bataan Peninsula State University',
            'EARIST' => 'Eulogio Amang Rodriguez',
            'RTU' => 'Rizal Technological University',
            'PNU' => 'Philippine Normal University',
            'UPHSD' => 'University of Perpetual Help System DALTA',
            'UPHSL' => 'University of Perpetual Help System Laguna',
            'OLFU' => 'Our Lady of Fatima University',
            'QCU' => 'Quezon City University',
            'UCC' => 'University of Caloocan City',
            'PLMAR' => 'Pamantasan ng Lungsod ng Marikina',
            'PLP' => 'Pamantasan ng Lungsod ng Pasig',
            'PLMUN' => 'Pamantasan ng Lungsod ng Muntinlupa',
            'PLV' => 'Pamantasan ng Lungsod ng Valenzuela',
            'UMAK' => 'University of Makati',
            'UDM' => 'Universidad de Manila',
            'UM' => 'University of Mindanao',
            'UC' => 'University of Cebu',
            'UV' => 'University of the Visayas',
            'NORSU' => 'Negros Oriental State University',
            'BISU' => 'Bohol Island State University',
            'ISATU' => 'Iloilo Science and Technology University',
            'ISAT-U' => 'Iloilo Science and Technology University',
            'WVSU' => 'West Visayas State University',
            'CAPSU' => 'Capiz State University',
            'ASU' => 'Aklan State University',
            'CBSUA' => 'Central Bicol State University of Agriculture',
            'PARSU' => 'Partido State University',
            'ISU' => 'Isabela State University',
            'CSU' => 'Cagayan State University',
            'MMSU' => 'Mariano Marcos State University',
            'CLSU' => 'Central Luzon State University',
            'PSAU' => 'Pampanga State Agricultural University',
            'PMMA' => 'Philippine Merchant Marine Academy',
            'TAU' => 'Tarlac Agricultural University',
            'MARSU' => 'Marinduque State University',
            'WPU' => 'Western Philippines University',
            'BISCAST' => 'Bicol State College of Applied Sciences and Technology',
            'CNSC' => 'Camarines Norte State College',
            'CSPC' => 'Camarines Sur Polytechnic Colleges',
            'CATSU' => 'Catanduanes State University',
            'SORSU' => 'Sorsogon State University',
            'CHMSU' => 'Carlos Hilado Memorial State University',
            'CPSU' => 'Central Philippines State University',
            'GSU' => 'Guimaras State University',
            'NISU' => 'Northern Iloilo State University',
            'UA' => 'University of Antique',
            'BIPSU' => 'Biliran Province State University',
            'ESSU' => 'Eastern Samar State University',
            'LNU' => 'Leyte Normal University',
            'NWSSU' => 'Northwest Samar State University',
            'SSU' => 'Samar State University',
            'UEP' => 'University of Eastern Philippines',
            'BASC' => 'Basilan State College',
            'JHCSC' => 'JH Cerilles State College',
            'JRMSU' => 'Jose Rizal Memorial State University',
            'ZPPSU' => 'Zamboanga Peninsula Polytechnic State University',
            'CMU' => 'Central Mindanao University',
            'DNSC' => 'Davao del Norte State College',
            'DORSU' => 'Davao Oriental State University',
            'DSSC' => 'Davao del Sur State College',
            'SPAMAST' => 'Southern Philippines Agri-Business',
            'COTSU' => 'Cotabato State University',
            'SKSU' => 'Sultan Kudarat State University',
            'SCSC' => 'South Cotabato State College',
            'ASSCAT' => 'Agusan del Sur State College of Agriculture and Technology',
            'NEMSU' => 'North Eastern Mindanao State University',
            'SNSU' => 'Surigao del Norte State University',
            'HAU' => 'Holy Angel University',
            'AUF' => 'Angeles University Foundation',
            'SPCF' => 'Systems Plus College Foundation',
            'UB' => 'University of Baguio',
            'USA' => 'University of San Agustin',
            'SU' => 'Silliman University',
            'CSA' => 'Colegio San Agustin',
            'CSJL' => 'Colegio de San Juan de Letran',
            'LETRAN' => 'Colegio de San Juan de Letran',
            'NTC' => 'National Teachers College',
            'EAC' => 'Emilio Aguinaldo College',
            'PWU' => 'Philippine Women\'s University',
            'PCU' => 'Philippine Christian University',
            'SBU' => 'San Beda University',
            'SSCR' => 'San Sebastian College - Recoletos',
            'SPUP' => 'St. Paul University',
            'IIT' => 'Iligan Institute of Technology',
            'QC' => 'Quezon City',
            'SJDM' => 'San Jose del Monte',
            'CSFP' => 'San Fernando',
            'MNL' => 'Manila',
            'DASMA' => 'Dasmarinas',
            'GENSAN' => 'General Santos',
            'CDO' => 'Cagayan de Oro',
            'LB' => 'Los Banos',
            'SPC' => 'San Pablo',
            'MOA' => 'Mall of Asia',
            'FV' => 'Fairview',
            'EO' => 'East Ortigas',
        ];

        $expanded = $q;
        foreach ($acronyms as $abbr => $full) {
            $expanded = preg_replace('/\b'.preg_quote($abbr, '/').'\b/i', $full, $expanded);
        }

        // Clean punctuation and get unique words
        $clean = preg_replace('/[^\p{L}\p{N}\s]/u', ' ', $expanded);
        $words = array_values(array_unique(array_filter(explode(' ', $clean), function ($w) {
            return mb_strlen(trim($w)) >= 2;
        })));

        return [
            'original' => $q,
            'expanded' => trim($expanded),
            'words' => $words,
        ];
    }

    /**
     * Search colleges & universities.
     */
    public function searchCollege(Request $request): JsonResponse
    {
        $q = trim($request->input('q', ''));
        $searchData = $this->expandSearchTerms($q);

        $query = Institution::query()
            ->select(['id', 'name', 'acronym', 'region', 'island'])
            ->where('status', 'active');

        if (! empty($q)) {
            $query->where(function ($sub) use ($q, $searchData) {
                // Exact or substring match on name or acronym
                $sub->where('name', 'LIKE', "%{$q}%")
                    ->orWhere('acronym', 'LIKE', "%{$q}%");

                // If acronym expanded, match expanded text
                if ($searchData['expanded'] !== $q) {
                    $sub->orWhere('name', 'LIKE', "%{$searchData['expanded']}%");
                }

                // Match each keyword
                if (! empty($searchData['words'])) {
                    $sub->orWhere(function ($wordSub) use ($searchData) {
                        foreach ($searchData['words'] as $w) {
                            $wordSub->where(function ($wSub) use ($w) {
                                $wSub->where('name', 'LIKE', "%{$w}%")
                                    ->orWhere('acronym', 'LIKE', "%{$w}%")
                                    ->orWhere('region', 'LIKE', "%{$w}%");
                            });
                        }
                    });
                }
            })
                ->orderByRaw('
                CASE
                    WHEN acronym = ? THEN 1
                    WHEN name LIKE ? THEN 2
                    WHEN acronym LIKE ? THEN 3
                    WHEN name LIKE ? THEN 4
                    ELSE 5
                END
            ', [$q, "{$q}%", "{$q}%", "%{$q}%"]);
        }

        $schools = $query->orderBy('name')
            ->limit(50)
            ->get()
            ->map(function ($inst) {
                return [
                    'id' => 'he-'.$inst->id,
                    'name' => $inst->name,
                    'acronym' => $inst->acronym,
                    'region' => $inst->region ?: 'NCR',
                    'island' => $inst->island ?: 'Luzon',
                ];
            });

        return response()->json($schools);
    }

    /**
     * Search Senior High Schools from DepEd basic education masterlist and HEIs offering SHS.
     */
    public function searchSHS(Request $request): JsonResponse
    {
        $q = trim($request->input('q', ''));
        $searchData = $this->expandSearchTerms($q);

        $query = DB::table('basic_education_institutions')
            ->select([
                'beis_school_id as id',
                'school_name as name',
                'region',
                'division',
                'municipality',
            ])
            ->whereIn('modified_cultural_offering_classification', [
                'purely_shs',
                'jhs_with_shs',
                'all_offering',
            ]);

        if (! empty($q)) {
            $query->where(function ($sub) use ($q, $searchData) {
                // Match original full string across name, municipality, division
                $sub->where('school_name', 'LIKE', "%{$q}%")
                    ->orWhere('municipality', 'LIKE', "%{$q}%")
                    ->orWhere('division', 'LIKE', "%{$q}%");

                // If expanded abbreviation, match that too
                if ($searchData['expanded'] !== $q) {
                    $sub->orWhere('school_name', 'LIKE', "%{$searchData['expanded']}%");
                }

                // If multiple words, match all words across name + municipality + division
                if (! empty($searchData['words']) && count($searchData['words']) > 1) {
                    $sub->orWhere(function ($wordSub) use ($searchData) {
                        foreach ($searchData['words'] as $w) {
                            $wordSub->where(function ($wSub) use ($w) {
                                $wSub->where('school_name', 'LIKE', "%{$w}%")
                                    ->orWhere('municipality', 'LIKE', "%{$w}%")
                                    ->orWhere('division', 'LIKE', "%{$w}%");
                            });
                        }
                    });
                }
            })
                ->orderByRaw('
                CASE
                    WHEN school_name LIKE ? THEN 1
                    WHEN school_name LIKE ? THEN 2
                    WHEN municipality LIKE ? THEN 3
                    ELSE 4
                END
            ', ["{$q}%", "%{$q}%", "{$q}%"]);
        }

        $basicSchools = $query->orderBy('school_name')
            ->limit(50)
            ->get()
            ->map(function ($row) {
                return [
                    'id' => 'deped-'.($row->id ?: md5($row->name)),
                    'name' => $row->name,
                    'region' => $row->region,
                    'island' => $this->resolveIsland($row->region),
                    'division' => $row->division,
                    'municipality' => $row->municipality,
                    'type' => 'deped',
                ];
            });

        // Also check if higher education institutions match (for universities/colleges with SHS programs)
        $heiSchools = collect();
        if (! empty($q) && $basicSchools->count() < 40) {
            $heiQuery = Institution::query()
                ->select(['id', 'name', 'acronym', 'region', 'island'])
                ->where('status', 'active')
                ->where(function ($sub) use ($q, $searchData) {
                    $sub->where('name', 'LIKE', "%{$q}%")
                        ->orWhere('acronym', 'LIKE', "%{$q}%");

                    if ($searchData['expanded'] !== $q) {
                        $sub->orWhere('name', 'LIKE', "%{$searchData['expanded']}%");
                    }

                    if (! empty($searchData['words']) && count($searchData['words']) > 1) {
                        $sub->orWhere(function ($wordSub) use ($searchData) {
                            foreach ($searchData['words'] as $w) {
                                $wordSub->where(function ($wSub) use ($w) {
                                    $wSub->where('name', 'LIKE', "%{$w}%")
                                        ->orWhere('acronym', 'LIKE', "%{$w}%")
                                        ->orWhere('region', 'LIKE', "%{$w}%");
                                });
                            }
                        });
                    }
                })
                ->limit(15)
                ->get()
                ->map(function ($inst) {
                    return [
                        'id' => 'he-shs-'.$inst->id,
                        'name' => $inst->name.' (Senior High School)',
                        'region' => $inst->region ?: 'NCR',
                        'island' => $inst->island ?: 'Luzon',
                        'division' => null,
                        'municipality' => $inst->acronym ? "Acronym: {$inst->acronym}" : null,
                        'type' => 'hei',
                    ];
                });

            $heiSchools = $heiQuery;
        }

        $results = $basicSchools->concat($heiSchools)->take(60)->values();

        return response()->json($results);
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
