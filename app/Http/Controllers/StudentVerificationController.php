<?php

namespace App\Http\Controllers;

use App\Models\Institution;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class StudentVerificationController extends Controller
{
    private const ALLOWED_ROLES = [
        'Student Leader',
        'SL',
        'Regional Admin',
        'Core Admin',
        'Super Admin',
    ];

    public function index(Request $request): Response
    {
        $actor = $this->authorizeVerifier($request);
        $scopeData = $this->resolveScope($actor);

        $tab = $request->string('tab', 'all')->toString();
        $schoolFilter = trim((string) $request->input('school', ''));

        $baseQuery = $this->pendingUsersQuery($actor, $scopeData);
        $query = clone $baseQuery;

        if ($schoolFilter !== '') {
            $query->where('university', $schoolFilter);
        }

        if ($tab === 'pending') {
            $query->where('status', 'pending');
        } elseif ($tab === 'renewal') {
            $query->where('status', 'pending-review');
        } elseif ($tab === 'has-doc') {
            $query->whereNotNull('proofOfEnrollment')->where('proofOfEnrollment', '!=', '');
        } elseif ($tab === 'missing-doc') {
            $query->where(function (Builder $q) {
                $q->whereNull('proofOfEnrollment')->orWhere('proofOfEnrollment', '');
            });
        }

        if ($request->filled('search')) {
            $search = trim($request->string('search')->toString());
            $query->where(function (Builder $builder) use ($search) {
                $builder->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('username', 'like', "%{$search}%")
                    ->orWhere('ml_id', 'like', "%{$search}%")
                    ->orWhere('ml_ign', 'like', "%{$search}%")
                    ->orWhere('studentId', 'like', "%{$search}%")
                    ->orWhere('university', 'like', "%{$search}%");
            });
        }

        $schoolsWithSlLookup = array_flip($scopeData['schools_with_sl_lower']);

        $users = $query
            ->latest('updated_at')
            ->paginate(10)
            ->withQueryString();

        $users->getCollection()->transform(function (User $student) use ($schoolsWithSlLookup) {
            $schoolKey = mb_strtolower(trim((string) $student->university));
            $student->setAttribute('has_student_leader', $schoolKey !== '' && isset($schoolsWithSlLookup[$schoolKey]));
            return $student;
        });

        $stats = [
            'all' => (clone $baseQuery)->count(),
            'pending' => (clone $baseQuery)->where('status', 'pending')->count(),
            'renewal' => (clone $baseQuery)->where('status', 'pending-review')->count(),
            'has_doc' => (clone $baseQuery)->whereNotNull('proofOfEnrollment')->where('proofOfEnrollment', '!=', '')->count(),
            'missing_doc' => (clone $baseQuery)->where(function (Builder $q) {
                $q->whereNull('proofOfEnrollment')->orWhere('proofOfEnrollment', '');
            })->count(),
        ];

        $queueSchools = (clone $baseQuery)
            ->whereNotNull('university')
            ->where('university', '!=', '')
            ->distinct()
            ->orderBy('university')
            ->pluck('university')
            ->all();

        $availableSchools = collect($scopeData['assigned_schools'])
            ->merge($queueSchools)
            ->map(fn ($name) => trim((string) $name))
            ->filter()
            ->unique()
            ->sort(SORT_NATURAL | SORT_FLAG_CASE)
            ->values()
            ->all();

        return Inertia::render('Verification/Index', [
            'users' => $users,
            'filters' => [
                'search' => $request->input('search', ''),
                'tab' => $tab,
                'school' => $schoolFilter,
            ],
            'stats' => $stats,
            'scope' => [
                'role' => $actor->user_type,
                'region' => $scopeData['region'],
                'schools' => $scopeData['assigned_schools'],
                'availableSchools' => $availableSchools,
                'isAllSchools' => $scopeData['is_all_schools'],
                'includesUncoveredRegionSchools' => $actor->user_type === 'Regional Admin' && $scopeData['region'] !== '',
            ],
        ]);
    }

    public function approve(Request $request, User $user): RedirectResponse
    {
        $actor = $this->authorizeVerifier($request);
        $this->ensureTargetInScope($actor, $user);

        $wasRenewal = in_array($user->status, ['pending-review', 'renewal-required'], true);

        $user->email_verified_at = $user->email_verified_at ?? now();
        $user->status = 'active';

        if ($wasRenewal) {
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

    public function reject(Request $request, User $user): RedirectResponse
    {
        $actor = $this->authorizeVerifier($request);
        $this->ensureTargetInScope($actor, $user);

        $validated = $request->validate([
            'reason' => ['required', 'string', 'max:1000'],
            'checklist' => ['nullable', 'array'],
            'checklist.*' => ['string', 'max:255'],
        ]);

        $user->status = 'rejected';
        $user->rejection_reason = trim($validated['reason']);
        $user->rejection_checklist = $validated['checklist'] ?? [];
        $user->save();

        return back()->with('success', "Application for {$user->name} has been rejected.");
    }

    private function authorizeVerifier(Request $request): User
    {
        $user = $request->user();

        abort_unless(
            $user && in_array($user->user_type, self::ALLOWED_ROLES, true),
            403,
            'You do not have permission to access student verification.'
        );

        return $user;
    }

    /**
     * Resolve verification scope for the current verifier.
     *
     * @return array{
     *     is_all_schools: bool,
     *     region: string,
     *     assigned_schools: array<int, string>,
     *     region_schools_without_sl: array<int, string>,
     *     schools_with_sl: array<int, string>,
     *     schools_with_sl_lower: array<int, string>
     * }
     */
    private function resolveScope(User $actor): array
    {
        $schoolsWithSl = User::query()
            ->whereIn('user_type', ['Student Leader', 'SL'])
            ->where('status', 'active')
            ->whereNotNull('university')
            ->where('university', '!=', '')
            ->distinct()
            ->pluck('university')
            ->map(fn ($name) => trim((string) $name))
            ->filter()
            ->unique()
            ->values();

        $schoolsWithSlLower = $schoolsWithSl
            ->map(fn (string $name) => mb_strtolower($name))
            ->unique()
            ->values()
            ->all();

        if ($actor->isCoreAdmin()) {
            return [
                'is_all_schools' => true,
                'region' => '',
                'assigned_schools' => [],
                'region_schools_without_sl' => [],
                'schools_with_sl' => $schoolsWithSl->all(),
                'schools_with_sl_lower' => $schoolsWithSlLower,
            ];
        }

        if ($actor->user_type === 'Regional Admin') {
            $assignedSchools = $actor->assignedSchools()
                ->pluck('name')
                ->map(fn ($name) => trim((string) $name))
                ->filter()
                ->unique()
                ->values()
                ->all();

            // Schools already assigned to OTHER Regional Admins should not appear as uncovered
            $schoolsAssignedToOtherRas = \Illuminate\Support\Facades\DB::table('regional_admin_schools')
                ->join('institutions', 'institutions.id', '=', 'regional_admin_schools.institution_id')
                ->where('regional_admin_schools.user_id', '!=', $actor->id)
                ->pluck('institutions.name')
                ->map(fn ($name) => trim((string) $name))
                ->filter()
                ->unique()
                ->values()
                ->all();

            $excludedFromUncoveredLower = array_flip(array_unique(array_merge(
                $schoolsWithSlLower,
                array_map(fn (string $name) => mb_strtolower($name), $schoolsAssignedToOtherRas)
            )));

            $region = trim((string) ($actor->region ?? ''));
            $regionSchoolsWithoutSl = [];

            if ($region !== '' && Schema::hasTable('institutions')) {
                $regionSchoolsWithoutSl = Institution::query()
                    ->where('region', $region)
                    ->whereNotNull('name')
                    ->where('name', '!=', '')
                    ->pluck('name')
                    ->map(fn ($name) => trim((string) $name))
                    ->filter(fn (string $name) => $name !== '' && !isset($excludedFromUncoveredLower[mb_strtolower($name)]))
                    ->unique()
                    ->values()
                    ->all();
            }

            return [
                'is_all_schools' => false,
                'region' => $region,
                'assigned_schools' => $assignedSchools,
                'region_schools_without_sl' => $regionSchoolsWithoutSl,
                'schools_with_sl' => array_values(array_unique(array_merge($schoolsWithSl->all(), $schoolsAssignedToOtherRas))),
                'schools_with_sl_lower' => $schoolsWithSlLower,
            ];
        }

        // Student Leader / SL: scoped strictly to their own school (plus any active campus affiliations)
        $schools = collect([$actor->university]);

        $affiliatedSchools = $actor->campusAffiliations()
            ->where('role', 'student_leader')
            ->where('status', 'active')
            ->with('campus.institution')
            ->get()
            ->flatMap(fn ($aff) => [
                $aff->campus?->name,
                $aff->campus?->institution?->name,
            ]);

        $leaderSchools = $schools
            ->merge($affiliatedSchools)
            ->map(fn ($name) => trim((string) $name))
            ->filter()
            ->unique()
            ->values()
            ->all();

        return [
            'is_all_schools' => false,
            'region' => trim((string) ($actor->region ?? '')),
            'assigned_schools' => $leaderSchools,
            'region_schools_without_sl' => [],
            'schools_with_sl' => $schoolsWithSl->all(),
            'schools_with_sl_lower' => $schoolsWithSlLower,
        ];
    }

    private function ensureTargetInScope(User $actor, User $target): void
    {
        $scopeData = $this->resolveScope($actor);

        if (!$scopeData['is_all_schools']) {
            $inScope = $this->applyScopeFilter(
                User::query()->whereKey($target->id),
                $actor,
                $scopeData
            )->exists();

            abort_unless(
                $inScope,
                403,
                'You are only authorized to verify students under your assigned school or uncovered schools in your region.'
            );
        }

        abort_unless(
            $this->pendingUsersQuery($actor, $scopeData)->whereKey($target->id)->exists(),
            422,
            'This account is not awaiting verification.'
        );
    }

    private function applyScopeFilter(Builder $query, User $actor, array $scopeData): Builder
    {
        if ($scopeData['is_all_schools']) {
            return $query;
        }

        if ($actor->user_type === 'Regional Admin') {
            $allowedExplicitSchools = array_values(array_unique(array_merge(
                $scopeData['assigned_schools'],
                $scopeData['region_schools_without_sl']
            )));
            $region = $scopeData['region'];
            $schoolsWithSl = $scopeData['schools_with_sl'];

            if (empty($allowedExplicitSchools) && $region === '') {
                return $query->whereRaw('1 = 0');
            }

            return $query->where(function (Builder $scopeQuery) use ($allowedExplicitSchools, $region, $schoolsWithSl) {
                if (!empty($allowedExplicitSchools)) {
                    $scopeQuery->whereIn('university', $allowedExplicitSchools);
                }

                // Also catch pending students whose user.region matches the RA's region
                // and whose school has no active Student Leader.
                if ($region !== '') {
                    $method = !empty($allowedExplicitSchools) ? 'orWhere' : 'where';
                    $scopeQuery->{$method}(function (Builder $regionQuery) use ($region, $schoolsWithSl) {
                        $regionQuery->where('region', $region);
                        if (!empty($schoolsWithSl)) {
                            $regionQuery->where(function (Builder $noSlQuery) use ($schoolsWithSl) {
                                $noSlQuery->whereNull('university')
                                    ->orWhereNotIn('university', $schoolsWithSl);
                            });
                        }
                    });
                }
            });
        }

        // Student Leader / SL
        if (empty($scopeData['assigned_schools'])) {
            return $query->whereRaw('1 = 0');
        }

        return $query->whereIn('university', $scopeData['assigned_schools']);
    }

    private function pendingUsersQuery(User $actor, array $scopeData): Builder
    {
        $query = User::query()
            ->whereKeyNot($actor->id)
            ->whereIn('status', ['pending', 'pending-review'])
            ->where(function (Builder $q) {
                $q->whereIn('user_type', ['Student', 'Student Leader'])
                    ->orWhereNull('user_type');
            });

        $this->applyScopeFilter($query, $actor, $scopeData);

        return $query->select([
            'id',
            'name',
            'first_name',
            'surname',
            'email',
            'username',
            'status',
            'user_type',
            'university',
            'region',
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
