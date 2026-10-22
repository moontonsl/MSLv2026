<?php

namespace App\Http\Controllers;

use App\Models\CampusAffiliation;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentLeaderDirectoryController extends Controller
{
    public function index(Request $request): Response
    {
        $leader = $request->user();
        $now = now();

        $campusIds = $leader->campusAffiliations()
            ->where('role', 'student_leader')
            ->where('status', 'active')
            ->where(fn ($query) => $query->whereNull('started_at')->orWhere('started_at', '<=', $now))
            ->where(fn ($query) => $query->whereNull('ended_at')->orWhere('ended_at', '>', $now))
            ->pluck('campus_id');

        abort_if($leader->status !== 'active' || $campusIds->isEmpty(), 403);

        $affiliations = CampusAffiliation::query()
            ->where('user_id', $leader->id)
            ->whereIn('campus_id', $campusIds)
            ->where('role', 'student_leader')
            ->where('status', 'active')
            ->where(fn ($query) => $query->whereNull('started_at')->orWhere('started_at', '<=', $now))
            ->where(fn ($query) => $query->whereNull('ended_at')->orWhere('ended_at', '>', $now))
            ->with('campus.institution', 'campus.city.region.island')
            ->orderBy('campus_id')
            ->get();

        $students = User::query()
            ->whereKeyNot($leader->id)
            ->whereHas('campusAffiliations', fn ($query) => $query
                ->whereIn('campus_id', $campusIds)
                ->whereIn('role', ['student', 'member'])
                ->where('status', 'active')
                ->where(fn ($query) => $query->whereNull('started_at')->orWhere('started_at', '<=', $now))
                ->where(fn ($query) => $query->whereNull('ended_at')->orWhere('ended_at', '>', $now)))
            ->with(['campusAffiliations' => fn ($query) => $query
                ->whereIn('campus_id', $campusIds)
                ->whereIn('role', ['student', 'member'])
                ->where('status', 'active')
                ->where(fn ($query) => $query->whereNull('started_at')->orWhere('started_at', '<=', $now))
                ->where(fn ($query) => $query->whereNull('ended_at')->orWhere('ended_at', '>', $now))
                ->with('campus.institution')])
            ->orderBy('name')
            ->get()
            ->map(fn (User $student): array => [
                'id' => $student->id,
                'account' => $student->username ?: 'MSL-'.$student->id,
                'name' => $student->name ?: '—',
                'ign' => $student->ml_ign ?: '—',
                'uid' => $student->ml_id ?: '—',
                'server' => $student->ml_server ?: '—',
                'gender' => strtolower($student->gender ?: 'other'),
                'campus' => $student->campusAffiliations->first()?->campus?->name ?? '—',
                'yearLevel' => $student->year_level ?: '—',
                'course' => $student->course ?: '—',
                'email' => $student->email ?: '—',
                'phone' => $student->contact_number ?: '—',
                'studentId' => $student->studentId ?: '—',
                'hasProofOfEnrollment' => filled($student->proofOfEnrollment),
                'joinedAt' => $student->created_at?->format('M j, Y') ?? '—',
                'emailVerifiedAt' => $student->email_verified_at?->format('M j, Y') ?? '—',
                'avatar' => $student->ml_avatar,
                'role' => 'Student',
                'status' => match ($student->status) {
                    'active' => 'Verified',
                    'pending' => 'New',
                    'pending-review', 'renewal-required' => 'Pending',
                    'blocked' => 'Blocked',
                    default => 'Inactive',
                },
                'isRenewal' => in_array($student->status, ['renewal-required', 'pending-review'], true),
            ])->values();

        return Inertia::render('VerificationPages/StudentLeader', [
            'students' => $students,
            'profile' => [
                'name' => $leader->name ?: '—',
                'username' => '@'.($leader->username ?: 'MSL-'.$leader->id),
                'gender' => strtolower($leader->gender ?: 'other'),
                'level' => $leader->ml_level ?: '—',
                'role' => 'Student Leader',
                'yearLevel' => $leader->year_level ?: '—',
                'area' => $affiliations->map(fn (CampusAffiliation $affiliation) => $affiliation->campus?->city?->region?->island?->name)
                    ->filter()->unique()->implode(', ') ?: '—',
                'region' => $affiliations->map(fn (CampusAffiliation $affiliation) => $affiliation->campus?->city?->region?->name)
                    ->filter()->unique()->implode(', ') ?: '—',
                'campus' => $affiliations->map(fn (CampusAffiliation $affiliation) => $affiliation->campus?->name)
                    ->filter()->implode(', ') ?: '—',
                'course' => $leader->course ?: '—',
                'avatar' => $leader->ml_avatar ?: '/msl campus icon image.png',
                'cover' => $leader->profile_background ?: '/profile-background.jpg',
                'verified' => $leader->email_verified_at !== null,
            ],
        ]);
    }
}
