<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PendingUserController extends Controller
{
    public function index(Request $request): Response
    {
        $tab = $request->string('tab', 'all')->toString();
        $query = $this->pendingUsersQuery();

        if ($tab === 'pending') {
            $query->where('status', 'pending');
        } elseif ($tab === 'renewal') {
            $query->where('status', 'pending-review');
        } elseif ($tab === 'has-doc') {
            $query->whereNotNull('proofOfEnrollment');
        } elseif ($tab === 'missing-doc') {
            $query->whereNull('proofOfEnrollment');
        }

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $query->where(function ($builder) use ($search) {
                $builder->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('username', 'like', "%{$search}%")
                    ->orWhere('ml_id', 'like', "%{$search}%")
                    ->orWhere('ml_ign', 'like', "%{$search}%")
                    ->orWhere('studentId', 'like', "%{$search}%")
                    ->orWhere('university', 'like', "%{$search}%");
            });
        }

        $users = $query
            ->latest('updated_at')
            ->paginate(10)
            ->withQueryString();

        $stats = [
            'all' => $this->pendingUsersQuery()->count(),
            'pending' => $this->pendingUsersQuery()->where('status', 'pending')->count(),
            'renewal' => $this->pendingUsersQuery()->where('status', 'pending-review')->count(),
            'has_doc' => $this->pendingUsersQuery()->whereNotNull('proofOfEnrollment')->count(),
            'missing_doc' => $this->pendingUsersQuery()->whereNull('proofOfEnrollment')->count(),
        ];

        return Inertia::render('Admin/PendingUsers', [
            'users' => $users,
            'filters' => [
                'search' => $request->input('search', ''),
                'tab' => $tab,
            ],
            'stats' => $stats,
        ]);
    }

    /**
     * Approve and verify a student account with document audit.
     */
    public function approve(User $user): RedirectResponse
    {
        abort_unless(
            $this->pendingUsersQuery()->whereKey($user->id)->exists(),
            422,
            'This account is not awaiting verification.'
        );

        $user->email_verified_at = $user->email_verified_at ?? now();
        $user->status = 'active';

        if (in_array($user->status, ['pending-review', 'renewal-required'], true)) {
            $user->renewal_approved_at = now();
            $user->renewal_notice_dismissed_at = null;
        }

        $user->rejection_reason = null;
        $user->rejection_checklist = null;
        $user->renewal_requested_at = null;
        $user->renewal_submitted_at = null;
        $user->renewal_requirements = null;
        $user->save();

        return back()->with('success', "Student account for {$user->name} has been verified and approved.");
    }

    /**
     * Reject a student account with remarks and checklist.
     */
    public function reject(Request $request, User $user): RedirectResponse
    {
        abort_unless(
            $this->pendingUsersQuery()->whereKey($user->id)->exists(),
            422,
            'This account is not awaiting verification.'
        );

        $validated = $request->validate([
            'reason' => 'required|string|max:1000',
            'checklist' => 'nullable|array',
        ]);

        $user->status = 'rejected';
        $user->rejection_reason = $validated['reason'];
        $user->rejection_checklist = $validated['checklist'] ?? [];
        $user->save();

        return back()->with('success', "Application for {$user->name} has been rejected.");
    }

    /**
     * Legacy verify alias.
     */
    public function verify(User $user): RedirectResponse
    {
        return $this->approve($user);
    }

    /**
     * Base query for genuine pending verification queue.
     * Excludes already active or blocked accounts.
     */
    private function pendingUsersQuery()
    {
        return User::query()
            ->whereIn('status', ['pending', 'pending-review'])
            ->where(function ($query) {
                $query->whereIn('user_type', ['Student', 'Student Leader'])
                    ->orWhereNull('user_type');
            })
            ->select([
                'id',
                'name',
                'first_name',
                'surname',
                'email',
                'username',
                'status',
                'user_type',
                'university',
                'course',
                'year_level',
                'studentId',
                'proofOfEnrollment',
                'ml_id',
                'ml_server',
                'ml_ign',
                'ml_rank',
                'gender',
                'contact_number',
                'facebook_link',
                'rejection_reason',
                'rejection_checklist',
                'renewal_requirements',
                'created_at',
                'updated_at',
            ]);
    }
}

