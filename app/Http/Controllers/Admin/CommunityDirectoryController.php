<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CommunityDirectoryEntry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CommunityDirectoryController extends Controller
{
    public function index(): Response
    {
        $entries = CommunityDirectoryEntry::query()
            ->orderBy('order')
            ->orderBy('id')
            ->get()
            ->map(fn (CommunityDirectoryEntry $entry): array => [
                'id' => $entry->id,
                'school' => $entry->school,
                'community' => $entry->community,
                'region' => $entry->region,
                'tier' => $entry->tier,
                'members' => $entry->members,
                'href' => $entry->href ?? '',
                'order' => $entry->order,
                'is_active' => (bool) $entry->is_active,
            ])
            ->values();

        return Inertia::render('Admin/CommunityDirectory', [
            'entries' => $entries,
            'regions' => CommunityDirectoryEntry::REGIONS,
            'tiers' => CommunityDirectoryEntry::TIERS,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateEntry($request);

        CommunityDirectoryEntry::create([
            'school' => trim($validated['school']),
            'community' => trim($validated['community']),
            'region' => trim($validated['region']),
            'tier' => $validated['tier'],
            'members' => (int) $validated['members'],
            'href' => filled($validated['href'] ?? null) ? trim($validated['href']) : '#accreditation',
            'order' => (int) ($validated['order'] ?? (CommunityDirectoryEntry::max('order') + 1)),
            'is_active' => (bool) ($validated['is_active'] ?? true),
        ]);

        return back()->with('success', 'Community directory entry added successfully.');
    }

    public function update(Request $request, CommunityDirectoryEntry $communityDirectoryEntry): RedirectResponse
    {
        $validated = $this->validateEntry($request);

        $communityDirectoryEntry->update([
            'school' => trim($validated['school']),
            'community' => trim($validated['community']),
            'region' => trim($validated['region']),
            'tier' => $validated['tier'],
            'members' => (int) $validated['members'],
            'href' => filled($validated['href'] ?? null) ? trim($validated['href']) : '#accreditation',
            'order' => (int) ($validated['order'] ?? $communityDirectoryEntry->order),
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

    private function validateEntry(Request $request): array
    {
        return $request->validate([
            'school' => ['required', 'string', 'max:255'],
            'community' => ['required', 'string', 'max:255'],
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
            'order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ]);
    }
}
