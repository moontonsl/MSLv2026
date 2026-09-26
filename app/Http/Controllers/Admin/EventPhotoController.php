<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EventPhoto;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class EventPhotoController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/EventPhotos', [
            'eventPhotos' => EventPhoto::latest()->get()->map(fn (EventPhoto $photo) => $this->serialize($photo))->values(),
        ]);
    }

    public function create(): RedirectResponse
    {
        return redirect()->route('admin.event-photos');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->rules(true));
        $validated['picture'] = $this->storePicture($request);

        EventPhoto::create($validated);

        return back()->with('success', 'Event photo added successfully.');
    }

    public function update(Request $request, EventPhoto $eventPhoto): RedirectResponse
    {
        $validated = $request->validate($this->rules(false));
        $oldPicture = $eventPhoto->getRawOriginal('picture');

        if ($request->hasFile('picture')) {
            $validated['picture'] = $this->storePicture($request);
            $this->deletePicture($oldPicture);
        } else {
            unset($validated['picture']);
        }

        $eventPhoto->update($validated);

        return back()->with('success', 'Event photo updated successfully.');
    }

    public function destroy(EventPhoto $eventPhoto): RedirectResponse
    {
        $this->deletePicture($eventPhoto->getRawOriginal('picture'));
        $eventPhoto->delete();

        return back()->with('success', 'Event photo deleted successfully.');
    }

    private function rules(bool $pictureRequired): array
    {
        return [
            'event_name' => ['required', 'string', 'max:255'],
            'school_name' => ['required', 'string', 'max:255'],
            'picture' => [$pictureRequired ? 'required' : 'nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:5120'],
        ];
    }

    private function storePicture(Request $request): string
    {
        return basename($request->file('picture')->store('event-photos', 'public'));
    }

    private function serialize(EventPhoto $photo): array
    {
        $picture = $photo->getRawOriginal('picture');

        return [
            'id' => $photo->id,
            'event_name' => $photo->event_name,
            'school_name' => $photo->school_name,
            'picture' => $picture,
            'image_url' => $this->imageUrl($picture),
            'created_at' => $photo->created_at?->toISOString(),
        ];
    }

    private function imageUrl(?string $picture): ?string
    {
        if (!$picture) {
            return null;
        }

        if (Str::startsWith($picture, ['/', 'http://', 'https://'])) {
            return $picture;
        }

        if (Storage::disk('public')->exists('event-photos/' . $picture)) {
            return Storage::disk('public')->url('event-photos/' . $picture);
        }

        // Keep existing MSL-1 files visible while new uploads use storage/app/public.
        return '/images/EventPhotos/' . $picture;
    }

    private function deletePicture(?string $picture): void
    {
        if (!$picture || Str::startsWith($picture, ['/', 'http://', 'https://'])) {
            return;
        }

        $storagePath = 'event-photos/' . $picture;
        if (Storage::disk('public')->exists($storagePath)) {
            Storage::disk('public')->delete($storagePath);
        }

        $legacyPath = public_path('images/EventPhotos/' . $picture);
        if (is_file($legacyPath)) {
            unlink($legacyPath);
        }
    }
}
