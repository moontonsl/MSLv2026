<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    private const SETTING_KEYS = [
        'website_name',
        'website_title',
        'maintenance_mode',
        'maintenance_message',
        'logo',
        'favicon',
    ];

    public function index(): Response
    {
        $values = Setting::query()
            ->whereIn('key', self::SETTING_KEYS)
            ->pluck('value', 'key')
            ->all();

        return Inertia::render('Admin/Settings', [
            'settings' => [
                'website_name' => $values['website_name'] ?? '',
                'website_title' => $values['website_title'] ?? '',
                'maintenance_mode' => $this->toBoolean($values['maintenance_mode'] ?? false),
                'maintenance_message' => $values['maintenance_message'] ?? '',
                'logo_url' => $this->assetUrl($values['logo'] ?? null),
                'favicon_url' => $this->assetUrl($values['favicon'] ?? null),
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'website_name' => ['nullable', 'string', 'max:255'],
            'website_title' => ['nullable', 'string', 'max:255'],
            'maintenance_mode' => ['nullable', 'boolean'],
            'maintenance_message' => ['nullable', 'string'],
            'logo' => ['nullable', 'image', 'mimes:jpeg,jpg,png,gif,webp', 'max:2048'],
            'favicon' => ['nullable', 'image', 'mimes:jpeg,jpg,png,gif,webp,ico', 'max:512'],
        ]);

        Setting::setValue('website_name', $validated['website_name'] ?? '', 'string');
        Setting::setValue('website_title', $validated['website_title'] ?? '', 'string');
        Setting::setValue('maintenance_mode', (bool) ($validated['maintenance_mode'] ?? false), 'boolean');
        Setting::setValue('maintenance_message', $validated['maintenance_message'] ?? '', 'string');

        foreach (['logo', 'favicon'] as $field) {
            if (!$request->hasFile($field)) {
                continue;
            }

            $oldPath = Setting::getValue($field);
            $newPath = $request->file($field)->store('settings', 'public');
            Setting::setValue($field, $newPath, 'file');

            if ($oldPath && $oldPath !== $newPath) {
                $this->deleteStoredAsset($oldPath);
            }
        }

        return redirect()->route('admin.settings')->with('success', 'Settings updated successfully.');
    }

    private function toBoolean(mixed $value): bool
    {
        if (is_bool($value)) {
            return $value;
        }

        return filter_var($value, FILTER_VALIDATE_BOOLEAN);
    }

    private function assetUrl(?string $value): ?string
    {
        if (!$value) {
            return null;
        }

        if (Str::startsWith($value, ['http://', 'https://', '/'])) {
            return $value;
        }

        $path = $this->storagePath($value);

        return $path && Storage::disk('public')->exists($path)
            ? Storage::disk('public')->url($path)
            : null;
    }

    private function deleteStoredAsset(string $value): void
    {
        $path = $this->storagePath($value);

        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }

    private function storagePath(string $value): ?string
    {
        if (Str::startsWith($value, ['http://', 'https://', '/'])) {
            return null;
        }

        return Str::startsWith($value, 'public/')
            ? Str::after($value, 'public/')
            : $value;
    }
}
