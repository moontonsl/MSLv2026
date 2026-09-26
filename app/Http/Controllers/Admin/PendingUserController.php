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
        $query = $this->pendingUsersQuery();

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $query->where(function ($builder) use ($search) {
                $builder->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('username', 'like', "%{$search}%")
                    ->orWhere('ml_id', 'like', "%{$search}%");
            });
        }

        $users = $query
            ->latest('created_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/PendingUsers', [
            'users' => $users,
            'filters' => $request->only('search'),
        ]);
    }

    public function verify(User $user): RedirectResponse
    {
        abort_unless(
            $this->pendingUsersQuery()->whereKey($user->id)->exists(),
            422,
            'This account is not awaiting verification.'
        );

        $user->email_verified_at = now();

        // Initial pending accounts can enter the normal student flow after
        // verification. Renewal reviews must still be approved from the
        // dashboard so their document review is not bypassed.
        if ($user->status === 'pending' || $user->status === null) {
            $user->status = 'active';
        }

        $user->save();

        return back()->with('success', 'User verified successfully.');
    }

    private function pendingUsersQuery()
    {
        return User::query()
            ->where(function ($query) {
                $query->whereIn('status', ['pending', 'pending-review'])
                    ->orWhereNull('email_verified_at');
            })
            ->where(function ($query) {
                $query->whereIn('user_type', ['Student', 'Student Leader'])
                    ->orWhereNull('user_type');
            })
            ->select([
                'id',
                'name',
                'email',
                'username',
                'ml_id',
                'status',
                'user_type',
                'created_at',
            ]);
    }
}
