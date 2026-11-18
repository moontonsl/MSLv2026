<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Carousel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CarouselController extends Controller
{
    public function index(): Response|RedirectResponse
    {
        return redirect()->route('admin.homepage');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'label' => ['nullable', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:1000'],
            'link' => ['nullable', 'string', 'max:500'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
            'image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,gif,webp', 'max:5120'],
            'order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        if ($request->hasFile('image')) {
            $data['image_path'] = basename($request->file('image')->store('carousel', 'public'));
        } else {
            $data['image_path'] = '/champ poster.jpg';
        }

        $maxOrder = Carousel::max('order');
        $data['order'] ??= $maxOrder === null ? 0 : ((int) $maxOrder) + 1;
        $data['is_active'] = $request->boolean('is_active', true);
        unset($data['image']);

        Carousel::create($data);

        return back()->with('success', 'Carousel item created successfully.');
    }

    public function update(Request $request, Carousel $carousel): RedirectResponse
    {
        $data = $request->validate([
            'title' => ['sometimes', 'nullable', 'string', 'max:255'],
            'label' => ['sometimes', 'nullable', 'string', 'max:255'],
            'subtitle' => ['sometimes', 'nullable', 'string', 'max:1000'],
            'link' => ['sometimes', 'nullable', 'string', 'max:500'],
            'start_date' => ['sometimes', 'nullable', 'date'],
            'end_date' => ['sometimes', 'nullable', 'date'],
            'image' => ['sometimes', 'nullable', 'image', 'mimes:jpeg,jpg,png,gif,webp', 'max:5120'],
            'order' => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        if ($request->hasFile('image')) {
            $oldImage = $carousel->image_path;
            $data['image_path'] = basename($request->file('image')->store('carousel', 'public'));
            $this->deleteStoredImage($oldImage);
        }

        unset($data['image']);
        $carousel->update($data);

        return back()->with('success', 'Carousel item updated successfully.');
    }

    public function destroy(Carousel $carousel): RedirectResponse
    {
        $this->deleteStoredImage($carousel->image_path);
        $carousel->delete();

        return back()->with('success', 'Carousel item deleted successfully.');
    }

    public function reorder(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'carousels' => ['required', 'array', 'min:1'],
            'carousels.*.id' => ['required', 'integer', 'exists:carousels,id'],
            'carousels.*.order' => ['required', 'integer', 'min:0'],
        ]);

        DB::transaction(function () use ($data): void {
            foreach ($data['carousels'] as $item) {
                Carousel::whereKey($item['id'])->update(['order' => $item['order']]);
            }
        });

        return back()->with('success', 'Carousel order updated successfully.');
    }

    public function loadPlaceholders(): RedirectResponse
    {
        $placeholders = Carousel::defaultPlaceholders();

        if (Carousel::count() === 0) {
            foreach ($placeholders as $placeholder) {
                Carousel::create($placeholder);
            }
        } else {
            foreach ($placeholders as $placeholder) {
                Carousel::firstOrCreate(
                    ['title' => $placeholder['title']],
                    $placeholder
                );
            }
        }

        return back()->with('success', 'Homepage placeholder slides loaded successfully.');
    }

    private function imageUrl(?string $image): ?string
    {
        if (!$image) {
            return null;
        }

        if (Str::startsWith($image, ['/'])) {
            return $image;
        }

        return Storage::disk('public')->url('carousel/' . $image);
    }

    private function deleteStoredImage(?string $image): void
    {
        if ($image && !Str::startsWith($image, ['/'])) {
            Storage::disk('public')->delete('carousel/' . basename($image));
        }
    }
}
