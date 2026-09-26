<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RegionalAdminManagementController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();

        $regionalAdmins = $this->search($this->regionalAdminsQuery(), $search)
            ->latest('created_at')
            ->paginate(20, ['*'], 'admin_page')
            ->withQueryString();

        $eligibleUsers = $this->search($this->eligibleUsersQuery(), $search)
            ->latest('created_at')
            ->paginate(20, ['*'], 'eligible_page')
            ->withQueryString();

        return Inertia::render('Admin/RegionalAdmins', [
            'regionalAdmins' => $regionalAdmins,
            'eligibleUsers' => $eligibleUsers,
            'filters' => $request->only('search'),
        ]);
    }

    public function promote(User $user): RedirectResponse
    {
        abort_unless(
            in_array($user->user_type, ['Student', 'Student Leader'], true)
                && $user->status === 'active'
                && filled($user->region),
            422,
            'Only active users with an assigned region can become Regional Admins.'
        );

        $user->update(['user_type' => 'Regional Admin']);

        return back()->with('success', 'User promoted to Regional Admin successfully.');
    }

    public function demote(User $user): RedirectResponse
    {
        abort_unless(
            $user->user_type === 'Regional Admin',
            422,
            'User is not a Regional Admin.'
        );

        $user->update(['user_type' => 'Student Leader']);

        return back()->with('success', 'Regional Admin demoted to Student Leader successfully.');
    }

    private function regionalAdminsQuery()
    {
        return User::query()
            ->where('user_type', 'Regional Admin')
            ->select($this->columns());
    }

    private function eligibleUsersQuery()
    {
        return User::query()
            ->whereIn('user_type', ['Student', 'Student Leader'])
            ->where('status', 'active')
            ->whereNotNull('region')
            ->where('region', '<>', '')
            ->select($this->columns());
    }

    private function search($query, string $search)
    {
        if ($search === '') {
            return $query;
        }

        return $query->where(function ($builder) use ($search) {
            $builder->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('username', 'like', "%{$search}%")
                ->orWhere('ml_id', 'like', "%{$search}%")
                ->orWhere('university', 'like', "%{$search}%")
                ->orWhere('region', 'like', "%{$search}%");
        });
    }

    private function columns(): array
    {
        return [
            'id',
            'name',
            'email',
            'username',
            'ml_id',
            'university',
            'region',
            'status',
            'user_type',
            'created_at',
        ];
    }
}
