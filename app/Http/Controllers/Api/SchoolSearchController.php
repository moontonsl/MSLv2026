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
     * Search colleges & universities.
     */
    public function searchCollege(Request $request): JsonResponse
    {
        $q = trim($request->input('q', ''));

        $query = Institution::query()
            ->select(['name', 'acronym', 'region', 'island'])
            ->where('status', 'active');

        if (!empty($q)) {
            $query->where(function ($sub) use ($q) {
                $sub->where('name', 'LIKE', "%{$q}%")
                    ->orWhere('acronym', 'LIKE', "%{$q}%");
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
            ->limit(25)
            ->get()
            ->map(function ($inst) {
                return [
                    'name' => $inst->name,
                    'acronym' => $inst->acronym,
                    'region' => $inst->region ?: 'NCR',
                    'island' => $inst->island ?: 'Luzon',
                ];
            });

        return response()->json($schools);
    }

    /**
     * Search Senior High Schools from DepEd basic education masterlist.
     */
    public function searchSHS(Request $request): JsonResponse
    {
        $q = trim($request->input('q', ''));

        $query = DB::table('basic_education_institutions')
            ->select(['school_name as name', 'region', 'division', 'municipality'])
            ->whereIn('modified_cultural_offering_classification', [
                'purely_shs',
                'jhs_with_shs',
                'all_offering',
            ]);

        if (!empty($q)) {
            $query->where('school_name', 'LIKE', "%{$q}%");
        }

        $schools = $query->orderBy('school_name')
            ->limit(25)
            ->get()
            ->map(function ($row) {
                return [
                    'name' => $row->name,
                    'region' => $row->region,
                    'island' => $this->resolveIsland($row->region),
                    'division' => $row->division,
                    'municipality' => $row->municipality,
                ];
            });

        return response()->json($schools);
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
