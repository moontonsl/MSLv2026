<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Region;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class RegionalAdminController extends Controller
{
    public function index(Request $request): Response
    {
        $admin = $request->user();

        abort_unless(
            $admin && in_array($admin->user_type, ['Super Admin', 'Regional Admin'], true),
            403,
            'Unauthorized access.'
        );

        $query = User::query()->whereIn('user_type', ['Student', 'Student Leader']);

        if ($admin->user_type === 'Regional Admin') {
            $regionValues = collect([$admin->region])
                ->filter()
                ->flatMap(function (string $value) {
                    $region = Region::query()
                        ->where(function ($query) use ($value) {
                            $query->where('code', $value)
                                ->orWhere('name', $value)
                                ->orWhere('region_number', $value)
                                ->orWhere('acronym', $value);
                        })
                        ->first();

                    return $region
                        ? [$value, $region->code, $region->name, $region->region_number, $region->acronym]
                        : [$value];
                })
                ->unique()
                ->values();

            if ($regionValues->isEmpty()) {
                $query->whereRaw('1 = 0');
            } else {
                $query->whereIn('region', $regionValues->all());
            }
        }

        $query->orderBy('name');

        $students = $query
            ->get()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'account' => $user->username ?: 'MSL-' . str_pad((string) $user->id, 4, '0', STR_PAD_LEFT),
                'name' => $user->name ?: trim(($user->first_name ?? '') . ' ' . ($user->surname ?? '')),
                'ign' => $user->ml_ign ?: 'N/A',
                'uid' => $user->ml_id ?: ($user->studentId ?: 'N/A'),
                'server' => $user->ml_server ?: 'N/A',
                'gender' => strtolower($user->gender ?: 'male'),
                'campus' => $user->university ?: 'N/A',
                'yearLevel' => $user->year_level ?: 'N/A',
                'course' => $user->course ?: 'N/A',
                'email' => $user->email ?: 'N/A',
                'phone' => $user->contact_number ?: 'N/A',
                'studentId' => $user->studentId ?: 'N/A',
                'proofOfEnrollment' => $user->proofOfEnrollment,
                'isRenewal' => in_array($user->status, ['renewal-required', 'pending-review'], true),
                'joinedAt' => optional($user->created_at)->format('m/d/Y'),
                'verifiedAt' => optional($user->renewal_approved_at)->format('m/d/Y'),
                'role' => $user->user_type,
                'status' => match ($user->status) {
                    'active' => 'Verified',
                    'pending' => 'New',
                    'pending-review', 'renewal-required' => 'Pending',
                    'blocked' => 'Blocked',
                    default => 'Inactive',
                },
            ])
            ->values();

        return Inertia::render('VerificationPages/RegionalAdmin', [
            'students' => $students,
            'profile' => [
                'name' => $admin->name,
                'username' => '@' . ($admin->username ?: 'admin'),
                'gender' => strtolower($admin->gender ?: 'male'),
                'level' => $admin->ml_level ?: 1,
                'role' => $admin->user_type,
                'yearLevel' => $admin->year_level ?: 'N/A',
                'area' => $admin->island ?: 'N/A',
                'region' => $admin->region ?: 'N/A',
                'campus' => $admin->university ?: 'N/A',
                'course' => $admin->course ?: 'N/A',
                'avatar' => '/msl campus icon image.png',
                'cover' => $admin->profile_background ?: '/profile-background.jpg',
                'verified' => true,
            ],
        ]);
    }

    public function updateBackground(Request $request): RedirectResponse
    {
        $admin = $request->user();

        abort_unless(
            $admin && in_array($admin->user_type, ['Super Admin', 'Regional Admin'], true),
            403,
            'Unauthorized access.'
        );

        $request->validate([
            'profileBackground' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        $directory = public_path('uploads/admin-backgrounds');
        File::ensureDirectoryExists($directory);

        $oldBackground = $admin->profile_background;
        $file = $request->file('profileBackground');
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $file->move($directory, $filename);

        $admin->profile_background = '/uploads/admin-backgrounds/' . $filename;
        $admin->save();

        if ($oldBackground && str_starts_with($oldBackground, '/uploads/admin-backgrounds/')) {
            File::delete(public_path(ltrim($oldBackground, '/')));
        }

        return redirect()->back()->with('status', 'Background updated successfully.');
    }
}
