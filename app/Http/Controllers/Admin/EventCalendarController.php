<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class EventCalendarController extends Controller
{
    public function index(Request $request): Response
    {
        $filter = in_array($request->input('filter'), ['all', 'upcoming', 'past'], true)
            ? $request->input('filter')
            : 'all';

        $query = Event::query();

        if ($request->filled('search')) {
            $search = trim((string) $request->input('search'));
            $query->where(function ($builder) use ($search): void {
                $builder
                    ->where('title', 'like', '%' . $search . '%')
                    ->orWhere('description', 'like', '%' . $search . '%')
                    ->orWhere('location', 'like', '%' . $search . '%');
            });
        }

        if ($filter === 'upcoming') {
            $query->where('end_date', '>=', now());
        } elseif ($filter === 'past') {
            $query->where('end_date', '<', now());
        }

        $events = $query->orderBy('start_date')->paginate(10)->withQueryString();
        $events->setCollection($events->getCollection()->map(fn (Event $event) => $this->serialize($event)));

        $editingEvent = null;
        if ($request->filled('edit') && ctype_digit((string) $request->input('edit'))) {
            $editingEvent = Event::find($request->integer('edit'));
        }

        return Inertia::render('Admin/Events', [
            'events' => $events,
            'filters' => [
                'search' => (string) $request->input('search', ''),
                'filter' => $filter,
            ],
            'showForm' => $request->boolean('create') || $editingEvent !== null,
            'editingEvent' => $editingEvent ? $this->serialize($editingEvent) : null,
        ]);
    }

    public function create(): RedirectResponse
    {
        return redirect()->route('admin.events', ['create' => 1]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->rules());
        $validated['created_by'] = Auth::guard('admin')->id();

        Event::create($validated);

        return redirect()->route('admin.events')->with('success', 'Event created successfully.');
    }

    public function edit(Event $event): RedirectResponse
    {
        return redirect()->route('admin.events', ['edit' => $event->id]);
    }

    public function update(Request $request, Event $event): RedirectResponse
    {
        $event->update($request->validate($this->rules()));

        return redirect()->route('admin.events')->with('success', 'Event updated successfully.');
    }

    public function destroy(Event $event): RedirectResponse
    {
        $event->delete();

        return back()->with('success', 'Event deleted successfully.');
    }

    private function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after:start_date'],
            'location' => ['nullable', 'string', 'max:255'],
        ];
    }

    private function serialize(Event $event): array
    {
        return [
            'id' => $event->id,
            'title' => $event->title,
            'description' => $event->description,
            'start_date' => $event->start_date?->format('Y-m-d\TH:i'),
            'end_date' => $event->end_date?->format('Y-m-d\TH:i'),
            'location' => $event->location,
            'created_by' => $event->created_by,
            'created_at' => $event->created_at?->toISOString(),
        ];
    }
}
