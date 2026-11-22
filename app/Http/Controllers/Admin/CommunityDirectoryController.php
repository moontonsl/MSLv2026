<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CommunityDirectoryEntry;
use App\Models\Institution;
use App\Models\Region;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CommunityDirectoryController extends Controller
{
    public function index(): Response
    {
        $entriesCollection = CommunityDirectoryEntry::query()
            ->orderBy('school')
            ->orderBy('id')
            ->get();

        $schoolNames = $entriesCollection
            ->pluck('school')
            ->filter()
            ->unique()
            ->values();

        $verifiedCounts = $schoolNames->isNotEmpty()
            ? User::query()
                ->where('status', 'active')
                ->whereIn('university', $schoolNames)
                ->select('university', DB::raw('COUNT(*) as verified_count'))
                ->groupBy('university')
                ->pluck('verified_count', 'university')
            : collect();

        $entries = $entriesCollection
            ->map(fn (CommunityDirectoryEntry $entry): array => [
                'id' => $entry->id,
                'school' => $entry->school,
                'community' => $entry->community,
                'region' => $entry->region,
                'tier' => $entry->tier,
                'members' => $entry->members,
                'verified_members_count' => (int) ($verifiedCounts[$entry->school] ?? 0),
                'href' => $entry->href ?? '',
                'order' => $entry->order,
                'is_active' => (bool) $entry->is_active,
            ])
            ->values();

        return Inertia::render('Admin/CommunityDirectory', [
            'entries' => $entries,
            'regions' => $this->databaseRegions(),
            'tiers' => CommunityDirectoryEntry::TIERS,
        ]);
    }

    /**
     * Realtime searchable combobox endpoint for schools with region & verified member count.
     */
    public function searchSchools(Request $request): JsonResponse
    {
        $query = trim((string) $request->input('q', ''));
        $limit = 25;

        $schools = collect();

        if (Schema::hasTable('institutions')) {
            $instQuery = Institution::query()
                ->select('name', 'acronym', 'region');

            if ($query !== '') {
                $instQuery->where(function ($sub) use ($query) {
                    $sub->where('name', 'LIKE', "%{$query}%")
                        ->orWhere('acronym', 'LIKE', "%{$query}%")
                        ->orWhere('region', 'LIKE', "%{$query}%");
                });
            }

            $instResults = $instQuery
                ->orderBy('name')
                ->limit($limit)
                ->get()
                ->map(fn (Institution $inst): array => [
                    'name' => $inst->name,
                    'acronym' => $inst->acronym ?? '',
                    'region' => $inst->region ?? '',
                    'type' => 'College',
                ]);

            $schools = $schools->merge($instResults);
        }

        if ($schools->count() < $limit && Schema::hasTable('basic_education_institutions')) {
            $remaining = $limit - $schools->count();
            $shsQuery = DB::table('basic_education_institutions')
                ->select('school_name as name', 'region')
                ->whereIn('modified_cultural_offering_classification', ['purely_shs', 'jhs_with_shs', 'all_offering']);

            if ($query !== '') {
                $shsQuery->where(function ($sub) use ($query) {
                    $sub->where('school_name', 'LIKE', "%{$query}%")
                        ->orWhere('region', 'LIKE', "%{$query}%");
                });
            }

            $existingNames = $schools->pluck('name')->map(fn ($n) => mb_strtolower($n))->all();

            $shsResults = $shsQuery
                ->orderBy('school_name')
                ->limit($remaining)
                ->get()
                ->filter(fn ($row) => !in_array(mb_strtolower((string) $row->name), $existingNames, true))
                ->map(fn ($row): array => [
                    'name' => (string) $row->name,
                    'acronym' => '',
                    'region' => (string) ($row->region ?? ''),
                    'type' => 'SHS',
                ]);

            $schools = $schools->merge($shsResults);
        }

        $schoolNames = $schools->pluck('name')->unique()->values();

        $verifiedCounts = $schoolNames->isNotEmpty()
            ? User::query()
                ->where('status', 'active')
                ->whereIn('university', $schoolNames)
                ->select('university', DB::raw('COUNT(*) as verified_count'))
                ->groupBy('university')
                ->pluck('verified_count', 'university')
            : collect();

        $userFallbackRegions = $schoolNames->isNotEmpty()
            ? User::query()
                ->whereIn('university', $schoolNames)
                ->whereNotNull('region')
                ->where('region', '!=', '')
                ->select('university', DB::raw('MAX(region) as region'))
                ->groupBy('university')
                ->pluck('region', 'university')
            : collect();

        $results = $schools
            ->map(fn (array $school): array => [
                ...$school,
                'region' => $school['region'] !== '' ? $school['region'] : (string) ($userFallbackRegions[$school['name']] ?? ''),
                'verified_members_count' => (int) ($verifiedCounts[$school['name']] ?? 0),
            ])
            ->values();

        return response()->json([
            'schools' => $results,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateEntry($request);

        CommunityDirectoryEntry::create([
            'school' => trim($validated['school']),
            'community' => trim((string) ($validated['community'] ?? '')),
            'region' => trim($validated['region']),
            'tier' => $validated['tier'],
            'members' => (int) $validated['members'],
            'href' => filled($validated['href'] ?? null) ? trim($validated['href']) : '#accreditation',
            'order' => 0,
            'is_active' => (bool) ($validated['is_active'] ?? true),
        ]);

        return back()->with('success', 'Community directory entry added successfully.');
    }

    public function update(Request $request, CommunityDirectoryEntry $communityDirectoryEntry): RedirectResponse
    {
        $validated = $this->validateEntry($request);

        $communityDirectoryEntry->update([
            'school' => trim($validated['school']),
            'community' => trim((string) ($validated['community'] ?? '')),
            'region' => trim($validated['region']),
            'tier' => $validated['tier'],
            'members' => (int) $validated['members'],
            'href' => filled($validated['href'] ?? null) ? trim($validated['href']) : '#accreditation',
            'is_active' => (bool) ($validated['is_active'] ?? $communityDirectoryEntry->is_active),
        ]);

        return back()->with('success', 'Community directory entry updated successfully.');
    }

    public function toggleActive(CommunityDirectoryEntry $communityDirectoryEntry): RedirectResponse
    {
        $communityDirectoryEntry->update([
            'is_active' => !$communityDirectoryEntry->is_active,
        ]);

        return back()->with(
            'success',
            $communityDirectoryEntry->is_active
                ? 'Community directory entry is now visible on the Campus page.'
                : 'Community directory entry has been hidden from the Campus page.'
        );
    }

    public function destroy(CommunityDirectoryEntry $communityDirectoryEntry): RedirectResponse
    {
        $communityDirectoryEntry->delete();

        return back()->with('success', 'Community directory entry deleted successfully.');
    }

    /**
     * Fetch regions dynamically from the database (institutions, regions table, basic_education_institutions).
     */
    private function databaseRegions(): array
    {
        $regions = collect();

        if (Schema::hasTable('institutions')) {
            $regions = $regions->merge(
                Institution::query()
                    ->whereNotNull('region')
                    ->where('region', '!=', '')
                    ->distinct()
                    ->orderBy('region')
                    ->pluck('region')
            );
        }

        if (Schema::hasTable('regions')) {
            $regions = $regions->merge(
                Region::query()
                    ->whereNotNull('name')
                    ->where('name', '!=', '')
                    ->orderBy('region_number')
                    ->pluck('name')
            );
        }

        if (Schema::hasTable('basic_education_institutions')) {
            $regions = $regions->merge(
                DB::table('basic_education_institutions')
                    ->whereNotNull('region')
                    ->where('region', '!=', '')
                    ->distinct()
                    ->orderBy('region')
                    ->pluck('region')
            );
        }

        $regions = $regions
            ->map(fn ($r) => trim((string) $r))
            ->filter()
            ->unique()
            ->sort(SORT_NATURAL | SORT_FLAG_CASE)
            ->values();

        return $regions->isNotEmpty() ? $regions->all() : CommunityDirectoryEntry::REGIONS;
    }

    private function validateEntry(Request $request): array
    {
        return $request->validate([
            'school' => ['required', 'string', 'max:255'],
            'community' => ['nullable', 'string', 'max:255'],
            'region' => ['required', 'string', 'max:100'],
            'tier' => ['required', 'string', Rule::in(CommunityDirectoryEntry::TIERS)],
            'members' => ['required', 'integer', 'min:0', 'max:1000000'],
            'href' => [
                'nullable',
                'string',
                'max:500',
                function (string $attribute, mixed $value, \Closure $fail): void {
                    if ($value === null || trim((string) $value) === '') {
                        return;
                    }
                    $trimmed = trim((string) $value);
                    if (
                        !str_starts_with($trimmed, 'https://') &&
                        !str_starts_with($trimmed, 'http://') &&
                        !str_starts_with($trimmed, '/') &&
                        !str_starts_with($trimmed, '#')
                    ) {
                        $fail('The join link must be a valid URL (https://...) or internal anchor (#accreditation).');
                    }
                },
            ],
            'is_active' => ['nullable', 'boolean'],
        ]);
    }
}
