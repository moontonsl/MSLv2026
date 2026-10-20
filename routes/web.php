<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminManagementController;
use App\Http\Controllers\Admin\AdminAccountController;
use App\Http\Controllers\Admin\AdminPermissionController;
use App\Http\Controllers\Admin\AdminAuditLogController;
use App\Http\Controllers\Admin\AdminProfileController;
use App\Http\Controllers\Admin\AdminNotificationController;
use App\Http\Controllers\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Admin\LegacyContentController;
use App\Http\Controllers\Admin\MCCSeasonController;
use App\Http\Controllers\Admin\ViolationReportAdminController;
use App\Http\Controllers\Admin\OppoSettingsController;
use App\Http\Controllers\Admin\AnalyticsController;
use App\Http\Controllers\Admin\FaqController;
use App\Http\Controllers\Admin\ModernNewsController;
use App\Http\Controllers\Admin\HomePageController;
use App\Http\Controllers\Admin\PendingUserController;
use App\Http\Controllers\Admin\StudentLeaderController;
use App\Http\Controllers\Admin\RegionalAdminManagementController;
use App\Http\Controllers\Admin\SchoolManagementController;
use App\Http\Controllers\Admin\CarouselController;
use App\Http\Controllers\Admin\EventPhotoController;
use App\Http\Controllers\Admin\EventCalendarController;
use App\Http\Controllers\Admin\MslEventController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\FooterController;
use App\Http\Controllers\Admin\ShareLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\CampusTournamentController;
use App\Http\Controllers\CampusTournamentReportController;
use App\Http\Controllers\TournamentRegistrationController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ShortLinkController;
use App\Http\Controllers\Student\StudentPortalController;
use App\Models\Faq;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home/Index', [
        'pinnedFaqs' => Faq::query()
            ->where('is_active', true)
            ->where('is_pinned', true)
            ->orderBy('id')
            ->get(['id', 'question', 'answer']),
    ]);
});

Route::get('/s/{code}', [ShortLinkController::class, 'redirect'])->name('short-link.redirect');

Route::get('/About', function () {
    return Inertia::render('About');
})->name('about');
Route::redirect('/about', '/About');

Route::get('/report-violation', function () {
    return Inertia::render('SafeSpaces/ReportViolation');
})->name('report.violation');

Route::get('/Contents&SocialMedia', function () {
    return Inertia::render('ContentMedia');
})->name('contents.social.media');
Route::redirect('/content-media', '/Contents&SocialMedia');
Route::redirect('/about/contents-social-media', '/Contents&SocialMedia');

Route::get('/News', [NewsController::class, 'index'])->name('news.index');
Route::get('/News/{canonical}', [NewsController::class, 'show'])->name('news.show');
Route::redirect('/news', '/News');

Route::get('/Event', function () {
    return Inertia::render('Events/Index');
})->name('events');
Route::redirect('/Events', '/Event');
Route::redirect('/events', '/Event');

Route::get('/Buffs&Support', function () {
    return Inertia::render('Buffs and Support/Index');
})->name('buffs.support');
Route::redirect('/programs/buffs-support', '/Buffs&Support');

Route::get('/Campus', function () {
    return Inertia::render('Campus/Index');
})->name('campus');
Route::redirect('/about/campus', '/Campus');

/*
|--------------------------------------------------------------------------
| Campus Tournament UI pages (Evren / Figma rebuild — legacy MSL-1 URLs)
|--------------------------------------------------------------------------
*/
Route::get('/campus-tournament/public', function () {
    return Inertia::render('Programs/CampusTournaments/SlView');
})->name('campus.tournament.public');

Route::middleware(['auth'])->group(function () {
    Route::get('/campus-tournament', [CampusTournamentController::class, 'redirectByRole'])
        ->name('campus.tournament');

    Route::get('/Tournament/SL', [CampusTournamentController::class, 'indexSl'])
        ->name('campus.tournament.sl');

    Route::get('/Tournament/RegionalAdmin', [CampusTournamentController::class, 'indexSl'])
        ->name('campus.tournament.regionaladmin');

    Route::get('/Tournament/Organizer', [CampusTournamentController::class, 'indexOrganizer'])
        ->name('campus.tournament.organizer');

    Route::get('/campus-tournaments/{tournament}/ongoing', [CampusTournamentController::class, 'showOngoing'])
        ->name('campus-tournaments.ongoing');

    Route::get('/campus-tournaments/{tournament}/report', [CampusTournamentReportController::class, 'show'])
        ->name('campus-tournaments.report');
    Route::post('/campus-tournaments/{tournament}/results', [CampusTournamentReportController::class, 'store'])
        ->name('campus-tournaments.results.store');
    Route::post('/campus-tournaments/{tournament}/result-revisions', [CampusTournamentReportController::class, 'correct'])
        ->name('campus-tournaments.results.correct');
    Route::get('/campus-tournaments/{tournament}/results/export', [CampusTournamentReportController::class, 'export'])
        ->name('campus-tournaments.results.export');

    Route::get('/Tournament/CampusTournament', [TournamentRegistrationController::class, 'showCaptainHub'])
        ->name('campus.captainregistration');

    Route::get('/Tournament/CampusTournamentReg', [TournamentRegistrationController::class, 'showCaptainRegistration'])
        ->name('campus.teamregistration');

    Route::get('/Tournament/CampusTournamentTeam', [TournamentRegistrationController::class, 'showCaptainTeam'])
        ->name('campus.team');

    Route::get('/school-players', [TournamentRegistrationController::class, 'searchSchoolPlayers'])
        ->name('campus.school-players');

    Route::get('/Tournament/SoloPlayer', [TournamentRegistrationController::class, 'showSoloMatchmaking'])
        ->name('campus.tournament.solo.player');

    Route::get('/Tournament/MemberInvite', [TournamentRegistrationController::class, 'showMemberInvitations'])
        ->name('campus.member.invite');

    Route::get('/Tournament/MemberJoin', [TournamentRegistrationController::class, 'showMemberJoin'])
        ->name('campus.member.join');
});

/** Compatibility redirects from earlier /programs/... CT paths */
Route::redirect('/programs/campus-tournaments', '/Tournament/Organizer');
Route::redirect('/programs/campus-tournaments/sl', '/Tournament/SL');
Route::redirect('/programs/campus-tournaments/captain', '/Tournament/CampusTournament');
Route::redirect('/programs/campus-tournaments/captain/register', '/Tournament/CampusTournamentReg');
Route::redirect('/programs/campus-tournaments/captain/team', '/Tournament/CampusTournamentTeam');
Route::redirect('/programs/campus-tournaments/captain/join', '/Tournament/SoloPlayer');
Route::redirect('/programs/campus-tournaments/solo', '/Tournament/SoloPlayer');
Route::redirect('/programs/campus-tournaments/member', '/Tournament/MemberInvite');
Route::redirect('/programs/campus-tournaments/member/join', '/Tournament/MemberJoin');
Route::redirect('/sl/campus-tournament', '/Tournament/SL');
Route::redirect('/captain/campus-tournament', '/Tournament/CampusTournament');
Route::redirect('/member/campus-tournament', '/Tournament/MemberInvite');

/** Staging campus listing page (separate from CT product UI) */
Route::get('/CampusTournament', function () {
    return Inertia::render('Campus/Index');
})->name('campus.tournament.listing');

Route::get('/Programs', function () {
    return Inertia::render('Home/Index', [
        'pinnedFaqs' => Faq::query()
            ->where('is_active', true)
            ->where('is_pinned', true)
            ->orderBy('id')
            ->get(['id', 'question', 'answer']),
    ]);
})->name('programs');

Route::get('/Partnerships', function () {
    return Inertia::render('About');
})->name('partnerships');
Route::redirect('/about/partnerships', '/Partnerships');
Route::redirect('/partner', '/Partnerships');

Route::get('/GeneralAffairs', function () {
    return Inertia::render('About');
})->name('general.affairs');
Route::redirect('/about/general-affairs', '/GeneralAffairs');

// Admin root redirect (so /admin never 404s)
Route::get('/admin', function () {
    if (auth()->guard('admin')->check()) {
        return redirect()->route('admin.dashboard');
    }
    return redirect()->route('admin.login');
});

// Admin Subdomain Routing (e.g. admin.moontonslph.org)
$adminDomain = env('ADMIN_DOMAIN');
if (!empty($adminDomain)) {
    Route::domain($adminDomain)->group(function () {
        Route::get('/', function () {
            if (auth()->guard('admin')->check()) {
                return redirect()->route('admin.dashboard');
            }
            return redirect()->route('admin.login');
        });

        Route::middleware('guest:admin')->group(function () {
            Route::get('/login', [AdminAuthController::class, 'showLogin']);
            Route::post('/login', [AdminAuthController::class, 'login'])
                ->middleware('throttle:10,1');
        });
    });
}

Route::get('/admin/login', [AdminAuthController::class, 'showLogin'])
    ->name('admin.login');

Route::get('/admin/custom-user-list/login', [AdminAuthController::class, 'showLogin'])
    ->name('admin.custom-user-list.login');

Route::middleware('guest:admin')->group(function () {
    Route::post('/admin/login', [AdminAuthController::class, 'login'])
        ->middleware('throttle:10,1')
        ->name('admin.login.submit');

    Route::post('/admin/custom-user-list/login', [AdminAuthController::class, 'login'])
        ->middleware('throttle:10,1')
        ->name('admin.custom-user-list.login.submit');
});

/** Admin CMS pages from Evren branch */
Route::middleware(['auth:admin', 'admin', 'admin.audit'])->group(function () {
    Route::post('/admin/logout', [AdminAuthController::class, 'logout'])->name('admin.logout');
    Route::get('/admin/campus-tournaments/reports', [CampusTournamentReportController::class, 'indexCore'])
        ->name('admin.campus-tournaments.reports.index');
    Route::get('/admin/campus-tournaments/reports/{tournament}', [CampusTournamentReportController::class, 'show'])
        ->name('admin.campus-tournaments.reports.show');
    Route::post('/admin/campus-tournaments/reports/{tournament}/corrections', [CampusTournamentReportController::class, 'correct'])
        ->name('admin.campus-tournaments.reports.correct');
    Route::get('/admin/campus-tournaments/reports/{tournament}/export', [CampusTournamentReportController::class, 'export'])
        ->name('admin.campus-tournaments.reports.export');
    Route::get('/admin/profile', [AdminProfileController::class, 'index'])->name('admin.profile');
    Route::put('/admin/profile', [AdminProfileController::class, 'update'])->name('admin.profile.update');
    Route::put('/admin/profile/password', [AdminProfileController::class, 'updatePassword'])->name('admin.profile.password.update');
    Route::get('/admin/notifications', [AdminNotificationController::class, 'index'])->name('admin.notifications.index');
    Route::post('/admin/notifications/{id}/read', [AdminNotificationController::class, 'markRead'])->name('admin.notifications.read');
    Route::post('/admin/notifications/read-all', [AdminNotificationController::class, 'markAllRead'])->name('admin.notifications.read-all');

    Route::get('/admin/schools', function () {
        return Inertia::render('Admin/AccountCreation');
    })->middleware('admin.permission:manage_accounts')->name('admin.account-creation');

    Route::get('/admin/home-page', [HomePageController::class, 'index'])
        ->middleware('admin.permission:manage_homepage')->name('admin.home-page');

    Route::get('/admin/faq', [FaqController::class, 'index'])
        ->middleware('admin.permission:manage_faq')->name('admin.faq');
    Route::post('/admin/faq', [FaqController::class, 'store'])
        ->middleware('admin.permission:manage_faq')->name('admin.faq.store');
    Route::put('/admin/faq/{faq}', [FaqController::class, 'update'])
        ->middleware('admin.permission:manage_faq')->name('admin.faq.update');
    Route::patch('/admin/faq/{faq}/pin', [FaqController::class, 'updatePin'])
        ->middleware('admin.permission:manage_faq')->name('admin.faq.pin');
    Route::delete('/admin/faq/{faq}', [FaqController::class, 'destroy'])
        ->middleware('admin.permission:manage_faq')->name('admin.faq.delete');

    Route::get('/admin/news-articles', [ModernNewsController::class, 'index'])
        ->middleware('admin.permission:manage_news')->name('admin.news-updates');
    Route::post('/admin/news-articles', [ModernNewsController::class, 'store'])
        ->middleware('admin.permission:manage_news')->name('admin.news-modern.store');
    Route::put('/admin/news-articles/{news}', [ModernNewsController::class, 'update'])
        ->middleware('admin.permission:manage_news')->name('admin.news-modern.update');
    Route::delete('/admin/news-articles/{news}', [ModernNewsController::class, 'destroy'])
        ->middleware('admin.permission:manage_news')->name('admin.news-modern.delete');

    Route::redirect('/admin/account-creation', '/admin/schools');
    Route::redirect('/admin/news-updates', '/admin/news-articles');
});

Route::redirect('/admin/account-management', '/admin/administrator-accounts');

Route::get('/admin/registration-management', function () {
   return Inertia::render('Admin/RegistrationManagement');
})->name('admin.registration-management');

Route::get('/admin/event-management', function () {
    return Inertia::render('Admin/EventManagement');
})->name('admin.event-management');

Route::get('/admin/regional-admin-assignments', function () {
    return Inertia::render('Admin/RegionalAdmin');
})->name('admin.regional-admin');
Route::redirect('/admin/regional-admin', '/admin/regional-admin-assignments');


Route::get('/SL-Admin', function () {
    return Inertia::render('SL-Admin/Index');
})->name('sl.admin');
Route::redirect('/sl-admin', '/SL-Admin');

Route::get('/CampusAdmin', function () {
    return Inertia::render('SL-Admin/Index');
})->name('campus.admin');

Route::get('/CSMAdmin', function () {
    return Inertia::render('SL-Admin/Index');
})->name('csm.admin');

Route::get('/GenAdAdmin', function () {
    return Inertia::render('SL-Admin/Index');
})->name('genad.admin');

Route::get('/MSLNetAdmin', function () {
    return Inertia::render('SL-Admin/Index');
})->name('mslnet.admin');

Route::redirect('/dashboard', '/')->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/campus-tournaments', [CampusTournamentController::class, 'store'])
        ->name('campus-tournaments.store');
    Route::put('/campus-tournaments/{tournament}/resubmit', [CampusTournamentController::class, 'resubmit'])
        ->name('campus-tournaments.resubmit');
    Route::post('/campus-tournaments/{tournament}/approve', [CampusTournamentController::class, 'approve'])
        ->name('campus-tournaments.approve');
    Route::post('/campus-tournaments/{tournament}/reject', [CampusTournamentController::class, 'reject'])
        ->name('campus-tournaments.reject');
    Route::delete('/campus-tournaments/{tournament}', [CampusTournamentController::class, 'destroy'])
        ->name('campus-tournaments.destroy');

    // Tournament team registration
    Route::post('/campus-tournaments/{tournament}/teams', [TournamentRegistrationController::class, 'store'])
        ->name('tournament.teams.store');
    Route::post('/campus-tournaments/{tournament}/participants', [TournamentRegistrationController::class, 'storeSolo'])
        ->name('tournament.participants.store');
    Route::get('/campus-tournaments/{tournament}/solo-teams', [TournamentRegistrationController::class, 'indexSoloTeams'])
        ->name('tournament.solo-teams.index');
    Route::post('/tournament-teams/{team}/invitations', [TournamentRegistrationController::class, 'storeInvitation'])
        ->name('tournament.invitations.store');
    Route::post('/tournament-teams/{team}/solo-participants', [TournamentRegistrationController::class, 'joinSoloTeam'])
        ->name('tournament.solo-teams.join');
    Route::post('/tournament-invitations/{invitation}/respond', [TournamentRegistrationController::class, 'respond'])
        ->name('tournament.invitations.respond');
    Route::delete('/tournament-invitations/{invitation}', [TournamentRegistrationController::class, 'destroyInvitation'])
        ->name('tournament.invitations.destroy');
    Route::delete('/tournament-participants/{participant}', [TournamentRegistrationController::class, 'destroy'])
        ->name('tournament.participants.destroy');
});

// Protect the student portal with active student checks
Route::middleware(['auth', 'active.student'])->group(function () {
    Route::get('/studentportal', [StudentPortalController::class, 'index'])->name('student.portal');
    Route::post('/studentportal/profile', [StudentPortalController::class, 'updateProfile'])->name('student.profile.update');
    Route::post('/studentportal/renewal-approval/acknowledge', [StudentPortalController::class, 'acknowledgeRenewalApproval'])->name('student.renewal.approval.acknowledge');

    Route::post('/studentportal/renew', function (Request $request) {
        $request->validate([
            'studentId' => 'required|string|max:255',
            'proofOfEnrollment' => 'required|file|mimes:jpeg,jpg,png,pdf|max:2048',
            'school' => 'nullable|string|max:255',
            'course' => 'nullable|string|max:255',
            'yearLevel' => 'nullable|string|max:255',
            'firstName' => 'nullable|string|max:255',
            'lastName' => 'nullable|string|max:255',
        ]);

        $user = Auth::user();
        $oldProofPath = $user->proofOfEnrollment;
        $newProofPath = null;

        try {
            $file = $request->file('proofOfEnrollment');
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $destinationPath = public_path('uploads/proofs');
            File::ensureDirectoryExists($destinationPath);
            $file->move($destinationPath, $filename);
            $newProofPath = '/uploads/proofs/' . $filename;
            $user->proofOfEnrollment = $newProofPath;

            $user->studentId = $request->input('studentId');
            $user->university = $request->input('school', $user->university);
            $user->course = $request->input('course', $user->course);
            $user->year_level = $request->input('yearLevel', $user->year_level);
            $user->first_name = $request->input('firstName', $user->first_name);
            $user->surname = $request->input('lastName', $user->surname);
            $user->status = 'pending-review';

            if (!$user->renewal_requested_at) {
                $user->renewal_requested_at = now()->subDays(1);
            }
            $user->renewal_submitted_at = now();
            $user->save();

            if ($oldProofPath && $oldProofPath !== $newProofPath) {
                $oldAbsolutePath = public_path(ltrim($oldProofPath, '/'));

                if (File::exists($oldAbsolutePath)) {
                    File::delete($oldAbsolutePath);
                }
            }
        } catch (\Throwable $exception) {
            if ($newProofPath) {
                $newAbsolutePath = public_path(ltrim($newProofPath, '/'));

                if (File::exists($newAbsolutePath)) {
                    File::delete($newAbsolutePath);
                }
            }

            throw $exception;
        }

        return redirect()->back()->with('status', 'Renewal submitted successfully.');
    })->name('student.portal.renew');
});

Route::get('/renewal-review', function () {
    $user = Auth::user();

    abort_unless($user?->user_type === 'Student', 404);

    if ($user->status === 'active') {
        return redirect()->route('student.portal');
    }

    abort_unless($user->status === 'pending-review', 404);

    return Inertia::render('Auth/RenewalReview');
})->middleware('auth')->name('renewal.review');

// Verification status pages
Route::middleware(['auth', 'redirect.status'])->group(function () {

    Route::get('/pending-verification', function () {
        return Inertia::render('Auth/PendingVerification');
    })->name('pending.verification');

    Route::get('/rejected-verification', function () {
        return Inertia::render('Auth/RejectedVerification', [
            'rejectionReason' => Auth::user()->rejection_reason,
            'rejectionChecklist' => Auth::user()->rejection_checklist ?? [],
            'userData' => Auth::user(),
        ]);
    })->name('rejected.verification');
});

// Re-apply route for rejected student
Route::post('/reapply', [RegisteredUserController::class, 'reapply'])
    ->middleware('auth')
    ->name('reapply');

// Admin actions (protected by auth and custom permissions)
Route::middleware(['auth:admin', 'admin', 'admin.audit'])->group(function () {
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])
        ->middleware('admin.permission:access_admin_dashboard')
        ->name('admin.dashboard');
    Route::get('/api/analytics/real-time', function () {
        $analyticsService = app(\App\Services\AnalyticsService::class);
        return response()->json($analyticsService->getRealTimeData());
    })->name('admin.analytics.real-time');
    Route::post('/admin/users/{id}/approve', [AdminDashboardController::class, 'approve'])
        ->middleware('admin.permission:approve_students')
        ->name('admin.users.approve');

    Route::post('/admin/users/{id}/reject', [AdminDashboardController::class, 'reject'])
        ->middleware('admin.permission:reject_students')
        ->name('admin.users.reject');

    Route::post('/admin/users/{id}/renewal', [AdminDashboardController::class, 'markRenewal'])
        ->middleware('admin.permission:renew_students')
        ->name('admin.users.renewal');

    Route::post('/admin/users/{id}/block', [AdminDashboardController::class, 'block'])
        ->middleware('admin.permission:block_students')
        ->name('admin.users.block');

    Route::post('/admin/users/{id}/promote', [AdminDashboardController::class, 'promote'])
        ->middleware('admin.permission:promote_students')
        ->name('admin.users.promote');

    // Admin Management Page
    Route::get('/admin/account-roles-permissions', [AdminManagementController::class, 'index'])
        ->middleware('admin.permission:access_admin_management')
        ->name('admin.management');

    Route::post('/admin/users/{id}/permissions', [AdminManagementController::class, 'updatePermissions'])
        ->middleware('admin.permission:access_admin_management')
        ->name('admin.users.permissions.update');

    Route::put('/admin/users/{id}/role', [AdminManagementController::class, 'updateRole'])
        ->middleware('admin.permission:access_admin_management')
        ->name('admin.users.role.update');

    Route::get('/admin/administrator-accounts', [AdminAccountController::class, 'index'])
        ->middleware('admin.permission:manage_admin_accounts')
        ->name('admin.accounts.index');
    Route::post('/admin/administrator-accounts', [AdminAccountController::class, 'store'])
        ->middleware('admin.permission:manage_admin_accounts')
        ->name('admin.accounts.store');
    Route::delete('/admin/administrator-accounts/{id}', [AdminAccountController::class, 'destroy'])
        ->middleware('admin.permission:manage_admin_accounts')
        ->name('admin.accounts.destroy');

    Route::redirect('/admin/permissions', '/admin/account-roles-permissions')
        ->middleware('admin.permission:access_admin_management')
        ->name('admin.permissions.index');
    Route::put('/admin/permissions/{id}', [AdminPermissionController::class, 'update'])
        ->middleware('admin.permission:manage_admin_permissions')
        ->name('admin.permissions.update');

    Route::get('/admin/audit-logs', [AdminAuditLogController::class, 'index'])
        ->middleware('admin.permission:manage_audit_logs')
        ->name('admin.audit-logs.index');

    // Legacy MSL-1 admin modules adapted to MSLv2026.
    Route::get('/admin/pending-account-approvals', [PendingUserController::class, 'index'])
        ->middleware('admin.permission:manage_accounts')->name('admin.users.pending');
    Route::post('/admin/users/{user}/verify', [PendingUserController::class, 'verify'])
        ->middleware('admin.permission:manage_accounts')->name('admin.users.verify');
    Route::post('/admin/users/{user}/pending-approve', [PendingUserController::class, 'approve'])
        ->middleware('admin.permission:manage_accounts')->name('admin.users.pending-approve');
    Route::post('/admin/users/{user}/pending-reject', [PendingUserController::class, 'reject'])
        ->middleware('admin.permission:manage_accounts')->name('admin.users.pending-reject');

    Route::get('/admin/legacy-news', [LegacyContentController::class, 'news'])
        ->middleware('admin.permission:manage_news')->name('admin.news');
    Route::get('/admin/legacy-news/create', [LegacyContentController::class, 'createNews'])
        ->middleware('admin.permission:manage_news')->name('admin.news.create');
    Route::post('/admin/legacy-news', [LegacyContentController::class, 'storeNews'])
        ->middleware('admin.permission:manage_news')->name('admin.news.store');
    Route::get('/admin/legacy-news/{news}/edit', [LegacyContentController::class, 'editNews'])
        ->middleware('admin.permission:manage_news')->name('admin.news.edit');
    Route::put('/admin/legacy-news/{news}', [LegacyContentController::class, 'updateNews'])
        ->middleware('admin.permission:manage_news')->name('admin.news.update');
    Route::delete('/admin/legacy-news/{news}', [LegacyContentController::class, 'deleteNews'])
        ->middleware('admin.permission:manage_news')->name('admin.news.delete');

    Route::get('/admin/carousel', [CarouselController::class, 'index'])
        ->middleware('admin.permission:manage_carousel')->name('admin.carousel');
    Route::get('/admin/carousel/create', [LegacyContentController::class, 'createCarousel'])
        ->middleware('admin.permission:manage_carousel')->name('admin.carousel.create');
    Route::post('/admin/carousel', [CarouselController::class, 'store'])
        ->middleware('admin.permission:manage_carousel')->name('admin.carousel.store');
    Route::put('/admin/carousel/{carousel}', [CarouselController::class, 'update'])
        ->middleware('admin.permission:manage_carousel')->name('admin.carousel.update');
    Route::delete('/admin/carousel/{carousel}', [CarouselController::class, 'destroy'])
        ->middleware('admin.permission:manage_carousel')->name('admin.carousel.delete');
    Route::post('/admin/carousel/reorder', [CarouselController::class, 'reorder'])
        ->middleware('admin.permission:manage_carousel')->name('admin.carousel.reorder');

    Route::get('/admin/event-photos', [EventPhotoController::class, 'index'])
        ->middleware('admin.permission:manage_event_photos')->name('admin.event-photos');
    Route::get('/admin/event-photos/create', [EventPhotoController::class, 'create'])
        ->middleware('admin.permission:manage_event_photos')->name('admin.event-photos.create');
    Route::post('/admin/event-photos', [EventPhotoController::class, 'store'])
        ->middleware('admin.permission:manage_event_photos')->name('admin.event-photos.store');
    Route::put('/admin/event-photos/{eventPhoto}', [EventPhotoController::class, 'update'])
        ->middleware('admin.permission:manage_event_photos')->name('admin.event-photos.update');
    Route::delete('/admin/event-photos/{eventPhoto}', [EventPhotoController::class, 'destroy'])
        ->middleware('admin.permission:manage_event_photos')->name('admin.event-photos.delete');

    Route::get('/admin/scheduled-events', [EventCalendarController::class, 'index'])
        ->middleware('admin.permission:manage_events')->name('admin.events');
    Route::get('/admin/scheduled-events/create', [EventCalendarController::class, 'create'])
        ->middleware('admin.permission:manage_events')->name('admin.events.create');
    Route::post('/admin/scheduled-events', [EventCalendarController::class, 'store'])
        ->middleware('admin.permission:manage_events')->name('admin.events.store');
    Route::get('/admin/scheduled-events/{event}/edit', [EventCalendarController::class, 'edit'])
        ->middleware('admin.permission:manage_events')->name('admin.events.edit');
    Route::put('/admin/scheduled-events/{event}', [EventCalendarController::class, 'update'])
        ->middleware('admin.permission:manage_events')->name('admin.events.update');
    Route::delete('/admin/scheduled-events/{event}', [EventCalendarController::class, 'destroy'])
        ->middleware('admin.permission:manage_events')->name('admin.events.delete');

    Route::get('/admin/public-msl-events', [MslEventController::class, 'index'])
        ->middleware('admin.permission:manage_msl_events')->name('admin.msl-events.index');
    Route::get('/admin/public-msl-events/create', [MslEventController::class, 'create'])
        ->middleware('admin.permission:manage_msl_events')->name('admin.msl-events.create');
    Route::post('/admin/public-msl-events', [MslEventController::class, 'store'])
        ->middleware('admin.permission:manage_msl_events')->name('admin.msl-events.store');
    Route::get('/admin/public-msl-events/{mslEvent}/edit', [MslEventController::class, 'edit'])
        ->middleware('admin.permission:manage_msl_events')->name('admin.msl-events.edit');
    Route::put('/admin/public-msl-events/{mslEvent}', [MslEventController::class, 'update'])
        ->middleware('admin.permission:manage_msl_events')->name('admin.msl-events.update');
    Route::put('/admin/public-msl-events/{mslEvent}/status', [MslEventController::class, 'updateStatus'])
        ->middleware('admin.permission:manage_msl_events')->name('admin.msl-events.update-status');
    Route::delete('/admin/public-msl-events/{mslEvent}', [MslEventController::class, 'destroy'])
        ->middleware('admin.permission:manage_msl_events')->name('admin.msl-events.destroy');

    Route::get('/admin/website-settings', [SettingsController::class, 'index'])
        ->middleware('admin.permission:manage_settings')->name('admin.settings');
    Route::post('/admin/website-settings', [SettingsController::class, 'update'])
        ->middleware('admin.permission:manage_settings')->name('admin.settings.update');
    Route::get('/admin/footer-content', [FooterController::class, 'index'])
        ->middleware('admin.permission:manage_footer')->name('admin.footer');
    Route::post('/admin/footer-content', [FooterController::class, 'update'])
        ->middleware('admin.permission:manage_footer')->name('admin.footer.update');

    Route::get('/admin/share-links', [ShareLinkController::class, 'index'])
        ->middleware('admin.permission:manage_share_links')->name('admin.share-links.index');
    Route::post('/admin/share-links', [ShareLinkController::class, 'store'])
        ->middleware('admin.permission:manage_share_links')->name('admin.share-links.store');
    Route::put('/admin/share-links/{shortLink}', [ShareLinkController::class, 'update'])
        ->middleware('admin.permission:manage_share_links')->name('admin.share-links.update');
    Route::delete('/admin/share-links/{shortLink}', [ShareLinkController::class, 'destroy'])
        ->middleware('admin.permission:manage_share_links')->name('admin.share-links.destroy');

    Route::get('/admin/duplicate-usernames/check', [LegacyContentController::class, 'duplicateUsernames'])
        ->middleware('admin.permission:manage_accounts')->name('admin.duplicate-usernames.check');
    Route::get('/admin/faulty-username', [LegacyContentController::class, 'faultyUsernames'])
        ->middleware('admin.permission:manage_accounts')->name('admin.faulty-username.index');
    Route::post('/admin/faulty-username/send-email/{userId}', [LegacyContentController::class, 'faultyUsernameEmail'])
        ->middleware('admin.permission:manage_accounts')->name('admin.faulty-username.send-email');
    Route::post('/admin/faulty-username/send-selected', [LegacyContentController::class, 'faultyUsernameSelected'])
        ->middleware('admin.permission:manage_accounts')->name('admin.faulty-username.send-selected');
    Route::post('/admin/faulty-username/send-all', [LegacyContentController::class, 'faultyUsernameSelected'])
        ->middleware('admin.permission:manage_accounts')->name('admin.faulty-username.send-all');
    Route::get('/admin/faulty-username/stats', [LegacyContentController::class, 'faultyUsernameStats'])
        ->middleware('admin.permission:manage_accounts')->name('admin.faulty-username.stats');

    Route::get('/Change-Username/{user_id?}', [LegacyContentController::class, 'duplicateUsernameForm'])
        ->middleware('admin.permission:manage_accounts')->name('admin.duplicate-usernames.form');
    Route::post('/Change-Username/{user_id}', [LegacyContentController::class, 'updateUsername'])
        ->middleware('admin.permission:manage_accounts')->name('admin.duplicate-usernames.update');
    Route::get('/admin/user-regions', [LegacyContentController::class, 'userRegions'])
        ->middleware('admin.permission:manage_accounts')->name('admin.user-regions');

    Route::get('/admin/student-leaders', [StudentLeaderController::class, 'index'])
        ->middleware('admin.permission:manage_sl')->name('admin.sl-management');
    Route::post('/admin/users/{user}/promote-sl', [StudentLeaderController::class, 'promote'])
        ->middleware('admin.permission:manage_sl')->name('admin.users.promote-sl');
    Route::post('/admin/users/{user}/demote-sl', [StudentLeaderController::class, 'demote'])
        ->middleware('admin.permission:manage_sl')->name('admin.users.demote-sl');
    Route::get('/admin/regional-admin-accounts', [RegionalAdminManagementController::class, 'index'])
        ->middleware('admin.permission:manage_regional_admins')->name('admin.regional-admin-management');
    Route::post('/admin/users/{user}/promote-regional-admin', [RegionalAdminManagementController::class, 'promote'])
        ->middleware('admin.permission:manage_regional_admins')->name('admin.users.promote-regional-admin');
    Route::post('/admin/users/{user}/demote-regional-admin', [RegionalAdminManagementController::class, 'demote'])
        ->middleware('admin.permission:manage_regional_admins')->name('admin.users.demote-regional-admin');

    // School Management
    Route::get('/admin/school-management', [SchoolManagementController::class, 'index'])
        ->middleware('admin.permission:manage_schools')->name('admin.school-management');
    Route::post('/admin/school-management', [SchoolManagementController::class, 'store'])
        ->middleware('admin.permission:manage_schools')->name('admin.schools.store');
    Route::put('/admin/school-management/{id}', [SchoolManagementController::class, 'update'])
        ->middleware('admin.permission:manage_schools')->name('admin.schools.update');
    Route::post('/admin/school-management/{id}/toggle-status', [SchoolManagementController::class, 'toggleStatus'])
        ->middleware('admin.permission:manage_schools')->name('admin.schools.toggle-status');

    Route::get('/admin/violation-reports', [ViolationReportAdminController::class, 'index'])
        ->middleware('admin.permission:manage_violation_reports')->name('admin.violation-reports.index');
    Route::put('/admin/violation-reports/{report}', [ViolationReportAdminController::class, 'update'])
        ->middleware('admin.permission:manage_violation_reports')->name('admin.violation-reports.update');

    Route::get('/admin/analytics', [AnalyticsController::class, 'index'])
        ->middleware('admin.permission:access_admin_dashboard')->name('admin.analytics');

    Route::post('/admin/custom-user-list/logout', [AdminAuthController::class, 'logout'])
        ->middleware('admin')->name('admin.custom-user-list.logout');
    Route::get('/admin/custom-user-list', [LegacyContentController::class, 'customUserList'])
        ->middleware('admin.permission:manage_accounts')->name('admin.custom-user-list');
    Route::post('/admin/custom-user-list/email', [LegacyContentController::class, 'customUserListEmail'])
        ->middleware('admin.permission:manage_accounts');
    Route::post('/admin/custom-user-list/delete', [LegacyContentController::class, 'customUserListDelete'])
        ->middleware('admin.permission:manage_accounts');

    Route::resource('/admin/mcc-seasons', MCCSeasonController::class)->names([
        'index' => 'admin.mcc-seasons.index', 'create' => 'admin.mcc-seasons.create', 'store' => 'admin.mcc-seasons.store',
        'show' => 'admin.mcc-seasons.show', 'edit' => 'admin.mcc-seasons.edit', 'update' => 'admin.mcc-seasons.update',
        'destroy' => 'admin.mcc-seasons.destroy',
    ])->middleware('admin.permission:manage_mcc_seasons');
    Route::post('/admin/mcc-seasons/{id}/toggle-active', [MCCSeasonController::class, 'toggleActive'])
        ->middleware('admin.permission:manage_mcc_seasons')->name('admin.mcc-seasons.toggle-active');
    Route::post('/admin/mcc-seasons/upload-image', [MCCSeasonController::class, 'uploadImage'])
        ->middleware('admin.permission:manage_mcc_seasons')->name('admin.mcc-seasons.upload-image');
    Route::post('/admin/mcc-seasons/{id}/content', [MCCSeasonController::class, 'updateContent'])
        ->middleware('admin.permission:manage_mcc_seasons')->name('admin.mcc-seasons.update-content');
    Route::delete('/admin/mcc-seasons/{seasonId}/content/{contentId}', [MCCSeasonController::class, 'deleteContent'])
        ->middleware('admin.permission:manage_mcc_seasons')->name('admin.mcc-seasons.delete-content');

    // Legacy URLs redirect to the renamed admin pages.
    Route::redirect('/admin/management', '/admin/account-roles-permissions');
    Route::redirect('/admin/accounts', '/admin/administrator-accounts');
    Route::redirect('/admin/users/pending', '/admin/pending-account-approvals');
    Route::redirect('/admin/news', '/admin/legacy-news');
    Route::get('/admin/news/create', fn () => redirect()->route('admin.news.create'));
    Route::get('/admin/news/{news}/edit', fn ($news) => redirect()->route('admin.news.edit', $news))->whereNumber('news');
    Route::redirect('/admin/events', '/admin/scheduled-events');
    Route::get('/admin/events/create', fn () => redirect()->route('admin.events.create'));
    Route::get('/admin/events/{event}/edit', fn ($event) => redirect()->route('admin.events.edit', $event))->whereNumber('event');
    Route::redirect('/admin/msl-events', '/admin/public-msl-events');
    Route::get('/admin/msl-events/create', fn () => redirect()->route('admin.msl-events.create'));
    Route::get('/admin/msl-events/{mslEvent}/edit', fn ($mslEvent) => redirect()->route('admin.msl-events.edit', $mslEvent))->whereNumber('mslEvent');
    Route::redirect('/admin/settings', '/admin/website-settings');
    Route::redirect('/admin/footer', '/admin/footer-content');
    Route::redirect('/admin/sl-management', '/admin/student-leaders');
    Route::redirect('/admin/regional-admin-management', '/admin/regional-admin-accounts');

    Route::get('/Oppo-settings', [OppoSettingsController::class, 'index'])
        ->middleware('admin.permission:manage_oppo_settings')->name('admin.oppo-settings.index');
    Route::post('/Oppo-settings', [OppoSettingsController::class, 'store'])
        ->middleware('admin.permission:manage_oppo_settings')->name('admin.oppo-settings.store');
    Route::delete('/Oppo-settings/{id}', [OppoSettingsController::class, 'destroy'])
        ->middleware('admin.permission:manage_oppo_settings')->name('admin.oppo-settings.destroy');
    Route::post('/Oppo-settings/dates', [OppoSettingsController::class, 'storeDate'])
        ->middleware('admin.permission:manage_oppo_settings')->name('admin.oppo-settings.dates.store');
    Route::delete('/Oppo-settings/dates/{id}', [OppoSettingsController::class, 'destroyDate'])
        ->middleware('admin.permission:manage_oppo_settings')->name('admin.oppo-settings.dates.destroy');
});

Route::get('/api/oppo-roadshow/schools', [OppoSettingsController::class, 'getRoadshowSchools'])->name('oppo.roadshow.schools');
Route::get('/api/oppo-roadshow/data', [OppoSettingsController::class, 'getRoadshowData'])->name('oppo.roadshow.data');

require __DIR__.'/auth.php';

Route::get('/StudentLeader', function () {
    return Inertia::render('VerificationPages/StudentLeader');
})->name('student.leader');

Route::get('/RegionalAdmin', [\App\Http\Controllers\Admin\RegionalAdminController::class, 'index'])
    ->middleware('auth')
    ->name('regional.admin');

Route::post('/RegionalAdmin/background', [\App\Http\Controllers\Admin\RegionalAdminController::class, 'updateBackground'])
    ->middleware('auth')
    ->name('regional.admin.background');

Route::get('/CoreAdmin', function () {
    return Inertia::render('VerificationPages/CoreAdmin');
})->name('core.admin');

// TEST PAGE ROUTES
Route::get('/Testpage', function () {
    return Inertia::render('Testpage');
})->name('Testpage');

// FORGOT PASSWORD / USERNAME + ACCOUNT CREATION (staging paths + Evren aliases)
Route::get('/ForgotPassword', function () {
    return Inertia::render('Login/components/ForgotPassword');
})->name('reset.password');

Route::get('/ForgotUsername', function () {
    return Inertia::render('Login/components/ForgotUsername');
})->name('forgot.username');
Route::redirect('/forgot-username', '/ForgotUsername');

Route::get('/AccountCreation/SHS', function () {
    return Inertia::render('AccountCreation/SHSRegister');
})->name('shs.register');
Route::redirect('/register/shs', '/AccountCreation/SHS');

Route::get('/AccountCreation/College', function () {
    return Inertia::render('AccountCreation/CollegeRegister');
})->name('college.register');
Route::redirect('/register/college', '/AccountCreation/College');

// Public routes to fetch news data
Route::get('/api/news/articles', [NewsController::class, 'getArticles']);
Route::get('/api/news/highlights', [NewsController::class, 'getHighlights']);
Route::get('/api/news/related', [NewsController::class, 'getRelatedArticles']);

// Public school search routes for registration autocomplete
Route::get('/api/schools/college', [\App\Http\Controllers\Api\SchoolSearchController::class, 'searchCollege'])->name('schools.search.college');
Route::get('/api/schools/shs', [\App\Http\Controllers\Api\SchoolSearchController::class, 'searchSHS'])->name('schools.search.shs');

