<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ViolationReport;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ViolationReportAdminController extends Controller
{
    private const STATUSES = ['Pending', 'Reviewed', 'Resolved', 'Dismissed'];

    public function index(Request $request): Response
    {
        $status = in_array($request->input('status'), array_merge(['all'], self::STATUSES), true)
            ? $request->input('status')
            : 'all';
        $query = ViolationReport::query();

        if ($request->filled('search')) {
            $search = trim((string) $request->input('search'));
            $query->where(function ($builder) use ($search): void {
                $builder->where('name', 'like', '%' . $search . '%')
                    ->orWhere('school', 'like', '%' . $search . '%')
                    ->orWhere('incident_type', 'like', '%' . $search . '%')
                    ->orWhere('description', 'like', '%' . $search . '%');
            });
        }

        if ($status !== 'all') $query->where('status', $status);

        $reports = $query->latest()->paginate(10)->withQueryString();
        $reports->setCollection($reports->getCollection()->map(fn (ViolationReport $report) => $this->serialize($report)));

        return Inertia::render('Admin/ViolationReports', [
            'reports' => $reports,
            'filters' => [
                'search' => (string) $request->input('search', ''),
                'status' => $status,
            ],
            'statuses' => self::STATUSES,
        ]);
    }

    public function update(Request $request, ViolationReport $report): RedirectResponse
    {
        $report->update($request->validate(['status' => ['required', 'in:' . implode(',', self::STATUSES)]]));

        return back()->with('success', 'Violation report status updated successfully.');
    }

    private function serialize(ViolationReport $report): array
    {
        $evidence = $report->evidence;

        return [
            'id' => $report->id,
            'name' => $report->name,
            'school' => $report->school,
            'incident_type' => $report->incident_type,
            'description' => $report->description,
            'evidence' => $evidence,
            'evidence_url' => $evidence && Str::startsWith($evidence, ['http://', 'https://']) ? $evidence : null,
            'is_anonymous' => (bool) $report->is_anonymous,
            'status' => $report->status,
            'created_at' => $report->created_at?->toISOString(),
        ];
    }
}
