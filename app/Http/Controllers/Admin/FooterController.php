<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FooterController extends Controller
{
    private const DEFAULT_DESCRIPTION = 'The official student leader body of Mobile Legends: Bang Bang in the Philippines.';
    private const DEFAULT_COPYRIGHT = '© 2025 Moonton Student Leaders Philippines. All rights reserved.';

    public function index(): Response
    {
        return Inertia::render('Admin/Footer/Index', [
            'footer' => $this->footerData(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'description' => ['nullable', 'string', 'max:1000'],
            'copyright' => ['nullable', 'string', 'max:255'],
            'logo' => ['nullable', 'string', 'max:255'],
            'facebook_url' => ['nullable', 'url', 'max:255'],
            'youtube_url' => ['nullable', 'url', 'max:255'],
            'tiktok_url' => ['nullable', 'url', 'max:255'],
            'mlbb_logo' => ['nullable', 'string', 'max:255'],
            'moonton_logo' => ['nullable', 'string', 'max:255'],
            'nav_sections' => ['nullable', 'array'],
            'nav_sections.*.title' => ['required', 'string', 'max:255'],
            'nav_sections.*.links' => ['required', 'array'],
            'nav_sections.*.links.*.label' => ['required', 'string', 'max:255'],
            'nav_sections.*.links.*.href' => ['required', 'string', 'max:255'],
        ]);

        Setting::setValue('footer_description', $validated['description'] ?? '', 'text');
        Setting::setValue('footer_copyright', $validated['copyright'] ?? '', 'string');
        Setting::setValue('footer_logo', $validated['logo'] ?? '/msl-logo.png', 'string');
        Setting::setValue('footer_facebook_url', $validated['facebook_url'] ?? '', 'url');
        Setting::setValue('footer_youtube_url', $validated['youtube_url'] ?? '', 'url');
        Setting::setValue('footer_tiktok_url', $validated['tiktok_url'] ?? '', 'url');
        Setting::setValue('footer_mlbb_logo', $validated['mlbb_logo'] ?? '/mlbb-logo.png', 'string');
        Setting::setValue('footer_moonton_logo', $validated['moonton_logo'] ?? '/moonton-logo.png', 'string');
        Setting::setValue('footer_nav_sections', json_encode($validated['nav_sections'] ?? [], JSON_UNESCAPED_SLASHES), 'json');

        return redirect()->route('admin.footer')->with('success', 'Footer updated successfully.');
    }

    public function footerData(): array
    {
        $storedSections = json_decode((string) Setting::getValue('footer_nav_sections', '[]'), true);

        return [
            'description' => Setting::getValue('footer_description', self::DEFAULT_DESCRIPTION),
            'copyright' => Setting::getValue('footer_copyright', self::DEFAULT_COPYRIGHT),
            'logo' => Setting::getValue('footer_logo', '/msl-logo.png'),
            'facebook_url' => Setting::getValue('footer_facebook_url', 'https://www.facebook.com/MSLPhilippines'),
            'youtube_url' => Setting::getValue('footer_youtube_url', 'https://www.youtube.com/@MSLPhilippines'),
            'tiktok_url' => Setting::getValue('footer_tiktok_url', 'https://www.tiktok.com/@mslphilippines'),
            'mlbb_logo' => Setting::getValue('footer_mlbb_logo', '/mlbb-logo.png'),
            'moonton_logo' => Setting::getValue('footer_moonton_logo', '/moonton-logo.png'),
            'nav_sections' => is_array($storedSections) ? $storedSections : [],
        ];
    }
}
