<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
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

        $query = User::whereIn('user_type', ['Student', 'Student Leader']);

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

        $student = User::whereIn('user_type', ['Student', 'Student Leader'])->findOrFail($id);
        
        // Record renewal approval timestamp if they were renewing
        if (in_array($student->status, ['pending-review', 'renewal-required'])) {
            $student->renewal_approved_at = now();
        }

        $student->status = 'active';
        $student->rejection_reason = null;
        $student->rejection_checklist = null;
        
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

        $student = User::whereIn('user_type', ['Student', 'Student Leader'])->findOrFail($id);

        $student->status = 'rejected';
        $student->rejection_reason = $request->reason;
        
        // Checklist is cast as an array in User model, so save array directly
        $student->rejection_checklist = $request->checklist ?? [];
        
        $student->save();

        return redirect()->back()->with('status', 'Student account rejected.');
    }
}
