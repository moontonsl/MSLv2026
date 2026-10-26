<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminAuditLog;
use App\Models\Institution;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class SchoolManagementController extends Controller
{
    /**
     * Display the School Management command center.
     */
    public function index(Request $request): Response
    {
        $activeTab = $request->input('tab', 'colleges');
        $search = trim((string) $request->input('search', ''));
        $selectedRegion = $request->input('region', '');
        $selectedIsland = $request->input('island', '');
        $selectedStatus = $request->input('status', '');
        $withLeaders = $request->boolean('with_leaders');

        // SHS-offering classification filter
        $shsClassifications = [
            'purely_shs',
            'jhs_with_shs',
            'all_offering',
        ];

        // Real-time KPI Stats
        $totalColleges = Institution::count();
        $activeColleges = Institution::where('status', 'active')->count();
        $totalShs = DB::table('basic_education_institutions')
            ->whereIn('modified_cultural_offering_classification', $shsClassifications)
            ->count();
        $totalEnrolled = User::whereNotNull('university')->where('university', '!=', '')->count();

        $stats = [
            'total_colleges' => $totalColleges,
            'active_colleges' => $activeColleges,
            'total_shs' => $totalShs,
            'total_enrolled' => $totalEnrolled,
        ];

        // Fetch distinct regions for filter dropdowns
        $regions = ($activeTab === 'shs'
            ? DB::table('basic_education_institutions')
                ->whereIn('modified_cultural_offering_classification', $shsClassifications)
                ->whereNotNull('region')
                ->where('region', '!=', '')
                ->distinct()
                ->orderBy('region')
                ->pluck('region')
            : Institution::query()->whereNotNull('region')->where('region', '!=', '')->distinct()->orderBy('region')->pluck('region')
        );

        $islands = ['Luzon', 'Visayas', 'Mindanao'];

        if ($activeTab === 'shs') {
            $shsQuery = DB::table('basic_education_institutions')
                ->select([
                    'id',
                    'school_name as name',
                    'region',
                    'division',
                    'municipality',
                    'modified_cultural_offering_classification as classification',
                ])
                ->whereIn('modified_cultural_offering_classification', $shsClassifications);

            if (!empty($search)) {
                $shsQuery->where(function ($sub) use ($search) {
                    $sub->where('school_name', 'LIKE', "%{$search}%")
                        ->orWhere('division', 'LIKE', "%{$search}%")
                        ->orWhere('municipality', 'LIKE', "%{$search}%");
                });
            }

            if (!empty($selectedRegion)) {
                $shsQuery->where('region', $selectedRegion);
            }

            if (!empty($selectedIsland)) {
                $luzonRegions = ['NCR', 'CAR', 'Region I', 'Region II', 'Region III', 'Region IV-A', 'Region IV-B', 'Region V'];
                $visayasRegions = ['Region VI', 'Region VII', 'Region VIII'];
                $mindanaoRegions = ['Region IX', 'Region X', 'Region XI', 'Region XII', 'CARAGA', 'BARMM'];

                if ($selectedIsland === 'Luzon') {
                    $shsQuery->whereIn('region', $luzonRegions);
                } elseif ($selectedIsland === 'Visayas') {
                    $shsQuery->whereIn('region', $visayasRegions);
                } elseif ($selectedIsland === 'Mindanao') {
                    $shsQuery->whereIn('region', $mindanaoRegions);
                }
            }

            $schools = $shsQuery->orderBy('school_name')
                ->paginate(10)
                ->withQueryString();

            // Transform SHS items
            $classificationLabels = [
                'purely_shs' => 'Purely Senior High',
                'jhs_with_shs' => 'JHS with Senior High',
                'all_offering' => 'Integrated (Complete K-12)',
            ];

            $schools->getCollection()->transform(function ($item) use ($classificationLabels) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'region' => $item->region,
                    'division' => $item->division,
                    'municipality' => $item->municipality,
                    'island' => $this->resolveIsland($item->region),
                    'classification' => $classificationLabels[$item->classification] ?? ($item->classification ?: 'Senior High School'),
                    'type' => 'shs',
                ];
            });
        } else {
            // Student count mapping by university
            $studentCounts = User::query()
                ->whereNotNull('university')
                ->where('university', '!=', '')
                ->groupBy('university')
                ->selectRaw('university, count(*) as count')
                ->pluck('count', 'university')
                ->toArray();

            $collegesQuery = Institution::query();

            if (!empty($search)) {
                $collegesQuery->where(function ($sub) use ($search) {
                    $sub->where('name', 'LIKE', "%{$search}%")
                        ->orWhere('acronym', 'LIKE', "%{$search}%");
                });
            }

            if (!empty($selectedRegion)) {
                $collegesQuery->where('region', $selectedRegion);
            }

            if (!empty($selectedIsland)) {
                $collegesQuery->where('island', $selectedIsland);
            }

            if (!empty($selectedStatus)) {
                $collegesQuery->where('status', $selectedStatus);
            }

            if ($withLeaders) {
                $collegesWithStudents = array_keys(array_filter($studentCounts, fn($c) => $c > 0));
                $collegesQuery->whereIn('name', $collegesWithStudents);
            }

            $schools = $collegesQuery->orderBy('name')
                ->paginate(10)
                ->withQueryString();

            // Transform College items
            $schools->getCollection()->transform(function (Institution $inst) use ($studentCounts) {
                return [
                    'id' => $inst->id,
                    'name' => $inst->name,
                    'acronym' => $inst->acronym,
                    'region' => $inst->region ?: 'NCR',
                    'island' => $inst->island ?: 'Luzon',
                    'status' => $inst->status ?: 'active',
                    'students_count' => $studentCounts[$inst->name] ?? 0,
                    'type' => 'college',
                ];
            });
        }

        // Fetch enrolled student leaders with their university and MLBB details for instant justification
        $enrolledLeaders = User::query()
            ->whereNotNull('university')
            ->where('university', '!=', '')
            ->select(['id', 'name', 'email', 'university', 'division', 'course', 'ml_ign', 'ml_id', 'status'])
            ->orderBy('university')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Schools', [
            'schools' => $schools,
            'activeTab' => $activeTab,
            'filters' => [
                'search' => $search,
                'region' => $selectedRegion,
                'island' => $selectedIsland,
                'status' => $selectedStatus,
                'with_leaders' => $withLeaders,
            ],
            'regions' => $regions,
            'islands' => $islands,
            'stats' => $stats,
            'enrolledLeaders' => $enrolledLeaders,
        ]);
    }

    /**
     * Create a new institution (College/University or Senior High School).
     */
    public function store(Request $request): RedirectResponse
    {
        $type = $request->input('type', 'college');

        if ($type === 'shs') {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'region' => ['required', 'string', 'max:100'],
                'division' => ['nullable', 'string', 'max:150'],
                'municipality' => ['nullable', 'string', 'max:100'],
                'sector' => ['nullable', 'string', 'in:public,private'],
            ]);

            // Auto-generate unique BEIS ID if not present
            $maxBeis = DB::table('basic_education_institutions')
                ->where('beis_school_id', 'REGEXP', '^[0-9]+$')
                ->max(DB::raw('CAST(beis_school_id AS UNSIGNED)')) ?? 900000;
            $newBeisId = (string) ($maxBeis + 1);

            $id = DB::table('basic_education_institutions')->insertGetId([
                'school_name' => $validated['name'],
                'region' => $validated['region'],
                'division' => $validated['division'] ?: 'Division Office',
                'district' => 'District I',
                'street_address' => $validated['municipality'] ?: $validated['region'],
                'municipality' => $validated['municipality'] ?: 'Unspecified',
                'legislative_district' => '1st District',
                'sector' => $validated['sector'] ?: 'public',
                'settlement_type' => 'urban',
                'school_subclassification' => 'deped_managed',
                'modified_cultural_offering_classification' => 'purely_shs',
                'masterlist_page' => 'admin_added',
                'beis_school_id' => $newBeisId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Security Audit Log
            AdminAuditLog::create([
                'admin_user_id' => Auth::guard('admin')->id(),
                'route_name' => 'admin.schools.store',
                'module' => 'School Management',
                'action' => 'Create Basic Education Institution (SHS)',
                'method' => 'POST',
                'status_code' => 200,
                'target_type' => 'basic_education_institutions',
                'target_id' => (string) $id,
                'metadata' => [
                    'name' => $validated['name'],
                    'region' => $validated['region'],
                    'type' => 'shs',
                    'beis_school_id' => $newBeisId,
                ],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            return redirect()->route('admin.school-management', ['tab' => 'shs'])
                ->with('success', "Senior High School \"{$validated['name']}\" added successfully.");
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:institutions,name'],
            'acronym' => ['nullable', 'string', 'max:50'],
            'region' => ['required', 'string', 'max:100'],
            'island' => ['required', 'string', 'in:Luzon,Visayas,Mindanao'],
            'status' => ['required', 'string', 'in:active,inactive'],
        ]);

        $institution = Institution::create($validated);

        // Security Audit Log
        AdminAuditLog::create([
            'admin_user_id' => Auth::guard('admin')->id(),
            'route_name' => 'admin.schools.store',
            'module' => 'School Management',
            'action' => 'Create Higher Education Institution (College)',
            'method' => 'POST',
            'status_code' => 200,
            'target_type' => 'Institution',
            'target_id' => (string) $institution->id,
            'metadata' => [
                'name' => $institution->name,
                'region' => $institution->region,
                'island' => $institution->island,
                'type' => 'college',
            ],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return redirect()->route('admin.school-management', ['tab' => 'colleges'])
            ->with('success', "College / University \"{$institution->name}\" added successfully.");
    }

    /**
     * Update an existing institution.
     */
    public function update(Request $request, int $id): RedirectResponse
    {
        $institution = Institution::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', "unique:institutions,name,{$id}"],
            'acronym' => ['nullable', 'string', 'max:50'],
            'region' => ['required', 'string', 'max:100'],
            'island' => ['required', 'string', 'in:Luzon,Visayas,Mindanao'],
            'status' => ['required', 'string', 'in:active,inactive'],
        ]);

        $oldName = $institution->name;
        $institution->update($validated);

        // Security Audit Log
        AdminAuditLog::create([
            'admin_user_id' => Auth::guard('admin')->id(),
            'route_name' => 'admin.schools.update',
            'module' => 'School Management',
            'action' => 'Update Institution',
            'method' => 'PUT',
            'status_code' => 200,
            'target_type' => 'Institution',
            'target_id' => (string) $institution->id,
            'metadata' => [
                'previous_name' => $oldName,
                'updated_name' => $institution->name,
                'region' => $institution->region,
                'status' => $institution->status,
            ],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return back()->with('success', "Institution \"{$institution->name}\" updated successfully.");
    }

    /**
     * Toggle active/inactive status of an institution.
     */
    public function toggleStatus(Request $request, int $id): RedirectResponse
    {
        $institution = Institution::findOrFail($id);
        $newStatus = $institution->status === 'active' ? 'inactive' : 'active';
        $institution->update(['status' => $newStatus]);

        // Security Audit Log
        AdminAuditLog::create([
            'admin_user_id' => Auth::guard('admin')->id(),
            'route_name' => 'admin.schools.toggle-status',
            'module' => 'School Management',
            'action' => 'Toggle Institution Status',
            'method' => 'POST',
            'status_code' => 200,
            'target_type' => 'Institution',
            'target_id' => (string) $institution->id,
            'metadata' => [
                'name' => $institution->name,
                'new_status' => $newStatus,
            ],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return back()->with('success', "Institution status changed to \"{$newStatus}\".");
    }

    /**
     * Resolve island group from region string.
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
