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
        return Inertia::render('Admin/Faq', ['faqs' => Faq::query()->latest()->get()]);
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

        $faq->update(['is_pinned' => $validated['is_pinned']]);

        return back()->with(
            'success',
            $validated['is_pinned']
                ? 'FAQ added to the public FAQ section.'
                : 'FAQ removed from the public FAQ section.',
        );
    }

    public function destroy(Faq $faq): RedirectResponse
    {
        $faq->delete();
        return back()->with('success', 'FAQ deleted successfully.');
    }
}
