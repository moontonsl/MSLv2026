<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ShortLink;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ShareLinkController extends Controller
{
    public function index(): Response
    {
        $shortLinks = ShortLink::query()
            ->latest()
            ->get()
            ->map(fn (ShortLink $link): array => [
                'id' => $link->id,
                'code' => $link->code,
                'original_url' => $link->original_url,
                'clicks' => (int) $link->clicks,
                'created_at' => $link->created_at?->toIso8601String(),
                'short_url' => route('short-link.redirect', $link->code),
            ])
            ->values();

        return Inertia::render('Admin/ShareLinks/Index', [
            'shortLinks' => $shortLinks,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'original_url' => ['required', 'string', 'max:2048'],
            'code' => ['nullable', 'string', 'alpha_dash', 'max:50', 'unique:short_links,code'],
        ], [
            'code.unique' => 'This short code/alias is already in use. Please choose a different one.',
            'code.alpha_dash' => 'The short code may only contain letters, numbers, dashes, and underscores.',
        ]);

        $originalUrl = $this->normalizeDestination($validated['original_url']);
        $code = $validated['code'] ?? null;

        if (!$code) {
            do {
                $code = Str::random(6);
            } while (ShortLink::query()->where('code', $code)->exists());
        }

        ShortLink::create([
            'original_url' => $originalUrl,
            'code' => $code,
        ]);

        return back()->with('success', 'Share link created successfully.');
    }

    public function update(Request $request, ShortLink $shortLink): RedirectResponse
    {
        $validated = $request->validate([
            'original_url' => ['required', 'string', 'max:2048'],
            'code' => ['required', 'string', 'alpha_dash', 'max:50', 'unique:short_links,code,' . $shortLink->id],
        ], [
            'code.unique' => 'This short code/alias is already in use. Please choose a different one.',
            'code.alpha_dash' => 'The short code may only contain letters, numbers, dashes, and underscores.',
        ]);

        $shortLink->update([
            'original_url' => $this->normalizeDestination($validated['original_url']),
            'code' => $validated['code'],
        ]);

        return back()->with('success', 'Share link updated successfully.');
    }

    public function destroy(ShortLink $shortLink): RedirectResponse
    {
        $shortLink->delete();

        return back()->with('success', 'Share link deleted successfully.');
    }

    private function normalizeDestination(string $value): string
    {
        $value = trim($value);
        $url = preg_match('/^https?:\/\//i', $value) ? $value : 'https://' . $value;

        if (!filter_var($url, FILTER_VALIDATE_URL)) {
            throw ValidationException::withMessages([
                'original_url' => 'Enter a valid destination URL or domain.',
            ]);
        }

        return $url;
    }
}
