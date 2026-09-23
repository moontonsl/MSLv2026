<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MslEvent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class MslEventController extends Controller
{
    private const IMAGE_FIELDS = ['event_logo', 'event_img01', 'event_img02', 'event_img03', 'event_img04', 'event_img05'];

    public function index(Request $request): Response
    {
        $state = in_array($request->input('state'), ['all', 'Active', 'Inactive'], true)
            ? $request->input('state')
            : 'all';

        $query = MslEvent::query();

        if ($request->filled('search')) {
            $search = trim((string) $request->input('search'));
            $query->where(function ($builder) use ($search): void {
                $builder
                    ->where('event_name', 'like', '%' . $search . '%')
                    ->orWhere('event_title', 'like', '%' . $search . '%')
                    ->orWhere('event_subtitle', 'like', '%' . $search . '%')
                    ->orWhere('event_canonical', 'like', '%' . $search . '%');
            });
        }

        if ($state !== 'all') {
            $query->where('event_state', $state);
        }

        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        $events = $query->latest()->paginate(12)->withQueryString();
        $events->setCollection($events->getCollection()->map(fn (MslEvent $event) => $this->serialize($event)));

        $editingEvent = null;
        if ($request->filled('edit') && ctype_digit((string) $request->input('edit'))) {
            $editingEvent = MslEvent::find($request->integer('edit'));
        }

        return Inertia::render('Admin/MslEvents', [
            'events' => $events,
            'filters' => [
                'search' => (string) $request->input('search', ''),
                'state' => $state,
                'featured' => $request->boolean('featured'),
            ],
            'showForm' => $request->boolean('create') || $editingEvent !== null,
            'editingEvent' => $editingEvent ? $this->serialize($editingEvent) : null,
        ]);
    }

    public function create(): RedirectResponse
    {
        return redirect()->route('admin.msl-events.index', ['create' => 1]);
    }

    public function store(Request $request): RedirectResponse
    {
        MslEvent::create($this->validated($request));

        return redirect()->route('admin.msl-events.index')->with('success', 'MSL event created successfully.');
    }

    public function edit(MslEvent $mslEvent): RedirectResponse
    {
        return redirect()->route('admin.msl-events.index', ['edit' => $mslEvent->id]);
    }

    public function update(Request $request, MslEvent $mslEvent): RedirectResponse
    {
        $oldImages = $this->rawImages($mslEvent);
        $mslEvent->update($this->validated($request, $mslEvent));
        $this->deleteImages(array_diff($oldImages, $this->rawImages($mslEvent)));

        return redirect()->route('admin.msl-events.index')->with('success', 'MSL event updated successfully.');
    }

    public function updateStatus(Request $request, MslEvent $mslEvent): RedirectResponse
    {
        $mslEvent->update($request->validate(['event_state' => ['required', 'in:Active,Inactive']]));

        return back()->with('success', 'MSL event status updated successfully.');
    }

    public function destroy(MslEvent $mslEvent): RedirectResponse
    {
        $images = $this->rawImages($mslEvent);
        $mslEvent->delete();
        $this->deleteImages($images);

        return back()->with('success', 'MSL event deleted successfully.');
    }

    private function validated(Request $request, ?MslEvent $event = null): array
    {
        $data = $request->validate([
            'event_name' => ['required', 'string', 'max:255'],
            'event_title' => ['required', 'string', 'max:255'],
            'event_subtitle' => ['nullable', 'string', 'max:500'],
            'event_canonical' => ['nullable', 'string', 'max:255'],
            'event_state' => ['required', 'in:Active,Inactive'],
            'is_featured' => ['nullable', 'boolean'],
            'redirect_url' => ['nullable', 'url', 'max:2048'],
            'event_content01' => ['nullable', 'string'],
            'event_content02' => ['nullable', 'string'],
            'event_logo' => ['nullable', 'image', 'mimes:jpeg,jpg,png,gif', 'max:5120'],
            'event_img01' => ['nullable', 'image', 'mimes:jpeg,jpg,png,gif', 'max:5120'],
            'event_img02' => ['nullable', 'image', 'mimes:jpeg,jpg,png,gif', 'max:5120'],
            'event_img03' => ['nullable', 'image', 'mimes:jpeg,jpg,png,gif', 'max:5120'],
            'event_img04' => ['nullable', 'image', 'mimes:jpeg,jpg,png,gif', 'max:5120'],
            'event_img05' => ['nullable', 'image', 'mimes:jpeg,jpg,png,gif', 'max:5120'],
        ]);

        $data['event_canonical'] = $this->uniqueCanonical(
            $data['event_canonical'] ?: ($event?->event_canonical ?: Str::slug($data['event_title'])),
            $event
        );
        $data['is_featured'] = $request->boolean('is_featured');

        foreach (self::IMAGE_FIELDS as $field) {
            if ($request->hasFile($field)) {
                $data[$field] = basename($request->file($field)->store('events', 'public'));
            } elseif ($event) {
                unset($data[$field]);
            } else {
                $data[$field] = null;
            }
        }

        return $data;
    }

    private function uniqueCanonical(string $canonical, ?MslEvent $event = null): string
    {
        $base = trim($canonical) ?: 'msl-event';
        $candidate = $base;
        $suffix = 2;

        while (MslEvent::query()
            ->where('event_canonical', $candidate)
            ->when($event, fn ($query) => $query->where('id', '!=', $event->id))
            ->exists()) {
            $candidate = $base . '-' . $suffix++;
        }

        return $candidate;
    }

    private function serialize(MslEvent $event): array
    {
        $images = [];
        foreach (self::IMAGE_FIELDS as $field) {
            $images[$field] = $this->imageUrl($event->getRawOriginal($field));
        }

        return [
            'id' => $event->id,
            'event_name' => $event->event_name,
            'event_state' => $event->event_state,
            'event_canonical' => $event->event_canonical,
            'event_logo' => $event->getRawOriginal('event_logo'),
            'event_title' => $event->event_title,
            'event_subtitle' => $event->event_subtitle,
            'event_content01' => $event->event_content01,
            'event_content02' => $event->event_content02,
            'event_img01' => $event->getRawOriginal('event_img01'),
            'event_img02' => $event->getRawOriginal('event_img02'),
            'event_img03' => $event->getRawOriginal('event_img03'),
            'event_img04' => $event->getRawOriginal('event_img04'),
            'event_img05' => $event->getRawOriginal('event_img05'),
            'is_featured' => (bool) $event->is_featured,
            'redirect_url' => $event->redirect_url,
            'event_logo_url' => $images['event_logo'],
            'event_image_urls' => $images,
            'created_at' => $event->created_at?->toISOString(),
        ];
    }

    private function rawImages(MslEvent $event): array
    {
        return array_values(array_filter(array_map(
            fn (string $field) => $event->getRawOriginal($field),
            self::IMAGE_FIELDS
        )));
    }

    private function imageUrl(?string $image): ?string
    {
        if (!$image) {
            return null;
        }

        if (Str::startsWith($image, ['/', 'http://', 'https://'])) {
            return $image;
        }

        if (Storage::disk('public')->exists('events/' . basename($image))) {
            return Storage::disk('public')->url('events/' . basename($image));
        }

        return '/images/MCC/Events/' . basename($image);
    }

    private function deleteImages(array $images): void
    {
        foreach ($images as $image) {
            if (!$image || Str::startsWith($image, ['/', 'http://', 'https://'])) {
                continue;
            }

            Storage::disk('public')->delete('events/' . basename($image));

            $legacyPath = public_path('images/MCC/Events/' . basename($image));
            if (is_file($legacyPath)) {
                unlink($legacyPath);
            }
        }
    }
}
