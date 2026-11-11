<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Carousel;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class HomePageController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/HomePage', [
            'carousels' => Carousel::ordered()->get()->map(fn (Carousel $c) => [
                'id' => $c->id,
                'title' => $c->title,
                'label' => $c->label,
                'subtitle' => $c->subtitle,
                'link' => $c->link,
                'start_date' => $c->start_date?->format('Y-m-d'),
                'end_date' => $c->end_date?->format('Y-m-d'),
                'image_path' => $c->image_path,
                'image_url' => $this->imageUrl($c->image_path),
                'order' => $c->order,
                'is_active' => $c->is_active,
            ])->values(),
        ]);
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
}
