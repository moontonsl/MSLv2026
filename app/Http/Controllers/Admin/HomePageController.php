<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Carousel;
use App\Models\Institution;
use App\Models\MslEvent;
use App\Models\NetworkOrganization;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class HomePageController extends Controller
{
    public static function getLiveStatistics(): array
    {
        $studentsCount = User::where('user_type', 'Student')->count();
        $campusesCount = class_exists(Institution::class) ? Institution::count() : 0;
        $eventsCount = (class_exists(\App\Models\Event::class) ? \App\Models\Event::count() : 0)
            + (class_exists(\App\Models\CampusTournament::class) ? \App\Models\CampusTournament::count() : 0)
            + (class_exists(MslEvent::class) ? MslEvent::count() : 0);
        $leadersCount = User::where('user_type', 'Student Leader')->count();

        return [
            'student_gamers' => $studentsCount > 0 ? ($studentsCount . '+') : '0',
            'campus_communities' => $campusesCount > 0 ? (number_format($campusesCount) . '+') : '0',
            'events_sponsored' => $eventsCount > 0 ? ($eventsCount . '+') : '0',
            'student_leaders' => $leadersCount > 0 ? ($leadersCount . '+') : '0',
        ];
    }

    public function index(): Response
    {
        $liveCounts = self::getLiveStatistics();
        $mode = Setting::getValue('homepage_stat_mode', 'live');

        $statistics = [
            'mode' => $mode,
            'student_gamers' => Setting::getValue('homepage_stat_student_gamers', $liveCounts['student_gamers']),
            'student_gamers_label' => Setting::getValue('homepage_stat_student_gamers_label', 'STUDENT GAMERS'),
            'campus_communities' => Setting::getValue('homepage_stat_campus_communities', $liveCounts['campus_communities']),
            'campus_communities_label' => Setting::getValue('homepage_stat_campus_communities_label', 'CAMPUS COMMUNITIES'),
            'events_sponsored' => Setting::getValue('homepage_stat_events_sponsored', $liveCounts['events_sponsored']),
            'events_sponsored_label' => Setting::getValue('homepage_stat_events_sponsored_label', 'EVENTS SPONSORED'),
            'student_leaders' => Setting::getValue('homepage_stat_student_leaders', $liveCounts['student_leaders']),
            'student_leaders_label' => Setting::getValue('homepage_stat_student_leaders_label', 'STUDENT LEADERS'),
        ];

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
            'statistics' => $statistics,
            'liveCounts' => $liveCounts,
            'networkOrganizations' => NetworkOrganization::orderBy('order')->get()->map(fn (NetworkOrganization $org) => [
                'id' => $org->id,
                'name' => $org->name,
                'link' => $org->link,
                'order' => $org->order,
                'is_active' => $org->is_active,
                'logo_path' => $org->logo_path,
                'logo_url' => $org->logo_url,
            ])->values(),
        ]);
    }

    public function updateStatistics(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'mode' => ['nullable', 'string', 'in:live,custom'],
            'student_gamers' => ['required', 'string', 'max:50'],
            'student_gamers_label' => ['required', 'string', 'max:100'],
            'campus_communities' => ['required', 'string', 'max:50'],
            'campus_communities_label' => ['required', 'string', 'max:100'],
            'events_sponsored' => ['required', 'string', 'max:50'],
            'events_sponsored_label' => ['required', 'string', 'max:100'],
            'student_leaders' => ['required', 'string', 'max:50'],
            'student_leaders_label' => ['required', 'string', 'max:100'],
        ]);

        Setting::setValue('homepage_stat_mode', $validated['mode'] ?? 'live', 'string');
        Setting::setValue('homepage_stat_student_gamers', $validated['student_gamers'], 'string');
        Setting::setValue('homepage_stat_student_gamers_label', $validated['student_gamers_label'], 'string');
        Setting::setValue('homepage_stat_campus_communities', $validated['campus_communities'], 'string');
        Setting::setValue('homepage_stat_campus_communities_label', $validated['campus_communities_label'], 'string');
        Setting::setValue('homepage_stat_events_sponsored', $validated['events_sponsored'], 'string');
        Setting::setValue('homepage_stat_events_sponsored_label', $validated['events_sponsored_label'], 'string');
        Setting::setValue('homepage_stat_student_leaders', $validated['student_leaders'], 'string');
        Setting::setValue('homepage_stat_student_leaders_label', $validated['student_leaders_label'], 'string');

        return back()->with('success', 'Homepage statistics updated successfully.');
    }

    public function storeNetworkOrganization(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'link' => ['nullable', 'string', 'max:500'],
            'logo' => ['required', 'image', 'mimes:jpeg,jpg,png,gif,webp,svg', 'max:5120'],
            'order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $data['logo_path'] = basename($request->file('logo')->store('network_organizations', 'public'));
        $maxOrder = NetworkOrganization::max('order');
        $data['order'] ??= $maxOrder === null ? 0 : ((int) $maxOrder) + 1;
        $data['is_active'] = $request->boolean('is_active', true);
        unset($data['logo']);

        NetworkOrganization::create($data);

        return back()->with('success', 'Network organization added successfully.');
    }

    public function updateNetworkOrganization(Request $request, NetworkOrganization $networkOrganization): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'link' => ['sometimes', 'nullable', 'string', 'max:500'],
            'logo' => ['sometimes', 'nullable', 'image', 'mimes:jpeg,jpg,png,gif,webp,svg', 'max:5120'],
            'order' => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        if ($request->hasFile('logo')) {
            if ($networkOrganization->logo_path && !Str::startsWith($networkOrganization->logo_path, ['/'])) {
                Storage::disk('public')->delete('network_organizations/' . $networkOrganization->logo_path);
            }
            $data['logo_path'] = basename($request->file('logo')->store('network_organizations', 'public'));
            unset($data['logo']);
        }

        if ($request->has('is_active')) {
            $data['is_active'] = $request->boolean('is_active');
        }

        $networkOrganization->update($data);

        return back()->with('success', 'Network organization updated successfully.');
    }

    public function deleteNetworkOrganization(NetworkOrganization $networkOrganization): RedirectResponse
    {
        if ($networkOrganization->logo_path && !Str::startsWith($networkOrganization->logo_path, ['/'])) {
            Storage::disk('public')->delete('network_organizations/' . $networkOrganization->logo_path);
        }

        $networkOrganization->delete();

        return back()->with('success', 'Network organization deleted successfully.');
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
