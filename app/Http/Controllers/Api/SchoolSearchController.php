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
            'FEU' => 'Far Eastern',
            'PUP' => 'Polytechnic University',
            'PLM' => 'Pamantasan ng Lungsod ng Maynila',
            'UP' => 'University of the Philippines',
            'TIP' => 'Technological Institute of the Philippines',
            'NU' => 'National University',
            'UE' => 'University of the East',
            'AU' => 'Arellano University',
            'MCU' => 'Manila Central University',
            'LPU' => 'Lyceum',
            'CEU' => 'Centro Escolar',
            'DLSZ' => 'De La Salle Santiago Zobel',
            'CSB' => 'College of Saint Benilde',
            'MAPUA' => 'Mapua',
            'MIT' => 'Mapua',
            'SLU' => 'Saint Louis University',
            'USC' => 'University of San Carlos',
            'UIC' => 'University of the Immaculate Conception',
            'XU' => 'Xavier University',
            'CPU' => 'Central Philippine University',
            'CIT' => 'Cebu Institute of Technology',
            'USJ-R' => 'University of San Jose-Recoletos',
            'USJR' => 'University of San Jose-Recoletos',
        ];

        $expanded = $q;
        foreach ($acronyms as $abbr => $full) {
            $expanded = preg_replace('/\b' . preg_quote($abbr, '/') . '\b/i', $full, $expanded);
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

        if (!empty($q)) {
            $query->where(function ($sub) use ($q, $searchData) {
                // Exact or substring match on name or acronym
                $sub->where('name', 'LIKE', "%{$q}%")
                    ->orWhere('acronym', 'LIKE', "%{$q}%");

                // If acronym expanded, match expanded text
                if ($searchData['expanded'] !== $q) {
                    $sub->orWhere('name', 'LIKE', "%{$searchData['expanded']}%");
                }

                // Match each keyword
                if (!empty($searchData['words'])) {
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
            ->orderByRaw("
                CASE 
                    WHEN acronym = ? THEN 1
                    WHEN name LIKE ? THEN 2
                    WHEN acronym LIKE ? THEN 3
                    WHEN name LIKE ? THEN 4
                    ELSE 5
                END
            ", [$q, "{$q}%", "{$q}%", "%{$q}%"]);
        }

        $schools = $query->orderBy('name')
            ->limit(50)
            ->get()
            ->map(function ($inst) {
                return [
                    'id' => 'he-' . $inst->id,
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
                'municipality'
            ])
            ->whereIn('modified_cultural_offering_classification', [
                'purely_shs',
                'jhs_with_shs',
                'all_offering',
            ]);

        if (!empty($q)) {
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
                if (!empty($searchData['words']) && count($searchData['words']) > 1) {
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
            ->orderByRaw("
                CASE 
                    WHEN school_name LIKE ? THEN 1
                    WHEN school_name LIKE ? THEN 2
                    WHEN municipality LIKE ? THEN 3
                    ELSE 4
                END
            ", ["{$q}%", "%{$q}%", "{$q}%"]);
        }

        $basicSchools = $query->orderBy('school_name')
            ->limit(50)
            ->get()
            ->map(function ($row) {
                return [
                    'id' => 'deped-' . ($row->id ?: md5($row->name)),
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
        if (!empty($q) && $basicSchools->count() < 40) {
            $heiQuery = Institution::query()
                ->select(['id', 'name', 'acronym', 'region', 'island'])
                ->where('status', 'active')
                ->where(function ($sub) use ($q, $searchData) {
                    $sub->where('name', 'LIKE', "%{$q}%")
                        ->orWhere('acronym', 'LIKE', "%{$q}%");

                    if ($searchData['expanded'] !== $q) {
                        $sub->orWhere('name', 'LIKE', "%{$searchData['expanded']}%");
                    }
                })
                ->limit(15)
                ->get()
                ->map(function ($inst) {
                    return [
                        'id' => 'he-shs-' . $inst->id,
                        'name' => $inst->name . ' (Senior High School)',
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
