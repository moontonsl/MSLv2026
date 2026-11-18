<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Carousel;
use App\Models\CommunityVoice;
use App\Models\Institution;
use App\Models\MslEvent;
use App\Models\NetworkOrganization;
use App\Models\Program;
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
    public const MAX_BOOKMARKED_PROGRAMS = 5;

    public static function getLiveStatistics(): array
    {
        $studentsCount = User::where('user_type', 'Student')->count();
        $campusesCount = class_exists(Institution::class) ? Institution::count() : 0;
        $eventsCount = (class_exists(\App\Models\Event::class) ? \App\Models\Event::count() : 0)
            + (class_exists(\App\Models\CampusTournament::class) ? \App\Models\CampusTournament::count() : 0)
            + (class_exists(MslEvent::class) ? MslEvent::count() : 0);
        $leadersCount = User::where('user_type', 'Student Leader')->count();

        return [
            'student_gamers' => $studentsCount > 0 ? ($studentsCount.'+') : '0',
            'campus_communities' => $campusesCount > 0 ? (number_format($campusesCount).'+') : '0',
            'events_sponsored' => $eventsCount > 0 ? ($eventsCount.'+') : '0',
            'student_leaders' => $leadersCount > 0 ? ($leadersCount.'+') : '0',
        ];
    }

    public function index(): RedirectResponse
    {
        return redirect()->route('admin.home-page.hero-carousel');
    }

    public function heroCarousel(): Response
    {
        return Inertia::render('Admin/HomePage/HeroCarousel', [
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

    public function statistics(): Response
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

        return Inertia::render('Admin/HomePage/StatisticsCounters', [
            'statistics' => $statistics,
            'liveCounts' => $liveCounts,
        ]);
    }

    public function networkOrganizations(): Response
    {
        return Inertia::render('Admin/HomePage/NetworkOrganizations', [
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

    public function programs(): Response
    {
        return Inertia::render('Admin/HomePage/OurPrograms', [
            'programs' => Program::query()
                ->orderBy('order')
                ->orderBy('id')
                ->get()
                ->map(fn (Program $p) => [
                    'id' => $p->id,
                    'title' => $p->title,
                    'description' => $p->description,
                    'link' => $p->link,
                    'icon' => $p->icon,
                    'color' => $p->color,
                    'is_bookmarked' => $p->is_bookmarked,
                    'is_active' => $p->is_active,
                    'order' => $p->order,
                    'image_path' => $p->image_path,
                    'image_url' => $p->image_url,
                ])
                ->values(),
            'bookmarkedCount' => Program::where('is_bookmarked', true)->count(),
            'maxBookmarked' => self::MAX_BOOKMARKED_PROGRAMS,
        ]);
    }

    public function storeProgram(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1500'],
            'link' => ['nullable', 'string', 'max:500'],
            'icon' => ['nullable', 'string', 'max:50'],
            'color' => ['nullable', 'string', 'max:30'],
            'image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,gif,webp,svg', 'max:5120'],
            'is_bookmarked' => ['nullable', 'boolean'],
            'is_active' => ['nullable', 'boolean'],
            'order' => ['nullable', 'integer', 'min:0'],
        ]);

        $wantsBookmark = $request->boolean('is_bookmarked', false);
        if ($wantsBookmark && Program::where('is_bookmarked', true)->count() >= self::MAX_BOOKMARKED_PROGRAMS) {
            return back()->with('error', 'Maximum of '.self::MAX_BOOKMARKED_PROGRAMS.' programs can be bookmarked for the homepage. Please unbookmark one first.');
        }

        if ($request->hasFile('image')) {
            $data['image_path'] = basename($request->file('image')->store('programs', 'public'));
        }
        unset($data['image']);

        $maxOrder = Program::max('order');
        $data['order'] ??= $maxOrder === null ? 1 : ((int) $maxOrder) + 1;
        $data['icon'] = $data['icon'] ?? 'swords';
        $data['color'] = $data['color'] ?? '#f2c21a';
        $data['is_bookmarked'] = $wantsBookmark;
        $data['is_active'] = $request->boolean('is_active', true);

        Program::create($data);

        return back()->with('success', 'Program added successfully and published to Our Programs.');
    }

    public function updateProgram(Request $request, Program $program): RedirectResponse
    {
        $data = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string', 'max:1500'],
            'link' => ['sometimes', 'nullable', 'string', 'max:500'],
            'icon' => ['sometimes', 'nullable', 'string', 'max:50'],
            'color' => ['sometimes', 'nullable', 'string', 'max:30'],
            'image' => ['sometimes', 'nullable', 'image', 'mimes:jpeg,jpg,png,gif,webp,svg', 'max:5120'],
            'is_bookmarked' => ['sometimes', 'boolean'],
            'is_active' => ['sometimes', 'boolean'],
            'order' => ['sometimes', 'integer', 'min:0'],
        ]);

        if ($request->has('is_bookmarked')) {
            $wantsBookmark = $request->boolean('is_bookmarked');
            if (
                $wantsBookmark
                && ! $program->is_bookmarked
                && Program::where('is_bookmarked', true)->where('id', '!=', $program->id)->count() >= self::MAX_BOOKMARKED_PROGRAMS
            ) {
                return back()->with('error', 'Maximum of '.self::MAX_BOOKMARKED_PROGRAMS.' programs can be bookmarked for the homepage. Please unbookmark one first.');
            }
            $data['is_bookmarked'] = $wantsBookmark;
        }

        if ($request->has('is_active')) {
            $data['is_active'] = $request->boolean('is_active');
        }

        if ($request->hasFile('image')) {
            if ($program->image_path && ! Str::startsWith($program->image_path, ['/', 'http://', 'https://'])) {
                Storage::disk('public')->delete('programs/'.$program->image_path);
            }
            $data['image_path'] = basename($request->file('image')->store('programs', 'public'));
            unset($data['image']);
        }

        $program->update($data);

        return back()->with('success', 'Program updated successfully.');
    }

    public function toggleProgramBookmark(Request $request, Program $program): RedirectResponse
    {
        $target = $request->has('is_bookmarked')
            ? $request->boolean('is_bookmarked')
            : ! $program->is_bookmarked;

        if (
            $target
            && Program::where('is_bookmarked', true)->where('id', '!=', $program->id)->count() >= self::MAX_BOOKMARKED_PROGRAMS
        ) {
            return back()->with(
                'error',
                'Maximum of '.self::MAX_BOOKMARKED_PROGRAMS.' programs can be bookmarked for the homepage. Please unbookmark an active one first.'
            );
        }

        $program->update(['is_bookmarked' => $target]);

        return back()->with(
            'success',
            $target
                ? 'Program bookmarked for the Homepage (max '.self::MAX_BOOKMARKED_PROGRAMS.').'
                : 'Program removed from Homepage bookmarks.'
        );
    }

    public function deleteProgram(Program $program): RedirectResponse
    {
        if ($program->image_path && ! Str::startsWith($program->image_path, ['/', 'http://', 'https://'])) {
            Storage::disk('public')->delete('programs/'.$program->image_path);
        }

        $program->delete();

        return back()->with('success', 'Program deleted successfully.');
    }

    public function communityVoice(): Response
    {
        $schools = class_exists(Institution::class)
            ? Institution::query()
                ->where('status', 'active')
                ->orderBy('name')
                ->limit(300)
                ->pluck('name')
                ->values()
            : collect();

        return Inertia::render('Admin/HomePage/CommunityVoice', [
            'voices' => CommunityVoice::query()
                ->orderBy('order')
                ->orderByDesc('id')
                ->get()
                ->map(fn (CommunityVoice $v) => [
                    'id' => $v->id,
                    'name' => $v->name,
                    'role' => $v->role,
                    'school' => $v->school,
                    'quote' => $v->quote,
                    'is_active' => $v->is_active,
                    'order' => $v->order,
                    'image_path' => $v->image_path,
                    'image_url' => $v->image_url,
                ])
                ->values(),
            'schools' => $schools,
            'sectionVisible' => filter_var(Setting::getValue('homepage_community_voices_visible', '1'), FILTER_VALIDATE_BOOLEAN),
        ]);
    }

    public function storeCommunityVoice(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'role' => ['required', 'string', 'max:255'],
            'school' => ['required', 'string', 'max:255'],
            'quote' => ['required', 'string', 'max:1500'],
            'image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,gif,webp,svg', 'max:5120'],
            'is_active' => ['nullable', 'boolean'],
            'order' => ['nullable', 'integer', 'min:0'],
        ]);

        if ($request->hasFile('image')) {
            $data['image_path'] = basename($request->file('image')->store('community_voices', 'public'));
        }
        unset($data['image']);

        $maxOrder = CommunityVoice::max('order');
        $data['order'] ??= $maxOrder === null ? 1 : ((int) $maxOrder) + 1;
        $data['is_active'] = $request->boolean('is_active', true);

        CommunityVoice::create($data);

        return back()->with('success', 'Community story added successfully.');
    }

    public function updateCommunityVoice(Request $request, CommunityVoice $communityVoice): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'role' => ['sometimes', 'required', 'string', 'max:255'],
            'school' => ['sometimes', 'required', 'string', 'max:255'],
            'quote' => ['sometimes', 'required', 'string', 'max:1500'],
            'image' => ['sometimes', 'nullable', 'image', 'mimes:jpeg,jpg,png,gif,webp,svg', 'max:5120'],
            'is_active' => ['sometimes', 'boolean'],
            'order' => ['sometimes', 'integer', 'min:0'],
        ]);

        if ($request->has('is_active')) {
            $data['is_active'] = $request->boolean('is_active');
        }

        if ($request->hasFile('image')) {
            if ($communityVoice->image_path && ! Str::startsWith($communityVoice->image_path, ['/', 'http://', 'https://'])) {
                Storage::disk('public')->delete('community_voices/'.$communityVoice->image_path);
            }
            $data['image_path'] = basename($request->file('image')->store('community_voices', 'public'));
            unset($data['image']);
        }

        $communityVoice->update($data);

        return back()->with('success', 'Community story updated successfully.');
    }

    public function toggleCommunityVoiceVisibility(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'visible' => ['required', 'boolean'],
        ]);

        Setting::setValue('homepage_community_voices_visible', $validated['visible'] ? '1' : '0', 'string');

        return back()->with(
            'success',
            $validated['visible']
                ? 'MSL Campus Community section is now visible on the Homepage.'
                : 'MSL Campus Community section is now hidden on the Homepage.'
        );
    }

    public function deleteCommunityVoice(CommunityVoice $communityVoice): RedirectResponse
    {
        if ($communityVoice->image_path && ! Str::startsWith($communityVoice->image_path, ['/', 'http://', 'https://'])) {
            Storage::disk('public')->delete('community_voices/'.$communityVoice->image_path);
        }

        $communityVoice->delete();

        return back()->with('success', 'Community story deleted successfully.');
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
            if ($networkOrganization->logo_path && ! Str::startsWith($networkOrganization->logo_path, ['/'])) {
                Storage::disk('public')->delete('network_organizations/'.$networkOrganization->logo_path);
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
        if ($networkOrganization->logo_path && ! Str::startsWith($networkOrganization->logo_path, ['/'])) {
            Storage::disk('public')->delete('network_organizations/'.$networkOrganization->logo_path);
        }

        $networkOrganization->delete();

        return back()->with('success', 'Network organization deleted successfully.');
    }

    private function imageUrl(?string $image): ?string
    {
        if (! $image) {
            return null;
        }

        if (Str::startsWith($image, ['/'])) {
            return $image;
        }

        return Storage::disk('public')->url('carousel/'.$image);
    }
}
