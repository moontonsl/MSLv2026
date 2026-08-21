<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Region;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    protected function accessibleUsers(array $types = ['Student', 'Student Leader'])
    {
        $query = User::whereIn('user_type', $types);
        $admin = Auth::user();

        if ($admin?->user_type !== 'Regional Admin') {
            return $query;
        }

        $region = Region::query()
            ->where(function ($builder) use ($admin) {
                $builder->where('code', $admin->region)
                    ->orWhere('name', $admin->region)
                    ->orWhere('region_number', $admin->region)
                    ->orWhere('acronym', $admin->region);
            })
            ->first();

        $regionValues = collect([
            $admin->region,
            $region?->code,
            $region?->name,
            $region?->region_number,
            $region?->acronym,
        ])->filter()->unique()->values();

        return $regionValues->isEmpty()
            ? $query->whereRaw('1 = 0')
            : $query->whereIn('region', $regionValues->all());
    }

    /**
     * Helper check for admin privileges.
     */
    protected function checkAdminPrivilege()
    {
        $user = Auth::user();
        if (!$user || !in_array($user->user_type, ['Super Admin', 'Regional Admin', 'Student Leader'])) {
            abort(403, 'Unauthorized access.');
        }
    }

    /**
     * Display the administration dashboard.
     */
    public function index(Request $request): Response
    {
        $this->checkAdminPrivilege();

        $query = $this->accessibleUsers();

        // Apply filters if present (status filter is now handled on the client side to keep accurate counts)
        if ($request->filled('region')) {
            $query->where('region', 'like', '%' . $request->region . '%');
        }
        if ($request->filled('division')) {
            $query->where('division', $request->division);
        }
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('username', 'like', '%' . $search . '%')
                  ->orWhere('email', 'like', '%' . $search . '%')
                  ->orWhere('ml_ign', 'like', '%' . $search . '%');
            });
        }

        $users = $query->orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/Dashboard', [
            'students' => $users,
            'filters' => $request->only(['status', 'region', 'division', 'search']),
        ]);
    }

    /**
     * Approve a registered student account.
     */
    public function approve($id): RedirectResponse
    {
        $this->checkAdminPrivilege();

        $student = $this->accessibleUsers()->findOrFail($id);
        
        // Record renewal approval timestamp if they were renewing
        if (in_array($student->status, ['pending-review', 'renewal-required'])) {
            $student->renewal_approved_at = now();
            $student->renewal_notice_dismissed_at = null;
        }

        $student->status = 'active';
        $student->rejection_reason = null;
        $student->rejection_checklist = null;
        $student->renewal_requested_at = null;
        $student->renewal_submitted_at = null;
        $student->renewal_requirements = null;
        
        $student->save();

        return redirect()->back()->with('status', 'Student account approved successfully.');
    }

    /**
     * Reject a registered student account.
     */
    public function reject(Request $request, $id): RedirectResponse
    {
        $this->checkAdminPrivilege();

        $request->validate([
            'reason' => 'required|string|max:1000',
            'checklist' => 'nullable|array',
        ]);

        $student = $this->accessibleUsers()->findOrFail($id);

        $student->status = 'rejected';
        $student->rejection_reason = $request->reason;
        
        // Checklist is cast as an array in User model, so save array directly
        $student->rejection_checklist = $request->checklist ?? [];
        
        $student->save();

        return redirect()->back()->with('status', 'Student account rejected.');
    }

    /**
     * Mark an active student for renewal and define the requirements to update.
     */
    public function markRenewal(Request $request, $id): RedirectResponse
    {
        $this->checkAdminPrivilege();

        $validated = $request->validate([
            'requirements' => 'required|array|min:1',
            'requirements.*' => 'required|string|in:school,course,yearLevel,schoolId,fullName,document',
        ]);

        $student = $this->accessibleUsers(['Student'])->findOrFail($id);
        $student->status = 'renewal-required';
        $student->renewal_requested_at = now();
        $student->renewal_submitted_at = null;
        $student->renewal_approved_at = null;
        $student->renewal_requirements = array_values(array_unique([
            ...$validated['requirements'],
            'document',
        ]));
        $student->rejection_reason = null;
        $student->rejection_checklist = null;
        $student->save();

        return redirect()->back()->with('status', 'Student account marked for renewal.');
    }

    /**
     * Block an account from accessing the platform.
     */
    public function block(Request $request, $id): RedirectResponse
    {
        $this->checkAdminPrivilege();

        $student = $this->accessibleUsers()->findOrFail($id);
        $student->status = 'blocked';
        $student->rejection_reason = $request->input('reason');
        $student->save();

        return redirect()->back()->with('status', 'Account blocked successfully.');
    }

    /**
     * Promote Student to Student Leader, or Student Leader to Regional Admin.
     */
    public function promote($id): RedirectResponse
    {
        $this->checkAdminPrivilege();

        $student = $this->accessibleUsers()->findOrFail($id);

        if ($student->status !== 'active') {
            return redirect()->back()->withErrors([
                'message' => 'Only active accounts can be promoted.',
            ]);
        }

        $student->user_type = $student->user_type === 'Student'
            ? 'Student Leader'
            : 'Regional Admin';
        $student->save();

        return redirect()->back()->with('status', 'Account promoted successfully.');
    }
}
