<?php

namespace App\Http\Controllers;

use App\Models\ShortLink;
use Illuminate\Http\RedirectResponse;

class ShortLinkController extends Controller
{
    public function redirect(string $code): RedirectResponse
    {
        $shortLink = ShortLink::query()->where('code', $code)->firstOrFail();
        $shortLink->increment('clicks');

        return redirect()->away($shortLink->original_url);
    }
}
