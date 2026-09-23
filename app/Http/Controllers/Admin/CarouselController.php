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
    public function index(): Response
    {
        return Inertia::render('Admin/Carousel', [
            'carousels' => Carousel::ordered()->get()->map(fn (Carousel $carousel) => [
                'id' => $carousel->id,
                'title' => $carousel->title,
                'image_path' => $carousel->image_path,
                'image_url' => $this->imageUrl($carousel->image_path),
                'order' => $carousel->order,
                'is_active' => $carousel->is_active,
            ])->values(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'image' => ['required', 'image', 'mimes:jpeg,jpg,png,gif', 'max:5120'],
            'order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $data['image_path'] = basename($request->file('image')->store('carousel', 'public'));
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
            'image' => ['sometimes', 'nullable', 'image', 'mimes:jpeg,jpg,png,gif', 'max:5120'],
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
