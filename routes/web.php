<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminManagementController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\CampusTournamentController;
use App\Http\Controllers\TournamentRegistrationController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Student\StudentPortalController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
});

Route::get('/About', function () {
    return Inertia::render('About');
})->name('about');
Route::redirect('/about', '/About');

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
Route::get('/campus-tournament', function () {
    return redirect()->route('campus.tournament.sl');
})->name('campus.tournament');

Route::get('/Tournament/SL', function () {
    return Inertia::render('Programs/CampusTournaments/SlView');
})->name('campus.tournament.sl');

Route::get('/Tournament/RegionalAdmin', function () {
    return Inertia::render('Programs/CampusTournaments/SlView');
})->name('campus.tournament.regionaladmin');

Route::get('/campus-tournament/public', function () {
    return Inertia::render('Programs/CampusTournaments/SlView');
})->name('campus.tournament.public');

Route::get('/Tournament/Organizer', function () {
    return Inertia::render('Programs/CampusTournaments/OrganizerView');
})->name('campus.tournament.organizer');

Route::get('/Tournament/CampusTournament', function () {
    return Inertia::render('Programs/CampusTournaments/CaptainHub');
})->name('campus.captainregistration');

Route::get('/Tournament/CampusTournamentReg', function () {
    return Inertia::render('Programs/CampusTournaments/CaptainRegister');
})->name('campus.teamregistration');

Route::get('/Tournament/CampusTournamentTeam', function () {
    return Inertia::render('Programs/CampusTournaments/CaptainTeam');
})->name('campus.team');

Route::get('/Tournament/SoloPlayer', function () {
    return Inertia::render('Programs/CampusTournaments/SoloMatchmaking');
})->name('campus.tournament.solo.player');

Route::get('/Tournament/MemberInvite', function () {
    return Inertia::render('Programs/CampusTournaments/MemberInvite');
})->name('campus.member.invite');

Route::get('/Tournament/MemberJoin', function () {
    return Inertia::render('Programs/CampusTournaments/MemberJoinCode');
})->name('campus.member.join');

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
    return Inertia::render('Home');
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

Route::redirect('/Login', '/login')->name('Login');

/** Login Page for Internal temporary to view */

Route::get('/admin', function () {
    return Inertia::render('Auth/AdminLogin');
})->name('admin.login');

/** */

/** Admin CMS pages from Evren branch */
Route::get('/admin/account-creation', function () {
    return Inertia::render('Admin/AccountCreation');
})->name('admin.account-creation');

Route::get('/admin/home-page', function () {
    return Inertia::render('Admin/HomePage');
})->name('admin.home-page');

Route::get('/admin/faq', function () {
    return Inertia::render('Admin/Faq');
})->name('admin.faq');

Route::get('/admin/news-updates', function () {
    return Inertia::render('Admin/NewsUpdates');
})->name('admin.news-updates');

Route::get('/admin/account-management', function () {
    return Inertia::render('Admin/AccountManagement');
})->name('admin.account-management');

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
    Route::post('/campus-tournaments/{tournament}/join', [TournamentRegistrationController::class, 'join'])
        ->name('tournament.join');
    Route::post('/tournament-teams/{team}/invitations', [TournamentRegistrationController::class, 'storeInvitation'])
        ->name('tournament.invitations.store');
    Route::post('/tournament-teams/{team}/solo-participants', [TournamentRegistrationController::class, 'joinSoloTeam'])
        ->name('tournament.solo-teams.join');
    Route::post('/tournament-teams/{team}/join-codes', [TournamentRegistrationController::class, 'storeJoinCode'])
        ->name('tournament.join-codes.store');
    Route::post('/tournament-invitations/{invitation}/respond', [TournamentRegistrationController::class, 'respond'])
        ->name('tournament.invitations.respond');
    Route::delete('/tournament-invitations/{invitation}', [TournamentRegistrationController::class, 'destroyInvitation'])
        ->name('tournament.invitations.destroy');
    Route::delete('/tournament-join-codes/{joinCode}', [TournamentRegistrationController::class, 'destroyJoinCode'])
        ->name('tournament.join-codes.destroy');
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
Route::middleware(['auth'])->group(function () {
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])
        ->middleware('permission:access_admin_dashboard')
        ->name('admin.dashboard');
    Route::post('/admin/users/{id}/approve', [AdminDashboardController::class, 'approve'])
        ->middleware('permission:approve_students')
        ->name('admin.users.approve');

    Route::post('/admin/users/{id}/reject', [AdminDashboardController::class, 'reject'])
        ->middleware('permission:reject_students')
        ->name('admin.users.reject');

    Route::post('/admin/users/{id}/renewal', [AdminDashboardController::class, 'markRenewal'])
        ->name('admin.users.renewal');

    Route::post('/admin/users/{id}/block', [AdminDashboardController::class, 'block'])
        ->name('admin.users.block');

    Route::post('/admin/users/{id}/promote', [AdminDashboardController::class, 'promote'])
        ->name('admin.users.promote');

    // Admin Management Page
    Route::get('/admin/management', [AdminManagementController::class, 'index'])
        ->middleware('permission:access_admin_management')
        ->name('admin.management');

    Route::post('/admin/users/{user}/permissions', [AdminManagementController::class, 'updatePermissions'])
        ->middleware('permission:access_admin_management')
        ->name('admin.users.permissions.update');
});

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
