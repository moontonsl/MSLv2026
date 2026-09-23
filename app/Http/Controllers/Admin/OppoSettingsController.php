<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\OppoRoadshowDate;
use App\Models\OppoRoadshowSchool;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OppoSettingsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Legacy/Index', ['module' => 'Oppo Roadshow Settings', 'records' => OppoRoadshowSchool::latest()->get()->concat(OppoRoadshowDate::latest()->get())]);
    }

    public function store(Request $request): RedirectResponse
    {
        OppoRoadshowSchool::firstOrCreate($request->validate(['school_id' => ['required', 'integer']]));
        return back()->with('success', 'School added to Roadshow list.');
    }

    public function destroy(int $id): RedirectResponse
    {
        OppoRoadshowSchool::findOrFail($id)->delete();
        return back()->with('success', 'School removed from Roadshow list.');
    }

    public function storeDate(Request $request): RedirectResponse
    {
        OppoRoadshowDate::create($request->validate(['event_date' => ['required', 'string', 'max:255']]));
        return back()->with('success', 'Date added successfully.');
    }

    public function destroyDate(int $id): RedirectResponse
    {
        OppoRoadshowDate::findOrFail($id)->delete();
        return back()->with('success', 'Date removed successfully.');
    }

    public function getRoadshowSchools(): JsonResponse
    {
        return response()->json(OppoRoadshowSchool::query()->pluck('school_id'));
    }

    public function getRoadshowData(): JsonResponse
    {
        return response()->json(['schools' => OppoRoadshowSchool::query()->pluck('school_id'), 'dates' => OppoRoadshowDate::where('is_active', true)->orderBy('event_date')->pluck('event_date')]);
    }
}
