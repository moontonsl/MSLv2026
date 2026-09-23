<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ModernNewsController extends Controller
{
    public function index(): Response
    {
        $news = News::query()->latest('news_published')->get()->map(fn (News $item) => [
            'id' => $item->id,
            'category' => $item->news_state,
            'title' => $item->news_title,
            'description' => $item->news_subtitle,
            'shortDescription' => $item->news_subtitle,
            'writer' => $item->news_writer,
            'authorName' => $item->news_writer,
            'publishedDate' => optional($item->news_published)->format('Y-m-d'),
            'articleContent' => $item->news_content,
            'featuredImages' => array_values(array_filter([
                $this->imageUrl($item->news_img1),
                $this->imageUrl($item->news_img2),
                $this->imageUrl($item->news_img3),
            ])),
        ])->values();

        return Inertia::render('Admin/NewsUpdates', ['newsItems' => $news]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        News::create($data);
        return back()->with('success', 'News created successfully.');
    }

    public function update(Request $request, News $news): RedirectResponse
    {
        $oldImages = $this->storedImages($news);
        $data = $this->validated($request, $news);
        $news->update($data);
        $this->deleteStoredImages(array_diff($oldImages, $this->storedImages($news)));
        return back()->with('success', 'News updated successfully.');
    }

    public function destroy(News $news): RedirectResponse
    {
        $images = $this->storedImages($news);
        $news->delete();
        $this->deleteStoredImages($images);

        return back()->with('success', 'News deleted successfully.');
    }

    private function validated(Request $request, ?News $news = null): array
    {
        $data = $request->validate([
            'category' => ['required', 'string', 'max:100'],
            'title' => ['required', 'string', 'max:255'],
            'authorName' => ['nullable', 'string', 'max:255'],
            'publishedDate' => ['nullable', 'date'],
            'shortDescription' => ['nullable', 'string'],
            'articleContent' => ['nullable', 'string'],
            'existingImages' => ['nullable', 'array', 'max:3'],
            'existingImages.*' => ['nullable', 'string', 'max:500'],
            'featuredImages' => ['nullable', 'array', 'max:3'],
            'featuredImages.*' => ['image', 'mimes:jpeg,jpg,png,gif', 'max:5120'],
        ]);

        $existingImages = $request->has('existingImages')
            ? collect($data['existingImages'] ?? [])
                ->filter()
                ->map(fn (string $image) => basename(parse_url($image, PHP_URL_PATH) ?: $image))
                ->values()
                ->all()
            : $this->storedImages($news);

        $uploadedImages = collect($request->file('featuredImages', []))
            ->map(fn ($image) => basename($image->store('news', 'public')))
            ->values()
            ->all();

        $images = array_slice([...$existingImages, ...$uploadedImages], 0, 3);

        return [
            'news_canonical' => $news?->news_canonical ?: Str::slug($data['title']) . '-' . Str::lower(Str::random(6)),
            'news_state' => $data['category'],
            'news_title' => $data['title'],
            'news_subtitle' => $data['shortDescription'] ?? null,
            'news_published' => $data['publishedDate'] ?? now(),
            'news_writer' => $data['authorName'] ?? null,
            'news_content' => $data['articleContent'] ?? null,
            'news_img1' => $images[0] ?? null,
            'news_img2' => $images[1] ?? null,
            'news_img3' => $images[2] ?? null,
        ];
    }

    private function imageUrl(?string $image): ?string
    {
        if (!$image) {
            return null;
        }

        if (Str::startsWith($image, ['/'])) {
            return $image;
        }

        return Storage::disk('public')->url('news/' . $image);
    }

    private function storedImages(?News $news): array
    {
        if (!$news) {
            return [];
        }

        return array_values(array_filter([
            $news->news_img1,
            $news->news_img2,
            $news->news_img3,
        ], fn (?string $image) => $image && !Str::startsWith($image, ['/'])));
    }

    private function deleteStoredImages(array $images): void
    {
        foreach ($images as $image) {
            Storage::disk('public')->delete('news/' . basename($image));
        }
    }
}
