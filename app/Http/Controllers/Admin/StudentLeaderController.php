<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentLeaderController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();

        $slUsers = $this->search($this->studentLeadersQuery(), $search)
            ->latest('created_at')
            ->paginate(20, ['*'], 'sl_page')
            ->withQueryString();

        $students = $this->search($this->eligibleStudentsQuery(), $search)
            ->latest('created_at')
            ->paginate(20, ['*'], 'student_page')
            ->withQueryString();

        return Inertia::render('Admin/StudentLeaders', [
            'slUsers' => $slUsers,
            'students' => $students,
            'filters' => $request->only('search'),
        ]);
    }

    public function promote(User $user): RedirectResponse
    {
        abort_unless(
            $user->user_type === 'Student' && $user->status === 'active',
            422,
            'Only active students can be promoted to Student Leader.'
        );

        $user->update(['user_type' => 'Student Leader']);

        return back()->with('success', 'User promoted to Student Leader successfully.');
    }

    public function demote(User $user): RedirectResponse
    {
        abort_unless(
            $user->user_type === 'Student Leader',
            422,
            'User is not a Student Leader.'
        );

        $user->update(['user_type' => 'Student']);

        return back()->with('success', 'Student Leader demoted to Student successfully.');
    }

    private function studentLeadersQuery()
    {
        return User::query()
            ->where('user_type', 'Student Leader')
            ->select($this->columns());
    }

    private function eligibleStudentsQuery()
    {
        return User::query()
            ->where('user_type', 'Student')
            ->where('status', 'active')
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
