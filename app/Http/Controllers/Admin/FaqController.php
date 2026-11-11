<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FaqController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Faq', [
            'faqs' => Faq::query()->orderBy('id')->get(),
            'pinnedCount' => Faq::where('is_pinned', true)->count(),
            'maxPinned' => 5,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Faq::create($request->validate([
            'category' => ['required', 'string', 'max:100'],
            'question' => ['required', 'string', 'max:255'],
            'answer' => ['required', 'string'],
        ]));

        return back()->with('success', 'FAQ created successfully.');
    }

    public function update(Request $request, Faq $faq): RedirectResponse
    {
        $faq->update($request->validate([
            'category' => ['required', 'string', 'max:100'],
            'question' => ['required', 'string', 'max:255'],
            'answer' => ['required', 'string'],
        ]));

        return back()->with('success', 'FAQ updated successfully.');
    }

    public function updatePin(Request $request, Faq $faq): RedirectResponse
    {
        $validated = $request->validate([
            'is_pinned' => ['required', 'boolean'],
        ]);

        if ($validated['is_pinned'] && Faq::where('is_pinned', true)->where('id', '!=', $faq->id)->count() >= 5) {
            return back()->with('error', 'Maximum of 5 FAQs can be active/pinned for the homepage. Please unpin an active one first.');
        }

        $faq->update(['is_pinned' => $validated['is_pinned']]);

        return back()->with(
            'success',
            $validated['is_pinned']
                ? 'FAQ is now active on the public homepage (max 5).'
                : 'FAQ removed from the public homepage.',
        );
    }

    public function destroy(Faq $faq): RedirectResponse
    {
        $faq->delete();
        return back()->with('success', 'FAQ deleted successfully.');
    }
}
