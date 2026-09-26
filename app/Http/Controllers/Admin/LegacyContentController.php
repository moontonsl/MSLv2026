<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Carousel;
use App\Models\Event;
use App\Models\EventPhoto;
use App\Models\MslEvent;
use App\Models\News;
use App\Models\Setting;
use App\Models\ShortLink;
use App\Models\User;
use App\Models\ViolationReport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class LegacyContentController extends Controller
{
    public function news(): Response
    {
        return Inertia::render('Admin/Legacy/Index', [
            'module' => 'News Management',
            'records' => News::query()->latest('news_published')->paginate(20),
            'createRoute' => 'admin.news.create',
        ]);
    }

    public function pendingUsers(): Response
    {
        return Inertia::render('Admin/Legacy/Index', [
            'module' => 'Pending User Accounts',
            'records' => User::whereIn('status', ['pending', 'pending-review'])->latest()->paginate(20),
        ]);
    }

    public function verifyUser(User $user): RedirectResponse
    {
        $user->update(['status' => 'active', 'email_verified_at' => now()]);
        return back()->with('success', 'User verified successfully.');
    }

    public function slManagement(): Response
    {
        return Inertia::render('Admin/Legacy/Index', ['module' => 'Student Leader Management', 'records' => User::where('user_type', 'Student Leader')->latest()->paginate(20)]);
    }

    public function promoteToSl(User $user): RedirectResponse
    {
        abort_unless($user->status === 'active' && $user->user_type === 'Student', 422, 'Only active students can be promoted.');
        $user->update(['user_type' => 'Student Leader']);
        return back()->with('success', 'User promoted to Student Leader.');
    }

    public function demoteFromSl(User $user): RedirectResponse
    {
        abort_unless($user->user_type === 'Student Leader', 422, 'User is not a Student Leader.');
        $user->update(['user_type' => 'Student']);
        return back()->with('success', 'Student Leader demoted to Student.');
    }

    public function regionalAdminManagement(): Response
    {
        return Inertia::render('Admin/Legacy/Index', ['module' => 'Regional Admin Management', 'records' => User::where('user_type', 'Regional Admin')->latest()->paginate(20)]);
    }

    public function promoteToRegionalAdmin(User $user): RedirectResponse
    {
        abort_unless($user->status === 'active' && $user->user_type === 'Student Leader', 422, 'Only active Student Leaders can be promoted.');
        $user->update(['user_type' => 'Regional Admin']);
        return back()->with('success', 'User promoted to Regional Admin.');
    }

    public function demoteFromRegionalAdmin(User $user): RedirectResponse
    {
        abort_unless($user->user_type === 'Regional Admin', 422, 'User is not a Regional Admin.');
        $user->update(['user_type' => 'Student Leader']);
        return back()->with('success', 'Regional Admin demoted to Student Leader.');
    }

    public function createNews(): Response
    {
        return Inertia::render('Admin/Legacy/Form', ['module' => 'Create News', 'action' => route('admin.news.store')]);
    }

    public function storeNews(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'news_title' => ['required', 'string', 'max:255'],
            'news_subtitle' => ['nullable', 'string'],
            'news_canonical' => ['nullable', 'string', 'max:255'],
            'news_author' => ['nullable', 'string', 'max:255'],
            'news_state' => ['required', 'string', 'max:100'],
            'news_content' => ['nullable', 'string'],
            'news_img1' => ['nullable', 'image', 'max:5120'],
            'news_img2' => ['nullable', 'image', 'max:5120'],
            'news_img3' => ['nullable', 'image', 'max:5120'],
        ]);

        $validated['news_canonical'] = $validated['news_canonical'] ?: Str::slug($validated['news_title']);
        $validated['news_writer'] = $validated['news_author'] ?? null;
        $validated['news_published'] = now();
        unset($validated['news_author']);
        $this->storeImages($request, $validated, ['news_img1', 'news_img2', 'news_img3'], 'news');

        News::create($validated);
        return redirect()->route('admin.news')->with('success', 'News created successfully.');
    }

    public function editNews(News $news): Response
    {
        return Inertia::render('Admin/Legacy/Form', ['module' => 'Edit News', 'record' => $news, 'action' => route('admin.news.update', $news)]);
    }

    public function updateNews(Request $request, News $news): RedirectResponse
    {
        $validated = $request->validate([
            'news_title' => ['required', 'string', 'max:255'],
            'news_subtitle' => ['nullable', 'string'],
            'news_canonical' => ['nullable', 'string', 'max:255'],
            'news_author' => ['nullable', 'string', 'max:255'],
            'news_state' => ['required', 'string', 'max:100'],
            'news_content' => ['nullable', 'string'],
            'news_img1' => ['nullable', 'image', 'max:5120'],
            'news_img2' => ['nullable', 'image', 'max:5120'],
            'news_img3' => ['nullable', 'image', 'max:5120'],
        ]);

        $validated['news_canonical'] = $validated['news_canonical'] ?: Str::slug($validated['news_title']);
        $validated['news_writer'] = $validated['news_author'] ?? $news->news_writer;
        unset($validated['news_author']);
        $this->storeImages($request, $validated, ['news_img1', 'news_img2', 'news_img3'], 'news');
        $news->update($validated);

        return redirect()->route('admin.news')->with('success', 'News updated successfully.');
    }

    public function deleteNews(News $news): RedirectResponse
    {
        $news->delete();
        return back()->with('success', 'News deleted successfully.');
    }

    public function carousel(): Response
    {
        return Inertia::render('Admin/Legacy/Index', ['module' => 'Carousel Management', 'records' => Carousel::ordered()->get(), 'createRoute' => 'admin.carousel.create']);
    }

    public function createCarousel(): Response
    {
        return Inertia::render('Admin/Legacy/Form', ['module' => 'Create Carousel', 'action' => route('admin.carousel.store')]);
    }

    public function storeCarousel(Request $request): RedirectResponse
    {
        $validated = $request->validate(['title' => ['nullable', 'string', 'max:255'], 'image' => ['required', 'image', 'max:5120'], 'order' => ['nullable', 'integer', 'min:0']]);
        $validated['image_path'] = basename($request->file('image')->store('carousel', 'public'));
        unset($validated['image']);
        Carousel::create($validated);
        return back()->with('success', 'Carousel item created successfully.');
    }

    public function updateCarousel(Request $request, Carousel $carousel): RedirectResponse
    {
        $validated = $request->validate(['title' => ['nullable', 'string', 'max:255'], 'image' => ['nullable', 'image', 'max:5120'], 'order' => ['nullable', 'integer', 'min:0'], 'is_active' => ['nullable', 'boolean']]);
        if ($request->hasFile('image')) {
            $validated['image_path'] = basename($request->file('image')->store('carousel', 'public'));
        }
        unset($validated['image']);
        $carousel->update($validated);
        return back()->with('success', 'Carousel item updated successfully.');
    }

    public function deleteCarousel(Carousel $carousel): RedirectResponse
    {
        $carousel->delete();
        return back()->with('success', 'Carousel item deleted successfully.');
    }

    public function reorderCarousel(Request $request): RedirectResponse
    {
        $validated = $request->validate(['carousels' => ['required', 'array'], 'carousels.*.id' => ['required', 'integer', 'exists:carousels,id'], 'carousels.*.order' => ['required', 'integer', 'min:0']]);
        foreach ($validated['carousels'] as $item) Carousel::whereKey($item['id'])->update(['order' => $item['order']]);
        return back()->with('success', 'Carousel order updated successfully.');
    }

    public function eventPhotos(): Response
    {
        return Inertia::render('Admin/Legacy/Index', ['module' => 'Event Photos / Buffs and Support', 'records' => EventPhoto::latest()->get(), 'createRoute' => 'admin.event-photos.create']);
    }

    public function createEventPhoto(): Response
    {
        return Inertia::render('Admin/Legacy/Form', ['module' => 'Create Event Photo', 'action' => route('admin.event-photos.store')]);
    }

    public function storeEventPhoto(Request $request): RedirectResponse
    {
        $validated = $request->validate(['event_name' => ['required', 'string', 'max:255'], 'school_name' => ['required', 'string', 'max:255'], 'picture' => ['required', 'image', 'max:5120']]);
        $validated['picture'] = basename($request->file('picture')->store('event-photos', 'public'));
        EventPhoto::create($validated);
        return back()->with('success', 'Event photo added successfully.');
    }

    public function updateEventPhoto(Request $request, EventPhoto $eventPhoto): RedirectResponse
    {
        $validated = $request->validate(['event_name' => ['required', 'string', 'max:255'], 'school_name' => ['required', 'string', 'max:255'], 'picture' => ['nullable', 'image', 'max:5120']]);
        if ($request->hasFile('picture')) $validated['picture'] = basename($request->file('picture')->store('event-photos', 'public'));
        else unset($validated['picture']);
        $eventPhoto->update($validated);
        return back()->with('success', 'Event photo updated successfully.');
    }

    public function deleteEventPhoto(EventPhoto $eventPhoto): RedirectResponse
    {
        $eventPhoto->delete();
        return back()->with('success', 'Event photo deleted successfully.');
    }

    public function events(): Response
    {
        return Inertia::render('Admin/Legacy/Index', ['module' => 'Event Calendar', 'records' => Event::latest()->paginate(20), 'createRoute' => 'admin.events.create']);
    }

    public function createEvent(): Response
    {
        return Inertia::render('Admin/Legacy/Form', ['module' => 'Create Event', 'action' => route('admin.events.store')]);
    }

    public function storeEvent(Request $request): RedirectResponse
    {
        $data = $request->validate(['title' => ['required', 'string', 'max:255'], 'description' => ['nullable', 'string'], 'start_date' => ['required', 'date'], 'end_date' => ['required', 'date', 'after:start_date'], 'location' => ['nullable', 'string', 'max:255']]);
        $data['created_by'] = null;
        Event::create($data);
        return redirect()->route('admin.events')->with('success', 'Event created successfully.');
    }

    public function editEvent(Event $event): Response
    {
        return Inertia::render('Admin/Legacy/Form', ['module' => 'Edit Event', 'record' => $event, 'action' => route('admin.events.update', $event)]);
    }

    public function updateEvent(Request $request, Event $event): RedirectResponse
    {
        $data = $request->validate(['title' => ['required', 'string', 'max:255'], 'description' => ['nullable', 'string'], 'start_date' => ['required', 'date'], 'end_date' => ['required', 'date', 'after:start_date'], 'location' => ['nullable', 'string', 'max:255']]);
        $event->update($data);
        return redirect()->route('admin.events')->with('success', 'Event updated successfully.');
    }

    public function deleteEvent(Event $event): RedirectResponse
    {
        $event->delete();
        return back()->with('success', 'Event deleted successfully.');
    }

    public function mslEvents(): Response
    {
        return Inertia::render('Admin/Legacy/Index', ['module' => 'MSL Event Management', 'records' => MslEvent::latest()->paginate(20), 'createRoute' => 'admin.msl-events.create']);
    }

    public function createMslEvent(): Response
    {
        return Inertia::render('Admin/Legacy/Form', ['module' => 'Create MSL Event', 'action' => route('admin.msl-events.store')]);
    }

    public function storeMslEvent(Request $request): RedirectResponse
    {
        $data = $this->validateMslEvent($request);
        $data['event_canonical'] = $data['event_canonical'] ?: Str::slug($data['event_title']);
        $this->storeImages($request, $data, ['event_logo', 'event_img01', 'event_img02', 'event_img03', 'event_img04', 'event_img05'], 'events');
        MslEvent::create($data);
        return redirect()->route('admin.msl-events.index')->with('success', 'MSL event created successfully.');
    }

    public function editMslEvent(MslEvent $mslEvent): Response
    {
        return Inertia::render('Admin/Legacy/Form', ['module' => 'Edit MSL Event', 'record' => $mslEvent, 'action' => route('admin.msl-events.update', $mslEvent)]);
    }

    public function updateMslEvent(Request $request, MslEvent $mslEvent): RedirectResponse
    {
        $data = $this->validateMslEvent($request);
        $data['event_canonical'] = $data['event_canonical'] ?: $mslEvent->event_canonical;
        $this->storeImages($request, $data, ['event_logo', 'event_img01', 'event_img02', 'event_img03', 'event_img04', 'event_img05'], 'events');
        $mslEvent->update($data);
        return redirect()->route('admin.msl-events.index')->with('success', 'MSL event updated successfully.');
    }

    public function updateMslEventStatus(Request $request, MslEvent $mslEvent): RedirectResponse
    {
        $mslEvent->update($request->validate(['event_state' => ['required', 'in:Active,Inactive']]));
        return back()->with('success', 'MSL event status updated successfully.');
    }

    public function deleteMslEvent(MslEvent $mslEvent): RedirectResponse
    {
        $mslEvent->delete();
        return back()->with('success', 'MSL event deleted successfully.');
    }

    public function settings(): Response
    {
        return Inertia::render('Admin/Legacy/Index', ['module' => 'Settings', 'records' => Setting::orderBy('key')->get()]);
    }

    public function updateSettings(Request $request): RedirectResponse
    {
        foreach ($request->input('settings', []) as $key => $value) Setting::setValue((string) $key, $value);
        return back()->with('success', 'Settings updated successfully.');
    }

    public function footer(): Response
    {
        return Inertia::render('Admin/Legacy/Index', ['module' => 'Footer Management', 'records' => Setting::where('key', 'like', 'footer.%')->get()]);
    }

    public function updateFooter(Request $request): RedirectResponse
    {
        foreach ($request->input('footer', []) as $key => $value) Setting::setValue('footer.' . $key, $value);
        return back()->with('success', 'Footer updated successfully.');
    }

    public function shareLinks(): Response
    {
        return Inertia::render('Admin/Legacy/Index', ['module' => 'Share Links', 'records' => ShortLink::latest()->get()]);
    }

    public function storeShareLink(Request $request): RedirectResponse
    {
        ShortLink::create($request->validate(['code' => ['required', 'string', 'max:100', 'unique:short_links,code'], 'original_url' => ['required', 'url']]));
        return back()->with('success', 'Share link created successfully.');
    }

    public function updateShareLink(Request $request, ShortLink $shortLink): RedirectResponse
    {
        $shortLink->update($request->validate(['code' => ['required', 'string', 'max:100', 'unique:short_links,code,' . $shortLink->id], 'original_url' => ['required', 'url']]));
        return back()->with('success', 'Share link updated successfully.');
    }

    public function deleteShareLink(ShortLink $shortLink): RedirectResponse
    {
        $shortLink->delete();
        return back()->with('success', 'Share link deleted successfully.');
    }

    public function duplicateUsernames(): JsonResponse
    {
        $duplicates = User::query()->whereNotNull('username')->select('username')->groupBy('username')->havingRaw('COUNT(*) > 1')->pluck('username');
        return response()->json(['duplicates' => $duplicates]);
    }

    public function violationReports(): Response
    {
        return Inertia::render('Admin/Legacy/Index', ['module' => 'Violation Reports', 'records' => ViolationReport::latest()->paginate(20)]);
    }

    public function updateViolation(Request $request, ViolationReport $report): RedirectResponse
    {
        $report->update($request->validate(['status' => ['required', 'in:Pending,Reviewed,Resolved']]));
        return back()->with('success', 'Violation report updated successfully.');
    }

    public function faultyUsernames(): Response
    {
        return Inertia::render('Admin/Legacy/Index', ['module' => 'Faulty Username Checker', 'records' => User::whereNull('username')->orWhere('username', '')->select('id', 'name', 'email', 'username')->paginate(20)]);
    }

    public function faultyUsernameEmail(Request $request, int $userId): RedirectResponse
    {
        User::findOrFail($userId);
        return back()->with('warning', 'Email delivery is not enabled in MSLv2026 yet. The faulty username record was identified.');
    }

    public function faultyUsernameSelected(Request $request): RedirectResponse
    {
        $request->validate(['user_ids' => ['required', 'array'], 'user_ids.*' => ['integer', 'exists:users,id']]);
        return back()->with('warning', 'Email delivery is not enabled in MSLv2026 yet.');
    }

    public function faultyUsernameStats(): JsonResponse
    {
        return response()->json(['missing_username' => User::whereNull('username')->orWhere('username', '')->count()]);
    }

    public function duplicateUsernameForm(?int $userId = null): Response
    {
        return Inertia::render('Admin/Legacy/Form', ['module' => 'Change Username', 'record' => $userId ? User::findOrFail($userId) : null, 'action' => $userId ? route('admin.duplicate-usernames.update', $userId) : null]);
    }

    public function updateUsername(Request $request, int $userId): RedirectResponse
    {
        $user = User::findOrFail($userId);
        $user->update($request->validate(['username' => ['required', 'string', 'max:255', 'unique:users,username,' . $user->id]]));
        return back()->with('success', 'Username updated successfully.');
    }

    public function customUserList(): Response
    {
        return Inertia::render('Admin/Legacy/Index', ['module' => 'Custom User List', 'records' => User::latest()->paginate(50)]);
    }

    public function customUserListLogin(): Response
    {
        return Inertia::render('Admin/Auth/Login', ['status' => 'Use the main admin login for this protected utility.']);
    }

    public function customUserListEmail(Request $request): RedirectResponse
    {
        $request->validate(['ids' => ['required', 'array'], 'ids.*' => ['integer', 'exists:users,id']]);
        return back()->with('warning', 'Bulk email delivery is not enabled in MSLv2026 yet.');
    }

    public function customUserListDelete(Request $request): RedirectResponse
    {
        $data = $request->validate(['ids' => ['required', 'array'], 'ids.*' => ['integer', 'exists:users,id']]);
        User::whereIn('id', $data['ids'])->delete();
        return back()->with('success', 'Selected users deleted successfully.');
    }

    public function userRegions(): Response
    {
        return Inertia::render('Admin/Legacy/Index', ['module' => 'User Regions', 'records' => User::query()->select('id', 'name', 'region', 'island')->orderBy('region')->paginate(20)]);
    }

    private function validateMslEvent(Request $request): array
    {
        return $request->validate([
            'event_name' => ['required', 'string', 'max:255'],
            'event_title' => ['required', 'string', 'max:255'],
            'event_subtitle' => ['nullable', 'string'],
            'event_canonical' => ['nullable', 'string', 'max:255'],
            'event_state' => ['required', 'in:Active,Inactive'],
            'is_featured' => ['nullable', 'boolean'],
            'redirect_url' => ['nullable', 'url'],
            'event_content01' => ['nullable', 'string'],
            'event_content02' => ['nullable', 'string'],
            'event_logo' => ['nullable', 'image', 'max:5120'],
            'event_img01' => ['nullable', 'image', 'max:5120'],
            'event_img02' => ['nullable', 'image', 'max:5120'],
            'event_img03' => ['nullable', 'image', 'max:5120'],
            'event_img04' => ['nullable', 'image', 'max:5120'],
            'event_img05' => ['nullable', 'image', 'max:5120'],
        ]);
    }

    private function storeImages(Request $request, array &$data, array $fields, string $directory): void
    {
        foreach ($fields as $field) {
            if ($request->hasFile($field)) $data[$field] = basename($request->file($field)->store($directory, 'public'));
            else unset($data[$field]);
        }
    }
}
