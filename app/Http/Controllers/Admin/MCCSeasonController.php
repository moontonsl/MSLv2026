<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MCCSeason;
use App\Models\MCCSeasonContent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class MCCSeasonController extends Controller
{
    private const CONTENT_TYPES = [
        'hero_images', 'logos', 'backgrounds', 'buttons', 'text_content', 'teams', 'standings', 'matches',
    ];

    public function index(Request $request): Response
    {
        $status = in_array($request->input('status'), ['all', 'active', 'inactive'], true)
            ? $request->input('status')
            : 'all';

        $query = MCCSeason::query()->withCount('content');
        if ($request->filled('search')) {
            $search = trim((string) $request->input('search'));
            $query->where(function ($builder) use ($search): void {
                $builder->where('season_name', 'like', '%' . $search . '%')
                    ->orWhere('route_slug', 'like', '%' . $search . '%')
                    ->orWhere('description', 'like', '%' . $search . '%');
            });
        }
        if ($status === 'active') $query->where('is_active', true);
        if ($status === 'inactive') $query->where('is_active', false);

        $seasons = $query->latest('season_number')->paginate(12)->withQueryString();
        $seasons->setCollection($seasons->getCollection()->map(fn (MCCSeason $season) => $this->serialize($season)));

        $editingSeason = null;
        if ($request->filled('edit') && ctype_digit((string) $request->input('edit'))) {
            $editingSeason = MCCSeason::with('content')->find($request->integer('edit'));
        }

        return Inertia::render('Admin/MCCSeasons', [
            'seasons' => $seasons,
            'nextSeasonNumber' => ((int) MCCSeason::max('season_number')) + 1,
            'filters' => [
                'search' => (string) $request->input('search', ''),
                'status' => $status,
            ],
            'showForm' => $request->boolean('create') || $editingSeason !== null,
            'editingSeason' => $editingSeason ? $this->serialize($editingSeason, true) : null,
            'contentTypes' => self::CONTENT_TYPES,
        ]);
    }

    public function create(): RedirectResponse
    {
        return redirect()->route('admin.mcc-seasons.index', ['create' => 1]);
    }

    public function store(Request $request): RedirectResponse
    {
        $season = MCCSeason::create($this->validated($request));
        if ($season->is_active) $season->setAsActive();

        return redirect()->route('admin.mcc-seasons.index', ['edit' => $season->id])
            ->with('success', 'Season created successfully.');
    }

    public function show(int $id): RedirectResponse
    {
        return redirect()->route('admin.mcc-seasons.edit', $id);
    }

    public function edit(int $id): RedirectResponse
    {
        MCCSeason::findOrFail($id);
        return redirect()->route('admin.mcc-seasons.index', ['edit' => $id]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $season = MCCSeason::findOrFail($id);
        $season->update($this->validated($request, $season));
        if ($season->is_active) $season->setAsActive();

        return redirect()->route('admin.mcc-seasons.index')->with('success', 'Season updated successfully.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $season = MCCSeason::findOrFail($id);
        if ($season->is_active) return back()->with('error', 'Cannot delete the active season. Set another season as active first.');

        $season->delete();
        return back()->with('success', 'Season deleted successfully.');
    }

    public function toggleActive(int $id): RedirectResponse
    {
        $season = MCCSeason::findOrFail($id);
        $season->setAsActive();

        return back()->with('success', "Season {$season->season_number} is now active.");
    }

    public function uploadImage(Request $request): JsonResponse
    {
        $data = $request->validate([
            'season_id' => ['required', 'exists:mcc_seasons,id'],
            'content_type' => ['required', Rule::in(self::CONTENT_TYPES)],
            'content_key' => ['required', 'string', 'max:255'],
            'image' => ['required', 'image', 'mimes:jpeg,jpg,png,gif,webp', 'max:10240'],
        ]);

        $season = MCCSeason::findOrFail($data['season_id']);
        $content = MCCSeasonContent::where('season_id', $season->id)->where('content_key', $data['content_key'])->first();
        $oldPath = data_get($content?->content_value, 'path');
        $file = $request->file('image');
        $filename = Str::slug($data['content_key']) . '_' . Str::lower(Str::random(8)) . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs("images/MCC/S{$season->season_number}", $filename, 'public');

        $content = MCCSeasonContent::updateOrCreate(
            ['season_id' => $season->id, 'content_key' => $data['content_key']],
            ['content_type' => $data['content_type'], 'content_value' => ['path' => $path]]
        );
        if ($oldPath && $oldPath !== $path) Storage::disk('public')->delete($oldPath);

        return response()->json(['success' => true, 'path' => $path, 'url' => Storage::disk('public')->url($path), 'content' => $this->serializeContent($content)]);
    }

    public function updateContent(Request $request, int $id): JsonResponse
    {
        MCCSeason::findOrFail($id);
        $data = $request->validate([
            'content_type' => ['required', Rule::in(self::CONTENT_TYPES)],
            'content_key' => ['required', 'string', 'max:255'],
            'content_value' => ['required'],
            'display_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $content = MCCSeasonContent::updateOrCreate(
            ['season_id' => $id, 'content_key' => $data['content_key']],
            ['content_type' => $data['content_type'], 'content_value' => $data['content_value'], 'display_order' => $data['display_order'] ?? 0]
        );

        return response()->json(['success' => true, 'content' => $this->serializeContent($content)]);
    }

    public function deleteContent(int $seasonId, int $contentId): JsonResponse
    {
        $content = MCCSeasonContent::where('season_id', $seasonId)->findOrFail($contentId);
        $path = data_get($content->content_value, 'path');
        $content->delete();
        if ($path) Storage::disk('public')->delete($path);

        return response()->json(['success' => true]);
    }

    private function validated(Request $request, ?MCCSeason $season = null): array
    {
        return $request->validate([
            'season_number' => ['required', 'integer', 'min:1', Rule::unique('mcc_seasons', 'season_number')->ignore($season?->id)],
            'season_name' => ['required', 'string', 'max:255'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'route_slug' => ['required', 'string', 'max:255', Rule::unique('mcc_seasons', 'route_slug')->ignore($season?->id)],
            'description' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
        ]);
    }

    private function serialize(MCCSeason $season, bool $includeContent = false): array
    {
        $data = [
            'id' => $season->id,
            'season_number' => $season->season_number,
            'season_name' => $season->season_name,
            'is_active' => (bool) $season->is_active,
            'start_date' => $season->start_date?->format('Y-m-d'),
            'end_date' => $season->end_date?->format('Y-m-d'),
            'route_slug' => $season->route_slug,
            'description' => $season->description,
            'content_count' => $season->content_count ?? $season->content?->count() ?? 0,
        ];
        if ($includeContent) $data['content'] = $season->content->map(fn (MCCSeasonContent $content) => $this->serializeContent($content))->values();
        return $data;
    }

    private function serializeContent(MCCSeasonContent $content): array
    {
        $value = $content->content_value;
        $path = is_array($value) ? ($value['path'] ?? null) : null;
        if ($path && !Str::startsWith($path, ['/', 'http://', 'https://'])) {
            $value['url'] = Storage::disk('public')->url($path);
        }

        return [
            'id' => $content->id,
            'content_type' => $content->content_type,
            'content_key' => $content->content_key,
            'content_value' => $value,
            'display_order' => $content->display_order,
        ];
    }
}
